-- КИТОБХОНА · 1-ҚАДАМ: ТЕКШИРУВ (ҳеч нарсани ўзгартирмайди)
-- Supabase → SQL Editor → New query → шу ҳаммасини ёпиштиринг → Run.
-- Натижа: ҳамма қаторда ok = true бўлиши керак. Бирортаси false бўлса, ТЎХТАНГ ва скриншотни Claude'га юборинг.
select 'is_admin()'  as nima, to_regprocedure('public.is_admin()') is not null as ok
union all select 'is_staff()',   to_regprocedure('public.is_staff()') is not null
union all select 'has_perm()',   to_regprocedure('public.has_perm(text)') is not null
union all select 'profiles',     to_regclass('public.profiles') is not null
union all select 'books',        to_regclass('public.books') is not null
union all select 'books.slug',   exists (select 1 from information_schema.columns where table_schema='public' and table_name='books' and column_name='slug')
union all select 'app_flags',    to_regclass('public.app_flags') is not null
union all select 'read_stats',   to_regclass('public.read_stats') is not null
union all select 'active_days',  to_regclass('public.active_days') is not null
union all select 'reports',      to_regclass('public.reports') is not null
union all select 'error_log',    to_regclass('public.error_log') is not null;
