import { getQuotes } from '@/app/actions/quotes'
import { cn } from '@/lib/utils'
import { Plus, FileText, CheckCircle, Send, FileEdit, XCircle, DollarSign, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/formatters'

export default async function QuotesPage() {
  const quotes = await getQuotes()

  const acceptedQuotes = quotes.filter(q => q.estado === 'aceptada').length
  const totalValue = quotes
    .filter(q => q.estado === 'aceptada')
    .reduce((sum, q) => sum + q.monto_total, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Cotizaciones</h1>
            <p className="text-blue-100">Gestiona y crea nuevas cotizaciones para tus clientes</p>
          </div>
          <Link
            href="/dashboard/quotes/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-semibold shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            Nueva Cotización
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Cotizaciones</h3>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-900 mb-2">{quotes.length}</p>
          <div className="h-1 w-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full group-hover:w-full transition-all duration-500"></div>
        </div>

        <div className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-green-200 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Aceptadas</h3>
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-900 mb-2">{acceptedQuotes}</p>
          <div className="h-1 w-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full group-hover:w-full transition-all duration-500"></div>
        </div>

        <div className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-purple-200 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Valor Aceptadas</h3>
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-900 mb-2">
            {formatCurrency(totalValue)}
          </p>
          <div className="h-1 w-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full group-hover:w-full transition-all duration-500"></div>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Cotizaciones ({quotes.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Proyecto</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">No hay cotizaciones registradas</p>
                    <p className="text-slate-400 text-sm mt-2">Crea tu primera cotización para comenzar</p>
                  </td>
                </tr>
              ) : (
                quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="font-semibold text-slate-900">{quote.cliente_nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{quote.proyecto_nombre}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(quote.fecha_creacion).toLocaleDateString('es-CL')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm",
                        quote.estado === 'aceptada' && "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
                        quote.estado === 'enviada' && "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
                        quote.estado === 'borrador' && "bg-slate-100 text-slate-700",
                        quote.estado === 'rechazada' && "bg-gradient-to-r from-red-500 to-rose-500 text-white"
                      )}>
                        {quote.estado === 'aceptada' && <CheckCircle className="h-3 w-3" />}
                        {quote.estado === 'enviada' && <Send className="h-3 w-3" />}
                        {quote.estado === 'borrador' && <FileEdit className="h-3 w-3" />}
                        {quote.estado === 'rechazada' && <XCircle className="h-3 w-3" />}
                        {quote.estado === 'aceptada' ? 'Aceptada' : 
                         quote.estado === 'enviada' ? 'Enviada' : 
                         quote.estado === 'borrador' ? 'Borrador' : 'Rechazada'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                      {formatCurrency(quote.monto_total)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/quotes/${quote.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-blue-600 hover:text-blue-800 font-semibold text-xs rounded-lg hover:bg-blue-100 transition-all"
                      >
                        Ver Detalles
                        <TrendingUp className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
