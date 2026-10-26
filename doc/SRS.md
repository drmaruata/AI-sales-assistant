# Software Requirements Specification (SRS)

## 1. Purpose and scope

This SRS defines the MVP software requirements for an Android-first AI Sales Assistant. Requirements are normative unless marked as a post-MVP item.

## 2. System context

The mobile client communicates with Supabase Auth and a tenant-isolated Postgres database. Sensitive operations and AI provider calls run through trusted server-side functions. The client must not contain privileged database keys or AI provider secrets.

## 3. User roles

- **Unauthenticated visitor:** can sign in, sign up, reset password, and read public legal/help pages.
- **Workspace owner:** manages workspace profile, leads, business context, and account-level settings.
- **Workspace member:** post-MVP; can access explicitly permitted workspace data.
- **Platform operator:** operational access only through tightly controlled administrative tooling; not a normal in-app role.

MVP may implement only owner access, but schema and policies must not rely on a client-supplied workspace ID as proof of authorization.

## 4. Functional requirements

### Authentication and workspace
- FR-AUTH-001: The system shall support secure sign-up, sign-in, sign-out, and password recovery using the configured Supabase Auth methods.
- FR-AUTH-002: The system shall create or join a workspace through a trusted operation.
- FR-AUTH-003: The system shall reject requests for workspace resources when the authenticated user lacks membership.
- FR-AUTH-004: The system shall provide a user-facing session-expiry and re-authentication path.
- FR-AUTH-005: The system shall allow the user to request account deletion and explain any lawful retention exceptions.

### Leads
- FR-LEAD-001: The user shall create a lead with at least a display name or business name.
- FR-LEAD-002: The user shall edit, view, archive, and restore leads where permitted.
- FR-LEAD-003: The system shall support pipeline stages New, Contacted, Qualified, Won, and Lost.
- FR-LEAD-004: The user shall search leads by name and filter by stage, source, and follow-up state.
- FR-LEAD-005: The system shall validate field lengths and normalize optional contact details.
- FR-LEAD-006: The system shall prevent hard deletion from ordinary UI where audit or timeline retention is required; use archive and a documented deletion workflow.
- FR-LEAD-007: Lead lists shall be paginated and must not load the entire tenant dataset at once.

### Notes and activity
- FR-ACT-001: A user shall add a dated note or interaction to a lead.
- FR-ACT-002: The system shall display the lead timeline in chronological order.
- FR-ACT-003: The system shall record key state changes such as stage changes and follow-up changes.
- FR-ACT-004: The system shall not permit a user to alter another tenant's activity history.

### Follow-ups and notifications
- FR-FUP-001: A user shall set, edit, complete, or cancel a follow-up.
- FR-FUP-002: The dashboard shall show overdue and due-today follow-ups.
- FR-FUP-003: The app shall request notification permission contextually and respect denial.
- FR-FUP-004: The system shall handle device timezone changes and store scheduled timestamps in UTC with the intended timezone where needed.
- FR-FUP-005: The system shall not claim a push notification was delivered when delivery cannot be confirmed.
- FR-FUP-006: Rescheduling or completing a follow-up shall cancel or update related scheduled notifications where supported.

### Business profile
- FR-BIZ-001: The owner shall manage business name, description, services/products, contact details, preferred tone, and approved FAQs.
- FR-BIZ-002: The app shall explain that business profile content may be used to generate AI drafts.
- FR-BIZ-003: The user shall be able to correct or remove outdated business facts.

### AI drafting
- FR-AI-001: The user shall choose a lead and draft purpose before requesting an AI reply.
- FR-AI-002: AI generation shall occur on a trusted server-side component.
- FR-AI-003: The server shall authorize the user against the lead and workspace before generation.
- FR-AI-004: The server shall apply rate limits, maximum input sizes, output limits, and usage accounting.
- FR-AI-005: AI output shall be stored as a draft only if the user/workspace settings and privacy notice permit it.
- FR-AI-006: AI output shall be clearly marked as generated and shall not be sent externally by the MVP.
- FR-AI-007: The system shall not intentionally invent business facts; the prompt shall require uncertainty to be stated or omitted.
- FR-AI-008: Provider errors, timeouts, rate limits, and malformed output shall return safe user-facing errors without leaking secrets.
- FR-AI-009: The system shall support an adapter interface so the AI provider can be changed without changing the client contract.
- FR-AI-010: The system shall not send unnecessary contact data to the AI provider. Use only the fields needed for the draft.
- FR-AI-011: User-provided lead notes shall be treated as untrusted data, not as instructions that can override system policy.

### Dashboard and reporting
- FR-DASH-001: The dashboard shall show counts for open leads, overdue follow-ups, due today, and leads by stage.
- FR-DASH-002: Dashboard counts shall be derived from authorized workspace data.
- FR-DASH-003: Empty states shall provide an action to add a lead or configure the business profile.
- FR-DASH-004: The app shall clearly distinguish no data from a loading or error state.

### Data portability and settings
- FR-DATA-001: The user shall be able to export workspace leads and associated user-owned data in a documented format, subject to role authorization.
- FR-DATA-002: The system shall provide a documented deletion process for user and workspace data.
- FR-DATA-003: Settings shall expose notification preferences and AI usage where implemented.
- FR-DATA-004: Sensitive operations shall be logged without unnecessarily duplicating personal data into logs.

## 5. Non-functional requirements

- NFR-PERF-001: Common cached/local screen transitions should feel responsive; establish measurable performance budgets during implementation.
- NFR-PERF-002: Lead lists shall use pagination and database indexes for common filters.
- NFR-AVAIL-001: Use managed services with documented service status and backups; publish support expectations rather than promising unverified uptime.
- NFR-SEC-001: Enforce row-level authorization in the database for all tenant-owned tables.
- NFR-SEC-002: Privileged secrets must be stored server-side and never shipped in mobile bundles.
- NFR-SEC-003: All network traffic must use TLS.
- NFR-SEC-004: Validate input at client and server boundaries; server validation is authoritative.
- NFR-SEC-005: Apply least privilege to service roles and deployment credentials.
- NFR-PRIV-001: Collect only data needed for product operation.
- NFR-PRIV-002: Document AI-provider data processing, retention, and opt-out implications.
- NFR-REL-001: Handle offline/network errors without losing unsaved user input where feasible.
- NFR-REL-002: Mutating operations should be safe against accidental duplicate submissions.
- NFR-ACCESS-001: Support scalable text, screen-reader labels, adequate contrast, and non-color-only status indicators.
- NFR-MAINT-001: Use TypeScript strict mode, linting, formatting, and automated tests.
- NFR-OBS-001: Capture errors and latency with secrets and sensitive payloads redacted.
- NFR-PORT-001: Keep business logic separate from UI components to support future web clients.

## 6. Data validation rules

- Display name: 1–120 characters.
- Company name: optional, up to 160 characters.
- Phone/email: optional; at least one contact field is recommended but not required.
- Lead notes: up to 5,000 characters per entry.
- Business description: up to 4,000 characters.
- AI context: bounded server-side; do not concatenate unlimited history.
- AI draft: bounded to a configurable token/output limit.
- Pipeline stage: enum or constrained value; reject unknown values.
- Timestamps: store UTC; display in user/workspace timezone.

All limits must be implemented in shared validation schemas and database constraints where appropriate.

## 7. Error handling

Return stable machine-readable error codes, safe messages, and a correlation/request ID. Never expose SQL, stack traces, provider secrets, raw prompts, or sensitive payloads to end users.

Suggested codes: `AUTH_REQUIRED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, `RATE_LIMITED`, `AI_PROVIDER_UNAVAILABLE`, `AI_OUTPUT_INVALID`, `CONFLICT`, `INTERNAL_ERROR`.

## 8. Acceptance criteria

- AC-001: User A cannot read, update, export, or delete User B's workspace data by changing a request ID.
- AC-002: A lead can be created, edited, searched, moved through stages, and archived.
- AC-003: A follow-up due today appears in the correct dashboard queue.
- AC-004: Notification denial does not block core lead management.
- AC-005: AI drafts use approved business facts and selected lead context; the user must review/copy manually.
- AC-006: AI provider failure produces a safe retry path and no duplicate saved draft unless explicitly requested.
- AC-007: No provider key or service-role key is present in the client bundle or repository.
- AC-008: Export returns only data the requesting user is authorized to access.
- AC-009: Critical flows have automated tests and documented manual smoke tests.
- AC-010: Empty, loading, offline, permission-denied, and error states exist for primary screens.

## 9. Traceability

Use requirement IDs in issue titles, pull requests, test names, and acceptance checklists where practical. Every P0 requirement should map to at least one test or a documented manual verification.
