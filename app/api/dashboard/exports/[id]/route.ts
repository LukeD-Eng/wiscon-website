import { NextRequest, NextResponse } from "next/server";
import { getDashboardContext } from "@/lib/dashboard/auth";
import { EXPORT_PACK_BUCKET } from "@/lib/dashboard/export-pack";
import { createSupabaseServiceClient } from "@/lib/supabase/service-role";

type RouteProps = {
  params: Promise<{ id: string }>;
};

function parseStoredPack(resultUrl: string | null) {
  if (!resultUrl) return null;

  const [bucket, ...pathParts] = resultUrl.split("/");
  const path = pathParts.join("/");

  if (bucket !== EXPORT_PACK_BUCKET || !path) return null;
  return { bucket, path };
}

export async function GET(request: NextRequest, { params }: RouteProps) {
  const { id } = await params;
  const context = await getDashboardContext();

  if (context.configError) {
    return NextResponse.json({ error: context.configError }, { status: 500 });
  }
  if (!context.user || !context.supabase || !context.account || !context.membership) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data, error } = await context.supabase
    .from("export_jobs")
    .select("*")
    .eq("account_id", context.account.id)
    .eq("id", id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!data) return NextResponse.json({ error: "Export job not found." }, { status: 404 });

  if (request.nextUrl.searchParams.get("download") === "1") {
    const storagePath = parseStoredPack(data.result_url);

    if (data.status !== "completed" || !storagePath) {
      return NextResponse.json({ error: "Export pack is not ready for download." }, { status: 409 });
    }

    try {
      const serviceClient = createSupabaseServiceClient();
      const { data: signed, error: signError } = await serviceClient.storage
        .from(storagePath.bucket)
        .createSignedUrl(storagePath.path, 120, {
          download: `wiscon-project-export-${id}.zip`,
        });

      if (signError || !signed?.signedUrl) {
        return NextResponse.json({ error: signError?.message ?? "Could not sign export pack." }, { status: 500 });
      }

      return NextResponse.redirect(signed.signedUrl);
    } catch (downloadError) {
      const message = downloadError instanceof Error ? downloadError.message : String(downloadError);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  return NextResponse.json({ job: data });
}
