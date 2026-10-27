# Delivery Roadmap

## Guiding rule

Ship a narrow workflow and validate willingness to pay before building integrations or complex automation. Dates below are sequencing estimates for a solo developer, not commitments.

## Phase 0 — Discovery (3–7 days)

- Select one target segment.
- Conduct 15–20 problem interviews.
- Document current enquiry/follow-up workflow.
- Test willingness to pay with a demo or prototype.
- Secure 3–5 paid pilot commitments if possible.

**Gate:** If users do not describe a frequent, costly follow-up problem or will not commit to a pilot, revise the segment before building further.

## Phase 1 — Foundation (Week 1)

**Status: Foundation and tenant-RLS gate complete.** The workspace and product
table migrations pass the local pgTAP suites (90 assertions). The product-table
migration has been applied to production. GitHub Actions run #1 failed before
either hosted job received a runner (`runner_id: 0`); hosted execution remains blocked
on repository/account runner availability.

- Initialize Expo TypeScript app. **Done** — Expo SDK 58, strict TypeScript, `npm run lint`, `npm run typecheck`, `npm test`, and an Android production bundle all verified.
- Configure lint, formatting, strict TypeScript, CI. **Implemented and locally verified** — ESLint, TypeScript, Prettier, unit tests, Expo Doctor, Android export, and local Supabase pgTAP checks pass. GitHub Actions run #1 failed before runner assignment; check repository Actions permissions and hosted-runner billing/availability, then rerun.
- Configure Supabase environments. **Configured per owner decision** — use the single linked Supabase project as production; do not create separate cloud development or staging projects. The local Supabase stack is reserved for isolated tests.
- Add migrations, Auth, workspace membership, RLS. **Implemented, tested locally, and applied to production** — Supabase Auth and the workspace/membership foundation are in place; the tenant-owned product tables now have membership RLS, trusted-server-only write boundaries, composite tenant/lead constraints, and two-user pgTAP coverage. Both suites passed all 90 assertions locally and the product-table migration is applied to production.
- Create environment config and secret handling. **Done for the current foundation** — client configuration is Zod-validated, root `.env.example` contains only client-safe values, and the root `.env` is limited to `EXPO_PUBLIC_*` settings. Edge Function local secrets are separately ignored and templated; actual provider secrets are deferred until an Edge Function is implemented.
- Add basic error handling and test harness. **Done for the current foundation** — stable user-safe error mapping has unit tests, and pgTAP covers the workspace tenant boundary. Integration tests for later product features remain future work.

**Gate: Passed for workspace and product-table RLS** — keep database tests isolated on the local Supabase stack; do not run destructive tests against production. Hosted CI remains blocked until GitHub assigns hosted runners to the workflow.

## Phase 2 — Core CRM (Weeks 2–3)

- Onboarding and workspace creation.
- Lead list/detail/create/edit/archive.
- Search, stage filters, pagination.
- Activity timeline and notes.
- Follow-up scheduling and due queue.
- Dashboard and empty/error states.

**Gate:** A pilot user can manage leads without developer intervention.

## Phase 3 — AI drafting (Week 4)

- Business profile and approved facts.
- Server-side AI adapter and draft endpoint.
- Rate limiting, quotas, timeout handling.
- Draft editor, copy, regenerate, warnings.
- AI test cases for hallucination and prompt injection.
- Usage metering and cost visibility.

**Gate:** AI drafts are useful, editable, bounded, and never sent automatically.

## Phase 4 — Pilot hardening (Weeks 5–6)

- User feedback and UX fixes.
- Notification permission and scheduling.
- Export and account deletion workflow.
- Monitoring, backups, restore test.
- Privacy policy, terms, support process.
- Device testing and accessibility checks.

**Gate:** At least three pilot customers complete core workflows; critical/high defects closed.

## Phase 5 — Paid launch (Weeks 7–8)

- Choose one pricing offer and quota.
- Set up lawful billing and store-policy-compliant purchase flow.
- Onboarding and help content.
- Direct outreach and case studies with permission.
- Monitor activation, weekly retention, AI cost, support burden, conversion, churn.

**Gate:** Do not scale paid acquisition until retention and gross margin show a plausible path to payback.

## Phase 6 — Integrations and expansion (after evidence)

Prioritize only from customer requests and measurable value:

- CSV import
- team assignments and roles
- official WhatsApp Business Platform
- web lead forms
- email integration
- agency/reseller workflow
- additional languages
- advanced analytics

## Solo-founder weekly operating rhythm

- 3–4 days: build and test the highest-value workflow.
- 1 day: customer interviews, onboarding, and support.
- 0.5 day: review metrics, costs, defects, and next priorities.
- Keep a short changelog and update docs when behavior changes.
