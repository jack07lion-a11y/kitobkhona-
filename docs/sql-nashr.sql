-- Китобхона: НАШР БЕ ҲУҚУҚ — китобро ҳатто бо «Ҳоло номаълум» ҳам нашр кардан мумкин (админ тасдиқ мекунад дар барнома).
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Такроран ишлатиш мумкин. Талаб: sql-mulk.sql.
-- Пештар сервер pending китобро нашр кардан намегузошт (rights_pending). Ҳоло қоида хомӯш: ҳолат дар ҷадвал мемонад (pending = ҳоло тасдиқ нашудааст),
-- то бунёдгузорон баъдтар ҳуқуқро пур кунанд.

create or replace function public.books_rights_guard() returns trigger
language plpgsql set search_path = public as $$
begin
  return new;
end $$;
