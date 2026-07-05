export type DashboardFileRef = {
  recordType: string;
  recordId: string;
  field: string;
};

type FileField = {
  table: string;
  field: string;
};

const FILE_FIELDS: Record<string, Record<string, FileField>> = {
  variproof: {
    pdf: { table: "variation_orders", field: "pdf_url" },
  },
  quoteflow: {
    pdf: { table: "quotes", field: "pdf_url" },
  },
  snagtrack: {
    original: { table: "snags", field: "original_image_url" },
    audio: { table: "snags", field: "audio_url" },
    completion: { table: "snags", field: "completion_image_url" },
  },
  leadgate: {
    photo: { table: "leads", field: "photo_url" },
  },
  rfitrack: {
    attachment: { table: "rfis", field: "attachment_url" },
    audio: { table: "rfis", field: "audio_url" },
    response: { table: "rfis", field: "response_attachment_url" },
  },
  safeguard_incident: {
    pdf: { table: "incidents", field: "pdf_url" },
    photo: { table: "incidents", field: "photo_url" },
  },
  safeguard_toolbox: {
    pdf: { table: "toolbox_talks", field: "pdf_url" },
    sheet: { table: "toolbox_talks", field: "sign_in_sheet_url" },
  },
  site_diary: {
    audio: { table: "diary_entries", field: "audio_url" },
  },
  project_memory: {
    asset: { table: "project_memory_items", field: "primary_asset_url" },
  },
};

export function encodeDashboardFileRef(ref: DashboardFileRef) {
  return `${ref.recordType}.${ref.recordId}.${ref.field}`;
}

export function parseDashboardFileId(fileId: string) {
  const [recordType, recordId, field] = fileId.split(".");
  const config = FILE_FIELDS[recordType]?.[field];

  if (!recordType || !recordId || !field || !config) {
    return null;
  }

  return { recordType, recordId, fileField: field, table: config.table, field: config.field };
}

export function parseStoragePublicUrl(rawUrl: string) {
  try {
    const url = new URL(rawUrl);
    const marker = "/storage/v1/object/public/";
    const index = url.pathname.indexOf(marker);

    if (index >= 0) {
      const storagePath = decodeURIComponent(url.pathname.slice(index + marker.length));
      const [bucket, ...pathParts] = storagePath.split("/");
      return bucket && pathParts.length ? { bucket, path: pathParts.join("/") } : null;
    }

    return null;
  } catch {
    // Fall through to bucket/path parsing.
  }

  const [bucket, ...pathParts] = rawUrl.split("/");
  return bucket && pathParts.length ? { bucket, path: pathParts.join("/") } : null;
}
