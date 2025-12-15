'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Project } from '@/types'
import { createProject, updateProject } from '@/app/actions/projects'

interface ProjectFormProps {
  project?: Project
  isEditing?: boolean
}

export function ProjectForm({ project, isEditing = false }: ProjectFormProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    let result
    
    if (isEditing && project) {
      result = await updateProject(project.id, formData)
    } else {
      result = await createProject(formData)
    }
    
    setIsPending(false)

    if (result.success) {
      router.push('/dashboard/projects')
      router.refresh()
    } else {
      alert('Error al guardar el proyecto: ' + result.error)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/projects" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditing ? 'Editar Proyecto' : 'Nuevo Proyecto'}
          </h1>
          <p className="text-slate-600">
            {isEditing ? 'Modifica los datos del proyecto.' : 'Crea un nuevo proyecto para gestionar.'}
          </p>
        </div>
      </div>

      <form action={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label htmlFor="nombre" className="text-sm font-medium text-slate-900">
              Nombre del Proyecto
            </label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              required
              defaultValue={project?.nombre}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Instalación Eléctrica Edificio A"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="cliente" className="text-sm font-medium text-slate-900">
              Cliente
            </label>
            <input
              type="text"
              name="cliente"
              id="cliente"
              defaultValue={project?.cliente}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre del cliente o empresa"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="fecha_inicio" className="text-sm font-medium text-slate-900">
                Fecha de Inicio
              </label>
              <input
                type="date"
                name="fecha_inicio"
                id="fecha_inicio"
                defaultValue={project?.fecha_inicio ? new Date(project.fecha_inicio).toISOString().split('T')[0] : ''}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="estado" className="text-sm font-medium text-slate-900">
                Estado
              </label>
              <select
                name="estado"
                id="estado"
                defaultValue={project?.estado || 'sin_comenzar'}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sin_comenzar">Sin comenzar</option>
                <option value="activo">Activo</option>
                <option value="terminado">Terminado</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="descripcion" className="text-sm font-medium text-slate-900">
              Descripción
            </label>
            <textarea
              name="descripcion"
              id="descripcion"
              rows={4}
              defaultValue={project?.descripcion}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Detalles del proyecto..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
          <Link
            href="/dashboard/projects"
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar Proyecto
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
