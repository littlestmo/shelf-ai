"use client";

import React, { useState, useId } from "react";
import { Modal } from "./modal";
import { Button } from "./button";
import { Select } from "./select";
import { DatePicker } from "./date-picker";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import styles from "./borrow-form-modal.module.css";

interface BorrowFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  bookId: string;
  formats: Array<{ tag: string }>;
  onSubmit: (data: {
    dueDate: string;
    format: string;
    purpose: string;
  }) => void;
}

export function BorrowFormModal({
  isOpen,
  onClose,
  bookTitle,
  bookId,
  formats,
  onSubmit,
}: BorrowFormModalProps) {
  const { t } = useTranslation();
  const id = useId();
  const [step, setStep] = useState<"confirm" | "form" | "success">("confirm");
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d;
  });
  const [purpose, setPurpose] = useState("");
  const [bookFormat, setBookFormat] = useState(formats[0]?.tag || "Hardcopy");

  const handleReset = () => {
    setStep("confirm");
    setPurpose("");
    const d = new Date();
    d.setDate(d.getDate() + 14);
    setToDate(d);
    setFromDate(new Date());
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      dueDate: format(toDate, "yyyy-MM-dd"),
      format: bookFormat,
      purpose,
    });
    setStep("success");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("ui.borrowModal.title")}
    >
      {step === "confirm" && (
        <div className={styles.container}>
          <div className={styles.bookPreview}>
            <div className={styles.previewLabel}>
              {t("ui.borrowModal.previewLabel")}
            </div>
            <div className={styles.previewTitle}>{bookTitle}</div>
            <div className={styles.previewId}>
              {t("ui.borrowModal.bookId").replace("{{id}}", bookId)}
            </div>
          </div>
          <div className={styles.buttonGroup}>
            <Button
              variant="secondary"
              onClick={handleClose}
              className={styles.buttonFlex1}
            >
              {t("action.cancel")}
            </Button>
            <Button
              onClick={() => setStep("form")}
              className={styles.buttonFlex1}
            >
              {t("ui.borrowModal.confirmParams")}
            </Button>
          </div>
        </div>
      )}

      {step === "form" && (
        <form
          onSubmit={handleSubmit}
          aria-label={t("ui.borrowModal.title")}
          className={styles.form}
        >
          <div className={styles.issuingLabel}>
            {t("ui.borrowModal.issuingLabel")} <strong>{bookTitle}</strong>
          </div>

          <div className={styles.dateGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor={`${id}-from`} className={styles.fieldLabel}>
                {t("ui.borrowModal.fromDate")}
              </label>
              <div className={styles.readOnlyDate}>
                {format(fromDate, "PP")}
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor={`${id}-to`} className={styles.fieldLabel}>
                {t("ui.borrowModal.returnBy")}
              </label>
              <DatePicker
                value={toDate}
                onChange={setToDate}
                minDate={fromDate}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor={`${id}-format`} className={styles.fieldLabel}>
              {t("ui.borrowModal.format")}
            </label>
            <Select
              inputId={`${id}-format`}
              value={
                formats
                  .map((f) => ({
                    value: f.tag,
                    label:
                      f.tag === "Ebook"
                        ? "E-Book"
                        : f.tag === "Audiobook"
                          ? "Audiobook"
                          : "Hard Copy",
                  }))
                  .find((o) => o.value === bookFormat) || null
              }
              onChange={(selected: { value: string; label: string } | null) => {
                if (selected) setBookFormat(selected.value);
              }}
              options={formats.map((f) => ({
                value: f.tag,
                label:
                  f.tag === "Ebook"
                    ? "E-Book"
                    : f.tag === "Audiobook"
                      ? "Audiobook"
                      : "Hard Copy",
              }))}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor={`${id}-purpose`} className={styles.fieldLabel}>
              {t("ui.borrowModal.purposeLabel")}
            </label>
            <textarea
              id={`${id}-purpose`}
              placeholder={t("ui.borrowModal.purposePlaceholder")}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={3}
              className={styles.textarea}
            />
          </div>

          <div className={styles.formActions}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep("confirm")}
              className={styles.buttonFlex1}
            >
              {t("ui.borrowModal.back")}
            </Button>
            <Button type="submit" className={styles.buttonFlex1}>
              {t("ui.borrowModal.issueBook")}
            </Button>
          </div>
        </form>
      )}

      {step === "success" && (
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>✓</div>
          <div className={styles.successTextContainer}>
            <div className={styles.successTitle}>
              {t("ui.borrowModal.successTitle")}
            </div>
            <div className={styles.successSubtitle}>
              {t("ui.borrowModal.successSubtitle").replace(
                "{{date}}",
                format(toDate, "yyyy-MM-dd"),
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
