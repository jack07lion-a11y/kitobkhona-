-- Китобхона: ҳолати корбар дар сервер — пешравии хондан, токчаҳо, хатчӯбҳо (то ки бо аз нав насб кардан гум нашавад)
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Такроран ишлатиш мумкин. Талаб: auth.
-- Қоидаи ҳалли ихтилоф (чанд телефон):
--   prog  (пешравӣ)  — барои ҳар китоб БАЛАНДТАРИН фоиз ғолиб (пешравӣ танҳо меафзояд; баробар бошад — вақти нав).
--   lib   (токчаҳо)  — ҳамаи токчаҳо як дона: вақти охирини тағйир (t) нав бошад, ғолиб; нест кардан ҳам мерасад.
--   marks (хатчӯбҳо) — ҳамон қоидаи lib.
-- Маҳдудият: дар ду телефони гуногун дар як вақт токчаро тағйир диҳед — фақат охиринаш мемонад.

create table if not exists public.user_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.user_state enable row level security;
drop policy if exists "own state read" on public.user_state;
create policy "own state read" on public.user_state for select using (auth.uid() = user_id);
-- Навиштан фақат тавассути sync_state (сиёсати insert/update нест)

create or replace function public.sync_state(p jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid(); cur jsonb; pr jsonb; res jsonb; k text; a jsonb; b jsonb; n int := 0;
  va numeric; vb numeric; ta bigint; tb bigint;
begin
  if uid is null then raise exception 'not signed in'; end if;
  if p is null or jsonb_typeof(p) <> 'object' then raise exception 'bad payload'; end if;
  if octet_length(p::text) > 400000 then raise exception 'too large'; end if;
  insert into public.user_state(user_id) values (uid) on conflict do nothing;
  select data into cur from public.user_state where user_id = uid for update;
  pr := coalesce(cur -> 'prog', '{}'::jsonb);
  if jsonb_typeof(p -> 'prog') = 'object' then
    for k, b in select key, value from jsonb_each(p -> 'prog') loop
      n := n + 1; if n > 5000 then raise exception 'too many books'; end if;
      if jsonb_typeof(b) <> 'object' then continue; end if;
      a := pr -> k;
      vb := coalesce((b ->> 'v')::numeric, 0); tb := coalesce((b ->> 't')::bigint, 0);
      if a is null then pr := jsonb_set(pr, array[k], b);
      else
        va := coalesce((a ->> 'v')::numeric, 0); ta := coalesce((a ->> 't')::bigint, 0);
        if vb > va or (vb = va and tb > ta) then pr := jsonb_set(pr, array[k], b); end if;
      end if;
    end loop;
  end if;
  res := jsonb_build_object('prog', pr);
  foreach k in array array['lib','marks'] loop
    a := cur -> k; b := p -> k;
    if b is null or jsonb_typeof(b) <> 'object' then res := res || jsonb_build_object(k, coalesce(a, 'null'::jsonb));
    elsif a is null or jsonb_typeof(a) <> 'object' or coalesce((b ->> 't')::bigint, 0) >= coalesce((a ->> 't')::bigint, 0) then res := res || jsonb_build_object(k, b);
    else res := res || jsonb_build_object(k, a);
    end if;
  end loop;
  update public.user_state set data = res, updated_at = now() where user_id = uid;
  return res;
end $$;
revoke all on function public.sync_state(jsonb) from public, anon;
grant execute on function public.sync_state(jsonb) to authenticated;
