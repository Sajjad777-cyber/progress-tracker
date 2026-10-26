# ProgressOS database setup

Phase 3 adds the first Supabase schema in `supabase/migrations/202610260001_initial_schema.sql`.

## Local configuration

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` using the project values.
4. Apply the migration with the Supabase CLI or the SQL editor.
5. Enable the authentication providers required by the product, starting with email/password.
6. Run `pnpm dev` and test registration with a dedicated development account.

The publishable/anon key may be used in browser clients because database access is protected by RLS. Never place a service-role key in `.env.local` values that are exposed to the browser or in client components.

## Schema overview

The migration creates profiles, workspaces, workspace members, trackers, custom fields and options, entries, tasks, milestones, progress events, templates, notifications, and AI usage records.

Workspace access uses `owner`, `admin`, `editor`, and `viewer` roles. User-facing tables have RLS enabled. Policies authorize reads and writes through workspace membership and role checks. A security-definer helper is used to avoid recursive membership-policy checks.

A trigger creates a profile from new Supabase Auth users. The trigger stores only a display name derived from signup metadata or the email address.

## Verification checklist

- Confirm every migration succeeds before adding production data.
- Create two separate test users.
- Verify each user can only see their own workspace and authorized shared workspaces.
- Verify viewers cannot create or edit tracker content.
- Verify editors cannot manage workspace membership.
- Verify a user cannot access another user's tracker by changing a URL or request identifier.
- Keep development fixtures separate from production data.

The repository currently has no Supabase credentials, so migration execution and cross-user policy tests remain external setup steps for the next backend iteration.
