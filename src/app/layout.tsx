import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "PiterPay - היועץ חכם לניהול ההוצאות",
  description: "נהל את הכסף שלך בחוכמה! PiterPay עוזר לך לעקוב אחרי ההוצאות שלך, להגדיר תקציבים חודשיים ולראות בדיוק לאן הכסף שלך הולך.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-slate-50`}
      >
        {children}
      </body>
    </html>
  );
}
