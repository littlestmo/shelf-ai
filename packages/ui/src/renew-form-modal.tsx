"use client";

import React, { useState } from "react";
import { Modal } from "./modal";
import { Button } from "./button";
import { DatePicker } from "./date-picker";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import styles from "./renew-form-modal.module.css";

interface RenewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  currentDueDate: string;
  renewCount: number;
  maxRenewals: number;
  onSubmit: (newDueDate: string) => void;
}

export function RenewFormModal({
  isOpen,
  onClose,
  bookTitle,
  currentDueDate,
  renewCount,
  maxRenewals,
  onSubmit,
}: RenewFormModalProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<"confirm" | "success">("confirm");
  const [newDue, setNewDue] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d;
  });

  const handleReset = () => {
    setStep("confirm");
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleConfirm = () => {
    onSubmit(format(newDue, "yyyy-MM-dd"));
    setStep("success");
  };

  const canRenew = renewCount < maxRenewals;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("ui.renewModal.title")}
    >
      {step === "confirm" && (
        <div className={styles.container}>
          <div className={styles.message}>
            {t("ui.renewModal.confirmMessage").replace("{{title}}", bookTitle)}
          </div>

          <div className={styles.datesGrid}>
            <div className={styles.dateCard}>
              <div className={styles.dateLabel}>
                {t("ui.renewModal.currentDueDate")}
              </div>
              <div className={styles.dateValue}>{currentDueDate}</div>
            </div>
            <div className={styles.dateCardHighlight}>
              <div className={styles.dateLabel}>
                {t("ui.renewModal.newDueDate")}
              </div>
              <DatePicker
                value={newDue}
                onChange={setNewDue}
                minDate={new Date()}
              />
            </div>
          </div>

          <div className={styles.renewalsInfo}>
            <span>{t("ui.renewModal.renewalsUsed")}</span>
            <span className={styles.renewalsValue}>
              {renewCount}/{maxRenewals}
            </span>
          </div>

          {!canRenew && (
            <div className={styles.maxWarning}>
              {t("ui.renewModal.maxWarning")}
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
            <Button
              onClick={handleConfirm}
              disabled={!canRenew}
              className={styles.actionButton}
            >
              {t("ui.renewModal.confirmRenewal")}
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
              {t("ui.renewModal.successTitle")}
            </div>
            <div className={styles.successSubtitle}>
              {t("ui.renewModal.successSubtitle").replace(
                "{{date}}",
                format(newDue, "yyyy-MM-dd"),
              )}
            </div>
          </div>
          <Button onClick={handleClose} className={styles.doneButton}>
            {t("ui.borrowModal.done")}
          </Button>
        </div>
      )}
    </Modal>
  );
}
