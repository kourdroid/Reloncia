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

1. Login as CabinetAdmin.
2. Open dashboard and confirm unpaid total, overdue >30 count, legal-risk count, and top late clients.
3. Drill into one company and verify aging buckets.
4. Send one email reminder and confirm reminder/audit history.
5. Upload a sample Excel file, map columns, validate rows, and confirm import.
6. Generate a monthly report and open the signed URL.
7. Login as unauthorized tenant user and verify the same data is inaccessible.
