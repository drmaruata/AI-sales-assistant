# MVP Backlog

Priority definitions: P0 = required for pilot; P1 = next; P2 = later.

## Epic A — Foundation and auth (P0)

- A1: Initialize Expo + TypeScript app. **Done.**
- A2: Configure lint, formatting, type-check, tests, CI. **Implemented; hosted runner blocked.** ESLint, Prettier, TypeScript, unit tests, Android export, and local Supabase pgTAP checks pass. GitHub Actions run #1 failed before runner assignment; repository/account runner availability must be enabled before rerunning.
- A3: Sign up, sign in, sign out, password recovery. **Partly done.** Sign-in, sign-up, and sign-out are implemented. There is no password-recovery screen.
- A4: Persist session securely using supported Supabase/Expo guidance. **Partly done.** The session persists in AsyncStorage. The encrypted storage variant has not been implemented.
- A5: Create workspace and owner membership transactionally. **Backend implemented; app integration pending.** The authenticated RPC creates both records atomically and is applied to the single production project by owner decision; onboarding does not call it yet.
- A6: Show session-expired and network-error states. **Partly done.** Screens show loading and inline error states; a session-expired path is not implemented yet.

Acceptance: user can create an account and workspace; unauthorized workspace access is denied.

## Epic B — Tenant security (P0)

- B1: Create workspace/member schema and policies. **Implemented and applied to the single production project.**
- B2: Add membership authorization helper with safe privileges. **Implemented.**
- B3: Add RLS policies for all tenant-owned tables. **Implemented, locally tested, and applied to production.** Product tables have membership RLS, explicit grants, trusted-server-only write boundaries, and composite tenant/lead constraints.
- B4: Test two-user/two-workspace isolation. **Passed locally.** Both pgTAP suites pass all 90 assertions after `npm run db:reset`.
- B5: Add migration review workflow. **Partly done.** Migrations are source-controlled and CI will apply/test them locally; review and hosted rollout remain manual.

Acceptance: direct API attempts to access another workspace fail.

## Epic C — Lead management (P0)

- C1: Create lead form.
- C2: Lead list with pagination.
- C3: Lead detail.
- C4: Edit/archive/restore.
- C5: Stage change.
- C6: Search/filter.
- C7: Notes and activity timeline.

Acceptance: user can manage a lead end-to-end without losing data on recoverable errors.

## Epic D — Follow-up discipline (P0)

- D1: Create/reschedule/complete/cancel follow-up.
- D2: Overdue/today/upcoming queues.
- D3: Dashboard counts.
- D4: Notification permission explanation.
- D5: Local notification scheduling and cancellation where supported.
- D6: Timezone and permission-denied tests.

Acceptance: due follow-ups are visible in-app even if notifications are denied.

## Epic E — Business context (P0)

- E1: Business profile.
- E2: Products/services and approved FAQs.
- E3: Tone preference.
- E4: Explain AI data processing.
- E5: Edit/remove outdated facts.

Acceptance: user can inspect and edit facts used to draft replies.

## Epic F — AI drafting (P0)

- F1: Provider adapter.
- F2: Server-side generation endpoint.
- F3: Authorization and quotas.
- F4: Bounded prompt construction.
- F5: Structured output validation.
- F6: Draft editor, copy, regenerate.
- F7: Usage metering and safe failure state.
- F8: Prompt-injection and hallucination tests.

Acceptance: AI draft is human-reviewed and never automatically sent.

## Epic G — Data rights and operations (P0)

- G1: Workspace export.
- G2: Account/workspace deletion workflow.
- G3: Redacted logs and error monitoring.
- G4: Backup and restore rehearsal.
- G5: Privacy policy, terms, support.
- G6: Store disclosures and release checklist.

Acceptance: data export/deletion is documented and tested; no critical/high security issues remain.

## Epic H — Paid launch (P1)

- H1: Define plans, quotas, limits.
- H2: Select billing flow after app-store policy review.
- H3: Onboarding analytics.
- H4: Pilot onboarding checklist.
- H5: Support and feedback capture.
- H6: Revenue, churn, cost, and conversion dashboard.

## Epic I — Integrations (P1/P2)

- I1: CSV import/export.
- I2: Team members and lead assignment.
- I3: Official WhatsApp Business Platform integration.
- I4: Web lead capture form.
- I5: Email integration.
- I6: Advanced reporting.

Do not start Epic I until pilot evidence shows the core lead and follow-up workflow is valuable.
