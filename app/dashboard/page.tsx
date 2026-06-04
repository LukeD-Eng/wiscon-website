import type { Metadata } from "next";
import AccessPending, { ConfigMissing } from "./components/AccessPending";
import DashboardFrame from "./components/DashboardFrame";
import DashboardLogin from "./components/DashboardLogin";
import ExportActions from "./components/ExportActions";
import FilterBar from "./components/FilterBar";
import RecordsTable from "./components/RecordsTable";
import StatStrip from "./components/StatStrip";
import { getDashboardContext } from "@/lib/dashboard/auth";
import { applyRecordFilters, parseRecordFilters } from "@/lib/dashboard/filters";
import type { DashboardProjectSummary, DashboardRecord, ExportJob } from "@/lib/dashboard/types";

export const metadata: Metadata = {
  title: "WISCON Dashboard",
  description: "Owner-only WISCON project records and export hub.",
};

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const filters = parseRecordFilters(params);
  const context = await getDashboardContext();

  if (context.configError) return <ConfigMissing message={context.configError} />;
  if (!context.user || !context.supabase) return <DashboardLogin />;
  if (!context.account || !context.membership) return <AccessPending email={context.user.email} />;

  const projectsQuery = context.supabase
    .from("dashboard_project_summary")
    .select("*")
    .eq("account_id", context.account.id)
    .order("last_activity_at", { ascending: false });

  let recordsQuery = context.supabase
    .from("dashboard_record_index")
    .select("*")
    .eq("account_id", context.account.id);
  recordsQuery = applyRecordFilters(recordsQuery, filters)
    .order("record_priority", { ascending: true })
    .order("last_activity_at", { ascending: false })
    .limit(150);

  const exportsQuery = context.supabase
    .from("export_jobs")
    .select("*")
    .eq("account_id", context.account.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const [projectsResult, recordsResult, exportsResult] = await Promise.all([
    projectsQuery,
    recordsQuery,
    exportsQuery,
  ]);

  const projects = (projectsResult.data ?? []) as DashboardProjectSummary[];
  const records = (recordsResult.data ?? []) as DashboardRecord[];
  const exportJobs = (exportsResult.data ?? []) as ExportJob[];
  const openRecords = projects.reduce((sum, project) => sum + Number(project.active_record_count ?? 0), 0);

  return (
    <DashboardFrame account={context.account} role={context.membership.role}>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-green">
            Owner Export Hub
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-brand-black">Records</h1>
        </div>
        <ExportActions filters={filters} />
      </div>

      <div className="mb-6">
        <StatStrip
          stats={[
            { label: "Projects", value: projects.length },
            { label: "Open records", value: openRecords },
            { label: "Recent exports", value: exportJobs.length },
          ]}
        />
      </div>

      <section className="mb-8">
        <FilterBar filters={filters} projects={projects} />
        <RecordsTable records={records} />
      </section>
    </DashboardFrame>
  );
}
