"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { useEnsureUser } from "@shelf-ai/shared/hooks";

export function UserSyncWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  useEnsureUser(user);
  return <>{children}</>;
}
