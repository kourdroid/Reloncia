import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

export type LegalRiskInvoice = {
  id: string;
  tenant_id: string;
  invoice_number: string;
  amount_ttc: number;
  legal_threshold_date: string;
  days_remaining: number;
  status: string;
};

export type ResponsibleUser = {
  profile_id: string;
  email: string;
  role: string;
  source: "tenant" | "cabinet";
};

/**
 * Fetches all invoices approaching the Law 69-21 legal threshold (≤ 10 days).
 * Calls the `get_law_69_21_risk_invoices` DB function — no direct table queries.
 */
export async function getLegalRiskInvoices(
  client: SupabaseClient<Database>
): Promise<LegalRiskInvoice[]> {
  const { data, error } = await client.rpc("get_law_69_21_risk_invoices");
  if (error) throw new Error(`Failed to fetch legal-risk invoices: ${error.message}`);
  return (data as LegalRiskInvoice[]) ?? [];
}

/**
 * Fetches all responsible users (TenantAdmin + delegated cabinet members)
 * for a given tenant. Used to build alert recipient lists.
 */
export async function getResponsibleUsersForTenant(
  client: SupabaseClient<Database>,
  tenantId: string
): Promise<ResponsibleUser[]> {
  const { data, error } = await client.rpc("get_responsible_users_for_tenant", {
    p_tenant_id: tenantId,
  });
  if (error) throw new Error(`Failed to fetch responsible users: ${error.message}`);
  return (data as ResponsibleUser[]) ?? [];
}
