# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]  
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See
`.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach.]

## Technical Context

**Language/Version**: TypeScript strict mode on Next.js [version or NEEDS CLARIFICATION]  
**Primary Dependencies**: Supabase, TanStack Query, Tailwind CSS, shadcn/ui, Zod [plus feature-specific dependencies]  
**Storage**: Supabase PostgreSQL as system of record; Supabase Storage for files if needed  
**Testing**: [unit/integration/e2e/RLS test framework or NEEDS CLARIFICATION]  
**Target Platform**: Web SaaS for Moroccan accounting firms and SMEs  
**Project Type**: Multi-tenant web application  
**Performance Goals**: [domain-specific target or NEEDS CLARIFICATION]  
**Constraints**: Tenant isolation, RLS, immutable audit logs, server-side pricing gates, n8n background-only  
**Scale/Scope**: [expected tenants, cabinets, invoices, reminders, or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **PostgreSQL Authority**: Supabase/PostgreSQL remains the system of record; no business-critical state is owned by n8n or the browser.
- **RLS and Tenant Scope**: All affected tables, queries, procedures, and jobs are tenant-scoped and protected by RLS.
- **Cabinet Access**: Cabinet/company access is delegated explicitly; company data ownership remains with the company tenant.
- **Service Boundary**: UI components do not call Supabase directly; data access flows through typed services/repositories.
- **Audit Coverage**: Every mutation creates an immutable audit log entry; reminder events are audit-grade when relevant.
- **n8n Boundary**: n8n is used only for asynchronous background automation and never for synchronous CRUD or authorization.
- **AI Boundary**: AI is assistive only and cannot modify financial records or calculate compliance without deterministic rules.
- **Pricing Gates**: Paid-tier behavior is enforced server-side or at the database boundary.
- **Migration Safety**: Schema changes are reversible or include a documented rollback path.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── (marketing)/
├── (auth)/
└── (dashboard)/

components/
├── ui/
└── features/

lib/
├── services/
├── repositories/
├── validation/
├── supabase/
└── feature-flags/

supabase/
├── migrations/
├── policies/
└── functions/

tests/
├── unit/
├── integration/
├── rls/
└── e2e/
```

**Structure Decision**: [Document the selected real directories and deviations.]

## Data Flow

[Describe the user action, service/repository call, Supabase/RLS interaction,
audit log write, optional background job trigger, and UI refresh/cache behavior.]

## Complexity Tracking

> Fill ONLY if Constitution Check has violations that must be justified.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [violation] | [reason] | [reason] |
