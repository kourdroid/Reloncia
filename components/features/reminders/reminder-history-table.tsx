"use client";

import { Mail, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateFr } from "@/src/lib/demo-data";

type ReminderHistoryItem = {
  id: string
  sentAt: string
  clientName: string
  invoiceNumber: string
  channel: "email" | "whatsapp"
  outcome: "delivered" | "failed" | "pending"
}

const demoHistory: ReminderHistoryItem[] = [
  {
    id: "rem-1",
    sentAt: "2026-05-18T09:12:00Z",
    clientName: "Société Horizon",
    invoiceNumber: "FAC-2026-1182",
    channel: "email",
    outcome: "delivered",
  },
  {
    id: "rem-2",
    sentAt: "2026-05-17T14:45:00Z",
    clientName: "Clinique Anfa",
    invoiceNumber: "FAC-2026-0934",
    channel: "whatsapp",
    outcome: "pending",
  },
]

export function ReminderHistoryTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Facture</TableHead>
          <TableHead>Canal</TableHead>
          <TableHead>Résultat</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {demoHistory.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{formatDateFr(item.sentAt)}</TableCell>
            <TableCell className="font-medium">{item.clientName}</TableCell>
            <TableCell>{item.invoiceNumber}</TableCell>
            <TableCell>
              <span className="flex items-center gap-2">
                {item.channel === "email" ? <Mail /> : <MessageCircle />}
                {item.channel === "email" ? "Email" : "WhatsApp"}
              </span>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  item.outcome === "delivered"
                    ? "secondary"
                    : item.outcome === "failed"
                      ? "destructive"
                      : "outline"
                }
              >
                {item.outcome === "delivered"
                  ? "Remis"
                  : item.outcome === "failed"
                    ? "Échoué"
                    : "En attente"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
