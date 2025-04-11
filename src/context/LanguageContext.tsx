import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define available languages
export type Language = 'en' | 'hi' | 'ru';
export const availableLanguages: Language[] = ['en', 'hi', 'ru'];

// Define the shape of the context
interface LanguageContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
}

// Create the context
const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// Create the provider component
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get language from localStorage or default to 'en'
    const storedLang = localStorage.getItem('appLanguage');
    return availableLanguages.includes(storedLang as Language) ? storedLang as Language : 'en';
  });

  useEffect(() => {
    // Store language preference in localStorage
    localStorage.setItem('appLanguage', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    if (availableLanguages.includes(lang)) {
      setLanguageState(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Create a custom hook to use the language context
export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
