---
description: "Task list template for eFacturation feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include tests required by the feature specification and constitution.
Tenant isolation, authorization, pricing gates, audit logging, and financial
mutation behavior are not optional when affected.

**Organization**: Tasks are grouped by user story to enable independent
implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies).
- **[Story]**: Which user story this task belongs to (for example, US1).
- Include exact file paths in descriptions.

## Path Conventions

- **Next.js app**: `app/`, `components/`, `lib/`.
- **Supabase**: `supabase/migrations/`, `supabase/policies/`, `supabase/functions/`.
- **Tests**: `tests/unit/`, `tests/integration/`, `tests/rls/`, `tests/e2e/`.
- **Automation**: document n8n workflow contracts under `specs/[###-feature]/contracts/`.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project structure and configuration required by the feature.

- [ ] T001 Create or update feature directories per implementation plan.
- [ ] T002 Configure strict TypeScript/Zod types needed by the feature.
- [ ] T003 [P] Add feature flag definitions for paid-tier behavior if applicable.
- [ ] T004 [P] Add test fixtures for tenants, cabinets, roles, invoices, and entitlements.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data, security, and service boundaries that MUST be complete
before user story work.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T005 Create reversible Supabase migration(s) for affected schema.
- [ ] T006 Add indexes for tenant-scoped joins, foreign keys, and feature queries.
- [ ] T007 Implement or update RLS policies for every affected table.
- [ ] T008 Implement immutable audit log support for affected mutations.
- [ ] T009 Implement typed repository functions under `lib/repositories/`.
- [ ] T010 Implement typed service functions under `lib/services/`.
- [ ] T011 Ensure UI components cannot call Supabase directly for this feature.
- [ ] T012 Add server-side pricing/feature-gate enforcement if applicable.
- [ ] T013 Define n8n background workflow contract if automation is involved.

**Checkpoint**: Schema, RLS, service boundaries, audit logging, and pricing gates
are ready for user stories.

---

## Phase 3: User Story 1 - [Title] (Priority: P1) MVP

**Goal**: [Brief description of what this story delivers.]

**Independent Test**: [How to verify this story works on its own.]

### Tests for User Story 1

- [ ] T014 [P] [US1] Add RLS tenant-isolation test in `tests/rls/`.
- [ ] T015 [P] [US1] Add authorization/role test in `tests/integration/`.
- [ ] T016 [P] [US1] Add audit log test for affected mutations.
- [ ] T017 [P] [US1] Add pricing gate test if feature is paid-tier gated.
- [ ] T018 [P] [US1] Add UI/e2e test for the primary user journey.

### Implementation for User Story 1

- [ ] T019 [US1] Implement service/repository behavior for this story.
- [ ] T020 [US1] Implement UI using services/hooks without direct Supabase calls.
- [ ] T021 [US1] Add deterministic Law 69-21/payment-delay logic if relevant.
- [ ] T022 [US1] Add background automation trigger only if required and asynchronous.
- [ ] T023 [US1] Validate error handling and typed responses.

**Checkpoint**: User Story 1 is independently functional and passes security,
audit, and product-value tests.

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers.]

**Independent Test**: [How to verify this story works on its own.]

### Tests for User Story 2

- [ ] T024 [P] [US2] Add RLS tenant-isolation test in `tests/rls/`.
- [ ] T025 [P] [US2] Add authorization/role test in `tests/integration/`.
- [ ] T026 [P] [US2] Add audit/pricing/background job tests as applicable.

### Implementation for User Story 2

- [ ] T027 [US2] Implement service/repository behavior for this story.
- [ ] T028 [US2] Implement UI using services/hooks without direct Supabase calls.
- [ ] T029 [US2] Integrate with prior stories without weakening tenant isolation.

**Checkpoint**: User Stories 1 and 2 work independently.

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers.]

**Independent Test**: [How to verify this story works on its own.]

### Tests for User Story 3

- [ ] T030 [P] [US3] Add RLS tenant-isolation test in `tests/rls/`.
- [ ] T031 [P] [US3] Add authorization/role test in `tests/integration/`.
- [ ] T032 [P] [US3] Add audit/pricing/background job tests as applicable.

### Implementation for User Story 3

- [ ] T033 [US3] Implement service/repository behavior for this story.
- [ ] T034 [US3] Implement UI using services/hooks without direct Supabase calls.
- [ ] T035 [US3] Validate deterministic rules and assistive AI boundaries if relevant.

**Checkpoint**: All selected user stories are independently functional.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

- [ ] TXXX [P] Update documentation and quickstart validation.
- [ ] TXXX Run migration rollback validation.
- [ ] TXXX Run full tenant-isolation and authorization test suite.
- [ ] TXXX Run audit log integrity checks.
- [ ] TXXX Run typecheck, lint, and formatting checks.
- [ ] TXXX Capture screenshots for UI changes.
- [ ] TXXX Confirm no direct Supabase calls exist in UI components.
- [ ] TXXX Confirm n8n is not used as a synchronous backend API.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup and blocks all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion and may proceed
  independently if they do not touch the same files.
- **Polish**: Depends on all selected user stories.

### Within Each User Story

- Tests for RLS, authorization, audit logging, and pricing gates come before
  implementation when those concerns are affected.
- Schema and RLS before services.
- Services/repositories before UI.
- Background automation contract before n8n workflow implementation.
- Story complete before moving to the next priority unless parallel ownership is explicit.

### Parallel Opportunities

- Setup tasks marked [P] can run in parallel.
- Independent tests marked [P] can run in parallel.
- Different user stories can proceed in parallel after Foundational completion
  if write scopes do not conflict.

## Implementation Strategy

### MVP First

1. Complete Setup.
2. Complete Foundational schema/RLS/service/audit work.
3. Complete User Story 1.
4. Validate User Story 1 independently.
5. Deploy or demo only after tenant isolation and audit tests pass.

### Incremental Delivery

1. Foundation ready.
2. Add User Story 1, validate, demo.
3. Add User Story 2, validate, demo.
4. Add User Story 3, validate, demo.
5. Preserve tenant isolation and audit guarantees at every increment.

## Notes

- Do not keep sample tasks in generated `tasks.md`.
- Avoid vague tasks and tasks that bypass service/repository boundaries.
- Avoid n8n CRUD or authorization tasks.
- Avoid AI tasks that mutate financial records or determine compliance alone.
