import Link from "next/link";
import { ExternalLink, FileText, Image as ImageIcon, Volume2 } from "lucide-react";
import { moduleLabel } from "@/lib/dashboard/filters";
import { encodeDashboardFileRef } from "@/lib/dashboard/files";
import { formatDateTime, formatMoney, titleCase } from "@/lib/dashboard/format";
import type { DashboardRecord } from "@/lib/dashboard/types";

function fileHref(record: DashboardRecord, field: "pdf" | "media") {
  if (field === "pdf" && record.pdf_url) {
    return `/api/dashboard/files/${encodeDashboardFileRef({
      recordType: record.record_type,
      recordId: record.record_id,
      field: "pdf",
    })}`;
  }

  if (!record.media_url) return null;

  const mediaField =
    record.record_type === "snagtrack"
      ? "original"
      : record.record_type === "leadgate"
        ? "photo"
        : record.record_type === "site_diary"
          ? "audio"
          : record.record_type === "safeguard_incident"
            ? "photo"
            : record.record_type === "safeguard_toolbox"
              ? "sheet"
              : null;

  if (!mediaField) return null;

  return `/api/dashboard/files/${encodeDashboardFileRef({
    recordType: record.record_type,
    recordId: record.record_id,
    field: mediaField,
  })}`;
}

export default function RecordsTable({ records }: { records: DashboardRecord[] }) {
  if (records.length === 0) {
    return (
      <div className="border-y border-gray-200 bg-white px-4 py-12 text-center">
        <p className="text-sm font-medium text-gray-600">No records found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border-y border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Record</th>
            <th className="px-4 py-3 font-semibold">Project</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Value</th>
            <th className="px-4 py-3 font-semibold">Party</th>
            <th className="px-4 py-3 font-semibold">Updated</th>
            <th className="px-4 py-3 font-semibold">Files</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {records.map((record) => {
            const pdfHref = fileHref(record, "pdf");
            const mediaHref = fileHref(record, "media");

            return (
              <tr key={`${record.record_type}-${record.record_id}`} className="align-top hover:bg-gray-50">
                <td className="max-w-sm px-4 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-brand-black">{record.record_ref}</span>
                    <span className="text-xs font-medium uppercase tracking-wide text-brand-green">
                      {moduleLabel(record.record_type)}
                    </span>
                    <span className="line-clamp-2 text-gray-700">{record.title}</span>
                    {record.description && (
                      <span className="line-clamp-2 text-xs leading-relaxed text-gray-500">
                        {record.description}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  {record.project_id ? (
                    <Link
                      href={`/dashboard/projects/${record.project_id}`}
                      className="inline-flex items-center gap-1 font-medium text-gray-800 hover:text-brand-green"
                    >
                      {record.project_name}
                      <ExternalLink aria-hidden="true" size={13} />
                    </Link>
                  ) : (
                    <span className="text-gray-600">{record.project_name}</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700">
                    {titleCase(record.status)}
                  </span>
                </td>
                <td className="px-4 py-4 text-gray-700">{formatMoney(record.amount_zar)}</td>
                <td className="px-4 py-4 text-gray-700">{record.primary_party ?? "—"}</td>
                <td className="px-4 py-4 text-gray-700">{formatDateTime(record.last_activity_at)}</td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    {pdfHref && (
                      <a
                        href={pdfHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition hover:border-brand-green hover:text-brand-green"
                        title="PDF"
                      >
                        <FileText aria-hidden="true" size={16} />
                      </a>
                    )}
                    {mediaHref && (
                      <a
                        href={mediaHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition hover:border-brand-green hover:text-brand-green"
                        title="Media"
                      >
                        {record.record_type === "site_diary" ? (
                          <Volume2 aria-hidden="true" size={16} />
                        ) : (
                          <ImageIcon aria-hidden="true" size={16} />
                        )}
                      </a>
                    )}
                    {!pdfHref && !mediaHref && <span className="text-gray-400">—</span>}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
