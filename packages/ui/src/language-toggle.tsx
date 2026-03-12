"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./language-toggle.module.css";

export function LanguageToggle() {
  const { t, i18n } = useTranslation();
  const locale = i18n?.language || "en";

  const toggle = () => {
    if (!i18n) return;
    const next = locale === "en" ? "ar" : "en";
    i18n.changeLanguage(next);
    localStorage.setItem("shelf-ai-locale", next);
    document.documentElement.setAttribute("dir", next === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", next);
  };

  return (
    <button
      onClick={toggle}
      className={styles.button}
      aria-label={t("ui.languageToggle.ariaLabel", "Toggle language")}
    >
      <Globe size={14} />
      <span>{locale === "en" ? "EN" : "عربي"}</span>
    </button>
  );
}
