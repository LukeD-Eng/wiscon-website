"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUSES = ["active", "completed", "archived"];

export default function ProjectStatusControl({
  projectId,
  status,
}: {
  projectId: string;
  status: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);

  async function updateStatus(nextStatus: string) {
    setValue(nextStatus);
    setSaving(true);

    const res = await fetch(`/api/dashboard/projects/${projectId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });

    setSaving(false);
    if (res.ok) router.refresh();
  }

  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Project status</span>
      <select
        value={value}
        onChange={(event) => updateStatus(event.target.value)}
        disabled={saving}
        className="h-10 w-full min-w-40 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/15 disabled:opacity-60"
      >
        {STATUSES.map((option) => (
          <option key={option} value={option}>
            {option.replace(/_/g, " ")}
          </option>
        ))}
      </select>
    </label>
  );
}
