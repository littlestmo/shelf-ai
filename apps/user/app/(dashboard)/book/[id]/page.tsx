"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  MapPin,
  Star,
  Calendar,
  Building2,
  Hash,
  Globe2,
  Layers,
  BookMarked,
  Headphones,
  Eye,
} from "lucide-react";
import {
  useBooks,
  useBorrowRecords,
  useCheckoutBook,
  useBranches,
} from "@shelf-ai/shared/hooks";
import { BookCover } from "@shelf-ai/ui/book-cover";
import { Badge } from "@shelf-ai/ui/badge";
import { Button } from "@shelf-ai/ui/button";
import { BorrowFormModal } from "@shelf-ai/ui/borrow-form-modal";
import { useUser } from "@clerk/nextjs";
import { useTranslation } from "react-i18next";
import styles from "./page.module.css";

export default function BookDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const books = useBooks();
  const records = useBorrowRecords();
  const branches = useBranches();
  const checkoutBook = useCheckoutBook();
  const { user } = useUser();
  const [borrowOpen, setBorrowOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "details">(
    "overview",
  );
  const [liveMsg, setLiveMsg] = useState("");

  const bookId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : "";

  const book = useMemo(
    () => books.find((b) => b.id === bookId),
    [books, bookId],
  );

  const branch = useMemo(
    () => (book ? branches.find((br) => br.id === book.branchId) : null),
    [branches, book],
  );

  const activeRecord = useMemo(
    () =>
      records.find(
        (r) =>
          r.bookId === bookId &&
          r.userId === user?.id &&
          (r.status.tag === "Active" || r.status.tag === "Overdue"),
      ),
    [records, bookId, user],
  );

  if (!book) {
    return (
      <div className={styles.notFoundContainer} role="status">
        <BookOpen
          size={48}
          className={styles.notFoundIcon}
          aria-hidden="true"
        />
        <h2 className={styles.notFoundTitle}>
          {t("user.bookDetails.notFound")}
        </h2>
        <Button variant="secondary" onClick={() => router.push("/search")}>
          {t("user.bookDetails.browseLibrary")}
        </Button>
      </div>
    );
  }

  const isAvailable = book.availableCopies > 0;

  const handleBorrow = (data: {
    dueDate: string;
    format: string;
    purpose: string;
  }) => {
    checkoutBook(book.id, user?.id || "", book.branchId, data.dueDate);
    setLiveMsg(t("user.bookDetails.issuedMsg", { title: book.title }));
  };

  const formatList = book.format.map((f: { tag: string }) => {
    if (f.tag === "Ebook") return t("user.bookDetails.formats.ebook");
    if (f.tag === "Audiobook") return t("user.bookDetails.formats.audiobook");
    return t("user.bookDetails.formats.hardcopy");
  });

  return (
    <main
      className={styles.mainContainer}
      role="region"
      aria-label={`Book details: ${book.title}`}
    >
      <div aria-live="polite" aria-atomic="true" className={styles.liveMessage}>
        {liveMsg}
      </div>

      <Button
        variant="ghost"
        onClick={() => router.back()}
        className={styles.backButton}
        aria-label="Go back"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        {t("user.bookDetails.back")}
      </Button>

      <div className={styles.bookContent}>
        <div className={styles.coverContainer}>
          <BookCover title={book.title} size="lg" />
        </div>

        <div className={styles.detailsContainer}>
          <div>
            <div className={styles.badges}>
              <Badge label={book.category.tag} color="var(--accent)" />
              <Badge
                label={book.status.tag}
                color={isAvailable ? "var(--stat-green)" : "var(--stat-red)"}
              />
              {formatList.map((f: string) => (
                <Badge key={f} label={f} color="var(--stat-blue)" />
              ))}
            </div>
            <h1 className={styles.bookTitle}>{book.title}</h1>
            <div className={styles.bookAuthor}>
              {t("user.bookDetails.by")} <strong>{book.author}</strong>
            </div>
          </div>

          <div className={styles.metaInfo}>
            <span className={styles.rating}>
              <Star size={15} fill="currentColor" aria-hidden="true" />
              {book.rating.toFixed(1)}
            </span>
            <span className={styles.metaItem}>
              <Calendar size={13} aria-hidden="true" />
              {new Date(book.publishedDate).getFullYear()}
            </span>
            <span className={styles.metaItem}>
              <BookOpen size={13} aria-hidden="true" />
              {book.pages
                ? t("user.bookDetails.pages", { count: book.pages })
                : t("user.bookDetails.na")}
            </span>
            <span
              className={`${styles.availability} ${isAvailable ? styles.availabilityAvailable : styles.availabilityUnavailable}`}
            >
              {t("user.bookDetails.availability", {
                available: book.availableCopies,
                total: book.totalCopies,
              })}
            </span>
          </div>

          {book.description && (
            <p className={styles.description}>{book.description}</p>
          )}

          <div className={styles.actions}>
            {!activeRecord && isAvailable && (
              <Button onClick={() => setBorrowOpen(true)}>
                <BookMarked
                  size={15}
                  className={styles.actionIcon}
                  aria-hidden="true"
                />
                {t("user.bookDetails.actions.borrow")}
              </Button>
            )}
            {activeRecord && (
              <Button variant="secondary" disabled>
                <Clock
                  size={15}
                  className={styles.actionIcon}
                  aria-hidden="true"
                />
                {t("user.bookDetails.actions.alreadyBorrowed")}
              </Button>
            )}
            {!isAvailable && !activeRecord && (
              <Button variant="secondary" disabled>
                <Clock
                  size={15}
                  className={styles.actionIcon}
                  aria-hidden="true"
                />
                {t("user.bookDetails.actions.unavailable")}
              </Button>
            )}
            {book.format.some((f: { tag: string }) => f.tag === "Ebook") && (
              <Button
                variant="secondary"
                onClick={() => router.push(`/read/${book.id}`)}
              >
                <Eye
                  size={15}
                  className={styles.actionIcon}
                  aria-hidden="true"
                />
                {t("user.bookDetails.actions.readEbook")}
              </Button>
            )}
            {book.format.some(
              (f: { tag: string }) => f.tag === "Audiobook",
            ) && (
              <Button variant="secondary" disabled>
                <Headphones
                  size={15}
                  className={styles.actionIcon}
                  aria-hidden="true"
                />
                {t("user.bookDetails.actions.audiobook")}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.tabsList} role="tablist">
        {(["overview", "details"] as const).map((tab) => (
          <Button
            key={tab}
            variant="ghost"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : styles.tabBtnInactive}`}
          >
            {tab === "overview"
              ? t("user.bookDetails.tabs.overview")
              : t("user.bookDetails.tabs.details")}
          </Button>
        ))}
      </div>

      <div
        role="tabpanel"
        aria-label={`${activeTab} tab`}
        className={styles.tabPanel}
      >
        {activeTab === "overview" && (
          <div className={styles.overviewGrid}>
            {[
              {
                icon: Hash,
                label: t("user.bookDetails.overview.isbn"),
                value: book.isbn,
              },
              {
                icon: Building2,
                label: t("user.bookDetails.overview.publisher"),
                value: book.publisher,
              },
              {
                icon: Calendar,
                label: t("user.bookDetails.overview.published"),
                value: book.publishedDate,
              },
              {
                icon: Globe2,
                label: t("user.bookDetails.overview.language"),
                value: book.language || "English",
              },
              {
                icon: Layers,
                label: t("user.bookDetails.overview.edition"),
                value: book.edition || "First Edition",
              },
              {
                icon: MapPin,
                label: t("user.bookDetails.overview.shelfLocation"),
                value: book.location,
              },
              {
                icon: Building2,
                label: t("user.bookDetails.overview.branch"),
                value: branch?.name || book.branchId,
              },
              {
                icon: BookOpen,
                label: t("user.bookDetails.overview.formats"),
                value: formatList.join(", "),
              },
            ].map((item) => (
              <div key={item.label} className={styles.overviewItem}>
                <div className={styles.iconWrapper}>
                  <item.icon
                    size={16}
                    color="var(--accent)"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <div className={styles.itemLabel}>{item.label}</div>
                  <div className={styles.itemValue}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "details" && (
          <div className={styles.detailsPanel}>
            <h3 className={styles.detailsTitle}>
              {t("user.bookDetails.details.title")}
            </h3>
            <div className={styles.copiesGrid}>
              <div className={`${styles.copyBox} ${styles.copyBoxTotal}`}>
                <div className={`${styles.copyValue} ${styles.copyValueTotal}`}>
                  {book.totalCopies}
                </div>
                <div className={styles.copyLabel}>
                  {t("user.bookDetails.details.total")}
                </div>
              </div>
              <div className={`${styles.copyBox} ${styles.copyBoxAvailable}`}>
                <div
                  className={`${styles.copyValue} ${styles.copyValueAvailable}`}
                >
                  {book.availableCopies}
                </div>
                <div className={styles.copyLabel}>
                  {t("user.bookDetails.details.available")}
                </div>
              </div>
              <div className={`${styles.copyBox} ${styles.copyBoxCheckedOut}`}>
                <div
                  className={`${styles.copyValue} ${styles.copyValueCheckedOut}`}
                >
                  {book.totalCopies - book.availableCopies}
                </div>
                <div className={styles.copyLabel}>
                  {t("user.bookDetails.details.checkedOut")}
                </div>
              </div>
            </div>

            <div
              className={styles.progressBarContainer}
              role="progressbar"
              aria-valuenow={book.availableCopies}
              aria-valuemin={0}
              aria-valuemax={book.totalCopies}
            >
              <div
                className={`${styles.progressBarFill} ${isAvailable ? styles.progressBarAvailable : styles.progressBarUnavailable}`}
                style={{
                  width: `${(book.availableCopies / book.totalCopies) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      <BorrowFormModal
        isOpen={borrowOpen}
        onClose={() => setBorrowOpen(false)}
        bookTitle={book.title}
        bookId={book.id}
        formats={book.format}
        onSubmit={handleBorrow}
      />
    </main>
  );
}
