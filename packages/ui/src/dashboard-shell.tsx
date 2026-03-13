"use client";

import React, { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Menu,
  X,
  Search,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./dashboard-shell.module.css";

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

export interface DashboardShellProps {
  children: ReactNode;
  menuItems: MenuItem[];
  brandName: string;
  brandSub: string;
  headerRight?: ReactNode;
  sidebarFooter?: ReactNode;
  searchPlaceholder?: string;
}

export function DashboardShell({
  children,
  menuItems,
  brandName,
  brandSub,
  headerRight,
  sidebarFooter,
  searchPlaceholder,
}: DashboardShellProps) {
  const { t } = useTranslation();
  const finalSearchPlaceholder =
    searchPlaceholder || t("ui.dashboardShell.searchPlaceholder");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const sidebarW = isMobile ? 260 : collapsed ? 72 : 240;

  return (
    <div className={styles.dashboardShell}>
      {mobileOpen && isMobile && (
        <div
          onClick={() => setMobileOpen(false)}
          className={styles.mobileOverlay}
          aria-hidden="true"
        />
      )}

      <aside
        className={`${styles.sidebar} ${isMobile && !mobileOpen ? styles.sidebarMobileClosed : styles.sidebarMobileOpen}`}
        style={{ width: sidebarW, minWidth: sidebarW }}
        role="navigation"
        aria-label={t("ui.dashboardShell.mainNav")}
      >
        <div
          className={`${styles.sidebarHeader} ${collapsed && !isMobile ? styles.sidebarHeaderCollapsed : styles.sidebarHeaderExpanded}`}
        >
          <div className={styles.logo}>
            <img
              src="/logo.png"
              alt={t("ui.dashboardShell.brandName") || "Shelf AI"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: 4,
              }}
            />
          </div>
          {(!collapsed || isMobile) && (
            <div>
              <div
                className={styles.brandName}
                dangerouslySetInnerHTML={{ __html: brandName }}
              />
              <div className={styles.brandSub}>{brandSub}</div>
            </div>
          )}
        </div>

        <nav
          className={`${styles.nav} ${collapsed && !isMobile ? styles.navCollapsed : styles.navExpanded}`}
        >
          {menuItems.map((item) => {
            const isActive =
              pathname === item.path || pathname.startsWith(item.path + "/");
            return (
              <Link
                key={item.id}
                href={item.path}
                onClick={() => setMobileOpen(false)}
                title={collapsed && !isMobile ? item.label : undefined}
                className={`${styles.navItem} ${collapsed && !isMobile ? styles.navItemCollapsed : styles.navItemExpanded} ${isActive ? styles.navItemActive : styles.navItemInactive}`}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon
                  size={18}
                  aria-hidden="true"
                  className={styles.navIcon}
                />
                {(!collapsed || isMobile) && item.label}
              </Link>
            );
          })}
        </nav>

        {!isMobile && (
          <div className={styles.collapseContainer}>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={styles.collapseButton}
              aria-label={
                collapsed
                  ? t("ui.dashboardShell.expandSidebar")
                  : t("ui.dashboardShell.collapseSidebar")
              }
            >
              {collapsed ? (
                <ChevronsRight size={16} />
              ) : (
                <ChevronsLeft size={16} />
              )}
            </button>
          </div>
        )}

        {sidebarFooter && (!collapsed || isMobile) && (
          <div className={styles.footer}>{sidebarFooter}</div>
        )}
      </aside>

      <div
        className={styles.mainContent}
        style={{ marginInlineStart: isMobile ? 0 : sidebarW }}
      >
        <header className={styles.header} role="banner">
          <div className={styles.headerLeft}>
            {isMobile && (
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={styles.mobileMenuButton}
                aria-label={t("ui.dashboardShell.toggleSidebar")}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
            <div className={styles.searchContainer}>
              <Search
                size={15}
                color="var(--text-muted)"
                aria-hidden="true"
                className={styles.searchIcon}
              />
              <input
                type="search"
                placeholder={finalSearchPlaceholder}
                className={styles.searchInput}
                aria-label={t("ui.dashboardShell.globalSearch")}
              />
            </div>
          </div>
          <div className={styles.headerRight}>
            {headerRight}
          </div>
        </header>

        <main
          className={`${styles.main} ${isMobile ? styles.mainMobile : styles.mainDesktop}`}
          role="main"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
