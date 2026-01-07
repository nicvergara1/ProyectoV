-- Crear tabla de documentos
CREATE TABLE IF NOT EXISTS documentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  tipo VARCHAR(50) NOT NULL DEFAULT 'excel', -- excel, csv, otros
  storage_path TEXT NOT NULL, -- ruta en Supabase Storage
  size_bytes BIGINT,
  mime_type VARCHAR(100),
  data JSONB, -- datos del spreadsheet en formato Luckysheet
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_documentos_user_id ON documentos(user_id);
CREATE INDEX idx_documentos_tipo ON documentos(tipo);
CREATE INDEX idx_documentos_created_at ON documentos(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;

-- Políticas: usuarios solo ven sus propios documentos
CREATE POLICY "Los usuarios pueden ver sus propios documentos"
  ON documentos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar sus propios documentos"
  ON documentos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propios documentos"
  ON documentos FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propios documentos"
  ON documentos FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_documentos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_documentos_updated_at
  BEFORE UPDATE ON documentos
  FOR EACH ROW
  EXECUTE FUNCTION update_documentos_updated_at();

-- Comentarios
COMMENT ON TABLE documentos IS 'Almacena documentos Excel/spreadsheets editables';
COMMENT ON COLUMN documentos.data IS 'Datos del spreadsheet en formato JSON de Luckysheet';
COMMENT ON COLUMN documentos.storage_path IS 'Ruta del archivo original en Supabase Storage';
