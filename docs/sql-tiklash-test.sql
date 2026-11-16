-- Китобхона: СИНОВИ ТИКЛАШ (админ ва ёрдамчӣ). Дар охир ROLLBACK. Талаб: sql-tiklash.sql
begin;
insert into auth.users(id, email) values
  ('00000000-0000-4000-8000-0000000000a1','t-sub@test.local'),
  ('00000000-0000-4000-8000-0000000000a2','t-del@test.local'),
  ('00000000-0000-4000-8000-0000000000a3','t-usr@test.local');
insert into public.profiles(id, name, name_key, role) values
  ('00000000-0000-4000-8000-0000000000a1','ТестЁрдамчӣ','тестёрдамчӣ','subadmin'),
  ('00000000-0000-4000-8000-0000000000a2','ТестНест','тестнест','user'),
  ('00000000-0000-4000-8000-0000000000a3','ТестКорбар','тесткорбар','user');
update public.profiles set deleted_at = now() - interval '400 days' where id = '00000000-0000-4000-8000-0000000000a2';
do $t$
declare n int; r text;
begin
  -- ёрдамчӣ: рӯйхатро мебинад ва ҳатто баъд аз 400 рӯз тикла мекунад
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000a1', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000a1"}', true);
  execute 'set local role authenticated';
  select count(*) into n from public.deleted_list() where id = '00000000-0000-4000-8000-0000000000a2';
  if n <> 1 then raise exception 'ФАЛ: ёрдамчӣ рӯйхатро надид (%)', n; end if;
  r := public.restore_account('00000000-0000-4000-8000-0000000000a2');
  if r <> 'ok' then raise exception 'ФАЛ: ёрдамчӣ (400 рӯз баъд) тикла накард (%)', r; end if;
  execute 'reset role';
  if (select deleted_at from public.profiles where id = '00000000-0000-4000-8000-0000000000a2') is not null then raise exception 'ФАЛ: deleted_at тоза нашуд'; end if;
  -- корбари оддӣ: манъ
  update public.profiles set deleted_at = now() where id = '00000000-0000-4000-8000-0000000000a2';
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000a3', true);
  perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000a3"}', true);
  execute 'set local role authenticated';
  begin perform public.restore_account('00000000-0000-4000-8000-0000000000a2'); raise exception 'ФАЛ: корбар тикла кард';
  exception when others then if sqlerrm like 'ФАЛ%' then raise; end if; end;
  begin perform * from public.deleted_list(); raise exception 'ФАЛ: корбар рӯйхатро дид';
  exception when others then if sqlerrm like 'ФАЛ%' then raise; end if; end;
  execute 'reset role';
  raise notice 'ҲАМА ГУЗАШТ (тиклаш: админ/ёрдамчӣ, бе муҳлат)';
end $t$;
rollback;
