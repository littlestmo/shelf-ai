"use client";

import React from "react";
import styles from "./toggle-switch.module.css";

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`${styles.switch} ${checked ? styles.switchChecked : styles.switchUnchecked}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChange(!checked);
        }
      }}
    >
      <div
        className={`${styles.thumb} ${checked ? styles.thumbChecked : styles.thumbUnchecked}`}
      />
    </div>
  );
}
