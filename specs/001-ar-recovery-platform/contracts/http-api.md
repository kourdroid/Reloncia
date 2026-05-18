# HTTP Route Contracts

## GET /api/export/[companyId]?month=YYYY-MM

Generates or retrieves a monthly company AR report.

- **Auth**: Supabase session required.
- **Authorization**: TenantAdmin/TenantUser/ReadOnly for own tenant or CabinetAdmin/CabinetMember/ReadOnly for delegated company. Report generation audit is required.
- **Input**:
  - `companyId`: company tenant UUID.
  - `month`: `YYYY-MM`.
- **Success 200**:

```json
{
  "ok": true,
  "reportId": "uuid",
  "signedUrl": "https://...",
  "expiresAt": "2026-05-18T13:00:00Z"
}
```

- **Errors**:
  - `401` unauthenticated.
  - `403` no access to company.
  - `422` invalid month or company id.
  - `500` generation/storage failure.

## GET /api/invoices/[invoiceId]/download

Returns a signed URL or streamed PDF for one invoice document when available.

- **Auth**: Supabase session required.
- **Authorization**: User must have read access to the invoice tenant.
- **Success 200**:

```json
{
  "ok": true,
  "invoiceId": "uuid",
  "signedUrl": "https://...",
  "expiresAt": "2026-05-18T13:00:00Z"
}
```

- **Errors**: `401`, `403`, `404`, `422`, `500`.

## POST /api/webhooks/n8n

Receives background automation outcomes from n8n.

- **Auth**: `X-N8N-Secret` header. Supabase user session is not used.
- **Authorization**: Shared secret plus payload validation. Endpoint may write only allowed event outcomes through server-side logic.
- **Allowed Events**: `reminder_sent`, `deadline_alert`, `import_complete`.
- **Success 200**:

```json
{
  "ok": true,
  "accepted": true,
  "eventId": "uuid"
}
```

- **Errors**:
  - `401` missing/invalid secret.
  - `405` non-POST.
  - `422` invalid event payload.
  - `500` persistence failure.

## Route Rules

- Route handlers must return typed success/error payloads.
- Route handlers must not bypass tenant authorization except for validated n8n event callbacks with constrained write behavior.
- Service role or secret keys are server-only.
- No route may expose another tenant's data through signed URLs, exports, or error messages.
