import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";
import { getDashboardSummary, getTopLateClients } from "../repositories/dashboard.repository";
import { requireTenantAccess } from "./access.service";

export async function fetchDashboardData(client: SupabaseClient<Database>, tenantId: string, profileId: string) {
  await requireTenantAccess(client, tenantId, profileId);

  const [invoices, topClients] = await Promise.all([
    getDashboardSummary(client, tenantId),
    getTopLateClients(client, tenantId),
  ]);

  // Aggregate logic
  let totalUnpaid = 0;
  let overdue30Count = 0;
  let legalRiskCount = 0;

  const now = new Date();

  invoices.forEach((inv) => {
    if (inv.status === "Nouvelle" || inv.status === "En cours") {
      totalUnpaid += Number(inv.amount_ttc);
      
      const dueDate = new Date(inv.due_date);
      const diffDays = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays > 30) {
        overdue30Count++;
      }
      if (inv.law_69_21_flag) {
        legalRiskCount++;
      }
    }
  });

  return {
    kpis: {
      totalUnpaid,
      overdue30Count,
      legalRiskCount,
    },
    topClients: topClients.map(c => ({
      name: (c.clients as any)?.name || "Unknown",
      amount: c.amount_ttc,
      dueDate: c.due_date,
    }))
  };
}
