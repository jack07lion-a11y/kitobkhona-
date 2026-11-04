-- Китобхона: иҷозатҳои ёрдамчӣ — нашри APK ва огоҳиномаҳо (пешфарз ХОМӯш)
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Фақат бир марта. (sql-ijozat.sql аллакай иҷро шудааст ё ин файл худаш ҳамаро месозад.)

alter table public.profiles add column if not exists perms jsonb not null default '{}'::jsonb;

create or replace function public.has_perm(k text) returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_admin() or exists (
    select 1 from public.profiles p
     where p.id = auth.uid() and p.role = 'subadmin' and coalesce((p.perms ->> k)::boolean, false));
$$;
revoke all on function public.has_perm(text) from public, anon;
grant execute on function public.has_perm(text) to authenticated;

-- Нашр кардан: админ ё ёрдамчӣ бо иҷозати «release»
create or replace function public.publish_release(p_version int, p_url text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.has_perm('release') then raise exception 'forbidden'; end if;
  if p_version < 0 then raise exception 'bad version'; end if;
  if p_version > 0 and (p_url is null or not starts_with(p_url, 'https://github.com/jack07lion-a11y/kitobkhona-/releases/')) then
    raise exception 'bad url';
  end if;
  update public.app_release set version = p_version, url = coalesce(p_url, url), updated_at = now() where id = 1;
end $$;
revoke all on function public.publish_release(int, text) from public, anon;
grant execute on function public.publish_release(int, text) to authenticated;

-- Огоҳиномаҳо: админ ҳамеша; ёрдамчӣ агар иҷозати «notif» ё «Ёрдамчиён ҳам таҳрир кунанд» фурӯзон бошад
create or replace function public.save_notif_cfg(p jsonb) returns void
language plpgsql security definer set search_path = public as $$
declare can boolean;
begin
  select (public.is_admin() or (public.is_staff() and (n.sub_can_edit or public.has_perm('notif')))) into can from public.notif_cfg n where n.id = 1;
  if not coalesce(can, false) then raise exception 'forbidden'; end if;
  update public.notif_cfg set
    remind_on = coalesce((p->>'remind_on')::boolean, remind_on),
    congrats_on = coalesce((p->>'congrats_on')::boolean, congrats_on),
    remind_hour = coalesce((p->>'remind_hour')::int, remind_hour),
    remind_text = coalesce(p->'remind_text', remind_text),
    congrats_tpl = coalesce(p->'congrats_tpl', congrats_tpl),
    sub_can_edit = case when public.is_admin() then coalesce((p->>'sub_can_edit')::boolean, sub_can_edit) else sub_can_edit end,
    updated_at = now()
  where id = 1;
end $$;
revoke all on function public.save_notif_cfg(jsonb) from public, anon;
grant execute on function public.save_notif_cfg(jsonb) to authenticated;
