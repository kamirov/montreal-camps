import { ThemeProvider } from "@/contexts/ThemeContext";
import { LocalizationProvider } from "@/localization/context";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Montreal Camps Directory | Répertoire des Camps de Montréal",
  description:
    "Find summer and vacation camps in Greater Montreal with financial assistance options. Trouvez des camps d'été et de vacances dans le Grand Montréal avec des options d'aide financière.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <Suspense fallback={null}>
            <LocalizationProvider>{children}</LocalizationProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
