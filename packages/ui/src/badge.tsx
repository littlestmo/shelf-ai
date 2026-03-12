"use client";

import React from "react";
import styles from "./badge.module.css";

interface BadgeProps {
  label: string;
  color?: string;
  size?: "sm" | "md";
}

export function Badge({ label, color = "#f97316", size = "sm" }: BadgeProps) {
  return (
    <span
      className={`${styles.badge} ${size === "sm" ? styles.sizeSm : styles.sizeMd}`}
      style={{
        background: `${color}20`,
        color,
      }}
      role="status"
    >
      <span
        className={styles.dot}
        style={{ background: color }}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
