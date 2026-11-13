-- Run once in the Supabase SQL editor of your project.
-- One row per interview. Only signed-in team members can read or write.

create table if not exists public.interviews (
  id      text   primary key,
  data    jsonb  not null,
  updated bigint not null default 0
);

alter table public.interviews enable row level security;

revoke all on public.interviews from anon;
grant select, insert, update on public.interviews to authenticated;

drop policy if exists "team reads"   on public.interviews;
drop policy if exists "team inserts" on public.interviews;
drop policy if exists "team updates" on public.interviews;

create policy "team reads"   on public.interviews for select to authenticated using (true);
create policy "team inserts" on public.interviews for insert to authenticated with check (true);
create policy "team updates" on public.interviews for update to authenticated using (true) with check (true);

-- No delete policy on purpose: the app marks an interview as deleted instead of removing the row.
