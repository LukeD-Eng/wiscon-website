import type { Metadata } from "next";
import VariProofPage from "./VariProofPage";

export const metadata: Metadata = {
  title: "Free Change Order Templates — VariProof (Module 1 of WISCON)",
  description:
    "5 copy-paste WhatsApp templates that create a written record of every change order. Free for South African contractors. VariProof is Module 1 of the WISCON platform.",
  openGraph: {
    title: "Free Change Order Templates — VariProof (Module 1 of WISCON)",
    description:
      "Stop losing money on work you already did. Free template pack for South African contractors. Part of the WISCON compliance platform.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/variproof`,
    siteName: "WISCON",
    locale: "en_ZA",
    type: "website",
  },
};

export default function Page() {
  return <VariProofPage />;
}
