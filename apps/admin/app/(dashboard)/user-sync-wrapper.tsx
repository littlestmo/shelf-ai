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

  // If user is loaded but no web2 user auth exists, let Clerk's auth protection handle it
  if (!user) return <>{children}</>;

  // Block basic Members from accessing the Admin dashboard
  if (dbUser && dbUser.role.tag === "Member") {
    return (
      <Unauthorized 
        title="Admin Access Required" 
        message="Your account does not have administrator privileges. Please sign in with an admin account or return to the main library dashboard." 
      />
    );
  }

  return <>{children}</>;
}
