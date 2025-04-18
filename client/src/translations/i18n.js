import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";


import translationEN from "../translations/en/en.json";
import translationZH from "../translations/zh/zh.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/translations/{{lng}}/{{ns}}.json",
    },
    resources: {
      en: {
        translation: translationEN,
      },
      zh: {
        translation: translationZH,
      },
    }
  });

export default i18n;
