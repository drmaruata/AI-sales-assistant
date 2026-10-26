# Security, Privacy, and Operational Controls

## 1. Security objectives

Protect customer contact information, business context, sales notes, AI drafts, and workspace data against unauthorized access, accidental exposure, and misuse.

## 2. Threat model

| Threat | Example | Primary controls |
|---|---|---|
| Cross-tenant access | User changes a workspace or lead UUID | RLS, membership checks, isolation tests |
| Secret exposure | AI key bundled into app | Server-side secret storage, bundle scans |
| Prompt injection | Lead note tells model to ignore policy | Treat user content as untrusted; server-owned instructions |
| AI fabrication | Draft invents a price or guarantee | Approved facts only, uncertainty rules, human review |
| Abuse/cost spike | Automated AI requests exhaust quota | Rate limits, budgets, output limits, anomaly alerts |
| Account takeover | Reused or stolen password | Auth provider controls, MFA where available, session hygiene |
| Export leakage | Public or guessable download URL | Auth checks, short-lived signed URLs, audit events |
| Notification exposure | Sensitive lead details on lock screen | Generic notification text by default |
| Log leakage | Request body contains contact information | Structured redacted logging |
| Lost device | Cached records remain on device | Minimize local persistence; secure storage for tokens |

## 3. Data classification

- **Public:** marketing pages, public help content.
- **Internal:** feature flags, non-sensitive operational metadata.
- **Confidential:** lead name, contact information, sales notes, business profile, AI draft.
- **Restricted:** authentication tokens, service-role keys, AI provider keys, signing secrets.

Never place Restricted data in source control, client bundles, analytics, crash reports, or support screenshots.

## 4. Authentication and authorization

- Use Supabase Auth; do not roll your own password storage.
- Require authorization on every read/write path.
- Use RLS for tenant-owned database rows.
- Keep service-role access in server-side environments only.
- Restrict admin access, enable MFA, and review privileged users periodically.
- Do not use client-supplied roles or workspace IDs as authorization proof.
- Verify webhook signatures and use replay protection if integrations are added.

## 5. AI-specific controls

- Keep provider keys server-side.
- Minimize fields sent to the model.
- Use a fixed server-owned system prompt.
- Delimit lead notes and business profile as untrusted data.
- Do not allow user-provided text to change provider, tools, policies, or system instructions.
- Require model output to fit a strict schema and length limit.
- Do not execute code or external actions from model output.
- Keep external sending out of MVP.
- Record usage and costs without logging full prompts by default.
- Establish daily budget limits and per-workspace quotas.
- Review provider terms for retention, training, processing region, and subprocessors.

## 6. Privacy and compliance checklist

Before launch:
- Publish a privacy policy that matches actual data collection and third-party processing.
- Publish terms of service and a support contact.
- Explain AI processing at the point of use.
- Provide a way to export user/workspace data.
- Provide account deletion and describe any retained records.
- Define retention for leads, activities, drafts, logs, and backups.
- Collect consent/permissions required by applicable law and platform rules.
- Review Indian privacy and consumer obligations with qualified counsel for the actual business model and data flows.
- If adding WhatsApp, comply with current Meta opt-in, template, opt-out, and messaging policies.
- Complete Google Play Data safety and Apple privacy disclosures accurately.
- Avoid claims of legal compliance or certification without evidence.

This checklist is not legal advice and does not establish compliance by itself.

## 7. Operational controls

- Separate dev, staging, and production.
- Use managed secret storage.
- Require review before production migration.
- Back up production data and periodically test restore.
- Monitor error rate, latency, provider spend, and quota exhaustion.
- Define an incident-response owner and customer notification process.
- Keep dependencies updated; run dependency and secret scanning.
- Maintain a vulnerability reporting contact.
- Document data access for support personnel.
- Never use real customer data in test fixtures.

## 8. Incident response outline

1. Triage severity and stop active exposure.
2. Revoke/rotate compromised credentials.
3. Preserve relevant security logs.
4. Determine affected workspaces and data categories.
5. Contain, patch, and verify.
6. Notify affected parties/regulators when required by applicable law.
7. Record root cause and prevention actions.
8. Review monitoring and tests to prevent recurrence.

## 9. Release-blocking security checks

- Cross-tenant read/update/delete attempts fail.
- Service-role and AI secrets are absent from app bundle and Git history.
- RLS enabled on all tenant-owned tables.
- Edge Functions verify JWT, membership, and object relationship.
- AI endpoint has rate limits and bounded payload/output.
- Logs redact sensitive data.
- Export and deletion are authorization-tested.
- Production backups and restore procedure are verified.
