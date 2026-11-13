-- Run once in the Supabase SQL editor of your project.
-- One row per interview. No sign-in: anyone holding the project's publishable key can read and write.

create table if not exists public.interviews (
  id      text   primary key,
  data    jsonb  not null,
  updated bigint not null default 0
);

alter table public.interviews enable row level security;

grant select, insert, update on public.interviews to anon, authenticated;

drop policy if exists "team reads"   on public.interviews;
drop policy if exists "team inserts" on public.interviews;
drop policy if exists "team updates" on public.interviews;

create policy "team reads"   on public.interviews for select to anon, authenticated using (true);
create policy "team inserts" on public.interviews for insert to anon, authenticated with check (true);
create policy "team updates" on public.interviews for update to anon, authenticated using (true) with check (true);

-- No delete policy on purpose: the app marks an interview as deleted instead of removing the row.
