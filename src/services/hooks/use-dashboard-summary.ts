import { useQuery } from "@tanstack/react-query";

export type LegalRiskAlertItem = {
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  daysRemaining: number;
  legalThresholdDate: string;
};

export type DashboardSummary = {
  kpis: {
    totalUnpaid: number;
    overdue30Count: number;
    legalRiskCount: number;
  };
  topClients: {
    name: string;
    amount: number;
    dueDate: string;
  }[];
  legalRiskAlerts: LegalRiskAlertItem[];
};

/**
 * Fetches the full dashboard summary for a tenant including:
 * - KPI cards (totalUnpaid, overdue30Count, legalRiskCount)
 * - Top 5 late-paying clients
 * - Legal-risk invoice alerts (US5 integration)
 *
 * In production this calls a Server Action that uses `fetchDashboardData`
 * and `getLegalRiskSummaryForTenant` services. The mock below represents
 * the expected contract shape.
 */
async function fetchDashboardSummaryAction(tenantId: string): Promise<DashboardSummary> {
  // TODO: replace with actual Server Action call
  // return fetchDashboardSummaryServerAction(tenantId);
  return {
    kpis: {
      totalUnpaid: 150_000,
      overdue30Count: 12,
      legalRiskCount: 3,
    },
    topClients: [{ name: "Client A", amount: 50_000, dueDate: "2023-10-01" }],
    legalRiskAlerts: [
      {
        invoiceId: "inv-mock-1",
        invoiceNumber: "FA-2026-001",
        amount: 45_000,
        daysRemaining: 7,
        legalThresholdDate: "2026-05-25",
      },
      {
        invoiceId: "inv-mock-2",
        invoiceNumber: "FA-2026-002",
        amount: 30_000,
        daysRemaining: -3,
        legalThresholdDate: "2026-05-15",
      },
    ],
  };
}

export function useDashboardSummary(tenantId: string) {
  return useQuery<DashboardSummary>({
    queryKey: ["dashboard", tenantId],
    queryFn: () => fetchDashboardSummaryAction(tenantId),
    staleTime: 60_000, // 1 minute — risk data should be relatively fresh
  });
}
