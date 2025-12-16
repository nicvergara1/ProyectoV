'use client'

import { useState, useEffect } from 'react'
import { getProducts, deleteProduct } from '@/app/actions/inventory'
import Link from 'next/link'
import { Plus, Search, Package, AlertTriangle, Trash2, MinusCircle, Edit } from 'lucide-react'
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
          <h1 className="text-2xl font-bold text-slate-900">Inventario</h1>
          <p className="text-slate-600">Gestiona tus productos y control de stock.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/inventory/exit"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          >
            <MinusCircle className="h-4 w-4" />
            Registrar Salida
          </Link>
          <Link
            href="/dashboard/inventory/new"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Total Productos</h3>
            <div className="p-2 bg-blue-100 rounded-full">
              <Package className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{products.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Stock Bajo</h3>
            <div className="p-2 bg-yellow-100 rounded-full">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{lowStockCount}</p>
          <p className="text-xs text-slate-500 mt-1">Productos por debajo del mínimo</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Valor Total</h3>
            <div className="p-2 bg-green-100 rounded-full">
              <span className="text-green-600 font-bold">$</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            ${products.reduce((acc, p) => acc + (p.cantidad * p.precio_unitario), 0).toLocaleString('es-CL')}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="bg-slate-50 text-slate-900 font-medium">
              <tr>
                <th className="px-6 py-3">Producto</th>
                <th className="px-6 py-3">Categoría</th>
                <th className="px-6 py-3 text-center">Stock</th>
                <th className="px-6 py-3 text-right">Precio Unitario</th>
                <th className="px-6 py-3 text-right">Valor Total</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-600">
                    No se encontraron productos
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {product.nombre}
                      {product.cantidad <= product.stock_minimo && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          Stock Bajo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{product.categoria}</td>
                    <td className="px-6 py-4 text-center font-medium">
                      <span className={product.cantidad <= product.stock_minimo ? 'text-red-600' : 'text-slate-900'}>
                        {product.cantidad}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-600">
                      ${product.precio_unitario.toLocaleString('es-CL')}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">
                      ${(product.cantidad * product.precio_unitario).toLocaleString('es-CL')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/inventory/${product.id}/edit`}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded-md hover:bg-blue-50 transition-colors"
                          title="Editar producto"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50 transition-colors"
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
