import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMAD } from "@/src/lib/formatters";
import { AlertCircle, Clock, TrendingUp } from "lucide-react";

export default async function CompanyDashboardPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  
  // Dummy Data
  const kpis = {
    totalUnpaid: 215000,
    overdueAmount: 180000,
    legalRiskCount: 5,
    recentReminders: 12
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vue d'ensemble</h2>
          <p className="text-muted-foreground">
            Métriques clés et alertes pour l'entreprise {companyId}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impayé</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMAD(kpis.totalUnpaid)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Montant en Retard</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{formatMAD(kpis.overdueAmount)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Soit {Math.round((kpis.overdueAmount / kpis.totalUnpaid) * 100)}% du total
            </p>
          </CardContent>
        </Card>

        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Risque Loi 69-21</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{kpis.legalRiskCount} factures</div>
            <p className="text-xs text-destructive/80 mt-1">
              Délai de 60 jours dépassé
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Relances (30j)</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.recentReminders}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Balance Âgée</CardTitle>
            <CardDescription>Répartition des créances par âge de retard.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground bg-slate-50/50 rounded-md border border-dashed m-6">
            [Chart Component - Balance Âgée]
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Dernières Activités</CardTitle>
            <CardDescription>Suivi des relances et paiements.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Relance envoyée - Acme Corp</p>
                    <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
