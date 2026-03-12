"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Settings,
  Maximize,
  ChevronLeft,
  ChevronRight,
  Bookmark,
} from "lucide-react";
import { useBooks } from "@shelf-ai/shared/hooks";
import { Button } from "@shelf-ai/ui/button";
import { useTranslation } from "react-i18next";
import styles from "./page.module.css";

const MOCK_CHAPTER = `
  The morning sun crested the horizon, casting a golden hue over the sleeping city.
  It was a day that felt different from the rest—a quiet prologue to the chaos that would inevitably unfold.
  As she walked down the cobblestone streets, the familiar scent of fresh rain and old paper lingered in the air, wrapping her in a comforting embrace. Every building seemed to whisper secrets of the past, leaning intimately towards one another as if exchanging gossip. 
  
  She adjusted the strap of her satchel, the worn leather familiar against her shoulder. Inside lay the artifact she had spent months hunting—a device so inconspicuous it could easily be mistaken for a child&apos;s toy, yet holding the power to unravel the very fabric of their society.
  
  &quot;You&apos;re late,&quot; a voice murmured from the shadows of the alleyway ahead. 
  
  She didn&apos;t startle. She knew he&apos;d be there. &quot;I had to take the long route. Watchers were posted at the main square.&quot;
  
  He stepped into the faint morning light, his face lined with the exhaustion of a thousand sleepless nights. &quot;Do you have it?&quot;
  
  She nodded, her hand resting instinctively over the satchel. &quot;Yes. But we can&apos;t do this here. We need to go below.&quot;
  
  The descent into the catacombs was perilous, the air growing thick and damp with every step. Down here, the city's whispers were deafening.
`;

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
  const [progress, setProgress] = useState(12);

  const [chapterNotice, setChapterNotice] = useState("");

  const handleNextChapter = () => {
    setProgress((prev) => Math.min(100, prev + 8));
    setChapterNotice(t("user.read.notices.pushedNext"));
  };

  const handlePrevChapter = () => {
    setProgress((prev) => Math.max(0, prev - 8));
    setChapterNotice(t("user.read.notices.pushedPrev"));
  };

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
      {/* ARIA Announcer */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className={styles.ariaAnnouncer}
      >
        {chapterNotice}
      </div>

      {/* Reader Top Navigation Bar */}
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

      {/* Main Reading Area */}
      <main role="main" className={styles.mainArea}>
        <div className={styles.chapterHeader}>
          <h2 className={styles.chapterTitle}>Chapter 4</h2>
          <p className={styles.chapterSubtitle}>The Outset</p>
        </div>

        <article
          className={styles.articleText}
          style={{ fontSize, fontFamily }}
          aria-label="Book text content"
        >
          {MOCK_CHAPTER.repeat(3)}
        </article>

        <div className={styles.navigationContainer}>
          <Button
            variant="secondary"
            onClick={handlePrevChapter}
            disabled={progress === 0}
          >
            <ChevronLeft size={16} className={styles.navIconLeft} />{" "}
            {t("user.read.prevChapter")}
          </Button>
          <Button
            variant="secondary"
            onClick={handleNextChapter}
            disabled={progress >= 100}
          >
            {t("user.read.nextChapter")}{" "}
            <ChevronRight size={16} className={styles.navIconRight} />
          </Button>
        </div>
      </main>

      {/* Reader Bottom Progress Bar */}
      <footer
        className={styles.footerBar}
        role="contentinfo"
        aria-label={t("user.read.progressAria")}
      >
        <span className={styles.progressText}>{progress}%</span>
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className={styles.progressBarTrack}
        >
          <div
            className={styles.progressBarFill}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className={styles.timeLeftText}>{t("user.read.timeLeft")}</span>
      </footer>
    </div>
  );
}
