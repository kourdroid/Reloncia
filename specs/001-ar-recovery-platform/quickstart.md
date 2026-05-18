# Quickstart: eFacturation Accounts Receivable Recovery Platform

## 1. Runtime

- Install Node.js 20.9+.
- Enable pnpm with Corepack.
- Create `.nvmrc` with the selected Node version during implementation.
- Configure Vercel runtime to Node.js 20.9+ or newer.

## 2. Create the App

Use Next.js 16 App Router only.

```bash
pnpm create next-app@latest efacturation --ts --app --src-dir false --eslint
cd efacturation
```

Install core dependencies:

```bash
pnpm add @supabase/supabase-js @supabase/ssr @tanstack/react-query next-intl react-hook-form zod @hookform/resolvers recharts resend xlsx papaparse @react-pdf/renderer
pnpm add -D tailwindcss @tailwindcss/postcss eslint @typescript-eslint/eslint-plugin prettier husky lint-staged vitest playwright
```

Initialize shadcn/ui with the current CLI:

```bash
npx shadcn@latest init
npx shadcn@latest add button card table dialog dropdown-menu form input select textarea badge tabs
```

## 3. Configuration Rules

- Use `proxy.ts`, not `middleware.ts`.
- Do not add Webpack config.
- Do not add `tailwind.config.js`; Tailwind v4 theme config lives in `app/globals.css` through `@theme`.
- Use ESLint directly. Do not use `next lint`.
- Use async `params` and `searchParams` in pages/layouts/route handlers.
- Use Supabase publishable key format for browser-safe configuration.

Required environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
SUPABASE_SERVICE_ROLE_KEY=
N8N_WEBHOOK_SECRET=
RESEND_API_KEY=
OPENAI_API_KEY=
```

`OPENAI_API_KEY` is Phase 2 only.

## 4. Supabase Setup

Create the Supabase project in an EU West region.

Create private buckets:

```text
imports
reports
```

Generate types after migrations:

```bash
supabase gen types typescript --project-id <id> > src/types/supabase.ts
```

Apply migrations in order:

```text
001_extensions.sql
002_cabinets.sql
003_tenants.sql
004_profiles.sql
005_cabinet_companies.sql
006_cabinet_members.sql
007_tenant_members.sql
008_clients.sql
009_invoices.sql
010_invoice_lines.sql
011_reminders.sql
012_reminder_events.sql
013_payments.sql
014_audit_logs.sql
015_import_jobs.sql
016_import_rows.sql
017_rls_policies.sql
018_functions.sql
019_seed.sql
```

Rollback requirement: every migration must include a paired rollback note or
reverse migration. Destructive migration work requires a two-phase deploy plan.

## 5. Initial Feature Validation

Seed:

- 1 cabinet.
- 3 company tenants.
- 3 cabinet users with different roles.
- 2 independent SME users without a cabinet.
- 50 clients.
- 500 invoices across aging buckets.
- Reminder events and import jobs.

Verify:

- Cabinet dashboard excludes non-delegated companies.
- TenantAdmin sees only own company.
- ReadOnly cannot mutate.
- Invoice status transitions reject invalid transitions.
- Reminder send creates reminder event and audit log.
- Import confirmation writes invoices only after validation.
- Report generation creates a private signed URL and audit log.

## 6. n8n Setup

Create three workflows:

- `daily_deadline_scan` at 07:00 Africa/Casablanca.
- `auto_reminder_dispatch` at 08:00 Africa/Casablanca.
- `invoice_status_escalation` at 06:00 Africa/Casablanca.

All callbacks go through `/api/webhooks/n8n` with `X-N8N-Secret`.

n8n must not be called from frontend code and must not directly update invoice
business records.

## 7. Acceptance Smoke Test

This smoke test validates the complete MVP feature slice. Run against a Supabase local instance seeded with `019_seed.sql`.

### Pre-Test: Seed Verification

```bash
supabase db reset --local
supabase db push --local
```

Confirm seed loaded: 1 cabinet, 3 tenants, 3 cabinet users, 2 independent tenants, 50 clients, 500 invoices.

### Test Steps

1. **Dashboard (US1)**: Login as CabinetAdmin. Verify unpaid total, overdue >30 count, legal-risk count, and top 5 late clients appear. Verify non-delegated company data is absent.
2. **Company Aging (US2)**: Drill into one company. Verify invoices are grouped into 0-30, 31-60, 60+ day buckets with MAD subtotals.
3. **Reminder Sending (US3)**: Select 2 unpaid invoices. Send email reminder. Confirm reminder event appears in history, invoice reminder count incremented, and audit log created.
4. **Excel Import (US4)**: Upload `sample-invoices.xlsx`. Map columns. Verify validation results. Confirm valid rows. Verify imported invoices appear in company view.
5. **Legal Risk Alerts (US5)**: Verify at-risk invoices (≤10 days to threshold) appear in dashboard alert panel with `J-N` countdown badges.
6. **Monthly Report (US6)**: Navigate to company Reports tab. Select month/year. Click Generate. Open signed URL. Verify PDF contains unpaid summary, aging breakdown, and legal-risk section.
7. **Cross-Tenant Isolation**: Login as an unauthorized tenant user. Attempt to access another company's dashboard route. Verify 403 or redirect.

### Expected Outcomes

- ✅ Cabinet dashboard excludes non-delegated companies
- ✅ TenantAdmin sees only own company
- ✅ ReadOnly role cannot mutate any data
- ✅ Invoice status transitions reject invalid sequences
- ✅ Reminder send creates reminder event and audit log
- ✅ Import confirmation writes invoices only after user-confirmed validation
- ✅ Legal-risk flags are deterministic (computed by DB trigger, not n8n)
- ✅ Report generation creates a private signed URL (1-hour expiry) and audit log
- ✅ n8n callbacks received at /api/webhooks/n8n update state correctly
- ✅ No sensitive data (role, tenantId, session) found in browser localStorage
