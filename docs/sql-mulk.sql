-- Китобхона: ҳуқуқи китоб (мулк) — ҳолат, соҳиб, манба, нашр, мутарҷим
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Такроран ишлатиш мумкин. Талаб: sql-admin (books).
-- Ҳолатҳо: public_domain (ҷамъиятӣ), licensed (иҷозатнома/розигӣ дорем), pending (ҳоло номаълум).
-- Ин ҷо ҳуқуқӣ хулоса НЕСТ: фақат маълумот сабт мешавад. Ҳолатро бунёдгузорон мустақилона муайян мекунанд.
-- Қоида: pending → китобро НАШР кардан мумкин нест (сервер рад мекунад). Китобҳои аллакай нашршуда нашрӣ мемонанд (катъӣ пинҳон
--        намешаванд), то қарори бунёдгузорон; рӯйхати онҳо: select id, t from books where published and rights_status = 'pending';

alter table public.books add column if not exists rights_status text not null default 'pending';
alter table public.books drop constraint if exists books_rights_status_check;
alter table public.books add constraint books_rights_status_check check (rights_status in ('public_domain','licensed','pending'));
alter table public.books add column if not exists rights_holder text;
alter table public.books add column if not exists source text;
alter table public.books add column if not exists edition text;
alter table public.books add column if not exists translator text;
alter table public.books add column if not exists license_note text;

create or replace function public.books_rights_guard() returns trigger
language plpgsql as $$
begin
  if new.published then
    if tg_op = 'INSERT' or not coalesce(old.published, false)
       or new.rights_status is distinct from old.rights_status
       or new.rights_holder is distinct from old.rights_holder or new.source is distinct from old.source then
      if new.rights_status = 'pending' then raise exception 'rights_pending'; end if;
      if coalesce(trim(new.source), '') = '' then raise exception 'source_required'; end if;
      if new.rights_status = 'licensed' and coalesce(trim(new.rights_holder), '') = '' then raise exception 'rights_holder_required'; end if;
    end if;
  end if;
  return new;
end $$;
drop trigger if exists books_rights_guard on public.books;
create trigger books_rights_guard before insert or update on public.books for each row execute function public.books_rights_guard();
