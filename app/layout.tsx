import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WISCON — Structured Construction Communication in WhatsApp",
  description:
    "WISCON turns WhatsApp construction communication into tracked, searchable, accountable workflows.",
  other: {
    "facebook-domain-verification": "u2tj1g1vgx8tv3nqoyl8ssnfyzricj",
  },
  openGraph: {
    title: "WISCON — Structured Construction Communication in WhatsApp",
    description:
      "WISCON turns WhatsApp construction communication into tracked, searchable, accountable workflows.",
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
