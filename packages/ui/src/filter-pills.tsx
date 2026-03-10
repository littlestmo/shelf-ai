"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./filter-pills.module.css";

export interface FilterPillsProps {
  options: readonly string[] | string[];
  selected: string;
  onChange: (value: string) => void;
  allLabel?: string;
}

export function FilterPills({
  options,
  selected,
  onChange,
  allLabel,
}: FilterPillsProps) {
  const { t } = useTranslation();
  const finalAllLabel = allLabel || t("ui.filterPills.all");

  return (
    <div
      className={styles.container}
      role="group"
      aria-label={t("ui.filterPills.ariaLabel")}
    >
      <button
        onClick={() => onChange("")}
        className={`${styles.pill} ${!selected ? styles.pillSelected : styles.pillUnselected}`}
      >
        {finalAllLabel}
      </button>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(selected === opt ? "" : opt)}
          className={`${styles.pill} ${selected === opt ? styles.pillSelected : styles.pillUnselected}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
