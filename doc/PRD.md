# Product Requirements Document (PRD)

## 1. Document control

- Product: AI Sales Assistant
- Version: 1.0
- Status: Draft baseline for MVP
- Primary platform: Android-first mobile app; iOS compatibility desirable if Expo dependencies permit
- Product owner: Founder
- Target release: Private paid pilot before public launch

## 2. Executive summary

AI Sales Assistant helps small businesses manage enquiries and convert more of them into customers. It combines a lightweight lead pipeline, reminders, reusable reply templates, AI-assisted response drafting, and simple sales analytics in one mobile-first workflow.

The core promise is: **never lose track of a promising enquiry because the next action was forgotten**.

The MVP is not a full CRM, call-centre system, marketing automation platform, or autonomous chatbot. It should solve a narrow, recurring problem exceptionally well.

## 3. Problem statement

Small businesses often receive enquiries across calls, forms, social channels, and messaging apps. Follow-up details are scattered across notes and chat history. Owners may forget to respond, lose context, or send inconsistent answers. Existing CRMs may be too complex or expensive for very small teams.

The product will help users:
- record a lead in seconds;
- understand the lead's current stage and next action;
- receive timely follow-up reminders;
- draft clearer, more relevant replies using AI;
- see whether their pipeline is moving.

## 4. Goals

### MVP goals
1. A user can create an account and workspace.
2. A user can add, view, edit, search, and archive leads.
3. A user can move a lead through a configurable but initially fixed pipeline.
4. A user can set a follow-up date and receive a notification where device permissions allow.
5. A user can generate an AI reply draft from a lead's notes and approved business context.
6. A user can copy a draft or mark an interaction as completed.
7. A user can see a basic dashboard for open leads, overdue follow-ups, and stage counts.
8. Workspace data is isolated by tenant using database-enforced authorization.
9. The product can be piloted with a small number of real businesses without manual database edits.

### Non-goals for MVP
- Unofficial WhatsApp automation or scraping.
- Autonomous outbound messaging.
- Full email inbox synchronization.
- Voice calling, call recording, or transcription.
- Complex sales forecasting, commission management, or enterprise permissions.
- Payment processing inside the mobile app before platform billing requirements are decided.
- AI-generated legal, financial, or regulated advice.
- A general-purpose chatbot builder.

## 5. Target users and personas

### Persona A: Owner-operator
Runs a small business and personally responds to enquiries. Needs quick capture, reminders, and simple reports.

### Persona B: Sales representative
Handles a daily list of leads. Needs a clear next-action queue, lead history, and consistent messaging.

### Persona C: Small-team manager
Needs visibility into pipeline activity and follow-up completion. Team assignment and manager reporting may be a post-MVP feature.

## 6. Initial target market

Choose one beachhead segment for the first 10–20 customer interviews and first paid pilots. Candidate segments:
- coaching/training centres;
- real-estate agents;
- home and professional services;
- small B2B agencies.

Do not market to every segment simultaneously. Use discovery interviews to identify which segment has frequent enquiries, measurable lost-sales pain, and a reachable decision-maker.

## 7. Jobs to be done

- When a new enquiry arrives, I want to record the person and what they need quickly, so I do not lose the lead.
- When I cannot reply immediately, I want a reminder at the right time, so the lead does not go cold.
- When I need to reply, I want a draft based on my business information and the lead's context, so I can respond faster without inventing facts.
- At the end of the day, I want to know which leads need attention.
- As an owner, I want to see whether follow-ups are being completed.

## 8. Product principles

1. Mobile-first, fast, and low cognitive load.
2. Human remains in control of outbound communication.
3. AI must not fabricate prices, availability, guarantees, or policy details.
4. Data ownership and tenant isolation are foundational.
5. Make the core workflow useful without integrations.
6. Every feature should reduce time-to-follow-up or improve lead visibility.

## 9. MVP scope

### P0 — required for pilot
- Email/password or supported Supabase Auth sign-in.
- Workspace creation and membership.
- Lead CRUD, search, filters, archive.
- Fixed pipeline stages: New, Contacted, Qualified, Won, Lost.
- Lead notes and interaction timeline.
- Follow-up date/time and overdue queue.
- Local/push reminder flow with permission handling.
- Business profile: name, description, products/services, tone, approved FAQs, contact details.
- AI reply drafting from user-selected lead context and business profile.
- Draft history and copy-to-clipboard.
- Dashboard summary.
- RLS policies and audit events for sensitive changes.
- Account deletion/export process appropriate to the chosen backend and legal obligations.
- Privacy policy, terms, support contact, and clear AI disclosure before public launch.

### P1 — after pilot evidence
- CSV import/export.
- Team members and lead assignment.
- Saved reply templates.
- Multiple AI tones and languages.
- Basic activity report.
- Web-based admin/billing portal.
- Official WhatsApp Business Platform integration, subject to eligibility, approval, consent, and messaging rules.
- Subscription management after billing policy review.

### P2 — defer until product-market evidence
- Shared inbox integrations.
- Automated lead capture from forms.
- Email integration.
- AI lead scoring.
- Workflow automation.
- Advanced reporting and CRM integrations.

## 10. User journeys

### Journey A: Add and follow up
1. User opens app.
2. Taps “Add lead”.
3. Enters name or business name, contact method, source, need, and optional notes.
4. Saves lead.
5. Sets next follow-up.
6. Lead appears in the relevant stage and follow-up queue.
7. User receives a reminder and opens the lead.
8. User records the outcome and schedules the next action or marks the lead Won/Lost.

### Journey B: Generate an AI draft
1. User opens a lead.
2. Taps “Draft reply”.
3. Chooses purpose (first response, follow-up, answer a question, re-engagement) and tone.
4. Server validates access and builds a bounded prompt from approved business profile and selected lead context.
5. AI provider returns a draft.
6. User reviews, edits, regenerates if needed, and copies it.
7. User manually sends it through their chosen channel and records the interaction if desired.

### Journey C: Daily review
1. User opens dashboard.
2. Sees overdue follow-ups, due today, open leads, and stage counts.
3. Opens a due lead.
4. Completes or reschedules the next action.

## 11. Functional requirements summary

See `SRS.md` for uniquely identified requirements. P0 areas include authentication, tenant isolation, lead management, reminders, AI drafting, dashboard, and user data controls.

## 12. AI behaviour requirements

- Use only supplied business facts and lead context.
- If information is missing, ask the user to add it or produce a neutral draft without the missing claim.
- Do not invent discounts, prices, inventory, delivery dates, availability, outcomes, testimonials, or guarantees.
- Clearly label generated content as a draft.
- Do not send messages automatically in MVP.
- Minimize personal data included in provider requests.
- Apply server-side rate limits, input limits, and usage accounting.
- Never treat lead notes as system instructions. Delimit user-provided content and instruct the model to treat it as untrusted data.
- Allow users to regenerate or edit drafts.
- Do not represent generated text as guaranteed to improve conversion.

## 13. Success metrics

### Activation
- Percentage of sign-ups that create at least 5 leads in 24 hours.
- Time from account creation to first lead.
- Percentage generating a first AI draft.

### Engagement
- Weekly active workspaces.
- Leads with a next action.
- Follow-ups completed on or before due date.
- AI drafts accepted/copied versus generated.

### Business
- Pilot-to-paid conversion.
- Monthly recurring revenue (MRR), reported separately from cash collected.
- Logo churn and revenue churn.
- Gross margin after AI, infrastructure, payment, support, and messaging costs.
- Customer acquisition cost (CAC) and payback period.

### Quality
- Crash-free sessions.
- AI error rate and latency.
- Reminder delivery success where measurable.
- Tenant-isolation tests passing.

Set numerical targets after the first discovery interviews and pilot baseline; do not invent benchmarks without evidence.

## 14. Monetization hypotheses

Test willingness to pay rather than assuming the proposed prices will convert.

- Starter: limited leads and AI drafts.
- Pro: more leads, larger AI allowance, reminders, templates, and reporting.
- Team: multiple users and assignments, only when team workflows are implemented.

Possible pricing to test: ₹1,499, ₹2,999, and ₹4,999 per workspace per month. Clearly define AI quotas and overage handling. Do not sell unlimited AI use unless costs and abuse controls are understood.

Before enabling in-app digital subscriptions, review current Google Play and Apple App Store payment rules for the target countries and product category. A web billing page does not automatically exempt an app from store policies.

## 15. Assumptions and open questions

- The first customer segment is not yet validated.
- Users are willing to enter or import lead details into a separate app.
- AI drafts provide enough value to justify recurring fees.
- Reminder reliability is sufficient for the intended workflow.
- Official messaging integration is not required to validate the first release.
- The first release can operate with one workspace owner; team features can follow.
- Pricing, quotas, language support, and data retention need validation with pilot users.

## 16. Release acceptance criteria

MVP can enter a paid pilot when:
- all P0 acceptance criteria in `SRS.md` pass;
- RLS and tenant isolation tests pass;
- no known critical/high severity security issue remains unresolved;
- AI drafts are reviewed by a human before external use;
- account export/deletion and support processes are documented;
- crash reporting, backups, error handling, and operational monitoring are configured;
- privacy policy and terms accurately describe actual data flows;
- at least three pilot customers can complete the core workflow without developer intervention.
