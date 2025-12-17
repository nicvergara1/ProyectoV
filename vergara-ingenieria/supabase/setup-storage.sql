-- Script para configurar el bucket de Storage para planos DWG
-- Este script debe ejecutarse desde el SQL Editor de Supabase Dashboard

-- 1. Crear el bucket 'drawings' (si no existe)
INSERT INTO storage.buckets (id, name, public)
VALUES ('drawings', 'drawings', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Habilitar RLS en el bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Política de INSERT: Usuarios autenticados pueden subir archivos a sus propias carpetas
-- La estructura de carpetas es: {user_id}/{timestamp}_{filename}
CREATE POLICY "Authenticated users can upload drawings"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'drawings' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. Política de SELECT: Usuarios solo pueden ver sus propios archivos
CREATE POLICY "Users can view their own drawings"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'drawings' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 5. Política de UPDATE: Usuarios pueden actualizar sus propios archivos
CREATE POLICY "Users can update their own drawings"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'drawings' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 6. Política de DELETE: Usuarios pueden eliminar sus propios archivos
CREATE POLICY "Users can delete their own drawings"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'drawings' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Verificar que todo esté configurado correctamente
SELECT
  id,
  name,
  public,
  created_at
FROM storage.buckets
WHERE id = 'drawings';

-- Listar políticas del bucket
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects'
  AND policyname LIKE '%drawing%';
