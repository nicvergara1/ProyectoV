'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DiagramEditor from '@/components/DiagramEditor';
import { createClient } from '@/utils/supabase/client';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewDiagramPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('Nuevo Diagrama Eléctrico');

  const handleSave = async (diagramData: any) => {
    setSaving(true);
    try {
      const supabase = createClient();
      
      // Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Debes iniciar sesión para guardar');
        return;
      }

      // Convertir datos del diagrama a JSON string
      const jsonData = JSON.stringify(diagramData);

      // Crear un blob del JSON
      const blob = new Blob([jsonData], { type: 'application/json' });
      const fileName = `diagram_${Date.now()}.json`;

      // Subir a Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documentos')
        .upload(`${user.id}/${fileName}`, blob);

      if (uploadError) {
        console.error('Error uploading diagram:', uploadError);
        alert('Error al subir el diagrama');
        return;
      }

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('documentos')
        .getPublicUrl(`${user.id}/${fileName}`);

      // Guardar metadata en la tabla dibujos
      const { error: dbError } = await supabase
        .from('dibujos')
        .insert({
          user_id: user.id,
          nombre: title,
          nombre_original: fileName,
          tamano_bytes: blob.size,
          descripcion: 'Diagrama eléctrico creado con editor',
          storage_path: `${user.id}/${fileName}`,
          storage_url: publicUrl,
          estado: 'success',
          progreso: 100,
          uploaded_at: new Date().toISOString(),
          translation_completed_at: new Date().toISOString(),
        });

      if (dbError) {
        console.error('Error saving to database:', dbError);
        alert(`Error al guardar en la base de datos: ${dbError.message || JSON.stringify(dbError)}`);
        return;
      }

      alert('Diagrama guardado exitosamente');
      router.push('/dashboard/drawings');
    } catch (error) {
      console.error('Error saving diagram:', error);
      alert('Error al guardar el diagrama');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header con navegación */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4 shadow-sm z-10">
        <Link
          href="/dashboard/drawings"
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a Planos
        </Link>
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
            placeholder="Título del diagrama..."
          />
        </div>
        {saving && (
          <span className="text-sm text-blue-600">Guardando...</span>
        )}
      </div>

      {/* Editor */}
      <div className="flex-1">
        <DiagramEditor
          title={title}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
