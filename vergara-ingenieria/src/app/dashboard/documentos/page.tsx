import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getDocuments } from '@/app/actions/documents';
import DocumentosClient from './DocumentosClient';

export const metadata = {
  title: 'Documentos - Vergara Ingeniería',
  description: 'Gestión de documentos Excel',
};

export default async function DocumentosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: documents, error } = await getDocuments();

  if (error) {
    console.error('Error al cargar documentos:', error);
  }

  return <DocumentosClient initialDocuments={documents || []} />;
}
