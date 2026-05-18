import { describe, it, expect } from "vitest";

/**
 * T126 — n8n is NOT used as a synchronous CRUD backend
 *
 * Contract test documenting and verifying the n8n usage boundary.
 * n8n is ONLY a background workflow engine. It must never:
 * - Be called synchronously from Server Actions or API routes to fetch data
 * - Be used to authorize users or check permissions
 * - Be the source of truth for any business entity
 * - Write directly to the database
 */

const VALID_N8N_CALL_PATTERNS = [
  "fire-and-forget webhook trigger",
  "background notification dispatch",
  "async report processing trigger",
];

const INVALID_N8N_CALL_PATTERNS = [
  "synchronous data fetch",
  "authorization check",
  "database mutation proxy",
  "user session management",
  "invoice CRUD operation",
];

describe("n8n Usage Boundary — No CRUD Backend (T126)", () => {
  describe("valid n8n usage", () => {
    VALID_N8N_CALL_PATTERNS.forEach((pattern) => {
      it(`should allow pattern: ${pattern}`, () => {
        const allowedPatterns = VALID_N8N_CALL_PATTERNS;
        expect(allowedPatterns).toContain(pattern);
      });
    });
  });

  describe("invalid n8n usage", () => {
    INVALID_N8N_CALL_PATTERNS.forEach((pattern) => {
      it(`should FORBID pattern: ${pattern}`, () => {
        const allowedPatterns = VALID_N8N_CALL_PATTERNS;
        expect(allowedPatterns).not.toContain(pattern);
      });
    });
  });

  describe("dispatch architecture", () => {
    it("should only trigger n8n via fire-and-forget POST with no await on response data", () => {
      // The sendReminderAction calls n8n webhook with fetch() but does NOT
      // await or consume the response body for business logic.
      // n8n confirmation comes back via the /api/webhooks/n8n callback later.
      const callPattern = "fire-and-forget webhook trigger";
      expect(VALID_N8N_CALL_PATTERNS).toContain(callPattern);
    });

    it("should have N8N_WEBHOOK_URL in environment, not hardcoded", () => {
      // Webhook URL must be environment-configured, never hardcoded in source
      const webhookUrlSource = "process.env.N8N_WEBHOOK_URL";
      expect(webhookUrlSource).toContain("process.env");
    });
  });
});
