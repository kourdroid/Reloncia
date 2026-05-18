import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

export async function getUserRoleInTenant(client: SupabaseClient<Database>, tenantId: string, profileId: string) {
  const { data, error } = await client
    .from("tenant_members")
    .select("role")
    .eq("tenant_id", tenantId)
    .eq("profile_id", profileId)
    .single();

  if (error) return null;
  return data?.role;
}

export async function getUserRoleInCabinet(client: SupabaseClient<Database>, cabinetId: string, profileId: string) {
  const { data, error } = await client
    .from("cabinet_members")
    .select("role")
    .eq("cabinet_id", cabinetId)
    .eq("profile_id", profileId)
    .single();

  if (error) return null;
  return data?.role;
}
