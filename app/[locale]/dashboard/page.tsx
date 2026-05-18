import { CabinetRiskSummary } from "../../../components/features/dashboard/cabinet-risk-summary";
import { TopLateClientsTable } from "../../../components/features/dashboard/top-late-clients-table";
import { AgingBalanceChart } from "../../../components/features/dashboard/aging-balance-chart";

export default function DashboardPage() {
  // In a real app, we'd fetch tenantId from session or url
  const dummyData = {
    kpis: {
      totalUnpaid: 125000,
      overdue30Count: 8,
      legalRiskCount: 2,
    },
    topClients: [
      { name: "Acme Corp", amount: 45000, dueDate: "2023-11-01" },
      { name: "Global Tech", amount: 30000, dueDate: "2023-11-15" }
    ],
    agingBalance: [
      { name: "Current", amount: 20000 },
      { name: "1-30 Days", amount: 15000 },
      { name: "31-60 Days", amount: 8000 },
      { name: "61-90 Days", amount: 5000 },
      { name: "90+ Days", amount: 2000 },
    ]
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <CabinetRiskSummary {...dummyData.kpis} />
      <AgingBalanceChart data={dummyData.agingBalance} />
      <TopLateClientsTable clients={dummyData.topClients} />
    </div>
  );
}
