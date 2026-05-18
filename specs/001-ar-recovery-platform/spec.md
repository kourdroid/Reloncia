# Feature Specification: eFacturation Accounts Receivable Recovery Platform

**Feature Branch**: `001-ar-recovery-platform`  
**Created**: 2026-05-18  
**Status**: Draft  
**Input**: User description: "Build eFacturation — a SaaS platform for Moroccan accounting firms to monitor and recover unpaid invoices across multiple client companies. Target users are cabinets, SMEs, and non-user end clients. Core workflows include cross-company risk summaries, company invoice aging views, reminder sending and logging, Excel import, Law 69-21 threshold alerts, and monthly PDF reports."

## Product Value Check *(mandatory)*

This feature directly supports unpaid invoice recovery by giving accounting firms
and SMEs a centralized view of unpaid exposure, overdue invoices, late-paying
clients, reminder history, and payment-delay risk. The product value is not
generic invoice creation; it is helping users identify which invoices need
action, prove follow-up history, reduce future loss, and prepare payment-delay
compliance reports.

## User Scenarios & Testing *(mandatory)*

User stories MUST be prioritized by business value and independently testable.
Each story MUST include acceptance criteria that cover tenant/cabinet access,
audit behavior, and paid-tier behavior when applicable.

### User Story 1 - Cabinet Cross-Company Risk Dashboard (Priority: P1)

As a cabinet user, I want to see unpaid invoice risk across all client companies
I am allowed to manage so I can decide where to act today.

**Why this priority**: This is the core cabinet value. It turns scattered Excel
files into one operational view of unpaid money, overdue risk, and urgent follow-up.

**Independent Test**: A cabinet user with delegated access to multiple companies
can log in and see total unpaid MAD, invoices overdue more than 30 days, invoices
approaching the 60-day payment-delay threshold, and the top 5 late-paying clients
only for companies they are allowed to manage.

**Acceptance Scenarios**:

1. **Given** a cabinet user has access to three companies with unpaid invoices, **When** the user opens the dashboard, **Then** the dashboard shows aggregate unpaid MAD, overdue >30 day count, legal-risk count, and top 5 late-paying clients across only those companies.
2. **Given** a cabinet user does not have access to a company, **When** that company has overdue invoices, **Then** those invoices do not appear in any aggregate, list, export, or top-client ranking for that user.
3. **Given** the dashboard is read-only, **When** a cabinet user views risk summaries, **Then** no mutation audit event is required and access is still tenant/cabinet scoped.
4. **Given** dashboard access is included in the MVP tier, **When** an authorized cabinet user opens the dashboard, **Then** access is allowed without a paid add-on gate.

---

### User Story 2 - Company Aging View (Priority: P2)

As a cabinet user or company admin, I want to drill into one company and see all
unpaid invoices grouped by aging bucket so I can focus follow-up on the most
urgent invoices.

**Why this priority**: Aging buckets expose collection priority and show whether
the company is moving toward payment-delay risk.

**Independent Test**: An authorized user can select a company and see unpaid
invoices grouped into 0-30 days, 30-60 days, and 60+ days, with totals in MAD and
visible status for each invoice.

**Acceptance Scenarios**:

1. **Given** a company has unpaid invoices in all aging buckets, **When** an authorized user opens the company view, **Then** invoices are grouped into 0-30 days, 30-60 days, and 60+ days with subtotals and total unpaid MAD.
2. **Given** an SME exists without a cabinet, **When** its TenantAdmin opens the company view, **Then** only that company's invoices are visible and the missing cabinet relationship does not block access.
3. **Given** a ReadOnly user opens the company view, **When** invoices are displayed, **Then** the user can view invoice status and aging but cannot perform mutations.

---

### User Story 3 - Reminder Sending and Follow-Up History (Priority: P3)

As an accountant, I want to select unpaid invoices and send reminders through
approved channels so every follow-up is documented with timestamp, channel, and
outcome.

**Why this priority**: Reminder history is proof of collection effort and is
critical for dispute resolution and operational accountability.

**Independent Test**: An authorized user can select unpaid invoices, send an
email or WhatsApp reminder, and see the reminder counter, last reminder date,
channel, recipient, and outcome recorded on the invoice history.

**Acceptance Scenarios**:

1. **Given** an authorized cabinet user selects unpaid invoices for a managed company, **When** the user sends reminders, **Then** each invoice receives a new reminder event with timestamp, channel, recipient, and pending/sent/failed outcome.
2. **Given** a reminder is sent successfully, **When** the invoice is reloaded, **Then** the reminder counter is incremented and the last reminder date matches the latest event.
3. **Given** a user lacks mutation rights for the company, **When** the user attempts to send reminders, **Then** the action is denied and no reminder event or counter change is created.
4. **Given** reminder sending changes invoice follow-up history, **When** the mutation succeeds, **Then** an immutable audit entry records the actor, company, invoices affected, channel, and timestamp.

---

### User Story 4 - Excel Invoice Import and Cleanup (Priority: P4)

As a company admin or authorized cabinet user, I want to import invoices from
Excel files with inconsistent column headers so invoice data becomes centralized,
validated, deduplicated, and linked to client records.

**Why this priority**: Existing invoice data lives in messy Excel files. The
platform cannot produce reliable risk views or reports until data is centralized.

**Independent Test**: A user uploads an Excel file with alternate header names,
reviews mapped columns, fixes validation errors, confirms import, and sees only
valid, non-duplicate invoices added to the selected company.

**Acceptance Scenarios**:

1. **Given** an Excel file contains inconsistent but recognizable headers, **When** the user uploads it, **Then** the system proposes column mappings for invoice number, client, amount, issue date, due date, status, and payment information.
2. **Given** imported rows include duplicate invoice numbers for the same company, **When** validation runs, **Then** duplicates are flagged and not imported unless the user explicitly resolves them.
3. **Given** imported rows reference existing client names or identifiers, **When** the user confirms import, **Then** invoices are linked to existing client records where possible and new client records require confirmation.
4. **Given** the import creates or updates records, **When** the import is confirmed, **Then** audit entries record the actor, company, file name, row counts, accepted rows, rejected rows, and created/updated entities.

---

### User Story 5 - Payment-Delay Risk Alerts (Priority: P5)

As an accountant or company admin, I want invoices approaching the 60-day
payment-delay threshold to be flagged automatically so I can act before the risk
becomes critical.

**Why this priority**: Morocco-first payment-delay awareness is a key
differentiator and supports compliance readiness.

**Independent Test**: An unpaid invoice whose legal threshold date is within 10
days is marked at legal risk and appears in dashboards and notifications for the
responsible authorized users.

**Acceptance Scenarios**:

1. **Given** an unpaid invoice is within 10 days of its 60-day legal threshold date, **When** risk evaluation runs, **Then** the invoice is flagged as at legal risk.
2. **Given** an invoice is paid before the threshold, **When** risk evaluation runs, **Then** the invoice is not flagged as at legal risk.
3. **Given** a legal-risk invoice belongs to a company managed by a cabinet, **When** notifications are generated, **Then** the responsible cabinet user and/or company admin receives the alert according to their access.
4. **Given** risk evaluation is deterministic, **When** the same invoice data is evaluated twice, **Then** the same legal-risk result is produced both times.

---

### User Story 6 - Monthly Company Report (Priority: P6)

As an accountant, I want to generate a monthly PDF report per company so I can
share unpaid totals, aging breakdown, reminder history, and risk clients with
the client company.

**Why this priority**: Reports create recurring cabinet value and provide a clear
artifact for client communication.

**Independent Test**: An authorized cabinet user can generate a monthly report
for one managed company containing unpaid total, aging breakdown, reminder
history, top risk clients, and legal-risk invoices.

**Acceptance Scenarios**:

1. **Given** a cabinet user has access to a company, **When** the user generates a monthly report, **Then** the report includes only that company's data for the selected month.
2. **Given** reminder events exist during the selected month, **When** the report is generated, **Then** reminder history includes date, channel, recipient, outcome, and linked invoice.
3. **Given** a user lacks access to the company, **When** the user attempts report generation, **Then** the request is denied and no report is produced.
4. **Given** report generation is a read/export action, **When** the report is generated, **Then** an audit entry records actor, company, month, generated report type, and timestamp.

---

### Edge Cases

- What happens when the actor has cabinet access but not access to this company?
  The action is denied and the company data is excluded from all lists,
  dashboards, reminders, imports, and reports.
- What happens when a company has no cabinet relationship?
  TenantAdmin and authorized TenantUser roles can still use company-scoped
  views, imports, reminders, and reports for their own company.
- What happens when a paid-tier entitlement is missing, expired, or ambiguous?
  MVP core access remains ungated; future paid-tier features fail closed and
  show a clear access message without exposing restricted data.
- What happens when the requested mutation must create an audit log but logging fails?
  The mutation fails as a whole, and the user receives a clear failure message.
- What happens when Law 69-21/payment-delay data is missing or inconsistent?
  The invoice is flagged as needing data correction and is excluded from legal
  risk calculations until required dates are corrected.
- What happens when an imported Excel file has no recognizable invoice number or amount column?
  The import cannot be confirmed until required columns are mapped.
- What happens when reminder delivery fails?
  The reminder event is retained with a failed outcome and does not falsely mark
  the reminder as delivered.
- What happens when an invoice is already paid?
  It is excluded from unpaid dashboards, reminder sending, and legal-risk alerts.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow a cabinet user to view a cross-company accounts receivable dashboard for companies where the cabinet has delegated access.
- **FR-002**: System MUST show total unpaid amount in MAD, overdue >30 day invoice count, invoices approaching the 60-day threshold, and top 5 late-paying clients.
- **FR-003**: System MUST allow an authorized user to view one company's unpaid invoices grouped by aging buckets: 0-30 days, 30-60 days, and 60+ days.
- **FR-004**: System MUST support SMEs that exist independently without a cabinet relationship.
- **FR-005**: System MUST support invoice statuses: Nouvelle, En cours, Payée, Litige, Clôturée, and Avoir.
- **FR-006**: System MUST automatically transition an unpaid invoice from Nouvelle to En cours 7 days after creation.
- **FR-007**: System MUST allow Litige only when the current invoice status is En cours.
- **FR-008**: System MUST allow Avoir generation only for a Clôturée invoice.
- **FR-009**: System MUST allow authorized users to send invoice reminders by email and WhatsApp where channel configuration exists.
- **FR-010**: System MUST record each reminder with timestamp, channel, recipient, delivery status or outcome, and linked invoice.
- **FR-011**: System MUST increment the invoice reminder counter on every reminder send attempt and track the latest reminder date.
- **FR-012**: System MUST import invoice data from Excel files with inconsistent column headers through a review-and-confirm mapping flow.
- **FR-013**: System MUST validate imported invoice rows before confirmation and identify missing required fields, invalid amounts, invalid dates, duplicate invoices, and unresolved client mappings.
- **FR-014**: System MUST deduplicate imported invoices per company using invoice number as the primary duplicate signal.
- **FR-015**: System MUST link imported invoices to existing client records where a confident match exists and require confirmation for new or ambiguous clients.
- **FR-016**: System MUST flag unpaid invoices as at legal risk when the legal threshold date is within 10 days or has passed.
- **FR-017**: System MUST notify responsible authorized users when invoices enter legal-risk status.
- **FR-018**: System MUST generate a monthly PDF report per company with unpaid totals, aging breakdown, reminder history, risk clients, and legal-risk invoices.
- **FR-019**: System MUST display amounts in MAD and display dates in dd/mm/yyyy while storing date values in an unambiguous standard format.
- **FR-020**: System MUST support Arabic and French user-facing content in the MVP; English is optional.
- **FR-021**: System MUST be desktop-primary and mobile-responsive for all core dashboard, invoice, reminder, import, and report workflows.
- **FR-022**: System MUST exclude end clients of SMEs from platform user access in the MVP.
- **FR-023**: System MUST log all mutations and report-generation events with actor, company, action, timestamp, and affected records.
- **FR-024**: System MUST prevent users from viewing, importing, mutating, reminding, or reporting on company data outside their authorized tenant/cabinet scope.

### Tenant, Cabinet, and Role Impact *(mandatory)*

- **Access Model**: SuperAdmin can administer the platform. CabinetAdmin can manage cabinet users and companies delegated to the cabinet. CabinetMember can act on delegated companies according to company-specific permissions. TenantAdmin can manage their own company. TenantUser can view and act on company data according to assigned permissions. ReadOnly can view permitted data but cannot mutate it.
- **Tenant Scope**: Invoice, client, reminder, import, report, and risk data are company-owned and visible only to authorized users for that company.
- **Cabinet Scope**: Cabinet access applies only through delegated company relationships. Cabinet users may see cross-company summaries only for companies delegated to their cabinet and allowed by their role.
- **Company Ownership**: Company-owned invoice data remains with the company if a cabinet relationship is removed; the cabinet loses visibility and action rights but does not own or delete the data.

### Security, RLS, and Audit Impact *(mandatory)*

- **RLS Requirements**: All company-owned entities require tenant-scoped access rules. Cabinet access must be derived from explicit delegated relationships. Read access and mutation access must be evaluated separately.
- **Mutation Audit Events**: Required for invoice import confirmation, invoice status changes, reminder sends, report generation, company access delegation changes, and notification preference changes.
- **Sensitive State**: Roles, tenant IDs, cabinet IDs, entitlements, and access decisions must not be stored in localStorage. User-facing sessions must not expose secrets.
- **Pricing Gate**: MVP workflows are ungated for the initial product. Future tier limits for WhatsApp reminders, monthly reports, company count, user count, or AI-assisted mapping must be enforced server-side or at the database boundary.

### Automation and AI Impact *(include if applicable)*

- **n8n Usage**: Background-only workflows may send scheduled reminders, delivery notifications, legal-risk alerts, and report delivery events. n8n must receive only authorized job payloads and must not act as a CRUD API or authorization layer.
- **AI Usage**: AI-assisted column mapping is allowed for messy Excel imports. AI suggestions must be reviewable before confirmation and must not create or mutate invoice records without user confirmation and deterministic validation.

### Key Entities *(include if feature involves data)*

- **Cabinet**: An accounting firm that may manage many company tenants through delegated access relationships.
- **Company Tenant**: An SME or client company that owns invoices, clients, reminders, imports, reports, and audit history. A company may exist independently without a cabinet.
- **User/Profile**: A platform user with one or more roles across a cabinet and/or company tenant.
- **Cabinet Company Access**: A delegated relationship granting cabinet users scoped access to a company with role-specific permissions.
- **Client**: The customer of a company tenant who receives invoices and may be ranked by late-payment behavior.
- **Invoice**: A company-owned financial record with invoice number, client, amount in MAD, issue date, due date, status, payment state, aging bucket, reminder count, and legal-risk state.
- **Reminder Event**: A recorded follow-up action tied to one or more invoices, with channel, timestamp, recipient, delivery status, and outcome.
- **Import Batch**: A reviewed Excel import session with file metadata, column mappings, row validation results, accepted rows, rejected rows, and user confirmation.
- **Monthly Report**: A generated company report for a month containing unpaid totals, aging breakdown, reminder history, risk clients, and legal-risk invoices.
- **Audit Log**: Immutable record of mutations and report-generation actions with actor, company, action, target, timestamp, and relevant context.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A cabinet user managing 50 companies can identify the top 5 companies requiring payment follow-up in under 2 minutes.
- **SC-002**: 100% of dashboard, invoice, import, reminder, and report views exclude data from companies the user is not authorized to access.
- **SC-003**: At least 95% of valid invoice rows in a standard or moderately inconsistent Excel file are imported after user review without manual re-entry.
- **SC-004**: 100% of reminder send attempts create a reminder history event with timestamp, channel, recipient, and outcome.
- **SC-005**: 100% of successful mutations create an audit log entry; if audit logging fails, the mutation does not complete.
- **SC-006**: Users can generate a monthly company report in under 60 seconds for a company with up to 1,000 invoices in the selected month.
- **SC-007**: 100% of unpaid invoices within 10 days of the legal threshold are surfaced in the legal-risk dashboard and responsible-user alerts.
- **SC-008**: Arabic and French users can complete the dashboard review, invoice import, reminder send, and report generation workflows without untranslated critical labels.

## Assumptions

- The legal threshold date is calculated deterministically from invoice dates and company/payment-term configuration. For the MVP, the default threshold is 60 days from invoice issue date unless a validated due date or payment-term configuration provides a stricter internal deadline.
- End clients of SMEs do not log in during the MVP; they only receive reminders outside the platform.
- Reminder delivery status may initially be pending, sent, failed, or manually updated when provider-level delivery confirmation is unavailable.
- Excel import supports assisted mapping and validation in MVP; fully autonomous import without review is out of scope.
- The first release focuses on operational awareness and follow-up documentation, not official legal advice or final compliance certification.
