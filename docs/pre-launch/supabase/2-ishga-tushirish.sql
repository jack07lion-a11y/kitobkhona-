-- КИТОБХОНА · 2-ҚАДАМ: ИШГА ТУШИРИШ (sql-bayroq, himoya, mulk, maxfiyat, holat, metrika — бир файлда)
-- Supabase → SQL Editor → New query → шу ҳаммасини ёпиштиринг → Run. Такрор ишга туширса ҳам зарар йўқ.
-- Ҳеч қандай маълумот ўчирилмайди: фақат янги устун, жадвал, функция ва қоидалар қўшилади.
-- Натижа: «Success. No rows returned». Хато чиқса — скриншотни Claude'га юборинг.

-- ================= docs/sql-bayroq.sql =================
-- Китобхона: «Тез кунда» байроқчалари (тугалланмаган бахшҳоро админ ҳамин ҷо аз барнома мекушояд)
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Такроран ишлатиш мумкин. Талаб: sql-omor.sql (app_flags), sql-admin.sql (is_admin).
-- Пешфарз: ҳама хомӯш = дар барнома «Ба зудӣ» нишон дода мешавад ё пинҳон аст.
-- Калидҳо: audio (аудиокитоб), buy (харид/обуна), contest (ИФМ/Фурӯғ/Баҳс), coin (Тавозуни хирад), rank (рейтинг/мақом),
--          social (баҳо ва фикри корбарон), ai (ёрдамчии китоб), quiz (озмуни санҷишӣ), teacher (кабинети муаллим)

alter table public.app_flags add column if not exists feat jsonb not null default '{}'::jsonb;

create or replace function public.set_feat(p_key text, p_on boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  if p_key not in ('audio','buy','contest','coin','rank','social','ai','quiz','teacher') then raise exception 'bad key'; end if;
  update public.app_flags set feat = jsonb_set(coalesce(feat, '{}'::jsonb), array[p_key], to_jsonb(coalesce(p_on, false)), true) where id = 1;
end $$;
revoke all on function public.set_feat(text, boolean) from public, anon;
grant execute on function public.set_feat(text, boolean) to authenticated;
-- Хондан: «flags read» (select using true) аллакай ҳаст (sql-omor.sql), ҳамин ҷо ҷудо сиёсат лозим нест.

-- ================= docs/sql-himoya.sql =================
-- Китобхона: ҳимояи Премиум — китоби пулакиро фақат корбари ҳуқуқдор мегирад (сервер ҳал мекунад, на барнома)
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Такроран ишлатиш мумкин.
-- Талаб: sql-admin, sql-omor (app_flags.premium_on), sql-fayl, sql-poadmin, sql-ijozat2 (has_perm), sql-huquq. Баъд: docs/sql-himoya-test.sql
--
-- Қоида (ҳамон як қоида дар барнома: locked(b) = Премиум фурӯзон && китоб премиум && корбар муштарак нест):
--  * app_flags.premium_on = хомӯш  → ҳамаи китобҳо ройгон (ҳамон тавре ки барнома нишон медиҳад)
--  * китоби премиум → матн (text_path) танҳо барои: муштарак (premium_until > ҳозир) ё корбари ҳуқуқи «books» дошта
--  * муқова (cover_path) ҳамеша хондашаванда барои китобҳои нашршуда, то рӯйхат пур бошад
-- Диққат: «парчаи ройгон»-и китоби премиум (3 саҳифа) бо ин ҳимоя ҳоло нест, зеро матн пурра баста мешавад.
--         Барои парча файли алоҳида (sample) лозим мешавад — қарор аз тарафи бунёдгузорон (docs/pre-launch/STATUS.md).

alter table public.profiles add column if not exists premium_until timestamptz;

create or replace function public.is_premium() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.premium_until is not null and p.premium_until > now());
$$;
revoke all on function public.is_premium() from public;
grant execute on function public.is_premium() to anon, authenticated;

-- Файли китобро кӣ хонда метавонад (storage.objects-и «books» шоха аз slug/…)
create or replace function public.can_read_book_file(p_name text) returns boolean
language sql stable security definer set search_path = public as $$
  select public.has_perm('books') or exists (
    select 1 from public.books b
     where b.published and b.slug = split_part(p_name, '/', 1)
       and ( coalesce(b.premium, false) = false
          or p_name = b.cover_path
          or public.is_premium()
          or not coalesce((select f.premium_on from public.app_flags f where f.id = 1), false) ));
$$;
revoke all on function public.can_read_book_file(text) from public;
grant execute on function public.can_read_book_file(text) to anon, authenticated;

drop policy if exists "books files read" on storage.objects;
create policy "books files read" on storage.objects for select
  using (bucket_id = 'books' and public.can_read_book_file(name));

-- Муштаракии корбар: фақат админ (барои фаъолсозӣ бо код — sql-premium.sql, баъдтар)
create or replace function public.set_premium(p_email text, p_until timestamptz) returns text
language plpgsql security definer set search_path = public as $$
declare uid uuid;
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  select id into uid from auth.users where lower(email) = lower(trim(p_email));
  if uid is null then return 'not_found'; end if;
  update public.profiles set premium_until = p_until where id = uid;
  if not found then return 'no_profile'; end if;
  return 'ok';
end $$;
revoke all on function public.set_premium(text, timestamptz) from public, anon;
grant execute on function public.set_premium(text, timestamptz) to authenticated;

-- ================= docs/sql-mulk.sql =================
-- Китобхона: ҳуқуқи китоб (мулк) — ҳолат, соҳиб, манба, нашр, мутарҷим
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Такроран ишлатиш мумкин. Талаб: sql-admin (books).
-- Ҳолатҳо: public_domain (ҷамъиятӣ), licensed (иҷозатнома/розигӣ дорем), pending (ҳоло номаълум).
-- Ин ҷо ҳуқуқӣ хулоса НЕСТ: фақат маълумот сабт мешавад. Ҳолатро бунёдгузорон мустақилона муайян мекунанд.
-- Қоида: pending → китобро НАШР кардан мумкин нест (сервер рад мекунад). Китобҳои аллакай нашршуда нашрӣ мемонанд (катъӣ пинҳон
--        намешаванд), то қарори бунёдгузорон; рӯйхати онҳо: select id, t from books where published and rights_status = 'pending';

alter table public.books add column if not exists rights_status text not null default 'pending';
alter table public.books drop constraint if exists books_rights_status_check;
alter table public.books add constraint books_rights_status_check check (rights_status in ('public_domain','licensed','pending'));
alter table public.books add column if not exists rights_holder text;
alter table public.books add column if not exists source text;
alter table public.books add column if not exists edition text;
alter table public.books add column if not exists translator text;
alter table public.books add column if not exists license_note text;

create or replace function public.books_rights_guard() returns trigger
language plpgsql as $$
begin
  if new.published then
    if tg_op = 'INSERT' or not coalesce(old.published, false)
       or new.rights_status is distinct from old.rights_status
       or new.rights_holder is distinct from old.rights_holder or new.source is distinct from old.source then
      if new.rights_status = 'pending' then raise exception 'rights_pending'; end if;
      if coalesce(trim(new.source), '') = '' then raise exception 'source_required'; end if;
      if new.rights_status = 'licensed' and coalesce(trim(new.rights_holder), '') = '' then raise exception 'rights_holder_required'; end if;
    end if;
  end if;
  return new;
end $$;
drop trigger if exists books_rights_guard on public.books;
create trigger books_rights_guard before insert or update on public.books for each row execute function public.books_rights_guard();

-- ================= docs/sql-maxfiyat.sql =================
-- Китобхона: махфийлик — розигӣ, гурӯҳи синнӣ, ҳисобро нест кардан (delete_me)
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Такроран ишлатиш мумкин. Талаб: sql-nomho (profiles), sql-aloqa (reports, error_log, read_stats, active_days), sql-profil (avatars).

alter table public.profiles add column if not exists consent_at timestamptz;
alter table public.profiles add column if not exists consent_ver text;
alter table public.profiles add column if not exists age_group text;
alter table public.profiles add column if not exists guardian_ok boolean not null default false;
alter table public.profiles drop constraint if exists profiles_age_group_check;
alter table public.profiles add constraint profiles_age_group_check check (age_group is null or age_group in ('under18','adult'));

-- Розигӣ ва синну сол. 18-сола хурд бошад — «ота-она/васӣ огоҳ аст» ҳатмист.
create or replace function public.save_consent(p_age_group text, p_guardian boolean, p_ver text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if p_age_group not in ('under18','adult') then raise exception 'bad age_group'; end if;
  if p_age_group = 'under18' and not coalesce(p_guardian, false) then raise exception 'guardian_required'; end if;
  update public.profiles set age_group = p_age_group, guardian_ok = coalesce(p_guardian, false),
         consent_at = now(), consent_ver = left(coalesce(p_ver, ''), 20)
   where id = auth.uid();
end $$;
revoke all on function public.save_consent(text, boolean, text) from public, anon;
grant execute on function public.save_consent(text, boolean, text) to authenticated;

-- Файлҳои худӣ: корбар аватар/баннери худро нест карда метавонад (барои delete_me аз барнома)
drop policy if exists "avatars delete" on storage.objects;
create policy "avatars delete" on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- Ҳисобро пурра нест кардан. Админ худро ин ҷо нест карда наметавонад (то система бе админ намонад).
create or replace function public.delete_me() returns void
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'not signed in'; end if;
  if public.is_admin() then raise exception 'admin_cannot_delete'; end if;
  delete from public.read_stats where user_id = uid;
  delete from public.active_days where user_id = uid;
  delete from public.error_log where user_id = uid;
  delete from public.reports where user_id = uid;
  if to_regclass('public.user_state') is not null then execute 'delete from public.user_state where user_id = $1' using uid; end if;
  -- Файлҳо дар Storage: Supabase-и нав нест кардани мустақимро манъ мекунад (storage.protect_delete).
  -- Аватарро барнома аз Storage API нест мекунад; агар ин ҷо манъ бошад, ҳисоб бояд ба ҳар ҳол нест шавад.
  begin
    delete from storage.objects where bucket_id in ('avatars','reports') and (storage.foldername(name))[1] = uid::text;
  exception when others then null;
  end;
  delete from auth.users where id = uid;   -- profiles бо on delete cascade меравад
end $$;
revoke all on function public.delete_me() from public, anon;
grant execute on function public.delete_me() to authenticated;

-- ================= docs/sql-holat.sql =================
-- Китобхона: ҳолати корбар дар сервер — пешравии хондан, токчаҳо, хатчӯбҳо (то ки бо аз нав насб кардан гум нашавад)
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Такроран ишлатиш мумкин. Талаб: auth.
-- Қоидаи ҳалли ихтилоф (чанд телефон):
--   prog  (пешравӣ)  — барои ҳар китоб БАЛАНДТАРИН фоиз ғолиб (пешравӣ танҳо меафзояд; баробар бошад — вақти нав).
--   lib   (токчаҳо)  — ҳамаи токчаҳо як дона: вақти охирини тағйир (t) нав бошад, ғолиб; нест кардан ҳам мерасад.
--   marks (хатчӯбҳо) — ҳамон қоидаи lib.
-- Маҳдудият: дар ду телефони гуногун дар як вақт токчаро тағйир диҳед — фақат охиринаш мемонад.

create table if not exists public.user_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.user_state enable row level security;
drop policy if exists "own state read" on public.user_state;
create policy "own state read" on public.user_state for select using (auth.uid() = user_id);
-- Навиштан фақат тавассути sync_state (сиёсати insert/update нест)

create or replace function public.sync_state(p jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid(); cur jsonb; pr jsonb; res jsonb; k text; a jsonb; b jsonb; n int := 0;
  va numeric; vb numeric; ta bigint; tb bigint;
begin
  if uid is null then raise exception 'not signed in'; end if;
  if p is null or jsonb_typeof(p) <> 'object' then raise exception 'bad payload'; end if;
  if octet_length(p::text) > 400000 then raise exception 'too large'; end if;
  insert into public.user_state(user_id) values (uid) on conflict do nothing;
  select data into cur from public.user_state where user_id = uid for update;
  pr := coalesce(cur -> 'prog', '{}'::jsonb);
  if jsonb_typeof(p -> 'prog') = 'object' then
    for k, b in select key, value from jsonb_each(p -> 'prog') loop
      n := n + 1; if n > 5000 then raise exception 'too many books'; end if;
      if jsonb_typeof(b) <> 'object' then continue; end if;
      a := pr -> k;
      vb := coalesce((b ->> 'v')::numeric, 0); tb := coalesce((b ->> 't')::bigint, 0);
      if a is null then pr := jsonb_set(pr, array[k], b);
      else
        va := coalesce((a ->> 'v')::numeric, 0); ta := coalesce((a ->> 't')::bigint, 0);
        if vb > va or (vb = va and tb > ta) then pr := jsonb_set(pr, array[k], b); end if;
      end if;
    end loop;
  end if;
  res := jsonb_build_object('prog', pr);
  foreach k in array array['lib','marks'] loop
    a := cur -> k; b := p -> k;
    if b is null or jsonb_typeof(b) <> 'object' then res := res || jsonb_build_object(k, coalesce(a, 'null'::jsonb));
    elsif a is null or jsonb_typeof(a) <> 'object' or coalesce((b ->> 't')::bigint, 0) >= coalesce((a ->> 't')::bigint, 0) then res := res || jsonb_build_object(k, b);
    else res := res || jsonb_build_object(k, a);
    end if;
  end loop;
  update public.user_state set data = res, updated_at = now() where user_id = uid;
  return res;
end $$;
revoke all on function public.sync_state(jsonb) from public, anon;
grant execute on function public.sync_state(jsonb) to authenticated;

-- ================= docs/sql-metrika.sql =================
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
