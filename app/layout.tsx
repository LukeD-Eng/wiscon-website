import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WISCON — WhatsApp Integrated Services in Construction",
  description:
    "WhatsApp-native tools built for the construction industry. Qualify leads, formalise change orders, and manage punch lists — all on WhatsApp.",
  openGraph: {
    title: "WISCON — WhatsApp Integrated Services in Construction",
    description:
      "WhatsApp-native tools built for the construction industry. Join the waitlist.",
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
