import { useState, useEffect } from 'react';
import { useLanguage, Language } from '@/context/LanguageContext';
import en from './en.json';
import hi from './hi.json';
import ru from './ru.json';

// Define a type for the translations
// You can generate this automatically later for better type safety
type Translations = typeof en; 

const translations: Record<Language, Translations> = {
  en,
  hi,
  ru,
};

// Hook to get the translation function
export const useTranslation = () => {
  const { language } = useLanguage();
  const [t, setT] = useState<Translations>(translations[language]);

  useEffect(() => {
    // Update translations when language changes
    setT(translations[language]);
  }, [language]);

  // Function to get nested keys like 'navbar.home'
  const translate = (key: string): string => {
    const keys = key.split('.');
    let result: any = t;
    try {
        for (const k of keys) {
            result = result[k];
            if (result === undefined) {
                console.warn(`Translation key "${key}" not found for language "${language}"`);
                return key; // Return the key itself as fallback
            }
        }
        return typeof result === 'string' ? result : key; // Ensure it's a string
    } catch (error) {
        console.warn(`Error accessing translation key "${key}" for language "${language}":`, error);
        return key; // Return the key on error
    }
  };

  return { t: translate, language }; // Return the translation function and current language
};
