#include <Wire.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <Adafruit_TCS34725.h>
#include <time.h>

// ------------------ WiFi ------------------
const char *ssid = "as";
const char *password = "12345678";

// ------------------ Firebase ------------------
#define API_KEY "AIzaSyDVjvznBKu1jJYS3STOd-le7Bmn8ToRe1s"
#define DATABASE_URL "https://notenetra-default-rtdb.firebaseio.com"
#define PROJECT_ID "notenetra"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

String userId = "fxQNVL1gFaeGdGfWUoIi2jNoVJd2"; 

// ------------------ TCS34725 Sensors ------------------
// Debit sensor (SDA=13, SCL=14)
TwoWire I2C_debit = TwoWire(0);
Adafruit_TCS34725 debitSensor = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_50MS, TCS34725_GAIN_4X);

// Credit sensor (SDA=21, SCL=23)
TwoWire I2C_credit = TwoWire(1);
Adafruit_TCS34725 creditSensor = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_50MS, TCS34725_GAIN_4X);

// ------------------ Timezone ------------------
const char *ntpServer1 = "time.nist.gov";
const char *ntpServer2 = "in.pool.ntp.org";
const char *ntpServer3 = "pool.ntp.org";
const long gmtOffset_sec = 19800;
const int daylightOffset_sec = 0;

// ------------------ Variables ------------------
int count_100 = 0, count_200 = 0, count_500 = 0;
float total = 5000.0;
String lastNote = "None";

unsigned long lastDetectionTime = 0;
unsigned long detectionCooldown = 3000;

bool debitNotePresent = false;
bool creditNotePresent = false;

// ------------------ Helper Functions ------------------
const char *getStatusString(firebase_auth_token_status status) {
  switch (status) {
    case token_status_uninitialized: return "uninitialized";
    case token_status_on_signing: return "on signing";
    case token_status_on_request: return "on request";
    case token_status_on_refresh: return "on refresh";
    case token_status_ready: return "ready";
    case token_status_error: return "error";
    default: return "unknown";
  }
}

String getTimestamp() {
  time_t now;
  struct tm timeinfo;
  time(&now);
  localtime_r(&now, &timeinfo);
  char buffer[30];
  strftime(buffer, sizeof(buffer), "%d-%m-%Y %H:%M:%S", &timeinfo);
  return String(buffer);
}

void sendToFirebase(String type, float amount, String note) {
  if (Firebase.ready()) {
    // Use the path structure: transactions/esp/{userId}
    String transactionPath = "transactions/esp/" + userId;
    FirebaseJson json;
    
    // Create the data structure for the transaction
    json.set("time", getTimestamp());
    json.set("type", type);
    json.set("amount", amount);
    json.set("mode", "cash");
    json.set("userID", userId);

    // Use pushJSON to add a new transaction under the specified path
    if (Firebase.RTDB.pushJSON(&fbdo, transactionPath.c_str(), &json)) {
      Serial.println("Transaction sent to Firebase successfully");
      Serial.println("Path: " + transactionPath + "/" + fbdo.pushName()); // Show the full path including the generated key
      Serial.print("Data: ");
      Serial.println(json.raw());
    } else {
      Serial.println("Error sending to Firebase: " + fbdo.errorReason());
      Serial.println("Path attempted: " + transactionPath);
      Serial.print("Error details: ");
      Serial.println(fbdo.payload());
    }
  } else {
    Serial.println("Firebase not ready!");
  }
}

// Updated color detection ranges based on your actual readings
bool isNote100(uint16_t r, uint16_t g, uint16_t b) {
  // Based on your readings, 100 Rs note appears to have higher green values
  return (r >= 30 && r <= 60) && (g >= 50 && g <= 90) && (b >= 40 && b <= 80);
}

bool isNote200(uint16_t r, uint16_t g, uint16_t b) {
  // 200 Rs note appears to have balanced RGB values
  return (r >= 20 && r <= 50) && (g >= 30 && g <= 70) && (b >= 30 && b <= 70);
}

bool isNote500(uint16_t r, uint16_t g, uint16_t b) {
  // 500 Rs note appears to have higher red values
  return (r >= 40 && r <= 80) && (g >= 30 && g <= 60) && (b >= 30 && b <= 60);
}

void tokenStatusCallback(TokenInfo info) {
  Serial.printf("Token info: type = %d, status = %s\n", info.type, getStatusString(info.status));
}

// ------------------ Setup ------------------
void setup() {
  Serial.begin(115200);
  Serial.println("\nStarting Smart Currency Counter...");

  // Initialize I2C for debit and credit sensors
  I2C_debit.begin(13, 14);
  I2C_credit.begin(21, 22);

  // Initialize TCS34725 sensors
  if (!debitSensor.begin(TCS34725_ADDRESS, &I2C_debit)) {
    Serial.println("Failed to initialize debit TCS34725!");
  } else {
    Serial.println("Debit sensor initialized successfully");
  }
  if (!creditSensor.begin(TCS34725_ADDRESS, &I2C_credit)) {
    Serial.println("Failed to initialize credit TCS34725!");
  } else {
    Serial.println("Credit sensor initialized successfully");
  }

  // Connect WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected! IP: " + WiFi.localIP().toString());

  // Configure time
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer1, ntpServer2, ntpServer3);

  // Initialize Firebase
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  config.token_status_callback = tokenStatusCallback;
  config.signer.test_mode = true; // anonymous login
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  Serial.println("Firebase initialized");

  // Wait for Firebase to be ready (which implies authenticated if test_mode is true)
  unsigned long startMillis = millis();
  while (!Firebase.ready()) {
    Serial.print(".");
    delay(500);
    if (millis() - startMillis > 10000) { // 10 second timeout
      Serial.println("\nFirebase initialization timed out!");
      break;
    }
  }
  if (Firebase.ready()) {
    Serial.println("\nFirebase is ready and authenticated (anonymous mode).");
  } else {
    Serial.println("\nFirebase is NOT ready after timeout. Please check your WiFi connection and Firebase configuration.");
  }
  
  // Ensure the user's transaction path exists as an object in Firebase
  // This prevents 'Bad request' if the path is currently a primitive value (e.g., empty string)
  String userTransactionsPath = "transactions/esp/" + userId;
  if (!Firebase.RTDB.getJSON(&fbdo, userTransactionsPath.c_str())) {
    // If getJSON fails (e.g., path doesn't exist or is a primitive), set it to an empty JSON object
    FirebaseJson emptyJson;
    if (Firebase.RTDB.setJSON(&fbdo, userTransactionsPath.c_str(), &emptyJson)) {
      Serial.println("Firebase user transactions path initialized as object: " + userTransactionsPath);
    } else {
      Serial.println("Failed to initialize Firebase user transactions path: " + fbdo.errorReason());
    }
  }
}

// ------------------ Loop ------------------
void loop() {
  if (!Firebase.ready()) {
    Serial.println("Waiting for Firebase to be ready...");
    delay(1000);
    return;
  }

  unsigned long currentMillis = millis();
  if (currentMillis - lastDetectionTime < detectionCooldown) return;

  // Read debit sensor
  uint16_t r1, g1, b1, c1;
  debitSensor.getRawData(&r1, &g1, &b1, &c1);

  // Read credit sensor
  uint16_t r2, g2, b2, c2;
  creditSensor.getRawData(&r2, &g2, &b2, &c2);

  Serial.printf("\nDebit: R=%d, G=%d, B=%d | Credit: R=%d, G=%d, B=%d\n", r1, g1, b1, r2, g2, b2);

  // Debug color detection
  Serial.printf("Debit - 100: %s, 200: %s, 500: %s\n", 
    isNote100(r1,g1,b1) ? "YES" : "NO",
    isNote200(r1,g1,b1) ? "YES" : "NO", 
    isNote500(r1,g1,b1) ? "YES" : "NO");
  Serial.printf("Credit - 100: %s, 200: %s, 500: %s\n", 
    isNote100(r2,g2,b2) ? "YES" : "NO",
    isNote200(r2,g2,b2) ? "YES" : "NO", 
    isNote500(r2,g2,b2) ? "YES" : "NO");

  // Debit detection
  if (!debitNotePresent) {
    if (isNote100(r1, g1, b1) && total >= 100) {
      count_100++; total -= 100; lastNote="100 Rs Debited"; 
      sendToFirebase("debit",100,"100 Rs Debited"); 
      debitNotePresent=true;
      Serial.println("100 Rs Debited!");
    } else if (isNote200(r1, g1, b1) && total >= 200) {
      count_200++; total -= 200; lastNote="200 Rs Debited"; 
      sendToFirebase("debit",200,"200 Rs Debited"); 
      debitNotePresent=true;
      Serial.println("200 Rs Debited!");
    } else if (isNote500(r1, g1, b1) && total >= 500) {
      count_500++; total -= 500; lastNote="500 Rs Debited"; 
      sendToFirebase("debit",500,"500 Rs Debited"); 
      debitNotePresent=true;
      Serial.println("500 Rs Debited!");
    }
  }

  // Credit detection
  if (!creditNotePresent) {
    if (isNote100(r2, g2, b2)) { 
      total += 100; lastNote="100 Rs Credited"; 
      sendToFirebase("credit",100,"100 Rs Credited"); 
      creditNotePresent=true;
      Serial.println("100 Rs Credited!");
    }
    else if (isNote200(r2, g2, b2)) { 
      total += 200; lastNote="200 Rs Credited"; 
      sendToFirebase("credit",200,"200 Rs Credited"); 
      creditNotePresent=true;
      Serial.println("200 Rs Credited!");
    }
    else if (isNote500(r2, g2, b2)) { 
      total += 500; lastNote="500 Rs Credited"; 
      sendToFirebase("credit",500,"500 Rs Credited"); 
      creditNotePresent=true;
      Serial.println("500 Rs Credited!");
    }
  }

  // Reset note presence
  if (!(isNote100(r1,g1,b1)||isNote200(r1,g1,b1)||isNote500(r1,g1,b1))) debitNotePresent=false;
  if (!(isNote100(r2,g2,b2)||isNote200(r2,g2,b2)||isNote500(r2,g2,b2))) creditNotePresent=false;

  lastDetectionTime = currentMillis;

  Serial.printf("Balance: Rs %.2f | 100s: %d 200s: %d 500s: %d\n", total, count_100, count_200, count_500);
  delay(500);
}