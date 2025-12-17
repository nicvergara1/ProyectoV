'use client'

import { useEffect, useRef, useState } from 'react'

// Tipos globales de Autodesk Viewer (cargados desde CDN)
declare global {
  interface Window {
    Autodesk?: any
    AutodeskViewingInitialized?: boolean
    AutodeskViewingInitializationPromise?: Promise<void>
  }
}

interface ForgeViewerProps {
  urn: string
  onLoadComplete?: () => void
  onLoadError?: (error: any) => void
}

/**
 * Componente que renderiza el visor de Autodesk Forge para archivos DWG
 *
 * Carga dinámicamente los scripts necesarios desde CDN y renderiza el modelo 3D/2D
 */
export default function ForgeViewer({ urn, onLoadComplete, onLoadError }: ForgeViewerProps) {
  const viewerContainerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<any>(null)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 1. Cargar scripts de Autodesk Viewer desde CDN (una sola vez)
  useEffect(() => {
    // Verificar si ya están cargados
    if (window.Autodesk) {
      setIsScriptLoaded(true)
      return
    }

    // Verificar si ya existen los scripts en el DOM (evitar duplicados)
    const existingScript = document.querySelector('script[src*="viewer3D.min.js"]')
    if (existingScript) {
      setIsScriptLoaded(true)
      return
    }

    console.log('[ForgeViewer] Cargando scripts de Autodesk Viewer')

    // Cargar CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css'
    link.id = 'autodesk-viewer-css'
    document.head.appendChild(link)

    // Cargar JavaScript
    const script = document.createElement('script')
    script.src = 'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js'
    script.id = 'autodesk-viewer-js'
    script.async = true
    script.onload = () => {
      console.log('[ForgeViewer] Scripts cargados correctamente')
      setIsScriptLoaded(true)
    }
    script.onerror = () => {
      console.error('[ForgeViewer] Error cargando scripts de Autodesk')
      setError('Error cargando scripts del visor')
      setIsScriptLoaded(false)
    }
    document.head.appendChild(script)

    // NO REMOVER los scripts en el cleanup - dejarlos cargados para reutilizar
  }, [])

  // 2. Inicializar viewer cuando los scripts estén cargados
  useEffect(() => {
    if (!isScriptLoaded || !window.Autodesk || !viewerContainerRef.current || !urn) {
      return
    }

    const initializeViewer = async () => {
      try {
        console.log('[ForgeViewer] Inicializando viewer para URN:', urn)
        setIsLoading(true)
        setError(null)

        // Timeout de seguridad: si después de 30 segundos no carga, mostrar error
        const loadingTimeout = setTimeout(() => {
          console.error('[ForgeViewer] Timeout: la carga del modelo tomó más de 30 segundos')
          setError('La carga del modelo está tomando demasiado tiempo. Por favor, intenta recargar la página.')
          setIsLoading(false)
        }, 30000)

        // Obtener access token
        console.log('[ForgeViewer] Solicitando token de autenticación...')
        const tokenResponse = await fetch('/api/autodesk/token')
        if (!tokenResponse.ok) {
          clearTimeout(loadingTimeout)
          throw new Error('No se pudo obtener el token de autenticación')
        }
        const tokenData = await tokenResponse.json()
        const accessToken = tokenData.access_token
        console.log('[ForgeViewer] Token obtenido correctamente')

        // Función para obtener token (requerida por Autodesk Viewer)
        const getAccessToken = (callback: (token: string, expire: number) => void) => {
          console.log('[ForgeViewer] Autodesk Viewer solicitando token')
          callback(accessToken, tokenData.expires_in || 3599)
        }

        // Opciones del viewer
        const options = {
          env: 'AutodeskProduction2',
          api: 'streamingV2',
          getAccessToken
        }

        // Función para crear y cargar el viewer
        const createViewer = () => {
          if (!viewerContainerRef.current) return

          // Crear instancia del viewer
          const viewer = new window.Autodesk.Viewing.GuiViewer3D(viewerContainerRef.current)
          viewerRef.current = viewer

          // Iniciar viewer
          const startedCode = viewer.start()
          if (startedCode !== 0) {
            throw new Error('Error al iniciar el viewer')
          }

          console.log('[ForgeViewer] Viewer iniciado correctamente')

          // Cargar modelo
          const documentId = `urn:${urn}`
          window.Autodesk.Viewing.Document.load(
            documentId,
            (doc: any) => {
              // Documento cargado, obtener vista por defecto
              const defaultModel = doc.getRoot().getDefaultGeometry()
              if (!defaultModel) {
                setError('No se encontró geometría en el modelo')
                return
              }

              // Cargar vista en el viewer
              viewer.loadDocumentNode(doc, defaultModel).then(() => {
                console.log('[ForgeViewer] Modelo cargado correctamente')
                clearTimeout(loadingTimeout)

                // Habilitar extensiones
                viewer.loadExtension('Autodesk.Measure')

                setIsLoading(false)
                if (onLoadComplete) {
                  onLoadComplete()
                }
              }).catch((loadError: any) => {
                console.error('[ForgeViewer] Error cargando vista:', loadError)
                clearTimeout(loadingTimeout)
                setError('Error cargando la vista del modelo')
                setIsLoading(false)
                if (onLoadError) {
                  onLoadError(loadError)
                }
              })
            },
            (docError: any) => {
              console.error('[ForgeViewer] Error cargando documento:', docError)
              clearTimeout(loadingTimeout)
              setError('Error cargando el documento. Verifica que la traducción haya finalizado correctamente.')
              setIsLoading(false)
              if (onLoadError) {
                onLoadError(docError)
              }
            }
          )
        }

        // Función helper para inicializar Autodesk.Viewing
        const initAutodeskViewing = () => {
          if (!window.AutodeskViewingInitializationPromise) {
            console.log('[ForgeViewer] Inicializando Autodesk.Viewing por primera vez')

            window.AutodeskViewingInitializationPromise = new Promise<void>((resolve, reject) => {
              window.Autodesk.Viewing.Initializer(options, () => {
                console.log('[ForgeViewer] Autodesk.Viewing.Initializer callback ejecutado')
                window.AutodeskViewingInitialized = true
                resolve()
              })
            })
          }
          return window.AutodeskViewingInitializationPromise
        }

        // Esperar a que la inicialización complete antes de crear el viewer
        initAutodeskViewing().then(() => {
          console.log('[ForgeViewer] Autodesk.Viewing listo, creando viewer')
          // Asegurar que el componente todavía está montado
          if (viewerContainerRef.current) {
            createViewer()
          } else {
            console.warn('[ForgeViewer] Componente desmontado antes de crear viewer')
          }
        }).catch((err) => {
          console.error('[ForgeViewer] Error en inicialización de Autodesk.Viewing:', err)
          clearTimeout(loadingTimeout)
          setError('Error inicializando el visor de Autodesk')
          setIsLoading(false)
        })

      } catch (err: any) {
        console.error('[ForgeViewer] Error inicializando viewer:', err)
        setError(err.message || 'Error desconocido al inicializar el visor')
        setIsLoading(false)
        if (onLoadError) {
          onLoadError(err)
        }
      }
    }

    initializeViewer()

    // Cleanup: destruir viewer al desmontar
    return () => {
      if (viewerRef.current) {
        console.log('[ForgeViewer] Destruyendo viewer')
        try {
          // Descargar todas las extensiones (puede fallar si no están cargadas)
          try {
            viewerRef.current.unloadExtension('Autodesk.Measure')
          } catch (e) {
            // Ignorar si la extensión no estaba cargada
          }

          // Terminar el viewer correctamente
          viewerRef.current.finish()

          // Limpiar el contenedor del DOM
          if (viewerContainerRef.current) {
            viewerContainerRef.current.innerHTML = ''
          }
        } catch (err) {
          console.error('[ForgeViewer] Error destruyendo viewer:', err)
        } finally {
          viewerRef.current = null
        }
      }
      // NOTA: NO resetear window.AutodeskViewingInitialized aquí
      // porque queremos mantener la inicialización para futuros viewers
    }
  }, [isScriptLoaded, urn])

  // Renderizar UI
  return (
    <div className="relative w-full h-full">
      {/* Contenedor del viewer */}
      <div
        ref={viewerContainerRef}
        className="w-full h-full bg-slate-200"
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">Cargando modelo...</p>
            <p className="text-slate-300 text-sm mt-2">Esto puede tardar unos segundos</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-semibold text-lg">Error al cargar el modelo</h3>
            </div>
            <p className="text-slate-600 text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
