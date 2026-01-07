import { DollarSign, Package, AlertTriangle, TrendingUp, ArrowUpRight } from 'lucide-react'
import { getProducts } from '@/app/actions/inventory'
import Link from 'next/link'
import { StatsCard } from '@/components/dashboard/StatsCard'

export default async function Dashboard() {
  const { products } = await getProducts()
  
  // Calculate low stock items
  const lowStockItems = (products || []).filter(p => p.cantidad <= p.stock_minimo)
  
  // Calculate inventory statistics
  const totalProducts = products?.length || 0
  const totalValue = products?.reduce((sum, p) => sum + (p.precio_unitario * p.cantidad), 0) || 0

  const stats = [
    {
      title: "Total Productos",
      value: totalProducts.toString(),
      iconName: "Package" as const,
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      description: "Items en inventario",
      trend: "+12%",
      trendUp: true
    },
    {
      title: "Valor Total",
      value: `$${totalValue.toLocaleString('es-CL')}`,
      iconName: "DollarSign" as const,
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      description: "Valor del inventario",
      trend: "+8%",
      trendUp: true
    },
    {
      title: "Stock Bajo",
      value: lowStockItems.length.toString(),
      iconName: "AlertTriangle" as const,
      gradient: lowStockItems.length > 0 ? "from-yellow-500 to-orange-500" : "from-green-500 to-emerald-500",
      bgColor: lowStockItems.length > 0 ? "bg-yellow-50" : "bg-green-50",
      iconColor: lowStockItems.length > 0 ? "text-yellow-600" : "text-green-600",
      description: "Productos por reponer",
      trend: lowStockItems.length > 0 ? "Acción requerida" : "Todo bien",
      trendUp: lowStockItems.length === 0
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">Bienvenido al Dashboard</h1>
            <p className="text-blue-100 font-medium">Aquí tienes un resumen de tu inventario y estadísticas</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <TrendingUp className="h-12 w-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} delay={index * 0.1} />
        ))}
      </div>

      {/* Inventory Alert Card */}
      {lowStockItems.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl shadow-sm border-2 border-yellow-200 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-slate-900 font-bold text-lg mb-1">⚠️ Alerta de Inventario</h3>
                <p className="text-slate-600">
                  Tienes <span className="font-bold text-yellow-700">{lowStockItems.length} productos</span> con stock bajo que requieren atención.
                </p>
              </div>
            </div>
            <Link 
              href="/dashboard/inventory"
              className="flex items-center gap-2 bg-white px-6 py-3 rounded-xl text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors shadow-sm border border-slate-200 group"
            >
              Ver Inventario
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dashboard/inventory/new"
            className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <Package className="h-8 w-8 text-slate-400 group-hover:text-blue-600 mb-2" />
            <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600">Nuevo Producto</span>
          </Link>
          <Link
            href="/dashboard/projects/new"
            className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-slate-300 hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <TrendingUp className="h-8 w-8 text-slate-400 group-hover:text-green-600 mb-2" />
            <span className="text-sm font-medium text-slate-600 group-hover:text-green-600">Nuevo Proyecto</span>
          </Link>
          <Link
            href="/dashboard/quotes/new"
            className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-slate-300 hover:border-purple-500 hover:bg-purple-50 transition-all group"
          >
            <DollarSign className="h-8 w-8 text-slate-400 group-hover:text-purple-600 mb-2" />
            <span className="text-sm font-medium text-slate-600 group-hover:text-purple-600">Nueva Cotización</span>
          </Link>
          <Link
            href="/dashboard/inventory/exit"
            className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-slate-300 hover:border-orange-500 hover:bg-orange-50 transition-all group"
          >
            <AlertTriangle className="h-8 w-8 text-slate-400 group-hover:text-orange-600 mb-2" />
            <span className="text-sm font-medium text-slate-600 group-hover:text-orange-600">Salida Inventario</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
