-- Китобхона: РЕЙТИНГДА АЛДАШНИНГ ОЛДИНИ ГИРИШ (ҳисоби ҳалол)
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Такроран ишлатиш мумкин.
-- Талаб: sql-aloqa (read_stats, track_read), sql-huquq (has_perm), sql-reyting (rating_pool, leaderboard).
--
-- Қоидаҳо (сервер):
--  1. «Ҳамён» (read_budget): ҳар сонияи ҳақиқӣ = 1 сония ҳақ. Ибтидо 2 соат (барои кӯҳна корбарон ва бе интернет хондагон), ҳадди аксар 24 соат.
--     Телефон аз вақти гузашта зиёд «хондам» гӯяд — зиёдаш ҳисоб намешавад ва «огоҳӣ» (strike) сабт мешавад.
--  2. Рӯзона: ҳадди оддӣ 8 соат (28800 сония). Агар 7 рӯзи охир огоҳӣ набошад («ҳалол») — то 16 соат (57600).
--  3. Идоракунӣ: suspicious_readers() — рӯйхати шубҳаноклар; set_rating_ban() — аз рейтинг дур кардан (фақат админ).

alter table public.profiles add column if not exists rating_ban boolean not null default false;

create table if not exists public.read_budget (
  user_id uuid primary key,
  tokens numeric not null default 7200,
  at timestamptz not null default now()
);
create table if not exists public.read_strikes (
  id bigserial primary key,
  user_id uuid not null,
  at timestamptz not null default now(),
  kind text not null,
  claimed int,
  allowed int
);
create index if not exists read_strikes_user on public.read_strikes (user_id, at desc);
alter table public.read_budget enable row level security;
alter table public.read_strikes enable row level security;

create or replace function public.track_read(p_sec int, p_book bigint) returns void
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  d date := (now() at time zone 'utc')::date;
  s int := least(greatest(coalesce(p_sec, 0), 0), 3600);
  b public.read_budget%rowtype; tk numeric; today bigint; cap int; clean boolean;
begin
  if uid is null or p_book is null then return; end if;
  insert into public.active_days (user_id, day) values (uid, d) on conflict do nothing;
  if s = 0 then return; end if;
  insert into public.read_budget (user_id) values (uid) on conflict do nothing;
  select * into b from public.read_budget where user_id = uid for update;
  tk := least(86400, b.tokens + extract(epoch from (now() - b.at)));
  if s > tk + 60 then
    insert into public.read_strikes (user_id, kind, claimed, allowed) values (uid, 'fast', s, floor(tk)::int);
  end if;
  s := least(s, greatest(floor(tk), 0)::int);
  clean := not exists (select 1 from public.read_strikes where user_id = uid and at > now() - interval '7 days');
  cap := case when clean then 57600 else 28800 end;
  select coalesce(sum(sec), 0) into today from public.read_stats where user_id = uid and day = d;
  s := least(s, greatest(cap - today, 0)::int);
  update public.read_budget set tokens = greatest(tk - s, 0), at = now() where user_id = uid;
  if s = 0 then return; end if;
  insert into public.read_stats (user_id, day, book_id, sec) values (uid, d, p_book, s)
  on conflict (user_id, day, book_id) do update set sec = public.read_stats.sec + excluded.sec;
end $$;
revoke all on function public.track_read(int, bigint) from public, anon;
grant execute on function public.track_read(int, bigint) to authenticated;

-- Рейтингдан дур кардашудагон (rating_ban) рейтингда нестанд
create or replace function public.rating_pool(p_days int default null)
returns table(id uuid, name text, avatar text, bio text, created_at timestamptz, sec bigint)
language sql stable security definer set search_path = public as $$
  select p.id, p.name, p.avatar, p.bio, p.created_at, coalesce(sum(s.sec), 0)::bigint
    from public.profiles p
    left join public.read_stats s on s.user_id = p.id and (p_days is null or s.day >= current_date - (greatest(p_days, 1) - 1))
   where p.deleted_at is null and not p.hide_rating and not p.rating_ban
   group by p.id, p.name, p.avatar, p.bio, p.created_at
$$;
revoke all on function public.rating_pool(int) from public, anon, authenticated;

-- Шубҳаноклар: огоҳӣ дошта ё дар як рӯз 6+ соат хондагон (p_days рӯзи охир). Почта нест.
create or replace function public.suspicious_readers(p_days int default 7)
returns table(user_id uuid, name text, total_sec bigint, max_day_sec bigint, strikes bigint, last_strike timestamptz, banned boolean)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.has_perm('stats') then raise exception 'иҷозат нест'; end if;
  return query
  with days as (
    select s.user_id as uid, s.day, sum(s.sec)::bigint as sec from public.read_stats s
     where s.day >= current_date - (greatest(coalesce(p_days, 7), 1) - 1) group by s.user_id, s.day
  ), a as (
    select uid, sum(sec)::bigint as tot, max(sec)::bigint as mx from days group by uid
  ), k as (
    select r.user_id as uid, count(*)::bigint as n, max(r.at) as last from public.read_strikes r
     where r.at >= now() - (greatest(coalesce(p_days, 7), 1) || ' days')::interval group by r.user_id
  )
  select p.id, p.name, coalesce(a.tot, 0), coalesce(a.mx, 0), coalesce(k.n, 0), k.last, p.rating_ban
    from public.profiles p
    left join a on a.uid = p.id left join k on k.uid = p.id
   where p.deleted_at is null and (coalesce(k.n, 0) > 0 or coalesce(a.mx, 0) >= 21600)
   order by coalesce(k.n, 0) desc, coalesce(a.mx, 0) desc
   limit 50;
end $$;
revoke all on function public.suspicious_readers(int) from public, anon;
grant execute on function public.suspicious_readers(int) to authenticated;

create or replace function public.set_rating_ban(p_id uuid, p_ban boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'иҷозат нест'; end if;
  update public.profiles set rating_ban = coalesce(p_ban, false) where id = p_id;
end $$;
revoke all on function public.set_rating_ban(uuid, boolean) from public, anon;
grant execute on function public.set_rating_ban(uuid, boolean) to authenticated;
