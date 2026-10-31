-- Китобхона: нашри навсозии APK (админ дар барнома «Нашр кардан»-ро пахш мекунад)
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Такроран ишлатиш мумкин.
-- Талаб: is_admin() (docs/sql-admin.sql)

create table if not exists public.app_release (
  id int primary key default 1 check (id = 1),
  version int not null default 0,
  url text,
  updated_at timestamptz default now()
);
-- Ҳозир нашршуда: #56 (то ки APK-ҳои кӯҳна навсозиро бинанд)
insert into public.app_release (id, version, url)
values (1, 56, 'https://github.com/jack07lion-a11y/kitobkhona-/releases/download/apk-56/kitobkhona.apk')
on conflict do nothing;
alter table public.app_release enable row level security;
drop policy if exists "release read" on public.app_release;
create policy "release read" on public.app_release for select using (true);
grant select on public.app_release to anon, authenticated;

-- Нашр кардан (танҳо админ). p_version = 0: қатъ кардан (баннер намеояд)
create or replace function public.publish_release(p_version int, p_url text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  if p_version < 0 then raise exception 'bad version'; end if;
  if p_version > 0 and (p_url is null or not starts_with(p_url, 'https://github.com/jack07lion-a11y/kitobkhona-/releases/')) then
    raise exception 'bad url';
  end if;
  update public.app_release set version = p_version, url = coalesce(p_url, url), updated_at = now() where id = 1;
end $$;
revoke all on function public.publish_release(int, text) from public, anon;
grant execute on function public.publish_release(int, text) to authenticated;
