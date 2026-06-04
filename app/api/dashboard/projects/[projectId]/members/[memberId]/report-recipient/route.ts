import { NextRequest, NextResponse } from "next/server";
import { getDashboardContext } from "@/lib/dashboard/auth";
import { createSupabaseServiceClient } from "@/lib/supabase/service-role";

type RouteProps = {
  params: Promise<{ projectId: string; memberId: string }>;
};

export async function POST(request: NextRequest, { params }: RouteProps) {
  const { projectId, memberId } = await params;
  const context = await getDashboardContext();

  if (context.configError) return NextResponse.json({ error: context.configError }, { status: 500 });
  if (!context.user || !context.supabase || !context.account || !context.membership) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!["owner", "admin"].includes(context.membership.role)) {
    return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as { reportRecipient?: boolean };
  if (typeof body.reportRecipient !== "boolean") {
    return NextResponse.json({ error: "reportRecipient must be boolean." }, { status: 400 });
  }

  const { data: member } = await context.supabase
    .from("project_members")
    .select("id, projects!inner(account_id)")
    .eq("id", memberId)
    .eq("project_id", projectId)
    .maybeSingle();

  const project = Array.isArray(member?.projects) ? member.projects[0] : member?.projects;
  if (!member || project?.account_id !== context.account.id) {
    return NextResponse.json({ error: "Project member not found." }, { status: 404 });
  }

  try {
    const serviceClient = createSupabaseServiceClient();
    const { error } = await serviceClient
      .from("project_members")
      .update({ report_recipient: body.reportRecipient })
      .eq("id", memberId)
      .eq("project_id", projectId);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ reportRecipient: body.reportRecipient });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
