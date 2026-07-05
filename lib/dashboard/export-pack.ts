import type { SupabaseClient } from "@supabase/supabase-js";
import JSZip from "jszip";
import { recordsToCsv, rowsToCsv } from "@/lib/dashboard/csv";
import { parseStoragePublicUrl } from "@/lib/dashboard/files";
import { applyRecordFilters } from "@/lib/dashboard/filters";
import type { AccountRow, DashboardRecord, RecordFilters } from "@/lib/dashboard/types";

export const EXPORT_PACK_BUCKET = "dashboard-export-packs";

type DbRow = Record<string, unknown>;

type SectionConfig = {
  module: string;
  label: string;
  filename: string;
  table: string;
  select: string;
  columns: string[];
  fileFields: string[];
};

type ChainableQuery<T> = {
  eq: (column: string, value: unknown) => T;
  gte: (column: string, value: unknown) => T;
  lte: (column: string, value: unknown) => T;
  order: (column: string, options: { ascending: boolean }) => T;
  limit: (count: number) => T;
};

type ProjectPackInput = {
  supabase: SupabaseClient;
  serviceClient: SupabaseClient;
  account: AccountRow;
  project: { id: string; name: string; project_code?: string | null };
  filters: RecordFilters;
  jobId: string;
};

type ProjectPackResult = {
  bucket: string;
  path: string;
  records_count: number;
  files_count: number;
  sections: Array<{ module: string; label: string; filename: string; count: number }>;
  generated_at: string;
};

const SIGNED_LINK_SECONDS = 60 * 60 * 24 * 7;

const PROJECT_SECTIONS: SectionConfig[] = [
  {
    module: "variproof",
    label: "VariProof variation orders",
    filename: "variproof-variation-orders.csv",
    table: "variation_orders",
    select:
      "id,status,description,cost_zar,timeline_days,client_phone,pdf_url,approved_at,expires_at,created_at",
    columns: [
      "id",
      "status",
      "description",
      "cost_zar",
      "timeline_days",
      "client_phone",
      "pdf_url",
      "approved_at",
      "expires_at",
      "created_at",
    ],
    fileFields: ["pdf_url"],
  },
  {
    module: "snagtrack",
    label: "SnagTrack snags",
    filename: "snagtrack-snags.csv",
    table: "snags",
    select:
      "id,trade,status,description_text,original_image_url,audio_url,completion_image_url,created_at,closed_at",
    columns: [
      "id",
      "trade",
      "status",
      "description_text",
      "original_image_url",
      "audio_url",
      "completion_image_url",
      "created_at",
      "closed_at",
    ],
    fileFields: ["original_image_url", "audio_url", "completion_image_url"],
  },
  {
    module: "rfitrack",
    label: "RFITrack RFIs",
    filename: "rfitrack-rfis.csv",
    table: "rfis",
    select:
      "id,status,discipline,question_text,attachment_url,audio_url,response_text,response_attachment_url,created_at,closed_at",
    columns: [
      "id",
      "status",
      "discipline",
      "question_text",
      "attachment_url",
      "audio_url",
      "response_text",
      "response_attachment_url",
      "created_at",
      "closed_at",
    ],
    fileFields: ["attachment_url", "audio_url", "response_attachment_url"],
  },
  {
    module: "quoteflow",
    label: "QuoteFlow quotes",
    filename: "quoteflow-quotes.csv",
    table: "quotes",
    select:
      "id,status,scope_description,line_items,total_zar,deposit_percent,payment_terms,valid_until,start_date,client_phone,pdf_url,accepted_at,declined_at,expired_at,created_at",
    columns: [
      "id",
      "status",
      "scope_description",
      "line_items",
      "total_zar",
      "deposit_percent",
      "payment_terms",
      "valid_until",
      "start_date",
      "client_phone",
      "pdf_url",
      "accepted_at",
      "declined_at",
      "expired_at",
      "created_at",
    ],
    fileFields: ["pdf_url"],
  },
  {
    module: "safeguard_incident",
    label: "SafeGuard incidents",
    filename: "safeguard-incidents.csv",
    table: "incidents",
    select:
      "id,incident_type,description,parties_involved,location_on_site,photo_url,pdf_url,reported_to_dol,created_at",
    columns: [
      "id",
      "incident_type",
      "description",
      "parties_involved",
      "location_on_site",
      "photo_url",
      "pdf_url",
      "reported_to_dol",
      "created_at",
    ],
    fileFields: ["photo_url", "pdf_url"],
  },
  {
    module: "safeguard_toolbox",
    label: "SafeGuard toolbox talks",
    filename: "safeguard-toolbox-talks.csv",
    table: "toolbox_talks",
    select: "id,topic,attendee_count,sign_in_sheet_url,pdf_url,created_at",
    columns: ["id", "topic", "attendee_count", "sign_in_sheet_url", "pdf_url", "created_at"],
    fileFields: ["sign_in_sheet_url", "pdf_url"],
  },
  {
    module: "site_diary",
    label: "Site Diary entries",
    filename: "site-diary-entries.csv",
    table: "diary_entries",
    select:
      "id,entry_date,worker_count,trades_present,work_completed,audio_url,weather,delays_or_incidents,created_at",
    columns: [
      "id",
      "entry_date",
      "worker_count",
      "trades_present",
      "work_completed",
      "audio_url",
      "weather",
      "delays_or_incidents",
      "created_at",
    ],
    fileFields: ["audio_url"],
  },
  {
    module: "project_memory",
    label: "Project Memory",
    filename: "project-memory.csv",
    table: "project_memory_items",
    select:
      "id,source_type,source_record_type,source_record_id,event_type,category,title,summary,body_text,original_sender_phone,occurred_at,status,primary_asset_url,metadata,created_at",
    columns: [
      "id",
      "source_type",
      "source_record_type",
      "source_record_id",
      "event_type",
      "category",
      "title",
      "summary",
      "body_text",
      "original_sender_phone",
      "occurred_at",
      "status",
      "primary_asset_url",
      "metadata",
      "created_at",
    ],
    fileFields: ["primary_asset_url"],
  },
];

function applyDateFilters<T extends ChainableQuery<T>>(query: T, filters: RecordFilters) {
  let next = query;

  if (filters.from) next = next.gte("created_at", `${filters.from}T00:00:00.000Z`);
  if (filters.to) next = next.lte("created_at", `${filters.to}T23:59:59.999Z`);

  return next;
}

function sectionColumns(columns: string[]) {
  return columns.map((key) => ({
    label: key,
    value: (row: DbRow) => row[key],
  }));
}

function formatReadme(input: ProjectPackInput, result: Omit<ProjectPackResult, "bucket" | "path">) {
  return [
    "WISCON Project Export Pack",
    "",
    `Account: ${input.account.name}`,
    `Project: ${input.project.name}`,
    `Generated: ${result.generated_at}`,
    `Records: ${result.records_count}`,
    `Files listed: ${result.files_count}`,
    "",
    "Contents",
    "- records.csv: sorted cross-module dashboard records",
    "- files.csv: signed links for available PDFs and media",
    "- module CSVs: source-table exports grouped by WISCON module",
    "",
    `Signed file links expire after ${SIGNED_LINK_SECONDS / 86400} days.`,
    "Signed/audit records are exported read-only. Use WISCON support for retention or legal deletion review.",
    "",
  ].join("\n");
}

async function signStorageLink(serviceClient: SupabaseClient, rawUrl: unknown) {
  if (typeof rawUrl !== "string" || !rawUrl.trim()) return null;

  const storagePath = parseStoragePublicUrl(rawUrl);
  if (!storagePath) return null;

  const { data, error } = await serviceClient.storage
    .from(storagePath.bucket)
    .createSignedUrl(storagePath.path, SIGNED_LINK_SECONDS);

  if (error || !data?.signedUrl) return null;

  return {
    bucket: storagePath.bucket,
    path: storagePath.path,
    signed_url: data.signedUrl,
    expires_at: new Date(Date.now() + SIGNED_LINK_SECONDS * 1000).toISOString(),
  };
}

export async function buildProjectExportPack(input: ProjectPackInput): Promise<ProjectPackResult> {
  const filters = { ...input.filters, projectId: input.project.id };
  let recordsQuery = input.supabase
    .from("dashboard_record_index")
    .select("*")
    .eq("account_id", input.account.id);

  recordsQuery = applyRecordFilters(recordsQuery, filters)
    .order("record_priority", { ascending: true })
    .order("last_activity_at", { ascending: false })
    .limit(5000);

  const { data: recordsData, error: recordsError } = await recordsQuery;
  if (recordsError) throw new Error(recordsError.message);

  const records = (recordsData ?? []) as DashboardRecord[];
  const zip = new JSZip();
  const generatedAt = new Date().toISOString();
  const sectionResults: ProjectPackResult["sections"] = [];
  const fileRows: DbRow[] = [];

  zip.file("records.csv", recordsToCsv(records));

  for (const section of PROJECT_SECTIONS) {
    if (filters.module && filters.module !== section.module) continue;

    let query = input.supabase
      .from(section.table)
      .select(section.select)
      .eq("project_id", input.project.id);

    query = applyDateFilters(query, filters).order("created_at", { ascending: true }).limit(5000);

    const { data, error } = await query;
    if (error) throw new Error(`${section.label}: ${error.message}`);

    const rows = (data ?? []) as unknown as DbRow[];
    zip.file(section.filename, rowsToCsv(sectionColumns(section.columns), rows));
    sectionResults.push({
      module: section.module,
      label: section.label,
      filename: section.filename,
      count: rows.length,
    });

    for (const row of rows) {
      for (const field of section.fileFields) {
        const rawUrl = row[field];
        if (!rawUrl) continue;

        const signed = await signStorageLink(input.serviceClient, rawUrl);
        fileRows.push({
          module: section.module,
          record_id: row.id,
          field,
          source_url: rawUrl,
          bucket: signed?.bucket ?? null,
          storage_path: signed?.path ?? null,
          signed_url: signed?.signed_url ?? null,
          expires_at: signed?.expires_at ?? null,
          status: signed ? "signed" : "unavailable",
        });
      }
    }
  }

  zip.file(
    "files.csv",
    rowsToCsv(
      [
        { label: "module", value: (row: DbRow) => row.module },
        { label: "record_id", value: (row: DbRow) => row.record_id },
        { label: "field", value: (row: DbRow) => row.field },
        { label: "bucket", value: (row: DbRow) => row.bucket },
        { label: "storage_path", value: (row: DbRow) => row.storage_path },
        { label: "signed_url", value: (row: DbRow) => row.signed_url },
        { label: "expires_at", value: (row: DbRow) => row.expires_at },
        { label: "status", value: (row: DbRow) => row.status },
        { label: "source_url", value: (row: DbRow) => row.source_url },
      ],
      fileRows
    )
  );

  const summary = {
    records_count: records.length,
    files_count: fileRows.length,
    sections: sectionResults,
    generated_at: generatedAt,
  };

  zip.file("manifest.json", JSON.stringify({ account: input.account, project: input.project, ...summary }, null, 2));
  zip.file("README.txt", formatReadme(input, summary));

  const buffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
  const path = `${input.account.id}/${input.project.id}/${input.jobId}.zip`;

  const { error: uploadError } = await input.serviceClient.storage
    .from(EXPORT_PACK_BUCKET)
    .upload(path, buffer, {
      contentType: "application/zip",
      upsert: true,
    });

  if (uploadError) throw new Error(uploadError.message);

  return {
    bucket: EXPORT_PACK_BUCKET,
    path,
    ...summary,
  };
}
