"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./notification-bell.module.css";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  notificationType: { tag: string };
}

interface NotificationBellProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
}

export function NotificationBell({ notifications, onMarkRead }: NotificationBellProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  };

  const typeColor = (tag: string) => {
    switch (tag) {
      case "Overdue":
        return "#ef4444";
      case "Available":
        return "#10b981";
      case "Reminder":
        return "#f97316";
      default:
        return "#8b5cf6";
    }
  };

  return (
    <div className={styles.container} ref={ref} onKeyDown={handleKeyDown}>
      <button
        className={styles.bellButton}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={t("ui.notifications.bellLabel") || `Notifications (${unreadCount} unread)`}
        aria-expanded={open}
        aria-haspopup="true"
        type="button"
      >
        <Bell size={20} aria-hidden="true" />
        {unreadCount > 0 && (
          <span className={styles.badge} aria-hidden="true">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className={styles.dropdown}
          role="region"
          aria-label={t("ui.notifications.panelLabel") || "Notifications panel"}
          aria-live="polite"
        >
          <div className={styles.dropdownHeader}>
            <h3 className={styles.dropdownTitle}>
              {t("ui.notifications.title") || "Notifications"}
            </h3>
            <button
              className={styles.closeBtn}
              onClick={() => setOpen(false)}
              aria-label={t("ui.notifications.close") || "Close notifications"}
              type="button"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          <div className={styles.listContainer} role="list">
            {notifications.length === 0 && (
              <div className={styles.emptyState} role="status">
                {t("ui.notifications.empty") || "No notifications"}
              </div>
            )}
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`${styles.notifItem} ${!notif.read ? styles.notifItemUnread : ""}`}
                role="listitem"
              >
                <div
                  className={styles.notifDot}
                  style={{ background: typeColor(notif.notificationType.tag) }}
                  aria-hidden="true"
                />
                <div className={styles.notifContent}>
                  <div className={styles.notifTitle}>{notif.title}</div>
                  <div className={styles.notifMessage}>{notif.message}</div>
                  <div className={styles.notifDate}>{notif.date}</div>
                </div>
                {!notif.read && (
                  <button
                    className={styles.markReadBtn}
                    onClick={() => onMarkRead(notif.id)}
                    aria-label={`Mark "${notif.title}" as read`}
                    type="button"
                  >
                    <Check size={14} aria-hidden="true" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
