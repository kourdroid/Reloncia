import { InvoiceAgingSummary } from "../../../../components/features/invoices/invoice-aging-summary";
import { InvoiceTable } from "../../../../components/features/invoices/invoice-table";

export default function CompanyDashboardPage({ params }: { params: { companyId: string } }) {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Company {params.companyId}</h2>
      </div>
      <InvoiceAgingSummary />
      <InvoiceTable invoices={[]} />
    </div>
  );
}
