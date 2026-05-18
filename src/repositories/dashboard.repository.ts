import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

export async function getDashboardSummary(client: SupabaseClient<Database>, tenantId: string) {
  // In a real app, this would use a complex query or RPC to compute the exact KPIs
  // For Phase 1, we simulate the query structure.
  
  const { data, error } = await client
    .from("invoices")
    .select("amount_ttc, status, law_69_21_flag, due_date")
    .eq("tenant_id", tenantId);

  if (error) throw error;
  return data;
}

export async function getTopLateClients(client: SupabaseClient<Database>, tenantId: string) {
  const { data, error } = await client
    .from("invoices")
    .select("client_id, amount_ttc, due_date, clients(name)")
    .eq("tenant_id", tenantId)
    .in("status", ["Nouvelle", "En cours"])
    .order("amount_ttc", { ascending: false })
    .limit(5);

  if (error) throw error;
  return data;
}
