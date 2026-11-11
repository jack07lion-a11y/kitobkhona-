
create or replace function public.ensure_profile(p_uid uuid, p_name text) returns text
language plpgsql security definer set search_path = public as $$
declare base text := left(trim(coalesce(p_name, '')), 40); cand text; n int := 0; cur text;
begin
  if p_uid is null or base = '' then return null; end if;
  select name into cur from public.profiles where id = p_uid;
  if cur is not null then return cur; end if;
  loop
    cand := case when n = 0 then base else base || ' ' || n end;
    begin
      insert into public.profiles(id, name, name_key) values (p_uid, cand, lower(cand));
      return cand;
    exception when unique_violation then
      select name into cur from public.profiles where id = p_uid;
      if cur is not null then return cur; end if;
      n := n + 1;
    end;
  end loop;
end $$;
revoke all on function public.ensure_profile(uuid, text) from public, anon, authenticated;

create or replace function public.auth_user_profile_sync() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  begin
    if coalesce(trim(new.raw_user_meta_data ->> 'name'), '') <> '' then
      perform public.ensure_profile(new.id, new.raw_user_meta_data ->> 'name');
    end if;
  exception when others then null;
  end;
  return new;
end $$;
drop trigger if exists auth_user_profile_sync on auth.users;
create trigger auth_user_profile_sync after insert or update of raw_user_meta_data on auth.users
  for each row execute function public.auth_user_profile_sync();

do $b$
declare r record;
begin
  for r in select u.id, u.raw_user_meta_data ->> 'name' as nm from auth.users u
            where coalesce(trim(u.raw_user_meta_data ->> 'name'), '') <> ''
              and not exists (select 1 from public.profiles p where p.id = u.id) loop
    perform public.ensure_profile(r.id, r.nm);
  end loop;
end $b$;

create or replace function public.user_stats() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare a int; s int; u int; t int; unv int; np int;
begin
  if not public.has_perm('stats') then raise exception 'forbidden'; end if;
  select count(*) into t from auth.users x where coalesce(x.email_confirmed_at, x.last_sign_in_at) is not null;
  select count(*) into unv from auth.users x where coalesce(x.email_confirmed_at, x.last_sign_in_at) is null;
  select count(*) into np from auth.users x where coalesce(x.email_confirmed_at, x.last_sign_in_at) is not null
     and not exists (select 1 from public.profiles p where p.id = x.id);
  select count(*) filter (where role = 'admin' and deleted_at is null), count(*) filter (where role = 'subadmin' and deleted_at is null),
         count(*) filter (where role = 'user' and deleted_at is null) into a, s, u from public.profiles;
  return jsonb_build_object('admins', a, 'subadmins', s, 'users', u, 'total', t, 'unverified', unv, 'no_profile', np);
end $$;
revoke all on function public.user_stats() from public, anon;
grant execute on function public.user_stats() to authenticated;
