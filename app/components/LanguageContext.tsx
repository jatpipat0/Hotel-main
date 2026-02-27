"use client";

import React, { createContext, useContext, useState } from "react";
import { translations } from "@/lib/translations";

type Language = keyof typeof translations;

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Language>('en'); // ภาษาเริ่มต้นคืออังกฤษ

  // ฟังก์ชันสลับคำแปล
  const t = (key: keyof typeof translations['en']) => {
    return translations[lang as keyof typeof translations][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};