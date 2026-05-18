# Server Action Contracts

All Server Actions must follow this sequence:

1. Validate input with Zod.
2. Verify Supabase Auth session.
3. Resolve role and tenant/cabinet authorization from the database.
4. Execute RLS-protected repository call or RPC.
5. Write audit log for mutations/export actions.
6. Return a typed result.

## Result Shape

```ts
type ActionResult<T> =
  | { ok: true; data: T }
  | {
      ok: false
      error: {
        code:
          | 'UNAUTHENTICATED'
          | 'FORBIDDEN'
          | 'VALIDATION_ERROR'
          | 'CONFLICT'
          | 'NOT_FOUND'
          | 'PROVIDER_ERROR'
          | 'INTERNAL_ERROR'
        message: string
        fieldErrors?: Record<string, string[]>
      }
    }
```

## Dashboard Queries

### getCabinetDashboardSummary

- **Input**: `{ cabinetId?: string }`
- **Output**: total unpaid MAD, overdue >30 count, legal-risk count, top 5 late-paying clients, top companies by unpaid exposure.
- **Mutation**: No.
- **Audit**: No mutation audit. Access remains RLS-protected.

### getCompanyInvoiceAging

- **Input**: `{ companyId: string; status?: 'unpaid' | 'all' }`
- **Output**: aging buckets `0_30`, `30_60`, `60_plus`, invoice rows, MAD subtotals.
- **Mutation**: No.
- **Audit**: No mutation audit.

## Invoice Mutations

### createInvoice

- **Input**: company, client, invoice number, dates, amounts, optional lines.
- **Authorization**: TenantAdmin/TenantUser with write permission or CabinetAdmin/CabinetMember with delegated write permission.
- **Audit**: `invoice.created`.

### updateInvoiceStatus

- **Input**: `{ invoiceId: string; nextStatus: invoice_status; reason?: string }`
- **Rules**: Status transition must be accepted by database function.
- **Audit**: `invoice.status_changed`.

### generateAvoir

- **Input**: `{ invoiceId: string; reason: string }`
- **Rules**: Source invoice must be `Clôturée`.
- **Audit**: `invoice.avoir_generated`.

## Reminder Mutations

### sendReminder

- **Input**: `{ companyId: string; invoiceIds: string[]; channel: 'email' | 'whatsapp'; message: string }`
- **Rules**: Invoice IDs must belong to company and be unpaid. WhatsApp requires channel configuration.
- **Audit**: `reminder.sent`.
- **Output**: reminder id, event ids, per-invoice outcome.

## Import Mutations

### createImportJob

- **Input**: company id, file metadata, storage path.
- **Audit**: `import.created`.

### saveImportMapping

- **Input**: import job id, mapping JSON.
- **Audit**: `import.mapping_saved`.

### confirmImportRows

- **Input**: import job id, accepted row ids.
- **Rules**: Only validated rows can become invoices. Duplicate rows require explicit resolution.
- **Audit**: `import.confirmed`.

## Report Actions

### generateMonthlyReport

- **Input**: `{ companyId: string; month: 'YYYY-MM' }`
- **Output**: report id, signed URL, expiry.
- **Audit**: `report.generated`.

## Feature Gates

- MVP dashboard, company aging, manual reminders, imports, and reports are ungated.
- Future gates must be checked server-side before provider calls, report generation, AI calls, or extra company/user limits.
