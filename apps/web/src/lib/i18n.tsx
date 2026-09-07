'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'mr' | 'bn' | 'te' | 'ta' | 'gu' | 'ur' | 'kn' | 'or' | 'ml' | 'pa' | 'as' | 'mai' | 'sat' | 'ks' | 'ne' | 'sd' | 'kok' | 'doi' | 'mni' | 'brx' | 'sa';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

export const translations: Translations = {
  'en': {
    'nav.scan': 'Scan Crop',
    'nav.library': 'Disease Library',
    'nav.dashboard': 'Dashboard',
    'nav.history': 'History',
    'nav.map': 'Outbreak Map',
    'nav.signin': 'Sign In',
    'nav.logout': 'Logout',
    'hero.title': 'Clinical Precision for Crop Health',
    'hero.subtitle': 'Upload a photo of a crop leaf. Our AI model analyzes the image to detect diseases, quantifies uncertainty, and provides actionable management strategies.',
    'hero.btn.scan': 'Start Diagnosis',
    'hero.btn.library': 'Browse Library',
  },
  'hi': {
    'nav.scan': 'फसल स्कैन करें',
    'nav.library': 'रोग पुस्तकालय',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.history': 'इतिहास',
    'nav.map': 'प्रकोप मानचित्र',
    'nav.signin': 'साइन इन करें',
    'nav.logout': 'लॉग आउट',
    'hero.title': 'फसल स्वास्थ्य के लिए नैदानिक ​​सटीकता',
    'hero.subtitle': 'फसल के पत्ते की एक तस्वीर अपलोड करें। हमारा AI मॉडल बीमारियों का पता लगाने के लिए विश्लेषण करता है।',
    'hero.btn.scan': 'निदान शुरू करें',
    'hero.btn.library': 'पुस्तकालय ब्राउज़ करें',
  },
  'mr': {
    'nav.scan': 'पीक स्कॅन करा',
    'nav.library': 'रोग ग्रंथालय',
    'nav.dashboard': 'डॅशबोर्ड',
    'nav.history': 'इतिहास',
    'nav.map': 'प्रकोप नकाशा',
    'nav.signin': 'साइन इन करा',
    'nav.logout': 'लॉग आउट',
    'hero.title': 'पीक आरोग्यासाठी क्लिनिकल अचूकता',
    'hero.subtitle': 'पिकाच्या पानाचा फोटो अपलोड करा. आमचे AI मॉडेल रोग शोधण्यासाठी विश्लेषण करते.',
    'hero.btn.scan': 'निदान सुरू करा',
    'hero.btn.library': 'ग्रंथालय ब्राउझ करा',
  },
  'bn': {
    'nav.scan': 'ফসল স্ক্যান করুন',
    'nav.library': 'রোগ লাইব্রেরি',
    'nav.dashboard': 'ড্যাশবোর্ড',
    'nav.history': 'ইতিহাস',
    'nav.map': 'প্রাদুর্ভাব মানচিত্র',
    'nav.signin': 'সাইন ইন করুন',
    'nav.logout': 'লগ আউট',
    'hero.title': 'ফসল স্বাস্থ্যের জন্য ক্লিনিকাল নির্ভুলতা',
    'hero.subtitle': 'ফসলের পাতার একটি ছবি আপলোড করুন।',
    'hero.btn.scan': 'রোগ নির্ণয় শুরু করুন',
    'hero.btn.library': 'লাইব্রেরি ব্রাউজ করুন',
  },
  'te': {
    'nav.scan': 'పంటను స్కాన్ చేయండి',
    'nav.library': 'వ్యాధి లైబ్రరీ',
    'nav.dashboard': 'డాష్‌బోర్డ్',
    'nav.history': 'చరిత్ర',
    'nav.map': 'అంటువ్యాధి మ్యాప్',
    'nav.signin': 'సైన్ ఇన్ చేయండి',
    'nav.logout': 'లాగ్ అవుట్',
    'hero.title': 'పంట ఆరోగ్యానికి క్లినికల్ ఖచ్చితత్వం',
    'hero.subtitle': 'పంట ఆకు ఫోటోను అప్‌లోడ్ చేయండి.',
    'hero.btn.scan': 'రోగ నిర్ధారణ ప్రారంభించండి',
    'hero.btn.library': 'లైబ్రరీని బ్రౌజ్ చేయండి',
  },
  'ta': {
    'nav.scan': 'பயிரை ஸ்கேன் செய்யவும்',
    'nav.library': 'நோய் நூலகம்',
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.history': 'வரலாறு',
    'nav.map': 'நோய் பரவல் வரைபடம்',
    'nav.signin': 'உள்நுழைய',
    'nav.logout': 'வெளியேறு',
    'hero.title': 'பயிர் ஆரோக்கியத்திற்கான துல்லியம்',
    'hero.subtitle': 'பயிர் இலையின் புகைப்படத்தை பதிவேற்றவும்.',
    'hero.btn.scan': 'கண்டறிதலைத் தொடங்கவும்',
    'hero.btn.library': 'நூலகத்தை உலாவவும்',
  },
  'gu': {
    'nav.scan': 'પાક સ્કેન કરો',
    'nav.library': 'રોગ પુસ્તકાલય',
    'nav.dashboard': 'ડેશબોર્ડ',
    'nav.history': 'ઇતિહાસ',
    'nav.map': 'પ્રકોપ નકશો',
    'nav.signin': 'સાઇન ઇન કરો',
    'nav.logout': 'લોગ આઉટ',
    'hero.title': 'પાક આરોગ્ય માટે ક્લિનિકલ ચોકસાઈ',
    'hero.subtitle': 'પાકના પાનનો ફોટો અપલોડ કરો.',
    'hero.btn.scan': 'નિદાન શરૂ કરો',
    'hero.btn.library': 'પુસ્તકાલય બ્રાઉઝ કરો',
  },
  'ur': {
    'nav.scan': 'فصل اسکین کریں',
    'nav.library': 'بیماریوں کی لائبریری',
    'nav.dashboard': 'ڈیش بورڈ',
    'nav.history': 'تاریخ',
    'nav.map': 'وباء کا نقشہ',
    'nav.signin': 'سائن ان کریں',
    'nav.logout': 'لاگ آؤٹ',
    'hero.title': 'فصل کی صحت کے لیے کلینیکل درستگی',
    'hero.subtitle': 'فصل کے پتے کی تصویر اپ لوڈ کریں۔',
    'hero.btn.scan': 'تشخیص شروع کریں',
    'hero.btn.library': 'لائبریری براؤز کریں',
  },
  'kn': {
    'nav.scan': 'ಬೆಳೆಯನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
    'nav.library': 'ರೋಗಗಳ ಗ್ರಂಥಾಲಯ',
    'nav.dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'nav.history': 'ಇತಿಹಾಸ',
    'nav.map': 'ರೋಗ ಹರಡುವ ನಕ್ಷೆ',
    'nav.signin': 'ಸೈನ್ ಇನ್ ಮಾಡಿ',
    'nav.logout': 'ಲಾಗ್ ಔಟ್',
    'hero.title': 'ಬೆಳೆ ಆರೋಗ್ಯಕ್ಕಾಗಿ ನಿಖರತೆ',
    'hero.subtitle': 'ಬೆಳೆಯ ಎಲೆಯ ಫೋಟೋವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
    'hero.btn.scan': 'ರೋಗನಿರ್ಣಯವನ್ನು ಪ್ರಾರಂಭಿಸಿ',
    'hero.btn.library': 'ಗ್ರಂಥಾಲಯವನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ',
  },
  'or': {
    'nav.scan': 'ଫସଲ ସ୍କାନ କରନ୍ତୁ',
    'nav.library': 'ରୋଗ ଲାଇବ୍ରେରୀ',
    'nav.dashboard': 'ଡ୍ୟାସବୋର୍ଡ',
    'nav.history': 'ଇତିହାସ',
    'nav.map': 'ପ୍ରାଦୁର୍ଭାବ ମାନଚିତ୍ର',
    'nav.signin': 'ସାଇନ୍ ଇନ୍ କରନ୍ତୁ',
    'nav.logout': 'ଲଗ୍ ଆଉଟ୍ କରନ୍ତୁ',
    'hero.title': 'ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ ପାଇଁ ସଠିକତା',
    'hero.subtitle': 'ଫସଲ ପତ୍ରର ଏକ ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ |',
    'hero.btn.scan': 'ରୋଗ ନିର୍ଣ୍ଣୟ ଆରମ୍ଭ କରନ୍ତୁ',
    'hero.btn.library': 'ଲାଇବ୍ରେରୀ ବ୍ରାଉଜ୍ କରନ୍ତୁ',
  },
  'ml': {
    'nav.scan': 'വിള സ്കാൻ ചെയ്യുക',
    'nav.library': 'രോഗ ലൈബ്രറി',
    'nav.dashboard': 'ഡാഷ്ബോർഡ്',
    'nav.history': 'ചരിത്രം',
    'nav.map': 'രോഗവ്യാപന മാപ്പ്',
    'nav.signin': 'സൈൻ ഇൻ ചെയ്യുക',
    'nav.logout': 'ലോഗ് ഔട്ട്',
    'hero.title': 'വിള ആരോഗ്യത്തിനായുള്ള കൃത്യത',
    'hero.subtitle': 'വിളയുടെ ഇലയുടെ ഒരു ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക.',
    'hero.btn.scan': 'രോഗനിർണ്ണയം ആരംഭിക്കുക',
    'hero.btn.library': 'ലൈബ്രറി ബ്രൗസ് ചെയ്യുക',
  },
  'pa': {
    'nav.scan': 'ਫਸਲ ਸਕੈਨ ਕਰੋ',
    'nav.library': 'ਬਿਮਾਰੀ ਲਾਇਬ੍ਰੇਰੀ',
    'nav.dashboard': 'ਡੈਸ਼ਬੋਰਡ',
    'nav.history': 'ਇਤਿਹਾਸ',
    'nav.map': 'ਪ੍ਰਕੋਪ ਦਾ ਨਕਸ਼ਾ',
    'nav.signin': 'ਸਾਈਨ ਇਨ ਕਰੋ',
    'nav.logout': 'ਲਾਗ ਆਉਟ',
    'hero.title': 'ਫਸਲ ਦੀ ਸਿਹਤ ਲਈ ਕਲੀਨਿਕਲ ਸ਼ੁੱਧਤਾ',
    'hero.subtitle': 'ਫਸਲ ਦੇ ਪੱਤੇ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ।',
    'hero.btn.scan': 'ਤਸ਼ਖੀਸ ਸ਼ੁਰੂ ਕਰੋ',
    'hero.btn.library': 'ਲਾਇਬ੍ਰੇਰੀ ਬ੍ਰਾਊਜ਼ ਕਰੋ',
  },
  'as': {
    'nav.scan': 'শস্য স্কেন কৰক',
    'nav.library': 'ৰোগৰ পুথিভঁৰাল',
    'nav.dashboard': 'ডেচবৰ্ড',
    'nav.history': 'ইতিহাস',
    'nav.map': 'প্ৰাদুৰ্ভাৱৰ মানচিত্ৰ',
    'nav.signin': 'ছাইন ইন কৰক',
    'nav.logout': 'লগ আউট',
    'hero.title': 'শস্যৰ স্বাস্থ্যৰ বাবে ক্লিনিকেল নিৰ্ভুলতা',
    'hero.subtitle': 'শস্যৰ পাতৰ ফটো এখন আপল’ড কৰক।',
    'hero.btn.scan': 'ৰোগ নিৰ্ণয় আৰম্ভ কৰক',
    'hero.btn.library': 'পুথিভঁৰাল ব্ৰাউজ কৰক',
  },
  'mai': {
    'nav.scan': 'फसल स्कैन करू',
    'nav.library': 'रोग पुस्तकालय',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.history': 'इतिहास',
    'nav.map': 'प्रकोप नक्शा',
    'nav.signin': 'साइन इन करू',
    'nav.logout': 'लॉग आउट',
    'hero.title': 'फसल स्वास्थ्य लेल नैदानिक ​​सटीकता',
    'hero.subtitle': 'फसलक पातक एकटा तस्वीर अपलोड करू।',
    'hero.btn.scan': 'निदान शुरू करू',
    'hero.btn.library': 'पुस्तकालय ब्राउज करू',
  },
  'sat': {
    'nav.scan': 'Crop Scan',
    'nav.library': 'Disease Library',
    'nav.dashboard': 'Dashboard',
    'nav.history': 'History',
    'nav.map': 'Outbreak Map',
    'nav.signin': 'Sign In',
    'nav.logout': 'Logout',
    'hero.title': 'Clinical Precision for Crop Health',
    'hero.subtitle': 'Upload a photo of a crop leaf.',
    'hero.btn.scan': 'Start Diagnosis',
    'hero.btn.library': 'Browse Library',
  },
  'ks': {
    'nav.scan': 'فصل سکین کریو',
    'nav.library': 'بیماریوں ہنز لائبریری',
    'nav.dashboard': 'ڈیش بورڈ',
    'nav.history': 'تاریخ',
    'nav.map': 'وباء نقشه',
    'nav.signin': 'سائن ان',
    'nav.logout': 'لاگ آؤٹ',
    'hero.title': 'فصلن ہند صحت',
    'hero.subtitle': 'فصل کین پتن ہنز تصویر کریو اپلوڈ',
    'hero.btn.scan': 'تشخیص کریو شروع',
    'hero.btn.library': 'لائبریری کریو براؤز',
  },
  'ne': {
    'nav.scan': 'बाली स्क्यान गर्नुहोस्',
    'nav.library': 'रोग पुस्तकालय',
    'nav.dashboard': 'ड्यासबोर्ड',
    'nav.history': 'इतिहास',
    'nav.map': 'प्रकोप नक्शा',
    'nav.signin': 'साइन इन गर्नुहोस्',
    'nav.logout': 'लग आउट गर्नुहोस्',
    'hero.title': 'बाली स्वास्थ्यको लागि क्लिनिकल शुद्धता',
    'hero.subtitle': 'बालीको पातको फोटो अपलोड गर्नुहोस्।',
    'hero.btn.scan': 'निदान सुरु गर्नुहोस्',
    'hero.btn.library': 'पुस्तकालय ब्राउज गर्नुहोस्',
  },
  'sd': {
    'nav.scan': 'فصل اسڪين ڪريو',
    'nav.library': 'بيماري لائبريري',
    'nav.dashboard': 'ڊيش بورڊ',
    'nav.history': 'تاريخ',
    'nav.map': 'وباء جو نقشو',
    'nav.signin': 'سائن ان ڪريو',
    'nav.logout': 'لاگ آئوٽ',
    'hero.title': 'فصل جي صحت لاءِ درستگي',
    'hero.subtitle': 'فصل جي پتي جي تصوير اپلوڊ ڪريو.',
    'hero.btn.scan': 'تشخيص شروع ڪريو',
    'hero.btn.library': 'لائبريري براؤز ڪريو',
  },
  'kok': {
    'nav.scan': 'पीक स्कॅन करा',
    'nav.library': 'रोग ग्रंथालय',
    'nav.dashboard': 'डॅशबोर्ड',
    'nav.history': 'इतिहास',
    'nav.map': 'प्रकोप नकाशा',
    'nav.signin': 'साइन इन करा',
    'nav.logout': 'लॉग आउट',
    'hero.title': 'पीक भलायके खातीर अचूकताय',
    'hero.subtitle': 'पिकाच्या पानाचो फोटो अपलोड करा.',
    'hero.btn.scan': 'निदान सुरू करा',
    'hero.btn.library': 'ग्रंथालय ब्राउझ करा',
  },
  'doi': {
    'nav.scan': 'फसल स्कैन करो',
    'nav.library': 'रोग पुस्तकालय',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.history': 'इतिहास',
    'nav.map': 'प्रकोप नक्शा',
    'nav.signin': 'साइन इन करो',
    'nav.logout': 'लॉग आउट',
    'hero.title': 'फसल सेहत आस्तै सटीकता',
    'hero.subtitle': 'फसल दे पत्तै दी फोटो अपलोड करो।',
    'hero.btn.scan': 'निदान शुरू करो',
    'hero.btn.library': 'पुस्तकालय ब्राउज करो',
  },
  'mni': {
    'nav.scan': 'Crop Scan',
    'nav.library': 'Disease Library',
    'nav.dashboard': 'Dashboard',
    'nav.history': 'History',
    'nav.map': 'Outbreak Map',
    'nav.signin': 'Sign In',
    'nav.logout': 'Logout',
    'hero.title': 'Clinical Precision for Crop Health',
    'hero.subtitle': 'Upload a photo of a crop leaf.',
    'hero.btn.scan': 'Start Diagnosis',
    'hero.btn.library': 'Browse Library',
  },
  'brx': {
    'nav.scan': 'Crop Scan',
    'nav.library': 'Disease Library',
    'nav.dashboard': 'Dashboard',
    'nav.history': 'History',
    'nav.map': 'Outbreak Map',
    'nav.signin': 'Sign In',
    'nav.logout': 'Logout',
    'hero.title': 'Clinical Precision for Crop Health',
    'hero.subtitle': 'Upload a photo of a crop leaf.',
    'hero.btn.scan': 'Start Diagnosis',
    'hero.btn.library': 'Browse Library',
  },
  'sa': {
    'nav.scan': 'सस्यं स्कैन् कुर्वन्तु',
    'nav.library': 'रोगपुस्तकालयः',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.history': 'इतिहासः',
    'nav.map': 'प्रकोपमानचित्रम्',
    'nav.signin': 'साइन इन् कुर्वन्तु',
    'nav.logout': 'लॉग् आउट्',
    'hero.title': 'सस्यस्वास्थ्यस्य कृते नैदानिकी सटीकता',
    'hero.subtitle': 'सस्यपत्रस्य चित्रं अपलोड् कुर्वन्तु।',
    'hero.btn.scan': 'निदानम् आरभन्ताम्',
    'hero.btn.library': 'पुस्तकालयं पश्यन्तु',
  },
};

export const LANGUAGE_NAMES: Record<Language, string> = {
  'en': 'English',
  'hi': 'Hindi',
  'mr': 'Marathi',
  'bn': 'Bengali',
  'te': 'Telugu',
  'ta': 'Tamil',
  'gu': 'Gujarati',
  'ur': 'Urdu',
  'kn': 'Kannada',
  'or': 'Odia',
  'ml': 'Malayalam',
  'pa': 'Punjabi',
  'as': 'Assamese',
  'mai': 'Maithili',
  'sat': 'Santali',
  'ks': 'Kashmiri',
  'ne': 'Nepali',
  'sd': 'Sindhi',
  'kok': 'Konkani',
  'doi': 'Dogri',
  'mni': 'Manipuri',
  'brx': 'Bodo',
  'sa': 'Sanskrit',
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('preferred_language') as Language;
    if (saved && Object.keys(translations).includes(saved)) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('preferred_language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
