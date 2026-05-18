import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReminderHistoryRow } from "@/src/types/ui";
import { Badge } from "@/components/ui/badge";
import { formatDateFr } from "@/src/lib/formatters";
import { Mail, MessageCircle } from "lucide-react";

const mockReminders: ReminderHistoryRow[] = [
  {
    id: "rem-1",
    invoiceId: "1",
    invoiceNumber: "FAC-2023-001",
    clientId: "client-1",
    clientName: "Acme Corp",
    channel: "email",
    outcome: "delivered",
    sentAt: "2023-11-20T10:30:00Z"
  },
  {
    id: "rem-2",
    invoiceId: "2",
    invoiceNumber: "FAC-2023-002",
    clientId: "client-2",
    clientName: "Global Tech",
    channel: "whatsapp",
    outcome: "failed",
    sentAt: "2023-11-15T14:45:00Z"
  }
];

export default function RemindersPage() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Historique des Relances</h2>
          <p className="text-muted-foreground">
            Journal complet des actions de recouvrement effectuées.
          </p>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date d'envoi</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Facture</TableHead>
              <TableHead>Canal</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockReminders.map((reminder) => (
              <TableRow key={reminder.id}>
                <TableCell>{formatDateFr(reminder.sentAt)}</TableCell>
                <TableCell className="font-medium">{reminder.clientName}</TableCell>
                <TableCell>{reminder.invoiceNumber}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {reminder.channel === 'email' ? <Mail className="h-4 w-4 text-muted-foreground" /> : <MessageCircle className="h-4 w-4 text-emerald-500" />}
                    <span className="capitalize">{reminder.channel}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={reminder.outcome === 'delivered' ? 'default' : reminder.outcome === 'failed' ? 'destructive' : 'secondary'}
                  >
                    {reminder.outcome === 'delivered' ? 'Remis' : reminder.outcome === 'failed' ? 'Échoué' : 'En attente'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
