"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./pagination.module.css";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  const getPages = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <nav aria-label={t("ui.pagination.navAriaLabel")} className={styles.nav}>
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        aria-label={t("ui.pagination.previousPage")}
        className={`${styles.button} ${page <= 1 ? styles.buttonDisabled : ""}`}
      >
        <ChevronLeft size={16} />
      </button>

      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className={styles.ellipsis}>
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-label={t("ui.pagination.pageAriaLabel").replace(
              "{{page}}",
              String(p),
            )}
            aria-current={p === page ? "page" : undefined}
            className={`${styles.button} ${p === page ? styles.buttonActive : ""}`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        aria-label={t("ui.pagination.nextPage")}
        className={`${styles.button} ${page >= totalPages ? styles.buttonDisabled : ""}`}
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
