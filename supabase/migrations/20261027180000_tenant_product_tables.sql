create table public.leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  display_name text not null
    check (char_length(btrim(display_name)) between 1 and 160),
  company_name text check (company_name is null or char_length(company_name) <= 160),
  phone text check (phone is null or char_length(phone) <= 64),
  email text check (email is null or char_length(email) <= 254),
  source text check (source is null or char_length(source) <= 80),
  stage text not null default 'new'
    check (stage in ('new', 'contacted', 'qualified', 'won', 'lost')),
  need_summary text check (need_summary is null or char_length(need_summary) <= 4000),
  next_follow_up_at timestamptz,
  archived_at timestamptz,
  created_by uuid not null default auth.uid() references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, id)
);

create table public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  lead_id uuid not null,
  activity_type text not null check (
    activity_type in (
      'note',
      'stage_changed',
      'follow_up_set',
      'follow_up_completed',
      'draft_created',
      'interaction_logged',
      'lead_archived'
    )
  ),
  body text check (body is null or char_length(body) <= 4000),
  metadata jsonb not null default '{}'::jsonb
    check (pg_catalog.jsonb_typeof(metadata) = 'object')
    check (pg_catalog.pg_column_size(metadata) <= 16384),
  created_by uuid not null default auth.uid() references auth.users (id),
  created_at timestamptz not null default now(),
  foreign key (workspace_id, lead_id)
    references public.leads (workspace_id, id) on delete cascade
);

create table public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null unique
    references public.workspaces (id) on delete cascade,
  business_name text not null
    check (char_length(btrim(business_name)) between 1 and 160),
  description text check (description is null or char_length(description) <= 4000),
  products_services jsonb not null default '[]'::jsonb
    check (pg_catalog.jsonb_typeof(products_services) = 'array')
    check (pg_catalog.pg_column_size(products_services) <= 32768),
  approved_faqs jsonb not null default '[]'::jsonb
    check (pg_catalog.jsonb_typeof(approved_faqs) = 'array')
    check (pg_catalog.pg_column_size(approved_faqs) <= 32768),
  contact_details jsonb not null default '{}'::jsonb
    check (pg_catalog.jsonb_typeof(contact_details) = 'object')
    check (pg_catalog.pg_column_size(contact_details) <= 8192),
  preferred_tone text not null default 'professional'
    check (preferred_tone in ('professional', 'friendly', 'concise')),
  updated_by uuid default auth.uid() references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ai_drafts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  lead_id uuid not null,
  purpose text not null check (char_length(btrim(purpose)) between 1 and 80),
  tone text not null check (char_length(btrim(tone)) between 1 and 40),
  language text not null check (char_length(btrim(language)) between 1 and 32),
  draft_text text not null check (char_length(btrim(draft_text)) between 1 and 10000),
  warnings jsonb not null default '[]'::jsonb
    check (pg_catalog.jsonb_typeof(warnings) = 'array')
    check (pg_catalog.pg_column_size(warnings) <= 8192),
  provider_name text check (provider_name is null or char_length(provider_name) <= 80),
  model_name text check (model_name is null or char_length(model_name) <= 120),
  input_tokens integer check (input_tokens is null or input_tokens >= 0),
  output_tokens integer check (output_tokens is null or output_tokens >= 0),
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  unique (workspace_id, id),
  foreign key (workspace_id, lead_id)
    references public.leads (workspace_id, id) on delete cascade
);

create table public.follow_ups (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  lead_id uuid not null,
  due_at timestamptz not null,
  status text not null default 'pending'
    check (status in ('pending', 'completed', 'cancelled')),
  note text check (note is null or char_length(note) <= 2000),
  created_by uuid not null default auth.uid() references auth.users (id),
  completed_by uuid references auth.users (id),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (status = 'completed' and completed_by is not null and completed_at is not null)
    or (status <> 'completed' and completed_by is null and completed_at is null)
  ),
  foreign key (workspace_id, lead_id)
    references public.leads (workspace_id, id) on delete cascade
);

create table public.ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid not null references auth.users (id),
  draft_id uuid,
  provider_name text check (provider_name is null or char_length(provider_name) <= 80),
  model_name text check (model_name is null or char_length(model_name) <= 120),
  input_tokens integer check (input_tokens is null or input_tokens >= 0),
  output_tokens integer check (output_tokens is null or output_tokens >= 0),
  status text not null check (status in ('succeeded', 'failed', 'rate_limited')),
  estimated_cost numeric(12, 6)
    check (estimated_cost is null or estimated_cost >= 0),
  created_at timestamptz not null default now(),
  foreign key (workspace_id, draft_id)
    references public.ai_drafts (workspace_id, id) on delete set null (draft_id)
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces (id) on delete set null,
  actor_user_id uuid references auth.users (id) on delete set null,
  event_type text not null check (char_length(btrim(event_type)) between 1 and 120),
  entity_type text check (entity_type is null or char_length(entity_type) <= 120),
  entity_id uuid,
  request_id text check (request_id is null or char_length(request_id) <= 128),
  metadata jsonb not null default '{}'::jsonb
    check (pg_catalog.jsonb_typeof(metadata) = 'object')
    check (pg_catalog.pg_column_size(metadata) <= 16384),
  created_at timestamptz not null default now()
);

create index leads_workspace_stage_updated_at_idx
  on public.leads (workspace_id, stage, updated_at desc)
  where archived_at is null;
create index leads_workspace_follow_up_idx
  on public.leads (workspace_id, next_follow_up_at)
  where archived_at is null;
create index leads_workspace_created_at_idx
  on public.leads (workspace_id, created_at desc);
create index lead_activities_workspace_lead_created_at_idx
  on public.lead_activities (workspace_id, lead_id, created_at desc);
create index follow_ups_workspace_status_due_at_idx
  on public.follow_ups (workspace_id, status, due_at);
create index ai_drafts_workspace_lead_created_at_idx
  on public.ai_drafts (workspace_id, lead_id, created_at desc);
create index ai_usage_events_workspace_created_at_idx
  on public.ai_usage_events (workspace_id, created_at desc);
create index audit_events_workspace_created_at_idx
  on public.audit_events (workspace_id, created_at desc)
  where workspace_id is not null;

create function app_private.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  new.updated_at := pg_catalog.now();
  return new;
end;
$function$;

create function app_private.stamp_business_profile_update()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  new.updated_at := pg_catalog.now();
  new.updated_by := coalesce((select auth.uid()), new.updated_by);
  return new;
end;
$function$;

create function app_private.stamp_follow_up_update()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  new.updated_at := pg_catalog.now();

  if tg_op = 'INSERT' then
    if new.status = 'completed' then
      new.completed_by := coalesce((select auth.uid()), new.completed_by);
      new.completed_at := coalesce(new.completed_at, pg_catalog.now());
    else
      new.completed_by := null;
      new.completed_at := null;
    end if;
  elsif new.status is distinct from old.status then
    if new.status = 'completed' then
      new.completed_by := coalesce((select auth.uid()), new.completed_by);
      new.completed_at := pg_catalog.now();
    else
      new.completed_by := null;
      new.completed_at := null;
    end if;
  end if;

  return new;
end;
$function$;

revoke all on function app_private.touch_updated_at() from public, anon, authenticated;
revoke all on function app_private.stamp_business_profile_update()
  from public, anon, authenticated;
revoke all on function app_private.stamp_follow_up_update()
  from public, anon, authenticated;

create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function app_private.touch_updated_at();
create trigger business_profiles_stamp_update
  before update on public.business_profiles
  for each row execute function app_private.stamp_business_profile_update();
create trigger follow_ups_stamp_update
  before insert or update on public.follow_ups
  for each row execute function app_private.stamp_follow_up_update();

alter table public.leads enable row level security;
alter table public.leads force row level security;
alter table public.lead_activities enable row level security;
alter table public.lead_activities force row level security;
alter table public.business_profiles enable row level security;
alter table public.business_profiles force row level security;
alter table public.ai_drafts enable row level security;
alter table public.ai_drafts force row level security;
alter table public.follow_ups enable row level security;
alter table public.follow_ups force row level security;
alter table public.ai_usage_events enable row level security;
alter table public.ai_usage_events force row level security;
alter table public.audit_events enable row level security;
alter table public.audit_events force row level security;

revoke all on table
  public.leads,
  public.lead_activities,
  public.business_profiles,
  public.ai_drafts,
  public.follow_ups,
  public.ai_usage_events,
  public.audit_events
from public, anon, authenticated;

grant select on table public.leads, public.lead_activities, public.business_profiles,
  public.ai_drafts, public.follow_ups, public.ai_usage_events to authenticated;
grant insert (workspace_id, display_name, company_name, phone, email, source, stage,
  need_summary, next_follow_up_at, archived_at)
  on public.leads to authenticated;
grant update (display_name, company_name, phone, email, source, stage, need_summary,
  next_follow_up_at, archived_at)
  on public.leads to authenticated;
grant insert (workspace_id, lead_id, activity_type, body, metadata)
  on public.lead_activities to authenticated;
grant insert (workspace_id, business_name, description, products_services,
  approved_faqs, contact_details, preferred_tone)
  on public.business_profiles to authenticated;
grant update (business_name, description, products_services, approved_faqs,
  contact_details, preferred_tone)
  on public.business_profiles to authenticated;
grant insert (workspace_id, lead_id, due_at, note)
  on public.follow_ups to authenticated;
grant update (due_at, status, note) on public.follow_ups to authenticated;

grant all on table public.leads, public.lead_activities, public.business_profiles,
  public.ai_drafts, public.follow_ups, public.ai_usage_events, public.audit_events
to service_role;

create policy leads_select_for_workspace_members
  on public.leads for select to authenticated
  using ((select app_private.is_workspace_member(workspace_id)));
create policy leads_insert_for_workspace_members
  on public.leads for insert to authenticated
  with check (
    (select app_private.is_workspace_member(workspace_id))
    and created_by = (select auth.uid())
  );
create policy leads_update_for_workspace_members
  on public.leads for update to authenticated
  using ((select app_private.is_workspace_member(workspace_id)))
  with check (
    (select app_private.is_workspace_member(workspace_id))
    and created_by = (select auth.uid())
  );

create policy lead_activities_select_for_workspace_members
  on public.lead_activities for select to authenticated
  using ((select app_private.is_workspace_member(workspace_id)));
create policy lead_activities_insert_for_workspace_members
  on public.lead_activities for insert to authenticated
  with check (
    (select app_private.is_workspace_member(workspace_id))
    and created_by = (select auth.uid())
  );

create policy business_profiles_select_for_workspace_members
  on public.business_profiles for select to authenticated
  using ((select app_private.is_workspace_member(workspace_id)));
create policy business_profiles_insert_for_workspace_members
  on public.business_profiles for insert to authenticated
  with check (
    (select app_private.is_workspace_member(workspace_id))
    and updated_by = (select auth.uid())
  );
create policy business_profiles_update_for_workspace_members
  on public.business_profiles for update to authenticated
  using ((select app_private.is_workspace_member(workspace_id)))
  with check (
    (select app_private.is_workspace_member(workspace_id))
    and updated_by = (select auth.uid())
  );

create policy ai_drafts_select_for_workspace_members
  on public.ai_drafts for select to authenticated
  using ((select app_private.is_workspace_member(workspace_id)));

create policy follow_ups_select_for_workspace_members
  on public.follow_ups for select to authenticated
  using ((select app_private.is_workspace_member(workspace_id)));
create policy follow_ups_insert_for_workspace_members
  on public.follow_ups for insert to authenticated
  with check (
    (select app_private.is_workspace_member(workspace_id))
    and created_by = (select auth.uid())
  );
create policy follow_ups_update_for_workspace_members
  on public.follow_ups for update to authenticated
  using ((select app_private.is_workspace_member(workspace_id)))
  with check (
    (select app_private.is_workspace_member(workspace_id))
    and created_by = (select auth.uid())
  );

create policy ai_usage_events_select_for_workspace_members
  on public.ai_usage_events for select to authenticated
  using ((select app_private.is_workspace_member(workspace_id)));
