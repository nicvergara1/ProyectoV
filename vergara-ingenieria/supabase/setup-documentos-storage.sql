-- Configurar Storage para documentos Excel

-- Crear bucket 'documentos' si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('documentos', 'documentos', false)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage: usuarios solo acceden a sus propios archivos
-- SELECT (descargar)
CREATE POLICY "Los usuarios pueden ver sus propios documentos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documentos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- INSERT (subir)
CREATE POLICY "Los usuarios pueden subir sus propios documentos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documentos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- UPDATE (actualizar)
CREATE POLICY "Los usuarios pueden actualizar sus propios documentos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'documentos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'documentos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- DELETE (eliminar)
CREATE POLICY "Los usuarios pueden eliminar sus propios documentos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'documentos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Configurar tipos MIME permitidos
-- .xlsx, .xls, .csv, .json
UPDATE storage.buckets
SET 
  allowed_mime_types = ARRAY[
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
    'application/json',
    'application/octet-stream'
  ],
  file_size_limit = 52428800 -- 50MB máximo
WHERE id = 'documentos';
