-- Китобхона: ҲИСОБИ НЕСТШУДАРО ТИКЛАШ — админ ВА ЁРДАМЧӢ, ҲАР ВАҚТ (муҳлат нест)
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Такроран ишлатиш мумкин. Талаб: sql-reyting.sql, sql-poadmin.sql (is_staff).
-- Пештар фақат админ тикла мекард. Ҳоло админ ва ёрдамчӣ ҳам. «purge_deleted» (пурра тоза кардан) дар барнома нест, ҳеч гоҳ худкор иҷро намешавад.

create or replace function public.deleted_list()
returns table(id uuid, name text, email text, deleted_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_staff() then raise exception 'forbidden'; end if;
  return query select p.id, p.name, u.email::text, p.deleted_at
    from public.profiles p join auth.users u on u.id = p.id
   where p.deleted_at is not null order by p.deleted_at desc;
end $$;
revoke all on function public.deleted_list() from public, anon;
grant execute on function public.deleted_list() to authenticated;

create or replace function public.restore_account(p_id uuid) returns text
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_staff() then raise exception 'forbidden'; end if;
  update public.profiles set deleted_at = null where id = p_id and deleted_at is not null;
  if not found then return 'not_found'; end if;
  update auth.users set banned_until = null where id = p_id;
  return 'ok';
end $$;
revoke all on function public.restore_account(uuid) from public, anon;
grant execute on function public.restore_account(uuid) to authenticated;

-- Админ ВА ёрдамчӣ ҳисоби худро нест карда наметавонанд (асосгузорон ва роҳбарият)
create or replace function public.delete_me() returns void
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'not signed in'; end if;
  if public.is_staff() then raise exception 'admin_cannot_delete'; end if;
  update public.profiles set deleted_at = now() where id = uid;
  update auth.users set banned_until = now() + interval '100 years' where id = uid;
end $$;
revoke all on function public.delete_me() from public, anon;
grant execute on function public.delete_me() to authenticated;
