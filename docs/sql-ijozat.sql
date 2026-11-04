-- Китобхона: иҷозатҳои ёрдамчиён (админ ба ёрдамчӣ иҷозат медиҳад; пешфарз — ХОМӮШ)
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Фақат бир марта.

alter table public.profiles add column if not exists perms jsonb not null default '{}'::jsonb;

-- Админ иҷозатро фурӯзон/хомӯш мекунад (калидҳо: gender ва ғайра)
create or replace function public.set_perm(p_email text, p_key text, p_on boolean)
returns text language plpgsql security definer set search_path = public as $$
declare uid uuid;
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  select id into uid from auth.users where lower(email) = lower(trim(p_email));
  if uid is null then return 'no_user'; end if;
  update public.profiles set perms = jsonb_set(coalesce(perms, '{}'::jsonb), array[p_key], to_jsonb(p_on), true) where id = uid;
  return 'ok';
end $$;
revoke all on function public.set_perm(text, text, boolean) from public, anon;
grant execute on function public.set_perm(text, text, boolean) to authenticated;

-- Рӯйхати ёрдамчиён ҳоло иҷозатҳоро ҳам медиҳад
drop function if exists public.staff_list();
create or replace function public.staff_list() returns table(email text, name text, role text, perms jsonb)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  return query select u.email::text, p.name, p.role, coalesce(p.perms, '{}'::jsonb) from public.profiles p join auth.users u on u.id = p.id
    where p.role in ('admin','subadmin') order by p.role, p.name;
end $$;
revoke all on function public.staff_list() from public, anon;
grant execute on function public.staff_list() to authenticated;
