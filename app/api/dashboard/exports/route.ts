import { NextRequest, NextResponse } from "next/server";
import { getDashboardContext } from "@/lib/dashboard/auth";
import { buildProjectExportPack } from "@/lib/dashboard/export-pack";
import { applyRecordFilters, parseRecordFilters, parseRecordFiltersFromForm } from "@/lib/dashboard/filters";
import { recordsToCsv } from "@/lib/dashboard/csv";
import { createSupabaseServiceClient } from "@/lib/supabase/service-role";
import type { DashboardRecord, RecordFilters } from "@/lib/dashboard/types";

async function parseBody(request: NextRequest): Promise<{ type: string; filters: RecordFilters }> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await request.json().catch(() => ({}))) as {
      type?: string;
      filters?: Record<string, string | string[] | undefined>;
    };
    return { type: body.type ?? "csv", filters: parseRecordFilters(body.filters ?? {}) };
  }

  const formData = await request.formData();
  return {
    type: String(formData.get("type") ?? "csv"),
    filters: parseRecordFiltersFromForm(formData),
  };
}

export async function POST(request: NextRequest) {
  const context = await getDashboardContext();

  if (context.configError) {
    return NextResponse.json({ error: context.configError }, { status: 500 });
  }
  if (!context.user || !context.supabase || !context.account || !context.membership) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { type, filters } = await parseBody(request);

  if (type === "csv") {
    let query = context.supabase
      .from("dashboard_record_index")
      .select("*")
      .eq("account_id", context.account.id);

    query = applyRecordFilters(query, filters)
      .order("record_priority", { ascending: true })
      .order("last_activity_at", { ascending: false })
      .limit(5000);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const csv = recordsToCsv((data ?? []) as DashboardRecord[]);
    const date = new Date().toISOString().slice(0, 10);

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="wiscon-records-${date}.csv"`,
      },
    });
  }

  if (type === "project_pack") {
    if (!filters.projectId) {
      return NextResponse.json({ error: "Project export packs require a project." }, { status: 400 });
    }

    const { data: project, error: projectError } = await context.supabase
      .from("projects")
      .select("id, name")
      .eq("id", filters.projectId)
      .maybeSingle();

    if (projectError) return NextResponse.json({ error: projectError.message }, { status: 400 });
    if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });

    const { data: job, error } = await context.supabase
      .from("export_jobs")
      .insert({
        account_id: context.account.id,
        requested_by_auth_user_id: context.user.id,
        job_type: "project_pack",
        status: "processing",
        filters,
        result: {
          project_id: filters.projectId,
          project_name: project.name,
          delivery: "Generating private export pack",
        },
      })
      .select("*")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    try {
      const serviceClient = createSupabaseServiceClient();
      const result = await buildProjectExportPack({
        supabase: context.supabase,
        serviceClient,
        account: context.account,
        project,
        filters,
        jobId: job.id,
      });

      const { data: completedJob, error: updateError } = await serviceClient
        .from("export_jobs")
        .update({
          status: "completed",
          result_url: `${result.bucket}/${result.path}`,
          result,
          completed_at: new Date().toISOString(),
        })
        .eq("id", job.id)
        .eq("account_id", context.account.id)
        .select("*")
        .single();

      if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
      return NextResponse.json({ job: completedJob }, { status: 201 });
    } catch (packError) {
      const message = packError instanceof Error ? packError.message : String(packError);
      const serviceClient = createSupabaseServiceClient();
      await serviceClient
        .from("export_jobs")
        .update({
          status: "failed",
          error_message: message,
          completed_at: new Date().toISOString(),
        })
        .eq("id", job.id)
        .eq("account_id", context.account.id);

      return NextResponse.json({ error: message, job }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Unsupported export type." }, { status: 400 });
}
