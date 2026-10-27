create schema if not exists app_private;

revoke all on schema app_private from public, anon, authenticated;
grant usage on schema app_private to authenticated;
grant usage on schema public to authenticated;

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 160),
  timezone text not null default 'Asia/Kolkata'
    check (char_length(btrim(timezone)) between 1 and 64),
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create index workspace_members_user_workspace_idx
  on public.workspace_members (user_id, workspace_id);

alter table public.workspaces enable row level security;
alter table public.workspaces force row level security;
alter table public.workspace_members enable row level security;
alter table public.workspace_members force row level security;

revoke all on table public.workspaces, public.workspace_members
  from public, anon, authenticated;
grant select on table public.workspaces, public.workspace_members to authenticated;

create function app_private.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select exists (
    select 1
    from public.workspace_members as membership
    where membership.workspace_id = target_workspace_id
      and membership.user_id = (select auth.uid())
  );
$function$;

revoke all on function app_private.is_workspace_member(uuid) from public, anon;
grant execute on function app_private.is_workspace_member(uuid) to authenticated;

create policy workspaces_select_for_members
  on public.workspaces
  for select
  to authenticated
  using ((select app_private.is_workspace_member(id)));

create policy workspace_members_select_own
  on public.workspace_members
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create function public.create_workspace(p_name text, p_timezone text default 'Asia/Kolkata')
returns table (
  id uuid,
  name text,
  timezone text,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $function$
declare
  caller_id uuid := (select auth.uid());
  created_workspace public.workspaces;
  normalized_name text := pg_catalog.btrim(p_name);
  normalized_timezone text := pg_catalog.btrim(p_timezone);
begin
  if caller_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if p_name is null or char_length(normalized_name) not between 1 and 160 then
    raise exception 'Workspace name must be between 1 and 160 characters'
      using errcode = '22023';
  end if;

  if p_timezone is null
     or char_length(normalized_timezone) not between 1 and 64
     or not exists (
       select 1
       from pg_catalog.pg_timezone_names as timezone_name
       where timezone_name.name = normalized_timezone
     ) then
    raise exception 'Workspace timezone is invalid' using errcode = '22023';
  end if;

  insert into public.workspaces (name, timezone, created_by)
  values (normalized_name, normalized_timezone, caller_id)
  returning * into created_workspace;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (created_workspace.id, caller_id, 'owner');

  return query
  select
    created_workspace.id,
    created_workspace.name,
    created_workspace.timezone,
    created_workspace.created_at;
end;
$function$;

revoke all on function public.create_workspace(text, text) from public, anon;
grant execute on function public.create_workspace(text, text) to authenticated;
