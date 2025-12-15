create table if not exists productos (
  id bigint primary key generated always as identity,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  nombre text not null,
  descripcion text,
  cantidad integer default 0,
  precio_unitario numeric default 0,
  categoria text,
  stock_minimo integer default 5,
  user_id uuid references auth.users(id) default auth.uid()
);

alter table productos enable row level security;

create policy "Users can view their own products"
  on productos for select
  using (auth.uid() = user_id);

create policy "Users can insert their own products"
  on productos for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own products"
  on productos for update
  using (auth.uid() = user_id);

create policy "Users can delete their own products"
  on productos for delete
  using (auth.uid() = user_id);
