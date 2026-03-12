"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { Library, CheckCircle } from "lucide-react";
import { DataTable } from "@shelf-ai/ui/data-table";
import { PageHeader } from "@shelf-ai/ui/page-header";
import { SearchInput } from "@shelf-ai/ui/search-input";
import { FilterPills } from "@shelf-ai/ui/filter-pills";
import { InfoCard } from "@shelf-ai/ui/info-card";
import { Badge } from "@shelf-ai/ui/badge";
import { Modal } from "@shelf-ai/ui/modal";
import { Button } from "@shelf-ai/ui/button";
import {
  useBorrowRecords,
  useBooks,
  useUsers,
  useCheckinBook,
} from "@shelf-ai/shared/hooks";
import { useTranslation } from "react-i18next";
import styles from "./page.module.css";

type RecordRow = ReturnType<typeof useBorrowRecords>[number];

const STATUSES = ["Active", "Returned", "Overdue"];
const STATUS_COLORS: Record<string, string> = {
  Active: "var(--stat-blue)",
  Returned: "var(--stat-green)",
  Overdue: "var(--stat-red)",
};

export default function CatalogPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("q") || "";
  const statusFilter = searchParams.get("status") || "";

  const records = useBorrowRecords();
  const books = useBooks();
  const users = useUsers();
  const checkinBook = useCheckinBook();
  const [checkinId, setCheckinId] = useState<string | null>(null);

  const getBookTitle = React.useCallback(
    (bookId: string) => books.find((b) => b.id === bookId)?.title || bookId,
    [books],
  );
  const getUserName = React.useCallback(
    (userId: string) => users.find((u) => u.id === userId)?.name || userId,
    [users],
  );

  const filtered = useMemo(() => {
    let result = records;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          getBookTitle(r.bookId).toLowerCase().includes(q) ||
          getUserName(r.userId).toLowerCase().includes(q),
      );
    }
    if (statusFilter) {
      result = result.filter((r) => r.status.tag === statusFilter);
    }
    return result;
  }, [records, search, statusFilter, getBookTitle, getUserName]);

  const activeCount = records.filter((r) => r.status.tag === "Active").length;
  const overdueCount = records.filter((r) => r.status.tag === "Overdue").length;
  const returnedCount = records.filter(
    (r) => r.status.tag === "Returned",
  ).length;

  const setSearch = (q: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set("q", q);
    else params.delete("q");
    router.replace(`/catalog?${params.toString()}`);
  };

  const setStatus = (s: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (s) params.set("status", s);
    else params.delete("status");
    router.replace(`/catalog?${params.toString()}`);
  };

  const columns: ColumnDef<RecordRow, unknown>[] = useMemo(
    () => [
      {
        accessorKey: "bookId",
        header: t("admin.catalog.columns.book"),
        cell: ({ row }) => (
          <span className={styles.boldText}>
            {getBookTitle(row.original.bookId)}
          </span>
        ),
      },
      {
        accessorKey: "userId",
        header: t("admin.catalog.columns.user"),
        cell: ({ row }) => <span>{getUserName(row.original.userId)}</span>,
      },
      {
        accessorKey: "borrowDate",
        header: t("admin.catalog.columns.borrowDate"),
      },
      { accessorKey: "dueDate", header: t("admin.catalog.columns.dueDate") },
      {
        accessorKey: "status",
        header: t("admin.catalog.columns.status"),
        cell: ({ row }) => {
          const tag = row.original.status.tag;
          return (
            <Badge
              label={tag}
              color={STATUS_COLORS[tag] || "var(--text-muted)"}
            />
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) =>
          row.original.status.tag !== "Returned" ? (
            <Button
              variant="secondary"
              onClick={() => setCheckinId(row.original.id)}
              className={styles.actionButton}
              aria-label={`${t("admin.catalog.actions.checkIn")} for ${getBookTitle(row.original.bookId)}`}
            >
              <CheckCircle size={14} aria-hidden="true" />{" "}
              {t("admin.catalog.actions.checkIn")}
            </Button>
          ) : null,
      },
    ],
    [getBookTitle, getUserName, t],
  );

  return (
    <main
      className={styles.container}
      role="main"
      aria-label={t("admin.catalog.title")}
    >
      <PageHeader
        title={t("admin.catalog.title")}
        subtitle={t("admin.catalog.subtitle")}
        icon={<Library size={22} />}
      />

      <section
        className={styles.statsGrid}
        aria-label={t("admin.catalog.statsArea") || "Catalog Statistics"}
      >
        <InfoCard
          icon={<Library size={16} color="#3b82f6" />}
          iconBg="rgba(59,130,246,0.15)"
          label={t("admin.catalog.stats.active")}
          value={activeCount}
        />
        <InfoCard
          icon={<CheckCircle size={16} color="#22c55e" />}
          iconBg="rgba(34,197,94,0.15)"
          label={t("admin.catalog.stats.returned")}
          value={returnedCount}
          animationDelay="0.05s"
        />
        <InfoCard
          icon={<Library size={16} color="#ef4444" />}
          iconBg="rgba(239,68,68,0.15)"
          label={t("admin.catalog.stats.overdue")}
          value={overdueCount}
          animationDelay="0.1s"
        />
        <InfoCard
          icon={<Library size={16} color="#f97316" />}
          iconBg="rgba(249,115,22,0.15)"
          label={t("admin.catalog.stats.total")}
          value={records.length}
          animationDelay="0.15s"
        />
      </section>

      <section
        className={styles.searchFilterContainer}
        aria-label={t("admin.catalog.searchArea") || "Search and Filters"}
      >
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t("admin.catalog.search")}
        />
        <FilterPills
          options={STATUSES}
          selected={statusFilter}
          onChange={setStatus}
        />
      </section>

      <section aria-label={t("admin.catalog.tableArea") || "Catalog Data"}>
        <DataTable
          columns={columns}
          data={filtered}
          pageSize={10}
          emptyMessage={t("admin.catalog.noRecords")}
        />

        <Modal
          isOpen={!!checkinId}
          onClose={() => setCheckinId(null)}
          title={t("admin.catalog.modal.title")}
        >
          <p className={styles.modalText}>{t("admin.catalog.modal.confirm")}</p>
          <div className={styles.modalActions}>
            <Button variant="secondary" onClick={() => setCheckinId(null)}>
              {t("admin.catalog.modal.cancel")}
            </Button>
            <Button
              onClick={() => {
                if (checkinId) checkinBook(checkinId);
                setCheckinId(null);
              }}
            >
              {t("admin.catalog.modal.submit")}
            </Button>
          </div>
        </Modal>
      </section>
    </main>
  );
}
