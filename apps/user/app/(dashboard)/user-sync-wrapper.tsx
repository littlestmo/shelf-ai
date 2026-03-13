"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { useEnsureUser } from "@shelf-ai/shared/hooks";
import { Unauthorized } from "@shelf-ai/ui/unauthorized";
import { Loader2 } from "lucide-react";

export function UserSyncWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const dbUser = useEnsureUser(user);

  if (!isLoaded) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  // Let Clerk handle normal unauthenticated cases
  if (!user) return <>{children}</>;

  // Block Admins and Librarians from the User dashboard
  if (dbUser && (dbUser.role.tag === "Admin" || dbUser.role.tag === "Librarian")) {
    return (
      <Unauthorized 
        title="Administrative Account" 
        message="You are signed in as an administrator. This dashboard is intended for library members only. Please use the Admin panel." 
      />
    );
  }

  return <>{children}</>;
}
