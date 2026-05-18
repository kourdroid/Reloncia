"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { InvoiceTableRow } from "@/src/types/ui";
import { formatMAD, formatDateFr } from "@/src/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { getStatusBadgeVariant } from "@/src/lib/status";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, CheckCircle2, History } from "lucide-react";

interface InvoiceDetailSheetProps {
  invoice: InvoiceTableRow | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvoiceDetailSheet({ invoice, isOpen, onOpenChange }: InvoiceDetailSheetProps) {
  if (!invoice) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl">{invoice.invoiceNumber}</SheetTitle>
            <Badge variant={getStatusBadgeVariant(invoice.status)} className="text-sm px-3 py-1">
              {invoice.status}
            </Badge>
          </div>
          <SheetDescription className="text-base">
            Client: <span className="font-medium text-foreground">{invoice.clientName}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Montant TTC</span>
            <span className="text-xl font-bold">{formatMAD(invoice.amountMAD)}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Retard</span>
            <span className={`text-xl font-bold ${invoice.age > 0 ? 'text-amber-600' : ''}`}>
              {invoice.age > 0 ? `${invoice.age} jours` : 'À jour'}
            </span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Émise le</span>
            <span className="font-medium">{formatDateFr(invoice.issueDate)}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Échéance</span>
            <span className="font-medium">{formatDateFr(invoice.dueDate)}</span>
          </div>
        </div>

        {invoice.legalRisk && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-start gap-3 mb-6">
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
            <div className="flex flex-col space-y-1">
              <span className="font-semibold">Risque Légal (Loi 69-21)</span>
              <span className="text-sm">
                Cette facture a dépassé le délai légal de paiement de 60 jours. Elle est susceptible de pénalités de retard réglementaires.
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-8">
          <Button className="flex-1">Envoyer Relance</Button>
          <Button variant="outline" className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10">
            Marquer Litige
          </Button>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <History className="h-5 w-5" />
            Historique & Suivi
          </h3>
          
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {/* Timeline Item 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-slate-900">Import initial</div>
                  <time className="text-xs font-medium text-amber-500">12 Oct 2023</time>
                </div>
                <div className="text-slate-500 text-sm">Facture importée depuis le système comptable.</div>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <Clock className="h-5 w-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-slate-900">Relance Email (Niv 1)</div>
                  <time className="text-xs font-medium text-slate-500">15 Nov 2023</time>
                </div>
                <div className="text-slate-500 text-sm">Email amical envoyé à contact@acme.com</div>
              </div>
            </div>
          </div>
        </div>

      </SheetContent>
    </Sheet>
  );
}
