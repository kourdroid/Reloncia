import { useQuery } from "@tanstack/react-query";

const fetchCompanyInvoicesAction = async (tenantId: string, companyId: string) => {
  return [];
};

export function useCompanyInvoices(tenantId: string, companyId: string) {
  return useQuery({
    queryKey: ["companyInvoices", tenantId, companyId],
    queryFn: () => fetchCompanyInvoicesAction(tenantId, companyId),
    staleTime: 0,
  });
}
