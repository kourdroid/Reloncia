import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download } from "lucide-react";
import { formatDateFr } from "@/src/lib/formatters";

export default function ReportsPage() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rapports & Exports</h2>
          <p className="text-muted-foreground">
            Générez des rapports mensuels pour vos clients ou vos dossiers internes.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nouveau Rapport Mensuel</CardTitle>
          <CardDescription>
            Synthèse de l'état des créances, des relances effectuées et des factures à risque.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium leading-none">Mois</label>
              <Select defaultValue="10">
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le mois" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9">Septembre 2023</SelectItem>
                  <SelectItem value="10">Octobre 2023</SelectItem>
                  <SelectItem value="11">Novembre 2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-1/3">
              <FileText className="mr-2 h-4 w-4" />
              Générer le rapport
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rapports Précédents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Période</TableHead>
                <TableHead>Généré le</TableHead>
                <TableHead>Créé par</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Octobre 2023</TableCell>
                <TableCell>{formatDateFr("2023-11-01T10:00:00Z")}</TableCell>
                <TableCell>Admin Cabinet</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger PDF
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
