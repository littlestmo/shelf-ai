"use client";

import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import styles from "./theme-toggle.module.css";

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const next = () => {
    const order: Array<"dark" | "light" | "system"> = [
      "dark",
      "light",
      "system",
    ];
    const current = theme as "dark" | "light" | "system";
    const idx = order.indexOf(current);
    setTheme(order[(idx + 1) % order.length]!);
  };

  if (!mounted) {
    return (
      <button
        className={styles.button}
        aria-label={t("ui.themeToggle.ariaLabel")}
        disabled
      >
        <span className={styles.text} style={{ visibility: "hidden" }}>
          system
        </span>
      </button>
    );
  }

  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <button
      onClick={next}
      className={styles.button}
      aria-label={t("ui.themeToggle.ariaLabel")}
    >
      <Icon size={14} />
      <span className={styles.text}>{theme}</span>
    </button>
  );
}
