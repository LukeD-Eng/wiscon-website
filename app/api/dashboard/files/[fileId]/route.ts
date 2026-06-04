import { NextRequest, NextResponse } from "next/server";
import { getDashboardContext } from "@/lib/dashboard/auth";
import { parseDashboardFileId, parseStoragePublicUrl } from "@/lib/dashboard/files";
import { createSupabaseServiceClient } from "@/lib/supabase/service-role";

type RouteProps = {
  params: Promise<{ fileId: string }>;
};

type FileRecord = Record<string, string | null>;

export async function GET(_request: NextRequest, { params }: RouteProps) {
  const { fileId } = await params;
  const fileRef = parseDashboardFileId(fileId);

  if (!fileRef) {
    return NextResponse.json({ error: "Invalid file reference." }, { status: 400 });
  }

  const context = await getDashboardContext();

  if (context.configError) {
    return NextResponse.json({ error: context.configError }, { status: 500 });
  }
  if (!context.user || !context.supabase || !context.account || !context.membership) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data, error } = await context.supabase
    .from(fileRef.table)
    .select(fileRef.field)
    .eq("id", fileRef.recordId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!data) return NextResponse.json({ error: "File not found." }, { status: 404 });

  const rawUrl = (data as unknown as FileRecord)[fileRef.field];
  if (!rawUrl) return NextResponse.json({ error: "File not found." }, { status: 404 });

  const storagePath = parseStoragePublicUrl(rawUrl);
  if (!storagePath) return NextResponse.json({ error: "File path could not be resolved." }, { status: 400 });

  try {
    const serviceClient = createSupabaseServiceClient();
    const { data: signed, error: signError } = await serviceClient.storage
      .from(storagePath.bucket)
      .createSignedUrl(storagePath.path, 120);

    if (signError || !signed?.signedUrl) {
      return NextResponse.json({ error: signError?.message ?? "Could not sign file URL." }, { status: 500 });
    }

    return NextResponse.redirect(signed.signedUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
