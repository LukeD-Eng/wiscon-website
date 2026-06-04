"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ReportRecipientToggle({
  projectId,
  memberId,
  enabled,
}: {
  projectId: string;
  memberId: string;
  enabled: boolean;
}) {
  const router = useRouter();
  const [checked, setChecked] = useState(enabled);
  const [saving, setSaving] = useState(false);

  async function update(nextValue: boolean) {
    setChecked(nextValue);
    setSaving(true);

    const res = await fetch(`/api/dashboard/projects/${projectId}/members/${memberId}/report-recipient`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportRecipient: nextValue }),
    });

    setSaving(false);
    if (res.ok) router.refresh();
  }

  return (
    <label className="inline-flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        disabled={saving}
        onChange={(event) => update(event.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-brand-green focus:ring-brand-green disabled:opacity-60"
      />
      <span className="text-sm text-gray-700">{checked ? "Yes" : "No"}</span>
    </label>
  );
}
