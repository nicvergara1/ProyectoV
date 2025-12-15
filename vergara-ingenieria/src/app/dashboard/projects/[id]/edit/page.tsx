import { getProject } from '@/app/actions/projects'
import { ProjectForm } from '@/components/ProjectForm'
import { notFound } from 'next/navigation'

interface EditProjectPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params
  const { project, error } = await getProject(parseInt(id))

  if (error || !project) {
    notFound()
  }

  return <ProjectForm project={project} isEditing />
}
