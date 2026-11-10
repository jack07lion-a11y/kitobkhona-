-- КИТОБХОНА · 3-ҚАДАМ: СИНОВ (ҳаммаси охирида ROLLBACK — маълумотга тегмайди)
-- Supabase → SQL Editor → New query → ёпиштиринг → Run. Натижада 3 та «ҲАМА ГУЗАШТ» бўлиши керак.
-- Supabase одатда фақат охирги хабарни кўрсатади: «ҲАМА ГУЗАШТ (синхронизатсия ва тикланиш)» чиқса — ҳаммаси ўтди. «ФАЛ» ёки хато чиқса — скриншот юборинг.

-- ================= docs/sql-himoya-test.sql =================
-- Китобхона: СИНОВИ ҲИМОЯИ ПРЕМИУМ (RLS). Supabase → SQL Editor → Run. Ҳамааш дар охир ROLLBACK мешавад, ҳеҷ чиз мондан намегирад.
-- Талаб: ҳамаи sql-файлҳо (аз ҷумла sql-mulk, sql-himoya). Натиҷа: «NOTICE: ҲАМА ГУЗАШТ» ё хато бо «ФАЛ: …».
begin;

insert into auth.users(id, email) values
 ('00000000-0000-4000-8000-0000000000a1','t-prem@test.local'),
 ('00000000-0000-4000-8000-0000000000a2','t-free@test.local'),
 ('00000000-0000-4000-8000-0000000000a3','t-expired@test.local'),
 ('00000000-0000-4000-8000-0000000000a4','t-admin@test.local');
insert into public.profiles(id, name, name_key, role, premium_until) values
 ('00000000-0000-4000-8000-0000000000a1','T-prem','t-prem','user', now() + interval '30 days'),
 ('00000000-0000-4000-8000-0000000000a2','T-free','t-free','user', null),
 ('00000000-0000-4000-8000-0000000000a3','T-expired','t-expired','user', now() - interval '1 day'),
 ('00000000-0000-4000-8000-0000000000a4','T-admin','t-admin','admin', null);

insert into public.books(t, a, c, published, premium, slug, cover_path, text_path, rights_status, source) values
 ('T free','T','fiction', true,  false, 'tp-free',  'tp-free/cover.jpg',  'tp-free/book.json.gz',  'public_domain','тест'),
 ('T prem','T','fiction', true,  true,  'tp-prem',  'tp-prem/cover.jpg',  'tp-prem/book.json.gz',  'public_domain','тест'),
 ('T draft','T','fiction', false, false, 'tp-draft', 'tp-draft/cover.jpg', 'tp-draft/book.json.gz', 'pending',      null);
insert into storage.objects(bucket_id, name) values
 ('books','tp-free/book.json.gz'),('books','tp-free/cover.jpg'),
 ('books','tp-prem/book.json.gz'),('books','tp-prem/cover.jpg'),
 ('books','tp-draft/book.json.gz');
update public.app_flags set premium_on = true where id = 1;

do $t$
declare
  n int; ok boolean;
  can_free boolean; can_prem boolean; can_prem_cover boolean; can_draft boolean;
  -- кӣ: uid + роли Postgres → (матни ройгон, матни премиум, муқоваи премиум, лоиҳа)
begin
  -- ===== меҳмон (anon) =====
  perform set_config('request.jwt.claim.sub', '', true); perform set_config('request.jwt.claims', '{}', true);
  execute 'set local role anon';
  select count(*) = 1 into can_free        from storage.objects where bucket_id='books' and name='tp-free/book.json.gz';
  select count(*) = 1 into can_prem        from storage.objects where bucket_id='books' and name='tp-prem/book.json.gz';
  select count(*) = 1 into can_prem_cover  from storage.objects where bucket_id='books' and name='tp-prem/cover.jpg';
  select count(*) = 1 into can_draft       from storage.objects where bucket_id='books' and name='tp-draft/book.json.gz';
  execute 'reset role';
  if not can_free then raise exception 'ФАЛ: меҳмон китоби ройгонро хонда наметавонад'; end if;
  if can_prem then raise exception 'ФАЛ: меҳмон матни премиумро мехонад'; end if;
  if not can_prem_cover then raise exception 'ФАЛ: меҳмон муқоваи премиумро намебинад'; end if;
  if can_draft then raise exception 'ФАЛ: меҳмон китоби нашрнашударо мехонад'; end if;

  -- ===== корбари оддӣ (муштарак нест) =====
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000a2', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000a2"}', true);
  execute 'set local role authenticated';
  select count(*) = 1 into can_prem from storage.objects where bucket_id='books' and name='tp-prem/book.json.gz';
  if can_prem then execute 'reset role'; raise exception 'ФАЛ: корбари ройгон матни премиумро мехонад'; end if;
  -- худаш премиум дода наметавонад
  update public.profiles set premium_until = now() + interval '365 days' where id = '00000000-0000-4000-8000-0000000000a2';
  get diagnostics n = row_count;
  if n <> 0 then execute 'reset role'; raise exception 'ФАЛ: корбар premium_until-и худро тағйир дод'; end if;
  begin perform public.set_premium('t-free@test.local', now() + interval '1 day'); execute 'reset role'; raise exception 'ФАЛ: set_premium бе админ кор кард';
  exception when others then if sqlerrm not like '%forbidden%' then execute 'reset role'; raise; end if; end;
  execute 'reset role';

  -- ===== муштарак =====
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000a1', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000a1"}', true);
  execute 'set local role authenticated';
  select count(*) = 1 into can_prem from storage.objects where bucket_id='books' and name='tp-prem/book.json.gz';
  select count(*) = 1 into can_draft from storage.objects where bucket_id='books' and name='tp-draft/book.json.gz';
  execute 'reset role';
  if not can_prem then raise exception 'ФАЛ: муштарак матни премиумро хонда наметавонад'; end if;
  if can_draft then raise exception 'ФАЛ: муштарак китоби нашрнашударо мехонад'; end if;

  -- ===== муддати Премиум тамом шуд =====
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000a3', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000a3"}', true);
  execute 'set local role authenticated';
  select count(*) = 1 into can_prem from storage.objects where bucket_id='books' and name='tp-prem/book.json.gz';
  execute 'reset role';
  if can_prem then raise exception 'ФАЛ: баъд аз тамом шудани муддат матни премиум боз кушода аст'; end if;

  -- ===== админ =====
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000a4', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000a4"}', true);
  execute 'set local role authenticated';
  select count(*) = 1 into can_prem  from storage.objects where bucket_id='books' and name='tp-prem/book.json.gz';
  select count(*) = 1 into can_draft from storage.objects where bucket_id='books' and name='tp-draft/book.json.gz';
  perform public.set_premium('t-free@test.local', now() + interval '2 days');
  execute 'reset role';
  if not (can_prem and can_draft) then raise exception 'ФАЛ: админ ҳамаро намебинад'; end if;
  select premium_until > now() into ok from public.profiles where id = '00000000-0000-4000-8000-0000000000a2';
  if not coalesce(ok, false) then raise exception 'ФАЛ: set_premium муддат нагузошт'; end if;

  -- ===== Премиум хомӯш (app_flags.premium_on=false) → ҳамаи китобҳои нашршуда ройгон =====
  update public.app_flags set premium_on = false where id = 1;
  perform set_config('request.jwt.claim.sub', '', true); perform set_config('request.jwt.claims', '{}', true);
  execute 'set local role anon';
  select count(*) = 1 into can_prem from storage.objects where bucket_id='books' and name='tp-prem/book.json.gz';
  execute 'reset role';
  if not can_prem then raise exception 'ФАЛ: Премиум хомӯш, аммо матни премиум баста аст'; end if;

  raise notice 'ҲАМА ГУЗАШТ (ҳимояи премиум)';
end $t$;

rollback;

-- ================= docs/sql-boshqa-test.sql =================
-- Китобхона: СИНОВИ ҲУҚУҚ (sql-mulk), ХУДРО НЕСТ КАРДАН (sql-maxfiyat), ВОРОНКА (sql-metrika), БАЙРОҚ (sql-bayroq). Дар охир ROLLBACK.
begin;
insert into auth.users(id, email) values
 ('00000000-0000-4000-8000-0000000000c1','t-del@test.local'),
 ('00000000-0000-4000-8000-0000000000c2','t-adm@test.local'),
 ('00000000-0000-4000-8000-0000000000c3','t-usr@test.local');
insert into public.profiles(id, name, name_key, role) values
 ('00000000-0000-4000-8000-0000000000c1','T-del','t-del','user'),
 ('00000000-0000-4000-8000-0000000000c2','T-adm','t-adm','admin'),
 ('00000000-0000-4000-8000-0000000000c3','T-usr','t-usr','user');
insert into public.read_stats(user_id, day, book_id, sec) values ('00000000-0000-4000-8000-0000000000c1', current_date, 1, 90);
insert into public.active_days(user_id, day) values ('00000000-0000-4000-8000-0000000000c1', current_date);

do $t$
declare r jsonb; n int;
begin
  -- ===== ҳуқуқи китоб =====
  begin insert into public.books(t,a,c,published,slug) values ('x','x','fiction',true,'tb-1'); raise exception 'ФАЛ: pending нашр шуд';
  exception when others then if sqlerrm <> 'rights_pending' then raise; end if; end;
  begin insert into public.books(t,a,c,published,slug,rights_status) values ('x','x','fiction',true,'tb-2','public_domain'); raise exception 'ФАЛ: бе манба нашр шуд';
  exception when others then if sqlerrm <> 'source_required' then raise; end if; end;
  begin insert into public.books(t,a,c,published,slug,rights_status,source) values ('x','x','fiction',true,'tb-3','licensed','манба'); raise exception 'ФАЛ: licensed бе соҳиб нашр шуд';
  exception when others then if sqlerrm <> 'rights_holder_required' then raise; end if; end;
  insert into public.books(t,a,c,published,slug,rights_status,source,rights_holder) values ('x','x','fiction',true,'tb-4','licensed','манба','Нашриёт');
  insert into public.books(t,a,c,published,slug) values ('draft','x','fiction',false,'tb-5');   -- пешнавис бо pending мешавад
  begin update public.books set published = true where slug = 'tb-5'; raise exception 'ФАЛ: пешнависи pending нашр шуд';
  exception when others then if sqlerrm <> 'rights_pending' then raise; end if; end;

  -- ===== байроқ =====
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000c3', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000c3"}', true);
  execute 'set local role authenticated';
  begin perform public.set_feat('audio', true); execute 'reset role'; raise exception 'ФАЛ: корбар байроқ тағйир дод';
  exception when others then if sqlerrm not like '%forbidden%' then execute 'reset role'; raise; end if; end;
  execute 'reset role';
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000c2', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000c2"}', true);
  execute 'set local role authenticated';
  perform public.set_feat('audio', true);
  execute 'reset role';
  if (select (feat->>'audio')::boolean from public.app_flags where id=1) is not true then raise exception 'ФАЛ: set_feat кор накард'; end if;

  -- ===== розигӣ =====
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000c1', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000c1"}', true);
  execute 'set local role authenticated';
  begin perform public.save_consent('under18', false, 'v1'); execute 'reset role'; raise exception 'ФАЛ: хурдсол бе огоҳии ота-она қабул шуд';
  exception when others then if sqlerrm not like '%guardian_required%' then execute 'reset role'; raise; end if; end;
  perform public.save_consent('under18', true, 'v1');
  execute 'reset role';
  if (select guardian_ok and age_group='under18' and consent_at is not null from public.profiles where id='00000000-0000-4000-8000-0000000000c1') is not true then raise exception 'ФАЛ: розигӣ сабт нашуд'; end if;

  -- ===== воронка =====
  perform set_config('request.jwt.claim.sub', '', true); perform set_config('request.jwt.claims', '{}', true);
  execute 'set local role anon';
  perform public.track_install('device-test-0001', true);
  perform public.track_install('device-test-0001', false);
  execute 'reset role';
  if (select count(*) from public.app_installs where device='device-test-0001') <> 1 then raise exception 'ФАЛ: track_install такрор сабт кард'; end if;
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000c3', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000c3"}', true);
  execute 'set local role authenticated';
  begin perform public.funnel(30); execute 'reset role'; raise exception 'ФАЛ: воронка бе ҳуқуқ кушода аст';
  exception when others then if sqlerrm not like '%forbidden%' then execute 'reset role'; raise; end if; end;
  execute 'reset role';
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000c2', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000c2"}', true);
  execute 'set local role authenticated';
  r := public.funnel(30);
  execute 'reset role';
  if (r->>'registered')::int < 3 or (r->>'read1')::int < 1 or (r->>'installs')::int < 1 then raise exception 'ФАЛ: воронка нодуруст: %', r; end if;

  -- ===== аккаунтро нест кардан =====
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000c2', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000c2"}', true);
  execute 'set local role authenticated';
  begin perform public.delete_me(); execute 'reset role'; raise exception 'ФАЛ: админ худро нест кард';
  exception when others then if sqlerrm not like '%admin_cannot_delete%' then execute 'reset role'; raise; end if; end;
  execute 'reset role';
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000c1', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000c1"}', true);
  execute 'set local role authenticated';
  perform public.delete_me();
  execute 'reset role';
  select (select count(*) from auth.users where id='00000000-0000-4000-8000-0000000000c1')
       + (select count(*) from public.profiles where id='00000000-0000-4000-8000-0000000000c1')
       + (select count(*) from public.read_stats where user_id='00000000-0000-4000-8000-0000000000c1')
       + (select count(*) from public.active_days where user_id='00000000-0000-4000-8000-0000000000c1') into n;
  if n <> 0 then raise exception 'ФАЛ: delete_me маълумотро пурра нест накард (%)', n; end if;
  raise notice 'ҲАМА ГУЗАШТ (ҳуқуқ, байроқ, розигӣ, воронка, нест кардан)';
end $t$;
rollback;

-- ================= docs/sql-holat-test.sql =================
-- Китобхона: СИНОВИ ҲОЛАТИ КОРБАР (sync_state) ва тикланиш баъди аз нав насб. Дар охир ROLLBACK. Талаб: sql-holat.sql
begin;
insert into auth.users(id, email) values ('00000000-0000-4000-8000-0000000000b1','t-sync@test.local');
insert into public.profiles(id, name, name_key) values ('00000000-0000-4000-8000-0000000000b1','T-sync','t-sync');

do $t$
declare r jsonb; u text := '00000000-0000-4000-8000-0000000000b1';
begin
  perform set_config('request.jwt.claim.sub', u, true);
  perform set_config('request.jwt.claims', '{"sub":"'||u||'"}', true);
  execute 'set local role authenticated';

  -- телефони 1: китоби 5 то 40%, токча t=100
  r := public.sync_state('{"prog":{"5":{"v":40,"pg":3,"ch":2,"t":10}},"lib":{"t":100,"v":{"q":[5],"d":[],"c":[]}},"marks":{"t":100,"v":{"5":[1]}}}'::jsonb);
  if (r->'prog'->'5'->>'v')::int <> 40 then raise exception 'ФАЛ: пешравӣ сабт нашуд'; end if;

  -- телефони 2 (кӯҳна): 20% ва токчаи кӯҳнатар → ихтилоф: баландтарин % ва t-и нав ғолиб
  r := public.sync_state('{"prog":{"5":{"v":20,"pg":1,"ch":0,"t":20}},"lib":{"t":50,"v":{"q":[],"d":[],"c":[]}}}'::jsonb);
  if (r->'prog'->'5'->>'v')::int <> 40 then raise exception 'ФАЛ: пешравии камтар болои баландтарро пахш кард'; end if;
  if (r->'lib'->>'t')::int <> 100 or jsonb_array_length(r->'lib'->'v'->'q') <> 1 then raise exception 'ФАЛ: токчаи кӯҳна токчаи навро пахш кард'; end if;
  if r->'marks' is null or r->'marks'->>'t' is distinct from '100' then raise exception 'ФАЛ: хатчӯбҳо гум шуданд (payload бе marks)'; end if;

  -- телефони 3: пешравии бештар ва токчаи нав (нест кардани китоб аз навбат)
  r := public.sync_state('{"prog":{"5":{"v":75,"pg":9,"ch":4,"t":30},"6":{"v":10,"pg":0,"ch":0,"t":31}},"lib":{"t":200,"v":{"q":[],"d":[],"c":[]}}}'::jsonb);
  if (r->'prog'->'5'->>'v')::int <> 75 or (r->'prog'->'6'->>'v')::int <> 10 then raise exception 'ФАЛ: пешравии нав қабул нашуд'; end if;
  if jsonb_array_length(r->'lib'->'v'->'q') <> 0 then raise exception 'ФАЛ: нест кардан аз токча нарасид'; end if;

  -- «аз нав насб»: дастгоҳи холӣ (payload ҳолӣ) ҳамаро бармегардонад
  r := public.sync_state('{}'::jsonb);
  if (r->'prog'->'5'->>'v')::int <> 75 or (r->'prog'->'5'->>'ch')::int <> 4 or (r->'prog'->'5'->>'pg')::int <> 9 then raise exception 'ФАЛ: тикланиш пешравиро барнагардонд'; end if;
  if (r->'marks'->'v'->'5') is null then raise exception 'ФАЛ: тикланиш хатчӯбро барнагардонд'; end if;

  -- корбари дигар маълумоти ин корбарро намебинад
  execute 'reset role';
  insert into auth.users(id, email) values ('00000000-0000-4000-8000-0000000000b2','t-sync2@test.local');
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000b2', true);
  execute 'set local role authenticated';
  r := public.sync_state('{}'::jsonb);
  if jsonb_typeof(r->'prog') <> 'object' or (r->'prog') <> '{}'::jsonb then raise exception 'ФАЛ: корбари дигар маълумоти бегона дид'; end if;
  if (select count(*) from public.user_state) <> 1 then raise exception 'ФАЛ: RLS user_state — корбар сатрҳои бегонаро мебинад'; end if;
  execute 'reset role';
  raise notice 'ҲАМА ГУЗАШТ (синхронизатсия ва тикланиш)';
end $t$;
rollback;
