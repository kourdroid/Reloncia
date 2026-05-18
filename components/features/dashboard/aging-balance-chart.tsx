"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AgingBucket, formatMAD } from "@/src/lib/demo-data";

type AgingBalanceChartProps = {
  data: AgingBucket[];
};

export function AgingBalanceChart({ data }: AgingBalanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance âgée</CardTitle>
        <CardDescription>Montants impayés regroupés par ancienneté.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: 8, right: 8, top: 8 }}>
              <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                width={84}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))" }}
                formatter={(value) => [formatMAD(Number(value)), "Montant"]}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
