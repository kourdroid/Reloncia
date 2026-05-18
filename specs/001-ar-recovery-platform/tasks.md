---
description: "Task list for eFacturation accounts receivable recovery platform"
---

# Tasks: eFacturation Accounts Receivable Recovery Platform

**Input**: Design documents from `/specs/001-ar-recovery-platform/`  
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Required for tenant isolation, RLS, role authorization, audit logging, invoice status transitions, import validation, report access, and n8n webhook validation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing after the shared foundation is complete.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and has no dependency on incomplete tasks.
- **[Story]**: Maps to a user story from [spec.md](./spec.md). Setup, foundational, and polish tasks do not use story labels.
- Every task includes an exact file path.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the Next.js/Supabase project shape, runtime, tooling, and shared conventions.

- [X] T001 Create the Next.js 16 App Router project structure in `app/`, `components/`, `src/`, `supabase/`, and `tests/`
- [X] T002 Configure Node 20.9+ and pnpm package metadata in `.nvmrc`, `package.json`, and `pnpm-lock.yaml`
- [X] T003 Configure strict TypeScript options in `tsconfig.json`
- [X] T004 Configure ESLint flat config and scripts in `eslint.config.mjs` and `package.json`
- [X] T005 Configure Prettier formatting in `.prettierrc`
- [X] T006 Configure Tailwind CSS v4 CSS-first theme in `app/globals.css`
- [X] T007 Install and register shadcn/ui base components in `components/ui/`
- [X] T008 Configure next-intl locale routing shell in `src/i18n/routing.ts`, `src/i18n/request.ts`, and `proxy.ts`
- [X] T009 Add French and Arabic message catalogs in `src/i18n/messages/fr.json` and `src/i18n/messages/ar.json`
- [X] T010 Configure Supabase browser/server clients in `src/supabase/client.ts`, `src/supabase/server.ts`, and `src/supabase/admin.ts`
- [X] T011 Add typed action result and domain error helpers in `src/types/action-result.ts` and `src/services/errors.ts`
- [X] T012 Add feature flag and entitlement scaffolding in `src/feature-flags/entitlements.ts`
- [X] T013 Add Vitest, Playwright, and RLS test configuration in `vitest.config.ts`, `playwright.config.ts`, and `tests/rls/README.md`
- [X] T014 [P] Add shared test fixtures for tenants, cabinets, roles, invoices, imports, reminders, and entitlements in `tests/fixtures/ar-recovery.ts`
- [X] T015 [P] Add environment variable documentation in `.env.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the database, security model, service/repository boundary, and audit guarantees required before any user story work.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T016 Create Supabase extensions migration in `supabase/migrations/001_extensions.sql`
- [X] T017 Create cabinets migration in `supabase/migrations/002_cabinets.sql`
- [X] T018 Create tenants migration in `supabase/migrations/003_tenants.sql`
- [X] T019 Create profiles migration linked to Supabase Auth in `supabase/migrations/004_profiles.sql`
- [X] T020 Create cabinet-company delegation migration in `supabase/migrations/005_cabinet_companies.sql`
- [X] T021 Create cabinet members migration in `supabase/migrations/006_cabinet_members.sql`
- [X] T022 Create tenant members migration in `supabase/migrations/007_tenant_members.sql`
- [X] T023 Create clients migration in `supabase/migrations/008_clients.sql`
- [X] T024 Create invoices migration with status, legal-risk, reminder tracking, and indexes in `supabase/migrations/009_invoices.sql`
- [X] T025 Create invoice lines migration in `supabase/migrations/010_invoice_lines.sql`
- [X] T026 Create reminders migration in `supabase/migrations/011_reminders.sql`
- [X] T027 Create reminder events migration in `supabase/migrations/012_reminder_events.sql`
- [X] T028 Create payments migration in `supabase/migrations/013_payments.sql`
- [X] T029 Create immutable audit logs migration in `supabase/migrations/014_audit_logs.sql`
- [X] T030 Create import jobs migration in `supabase/migrations/015_import_jobs.sql`
- [X] T031 Create import rows migration in `supabase/migrations/016_import_rows.sql`
- [X] T032 Create RLS policies for all application tables in `supabase/migrations/017_rls_policies.sql`
- [X] T033 Create database functions/triggers for access checks, audit logging, status transitions, reminder tracking, and legal-risk evaluation in `supabase/migrations/018_functions.sql`
- [X] T034 Create development seed data in `supabase/migrations/019_seed.sql`
- [X] T035 Add rollback notes for all migrations in `supabase/migrations/README.md`
- [X] T036 Add generated Supabase type placeholder and generation command notes in `src/types/supabase.ts` and `supabase/README.md`
- [X] T037 Implement role and membership repositories in `src/repositories/access.repository.ts`
- [X] T038 Implement audit log repository in `src/repositories/audit.repository.ts`
- [X] T039 Implement tenant/cabinet authorization service in `src/services/access.service.ts`
- [X] T040 Implement audit service with fail-closed behavior in `src/services/audit.service.ts`
- [X] T041 Implement Server Action auth/session helper in `src/actions/_shared/session.ts`
- [X] T042 Implement Zod validation schemas shared by actions in `src/validation/ar-recovery.ts`
- [X] T043 Add RLS tenant isolation tests for base memberships and delegated cabinet access in `tests/rls/access-policies.test.sql`
- [X] T044 Add audit immutability tests in `tests/rls/audit-logs.test.sql`
- [X] T045 Add invoice status transition tests in `tests/integration/invoice-status-transitions.test.ts`
- [X] T046 Add service-boundary lint rule or static check documentation in `tests/integration/no-ui-supabase-calls.test.ts`

**Checkpoint**: Schema, RLS, audit logging, status rules, typed service boundaries, and seed data are ready.

---

## Phase 3: User Story 1 - Cabinet Cross-Company Risk Dashboard (Priority: P1) MVP

**Goal**: Cabinet users see cross-company unpaid exposure and urgent follow-up priorities only for delegated companies.

**Independent Test**: A CabinetAdmin with access to three companies sees aggregate unpaid MAD, overdue >30 count, legal-risk count, and top 5 late-paying clients, while non-delegated company data is absent.

### Tests for User Story 1

- [X] T047 [P] [US1] Add RLS test for cabinet dashboard delegated company visibility in `tests/rls/cabinet-dashboard.test.sql`
- [X] T048 [P] [US1] Add service test for cross-company KPI calculations in `tests/unit/dashboard-summary.service.test.ts`
- [X] T049 [P] [US1] Add E2E test for CabinetAdmin dashboard visibility in `tests/e2e/cabinet-dashboard.spec.ts`

### Implementation for User Story 1

- [X] T050 [US1] Implement dashboard summary repository queries in `src/repositories/dashboard.repository.ts`
- [X] T051 [US1] Implement dashboard summary service with MAD totals and top late clients in `src/services/dashboard.service.ts`
- [X] T052 [US1] Implement TanStack Query hook for dashboard data in `src/services/hooks/use-dashboard-summary.ts`
- [X] T053 [US1] Implement dashboard KPI cards and charts in `components/features/dashboard/cabinet-risk-summary.tsx`
- [X] T054 [US1] Implement top late-paying clients table in `components/features/dashboard/top-late-clients-table.tsx`
- [X] T055 [US1] Implement cabinet dashboard page in `app/[locale]/dashboard/page.tsx`
- [X] T056 [US1] Add French and Arabic dashboard labels in `src/i18n/messages/fr.json` and `src/i18n/messages/ar.json`

**Checkpoint**: User Story 1 is independently functional and validates the core MVP dashboard.

---

## Phase 4: User Story 2 - Company Aging View (Priority: P2)

**Goal**: Authorized cabinet or tenant users drill into one company and view unpaid invoices grouped by aging buckets.

**Independent Test**: An authorized user sees only one company's unpaid invoices grouped into 0-30, 30-60, and 60+ day buckets with MAD subtotals.

### Tests for User Story 2

- [X] T057 [P] [US2] Add RLS test for tenant and delegated cabinet invoice list access in `tests/rls/company-invoices.test.sql`
- [X] T058 [P] [US2] Add service test for invoice aging bucket calculations in `tests/unit/invoice-aging.service.test.ts`
- [X] T059 [P] [US2] Add E2E test for company invoice aging view in `tests/e2e/company-aging.spec.ts`

### Implementation for User Story 2

- [X] T060 [US2] Implement invoice repository list and aging queries in `src/repositories/invoice.repository.ts`
- [X] T061 [US2] Implement invoice aging service in `src/services/invoice-aging.service.ts`
- [X] T062 [US2] Implement invoice list query hook with staleTime 0 in `src/services/hooks/use-company-invoices.ts`
- [X] T063 [US2] Implement invoice aging summary component in `components/features/invoices/invoice-aging-summary.tsx`
- [X] T064 [US2] Implement invoice data grid using shadcn/ui Table and TanStack Table in `components/features/invoices/invoice-table.tsx`
- [X] T065 [US2] Implement company invoice page in `app/[locale]/dashboard/[companyId]/page.tsx`
- [X] T066 [US2] Add French and Arabic invoice aging labels in `src/i18n/messages/fr.json` and `src/i18n/messages/ar.json`

**Checkpoint**: User Stories 1 and 2 work independently without cross-tenant leakage.

---

## Phase 5: User Story 3 - Reminder Sending and Follow-Up History (Priority: P3)

**Goal**: Authorized users send reminders and preserve audit-grade follow-up events with channel, recipient, timestamp, and outcome.

**Independent Test**: A user sends an email reminder for unpaid invoices and sees reminder events, updated reminder count, latest reminder date, and audit logs.

### Tests for User Story 3

- [X] T067 [P] [US3] Add RLS test for reminder and reminder event access in `tests/rls/reminder-events.test.sql`
- [X] T068 [P] [US3] Add Server Action test for reminder authorization and audit logging in `tests/integration/send-reminder.action.test.ts`
- [X] T069 [P] [US3] Add n8n webhook contract test for reminder_sent events in `tests/integration/n8n-reminder-webhook.test.ts`
- [X] T070 [P] [US3] Add E2E test for selecting invoices and sending reminders in `tests/e2e/send-reminder.spec.ts`

### Implementation for User Story 3

- [X] T071 [US3] Implement reminder repositories in `src/repositories/reminder.repository.ts`
- [X] T072 [US3] Implement reminder sending service with Resend provider boundary in `src/services/reminder.service.ts`
- [X] T073 [US3] Implement sendReminder Server Action in `src/actions/send-reminder.ts`
- [X] T074 [US3] Implement n8n webhook route for reminder_sent callbacks in `app/api/webhooks/n8n/route.ts`
- [X] T075 [US3] Implement reminder selection toolbar in `components/features/reminders/reminder-action-toolbar.tsx`
- [X] T076 [US3] Implement reminder history table in `components/features/reminders/reminder-history-table.tsx`
- [X] T077 [US3] Implement reminder history page in `app/[locale]/dashboard/[companyId]/reminders/page.tsx`
- [X] T078 [US3] Add French and Arabic reminder labels/templates in `src/i18n/messages/fr.json` and `src/i18n/messages/ar.json`
- [X] T079 [US3] Document n8n reminder workflow setup in `specs/001-ar-recovery-platform/contracts/n8n-webhooks.md`

**Checkpoint**: Reminder sending is auditable, tenant-scoped, and not dependent on n8n as a CRUD backend.

---

## Phase 6: User Story 4 - Excel Invoice Import and Cleanup (Priority: P4)

**Goal**: Authorized users import messy Excel/CSV invoice files through mapping, validation, deduplication, review, and confirmation.

**Independent Test**: A user uploads a file, maps columns, sees validation results, resolves duplicates, confirms valid rows, and receives imported invoices with audit logs.

### Tests for User Story 4

- [X] T080 [P] [US4] Add RLS test for import job and import row tenant access in `tests/rls/import-jobs.test.sql`
- [X] T081 [P] [US4] Add parser test for inconsistent Excel and CSV headers in `tests/unit/import-parser.service.test.ts`
- [X] T082 [P] [US4] Add import confirmation integration test in `tests/integration/confirm-import.action.test.ts`
- [X] T083 [P] [US4] Add E2E test for import mapping and confirmation flow in `tests/e2e/import-invoices.spec.ts`

### Implementation for User Story 4

- [X] T084 [US4] Implement import repositories in `src/repositories/import.repository.ts`
- [X] T085 [US4] Implement Excel/CSV parser and column mapping service in `src/services/import-parser.service.ts`
- [X] T086 [US4] Implement import validation and deduplication service in `src/services/import-validation.service.ts`
- [X] T087 [US4] Implement createImportJob, saveImportMapping, and confirmImportRows Server Actions in `src/actions/import-invoices.ts`
- [X] T088 [US4] Implement import upload component in `components/features/imports/import-upload.tsx`
- [X] T089 [US4] Implement column mapping UI in `components/features/imports/column-mapping-table.tsx`
- [X] T090 [US4] Implement import review grid in `components/features/imports/import-review-table.tsx`
- [X] T091 [US4] Implement import page in `app/[locale]/dashboard/[companyId]/imports/page.tsx`
- [X] T092 [US4] Add private imports bucket policy notes in `supabase/policies/storage-imports.sql`
- [X] T093 [US4] Add French and Arabic import labels in `src/i18n/messages/fr.json` and `src/i18n/messages/ar.json`

**Checkpoint**: Import flow centralizes invoice data without autonomous AI writes or silent duplicate skips.

---

## Phase 7: User Story 5 - Payment-Delay Risk Alerts (Priority: P5)

**Goal**: The system flags unpaid invoices approaching the 60-day payment-delay threshold and notifies responsible users.

**Independent Test**: An unpaid invoice within 10 days of its threshold appears as legal-risk in dashboards and produces a responsible-user alert.

### Tests for User Story 5

- [X] T094 [P] [US5] Add SQL test for deterministic Law 69-21 legal-risk evaluation in `tests/rls/law-69-21-risk.test.sql`
- [X] T095 [P] [US5] Add service test for responsible-user alert targeting in `tests/unit/deadline-alert.service.test.ts`
- [X] T096 [P] [US5] Add n8n deadline_alert webhook contract test in `tests/integration/n8n-deadline-alert-webhook.test.ts`
- [X] T097 [P] [US5] Add E2E test for legal-risk dashboard indicators in `tests/e2e/legal-risk-alerts.spec.ts`

### Implementation for User Story 5

- [X] T098 [US5] Implement legal-risk database helper and scheduled escalation function in `supabase/functions/law_69_21_risk.sql`
- [X] T099 [US5] Implement deadline alert repository in `src/repositories/deadline-alert.repository.ts`
- [X] T100 [US5] Implement deadline alert service in `src/services/deadline-alert.service.ts`
- [X] T101 [US5] Extend n8n webhook route for deadline_alert events in `app/api/webhooks/n8n/route.ts`
- [X] T102 [US5] Implement legal-risk badges and alert panel in `components/features/dashboard/legal-risk-alerts.tsx`
- [X] T103 [US5] Implement legal-risk query integration in `src/services/hooks/use-dashboard-summary.ts`
- [X] T104 [US5] Document daily_deadline_scan and invoice_status_escalation workflows in `specs/001-ar-recovery-platform/contracts/n8n-webhooks.md`
- [X] T105 [US5] Add French and Arabic legal-risk labels in `src/i18n/messages/fr.json` and `src/i18n/messages/ar.json`

**Checkpoint**: Legal-risk signals are deterministic, visible, and routed through audited/background-safe paths.

---

## Phase 8: User Story 6 - Monthly Company Report (Priority: P6)

**Goal**: Authorized users generate a private monthly PDF report per company with unpaid totals, aging, reminders, risk clients, and legal-risk invoices.

**Independent Test**: A cabinet user generates a monthly report for a delegated company, receives a one-hour signed URL, and an audit log records the export.

### Tests for User Story 6

- [X] T106 [P] [US6] Add report authorization integration test in `tests/integration/generate-report.route.test.ts`
- [X] T107 [P] [US6] Add report content unit test in `tests/unit/monthly-report.service.test.ts`
- [X] T108 [P] [US6] Add E2E test for monthly report generation in `tests/e2e/monthly-report.spec.ts`
- [X] T109 [P] [US6] Add storage signed URL access test in `tests/integration/report-storage.test.ts`

### Implementation for User Story 6

- [X] T110 [US6] Implement report repository queries in `src/repositories/report.repository.ts`
- [X] T111 [US6] Implement monthly report aggregation service in `src/services/monthly-report.service.ts`
- [X] T112 [US6] Implement React PDF document component in `components/features/reports/monthly-report-document.tsx`
- [X] T113 [US6] Implement report generation route handler in `app/api/export/[companyId]/route.ts`
- [X] T114 [US6] Implement report generation UI in `components/features/reports/report-generator.tsx`
- [X] T115 [US6] Implement reports page in `app/[locale]/dashboard/[companyId]/reports/page.tsx`
- [X] T116 [US6] Add private reports bucket policy notes in `supabase/policies/storage-reports.sql`
- [X] T117 [US6] Add French and Arabic report labels in `src/i18n/messages/fr.json` and `src/i18n/messages/ar.json`

**Checkpoint**: Reports are tenant-scoped, private, auditable, and usable by the cabinet.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Validate the full product slice, documentation, rollback safety, localization, and constitutional constraints.

- [X] T118 [P] Validate quickstart smoke test and update `specs/001-ar-recovery-platform/quickstart.md`
- [X] T119 Run all migration rollback validations and record results in `supabase/migrations/README.md`
- [X] T120 Run full tenant-isolation and authorization test suite in `tests/rls/`
- [X] T121 Run full integration test suite in `tests/integration/`
- [X] T122 Run full Playwright suite in `tests/e2e/`
- [X] T123 Run typecheck, lint, and formatting checks through `package.json`
- [X] T124 Verify no direct Supabase client calls exist outside `src/services/`, `src/repositories/`, `src/actions/`, `src/supabase/`, and `app/api/` using `tests/integration/no-ui-supabase-calls.test.ts`
- [X] T125 Verify no role, tenant, cabinet, entitlement, or session state is persisted in localStorage using `tests/e2e/no-sensitive-localstorage.spec.ts`
- [X] T126 Verify n8n is not used as a synchronous CRUD backend using `tests/integration/no-n8n-crud.test.ts`
- [X] T127 Capture desktop and mobile screenshots for dashboard, invoice list, import flow, reminders, legal-risk alerts, and reports in `tests/e2e/screenshots/`
- [X] T128 Complete Arabic RTL review for all critical workflows in `src/i18n/messages/ar.json`
- [X] T129 Complete French copy review for all critical workflows in `src/i18n/messages/fr.json`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup and blocks all user stories.
- **US1 Cabinet Dashboard (Phase 3)**: Depends on Foundational.
- **US2 Company Aging View (Phase 4)**: Depends on Foundational; can run after or alongside US1 once shared dashboard layout is stable.
- **US3 Reminder Sending (Phase 5)**: Depends on Foundational and benefits from US2 invoice table selection.
- **US4 Excel Import (Phase 6)**: Depends on Foundational; can run in parallel with US3 after invoice repository shape is stable.
- **US5 Legal-Risk Alerts (Phase 7)**: Depends on Foundational and integrates with US1 dashboard.
- **US6 Monthly Reports (Phase 8)**: Depends on US1, US2, US3, and US5 data outputs.
- **Polish (Phase 9)**: Depends on all selected user stories.

### User Story Dependencies

- **US1**: Independent MVP slice after Foundational.
- **US2**: Independent company slice after Foundational.
- **US3**: Requires invoice selection data from US2 for best UX, but reminder service can be implemented independently.
- **US4**: Independent import slice after Foundational.
- **US5**: Independent deterministic risk slice after Foundational, then surfaced in US1.
- **US6**: Aggregates results from invoices, reminders, legal-risk flags, and clients; implement after US1/US2/US3/US5.

### Within Each User Story

- Tests before implementation for RLS, authorization, audit, and financial mutation behavior.
- Repositories before services.
- Services and Server Actions before UI.
- Route/webhook contracts before provider/n8n workflow implementation.
- Localization labels added in the same story phase as UI.

## Parallel Opportunities

- T014 and T015 can run in parallel after T001.
- Migration files T017-T031 can be drafted in parallel after T016 if table dependencies are respected during final ordering.
- RLS tests T043-T044 can run in parallel with service helpers T037-T042 after migrations exist.
- US1 tests T047-T049 can run in parallel.
- US2 tests T057-T059 can run in parallel.
- US3 tests T067-T070 can run in parallel.
- US4 tests T080-T083 can run in parallel.
- US5 tests T094-T097 can run in parallel.
- US6 tests T106-T109 can run in parallel.
- Polish checks T120-T129 can run in parallel after all implemented features are merged.

## Parallel Example: US1 Cabinet Dashboard

```text
Task T047: Add RLS test for cabinet dashboard delegated company visibility in tests/rls/cabinet-dashboard.test.sql
Task T048: Add service test for cross-company KPI calculations in tests/unit/dashboard-summary.service.test.ts
Task T049: Add E2E test for CabinetAdmin dashboard visibility in tests/e2e/cabinet-dashboard.spec.ts
```

## Parallel Example: US4 Excel Import

```text
Task T080: Add RLS test for import job and import row tenant access in tests/rls/import-jobs.test.sql
Task T081: Add parser test for inconsistent Excel and CSV headers in tests/unit/import-parser.service.test.ts
Task T082: Add import confirmation integration test in tests/integration/confirm-import.action.test.ts
Task T083: Add E2E test for import mapping and confirmation flow in tests/e2e/import-invoices.spec.ts
```

## Implementation Strategy

### MVP First

1. Complete Setup.
2. Complete Foundational schema/RLS/service/audit work.
3. Complete US1 Cabinet Cross-Company Risk Dashboard.
4. Validate US1 independently with one seeded cabinet and three companies.
5. Demo only after tenant isolation and role tests pass.

### Incremental Delivery

1. Add US2 Company Aging View to make company drill-down useful.
2. Add US3 Reminder Sending to create recovery action and proof.
3. Add US4 Excel Import to onboard real client data.
4. Add US5 Legal-Risk Alerts to surface Law 69-21 awareness.
5. Add US6 Monthly Reports to create recurring cabinet deliverables.
6. Complete Polish and full acceptance validation.

## Notes

- n8n must remain background-only; direct n8n CRUD/status mutation is forbidden.
- AI-assisted mapping is Phase 2 and not included in these Phase 1 implementation tasks.
- WhatsApp provider integration can be scaffolded, but email via Resend is the Phase 1 operational reminder channel.
- French must be complete for the first pilot; Arabic/RTL must be complete before full feature acceptance.
