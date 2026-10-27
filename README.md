# AI Sales Assistant — Product & Engineering Starter Pack

Version: 1.0  
Status: MVP planning baseline  
Audience: solo founder using OpenCode

This repository is a documentation-first starter pack for an Android-first AI Sales Assistant for small businesses. It is intentionally scoped around lead capture, follow-up discipline, and AI-assisted replies—not an unrestricted autonomous messaging bot.

## Product summary

Help small businesses capture enquiries, keep a clean lead pipeline, draft useful replies, and remember follow-ups. The first release should be valuable without depending on WhatsApp API approval or complex integrations.

### Initial target segment

Start with **one** segment for the first pilot (recommended: coaching/training centres, real-estate agents, or service businesses). Do not build separate workflows for all segments before validating one.

### Implemented stack (Slice 1 + Slice 2 foundation)

Slice 1 of `doc/OPENCODE.md` is in place: Expo SDK 58, React Native 0.88, TypeScript 6 in strict mode, Expo Router, Zod-validated environment parsing, a Supabase client with a persisted session, sign-in and sign-up screens, session state, and design tokens in `src/theme`. Slice 2 adds local Supabase configuration, an authenticated transaction-safe workspace-creation RPC, membership-based RLS, and migrations for the tenant-owned product tables. Both migrations and the 90-assertion pgTAP suite pass against the local Supabase stack.

The MVP UI preview is also in place, guided by `doc/Design.md` and the supplied reference screens. It has a five-tab floating bar: Home, Leads, Pipeline, Follow-ups, and a More hub for business profile, AI templates, team, integrations, analytics, subscription, help, data controls, settings, profile, and password reset. Lead details, edit, notes, archive, and the reply-draft preview sit inside the bar; the add-lead form opens above it. Sales data is synthetic and in-memory only; workspace/lead changes are not persisted or connected to Supabase, and the reply screen does not call an AI provider. App integration remains pending.

```bash
npm install
npm start
npm run android
npm run lint
npm run format:check
npm run typecheck
npm test
npm run db:start
npm run db:reset
npm run db:test
```

Add native packages with `npx expo install <package>`, never `npm install <package>`. See `AGENTS.md` for the full workflow and repository rules.

## Stack for remaining slices

- Backend/database/auth: Supabase (Postgres local via Docker, Auth, workspace/membership RLS foundation, and Edge Functions)
- Server state: TanStack Query or a comparable cache
- Forms: Zod validation with controlled component state. React Hook Form was considered and dropped as more code than the case needed
- AI: provider-agnostic server-side adapter; never expose provider keys in the app
- Push notifications: Expo Notifications
- Analytics/error reporting: privacy-conscious event analytics and crash reporting, selected before production
- Web landing/admin/billing portal: optional Next.js application, separate from the mobile MVP
- Source control: GitHub
- Development assistant: OpenCode

Use current stable versions at implementation time and commit the lockfile. Check platform and package compatibility before adding dependencies.

## Included documents

All documents live under `doc/`.

- `PRD.md` — product scope, users, requirements, success metrics
- `SRS.md` — functional and non-functional software requirements
- `Design.md` — UX principles, navigation, visual system, screen specifications
- `Architecture.md` — components, boundaries, deployment, integrations
- `DATABASE_SCHEMA.md` — proposed PostgreSQL schema and RLS approach
- `API_SPEC.md` — Edge Function contracts and error conventions
- `SECURITY_PRIVACY.md` — threat model, data protection and operational controls
- `TEST_PLAN.md` — test strategy and acceptance criteria
- `ROADMAP.md` — phased delivery plan and release gates
- `RELEASE_CHECKLIST.md` — pre-release gate checks
- `OPENCODE.md` — repository instructions and implementation workflow
- `MVP_BACKLOG.md` — prioritized epics and user stories
- `.env.example` (repository root) — non-secret configuration template
- `AGENTS.md` (repository root) — agent workflow and repository rules

## Important launch constraints

1. The MVP must work as a standalone lead-management app. WhatsApp integration is a later phase and must use official Meta-supported APIs and approved permissions.
2. Do not scrape WhatsApp Web, automate a personal WhatsApp account, or bypass platform limits.
3. AI creates **drafts** in the MVP. A human reviews and sends the message. Do not implement autonomous sending by default.
4. Do not use real customer personal data in development fixtures.
5. Enforce tenant isolation in Postgres with RLS, not only in UI code.
6. AI provider calls happen on the server. Secrets must never be bundled into the app.
7. Treat the revenue goals in planning conversations as hypotheses, not forecasts. Validate willingness to pay with real customers.

## Next step

The UI preview and Slice 2 database foundation are not release-ready. Both migrations, including the tenant-owned product tables with RLS, are applied only to the local Supabase stack; local pgTAP tests (90 assertions) pass. No cloud Supabase project exists. GitHub Actions run #1 failed both jobs before runner assignment (`runner_id: 0`); check repository Actions permissions and hosted-runner billing/availability, then rerun the workflow. Use the local Supabase stack for isolated tests.

Keep the root `.env` limited to client-safe `EXPO_PUBLIC_*` values because Expo loads every variable in it into the dev-server process. Edge Function local secrets belong in the ignored `supabase/functions/.env`; hosted secrets belong in Supabase's secret store. Never store real server credentials in the app environment or bundle.
