import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatMAD } from "@/src/lib/formatters";
import { CompanyRiskRow } from "@/src/types/ui";
import { Link } from "@/src/i18n/routing";
import { ArrowRight, AlertCircle, Building2 } from "lucide-react";

// Mock data
const mockCompanies: CompanyRiskRow[] = [
  {
    id: "comp-123",
    name: "Tech Solutions SARL",
    unpaidTotal: 150000,
    overdueCount: 12,
    legalRiskCount: 3,
    lastReminder: "2023-11-20",
    status: "active",
  },
  {
    id: "comp-456",
    name: "Logistics Pro",
    unpaidTotal: 45000,
    overdueCount: 2,
    legalRiskCount: 0,
    lastReminder: "2023-10-15",
    status: "active",
  },
];

export default function CompaniesPage() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Entreprises Gérées</h2>
          <p className="text-muted-foreground">
            Vue d'ensemble de l'exposition au risque client par entreprise.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portefeuille</CardTitle>
          <CardDescription>
            Toutes les entreprises sous gestion pour le recouvrement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entreprise</TableHead>
                <TableHead>Total Impayé</TableHead>
                <TableHead>Factures en Retard</TableHead>
                <TableHead>Risque 69-21</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    {company.name}
                  </TableCell>
                  <TableCell className="font-bold">{formatMAD(company.unpaidTotal)}</TableCell>
                  <TableCell>
                    {company.overdueCount > 0 ? (
                      <span className="text-amber-600 font-medium">{company.overdueCount} factures</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {company.legalRiskCount > 0 ? (
                      <Badge variant="destructive" className="flex w-fit items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {company.legalRiskCount}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                      {company.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/${company.id}`}>
                        Ouvrir <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
