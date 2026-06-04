import { NextRequest, NextResponse } from "next/server";
import { getDashboardContext } from "@/lib/dashboard/auth";
import { createSupabaseServiceClient } from "@/lib/supabase/service-role";

const VALID_STATUSES = new Set(["active", "completed", "archived"]);

type RouteProps = {
  params: Promise<{ projectId: string }>;
};

export async function POST(request: NextRequest, { params }: RouteProps) {
  const { projectId } = await params;
  const context = await getDashboardContext();

  if (context.configError) return NextResponse.json({ error: context.configError }, { status: 500 });
  if (!context.user || !context.supabase || !context.account || !context.membership) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!["owner", "admin"].includes(context.membership.role)) {
    return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as { status?: string };
  if (!body.status || !VALID_STATUSES.has(body.status)) {
    return NextResponse.json({ error: "Invalid project status." }, { status: 400 });
  }

  const { data: project } = await context.supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("account_id", context.account.id)
    .maybeSingle();

  if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });

  try {
    const serviceClient = createSupabaseServiceClient();
    const { error } = await serviceClient
      .from("projects")
      .update({ status: body.status })
      .eq("id", projectId)
      .eq("account_id", context.account.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ status: body.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
