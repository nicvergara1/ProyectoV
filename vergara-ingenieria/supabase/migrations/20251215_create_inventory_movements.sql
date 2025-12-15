create table if not exists movimientos_inventario (
  id bigint primary key generated always as identity,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  producto_id bigint references productos(id) on delete cascade not null,
  tipo text not null check (tipo in ('entrada', 'salida')),
  cantidad integer not null,
  motivo text,
  user_id uuid references auth.users(id) default auth.uid()
);

alter table movimientos_inventario enable row level security;

create policy "Users can view their own movements"
  on movimientos_inventario for select
  using (auth.uid() = user_id);

create policy "Users can insert their own movements"
  on movimientos_inventario for insert
  with check (auth.uid() = user_id);
