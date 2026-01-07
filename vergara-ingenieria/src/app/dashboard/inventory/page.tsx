'use client'

import { useState, useEffect } from 'react'
import { getProducts, deleteProduct } from '@/app/actions/inventory'
import Link from 'next/link'
import { Plus, Search, Package, AlertTriangle, Trash2, MinusCircle, Edit, TrendingUp, DollarSign } from 'lucide-react'
import { Product } from '@/types'
import { ConfirmModal } from '@/components/ConfirmModal'

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    const { products } = await getProducts()
    if (products) {
      setProducts(products)
    }
    setIsLoading(false)
  }

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product)
  }

  const handleConfirmDelete = async () => {
    if (!productToDelete) return
    
    await deleteProduct(productToDelete.id)
    loadProducts()
    setProductToDelete(null)
  }

  const filteredProducts = products.filter(product => 
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const lowStockCount = products.filter(p => p.cantidad <= p.stock_minimo).length
  const totalValue = products.reduce((acc, p) => acc + (p.cantidad * p.precio_unitario), 0)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-600 absolute top-0 left-0"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Inventario</h1>
            <p className="text-blue-100">Gestiona tus productos y control de stock</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/inventory/exit"
              className="flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all font-semibold border border-white/30 shadow-lg hover:shadow-xl"
            >
              <MinusCircle className="h-5 w-5" />
              Registrar Salida
            </Link>
            <Link
              href="/dashboard/inventory/new"
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5" />
              Nuevo Producto
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Productos</h3>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-900 mb-2">{products.length}</p>
          <div className="h-1 w-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full group-hover:w-full transition-all duration-500"></div>
        </div>

        <div className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-yellow-200 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Stock Bajo</h3>
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-900 mb-1">{lowStockCount}</p>
          <p className="text-xs text-slate-500">Productos por debajo del mínimo</p>
          <div className="h-1 w-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full group-hover:w-full transition-all duration-500 mt-2"></div>
        </div>

        <div className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-green-200 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Valor Total</h3>
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-900 mb-2">
            ${totalValue.toLocaleString('es-CL')}
          </p>
          <div className="h-1 w-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full group-hover:w-full transition-all duration-500"></div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 transition-all"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Productos ({filteredProducts.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4 text-right">Precio Unitario</th>
                <th className="px-6 py-4 text-right">Valor Total</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">No se encontraron productos</p>
                    <p className="text-slate-400 text-sm mt-2">Intenta con otros términos de búsqueda</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{product.nombre}</p>
                          {product.cantidad <= product.stock_minimo && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200 mt-1">
                              ⚠️ Stock Bajo
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {product.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold text-lg ${product.cantidad <= product.stock_minimo ? 'text-red-600' : 'text-slate-900'}`}>
                        {product.cantidad}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-600 font-medium">
                      ${product.precio_unitario.toLocaleString('es-CL')}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                      ${(product.cantidad * product.precio_unitario).toLocaleString('es-CL')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/inventory/${product.id}/edit`}
                          className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-100 transition-all"
                          title="Editar producto"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-100 transition-all"
                          title="Eliminar producto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={productToDelete !== null}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Producto"
        message={productToDelete ? `¿Estás seguro de eliminar el producto "${productToDelete.nombre}"?\n\nCategoría: ${productToDelete.categoria}\nStock actual: ${productToDelete.cantidad} unidades\nValor total: $${(productToDelete.cantidad * productToDelete.precio_unitario).toLocaleString('es-CL')}\n\nEsta acción no se puede deshacer.` : ''}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDestructive={true}
      />
    </div>
  )
}
