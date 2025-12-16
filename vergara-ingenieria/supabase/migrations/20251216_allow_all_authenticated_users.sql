-- Permitir que todos los usuarios autenticados vean y gestionen todos los datos

-- ========================================
-- PRODUCTOS
-- ========================================
DROP POLICY IF EXISTS "Users can view their own products" ON productos;
DROP POLICY IF EXISTS "Users can insert their own products" ON productos;
DROP POLICY IF EXISTS "Users can update their own products" ON productos;
DROP POLICY IF EXISTS "Users can delete their own products" ON productos;

CREATE POLICY "Authenticated users can view all products"
  ON productos FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert products"
  ON productos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update all products"
  ON productos FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete all products"
  ON productos FOR DELETE
  USING (auth.role() = 'authenticated');

-- ========================================
-- PROYECTOS
-- ========================================
DROP POLICY IF EXISTS "Users can view their own projects" ON proyectos;
DROP POLICY IF EXISTS "Users can insert their own projects" ON proyectos;
DROP POLICY IF EXISTS "Users can update their own projects" ON proyectos;
DROP POLICY IF EXISTS "Users can delete their own projects" ON proyectos;

CREATE POLICY "Authenticated users can view all projects"
  ON proyectos FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert projects"
  ON proyectos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update all projects"
  ON proyectos FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete all projects"
  ON proyectos FOR DELETE
  USING (auth.role() = 'authenticated');

-- ========================================
-- FACTURAS
-- ========================================
DROP POLICY IF EXISTS "Users can view their own invoices" ON public.facturas;
DROP POLICY IF EXISTS "Users can insert their own invoices" ON public.facturas;
DROP POLICY IF EXISTS "Users can update their own invoices" ON public.facturas;
DROP POLICY IF EXISTS "Users can delete their own invoices" ON public.facturas;

CREATE POLICY "Authenticated users can view all invoices"
  ON public.facturas FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert invoices"
  ON public.facturas FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update all invoices"
  ON public.facturas FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete all invoices"
  ON public.facturas FOR DELETE
  USING (auth.role() = 'authenticated');
