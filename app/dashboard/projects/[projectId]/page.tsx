import { notFound } from "next/navigation";
import AccessPending, { ConfigMissing } from "../../components/AccessPending";
import DashboardFrame from "../../components/DashboardFrame";
import DashboardLogin from "../../components/DashboardLogin";
import ExportActions from "../../components/ExportActions";
import ProjectStatusControl from "../../components/ProjectStatusControl";
import ReportRecipientToggle from "../../components/ReportRecipientToggle";
import RecordsTable from "../../components/RecordsTable";
import StatStrip from "../../components/StatStrip";
import { getDashboardContext } from "@/lib/dashboard/auth";
import { formatDateTime, titleCase } from "@/lib/dashboard/format";
import type { DashboardProjectSummary, DashboardRecord } from "@/lib/dashboard/types";

type PageProps = {
  params: Promise<{ projectId: string }>;
};

type ProjectMember = {
  id: string;
  role: string;
  trade: string | null;
  report_recipient: boolean;
  users: { name: string | null; phone_number: string } | { name: string | null; phone_number: string }[] | null;
};

export default async function DashboardProjectPage({ params }: PageProps) {
  const { projectId } = await params;
  const context = await getDashboardContext();

  if (context.configError) return <ConfigMissing message={context.configError} />;
  if (!context.user || !context.supabase) return <DashboardLogin />;
  if (!context.account || !context.membership) return <AccessPending email={context.user.email} />;

  const [projectResult, recordsResult, membersResult] = await Promise.all([
    context.supabase
      .from("dashboard_project_summary")
      .select("*")
      .eq("account_id", context.account.id)
      .eq("project_id", projectId)
      .maybeSingle(),
    context.supabase
      .from("dashboard_record_index")
      .select("*")
      .eq("account_id", context.account.id)
      .eq("project_id", projectId)
      .order("record_priority", { ascending: true })
      .order("last_activity_at", { ascending: false })
      .limit(200),
    context.supabase
      .from("project_members")
      .select("id, role, trade, report_recipient, users(name, phone_number)")
      .eq("project_id", projectId)
      .order("role", { ascending: true }),
  ]);

  const project = projectResult.data as DashboardProjectSummary | null;
  if (!project) notFound();

  const records = (recordsResult.data ?? []) as DashboardRecord[];
  const members = (membersResult.data ?? []) as ProjectMember[];

  return (
    <DashboardFrame account={context.account} role={context.membership.role}>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-green">
            {project.project_code}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-brand-black">{project.project_name}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {project.location ?? "No location"} · {titleCase(project.project_status)} · Last activity{" "}
            {formatDateTime(project.last_activity_at)}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <ProjectStatusControl projectId={projectId} status={project.project_status} />
          <ExportActions filters={{ projectId }} projectId={projectId} />
        </div>
      </div>

      <div className="mb-8">
        <StatStrip
          stats={[
            { label: "Records", value: project.total_record_count },
            { label: "Open", value: project.active_record_count },
            { label: "Team", value: members.length },
          ]}
        />
      </div>

      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-black">Records</h2>
        </div>
        <RecordsTable records={records} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-brand-black">Team</h2>
        <div className="overflow-x-auto border-y border-gray-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Trade</th>
                <th className="px-4 py-3 font-semibold">Reports</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map((member, index) => {
                const user = Array.isArray(member.users) ? member.users[0] : member.users;
                return (
                  <tr key={`${member.role}-${member.trade ?? "none"}-${user?.phone_number ?? index}`}>
                    <td className="px-4 py-4 font-medium text-brand-black">{user?.name ?? "—"}</td>
                    <td className="px-4 py-4 text-gray-700">{titleCase(member.role)}</td>
                    <td className="px-4 py-4 text-gray-700">{titleCase(member.trade)}</td>
                    <td className="px-4 py-4 text-gray-700">
                      <ReportRecipientToggle
                        projectId={projectId}
                        memberId={member.id}
                        enabled={member.report_recipient}
                      />
                    </td>
                    <td className="px-4 py-4 text-gray-700">{user?.phone_number ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardFrame>
  );
}
