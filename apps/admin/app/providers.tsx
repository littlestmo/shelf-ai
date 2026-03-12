"use client";

import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import i18n from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import enTranslations from "@shelf-ai/shared/locales/en.json";
import arTranslations from "@shelf-ai/shared/locales/ar.json";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: enTranslations },
      ar: { translation: arTranslations },
    },
    lng:
      typeof window !== "undefined"
        ? localStorage.getItem("shelf-ai-locale") || "en"
        : "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="data-theme" defaultTheme="dark" enableSystem>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </NextThemesProvider>
  );
}
