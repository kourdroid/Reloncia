# [PROJECT_NAME] Constitution

## Core Principles

### I. PostgreSQL Is the System of Record

Supabase/PostgreSQL MUST be the authoritative system of record for business
data, authorization state, tenant boundaries, financial records, reminders, and
audit logs. Deterministic business rules that protect integrity or authorization
MUST live in database constraints, RLS policies, stored procedures, or triggers.
n8n MUST be limited to asynchronous background automation and MUST NOT act as a
synchronous backend API.

### II. Tenant Isolation Is Non-Negotiable

The platform MUST be multi-tenant from day one. Every table, query, mutation,
stored procedure, background job, and report that touches tenant-owned data MUST
be scoped to the authorized tenant or delegated cabinet relationship.
Cross-tenant data leakage is a release blocker.

### III. Cabinet-Aware Multi-Tenancy

The platform MUST support accounting firms ("cabinets") managing multiple
company tenants. A company MAY exist without a cabinet. Cabinet access MUST be
delegated through explicit relationships. Company data belongs to the company
tenant, not the cabinet.

### IV. Database-Enforced Security and Auditability

RLS MUST be enabled on every application table. Frontend, API, and middleware
checks MUST NOT be the sole authorization boundary. Supabase Auth MUST manage
sessions. Sensitive authorization state MUST NOT be stored in `localStorage`.
Every mutation MUST write an immutable audit log entry.

### V. Strict TypeScript and Service Boundaries

TypeScript strict mode MUST be enabled. `any` is prohibited. Database-touching
functions MUST handle error cases explicitly. UI components MUST NOT call
Supabase directly; all data access MUST go through typed service/repository
boundaries.

### VI. Revenue Recovery Product Focus

The core value proposition is reducing unpaid invoices and preventing financial
loss. Features MUST support money recovery, loss prevention, accounts receivable
visibility, documented follow-up, or compliance readiness. Law 69-21 awareness
MUST be deterministic. AI MAY assist users but MUST NOT modify financial truth
or calculate compliance without deterministic rules underneath.

### VII. Acceptance-Gated Delivery

No feature ships without acceptance criteria tied to a user story. Schema
migrations MUST be reversible or have a documented rollback path. Pricing and
feature gates MUST be enforced server-side or at the database boundary.

## Technical Standards

- Recommended stack: Next.js, TypeScript, Tailwind CSS, shadcn/ui, TanStack
  Query, Supabase Auth, Supabase PostgreSQL, Supabase Storage, Supabase Edge
  Functions, and n8n for background jobs.
- PostgreSQL constraints, indexes, RLS policies, and stored procedures are
  production code and MUST be reviewed.
- Secrets MUST live in environment variables or managed secret stores.

## Development Workflow

- Specs MUST define prioritized user stories and measurable acceptance criteria.
- Plans MUST pass the Constitution Check before coding and after design changes.
- Tasks MUST include schema/RLS, typed services, authorization tests, audit
  logging, feature gates, and rollback work where relevant.

## Governance

This Constitution supersedes conflicting project practices and implementation
preferences. Amendments require rationale, SemVer classification, dependent
template updates, and a Sync Impact Report.

**Version**: [CONSTITUTION_VERSION] | **Ratified**: [RATIFICATION_DATE] | **Last Amended**: [LAST_AMENDED_DATE]
