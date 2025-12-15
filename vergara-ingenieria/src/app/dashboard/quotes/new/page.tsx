import { QuoteForm } from '@/components/QuoteForm'
import { getProjects } from '@/app/actions/projects'

export default async function NewQuotePage() {
  const { projects } = await getProjects()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Nueva Cotización</h1>
        <p className="text-slate-500">Complete los datos para generar una nueva cotización.</p>
      </div>
      <QuoteForm projects={projects || []} />
    </div>
  )
}
