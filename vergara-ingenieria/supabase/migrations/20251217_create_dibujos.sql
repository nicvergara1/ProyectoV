-- Tabla para almacenar información de archivos DWG de AutoCAD
create table if not exists dibujos (
  id bigint primary key generated always as identity,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  -- Metadatos del archivo
  nombre text not null,
  nombre_original text not null,
  tamano_bytes bigint not null,
  descripcion text,

  -- Almacenamiento en Supabase Storage
  storage_path text not null,
  storage_url text,

  -- Autodesk Forge/APS
  urn text, -- URN del archivo en Autodesk (base64 encoded)
  forge_bucket_key text, -- Clave del bucket en Autodesk OSS
  forge_object_key text, -- Clave del objeto en Autodesk OSS

  -- Estado de traducción
  estado text check (estado in ('uploading', 'pending', 'processing', 'success', 'failed')) default 'uploading' not null,
  estado_mensaje text, -- Mensaje de error si failed
  progreso integer default 0 check (progreso >= 0 and progreso <= 100), -- Porcentaje 0-100

  -- Timestamps de proceso
  uploaded_at timestamp with time zone,
  translation_started_at timestamp with time zone,
  translation_completed_at timestamp with time zone,

  -- Relaciones opcionales
  proyecto_id bigint references proyectos(id) on delete set null,

  -- Pertenencia (RLS)
  user_id uuid references auth.users(id) not null default auth.uid()
);

-- Índices para optimizar consultas
create index if not exists idx_dibujos_user_id on dibujos(user_id);
create index if not exists idx_dibujos_proyecto_id on dibujos(proyecto_id);
create index if not exists idx_dibujos_urn on dibujos(urn);
create index if not exists idx_dibujos_estado on dibujos(estado);
create index if not exists idx_dibujos_created_at on dibujos(created_at desc);

-- Habilitar Row Level Security
alter table dibujos enable row level security;

-- Políticas RLS: Los usuarios solo pueden ver/modificar sus propios dibujos

-- Política de SELECT: Ver solo dibujos propios
create policy "Users can view their own drawings"
  on dibujos for select
  using (auth.uid() = user_id);

-- Política de INSERT: Solo insertar con su propio user_id
create policy "Users can insert their own drawings"
  on dibujos for insert
  with check (auth.uid() = user_id);

-- Política de UPDATE: Solo actualizar sus propios dibujos
create policy "Users can update their own drawings"
  on dibujos for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Política de DELETE: Solo eliminar sus propios dibujos
create policy "Users can delete their own drawings"
  on dibujos for delete
  using (auth.uid() = user_id);

-- NOTA IMPORTANTE: Storage Bucket
-- El bucket 'drawings' debe crearse manualmente en Supabase Dashboard:
-- 1. Ir a Storage > Create Bucket
-- 2. Nombre: drawings
-- 3. Public: No (privado, requiere autenticación)
-- 4. Aplicar políticas RLS en Storage similar a la tabla

-- Las políticas de Storage se pueden crear con:
/*
create policy "Authenticated users can upload drawings"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'drawings' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can view their own drawings"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'drawings' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own drawings"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'drawings' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
*/
