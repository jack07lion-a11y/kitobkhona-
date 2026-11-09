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
