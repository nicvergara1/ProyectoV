'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createDocumentFromFile, createEmptyDocument, deleteDocument, type Documento } from '@/app/actions/documents';
import { formatBytes } from '@/lib/formatters';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/useCommon';
import { Toast } from '@/components/ui/Toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface DocumentosClientProps {
  initialDocuments: Documento[];
}

export default function DocumentosClient({ initialDocuments }: DocumentosClientProps) {
  const router = useRouter();
  const [documents, setDocuments] = useState<Documento[]>(initialDocuments);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Documento | null>(null);
  const [newDocName, setNewDocName] = useState('');
  const [newDocDescription, setNewDocDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toasts, addToast, removeToast } = useToast();

  const handlePreviewDocument = (doc: Documento) => {
    setSelectedDocument(doc);
    setShowPreviewModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('nombre', file.name);

      const { data, error } = await createDocumentFromFile(formData);

      if (error) {
        addToast(error, 'error');
        return;
      }

      if (data) {
        setDocuments((prev) => [data, ...prev]);
        addToast('Documento subido exitosamente', 'success');
        setShowUploadModal(false);
      }
    } catch (error: any) {
      addToast(error.message, 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCreateEmpty = async () => {
    if (!newDocName.trim()) {
      addToast('El nombre es requerido', 'error');
      return;
    }

    setIsCreating(true);
    try {
      const { data, error } = await createEmptyDocument(newDocName, newDocDescription);

      if (error) {
        addToast(error, 'error');
        return;
      }

      if (data) {
        addToast('Documento creado exitosamente', 'success');
        setDocuments((prev) => [data, ...prev]);
        setShowCreateModal(false);
        setNewDocName('');
        setNewDocDescription('');
      }
    } catch (error: any) {
      addToast(error.message, 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${nombre}"?`)) return;

    try {
      const { error } = await deleteDocument(id);

      if (error) {
        addToast(error, 'error');
        return;
      }

      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      addToast('Documento eliminado', 'success');
    } catch (error: any) {
      addToast(error.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Documentos Excel</h1>
          <p className="text-slate-600 mt-2">Crea y edita hojas de cálculo profesionales</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>Subir Excel</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nuevo Documento</span>
          </button>
        </div>
      </div>

      {/* Lista de documentos */}
      {documents.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">
            No hay documentos todavía
          </h3>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Comienza creando un nuevo documento o importa un archivo Excel existente para empezar a trabajar
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Subir Excel
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Documento
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200 p-6 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <button
                  onClick={() => handleDelete(doc.id, doc.nombre)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2 truncate group-hover:text-blue-600 transition-colors">
                {doc.nombre}
              </h3>
              {doc.descripcion && (
                <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[2.5rem]">
                  {doc.descripcion}
                </p>
              )}
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100">
                {doc.size_bytes && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>{formatBytes(doc.size_bytes)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    {formatDistanceToNow(new Date(doc.updated_at), {
                      addSuffix: true,
                      locale: es
                    })}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handlePreviewDocument(doc)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Ver Documento
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Subir archivo */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Subir Archivo Excel</h2>
                <p className="text-sm text-slate-600">Formatos: .xlsx, .xls, .csv</p>
              </div>
            </div>
            <div className="mb-6">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all duration-200 group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-12 h-12 mb-3 text-slate-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-sm text-slate-600 font-medium">
                    <span className="text-green-600">Click para subir</span> o arrastra aquí
                  </p>
                  <p className="text-xs text-slate-500">Máximo 50MB</p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
            {isUploading && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg text-blue-700 mb-6">
                <LoadingSpinner size="sm" />
                <span className="font-medium">Subiendo archivo...</span>
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowUploadModal(false)}
                disabled={isUploading}
                className="px-6 py-2.5 text-slate-700 font-medium hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Crear documento vacío */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Nuevo Documento</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nombre del documento *
                </label>
                <input
                  type="text"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="Ej: Presupuesto 2026"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={isCreating}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Descripción <span className="text-slate-400 font-normal">(opcional)</span>
                </label>
                <textarea
                  value={newDocDescription}
                  onChange={(e) => setNewDocDescription(e.target.value)}
                  placeholder="Describe el propósito de este documento..."
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  disabled={isCreating}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-8">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewDocName('');
                  setNewDocDescription('');
                }}
                disabled={isCreating}
                className="px-6 py-2.5 text-slate-700 font-medium hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateEmpty}
                disabled={isCreating || !newDocName.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
              >
                {isCreating ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creando...
                  </span>
                ) : (
                  'Crear Documento'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Preview del documento */}
      {showPreviewModal && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col animate-in zoom-in duration-200">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedDocument.nombre}</h2>
                  {selectedDocument.descripcion && (
                    <p className="text-sm text-slate-600">{selectedDocument.descripcion}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  setSelectedDocument(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenido del documento */}
            <div className="flex-1 overflow-auto p-6">
              {/* Información del documento */}
              <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-slate-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500 font-medium">Nombre</p>
                    <p className="text-slate-900 truncate">{selectedDocument.nombre}</p>
                  </div>
                  {selectedDocument.size_bytes && (
                    <div>
                      <p className="text-slate-500 font-medium">Tamaño</p>
                      <p className="text-slate-900">{formatBytes(selectedDocument.size_bytes)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-slate-500 font-medium">Creado</p>
                    <p className="text-slate-900">
                      {new Date(selectedDocument.created_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Actualizado</p>
                    <p className="text-slate-900">
                      {formatDistanceToNow(new Date(selectedDocument.updated_at), {
                        addSuffix: true,
                        locale: es
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Visor de Excel */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                {selectedDocument.data && (() => {
                  // Intentar extraer datos del documento
                  let tableData: any[][] = [];
                  
                  try {
                    const data = selectedDocument.data;
                    
                    // Formato Luckysheet
                    if (data.length > 0 && data[0].data) {
                      const sheet = data[0].data;
                      tableData = sheet;
                    }
                    // Formato x-spreadsheet
                    else if (data.rows) {
                      const rows = data.rows;
                      const maxRow = Math.max(...Object.keys(rows).map(Number));
                      
                      for (let i = 0; i <= maxRow; i++) {
                        const row: any[] = [];
                        const rowData = rows[i];
                        
                        if (rowData && rowData.cells) {
                          const cells = rowData.cells;
                          const maxCol = Math.max(...Object.keys(cells).map(Number));
                          
                          for (let j = 0; j <= maxCol; j++) {
                            const cell = cells[j];
                            row.push(cell?.text || cell?.v || '');
                          }
                        }
                        
                        tableData.push(row);
                      }
                    }
                    // Formato simple: array de arrays
                    else if (Array.isArray(data)) {
                      tableData = data;
                    }
                  } catch (e) {
                    console.error('Error al procesar datos del documento:', e);
                  }

                  // Validar que tableData sea un array de arrays válido
                  if (tableData.length === 0 || !Array.isArray(tableData[0])) {
                    return (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        <p className="text-slate-600 font-medium">Sin datos para mostrar</p>
                        <p className="text-sm text-slate-500 mt-1">El documento está vacío o el formato no es compatible</p>
                      </div>
                    );
                  }

                  // Calcular el número máximo de columnas
                  const maxCols = Math.max(...tableData.map(row => Array.isArray(row) ? row.length : 0));

                  return (
                    <div className="overflow-auto max-h-[500px]">
                      <table className="w-full border-collapse">
                        <thead className="bg-slate-50 sticky top-0 z-10">
                          <tr>
                            {Array.from({ length: maxCols }, (_, colIndex) => (
                              <th
                                key={colIndex}
                                className="border border-slate-200 px-4 py-2 text-left text-xs font-semibold text-slate-700 bg-slate-50"
                              >
                                {String.fromCharCode(65 + colIndex)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.map((row, rowIndex) => {
                            // Asegurarse de que row sea un array
                            const rowArray = Array.isArray(row) ? row : [];
                            
                            return (
                              <tr key={rowIndex} className="hover:bg-slate-50">
                                {Array.from({ length: maxCols }, (_, colIndex) => {
                                  const cell = rowArray[colIndex];
                                  
                                  // Extraer el valor de la celda
                                  let cellValue = '';
                                  if (typeof cell === 'object' && cell !== null) {
                                    cellValue = cell.v || cell.m || cell.text || '';
                                  } else {
                                    cellValue = cell || '';
                                  }
                                  
                                  return (
                                    <td
                                      key={colIndex}
                                      className="border border-slate-200 px-4 py-2 text-sm text-slate-900"
                                    >
                                      {cellValue}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Footer del modal */}
            <div className="flex items-center justify-between gap-3 p-6 border-t border-slate-200 bg-slate-50">
              <div className="text-sm text-slate-600">
                {selectedDocument.descripcion && (
                  <p><span className="font-medium">Descripción:</span> {selectedDocument.descripcion}</p>
                )}
              </div>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  setSelectedDocument(null);
                }}
                className="px-6 py-2.5 text-slate-700 font-medium hover:bg-white rounded-lg transition-colors border border-slate-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}
