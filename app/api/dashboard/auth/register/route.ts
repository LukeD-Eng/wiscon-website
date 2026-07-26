import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service-role";

type RegisterBody = {
  inviteCode?: string;
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

function validInviteCode(value: string) {
  const configuredCode = process.env.PILOT_REGISTRATION_INVITE_CODE?.trim();
  const providedCode = value.trim();

  if (!configuredCode) return null;

  const configured = Buffer.from(configuredCode);
  const provided = Buffer.from(providedCode);

  return configured.length === provided.length && timingSafeEqual(configured, provided);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function existingEmailMessage() {
  return "That email is already registered. Sign in instead, or use Email link if you do not remember the password.";
}

function isAuthUserForeignKeyError(error: { code?: string; message?: string }) {
  return (
    error.code === "23503" &&
    (error.message?.includes("account_members_auth_user_id_fkey") ?? false)
  );
}

async function authUserExists(
  serviceClient: ReturnType<typeof createSupabaseServiceClient>,
  authUserId: string
) {
  for (const delay of [0, 150, 400]) {
    if (delay) await sleep(delay);

    const {
      data: { user },
      error,
    } = await serviceClient.auth.admin.getUserById(authUserId);

    if (user?.id === authUserId) return true;
    if (!error) continue;

    const status = "status" in error ? error.status : undefined;
    if (status !== 404 && !error.message.toLowerCase().includes("not found")) {
      throw new Error(error.message);
    }
  }

  return false;
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
    const inviteCodeAccepted = validInviteCode(body.inviteCode ?? "");

    if (inviteCodeAccepted === null) {
      return NextResponse.json(
        { error: "Pilot registration is temporarily unavailable." },
        { status: 503 }
      );
    }
    if (!inviteCodeAccepted) {
      return NextResponse.json(
        { error: "A valid pilot invitation code is required." },
        { status: 403 }
      );
    }

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

    const verifiedAuthUser = await authUserExists(serviceClient, authData.user.id);
    if (!verifiedAuthUser) {
      return NextResponse.json({ error: existingEmailMessage() }, { status: 409 });
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

    if (memberError) {
      if (isAuthUserForeignKeyError(memberError)) {
        return NextResponse.json({ error: existingEmailMessage() }, { status: 409 });
      }

      throw new Error(memberError.message);
    }

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
