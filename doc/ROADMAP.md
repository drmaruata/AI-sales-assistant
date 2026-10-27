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

**Status: Complete for the Phase 1 scope.** The workspace isolation pgTAP gate now
passes locally (30/30 assertions). GitHub Actions is configured but its first hosted
run is still pending. Later product tables still require their own RLS before they
can safely store tenant data.

- Initialize Expo TypeScript app. **Done** — Expo SDK 58, strict TypeScript, `npm run lint`, `npm run typecheck`, `npm test`, and an Android production bundle all verified.
- Configure lint, formatting, strict TypeScript, CI. **Implemented and locally verified** — ESLint, TypeScript, Prettier, unit tests, Expo Doctor, Android export, and local Supabase pgTAP checks pass. These checks are configured in `.github/workflows/ci.yml`; the first hosted GitHub Actions run is pending.
- Configure Supabase environments. **Configured per owner decision** — use the single linked Supabase project as production; do not create separate cloud development or staging projects. The local Supabase stack is reserved for isolated tests.
- Add migrations, Auth, workspace membership, RLS. **Done for the Phase 1 tenant foundation** — Supabase Auth is configured and the workspace/membership migration is applied to the production project. The local two-user pgTAP suite passed all 30 assertions for isolation, privilege boundaries, validation, and atomic creation. Later tenant-owned product tables still need their own RLS policies and tests.
- Create environment config and secret handling. **Done for the current foundation** — client configuration is Zod-validated, root `.env.example` contains only client-safe values, and the root `.env` is limited to `EXPO_PUBLIC_*` settings. Edge Function local secrets are separately ignored and templated; actual provider secrets are deferred until an Edge Function is implemented.
- Add basic error handling and test harness. **Done for the current foundation** — stable user-safe error mapping has unit tests, and pgTAP covers the workspace tenant boundary. Integration tests for later product features remain future work.

**Gate: Passed for the workspace foundation** — local pgTAP confirms cross-tenant isolation. Keep database tests isolated on the local Supabase stack; do not run destructive tests against the production project. Before adding each tenant-owned product table, add and test its RLS policies.

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
