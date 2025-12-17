# 🔧 Actualización de Tipos MIME para Bucket 'drawings'

## ⚠️ Acción Requerida

Para que todos los formatos CAD funcionen correctamente, debes actualizar la configuración del bucket en Supabase Dashboard.

## 📋 Pasos

### 1. Ve a Supabase Dashboard

```
https://app.supabase.com
→ Tu Proyecto
→ Storage
→ drawings (bucket)
→ Configuration (icono de engranaje)
```

### 2. Actualizar "Allowed MIME types"

Reemplaza la configuración actual con esta lista completa:

```
application/acad
application/x-acad
application/dwg
image/vnd.dwg
application/dxf
image/vnd.dxf
application/x-dwf
model/vnd.dwf
application/x-step
application/step
application/stp
model/step
application/iges
application/x-iges
model/iges
application/sat
model/sat
application/x-sketchup
application/vnd.sketchup.skp
model/vnd.sketchup.skp
application/x-revit
application/revit
model/vnd.revit
application/x-navisworks
model/vnd.navisworks
application/x-inventor
model/vnd.autodesk.inventor
application/x-solidworks
model/vnd.solidworks
application/catia
model/vnd.catia
model/obj
application/x-tgif
model/stl
application/sla
application/vnd.ms-pki.stl
application/x-navistyle
model/x.stl-ascii
model/x.stl-binary
application/fbx
model/fbx
application/x-3ds
image/x-3ds
model/3ds
model/vnd.collada+xml
application/x-collada
model/ifc
application/x-step
application/octet-stream
```

### 3. Tamaño Máximo de Archivo

Asegúrate de que el **File size limit** sea:

```
52428800 bytes (50 MB)
```

### 4. Guardar Cambios

Haz clic en **"Save"** o **"Update bucket"**.

## ✅ Verificación

Después de actualizar, intenta subir un archivo de prueba de cada tipo:
- ✅ DWG (AutoCAD)
- ✅ RVT (Revit)
- ✅ SKP (SketchUp)
- ✅ STEP
- ✅ IFC

## 📝 Nota

Si algunos formatos aún dan error, es posible que necesites agregar:

```
application/octet-stream
```

Este MIME type genérico permite cualquier archivo binario.

## 🔍 Tipos MIME por Formato

| Formato | MIME Type Principal |
|---------|---------------------|
| **DWG** | `application/acad` |
| **DXF** | `application/dxf` |
| **DWF** | `application/x-dwf` |
| **RVT** | `application/x-revit` |
| **SKP** | `application/vnd.sketchup.skp` |
| **STEP/STP** | `application/step` |
| **IGES/IGS** | `application/iges` |
| **STL** | `model/stl` |
| **OBJ** | `model/obj` |
| **FBX** | `model/fbx` |
| **IFC** | `model/ifc` |

## 🚨 Alternativa Rápida

Si tienes problemas con MIME types específicos, puedes usar:

```
*/*
```

Esto permite **todos los tipos de archivos**, pero es menos seguro.

Solo para desarrollo/testing. En producción usa la lista específica.
