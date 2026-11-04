-- Китобхона: профил (сурат, баннер, маълумот, ивази ном)
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Фақат бир марта. (Аввал sql-nomho.sql иҷро шудааст.)

alter table public.profiles
  add column if not exists avatar text,
  add column if not exists banner text,
  add column if not exists bio text;

-- Сабти сурат/баннер/маълумот. Духтарон танҳо аватари тайёр (av:1..av:9) гузошта метавонанд.
create or replace function public.save_profile(p_avatar text, p_banner text, p_bio text)
returns void language plpgsql security definer set search_path = public as $$
declare g text := coalesce(auth.jwt() -> 'user_metadata' ->> 'gender', '');
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if g = 'girl' and p_avatar is not null and p_avatar !~ '^av:[0-9]+$' then
    raise exception 'girl_avatar';
  end if;
  update profiles set avatar = left(p_avatar, 600), banner = left(p_banner, 600), bio = left(p_bio, 300)
   where id = auth.uid();
end $$;
revoke all on function public.save_profile(text, text, text) from public, anon;
grant execute on function public.save_profile(text, text, text) to authenticated;

-- Ивази ном: беҳамто мемонад (Ном, Ном 1, Ном 2 ...)
create or replace function public.rename_me(p_name text)
returns text language plpgsql security definer set search_path = public as $$
declare base text := left(trim(p_name), 40); cand text; n int := 0; uid uuid := auth.uid();
begin
  if uid is null then raise exception 'not signed in'; end if;
  if base = '' then raise exception 'empty name'; end if;
  loop
    cand := case when n = 0 then base else base || ' ' || n end;
    begin
      update profiles set name = cand, name_key = lower(cand) where id = uid;
      return cand;
    exception when unique_violation then n := n + 1;
    end;
  end loop;
end $$;
revoke all on function public.rename_me(text) from public, anon;
grant execute on function public.rename_me(text) to authenticated;

-- Анбори расмҳо
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict (id) do nothing;
drop policy if exists "avatars read" on storage.objects;
create policy "avatars read" on storage.objects for select using (bucket_id = 'avatars');
drop policy if exists "avatars write" on storage.objects;
create policy "avatars write" on storage.objects for insert to authenticated with check (
  bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  and not (name like '%/avatar.jpg' and coalesce(auth.jwt() -> 'user_metadata' ->> 'gender', '') = 'girl'));
drop policy if exists "avatars update" on storage.objects;
create policy "avatars update" on storage.objects for update to authenticated using (
  bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  and not (name like '%/avatar.jpg' and coalesce(auth.jwt() -> 'user_metadata' ->> 'gender', '') = 'girl'));
