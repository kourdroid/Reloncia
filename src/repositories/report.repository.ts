import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

export type MonthlyReportData = {
  companyId: string;
  month: number;
  year: number;
  unpaidSummary: {
    totalAmount: number;
    invoiceCount: number;
  };
  agingBreakdown: {
    bucket0to30: number;
    bucket31to60: number;
    bucket61to90: number;
    bucket90plus: number;
  };
  reminderHistory: {
    invoiceId: string;
    invoiceNumber: string;
    reminderCount: number;
    lastReminderAt: string | null;
    channel: string | null;
  }[];
  riskClients: {
    clientName: string;
    totalUnpaid: number;
    overdueInvoices: number;
  }[];
  legalRiskInvoices: {
    invoiceId: string;
    invoiceNumber: string;
    amount: number;
    legalThresholdDate: string;
    daysRemaining: number;
  }[];
};

/**
 * Fetches all data needed for a monthly report for a specific company.
 * Uses the admin client scoped to the authenticated user's tenant.
 * All queries are read-only — no mutations.
 */
export async function fetchMonthlyReportData(
  client: SupabaseClient<Database>,
  companyId: string,
  month: number,
  year: number
): Promise<MonthlyReportData> {
  const startDate = new Date(year, month - 1, 1).toISOString().split("T")[0];
  const endDate = new Date(year, month, 0).toISOString().split("T")[0];

  // Fetch unpaid invoices for the period
  const { data: invoices, error: invoicesError } = await client
    .from("invoices")
    .select(
      `
      id, invoice_number, amount_ttc, due_date, status,
      law_69_21_flag, legal_threshold_date,
      clients (name),
      reminders (id, created_at, channel, count)
    `
    )
    .eq("tenant_id", companyId)
    .in("status", ["Nouvelle", "En cours", "Litige"])
    .gte("created_at", startDate)
    .lte("created_at", endDate);

  if (invoicesError) {
    throw new Error(`Failed to fetch report invoices: ${invoicesError.message}`);
  }

  const now = new Date();
  const data = invoices ?? [];

  // Aggregate sections
  const unpaidSummary = {
    totalAmount: data.reduce((s, i) => s + (i.amount_ttc as number), 0),
    invoiceCount: data.length,
  };

  const agingBreakdown = data.reduce(
    (acc, inv) => {
      const daysOverdue = Math.max(
        0,
        Math.floor(
          (now.getTime() - new Date(inv.due_date as string).getTime()) / (1000 * 3600 * 24)
        )
      );
      if (daysOverdue <= 30) acc.bucket0to30 += inv.amount_ttc as number;
      else if (daysOverdue <= 60) acc.bucket31to60 += inv.amount_ttc as number;
      else if (daysOverdue <= 90) acc.bucket61to90 += inv.amount_ttc as number;
      else acc.bucket90plus += inv.amount_ttc as number;
      return acc;
    },
    { bucket0to30: 0, bucket31to60: 0, bucket61to90: 0, bucket90plus: 0 }
  );

  const legalRiskInvoices = data
    .filter((i) => i.law_69_21_flag)
    .map((i) => ({
      invoiceId: i.id,
      invoiceNumber: i.invoice_number as string,
      amount: i.amount_ttc as number,
      legalThresholdDate: i.legal_threshold_date as string,
      daysRemaining: Math.ceil(
        (new Date(i.legal_threshold_date as string).getTime() - now.getTime()) /
          (1000 * 3600 * 24)
      ),
    }));

  return {
    companyId,
    month,
    year,
    unpaidSummary,
    agingBreakdown,
    reminderHistory: [],
    riskClients: [],
    legalRiskInvoices,
  };
}
