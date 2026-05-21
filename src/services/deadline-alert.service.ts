import { createAdminClient } from "../supabase/admin";
import {
  getLegalRiskInvoices,
  getResponsibleUsersForTenant,
  type LegalRiskInvoice,
  type ResponsibleUser,
} from "../repositories/deadline-alert.repository";

export type DeadlineAlertPayload = {
  tenantId: string;
  invoiceId: string;
  invoiceNumber: string;
  legalThresholdDate: string;
  daysRemaining: number;
  responsibleUsers: Pick<ResponsibleUser, "email" | "role" | "source">[];
};

/**
 * Scans all invoices approaching Law 69-21 threshold and builds alert payloads
 * grouped by tenant. Called by the n8n `daily_deadline_scan` webhook trigger.
 *
 * IMPORTANT: This service ONLY reads data. n8n dispatches the actual notifications.
 * No direct writes happen here — all mutations go through audited Server Actions.
 */
export async function buildDeadlineAlertPayloads(): Promise<DeadlineAlertPayload[]> {
  const adminClient = createAdminClient();

  const riskInvoices = await getLegalRiskInvoices(adminClient);

  // Group by tenant
  const byTenant = new Map<string, LegalRiskInvoice[]>();
  for (const inv of riskInvoices) {
    const group = byTenant.get(inv.tenant_id) ?? [];
    group.push(inv);
    byTenant.set(inv.tenant_id, group);
  }

  const payloads: DeadlineAlertPayload[] = [];

  for (const [tenantId, invoices] of byTenant.entries()) {
    const responsibleUsers = await getResponsibleUsersForTenant(adminClient, tenantId);

    for (const invoice of invoices) {
      payloads.push({
        tenantId,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoice_number,
        legalThresholdDate: invoice.legal_threshold_date,
        daysRemaining: invoice.days_remaining,
        responsibleUsers: responsibleUsers.map(({ email, role, source }) => ({
          email,
          role,
          source,
        })),
      });
    }
  }

  return payloads;
}

/**
 * Returns legal-risk invoices for a specific tenant (used by dashboard hooks).
 * Uses the admin client so RLS does not interfere with the risk scan.
 */
export async function getLegalRiskSummaryForTenant(
  tenantId: string
): Promise<{ count: number; totalAmount: number }> {
  const adminClient = createAdminClient();
  const invoices = await getLegalRiskInvoices(adminClient);

  const tenantInvoices = invoices.filter((i) => i.tenant_id === tenantId);

  return {
    count: tenantInvoices.length,
    totalAmount: tenantInvoices.reduce((sum, i) => sum + i.amount_ttc, 0),
  };
}
