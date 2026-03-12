"use client";

import { SignIn } from "@clerk/nextjs";
import { useTranslation } from "react-i18next";
import styles from "./page.module.css";

export default function SignInPage() {
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
              id="bookGrad"
              x1="150"
              y1="100"
              x2="150"
              y2="200"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="bgGrad" x1="0" y1="0" x2="300" y2="300">
              <stop offset="0%" stopColor="#1a1625" />
              <stop offset="100%" stopColor="#2d1b2e" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <pattern
            id="grid"
            width="30"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 30 0 L 0 0 0 30"
              fill="none"
              stroke="rgba(255,255,255,0.02)"
              strokeWidth="1"
            />
          </pattern>
          <rect width="300" height="300" fill="url(#grid)" />

          <g transform="translate(150, 140)">
            <g filter="url(#glow)">
              <path
                d="M-35,15 Q0,25 0,0 Q0,25 35,15 L35,-20 Q0,-10 0,-35 Q0,-10 -35,-20 Z"
                fill="url(#bookGrad)"
                opacity="0.9"
              >
                <animate
                  attributeName="d"
                  values="M-35,15 Q0,25 0,0 Q0,25 35,15 L35,-20 Q0,-10 0,-35 Q0,-10 -35,-20 Z; M-35,10 Q0,28 0,-5 Q0,28 35,10 L35,-25 Q0,-5 0,-40 Q0,-5 -35,-25 Z; M-35,15 Q0,25 0,0 Q0,25 35,15 L35,-20 Q0,-10 0,-35 Q0,-10 -35,-20 Z"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </path>
              <path
                d="M-30,10 Q0,18 0,-5 Q0,18 30,10 L30,-22 Q0,-12 0,-35 Q0,-12 -30,-22 Z"
                fill="#ffffff"
                opacity="0.25"
              />
              <path
                d="M-25,5 Q0,12 0,-10 Q0,12 25,5 L25,-25 Q0,-15 0,-37 Q0,-15 -25,-25 Z"
                fill="#ffffff"
                opacity="0.4"
              />
            </g>

            <g opacity="0.7">
              <path
                d="M-20,-30 Q-40,-60 -20,-80"
                fill="none"
                stroke="#f97316"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="4 6"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="20;0"
                  dur="1s"
                  repeatCount="indefinite"
                  calcMode="linear"
                />
              </path>
              <path
                d="M20,-30 Q40,-60 20,-80"
                fill="none"
                stroke="#ec4899"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="4 6"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="20;0"
                  dur="1.2s"
                  repeatCount="indefinite"
                  calcMode="linear"
                />
              </path>
              <path
                d="M0,-35 L0,-85"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="4 6"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="20;0"
                  dur="0.8s"
                  repeatCount="indefinite"
                  calcMode="linear"
                />
              </path>
            </g>

            <circle cx="-20" cy="-80" r="4" fill="#f97316">
              <animate
                attributeName="r"
                values="3;5;3"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.4;1;0.4"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="20" cy="-80" r="4" fill="#ec4899">
              <animate
                attributeName="r"
                values="3;5;3"
                dur="2.4s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.4;1;0.4"
                dur="2.4s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="0" cy="-85" r="5" fill="#8b5cf6">
              <animate
                attributeName="r"
                values="4;6;4"
                dur="1.6s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.5;1;0.5"
                dur="1.6s"
                repeatCount="indefinite"
              />
            </circle>

            <circle cx="-40" cy="30" r="2" fill="#f97316" opacity="0.6">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,-10; 0,0"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="40" cy="20" r="2" fill="#ec4899" opacity="0.6">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,-8; 0,0"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </circle>
          </g>

          <text
            x="150"
            y="245"
            textAnchor="middle"
            fill="#f97316"
            fontSize="22"
            fontWeight="800"
            fontFamily="Outfit, sans-serif"
            letterSpacing="1"
          >
            {t("user.auth.signIn.title")}
          </text>
          <text
            x="150"
            y="265"
            textAnchor="middle"
            fill="#a8a3b3"
            fontSize="12"
            fontFamily="Inter, sans-serif"
            letterSpacing="0.5"
          >
            {t("user.auth.signIn.subtitle")}
          </text>
        </svg>
      </div>
      <div className={styles.rightPane}>
        <div className={styles.formWrapper}>
          <SignIn />
        </div>
      </div>
    </main>
  );
}
