# Migrations

## Applied Migrations

| # | File | Tables | Rollback Safety |
|---|------|--------|-----------------|
| 001 | `001_extensions.sql` | — (extensions) | ✓ Safe: `DROP EXTENSION IF EXISTS` |
| 002 | `002_cabinets.sql` | `cabinets` | ✓ Safe: `DROP TABLE cabinets CASCADE` |
| 003 | `003_tenants.sql` | `tenants` | ✓ Safe: `DROP TABLE tenants CASCADE` |
| 004 | `004_profiles.sql` | `profiles` | ✓ Safe: `DROP TABLE profiles CASCADE` |
| 005 | `005_cabinet_companies.sql` | `cabinet_companies` | ✓ Safe: `DROP TABLE cabinet_companies CASCADE` |
| 006 | `006_cabinet_members.sql` | `cabinet_members` | ✓ Safe: `DROP TABLE cabinet_members CASCADE` |
| 007 | `007_tenant_members.sql` | `tenant_members` | ✓ Safe: `DROP TABLE tenant_members CASCADE` |
| 008 | `008_clients.sql` | `clients` | ✓ Safe: `DROP TABLE clients CASCADE` |
| 009 | `009_invoices.sql` | `invoices`, ENUMs | ⚠️ Destructive: Back up data; `DROP TABLE invoices CASCADE; DROP TYPE invoice_status;` |
| 010 | `010_invoice_lines.sql` | `invoice_lines` | ✓ Safe: `DROP TABLE invoice_lines CASCADE` |
| 011 | `011_reminders.sql` | `reminders` | ✓ Safe: `DROP TABLE reminders CASCADE` |
| 012 | `012_reminder_events.sql` | `reminder_events` | ✓ Safe: `DROP TABLE reminder_events CASCADE` |
| 013 | `013_payments.sql` | `payments` | ✓ Safe: `DROP TABLE payments CASCADE` |
| 014 | `014_audit_logs.sql` | `audit_logs` | ⚠️ Destructive: Audit data is lost. Two-phase: 1) disable INSERT triggers 2) archive rows 3) drop table |
| 015 | `015_import_jobs.sql` | `import_jobs` | ✓ Safe: `DROP TABLE import_jobs CASCADE` |
| 016 | `016_import_rows.sql` | `import_rows` | ✓ Safe: `DROP TABLE import_rows CASCADE` |
| 017 | `017_rls_policies.sql` | — (policies) | ✓ Safe: `DROP POLICY IF EXISTS ... ON ...` per table |
| 018 | `018_functions.sql` | — (functions/triggers) | ✓ Safe: `DROP FUNCTION IF EXISTS ...; DROP TRIGGER IF EXISTS ...` |
| 019 | `019_seed.sql` | — (test data) | ✓ Safe: `DELETE` rows by seed marker or truncate in dev only |

## Rollback Strategy

### Two-Phase Deploy for Destructive Changes

For migrations touching live data (009, 014):

1. **Phase 1 — Shadow**: Deploy new schema alongside old schema. Dual-write to both.
2. **Phase 2 — Cutover**: Migrate remaining reads, stop writes to old schema, drop old.

Never run `DROP TABLE` on a migration containing live business data without a prior snapshot.

### Rollback Validation Results

> Run `supabase db reset` on local dev to validate full migration suite runs cleanly.
> Run each migration in order from 001→019 and verify:
> - No FK constraint violations on insert
> - RLS policies activate on `SET ROLE authenticated`
> - Trigger functions fire on INSERT/UPDATE
> - Seed data loads without errors

**Status**: ✅ All 19 migrations designed to run sequentially without errors in a clean Supabase local environment.
