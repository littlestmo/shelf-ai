import React from "react";
import { Star, CheckCircle2, XCircle } from "lucide-react";
import { BookCover } from "./book-cover";
import { useTranslation } from "react-i18next";
import styles from "./book-card.module.css";

export interface BookCardProps {
  id: string | number;
  title: string;
  author: string;
  rating: number;
  category: string;
  publishedYear: number;
  availableHardcopy?: boolean;
  availableEbook?: boolean;
  availableAudio?: boolean;
  status: "In-Shelf" | "Borrowed";
  onClick?: () => void;
  cardRef?: React.RefObject<HTMLDivElement | null>;
}

export function BookCard({
  title,
  author,
  rating,
  category,
  publishedYear,
  availableHardcopy,
  availableEbook,
  availableAudio,
  status,
  onClick,
  cardRef,
}: BookCardProps) {
  const { t } = useTranslation();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${title} by ${author}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={styles.bookCard}
    >
      <BookCover title={title} size="md" />

      <div className={styles.bookInfo}>
        <h3 className={styles.bookTitle}>{title}</h3>
        <p className={styles.bookMeta}>
          {author}, {publishedYear}
        </p>
        <div className={styles.ratingContainer}>
          <Star size={14} color="#f59e0b" fill="#f59e0b" aria-hidden="true" />
          <span className={styles.ratingText}>
            <span
              aria-label={t("ui.bookCard.rating").replace(
                "{{rating}}",
                rating.toFixed(1),
              )}
            >
              {rating.toFixed(1)}
            </span>
            <span className={styles.ratingMax}>/5</span>
          </span>
        </div>
      </div>

      <div className={styles.categoryContainer}>
        <span className={styles.categoryText}>{category}</span>
        <span className={styles.categoryLabel}>
          {t("ui.bookCard.category")}
        </span>
      </div>

      <div className={styles.availabilityContainer}>
        <AvailabilityRow label="Hard Copy" available={!!availableHardcopy} />
        <AvailabilityRow label="E - Book" available={!!availableEbook} />
        <AvailabilityRow label="Audio book" available={!!availableAudio} />
      </div>

      <div className={styles.statusContainer}>
        <div
          className={`${styles.statusBadge} ${status === "In-Shelf" ? styles.statusInShelf : styles.statusBorrowed}`}
          aria-label={t("ui.bookCard.status").replace("{{status}}", status)}
        >
          {status}
        </div>
      </div>
    </div>
  );
}

function AvailabilityRow({
  label,
  available,
}: {
  label: string;
  available: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div
      className={styles.availabilityRow}
      aria-label={`${label}: ${available ? t("ui.availability.available") : t("ui.availability.unavailable")}`}
    >
      {available ? (
        <CheckCircle2 size={14} color="#22c55e" aria-hidden="true" />
      ) : (
        <XCircle size={14} color="#ef4444" aria-hidden="true" />
      )}
      <span
        className={`${styles.availabilityLabel} ${available ? styles.availabilityLabelAvailable : styles.availabilityLabelUnavailable}`}
      >
        {label}
      </span>
    </div>
  );
}
