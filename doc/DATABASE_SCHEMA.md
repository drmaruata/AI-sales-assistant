# Database Schema and RLS Design

## 1. Principles

- Every tenant-owned row includes `workspace_id`.
- RLS is enabled on every tenant-owned table.
- Membership in `workspace_members` is the authorization source of truth.
- Do not rely on UI filtering for isolation.
- Use migrations committed to source control.
- Avoid storing unnecessary personal information.
- Use soft archive for leads; define hard-delete retention separately.
- Test policies with multiple users in different workspaces.

## 2. Proposed tables

### `workspaces`

- `id uuid primary key default gen_random_uuid()`
- `name text not null check (char_length(name) between 1 and 160)`
- `slug text unique`
- `timezone text not null default 'Asia/Kolkata'`
- `created_by uuid not null references auth.users(id)`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### `workspace_members`

- `workspace_id uuid not null references workspaces(id) on delete cascade`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `role text not null check (role in ('owner','member'))`
- `created_at timestamptz not null default now()`
- primary key (`workspace_id`, `user_id`)

Only a trusted workspace-creation flow may assign the first owner. Never allow a user to promote themselves to owner by directly updating this table.

### `leads`

- `id uuid primary key default gen_random_uuid()`
- `workspace_id uuid not null references workspaces(id) on delete cascade`
- `display_name text not null`
- `company_name text`
- `phone text`
- `email text`
- `source text`
- `stage text not null default 'new' check (stage in ('new','contacted','qualified','won','lost'))`
- `need_summary text`
- `next_follow_up_at timestamptz`
- `archived_at timestamptz`
- `created_by uuid not null references auth.users(id)`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- constraints for field lengths and basic email format where appropriate

### `lead_activities`

- `id uuid primary key default gen_random_uuid()`
- `workspace_id uuid not null references workspaces(id) on delete cascade`
- `lead_id uuid not null references leads(id) on delete cascade`
- `activity_type text not null check (activity_type in ('note','stage_changed','follow_up_set','follow_up_completed','draft_created','interaction_logged','lead_archived'))`
- `body text`
- `metadata jsonb not null default '{}'::jsonb`
- `created_by uuid not null references auth.users(id)`
- `created_at timestamptz not null default now()`

Treat activity records as append-only from the normal client. Avoid storing secrets or unnecessary contact details in metadata.

### `business_profiles`

- `id uuid primary key default gen_random_uuid()`
- `workspace_id uuid not null unique references workspaces(id) on delete cascade`
- `business_name text not null`
- `description text`
- `products_services jsonb not null default '[]'::jsonb`
- `approved_faqs jsonb not null default '[]'::jsonb`
- `contact_details jsonb not null default '{}'::jsonb`
- `preferred_tone text not null default 'professional' check (preferred_tone in ('professional','friendly','concise'))`
- `updated_by uuid references auth.users(id)`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Validate JSON shapes server-side. Do not allow arbitrary prompt/system instructions in this table.

### `ai_drafts`

- `id uuid primary key default gen_random_uuid()`
- `workspace_id uuid not null references workspaces(id) on delete cascade`
- `lead_id uuid not null references leads(id) on delete cascade`
- `purpose text not null`
- `tone text not null`
- `language text not null`
- `draft_text text not null`
- `warnings jsonb not null default '[]'::jsonb`
- `provider_name text`
- `model_name text`
- `input_tokens integer`
- `output_tokens integer`
- `created_by uuid not null references auth.users(id)`
- `created_at timestamptz not null default now()`

Decide and disclose retention. Do not store complete raw prompts by default.

### `follow_ups` (recommended over only storing one lead timestamp if history is needed)

- `id uuid primary key default gen_random_uuid()`
- `workspace_id uuid not null references workspaces(id) on delete cascade`
- `lead_id uuid not null references leads(id) on delete cascade`
- `due_at timestamptz not null`
- `status text not null default 'pending' check (status in ('pending','completed','cancelled'))`
- `note text`
- `created_by uuid not null references auth.users(id)`
- `completed_by uuid references auth.users(id)`
- `completed_at timestamptz`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### `ai_usage_events`

- `id uuid primary key default gen_random_uuid()`
- `workspace_id uuid not null references workspaces(id) on delete cascade`
- `user_id uuid not null references auth.users(id)`
- `draft_id uuid references ai_drafts(id) on delete set null`
- `provider_name text`
- `model_name text`
- `input_tokens integer`
- `output_tokens integer`
- `status text not null check (status in ('succeeded','failed','rate_limited'))`
- `estimated_cost numeric(12,6)`
- `created_at timestamptz not null default now()`

This is for metering, not billing truth. Prevent clients from writing usage events directly.

### `audit_events`

- `id uuid primary key default gen_random_uuid()`
- `workspace_id uuid references workspaces(id) on delete set null`
- `actor_user_id uuid references auth.users(id) on delete set null`
- `event_type text not null`
- `entity_type text`
- `entity_id uuid`
- `request_id text`
- `metadata jsonb not null default '{}'::jsonb`
- `created_at timestamptz not null default now()`

Do not log secrets, raw drafts, full contact information, or unrestricted request bodies.

## 3. Indexes

Recommended initial indexes:

- `workspace_members(user_id, workspace_id)`
- `leads(workspace_id, stage, updated_at desc) where archived_at is null`
- `leads(workspace_id, next_follow_up_at) where archived_at is null`
- `leads(workspace_id, created_at desc)`
- `lead_activities(workspace_id, lead_id, created_at desc)`
- `follow_ups(workspace_id, status, due_at)`
- `ai_drafts(workspace_id, lead_id, created_at desc)`
- `ai_usage_events(workspace_id, created_at desc)`

For search, begin with indexed filters and Postgres text search if needed. Avoid adding a search extension before validating query patterns.

## 4. RLS policy pattern

Enable RLS on every tenant-owned table. A common helper can be used if it is security-reviewed:

```sql
create schema if not exists app_private;

create or replace function app_private.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = (select auth.uid())
  );
$$;
```

Security notes:

- Review function owner, grants, and execution privileges.
- Grant execute only as required.
- Keep `app_private` out of PostgREST's exposed schemas; authenticated execution is needed for policy evaluation, not client RPC access.
- Keep `search_path` fixed for `SECURITY DEFINER` functions.
- Do not permit users to modify their own membership role.
- Owner-only operations need a separate helper that checks the stored role.
- Test policy recursion and privilege boundaries.

Example policies for `leads` (illustrative; test against the actual schema and grants):

```sql
alter table public.leads enable row level security;

create policy "workspace members read leads"
on public.leads for select to authenticated
using (app_private.is_workspace_member(workspace_id));

create policy "workspace members create leads"
on public.leads for insert to authenticated
with check (
  app_private.is_workspace_member(workspace_id)
  and created_by = (select auth.uid())
);

create policy "workspace members update leads"
on public.leads for update to authenticated
using (app_private.is_workspace_member(workspace_id))
with check (app_private.is_workspace_member(workspace_id));
```

Do not blindly copy these policies to all tables. For example, AI usage and audit events should normally be written by trusted server-side functions and be read-only or hidden from normal client writes. Lead activity inserts must also validate that `lead_id` belongs to the same `workspace_id`; enforce this with a composite constraint or trigger, not only a UI check.

## 5. Workspace creation

The Slice 2 migration `supabase/migrations/20261026152409_workspace_tenant_foundation.sql`
implements `public.create_workspace(p_name, p_timezone)` as an authenticated RPC. It
validates the name and timezone, derives both `created_by` and the initial owner
membership from `auth.uid()`, and creates both rows in one transaction. It does not
accept a caller-supplied user ID or role, and returns only the workspace ID, name,
timezone, and creation timestamp.

The migration revokes direct client writes to both tables. Authenticated users can read
workspaces where they are members and only their own membership rows. The membership
predicate lives in the non-exposed `app_private` schema with a fixed `search_path`; the helper
is executable only by `authenticated` so RLS can evaluate it. The membership relation
remains the authorization source of truth. pgTAP tests for two-user isolation and
transaction rollback live in `supabase/tests/workspace_tenant_foundation.test.sql`.

By owner decision, this migration is applied to the single linked production Supabase
project as migration `20261026152409`. The pgTAP suite has not yet run against a local database. Leads and
other tenant-owned tables are not yet present and must receive their own RLS policies
in later slices.

## 6. Migration order

1. Enable required extensions if needed.
2. Create workspace and membership tables.
3. Create helper authorization functions and grants.
4. Create leads, activities, profiles, follow-ups.
5. Create AI drafts, usage, audit tables.
6. Add indexes and constraints.
7. Enable RLS and create policies.
8. Add trusted RPC/Edge Functions.
9. Seed synthetic demo data only in development.
10. Run RLS tests with at least two users and two workspaces.

## 7. Open decisions

- Whether to use Supabase-generated UUIDs for all entities.
- Retention period for AI drafts and activity history.
- Whether a lead can belong to more than one workspace (default: no).
- Whether workspace members can export data (default: owner only).
- How to support account deletion while preserving required billing/audit records.
