'use client'

import Link from 'next/link'
import { LayoutDashboard, PieChart, Settings, LogOut, Zap, FileText, Menu, X, Home, Package } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import dynamic from 'next/dynamic'

// Lazy load del chatbot para mejorar tiempo de carga inicial
const ChatbotBubble = dynamic(() => import('@/components/ChatbotBubble'), {
  ssr: false,
  loading: () => null
})

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/login')
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setIsLoading(false)
      }
    }
    checkUser()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-blue-500" />
            <span className="text-lg font-bold">Vergara Ing.</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            href="/dashboard" 
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-md transition-colors"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Resumen</span>
          </Link>
          <Link 
            href="/dashboard/invoices" 
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-md transition-colors"
          >
            <FileText className="h-5 w-5" />
            <span>Facturas</span>
          </Link>
          <Link 
            href="/dashboard/inventory" 
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-md transition-colors"
          >
            <Package className="h-5 w-5" />
            <span>Inventario</span>
          </Link>
          <Link 
            href="/dashboard/projects" 
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-md transition-colors"
          >
            <Zap className="h-5 w-5" />
            <span>Proyectos</span>
          </Link>
          <Link 
            href="/dashboard/quotes" 
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-md transition-colors"
          >
            <FileText className="h-5 w-5" />
            <span>Cotizaciones</span>
          </Link>
          <Link 
            href="/dashboard/settings" 
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-md transition-colors"
          >
            <Settings className="h-5 w-5" />
            <span>Configuración</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link 
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white w-full transition-colors hover:bg-slate-800 rounded-md"
          >
            <Home className="h-5 w-5" />
            <span>Volver al Inicio</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white w-full transition-colors hover:bg-slate-800 rounded-md"
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-slate-500 hover:text-slate-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-slate-800">Panel de Control</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
              VI
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
      <ChatbotBubble />
    </div>
  )
}
