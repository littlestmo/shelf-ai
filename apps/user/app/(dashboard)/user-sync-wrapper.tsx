"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { useEnsureUser } from "@shelf-ai/shared/hooks";
import { Unauthorized } from "@shelf-ai/ui/unauthorized";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export function UserSyncWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const dbUser = useEnsureUser(user);
  const { t } = useTranslation();

  if (!isLoaded) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!user) return <>{children}</>;

  if (
    dbUser &&
    (dbUser.role.tag === "Admin" || dbUser.role.tag === "Librarian")
  ) {
    return (
      <Unauthorized
        title={t("user.auth.unauthorized.title")}
        message={t("user.auth.unauthorized.message")}
        signOutLabel={t("ui.unauthorized.signOut")}
      />
    );
  }

  if (dbUser && dbUser.status.tag === "Suspended") {
    return (
      <Unauthorized
        title={t("user.auth.suspended.title") || "Account Suspended"}
        message={
          t("user.auth.suspended.message") ||
          "Your account has been suspended. Please contact the administrator."
        }
        signOutLabel={t("ui.unauthorized.signOut")}
      />
    );
  }

  return <>{children}</>;
}
