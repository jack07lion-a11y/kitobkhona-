-- Китобхона: номҳои беҳамто (Ҷасурбек, Ҷасурбек 1, Ҷасурбек 2 ...)
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Фақат бир марта.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  name_key text not null unique,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
drop policy if exists "own read" on public.profiles;
create policy "own read" on public.profiles for select using (auth.uid() = id);

create or replace function public.claim_name(p_name text)
returns text language plpgsql security definer set search_path = public as $$
declare
  base text := left(trim(p_name), 40);
  cand text; n int := 0; cur text; uid uuid := auth.uid();
begin
  if uid is null then raise exception 'not signed in'; end if;
  if base = '' then raise exception 'empty name'; end if;
  select name into cur from profiles where id = uid;
  if cur is not null then return cur; end if;
  loop
    cand := case when n = 0 then base else base || ' ' || n end;
    begin
      insert into profiles(id, name, name_key) values (uid, cand, lower(cand));
      return cand;
    exception when unique_violation then
      select name into cur from profiles where id = uid;
      if cur is not null then return cur; end if;
      n := n + 1;
    end;
  end loop;
end $$;

revoke all on function public.claim_name(text) from public, anon;
grant execute on function public.claim_name(text) to authenticated;
