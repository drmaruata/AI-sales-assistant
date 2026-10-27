begin;

create extension if not exists pgtap with schema extensions;

select plan(30);

select has_table('public', 'workspaces', 'workspace table exists');
select has_table('public', 'workspace_members', 'workspace membership table exists');
select ok(
  (select relation.relrowsecurity and relation.relforcerowsecurity
   from pg_catalog.pg_class as relation
   where relation.oid = 'public.workspaces'::regclass),
  'RLS is enabled and forced for workspaces'
);
select ok(
  (select relation.relrowsecurity and relation.relforcerowsecurity
   from pg_catalog.pg_class as relation
   where relation.oid = 'public.workspace_members'::regclass),
  'RLS is enabled and forced for workspace memberships'
);
select ok(
  not pg_catalog.has_table_privilege(
    'anon',
    'public.workspaces',
    'SELECT,INSERT,UPDATE,DELETE'
  ),
  'anonymous users have no workspace table privileges'
);
select ok(
  not pg_catalog.has_table_privilege(
    'anon',
    'public.workspace_members',
    'SELECT,INSERT,UPDATE,DELETE'
  ),
  'anonymous users have no membership table privileges'
);
select ok(
  not pg_catalog.has_table_privilege(
    'authenticated',
    'public.workspaces',
    'INSERT,UPDATE,DELETE'
  ),
  'authenticated users have no workspace write privileges'
);
select ok(
  not pg_catalog.has_table_privilege(
    'authenticated',
    'public.workspace_members',
    'INSERT,UPDATE,DELETE'
  ),
  'authenticated users have no membership write privileges'
);
select ok(
  not pg_catalog.has_function_privilege(
    'anon',
    'public.create_workspace(text,text)',
    'EXECUTE'
  ),
  'anonymous users cannot create workspaces'
);

insert into auth.users (id, email)
values
  ('00000000-0000-4000-8000-0000000000a1', 'workspace-a@example.test'),
  ('00000000-0000-4000-8000-0000000000b2', 'workspace-b@example.test');

create function public.reject_atomicity_probe_membership()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  if new.role = 'owner'
     and exists (
       select 1
       from public.workspaces as workspace
       where workspace.id = new.workspace_id
         and workspace.name = 'Atomicity probe'
     ) then
    raise exception 'intentional test failure' using errcode = 'P0001';
  end if;
  return new;
end;
$function$;

create trigger reject_atomicity_probe_membership
  before insert on public.workspace_members
  for each row
  execute function public.reject_atomicity_probe_membership();

set local role authenticated;
set local request.jwt.claim.sub = '';

select throws_ok(
  $$select public.create_workspace('No identity', 'UTC')$$,
  '42501',
  null,
  'workspace creation requires an authenticated user identity'
);

set local request.jwt.claim.sub = '00000000-0000-4000-8000-0000000000a1';

select lives_ok(
  $$select public.create_workspace('Workspace A', 'Asia/Kolkata')$$,
  'user A creates a workspace through the RPC'
);
select is(
  (select count(*) from public.workspaces),
  1::bigint,
  'user A sees their workspace'
);
select is(
  (select count(*) from public.workspace_members),
  1::bigint,
  'user A sees only their membership'
);
select is(
  (select membership.role
   from public.workspace_members as membership
   join public.workspaces as workspace on workspace.id = membership.workspace_id
   where workspace.name = 'Workspace A'),
  'owner'::text,
  'workspace creation assigns the caller as owner'
);
select throws_ok(
  $$insert into public.workspaces (name, created_by)
    values ('Direct insert', '00000000-0000-4000-8000-0000000000a1')$$,
  '42501',
  null,
  'authenticated users cannot insert workspaces directly'
);
select throws_ok(
  $$update public.workspaces set name = 'Spoofed workspace'
    where name = 'Workspace A'$$,
  '42501',
  null,
  'authenticated users cannot update workspaces directly'
);
select throws_ok(
  $$delete from public.workspaces where name = 'Workspace A'$$,
  '42501',
  null,
  'authenticated users cannot delete workspaces directly'
);
select throws_ok(
  $$insert into public.workspace_members (workspace_id, user_id, role)
    select id, '00000000-0000-4000-8000-0000000000a1', 'owner'
    from public.workspaces where name = 'Workspace A'$$,
  '42501',
  null,
  'authenticated users cannot insert memberships directly'
);
select throws_ok(
  $$update public.workspace_members set role = 'member'
    where user_id = '00000000-0000-4000-8000-0000000000a1'$$,
  '42501',
  null,
  'authenticated users cannot change membership roles'
);
select throws_ok(
  $$delete from public.workspace_members
    where user_id = '00000000-0000-4000-8000-0000000000a1'$$,
  '42501',
  null,
  'authenticated users cannot delete memberships directly'
);
select throws_ok(
  $$select public.create_workspace('   ', 'Asia/Kolkata')$$,
  '22023',
  null,
  'workspace names must not be empty'
);
select throws_ok(
  $$select public.create_workspace('Invalid timezone', 'Not/A_Timezone')$$,
  '22023',
  null,
  'workspace timezones must be recognized'
);

set local request.jwt.claim.sub = '00000000-0000-4000-8000-0000000000b2';

select lives_ok(
  $$select public.create_workspace('Workspace B', 'UTC')$$,
  'user B creates a separate workspace through the RPC'
);
select is(
  (select count(*) from public.workspaces),
  1::bigint,
  'user B sees only their workspace'
);
select is(
  (select membership.role from public.workspace_members as membership),
  'owner'::text,
  'user B is the owner of their workspace'
);

set local request.jwt.claim.sub = '00000000-0000-4000-8000-0000000000a1';

select is(
  (select count(*) from public.workspaces),
  1::bigint,
  'user A cannot enumerate user B workspaces'
);
select is(
  (select count(*)
   from public.workspaces
   where name = 'Workspace B'),
  0::bigint,
  'user A cannot read user B workspace by name'
);
select is(
  (select count(*)
   from public.workspace_members as membership
   where membership.user_id = '00000000-0000-4000-8000-0000000000b2'),
  0::bigint,
  'user A cannot read user B membership'
);
select throws_ok(
  $$select public.create_workspace('Atomicity probe', 'UTC')$$,
  'P0001',
  'intentional test failure',
  'owner membership failure aborts workspace creation'
);
select is(
  (select count(*) from public.workspaces where name = 'Atomicity probe'),
  0::bigint,
  'failed workspace creation leaves no partial workspace'
);

select * from finish();
rollback;
