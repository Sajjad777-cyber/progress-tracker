create extension if not exists pgcrypto;

create type public.workspace_role as enum ('owner', 'admin', 'editor', 'viewer');
create type public.tracker_status as enum ('active', 'completed', 'archived');
create type public.tracker_mode as enum ('task', 'numeric', 'milestone', 'manual', 'habit', 'mixed');
create type public.task_status as enum ('todo', 'in_progress', 'done', 'cancelled');
create type public.priority_level as enum ('low', 'medium', 'high', 'urgent');
create type public.milestone_status as enum ('planned', 'in_progress', 'completed', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  timezone text not null default 'UTC',
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.workspace_role not null default 'viewer',
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table public.trackers (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete restrict,
  name text not null check (char_length(name) between 1 and 160),
  description text,
  category text,
  icon text,
  color text,
  mode public.tracker_mode not null default 'task',
  status public.tracker_status not null default 'active',
  start_date date,
  target_date date,
  configuration jsonb not null default '{}'::jsonb,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (target_date is null or start_date is null or target_date >= start_date)
);

create table public.tracker_fields (
  id uuid primary key default gen_random_uuid(),
  tracker_id uuid not null references public.trackers(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  field_key text not null check (field_key ~ '^[a-z0-9_]+$'),
  field_type text not null check (field_type in ('text', 'long_text', 'number', 'boolean', 'date', 'single_select', 'multi_select', 'url', 'currency', 'percentage', 'rating', 'checkbox', 'status')),
  description text,
  is_required boolean not null default false,
  position integer not null default 0 check (position >= 0),
  validation jsonb not null default '{}'::jsonb,
  display jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tracker_id, field_key)
);

create table public.tracker_field_options (
  id uuid primary key default gen_random_uuid(),
  field_id uuid not null references public.tracker_fields(id) on delete cascade,
  label text not null,
  value text not null,
  position integer not null default 0 check (position >= 0),
  unique (field_id, value)
);

create table public.tracker_entries (
  id uuid primary key default gen_random_uuid(),
  tracker_id uuid not null references public.trackers(id) on delete cascade,
  recorded_by uuid not null references auth.users(id) on delete restrict,
  recorded_on date not null default current_date,
  value jsonb not null default '{}'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  tracker_id uuid not null references public.trackers(id) on delete cascade,
  parent_task_id uuid references public.tasks(id) on delete set null,
  assigned_to uuid references auth.users(id) on delete set null,
  created_by uuid not null references auth.users(id) on delete restrict,
  title text not null check (char_length(title) between 1 and 240),
  description text,
  status public.task_status not null default 'todo',
  priority public.priority_level not null default 'medium',
  due_date date,
  start_date date,
  estimated_minutes integer check (estimated_minutes is null or estimated_minutes > 0),
  actual_minutes integer check (actual_minutes is null or actual_minutes >= 0),
  tags text[] not null default '{}',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (due_date is null or start_date is null or due_date >= start_date)
);

create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  tracker_id uuid not null references public.trackers(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete restrict,
  name text not null check (char_length(name) between 1 and 200),
  description text,
  status public.milestone_status not null default 'planned',
  due_date date,
  weight numeric(12, 4) not null default 1 check (weight > 0),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.progress_events (
  id uuid primary key default gen_random_uuid(),
  tracker_id uuid not null references public.trackers(id) on delete cascade,
  actor_id uuid not null references auth.users(id) on delete restrict,
  event_type text not null,
  entity_type text,
  entity_id uuid,
  before_value jsonb,
  after_value jsonb,
  created_at timestamptz not null default now()
);

create table public.tracker_templates (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  name text not null check (char_length(name) between 1 and 160),
  description text,
  category text,
  configuration jsonb not null default '{}'::jsonb,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((is_system and workspace_id is null) or not is_system)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete cascade,
  tracker_id uuid references public.trackers(id) on delete cascade,
  notification_type text not null,
  title text not null,
  body text,
  read_at timestamptz,
  dedupe_key text,
  created_at timestamptz not null default now(),
  unique (user_id, dedupe_key)
);

create table public.ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  feature text not null,
  provider text not null,
  model text,
  input_tokens integer check (input_tokens is null or input_tokens >= 0),
  output_tokens integer check (output_tokens is null or output_tokens >= 0),
  created_at timestamptz not null default now()
);

create index trackers_workspace_status_idx on public.trackers(workspace_id, status);
create index tracker_fields_tracker_position_idx on public.tracker_fields(tracker_id, position);
create index tracker_entries_tracker_date_idx on public.tracker_entries(tracker_id, recorded_on desc);
create index tasks_tracker_status_due_idx on public.tasks(tracker_id, status, due_date);
create index milestones_tracker_status_due_idx on public.milestones(tracker_id, status, due_date);
create index progress_events_tracker_created_idx on public.progress_events(tracker_id, created_at desc);
create index notifications_user_read_idx on public.notifications(user_id, read_at, created_at desc);
create index ai_usage_user_created_idx on public.ai_usage(user_id, created_at desc);

create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.workspace_members where workspace_id = target_workspace_id and user_id = auth.uid()); $$;

create or replace function public.workspace_role(target_workspace_id uuid)
returns public.workspace_role language sql stable security definer set search_path = public
as $$ select role from public.workspace_members where workspace_id = target_workspace_id and user_id = auth.uid(); $$;

grant execute on function public.is_workspace_member(uuid) to authenticated;
grant execute on function public.workspace_role(uuid) to authenticated;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$ begin insert into public.profiles (id, display_name) values (new.id, coalesce(new.raw_user_meta_data ->> 'name', new.email)); return new; end; $$;

create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.trackers enable row level security;
alter table public.tracker_fields enable row level security;
alter table public.tracker_field_options enable row level security;
alter table public.tracker_entries enable row level security;
alter table public.tasks enable row level security;
alter table public.milestones enable row level security;
alter table public.progress_events enable row level security;
alter table public.tracker_templates enable row level security;
alter table public.notifications enable row level security;
alter table public.ai_usage enable row level security;

create policy profiles_select_own on public.profiles for select using (id = auth.uid());
create policy profiles_update_own on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy workspaces_select_member on public.workspaces for select using (public.is_workspace_member(id));
create policy workspaces_insert_owner on public.workspaces for insert with check (created_by = auth.uid());
create policy workspaces_update_admin on public.workspaces for update using (public.workspace_role(id) in ('owner', 'admin')) with check (public.workspace_role(id) in ('owner', 'admin'));
create policy workspaces_delete_owner on public.workspaces for delete using (public.workspace_role(id) = 'owner');
create policy members_select_member on public.workspace_members for select using (public.is_workspace_member(workspace_id));
create policy members_insert_admin on public.workspace_members for insert with check (public.workspace_role(workspace_id) in ('owner', 'admin') or (role = 'owner' and user_id = auth.uid() and exists (select 1 from public.workspaces w where w.id = workspace_id and w.created_by = auth.uid())));
create policy members_update_admin on public.workspace_members for update using (public.workspace_role(workspace_id) in ('owner', 'admin')) with check (public.workspace_role(workspace_id) in ('owner', 'admin'));
create policy members_delete_admin on public.workspace_members for delete using (public.workspace_role(workspace_id) in ('owner', 'admin'));
create policy trackers_select_member on public.trackers for select using (public.is_workspace_member(workspace_id));
create policy trackers_insert_editor on public.trackers for insert with check (public.workspace_role(workspace_id) in ('owner', 'admin', 'editor') and created_by = auth.uid());
create policy trackers_update_editor on public.trackers for update using (public.workspace_role(workspace_id) in ('owner', 'admin', 'editor')) with check (public.workspace_role(workspace_id) in ('owner', 'admin', 'editor'));
create policy trackers_delete_admin on public.trackers for delete using (public.workspace_role(workspace_id) in ('owner', 'admin'));
create policy tracker_fields_member on public.tracker_fields for select using (exists (select 1 from public.trackers t where t.id = tracker_id and public.is_workspace_member(t.workspace_id)));
create policy tracker_fields_editor on public.tracker_fields for all using (exists (select 1 from public.trackers t where t.id = tracker_id and public.workspace_role(t.workspace_id) in ('owner', 'admin', 'editor'))) with check (exists (select 1 from public.trackers t where t.id = tracker_id and public.workspace_role(t.workspace_id) in ('owner', 'admin', 'editor')));
create policy field_options_member on public.tracker_field_options for select using (exists (select 1 from public.tracker_fields f join public.trackers t on t.id = f.tracker_id where f.id = field_id and public.is_workspace_member(t.workspace_id)));
create policy field_options_editor on public.tracker_field_options for all using (exists (select 1 from public.tracker_fields f join public.trackers t on t.id = f.tracker_id where f.id = field_id and public.workspace_role(t.workspace_id) in ('owner', 'admin', 'editor'))) with check (exists (select 1 from public.tracker_fields f join public.trackers t on t.id = f.tracker_id where f.id = field_id and public.workspace_role(t.workspace_id) in ('owner', 'admin', 'editor')));
create policy entries_member on public.tracker_entries for select using (exists (select 1 from public.trackers t where t.id = tracker_id and public.is_workspace_member(t.workspace_id)));
create policy entries_editor on public.tracker_entries for all using (exists (select 1 from public.trackers t where t.id = tracker_id and public.workspace_role(t.workspace_id) in ('owner', 'admin', 'editor'))) with check (recorded_by = auth.uid() and exists (select 1 from public.trackers t where t.id = tracker_id and public.workspace_role(t.workspace_id) in ('owner', 'admin', 'editor')));
create policy tasks_member on public.tasks for select using (exists (select 1 from public.trackers t where t.id = tracker_id and public.is_workspace_member(t.workspace_id)));
create policy tasks_editor on public.tasks for all using (exists (select 1 from public.trackers t where t.id = tracker_id and public.workspace_role(t.workspace_id) in ('owner', 'admin', 'editor'))) with check (created_by = auth.uid() and exists (select 1 from public.trackers t where t.id = tracker_id and public.workspace_role(t.workspace_id) in ('owner', 'admin', 'editor')));
create policy milestones_member on public.milestones for select using (exists (select 1 from public.trackers t where t.id = tracker_id and public.is_workspace_member(t.workspace_id)));
create policy milestones_editor on public.milestones for all using (exists (select 1 from public.trackers t where t.id = tracker_id and public.workspace_role(t.workspace_id) in ('owner', 'admin', 'editor'))) with check (created_by = auth.uid() and exists (select 1 from public.trackers t where t.id = tracker_id and public.workspace_role(t.workspace_id) in ('owner', 'admin', 'editor')));
create policy progress_events_member on public.progress_events for select using (exists (select 1 from public.trackers t where t.id = tracker_id and public.is_workspace_member(t.workspace_id)));
create policy progress_events_editor on public.progress_events for insert with check (actor_id = auth.uid() and exists (select 1 from public.trackers t where t.id = tracker_id and public.workspace_role(t.workspace_id) in ('owner', 'admin', 'editor')));
create policy templates_member on public.tracker_templates for select using (is_system or public.is_workspace_member(workspace_id));
create policy templates_editor on public.tracker_templates for all using (not is_system and public.workspace_role(workspace_id) in ('owner', 'admin', 'editor')) with check (not is_system and created_by = auth.uid() and public.workspace_role(workspace_id) in ('owner', 'admin', 'editor'));
create policy notifications_own on public.notifications for select using (user_id = auth.uid());
create policy notifications_update_own on public.notifications for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy ai_usage_own on public.ai_usage for select using (user_id = auth.uid());
create policy ai_usage_insert_own on public.ai_usage for insert with check (user_id = auth.uid());
