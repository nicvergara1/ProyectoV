-- Agregar columna user_id a la tabla facturas
ALTER TABLE public.facturas ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();

-- Actualizar registros existentes con el user_id del creador (si no tienen uno)
-- Como no podemos saber quién creó cada factura, asignamos al primer usuario autenticado
-- En producción, esto debería manejarse de forma diferente
UPDATE public.facturas SET user_id = auth.uid() WHERE user_id IS NULL;

-- Eliminar las políticas antiguas
DROP POLICY IF EXISTS "Permitir lectura para autenticados" ON public.facturas;
DROP POLICY IF EXISTS "Permitir inserción para autenticados" ON public.facturas;
DROP POLICY IF EXISTS "Permitir actualización para autenticados" ON public.facturas;
DROP POLICY IF EXISTS "Permitir eliminación para autenticados" ON public.facturas;

-- Crear nuevas políticas basadas en user_id (cada usuario ve solo sus datos)
CREATE POLICY "Users can view their own invoices"
  ON public.facturas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own invoices"
  ON public.facturas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices"
  ON public.facturas FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invoices"
  ON public.facturas FOR DELETE
  USING (auth.uid() = user_id);
