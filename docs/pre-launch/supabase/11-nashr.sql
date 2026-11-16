
create or replace function public.books_rights_guard() returns trigger
language plpgsql set search_path = public as $$
begin
  return new;
end $$;
