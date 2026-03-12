"use client";

import React, { type ReactNode } from "react";
import styles from "./info-card.module.css";

export interface InfoCardProps {
  icon: ReactNode;
  iconBg: string;
  label: string;
  value: string | number;
  subtitle?: string;
  animationDelay?: string;
}

export function InfoCard({
  icon,
  iconBg,
  label,
  value,
  subtitle,
  animationDelay = "0s",
}: InfoCardProps) {
  return (
    <div className={styles.card} style={{ animationDelay }}>
      <div className={styles.iconWrapper} style={{ background: iconBg }}>
        {icon}
      </div>
      <div>
        <div className={styles.value}>{value}</div>
        <div className={styles.label}>{label}</div>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
    </div>
  );
}
