'use client'

import { useState, useEffect } from 'react'
import { getProjects, deleteProject } from '@/app/actions/projects'
import Link from 'next/link'
import { Plus, Search, Briefcase, Calendar, User, Trash2, Edit } from 'lucide-react'
import { Project } from '@/types'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    const { projects } = await getProjects()
    if (projects) {
      setProjects(projects)
    }
    setIsLoading(false)
  }

  async function handleDelete(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      await deleteProject(id)
      loadProjects()
    }
  }

  const filteredProjects = projects.filter(project => 
    project.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.cliente && project.cliente.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo': return 'bg-green-100 text-green-700'
      case 'terminado': return 'bg-slate-100 text-slate-700'
      case 'sin_comenzar': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'activo': return 'Activo'
      case 'terminado': return 'Terminado'
      case 'sin_comenzar': return 'Sin comenzar'
      default: return status
    }
  }

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
          <h1 className="text-2xl font-bold text-slate-900">Proyectos</h1>
          <p className="text-slate-600">Gestiona tus proyectos y obras.</p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nuevo Proyecto
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar proyectos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.estado)}`}>
                {getStatusLabel(project.estado)}
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{project.nombre}</h3>
            <p className="text-slate-600 text-sm mb-4 line-clamp-2">{project.descripcion || 'Sin descripción'}</p>
            
            <div className="space-y-2 text-sm text-slate-500">
              {project.cliente && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{project.cliente}</span>
                </div>
              )}
              {project.fecha_inicio && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(project.fecha_inicio).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end gap-2">
              <Link
                href={`/dashboard/projects/${project.id}/edit`}
                className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                title="Editar proyecto"
              >
                <Edit className="h-4 w-4" />
              </Link>
              <button
                onClick={() => handleDelete(project.id)}
                className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                title="Eliminar proyecto"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200 border-dashed">
          <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No hay proyectos</h3>
          <p className="text-slate-500">Comienza creando tu primer proyecto.</p>
        </div>
      )}
    </div>
  )
}
