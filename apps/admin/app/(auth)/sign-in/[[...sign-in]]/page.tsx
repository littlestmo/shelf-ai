"use client";

import { SignIn } from "@clerk/nextjs";
import { useTranslation } from "react-i18next";
import styles from "./page.module.css";

export default function SignInPage() {
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
            <linearGradient id="adminBg" x1="0" y1="0" x2="320" y2="320">
              <stop offset="0%" stopColor="#0B132B" />
              <stop offset="100%" stopColor="#1C2541" />
            </linearGradient>
            <linearGradient
              id="shieldGradAdmin"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
            <linearGradient id="radarSweep" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <pattern
            id="adminGrid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <rect
              width="40"
              height="40"
              fill="none"
              stroke="rgba(255,255,255,0.02)"
              strokeWidth="1"
            />
          </pattern>
          <rect width="320" height="320" fill="url(#adminGrid)" />

          <g transform="translate(160, 135)">
            <circle
              cx="0"
              cy="0"
              r="85"
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="15"
            />
            <path
              d="M-85,0 A85,85 0 0,1 85,0"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="15"
              strokeLinecap="butt"
              opacity="0.6"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0;360"
                dur="6s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </path>
            <path
              d="M0,85 A85,85 0 0,1 -85,0"
              fill="none"
              stroke="#f97316"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.8"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="360;0"
                dur="8s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </path>

            <circle
              cx="0"
              cy="0"
              r="65"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />

            <g>
              <path
                d="M0,0 L0,-85 A85,85 0 0,1 60,-60 Z"
                fill="url(#radarSweep)"
                opacity="0.3"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="0;360"
                  dur="4s"
                  repeatCount="indefinite"
                  calcMode="linear"
                />
              </path>
            </g>

            <g>
              <animateTransform
                attributeName="transform"
                type="scale"
                values="1;1.05;1"
                dur="4s"
                repeatCount="indefinite"
              />
              <path
                d="M-30,-35 L30,-35 L35,10 L0,45 L-35,10 Z"
                fill="url(#shieldGradAdmin)"
                stroke="#8b5cf6"
                strokeWidth="2"
              />
              <path
                d="M-15,-15 L15,-15"
                stroke="#60a5fa"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M-15,-5 L15,-5"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M-15,5 L5,5"
                stroke="#f97316"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M0,-25 L0,25"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
              />
            </g>

            <circle cx="0" cy="-85" r="4" fill="#3b82f6">
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0;360"
                dur="6s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </circle>
            <circle cx="-85" cy="0" r="4" fill="#f97316">
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="360;0"
                dur="8s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </circle>
          </g>

          <text
            x="160"
            y="275"
            textAnchor="middle"
            fill="#f97316"
            fontSize="22"
            fontWeight="800"
            fontFamily="Outfit, sans-serif"
            letterSpacing="1"
          >
            {t("admin.auth.signIn.title")}
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
            {t("admin.auth.signIn.subtitle")}
          </text>
        </svg>
      </div>
      <div className={styles.rightPane}>
        <div className={styles.formContainer}>
          <SignIn />
        </div>
      </div>
    </main>
  );
}
