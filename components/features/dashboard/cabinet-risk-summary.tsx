"use client";

import { AlertTriangle, BellRing, CircleDollarSign, Clock3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMAD } from "@/src/lib/demo-data";

type CabinetRiskSummaryProps = {
  totalUnpaidMad: number;
  overdueInvoices: number;
  legalRiskInvoices: number;
  remindersDueToday: number;
};

const cards = [
  {
    key: "totalUnpaidMad",
    title: "Total impayé",
    caption: "Portefeuille cabinet",
    icon: CircleDollarSign,
    tone: "default",
  },
  {
    key: "overdueInvoices",
    title: "Factures > 30 j",
    caption: "Priorité de relance",
    icon: Clock3,
    tone: "default",
  },
  {
    key: "legalRiskInvoices",
    title: "Risque 69-21",
    caption: "À traiter sous 10 jours",
    icon: AlertTriangle,
    tone: "danger",
  },
  {
    key: "remindersDueToday",
    title: "Relances du jour",
    caption: "Actions planifiées",
    icon: BellRing,
    tone: "default",
  },
] as const;

export function CabinetRiskSummary({
  totalUnpaidMad,
  overdueInvoices,
  legalRiskInvoices,
  remindersDueToday,
}: CabinetRiskSummaryProps) {
  const values = {
    totalUnpaidMad: formatMAD(totalUnpaidMad),
    overdueInvoices,
    legalRiskInvoices,
    remindersDueToday,
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.key}
          className={card.tone === "danger" ? "border-destructive/30 bg-destructive/5" : ""}
        >
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{card.caption}</p>
            </div>
            <card.icon className={card.tone === "danger" ? "text-destructive" : "text-muted-foreground"} />
          </CardHeader>
          <CardContent>
            <div className={card.tone === "danger" ? "text-2xl font-semibold text-destructive" : "text-2xl font-semibold"}>
              {values[card.key]}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
