"use client";

import React from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./search-input.module.css";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxWidth?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  maxWidth = "320px",
}: SearchInputProps) {
  const { t } = useTranslation();
  const finalPlaceholder =
    placeholder === "Search..." ? t("ui.searchInput.placeholder") : placeholder;
  return (
    <div className={styles.container} style={{ maxWidth }}>
      <Search size={15} color="var(--text-muted)" aria-hidden="true" />
      <input
        type="search"
        placeholder={finalPlaceholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.input}
        aria-label={finalPlaceholder}
      />
    </div>
  );
}
