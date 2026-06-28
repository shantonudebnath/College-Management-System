import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TeachersProvider } from '@/context/TeachersContext';
import { NoticesProvider } from '@/context/NoticesContext';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "এগারসিন্দুর ঈশাখান সিনিয়র মাদ্রাসা | Egaro Sendur Ishakhan Senior Madrasha",
  description: "EIIN: 110590 | বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড অনুমোদিত | স্থাপিত ১৯৫৮ | পাকুন্দিয়া, কিশোরগঞ্জ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7c3aed" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="EISIM" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="min-h-screen bg-[#f8f7ff] antialiased">
        <TeachersProvider><NoticesProvider>{children}</NoticesProvider></TeachersProvider>
      </body>
    </html>
  );
}
