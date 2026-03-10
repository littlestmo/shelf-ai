"use client";

import React from "react";
import styles from "./form-field.module.css";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({
  label,
  htmlFor,
  error,
  required,
  children,
}: FormFieldProps) {
  return (
    <div className={styles.formField}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
        {required && (
          <span className={styles.requiredAsterisk} aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <span className={styles.errorText} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export const inputClass = styles.input;
export const textareaClass = styles.textarea;
export const selectClass = styles.select;
