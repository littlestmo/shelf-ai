"use client";

import React from "react";
import { UserButton } from "@clerk/nextjs";
import { DashboardShell, type MenuItem } from "@shelf-ai/ui/dashboard-shell";
import { ThemeToggle } from "@shelf-ai/ui/theme-toggle";
import { LanguageToggle } from "@shelf-ai/ui/language-toggle";
import { UserSyncWrapper } from "@shelf-ai/ui/user-sync-wrapper";
import { Sparkles, Upload, User, Home, Search, BookMarked } from "lucide-react";
import { SpacetimeDBProvider } from "@shelf-ai/shared/spacetimedb";
import { useTranslation } from "react-i18next";
import styles from "./layout.module.css";

const SPACETIMEDB_HOST =
  process.env.NEXT_PUBLIC_SPACETIMEDB_URI || "ws://localhost:3000";
const SPACETIMEDB_MODULE =
  process.env.NEXT_PUBLIC_SPACETIMEDB_MODULE || "shelf-ai";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  const MENU: MenuItem[] = React.useMemo(
    () => [
      {
        id: "home",
        label: t("user.layout.menu.home"),
        icon: Home,
        path: "/home",
      },
      {
        id: "search",
        label: t("user.layout.menu.search"),
        icon: Search,
        path: "/search",
      },
      {
        id: "shelf",
        label: t("user.layout.menu.shelf"),
        icon: BookMarked,
        path: "/shelf",
      },
      {
        id: "ai-search",
        label: t("user.layout.menu.aiSearch"),
        icon: Sparkles,
        path: "/ai-search",
      },
      {
        id: "contribute",
        label: t("user.layout.menu.contribute"),
        icon: Upload,
        path: "/contribute",
      },
      {
        id: "profile",
        label: t("user.layout.menu.profile"),
        icon: User,
        path: "/profile",
      },
    ],
    [t],
  );

  return (
    <SpacetimeDBProvider
      host={SPACETIMEDB_HOST}
      moduleName={SPACETIMEDB_MODULE}
    >
      <UserSyncWrapper>
        <DashboardShell
          menuItems={MENU}
          brandName={`${t("user.layout.brandPrefix")}<span class="${styles.brandHighlight}">${t("user.layout.brandHighlight")}</span>`}
          brandSub={t("user.layout.brandSub")}
          searchPlaceholder={t("user.layout.searchPlaceholder")}
          headerRight={
            <>
              <ThemeToggle />
              <LanguageToggle />
              <UserButton
                appearance={{
                  elements: { avatarBox: { width: 34, height: 34 } },
                }}
              />
            </>
          }
          sidebarFooter={
            <div className={styles.footerContainer}>
              <span className={styles.footerLink}>
                {t("user.layout.footer.about")}
              </span>
              <span className={styles.footerLink}>
                {t("user.layout.footer.support")}
              </span>
              <span className={styles.footerTerms}>
                {t("user.layout.footer.terms")}
              </span>
            </div>
          }
        >
          {children}
        </DashboardShell>
      </UserSyncWrapper>
    </SpacetimeDBProvider>
  );
}

