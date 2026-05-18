# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`  
**Created**: [DATE]  
**Status**: Draft  
**Input**: User description: "$ARGUMENTS"

## Product Value Check *(mandatory)*

State how this feature helps recover unpaid money, prevent financial loss,
improve accounts receivable visibility, document follow-up, or support
payment-delay compliance readiness. If none apply, explain why this work should
still be prioritized.

## User Scenarios & Testing *(mandatory)*

User stories MUST be prioritized by business value and independently testable.
Each story MUST include acceptance criteria that cover tenant/cabinet access,
audit behavior, and paid-tier behavior when applicable.

### User Story 1 - [Brief Title] (Priority: P1)

[Describe this user journey in plain language.]

**Why this priority**: [Explain the money recovery, loss prevention, compliance,
or operational value.]

**Independent Test**: [Describe how this can be tested independently and what
value it delivers.]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 2 - [Brief Title] (Priority: P2)

[Describe this user journey in plain language.]

**Why this priority**: [Explain the value and priority.]

**Independent Test**: [Describe how this can be tested independently.]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this user journey in plain language.]

**Why this priority**: [Explain the value and priority.]

**Independent Test**: [Describe how this can be tested independently.]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority.]

### Edge Cases

- What happens when the actor has cabinet access but not access to this company?
- What happens when a company has no cabinet relationship?
- What happens when a paid-tier entitlement is missing, expired, or ambiguous?
- What happens when the requested mutation must create an audit log but logging fails?
- What happens when Law 69-21/payment-delay data is missing or inconsistent?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST [specific capability].
- **FR-002**: System MUST [specific capability].
- **FR-003**: Users MUST be able to [key interaction].
- **FR-004**: System MUST persist [data requirement].
- **FR-005**: System MUST log [audit/security event].

### Tenant, Cabinet, and Role Impact *(mandatory)*

- **Access Model**: [Which roles can use this feature:
  SuperAdmin, CabinetAdmin, CabinetMember, TenantAdmin, TenantUser, ReadOnly.]
- **Tenant Scope**: [Which tenant-owned records are visible or mutable.]
- **Cabinet Scope**: [Whether delegated cabinet access applies and how.]
- **Company Ownership**: [Confirm company-owned data remains with the company.]

### Security, RLS, and Audit Impact *(mandatory)*

- **RLS Requirements**: [Tables/policies affected or "No RLS impact".]
- **Mutation Audit Events**: [Audit entries required or "Read-only feature".]
- **Sensitive State**: [Confirm no roles, tenant IDs, entitlements, or secrets are
  stored in localStorage.]
- **Pricing Gate**: [Feature tier and server-side enforcement point, or "Ungated".]

### Automation and AI Impact *(include if applicable)*

- **n8n Usage**: [Background-only workflow, trigger, and authorized data scope, or
  "None".]
- **AI Usage**: [Assistive use only, human review path, and deterministic rule
  underneath, or "None".]

### Key Entities *(include if feature involves data)*

- **[Entity 1]**: [What it represents, key attributes, ownership, relationships.]
- **[Entity 2]**: [What it represents, key attributes, ownership, relationships.]

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: [Measurable user/business outcome.]
- **SC-002**: [Measurable security or tenant-isolation outcome.]
- **SC-003**: [Measurable workflow or performance outcome.]
- **SC-004**: [Measurable product value outcome.]
