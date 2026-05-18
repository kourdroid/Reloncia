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

const mappedColumns = [
  { source: "N Facture", target: "Numéro facture", confidence: "Validé" },
  { source: "Client", target: "Nom client", confidence: "Validé" },
  { source: "Montant TTC", target: "Montant", confidence: "À confirmer" },
  { source: "Date échéance", target: "Date d'échéance", confidence: "Validé" },
];

export function ColumnMappingTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mapping des colonnes</CardTitle>
        <CardDescription>
          Vérifiez comment les colonnes du fichier seront reliées au modèle eFacturation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Colonne fichier</TableHead>
              <TableHead>Champ système</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mappedColumns.map((column) => (
              <TableRow key={column.source}>
                <TableCell className="font-medium">{column.source}</TableCell>
                <TableCell>{column.target}</TableCell>
                <TableCell>
                  <Badge variant={column.confidence === "Validé" ? "secondary" : "outline"}>
                    {column.confidence}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
