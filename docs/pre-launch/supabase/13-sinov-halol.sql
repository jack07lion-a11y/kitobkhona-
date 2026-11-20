begin;
insert into auth.users(id, email) values
 ('00000000-0000-4000-8000-0000000000f1','h-a@test.local'),('00000000-0000-4000-8000-0000000000f2','h-b@test.local'),
 ('00000000-0000-4000-8000-0000000000f3','h-c@test.local'),('00000000-0000-4000-8000-0000000000f4','h-adm@test.local');
insert into public.profiles(id, name, name_key, role, created_at) values
 ('00000000-0000-4000-8000-0000000000f1','Алдоқчӣ','h-a','user','2026-01-01'),
 ('00000000-0000-4000-8000-0000000000f2','Ҳалол','h-b','user','2026-01-02'),
 ('00000000-0000-4000-8000-0000000000f3','Огоҳӣдор','h-c','user','2026-01-03'),
 ('00000000-0000-4000-8000-0000000000f4','Админ','h-adm','admin','2026-01-04');
do $t$
declare n bigint; s bigint; r record;
begin
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000f1', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000f1"}', true);
  execute 'set local role authenticated';
  perform public.track_read(3600, 1); perform public.track_read(3600, 1); perform public.track_read(600, 1);
  execute 'reset role';
  select coalesce(sum(sec), 0) into s from public.read_stats where user_id = '00000000-0000-4000-8000-0000000000f1';
  if s <> 7200 then raise exception 'ФАЛ: ҳамён: 7200 сония бояд ҳисоб шавад, ҳоло %', s; end if;
  select count(*) into n from public.read_strikes where user_id = '00000000-0000-4000-8000-0000000000f1';
  if n <> 1 then raise exception 'ФАЛ: огоҳӣ 1 бояд бошад, ҳоло %', n; end if;

  insert into public.read_stats(user_id, day, book_id, sec) values ('00000000-0000-4000-8000-0000000000f2', (now() at time zone 'utc')::date, 9, 28000);
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000f2', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000f2"}', true);
  execute 'set local role authenticated';
  perform public.track_read(3600, 1);
  execute 'reset role';
  select sum(sec) into s from public.read_stats where user_id = '00000000-0000-4000-8000-0000000000f2';
  if s <> 31600 then raise exception 'ФАЛ: ҳалол: 31600 бояд шавад, ҳоло %', s; end if;

  insert into public.read_stats(user_id, day, book_id, sec) values ('00000000-0000-4000-8000-0000000000f3', (now() at time zone 'utc')::date, 9, 28000);
  insert into public.read_strikes(user_id, kind, claimed, allowed) values ('00000000-0000-4000-8000-0000000000f3', 'fast', 9999, 10);
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000f3', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000f3"}', true);
  execute 'set local role authenticated';
  perform public.track_read(3600, 1);
  execute 'reset role';
  select sum(sec) into s from public.read_stats where user_id = '00000000-0000-4000-8000-0000000000f3';
  if s <> 28800 then raise exception 'ФАЛ: огоҳӣдор: ҳадди 28800 бояд бошад, ҳоло %', s; end if;

  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000f2', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000f2"}', true);
  execute 'set local role authenticated';
  begin perform * from public.suspicious_readers(7); execute 'reset role'; raise exception 'ФАЛ: корбари оддӣ шубҳаноклар рӯйхатини дид';
  exception when others then if sqlerrm like 'ФАЛ%' then raise; end if; execute 'reset role'; end;
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000f4', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000f4"}', true);
  execute 'set local role authenticated';
  select count(*) into n from public.suspicious_readers(7) where name in ('Алдоқчӣ', 'Огоҳӣдор');
  if n <> 2 then execute 'reset role'; raise exception 'ФАЛ: шубҳаноклар: Алдоқчӣ ва Огоҳӣдор бояд бошанд, ҳоло %', n; end if;
  select count(*) into n from public.suspicious_readers(7) where name = 'Ҳалол';
  if n <> 1 then execute 'reset role'; raise exception 'ФАЛ: Ҳалол 8 соат наздик хондааст (31600 ≥ 21600) — рӯйхатда бояд бошад, ҳоло %', n; end if;

  perform public.set_rating_ban('00000000-0000-4000-8000-0000000000f2', true);
  if exists (select 1 from public.leaderboard(50) where name = 'Ҳалол') then execute 'reset role'; raise exception 'ФАЛ: дур кардашуда ҳоло дар рейтинг аст'; end if;
  execute 'reset role';
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000f2', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000f2"}', true);
  execute 'set local role authenticated';
  begin perform public.set_rating_ban('00000000-0000-4000-8000-0000000000f1', true); execute 'reset role'; raise exception 'ФАЛ: корбари оддӣ дур карда тавонист';
  exception when others then if sqlerrm like 'ФАЛ%' then raise; end if; execute 'reset role'; end;

  raise notice 'ҲАМА ГУЗАШТ (ҳисоби ҳалол)';
end $t$;
rollback;
