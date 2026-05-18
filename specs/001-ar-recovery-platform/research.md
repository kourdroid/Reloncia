# Research: eFacturation Accounts Receivable Recovery Platform

## Decisions

### Runtime and Package Versions

- **Decision**: Use Node.js 20.9+ with pnpm, Next.js 16.2.6, React 19.2.6, TanStack Query 5.100.x, Tailwind CSS 4.3.x, Supabase JS 2.105.x, next-intl 4.12.x, and `@react-pdf/renderer` 4.5.x.
- **Rationale**: These are the current package versions resolved from npm on 2026-05-18. Next.js 16 requires async dynamic APIs and renames middleware to proxy. React 19.2 includes `useEffectEvent` and Activity. TanStack Query v5 supports staleTime configuration for dashboard freshness. Tailwind v4 uses CSS-first theme variables.
- **Alternatives considered**: Next.js 15 was rejected because the product is new and should start on the current routing/runtime model. Zod v3 was requested, but current stable is Zod v4.4.x; use v4 unless a resolver compatibility issue appears during implementation.
- **Primary references**: Next.js Proxy docs, Next.js 16 upgrade docs, React 19.2 release notes, TanStack Query v5 docs, Tailwind v4 theme docs, Supabase API key docs.

### Routing, Proxy, and Auth Guarding

- **Decision**: Use App Router only. Use `proxy.ts` for locale detection and optimistic auth redirects. Do not put role/business authorization in proxy.
- **Rationale**: Next.js 16 renames middleware to proxy and the docs warn Proxy is not intended for full session management or authorization. Role decisions belong in Server Actions, route handlers, and RLS.
- **Alternatives considered**: `middleware.ts` was rejected as deprecated. Full role checks in proxy were rejected because they create slow, fragile request-boundary logic and duplicate RLS.

### Supabase Keys and Session Handling

- **Decision**: Use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...` in browser-safe code and server-only secret/service keys only in backend contexts. Do not store roles, tenant IDs, cabinet IDs, or entitlements in localStorage.
- **Rationale**: Supabase documents publishable keys as the newer low-privilege client key format and secret keys as backend-only. Supabase Auth session plus RLS is the authority.
- **Alternatives considered**: Legacy JWT anon keys were rejected for new code because Supabase now recommends publishable keys.

### Database and Business Rules

- **Decision**: Use Supabase PostgreSQL with explicit SQL migrations, no ORM, generated Supabase types, RLS on every table, and stored functions/triggers for status transitions, legal-risk flags, and audit immutability.
- **Rationale**: Financial, tenant-scoped records require relational integrity, constraints, indexes, and RLS. Business rules must hold even if frontend or route handlers fail.
- **Alternatives considered**: ORM-managed schema was rejected because the constitution requires PostgreSQL as the source of truth and direct control over RLS/functions. n8n direct DB mutation was rejected for business records.

### n8n Automation Boundary

- **Decision**: n8n is background-only: deadline scan notifications, reminder provider orchestration, import completion notifications, and report delivery notifications. n8n reports back through `/api/webhooks/n8n` with `X-N8N-Secret`.
- **Rationale**: This preserves n8n's automation value without making it the API gateway or source of truth.
- **Alternatives considered**: Frontend-to-n8n CRUD and direct n8n invoice updates were rejected as security and audit failures.

### Excel Import

- **Decision**: Phase 1 supports manual column mapping with browser preview using SheetJS/PapaParse and server-side validation before import confirmation. Phase 2 adds AI-assisted mapping suggestions.
- **Rationale**: Accountants have inconsistent Excel files, but autonomous import is too risky for financial records. Review-before-write satisfies audit and correctness requirements.
- **Alternatives considered**: Strict template-only import was rejected because it weakens onboarding value. AI auto-import was rejected because AI cannot mutate financial truth without confirmation.

### Reporting

- **Decision**: Generate monthly PDF reports server-side with `@react-pdf/renderer`, store in private Supabase Storage, return one-hour signed URLs, and audit report generation.
- **Rationale**: Reports are cabinet deliverables and must be reproducible, tenant-scoped, private, and auditable.
- **Alternatives considered**: Client-side PDF generation was rejected because it exposes too much data assembly in the browser and is harder to secure consistently.

### Internationalization

- **Decision**: Use next-intl v4 with French as default and Arabic RTL architecture from day one. Phase 1 pilot can ship French content first, but full feature acceptance requires Arabic critical workflows.
- **Rationale**: Morocco-first requires French and Arabic. The pilot can validate product value faster in French, while route/layout design must support RTL before UI hardens.
- **Alternatives considered**: French-only architecture was rejected because adding RTL later would be expensive.

### Caching and Freshness

- **Decision**: Treat dashboard read models as short-lived cached data (`staleTime: 30s` client-side, optional 60s server cache for cabinet KPI summary). Invoice status and reminder history remain uncached/fresh.
- **Rationale**: Accountants need responsive dashboards, but invoice status/reminder history are operationally sensitive.
- **Alternatives considered**: Full realtime was deferred until user validation proves it is needed.
