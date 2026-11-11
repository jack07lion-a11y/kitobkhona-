-- КИТОБХОНА · 5-ҚАДАМ: СИНОВИ РЕЙТИНГ (ROLLBACK: маълумотга тегмайди). Охирида «ҲАМА ГУЗАШТ: рейтинг» чиқиши керак.
begin;
insert into auth.users(id, email) values
 ('00000000-0000-4000-8000-0000000000e1','t-a@test.local'),('00000000-0000-4000-8000-0000000000e2','t-b@test.local'),
 ('00000000-0000-4000-8000-0000000000e3','t-c@test.local'),('00000000-0000-4000-8000-0000000000e4','t-d@test.local'),
 ('00000000-0000-4000-8000-0000000000e5','t-h@test.local'),('00000000-0000-4000-8000-0000000000e6','t-x@test.local'),
 ('00000000-0000-4000-8000-0000000000e7','t-adm@test.local');
insert into public.profiles(id, name, name_key, role, created_at, avatar, bio, hide_rating, deleted_at) values
 ('00000000-0000-4000-8000-0000000000e1','Аъзам','t-azam','user','2026-01-01','av:3','Китоб дӯст медорам',false,null),
 ('00000000-0000-4000-8000-0000000000e2','Бахтиёр','t-bakht','user','2026-01-02',null,null,false,null),
 ('00000000-0000-4000-8000-0000000000e3','Сино','t-sino','user','2026-01-03',null,null,false,null),
 ('00000000-0000-4000-8000-0000000000e4','Дилшод','t-dil','user','2026-01-04',null,null,false,null),
 ('00000000-0000-4000-8000-0000000000e5','Пинҳон','t-hid','user','2026-01-05',null,null,true,null),
 ('00000000-0000-4000-8000-0000000000e6','Нестшуда','t-del','user','2026-01-06',null,null,false,'2026-02-01'),
 ('00000000-0000-4000-8000-0000000000e7','Админ','t-adm','admin','2026-01-07',null,null,false,null);
insert into public.read_stats(user_id, day, book_id, sec) values
 ('00000000-0000-4000-8000-0000000000e1', current_date, 1, 3000),
 ('00000000-0000-4000-8000-0000000000e1', current_date - 40, 2, 600),
 ('00000000-0000-4000-8000-0000000000e2', current_date, 1, 1200),
 ('00000000-0000-4000-8000-0000000000e3', current_date, 1, 1200),
 ('00000000-0000-4000-8000-0000000000e5', current_date, 1, 9000),
 ('00000000-0000-4000-8000-0000000000e6', current_date, 1, 8000);
do $t$
declare r jsonb; n int; nm text; p bigint; s bigint;
begin
  perform set_config('request.jwt.claim.sub', '', true); perform set_config('request.jwt.claims', '{}', true);
  execute 'set local role anon';
  begin perform * from public.leaderboard(10); execute 'reset role'; raise exception 'ФАЛ: меҳмон рейтингро дид';
  exception when others then if sqlerrm like 'ФАЛ%' then raise; end if; execute 'reset role'; end;
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000e1', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000e1"}', true);
  execute 'set local role authenticated';
  select count(*) into n from public.leaderboard(10);
  if n <> 3 then execute 'reset role'; raise exception 'ФАЛ: дар рейтинг 3 нафар бояд бошад (0-дақиқа, пинҳон ва нестшуда не), ҳоло %', n; end if;
  select l.name, l.sec into nm, s from public.leaderboard(10) l where l.pos = 1;
  if nm <> 'Аъзам' or s <> 3600 then execute 'reset role'; raise exception 'ФАЛ: ҷои 1 нодуруст: % %', nm, s; end if;
  select l.name into nm from public.leaderboard(10) l where l.pos = 2;
  if nm <> 'Бахтиёр' then execute 'reset role'; raise exception 'ФАЛ: баробарӣ: пештар сабтшуда (Бахтиёр) ҷои 2, ҳоло %', nm; end if;
  select l.name into nm from public.leaderboard(10) l where l.pos = 3;
  if nm <> 'Сино' then execute 'reset role'; raise exception 'ФАЛ: ҷои 3 нодуруст: %', nm; end if;
  if (select count(*) from public.leaderboard(2)) <> 2 then execute 'reset role'; raise exception 'ФАЛ: p_limit кор намекунад'; end if;
  select l.sec into s from public.leaderboard(10, 30) l where l.pos = 1;
  if s <> 3000 then execute 'reset role'; raise exception 'ФАЛ: p_days нодуруст: %', s; end if;
  if (select l.avatar || l.bio from public.leaderboard(1) l) <> 'av:3Китоб дӯст медорам' then execute 'reset role'; raise exception 'ФАЛ: аватар/маълумот нест'; end if;
  r := public.my_rank();
  if (r->>'pos')::int <> 1 or (r->>'sec')::int <> 3600 or (r->>'n')::int <> 3 then execute 'reset role'; raise exception 'ФАЛ: my_rank Аъзам: %', r; end if;
  execute 'reset role';
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000e3', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000e3"}', true);
  execute 'set local role authenticated';
  r := public.my_rank();
  if (r->>'pos')::int <> 3 then execute 'reset role'; raise exception 'ФАЛ: my_rank Сино бояд 3 бошад: %', r; end if;
  execute 'reset role';
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000e4', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000e4"}', true);
  execute 'set local role authenticated';
  r := public.my_rank();
  if r->'pos' is distinct from 'null'::jsonb or (r->>'sec')::int <> 0 then execute 'reset role'; raise exception 'ФАЛ: бе хондан ҷой нест: %', r; end if;
  execute 'reset role';
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000e5', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000e5"}', true);
  execute 'set local role authenticated';
  r := public.my_rank();
  if (r->>'hidden')::boolean is not true then execute 'reset role'; raise exception 'ФАЛ: пинҳон ишора нашуд: %', r; end if;
  perform public.set_rating_visible(true);
  r := public.my_rank();
  if (r->>'pos')::int <> 1 then execute 'reset role'; raise exception 'ФАЛ: нишон дода шуд, 9000 сония бояд ҷои 1 бошад: %', r; end if;
  perform public.set_rating_visible(false);
  execute 'reset role';
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000e2', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000e2"}', true);
  execute 'set local role authenticated';
  perform public.delete_me();
  r := public.my_rank();
  execute 'reset role';
  if (r->>'deleted')::boolean is not true then raise exception 'ФАЛ: my_rank баъд аз нест кардан: %', r; end if;
  if (select deleted_at from public.profiles where id = '00000000-0000-4000-8000-0000000000e2') is null then raise exception 'ФАЛ: deleted_at гузошта нашуд'; end if;
  if (select banned_until from auth.users where id = '00000000-0000-4000-8000-0000000000e2') <= now() then raise exception 'ФАЛ: кириш манъ нашуд (banned_until)'; end if;
  if (select count(*) from public.read_stats where user_id = '00000000-0000-4000-8000-0000000000e2') <> 1 then raise exception 'ФАЛ: маълумот ҳамон дам нест шуд, бояд 30 рӯз монад'; end if;
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000e1', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000e1"}', true);
  execute 'set local role authenticated';
  select count(*) into n from public.leaderboard(10);
  if n <> 2 then execute 'reset role'; raise exception 'ФАЛ: нестшуда дар рейтинг мондааст (%)', n; end if;
  begin perform * from public.deleted_list(); execute 'reset role'; raise exception 'ФАЛ: корбар deleted_list-ро дид';
  exception when others then if sqlerrm like 'ФАЛ%' then raise; end if; execute 'reset role'; end;
  begin perform public.restore_account('00000000-0000-4000-8000-0000000000e2'); raise exception 'ФАЛ: корбар ҳисобро тиклад';
  exception when others then if sqlerrm like 'ФАЛ%' then raise; end if; end;
  execute 'reset role';
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000e7', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000e7"}', true);
  execute 'set local role authenticated';
  select count(*) into n from public.deleted_list();
  if n <> 2 then execute 'reset role'; raise exception 'ФАЛ: deleted_list 2 нафар (Бахтиёр, Нестшуда) бояд бошад, ҳоло %', n; end if;
  if public.restore_account('00000000-0000-4000-8000-0000000000e2') <> 'ok' then execute 'reset role'; raise exception 'ФАЛ: restore_account'; end if;
  if public.restore_account('00000000-0000-4000-8000-0000000000e2') <> 'not_found' then execute 'reset role'; raise exception 'ФАЛ: такрорӣ тикланиш'; end if;
  begin perform public.delete_me(); execute 'reset role'; raise exception 'ФАЛ: админ худро нест кард';
  exception when others then if sqlerrm like 'ФАЛ%' then raise; end if; execute 'reset role'; end;
  execute 'reset role';
  if (select deleted_at from public.profiles where id = '00000000-0000-4000-8000-0000000000e2') is not null
     or (select banned_until from auth.users where id = '00000000-0000-4000-8000-0000000000e2') is not null then raise exception 'ФАЛ: тикланиш deleted_at/banned_until-ро набардошт'; end if;
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000e1', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000e1"}', true);
  execute 'set local role authenticated';
  select count(*) into n from public.leaderboard(10);
  if n <> 3 then execute 'reset role'; raise exception 'ФАЛ: тиклангандан баъд Бахтиёр рейтингга баргашта бояд (%)', n; end if;
  execute 'reset role';
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000e7', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000e7"}', true);
  execute 'set local role authenticated';
  n := public.purge_deleted(30);     -- «Нестшуда» (2026-02-01) 30 рӯзи гузашта, Бахтиёр тикланд
  execute 'reset role';
  if n <> 1 then raise exception 'ФАЛ: purge_deleted 1 бояд, ҳоло %', n; end if;
  if exists (select 1 from auth.users where id = '00000000-0000-4000-8000-0000000000e6') or exists (select 1 from public.read_stats where user_id = '00000000-0000-4000-8000-0000000000e6') then raise exception 'ФАЛ: тоза кардан маълумотро нест накард'; end if;
  if not exists (select 1 from auth.users where id = '00000000-0000-4000-8000-0000000000e2') then raise exception 'ФАЛ: тоза кардан ҳисоби тиклашударо нест кард'; end if;
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000e1', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000e1"}', true);
  execute 'set local role authenticated';
  begin perform public.purge_deleted(0); execute 'reset role'; raise exception 'ФАЛ: корбар purge кард';
  exception when others then if sqlerrm like 'ФАЛ%' then raise; end if; execute 'reset role'; end;
  execute 'reset role';
  raise notice 'ҲАМА ГУЗАШТ (рейтинг, нест кардан ва тиклаш)';
end $t$;
rollback;
select 'ҲАМА ГУЗАШТ: рейтинг' as natija;
