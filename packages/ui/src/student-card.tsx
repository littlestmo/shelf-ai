import React from "react";
import { QrCode } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./student-card.module.css";

export interface StudentCardProps {
  name: string;
  studentId: string;
  department: string;
  photoUrl?: string;
  contactNumber?: string;
  email?: string;
  issueDate?: string;
}

export function StudentCard({
  name,
  studentId,
  department,
  photoUrl,
  contactNumber,
  issueDate,
}: StudentCardProps) {
  const { t } = useTranslation();

  return (
    <section
      aria-label={t("ui.studentCard.ariaLabel")}
      className={styles.studentCard}
    >
      <div aria-hidden="true" className={styles.decorationTop} />
      <div aria-hidden="true" className={styles.decorationBottom} />

      <div className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoText}>SF</span>
        </div>
        <div>
          <h2 className={styles.title}>{t("ui.studentCard.title")}</h2>
          <p className={styles.subtitle}>{t("ui.studentCard.subtitle")}</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.photoContainer}>
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={t("ui.studentCard.photoAlt").replace("{{name}}", name)}
              className={styles.photo}
            />
          ) : (
            <div
              aria-label={t("ui.studentCard.photoPlaceholder").replace(
                "{{name}}",
                name,
              )}
              className={styles.photoPlaceholder}
            >
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className={styles.details}>
          <DetailRow label={t("ui.studentCard.studentId")} value={studentId} />
          <DetailRow label={t("ui.studentCard.fullName")} value={name} />
          <DetailRow
            label={t("ui.studentCard.department")}
            value={department}
          />
          <DetailRow
            label={t("ui.studentCard.dateOfIssue")}
            value={issueDate || new Date().toLocaleDateString()}
          />
          {contactNumber && (
            <DetailRow
              label={t("ui.studentCard.contactNo")}
              value={contactNumber}
            />
          )}
        </div>

        <div
          className={styles.qrContainer}
          aria-label={t("ui.studentCard.scanBarcode").replace(
            "{{id}}",
            studentId,
          )}
        >
          <QrCode size={56} color="#000" />
        </div>
      </div>

      <div className={styles.footer}>
        <span>{t("ui.studentCard.support")}</span>
        <span>{t("ui.studentCard.website")}</span>
      </div>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.detailRow}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailSeparator}>:</span>
      <strong className={styles.detailValue}>{value}</strong>
    </div>
  );
}
