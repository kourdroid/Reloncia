"use client";

import { InvoicesTable } from "@/components/features/invoices/invoices-table";
import { InvoiceDetailSheet } from "@/components/features/invoices/invoice-detail";
import { InvoiceTableRow } from "@/src/types/ui";
import { useState } from "react";

// Mock data to test the UI. Later replaced by Supabase fetching logic mapped to InvoiceTableRow
const mockInvoices: InvoiceTableRow[] = [
  {
    id: "1",
    invoiceNumber: "FAC-2023-001",
    clientName: "Acme Corp",
    amountMAD: 15000.0,
    issueDate: "2023-09-01",
    dueDate: "2023-10-01",
    age: 45,
    status: "En cours",
    reminderCount: 1,
    legalRisk: false,
  },
  {
    id: "2",
    invoiceNumber: "FAC-2023-002",
    clientName: "Global Tech",
    amountMAD: 45000.0,
    issueDate: "2023-08-15",
    dueDate: "2023-09-15",
    age: 62,
    status: "Nouvelle",
    reminderCount: 0,
    legalRisk: true,
  },
  {
    id: "3",
    invoiceNumber: "FAC-2023-003",
    clientName: "Consulting SA",
    amountMAD: 8500.0,
    issueDate: "2023-10-10",
    dueDate: "2023-11-10",
    age: 5,
    status: "Litige",
    reminderCount: 2,
    legalRisk: false,
  },
];

export default function InvoicesPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceTableRow | null>(null);

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Factures</h2>
          <p className="text-muted-foreground">
            Gérez et suivez le statut de toutes vos factures.
          </p>
        </div>
      </div>

      <InvoicesTable 
        data={mockInvoices} 
        onRowClick={(invoice) => setSelectedInvoice(invoice)} 
      />

      <InvoiceDetailSheet 
        invoice={selectedInvoice} 
        isOpen={!!selectedInvoice} 
        onOpenChange={(open) => !open && setSelectedInvoice(null)} 
      />
    </div>
  );
}
