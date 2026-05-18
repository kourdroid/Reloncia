"use client";

import { useTranslations } from "next-intl";

type CabinetRiskSummaryProps = {
  totalUnpaid: number;
  overdue30Count: number;
  legalRiskCount: number;
};

export function CabinetRiskSummary({ totalUnpaid, overdue30Count, legalRiskCount }: CabinetRiskSummaryProps) {
  const t = useTranslations("Dashboard");

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">{t("totalUnpaid")}</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">{totalUnpaid.toLocaleString()} MAD</div>
        </div>
      </div>
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">{t("overdue30Count")}</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">{overdue30Count}</div>
        </div>
      </div>
      <div className="rounded-xl border bg-destructive text-destructive-foreground shadow">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">{t("legalRiskCount")}</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">{legalRiskCount}</div>
        </div>
      </div>
    </div>
  );
}
