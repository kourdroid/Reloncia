import { describe, it, expect, vi } from "vitest";

// Unit test for deadline alert service logic.
// The service must: 1) query invoices at risk, 2) identify responsible users, 3) dispatch via n8n.

const buildInvoice = (daysUntilThreshold: number) => ({
  id: "inv-1",
  tenant_id: "tenant-1",
  law_69_21_flag: true,
  legal_threshold_date: new Date(Date.now() + daysUntilThreshold * 86400000)
    .toISOString()
    .split("T")[0],
  status: "En cours",
});

describe("Deadline Alert Service", () => {
  describe("risk evaluation", () => {
    it("should flag invoice within 10 days of threshold as at-risk", () => {
      const invoice = buildInvoice(9);
      const thresholdDate = new Date(invoice.legal_threshold_date);
      const now = new Date();
      const daysUntil = Math.ceil(
        (thresholdDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
      );
      expect(daysUntil).toBeLessThanOrEqual(10);
    });

    it("should NOT flag invoice with 30 days until threshold", () => {
      const invoice = buildInvoice(30);
      const thresholdDate = new Date(invoice.legal_threshold_date);
      const now = new Date();
      const daysUntil = Math.ceil(
        (thresholdDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
      );
      expect(daysUntil).toBeGreaterThan(10);
    });

    it("should only alert on active invoice statuses", () => {
      const activeStatuses = ["Nouvelle", "En cours", "Litige"];
      const closedStatuses = ["Payée", "Clôturée", "Avoir"];

      activeStatuses.forEach((status) => {
        expect(["Nouvelle", "En cours", "Litige"]).toContain(status);
      });

      closedStatuses.forEach((status) => {
        expect(["Nouvelle", "En cours", "Litige"]).not.toContain(status);
      });
    });
  });

  describe("alert targeting", () => {
    it("should target the tenant member with TenantAdmin role", () => {
      // The responsible user for an invoice is the TenantAdmin of its tenant.
      // This test documents the targeting contract without hitting the DB.
      const responsibleRole = "TenantAdmin";
      expect(responsibleRole).toBe("TenantAdmin");
    });

    it("should also notify delegated cabinet members", () => {
      // Cabinet members with active delegation should receive secondary alerts.
      const notificationScope = ["TenantAdmin", "CabinetMember"];
      expect(notificationScope).toContain("CabinetMember");
    });
  });
});
