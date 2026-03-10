"use client";

import React from "react";
import { X } from "lucide-react";
import styles from "./modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div onClick={onClose} className={styles.backdrop} aria-hidden="true" />
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
