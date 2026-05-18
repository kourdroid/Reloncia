import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

export async function getCompanyInvoices(client: SupabaseClient<Database>, tenantId: string, companyId: string) {
  const { data, error } = await client
    .from("invoices")
    .select("id, invoice_number, amount_ttc, due_date, status, law_69_21_flag")
    .eq("tenant_id", tenantId)
    .eq("client_id", companyId);

  if (error) throw error;
  return data;
}
