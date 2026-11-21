-- Китобхона: СИНОВИ «ДАСТГОҲ» (телефони ҳақиқӣ, қайта насб, модел). Дар охир ROLLBACK. Талаб: sql-qurilma.sql
begin;
insert into auth.users(id, email) values ('00000000-0000-4000-8000-0000000000b1','q-a@test.local'),('00000000-0000-4000-8000-0000000000b2','q-adm@test.local');
insert into public.profiles(id, name, name_key, role, created_at) values
 ('00000000-0000-4000-8000-0000000000b1','Қурилма','q-a','user', now()),('00000000-0000-4000-8000-0000000000b2','Админ','q-adm','admin', now());
do $t$
declare r jsonb; p0 int; r0 int; a0 int; g0 int;
begin
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000b2', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000b2"}', true);
  execute 'set local role authenticated';
  r := public.funnel(30); p0 := (r->>'phones')::int; r0 := (r->>'reinstalls')::int; a0 := (r->>'phones_anon')::int; g0 := (r->>'phones_reg')::int;
  execute 'reset role';
  perform set_config('request.jwt.claim.sub', '', true); perform set_config('request.jwt.claims', '{}', true);
  execute 'set local role anon';
  -- телефони 1 (Samsung): ду насб (ҳамон hw), телефони 2 (Xiaomi): як насб, сайт: як ID бе hw
  perform public.track_install('dev-aaaaaaaa-1', true, 'aaaaaaaaaaaaaaaaaaaa1111', 'Samsung A15', 'Android 14');
  perform public.track_install('dev-aaaaaaaa-2', true, 'aaaaaaaaaaaaaaaaaaaa1111', 'Samsung A15', 'Android 14');
  perform public.track_install('dev-bbbbbbbb-3', true, 'bbbbbbbbbbbbbbbbbbbb2222', 'Xiaomi Redmi 12', 'Android 13');
  perform public.track_install('dev-cccccccc-4', false, null, 'iPhone', null);
  perform public.track_install('dev-dddddddd-5', true, 'не-hex-нодуруст', 'Хато', null); -- hw нодуруст: ҳисоб бо ID
  execute 'reset role';
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000b2', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000b2"}', true);
  execute 'set local role authenticated';
  r := public.funnel(30);
  if (r->>'phones')::int <> p0 + 4 then execute 'reset role'; raise exception 'ФАЛ: телефонҳои ҳақиқӣ 4 нав бояд бошад (Samsung 1 бор, Xiaomi, iPhone, Хато): %', r; end if;
  if (r->>'reinstalls')::int <> r0 + 1 then execute 'reset role'; raise exception 'ФАЛ: қайта насб 1 бояд бошад: %', r; end if;
  if (r->>'phones_anon')::int <> a0 + 4 then execute 'reset role'; raise exception 'ФАЛ: ҳама 4 ворид нашудаанд: %', r; end if;
  if not exists (select 1 from jsonb_array_elements(r->'models') m where m->>'model' = 'Samsung A15' and (m->>'n')::int = 1) then
    execute 'reset role'; raise exception 'ФАЛ: Samsung A15 дар моделҳо 1 бор бояд бошад: %', r->'models'; end if;
  -- Samsung (насби дуюм) воридшавӣ мекунад → телефон «ворид шуд», қайта насби дигар ҳисоб нашавад
  execute 'reset role';
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000b1', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000b1"}', true);
  execute 'set local role authenticated';
  perform public.track_install('dev-aaaaaaaa-2', true, 'aaaaaaaaaaaaaaaaaaaa1111', 'Samsung A15', 'Android 14');
  execute 'reset role';
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000b2', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000b2"}', true);
  execute 'set local role authenticated';
  r := public.funnel(30);
  if (r->>'phones_reg')::int <> g0 + 1 or (r->>'phones_anon')::int <> a0 + 3 or (r->>'phones')::int <> p0 + 4 then
    execute 'reset role'; raise exception 'ФАЛ: Samsung воридшуда, дигарон не: %', r; end if;
  -- корбари оддӣ намебинад
  execute 'reset role';
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000b1', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000b1"}', true);
  execute 'set local role authenticated';
  begin perform public.funnel(30); execute 'reset role'; raise exception 'ФАЛ: корбари оддӣ дид';
  exception when others then if sqlerrm like 'ФАЛ%' then raise; end if; execute 'reset role'; end;
  raise notice 'ҲАМА ГУЗАШТ (дастгоҳ, қайта насб, модел)';
end $t$;
rollback;
