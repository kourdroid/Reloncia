import { CabinetRiskSummary } from "../../../components/features/dashboard/cabinet-risk-summary";
import { TopLateClientsTable } from "../../../components/features/dashboard/top-late-clients-table";
import { AgingBalanceChart } from "../../../components/features/dashboard/aging-balance-chart";
import { LegalRiskAlerts } from "../../../components/features/dashboard/legal-risk-alerts";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { cabinetDashboardDemo, formatDateFr, formatMAD } from "../../../src/lib/demo-data";

export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Cabinet</Badge>
            <Badge variant="secondary">18 sociétés suivies</Badge>
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Pilotage des impayés
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              Vue consolidée pour détecter les factures à risque, prioriser les relances et
              préparer les rapports mensuels par société.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">Exporter rapport</Button>
          <Button>Nouvelle relance</Button>
        </div>
      </div>

      <CabinetRiskSummary {...cabinetDashboardDemo.kpis} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <LegalRiskAlerts alerts={cabinetDashboardDemo.legalRiskAlerts} />
          <AgingBalanceChart data={cabinetDashboardDemo.agingBalance} />
          <TopLateClientsTable clients={cabinetDashboardDemo.topLateClients} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sociétés à traiter</CardTitle>
              <CardDescription>Classement par risque de recouvrement.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Société</TableHead>
                    <TableHead className="text-right">Impayé</TableHead>
                    <TableHead className="text-right">69-21</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cabinetDashboardDemo.companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <div className="font-medium">{company.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Dernière relance {formatDateFr(company.lastReminderAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatMAD(company.unpaidMad)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={company.legalRiskInvoices > 0 ? "destructive" : "secondary"}>
                          {company.legalRiskInvoices}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>Dernières actions documentées.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cabinetDashboardDemo.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium">{activity.label}</div>
                    <div className="text-xs text-muted-foreground">{activity.company}</div>
                  </div>
                  <div className="shrink-0 text-right text-xs text-muted-foreground">
                    {activity.timestamp}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
