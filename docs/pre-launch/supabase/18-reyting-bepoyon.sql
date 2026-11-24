-- КИТОБХОНА · 18-ҚАДАМ: РЕЙТИНГ БЕЧЕГАРА — на танҳо 10 нафар, ҳамаи хонандагон (ҳадди аксар 100000).
-- Supabase → SQL Editor → New query → ёпиштиринг → Run. Натиҷа: «Success. No rows returned». Талаб: 4-reyting.sql.
create or replace function public.leaderboard(p_limit int default 10, p_days int default null)
returns table(pos bigint, name text, avatar text, bio text, sec bigint)
language sql stable security definer set search_path = public as $$
  select row_number() over (order by r.sec desc, r.created_at asc, r.id) as pos, r.name, r.avatar, r.bio, r.sec
    from public.rating_pool(p_days) r
   where auth.uid() is not null
   order by pos
   limit least(greatest(coalesce(p_limit, 10), 1), 100000)
$$;
revoke all on function public.leaderboard(int, int) from public, anon;
grant execute on function public.leaderboard(int, int) to authenticated;
