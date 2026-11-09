-- Китобхона: «Тез кунда» байроқчалари (тугалланмаган бахшҳоро админ ҳамин ҷо аз барнома мекушояд)
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Такроран ишлатиш мумкин. Талаб: sql-omor.sql (app_flags), sql-admin.sql (is_admin).
-- Пешфарз: ҳама хомӯш = дар барнома «Ба зудӣ» нишон дода мешавад ё пинҳон аст.
-- Калидҳо: audio (аудиокитоб), buy (харид/обуна), contest (ИФМ/Фурӯғ/Баҳс), coin (Тавозуни хирад), rank (рейтинг/мақом),
--          social (баҳо ва фикри корбарон), ai (ёрдамчии китоб), quiz (озмуни санҷишӣ), teacher (кабинети муаллим)

alter table public.app_flags add column if not exists feat jsonb not null default '{}'::jsonb;

create or replace function public.set_feat(p_key text, p_on boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  if p_key not in ('audio','buy','contest','coin','rank','social','ai','quiz','teacher') then raise exception 'bad key'; end if;
  update public.app_flags set feat = jsonb_set(coalesce(feat, '{}'::jsonb), array[p_key], to_jsonb(coalesce(p_on, false)), true) where id = 1;
end $$;
revoke all on function public.set_feat(text, boolean) from public, anon;
grant execute on function public.set_feat(text, boolean) to authenticated;
-- Хондан: «flags read» (select using true) аллакай ҳаст (sql-omor.sql), ҳамин ҷо ҷудо сиёсат лозим нест.
