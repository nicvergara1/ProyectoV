-- Agregar columna servicios (JSONB) para almacenar múltiples servicios en facturas de venta
ALTER TABLE facturas
ADD COLUMN IF NOT EXISTS servicios JSONB;

-- Comentario para la columna
COMMENT ON COLUMN facturas.servicios IS 'Array de servicios para facturas de venta. Formato: [{servicio: string, descripcion?: string, monto: number}]';
