import { DollarSign, TrendingUp, TrendingDown, Activity, Plus, FileText, Package, AlertTriangle } from 'lucide-react'
import { getInvoices, getFinancialSummary } from '@/app/actions/invoices'
import { getProducts } from '@/app/actions/inventory'
import { cn } from '@/lib/utils'
import Link from 'next/link'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(amount)
}

export default async function Dashboard() {
  const summary = await getFinancialSummary()
  const { invoices } = await getInvoices()
  const { products } = await getProducts()
  
  // Get only the 5 most recent invoices
  const recentInvoices = invoices ? invoices.slice(0, 5) : []
  
  // Calculate low stock items
  const lowStockItems = (products || []).filter(p => p.cantidad <= p.stock_minimo)

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-600 text-sm font-medium">Ventas Totales</h3>
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{formatCurrency(summary.totalIncome)}</p>
          <div className="flex items-center mt-2 text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>Ingresos por Facturas</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-600 text-sm font-medium">Compras Totales</h3>
            <Activity className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{formatCurrency(summary.totalExpenses)}</p>
          <div className="flex items-center mt-2 text-sm text-red-600">
            <TrendingDown className="h-4 w-4 mr-1" />
            <span>Gastos por Facturas</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-600 text-sm font-medium">Balance</h3>
            <DollarSign className="h-5 w-5 text-blue-500" />
          </div>
          <p className={`text-3xl font-bold ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(summary.balance)}
          </p>
          <div className="flex items-center mt-2 text-sm text-slate-600">
            <FileText className="h-4 w-4 mr-1" />
            <span>Neto (Ventas - Compras)</span>
          </div>
        </div>

        {/* Inventory Alert Card */}
        {lowStockItems.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 md:col-span-3 border-l-4 border-l-yellow-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-bold">Alerta de Inventario</h3>
                  <p className="text-slate-600 text-sm">
                    Tienes {lowStockItems.length} productos con stock bajo.
                  </p>
                </div>
              </div>
              <Link 
                href="/dashboard/inventory"
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Ver Inventario &rarr;
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-semibold text-slate-900">Facturas Recientes</h3>
          <Link href="/dashboard/invoices/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center">
            <Plus className="h-4 w-4" />
            Nueva Factura
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="bg-slate-50 text-slate-900 font-medium">
              <tr>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">N° Factura</th>
                <th className="px-6 py-4">Entidad</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Monto Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No hay facturas recientes
                  </td>
                </tr>
              ) : (
                recentInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        invoice.tipo === 'venta' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}>
                        {invoice.tipo === 'venta' ? 'Venta' : 'Compra'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{invoice.numero_factura}</td>
                    <td className="px-6 py-4">{invoice.entidad}</td>
                    <td className="px-6 py-4">{new Date(invoice.fecha_emision).toLocaleDateString('es-CL')}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs",
                        invoice.estado === 'pagada' && "bg-blue-100 text-blue-700",
                        invoice.estado === 'pendiente' && "bg-yellow-100 text-yellow-700",
                        invoice.estado === 'anulada' && "bg-slate-100 text-slate-700"
                      )}>
                        {invoice.estado.charAt(0).toUpperCase() + invoice.estado.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">
                      {formatCurrency(invoice.monto_total)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 text-center">
          <Link href="/dashboard/invoices" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Ver todas las facturas &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}
