-- Китобхона: алоқа бо корбарон — хато/пешниҳод, хатоҳои техникӣ, омори хондан, хабарҳо, версияи ҳадди ақал
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Фақат бир маротиба (такрор иҷро кардан зарар надорад).
-- Талаб: is_admin(), is_staff() (sql-poadmin.sql), ҷадвали app_flags (sql-omor.sql), ҷадвали books.

-- =============== 1) Хабарҳо (ба ҳама) ===============
create table if not exists public.news (
  id bigserial primary key,
  title text not null,
  body text not null default '',
  created_at timestamptz not null default now()
);
alter table public.news enable row level security;
drop policy if exists "news read" on public.news;
create policy "news read" on public.news for select using (true);
grant select on public.news to anon, authenticated;

create or replace function public.post_news(p_title text, p_body text) returns bigint
language plpgsql security definer set search_path = public as $$
declare nid bigint;
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  if coalesce(trim(p_title), '') = '' then raise exception 'empty'; end if;
  insert into public.news (title, body) values (left(trim(p_title), 80), left(coalesce(p_body, ''), 300)) returning id into nid;
  return nid;
end $$;
revoke all on function public.post_news(text, text) from public, anon;
grant execute on function public.post_news(text, text) to authenticated;

-- =============== 2) Версияи ҳадди ақали APK ===============
alter table public.app_flags add column if not exists min_native int not null default 0;
create or replace function public.set_min_native(p int) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  update public.app_flags set min_native = greatest(coalesce(p, 0), 0) where id = 1;
end $$;
revoke all on function public.set_min_native(int) from public, anon;
grant execute on function public.set_min_native(int) to authenticated;

-- =============== 3) Хато ва пешниҳод аз корбарон ===============
create table if not exists public.reports (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete set null,
  name text,
  kind text not null default 'bug',
  body text not null,
  info jsonb not null default '{}'::jsonb,
  image text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);
alter table public.reports enable row level security;   -- бе сиёсат: ҳама танҳо тавассути функсияҳо

create or replace function public.submit_report(p_kind text, p_body text, p_info jsonb, p_image text) returns bigint
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); nm text; cnt int; nid bigint;
begin
  if uid is null then raise exception 'not signed in'; end if;
  if coalesce(trim(p_body), '') = '' then raise exception 'empty'; end if;
  select count(*) into cnt from public.reports where user_id = uid and created_at > now() - interval '1 day';
  if cnt >= 20 then raise exception 'too_many'; end if;
  select name into nm from public.profiles where id = uid;
  insert into public.reports (user_id, name, kind, body, info, image)
  values (uid, nm, case when p_kind in ('bug','idea','book','other') then p_kind else 'other' end,
          left(p_body, 2000), coalesce(p_info, '{}'::jsonb), case when p_image like uid::text || '/%' then p_image else null end)
  returning id into nid;
  return nid;
end $$;
revoke all on function public.submit_report(text, text, jsonb, text) from public, anon;
grant execute on function public.submit_report(text, text, jsonb, text) to authenticated;

create or replace function public.reports_list(p_status text default 'new')
returns table(id bigint, name text, kind text, body text, info jsonb, image text, status text, created_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_staff() then raise exception 'forbidden'; end if;
  return query select r.id, r.name, r.kind, r.body, r.info, r.image, r.status, r.created_at
    from public.reports r where (p_status = 'all' or r.status = p_status) order by r.id desc limit 100;
end $$;
revoke all on function public.reports_list(text) from public, anon;
grant execute on function public.reports_list(text) to authenticated;

create or replace function public.report_set(p_id bigint, p_status text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_staff() then raise exception 'forbidden'; end if;
  update public.reports set status = case when p_status in ('new','done') then p_status else status end where id = p_id;
end $$;
revoke all on function public.report_set(bigint, text) from public, anon;
grant execute on function public.report_set(bigint, text) to authenticated;

-- анбори скриншотҳо (хусусӣ)
insert into storage.buckets (id, name, public) values ('reports', 'reports', false) on conflict (id) do nothing;
drop policy if exists "reports upload" on storage.objects;
create policy "reports upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'reports' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "reports staff read" on storage.objects;
create policy "reports staff read" on storage.objects for select to authenticated
  using (bucket_id = 'reports' and public.is_staff());

-- =============== 4) Хатоҳои техникӣ (худкор) ===============
create table if not exists public.error_log (
  id bigserial primary key,
  user_id uuid,
  kind text,
  msg text,
  stack text,
  view text,
  info jsonb,
  created_at timestamptz not null default now()
);
alter table public.error_log enable row level security;

create or replace function public.log_errors(p jsonb) returns void
language plpgsql security definer set search_path = public as $$
declare e jsonb;
begin
  if p is null or jsonb_typeof(p) <> 'array' or jsonb_array_length(p) > 20 then return; end if;
  for e in select * from jsonb_array_elements(p) loop
    insert into public.error_log (user_id, kind, msg, stack, view, info)
    values (auth.uid(), left(coalesce(e->>'k', ''), 12), left(coalesce(e->>'m', ''), 300), left(coalesce(e->>'s', ''), 2500),
            left(coalesce(e->>'v', ''), 20), coalesce(e->'d', '{}'::jsonb));
  end loop;
end $$;
revoke all on function public.log_errors(jsonb) from public;
grant execute on function public.log_errors(jsonb) to anon, authenticated;

create or replace function public.errors_list()
returns table(msg text, kind text, n bigint, last_at timestamptz, sample text, info jsonb)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_staff() then raise exception 'forbidden'; end if;
  return query select e.msg, max(e.kind), count(*), max(e.created_at), max(e.stack), (array_agg(e.info order by e.id desc))[1]
    from public.error_log e where e.created_at > now() - interval '7 days'
    group by e.msg order by count(*) desc, max(e.created_at) desc limit 40;
end $$;
revoke all on function public.errors_list() from public, anon;
grant execute on function public.errors_list() to authenticated;

-- =============== 5) Омори хондан ===============
create table if not exists public.read_stats (
  user_id uuid not null,
  day date not null,
  book_id bigint not null,
  sec int not null default 0,
  primary key (user_id, day, book_id)
);
create table if not exists public.active_days (
  user_id uuid not null,
  day date not null,
  primary key (user_id, day)
);
alter table public.read_stats enable row level security;
alter table public.active_days enable row level security;

create or replace function public.track_active() returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return; end if;
  insert into public.active_days (user_id, day) values (auth.uid(), (now() at time zone 'utc')::date) on conflict do nothing;
end $$;
revoke all on function public.track_active() from public, anon;
grant execute on function public.track_active() to authenticated;

create or replace function public.track_read(p_sec int, p_book bigint) returns void
language plpgsql security definer set search_path = public as $$
declare d date := (now() at time zone 'utc')::date; s int := least(greatest(coalesce(p_sec, 0), 0), 3600);
begin
  if auth.uid() is null or p_book is null then return; end if;
  insert into public.active_days (user_id, day) values (auth.uid(), d) on conflict do nothing;
  if s = 0 then return; end if;
  insert into public.read_stats (user_id, day, book_id, sec) values (auth.uid(), d, p_book, s)
  on conflict (user_id, day, book_id) do update set sec = public.read_stats.sec + excluded.sec;
end $$;
revoke all on function public.track_read(int, bigint) from public, anon;
grant execute on function public.track_read(int, bigint) to authenticated;

create or replace function public.stats_summary() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare d date := (now() at time zone 'utc')::date; r jsonb;
begin
  if not public.is_staff() then raise exception 'forbidden'; end if;
  select jsonb_build_object(
    'dau', (select count(*) from public.active_days where day = d),
    'wau', (select count(distinct user_id) from public.active_days where day > d - 7),
    'mau', (select count(distinct user_id) from public.active_days where day > d - 30),
    'sec_today', coalesce((select sum(sec) from public.read_stats where day = d), 0),
    'sec_7d', coalesce((select sum(sec) from public.read_stats where day > d - 7), 0),
    'readers_7d', (select count(distinct user_id) from public.read_stats where day > d - 7),
    'top', coalesce((select jsonb_agg(x) from (
        select jsonb_build_object('id', s.book_id, 'title', coalesce(b.t, '#' || s.book_id), 'sec', s.sec) as x
        from (select book_id, sum(sec)::int as sec from public.read_stats where day > d - 30 group by book_id order by 2 desc limit 5) s
        left join public.books b on b.id = s.book_id) q), '[]'::jsonb)
  ) into r;
  return r;
end $$;
revoke all on function public.stats_summary() from public, anon;
grant execute on function public.stats_summary() to authenticated;
