"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import {
  useNotifications,
  useMarkNotificationRead,
  useEnsureUser,
} from "@shelf-ai/shared/hooks";
import { NotificationBell } from "@shelf-ai/ui/notification-bell";

export function NotificationBellConnected() {
  const { user } = useUser();
  const dbUser = useEnsureUser(user);
  const notifications = useNotifications(dbUser?.id);
  const markRead = useMarkNotificationRead();

  const sorted = React.useMemo(
    () => [...notifications].sort((a, b) => b.date.localeCompare(a.date)),
    [notifications],
  );

  return <NotificationBell notifications={sorted} onMarkRead={markRead} />;
}
