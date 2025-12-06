import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UILanguage, Translations, getTranslation, getTextDirection, UI_LANGUAGES } from './translations';

interface LanguageContextType {
  language: UILanguage;
  setLanguage: (lang: UILanguage) => void;
  t: Translations;
  direction: 'ltr' | 'rtl';
  languages: typeof UI_LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Detect browser language
const detectBrowserLanguage = (): UILanguage => {
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  const supportedLangs: UILanguage[] = ['en', 'hi', 'es', 'fr', 'de', 'zh', 'ja', 'ar', 'pt', 'ru', 'ko', 'it', 'nl', 'tr', 'bn'];
  return supportedLangs.includes(browserLang as UILanguage) ? (browserLang as UILanguage) : 'en';
};

// Get saved language from localStorage
const getSavedLanguage = (): UILanguage => {
  try {
    const saved = localStorage.getItem('apex7_ui_language');
    if (saved && ['en', 'hi', 'es', 'fr', 'de', 'zh', 'ja', 'ar', 'pt', 'ru', 'ko', 'it', 'nl', 'tr', 'bn'].includes(saved)) {
      return saved as UILanguage;
    }
  } catch (e) {
    // localStorage not available
  }
  return detectBrowserLanguage();
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<UILanguage>(getSavedLanguage);

  const setLanguage = (lang: UILanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('apex7_ui_language', lang);
    } catch (e) {
      // localStorage not available
    }
    // Update document direction for RTL languages
    document.documentElement.dir = getTextDirection(lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    // Set initial direction
    document.documentElement.dir = getTextDirection(language);
    document.documentElement.lang = language;
  }, []);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: getTranslation(language),
    direction: getTextDirection(language),
    languages: UI_LANGUAGES,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Shorthand hook for translations only
export const useTranslation = () => {
  const { t, language, direction } = useLanguage();
  return { t, language, direction };
};
