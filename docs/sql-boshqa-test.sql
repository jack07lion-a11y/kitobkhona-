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
