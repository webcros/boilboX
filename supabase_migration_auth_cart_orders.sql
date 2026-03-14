create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.user_carts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  payment_status text not null default 'created' check (payment_status in ('created', 'paid')),
  fulfillment_status text not null default 'payment_pending' check (
    fulfillment_status in (
      'payment_pending',
      'payment_confirmed',
      'preparing',
      'ready_for_pickup',
      'completed'
    )
  ),
  razorpay_order_id text,
  razorpay_payment_id text,
  amount bigint not null check (amount >= 0),
  currency text not null default 'INR',
  items jsonb not null default '[]'::jsonb,
  customer jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists orders_user_id_created_at_idx
  on public.orders (user_id, created_at desc);

create unique index if not exists orders_razorpay_order_id_idx
  on public.orders (razorpay_order_id)
  where razorpay_order_id is not null;

create unique index if not exists orders_razorpay_payment_id_idx
  on public.orders (razorpay_payment_id)
  where razorpay_payment_id is not null;

alter table public.user_carts enable row level security;
alter table public.orders enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_carts'
      and policyname = 'user_carts_select_own'
  ) then
    create policy user_carts_select_own
      on public.user_carts
      for select
      to authenticated
      using (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_carts'
      and policyname = 'user_carts_insert_own'
  ) then
    create policy user_carts_insert_own
      on public.user_carts
      for insert
      to authenticated
      with check (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_carts'
      and policyname = 'user_carts_update_own'
  ) then
    create policy user_carts_update_own
      on public.user_carts
      for update
      to authenticated
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_carts'
      and policyname = 'user_carts_delete_own'
  ) then
    create policy user_carts_delete_own
      on public.user_carts
      for delete
      to authenticated
      using (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'orders'
      and policyname = 'orders_select_own'
  ) then
    create policy orders_select_own
      on public.orders
      for select
      to authenticated
      using (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'orders'
      and policyname = 'orders_insert_own'
  ) then
    create policy orders_insert_own
      on public.orders
      for insert
      to authenticated
      with check (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'orders'
      and policyname = 'orders_update_own'
  ) then
    create policy orders_update_own
      on public.orders
      for update
      to authenticated
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'set_user_carts_updated_at'
  ) then
    create trigger set_user_carts_updated_at
      before update on public.user_carts
      for each row
      execute function public.set_updated_at();
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'set_orders_updated_at'
  ) then
    create trigger set_orders_updated_at
      before update on public.orders
      for each row
      execute function public.set_updated_at();
  end if;
end
$$;
