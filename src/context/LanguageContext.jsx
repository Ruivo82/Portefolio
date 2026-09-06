'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { translations, sharedData } from '../data/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('pt');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedLang = localStorage.getItem('portfolio_lang');
      if (savedLang === 'pt' || savedLang === 'en') {
        setLangState(savedLang);
        document.documentElement.lang = savedLang;
      } else {
        document.documentElement.lang = 'pt';
      }
    } catch {
      // localStorage may fail in restricted environments
    }
  }, []);

  const setLang = (newLang) => {
    if (newLang !== 'pt' && newLang !== 'en') return;
    setLangState(newLang);
    try {
      localStorage.setItem('portfolio_lang', newLang);
      document.documentElement.lang = newLang;
    } catch {
      // ignore storage error
    }
  };

  const currentTranslations = translations[lang] || translations.pt;

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        t: currentTranslations,
        shared: sharedData,
        mounted,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
