# Test Plan

## 1. Objectives

Verify core workflows, tenant isolation, AI safety boundaries, notification behavior, and release readiness.

## 2. Test layers

### Unit tests

- Zod/shared validation schemas
- Stage transition and follow-up helpers
- Date/time and timezone utilities
- AI response schema validation
- CSV escaping and export formatting
- Error normalization

### Integration tests

- Authenticated database access
- RLS across two users and two workspaces
- Workspace creation transaction
- Lead CRUD and activity creation
- Follow-up creation/completion
- AI Edge Function authorization, quotas, timeout and provider failures
- Export and deletion authorization

Database migrations and RLS tests use pgTAP against the local Supabase stack. Start
Docker, then run `npm run db:start`, `npm run db:reset`, and `npm run db:test`.
These scripts explicitly target the local database; do not use the linked-project
flags for routine tests. The workspace suite is
`supabase/tests/workspace_tenant_foundation.test.sql`; the product-table suite is
`supabase/tests/tenant_product_tables.test.sql`. Both suites pass all 90 assertions
after a local reset. The product-table migration has been applied to production.
GitHub Actions is configured to run the same flow on pull
requests and pushes to `main`, but its first hosted run failed before runner
assignment; enable hosted runner access before relying on hosted results.

### UI/component tests

- Sign-in and validation errors
- Lead form required/optional fields
- Search/filter behavior
- AI draft editing/copy state
- Empty/loading/offline/error states
- Accessibility labels and text scaling

### End-to-end tests

- New user → workspace → first lead
- Lead → schedule follow-up → due queue
- Lead → generate draft → edit → copy
- Stage change → dashboard counts update
- Export own workspace data
- User A attempts to access User B's lead and fails

### Manual device tests

- Current supported Android device and one smaller screen
- Keyboard does not obscure form actions
- App resumes after backgrounding
- Notification permission allowed/denied
- Network loss during save/generation
- App update and session expiry
- iOS smoke test if iOS is included in the release

## 3. Required tenant-isolation matrix

Create User A/Workspace A and User B/Workspace B.

Attempt as User A to:

- select Workspace B leads;
- query a Workspace B lead by UUID;
- update a Workspace B lead;
- insert an activity linked to a Workspace B lead;
- use Workspace B ID with AI generation;
- export Workspace B;
- modify membership or promote self;
- access AI drafts and usage events for Workspace B.

Expected: deny or return a non-disclosing not-found response. Test through both direct database API access and Edge Functions.

## 4. AI test cases

- Business profile has a price: draft may use that exact price.
- Price is missing: draft must not invent a price.
- Availability is missing: draft must not promise availability.
- Lead note contains prompt injection: it must not override system instructions.
- Very long note: reject or safely truncate under a documented rule.
- Provider timeout: safe error and retry.
- Provider returns malformed output: reject and record failure.
- Quota exceeded: no provider call is made.
- Two repeated requests: no accidental duplicate action beyond the documented behavior.
- Personal data: verify only required fields are sent to provider.
- Output must remain a draft; no external send occurs.

Use synthetic fixtures, not real customer messages.

## 5. Performance and reliability checks

- Lead list pagination with representative dataset.
- Search and filters with database indexes.
- Slow network and repeated taps.
- Expired token during mutation.
- AI provider rate limit and outage.
- Duplicate submission protection.
- Database restore rehearsal against an isolated local target; never overwrite production data during restore tests.
- Verify app does not leak cached data after sign-out/account switch.

## 6. Release gates

Release only when:

- all P0 requirements have test evidence;
- no unresolved critical/high security issues;
- tenant-isolation tests pass;
- core end-to-end flows pass on a real device;
- AI provider budget and rate limits are configured;
- error monitoring and backup/restore are verified;
- privacy policy and store disclosures match the implementation;
- a rollback or forward-fix plan exists.

## 7. Test report template

For each release, record:

- commit SHA and build number;
- environment and device/OS;
- tests run and pass/fail counts;
- known defects and severity;
- security/RLS test results;
- AI cost/latency smoke-test result;
- release decision and approver.
