"use client";

import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateFr, formatMAD, LegalRiskInvoice } from "@/src/lib/demo-data";

type LegalRiskAlertsProps = {
  alerts: LegalRiskInvoice[];
};

export function LegalRiskAlerts({ alerts }: LegalRiskAlertsProps) {
  if (alerts.length === 0) return null;

  return (
    <Card data-testid="legal-risk-alerts" className="border-destructive/30 bg-destructive/5">
      <CardHeader className="flex flex-row items-start gap-3 space-y-0">
        <div className="mt-0.5 rounded-md bg-destructive/10 p-2 text-destructive">
          <AlertTriangle />
        </div>
        <div>
          <CardTitle className="text-destructive">Seuil Law 69-21 à surveiller</CardTitle>
          <CardDescription>
            {alerts.length} factures impayées approchent la zone de risque légal.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={`${alert.company}-${alert.invoiceNumber}`}
            className="flex flex-col gap-3 rounded-md border bg-background p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{alert.invoiceNumber}</span>
                <Badge variant="outline">{alert.company}</Badge>
              </div>
              <div className="mt-1 text-muted-foreground">
                {alert.client} · {formatMAD(alert.amount)}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Badge variant="destructive">J-{alert.daysLeft}</Badge>
              <span className="text-xs text-muted-foreground">
                {formatDateFr(alert.thresholdDate)}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
