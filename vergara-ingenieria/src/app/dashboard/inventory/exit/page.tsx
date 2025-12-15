import { getProducts } from '@/app/actions/inventory'
import { getProjects } from '@/app/actions/projects'
import ExitForm from './exit-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function ExitPage() {
  const [{ products, error: productsError }, { projects, error: projectsError }] = await Promise.all([
    getProducts(),
    getProjects()
  ])

  if (productsError || projectsError) {
    return <div>Error al cargar datos: {productsError || projectsError}</div>
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/inventory" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Registrar Salida</h1>
          <p className="text-slate-600">Registra la salida de materiales del inventario.</p>
        </div>
      </div>

      <ExitForm products={products || []} projects={projects || []} />
    </div>
  )
}
