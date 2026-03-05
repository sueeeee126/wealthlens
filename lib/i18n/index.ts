"use client";

import { useState, useEffect, useCallback } from "react";
import { en } from "./en";
import { zh } from "./zh";

export type Language = "en" | "zh";
export type { Strings } from "./en";

export const translations = { en, zh };

const LANG_KEY = "wealthlens_lang";

export function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "en";
  return (localStorage.getItem(LANG_KEY) as Language) ?? "en";
}

export function setStoredLanguage(lang: Language) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LANG_KEY, lang);
}

export function useTranslation() {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const stored = getStoredLanguage();
    setLanguageState(stored);

    // Listen for language changes from other components
    const handler = (e: StorageEvent) => {
      if (e.key === LANG_KEY && e.newValue) {
        setLanguageState(e.newValue as Language);
      }
    };
    window.addEventListener("storage", handler);

    // Also listen for custom event (same tab)
    const customHandler = (e: Event) => {
      const detail = (e as CustomEvent<Language>).detail;
      setLanguageState(detail);
    };
    window.addEventListener("wealthlens_lang_change", customHandler);

    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("wealthlens_lang_change", customHandler);
    };
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setStoredLanguage(lang);
    setLanguageState(lang);
    // Notify other components in the same tab
    window.dispatchEvent(
      new CustomEvent<Language>("wealthlens_lang_change", { detail: lang })
    );
  }, []);

  const t = translations[language];

  return { t, language, setLanguage };
}
