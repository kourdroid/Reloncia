<!--
SYNC IMPACT REPORT
- Version: 2.0.0 -> 1.0.0 (RESET: Smatch/PayloadCMS governance replaced by eFacturation SaaS governance)
- Modified Principles:
  - Replaced Smatch/PayloadCMS project principles with eFacturation multi-tenant SaaS principles.
  - Removed PayloadCMS collection/block, Lexical, Payload migration, and generated type rules.
  - Removed Smatch industrial design-token and Payload-specific component rules.
  - Added Supabase/PostgreSQL, RLS, cabinet tenancy, audit logging, product, AI, and validation rules.
- Added sections:
  - Architecture Principles
  - Security Principles
  - Code Quality Principles
  - Product Principles
  - Validation Principles
  - Governance
- Removed sections:
  - The 100-Step Prediction
  - The Sovereign Audit
  - Type Safety & Correctness as PayloadCMS-specific policy
  - Defensive Architecture & Security as PayloadCMS-specific policy
  - Industrial Luxury Design System
  - Component Architecture & Styling
  - PayloadCMS Collection & Block Architecture
  - Database & Supabase Operations as PayloadCMS operations
  - Internationalization as content-CMS policy
- Templates requiring updates:
  - ✅ .specify/templates/constitution-template.md
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/tasks-template.md
- Follow-up TODOs: None.
-->

# eFacturation Constitution

## Core Principles

### I. PostgreSQL Is the System of Record

Supabase/PostgreSQL MUST be the authoritative system of record for all business
data, authorization state, tenant boundaries, financial records, reminders, and
audit logs. Deterministic business rules MUST live in the database through Row
Level Security (RLS), stored procedures, constraints, and triggers where the rule
protects data integrity or authorization.

n8n MUST be used only for asynchronous background automation such as scheduled
reminders, import processing, notifications, and third-party integrations. n8n
MUST NOT act as a synchronous backend API for CRUD, authorization, pricing gates,
or tenant-scoped data access.

### II. Tenant Isolation Is Non-Negotiable

eFacturation is multi-tenant from day one. Every table containing tenant-owned
or tenant-visible data MUST include tenant-scoping or an equivalent secure access
path. Every query, mutation, stored procedure, background job, and report MUST be
scoped to the authorized tenant or cabinet relationship.

Cross-tenant data leakage is a release blocker. Any feature that cannot prove
tenant isolation through RLS policies and tests MUST NOT ship.

### III. Cabinet-Aware Multi-Tenancy

The product MUST support accounting firms ("cabinets") managing multiple company
tenants. A company tenant MAY exist without a cabinet. Cabinet access MUST be
modeled as an explicit relationship rather than ownership of the company data.

Cabinet members MAY have different roles per managed company. Authorization MUST
account for both cabinet membership and company-specific permissions. The role
hierarchy is:

```text
SuperAdmin > CabinetAdmin > CabinetMember > TenantAdmin > TenantUser > ReadOnly
```

### IV. Company Data Ownership

Invoice data belongs to the company tenant, not to the cabinet. If a cabinet
relationship is removed, the company MUST retain its invoice records, clients,
payment history, reminder history, files, and audit trail.

Cabinets receive delegated access only. Removing delegated access MUST revoke the
cabinet's visibility without deleting, moving, or mutating company-owned data.

### V. Database-Enforced Security

RLS MUST be enabled and enforced on every application table. Frontend checks,
API route checks, middleware, and UI visibility MUST NOT be the sole
authorization boundary.

Supabase Auth MUST manage sessions. Sensitive authorization state, roles,
tenant IDs, cabinet IDs, pricing entitlements, and access decisions MUST NOT be
stored in `localStorage`. Client-side state MAY cache non-sensitive display data,
but server-side and database checks remain authoritative.

### VI. Immutable Auditability

Every mutation MUST produce an `audit_log` entry containing actor, affected
tenant, action, target entity, timestamp, and relevant before/after context when
safe to store. Audit logs are immutable: application code MUST NOT update or
delete existing audit entries.

Reminder history is audit-grade evidence. A reminder is not merely an email; it
MUST be recorded as a follow-up event with timestamp, channel, recipient,
template or message reference, delivery status when available, and outcome when
known.

### VII. Strict TypeScript and Service Boundaries

TypeScript strict mode MUST be enabled. `any` is prohibited. Dynamic or external
data MUST use `unknown` plus validation or a typed parser. API responses and
database-facing results MUST be typed.

Every database-touching function MUST handle error cases explicitly. UI
components MUST NOT call Supabase directly. Data access MUST go through a
service/repository layer that centralizes validation, error handling, typed
responses, and feature-gate checks.

### VIII. Paid Features Are Server-Enforced

Feature flags and pricing gates MUST be enforced server-side or at the database
boundary. Client-side checks MAY improve UX but MUST NOT grant access. Paid-tier
features MUST fail closed when entitlement state is missing, expired, or
ambiguous.

### IX. Product Value Is Revenue Recovery

The core product value is reducing unpaid invoices and preventing future
financial loss. Every feature decision MUST answer whether it helps recover
money, prevent loss, improve accounts receivable visibility, document follow-up,
or support compliance readiness.

Generic invoicing convenience is secondary. Features that only create invoices
without improving collection, risk visibility, reminder quality, or reporting
MUST be deprioritized.

### X. Deterministic Compliance and Assistive AI

Law 69-21 payment-delay awareness is a first-class feature. Invoices approaching
or exceeding statutory or configured payment delays MUST be surfaced
proactively. Deadline calculations MUST be deterministic, traceable, and based
on stored invoice dates, payment terms, and applicable configuration.

AI features are assistive only. AI MUST NOT modify financial records, calculate
legal deadlines, determine compliance status, approve mutations, or produce
final compliance output without deterministic rules underneath. AI MAY assist
with import mapping, PDF/Excel extraction, reminder drafting, reply
classification, and account summaries when the result is reviewable.

### XI. Acceptance-Gated Delivery

No feature ships without acceptance criteria tied to a user story. Acceptance
criteria MUST include the relevant tenant/cabinet access behavior, audit logging
behavior, and paid-tier behavior when applicable.

Every schema migration MUST be reversible or have a documented rollback path.
Migrations that change financial or tenant-scoped data MUST include validation
queries or tests that prove no cross-tenant leakage or data loss.

## Technical Standards

- The recommended application stack is Next.js, TypeScript, Tailwind CSS,
  shadcn/ui, TanStack Query, Supabase Auth, Supabase PostgreSQL, Supabase
  Storage, Supabase Edge Functions, n8n for background jobs, and transactional
  email/WhatsApp providers as integrations.
- PostgreSQL constraints, indexes, RLS policies, and stored procedures are part
  of application correctness and MUST be reviewed as production code.
- Foreign keys used in tenant-scoped joins MUST have supporting indexes.
- Direct database manipulation outside migrations, controlled scripts, or
  audited administrative procedures is forbidden.
- Secrets MUST live in environment variables or managed secret stores. Secrets
  MUST NOT be committed, logged, or embedded in frontend bundles.

## Development Workflow

- Feature specifications MUST define prioritized user stories and measurable
  acceptance criteria.
- Implementation plans MUST pass the Constitution Check before coding begins and
  again after design changes.
- Task lists MUST include explicit work for schema/RLS, typed services,
  authorization tests, audit logging, and migration rollback where relevant.
- Changes touching tenant access, RLS, pricing gates, financial records, or
  audit logs require tests before release.
- Conventional commits SHOULD be used for traceability.

## Governance

This Constitution supersedes all conflicting project practices, prompts,
templates, and implementation preferences. Any architectural deviation requires
explicit written justification and must preserve tenant isolation, data
ownership, auditability, and deterministic financial correctness.

Amendment procedure:

1. Propose the change with rationale and affected templates.
2. Classify the version bump using SemVer:
   - MAJOR for governance resets, principle removals, or incompatible
     architectural redefinitions.
   - MINOR for new principles, new mandatory sections, or materially expanded
     guidance.
   - PATCH for wording, clarifications, typo fixes, and non-semantic changes.
3. Update dependent templates in the same change.
4. Include a Sync Impact Report at the top of the constitution.

All future specs, plans, tasks, AI-generated changes, and pull requests MUST be
reviewed for compliance with this Constitution.

**Version**: 1.0.0 | **Ratified**: 2026-05-18 | **Last Amended**: 2026-05-18
