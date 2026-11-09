-- Китобхона: воронка (ўрнатган → рӯйхат → 1 дақиқа хондан → баргашт) барои админ
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Такроран ишлатиш мумкин. Талаб: sql-aloqa (read_stats, active_days), sql-huquq (has_perm 'stats').
-- «Ўрнатган» = дастгоҳ бори аввал барномаро кушод (дастгоҳ-ID тасодуфӣ, дар телефон нигоҳ дошта мешавад; шахси мушаххасро нишон намедиҳад).

create table if not exists public.app_installs (
  device text primary key check (char_length(device) between 8 and 64),
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  native boolean not null default false
);
alter table public.app_installs enable row level security;   -- бе сиёсат: фақат тавассути функсия

create or replace function public.track_install(p_device text, p_native boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_device is null or char_length(p_device) not between 8 and 64 then return; end if;
  insert into public.app_installs(device, native) values (p_device, coalesce(p_native, false))
  on conflict (device) do update set last_seen = now(), native = public.app_installs.native or excluded.native;
end $$;
revoke all on function public.track_install(text, boolean) from public;
grant execute on function public.track_install(text, boolean) to anon, authenticated;

-- Воронка барои p_days рӯзи охир. «Рӯйхат» = ҳисобҳое, ки дар ин давра сохта шуданд (кохорта);
-- read1 = аз ин кохорта дар маҷмӯъ ≥ 60 сония хондаанд; back1/back7 = рӯзи 1 ё баъдтар / рӯзи 7 ё баъдтар аз рӯзи сабти ном боз омадаанд.
create or replace function public.funnel(p_days int default 30) returns jsonb
language plpgsql security definer set search_path = public as $$
declare d int := least(greatest(coalesce(p_days, 30), 1), 365); since timestamptz := now() - make_interval(days => d); r jsonb;
begin
  if not public.has_perm('stats') then raise exception 'forbidden'; end if;
  with c as (select id, created_at::date as day0 from public.profiles where created_at >= since)
  select jsonb_build_object(
    'days', d,
    'installs', (select count(*) from public.app_installs where first_seen >= since),
    'registered', (select count(*) from c),
    'read1', (select count(*) from c where (select coalesce(sum(sec), 0) from public.read_stats s where s.user_id = c.id) >= 60),
    'back1', (select count(*) from c where exists (select 1 from public.active_days a where a.user_id = c.id and a.day >= c.day0 + 1)),
    'back7', (select count(*) from c where exists (select 1 from public.active_days a where a.user_id = c.id and a.day >= c.day0 + 7))
  ) into r;
  return r;
end $$;
revoke all on function public.funnel(int) from public, anon;
grant execute on function public.funnel(int) to authenticated;
