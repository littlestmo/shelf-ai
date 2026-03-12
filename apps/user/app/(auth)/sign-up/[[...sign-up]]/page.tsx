"use client";

import { SignUp } from "@clerk/nextjs";
import { useTranslation } from "react-i18next";
import styles from "./page.module.css";

export default function SignUpPage() {
  const { t } = useTranslation();
  return (
    <main className={styles.mainContainer}>
      <div className={styles.leftPane}>
        <svg
          width="300"
          height="300"
          viewBox="0 0 300 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="userGrad"
              x1="150"
              y1="50"
              x2="150"
              y2="150"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="300" y2="300">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <filter id="userGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <g transform="translate(150, 130)">
            <circle
              cx="0"
              cy="0"
              r="75"
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth="1.5"
              opacity="0.2"
              strokeDasharray="6 6"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0;360"
                dur="24s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </circle>
            <circle
              cx="0"
              cy="0"
              r="60"
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth="1"
              opacity="0.4"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="360;0"
                dur="18s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </circle>

            <g opacity="0.5" stroke="#3b82f6" strokeWidth="2">
              <line x1="0" y1="-56" x2="0" y2="-64" />
              <line x1="0" y1="56" x2="0" y2="64" />
              <line x1="-56" y1="0" x2="-64" y2="0" />
              <line x1="56" y1="0" x2="64" y2="0" />
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="360;0"
                dur="18s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </g>

            <g opacity="0.3">
              <line
                x1="-42"
                y1="-42"
                x2="-20"
                y2="-20"
                stroke="#8b5cf6"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <line
                x1="42"
                y1="-42"
                x2="20"
                y2="-20"
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <line
                x1="-42"
                y1="42"
                x2="-20"
                y2="20"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <line
                x1="42"
                y1="42"
                x2="20"
                y2="20"
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            </g>

            <g filter="url(#userGlow)">
              <circle cx="0" cy="-15" r="18" fill="url(#userGrad)">
                <animate
                  attributeName="transform"
                  type="translate"
                  values="0,0; 0,-2; 0,0"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
              <path
                d="M-32,35 Q0,8 32,35 L32,45 Q0,45 -32,45 Z"
                fill="url(#userGrad)"
              >
                <animate
                  attributeName="d"
                  values="M-32,35 Q0,8 32,35 L32,45 Q0,45 -32,45 Z; M-34,38 Q0,12 34,38 L34,48 Q0,48 -34,48 Z; M-32,35 Q0,8 32,35 L32,45 Q0,45 -32,45 Z"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </path>
            </g>

            <circle
              cx="0"
              cy="5"
              r="30"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              opacity="0"
            >
              <animate
                attributeName="r"
                values="30;65"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.5;0"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
          </g>

          <text
            x="150"
            y="255"
            textAnchor="middle"
            fill="#f97316"
            fontSize="20"
            fontWeight="700"
            fontFamily="Outfit, sans-serif"
            letterSpacing="0.5"
          >
            {t("user.auth.signUp.title")}
          </text>
          <text
            x="150"
            y="275"
            textAnchor="middle"
            fill="#8e95a3"
            fontSize="11"
            fontFamily="Inter, sans-serif"
          >
            {t("user.auth.signUp.subtitle")}
          </text>
        </svg>
      </div>
      <div className={styles.rightPane}>
        <div className={styles.formWrapper}>
          <SignUp />
        </div>
      </div>
    </main>
  );
}
