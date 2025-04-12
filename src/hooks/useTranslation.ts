import { useState, useEffect } from 'react';
import { useLanguage, Language } from '@/context/LanguageContext';
import i18n from '../i18n';

// Define a type for the translations
// Hook to get the translation function
export const useTranslation = () => {
  const { language } = useLanguage();
  const [t, setT] = useState<any>({});

  useEffect(() => {
    console.log('useTranslation: language changed to', language);
  }, [language]);

  // Function to get nested keys like 'navbar.home'
  const translate = (key: string, options?: any): string => {
    console.log('useTranslation: translating key', key, 'with options', options);
    const translated = i18n.t(key, options);
    console.log('useTranslation: translated key', key, 'to', translated);
    return translated;
  };

  return { t: translate, language }; // Return the translation function and current language
};
