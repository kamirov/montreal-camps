"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { en } from "./en";
import { fr } from "./fr";
import { Language, Translations } from "./types";

type LocalizationContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
};

const LocalizationContext = createContext<LocalizationContextType | undefined>(
  undefined
);

const translations: Record<Language, Translations> = {
  en,
  fr,
};

export function LocalizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [language, setLanguageState] = useState<Language>("fr"); // Default to French for Montreal

  useEffect(() => {
    // Priority: URL param → localStorage → default (French)
    const urlLang = searchParams.get("lang") as Language;

    if (urlLang && (urlLang === "en" || urlLang === "fr")) {
      setLanguageState(urlLang);
      // Sync to localStorage
      localStorage.setItem("language", urlLang);
      // Update HTML lang attribute
      document.documentElement.lang = urlLang;
    } else {
      // Check localStorage if no URL param
      const savedLanguage = localStorage.getItem("language") as Language;
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "fr")) {
        setLanguageState(savedLanguage);
        // Update HTML lang attribute
        document.documentElement.lang = savedLanguage;
      } else {
        // Default to French
        document.documentElement.lang = "fr";
      }
    }
  }, [searchParams]);

  const setLanguage = useCallback(
    (lang: Language) => {
      setLanguageState(lang);
      localStorage.setItem("language", lang);
      // Update HTML lang attribute
      document.documentElement.lang = lang;

      // Update URL query param
      const params = new URLSearchParams(searchParams.toString());
      params.set("lang", lang);
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error(
      "useLocalization must be used within a LocalizationProvider"
    );
  }
  return context;
}
