import { getQuoteById } from '@/app/actions/quotes'
import { cn } from '@/lib/utils'
import { ArrowLeft, Calendar, Mail, User, FileText } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { QuoteExportButton } from '@/components/QuoteExportButton'
import { formatCurrency } from '@/lib/formatters'

export default async function QuoteDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const quote = await getQuoteById(Number(id))

  if (!quote) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/quotes" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="h-6 w-6 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Detalles de Cotización #{quote.id}</h1>
            <p className="text-slate-500">{quote.proyecto_nombre}</p>
          </div>
        </div>
        <QuoteExportButton quote={quote} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Client Info Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 md:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-slate-400" />
            Información del Cliente
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Cliente / Empresa</p>
              <p className="text-base text-slate-900">{quote.cliente_nombre}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Email</p>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <p className="text-base text-slate-900">{quote.cliente_email || 'No registrado'}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Fecha de Emisión</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <p className="text-base text-slate-900">{new Date(quote.fecha_creacion).toLocaleDateString('es-CL')}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Válido Hasta</p>
              <p className="text-base text-slate-900">
                {quote.valido_hasta ? new Date(quote.valido_hasta).toLocaleDateString('es-CL') : 'Indefinido'}
              </p>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Estado</h2>
          <div className="flex flex-col gap-4">
            <div className={cn(
              "px-4 py-2 rounded-md text-center font-medium",
              quote.estado === 'aceptada' && "bg-green-100 text-green-700",
              quote.estado === 'enviada' && "bg-blue-100 text-blue-700",
              quote.estado === 'borrador' && "bg-slate-100 text-slate-700",
              quote.estado === 'rechazada' && "bg-red-100 text-red-700"
            )}>
              {quote.estado === 'aceptada' ? 'Aceptada' : 
               quote.estado === 'enviada' ? 'Enviada' : 
               quote.estado === 'borrador' ? 'Borrador' : 'Rechazada'}
            </div>
            <p className="text-sm text-slate-500 text-center">
              Total Cotizado
            </p>
            <p className="text-3xl font-bold text-slate-900 text-center">
              {formatCurrency(quote.monto_total)}
            </p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-400" />
            Ítems
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Descripción</th>
                <th className="px-6 py-4 text-right">Cantidad</th>
                <th className="px-6 py-4 text-right">Precio Unitario</th>
                <th className="px-6 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {quote.items && quote.items.length > 0 ? (
                quote.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 font-medium text-slate-900">{item.descripcion}</td>
                    <td className="px-6 py-4 text-right">{item.cantidad}</td>
                    <td className="px-6 py-4 text-right">{formatCurrency(item.precio_unitario)}</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">
                      {formatCurrency(item.cantidad * item.precio_unitario)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No hay ítems registrados en esta cotización.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-slate-50 font-semibold text-slate-900">
              <tr>
                <td colSpan={3} className="px-6 py-4 text-right">Total Final</td>
                <td className="px-6 py-4 text-right">{formatCurrency(quote.monto_total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
