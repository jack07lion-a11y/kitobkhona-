-- Китобхона: ҳимояи Премиум — китоби пулакиро фақат корбари ҳуқуқдор мегирад (сервер ҳал мекунад, на барнома)
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Такроран ишлатиш мумкин.
-- Талаб: sql-admin, sql-omor (app_flags.premium_on), sql-fayl, sql-poadmin, sql-ijozat2 (has_perm), sql-huquq. Баъд: docs/sql-himoya-test.sql
--
-- Қоида (ҳамон як қоида дар барнома: locked(b) = Премиум фурӯзон && китоб премиум && корбар муштарак нест):
--  * app_flags.premium_on = хомӯш  → ҳамаи китобҳо ройгон (ҳамон тавре ки барнома нишон медиҳад)
--  * китоби премиум → матн (text_path) танҳо барои: муштарак (premium_until > ҳозир) ё корбари ҳуқуқи «books» дошта
--  * муқова (cover_path) ҳамеша хондашаванда барои китобҳои нашршуда, то рӯйхат пур бошад
-- Диққат: «парчаи ройгон»-и китоби премиум (3 саҳифа) бо ин ҳимоя ҳоло нест, зеро матн пурра баста мешавад.
--         Барои парча файли алоҳида (sample) лозим мешавад — қарор аз тарафи бунёдгузорон (docs/pre-launch/STATUS.md).

alter table public.profiles add column if not exists premium_until timestamptz;

create or replace function public.is_premium() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.premium_until is not null and p.premium_until > now());
$$;
revoke all on function public.is_premium() from public;
grant execute on function public.is_premium() to anon, authenticated;

-- Файли китобро кӣ хонда метавонад (storage.objects-и «books» шоха аз slug/…)
create or replace function public.can_read_book_file(p_name text) returns boolean
language sql stable security definer set search_path = public as $$
  select public.has_perm('books') or exists (
    select 1 from public.books b
     where b.published and b.slug = split_part(p_name, '/', 1)
       and ( coalesce(b.premium, false) = false
          or p_name = b.cover_path
          or public.is_premium()
          or not coalesce((select f.premium_on from public.app_flags f where f.id = 1), false) ));
$$;
revoke all on function public.can_read_book_file(text) from public;
grant execute on function public.can_read_book_file(text) to anon, authenticated;

drop policy if exists "books files read" on storage.objects;
create policy "books files read" on storage.objects for select
  using (bucket_id = 'books' and public.can_read_book_file(name));

-- Муштаракии корбар: фақат админ (барои фаъолсозӣ бо код — sql-premium.sql, баъдтар)
create or replace function public.set_premium(p_email text, p_until timestamptz) returns text
language plpgsql security definer set search_path = public as $$
declare uid uuid;
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  select id into uid from auth.users where lower(email) = lower(trim(p_email));
  if uid is null then return 'not_found'; end if;
  update public.profiles set premium_until = p_until where id = uid;
  if not found then return 'no_profile'; end if;
  return 'ok';
end $$;
revoke all on function public.set_premium(text, timestamptz) from public, anon;
grant execute on function public.set_premium(text, timestamptz) to authenticated;
