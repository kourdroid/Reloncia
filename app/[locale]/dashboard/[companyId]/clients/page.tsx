import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMAD } from "@/src/lib/formatters";
import { ClientRiskRow } from "@/src/types/ui";
import { Badge } from "@/components/ui/badge";

const mockClients: ClientRiskRow[] = [
  {
    id: "client-1",
    clientName: "Acme Corp",
    unpaidTotal: 15000,
    averageDelay: 45,
    overdueCount: 2,
    preferredChannel: "email",
    lastReminder: "2023-11-20"
  },
  {
    id: "client-2",
    clientName: "Global Tech",
    unpaidTotal: 45000,
    averageDelay: 62,
    overdueCount: 1,
    preferredChannel: "whatsapp",
    lastReminder: "2023-11-15"
  }
];

export default function ClientsPage() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
          <p className="text-muted-foreground">
            Suivi des clients et de leur comportement de paiement.
          </p>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Total Impayé</TableHead>
              <TableHead>Délai Moyen</TableHead>
              <TableHead>Factures en Retard</TableHead>
              <TableHead>Canal Préféré</TableHead>
              <TableHead>Dernière Relance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockClients.map((client) => (
              <TableRow key={client.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">{client.clientName}</TableCell>
                <TableCell className="font-bold">{formatMAD(client.unpaidTotal)}</TableCell>
                <TableCell>
                  <span className={client.averageDelay > 60 ? "text-destructive font-bold" : client.averageDelay > 30 ? "text-amber-600" : ""}>
                    {client.averageDelay} jours
                  </span>
                </TableCell>
                <TableCell>{client.overdueCount}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {client.preferredChannel}
                  </Badge>
                </TableCell>
                <TableCell>{client.lastReminder || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
