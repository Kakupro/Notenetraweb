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
// State variables to prevent multiple counts for the same note
bool creditObjectPresent = false;
bool debitObjectPresent = false;
// Thresholds
const int DETECTION_mV = 50;  // Signal must be LOWER than this to be a note (High Frequency = Low Time)
const int RELEASE_mV = 100;   // Signal must be HIGHER than this to reset (Low Frequency = No Note)

void loop() {
  if (!Firebase.ready()) return;

  unsigned long rCredit = fastRead(CREDIT_OUT, LOW, LOW); // Read S0 sensor (Credit)
  unsigned long rDebit = fastRead(DEBIT_OUT, LOW, LOW);   // Read S1 sensor (Debit)

  // --- CREDIT LOGIC ---
  // 1. Detect Note (Value is LOW) AND we haven't counted it yet (Object NOT present)
  if (rCredit > 0 && rCredit < DETECTION_mV && !creditObjectPresent) {
      Serial.println("CREDIT Detected - Sending...");
      sendToFirebase("credit", 100.0, "Smart Cash Counter");
      creditObjectPresent = true; // Lock: We have counted this note
      delay(500); // Small debounce
  }
  // 2. Reset Logic (Value is HIGH - Note Removed)
  else if (rCredit > RELEASE_mV) {
      creditObjectPresent = false; // Unlock: Ready for next note
  }

  // --- DEBIT LOGIC ---
  if (rDebit > 0 && rDebit < DETECTION_mV && !debitObjectPresent) {
      Serial.println("DEBIT Detected - Sending...");
      sendToFirebase("debit", 100.0, "Smart Cash Counter");
      debitObjectPresent = true;
      delay(500);
  }
  else if (rDebit > RELEASE_mV) {
      debitObjectPresent = false;
  }
}