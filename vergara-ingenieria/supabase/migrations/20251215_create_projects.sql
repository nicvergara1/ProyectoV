create table if not exists proyectos (
  id bigint primary key generated always as identity,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  nombre text not null,
  descripcion text,
  cliente text,
  fecha_inicio date,
  estado text not null default 'activo' check (estado in ('activo', 'finalizado', 'pausado')),
  user_id uuid references auth.users(id) default auth.uid()
);

alter table proyectos enable row level security;

create policy "Users can view their own projects"
  on proyectos for select
  using (auth.uid() = user_id);

create policy "Users can insert their own projects"
  on proyectos for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own projects"
  on proyectos for update
  using (auth.uid() = user_id);

create policy "Users can delete their own projects"
  on proyectos for delete
  using (auth.uid() = user_id);

-- Add project_id to inventory movements
alter table movimientos_inventario 
add column if not exists proyecto_id bigint references proyectos(id) on delete set null;
