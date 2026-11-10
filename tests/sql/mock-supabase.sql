-- Supabase-ро тақлид мекунад (auth, storage, нақшҳо) то SQL-и docs/ дар PostgreSQL-и оддӣ санҷида шавад. Production-ро ҳеҷ гоҳ дахл намекунад.
do $r$ begin if not exists (select 1 from pg_roles where rolname='anon') then create role anon nologin; end if; if not exists (select 1 from pg_roles where rolname='authenticated') then create role authenticated nologin; end if; if not exists (select 1 from pg_roles where rolname='service_role') then create role service_role nologin; end if; end $r$;
create schema auth; create schema storage;
create table auth.users(id uuid primary key default gen_random_uuid(), email text, raw_user_meta_data jsonb default '{}', created_at timestamptz default now());
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true),'')::uuid $$;
create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims', true),'')::jsonb,'{}'::jsonb) $$;
create table storage.buckets(id text primary key, name text, public boolean default false);
create table storage.objects(id uuid default gen_random_uuid() primary key, bucket_id text, name text, owner uuid, created_at timestamptz default now());
alter table storage.objects enable row level security;
create function storage.foldername(name text) returns text[] language sql immutable as $$ select (string_to_array(name,'/'))[1:coalesce(array_length(string_to_array(name,'/'),1),1)-1] $$;
grant usage on schema auth, storage to anon, authenticated;
grant execute on function auth.uid(), auth.jwt(), storage.foldername(text) to anon, authenticated;
grant select, insert, update, delete on storage.objects to anon, authenticated;
alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant all on sequences to anon, authenticated;
grant usage on schema public to anon, authenticated;
create function storage.protect_delete() returns trigger language plpgsql as $$ begin raise exception 'Direct deletion from storage tables is not allowed. Use the Storage API instead.'; end $$;
create trigger protect_objects_delete before delete on storage.objects for each statement execute function storage.protect_delete();
