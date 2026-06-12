import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TeachersProvider } from '@/context/TeachersContext';
import { NoticesProvider } from '@/context/NoticesContext';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "নূরে ইসলাম মাদ্রাসা | Noor-E-Islam Madrasha",
  description: "বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড অনুমোদিত — ডিজিটাল কলেজ ম্যানেজমেন্ট সিস্টেম",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="min-h-screen bg-[#f8f7ff] antialiased">
        <TeachersProvider><NoticesProvider>{children}</NoticesProvider></TeachersProvider>
      </body>
    </html>
  );
}
