import React, { useEffect, useRef, useState } from "react";
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
  qrValue?: string;
  onExport?: () => void;
}

function useQrCodeUrl(value: string, size = 120): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const QRCode = (await import("qrcode")).default;
        const dataUrl = await QRCode.toDataURL(value, {
          width: size,
          margin: 1,
          color: { dark: "#000000", light: "#ffffff" },
        });
        if (!cancelled) setUrl(dataUrl);
      } catch {
        if (!cancelled) setUrl(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [value, size]);
  return url;
}

export function StudentCard({
  name,
  studentId,
  department,
  photoUrl,
  contactNumber,
  issueDate,
  qrValue = "https://shelfai.up.railway.app",
  onExport,
}: StudentCardProps) {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLElement>(null);
  const qrUrl = useQrCodeUrl(qrValue);

  const handleExport = async () => {
    if (onExport) {
      onExport();
      return;
    }
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `student-card-${studentId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      /* noop */
    }
  };

  return (
    <div className={styles.cardWrapper}>
      <section
        ref={cardRef}
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
            {qrUrl ? (
              <img
                src={qrUrl}
                alt={`QR Code for ${studentId}`}
                width={56}
                height={56}
                className={styles.qrImage}
              />
            ) : (
              <div className={styles.qrPlaceholder} aria-hidden="true" />
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <span>{t("ui.studentCard.support")}</span>
          <span>{t("ui.studentCard.website")}</span>
        </div>
      </section>

      <button
        type="button"
        className={styles.exportButton}
        onClick={handleExport}
        aria-label="Export student card as PNG"
      >
        Export as PNG
      </button>
    </div>
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
