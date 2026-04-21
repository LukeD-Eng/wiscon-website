import type { Metadata } from "next";
import VariProofPage from "./VariProofPage";

export const metadata: Metadata = {
  title: "Free WhatsApp Change Order Templates — VariProof by WISCON",
  description:
    "5 copy-paste WhatsApp templates that create a written record of every change order before you lift a finger. Free for South African contractors.",
  openGraph: {
    title: "Free WhatsApp Change Order Templates — VariProof by WISCON",
    description:
      "Stop losing money on work you already did. Free template pack for South African contractors.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/variproof`,
    siteName: "WISCON",
    locale: "en_ZA",
    type: "website",
  },
};

export default function Page() {
  return <VariProofPage />;
}
