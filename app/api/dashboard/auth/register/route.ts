import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service-role";

type RegisterBody = {
  ownerName?: string;
  companyName?: string;
  ownerPhone?: string;
  email?: string;
  password?: string;
};

function clean(value: string | undefined) {
  const next = value?.trim();
  return next ? next : "";
}

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "");
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function findExistingAccount(
  serviceClient: ReturnType<typeof createSupabaseServiceClient>,
  ownerPhone: string,
  email: string
) {
  const { data: phoneAccount, error: phoneError } = await serviceClient
    .from("accounts")
    .select("id, name")
    .eq("owner_phone", ownerPhone)
    .maybeSingle();

  if (phoneError) throw new Error(phoneError.message);
  if (phoneAccount) return phoneAccount;

  const { data: emailAccount, error: emailError } = await serviceClient
    .from("accounts")
    .select("id, name")
    .eq("email", email)
    .maybeSingle();

  if (emailError) throw new Error(emailError.message);
  return emailAccount;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as RegisterBody;
    const ownerName = clean(body.ownerName);
    const companyName = clean(body.companyName);
    const ownerPhone = normalizePhone(clean(body.ownerPhone));
    const email = clean(body.email).toLowerCase();
    const password = body.password ?? "";

    if (!ownerName) return NextResponse.json({ error: "Owner name is required." }, { status: 400 });
    if (!companyName) return NextResponse.json({ error: "Company name is required." }, { status: 400 });
    if (!ownerPhone || ownerPhone.length < 8) {
      return NextResponse.json({ error: "A valid owner phone number is required." }, { status: 400 });
    }
    if (!email || !validEmail(email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const serviceClient = createSupabaseServiceClient();
    const origin = request.nextUrl.origin;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
        data: {
          full_name: ownerName,
          company_name: companyName,
          owner_phone: ownerPhone,
        },
      },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }
    if (!authData.user) {
      return NextResponse.json({ error: "Could not create dashboard user." }, { status: 400 });
    }

    let account = await findExistingAccount(serviceClient, ownerPhone, email);

    if (!account) {
      const { data: createdAccount, error: accountError } = await serviceClient
        .from("accounts")
        .insert({
          name: companyName,
          owner_phone: ownerPhone,
          email,
          subscription_tier: "starter",
          subscription_status: "trial",
        })
        .select("id, name")
        .single();

      if (accountError) throw new Error(accountError.message);
      account = createdAccount;
    }

    const { error: memberError } = await serviceClient
      .from("account_members")
      .upsert(
        {
          account_id: account.id,
          auth_user_id: authData.user.id,
          role: "owner",
        },
        { onConflict: "account_id,auth_user_id" }
      );

    if (memberError) throw new Error(memberError.message);

    const { error: userError } = await serviceClient
      .from("users")
      .upsert(
        {
          phone_number: ownerPhone,
          name: ownerName,
          account_id: account.id,
        },
        { onConflict: "phone_number" }
      );

    if (userError) throw new Error(userError.message);

    return NextResponse.json({
      message: authData.session
        ? "Registration complete."
        : "Registration created. Check your email to confirm the account, then sign in.",
      redirectTo: authData.session ? "/dashboard" : null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
