#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>
#include <time.h>

// ------------------ WiFi ------------------
const char *ssid = "Kaku";
const char *password = "12345678";

// ------------------ Firebase ------------------
#define API_KEY "AIzaSyAGuVR7zSOU3HHGOSX_Y8ccaIY4mnKb0Wg"
#define DATABASE_URL "https://notenetra009-default-rtdb.firebaseio.com"
#define PROJECT_ID "notenetra009"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Default ID (Only used if login fails to get UID)
String userId = "fxQNVL1gFaeGdGfWUoIi2jNoVJd2"; 

// ------------------ Pins ------------------
#define S0 18
#define S1 19
#define S2 21
#define S3 22
#define CREDIT_OUT 25
#define DEBIT_OUT 33

// ------------------ Variables ------------------
unsigned long lastDetectionTime = 0;
unsigned long detectionCooldown = 2000;

// ------------------ Helper Functions ------------------
inline unsigned long fastRead(int pin, bool s2, bool s3) {
  digitalWrite(S2, s2);
  digitalWrite(S3, s3);
  delayMicroseconds(100);
  return pulseIn(pin, LOW, 20000); // 20ms timeout
}

String getTimestamp() {
  time_t now;
  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)){
    return "--";
  }
  char buffer[30];
  strftime(buffer, sizeof(buffer), "%d-%m-%Y %H:%M:%S", &timeinfo);
  return String(buffer);
}

void sendToFirebase(String type, float amount, String note) {
  if (Firebase.ready()) {
    String currentUserId = auth.token.uid.c_str();  
    if (currentUserId.length() < 5) currentUserId = userId; // Fallback
    
    String transactionPath = "transactions/esp/" + currentUserId;
    FirebaseJson json;
    
    json.set("time", getTimestamp());
    json.set("type", type);
    json.set("amount", amount);
    json.set("mode", "cash");
    json.set("userID", currentUserId);
    json.set("note", note);

    if (Firebase.RTDB.pushJSON(&fbdo, transactionPath.c_str(), &json)) {
      Serial.println("Sent: " + type + " for " + currentUserId);
    } else {
      Serial.println("Error: " + fbdo.errorReason());
    }
  } else {
    Serial.println("Firebase not ready");
  }
}

// ------------------ Setup ------------------
void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\nStarting...");

  // Pins
  pinMode(S0, OUTPUT);
  pinMode(S1, OUTPUT);
  pinMode(S2, OUTPUT);
  pinMode(S3, OUTPUT);
  pinMode(CREDIT_OUT, INPUT);
  pinMode(DEBIT_OUT, INPUT);
  
  // TCS3200 Scaling 20%
  digitalWrite(S0, HIGH);
  digitalWrite(S1, LOW); 

  // WiFi
  WiFi.begin(ssid, password);
  Serial.print("WiFi Connecting");
  int retry = 0;
  while (WiFi.status() != WL_CONNECTED && retry < 20) {
    delay(500);
    Serial.print(".");
    retry++;
  }
  if(WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi Connected! IP: " + WiFi.localIP().toString());
  } else {
    Serial.println("\nWiFi Failed! Check Password.");
  }

  // Time
  configTime(19800, 0, "pool.ntp.org", "time.nist.gov"); 

  // Firebase
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  
  // Auth
  auth.user.email = "notenetra@gmail.com"; 
  auth.user.password = "Kaku@009"; 
  
  // Token Callback (Optional, but good for debug)
  config.token_status_callback = tokenStatusCallback;

  // IMPORTANT: Fix for "compiling stuck" - sometimes large buffers cause issues
  fbdo.setResponseSize(2048);

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

// ------------------ Loop ------------------
void loop() {
  if (!Firebase.ready()) return;

  if (millis() - lastDetectionTime < detectionCooldown) return;
  
  unsigned long rCredit = fastRead(CREDIT_OUT, LOW, LOW);
  unsigned long rDebit = fastRead(DEBIT_OUT, LOW, LOW);

  // Serial.printf("C:%lu D:%lu\n", rCredit, rDebit);

  if (rCredit > 0 && rCredit < 50) {
    Serial.println("CREDIT Detected");
    sendToFirebase("credit", 100.0, "Auto Credit");
    lastDetectionTime = millis();
  }
  else if (rDebit > 0 && rDebit < 50) {
    Serial.println("DEBIT Detected");
    sendToFirebase("debit", 100.0, "Auto Debit");
    lastDetectionTime = millis();
  }
}