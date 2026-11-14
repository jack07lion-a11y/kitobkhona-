-- Аудити 2026-11-14: ислоҳҳои бехатарӣ ва суръат (аллакай ба Supabase татбиқ шудааст: миграцияи audit_hardening_2026_11_14).
-- Дубора иҷро кардан бехатар аст (idempotent).

-- 1) тригери ҳуқуқ: search_path собит (Supabase advisor: function_search_path_mutable)
alter function public.books_rights_guard() set search_path = public;

-- 2) функсияи тригер ба API лозим нест: аз ҳама мегирем (тригер бе ин ҳам кор мекунад)
revoke execute on function public.auth_user_profile_sync() from anon, authenticated, public;

-- 3) сиёсатҳо: auth.uid() як бор ҳисоб мешавад (advisor: auth_rls_initplan)
alter policy "own read" on public.profiles using ((select auth.uid()) = id);
alter policy "own state read" on public.user_state using ((select auth.uid()) = user_id);

-- 4) индекси калидҳои хориҷӣ (advisor: unindexed_foreign_keys)
create index if not exists books_added_by_idx on public.books (added_by);
create index if not exists reports_user_id_idx on public.reports (user_id);

-- Дар advisor-и боқимонда (ИНТИЗОРШУДА, тағйир намедиҳем):
--  * rls_enabled_no_policy (active_days, app_installs, error_log, read_stats, reports): ҷадвалҳо танҳо тавассути RPC-и SECURITY DEFINER кор мекунанд;
--    бе сиёсат — ҳеҷ кас бевосита намехонад (дуруст).
--  * anon/authenticated_security_definer_function_executable: ҳар RPC дар дохил ҳуқуқро месанҷад (is_admin/has_perm/auth.uid) ва хато меандозад (санҷида шуд).
--  * auth_leaked_password_protection: барнома рамз надорад (воридшавӣ бо коди почта/Google).
