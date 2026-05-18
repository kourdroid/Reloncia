import { z } from "zod";

export const reminderSchema = z.object({
  invoiceIds: z.array(z.string().uuid()).min(1),
  channel: z.enum(["email", "whatsapp"]),
  messageTemplate: z.string().min(5),
});

export const importJobSchema = z.object({
  fileName: z.string().min(1),
  storagePath: z.string().min(1),
});

export const updateInvoiceStatusSchema = z.object({
  invoiceId: z.string().uuid(),
  status: z.enum(['Nouvelle', 'En cours', 'Payée', 'Litige', 'Clôturée', 'Avoir']),
});
