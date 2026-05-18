"use client";

import { useTranslations } from "next-intl";

type TopClient = {
  name: string;
  amount: number;
  dueDate: string;
};

type TopLateClientsTableProps = {
  clients: TopClient[];
};

export function TopLateClientsTable({ clients }: TopLateClientsTableProps) {
  const t = useTranslations("Dashboard");

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow mt-6">
      <div className="p-6 flex flex-col space-y-1.5">
        <h3 className="font-semibold leading-none tracking-tight">{t("topLateClients")}</h3>
      </div>
      <div className="p-6 pt-0">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t("clientName")}</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t("amount")}</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{t("dueDate")}</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {clients.map((c, i) => (
                <tr key={i} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle">{c.name}</td>
                  <td className="p-4 align-middle">{c.amount.toLocaleString()} MAD</td>
                  <td className="p-4 align-middle">{c.dueDate}</td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-4 align-middle text-center text-muted-foreground">
                    {t("noLateClients")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
