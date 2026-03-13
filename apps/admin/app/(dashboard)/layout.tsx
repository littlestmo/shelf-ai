"use client";

import React from "react";
import { UserButton } from "@clerk/nextjs";
import { DashboardShell } from "@shelf-ai/ui/dashboard-shell";
import { ThemeToggle } from "@shelf-ai/ui/theme-toggle";
import { LanguageToggle } from "@shelf-ai/ui/language-toggle";
import { UserSyncWrapper } from "./user-sync-wrapper";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Building2,
  Library,
  Sparkles,
} from "lucide-react";
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

  const MENU = [
    {
      id: "dashboard",
      label: t("admin.layout.dashboard"),
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      id: "books",
      label: t("admin.layout.books"),
      icon: BookOpen,
      path: "/books",
    },
    {
      id: "users",
      label: t("admin.layout.users"),
      icon: Users,
      path: "/users",
    },
    {
      id: "branches",
      label: t("admin.layout.branches"),
      icon: Building2,
      path: "/branches",
    },
    {
      id: "catalog",
      label: t("admin.layout.catalog"),
      icon: Library,
      path: "/catalog",
    },
    {
      id: "ai-generate",
      label: t("admin.layout.aiGenerate"),
      icon: Sparkles,
      path: "/ai-generate",
    },
  ];

  return (
    <SpacetimeDBProvider
      host={SPACETIMEDB_HOST}
      moduleName={SPACETIMEDB_MODULE}
    >
      <UserSyncWrapper>
        <DashboardShell
          menuItems={MENU}
          brandName={`Shelf <span class="${styles.brandHighlight}">AI</span>`}
          brandSub={t("admin.layout.brandSub")}
          searchPlaceholder={t("admin.layout.searchPlaceholder")}
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
            <div className={styles.footer}>{t("admin.layout.footer")}</div>
          }
        >
          {children}
        </DashboardShell>
      </UserSyncWrapper>
    </SpacetimeDBProvider>
  );
}
