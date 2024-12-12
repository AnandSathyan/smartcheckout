import i18n from 'i18next';
//@ts-ignore
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import store from './redux/store';
i18n
  .use(Backend) // Use this if you're loading translations from external files
  .use(initReactI18next)
  //@ts-ignore
  .init({
    fallbackLng: 'English', // Default language
    lng: store.getState().language.language, // Initial language
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Path to translation files
    },
    react: {
      useSuspense: false, // Avoid Suspense issues in React 18+
    },
 
  });
  store.subscribe(() => {
    const language = store.getState().language.language;
    i18n.changeLanguage(language);
  });

export default i18n;
