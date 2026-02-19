#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <time.h>

// ------------------ WiFi ------------------
const char *ssid = "Kaku";
const char *password = "12345678";

// ------------------ Firebase ------------------
#define API_KEY "AIzaSyDVjvznBKu1jJYS3STOd-le7Bmn8ToRe1s"
#define DATABASE_URL "https://notenetra-default-rtdb.firebaseio.com"
#define PROJECT_ID "notenetra"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// REPLACE THIS WITH YOUR USER ID FROM THE WEBSITE DASHBOARD
String userId = "fxQNVL1gFaeGdGfWUoIi2jNoVJd2"; 

// ------------------ Pins ------------------
// Color Sensor Control Pins
#define S0 18
#define S1 19
#define S2 21
#define S3 22

// Output Pins (Frequency)
#define CREDIT_OUT 25
#define DEBIT_OUT 33

// ------------------ Variables ------------------
unsigned long lastDetectionTime = 0;
unsigned long detectionCooldown = 2000;

// ------------------ Helper Functions ------------------
// Fast Pulse Read (from your code)
inline unsigned long fastRead(int pin, bool s2, bool s3) {
  digitalWrite(S2, s2);
  digitalWrite(S3, s3);
  delayMicroseconds(100);
  // pulseIn returns 0 on timeout. Timeout set to 20000 microseconds (20ms)
  return pulseIn(pin, LOW, 20000);
}

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
  if(!getLocalTime(&timeinfo)){
    return "00-00-0000 00:00:00";
  }
  char buffer[30];
  strftime(buffer, sizeof(buffer), "%d-%m-%Y %H:%M:%S", &timeinfo);
  return String(buffer);
}

void sendToFirebase(String type, float amount, String note) {
  if (Firebase.ready()) {
    // Get the authenticated user's UID dynamically
    String currentUserId = auth.token.uid.c_str();  
    if (currentUserId.length() == 0) {
      currentUserId = userId; // Fallback to hardcoded ID if auth token is empty
    }
    
    String transactionPath = "transactions/esp/" + currentUserId;
    FirebaseJson json;
    
    json.set("time", getTimestamp());
    json.set("type", type); // "credit" or "debit"
    json.set("amount", amount);
    json.set("mode", "cash");
    json.set("userID", currentUserId);
    json.set("note", note);

    if (Firebase.RTDB.pushJSON(&fbdo, transactionPath.c_str(), &json)) {
      Serial.println("Transaction sent to Firebase successfully: " + type);
    } else {
      Serial.println("Error sending to Firebase: " + fbdo.errorReason());
    }
  } else {
    Serial.println("Firebase not ready!");
  }
}

void tokenStatusCallback(TokenInfo info) {
  Serial.printf("Token info: type = %d, status = %s\n", info.type, getStatusString(info.status));
}

// ------------------ Setup ------------------
void setup() {
  Serial.begin(115200);
  Serial.println("\nStarting Smart Money Counter (Firebase Edition)...");

  // Initialize Pins
  pinMode(S0, OUTPUT);
  pinMode(S1, OUTPUT);
  pinMode(S2, OUTPUT);
  pinMode(S3, OUTPUT);
  pinMode(CREDIT_OUT, INPUT);
  pinMode(DEBIT_OUT, INPUT);

  // Set Scaling to 20% (Common for TCS3200/34725 modules using freq out)
  // S0=H, S1=L -> 20%
  // S0=H, S1=H -> 100%
  digitalWrite(S0, HIGH);
  digitalWrite(S1, LOW); 

  // Connect WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected! IP: " + WiFi.localIP().toString());

  // Configure Time (Required for timestamp)
  configTime(19800, 0, "pool.ntp.org", "time.nist.gov"); // GMT+5:30 = 19800 sec

  // Initialize Firebase
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  config.token_status_callback = tokenStatusCallback;
  
  // Authentication credentials
  auth.user.email = "notenetra@gmail.com"; 
  auth.user.password = "Kaku@009"; 
  
  // Disable test mode to force email/password authentication
  config.signer.test_mode = false; 
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

// ------------------ Loop ------------------
void loop() {
  if (!Firebase.ready()) return;

  unsigned long currentMillis = millis();
  
  // Simple debounce / cooldown
  if (currentMillis - lastDetectionTime < detectionCooldown) {
    return;
  }

  // Read Sensors
  // Note: PulseIn blocks for up to 20ms. Two reads = ~40ms max delay.
  // Using LOW, LOW filters (Clear/No Filter usually, depend on module wiring)
  // Your code used LOW, LOW on S2, S3 which usually selects 'Red' filter on TCS3200?
  // TCS3200: S2=L, S3=L -> Red; S2=L, S3=H -> Blue; S2=H, S3=L -> Clear; S2=H, S3=H -> Green
  // Your code had `fastRead(..., LOW, LOW)` so we keep that logic.
  
  unsigned long rCredit = fastRead(CREDIT_OUT, LOW, LOW);
  unsigned long rDebit = fastRead(DEBIT_OUT, LOW, LOW);

  // Debug Print
  // Serial.printf("C:%lu D:%lu\n", rCredit, rDebit);

  // Threshold Logic (Based on your provided code: >0 && <50)
  // Using 500ms delay in your code, we use non-blocking cooldown here
  
  bool detected = false;

  if (rCredit > 0 && rCredit < 50) {
    Serial.println("Credit Detected! Sending 100 Rs...");
    sendToFirebase("credit", 100.0, "Auto-detected Credit");
    detected = true;
  }
  else if (rDebit > 0 && rDebit < 50) {
    Serial.println("Debit Detected! Sending 100 Rs...");
    sendToFirebase("debit", 100.0, "Auto-detected Debit");
    detected = true;
  }

  if (detected) {
    lastDetectionTime = currentMillis;
    // Optional Flash LED or Beep here
  }
}