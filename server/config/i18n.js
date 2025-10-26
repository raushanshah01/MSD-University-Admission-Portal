
// Multi-language translations

const translations = {
  en: {
    // Common
    common: {
      welcome: 'Welcome',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      search: 'Search',
      filter: 'Filter',
      loading: 'Loading...',
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information'
    },
    
    // Authentication
    auth: {
      emailLabel: 'Email Address',
      passwordLabel: 'Password',
      nameLabel: 'Full Name',
      forgotPassword: 'Forgot Password?',
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: 'Already have an account?',
      loginSuccess: 'Login successful',
      registerSuccess: 'Registration successful',
      invalidCredentials: 'Invalid credentials',
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required'
    },
    
    // Application
    application: {
      title: 'Admission Application',
      personalInfo: 'Personal Information',
      contactInfo: 'Contact Information',
      academicInfo: 'Academic Information',
      documents: 'Documents',
      fullName: 'Full Name',
      dob: 'Date of Birth',
      gender: 'Gender',
      category: 'Category',
      phone: 'Phone Number',
      address: 'Address',
      course: 'Select Course',
      percentage: 'Percentage/CGPA',
      uploadPhoto: 'Upload Photo',
      uploadMarksheet: 'Upload Marksheet',
      submitApplication: 'Submit Application',
      applicationNumber: 'Application Number',
      status: 'Status'
    },
    
    // Dashboard
    dashboard: {
      welcome: 'Welcome to Dashboard',
      myApplications: 'My Applications',
      notifications: 'Notifications',
      profile: 'Profile',
      announcements: 'Announcements',
      totalApplications: 'Total Applications',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected'
    },
    
    // Messages
    messages: {
      applicationSubmitted: 'Application submitted successfully',
      documentUploaded: 'Document uploaded successfully',
      profileUpdated: 'Profile updated successfully',
      somethingWentWrong: 'Something went wrong',
      pleaseWait: 'Please wait...',
      noDataFound: 'No data found',
      confirmDelete: 'Are you sure you want to delete?'
    }
  },
  
  hi: {
    // Common (Hindi)
    common: {
      welcome: 'स्वागत है',
      login: 'लॉगिन',
      register: 'पंजीकरण',
      logout: 'लॉगआउट',
      submit: 'जमा करें',
      cancel: 'रद्द करें',
      save: 'सहेजें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      back: 'पीछे',
      next: 'आगे',
      previous: 'पिछला',
      search: 'खोजें',
      filter: 'फ़िल्टर',
      loading: 'लोड हो रहा है...',
      success: 'सफलता',
      error: 'त्रुटि',
      warning: 'चेतावनी',
      info: 'जानकारी'
    },
    
    auth: {
      emailLabel: 'ईमेल पता',
      passwordLabel: 'पासवर्ड',
      nameLabel: 'पूरा नाम',
      forgotPassword: 'पासवर्ड भूल गए?',
      dontHaveAccount: 'खाता नहीं है?',
      alreadyHaveAccount: 'पहले से खाता है?',
      loginSuccess: 'लॉगिन सफल',
      registerSuccess: 'पंजीकरण सफल',
      invalidCredentials: 'अमान्य क्रेडेंशियल',
      emailRequired: 'ईमेल आवश्यक है',
      passwordRequired: 'पासवर्ड आवश्यक है'
    },
    
    application: {
      title: 'प्रवेश आवेदन',
      personalInfo: 'व्यक्तिगत जानकारी',
      contactInfo: 'संपर्क जानकारी',
      academicInfo: 'शैक्षणिक जानकारी',
      documents: 'दस्तावेज़',
      fullName: 'पूरा नाम',
      dob: 'जन्म तिथि',
      gender: 'लिंग',
      category: 'श्रेणी',
      phone: 'फ़ोन नंबर',
      address: 'पता',
      course: 'कोर्स चुनें',
      percentage: 'प्रतिशत/सीजीपीए',
      uploadPhoto: 'फोटो अपलोड करें',
      uploadMarksheet: 'मार्कशीट अपलोड करें',
      submitApplication: 'आवेदन जमा करें',
      applicationNumber: 'आवेदन संख्या',
      status: 'स्थिति'
    },
    
    dashboard: {
      welcome: 'डैशबोर्ड में आपका स्वागत है',
      myApplications: 'मेरे आवेदन',
      notifications: 'सूचनाएं',
      profile: 'प्रोफ़ाइल',
      announcements: 'घोषणाएं',
      totalApplications: 'कुल आवेदन',
      pending: 'लंबित',
      approved: 'स्वीकृत',
      rejected: 'अस्वीकृत'
    },
    
    messages: {
      applicationSubmitted: 'आवेदन सफलतापूर्वक जमा किया गया',
      documentUploaded: 'दस्तावेज़ सफलतापूर्वक अपलोड किया गया',
      profileUpdated: 'प्रोफ़ाइल अपडेट किया गया',
      somethingWentWrong: 'कुछ गलत हो गया',
      pleaseWait: 'कृपया प्रतीक्षा करें...',
      noDataFound: 'कोई डेटा नहीं मिला',
      confirmDelete: 'क्या आप वाकई हटाना चाहते हैं?'
    }
  },
  
  te: {
    // Common (Telugu)
    common: {
      welcome: 'స్వాగతం',
      login: 'లాగిన్',
      register: 'నమోదు',
      logout: 'లాగౌట్',
      submit: 'సమర్పించు',
      cancel: 'రద్దు చేయి',
      save: 'సేవ్ చేయి',
      delete: 'తొలగించు',
      edit: 'సవరించు',
      back: 'వెనుకకు',
      next: 'తదుపరి',
      previous: 'మునుపటి',
      search: 'వెతకండి',
      filter: 'ఫిల్టర్',
      loading: 'లోడ్ అవుతోంది...',
      success: 'విజయం',
      error: 'లోపం',
      warning: 'హెచ్చరిక',
      info: 'సమాచారం'
    },
    
    auth: {
      emailLabel: 'ఇమెయిల్ చిరునామా',
      passwordLabel: 'పాస్‌వర్డ్',
      nameLabel: 'పూర్తి పేరు',
      forgotPassword: 'పాస్‌వర్డ్ మర్చిపోయారా?',
      dontHaveAccount: 'ఖాతా లేదా?',
      alreadyHaveAccount: 'ఇప్పటికే ఖాతా ఉందా?',
      loginSuccess: 'లాగిన్ విజయవంతం',
      registerSuccess: 'నమోదు విజయవంతం',
      invalidCredentials: 'చెల్లని ఆధారాలు',
      emailRequired: 'ఇమెయిల్ అవసరం',
      passwordRequired: 'పాస్‌వర్డ్ అవసరం'
    },
    
    application: {
      title: 'ప్రవేశ దరఖాస్తు',
      personalInfo: 'వ్యక్తిగత సమాచారం',
      contactInfo: 'సంప్రదింపు సమాచారం',
      academicInfo: 'విద్యా సమాచారం',
      documents: 'పత్రాలు',
      fullName: 'పూర్తి పేరు',
      dob: 'పుట్టిన తేదీ',
      gender: 'లింగం',
      category: 'వర్గం',
      phone: 'ఫోన్ నంబర్',
      address: 'చిరునామా',
      course: 'కోర్సు ఎంచుకోండి',
      percentage: 'శాతం/సిజిపిఎ',
      uploadPhoto: 'ఫోటో అప్‌లోడ్ చేయండి',
      uploadMarksheet: 'మార్క్‌షీట్ అప్‌లోడ్ చేయండి',
      submitApplication: 'దరఖాస్తు సమర్పించండి',
      applicationNumber: 'దరఖాస్తు సంఖ్య',
      status: 'స్థితి'
    },
    
    dashboard: {
      welcome: 'డాష్‌బోర్డ్‌కు స్వాగతం',
      myApplications: 'నా దరఖాస్తులు',
      notifications: 'నోటిఫికేషన్లు',
      profile: 'ప్రొఫైల్',
      announcements: 'ప్రకటనలు',
      totalApplications: 'మొత్తం దరఖాస్తులు',
      pending: 'పెండింగ్',
      approved: 'ఆమోదించబడింది',
      rejected: 'తిరస్కరించబడింది'
    },
    
    messages: {
      applicationSubmitted: 'దరఖాస్తు విజయవంతంగా సమర్పించబడింది',
      documentUploaded: 'పత్రం విజయవంతంగా అప్‌లోడ్ చేయబడింది',
      profileUpdated: 'ప్రొఫైల్ నవీకరించబడింది',
      somethingWentWrong: 'ఏదో తప్పు జరిగింది',
      pleaseWait: 'దయచేసి వేచి ఉండండి...',
      noDataFound: 'డేటా కనుగొనబడలేదు',
      confirmDelete: 'మీరు ఖచ్చితంగా తొలగించాలనుకుంటున్నారా?'
    }
  }
};

// Get translation
function t(lang, key) {
  const keys = key.split('.');
  let value = translations[lang] || translations.en;
  
  for (const k of keys) {
    value = value[k];
    if (!value) {
      // Fallback to English
      value = translations.en;
      for (const k2 of keys) {
        value = value[k2];
        if (!value) return key;
      }
      return value;
    }
  }
  
  return value || key;
}

// Get all translations for a language
function getTranslations(lang) {
  return translations[lang] || translations.en;
}

// Get supported languages
function getSupportedLanguages() {
  return [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' }
  ];
}

module.exports = {
  t,
  getTranslations,
  getSupportedLanguages,
  translations
};
