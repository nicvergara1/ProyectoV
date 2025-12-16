'use client'

import { useState, useEffect } from 'react'
import { createInvoice } from '@/app/actions/invoices'
import { useRouter } from 'next/navigation'
import { Loader2, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ImageRecognizer } from '@/components/ImageRecognizer'

const SALES_SERVICES = [
  'Instalación Eléctrica',
  'Mantenimiento Industrial',
  'Proyectos de Ingeniería',
  'Certificaciones TE1',
  'Tableros Eléctricos',
  'Automatización'
]

const PURCHASE_CATEGORIES = [
  'Materiales Eléctricos',
  'Herramientas',
  'Insumos de Oficina',
  'Arriendo de Maquinaria',
  'Combustible',
  'Otros'
]

export default function NewInvoicePage() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [type, setType] = useState<'compra' | 'venta'>('venta')
  const [netAmount, setNetAmount] = useState('')
  const [iva, setIva] = useState(0)
  const [total, setTotal] = useState(0)
  
  // Form states
  const [numeroFactura, setNumeroFactura] = useState('')
  const [fechaEmision, setFechaEmision] = useState(new Date().toISOString().split('T')[0])
  const [entidad, setEntidad] = useState('')
  const [rutEntidad, setRutEntidad] = useState('')
  const [direccionEntidad, setDireccionEntidad] = useState('')
  const [descripcion, setDescripcion] = useState('')

  // Calculate IVA and Total automatically
  useEffect(() => {
    const net = Number(netAmount) || 0
    const calculatedIva = Math.round(net * 0.19)
    setIva(calculatedIva)
    setTotal(net + calculatedIva)
  }, [netAmount])

  const handleRecognition = (data: any) => {
    if (data.numero_factura) setNumeroFactura(data.numero_factura)
    if (data.fecha_emision) setFechaEmision(data.fecha_emision)
    if (data.entidad) setEntidad(data.entidad)
    if (data.rut_entidad) setRutEntidad(data.rut_entidad)
    if (data.direccion_entidad) setDireccionEntidad(data.direccion_entidad)
    if (data.descripcion) setDescripcion(data.descripcion)
    if (data.monto_neto) setNetAmount(data.monto_neto.toString())
  }

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    // Append calculated values
    formData.set('iva', iva.toString())
    formData.set('monto_total', total.toString())
    
    const result = await createInvoice(formData)
    setIsPending(false)

    if (result.success) {
      router.push('/dashboard/invoices')
      router.refresh()
    } else {
      alert('Error al guardar la factura: ' + result.error)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/invoices" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nueva Factura</h1>
          <p className="text-slate-600">Registra una nueva factura de compra o venta.</p>
        </div>
      </div>

      <form action={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-6">
        {/* Type Selection */}
        <div className="grid grid-cols-2 gap-4 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => setType('venta')}
            className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${
              type === 'venta' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Factura de Venta
          </button>
          <button
            type="button"
            onClick={() => setType('compra')}
            className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${
              type === 'compra' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Factura de Compra
          </button>
        </div>
        <input type="hidden" name="tipo" value={type} />

        {type === 'compra' && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Escanear Factura con IA</h3>
            <ImageRecognizer onRecognized={handleRecognition} mode="invoice" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-1">Número de Factura</label>
            <input
              type="number"
              name="numero_factura"
              required
              min="1"
              max="999999"
              step="1"
              value={numeroFactura}
              onChange={(e) => {
                const value = e.target.value
                // Limitar a 6 dígitos
                if (value.length <= 6) {
                  setNumeroFactura(value)
                }
              }}
              onKeyDown={(e) => {
                // Evitar ingresar punto, coma, signo negativo o 'e'
                if (['.', ',', '-', '+', 'e', 'E'].includes(e.key)) {
                  e.preventDefault()
                }
                // Evitar más de 6 dígitos
                if (numeroFactura.length >= 6 && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                  e.preventDefault()
                }
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              placeholder="Ej: 12345 (máx. 6 dígitos)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-1">Fecha de Emisión</label>
            <input
              type="date"
              name="fecha_emision"
              required
              max={new Date().toISOString().split('T')[0]}
              value={fechaEmision}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value)
                const today = new Date()
                
                // Verificar que no sea mayor al año actual
                if (selectedDate <= today) {
                  setFechaEmision(e.target.value)
                } else {
                  // Si es mayor, establecer la fecha de hoy
                  setFechaEmision(new Date().toISOString().split('T')[0])
                }
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800 mb-1">
            {type === 'venta' ? 'Cliente' : 'Proveedor'}
          </label>
          <input
            type="text"
            name="entidad"
            required
            value={entidad}
            onChange={(e) => setEntidad(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            placeholder={type === 'venta' ? 'Nombre del Cliente' : 'Nombre del Proveedor'}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-1">RUT</label>
            <input
              type="text"
              name="rut_entidad"
              value={rutEntidad}
              onChange={(e) => {
                let value = e.target.value.toUpperCase()
                
                // Remover todo excepto números y K
                value = value.replace(/[^0-9K]/g, '')
                
                // Si hay K, debe estar solo al final
                if (value.includes('K')) {
                  const kIndex = value.indexOf('K')
                  // Remover todas las K y agregar una al final si había alguna
                  value = value.replace(/K/g, '')
                  if (kIndex === value.length || value.length > 0) {
                    value = value + 'K'
                  }
                }
                
                // Limitar a 9 caracteres (8 números + 1 dígito verificador)
                if (value.length > 9) {
                  value = value.substring(0, 9)
                }
                
                // Formatear con puntos y guión
                let formatted = value
                if (value.length > 1) {
                  // Separar cuerpo y dígito verificador
                  const dv = value.slice(-1)
                  let body = value.slice(0, -1)
                  
                  // Agregar puntos cada 3 dígitos de derecha a izquierda
                  body = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                  
                  // Unir con guión
                  formatted = body + '-' + dv
                }
                
                setRutEntidad(formatted)
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              placeholder="Ej: 12.345.678-9"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-1">Dirección</label>
            <input
              type="text"
              name="direccion_entidad"
              value={direccionEntidad}
              onChange={(e) => setDireccionEntidad(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              placeholder="Dirección comercial"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800 mb-1">
            {type === 'venta' ? 'Servicio Prestado' : 'Categoría de Compra'}
          </label>
          <select
            name="servicio"
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
          >
            <option value="">
              {type === 'venta' ? 'Seleccionar Servicio...' : 'Seleccionar Categoría...'}
            </option>
            {(type === 'venta' ? SALES_SERVICES : PURCHASE_CATEGORIES).map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800 mb-1">Descripción</label>
          <textarea
            name="descripcion"
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            placeholder="Detalles de la factura..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-1">Monto Neto</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">$</span>
              <input
                type="number"
                name="monto_neto"
                required
                min="0"
                value={netAmount}
                onChange={(e) => setNetAmount(e.target.value)}
                className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-1">IVA (19%)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">$</span>
              <input
                type="text"
                value={iva.toLocaleString('es-CL')}
                readOnly
                className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-md bg-slate-100 text-slate-700 cursor-not-allowed"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1">Total</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-900 font-bold">$</span>
              <input
                type="text"
                value={total.toLocaleString('es-CL')}
                readOnly
                className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-md bg-slate-100 text-slate-900 font-bold cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800 mb-1">Estado</label>
          <select
            name="estado"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
          >
            <option value="pendiente">Pendiente de Pago</option>
            <option value="pagada">Pagada</option>
            <option value="anulada">Anulada</option>
          </select>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
          <Link
            href="/dashboard/invoices"
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Guardar Factura
          </button>
        </div>
      </form>
    </div>
  )
}
