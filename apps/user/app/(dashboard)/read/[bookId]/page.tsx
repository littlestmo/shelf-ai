"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Settings, Maximize, Bookmark } from "lucide-react";
import { useBooks } from "@shelf-ai/shared/hooks";
import { Button } from "@shelf-ai/ui/button";
import { useTranslation } from "react-i18next";
import styles from "./page.module.css";

export default function BookReaderPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const books = useBooks();

  const bookId =
    typeof params.bookId === "string"
      ? params.bookId
      : Array.isArray(params.bookId)
        ? params.bookId[0]
        : "";
  const book = useMemo(
    () => books.find((b) => b.id.toString() === bookId),
    [books, bookId],
  );

  const fontSize = "1.1rem";
  const fontFamily = "var(--font-body)";
  const [chapterNotice, setChapterNotice] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (book?.pdfData) {
      if (book.pdfData.startsWith("data:application/pdf")) {
        setPdfUrl(book.pdfData);
      } else {
        setPdfUrl(`data:application/pdf;base64,${book.pdfData}`);
      }
    } else {
      setPdfUrl(null);
    }
  }, [book]);

  useEffect(() => {
    if (chapterNotice) {
      const timer = setTimeout(() => setChapterNotice(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [chapterNotice]);

  if (!book) {
    return (
      <div className={styles.loadingContainer}>
        <h2 className={styles.loadingText}>{t("user.read.loading")}</h2>
      </div>
    );
  }

  return (
    <div
      className={styles.readerContainer}
      aria-label={t("user.read.readerAria")}
    >
      <div
        aria-live="polite"
        aria-atomic="true"
        className={styles.ariaAnnouncer}
      >
        {chapterNotice}
      </div>

      <header className={styles.topBar} role="banner">
        <div className={styles.topLeftGroup}>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className={styles.backButton}
            aria-label={t("user.read.closeAria")}
          >
            <ArrowLeft size={20} aria-hidden="true" /> {t("user.read.close")}
          </Button>
          <div className={styles.divider} aria-hidden="true" />
          <h1 className={styles.bookTitle}>{book.title}</h1>
        </div>

        <div className={styles.topRightGroup}>
          <Button
            variant="ghost"
            className={styles.actionButton}
            aria-label={t("user.read.bookmarkAria")}
          >
            <Bookmark size={20} aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            className={styles.actionButton}
            aria-label={t("user.read.settingsAria")}
          >
            <Settings size={20} aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            className={styles.actionButton}
            aria-label={t("user.read.fullscreenAria")}
          >
            <Maximize size={20} aria-hidden="true" />
          </Button>
        </div>
      </header>

      <main role="main" className={styles.mainArea}>
        <div className={styles.chapterHeader}>
          <h2 className={styles.chapterTitle}>{book.title}</h2>
          <p className={styles.chapterSubtitle}>By {book.author}</p>
        </div>

        {pdfUrl ? (
          <div className={styles.pdfViewerContainer}>
            <object
              data={pdfUrl}
              type="application/pdf"
              width="100%"
              height="100%"
              aria-label={`PDF viewer for ${book.title}`}
              className={styles.pdfObject}
            >
              <div className={styles.fallbackPdf}>
                <p>
                  {"It appears your browser doesn't support embedded PDFs."}
                </p>
                <a href={pdfUrl} download={`${book.title}.pdf`}>
                  <Button variant="secondary">
                    {t("admin.aiGenerate.ai.save")}
                  </Button>
                </a>
              </div>
            </object>
          </div>
        ) : (
          <article
            className={styles.articleText}
            style={{
              fontSize,
              fontFamily,
              textAlign: "center",
              color: "var(--text-muted)",
              marginTop: "4rem",
            }}
            aria-label="No PDF available message"
          >
            <p>No PDF available for this book.</p>
          </article>
        )}
      </main>
    </div>
  );
}
