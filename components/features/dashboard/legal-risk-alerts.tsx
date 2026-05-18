"use client";

import { useTranslations } from "next-intl";

type LegalRiskAlert = {
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  daysRemaining: number;
  legalThresholdDate: string;
};

type LegalRiskAlertsProps = {
  alerts: LegalRiskAlert[];
};

export function LegalRiskAlerts({ alerts }: LegalRiskAlertsProps) {
  const t = useTranslations("Dashboard");

  if (alerts.length === 0) return null;

  return (
    <div
      data-testid="legal-risk-alerts"
      className="rounded-xl border border-destructive/30 bg-destructive/5 text-card-foreground shadow mt-6"
    >
      <div className="p-6 flex flex-row items-start gap-3">
        {/* Warning icon */}
        <div className="mt-0.5 text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-destructive">
            {t("legalRiskAlertTitle")} — {alerts.length}{" "}
            {alerts.length === 1 ? t("invoice") : t("invoices")}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{t("legalRiskAlertSubtitle")}</p>

          <div className="mt-4 space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.invoiceId}
                className="flex items-center justify-between rounded-lg bg-destructive/10 px-4 py-2 text-sm"
              >
                <div>
                  <span className="font-medium">{alert.invoiceNumber}</span>
                  <span className="text-muted-foreground ml-2">
                    — {alert.amount.toLocaleString("fr-MA")} MAD
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    data-testid="legal-risk-count"
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      alert.daysRemaining <= 0
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {alert.daysRemaining <= 0
                      ? t("thresholdExceeded")
                      : `J-${alert.daysRemaining}`}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {alert.legalThresholdDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
