-- Китобхона: ЁРДАМЧИ — ДОИМИЙ ва НАВ (Бета). Доимийро бекор кардан душвор (сервер қулф мекунад).
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Такроран ишлатиш мумкин. Талаб: sql-poadmin.sql, sql-ijozat.sql (staff_list).
--
-- Қоида:
--   • Ёрдамчи «ДОИМИЙ» аст, агар staff_since холӣ бошад (ёрдамчиёни ҳозира, масалан Ҷумъаназар) ё аз таъин ≥ 30 рӯз гузашта бошад.
--   • «НАВ» (Бета) — <30 рӯз: админ онро фавран бардошта метавонад.
--   • Доимиро бардоштан: аввал request_staff_removal (оғози 60 сония), баъд ҳамон дам-60 сония set_role(...,'user') кор мекунад
--     (на пештар, на аз 10 дақиқа дертар); cancel_staff_removal ӯро қатъ мекунад. Ин аз тарафи СЕРВЕР тафтиш мешавад.

alter table public.profiles add column if not exists staff_since timestamptz;

-- Вақти таъин: ҳангоми ба «subadmin» гузаштан сабт мешавад, ҳангоми бардоштан тоза мешавад
create or replace function public.profiles_staff_since() returns trigger
language plpgsql as $$
begin
  if new.role = 'subadmin' and (tg_op = 'INSERT' or old.role is distinct from 'subadmin') then new.staff_since := now();
  elsif new.role <> 'subadmin' then new.staff_since := null; end if;
  return new;
end $$;
drop trigger if exists profiles_staff_since on public.profiles;
create trigger profiles_staff_since before insert or update of role on public.profiles
  for each row execute function public.profiles_staff_since();

create table if not exists public.staff_removal_requests (
  target uuid primary key references auth.users(id) on delete cascade,
  requested_by uuid not null,
  requested_at timestamptz not null default now()
);
alter table public.staff_removal_requests enable row level security;

-- Доимӣ: staff_since холӣ ё ≥ 30 рӯз
create or replace function public.is_permanent_staff(p_uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p
                  where p.id = p_uid and p.role = 'subadmin'
                    and (p.staff_since is null or p.staff_since <= now() - interval '30 days'))
$$;
revoke all on function public.is_permanent_staff(uuid) from public, anon, authenticated;

-- Рӯйхати ёрдамчиён: ҳоло «since» ва «permanent» ҳам
drop function if exists public.staff_list();
create or replace function public.staff_list() returns table(email text, name text, role text, perms jsonb, since timestamptz, permanent boolean)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  return query select u.email::text, p.name, p.role, coalesce(p.perms, '{}'::jsonb), p.staff_since,
                      (p.role = 'subadmin' and public.is_permanent_staff(p.id))
    from public.profiles p join auth.users u on u.id = p.id
   where p.role in ('admin','subadmin') order by p.role, p.name;
end $$;
revoke all on function public.staff_list() from public, anon;
grant execute on function public.staff_list() to authenticated;

-- Худи ёрдамчӣ: доимӣ ё нав?
create or replace function public.my_staff() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare me public.profiles%rowtype;
begin
  select * into me from public.profiles where id = auth.uid();
  if not found or me.role not in ('subadmin') then return jsonb_build_object('role', coalesce(me.role, 'user')); end if;
  return jsonb_build_object('role', me.role, 'permanent', public.is_permanent_staff(me.id), 'since', me.staff_since);
end $$;
revoke all on function public.my_staff() from public, anon;
grant execute on function public.my_staff() to authenticated;

-- Оғози бардоштани доимӣ (фақат админ)
create or replace function public.request_staff_removal(p_email text) returns text
language plpgsql security definer set search_path = public as $$
declare uid uuid;
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  select id into uid from auth.users where lower(email) = lower(trim(p_email));
  if uid is null then return 'no_user'; end if;
  if not exists (select 1 from public.profiles where id = uid and role = 'subadmin') then return 'not_subadmin'; end if;
  insert into public.staff_removal_requests(target, requested_by, requested_at) values (uid, auth.uid(), now())
    on conflict (target) do update set requested_by = auth.uid(), requested_at = now();
  return 'ok';
end $$;
revoke all on function public.request_staff_removal(text) from public, anon;
grant execute on function public.request_staff_removal(text) to authenticated;

create or replace function public.cancel_staff_removal(p_email text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  delete from public.staff_removal_requests where target = (select id from auth.users where lower(email) = lower(trim(p_email)));
end $$;
revoke all on function public.cancel_staff_removal(text) from public, anon;
grant execute on function public.cancel_staff_removal(text) to authenticated;

-- set_role: доимиро бардоштан танҳо баъди 60 сония (то 10 дақиқа) аз оғози дархост
create or replace function public.set_role(p_email text, p_role text) returns text
language plpgsql security definer set search_path = public as $$
declare uid uuid; cur text; req timestamptz;
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  if p_role not in ('user','subadmin') then raise exception 'bad role'; end if;
  select id into uid from auth.users where lower(email) = lower(trim(p_email));
  if uid is null then return 'no_user'; end if;
  select role into cur from public.profiles where id = uid;
  if not found then return 'no_profile'; end if;
  if cur = 'admin' then return 'is_admin'; end if;
  if p_role = 'user' and cur = 'subadmin' and public.is_permanent_staff(uid) then
    select requested_at into req from public.staff_removal_requests where target = uid;
    if req is null or req > now() - interval '60 seconds' or req < now() - interval '10 minutes' then
      raise exception 'permanent_staff';
    end if;
    delete from public.staff_removal_requests where target = uid;
  end if;
  update public.profiles set role = p_role where id = uid;
  return 'ok';
end $$;
revoke all on function public.set_role(text, text) from public, anon;
grant execute on function public.set_role(text, text) to authenticated;
