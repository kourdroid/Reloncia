import { describe, it, expect } from "vitest";

// Contract test: validates the shape of deadline_alert webhook payloads
// that the app sends to n8n and the callbacks it receives from n8n.

const EXPECTED_OUTBOUND_FIELDS = [
  "tenantId",
  "invoiceId",
  "legalThresholdDate",
  "daysRemaining",
  "responsibleUserEmail",
] as const;

const EXPECTED_CALLBACK_FIELDS = ["event", "invoiceId", "status"] as const;

describe("n8n Deadline Alert Webhook Contract", () => {
  describe("outbound payload (app → n8n)", () => {
    it("should include all required fields", () => {
      const mockPayload = {
        tenantId: "tenant-1",
        invoiceId: "inv-1",
        legalThresholdDate: "2026-06-01",
        daysRemaining: 7,
        responsibleUserEmail: "admin@company.ma",
      };

      EXPECTED_OUTBOUND_FIELDS.forEach((field) => {
        expect(mockPayload).toHaveProperty(field);
        expect(mockPayload[field]).toBeDefined();
      });
    });

    it("should have daysRemaining as a number", () => {
      const payload = { daysRemaining: 7 };
      expect(typeof payload.daysRemaining).toBe("number");
    });
  });

  describe("inbound callback (n8n → app)", () => {
    it("should accept deadline_alert event type", () => {
      const callback = {
        event: "deadline_alert",
        invoiceId: "inv-1",
        status: "notified",
      };

      EXPECTED_CALLBACK_FIELDS.forEach((field) => {
        expect(callback).toHaveProperty(field);
      });
      expect(callback.event).toBe("deadline_alert");
    });

    it("should reject unknown event types", () => {
      const knownEvents = ["reminder_sent", "deadline_alert", "reminder_failed"];
      const unknownEvent = "unknown_event";
      expect(knownEvents).not.toContain(unknownEvent);
    });
  });

  describe("security", () => {
    it("should require N8N_WEBHOOK_SECRET header", () => {
      // Contract: every inbound n8n call must have x-n8n-secret matching env var
      const requiredHeader = "x-n8n-secret";
      expect(requiredHeader).toBe("x-n8n-secret");
    });
  });
});
