# Product Design Specification

## 1. Design direction

Build a calm, practical sales tool for busy owner-operators. It should feel reliable and fast, not like a complicated enterprise CRM or a novelty AI chatbot.

### Design principles
- One primary action per screen.
- Show the next action clearly.
- Keep lead capture short; make optional fields progressive.
- Use plain language instead of CRM jargon where possible.
- Make AI assistance explicit and editable.
- Provide complete loading, empty, offline, permission-denied, and error states.
- Avoid relying on color alone to communicate stage or urgency.

## 2. Brand and visual system

Suggested working name: **FollowUp AI** (placeholder; verify trademarks, domains, app-store naming, and social handles before adoption).

### Palette as implemented

Tokens live in `src/theme/index.ts` as the single source of truth. Light and dark sets both exist. These values supersede the earlier suggested palette below, which was not used.

| Role | Light | Dark |
|---|---|---|
| Text | `#101418` | `#F2F5F8` |
| Secondary text | `#5A6472` | `#A4AEBB` |
| Background | `#FFFFFF` | `#0E1216` |
| Surface | `#F5F7FA` | `#171C22` |
| Border | `#D8DEE7` | `#2A323B` |
| Accent | `#1B6CD9` | `#7FB2F5` |
| Accent text | `#FFFFFF` | `#0B1220` |
| Success | `#146C43` | `#7BD3A5` |
| Danger | `#B3261E` | `#F2B8B5` |
| Disabled | `#9AA5B1` | `#5B6672` |

Spacing scale is 4, 8, 12, 16, 24, 32. Corner radii are 6, 10, 16. Type ramp is title 24 semibold, heading 18 semibold, body 15 regular, label 13 semibold, caption 12 regular. Minimum touch target is 44.

The palette is selected from the device color scheme, so dark mode renders whenever the OS requests it. Verify WCAG AA contrast for text before release; the values above have not been contrast-tested. There is no AI accent token yet — AI surfaces are not built.

### Typography
Use platform system fonts for performance and native feel. Establish a 4-point spacing scale and a consistent type ramp:
- Screen title: 24–28sp, semibold
- Section heading: 18–20sp, semibold
- Body: 14–16sp
- Supporting text: 12–14sp
- Button label: 15–16sp, semibold

### Components
- Primary, secondary, and destructive buttons
- Text input with label, hint, and inline validation
- Lead card
- Stage badge with text and optional icon
- Follow-up row with due status
- Empty state with a single call to action
- Bottom sheet for quick actions
- AI draft editor with generated-content label
- Skeleton/loading state
- Confirmation dialog for destructive actions
- Toast/snackbar for success and recoverable errors

## 3. Information architecture

Bottom navigation:
1. **Home** — overview, overdue and due-today queue
2. **Leads** — search, filters, stage views
3. **Add** — prominent creation action
4. **Templates** — saved replies (can be P1; hide until implemented)
5. **Settings** — business profile, notifications, AI usage, privacy, account

For the earliest MVP, use four tabs if Templates is not implemented: Home, Leads, Add, Settings. Do not expose dead or placeholder tabs.

## 4. Screen specifications

### 4.1 Onboarding
Purpose: get the user to their first useful action quickly.
- Screen 1: value proposition and concise privacy/AI explanation.
- Screen 2: create account or sign in.
- Screen 3: create workspace/business name.
- Screen 4: optional business profile setup; allow skipping.
- Screen 5: add first lead.
Success event: `first_lead_created`.

Avoid requesting notification permission on first launch without context. Ask after the user schedules their first follow-up.

### 4.2 Home dashboard
Top area:
- Greeting and current workspace.
- Summary cards: Open leads, Overdue, Due today.
- “Needs attention” list sorted by overdue/due time.
- Recent activity.
- Floating or prominent “Add lead” action.

States:
- Empty: explain value and show Add lead.
- Loading: skeleton cards and rows.
- Error: retry action without erasing state.
- Offline: show last-updated status and disable operations that cannot be safely queued.

### 4.3 Leads list
- Search field.
- Horizontal stage filter or compact filter sheet.
- Sort: next follow-up, recently updated, recently created.
- Lead row: name, company, stage, next follow-up, last activity.
- Swipe actions are optional; provide accessible explicit actions too.
- Pagination or incremental loading.
- Filters persist during navigation where practical.

### 4.4 Add/edit lead
Required: display name. Optional: company, phone, email, source, stage, need summary, next follow-up.
- Keep first view to a small number of fields.
- Use progressive disclosure for advanced fields.
- Validate on submit and show errors next to fields.
- Preserve entered values after network failure.
- Do not require phone or email if the business only has a name or social handle.

### 4.5 Lead detail
Header: name/company, stage, primary action.
Sections:
- Contact details
- Need/context
- Next follow-up
- Timeline of notes and stage changes
- Actions: Add note, Set follow-up, Draft reply, Change stage, Archive

Draft reply should be a distinct action and not silently trigger AI usage on page load.

### 4.6 AI draft flow
Step 1: choose purpose (first response, follow-up, answer question, re-engagement).
Step 2: choose tone (professional, friendly, concise) and language if supported.
Step 3: show generation progress and cancel affordance where supported.
Step 4: show editable draft, label “AI-generated draft — review before sending”.
Actions: Copy, Regenerate, Save draft, Cancel.
- Explain if no business facts are configured.
- Never display a fake “Sent” state.
- If generation fails, preserve user context and offer retry.

### 4.7 Follow-up queue
Tabs/filters: Overdue, Today, Upcoming, Completed.
Each row shows due time, lead name, and action.
Allow complete, reschedule, and open lead.
Notification permission denial should show a non-blocking explanation and preserve in-app follow-ups.

### 4.8 Business profile
Fields: business name, concise description, products/services, approved FAQs, contact details, preferred tone, and optional terms/disclaimers.
Show an explanation that these details may be sent to the configured AI provider to generate drafts.
Allow preview/edit of the facts used in prompts.

### 4.9 Settings
- Profile and workspace
- Notification preferences
- AI usage and plan (when billing is implemented)
- Export data
- Delete account
- Privacy policy, terms, support
- App version and diagnostics identifier

## 5. Interaction and copy rules

- Prefer “Follow up” to “Execute workflow”.
- Prefer “Draft a reply” to “Generate AI content”.
- Use explicit date/time and timezone where ambiguity matters.
- Avoid false urgency and manipulative nudges.
- Confirm destructive actions.
- Make retry actions idempotent where possible.
- Do not use “AI sent your message” because the MVP does not send messages.

## 6. Accessibility and localization

- Support screen readers and accessible labels.
- Ensure tap targets are comfortably sized (target ~44–48dp).
- Support larger system text without clipping.
- Avoid color-only states.
- Start with English; design strings for localization from day one.
- Consider Hindi and other languages only after verifying quality with native speakers and real users.

## 7. Analytics events

Capture product events, not message contents:
- `signup_completed`
- `workspace_created`
- `first_lead_created`
- `lead_created`
- `lead_stage_changed`
- `followup_scheduled`
- `followup_completed`
- `ai_draft_requested`
- `ai_draft_succeeded`
- `ai_draft_failed`
- `draft_copied`
- `export_requested`
- `account_deletion_requested`

Do not include phone numbers, email addresses, lead names, notes, or generated draft text in analytics properties.

## 8. Design acceptance checklist

- Every primary screen has loading, empty, error, and offline behavior where relevant.
- The Add lead flow can be completed quickly with minimal required input.
- Generated drafts are clearly marked and editable.
- No nonfunctional controls or placeholder navigation items ship.
- Accessibility labels, contrast, text scaling, and keyboard behavior are checked on a real Android device.

## 9. UI preview implementation status

Before Slice 2, the current application includes a navigable UI preview for authentication and password reset; onboarding; Home; active and archived Leads; add/edit/detail; notes and stage changes; follow-up scheduling and queues; business profile; reply-draft preview; profile; and data controls. Lead, follow-up, and business-profile changes are synthetic in-memory state only. The reply screen uses sample copy, not an AI provider. Export and deletion actions explain that they are not connected; no data is exported or deleted.

Do not treat this preview as an MVP release or as a substitute for the tenant-security gate. Before Slice 3, complete workspace/membership migrations, transaction-safe workspace creation, RLS, and two-user isolation tests.
