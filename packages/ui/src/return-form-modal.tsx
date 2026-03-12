"use client";

import React, { useState } from "react";
import { Modal } from "./modal";
import { Button } from "./button";
import { useTranslation } from "react-i18next";
import styles from "./return-form-modal.module.css";

interface ReturnFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  isOverdue: boolean;
  fineAmount: number;
  onSubmit: (rating: number) => void;
}

export function ReturnFormModal({
  isOpen,
  onClose,
  bookTitle,
  isOverdue,
  fineAmount,
  onSubmit,
}: ReturnFormModalProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<"confirm" | "rate" | "success">("confirm");
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleReset = () => {
    setStep("confirm");
    setRating(0);
    setHoveredStar(0);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleConfirm = () => {
    setStep("rate");
  };

  const handleRate = () => {
    onSubmit(rating);
    setStep("success");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("ui.returnModal.title")}
    >
      {step === "confirm" && (
        <div className={styles.container}>
          <div className={styles.message}>
            {t("ui.returnModal.confirmMessage")} <strong>{bookTitle}</strong>?
          </div>
          {isOverdue && (
            <div className={styles.overdueContainer}>
              <div className={styles.overdueLabel}>
                {t("ui.returnModal.overdueFine")}
              </div>
              <div className={styles.overdueAmount}>
                ${fineAmount.toFixed(2)}
              </div>
              <div className={styles.overdueNotice}>
                {t("ui.returnModal.overdueNotice")}
              </div>
            </div>
          )}
          <div className={styles.actions}>
            <Button
              variant="secondary"
              onClick={handleClose}
              className={styles.actionButton}
            >
              {t("action.cancel")}
            </Button>
            <Button onClick={handleConfirm} className={styles.actionButton}>
              {t("ui.returnModal.confirmReturn")}
            </Button>
          </div>
        </div>
      )}

      {step === "rate" && (
        <div className={styles.rateContainer}>
          <div className={styles.rateTitle}>
            {t("ui.returnModal.rateTitle")}
          </div>
          <div
            className={styles.starsContainer}
            role="radiogroup"
            aria-label="Book rating"
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
                role="radio"
                aria-checked={rating === star}
                className={`${styles.starButton} ${star <= (hoveredStar || rating) ? styles.starActive : styles.starInactive}`}
              >
                ★
              </button>
            ))}
          </div>
          <div className={styles.rateTip}>
            {rating === 0
              ? t("ui.returnModal.rateTipEmpty")
              : t("ui.returnModal.rateTipFilled").replace(
                  "{{rating}}",
                  rating.toString(),
                )}
          </div>
          <div className={styles.rateActions}>
            <Button
              variant="secondary"
              onClick={() => {
                onSubmit(0);
                setStep("success");
              }}
              className={styles.actionButton}
            >
              {t("ui.returnModal.skip")}
            </Button>
            <Button
              onClick={handleRate}
              disabled={rating === 0}
              className={styles.actionButton}
            >
              {t("ui.returnModal.submitRating")}
            </Button>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className={styles.successContainer}>
          <div className={styles.iconContainer}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="32"
                cy="32"
                r="30"
                fill="rgba(16,185,129,0.12)"
                stroke="none"
              />
              <circle
                cx="32"
                cy="32"
                r="30"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="188"
                strokeDashoffset="188"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="188;0"
                  dur="0.6s"
                  fill="freeze"
                  calcMode="easeOut"
                />
              </circle>
              <path
                d="M20 32 L28 40 L44 24"
                stroke="#10b981"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="40"
                strokeDashoffset="40"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="40;0"
                  begin="0.4s"
                  dur="0.4s"
                  fill="freeze"
                  calcMode="easeOut"
                />
              </path>
            </svg>
          </div>
          <div className={styles.textCenter}>
            <div className={styles.successTitle}>
              {t("ui.returnModal.successTitle")}
            </div>
            {rating > 0 && (
              <div className={styles.successSubtitle}>
                {t("ui.returnModal.successSubtitle").replace(
                  "{{rating}}",
                  rating.toString(),
                )}
              </div>
            )}
          </div>
          <Button onClick={handleClose} className={styles.doneButton}>
            {t("ui.borrowModal.done")}
          </Button>
        </div>
      )}
    </Modal>
  );
}
