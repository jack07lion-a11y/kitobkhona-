-- Китобхона: нақши нав «Ёрдамчии админ» (subadmin)
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Такроран ишлатиш мумкин.
-- Ёрдамчии админ ҳозир ҳамаи корҳои админро мекунад (китоб, муқова, нашр, нест кардан).
-- Дар оянда фақат админ мекунад: ҷойҳои `is_admin()` -ро нигоҳ медорем.

-- 1. Нақши нав
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('user','subadmin','admin'));

-- 2. «Кормандам?» (админ ё ёрдамчии админ)
create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role in ('admin','subadmin'))
$$;
revoke all on function public.is_staff() from public;
grant execute on function public.is_staff() to anon, authenticated;

-- 3. Қоидаҳои китобҳо: ҳам админ, ҳам ёрдамчӣ
drop policy if exists "books read" on public.books;
drop policy if exists "books admin insert" on public.books;
drop policy if exists "books admin update" on public.books;
drop policy if exists "books admin delete" on public.books;
create policy "books read" on public.books for select using (published or public.is_staff());
create policy "books admin insert" on public.books for insert with check (public.is_staff());
create policy "books admin update" on public.books for update using (public.is_staff()) with check (public.is_staff());
create policy "books admin delete" on public.books for delete using (public.is_staff());

-- 4. Қоидаҳои файлҳо (матн ва муқова)
drop policy if exists "books files read" on storage.objects;
drop policy if exists "books files admin insert" on storage.objects;
drop policy if exists "books files admin update" on storage.objects;
drop policy if exists "books files admin delete" on storage.objects;
create policy "books files read" on storage.objects for select using (bucket_id = 'books' and (public.is_staff() or exists (select 1 from public.books b where b.published and b.slug = split_part(name, '/', 1))));
create policy "books files admin insert" on storage.objects for insert with check (bucket_id = 'books' and public.is_staff());
create policy "books files admin update" on storage.objects for update using (bucket_id = 'books' and public.is_staff());
create policy "books files admin delete" on storage.objects for delete using (bucket_id = 'books' and public.is_staff());

-- 5. Касеро ёрдамчии админ кардан (почтаашро иваз кунед, баъд ин сатрро алоҳида Run кунед):
-- update public.profiles set role = 'subadmin' where id = (select id from auth.users where email = 'POCHTA@gmail.com');
-- Баргардондан ба оддӣ:
-- update public.profiles set role = 'user' where id = (select id from auth.users where email = 'POCHTA@gmail.com');
