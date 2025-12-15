'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { Project } from '@/types'

export async function getProjects() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('proyectos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return { projects: [], error: error.message }
  }

  return { projects: data as Project[] }
}

export async function getProject(id: number) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('proyectos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching project:', error)
    return { project: null, error: error.message }
  }

  return { project: data as Project }
}

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  
  const rawData = {
    nombre: formData.get('nombre'),
    descripcion: formData.get('descripcion'),
    cliente: formData.get('cliente'),
    fecha_inicio: formData.get('fecha_inicio') || null,
    estado: formData.get('estado') || 'sin_comenzar'
  }

  const { error } = await supabase
    .from('proyectos')
    .insert(rawData)

  if (error) {
    console.error('Error creating project:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/projects')
  return { success: true }
}

export async function updateProject(id: number, formData: FormData) {
  const supabase = await createClient()
  
  const rawData = {
    nombre: formData.get('nombre'),
    descripcion: formData.get('descripcion'),
    cliente: formData.get('cliente'),
    fecha_inicio: formData.get('fecha_inicio') || null,
    estado: formData.get('estado')
  }

  const { error } = await supabase
    .from('proyectos')
    .update(rawData)
    .eq('id', id)

  if (error) {
    console.error('Error updating project:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/projects')
  return { success: true }
}

export async function deleteProject(id: number) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('proyectos')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting project:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/projects')
  return { success: true }
}
