-- Китобхона: махфийлик — розигӣ, гурӯҳи синнӣ, ҳисобро нест кардан (delete_me)
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Такроран ишлатиш мумкин. Талаб: sql-nomho (profiles), sql-aloqa (reports, error_log, read_stats, active_days), sql-profil (avatars).

alter table public.profiles add column if not exists consent_at timestamptz;
alter table public.profiles add column if not exists consent_ver text;
alter table public.profiles add column if not exists age_group text;
alter table public.profiles add column if not exists guardian_ok boolean not null default false;
alter table public.profiles drop constraint if exists profiles_age_group_check;
alter table public.profiles add constraint profiles_age_group_check check (age_group is null or age_group in ('under18','adult'));

-- Розигӣ ва синну сол. 18-сола хурд бошад — «ота-она/васӣ огоҳ аст» ҳатмист.
create or replace function public.save_consent(p_age_group text, p_guardian boolean, p_ver text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if p_age_group not in ('under18','adult') then raise exception 'bad age_group'; end if;
  if p_age_group = 'under18' and not coalesce(p_guardian, false) then raise exception 'guardian_required'; end if;
  update public.profiles set age_group = p_age_group, guardian_ok = coalesce(p_guardian, false),
         consent_at = now(), consent_ver = left(coalesce(p_ver, ''), 20)
   where id = auth.uid();
end $$;
revoke all on function public.save_consent(text, boolean, text) from public, anon;
grant execute on function public.save_consent(text, boolean, text) to authenticated;

-- Файлҳои худӣ: корбар аватар/баннери худро нест карда метавонад (барои delete_me аз барнома)
drop policy if exists "avatars delete" on storage.objects;
create policy "avatars delete" on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- Ҳисобро пурра нест кардан. Админ худро ин ҷо нест карда наметавонад (то система бе админ намонад).
create or replace function public.delete_me() returns void
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'not signed in'; end if;
  if public.is_admin() then raise exception 'admin_cannot_delete'; end if;
  delete from public.read_stats where user_id = uid;
  delete from public.active_days where user_id = uid;
  delete from public.error_log where user_id = uid;
  delete from public.reports where user_id = uid;
  if to_regclass('public.user_state') is not null then execute 'delete from public.user_state where user_id = $1' using uid; end if;
  -- Файлҳо дар Storage: Supabase-и нав нест кардани мустақимро манъ мекунад (storage.protect_delete).
  -- Аватарро барнома аз Storage API нест мекунад; агар ин ҷо манъ бошад, ҳисоб бояд ба ҳар ҳол нест шавад.
  begin
    delete from storage.objects where bucket_id in ('avatars','reports') and (storage.foldername(name))[1] = uid::text;
  exception when others then null;
  end;
  delete from auth.users where id = uid;   -- profiles бо on delete cascade меравад
end $$;
revoke all on function public.delete_me() from public, anon;
grant execute on function public.delete_me() to authenticated;
