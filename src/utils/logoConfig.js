// Logo Configuration - Change these values to customize your logo
// लोगो कॉन्फ़िगरेशन - अपना लोगो कस्टमाइज़ करने के लिए इन वैल्यूज़ को बदलें
export const LOGO_CONFIG = {
  // Logo image path - put your logo file in public/assets/images/ folder
  // लोगो इमेज पाथ - अपनी लोगो फाइल public/assets/images/ फोल्डर में रखें
  imagePath: '/assets/images/notenetra-logo.png', // Change this to your logo file name / अपने लोगो फाइल का नाम बदलें
  
  // Fallback logo (used if your logo fails to load)
  // फॉलबैक लोगो (अगर आपका लोगो लोड नहीं होता तो इस्तेमाल होगा)
  fallbackPath: '/assets/images/note.jpeg',
  
  // Company information
  // कंपनी की जानकारी
  companyName: 'NoteNetra', // Change this to your company name / अपनी कंपनी का नाम बदलें
  tagline: 'Smart Finance Hub', // Change this to your tagline / अपना टैगलाइन बदलें
  altText: 'NoteNetra Logo', // Alt text for accessibility / एक्सेसिबिलिटी के लिए Alt टेक्स्ट
  
  // Logo styling options
  // लोगो स्टाइलिंग विकल्प
  size: {
    width: 'w-8', // Logo width / लोगो की चौड़ाई
    height: 'h-8' // Logo height / लोगो की ऊंचाई
  },
  
  // Logo variants - different designs you can choose from
  // लोगो वेरिएंट्स - अलग-अलग डिज़ाइन जो आप चुन सकते हैं
  variants: {
    default: {
      showText: true, // Show company name and tagline / कंपनी का नाम और टैगलाइन दिखाएं
      design: 'custom' // Use custom logo image / कस्टम लोगो इमेज का उपयोग करें
    },
    iconOnly: {
      showText: false, // Only show logo icon / केवल लोगो आइकन दिखाएं
      design: 'custom'
    },
    modern: {
      showText: true,
      design: 'modern' // Modern gradient design / आधुनिक ग्रेडिएंट डिज़ाइन
    },
    tech: {
      showText: true,
      design: 'tech' // Technology theme / टेक्नोलॉजी थीम
    },
    finance: {
      showText: true,
      design: 'finance' // Finance theme / फाइनेंस थीम
    },
    minimal: {
      showText: true,
      design: 'minimal' // Minimal design / मिनिमल डिज़ाइन
    }
  }
};

// Helper function to get logo configuration
// लोगो कॉन्फ़िगरेशन प्राप्त करने के लिए हेल्पर फंक्शन
export const getLogoConfig = (variant = 'default') => {
  return {
    ...LOGO_CONFIG,
    ...LOGO_CONFIG.variants[variant]
  };
};

export default LOGO_CONFIG;
