-- Китобхона: файлҳои китоб (матн ва муқова) дар Supabase Storage
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Такроран ишлатиш мумкин.

alter table public.books drop constraint if exists books_c_check;
alter table public.books add column if not exists slug text unique;
alter table public.books add column if not exists cover_path text;
alter table public.books add column if not exists text_path text;

insert into storage.buckets (id, name, public) values ('books', 'books', false) on conflict (id) do nothing;

drop policy if exists "books files read" on storage.objects;
drop policy if exists "books files admin insert" on storage.objects;
drop policy if exists "books files admin update" on storage.objects;
drop policy if exists "books files admin delete" on storage.objects;
-- Хондан: админ ҳама вақт; дигарон фақат китоби нашршуда
create policy "books files read" on storage.objects for select using (bucket_id = 'books' and (public.is_admin() or exists (select 1 from public.books b where b.published and b.slug = split_part(name, '/', 1))));
create policy "books files admin insert" on storage.objects for insert with check (bucket_id = 'books' and public.is_admin());
create policy "books files admin update" on storage.objects for update using (bucket_id = 'books' and public.is_admin());
create policy "books files admin delete" on storage.objects for delete using (bucket_id = 'books' and public.is_admin());
