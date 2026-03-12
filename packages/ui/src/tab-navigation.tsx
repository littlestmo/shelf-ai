import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./tab-navigation.module.css";

export interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTabId: string;
  onTabChange: (id: string) => void;
  ariaLabel?: string;
}

export function TabNavigation({
  tabs,
  activeTabId,
  onTabChange,
  ariaLabel,
}: TabNavigationProps) {
  const { t } = useTranslation();
  const finalAriaLabel = ariaLabel || t("ui.tabNavigation.ariaLabel");
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let newIndex = index;
    if (e.key === "ArrowRight") {
      newIndex = (index + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      newIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      newIndex = 0;
    } else if (e.key === "End") {
      newIndex = tabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    const tab = tabs[newIndex];
    if (!tab) return;

    onTabChange(tab.id);

    const tabElement = document.getElementById(`tab-${tab.id}`);
    if (tabElement) {
      tabElement.focus();
    }
  };

  return (
    <div role="tablist" aria-label={finalAriaLabel} className={styles.tabList}>
      {tabs.map((tab, index) => {
        const isActive = activeTabId === tab.id;
        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`${styles.badge} ${isActive ? styles.badgeActive : ""}`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
