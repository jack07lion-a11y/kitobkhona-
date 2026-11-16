-- Китобхона: СИНОВИ ЁРДАМЧИ ДОИМИЙ/НАВ. Дар охир ROLLBACK. Талаб: sql-yordamchi.sql
begin;
insert into auth.users(id, email) values
  ('00000000-0000-4000-8000-0000000000b0','t-adm@test.local'),
  ('00000000-0000-4000-8000-0000000000b1','t-old@test.local'),
  ('00000000-0000-4000-8000-0000000000b2','t-new@test.local'),
  ('00000000-0000-4000-8000-0000000000b3','t-usr@test.local');
insert into public.profiles(id, name, name_key, role) values
  ('00000000-0000-4000-8000-0000000000b0','ТестАдмин','тестадмин-b','admin'),
  ('00000000-0000-4000-8000-0000000000b1','ТестДоимӣ','тестдоимӣ','user'),
  ('00000000-0000-4000-8000-0000000000b2','ТестНав','тестнав','user'),
  ('00000000-0000-4000-8000-0000000000b3','ТестКорбар','тесткорбар-b','user');
do $t$
declare r text; n int; ok boolean;
begin
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000b0', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000b0"}', true);
  execute 'set local role authenticated';
  -- ду ёрдамчӣ таъин
  if public.set_role('t-old@test.local', 'subadmin') <> 'ok' then raise exception 'ФАЛ: таъин нашуд'; end if;
  if public.set_role('t-new@test.local', 'subadmin') <> 'ok' then raise exception 'ФАЛ: таъин нашуд (2)'; end if;
  execute 'reset role';
  -- staff_since дар триггер гузошта шуд
  if (select staff_since from public.profiles where id = '00000000-0000-4000-8000-0000000000b2') is null then raise exception 'ФАЛ: staff_since гузошта нашуд'; end if;
  -- «b1» гӯё 40 рӯз пеш таъин шудааст (доимӣ), «b2» навакак (нав)
  update public.profiles set staff_since = now() - interval '40 days' where id = '00000000-0000-4000-8000-0000000000b1';
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000b0', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000b0"}', true);
  execute 'set local role authenticated';
  select count(*) into n from public.staff_list() s where s.email = 't-old@test.local' and s.permanent;
  if n <> 1 then raise exception 'ФАЛ: b1 доимӣ набуд'; end if;
  select count(*) into n from public.staff_list() s where s.email = 't-new@test.local' and not s.permanent;
  if n <> 1 then raise exception 'ФАЛ: b2 нав набуд'; end if;
  -- НАВ: фавран бардошта мешавад
  if public.set_role('t-new@test.local', 'user') <> 'ok' then raise exception 'ФАЛ: нав бардошта нашуд'; end if;
  -- ДОИМӢ: бе дархост — рад
  begin perform public.set_role('t-old@test.local', 'user'); raise exception 'ФАЛ: доимӣ бе дархост бардошта шуд';
  exception when others then if sqlerrm like 'ФАЛ%' then raise; end if; end;
  -- дархост карда, ФАВРАН — рад (60 сония нагузашт)
  if public.request_staff_removal('t-old@test.local') <> 'ok' then raise exception 'ФАЛ: дархост нашуд'; end if;
  begin perform public.set_role('t-old@test.local', 'user'); raise exception 'ФАЛ: доимӣ дар 0 сония бардошта шуд';
  exception when others then if sqlerrm like 'ФАЛ%' then raise; end if; end;
  execute 'reset role';
  -- 61 сония гузашт → мешавад
  update public.staff_removal_requests set requested_at = now() - interval '61 seconds' where target = '00000000-0000-4000-8000-0000000000b1';
  execute 'set local role authenticated';
  if public.set_role('t-old@test.local', 'user') <> 'ok' then raise exception 'ФАЛ: баъди 60 сония набардошта шуд'; end if;
  execute 'reset role';
  if (select role from public.profiles where id = '00000000-0000-4000-8000-0000000000b1') <> 'user' then raise exception 'ФАЛ: нақш иваз нашуд'; end if;
  -- дархости кӯҳна (>10 дақиқа) кор намекунад
  update public.profiles set role = 'subadmin' where id = '00000000-0000-4000-8000-0000000000b1';
  update public.profiles set staff_since = now() - interval '40 days' where id = '00000000-0000-4000-8000-0000000000b1';
  insert into public.staff_removal_requests(target, requested_by, requested_at) values ('00000000-0000-4000-8000-0000000000b1','00000000-0000-4000-8000-0000000000b0', now() - interval '11 minutes')
    on conflict (target) do update set requested_at = excluded.requested_at;
  execute 'set local role authenticated';
  begin perform public.set_role('t-old@test.local', 'user'); raise exception 'ФАЛ: дархости кӯҳна кор кард';
  exception when others then if sqlerrm like 'ФАЛ%' then raise; end if; end;
  -- бекор кардан
  perform public.cancel_staff_removal('t-old@test.local');
  execute 'reset role';
  if exists (select 1 from public.staff_removal_requests where target = '00000000-0000-4000-8000-0000000000b1') then raise exception 'ФАЛ: бекор нашуд'; end if;
  -- корбари оддӣ: request_staff_removal манъ
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000b3', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000b3"}', true);
  execute 'set local role authenticated';
  begin perform public.request_staff_removal('t-old@test.local'); raise exception 'ФАЛ: корбар дархост дод';
  exception when others then if sqlerrm like 'ФАЛ%' then raise; end if; end;
  execute 'reset role';
  raise notice 'ҲАМА ГУЗАШТ (ёрдамчи доимӣ/нав, қулфи сервер 60 сония)';
end $t$;
rollback;
