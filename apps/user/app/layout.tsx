import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Providers } from "./providers";
import "@fontsource-variable/literata";
import "@fontsource-variable/outfit";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shelf AI | Your Library",
  description:
    "AI-powered library management system, discover, borrow, and explore books",
  keywords: ["Library", "Books", "Reading", "AI", "Recommendations"],
  authors: [{ name: "Shelf AI Team" }],
  openGraph: {
    title: "Shelf AI | Your Library",
    description: "Discover, borrow, and explore books in the modern era.",
    url: "https://shelfai.up.railway.app",
    siteName: "Shelf AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shelf AI | Your Library",
    description: "AI-powered library management system.",
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#f97316",
          colorBackground: "#1a1625",
          colorForeground: "#f1f0f3",
          colorNeutral: "#a8a3b3",
          fontFamily: "'Literata Variable', 'Inter', sans-serif",
          borderRadius: "0.75rem",
        },
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
