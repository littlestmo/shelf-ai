"use client";

import React, { type ReactNode } from "react";
import styles from "./empty-state.module.css";

export interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  message: string;
}

export function EmptyState({ icon, title, message }: EmptyStateProps) {
  return (
    <div className={styles.container}>
      {icon && <div className={styles.iconWrapper}>{icon}</div>}
      {title && <h3 className={styles.title}>{title}</h3>}
      <p className={styles.message}>{message}</p>
    </div>
  );
}
