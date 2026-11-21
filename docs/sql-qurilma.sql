-- Китобхона: ДАСТГОҲ — телефони ҳақиқӣ, қайта насб, модел; Идоракунӣ → Омор
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Такроран ишлатиш мумкин. Талаб: sql-nasb (app_installs.user_id, funnel), sql-huquq (has_perm).
--
-- hw = ҳисоби яширини (SHA-256) рақами Android (ANDROID_ID): ҳамон як телефон ўчириб қайта насб шавад ҳам бир хил мемонад. Одамро нишон намедиҳад.
-- Ҳар насб (device) — сатри ҷудо; ҳамон hw бо ID-и нав = «қайта насб». Сайт/iPhone: hw нест (ҳар ID алоҳида ҳисоб мешавад).
--   phones       = телефонҳои ҲАҚИҚӢ (hw ё ID) аввалин маротиба дар p_days рӯзи охир
--   reinstalls   = ҳамон телефонҳои пештара, ки аз нав насб шуданд (дар ин давр)
--   phones_reg   = аз онҳо ақаллан як ҳисоб бо ворид шудааст; phones_anon = ҳеҷ гоҳ ворид нашудаанд
--   models       = телефонҳои нав аз рӯи модел (беҳтарин 8)

alter table public.app_installs add column if not exists hw text;
alter table public.app_installs add column if not exists model text;
alter table public.app_installs add column if not exists os text;
create index if not exists app_installs_hw on public.app_installs (hw);

drop function if exists public.track_install(text, boolean);
create or replace function public.track_install(p_device text, p_native boolean, p_hw text default null, p_model text default null, p_os text default null) returns void
language plpgsql security definer set search_path = public as $$
declare h text := case when p_hw ~ '^[0-9a-f]{16,64}$' then p_hw else null end;
begin
  if p_device is null or char_length(p_device) not between 8 and 64 then return; end if;
  insert into public.app_installs(device, native, user_id, hw, model, os)
  values (p_device, coalesce(p_native, false), auth.uid(), h, left(nullif(trim(p_model), ''), 60), left(nullif(trim(p_os), ''), 30))
  on conflict (device) do update set last_seen = now(),
    native = public.app_installs.native or excluded.native,
    user_id = coalesce(excluded.user_id, public.app_installs.user_id),
    hw = coalesce(public.app_installs.hw, excluded.hw),
    model = coalesce(excluded.model, public.app_installs.model),
    os = coalesce(excluded.os, public.app_installs.os);
end $$;
revoke all on function public.track_install(text, boolean, text, text, text) from public;
grant execute on function public.track_install(text, boolean, text, text, text) to anon, authenticated;

create or replace function public.funnel(p_days int default 30) returns jsonb
language plpgsql security definer set search_path = public as $$
declare d int := least(greatest(coalesce(p_days, 30), 1), 365); since timestamptz := now() - make_interval(days => d); r jsonb;
begin
  if not public.has_perm('stats') then raise exception 'forbidden'; end if;
  with ph as (   -- телефони ҳақиқӣ: ҳамаи насбҳои як hw як телефон
    select coalesce(hw, device) as k, min(first_seen) as fs, bool_or(user_id is not null) as reg, bool_or(native) as native,
           (array_agg(model order by last_seen desc) filter (where model is not null))[1] as model, count(*) as n
      from public.app_installs group by coalesce(hw, device)
  ), np as (select * from ph where fs >= since),
  c as (select id, created_at::date as day0 from public.profiles where created_at >= since)
  select jsonb_build_object(
    'days', d,
    'installs', (select count(*) from np),
    'phones', (select count(*) from np),
    'phones_anon', (select count(*) from np where not reg),
    'phones_reg', (select count(*) from np where reg),
    'phones_apk', (select count(*) from np where native),
    'phones_web', (select count(*) from np where not native),
    'reinstalls', (select count(*) from public.app_installs a where a.first_seen >= since and a.hw is not null
                     and exists (select 1 from public.app_installs o where o.hw = a.hw and (o.first_seen, o.device) < (a.first_seen, a.device))),
    'installs_anon', (select count(*) from np where not reg),
    'installs_apk', (select count(*) from np where native),
    'installs_web', (select count(*) from np where not native),
    'models', coalesce((select jsonb_agg(jsonb_build_object('model', m, 'n', n) order by n desc)
                          from (select coalesce(model, '—') as m, count(*) as n from np group by 1 order by 2 desc limit 8) x), '[]'::jsonb),
    'registered', (select count(*) from c),
    'read1', (select count(*) from c where (select coalesce(sum(sec), 0) from public.read_stats s where s.user_id = c.id) >= 60),
    'back1', (select count(*) from c where exists (select 1 from public.active_days a where a.user_id = c.id and a.day >= c.day0 + 1)),
    'back7', (select count(*) from c where exists (select 1 from public.active_days a where a.user_id = c.id and a.day >= c.day0 + 7))
  ) into r;
  return r;
end $$;
revoke all on function public.funnel(int) from public, anon;
grant execute on function public.funnel(int) to authenticated;
