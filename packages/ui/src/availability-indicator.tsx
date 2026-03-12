import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./availability-indicator.module.css";

export interface AvailabilityIndicatorProps {
  label: string;
  available: boolean;
  size?: number;
}

export function AvailabilityIndicator({
  label,
  available,
  size = 16,
}: AvailabilityIndicatorProps) {
  const { t } = useTranslation();

  return (
    <div
      className={styles.container}
      aria-label={`${label}: ${available ? t("ui.availability.available") : t("ui.availability.unavailable")}`}
      role="status"
    >
      {available ? (
        <CheckCircle2 size={size} color="#22c55e" aria-hidden="true" />
      ) : (
        <XCircle size={size} color="#ef4444" aria-hidden="true" />
      )}
      <span
        className={`${styles.label} ${available ? styles.labelAvailable : styles.labelUnavailable}`}
      >
        {label}
      </span>
    </div>
  );
}
