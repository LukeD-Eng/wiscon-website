import type { RecordFilters } from "@/lib/dashboard/types";

export const MODULE_OPTIONS = [
  { value: "variproof", label: "VariProof" },
  { value: "leadgate", label: "LeadGate" },
  { value: "snagtrack", label: "SnagTrack" },
  { value: "rfitrack", label: "RFITrack" },
  { value: "quoteflow", label: "QuoteFlow" },
  { value: "safeguard_incident", label: "SafeGuard incidents" },
  { value: "safeguard_toolbox", label: "Toolbox talks" },
  { value: "site_diary", label: "Site Diary" },
  { value: "project_memory", label: "Project Memory" },
] as const;

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function clean(value: string | undefined) {
  const next = value?.trim();
  return next ? next : undefined;
}

function cleanDate(value: string | undefined) {
  const next = clean(value);
  return next && /^\d{4}-\d{2}-\d{2}$/.test(next) ? next : undefined;
}

export function parseRecordFilters(params: SearchParams): RecordFilters {
  return {
    projectId: clean(first(params.projectId)),
    module: clean(first(params.module)),
    status: clean(first(params.status)),
    trade: clean(first(params.trade)),
    leadTag: clean(first(params.leadTag)),
    incidentType: clean(first(params.incidentType)),
    from: cleanDate(first(params.from)),
    to: cleanDate(first(params.to)),
    q: clean(first(params.q)),
  };
}

export function parseRecordFiltersFromForm(formData: FormData): RecordFilters {
  return parseRecordFilters({
    projectId: String(formData.get("projectId") ?? ""),
    module: String(formData.get("module") ?? ""),
    status: String(formData.get("status") ?? ""),
    trade: String(formData.get("trade") ?? ""),
    leadTag: String(formData.get("leadTag") ?? ""),
    incidentType: String(formData.get("incidentType") ?? ""),
    from: String(formData.get("from") ?? ""),
    to: String(formData.get("to") ?? ""),
    q: String(formData.get("q") ?? ""),
  });
}

export function filtersToSearchParams(filters: RecordFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return params;
}

type FilterableQuery<T> = {
  eq: (column: string, value: unknown) => T;
  gte: (column: string, value: unknown) => T;
  lte: (column: string, value: unknown) => T;
  ilike: (column: string, pattern: string) => T;
};

export function applyRecordFilters<T extends FilterableQuery<T>>(query: T, filters: RecordFilters) {
  let next = query;

  if (filters.projectId) next = next.eq("project_id", filters.projectId);
  if (filters.module) next = next.eq("record_type", filters.module);
  if (filters.status) next = next.eq("status", filters.status);
  if (filters.trade) next = next.eq("trade", filters.trade);
  if (filters.leadTag) next = next.eq("lead_tag", filters.leadTag);
  if (filters.incidentType) next = next.eq("incident_type", filters.incidentType);
  if (filters.from) next = next.gte("created_at", `${filters.from}T00:00:00.000Z`);
  if (filters.to) next = next.lte("created_at", `${filters.to}T23:59:59.999Z`);
  if (filters.q) next = next.ilike("search_text", `%${filters.q}%`);

  return next;
}

export function moduleLabel(value: string) {
  return MODULE_OPTIONS.find((option) => option.value === value)?.label ?? value;
}
