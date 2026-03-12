"use client";

import React, { useEffect, useRef, useState, type ReactNode } from "react";
import { TrendingUp } from "lucide-react";
import styles from "./stat-card.module.css";

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  iconBg: string;
  iconColor?: string;
  trend?: { value: number; positive: boolean };
  delay?: string;
}

function useCountUp(target: number, duration: number = 1000): number {
  const [count, setCount] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    const tick = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return count;
}

export function StatCard({
  label,
  value,
  icon,
  iconBg,
  trend,
  delay,
}: StatCardProps) {
  const displayed = useCountUp(value, 1100);

  return (
    <article
      className={styles.card}
      style={{
        animation: `fadeIn 0.4s ease ${delay ?? "0s"} both`,
      }}
      aria-label={`${label}: ${value}`}
    >
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <div className={styles.iconWrapper} style={{ background: iconBg }}>
          {icon}
        </div>
      </div>
      <div className={styles.value}>{displayed.toLocaleString()}</div>
      {trend && (
        <div className={styles.trendContainer}>
          <TrendingUp
            size={12}
            className={
              trend.positive
                ? styles.trendIconPositive
                : styles.trendIconNegative
            }
            aria-hidden="true"
          />
          <span
            className={
              trend.positive
                ? styles.trendTextPositive
                : styles.trendTextNegative
            }
          >
            {trend.value}%
          </span>
        </div>
      )}
    </article>
  );
}
