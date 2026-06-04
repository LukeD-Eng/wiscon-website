export type AccountRole = "owner" | "admin" | "viewer";

export type AccountRow = {
  id: string;
  name: string;
  subscription_tier: string | null;
  subscription_status: string | null;
};

export type AccountMemberRow = {
  id: string;
  account_id: string;
  role: AccountRole;
  accounts: AccountRow | AccountRow[] | null;
};

export type DashboardProjectSummary = {
  account_id: string;
  project_id: string;
  project_name: string;
  location: string | null;
  project_code: string;
  project_status: string;
  created_at: string;
  total_record_count: number;
  active_record_count: number;
  last_activity_at: string;
};

export type DashboardRecord = {
  account_id: string;
  project_id: string | null;
  project_name: string;
  record_type: string;
  record_id: string;
  record_ref: string;
  title: string;
  description: string | null;
  status: string | null;
  trade: string | null;
  lead_tag: string | null;
  incident_type: string | null;
  amount_zar: number | null;
  primary_party: string | null;
  pdf_url: string | null;
  media_url: string | null;
  created_at: string;
  last_activity_at: string;
  record_priority: number;
  search_text?: string | null;
};

export type ExportJob = {
  id: string;
  account_id: string;
  requested_by_auth_user_id: string;
  job_type: "csv" | "project_pack";
  status: "queued" | "processing" | "completed" | "failed";
  filters: Record<string, unknown>;
  result_url: string | null;
  result: Record<string, unknown> | null;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
};

export type RecordFilters = {
  projectId?: string;
  module?: string;
  status?: string;
  trade?: string;
  leadTag?: string;
  incidentType?: string;
  from?: string;
  to?: string;
  q?: string;
};
