"use client";

import { SignUp } from "@clerk/nextjs";
import { useTranslation } from "react-i18next";
import styles from "./page.module.css";

export default function SignUpPage() {
  const { t } = useTranslation();
  return (
    <main className={styles.main}>
      <div className={styles.leftPane}>
        <svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="vaultGrad"
              x1="160"
              y1="40"
              x2="160"
              y2="280"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#312e81" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
            <linearGradient
              id="scannerLasers"
              x1="0"
              y1="0"
              x2="320"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
          <pattern
            id="hexGrid"
            width="24"
            height="41.5"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M12 0 L24 6.92 L24 20.78 L12 27.71 L0 20.78 L0 6.92 Z"
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="1"
            />
          </pattern>
          <rect width="320" height="320" fill="url(#hexGrid)" />

          <g transform="translate(160, 130)">
            <circle
              cx="0"
              cy="0"
              r="85"
              fill="none"
              stroke="#3730a3"
              strokeWidth="2"
              opacity="0.5"
            />
            <circle
              cx="0"
              cy="0"
              r="70"
              fill="none"
              stroke="#4f46e5"
              strokeWidth="1"
              strokeDasharray="10 6"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0;360"
                dur="20s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </circle>

            <path
              d="M0,-55 L48,-28 L48,28 L0,55 L-48,28 L-48,-28 Z"
              fill="url(#vaultGrad)"
              stroke="#6366f1"
              strokeWidth="2"
              opacity="0.9"
            />

            <path
              d="M-15,-20 L15,-20 L15,10 L0,25 L-15,10 Z"
              fill="#0f172a"
              stroke="#818cf8"
              strokeWidth="1.5"
            />
            <circle cx="0" cy="-5" r="4" fill="#10b981">
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <rect x="-6" y="5" width="12" height="4" rx="2" fill="#818cf8" />

            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,-60; 0,60; 0,-60"
                dur="3s"
                repeatCount="indefinite"
                calcMode="ease-in-out"
              />
              <rect
                x="-80"
                y="0"
                width="160"
                height="2"
                fill="url(#scannerLasers)"
              />
              <rect
                x="-80"
                y="-12"
                width="160"
                height="12"
                fill="url(#scannerLasers)"
                opacity="0.2"
              />
            </g>

            {[
              [-48, -28],
              [48, -28],
              [-48, 28],
              [48, 28],
              [0, 55],
              [0, -55],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="3" fill="#6366f1">
                <animate
                  attributeName="opacity"
                  values="0.4;1;0.4"
                  dur={`${1.5 + i * 0.2}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>

          <text
            x="160"
            y="275"
            textAnchor="middle"
            fill="#3b82f6"
            fontSize="20"
            fontWeight="800"
            fontFamily="Outfit, sans-serif"
            letterSpacing="1"
          >
            {t("admin.auth.signUp.title")}
          </text>
          <text
            x="160"
            y="295"
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="11"
            fontFamily="Inter, sans-serif"
            letterSpacing="0.5"
          >
            {t("admin.auth.signUp.subtitle")}
          </text>
        </svg>
      </div>
      <div className={styles.rightPane}>
        <div className={styles.formContainer}>
          <SignUp />
        </div>
      </div>
    </main>
  );
}
