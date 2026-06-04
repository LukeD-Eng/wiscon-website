import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      email?: string;
      password?: string;
      method?: "password" | "magic_link";
    };
    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? "";
    const method = body.method ?? "password";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    if (method === "password") {
      if (!password) {
        return NextResponse.json({ error: "Password is required." }, { status: 400 });
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ message: "Signed in.", redirectTo: "/dashboard" });
    }

    const origin = request.nextUrl.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Login link sent. Check your inbox." });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
