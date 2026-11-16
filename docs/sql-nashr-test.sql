-- Китобхона: СИНОВИ НАШР БЕ ҲУҚУҚ. Дар охир ROLLBACK. Талаб: sql-nashr.sql
begin;
do $t$
declare st text;
begin
  insert into public.books(t,a,c,published,slug) values ('x','x','fiction',true,'nz-1');
  select rights_status into st from public.books where slug = 'nz-1';
  if st <> 'pending' then raise exception 'ФАЛ: ҳолат pending бояд мемонд (%)', st; end if;
  if not (select published from public.books where slug = 'nz-1') then raise exception 'ФАЛ: нашр нашуд'; end if;
  insert into public.books(t,a,c,published,slug) values ('draft','x','fiction',false,'nz-2');
  update public.books set published = true where slug = 'nz-2';
  if not (select published from public.books where slug = 'nz-2') then raise exception 'ФАЛ: пешнавис нашр нашуд'; end if;
  raise notice 'ҲАМА ГУЗАШТ (нашр бе ҳуқуқ, ҳолат pending мемонад)';
end $t$;
rollback;
