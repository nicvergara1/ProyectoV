-- Cambiar numero_factura de text a bigint
-- Primero eliminamos los datos no numéricos si los hay
UPDATE public.facturas SET numero_factura = regexp_replace(numero_factura, '[^0-9]', '', 'g') WHERE numero_factura ~ '[^0-9]';

-- Cambiar el tipo de dato
ALTER TABLE public.facturas ALTER COLUMN numero_factura TYPE bigint USING numero_factura::bigint;

-- Agregar restricción para máximo 6 dígitos (999999)
ALTER TABLE public.facturas ADD CONSTRAINT numero_factura_max_6_digits CHECK (numero_factura > 0 AND numero_factura <= 999999);
