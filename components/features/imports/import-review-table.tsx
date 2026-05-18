"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMAD } from "@/src/lib/demo-data";

const reviewRows = [
  { invoice: "FAC-2026-1182", client: "Société Horizon", amount: 58_000, status: "Prête" },
  { invoice: "FAC-2026-1183", client: "Retail Pro Casablanca", amount: 21_700, status: "Prête" },
  { invoice: "FAC-2026-1184", client: "Clinique Anfa", amount: 42_800, status: "Doublon" },
];

export function ImportReviewTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Validation avant import</CardTitle>
        <CardDescription>
          Les doublons et erreurs restent bloqués jusqu'à validation manuelle.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Facture</TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviewRows.map((row) => (
              <TableRow key={row.invoice}>
                <TableCell className="font-medium">{row.invoice}</TableCell>
                <TableCell>{row.client}</TableCell>
                <TableCell className="text-right">{formatMAD(row.amount)}</TableCell>
                <TableCell>
                  <Badge variant={row.status === "Prête" ? "secondary" : "destructive"}>
                    {row.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">Annuler</Button>
        <Button>Importer 2 factures</Button>
      </CardFooter>
    </Card>
  );
}
