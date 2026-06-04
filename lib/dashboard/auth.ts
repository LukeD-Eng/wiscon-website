import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AccountMemberRow, AccountRow } from "@/lib/dashboard/types";

type DashboardContext =
  | {
      supabase: SupabaseClient;
      user: User | null;
      membership: AccountMemberRow | null;
      account: AccountRow | null;
      configError: null;
    }
  | {
      supabase: null;
      user: null;
      membership: null;
      account: null;
      configError: string;
    };

export async function getDashboardContext(): Promise<DashboardContext> {
  let supabase: SupabaseClient;

  try {
    supabase = await createSupabaseServerClient();
  } catch (error) {
    return {
      supabase: null,
      user: null,
      membership: null,
      account: null,
      configError: error instanceof Error ? error.message : String(error),
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, membership: null, account: null, configError: null };
  }

  const { data } = await supabase
    .from("account_members")
    .select("id, account_id, role, accounts!inner(id, name, subscription_tier, subscription_status)")
    .eq("auth_user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const membership = (data ?? null) as AccountMemberRow | null;
  const account = Array.isArray(membership?.accounts)
    ? membership.accounts[0] ?? null
    : membership?.accounts ?? null;

  return { supabase, user, membership, account, configError: null };
}
