-- Китобхона: танзимоти огоҳиномаҳо (ёдоварии ҳаррӯза ва табрики хондан)
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Такроран ишлатиш мумкин.
-- Талаб: аввал docs/sql-poadmin.sql иҷро шуда бошад (is_staff).

create table if not exists public.notif_cfg (
  id int primary key default 1 check (id = 1),
  remind_on boolean not null default true,
  congrats_on boolean not null default true,
  remind_hour int not null default 20 check (remind_hour between 9 and 21),
  remind_text jsonb not null default '{}'::jsonb,
  congrats_tpl jsonb not null default '{}'::jsonb,
  sub_can_edit boolean not null default false,
  updated_at timestamptz default now()
);
insert into public.notif_cfg (id) values (1) on conflict do nothing;
alter table public.notif_cfg enable row level security;
drop policy if exists "notif read" on public.notif_cfg;
create policy "notif read" on public.notif_cfg for select using (true);
grant select on public.notif_cfg to anon, authenticated;

-- Навиштан: админ ҳамеша; ёрдамчӣ танҳо агар админ иҷозат дода бошад
create or replace function public.save_notif_cfg(p jsonb) returns void
language plpgsql security definer set search_path = public as $$
declare can boolean;
begin
  select (public.is_admin() or (public.is_staff() and n.sub_can_edit)) into can from public.notif_cfg n where n.id = 1;
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
