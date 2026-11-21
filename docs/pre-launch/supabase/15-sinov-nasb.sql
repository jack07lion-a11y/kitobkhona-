begin;
insert into auth.users(id, email) values ('00000000-0000-4000-8000-0000000000d1','n-a@test.local'),('00000000-0000-4000-8000-0000000000d2','n-adm@test.local');
insert into public.profiles(id, name, name_key, role, created_at) values
 ('00000000-0000-4000-8000-0000000000d1','Насбкунанда','n-a','user', now()),
 ('00000000-0000-4000-8000-0000000000d2','Админ','n-adm','admin', now());
do $t$
declare r jsonb; base int; a0 int; k0 int;
begin
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000d2', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000d2"}', true);
  execute 'set local role authenticated';
  r := public.funnel(30); base := (r->>'installs')::int; a0 := (r->>'installs_anon')::int; k0 := (r->>'installs_apk')::int;
  execute 'reset role';
  perform set_config('request.jwt.claim.sub', '', true); perform set_config('request.jwt.claims', '{}', true);
  execute 'set local role anon';
  perform public.track_install('dev-aaaaaaaa-1', true); perform public.track_install('dev-bbbbbbbb-2', true); perform public.track_install('dev-cccccccc-3', false);
  execute 'reset role';
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000d2', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000d2"}', true);
  execute 'set local role authenticated';
  r := public.funnel(30);
  if (r->>'installs')::int <> base + 3 or (r->>'installs_anon')::int <> a0 + 3 or (r->>'installs_apk')::int <> k0 + 2 then
    execute 'reset role'; raise exception 'ФАЛ: 3 дастгоҳи нав (2 APK), ворид нашуда: %', r; end if;
  execute 'reset role';
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000d1', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000d1"}', true);
  execute 'set local role authenticated';
  perform public.track_install('dev-aaaaaaaa-1', true);
  execute 'reset role';
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000d2', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000d2"}', true);
  execute 'set local role authenticated';
  r := public.funnel(30);
  if (r->>'installs_anon')::int <> a0 + 2 or (r->>'installs')::int <> base + 3 then execute 'reset role'; raise exception 'ФАЛ: баъди воридшавӣ ворид нашуда 2 бояд бошад: %', r; end if;
  execute 'reset role';
  perform set_config('request.jwt.claim.sub', '', true); perform set_config('request.jwt.claims', '{}', true);
  execute 'set local role anon';
  perform public.track_install('dev-aaaaaaaa-1', true);
  execute 'reset role';
  if (select user_id from public.app_installs where device = 'dev-aaaaaaaa-1') is null then raise exception 'ФАЛ: пайвастшавӣ гум шуд'; end if;
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000d1', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000d1"}', true);
  execute 'set local role authenticated';
  begin perform public.funnel(30); execute 'reset role'; raise exception 'ФАЛ: корбари оддӣ воронкаро дид';
  exception when others then if sqlerrm like 'ФАЛ%' then raise; end if; execute 'reset role'; end;
  raise notice 'ҲАМА ГУЗАШТ (насб ва воридшавӣ)';
end $t$;
rollback;
