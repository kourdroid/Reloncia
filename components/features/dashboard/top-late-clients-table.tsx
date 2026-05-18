"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMAD, LateClient } from "@/src/lib/demo-data";

type TopLateClientsTableProps = {
  clients: LateClient[];
};

export function TopLateClientsTable({ clients }: TopLateClientsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top clients en retard</CardTitle>
        <CardDescription>Clients qui concentrent le plus de risque de paiement.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Société</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead className="text-right">Retard moyen</TableHead>
              <TableHead>Risque</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={`${client.company}-${client.name}`}>
                <TableCell>
                  <div className="font-medium">{client.name}</div>
                  <div className="text-xs text-muted-foreground">{client.invoices} factures</div>
                </TableCell>
                <TableCell className="text-muted-foreground">{client.company}</TableCell>
                <TableCell className="text-right font-medium">{formatMAD(client.amount)}</TableCell>
                <TableCell className="text-right">{client.averageDelayDays} j</TableCell>
                <TableCell>
                  <Badge variant={client.riskLevel === "critical" ? "destructive" : "secondary"}>
                    {client.riskLevel === "critical" ? "Critique" : client.riskLevel === "warning" ? "À suivre" : "Stable"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {clients.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Aucun client en retard.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
