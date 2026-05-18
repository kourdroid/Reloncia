import { useQuery } from "@tanstack/react-query";

// Mocking the server action import for now.
// In reality, this would call a Next.js Server Action wrapping the `fetchDashboardData` service.
const fetchDashboardSummaryAction = async (tenantId: string) => {
  return {
    kpis: {
      totalUnpaid: 150000,
      overdue30Count: 12,
      legalRiskCount: 3,
    },
    topClients: [
      { name: "Client A", amount: 50000, dueDate: "2023-10-01" },
    ]
  };
};

export function useDashboardSummary(tenantId: string) {
  return useQuery({
    queryKey: ["dashboard", tenantId],
    queryFn: () => fetchDashboardSummaryAction(tenantId),
  });
}
