import i18n from '../i18n'; // Adjust path if your i18n config is elsewhere

/**
 * Parses a JSON string containing translations and returns the value for the current language.
 * Falls back to English or the first available language if the current language is not found.
 *
 * @param jsonString The JSON string from the database (e.g., '{"en": "Name", "ru": "Имя"}'). Can be null or undefined.
 * @param fieldName Optional name of the field being processed, for logging.
 * @param fallback Optional fallback string if parsing or finding fails. Defaults to an empty string.
 * @returns The translated string for the current language or a fallback.
 */
export const getTranslatedField = (
    jsonString: string | object | null | undefined, 
    fieldName: string = 'field', // Added for logging
    fallback: string = '' 
): string => {
  console.log(`[getTranslatedField ${fieldName}] Input:`, jsonString);
  console.log(`[getTranslatedField ${fieldName}] Current Lang:`, i18n.language);

  if (jsonString === null || typeof jsonString === 'undefined') {
    console.log(`[getTranslatedField ${fieldName}] Input is null/undefined.`);
    return fallback;
  }

  if (typeof jsonString === 'object'){
      console.log(`[getTranslatedField ${fieldName}] Input is already an object.`);
      const translations = jsonString as Record<string, string>;
      const currentLang = i18n.language.split('-')[0];
      if (translations[currentLang]) {
        console.log(`[getTranslatedField ${fieldName}] Found direct match for ${currentLang}:`, translations[currentLang]);
        return translations[currentLang];
      }
      if (translations['en']) {
        console.log(`[getTranslatedField ${fieldName}] Falling back to 'en':`, translations['en']);
        return translations['en'];
      }
      const firstKey = Object.keys(translations)[0];
       if (firstKey) {
         console.log(`[getTranslatedField ${fieldName}] Falling back to first key '${firstKey}':`, translations[firstKey]);
         return translations[firstKey];
       } 
      console.log(`[getTranslatedField ${fieldName}] No keys found in object.`);
      return fallback;
  }

  if (typeof jsonString !== 'string' || jsonString.trim() === '') {
     console.log(`[getTranslatedField ${fieldName}] Input is not a non-empty string.`);
    return fallback;
  }

  try {
    const translations: Record<string, string> = JSON.parse(jsonString);
    console.log(`[getTranslatedField ${fieldName}] Parsed JSON:`, translations);
    
    if (typeof translations !== 'object' || translations === null) {
        console.warn(`[getTranslatedField ${fieldName}] Parsed JSON is not an object.`);
        return jsonString; // Return original string if parsing resulted in non-object
    }

    const currentLang = i18n.language.split('-')[0];

    if (translations.hasOwnProperty(currentLang)) {
       console.log(`[getTranslatedField ${fieldName}] Found direct match for ${currentLang}:`, translations[currentLang]);
      return translations[currentLang];
    }

    if (translations.hasOwnProperty('en')) {
      console.log(`[getTranslatedField ${fieldName}] Falling back to 'en':`, translations['en']);
      return translations['en'];
    }

    const firstKey = Object.keys(translations)[0];
    if (firstKey) {
      console.log(`[getTranslatedField ${fieldName}] Falling back to first key '${firstKey}':`, translations[firstKey]);
      return translations[firstKey];
    }

    console.log(`[getTranslatedField ${fieldName}] No keys found in parsed object.`);
    return fallback;

  } catch (error) {
    console.error(`[getTranslatedField ${fieldName}] Failed to parse JSON:`, error);
    // Return the original string if it wasn't valid JSON
    console.log(`[getTranslatedField ${fieldName}] Returning original string due to parsing error.`);
    return jsonString; 
  }
};
