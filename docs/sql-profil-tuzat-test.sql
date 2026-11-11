-- Китобхона: СИНОВИ ПРОФИЛИ ТУЗАТИШ. Дар охир ROLLBACK. Талаб: sql-profil-tuzat.sql
begin;
insert into auth.users(id, email, email_confirmed_at, last_sign_in_at) values ('00000000-0000-4000-8000-0000000000f0','t-adm2@test.local', now(), now());
insert into public.profiles(id, name, name_key, role) values ('00000000-0000-4000-8000-0000000000f0','ТестАдмин','тестадмин','admin');
do $t$
declare s0 jsonb; s1 jsonb; nm text; n int;
begin
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000f0', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000f0"}', true);
  execute 'set local role authenticated';
  s0 := public.user_stats();
  execute 'reset role';
  -- V1: рамз тасдиқ шуд ва ном дар метадата → профил худкор
  insert into auth.users(id, email, last_sign_in_at, raw_user_meta_data) values ('00000000-0000-4000-8000-0000000000f1','t-v1@test.local', now(), '{"name":"ТестНомХ","gender":"boy"}');
  select name into nm from public.profiles where id = '00000000-0000-4000-8000-0000000000f1';
  if nm is distinct from 'ТестНомХ' then raise exception 'ФАЛ: триггер профилро насохт (%)', nm; end if;
  -- V2: рамз тасдиқ шуд, ном нест → профил нест
  insert into auth.users(id, email, last_sign_in_at) values ('00000000-0000-4000-8000-0000000000f2','t-v2@test.local', now());
  if exists (select 1 from public.profiles where id = '00000000-0000-4000-8000-0000000000f2') then raise exception 'ФАЛ: бе ном профил сохта шуд'; end if;
  -- U3: рамз сўрад, тасдиқ накард
  insert into auth.users(id, email) values ('00000000-0000-4000-8000-0000000000f3','t-u3@test.local');
  -- номи ҳамон: Ном 1
  insert into auth.users(id, email, last_sign_in_at, raw_user_meta_data) values ('00000000-0000-4000-8000-0000000000f4','t-v4@test.local', now(), '{"name":"ТестНомХ","gender":"girl"}');
  select name into nm from public.profiles where id = '00000000-0000-4000-8000-0000000000f4';
  if nm is distinct from 'ТестНомХ 1' then raise exception 'ФАЛ: номи такрорӣ «Ном 1» бояд шавад (%)', nm; end if;
  -- Google-услуб: фақат ном (бе ҷинс) → профил ҳоло нест
  insert into auth.users(id, email, last_sign_in_at, raw_user_meta_data) values ('00000000-0000-4000-8000-0000000000f6','t-g6@test.local', now(), '{"name":"Гугл Ном","full_name":"Гугл Ном"}');
  if exists (select 1 from public.profiles where id = '00000000-0000-4000-8000-0000000000f6') then raise exception 'ФАЛ: фақат ном — профил сохта шуд'; end if;
  -- V2 баъд ном мегузорад (updateUser) → профил пайдо мешавад
  update auth.users set raw_user_meta_data = '{"name":"  ТестВ2  ","gender":"boy"}' where id = '00000000-0000-4000-8000-0000000000f2';
  select name into nm from public.profiles where id = '00000000-0000-4000-8000-0000000000f2';
  if nm is distinct from 'ТестВ2' then raise exception 'ФАЛ: updateUser-и ном профилро насохт (%)', nm; end if;
  -- ном тағйир ёбад, профили мавҷуда тағйир намеёбад
  update auth.users set raw_user_meta_data = '{"name":"Дигар"}' where id = '00000000-0000-4000-8000-0000000000f2';
  if (select name from public.profiles where id = '00000000-0000-4000-8000-0000000000f2') <> 'ТестВ2' then raise exception 'ФАЛ: профили мавҷуда иваз шуд'; end if;
  -- ном холӣ → профил нест
  insert into auth.users(id, email, last_sign_in_at, raw_user_meta_data) values ('00000000-0000-4000-8000-0000000000f5','t-v5@test.local', now(), '{"name":"   "}');
  if exists (select 1 from public.profiles where id = '00000000-0000-4000-8000-0000000000f5') then raise exception 'ФАЛ: номи холӣ профил сохт'; end if;
  -- backfill: профили гумшуда (Азамат-ро тақлид) аз метадата тикла мешавад
  delete from public.profiles where id = '00000000-0000-4000-8000-0000000000f1';
  perform public.ensure_profile('00000000-0000-4000-8000-0000000000f1', 'ТестНомХ');
  if (select name from public.profiles where id = '00000000-0000-4000-8000-0000000000f1') is null then raise exception 'ФАЛ: ensure_profile тикла накард'; end if;
  -- омор: тасдиқшудагон ва тасдиқнакардагон алоҳида
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000f0', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000f0"}', true);
  execute 'set local role authenticated';
  s1 := public.user_stats();
  execute 'reset role';
  -- аз 5 корбари нав: тасдиқшуда f1,f2,f4,f5,f6 = 5; тасдиқнашуда f3 = 1; профил нест (тасдиқшуда): f5,f6 = 2; профили оддӣ: f1,f2,f4 = 3
  if (s1->>'total')::int - (s0->>'total')::int <> 5 then raise exception 'ФАЛ: total (тасдиқшуда) Δ=5 бояд, ҳоло %', (s1->>'total')::int - (s0->>'total')::int; end if;
  if (s1->>'unverified')::int - (s0->>'unverified')::int <> 1 then raise exception 'ФАЛ: unverified Δ=1'; end if;
  if (s1->>'no_profile')::int - (s0->>'no_profile')::int <> 2 then raise exception 'ФАЛ: no_profile Δ=2'; end if;
  if (s1->>'users')::int - (s0->>'users')::int <> 3 then raise exception 'ФАЛ: users Δ=3, ҳоло %', (s1->>'users')::int - (s0->>'users')::int; end if;
  begin execute 'set local role authenticated'; perform public.user_stats(); execute 'reset role'; exception when others then execute 'reset role'; end;
  -- корбари оддӣ омор намебинад
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000f4', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000f4"}', true);
  execute 'set local role authenticated';
  begin perform public.user_stats(); execute 'reset role'; raise exception 'ФАЛ: корбар user_stats-ро дид'; exception when others then if sqlerrm like 'ФАЛ%' then raise; end if; execute 'reset role'; end;
  raise notice 'ҲАМА ГУЗАШТ (профили автоматӣ, омор)';
end $t$;
rollback;
