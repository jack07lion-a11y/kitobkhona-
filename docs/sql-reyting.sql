-- Китобхона: РЕЙТИНГ (дақиқаҳои хондан) ва ҲИСОБРО НЕСТ КАРДАН БО ТИКЛАШ (30 рӯз)
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Такроран ишлатиш мумкин.
-- Талаб: sql-nomho (profiles), sql-aloqa (read_stats), sql-admin (is_admin), sql-maxfiyat (delete_me — ин файл онро иваз мекунад).
--
-- Рейтинг: ҳамаи вақт, дақиқаҳои хондан (read_stats.sec) аз рӯи кам шудан; баробар бошад — кӣ пештар сабт шудааст, баландтар.
--   • Ҳисоби нест шуда ва «дар рейтинг нишон надиҳед» интихобкарда рейтингда нест.
--   • 0 дақиқа хондагон рейтингда нестанд (ҷой надоранд).
--   • Рейтингро танҳо корбари воридшуда мебинад (меҳмон не).
-- Нест кардани ҳисоб: ҲИСОБ ДАРҲОЛ БАСТА МЕШАВАД (кириш манъ), аммо маълумот 30 рӯз мемонад — фақат АДМИН тикланида метавонад.
--   30 рӯзи гузашта админ «пурра тоза кардан»-ро пахш мекунад (purge_deleted) — маълумот ҳамеша нест мешавад.

alter table public.profiles add column if not exists deleted_at timestamptz;
alter table public.profiles add column if not exists hide_rating boolean not null default false;

-- Дохилӣ: рейтинги умумӣ (ё p_days рӯзи охир). Ба корбарон мустақим дода намешавад.
create or replace function public.rating_pool(p_days int default null)
returns table(id uuid, name text, avatar text, bio text, created_at timestamptz, sec bigint)
language sql stable security definer set search_path = public as $$
  select p.id, p.name, p.avatar, p.bio, p.created_at, sum(s.sec)::bigint
    from public.profiles p join public.read_stats s on s.user_id = p.id
   where p.deleted_at is null and not p.hide_rating
     and (p_days is null or s.day >= current_date - (greatest(p_days, 1) - 1))
   group by p.id, p.name, p.avatar, p.bio, p.created_at
  having sum(s.sec) > 0
$$;
revoke all on function public.rating_pool(int) from public, anon, authenticated;

-- Рӯйхати беҳтаринҳо (пешфарз 10, ҳадди аксар 50)
create or replace function public.leaderboard(p_limit int default 10, p_days int default null)
returns table(pos bigint, name text, avatar text, bio text, sec bigint)
language sql stable security definer set search_path = public as $$
  select row_number() over (order by r.sec desc, r.created_at asc, r.id) as pos, r.name, r.avatar, r.bio, r.sec
    from public.rating_pool(p_days) r
   where auth.uid() is not null
   order by pos
   limit least(greatest(coalesce(p_limit, 10), 1), 50)
$$;
revoke all on function public.leaderboard(int, int) from public, anon;
grant execute on function public.leaderboard(int, int) to authenticated;

-- Ҷои худи корбар: {pos, sec, n} | {hidden:true} | {deleted:true}
create or replace function public.my_rank(p_days int default null) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare uid uuid := auth.uid(); me public.profiles%rowtype; v_sec bigint; v_pos bigint; v_n bigint;
begin
  if uid is null then return jsonb_build_object('pos', null); end if;
  select * into me from public.profiles where id = uid;
  if not found then return jsonb_build_object('pos', null, 'sec', 0); end if;
  if me.deleted_at is not null then return jsonb_build_object('deleted', true); end if;
  select coalesce(sum(s.sec), 0) into v_sec from public.read_stats s
   where s.user_id = uid and (p_days is null or s.day >= current_date - (greatest(p_days, 1) - 1));
  select count(*) into v_n from public.rating_pool(p_days);
  if me.hide_rating then return jsonb_build_object('hidden', true, 'sec', v_sec, 'n', v_n); end if;
  if v_sec = 0 then return jsonb_build_object('pos', null, 'sec', 0, 'n', v_n); end if;
  select count(*) + 1 into v_pos from public.rating_pool(p_days) r
   where r.sec > v_sec or (r.sec = v_sec and (r.created_at < me.created_at or (r.created_at = me.created_at and r.id < uid)));
  return jsonb_build_object('pos', v_pos, 'sec', v_sec, 'n', v_n);
end $$;
revoke all on function public.my_rank(int) from public, anon;
grant execute on function public.my_rank(int) to authenticated;

-- «Дар рейтинг нишон дода шавам» (пешфарз ҳа)
create or replace function public.set_rating_visible(p_show boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  update public.profiles set hide_rating = not coalesce(p_show, true) where id = auth.uid();
end $$;
revoke all on function public.set_rating_visible(boolean) from public, anon;
grant execute on function public.set_rating_visible(boolean) to authenticated;

-- Ҳисобро нест кардан: БАСТА (кириш манъ, рейтингдан ғоиб), маълумот 30 рӯз мемонад. Админ худро нест карда наметавонад.
-- banned_until: Supabase Auth кирдан ва навсозии сессияро манъ мекунад.
create or replace function public.delete_me() returns void
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'not signed in'; end if;
  if public.is_admin() then raise exception 'admin_cannot_delete'; end if;
  update public.profiles set deleted_at = now() where id = uid;
  update auth.users set banned_until = now() + interval '100 years' where id = uid;
end $$;
revoke all on function public.delete_me() from public, anon;
grant execute on function public.delete_me() to authenticated;

-- ===== Танҳо АДМИН =====
create or replace function public.deleted_list()
returns table(id uuid, name text, email text, deleted_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  return query select p.id, p.name, u.email::text, p.deleted_at
    from public.profiles p join auth.users u on u.id = p.id
   where p.deleted_at is not null order by p.deleted_at desc;
end $$;
revoke all on function public.deleted_list() from public, anon;
grant execute on function public.deleted_list() to authenticated;

create or replace function public.restore_account(p_id uuid) returns text
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  update public.profiles set deleted_at = null where id = p_id and deleted_at is not null;
  if not found then return 'not_found'; end if;
  update auth.users set banned_until = null where id = p_id;
  return 'ok';
end $$;
revoke all on function public.restore_account(uuid) from public, anon;
grant execute on function public.restore_account(uuid) to authenticated;

-- Пурра тоза кардан: p_days (пешфарз 30) рӯз аз нест кардан гузашта. Ҳамаи маълумоти корбар нест мешавад. Бармегардонад: шумораи ҳисобҳо.
create or replace function public.purge_deleted(p_days int default 30) returns int
language plpgsql security definer set search_path = public as $$
declare ids uuid[]; n int;
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  select coalesce(array_agg(p.id), '{}') into ids from public.profiles p
   where p.deleted_at is not null and p.deleted_at < now() - make_interval(days => greatest(coalesce(p_days, 30), 0));
  n := coalesce(array_length(ids, 1), 0);
  if n = 0 then return 0; end if;
  delete from public.read_stats where user_id = any(ids);
  delete from public.active_days where user_id = any(ids);
  delete from public.error_log where user_id = any(ids);
  delete from public.reports where user_id = any(ids);
  if to_regclass('public.user_state') is not null then execute 'delete from public.user_state where user_id = any($1)' using ids; end if;
  begin
    delete from storage.objects where bucket_id in ('avatars','reports') and (storage.foldername(name))[1] = any (select unnest(ids)::text);
  exception when others then null;
  end;
  delete from auth.users where id = any(ids);
  return n;
end $$;
revoke all on function public.purge_deleted(int) from public, anon;
grant execute on function public.purge_deleted(int) to authenticated;
