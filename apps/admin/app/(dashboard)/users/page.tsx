"use client";

import React, { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { Users as UsersIcon, UserCheck, UserX } from "lucide-react";
import { DataTable } from "@shelf-ai/ui/data-table";
import { PageHeader } from "@shelf-ai/ui/page-header";
import { SearchInput } from "@shelf-ai/ui/search-input";
import { FilterPills } from "@shelf-ai/ui/filter-pills";
import { Badge } from "@shelf-ai/ui/badge";
import { Button } from "@shelf-ai/ui/button";
import {
  useUsers,
  useSuspendUser,
  useActivateUser,
} from "@shelf-ai/shared/hooks";
import { useTranslation } from "react-i18next";
import styles from "./page.module.css";

type UserRow = ReturnType<typeof useUsers>[number];

const ROLES = ["Librarian", "Member"];
const ROLE_COLORS: Record<string, string> = {
  Admin: "#f97316",
  Librarian: "#8b5cf6",
  Member: "#3b82f6",
};

export default function UsersPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("q") || "";
  const roleFilter = searchParams.get("role") || "";

  const users = useUsers();
  const suspendUser = useSuspendUser();
  const activateUser = useActivateUser();

  const uniqueUsers = useMemo(() => {
    const seen = new Set<string>();
    const unique: typeof users = [];
    for (const u of users) {
      if (!seen.has(u.clerkId)) {
        seen.add(u.clerkId);
        unique.push(u);
      }
    }
    return unique;
  }, [users]);

  const filtered = useMemo(() => {
    let result = uniqueUsers.filter((u) => u.role.tag !== "Admin");
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      );
    }
    if (roleFilter) {
      result = result.filter((u) => u.role.tag === roleFilter);
    }
    return result;
  }, [uniqueUsers, search, roleFilter]);

  const setSearch = (q: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set("q", q);
    else params.delete("q");
    router.replace(`/users?${params.toString()}`);
  };

  const setRole = (r: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (r) params.set("role", r);
    else params.delete("role");
    router.replace(`/users?${params.toString()}`);
  };

  const columns: ColumnDef<UserRow, unknown>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: t("admin.users.columns.user"),
        cell: ({ row }) => {
          const initials = row.original.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
          return (
            <div className={styles.userCell}>
              <div className={styles.avatar}>{initials}</div>
              <div>
                <div className={styles.userName}>{row.original.name}</div>
                <div className={styles.userEmail}>{row.original.email}</div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "role",
        header: t("admin.users.columns.role"),
        cell: ({ row }) => {
          const role = row.original.role.tag;
          return (
            <Badge
              label={role}
              color={ROLE_COLORS[role] || "var(--text-muted)"}
            />
          );
        },
      },
      {
        accessorKey: "membershipType",
        header: t("admin.users.columns.membership"),
        cell: ({ row }) => (
          <span className={styles.membershipText}>
            {row.original.membershipType.tag}
          </span>
        ),
      },
      {
        accessorKey: "borrowLimit",
        header: t("admin.users.columns.limit"),
        cell: ({ getValue }) => <span>{getValue() as number}</span>,
      },
      {
        accessorKey: "status",
        header: t("admin.users.columns.status"),
        cell: ({ row }) => {
          const status = row.original.status.tag;
          return (
            <Badge
              label={status}
              color={
                status === "Active" ? "var(--stat-green)" : "var(--stat-red)"
              }
            />
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className={styles.actionCell}>
            {row.original.status.tag === "Active" ? (
              <Button
                variant="secondary"
                onClick={() => suspendUser(row.original.id)}
                className={`${styles.actionButton} ${styles.suspendButton}`}
                aria-label={`${t("admin.users.actions.suspend")} ${row.original.name}`}
              >
                <UserX size={14} aria-hidden="true" />{" "}
                {t("admin.users.actions.suspend")}
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={() => activateUser(row.original.id)}
                className={`${styles.actionButton} ${styles.activateButton}`}
                aria-label={`${t("admin.users.actions.activate")} ${row.original.name}`}
              >
                <UserCheck size={14} aria-hidden="true" />{" "}
                {t("admin.users.actions.activate")}
              </Button>
            )}
          </div>
        ),
      },
    ],
    [suspendUser, activateUser, t],
  );

  return (
    <main
      className={styles.container}
      role="main"
      aria-label={t("admin.users.title")}
    >
      <PageHeader
        title={t("admin.users.title")}
        subtitle={t("admin.users.subtitle", { count: uniqueUsers.length })}
        icon={<UsersIcon size={22} />}
      />

      <section
        className={styles.searchFilterContainer}
        aria-label={t("admin.users.searchArea") || "Search and Filter Users"}
      >
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t("admin.users.search")}
        />
        <FilterPills options={ROLES} selected={roleFilter} onChange={setRole} />
      </section>

      <section aria-label={t("admin.users.tableArea") || "Users Data"}>
        <DataTable
          columns={columns}
          data={filtered}
          pageSize={10}
          emptyMessage={t("admin.users.noUsers")}
        />
      </section>
    </main>
  );
}
