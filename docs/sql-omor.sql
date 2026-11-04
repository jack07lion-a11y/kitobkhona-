-- Китобхона: омор (ҷамъи ба қайд гирифташудагон) ва тугмаи Премиум
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Фақат бир марта.

-- 1) Омор: фақат админ ва ёрдамчӣ мебинад
create or replace function public.user_stats() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare a int; s int; t int;
begin
  if not public.is_staff() then raise exception 'forbidden'; end if;
  select count(*) into t from auth.users;
  select count(*) filter (where role = 'admin'), count(*) filter (where role = 'subadmin') into a, s from public.profiles;
  return jsonb_build_object('admins', a, 'subadmins', s, 'users', greatest(t - a - s, 0), 'total', t);
end $$;
revoke all on function public.user_stats() from public, anon;
grant execute on function public.user_stats() to authenticated;

-- 2) Тугмаи Премиум (пешфарз ХОМӯШ: ҳама китобҳо ройгон, навиштаҳо пинҳон)
create table if not exists public.app_flags (
  id int primary key default 1 check (id = 1),
  premium_on boolean not null default false
);
insert into public.app_flags (id) values (1) on conflict (id) do nothing;
alter table public.app_flags enable row level security;
drop policy if exists "flags read" on public.app_flags;
create policy "flags read" on public.app_flags for select using (true);
grant select on public.app_flags to anon, authenticated;

create or replace function public.set_flag(p_key text, p_on boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  if p_key = 'premium' then update public.app_flags set premium_on = p_on where id = 1;
  else raise exception 'bad key'; end if;
end $$;
revoke all on function public.set_flag(text, boolean) from public, anon;
grant execute on function public.set_flag(text, boolean) to authenticated;
