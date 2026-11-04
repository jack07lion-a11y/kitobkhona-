-- Китобхона: ҳуқуқҳои ёрдамчӣ (admin ҳар ҳуқуқро ба ҳар ёрдамчӣ медиҳад ё мегирад)
-- Supabase → SQL Editor ичига ёпиштириб, Run босинг. Фақат бир маротиба. (Талаб: sql-ijozat2, sql-aloqa, sql-omor)
-- Пешфарз барои ёрдамчӣ: ФУРӮЗОН — books, reports, stats; ХОМӯШ — ҳама дигар (maker, notif, news, release, gender).

alter table public.profiles add column if not exists perms jsonb not null default '{}'::jsonb;

create or replace function public.has_perm(k text) returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_admin() or exists (
    select 1 from public.profiles p
     where p.id = auth.uid() and p.role = 'subadmin'
       and coalesce((p.perms ->> k)::boolean, k in ('books', 'reports', 'stats')));
$$;
revoke all on function public.has_perm(text) from public, anon;
grant execute on function public.has_perm(text) to authenticated;

-- Якбора ҳуқуқҳои як ёрдамчиро иваз кардан (фақат админ). p: {"books":true,"news":false,...}
create or replace function public.set_perms(p_email text, p jsonb) returns text
language plpgsql security definer set search_path = public as $$
declare uid uuid; k text; v jsonb; cur jsonb;
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  select id into uid from auth.users where lower(email) = lower(trim(p_email));
  if uid is null then return 'no_user'; end if;
  select coalesce(perms, '{}'::jsonb) into cur from public.profiles where id = uid;
  for k, v in select * from jsonb_each(coalesce(p, '{}'::jsonb)) loop
    if k in ('books','maker','reports','stats','notif','news','release','gender') and jsonb_typeof(v) = 'boolean' then
      cur := jsonb_set(cur, array[k], v, true);
    end if;
  end loop;
  update public.profiles set perms = cur where id = uid and role = 'subadmin';
  return 'ok';
end $$;
revoke all on function public.set_perms(text, jsonb) from public, anon;
grant execute on function public.set_perms(text, jsonb) to authenticated;

-- ===== Китобҳо =====
drop policy if exists "books read" on public.books;
drop policy if exists "books admin insert" on public.books;
drop policy if exists "books admin update" on public.books;
drop policy if exists "books admin delete" on public.books;
create policy "books read" on public.books for select using (published or public.has_perm('books'));
create policy "books admin insert" on public.books for insert with check (public.has_perm('books'));
create policy "books admin update" on public.books for update using (public.has_perm('books')) with check (public.has_perm('books'));
create policy "books admin delete" on public.books for delete using (public.has_perm('books'));

drop policy if exists "books files read" on storage.objects;
drop policy if exists "books files admin insert" on storage.objects;
drop policy if exists "books files admin update" on storage.objects;
drop policy if exists "books files admin delete" on storage.objects;
create policy "books files read" on storage.objects for select using (bucket_id = 'books' and (public.has_perm('books') or exists (select 1 from public.books b where b.published and b.slug = split_part(name, '/', 1))));
create policy "books files admin insert" on storage.objects for insert with check (bucket_id = 'books' and public.has_perm('books'));
create policy "books files admin update" on storage.objects for update using (bucket_id = 'books' and public.has_perm('books'));
create policy "books files admin delete" on storage.objects for delete using (bucket_id = 'books' and public.has_perm('books'));

-- ===== Хатоҳо ва пешниҳодҳо =====
create or replace function public.reports_list(p_status text default 'new')
returns table(id bigint, name text, kind text, body text, info jsonb, image text, status text, created_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.has_perm('reports') then raise exception 'forbidden'; end if;
  return query select r.id, r.name, r.kind, r.body, r.info, r.image, r.status, r.created_at
    from public.reports r where (p_status = 'all' or r.status = p_status) order by r.id desc limit 100;
end $$;
revoke all on function public.reports_list(text) from public, anon;
grant execute on function public.reports_list(text) to authenticated;

create or replace function public.report_set(p_id bigint, p_status text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.has_perm('reports') then raise exception 'forbidden'; end if;
  update public.reports set status = case when p_status in ('new','done') then p_status else status end where id = p_id;
end $$;
revoke all on function public.report_set(bigint, text) from public, anon;
grant execute on function public.report_set(bigint, text) to authenticated;

create or replace function public.errors_list()
returns table(msg text, kind text, n bigint, last_at timestamptz, sample text, info jsonb)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.has_perm('reports') then raise exception 'forbidden'; end if;
  return query select e.msg, max(e.kind), count(*), max(e.created_at), max(e.stack), (array_agg(e.info order by e.id desc))[1]
    from public.error_log e where e.created_at > now() - interval '7 days'
    group by e.msg order by count(*) desc, max(e.created_at) desc limit 40;
end $$;
revoke all on function public.errors_list() from public, anon;
grant execute on function public.errors_list() to authenticated;

drop policy if exists "reports staff read" on storage.objects;
create policy "reports staff read" on storage.objects for select to authenticated
  using (bucket_id = 'reports' and public.has_perm('reports'));

-- ===== Омор =====
create or replace function public.user_stats() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare a int; s int; t int;
begin
  if not public.has_perm('stats') then raise exception 'forbidden'; end if;
  select count(*) into t from auth.users;
  select count(*) filter (where role = 'admin'), count(*) filter (where role = 'subadmin') into a, s from public.profiles;
  return jsonb_build_object('admins', a, 'subadmins', s, 'users', greatest(t - a - s, 0), 'total', t);
end $$;
revoke all on function public.user_stats() from public, anon;
grant execute on function public.user_stats() to authenticated;

create or replace function public.stats_summary() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare d date := (now() at time zone 'utc')::date; r jsonb;
begin
  if not public.has_perm('stats') then raise exception 'forbidden'; end if;
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

-- ===== Хабар фиристодан =====
create or replace function public.post_news(p_title text, p_body text) returns bigint
language plpgsql security definer set search_path = public as $$
declare nid bigint;
begin
  if not public.has_perm('news') then raise exception 'forbidden'; end if;
  if coalesce(trim(p_title), '') = '' then raise exception 'empty'; end if;
  insert into public.news (title, body) values (left(trim(p_title), 80), left(coalesce(p_body, ''), 300)) returning id into nid;
  return nid;
end $$;
revoke all on function public.post_news(text, text) from public, anon;
grant execute on function public.post_news(text, text) to authenticated;
