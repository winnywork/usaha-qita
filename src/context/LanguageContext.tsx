"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations } from "@/i18n/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.id;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "id",
  setLanguage: () => {},
  t: translations.id,
});

const STORAGE_KEY = "usaha_qita_language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("id");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved === "id" || saved === "en") {
        setLanguageState(saved);
      }
    } catch (e) {
      console.warn("Gagal membaca preferensi bahasa dari localStorage", e);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn("Gagal menyimpan preferensi bahasa ke localStorage", e);
    }
  };

  const currentTranslations = translations[language] || translations.id;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: currentTranslations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}