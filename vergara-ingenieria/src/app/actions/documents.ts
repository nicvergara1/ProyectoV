'use server';

import { createClient } from '@/utils/supabase/server';
import ExcelJS from 'exceljs';
import { revalidatePath } from 'next/cache';

export interface Documento {
  id: string;
  user_id: string;
  nombre: string;
  descripcion: string | null;
  tipo: string;
  storage_path: string;
  size_bytes: number | null;
  mime_type: string | null;
  data: any;
  created_at: string;
  updated_at: string;
}

/**
 * Obtener todos los documentos del usuario
 */
export async function getDocuments(): Promise<{ data: Documento[] | null; error: string | null }> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { data: null, error: 'No autenticado' };
    }

    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error al obtener documentos:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error: any) {
    console.error('Error en getDocuments:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Obtener un documento por ID
 */
export async function getDocument(id: string): Promise<{ data: Documento | null; error: string | null }> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { data: null, error: 'No autenticado' };
    }

    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error al obtener documento:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error: any) {
    console.error('Error en getDocument:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Crear un nuevo documento desde archivo Excel
 */
export async function createDocumentFromFile(formData: FormData): Promise<{ data: Documento | null; error: string | null }> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { data: null, error: 'No autenticado' };
    }

    const file = formData.get('file') as File;
    const nombre = formData.get('nombre') as string || file.name;
    const descripcion = formData.get('descripcion') as string || null;

    if (!file) {
      return { data: null, error: 'No se proporcionó archivo' };
    }

    // Leer archivo Excel y convertir a datos de spreadsheet
    const arrayBuffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    // Convertir a formato spreadsheet (solo primera hoja por ahora)
    const worksheet = workbook.worksheets[0];
    const jsonData: any[][] = [];
    
    worksheet.eachRow((row, rowNumber) => {
      const rowData: any[] = [];
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        rowData[colNumber - 1] = cell.value;
      });
      jsonData.push(rowData);
    });

    // Convertir a formato spreadsheet
    const rows: any = {};
    jsonData.forEach((row, rowIndex) => {
      const cells: any = {};
      row.forEach((cellValue, colIndex) => {
        if (cellValue !== null && cellValue !== undefined && cellValue !== '') {
          cells[colIndex] = { text: String(cellValue) };
        }
      });
      if (Object.keys(cells).length > 0) {
        rows[rowIndex] = { cells };
      }
    });

    const spreadsheetData = {
      name: worksheet.name || 'Hoja1',
      freeze: 'A1',
      styles: [],
      merges: [],
      rows: rows,
      cols: {
        len: 26,
      },
    };

    // Subir archivo original a Storage
    const fileName = `${user.id}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('documentos')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error al subir archivo:', uploadError);
      return { data: null, error: uploadError.message };
    }

    // Guardar registro en base de datos
    const { data, error } = await supabase
      .from('documentos')
      .insert({
        user_id: user.id,
        nombre: nombre,
        descripcion: descripcion,
        tipo: file.name.endsWith('.csv') ? 'csv' : 'excel',
        storage_path: fileName,
        size_bytes: file.size,
        mime_type: file.type,
        data: spreadsheetData
      })
      .select()
      .single();

    if (error) {
      console.error('Error al crear documento:', error);
      return { data: null, error: error.message };
    }

    revalidatePath('/dashboard/documentos');
    return { data, error: null };
  } catch (error: any) {
    console.error('Error en createDocumentFromFile:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Crear un nuevo documento vacío
 */
export async function createEmptyDocument(nombre: string, descripcion?: string): Promise<{ data: Documento | null; error: string | null }> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { data: null, error: 'No autenticado' };
    }

    // Datos iniciales de x-spreadsheet
    const initialData = {
      name: 'Hoja1',
      freeze: 'A1',
      styles: [],
      merges: [],
      rows: {
        0: {
          cells: {
            0: { text: 'Columna A' },
            1: { text: 'Columna B' },
            2: { text: 'Columna C' },
            3: { text: 'Columna D' },
          },
        },
      },
      cols: {
        len: 26,
      },
    };

    const { data, error } = await supabase
      .from('documentos')
      .insert({
        user_id: user.id,
        nombre: nombre,
        descripcion: descripcion || null,
        tipo: 'excel',
        storage_path: '', // Se llenará al guardar
        data: initialData
      })
      .select()
      .single();

    if (error) {
      console.error('Error al crear documento:', error);
      return { data: null, error: error.message };
    }

    revalidatePath('/dashboard/documentos');
    return { data, error: null };
  } catch (error: any) {
    console.error('Error en createEmptyDocument:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Actualizar datos del documento
 */
export async function updateDocument(
  id: string,
  updates: { nombre?: string; descripcion?: string; data?: any }
): Promise<{ data: Documento | null; error: string | null }> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { data: null, error: 'No autenticado' };
    }

    const { data, error } = await supabase
      .from('documentos')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar documento:', error);
      return { data: null, error: error.message };
    }

    revalidatePath('/dashboard/documentos');
    revalidatePath(`/dashboard/documentos/${id}`);
    return { data, error: null };
  } catch (error: any) {
    console.error('Error en updateDocument:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Eliminar documento
 */
export async function deleteDocument(id: string): Promise<{ error: string | null }> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { error: 'No autenticado' };
    }

    // Obtener el documento para eliminar archivo de storage
    const { data: doc } = await supabase
      .from('documentos')
      .select('storage_path')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    // Eliminar de storage si existe
    if (doc?.storage_path) {
      await supabase.storage
        .from('documentos')
        .remove([doc.storage_path]);
    }

    // Eliminar registro
    const { error } = await supabase
      .from('documentos')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error al eliminar documento:', error);
      return { error: error.message };
    }

    revalidatePath('/dashboard/documentos');
    return { error: null };
  } catch (error: any) {
    console.error('Error en deleteDocument:', error);
    return { error: error.message };
  }
}
