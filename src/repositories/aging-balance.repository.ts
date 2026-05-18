import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

export async function getAgingBalanceInvoices(client: SupabaseClient<Database>, tenantId: string) {
  const { data, error } = await client
    .from("invoices")
    .select("amount_ttc, due_date")
    .eq("tenant_id", tenantId)
    .in("status", ["Nouvelle", "En cours", "Litige"]);

  if (error) throw error;
  return data;
}
