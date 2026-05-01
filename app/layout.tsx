import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WISCON — Construction Compliance, Delivered Through WhatsApp",
  description:
    "WISCON is the compliance infrastructure for South African construction. Variation orders, lead qualification, defect tracking, formal quoting, H&S reporting, and site diaries — all in WhatsApp, all under one subscription.",
  other: {
    "facebook-domain-verification": "u2tj1g1vgx8tv3nqoyl8ssnfyzricj",
  },
  openGraph: {
    title: "WISCON — Construction Compliance, Delivered Through WhatsApp",
    description:
      "The compliance infrastructure for SA construction, delivered through WhatsApp. One platform. Six modules. One subscription.",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "WISCON",
    locale: "en_ZA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
