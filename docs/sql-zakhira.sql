-- Китобхона: эслатмаи захира (ҳар 30 рӯз) — санаи охирин нав кардан барои админ ва ёрдамчӣ умумӣ аст
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Фақат бир маротиба.
alter table public.app_flags add column if not exists backup_at timestamptz not null default now();

create or replace function public.backup_done() returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_staff() then raise exception 'forbidden'; end if;
  update public.app_flags set backup_at = now() where id = 1;
end $$;
revoke all on function public.backup_done() from public, anon;
grant execute on function public.backup_done() to authenticated;
