# ESP32 Smart Cash Counter Setup Guide
## Special Configuration for notenetra@gmail.com

I have pre-configured the code for your specific account `notenetra@gmail.com`.

## 1. Upload the New Code
1. Open `esp code/esp.ino` in Arduino IDE.
2. Connect your ESP32.
3. Click **Upload**.

This new code:
- Automatically logs into Firebase using `notenetra@gmail.com`.
- Automatically finds your unique User ID once logged in.
- Sends all transactions to your personal dashboard.

## 2. Viewing Data
1. Go to your website: http://localhost:5173/dashboard (or your deployed URL).
2. Login with:
   - **Email:** `notenetra@gmail.com`
   - **Password:** `Kaku@009` (or whatever you set on the website registration)
   
3. Navigate to **Transactions**.
4. Scan a note with the ESP32. You will see it appear instantly!

## Troubleshooting
- If the ESP32 Serial Monitor says "Firebase Auth Failed": make sure you have actually created an account on the website/Firebase for `notenetra@gmail.com` with the password `Kaku@009`. If you haven't registered this user yet, the ESP32 cannot log in. 
  - **Action:** Go to the website Register page and create the account if it doesn't exist.
