# 🔌 Vergara Ingeniería

Sistema integral de gestión empresarial para Vergara Ingeniería, especializada en soluciones de ingeniería eléctrica. Plataforma web moderna que combina gestión financiera, inventario, proyectos y reconocimiento inteligente de documentos con IA.

## ✨ Características Principales

### 🤖 Reconocimiento Inteligente de Facturas
- Extracción automática de datos desde imágenes y PDFs
- Integración con OpenAI GPT-4o-mini para OCR avanzado
- Soporte para archivos PDF mediante unpdf
- Detección automática de: número de factura, fecha, entidad, RUT, dirección y montos

### 📊 Gestión Financiera
- **Facturas**: Registro, búsqueda y exportación (Excel/PDF)
- **Cotizaciones**: Creación y seguimiento de presupuestos
- **Proyectos**: Control de estados (sin comenzar, activo, terminado)
- **Inventario**: Gestión de stock con entrada/salida de productos

### 💬 Asistente Virtual
- Chatbot arrastrable integrado con n8n
- Disponible en todo el dashboard
- Respuestas contextuales sobre servicios

### 📧 Sistema de Contacto
- Formulario con validaciones avanzadas:
  - Mínimo 20 palabras en mensajes
  - Formato de RUT chileno (XX.XXX.XXX-X)
  - Teléfono con formato +56 9 XXXX XXXX
  - Anti-spam: 2 minutos entre envíos por email
- Notificaciones por email vía Resend
- Almacenamiento en base de datos con tracking

### 🔒 Seguridad y Validaciones
- Autenticación con Supabase Auth
- Row Level Security (RLS) para datos compartidos
- Validaciones de datos:
  - Fechas: No se permiten facturas con fechas futuras
  - Proyectos: No se puede marcar como "terminado" si la fecha de inicio es futura
  - Números de factura: Máximo 6 dígitos, solo enteros positivos

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 16.0.10** - App Router, Server Actions, SSR
- **React 19.2.1** - Componentes modernos con hooks
- **TypeScript 5** - Tipado estricto
- **Tailwind CSS 4** - Estilos utilitarios
- **Lucide React** - Iconografía

### Backend & Servicios
- **Supabase** - Base de datos PostgreSQL + Autenticación + RLS
- **OpenAI API** - Reconocimiento de documentos (gpt-4o-mini)
- **Resend** - Servicio de envío de emails
- **n8n Cloud** - Workflows para chatbot

### Bibliotecas Especializadas
- **unpdf** - Procesamiento de PDFs en entorno serverless
- **jsPDF + jsPDF-AutoTable** - Generación de PDFs
- **ExcelJS** - Exportación a Excel
- **clsx + tailwind-merge** - Manejo de clases CSS

## 🚀 Instalación

### Requisitos Previos
- Node.js 20 o superior
- npm, yarn, pnpm o bun
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [OpenAI](https://platform.openai.com)
- Cuenta en [Resend](https://resend.com)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/nicvergara1/ProyectoV.git
cd ProyectoV/vergara-ingenieria
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-publica

# OpenAI
OPENAI_API_KEY=sk-tu-clave-de-openai

# Resend
RESEND_API_KEY=re_tu-clave-de-resend
ADMIN_EMAIL=tu-email@ejemplo.com
```

4. **Configurar Base de Datos**

Ejecuta las migraciones SQL en el editor SQL de Supabase (en orden):

```sql
-- 1. Convertir numero_factura a bigint
ALTER TABLE facturas_compra 
ALTER COLUMN numero_factura TYPE BIGINT USING numero_factura::bigint;

-- 2. Agregar user_id a facturas
ALTER TABLE facturas_compra ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- 3. Políticas RLS para acceso compartido
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver todas las facturas" ON facturas_compra;
CREATE POLICY "Usuarios autenticados pueden ver todas las facturas"
ON facturas_compra FOR SELECT TO authenticated USING (true);

-- 4. Crear tabla de mensajes de contacto
CREATE TABLE mensajes_contacto (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  asunto TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  estado TEXT DEFAULT 'nuevo' CHECK (estado IN ('nuevo', 'leido', 'respondido')),
  email_id TEXT,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Validación de estado de proyectos
ALTER TABLE proyectos ADD CONSTRAINT check_estado_fecha 
CHECK (
  estado != 'terminado' OR fecha_inicio <= CURRENT_DATE
);
```

5. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
vergara-ingenieria/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page pública
│   │   ├── login/                      # Página de autenticación
│   │   ├── dashboard/                  # Panel de control
│   │   │   ├── layout.tsx              # Layout con sidebar
│   │   │   ├── page.tsx                # Dashboard principal
│   │   │   ├── invoices/               # Gestión de facturas
│   │   │   ├── inventory/              # Gestión de inventario
│   │   │   ├── projects/               # Gestión de proyectos
│   │   │   ├── quotes/                 # Gestión de cotizaciones
│   │   │   └── settings/               # Configuración
│   │   └── actions/                    # Server Actions
│   │       ├── recognize.ts            # IA para reconocimiento
│   │       ├── contact.ts              # Envío de emails
│   │       └── ...
│   ├── components/
│   │   ├── Navbar.tsx                  # Navegación pública
│   │   ├── Hero.tsx                    # Sección hero
│   │   ├── Services.tsx                # Servicios ofrecidos
│   │   ├── Contact.tsx                 # Formulario de contacto
│   │   ├── ChatbotBubble.tsx          # Asistente virtual arrastrable
│   │   ├── ImageRecognizer.tsx        # Componente de OCR
│   │   └── ...
│   ├── utils/
│   │   └── supabase/
│   │       ├── client.ts               # Cliente Supabase (navegador)
│   │       └── server.ts               # Cliente Supabase (servidor)
│   └── types/
│       └── index.ts                    # Definiciones TypeScript
├── public/                             # Assets estáticos
├── .env.local                          # Variables de entorno (no versionado)
├── next.config.ts                      # Configuración Next.js
├── tailwind.config.ts                  # Configuración Tailwind
└── package.json                        # Dependencias
```

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo (puerto 3000)

# Producción
npm run build        # Compilar para producción
npm run start        # Iniciar servidor de producción

# Calidad de Código
npm run lint         # Ejecutar ESLint
```

## 🔑 Funcionalidades Detalladas

### Reconocimiento de Facturas con IA
1. Sube una imagen (JPG, PNG) o PDF de una factura
2. El sistema extrae automáticamente:
   - Número de factura (validado: máx. 6 dígitos)
   - Fecha de emisión
   - Nombre de la entidad
   - RUT (formato chileno)
   - Dirección
   - Montos (neto, IVA, total)
3. Revisa y confirma los datos antes de guardar

### Gestión de Inventario
- Registrar productos con código, nombre, cantidad y precio
- Salidas de inventario con motivo (venta, uso interno, donación, etc.)
- Control de stock en tiempo real
- Exportación de reportes

### Sistema de Proyectos
- Estados: Sin comenzar, Activo, Terminado
- Validación automática de fechas
- No permite marcar como terminado proyectos con fecha futura
- Seguimiento de presupuesto vs. real

### Formulario de Contacto Inteligente
- Contador de palabras en tiempo real (mínimo 20)
- Formato automático de teléfonos chilenos
- Dropdown de asuntos predefinidos
- Anti-spam: límite de tiempo entre envíos
- Notificación por email al administrador
- Almacenamiento de mensajes con ID único

## 🌐 Despliegue

### Despliegue en Vercel (Recomendado)

1. Conecta tu repositorio en [Vercel](https://vercel.com)
2. Configura las variables de entorno en el dashboard
3. Despliega automáticamente en cada push a main

### Variables de Entorno para Producción

Asegúrate de configurar todas las variables en tu plataforma de deployment:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `ADMIN_EMAIL`

## ⚠️ Limitaciones Conocidas

- **Resend (Tier Gratuito)**: Solo envía emails a direcciones verificadas en tu cuenta
- **OpenAI API**: Requiere créditos/suscripción activa
- **PDF Processing**: Funciona mejor con PDFs de texto (no escaneados)

## 🤝 Contribución

Este es un proyecto privado de Vergara Ingeniería. Para contribuciones internas:

1. Crea una rama feature: `git checkout -b feature/nueva-funcionalidad`
2. Realiza tus cambios y commit: `git commit -m 'Agrega nueva funcionalidad'`
3. Push a la rama: `git push origin feature/nueva-funcionalidad`
4. Abre un Pull Request

## 📄 Licencia

© 2025 Vergara Ingeniería. Todos los derechos reservados.

## 👨‍💻 Autor

**Nicolás Vergara**
- Email: nic.vergara@duocuc.cl
- Proyecto: Sistema de Gestión Empresarial

---

Desarrollado con ❤️ usando Next.js, Supabase y OpenAI
