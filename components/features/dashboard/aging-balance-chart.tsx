"use client";

import { useTranslations } from "next-intl";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type AgingData = {
  name: string;
  amount: number;
};

type AgingBalanceChartProps = {
  data: AgingData[];
};

export function AgingBalanceChart({ data }: AgingBalanceChartProps) {
  const t = useTranslations("Dashboard");

  // In a real app, map the 'name' labels to translations
  // Since we use mock labels from backend, we just display them for now

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow mt-6">
      <div className="p-6 flex flex-col space-y-1.5">
        <h3 className="font-semibold leading-none tracking-tight">{t("agingBalance")}</h3>
      </div>
      <div className="p-6 pt-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value} MAD`} />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
