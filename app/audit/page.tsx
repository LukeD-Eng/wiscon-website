import type { Metadata } from "next";
import AuditPage from "./AuditPage";

export const metadata: Metadata = {
  title: "Free WhatsApp Workflow Audit | WISCON",
  description:
    "Answer 6 questions about how you run jobs on WhatsApp. Get your Exposure Score, biggest gap, and 9 copy-paste templates.",
};

export default function Page() {
  return <AuditPage />;
}
