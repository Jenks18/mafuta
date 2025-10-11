Supabase Auth and Profiles setup
================================

1) Environment
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

2) SQL (run in Supabase SQL editor)

```sql
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.organization_members (
  org_id uuid references public.organizations(id) on delete cascade,
  user_id uuid not null,
  role text not null default 'member',
  created_at timestamp with time zone default now(),
  primary key (org_id, user_id)
);

-- Basic user profile table
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  email text,
  full_name text,
  role text default 'member',
  org_id uuid references public.organizations(id) on delete set null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.organization_members enable row level security;

-- Policies: users can see/edit only rows within orgs they belong to
create policy profiles_tenant_select on public.profiles
  for select using (
    exists (
      select 1 from public.organization_members m
      where m.org_id = profiles.org_id and m.user_id = auth.uid()
    )
  );

create policy profiles_tenant_write on public.profiles
  for insert with check (
    exists (
      select 1 from public.organization_members m
      where m.org_id = profiles.org_id and m.user_id = auth.uid() and m.role in ('owner','admin')
    )
  );

create policy profiles_tenant_update on public.profiles
  for update using (
    exists (
      select 1 from public.organization_members m
      where m.org_id = profiles.org_id and m.user_id = auth.uid() and m.role in ('owner','admin')
    )
  ) with check (
    exists (
      select 1 from public.organization_members m
      where m.org_id = profiles.org_id and m.user_id = auth.uid() and m.role in ('owner','admin')
    )
  );

create policy profiles_tenant_delete on public.profiles
  for delete using (
    exists (
      select 1 from public.organization_members m
      where m.org_id = profiles.org_id and m.user_id = auth.uid() and m.role in ('owner','admin')
    )
  );
```

3) Client: use the provided Invite button (magic link) and Profiles page to CRUD under RLS.
