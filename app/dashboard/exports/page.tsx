import AccessPending, { ConfigMissing } from "../components/AccessPending";
import DashboardFrame from "../components/DashboardFrame";
import DashboardLogin from "../components/DashboardLogin";
import { getDashboardContext } from "@/lib/dashboard/auth";
import { formatDateTime, titleCase } from "@/lib/dashboard/format";
import type { ExportJob } from "@/lib/dashboard/types";

export default async function DashboardExportsPage() {
  const context = await getDashboardContext();

  if (context.configError) return <ConfigMissing message={context.configError} />;
  if (!context.user || !context.supabase) return <DashboardLogin />;
  if (!context.account || !context.membership) return <AccessPending email={context.user.email} />;

  const { data } = await context.supabase
    .from("export_jobs")
    .select("*")
    .eq("account_id", context.account.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const jobs = (data ?? []) as ExportJob[];

  return (
    <DashboardFrame account={context.account} role={context.membership.role}>
      <div className="mb-6">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-green">
          Owner Export Hub
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-brand-black">Exports</h1>
      </div>

      <div className="overflow-x-auto border-y border-gray-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Export</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Created</th>
              <th className="px-4 py-3 font-semibold">Completed</th>
              <th className="px-4 py-3 font-semibold">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {jobs.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-gray-500" colSpan={5}>
                  No export jobs yet.
                </td>
              </tr>
            )}
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="px-4 py-4 font-medium text-brand-black">{titleCase(job.job_type)}</td>
                <td className="px-4 py-4">
                  <span className="inline-flex rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700">
                    {titleCase(job.status)}
                  </span>
                </td>
                <td className="px-4 py-4 text-gray-700">{formatDateTime(job.created_at)}</td>
                <td className="px-4 py-4 text-gray-700">{formatDateTime(job.completed_at)}</td>
                <td className="px-4 py-4">
                  {job.status === "completed" && job.result_url ? (
                    <a
                      href={`/api/dashboard/exports/${job.id}?download=1`}
                      className="inline-flex h-9 items-center rounded-md bg-brand-green px-3 text-xs font-semibold text-white transition hover:opacity-90"
                    >
                      Download
                    </a>
                  ) : job.status === "failed" ? (
                    <span className="text-xs text-red-700">{job.error_message ?? "Export failed"}</span>
                  ) : (
                    <span className="text-xs text-gray-500">Preparing</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardFrame>
  );
}
