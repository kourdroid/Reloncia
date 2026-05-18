# Implementation Plan: eFacturation Accounts Receivable Recovery Platform

**Branch**: `001-ar-recovery-platform` | **Date**: 2026-05-18 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-ar-recovery-platform/spec.md`

## Summary

Build a Morocco-first multi-tenant SaaS for accounting firms and SMEs to monitor,
prioritize, and recover unpaid invoices. The implementation uses Next.js 16 App
Router for the web app, Supabase PostgreSQL as the system of record, RLS for
tenant/cabinet isolation, typed service/repository access, audited Server
Actions for mutations, private Supabase Storage for imports and reports, and n8n
only for asynchronous reminders and notifications.

The plan intentionally rejects the proposed n8n direct database update exception.
Invoice status escalation is business data mutation and must run through
PostgreSQL functions or audited server-side execution, not n8n CRUD.

## Technical Context

**Language/Version**: TypeScript strict mode, Node.js 20.9+, Next.js 16.2.6, React 19.2.6  
**Primary Dependencies**: Supabase JS 2.105.x, `@supabase/ssr`, TanStack Query 5.100.x, Tailwind CSS 4.3.x, shadcn/ui latest CLI, React Hook Form 7.x, Zod 4.4.x, next-intl 4.12.x, Recharts, Resend, SheetJS `xlsx`, PapaParse, `@react-pdf/renderer` 4.5.x  
**Storage**: Supabase PostgreSQL as system of record; Supabase Storage private `imports` and `reports` buckets  
**Testing**: Vitest for unit/service tests, pgTAP or Supabase local SQL tests for RLS/policies, Playwright for end-to-end flows, ESLint flat config for linting  
**Target Platform**: Web SaaS for Moroccan accounting firms and SMEs, deployed on Vercel with Supabase managed EU West region  
**Project Type**: Multi-tenant web application  
**Performance Goals**: Cabinet dashboard usable for 100 companies and 100,000 invoices; company report generation under 60 seconds for 1,000 monthly invoices; primary dashboard decisions under 2 minutes  
**Constraints**: Tenant isolation, RLS on every table, immutable audit logs, server-side pricing gates, n8n background-only, no ORM, no direct Supabase calls from UI, no sensitive state in localStorage  
**Scale/Scope**: Phase 1 pilot supports 1 cabinet, 10-100 client companies, 100k invoice records, manual reminders, manual Excel mapping, French UI with Arabic architecture prepared

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **PostgreSQL Authority**: PASS. Supabase/PostgreSQL owns schema, RLS, business constraints, status transitions, legal-risk flags, and audit logs.
- **RLS and Tenant Scope**: PASS. Every tenant-owned table includes `tenant_id` or derives scope through tenant-owned parents. RLS policies are centralized in migration `017_rls_policies.sql`.
- **Cabinet Access**: PASS. `cabinet_companies` delegates cabinet access to company tenants. Tenant data remains company-owned if the cabinet link is removed.
- **Service Boundary**: PASS. React components/pages consume typed hooks and Server Actions. Supabase calls live in `src/services`, `src/repositories`, or server-only route handlers/actions.
- **Audit Coverage**: PASS. All mutations and report generation call `create_audit_log` inside the same transaction or fail closed.
- **n8n Boundary**: PASS WITH CORRECTION. n8n can trigger background jobs and report outcomes through `/api/webhooks/n8n`; it cannot perform CRUD/status updates directly.
- **AI Boundary**: PASS. AI is Phase 2 only and limited to reviewable suggestions for column mapping, drafting, summaries, and classification.
- **Pricing Gates**: PASS. MVP core is ungated; future plan limits are enforced server-side through feature flag/entitlement checks.
- **Migration Safety**: PASS. Migrations are ordered, reversible, and include rollback notes for destructive changes.

## Project Structure

### Documentation (this feature)

```text
specs/001-ar-recovery-platform/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── http-api.md
│   ├── server-actions.md
│   └── n8n-webhooks.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── [locale]/
│   ├── (marketing)/
│   ├── (auth)/login/
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── [companyId]/
│   │   └── admin/
│   └── layout.tsx
├── api/
│   ├── export/[companyId]/route.ts
│   ├── invoices/[invoiceId]/download/route.ts
│   └── webhooks/n8n/route.ts
└── globals.css

components/
├── ui/
└── features/
    ├── dashboard/
    ├── invoices/
    ├── imports/
    ├── reminders/
    └── reports/

src/
├── actions/
├── services/
├── repositories/
├── validation/
├── supabase/
├── feature-flags/
├── i18n/
└── types/

supabase/
├── migrations/
├── policies/
├── functions/
└── seed/

tests/
├── unit/
├── integration/
├── rls/
└── e2e/
```

**Structure Decision**: Use `app/` at root for Next.js routing, `src/` for
server-only application logic, and `supabase/` for database artifacts. This keeps
UI, business services, and database governance separated.

## Data Flow

1. User signs in through Supabase Auth; no role or tenant state is stored in localStorage.
2. `proxy.ts` performs locale negotiation and optimistic auth redirects only.
3. Server Components fetch read models through server services or RPCs protected by RLS.
4. Client grids use TanStack Query through typed service hooks; invoice status queries use `staleTime: 0`, dashboard summaries use `staleTime: 30_000`.
5. Mutations run through Server Actions: Zod validation, Supabase session check, role lookup, RLS-protected mutation/RPC, audit log write, typed result.
6. Reminder sends create `reminders` and `reminder_events`, call provider/n8n asynchronously, and update event outcome through authenticated webhook callbacks.
7. Excel imports store files privately, create `import_jobs`/`import_rows`, show a review UI, then bulk-insert validated rows through audited Server Actions.
8. Reports are generated by route handlers, stored in a private bucket, audited, and returned as one-hour signed URLs.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| n8n direct invoice status update | Not allowed | It violates PostgreSQL authority, bypasses application audit flow, and mutates business state outside RLS/service boundaries. Use a scheduled DB function or audited Server Action instead. |
| Arabic postponed from Phase 1 pilot | Pilot speed | The full feature still requires Arabic. Phase 1 scaffolds i18n/RTL and French content for first accountant validation; Arabic completion is required before full feature acceptance. |

## Phase 0 Research Output

See [research.md](./research.md). All technical context items are resolved.

## Phase 1 Design Output

- Data model: [data-model.md](./data-model.md)
- HTTP contracts: [contracts/http-api.md](./contracts/http-api.md)
- Server Action contracts: [contracts/server-actions.md](./contracts/server-actions.md)
- n8n webhook contracts: [contracts/n8n-webhooks.md](./contracts/n8n-webhooks.md)
- Quickstart: [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- **PostgreSQL Authority**: PASS. Database functions/triggers own status transitions, legal-risk calculations, audit immutability, and RLS.
- **RLS and Tenant Scope**: PASS. Data model includes tenant-scoped ownership and delegated cabinet access tests.
- **Cabinet Access**: PASS. Link tables model cabinet-to-company and member-to-company role variance.
- **Service Boundary**: PASS. Contracts route mutations through Server Actions and route handlers, never UI Supabase calls.
- **Audit Coverage**: PASS. Data model defines audit targets for imports, reminders, reports, status changes, and access delegation.
- **n8n Boundary**: PASS. Contracts allow only signed event callbacks and async job notifications.
- **AI Boundary**: PASS. AI is Phase 2 and review-only.
- **Pricing Gates**: PASS. MVP ungated; entitlement checks are designed for future paid limits.
- **Migration Safety**: PASS. Migration sequence is explicit and rollback obligations are documented in quickstart.
