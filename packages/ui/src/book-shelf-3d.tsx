"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./book-shelf-3d.module.css";

interface ShelfBook {
  id: string;
  title: string;
  author: string;
  category: string;
  pages: number;
  rating: number;
}

interface BookShelf3DProps {
  books: ShelfBook[];
  onBookClick: (id: string) => void;
}

const SPINE_COLORS: Record<string, string[]> = {
  Fiction: ["#8B4513", "#A0522D"],
  NonFiction: ["#2F4F4F", "#3B5958"],
  Technology: ["#1a1a2e", "#16213e"],
  Science: ["#1B4332", "#2D6A4F"],
  History: ["#5C4033", "#6B4226"],
  SelfHelp: ["#4A0E4E", "#5B2C6F"],
  Academic: ["#1C2833", "#2C3E50"],
  Thriller: ["#641E16", "#922B21"],
  Mystery: ["#3B0A45", "#512E5F"],
  Fantasy: ["#1B2631", "#212F3C"],
  Biography: ["#614E1A", "#7D6608"],
  Philosophy: ["#1C2833", "#283747"],
  Art: ["#922B21", "#B03A2E"],
  Romance: ["#943126", "#C0392B"],
  Dystopian: ["#1C1C1C", "#2E2E2E"],
  Journal: ["#5D6D7E", "#7F8C8D"],
  Poetry: ["#5B2C6F", "#6C3483"],
  Comics: ["#1A5276", "#2E86C1"],
  Other: ["#566573", "#717D7E"],
};

function getBookThickness(pages: number): number {
  if (pages <= 0) return 28;
  if (pages < 100) return 18;
  if (pages < 200) return 24;
  if (pages < 400) return 32;
  if (pages < 600) return 40;
  return 50;
}

function getBookHeight(): number {
  return 160 + Math.random() * 30;
}

function BookSpine({
  book,
  onClick,
  index,
}: {
  book: ShelfBook;
  onClick: () => void;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const thickness = getBookThickness(book.pages);
  const height = getBookHeight();
  const colors = SPINE_COLORS[book.category] || SPINE_COLORS.Other!;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${book.title} by ${book.author}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`${styles.spine} ${hovered ? styles.spineHover : styles.spineNormal}`}
      style={{
        width: `${thickness}px`,
        height: `${height}px`,
        background: `linear-gradient(175deg, ${colors[0]}, ${colors[1]})`,
        animation: `fadeIn 0.3s ease ${index * 0.03}s both`,
      }}
    >
      <div className={styles.spineTopHighlight} aria-hidden="true" />

      <div
        className={styles.spineText}
        style={{
          fontSize: thickness < 24 ? "0.55rem" : "0.65rem",
          maxHeight: `${height - 24}px`,
        }}
      >
        {book.title}
      </div>

      <div className={styles.spineBottomShadow} aria-hidden="true" />

      {hovered && (
        <div className={styles.tooltip} role="tooltip">
          <div className={styles.tooltipTitle}>{book.title}</div>
          <div className={styles.tooltipAuthor}>{book.author}</div>
          <div className={styles.tooltipMeta}>
            <span>{book.category}</span>
            <span>·</span>
            <span>{book.pages > 0 ? `${book.pages}p` : "N/A"}</span>
            <span>·</span>
            <span className={styles.tooltipRating}>
              ★ {book.rating.toFixed(1)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function ShelfRow({
  books,
  onBookClick,
  startIndex,
}: {
  books: ShelfBook[];
  onBookClick: (id: string) => void;
  startIndex: number;
}) {
  return (
    <div className={styles.rowContainer}>
      <div className={styles.bookList}>
        {books.map((book, i) => (
          <BookSpine
            key={book.id}
            book={book}
            onClick={() => onBookClick(book.id)}
            index={startIndex + i}
          />
        ))}
      </div>

      <div className={styles.shelfBase} aria-hidden="true">
        <div className={styles.shelfHighlight} />
      </div>

      <div className={styles.shelfShadow} aria-hidden="true" />
    </div>
  );
}

export function BookShelf3D({ books, onBookClick }: BookShelf3DProps) {
  const { t } = useTranslation();
  const booksPerRow = Math.max(8, Math.ceil(books.length / 3));
  const rows: ShelfBook[][] = [];

  for (let i = 0; i < books.length; i += booksPerRow) {
    rows.push(books.slice(i, i + booksPerRow));
  }

  if (rows.length === 0) {
    return (
      <div className={styles.emptyState} role="status">
        {t("ui.bookShelf.emptyState")}
      </div>
    );
  }

  return (
    <div
      className={styles.shelfContainer}
      role="region"
      aria-label={t("ui.bookShelf.ariaLabel")}
    >
      {rows.map((row, i) => (
        <ShelfRow
          key={i}
          books={row}
          onBookClick={onBookClick}
          startIndex={i * booksPerRow}
        />
      ))}
    </div>
  );
}
