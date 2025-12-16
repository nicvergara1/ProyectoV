-- Agregar campo telefono a mensajes de contacto existentes
ALTER TABLE public.mensajes_contacto ADD COLUMN IF NOT EXISTS telefono text;
