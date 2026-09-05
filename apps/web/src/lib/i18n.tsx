'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi' | 'mr';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
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
  hi: {
    'nav.scan': 'फसल स्कैन करें',
    'nav.library': 'रोग पुस्तकालय',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.history': 'इतिहास',
    'nav.map': 'प्रकोप मानचित्र',
    'nav.signin': 'साइन इन करें',
    'nav.logout': 'लॉग आउट',
    'hero.title': 'फसल स्वास्थ्य के लिए नैदानिक ​​सटीकता',
    'hero.subtitle': 'फसल के पत्ते की एक तस्वीर अपलोड करें। हमारा AI मॉडल बीमारियों का पता लगाने, अनिश्चितता को मापने और कार्रवाई योग्य प्रबंधन रणनीतियाँ प्रदान करने के लिए छवि का विश्लेषण करता है।',
    'hero.btn.scan': 'निदान शुरू करें',
    'hero.btn.library': 'पुस्तकालय ब्राउज़ करें',
  },
  mr: {
    'nav.scan': 'पीक स्कॅन करा',
    'nav.library': 'रोग ग्रंथालय',
    'nav.dashboard': 'डॅशबोर्ड',
    'nav.history': 'इतिहास',
    'nav.map': 'प्रकोप नकाशा',
    'nav.signin': 'साइन इन करा',
    'nav.logout': 'लॉग आउट',
    'hero.title': 'पीक आरोग्यासाठी क्लिनिकल अचूकता',
    'hero.subtitle': 'पिकाच्या पानाचा फोटो अपलोड करा. आमचे AI मॉडेल रोग शोधण्यासाठी, अनिश्चितता मोजण्यासाठी आणि कृती करण्यायोग्य व्यवस्थापन धोरणे प्रदान करण्यासाठी प्रतिमेचे विश्लेषण करते.',
    'hero.btn.scan': 'निदान सुरू करा',
    'hero.btn.library': 'ग्रंथालय ब्राउझ करा',
  }
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Load saved preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('preferred_language') as Language;
    if (saved && ['en', 'hi', 'mr'].includes(saved)) {
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
