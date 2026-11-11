-- КИТОБХОНА · 6-ҚАДАМ: РЕЙТИНГ — ҲАМА ҲИСОБ рейтингда (0 дақиқа ҳам). Фақат 2 функция иваз мешавад.
-- Supabase → SQL Editor → New query → ёпиштиринг → Run. Натижа: «Success. No rows returned».
create or replace function public.rating_pool(p_days int default null)
returns table(id uuid, name text, avatar text, bio text, created_at timestamptz, sec bigint)
language sql stable security definer set search_path = public as $$
  select p.id, p.name, p.avatar, p.bio, p.created_at, coalesce(sum(s.sec), 0)::bigint
    from public.profiles p
    left join public.read_stats s on s.user_id = p.id and (p_days is null or s.day >= current_date - (greatest(p_days, 1) - 1))
   where p.deleted_at is null and not p.hide_rating
   group by p.id, p.name, p.avatar, p.bio, p.created_at
$$;
revoke all on function public.rating_pool(int) from public, anon, authenticated;
create or replace function public.my_rank(p_days int default null) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare uid uuid := auth.uid(); me public.profiles%rowtype; v_sec bigint; v_pos bigint; v_n bigint;
begin
  if uid is null then return jsonb_build_object('pos', null); end if;
  select * into me from public.profiles where id = uid;
  if not found then return jsonb_build_object('pos', null, 'sec', 0); end if;
  if me.deleted_at is not null then return jsonb_build_object('deleted', true); end if;
  select coalesce(sum(s.sec), 0) into v_sec from public.read_stats s
   where s.user_id = uid and (p_days is null or s.day >= current_date - (greatest(p_days, 1) - 1));
  select count(*) into v_n from public.rating_pool(p_days);
  if me.hide_rating then return jsonb_build_object('hidden', true, 'sec', v_sec, 'n', v_n); end if;
  select count(*) + 1 into v_pos from public.rating_pool(p_days) r
   where r.sec > v_sec or (r.sec = v_sec and (r.created_at < me.created_at or (r.created_at = me.created_at and r.id < uid)));
  return jsonb_build_object('pos', v_pos, 'sec', v_sec, 'n', v_n);
end $$;
revoke all on function public.my_rank(int) from public, anon;
grant execute on function public.my_rank(int) to authenticated;
