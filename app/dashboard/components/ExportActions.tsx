"use client";

import { useRouter } from "next/navigation";
import { Download, Package } from "lucide-react";
import { useState } from "react";
import type { RecordFilters } from "@/lib/dashboard/types";

export default function ExportActions({
  filters,
  projectId,
}: {
  filters: RecordFilters;
  projectId?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<"csv" | "pack" | null>(null);

  async function downloadCsv() {
    setBusy("csv");
    const res = await fetch("/api/dashboard/exports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "csv", filters: { ...filters, projectId: projectId ?? filters.projectId } }),
    });

    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "wiscon-records.csv";
      link.click();
      URL.revokeObjectURL(url);
    }

    setBusy(null);
  }

  async function queuePack() {
    if (!projectId && !filters.projectId) return;

    setBusy("pack");
    const res = await fetch("/api/dashboard/exports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "project_pack",
        filters: { ...filters, projectId: projectId ?? filters.projectId },
      }),
    });

    setBusy(null);
    if (res.ok) router.push("/dashboard/exports");
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={downloadCsv}
        disabled={busy !== null}
        className="inline-flex h-10 items-center gap-2 rounded-md bg-brand-green px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Download aria-hidden="true" size={16} />
        {busy === "csv" ? "Preparing..." : "CSV"}
      </button>
      <button
        type="button"
        onClick={queuePack}
        disabled={busy !== null || (!projectId && !filters.projectId)}
        className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-800 transition hover:border-brand-green hover:text-brand-green disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Package aria-hidden="true" size={16} />
        {busy === "pack" ? "Queueing..." : "Pack"}
      </button>
    </div>
  );
}
