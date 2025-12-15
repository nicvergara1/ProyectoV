-- Update existing values to match new allowed values
-- Mapping 'finalizado' to 'terminado'
UPDATE proyectos SET estado = 'terminado' WHERE estado = 'finalizado';
-- Mapping 'pausado' to 'activo' (or 'sin_comenzar' if more appropriate, but 'activo' is safer for existing work)
UPDATE proyectos SET estado = 'activo' WHERE estado = 'pausado';

-- Drop old constraint
ALTER TABLE proyectos DROP CONSTRAINT IF EXISTS proyectos_estado_check;

-- Add new constraint
ALTER TABLE proyectos ADD CONSTRAINT proyectos_estado_check CHECK (estado IN ('activo', 'terminado', 'sin_comenzar'));
