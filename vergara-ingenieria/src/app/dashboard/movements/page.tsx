'use client'

import { useState, useEffect } from 'react'
import { getInventoryMovements } from '@/app/actions/inventory'
import { Search, ArrowUpRight, ArrowDownRight, History, Filter } from 'lucide-react'

type Movement = {
  id: number
  created_at: string
  producto_id: number
  tipo: 'entrada' | 'salida'
  cantidad: number
  motivo?: string
  proyecto_id?: number
  producto: { nombre: string; categoria: string }
  proyecto?: { nombre: string }
}

export default function MovementsPage() {
  const [movements, setMovements] = useState<Movement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'entrada' | 'salida'>('all')

  useEffect(() => {
    async function loadMovements() {
      const { movements } = await getInventoryMovements()
      if (movements) {
        setMovements(movements as Movement[])
      }
      setIsLoading(false)
    }
    loadMovements()
  }, [])

  const filteredMovements = movements.filter(movement => {
    const matchesSearch = 
      movement.producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.producto.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (movement.motivo && movement.motivo.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = filterType === 'all' || movement.tipo === filterType

    return matchesSearch && matchesType
  })

  const totalEntradas = movements.filter(m => m.tipo === 'entrada').reduce((sum, m) => sum + m.cantidad, 0)
  const totalSalidas = movements.filter(m => m.tipo === 'salida').reduce((sum, m) => sum + m.cantidad, 0)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Historial de Movimientos</h1>
        <p className="text-slate-600">Registro completo de entradas y salidas de inventario.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Total Movimientos</h3>
            <div className="p-2 bg-blue-100 rounded-full">
              <History className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{movements.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Entradas Totales</h3>
            <div className="p-2 bg-green-100 rounded-full">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600">{totalEntradas}</p>
          <p className="text-xs text-slate-500 mt-1">Unidades ingresadas</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Salidas Totales</h3>
            <div className="p-2 bg-red-100 rounded-full">
              <ArrowDownRight className="h-4 w-4 text-red-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-600">{totalSalidas}</p>
          <p className="text-xs text-slate-500 mt-1">Unidades retiradas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por producto, categoría o motivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'entrada' | 'salida')}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
            >
              <option value="all">Todos los movimientos</option>
              <option value="entrada">Solo Entradas</option>
              <option value="salida">Solo Salidas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Movements Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium text-slate-700">Fecha</th>
                <th className="px-6 py-3 font-medium text-slate-700">Tipo</th>
                <th className="px-6 py-3 font-medium text-slate-700">Producto</th>
                <th className="px-6 py-3 font-medium text-slate-700">Categoría</th>
                <th className="px-6 py-3 font-medium text-slate-700 text-center">Cantidad</th>
                <th className="px-6 py-3 font-medium text-slate-700">Motivo</th>
                <th className="px-6 py-3 font-medium text-slate-700">Proyecto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-600">
                    No se encontraron movimientos
                  </td>
                </tr>
              ) : (
                filteredMovements.map((movement) => (
                  <tr key={movement.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-700">
                      {new Date(movement.created_at).toLocaleString('es-CL', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        movement.tipo === 'entrada'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {movement.tipo === 'entrada' ? (
                          <><ArrowUpRight className="h-3 w-3" /> Entrada</>
                        ) : (
                          <><ArrowDownRight className="h-3 w-3" /> Salida</>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {movement.producto.nombre}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {movement.producto.categoria}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-semibold ${
                        movement.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {movement.tipo === 'entrada' ? '+' : '-'}{movement.cantidad}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {movement.motivo || '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {movement.proyecto?.nombre || '-'}
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
