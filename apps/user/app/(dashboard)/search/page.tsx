"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  SlidersHorizontal,
  Star,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Grid2x2,
  Rows3,
} from "lucide-react";
import { useBooks, useDebounce } from "@shelf-ai/shared/hooks";
import { BOOK_CATEGORIES } from "@shelf-ai/shared/constants";
import { BookCover } from "@shelf-ai/ui/book-cover";
import { Badge } from "@shelf-ai/ui/badge";
import { Button } from "@shelf-ai/ui/button";
import { SearchInput } from "@shelf-ai/ui/search-input";
import { useTranslation } from "react-i18next";
import styles from "./page.module.css";

const FORMATS = ["All", "Hardcopy", "Ebook", "Audiobook"];
const STATUSES = ["All", "Available", "Borrowed"];
const PER_PAGE = 12;

export default function SearchPage() {
  const { t } = useTranslation();
  const books = useBooks();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentQ = params.get("q") || "";

    if (debouncedQuery !== currentQ) {
      if (debouncedQuery) {
        params.set("q", debouncedQuery);
      } else {
        params.delete("q");
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [debouncedQuery, pathname, router, searchParams]);

  const [category, setCategory] = useState("");
  const [format, setFormat] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    let result = books;
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.isbn.toLowerCase().includes(q),
      );
    }
    if (category) {
      result = result.filter((b) => b.category.tag === category);
    }
    if (format && format !== "All") {
      result = result.filter((b) =>
        b.format.some((f: { tag: string }) => f.tag === format),
      );
    }
    if (status && status !== "All") {
      result = result.filter((b) => b.status.tag === status);
    }
    return result;
  }, [books, debouncedQuery, category, format, status]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleBookClick = (id: string) => {
    router.push(`/book/${id}`);
  };

  return (
    <main
      className={styles.mainContainer}
      role="region"
      aria-label="Library catalog search"
    >
      <div>
        <h1 className={styles.pageTitle}>{t("user.search.title")}</h1>
        <p className={styles.pageSubtitle}>
          {t("user.search.subtitle", { count: books.length })}
        </p>
      </div>

      <div className={styles.searchBarContainer}>
        <SearchInput
          value={query}
          onChange={(val: string) => {
            setQuery(val);
            setPage(1);
          }}
          placeholder={t("user.search.searchPlaceholder")}
        />
        <Button
          variant="ghost"
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
          aria-label="Toggle filters"
          className={`${styles.filterToggleBtn} ${showFilters ? styles.filterToggleBtnActive : styles.filterToggleBtnInactive}`}
        >
          <SlidersHorizontal size={14} aria-hidden="true" />
          {t("user.search.filters.title")}
        </Button>

        <div
          className={styles.layoutToggleContainer}
          role="radiogroup"
          aria-label="Layout mode"
        >
          {[
            { key: "grid" as const, icon: Grid2x2 },
            { key: "list" as const, icon: Rows3 },
          ].map((v) => (
            <Button
              key={v.key}
              variant="ghost"
              onClick={() => setLayout(v.key)}
              role="radio"
              aria-checked={layout === v.key}
              aria-label={`${v.key} layout`}
              className={`${styles.layoutToggleBtn} ${layout === v.key ? styles.layoutToggleBtnActive : styles.layoutToggleBtnInactive}`}
            >
              <v.icon size={14} aria-hidden="true" />
            </Button>
          ))}
        </div>
      </div>

      {showFilters && (
        <div
          className={styles.filtersPanel}
          role="group"
          aria-label="Search filters"
        >
          <div>
            <div className={styles.filterSectionTitle}>
              {t("user.search.filters.category")}
            </div>
            <div className={styles.filterButtonsRow}>
              <Button
                variant="ghost"
                onClick={() => {
                  setCategory("");
                  setPage(1);
                }}
                className={`${styles.filterBtn} ${!category ? styles.filterBtnActive : styles.filterBtnInactive}`}
                aria-pressed={!category}
              >
                {t("user.search.filters.all")}
              </Button>
              {BOOK_CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant="ghost"
                  onClick={() => {
                    setCategory(cat === category ? "" : cat);
                    setPage(1);
                  }}
                  className={`${styles.filterBtn} ${category === cat ? styles.filterBtnActive : styles.filterBtnInactive}`}
                  aria-pressed={category === cat}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <div className={styles.filtersGrid}>
            <div>
              <div className={styles.filterSectionTitle}>
                {t("user.search.filters.format")}
              </div>
              <div className={styles.filterButtonsRow}>
                {FORMATS.map((f) => (
                  <Button
                    key={f}
                    variant="ghost"
                    onClick={() => {
                      setFormat(f === "All" ? "" : f === format ? "" : f);
                      setPage(1);
                    }}
                    className={`${styles.filterBtn} ${(f === "All" && !format) || format === f ? styles.filterBtnActive : styles.filterBtnInactive}`}
                    aria-pressed={(f === "All" && !format) || format === f}
                  >
                    {f === "All"
                      ? t("user.search.filters.all")
                      : f === "Hardcopy"
                        ? t("user.search.filters.hardcopy")
                        : f === "Ebook"
                          ? t("user.search.filters.ebook")
                          : t("user.search.filters.audiobook")}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <div className={styles.filterSectionTitle}>
                {t("user.search.filters.status")}
              </div>
              <div className={styles.filterButtonsRow}>
                {STATUSES.map((s) => (
                  <Button
                    key={s}
                    variant="ghost"
                    onClick={() => {
                      setStatus(s === "All" ? "" : s === status ? "" : s);
                      setPage(1);
                    }}
                    className={`${styles.filterBtn} ${(s === "All" && !status) || status === s ? styles.filterBtnActive : styles.filterBtnInactive}`}
                    aria-pressed={(s === "All" && !status) || status === s}
                  >
                    {s === "All"
                      ? t("user.search.filters.all")
                      : s === "Available"
                        ? t("user.search.filters.available")
                        : t("user.search.filters.borrowed")}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.resultsCountContainer}>
        <span className={styles.resultsCountText} role="status">
          {t("user.search.results.count", { count: filtered.length })}
        </span>
      </div>

      {paged.length === 0 ? (
        <div className={styles.emptyStateContainer} role="status">
          <BookOpen
            size={40}
            className={styles.emptyStateIcon}
            aria-hidden="true"
          />
          <div className={styles.emptyStateTitle}>
            {t("user.search.results.emptyTitle")}
          </div>
          <div className={styles.emptyStateSubtitle}>
            {t("user.search.results.emptySubtitle")}
          </div>
        </div>
      ) : layout === "grid" ? (
        <div className={styles.bookGrid} role="list">
          {paged.map((book, idx) => (
            <article
              key={book.id}
              className={styles.bookGridCard}
              style={{ animation: `fadeIn 0.3s ease ${idx * 0.03}s both` }}
              onClick={() => handleBookClick(book.id)}
              role="listitem"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  handleBookClick(book.id);
              }}
              aria-label={`${book.title} by ${book.author}`}
            >
              <div className={styles.bookGridCoverWrapper}>
                <BookCover title={book.title} size="lg" />
              </div>
              <div className={`${styles.bookTitle} ${styles.bookGridTitle}`}>
                {book.title}
              </div>
              <div className={styles.bookGridAuthor}>{book.author}</div>
              <div className={styles.bookGridMetaRow}>
                <Badge label={book.category.tag} color="var(--accent)" />
                <div className={styles.bookRating}>
                  <Star size={11} fill="currentColor" aria-hidden="true" />
                  {book.rating.toFixed(1)}
                </div>
              </div>
              <div
                className={`${styles.bookGridAvailability} ${book.availableCopies > 0 ? styles.bookAvailable : styles.bookUnavailable}`}
              >
                {book.availableCopies > 0
                  ? t("user.search.results.copiesAvailable", {
                      count: book.availableCopies,
                    })
                  : t("user.search.results.unavailable")}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.bookList} role="list">
          {paged.map((book, idx) => (
            <article
              key={book.id}
              className={styles.bookListCard}
              style={{ animation: `fadeIn 0.3s ease ${idx * 0.03}s both` }}
              onClick={() => handleBookClick(book.id)}
              role="listitem"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  handleBookClick(book.id);
              }}
            >
              <BookCover title={book.title} size="sm" />
              <div className={styles.bookListInfo}>
                <div className={styles.bookTitle}>{book.title}</div>
                <div className={styles.bookListSubtitle}>
                  {book.author} · {new Date(book.publishedDate).getFullYear()}
                </div>
              </div>
              <Badge label={book.category.tag} color="var(--accent)" />
              <div className={`${styles.bookRating} ${styles.bookListRating}`}>
                <Star size={11} fill="currentColor" aria-hidden="true" />
                {book.rating.toFixed(1)}
              </div>
              <div
                className={`${styles.bookListAvailability} ${book.availableCopies > 0 ? styles.bookAvailable : styles.bookUnavailable}`}
              >
                {book.availableCopies > 0
                  ? t("user.search.filters.available")
                  : t("user.search.results.out")}
              </div>
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className={styles.paginationNav} aria-label="Pagination">
          <Button
            variant="ghost"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
            className={`${styles.paginationBtn} ${styles.paginationBtnArrow} ${page === 1 ? styles.paginationBtnArrowDisabled : styles.paginationBtnArrowAllowed}`}
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant="ghost"
              onClick={() => setPage(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? "page" : undefined}
              className={`${styles.paginationBtn} ${styles.paginationBtnPage} ${p === page ? styles.paginationBtnPageActive : styles.paginationBtnPageInactive}`}
            >
              {p}
            </Button>
          ))}
          <Button
            variant="ghost"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label="Next page"
            className={`${styles.paginationBtn} ${styles.paginationBtnArrow} ${page === totalPages ? styles.paginationBtnArrowDisabled : styles.paginationBtnArrowAllowed}`}
          >
            <ChevronRight size={16} aria-hidden="true" />
          </Button>
        </nav>
      )}
    </main>
  );
}
