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
- Initialize Expo TypeScript app. **Done** — Expo SDK 58, strict TypeScript, `npm run lint`, `npm run typecheck`, `npm test`, and an Android production bundle all verified.
- Configure lint, formatting, strict TypeScript, CI. **Partly done** — lint and typecheck run; no formatter and no CI. There is no workflow under `.github/`; CI is still to build.
- Set up Supabase dev/staging projects. **Not done** — one project is configured in `.env`; dev, staging, and production are not separated.
- Add migrations, Auth, workspace membership, RLS. **Partly done** — sign-in and sign-up work against Supabase Auth with a persisted session. No migrations, no `workspace_members` table, and no RLS policies exist, so tenant isolation is not enforced yet.
- Create environment config and secret handling. **Partly done** — `.env` is git-ignored, client variables are Zod-validated, and only `EXPO_PUBLIC_*` values reach app code. Server-side secret storage for Edge Functions is not set up.
- Add basic error handling and test harness. **Partly done** — `npm test` runs with `node --test` over pure modules. No integration or RLS test harness yet.

**Gate:** Cross-tenant tests pass before building business features.

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
