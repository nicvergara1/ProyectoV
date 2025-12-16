-- Agregar restricción: un proyecto no puede estar terminado si su fecha de inicio es mayor a hoy
-- Nota: Esta restricción se aplicará a nivel de base de datos como una capa extra de seguridad

ALTER TABLE proyectos 
ADD CONSTRAINT check_terminado_fecha_inicio 
CHECK (
  estado != 'terminado' OR 
  fecha_inicio IS NULL OR 
  fecha_inicio <= CURRENT_DATE
);
