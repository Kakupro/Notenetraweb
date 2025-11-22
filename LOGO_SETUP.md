# Logo Setup Guide / लोगो सेटअप गाइड

## अपना लोगो सेट करने के लिए निम्नलिखित कदम उठाएं:
## Follow these steps to set up your logo:

### 1. अपना लोगो फाइल तैयार करें / Prepare your logo file
- अपना लोगो PNG, JPG, या JPEG फॉर्मेट में तैयार करें
- Prepare your logo in PNG, JPG, or JPEG format
- अनुशंसित साइज़: 32x32px से 128x128px (वर्ग आकार)
- Recommended size: 32x32px to 128x128px (square format)
- फाइल को `public/assets/images/` फोल्डर में रखें
- Place the file in the `public/assets/images/` folder

### 2. लोगो कॉन्फ़िगरेशन अपडेट करें / Update logo configuration
फाइल `src/utils/logoConfig.js` खोलें और निम्नलिखित जानकारी अपडेट करें:
Open the file `src/utils/logoConfig.js` and update the following information:

```javascript
export const LOGO_CONFIG = {
  // अपने लोगो फाइल का नाम यहाँ डालें
  // Put your logo file name here
  imagePath: '/assets/images/your-logo.png', // अपने लोगो फाइल का नाम बदलें / Change to your logo file name
  
  // कंपनी की जानकारी / Company information
  companyName: 'आपकी कंपनी का नाम', // अपनी कंपनी का नाम बदलें / Change to your company name
  tagline: 'आपकी कंपनी का टैगलाइन', // अपना टैगलाइन बदलें / Change to your tagline
  altText: 'आपकी कंपनी का लोगो', // Alt टेक्स्ट बदलें / Change alt text
  
  // बाकी सेटिंग्स वैसे ही रख सकते हैं
  // You can keep the rest of the settings as they are
};
```

### 3. वेबसाइट रीफ्रेश करें / Refresh the website
- अपने बदलावों को देखने के लिए वेबसाइट रीफ्रेश करें
- Refresh the website to see your changes
- लोगो पूरी वेबसाइट में अपडेट हो जाएगा
- The logo will be updated throughout the website

### 4. अतिरिक्त कस्टमाइज़ेशन (वैकल्पिक) / Additional customization (optional)
अगर आप लोगो का साइज़ बदलना चाहते हैं:
If you want to change the logo size:

```javascript
size: {
  width: 'w-10', // चौड़ाई बदलें / Change width (w-8, w-10, w-12, etc.)
  height: 'h-10' // ऊंचाई बदलें / Change height (h-8, h-10, h-12, etc.)
}
```

### 5. लोगो वेरिएंट्स / Logo variants
आप अलग-अलग डिज़ाइन भी चुन सकते हैं:
You can also choose different designs:
- `modern` - आधुनिक ग्रेडिएंट डिज़ाइन / Modern gradient design
- `tech` - टेक्नोलॉजी थीम / Technology theme
- `finance` - फाइनेंस थीम / Finance theme
- `minimal` - मिनिमल डिज़ाइन / Minimal design
- `custom` - आपका कस्टम लोगो (डिफ़ॉल्ट) / Your custom logo (default)

### समस्या निवारण / Troubleshooting
- अगर लोगो नहीं दिख रहा है, तो फाइल पाथ चेक करें
- If the logo is not showing, check the file path
- फाइल नाम सही है या नहीं, यह सुनिश्चित करें
- Make sure the file name is correct
- फाइल `public/assets/images/` फोल्डर में है या नहीं, चेक करें
- Check if the file is in the `public/assets/images/` folder

### उदाहरण / Example
अगर आपकी फाइल का नाम `mycompany-logo.png` है:
If your file name is `mycompany-logo.png`:

```javascript
imagePath: '/assets/images/mycompany-logo.png',
companyName: 'My Company',
tagline: 'Best Solutions',
altText: 'My Company Logo'
```
