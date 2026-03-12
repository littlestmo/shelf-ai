"use client";

import React from "react";
import styles from "./book-cover.module.css";

type CoverSize = "sm" | "md" | "lg";

interface BookCoverProps {
  title: string;
  color?: string;
  coverUrl?: string;
  size?: CoverSize;
}

const sizeMap: Record<
  CoverSize,
  { width: number; height: number; fontSize: string }
> = {
  sm: { width: 40, height: 56, fontSize: "0.52rem" },
  md: { width: 80, height: 112, fontSize: "0.68rem" },
  lg: { width: 120, height: 168, fontSize: "0.82rem" },
};

export function BookCover({
  title,
  color,
  coverUrl,
  size = "md",
}: BookCoverProps) {
  const { width, height, fontSize } = sizeMap[size];

  const fallbackColor = color || generateColor(title);

  if (coverUrl) {
    return (
      <div className={styles.container} style={{ width, height }}>
        <img
          src={coverUrl}
          alt={`Cover of ${title}`}
          className={styles.imageCover}
          loading="lazy"
        />
        <div
          className={`${styles.spineShadow} ${styles.spineShadowImage}`}
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div
      className={`${styles.container} ${styles.fallbackContainer}`}
      style={{
        width,
        height,
        background: `linear-gradient(145deg, ${fallbackColor}, ${adjustBrightness(fallbackColor, -30)})`,
      }}
      role="img"
      aria-label={`Cover of ${title}`}
    >
      <div
        className={`${styles.spineShadow} ${styles.spineShadowFallback}`}
        aria-hidden="true"
      />
      <span className={styles.fallbackTitle} style={{ fontSize }}>
        {title}
      </span>
    </div>
  );
}

function generateColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 55%, 45%)`;
}

function adjustBrightness(hex: string, amount: number): string {
  if (hex.startsWith("hsl")) {
    const match = hex.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (match) {
      const l = Math.max(0, Math.min(100, parseInt(match[3]!) + amount));
      return `hsl(${match[1]}, ${match[2]}%, ${l}%)`;
    }
  }
  return hex;
}
