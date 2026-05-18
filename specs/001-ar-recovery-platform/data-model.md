# Data Model: eFacturation Accounts Receivable Recovery Platform

## Migration Order

1. `001_extensions.sql` - `uuid-ossp`, `pgcrypto`.
2. `002_cabinets.sql` - accounting firms.
3. `003_tenants.sql` - company tenants/SMEs.
4. `004_profiles.sql` - platform profiles linked to `auth.users`.
5. `005_cabinet_companies.sql` - delegated cabinet-company relationships.
6. `006_cabinet_members.sql` - cabinet staff and cabinet-level roles.
7. `007_tenant_members.sql` - company users and tenant-level roles.
8. `008_clients.sql` - tenant-owned invoice clients.
9. `009_invoices.sql` - tenant-owned invoices and status fields.
10. `010_invoice_lines.sql` - invoice line items.
11. `011_reminders.sql` - reminder batches.
12. `012_reminder_events.sql` - individual send attempts/outcomes.
13. `013_payments.sql` - payment records.
14. `014_audit_logs.sql` - immutable audit trail.
15. `015_import_jobs.sql` - Excel/CSV import sessions.
16. `016_import_rows.sql` - per-row mapping/validation/import status.
17. `017_rls_policies.sql` - all RLS policies.
18. `018_functions.sql` - stored procedures, triggers, computed helpers.
19. `019_seed.sql` - development seed data only.

## Enums

- `platform_role`: `SuperAdmin`.
- `cabinet_role`: `CabinetAdmin`, `CabinetMember`, `ReadOnly`.
- `tenant_role`: `TenantAdmin`, `TenantUser`, `ReadOnly`.
- `invoice_status`: `Nouvelle`, `En cours`, `Payée`, `Litige`, `Clôturée`, `Avoir`.
- `reminder_channel`: `email`, `whatsapp`.
- `reminder_outcome`: `pending`, `sent`, `failed`, `delivered`, `opened`, `responded`.
- `import_job_status`: `pending`, `mapping`, `validated`, `importing`, `complete`, `failed`, `cancelled`.
- `import_row_status`: `mapped`, `duplicate`, `error`, `imported`, `skipped`.
- `preferred_channel`: `email`, `whatsapp`.

## Entities

### cabinets

- **Purpose**: Accounting firm account.
- **Fields**: `id`, `name`, `ice`, `email`, `phone`, `address`, `created_at`, `updated_at`.
- **Rules**: Cabinet does not own tenant data. It receives delegated access through `cabinet_companies`.
- **Indexes**: unique normalized cabinet name where practical, `email`.

### tenants

- **Purpose**: Company/SME that owns invoices and client data.
- **Fields**: `id`, `company_name`, `ice`, `email`, `phone`, `address`, `default_payment_delay_days`, `locale`, `created_at`, `updated_at`.
- **Rules**: May exist without a cabinet. Defaults: MAD currency, French locale, 60-day payment-delay threshold.
- **Indexes**: `ice`, `email`.

### profiles

- **Purpose**: Application profile linked to Supabase Auth.
- **Fields**: `id` referencing `auth.users(id)`, `full_name`, `email`, `phone`, `platform_role`, `created_at`, `updated_at`.
- **Rules**: Platform role is only for SuperAdmin. Cabinet/tenant roles live in membership tables.
- **Indexes**: unique `email`.

### cabinet_companies

- **Purpose**: Delegates cabinet access to a tenant company.
- **Fields**: `id`, `cabinet_id`, `tenant_id`, `status`, `starts_at`, `ends_at`, `created_at`.
- **Rules**: Removing or ending this link revokes cabinet access without deleting tenant data.
- **Indexes**: unique active `cabinet_id + tenant_id`, `tenant_id`, `cabinet_id`.

### cabinet_members

- **Purpose**: Cabinet staff membership.
- **Fields**: `id`, `cabinet_id`, `profile_id`, `role`, `created_at`, `updated_at`.
- **Rules**: CabinetAdmin manages cabinet members and delegated company access.
- **Indexes**: unique `cabinet_id + profile_id`, `profile_id`.

### tenant_members

- **Purpose**: Company user membership.
- **Fields**: `id`, `tenant_id`, `profile_id`, `role`, `created_at`, `updated_at`.
- **Rules**: TenantAdmin manages company users. ReadOnly cannot mutate.
- **Indexes**: unique `tenant_id + profile_id`, `profile_id`.

### clients

- **Purpose**: Customers of a tenant company.
- **Fields**: `id`, `tenant_id`, `name`, `email`, `phone`, `ice`, `address`, `preferred_channel`, `created_at`, `updated_at`.
- **Rules**: Unique client email/ICE only within a tenant when present.
- **Indexes**: `tenant_id`, `tenant_id + email`, `tenant_id + ice`, trigram/name index for import matching.

### invoices

- **Purpose**: Tenant-owned invoice record.
- **Fields**: `id`, `tenant_id`, `client_id`, `invoice_number`, `status`, `amount_ht`, `tax_amount`, `amount_ttc`, `currency`, `invoice_date`, `due_date`, `legal_threshold_date`, `law_69_21_flag`, `reminder_count`, `last_reminder_at`, `linked_avoir_invoice_id`, `created_at`, `updated_at`, `paid_at`, `closed_at`.
- **Rules**:
  - Unique `tenant_id + invoice_number`.
  - Currency defaults to MAD.
  - `law_69_21_flag` is true when invoice is unpaid and `legal_threshold_date - current_date <= 10`.
  - `Nouvelle` auto-transitions to `En cours` after 7 days if unpaid through audited DB/server execution.
  - `Litige` only from `En cours`.
  - `Avoir` only generated from `Clôturée` through controlled function.
- **Indexes**: `tenant_id + status`, `tenant_id + due_date`, `tenant_id + law_69_21_flag`, `client_id`, `tenant_id + invoice_number`.

### invoice_lines

- **Purpose**: Optional invoice details for imports/reports.
- **Fields**: `id`, `tenant_id`, `invoice_id`, `description`, `quantity`, `unit_price`, `tax_rate`, `line_total`, `created_at`.
- **Rules**: `tenant_id` must match parent invoice tenant.
- **Indexes**: `invoice_id`, `tenant_id + invoice_id`.

### reminders

- **Purpose**: Batch reminder action across one or more invoices.
- **Fields**: `id`, `tenant_id`, `created_by`, `channel`, `message_template`, `status`, `created_at`.
- **Rules**: Created by authorized actor only. Does not prove delivery by itself; events do.
- **Indexes**: `tenant_id`, `created_by`, `created_at`.

### reminder_events

- **Purpose**: Immutable individual send attempt/outcome.
- **Fields**: `id`, `tenant_id`, `reminder_id`, `invoice_id`, `client_id`, `recipient`, `channel`, `outcome`, `provider_message_id`, `sent_at`, `delivered_at`, `failed_at`, `failure_reason`, `created_at`.
- **Rules**: Insert-only after creation except controlled provider outcome update function. Every send attempt increments invoice reminder tracking transactionally.
- **Indexes**: `tenant_id + invoice_id`, `tenant_id + created_at`, `provider_message_id`.

### payments

- **Purpose**: Payment records against invoices.
- **Fields**: `id`, `tenant_id`, `invoice_id`, `amount`, `payment_date`, `method`, `reference`, `created_by`, `created_at`.
- **Rules**: Total payments cannot exceed invoice total unless explicitly marked as overpayment resolution.
- **Indexes**: `tenant_id + invoice_id`, `tenant_id + payment_date`.

### import_jobs

- **Purpose**: Import session for Excel/CSV files.
- **Fields**: `id`, `tenant_id`, `created_by`, `file_name`, `storage_path`, `status`, `mapping_json`, `total_rows`, `accepted_rows`, `rejected_rows`, `created_at`, `completed_at`.
- **Rules**: Confirmation required before invoice writes. AI suggestions are advisory.
- **Indexes**: `tenant_id + created_at`, `status`.

### import_rows

- **Purpose**: Per-row import mapping and validation state.
- **Fields**: `id`, `tenant_id`, `import_job_id`, `row_number`, `raw_json`, `mapped_json`, `status`, `errors_json`, `matched_client_id`, `created_invoice_id`, `created_at`.
- **Rules**: Only rows in valid importable state can be confirmed.
- **Indexes**: `import_job_id`, `tenant_id + status`.

### audit_logs

- **Purpose**: Immutable audit trail.
- **Fields**: `id`, `tenant_id`, `actor_profile_id`, `action`, `target_table`, `target_id`, `before_json`, `after_json`, `metadata_json`, `created_at`.
- **Rules**: Insert-only. No update/delete policies. Stored through controlled functions for mutation paths.
- **Indexes**: `tenant_id + created_at`, `actor_profile_id`, `target_table + target_id`.

## RLS Policy Model

- SuperAdmin can read/administer platform metadata through platform-specific policies.
- Tenant members can access only rows where `tenant_id` matches their active tenant membership.
- Cabinet members can access tenant rows only when:
  - their profile belongs to the active cabinet,
  - the cabinet has an active `cabinet_companies` link to the tenant,
  - their role permits the requested operation.
- ReadOnly policies allow SELECT only.
- `audit_logs` allow INSERT through controlled functions and SELECT only for authorized tenant/cabinet roles; UPDATE/DELETE denied.

## State Transitions

```text
Nouvelle -> En cours       automatic after 7 days if unpaid
En cours -> Payée          when payment settles invoice
En cours -> Litige         manual authorized action only
En cours -> Clôturée       manual authorized action only
Clôturée -> Avoir          controlled function creates linked credit invoice
```

Invalid transitions fail before mutation and write no partial financial state.

## Validation Rules

- Amounts must be positive decimal MAD values unless the record is an Avoir.
- Dates are stored as ISO dates and displayed as `dd/mm/yyyy`.
- Required invoice import fields: invoice number, client identifier/name, amount, invoice date or due date.
- Duplicate invoice detection:
  - hard duplicate: same `tenant_id + invoice_number`,
  - possible duplicate: same `tenant_id + client_name + amount + invoice_date`.
- Legal-risk evaluation excludes paid invoices.
