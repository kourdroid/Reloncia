# n8n Webhook Contracts

n8n is a background worker only. It must never serve frontend CRUD, authorize
users, or become the source of truth for business data.

## Authentication

All inbound calls to Next.js use:

```http
X-N8N-Secret: <N8N_WEBHOOK_SECRET>
Content-Type: application/json
```

Invalid or missing secrets return `401`.

## POST /api/webhooks/n8n

### reminder_sent

Used after n8n/provider attempts a reminder delivery.

```json
{
  "event": "reminder_sent",
  "eventId": "uuid",
  "tenantId": "uuid",
  "reminderEventId": "uuid",
  "invoiceId": "uuid",
  "provider": "resend",
  "providerMessageId": "string",
  "outcome": "sent",
  "occurredAt": "2026-05-18T08:01:00Z"
}
```

Allowed outcomes: `sent`, `failed`, `delivered`, `opened`, `responded`.

### deadline_alert

Used after a deadline scan identifies a legal-risk invoice. The application
records notification state and keeps deterministic risk calculation in the DB.

```json
{
  "event": "deadline_alert",
  "eventId": "uuid",
  "tenantId": "uuid",
  "invoiceId": "uuid",
  "riskDate": "2026-05-25",
  "occurredAt": "2026-05-18T07:00:00Z"
}
```

### import_complete

Used after asynchronous parsing/notification finishes. Invoice writes still
require user confirmation through Server Actions.

```json
{
  "event": "import_complete",
  "eventId": "uuid",
  "tenantId": "uuid",
  "importJobId": "uuid",
  "status": "validated",
  "acceptedRows": 120,
  "rejectedRows": 8,
  "occurredAt": "2026-05-18T09:15:00Z"
}
```

## Outbound Background Jobs

### daily_deadline_scan

- **Trigger**: Daily at 07:00 Africa/Casablanca.
- **Action**: Query legal-risk invoices through authorized server-side function or read-only service credentials.
- **Output**: `deadline_alert` events.
- **Forbidden**: Direct mutation of invoice legal-risk fields if the database already computes them.

**n8n Setup:**
1. Create an n8n Cron node: `0 7 * * *` (Africa/Casablanca timezone).
2. Add an HTTP Request node:
   - Method: `GET`
   - URL: `{{ $env.APP_URL }}/api/deadline-scan`
   - Headers: `x-n8n-secret: {{ $env.N8N_WEBHOOK_SECRET }}`
3. Map each invoice in the response to a `deadline_alert` POST to `/api/webhooks/n8n`.
4. The `get_law_69_21_risk_invoices()` DB function drives the logic — n8n only reads and routes.

### auto_reminder_dispatch

- **Trigger**: Daily at 08:00 Africa/Casablanca.
- **Action**: Find eligible unpaid invoices, send Resend email in French by default, then post `reminder_sent`.
- **Eligibility**: Status `En cours`, preferred channel configured, no reminder in last 3 days, tenant/cabinet automation enabled.

### invoice_status_escalation

- **Trigger**: Daily at 06:00 Africa/Casablanca.
- **Action**: Call an audited application endpoint or database scheduled function to transition eligible `Nouvelle` invoices to `En cours`.
- **Forbidden**: n8n direct DB update of invoice status.

**n8n Setup:**
1. Create an n8n Cron node: `0 6 * * *` (Africa/Casablanca timezone).
2. Add an HTTP Request node:
   - Method: `POST`
   - URL: `{{ $env.APP_URL }}/api/invoices/escalate-status`
   - Headers: `x-n8n-secret: {{ $env.N8N_WEBHOOK_SECRET }}`
3. The app Server Action or route handler performs the escalation with full audit logging.
4. n8n only triggers — never writes directly.

## Failure Handling

- n8n retries transient failures with idempotent `eventId`.
- `/api/webhooks/n8n` ignores duplicate `eventId` after returning the existing accepted result.
- Provider failures are recorded as failed reminder events and do not claim delivery.

## Environment Variables Required

| Variable | Description |
|----------|-------------|
| `N8N_WEBHOOK_SECRET` | Shared secret for HMAC-style header validation |
| `APP_URL` | Base URL of the Next.js app (e.g. `https://app.efacturation.ma`) |
| `N8N_WEBHOOK_URL` | n8n webhook URL for outbound app → n8n calls |

## Constitutional Constraints

> **n8n is background-only.** It must never:
> - Serve frontend CRUD requests
> - Authorize users or check roles
> - Become the source of truth for business data
> - Write to the database directly (all mutations go through audited Server Actions)
