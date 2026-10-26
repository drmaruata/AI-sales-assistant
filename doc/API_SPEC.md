# API and Edge Function Specification

## 1. General conventions

- Base: Supabase Edge Functions for privileged operations.
- Authentication: Supabase access token in `Authorization: Bearer <token>`.
- Content type: `application/json`.
- Validate every request with a shared schema.
- Return stable error codes and a request/correlation ID.
- Do not expose stack traces or provider responses.
- Apply CORS only to required origins for web clients; native apps do not require permissive browser CORS.
- Database CRUD may use the Supabase client with RLS; use Edge Functions for privileged logic, AI, export, and deletion.

## 2. Standard error shape

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Check the highlighted fields and try again.",
    "request_id": "opaque-correlation-id"
  }
}
```

Never return SQL details, provider credentials, raw prompts, or personal data in error messages.

## 3. `generate-reply-draft`

### Purpose
Generate a human-reviewed reply draft for an authorized lead.

### Request
```json
{
  "workspace_id": "uuid",
  "lead_id": "uuid",
  "purpose": "follow_up",
  "tone": "professional",
  "language": "en",
  "user_question": "Optional question the reply should address"
}
```

### Validation
- `purpose`: `first_response | follow_up | answer_question | reengagement`
- `tone`: `professional | friendly | concise`
- `language`: supported language code
- `user_question`: optional, maximum 2,000 characters
- Reject unknown keys where practical.
- Apply per-user and per-workspace rate limits.

### Server flow
1. Validate JWT and caller.
2. Validate payload.
3. Check workspace membership and lead membership in that workspace.
4. Check usage allowance and account state.
5. Fetch only relevant approved business profile and lead context.
6. Construct server-owned prompt with explicit untrusted-data boundaries.
7. Call configured provider with timeout and bounded output.
8. Validate response shape and length.
9. Store draft and metering event if configured.
10. Return draft and warnings.

### Success
```json
{
  "data": {
    "draft_id": "uuid",
    "text": "Hello ...",
    "warnings": [],
    "created_at": "2026-01-01T12:00:00Z"
  },
  "meta": {
    "request_id": "opaque-correlation-id"
  }
}
```

### Errors
- `AUTH_REQUIRED` — no valid user session
- `FORBIDDEN` — no workspace membership
- `NOT_FOUND` — lead does not exist in authorized workspace
- `VALIDATION_ERROR` — invalid request
- `RATE_LIMITED` — quota or rate limit reached
- `AI_PROVIDER_UNAVAILABLE` — provider timeout/failure
- `AI_OUTPUT_INVALID` — malformed or unsafe output
- `INTERNAL_ERROR` — unexpected failure

## 4. `create-workspace`

Prefer a transaction-safe database function invoked through an authenticated Edge Function or an appropriately secured RPC.

### Request
```json
{
  "name": "Example Business",
  "timezone": "Asia/Kolkata"
}
```

The caller's user ID must be derived from the verified JWT, never accepted from request JSON.

## 5. `export-workspace`

### Purpose
Create an export for an authorized workspace owner.

### Request
```json
{
  "workspace_id": "uuid",
  "format": "csv"
}
```

Requirements:
- Owner authorization required by default.
- Export only the requested authorized workspace.
- Escape CSV formula-injection values (e.g. cells beginning with `=`, `+`, `-`, `@`).
- Avoid exposing exports through guessable public URLs.
- Use short-lived signed URLs or stream the file through an authenticated response.
- Audit export request without copying lead content into audit metadata.

## 6. `delete-account`

### Purpose
Start a verified account deletion workflow.

Requirements:
- Require fresh authentication or re-authentication.
- Explain effects on workspace ownership, memberships, and shared data.
- Prevent accidental deletion of the last owner without a transfer or explicit workspace deletion plan.
- Delete or anonymize data according to the documented retention policy.
- Do not delete billing records that must legally be retained; minimize retained data.
- Return a deletion request/status, not an unsupported promise of immediate complete erasure.

## 7. Future integration: official WhatsApp Business Platform

Not in MVP. Before implementing:
- verify current Meta eligibility, app review, permissions, templates, opt-in, and messaging-window rules;
- use official APIs and webhooks;
- validate webhook signatures;
- store access tokens only server-side;
- implement consent and opt-out state;
- implement delivery/error state and idempotency;
- never scrape WhatsApp Web or automate personal accounts;
- clearly distinguish drafted, queued, accepted by provider, delivered, and read statuses.

## 8. API versioning

Keep the first internal API small. If external clients or integrations appear, introduce explicit versioning (e.g. `/v1/`) before breaking contracts. Record schema changes and deprecations in release notes.
