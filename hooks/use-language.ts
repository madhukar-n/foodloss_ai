import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getLocales } from 'expo-localization';
import { LanguageCode, translations } from '@/constants/translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LanguageCode>('ja');

  useEffect(() => {
    const deviceLanguage = getLocales()[0]?.languageCode;
    if (deviceLanguage === 'en') {
      setLanguage('en');
    } else {
      setLanguage('ja');
    }
  }, []);

  const t = (key: string): string => {
    const keys = key.split('.');
    let current: any = translations[language];

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return key;
      }
    }

    return typeof current === 'string' ? current : key;
  };

  return React.createElement(
    LanguageContext.Provider,
    { value: { language, setLanguage, t } },
    children
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
