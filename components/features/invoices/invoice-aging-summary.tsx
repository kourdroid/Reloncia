"use client";

import { useTranslations } from "next-intl";

export function InvoiceAgingSummary() {
  const t = useTranslations("Dashboard");

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow mt-6">
      <div className="p-6">
        <h3 className="font-semibold">{t("agingBalance")} Summary</h3>
        {/* Placeholder for buckets */}
      </div>
    </div>
  );
}
