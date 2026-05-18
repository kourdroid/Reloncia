import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";
import { getCompanyInvoices } from "../repositories/invoice.repository";
import { requireTenantAccess } from "./access.service";

export async function getCompanyInvoiceAging(client: SupabaseClient<Database>, tenantId: string, companyId: string, profileId: string) {
  await requireTenantAccess(client, tenantId, profileId);

  const invoices = await getCompanyInvoices(client, tenantId, companyId);
  return invoices;
}
