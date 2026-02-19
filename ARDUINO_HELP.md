# Compilation Stuck? Read This!

If your Arduino IDE gets stuck on "Compiling sketch..." or "Archive", it usually means:
1.  **Missing Library**: You need to install the correct Firebase library.
2.  **Wrong Library**: You might have an old one.

## 1. Install the Correct Library
1.  Open Arduino IDE.
2.  Go to **Tools** > **Manage Libraries...** (Ctrl+Shift+I).
3.  Search for **Firebase Arduino Client Code**.
4.  Look for **"Firebase Arduino Client Library for ESP8266 and ESP32" by Mobizt**.
    *   **Install the latest version (v4.x.x)**.
    *   *Do NOT install "FirebaseESP32" (that is old).*

## 2. Check Board Settings
1.  Go to **Tools** > **Board**.
2.  Select **ESP32 Dev Module** (or your specific board).
3.  Ensure **Upload Speed** is 115200 or 921600.

## 3. If Still Stuck...
-   **Restart Arduino IDE**.
-   **Disconnect ESP32** while compiling (sometimes USB interferes).
-   **Disable Antivirus** temporarily (it scans the compiled files).

I have simplified the `esp.ino` code to use standard headers which should compile faster. Try uploading again!
