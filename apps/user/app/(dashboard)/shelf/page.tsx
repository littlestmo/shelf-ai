"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Library,
  LayoutGrid,
  List,
  AlertTriangle,
  Clock,
  Star,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import {
  useBooks,
  useBorrowRecords,
  useCheckinBook,
  useRenewBook,
  useAddRating,
  useUsers,
} from "@shelf-ai/shared/hooks";
import { BookCover } from "@shelf-ai/ui/book-cover";
import { Badge } from "@shelf-ai/ui/badge";
import { Button } from "@shelf-ai/ui/button";
import { ReturnFormModal } from "@shelf-ai/ui/return-form-modal";
import { RenewFormModal } from "@shelf-ai/ui/renew-form-modal";
import { BookShelf3D } from "@shelf-ai/ui/book-shelf-3d";
import { useUser } from "@clerk/nextjs";
import { useTranslation } from "react-i18next";
import styles from "./page.module.css";

type ViewMode = "shelf" | "list";
type StatusFilter = "all" | "active" | "overdue" | "returned";

const STATUS_TABS: { key: StatusFilter; label: string; color: string }[] = [
  { key: "all", label: "All", color: "var(--text-primary)" },
  { key: "active", label: "Active", color: "var(--stat-blue)" },
  { key: "overdue", label: "Overdue", color: "var(--stat-red)" },
  { key: "returned", label: "Returned", color: "var(--stat-green)" },
];

export default function ShelfPage() {
  const { t } = useTranslation();
  const books = useBooks();
  const records = useBorrowRecords();
  const checkinBook = useCheckinBook();
  const renewBook = useRenewBook();
  const addRating = useAddRating();
  const router = useRouter();
  const { user } = useUser();
  const users = useUsers();
  const dbUser = React.useMemo(() => {
    if (!user || !users) return null;
    return users.find((u) => u.clerkId === user.id);
  }, [user, users]);

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [returnModal, setReturnModal] = useState<{
    open: boolean;
    recordId: string;
    bookId: string;
    bookTitle: string;
    isOverdue: boolean;
    fine: number;
  }>({
    open: false,
    recordId: "",
    bookId: "",
    bookTitle: "",
    isOverdue: false,
    fine: 0,
  });
  const [renewModal, setRenewModal] = useState<{
    open: boolean;
    recordId: string;
    bookTitle: string;
    currentDueDate: string;
    renewCount: number;
  }>({
    open: false,
    recordId: "",
    bookTitle: "",
    currentDueDate: "",
    renewCount: 0,
  });

  const userRecords = useMemo(() => {
    const filtered = records.filter((r) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "active") return r.status.tag === "Active";
      if (statusFilter === "overdue") return r.status.tag === "Overdue";
      if (statusFilter === "returned") return r.status.tag === "Returned";
      return true;
    });
    return filtered.sort((a, b) => {
      const order: Record<string, number> = {
        Overdue: 0,
        Active: 1,
        Returned: 2,
      };
      return (order[a.status.tag] ?? 3) - (order[b.status.tag] ?? 3);
    });
  }, [records, statusFilter]);

  const shelfBooks = useMemo(() => {
    return records
      .filter((r) => r.status.tag === "Active" || r.status.tag === "Overdue")
      .map((r) => {
        const b = books.find((book) => book.id === r.bookId);
        if (!b) return null;
        return {
          id: b.id,
          title: b.title,
          author: b.author,
          category: b.category.tag,
          pages: b.pages ?? 200,
          rating: b.rating,
        };
      })
      .filter(Boolean) as Array<{
      id: string;
      title: string;
      author: string;
      category: string;
      pages: number;
      rating: number;
    }>;
  }, [records, books]);

  const overdueCnt = records.filter((r) => r.status.tag === "Overdue").length;
  const activeCnt = records.filter((r) => r.status.tag === "Active").length;

  const getDaysUntilDue = (dueDate: string): number => {
    const now = new Date();
    const due = new Date(dueDate);
    return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleReturn = (recordId: string) => {
    const record = records.find((r) => r.id === recordId);
    const book = record ? books.find((b) => b.id === record.bookId) : null;
    setReturnModal({
      open: true,
      recordId,
      bookId: book?.id || "",
      bookTitle: book?.title || t("user.shelf.record.unknownBook"),
      isOverdue: record?.status.tag === "Overdue",
      fine: record?.fine ?? 0,
    });
  };

  const handleRenew = (recordId: string) => {
    const record = records.find((r) => r.id === recordId);
    const book = record ? books.find((b) => b.id === record.bookId) : null;
    setRenewModal({
      open: true,
      recordId,
      bookTitle: book?.title || t("user.shelf.record.unknownBook"),
      currentDueDate: record?.dueDate || "",
      renewCount: record?.renewCount || 0,
    });
  };

  return (
    <main className={styles.mainContainer} role="region" aria-label="My Shelf">
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>
            <Library
              size={22}
              className={styles.titleIcon}
              aria-hidden="true"
            />
            {t("user.shelf.title")}
          </h1>
          <p className={styles.statsText}>
            {t("user.shelf.stats", { active: activeCnt, overdue: overdueCnt })}
          </p>
        </div>

        <div
          className={styles.viewModeGroup}
          role="radiogroup"
          aria-label="View mode"
        >
          {(
            [
              {
                key: "shelf" as ViewMode,
                icon: LayoutGrid,
                label: t("user.shelf.view.shelf"),
              },
              {
                key: "list" as ViewMode,
                icon: List,
                label: t("user.shelf.view.list"),
              },
            ] as const
          ).map((v) => (
            <Button
              key={v.key}
              variant="ghost"
              onClick={() => setViewMode(v.key)}
              role="radio"
              aria-checked={viewMode === v.key}
              aria-label={v.label}
              className={`${styles.viewModeBtn} ${viewMode === v.key ? styles.viewModeBtnActive : ""}`}
            >
              <v.icon size={14} aria-hidden="true" />
              {v.label}
            </Button>
          ))}
        </div>
      </div>

      {overdueCnt > 0 && (
        <div className={styles.overdueAlert} role="alert">
          <AlertTriangle size={18} color="#ef4444" aria-hidden="true" />
          <div>
            <div className={styles.overdueAlertTitle}>
              {t("user.shelf.alerts.overdueTitle", { count: overdueCnt })}
            </div>
            <div className={styles.overdueAlertDesc}>
              {t("user.shelf.alerts.overdueDesc")}
            </div>
          </div>
        </div>
      )}

      {viewMode === "shelf" && (
        <BookShelf3D
          books={shelfBooks}
          onBookClick={(id) => router.push(`/book/${id}`)}
        />
      )}

      {viewMode === "list" && (
        <>
          <nav aria-label="Filter by status" className={styles.filterNav}>
            {STATUS_TABS.map((tab) => (
              <Button
                key={tab.key}
                variant="ghost"
                onClick={() => setStatusFilter(tab.key)}
                className={`${styles.filterBtn} ${statusFilter === tab.key ? styles.filterBtnActive : ""}`}
                aria-pressed={statusFilter === tab.key}
              >
                {tab.key === "all"
                  ? t("user.shelf.filters.all")
                  : tab.key === "active"
                    ? t("user.shelf.filters.active")
                    : tab.key === "overdue"
                      ? t("user.shelf.filters.overdue")
                      : t("user.shelf.filters.returned")}
              </Button>
            ))}
          </nav>

          <div className={styles.listContainer} role="list">
            {userRecords.length === 0 && (
              <div className={styles.emptyState} role="status">
                {t("user.shelf.emptyState")}
              </div>
            )}

            {userRecords.map((record, idx) => {
              const book = books.find((b) => b.id === record.bookId);
              if (!book) return null;
              const isOverdue = record.status.tag === "Overdue";
              const isReturned = record.status.tag === "Returned";
              const daysLeft = getDaysUntilDue(record.dueDate);
              const dueSoon = !isReturned && daysLeft <= 3 && daysLeft > 0;

              return (
                <article
                  key={record.id}
                  className={`${styles.recordCard} ${isOverdue ? styles.recordCardOverdue : ""}`}
                  style={{ animation: `fadeIn 0.3s ease ${idx * 0.04}s both` }}
                  onClick={() => router.push(`/book/${book.id}`)}
                  role="listitem"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      router.push(`/book/${book.id}`);
                  }}
                >
                  <BookCover title={book.title} size="md" />

                  <div className={styles.bookInfoCol}>
                    <div className={styles.bookTitle}>{book.title}</div>
                    <div className={styles.bookAuthor}>{book.author}</div>
                    <div className={styles.badgesRow}>
                      <Badge
                        label={record.status.tag}
                        color={
                          isOverdue
                            ? "#ef4444"
                            : isReturned
                              ? "#10b981"
                              : "#3b82f6"
                        }
                      />
                      <Badge label={book.category.tag} color="var(--accent)" />
                      {!isReturned && (
                        <span
                          className={`${styles.clockText} ${isOverdue ? styles.clockTextOverdue : dueSoon ? styles.clockTextDueSoon : styles.clockTextNormal}`}
                        >
                          <Clock size={11} aria-hidden="true" />
                          {isOverdue
                            ? t("user.shelf.record.overdueDays", {
                                days: Math.abs(daysLeft),
                              })
                            : t("user.shelf.record.daysLeft", {
                                days: daysLeft,
                              })}
                        </span>
                      )}
                      {isReturned && record.returnDate && (
                        <span className={styles.returnedText}>
                          {t("user.shelf.record.returnedOn", {
                            date: record.returnDate,
                          })}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.actionsCol}>
                    <div
                      className={styles.ratingText}
                      aria-label={`Rating: ${book.rating}`}
                    >
                      <Star size={11} fill="currentColor" aria-hidden="true" />
                      {book.rating.toFixed(1)}
                    </div>
                    {!isReturned && (
                      <div
                        className={styles.buttonsRow}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          onClick={() => handleRenew(record.id)}
                          className={styles.actionBtnRenew}
                          aria-label={`Renew ${book.title}`}
                        >
                          <RotateCcw size={11} aria-hidden="true" />
                          {t("user.shelf.record.renew")}
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => handleReturn(record.id)}
                          className={styles.actionBtnReturn}
                          aria-label={`Return ${book.title}`}
                        >
                          <BookOpen size={11} aria-hidden="true" />
                          {t("user.shelf.record.return")}
                        </Button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      <ReturnFormModal
        isOpen={returnModal.open}
        onClose={() =>
          setReturnModal({
            open: false,
            recordId: "",
            bookId: "",
            bookTitle: "",
            isOverdue: false,
            fine: 0,
          })
        }
        bookTitle={returnModal.bookTitle}
        isOverdue={returnModal.isOverdue}
        fineAmount={returnModal.fine}
        onSubmit={(rating) => {
          checkinBook(returnModal.recordId);
          if (rating > 0 && dbUser?.id) {
            addRating(returnModal.bookId, dbUser.id, rating);
          }
        }}
      />

      <RenewFormModal
        isOpen={renewModal.open}
        onClose={() =>
          setRenewModal({
            open: false,
            recordId: "",
            bookTitle: "",
            currentDueDate: "",
            renewCount: 0,
          })
        }
        bookTitle={renewModal.bookTitle}
        currentDueDate={renewModal.currentDueDate}
        renewCount={renewModal.renewCount}
        maxRenewals={3}
        onSubmit={(newDueDate) => {
          renewBook(renewModal.recordId, newDueDate);
        }}
      />
    </main>
  );
}
