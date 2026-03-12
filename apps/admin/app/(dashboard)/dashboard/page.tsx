"use client";

import React, { useMemo } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Building2,
  ArrowDown,
} from "lucide-react";
import { StatCard } from "@shelf-ai/ui/stat-card";
import { PageHeader } from "@shelf-ai/ui/page-header";
import {
  useBooks,
  useUsers,
  useBranches,
  useBorrowRecords,
} from "@shelf-ai/shared/hooks";
import { useTranslation } from "react-i18next";
import styles from "./page.module.css";

export default function DashboardPage() {
  const { t } = useTranslation();
  const books = useBooks();
  const users = useUsers();
  useBranches();
  const records = useBorrowRecords();

  const totalBooks = books.length;
  const activeUsers = users.filter((u) => u.status.tag === "Active").length;
  const activeBorrows = records.filter((r) => r.status.tag === "Active").length;
  const overdueCount = records.filter((r) => r.status.tag === "Overdue").length;

  const categoryDist = useMemo(() => {
    const map: Record<string, number> = {};
    books.forEach((b) => {
      map[b.category.tag] = (map[b.category.tag] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [books]);

  const recentRecords = useMemo(() => {
    return [...records]
      .sort((a, b) => b.borrowDate.localeCompare(a.borrowDate))
      .slice(0, 5);
  }, [records]);

  return (
    <main
      className={styles.container}
      role="main"
      aria-label={t("admin.dashboard.title")}
    >
      <PageHeader
        title={t("admin.dashboard.title")}
        subtitle={t("admin.dashboard.subtitle")}
        icon={<LayoutDashboard size={22} />}
      />

      <section
        className={styles.statsGrid}
        aria-label={t("admin.dashboard.statsArea") || "Statistics"}
      >
        <StatCard
          label={t("admin.dashboard.stats.totalBooks")}
          value={totalBooks}
          icon={<BookOpen size={18} color="#f97316" />}
          iconBg="rgba(249,115,22,0.15)"
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          label={t("admin.dashboard.stats.activeUsers")}
          value={activeUsers}
          icon={<Users size={18} color="#3b82f6" />}
          iconBg="rgba(59,130,246,0.15)"
          trend={{ value: 5, positive: true }}
        />
        <StatCard
          label={t("admin.dashboard.stats.activeBorrows")}
          value={activeBorrows}
          icon={<Building2 size={18} color="#8b5cf6" />}
          iconBg="rgba(139,92,246,0.15)"
          trend={{ value: 3, positive: false }}
        />
        <StatCard
          label={t("admin.dashboard.stats.overdue")}
          value={overdueCount}
          icon={<ArrowDown size={18} color="#ef4444" />}
          iconBg="rgba(239,68,68,0.15)"
          trend={{ value: overdueCount, positive: false }}
        />
      </section>

      <section
        className={styles.mainGrid}
        aria-label={t("admin.dashboard.detailsArea") || "Dashboard Details"}
      >
        <article className={styles.card}>
          <h2 className={styles.cardTitle}>
            {t("admin.dashboard.categoryDist")}
          </h2>
          <div className={styles.listCol8}>
            {categoryDist.map(([cat, count]) => (
              <div key={cat} className={styles.distRow}>
                <span className={styles.distLabel}>{cat}</span>
                <div className={styles.distBarTrack}>
                  <div
                    className={styles.distBarFill}
                    style={{ width: `${(count / totalBooks) * 100}%` }}
                  />
                </div>
                <span className={styles.distValue}>{count}</span>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.card}>
          <h2 className={styles.cardTitle}>
            {t("admin.dashboard.recentBorrows")}
          </h2>
          <div className={styles.listCol10}>
            {recentRecords.map((r) => {
              const book = books.find((b) => b.id === r.bookId);
              const user = users.find((u) => u.id === r.userId);
              return (
                <div key={r.id} className={styles.recordRow}>
                  <div>
                    <div className={styles.recordTitle}>
                      {book?.title || r.bookId}
                    </div>
                    <div className={styles.recordSubtitle}>
                      {user?.name || r.userId}
                    </div>
                  </div>
                  <div
                    className={`${styles.recordStatus} ${
                      r.status.tag === "Active"
                        ? styles.statusActive
                        : r.status.tag === "Overdue"
                          ? styles.statusOverdue
                          : styles.statusReturned
                    }`}
                  >
                    {r.status.tag}
                  </div>
                </div>
              );
            })}
            {recentRecords.length === 0 && (
              <p className={styles.emptyText}>
                {t("admin.dashboard.noRecords")}
              </p>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
