begin;

create extension if not exists pgtap with schema extensions;

select no_plan();

insert into auth.users (id, email)
values
  ('00000000-0000-4000-8000-0000000000a1', 'product-a@example.test'),
  ('00000000-0000-4000-8000-0000000000b2', 'product-b@example.test'),
  ('00000000-0000-4000-8000-0000000000c3', 'product-c@example.test');

insert into public.workspaces (id, name, created_by)
values
  ('10000000-0000-4000-8000-0000000000a1', 'Product Workspace A',
    '00000000-0000-4000-8000-0000000000a1'),
  ('10000000-0000-4000-8000-0000000000b2', 'Product Workspace B',
    '00000000-0000-4000-8000-0000000000b2');

insert into public.workspace_members (workspace_id, user_id, role)
values
  ('10000000-0000-4000-8000-0000000000a1',
    '00000000-0000-4000-8000-0000000000a1', 'owner'),
  ('10000000-0000-4000-8000-0000000000b2',
    '00000000-0000-4000-8000-0000000000b2', 'owner');

insert into public.leads (id, workspace_id, display_name, created_by)
values
  ('20000000-0000-4000-8000-0000000000a1',
    '10000000-0000-4000-8000-0000000000a1', 'Lead A',
    '00000000-0000-4000-8000-0000000000a1'),
  ('20000000-0000-4000-8000-0000000000b2',
    '10000000-0000-4000-8000-0000000000b2', 'Lead B',
    '00000000-0000-4000-8000-0000000000b2');

insert into public.lead_activities
  (id, workspace_id, lead_id, activity_type, body, created_by)
values
  ('30000000-0000-4000-8000-0000000000a1',
    '10000000-0000-4000-8000-0000000000a1',
    '20000000-0000-4000-8000-0000000000a1', 'note', 'Note A',
    '00000000-0000-4000-8000-0000000000a1'),
  ('30000000-0000-4000-8000-0000000000b2',
    '10000000-0000-4000-8000-0000000000b2',
    '20000000-0000-4000-8000-0000000000b2', 'note', 'Note B',
    '00000000-0000-4000-8000-0000000000b2');

insert into public.business_profiles (id, workspace_id, business_name, updated_by)
values
  ('40000000-0000-4000-8000-0000000000a1',
    '10000000-0000-4000-8000-0000000000a1', 'Business A',
    '00000000-0000-4000-8000-0000000000a1'),
  ('40000000-0000-4000-8000-0000000000b2',
    '10000000-0000-4000-8000-0000000000b2', 'Business B',
    '00000000-0000-4000-8000-0000000000b2');

insert into public.ai_drafts
  (id, workspace_id, lead_id, purpose, tone, language, draft_text, created_by)
values
  ('50000000-0000-4000-8000-0000000000a1',
    '10000000-0000-4000-8000-0000000000a1',
    '20000000-0000-4000-8000-0000000000a1', 'follow-up', 'friendly',
    'en', 'Draft A', '00000000-0000-4000-8000-0000000000a1'),
  ('50000000-0000-4000-8000-0000000000b2',
    '10000000-0000-4000-8000-0000000000b2',
    '20000000-0000-4000-8000-0000000000b2', 'follow-up', 'friendly',
    'en', 'Draft B', '00000000-0000-4000-8000-0000000000b2');

insert into public.follow_ups (id, workspace_id, lead_id, due_at, created_by)
values
  ('60000000-0000-4000-8000-0000000000a1',
    '10000000-0000-4000-8000-0000000000a1',
    '20000000-0000-4000-8000-0000000000a1', now(),
    '00000000-0000-4000-8000-0000000000a1'),
  ('60000000-0000-4000-8000-0000000000b2',
    '10000000-0000-4000-8000-0000000000b2',
    '20000000-0000-4000-8000-0000000000b2', now(),
    '00000000-0000-4000-8000-0000000000b2');

insert into public.ai_usage_events
  (id, workspace_id, user_id, draft_id, status)
values
  ('70000000-0000-4000-8000-0000000000a1',
    '10000000-0000-4000-8000-0000000000a1',
    '00000000-0000-4000-8000-0000000000a1',
    '50000000-0000-4000-8000-0000000000a1', 'succeeded'),
  ('70000000-0000-4000-8000-0000000000b2',
    '10000000-0000-4000-8000-0000000000b2',
    '00000000-0000-4000-8000-0000000000b2',
    '50000000-0000-4000-8000-0000000000b2', 'succeeded');

insert into public.audit_events
  (id, workspace_id, actor_user_id, event_type)
values
  ('80000000-0000-4000-8000-0000000000a1',
    '10000000-0000-4000-8000-0000000000a1',
    '00000000-0000-4000-8000-0000000000a1', 'lead.created'),
  ('80000000-0000-4000-8000-0000000000b2',
    '10000000-0000-4000-8000-0000000000b2',
    '00000000-0000-4000-8000-0000000000b2', 'lead.created');

select ok(
  (select count(*) = 7
   from pg_catalog.pg_class as relation
   where relation.oid in (
     'public.leads'::regclass,
     'public.lead_activities'::regclass,
     'public.business_profiles'::regclass,
     'public.ai_drafts'::regclass,
     'public.follow_ups'::regclass,
     'public.ai_usage_events'::regclass,
     'public.audit_events'::regclass
   )
   and relation.relrowsecurity and relation.relforcerowsecurity),
  'RLS is enabled and forced for all seven product tables'
);
select ok(
  not exists (
    select 1
    from (values
      ('public.leads'::regclass),
      ('public.lead_activities'::regclass),
      ('public.business_profiles'::regclass),
      ('public.ai_drafts'::regclass),
      ('public.follow_ups'::regclass),
      ('public.ai_usage_events'::regclass),
      ('public.audit_events'::regclass)
    ) as tables(table_oid)
    where pg_catalog.has_table_privilege('anon', table_oid, 'SELECT')
       or pg_catalog.has_table_privilege('anon', table_oid, 'INSERT')
       or pg_catalog.has_table_privilege('anon', table_oid, 'UPDATE')
       or pg_catalog.has_table_privilege('anon', table_oid, 'DELETE')
  ),
  'anonymous users have no privileges on product tables'
);
select ok(
  not exists (
    select 1
    from (values
      ('public.ai_drafts'::regclass),
      ('public.ai_usage_events'::regclass),
      ('public.audit_events'::regclass)
    ) as tables(table_oid)
    where pg_catalog.has_table_privilege('authenticated', table_oid, 'INSERT')
       or pg_catalog.has_table_privilege('authenticated', table_oid, 'UPDATE')
       or pg_catalog.has_table_privilege('authenticated', table_oid, 'DELETE')
  ),
  'AI draft, AI usage, and audit writes are trusted-server-only'
);
select ok(
  not exists (
    select 1
    from (values
      ('public.leads'::regclass),
      ('public.lead_activities'::regclass),
      ('public.business_profiles'::regclass),
      ('public.follow_ups'::regclass)
    ) as tables(table_oid)
    where pg_catalog.has_table_privilege('authenticated', table_oid, 'DELETE')
  ),
  'normal client records cannot be hard-deleted'
);
select ok(
  not pg_catalog.has_column_privilege(
    'authenticated', 'public.leads', 'created_by', 'INSERT'
  )
  and not pg_catalog.has_column_privilege(
    'authenticated', 'public.lead_activities', 'created_by', 'INSERT'
  ),
  'clients cannot spoof lead or activity creators'
);
select ok(
  not pg_catalog.has_column_privilege(
    'authenticated', 'public.leads', 'workspace_id', 'UPDATE'
  )
  and not pg_catalog.has_column_privilege(
    'authenticated', 'public.follow_ups', 'workspace_id', 'UPDATE'
  ),
  'clients cannot move leads or follow-ups between workspaces'
);
select throws_ok(
  $$insert into public.ai_drafts
    (workspace_id, lead_id, purpose, tone, language, draft_text, created_by)
    values ('10000000-0000-4000-8000-0000000000a1',
      '20000000-0000-4000-8000-0000000000b2', 'follow-up', 'friendly',
      'en', 'Mismatched lead', '00000000-0000-4000-8000-0000000000a1')$$,
  '23503',
  null,
  'an AI draft cannot reference a lead in another workspace'
);
select throws_ok(
  $$insert into public.follow_ups
    (workspace_id, lead_id, due_at, created_by)
    values ('10000000-0000-4000-8000-0000000000a1',
      '20000000-0000-4000-8000-0000000000b2', now(),
      '00000000-0000-4000-8000-0000000000a1')$$,
  '23503',
  null,
  'a follow-up cannot reference a lead in another workspace'
);
select throws_ok(
  $$insert into public.ai_usage_events
    (workspace_id, user_id, draft_id, status)
    values ('10000000-0000-4000-8000-0000000000a1',
      '00000000-0000-4000-8000-0000000000a1',
      '50000000-0000-4000-8000-0000000000b2', 'succeeded')$$,
  '23503',
  null,
  'AI usage cannot reference a draft in another workspace'
);

set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-4000-8000-0000000000a1';

select is((select count(*) from public.leads), 1::bigint, 'user A reads only workspace A leads');
select is((select count(*) from public.lead_activities), 1::bigint,
  'user A reads only workspace A activities');
select is((select count(*) from public.business_profiles), 1::bigint,
  'user A reads only workspace A business profile');
select is((select count(*) from public.ai_drafts), 1::bigint,
  'user A reads only workspace A AI drafts');
select is((select count(*) from public.follow_ups), 1::bigint,
  'user A reads only workspace A follow-ups');
select is((select count(*) from public.ai_usage_events), 1::bigint,
  'user A reads only workspace A usage events');
select throws_ok(
  $$select count(*) from public.audit_events$$,
  '42501',
  null,
  'user A has no direct access to audit events'
);

set local request.jwt.claim.sub = '00000000-0000-4000-8000-0000000000b2';

select is((select count(*) from public.leads), 1::bigint, 'user B reads only workspace B leads');
select is((select count(*) from public.lead_activities), 1::bigint,
  'user B reads only workspace B activities');
select is((select count(*) from public.business_profiles), 1::bigint,
  'user B reads only workspace B business profile');
select is((select count(*) from public.ai_drafts), 1::bigint,
  'user B reads only workspace B AI drafts');
select is((select count(*) from public.follow_ups), 1::bigint,
  'user B reads only workspace B follow-ups');
select is((select count(*) from public.ai_usage_events), 1::bigint,
  'user B reads only workspace B usage events');
select throws_ok(
  $$select count(*) from public.audit_events$$,
  '42501',
  null,
  'user B has no direct access to audit events'
);

set local request.jwt.claim.sub = '00000000-0000-4000-8000-0000000000c3';

select is((select count(*) from public.leads), 0::bigint,
  'a non-member cannot read leads');
select is((select count(*) from public.lead_activities), 0::bigint,
  'a non-member cannot read activities');
select is((select count(*) from public.business_profiles), 0::bigint,
  'a non-member cannot read business profiles');
select is((select count(*) from public.ai_drafts), 0::bigint,
  'a non-member cannot read AI drafts');
select is((select count(*) from public.follow_ups), 0::bigint,
  'a non-member cannot read follow-ups');
select is((select count(*) from public.ai_usage_events), 0::bigint,
  'a non-member cannot read usage events');
select throws_ok(
  $$select count(*) from public.audit_events$$,
  '42501',
  null,
  'a non-member has no direct access to audit events'
);

set local request.jwt.claim.sub = '00000000-0000-4000-8000-0000000000a1';

select lives_ok(
  $$insert into public.leads (workspace_id, display_name)
    values ('10000000-0000-4000-8000-0000000000a1', 'Created by A')$$,
  'a workspace member can create a lead'
);
select is(
  (select created_by from public.leads where display_name = 'Created by A'),
  '00000000-0000-4000-8000-0000000000a1'::uuid,
  'lead creator defaults to the authenticated user'
);
select lives_ok(
  $$update public.leads set stage = 'contacted'
    where id = '20000000-0000-4000-8000-0000000000a1'$$,
  'a workspace member can update a lead'
);
select lives_ok(
  $$update public.leads set display_name = 'Tampered by A'
    where id = '20000000-0000-4000-8000-0000000000b2'$$,
  'an update targeting another workspace affects no rows'
);
select throws_ok(
  $$insert into public.leads (workspace_id, display_name)
    values ('10000000-0000-4000-8000-0000000000b2', 'Cross-tenant lead')$$,
  '42501',
  null,
  'a member cannot create a lead in another workspace'
);
select throws_ok(
  $$insert into public.leads (workspace_id, display_name, created_by)
    values ('10000000-0000-4000-8000-0000000000a1', 'Spoofed creator',
      '00000000-0000-4000-8000-0000000000b2')$$,
  '42501',
  null,
  'a client cannot provide a forged lead creator'
);
select throws_ok(
  $$update public.leads set workspace_id = '10000000-0000-4000-8000-0000000000b2'
    where id = '20000000-0000-4000-8000-0000000000a1'$$,
  '42501',
  null,
  'a client cannot move a lead to another workspace'
);
select throws_ok(
  $$delete from public.leads where id = '20000000-0000-4000-8000-0000000000a1'$$,
  '42501',
  null,
  'a client cannot hard-delete a lead'
);
select lives_ok(
  $$insert into public.lead_activities
    (workspace_id, lead_id, activity_type, body)
    values ('10000000-0000-4000-8000-0000000000a1',
      '20000000-0000-4000-8000-0000000000a1', 'note', 'Member note')$$,
  'a member can append activity to a lead in their workspace'
);
select is(
  (select created_by from public.lead_activities where body = 'Member note'),
  '00000000-0000-4000-8000-0000000000a1'::uuid,
  'activity creator defaults to the authenticated user'
);
select throws_ok(
  $$insert into public.lead_activities
    (workspace_id, lead_id, activity_type, body)
    values ('10000000-0000-4000-8000-0000000000a1',
      '20000000-0000-4000-8000-0000000000b2', 'note', 'Mismatched lead')$$,
  '23503',
  null,
  'a child activity cannot reference a lead in another workspace'
);
select throws_ok(
  $$update public.lead_activities set body = 'Edited note'
    where id = '30000000-0000-4000-8000-0000000000a1'$$,
  '42501',
  null,
  'normal clients cannot update append-only activities'
);
select throws_ok(
  $$delete from public.lead_activities
    where id = '30000000-0000-4000-8000-0000000000a1'$$,
  '42501',
  null,
  'normal clients cannot delete append-only activities'
);
select lives_ok(
  $$update public.business_profiles set business_name = 'Business A Updated'
    where id = '40000000-0000-4000-8000-0000000000a1'$$,
  'a workspace member can update their business profile'
);
select is(
  (select updated_by from public.business_profiles
   where id = '40000000-0000-4000-8000-0000000000a1'),
  '00000000-0000-4000-8000-0000000000a1'::uuid,
  'business profile updates record the authenticated editor'
);
select is(
  (select count(*) from public.business_profiles
   where workspace_id = '10000000-0000-4000-8000-0000000000b2'),
  0::bigint,
  'a member cannot read another workspace business profile'
);
select throws_ok(
  $$insert into public.business_profiles (workspace_id, business_name)
    values ('10000000-0000-4000-8000-0000000000b2', 'Cross-tenant profile')$$,
  '42501',
  null,
  'a member cannot create a profile in another workspace'
);
select lives_ok(
  $$insert into public.follow_ups
    (workspace_id, lead_id, due_at, note)
    values ('10000000-0000-4000-8000-0000000000a1',
      '20000000-0000-4000-8000-0000000000a1', now(), 'Member follow-up')$$,
  'a workspace member can create a follow-up'
);
select is(
  (select created_by from public.follow_ups where note = 'Member follow-up'),
  '00000000-0000-4000-8000-0000000000a1'::uuid,
  'follow-up creator defaults to the authenticated user'
);
select is(
  (select status from public.follow_ups where note = 'Member follow-up'),
  'pending'::text,
  'new follow-ups default to pending'
);
select lives_ok(
  $$update public.follow_ups set status = 'completed'
    where id = '60000000-0000-4000-8000-0000000000a1'$$,
  'a workspace member can complete a follow-up'
);
select is(
  (select completed_by from public.follow_ups
   where id = '60000000-0000-4000-8000-0000000000a1'),
  '00000000-0000-4000-8000-0000000000a1'::uuid,
  'follow-up completion records the authenticated user'
);
select ok(
  (select completed_at is not null from public.follow_ups
   where id = '60000000-0000-4000-8000-0000000000a1'),
  'follow-up completion is timestamped'
);
select throws_ok(
  $$delete from public.follow_ups
    where id = '60000000-0000-4000-8000-0000000000a1'$$,
  '42501',
  null,
  'a client cannot hard-delete a follow-up'
);
select throws_ok(
  $$insert into public.ai_drafts
    (workspace_id, lead_id, purpose, tone, language, draft_text, created_by)
    values ('10000000-0000-4000-8000-0000000000a1',
      '20000000-0000-4000-8000-0000000000a1', 'follow-up', 'friendly',
      'en', 'Forged draft', '00000000-0000-4000-8000-0000000000a1')$$,
  '42501',
  null,
  'AI drafts can only be written by trusted server operations'
);
select throws_ok(
  $$update public.ai_drafts set draft_text = 'Client edit'
    where id = '50000000-0000-4000-8000-0000000000a1'$$,
  '42501',
  null,
  'AI draft changes cannot bypass trusted review operations'
);
select throws_ok(
  $$insert into public.ai_usage_events (workspace_id, user_id, status)
    values ('10000000-0000-4000-8000-0000000000a1',
      '00000000-0000-4000-8000-0000000000a1', 'succeeded')$$,
  '42501',
  null,
  'clients cannot forge AI usage events'
);
select throws_ok(
  $$insert into public.audit_events (workspace_id, event_type)
    values ('10000000-0000-4000-8000-0000000000a1', 'forged.event')$$,
  '42501',
  null,
  'clients cannot write audit events'
);

set local request.jwt.claim.sub = '00000000-0000-4000-8000-0000000000b2';
select is(
  (select business_name from public.business_profiles
   where id = '40000000-0000-4000-8000-0000000000b2'),
  'Business B',
  'user B business profile was not changed by user A'
);
select is(
  (select display_name from public.leads
   where id = '20000000-0000-4000-8000-0000000000b2'),
  'Lead B',
  'user B lead was not changed by user A'
);

select * from finish();
rollback;
