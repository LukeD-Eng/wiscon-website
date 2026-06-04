import type { DashboardRecord } from "@/lib/dashboard/types";

type CsvColumn<T> = {
  key?: keyof T;
  label: string;
  value?: (row: T) => unknown;
};

const COLUMNS: Array<CsvColumn<DashboardRecord>> = [
  { key: "record_ref", label: "Record" },
  { key: "record_type", label: "Module" },
  { key: "project_name", label: "Project" },
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "status", label: "Status" },
  { key: "trade", label: "Trade" },
  { key: "lead_tag", label: "Lead Tag" },
  { key: "incident_type", label: "Incident Type" },
  { key: "amount_zar", label: "Amount ZAR" },
  { key: "primary_party", label: "Primary Party" },
  { key: "created_at", label: "Created At" },
  { key: "last_activity_at", label: "Last Activity At" },
  { key: "pdf_url", label: "PDF URL" },
  { key: "media_url", label: "Media URL" },
];

function escapeCell(value: unknown) {
  if (value === null || value === undefined) return "";
  const normalized = typeof value === "object" ? JSON.stringify(value) : String(value);
  const text = normalized.replace(/"/g, '""');
  return /[",\n\r]/.test(text) ? `"${text}"` : text;
}

export function rowsToCsv<T>(columns: Array<CsvColumn<T>>, rows: T[]) {
  const header = columns.map((column) => escapeCell(column.label)).join(",");
  const body = rows.map((row) =>
    columns
      .map((column) => {
        if (column.value) return escapeCell(column.value(row));
        if (!column.key) return "";
        return escapeCell(row[column.key]);
      })
      .join(",")
  );

  return [header, ...body].join("\n");
}

export function recordsToCsv(records: DashboardRecord[]) {
  return rowsToCsv(COLUMNS, records);
}
