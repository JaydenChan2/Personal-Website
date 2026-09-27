-- Activity tracker table. Paste into Supabase → SQL Editor → New query → Run.

create table if not exists public.activity_log (
  id          bigint generated always as identity primary key,
  activity    text        not null check (char_length(activity) between 1 and 32),
  created_at  timestamptz not null default now()
);

-- The summary always reads a time window, newest data last.
create index if not exists activity_log_created_at_idx on public.activity_log (created_at);

-- Lock the table down: with RLS on and no policies, the public "anon" key can't read
-- or write anything. Only the server, using the service-role key, can.
alter table public.activity_log enable row level security;

-- Optional: have the database reject unknown categories too. If you add this, remember
-- to update it whenever you add a category in content/activities.ts.
-- alter table public.activity_log add constraint activity_log_known_activity
--   check (activity in ('studying', 'building', 'badminton', 'social', 'stop'));
