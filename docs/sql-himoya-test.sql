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
