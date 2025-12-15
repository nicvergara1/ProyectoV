'use client'

import { useState, useEffect } from 'react'
import { getInvoices, getFinancialSummary } from '@/app/actions/invoices'
import Link from 'next/link'
import { Plus, Search, FileText, ArrowUpRight, ArrowDownLeft, DollarSign, Eye } from 'lucide-react'
import { Invoice, FinancialSummary } from '@/types'
import { InvoicePDFButton } from '@/components/InvoicePDFButton'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [summary, setSummary] = useState<FinancialSummary>({ totalIncome: 0, totalExpenses: 0, balance: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const [invoicesData, summaryData] = await Promise.all([
          getInvoices(),
          getFinancialSummary()
        ])
        
        if (invoicesData.invoices) {
          setInvoices(invoicesData.invoices)
        }
        if (summaryData) {
          setSummary(summaryData)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredInvoices = invoices.filter(invoice => 
    invoice.entidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.numero_factura.includes(searchTerm)
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Facturas</h1>
          <p className="text-slate-600">Gestiona tus facturas de compra y venta.</p>
        </div>
        <Link
          href="/dashboard/invoices/new"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nueva Factura
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Ventas Totales</h3>
            <div className="p-2 bg-green-100 rounded-full">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            ${summary.totalIncome.toLocaleString('es-CL')}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Compras Totales</h3>
            <div className="p-2 bg-red-100 rounded-full">
              <ArrowDownLeft className="h-4 w-4 text-red-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            ${summary.totalExpenses.toLocaleString('es-CL')}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Balance</h3>
            <div className="p-2 bg-blue-100 rounded-full">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${summary.balance.toLocaleString('es-CL')}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, proveedor o número..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium text-slate-700">Tipo</th>
                <th className="px-6 py-3 font-medium text-slate-700">N° Factura</th>
                <th className="px-6 py-3 font-medium text-slate-700">Entidad</th>
                <th className="px-6 py-3 font-medium text-slate-700">Fecha</th>
                <th className="px-6 py-3 font-medium text-slate-700">Estado</th>
                <th className="px-6 py-3 font-medium text-slate-700 text-right">Monto Total</th>
                <th className="px-6 py-3 font-medium text-slate-700 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-600">
                    No se encontraron facturas
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.tipo === 'venta' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {invoice.tipo === 'venta' ? 'Venta' : 'Compra'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {invoice.numero_factura}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {invoice.entidad}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {new Date(invoice.fecha_emision).toLocaleDateString('es-CL')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.estado === 'pagada' 
                          ? 'bg-blue-100 text-blue-800' 
                          : invoice.estado === 'anulada'
                          ? 'bg-slate-100 text-slate-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.estado.charAt(0).toUpperCase() + invoice.estado.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">
                      ${invoice.monto_total.toLocaleString('es-CL')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/invoices/${invoice.id}`}
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        {invoice.tipo === 'venta' && (
                          <InvoicePDFButton invoice={invoice} />
                        )}
                      </div>
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
