import { useQuery } from "@tanstack/react-query";

// Mocking server action for now
const fetchAgingBalanceAction = async (tenantId: string) => {
  return [
    { name: "Current", amount: 20000 },
    { name: "1-30 Days", amount: 15000 },
    { name: "31-60 Days", amount: 8000 },
    { name: "61-90 Days", amount: 5000 },
    { name: "90+ Days", amount: 2000 },
  ];
};

export function useAgingBalance(tenantId: string) {
  return useQuery({
    queryKey: ["agingBalance", tenantId],
    queryFn: () => fetchAgingBalanceAction(tenantId),
  });
}
