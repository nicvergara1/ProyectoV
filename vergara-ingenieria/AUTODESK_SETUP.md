# Guía de Configuración: Integración con Autodesk Platform Services (APS)

Esta guía explica cómo completar la configuración de la integración con Autodesk Platform Services para visualizar archivos DWG en el sistema.

## 📋 Requisitos Previos

1. Cuenta de Autodesk (gratuita para desarrollo)
2. Credenciales APS (Client ID y Client Secret)
3. Acceso a Supabase Dashboard
4. Proyecto Next.js configurado

---

## 🔑 Paso 1: Obtener Credenciales de Autodesk

### 1.1 Crear Cuenta en Autodesk Platform Services

1. Ve a [https://aps.autodesk.com/](https://aps.autodesk.com/)
2. Haz clic en **"Get Started"** o **"Sign In"**
3. Crea una cuenta o inicia sesión con tu cuenta de Autodesk

### 1.2 Crear una Aplicación

1. Ve al [APS Dashboard](https://aps.autodesk.com/myapps)
2. Haz clic en **"Create Application"**
3. Completa el formulario:
   - **Application Name**: `Vergara Ingeniería - Planos DWG`
   - **Application Type**: `Server-to-Server`
   - **I agree to the terms of service**: ✅ Marcar

4. En **APIs & Services**, habilita:
   - ✅ **Model Derivative API** (para traducción de DWG a SVF2)
   - ✅ **Data Management API** (para almacenamiento OSS)

5. Haz clic en **"Create"**

### 1.3 Obtener Credenciales

1. Una vez creada la app, verás:
   - **Client ID**: Cópialo (ej: `TCf3lr2A9s9p5oGVALGw1sZrtPiho21XR2Jr5NZI6oYXVOje`)
   - **Client Secret**: Cópialo (ej: `cyMjKWjGgkfaeQpy...`)

2. **IMPORTANTE**: Guarda el Client Secret de forma segura, solo se muestra una vez.

### 1.4 Agregar las Credenciales al Proyecto

Edita el archivo `.env.local` en la raíz del proyecto:

```bash
# Autodesk Platform Services (APS)
APS_CLIENT_ID=tu_client_id_aqui
APS_CLIENT_SECRET=tu_client_secret_aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Cambiar en producción
```

---

## 🗄️ Paso 2: Configurar Supabase Storage

### 2.1 Aplicar Migración de Base de Datos

La tabla `dibujos` ya está creada mediante la migración `20251217_create_dibujos.sql`.

Verifica que se aplicó correctamente:

1. Ve a Supabase Dashboard → **SQL Editor**
2. Ejecuta:
   ```sql
   SELECT * FROM dibujos LIMIT 1;
   ```
3. Deberías ver la estructura de la tabla (aunque esté vacía)

### 2.2 Crear Bucket de Storage

1. Ve a Supabase Dashboard → **Storage**
2. Haz clic en **"New bucket"**
3. Configura:
   - **Name**: `drawings`
   - **Public**: ❌ **NO** (debe ser privado)
   - **File size limit**: `52428800` (50 MB)
   - **Allowed MIME types**: `application/acad, application/x-acad, application/dwg, image/vnd.dwg`

4. Haz clic en **"Create bucket"**

### 2.3 Aplicar Políticas RLS al Storage

1. Ve a **SQL Editor** en Supabase
2. Copia y pega el contenido del archivo `supabase/setup-storage.sql`
3. Haz clic en **"Run"**
4. Verifica que todas las políticas se crearon correctamente

---

## 🚀 Paso 3: Probar la Integración

### 3.1 Iniciar el Servidor de Desarrollo

```bash
cd vergara-ingenieria
npm run dev
```

### 3.2 Probar el Flujo Completo

1. Abre el navegador en `http://localhost:3000`
2. Inicia sesión
3. Ve a **Dashboard** → **Planos DWG**
4. Haz clic en **"Subir Plano"**
5. Selecciona un archivo `.dwg` (máx. 50 MB)
6. Espera a que se complete la carga
7. El archivo debería pasar por estos estados:
   - **Subiendo** → Archivo se sube a Supabase
   - **Pendiente** → Se envía a Autodesk OSS
   - **Procesando** → Autodesk traduce el archivo
   - **Listo** → Archivo disponible para visualización

### 3.3 Visualizar el Plano

1. Cuando el estado sea **"Listo"**, haz clic en **"Ver"**
2. Deberías ver el visor 3D de Autodesk Forge
3. Prueba las herramientas:
   - **Rotar**: Click izquierdo + arrastrar
   - **Zoom**: Scroll del mouse
   - **Pan**: Click derecho + arrastrar
   - **Mediciones**: Barra superior del visor

---

## 🔍 Solución de Problemas

### Error: "Failed to get authentication token"

**Causa**: Credenciales incorrectas o expiradas

**Solución**:
1. Verifica que `APS_CLIENT_ID` y `APS_CLIENT_SECRET` estén correctos en `.env.local`
2. Reinicia el servidor: `npm run dev`
3. Verifica en el [APS Dashboard](https://aps.autodesk.com/myapps) que la app esté activa

### Error: "Failed to upload file to storage"

**Causa**: Bucket no existe o RLS no configurado

**Solución**:
1. Verifica que el bucket `drawings` exista en Supabase Storage
2. Ejecuta el script `setup-storage.sql`
3. Verifica políticas RLS en Supabase → Storage → drawings → Policies

### Error: "Translation failed" o estado "failed"

**Causa**: Archivo DWG corrupto o formato no soportado

**Solución**:
1. Verifica que el archivo sea un DWG válido (AutoCAD 2018 o posterior)
2. Intenta con un archivo DWG más simple
3. Revisa los logs en la consola del navegador y del servidor

### El visor no carga o muestra error

**Causa**: URN incorrecto o traducción incompleta

**Solución**:
1. Espera a que el estado sea **"Listo"** (puede tardar varios minutos)
2. Verifica la consola del navegador para errores específicos
3. Consulta el estado en Autodesk:
   ```bash
   curl -X GET "https://developer.api.autodesk.com/modelderivative/v2/designdata/{URN}/manifest" \
     -H "Authorization: Bearer {ACCESS_TOKEN}"
   ```

### Estado "procesando" por más de 10 minutos

**Causa**: Archivo muy grande o complejo

**Solución**:
1. Archivos grandes pueden tardar 15-30 minutos
2. Verifica el progreso en la página de detalles del plano
3. Si pasa de 30 min, elimina y vuelve a subir con un archivo más pequeño

---

## 📊 Limitaciones de la Versión Gratuita de APS

- **Límite de llamadas API**: 100 traducciones/día
- **Archivos transient**: Se eliminan de OSS después de 24 horas
- **Tamaño máximo**: 50 MB por archivo
- **Formatos soportados**: DWG, RVT, IFC, NWD, entre otros

Para producción, considera upgradar a un plan de pago en [Autodesk Platform Services](https://aps.autodesk.com/pricing).

---

## 🔐 Seguridad en Producción

### Variables de Entorno

Cuando despliegues a producción (Vercel, etc.):

1. Configura las variables en el dashboard de hosting:
   - `APS_CLIENT_ID`
   - `APS_CLIENT_SECRET`
   - `NEXT_PUBLIC_APP_URL` (ej: `https://tu-dominio.com`)

2. **NUNCA** commitees el archivo `.env.local` al repositorio

### Políticas de Storage

Las políticas RLS ya están configuradas para que:
- Cada usuario solo vea sus propios planos
- Los archivos estén organizados por carpetas de usuario
- Se requiera autenticación para cualquier operación

---

## 📚 Recursos Adicionales

- [Documentación oficial de APS](https://aps.autodesk.com/developer/overview)
- [Model Derivative API Reference](https://aps.autodesk.com/en/docs/model-derivative/v2/reference/http/)
- [Autodesk Viewer Guide](https://aps.autodesk.com/en/docs/viewer/v7/developers_guide/overview/)
- [Formatos soportados](https://aps.autodesk.com/en/docs/model-derivative/v2/developers_guide/supported-translations/)

---

## ✅ Checklist de Configuración

- [ ] Cuenta de Autodesk creada
- [ ] Aplicación APS creada y configurada
- [ ] Client ID y Secret copiados
- [ ] Variables de entorno configuradas en `.env.local`
- [ ] Migración de BD aplicada (`dibujos` table existe)
- [ ] Bucket `drawings` creado en Supabase Storage
- [ ] Políticas RLS aplicadas al bucket
- [ ] Servidor de desarrollo iniciado
- [ ] Primer archivo DWG subido exitosamente
- [ ] Archivo visualizado en el visor 3D

---

**¡Listo!** La integración con Autodesk Platform Services debería estar funcionando correctamente.

Si encuentras problemas no cubiertos en esta guía, revisa los logs del servidor y la consola del navegador para más detalles.
