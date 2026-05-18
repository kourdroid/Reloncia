"use client";

import { useTranslations } from "next-intl";

type InvoiceTableProps = {
  invoices: any[];
};

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  const t = useTranslations("Dashboard");

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow mt-6">
      <div className="p-6">
        <h3 className="font-semibold">Invoices</h3>
        {/* Placeholder for shadcn table */}
      </div>
    </div>
  );
}
