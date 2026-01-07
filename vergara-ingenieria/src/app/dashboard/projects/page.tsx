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
      case 'activo': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
      case 'terminado': return 'bg-gradient-to-r from-slate-500 to-slate-600 text-white'
      case 'sin_comenzar': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
      default: return 'bg-gradient-to-r from-slate-400 to-slate-500 text-white'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'activo': return '✓ Activo'
      case 'terminado': return '✓ Terminado'
      case 'sin_comenzar': return '⏸ Sin comenzar'
      default: return status
    }
  }

  const activeProjects = projects.filter(p => p.estado === 'activo').length
  const completedProjects = projects.filter(p => p.estado === 'terminado').length

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
            <h1 className="text-3xl font-bold mb-2">Proyectos</h1>
            <p className="text-blue-100">Gestiona tus proyectos y obras</p>
          </div>
          <Link
            href="/dashboard/projects/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-semibold shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            Nuevo Proyecto
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Proyectos</h3>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-900 mb-2">{projects.length}</p>
          <div className="h-1 w-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full group-hover:w-full transition-all duration-500"></div>
        </div>

        <div className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-green-200 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">En Progreso</h3>
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-900 mb-2">{activeProjects}</p>
          <div className="h-1 w-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full group-hover:w-full transition-all duration-500"></div>
        </div>

        <div className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-purple-200 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Completados</h3>
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-900 mb-2">{completedProjects}</p>
          <div className="h-1 w-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full group-hover:w-full transition-all duration-500"></div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar proyectos por nombre o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 transition-all"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <div className="inline-flex p-6 bg-slate-50 rounded-full mb-4">
            <Briefcase className="h-16 w-16 text-slate-300" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No hay proyectos</h3>
          <p className="text-slate-500 mb-6">Comienza creando tu primer proyecto</p>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
          >
            <Plus className="h-5 w-5" />
            Crear Proyecto
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-md ${getStatusColor(project.estado)}`}>
                  {getStatusLabel(project.estado)}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{project.nombre}</h3>
              <p className="text-slate-600 text-sm mb-4 line-clamp-2 h-10">{project.descripcion || 'Sin descripción'}</p>
              
              <div className="space-y-2.5 text-sm text-slate-600 mb-4">
                {project.cliente && (
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg">
                    <div className="p-1.5 bg-white rounded-md shadow-sm">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium">{project.cliente}</span>
                  </div>
                )}
                {project.fecha_inicio && (
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg">
                    <div className="p-1.5 bg-white rounded-md shadow-sm">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium">{new Date(project.fecha_inicio).toLocaleDateString('es-CL')}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t-2 border-slate-100 flex justify-end gap-2">
                <Link
                  href={`/dashboard/projects/${project.id}/edit`}
                  className="p-2.5 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 transition-all"
                  title="Editar proyecto"
                >
                  <Edit className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2.5 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 transition-all"
                  title="Eliminar proyecto"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
