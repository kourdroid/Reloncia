import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";
import { getAgingBalanceInvoices } from "../repositories/aging-balance.repository";
import { requireTenantAccess } from "./access.service";

export async function getAgingBalance(client: SupabaseClient<Database>, tenantId: string, profileId: string) {
  await requireTenantAccess(client, tenantId, profileId);

  const invoices = await getAgingBalanceInvoices(client, tenantId);

  let current = 0;
  let overdue30 = 0;
  let overdue60 = 0;
  let overdue90 = 0;
  let overdue90Plus = 0;

  const now = new Date();

  invoices.forEach((inv) => {
    const dueDate = new Date(inv.due_date);
    const amount = Number(inv.amount_ttc);
    
    if (dueDate >= now) {
      current += amount;
    } else {
      const diffDays = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays <= 30) {
        overdue30 += amount;
      } else if (diffDays <= 60) {
        overdue60 += amount;
      } else if (diffDays <= 90) {
        overdue90 += amount;
      } else {
        overdue90Plus += amount;
      }
    }
  });

  return [
    { name: "Current", amount: current },
    { name: "1-30 Days", amount: overdue30 },
    { name: "31-60 Days", amount: overdue60 },
    { name: "61-90 Days", amount: overdue90 },
    { name: "90+ Days", amount: overdue90Plus },
  ];
}
