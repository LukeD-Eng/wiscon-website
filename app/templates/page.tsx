import type { Metadata } from "next";
import { Suspense } from "react";
import TemplatesPage from "./TemplatesPage";

export const metadata: Metadata = {
  title: "WhatsApp Templates for Contractors | WISCON",
  description:
    "Nine copy-paste WhatsApp templates for quote acceptance, variations, lead qualification, snags, site records, and H&S.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <TemplatesPage />
    </Suspense>
  );
}
