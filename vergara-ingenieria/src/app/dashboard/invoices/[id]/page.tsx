import { getInvoiceById } from '@/app/actions/invoices'
import { ArrowLeft, FileText, Calendar, User, MapPin, CreditCard, Tag } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { InvoicePDFButton } from '@/components/InvoicePDFButton'

export default async function InvoiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const invoice = await getInvoiceById(id)

  if (!invoice) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/invoices" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Factura N° {invoice.numero_factura}</h1>
            <p className="text-slate-600">Detalles del documento</p>
          </div>
        </div>
        {invoice.tipo === 'venta' && (
          <InvoicePDFButton invoice={invoice} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Información General
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-500">Tipo de Documento</label>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    invoice.tipo === 'venta' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {invoice.tipo === 'venta' ? 'Venta' : 'Compra'}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-500">Estado</label>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    invoice.estado === 'pagada' 
                      ? 'bg-blue-100 text-blue-800' 
                      : invoice.estado === 'anulada'
                      ? 'bg-slate-100 text-slate-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {invoice.estado.charAt(0).toUpperCase() + invoice.estado.slice(1)}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-500">Fecha de Emisión</label>
                <div className="mt-1 flex items-center gap-2 text-slate-900">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  {new Date(invoice.fecha_emision).toLocaleDateString('es-CL')}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-500">
                  {invoice.tipo === 'venta' ? 'Servicio' : 'Categoría'}
                </label>
                <div className="mt-1 flex items-center gap-2 text-slate-900">
                  <Tag className="h-4 w-4 text-slate-400" />
                  {invoice.servicio || 'No especificado'}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-slate-500">Descripción</label>
              <p className="mt-1 text-slate-900 whitespace-pre-wrap">
                {invoice.descripcion || 'Sin descripción'}
              </p>
            </div>
          </div>

          {/* Entity Info Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Datos del {invoice.tipo === 'venta' ? 'Cliente' : 'Proveedor'}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-slate-500">Nombre / Razón Social</label>
                <p className="mt-1 text-lg font-medium text-slate-900">{invoice.entidad}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-500">RUT</label>
                <p className="mt-1 text-slate-900">{invoice.rut_entidad || 'No registrado'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-500">Dirección</label>
                <div className="mt-1 flex items-center gap-2 text-slate-900">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {invoice.direccion_entidad || 'No registrada'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Info Card */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Detalle Financiero
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Monto Neto</span>
                <span className="font-medium text-slate-900">${invoice.monto_neto.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">IVA (19%)</span>
                <span className="font-medium text-slate-900">${invoice.iva.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-lg font-bold text-blue-600">${invoice.monto_total.toLocaleString('es-CL')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
