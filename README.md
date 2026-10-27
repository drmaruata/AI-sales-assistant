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

Slice 1 of `doc/OPENCODE.md` is in place: Expo SDK 58, React Native 0.88, TypeScript 6 in strict mode, Expo Router, Zod-validated environment parsing, a Supabase client with a persisted session, sign-in and sign-up screens, session state, and design tokens in `src/theme`. Slice 2 adds local Supabase configuration, workspace and membership migrations, an authenticated transaction-safe workspace-creation RPC, membership-based RLS, and pgTAP tests for two-user isolation. By owner decision, the workspace migration is applied to the single linked production Supabase project; the pgTAP suite has not yet run against a local database.

The MVP UI preview is also in place, guided by `doc/Design.md` and the supplied reference screens. It includes Home, Leads, Add, lead details/edit/notes/archive, follow-ups, business profile, reply-draft preview, onboarding, profile, password reset, and data controls. Sales data is synthetic and in-memory only; workspace/lead changes are not persisted or connected to Supabase, and the reply screen does not call an AI provider. Leads and other product tables still need RLS.

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

- Backend/database/auth: Supabase (Postgres, Auth, workspace/membership RLS foundation, and Edge Functions)
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

The UI preview and Slice 2 database foundation are not release-ready. The linked production database has the workspace foundation, but local pgTAP runtime validation is still pending: start Docker Desktop and run `npm run db:start`, `npm run db:reset`, and `npm run db:test` before connecting lead CRUD or applying further production migrations. A CI workflow is configured to run app checks, Android export, and local database tests without production secrets. Per owner decision, no separate cloud development or staging project will be created; use the local Supabase stack for isolated tests.

Keep the root `.env` limited to client-safe `EXPO_PUBLIC_*` values because Expo loads every variable in it into the dev-server process. Edge Function local secrets belong in the ignored `supabase/functions/.env`; hosted secrets belong in Supabase's secret store. Never store real server credentials in the app environment or bundle.
