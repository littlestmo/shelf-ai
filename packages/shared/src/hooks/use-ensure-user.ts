"use client";

import { useEffect, useMemo, useRef } from "react";
import { useSpacetimeDB } from "../spacetimedb";
import type { DbConnection } from "../module_bindings";

interface ClerkUserInfo {
  id: string;
  fullName: string | null;
  primaryEmailAddress: { emailAddress: string } | null;
  phoneNumbers: Array<{ phoneNumber: string }>;
  imageUrl?: string;
}

export function useEnsureUser(clerkUser: ClerkUserInfo | null | undefined) {
  const { connection, connected } = useSpacetimeDB();
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!clerkUser || !connection || !connected) return;
    if (syncedRef.current === clerkUser.id) return;

    const existing = findUserByClerkId(connection, clerkUser.id);
    if (existing) {
      syncedRef.current = clerkUser.id;
      return;
    }

    const name = clerkUser.fullName || "User";
    const email = clerkUser.primaryEmailAddress?.emailAddress || "";
    const phone = clerkUser.phoneNumbers?.[0]?.phoneNumber || undefined;

    connection.reducers.addUser({
      clerkId: clerkUser.id,
      name,
      email,
      role: { tag: "Member" } as never,
      phone,
      membershipType: { tag: "Basic" } as never,
    });

    syncedRef.current = clerkUser.id;
  }, [clerkUser, connection, connected]);

  return useMemo(() => {
    if (!clerkUser || !connection || !connected) return null;
    return findUserByClerkId(connection, clerkUser.id) ?? null;
  }, [clerkUser, connection, connected]);
}

function findUserByClerkId(conn: DbConnection, clerkId: string) {
  for (const user of conn.db.library_user.iter()) {
    if (user.clerkId === clerkId) return user;
  }
  return undefined;
}
