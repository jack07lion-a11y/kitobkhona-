-- Китобхона: НАСБ ВА ВОРИДШАВӢ — дастгоҳҳое, ки барномаро кушодаанд, вале ҳанӯз ворид нашудаанд
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Такроран ишлатиш мумкин. Талаб: sql-metrika (app_installs, funnel), sql-huquq (has_perm).
--
-- Ҳар дастгоҳ (ID-и тасодуфӣ) бо ҳисоби воридшудааш пайваст мешавад (user_id). Ном ва почта ин ҷо нест.
--   installs_anon = дастгоҳҳое, ки дар p_days рӯзи охир бори аввал кушода шуданд ва ҳоло ҳам ҳеҷ ҳисобе пайваст нест (ворид нашудаанд).
--   Дастгоҳҳои кӯҳна то кушодани навбатӣ «ворид нашуда» мемонанд (пас аз навсозӣ як бор кушоданд — пайваст мешаванд).

alter table public.app_installs add column if not exists user_id uuid;
create index if not exists app_installs_user on public.app_installs (user_id);

create or replace function public.track_install(p_device text, p_native boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_device is null or char_length(p_device) not between 8 and 64 then return; end if;
  insert into public.app_installs(device, native, user_id) values (p_device, coalesce(p_native, false), auth.uid())
  on conflict (device) do update set last_seen = now(),
    native = public.app_installs.native or excluded.native,
    user_id = coalesce(excluded.user_id, public.app_installs.user_id);
end $$;
revoke all on function public.track_install(text, boolean) from public;
grant execute on function public.track_install(text, boolean) to anon, authenticated;

create or replace function public.funnel(p_days int default 30) returns jsonb
language plpgsql security definer set search_path = public as $$
declare d int := least(greatest(coalesce(p_days, 30), 1), 365); since timestamptz := now() - make_interval(days => d); r jsonb;
begin
  if not public.has_perm('stats') then raise exception 'forbidden'; end if;
  with c as (select id, created_at::date as day0 from public.profiles where created_at >= since)
  select jsonb_build_object(
    'days', d,
    'installs', (select count(*) from public.app_installs where first_seen >= since),
    'installs_apk', (select count(*) from public.app_installs where first_seen >= since and native),
    'installs_web', (select count(*) from public.app_installs where first_seen >= since and not native),
    'installs_anon', (select count(*) from public.app_installs where first_seen >= since and user_id is null),
    'installs_anon_apk', (select count(*) from public.app_installs where first_seen >= since and native and user_id is null),
    'registered', (select count(*) from c),
    'read1', (select count(*) from c where (select coalesce(sum(sec), 0) from public.read_stats s where s.user_id = c.id) >= 60),
    'back1', (select count(*) from c where exists (select 1 from public.active_days a where a.user_id = c.id and a.day >= c.day0 + 1)),
    'back7', (select count(*) from c where exists (select 1 from public.active_days a where a.user_id = c.id and a.day >= c.day0 + 7))
  ) into r;
  return r;
end $$;
revoke all on function public.funnel(int) from public, anon;
grant execute on function public.funnel(int) to authenticated;
