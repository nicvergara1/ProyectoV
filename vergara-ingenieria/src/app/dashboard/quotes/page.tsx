import { getQuotes } from '@/app/actions/quotes'
import { cn } from '@/lib/utils'
import { Plus, FileText } from 'lucide-react'
import Link from 'next/link'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(amount)
}

export default async function QuotesPage() {
  const quotes = await getQuotes()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cotizaciones</h1>
          <p className="text-slate-500">Gestiona y crea nuevas cotizaciones para tus clientes.</p>
        </div>
        <Link href="/dashboard/quotes/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center">
          <Plus className="h-4 w-4" />
          Nueva Cotización
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Proyecto</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {quotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{quote.cliente_nombre}</td>
                  <td className="px-6 py-4">{quote.proyecto_nombre}</td>
                  <td className="px-6 py-4">{new Date(quote.fecha_creacion).toLocaleDateString('es-CL')}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      quote.estado === 'aceptada' && "bg-green-100 text-green-700",
                      quote.estado === 'enviada' && "bg-blue-100 text-blue-700",
                      quote.estado === 'borrador' && "bg-slate-100 text-slate-700",
                      quote.estado === 'rechazada' && "bg-red-100 text-red-700"
                    )}>
                      {quote.estado === 'aceptada' ? 'Aceptada' : 
                       quote.estado === 'enviada' ? 'Enviada' : 
                       quote.estado === 'borrador' ? 'Borrador' : 'Rechazada'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-900">
                    {formatCurrency(quote.monto_total)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/dashboard/quotes/${quote.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-xs">
                      Ver Detalles
                    </Link>
                  </td>
                </tr>
              ))}
              {quotes.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <FileText className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                    <p>No hay cotizaciones registradas.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
