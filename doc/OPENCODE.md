# OpenCode Project Instructions

## Mission

Implement the AI Sales Assistant according to `PRD.md`, `SRS.md`, `Design.md`, `Architecture.md`, and the supporting specifications. Optimize for secure, testable MVP delivery—not maximum feature count.

## Required working rules

1. Before editing, inspect the existing repository, package versions, and current project structure.
2. If the repository is empty, scaffold Expo + React Native + TypeScript using current compatible stable tooling.
3. Implement in small vertical slices. Do not create all screens as static mockups and call the product complete.
4. Read and follow the database schema and RLS design. Never weaken RLS to make a feature work.
5. Keep secrets out of the client and Git. `.env.example` contains placeholders only.
6. Do not implement unofficial WhatsApp automation, scraping, or autonomous outbound sending.
7. Do not invent business facts in AI drafts. Keep AI generation server-side and human-reviewed.
8. Write or update tests with each feature. Run formatting, lint, type-check, unit/integration tests, and a production build where supported.
9. If a test cannot run because an external service or credential is missing, state the exact blocker and provide a manual verification procedure. Do not claim it passed.
10. Review changed files and `git diff` before finishing. Report implemented scope, test commands/results, known gaps, and next step.
11. Do not overwrite existing work without inspecting it first.
12. Ask before destructive migrations, deleting user data, changing production infrastructure, or making external purchases.
13. Use shared validation schemas where practical. Server-side validation is authoritative.
14. Use accessible labels, keyboard-safe forms, loading/empty/error states, and non-color-only status cues.
15. Do not add dependencies without explaining the need and checking compatibility.

## Implementation order

### Slice 1 — project foundation

- Expo app, strict TypeScript, lint/format/test scripts.
- Environment parsing and Supabase client.
- Auth screens and session state.
- Basic navigation and design tokens.

### Slice 2 — secure tenant foundation

- SQL migrations for workspaces and memberships.
- Transaction-safe workspace creation.
- RLS policies and tests using two separate users.
- Verify no service-role key is in the client.

Implementation status: `supabase/migrations/20261026152409_workspace_tenant_foundation.sql`
creates the workspace tables, membership-based read policies, and the authenticated
`create_workspace` RPC. The RPC derives the owner from `auth.uid()` and creates the
workspace and owner membership in one database transaction. Authenticated clients can
read only their own membership and cannot write workspace or membership rows directly.
`supabase/tests/workspace_tenant_foundation.test.sql` covers two-user isolation,
privilege boundaries, validation, and rollback on owner-membership failure. Run
`npm run db:start`, `npm run db:reset`, then `npm run db:test` with Docker running.
These scripts explicitly target the local database. By owner decision, the workspace
migration is applied to the single linked production Supabase project as migration
`20261026152409`; the pgTAP
suite has not yet run against a local database. Leads and other tenant-owned tables
remain for later slices.

The root `.env` is for client-safe Expo configuration only; Expo loads every variable
there into the dev-server process. Local Edge Function secrets belong in the ignored
`supabase/functions/.env`, and hosted secrets belong in Supabase's secret store. The
owner chose not to separate cloud development/staging from production; use the local
Supabase stack for isolated tests and never run destructive tests against production.

### Slice 3 — leads

- Lead CRUD, stage changes, search/filter, pagination.
- Activities/notes and archive.
- Form validation and offline/error states.

### Slice 4 — follow-ups and dashboard

- Follow-up CRUD and queue.
- Dashboard summary.
- Notification permission and scheduling behavior.
- Timezone tests.

### Slice 5 — AI drafts

- Server-side provider adapter.
- `generate-reply-draft` Edge Function.
- Usage metering, rate limits, schema validation.
- Prompt injection/hallucination tests.
- Editable draft UI and copy action.

### Slice 6 — launch readiness

- Export and account deletion workflows.
- Privacy/terms/support links.
- Monitoring, backups, restore rehearsal.
- Device and end-to-end tests.
- Release checklist.

## Definition of done for each slice

- Requirements and acceptance criteria met.
- Type-check, lint, and relevant tests pass.
- RLS/authorization considered for data access.
- No secret or personal data leak in logs.
- UI includes loading, empty, error, and permission-denied states as relevant.
- Documentation and migrations are updated.
- Summary includes exact test commands and actual outcomes.

## First task prompt

“Inspect this repository and report its current state against Slice 1 and Slice 2 in `OPENCODE.md`. Do not make changes yet. Identify the existing stack, missing files, risky assumptions, required environment variables, and the smallest secure implementation plan. Then wait for approval before editing.”
