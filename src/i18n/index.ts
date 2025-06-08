import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

import en from './locales/en.json';
import vi from './locales/vi.json';

const resources = {
  en: {
    translation: en
  },
  vi: {
    translation: vi
  }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'en', // default language
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false
    },

    detection: {
      order: ['localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'sessionStorage'],
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng'
    },

    backend: {
      loadPath: '/locales/{{lng}}.json'
    }
  });

export default i18n;