'use client';

import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { jsPDF } from 'jspdf';
import { Download, Save, Trash2, Grid, ZoomIn, ZoomOut, Undo, Redo } from 'lucide-react';

interface DiagramEditorProps {
  initialData?: any;
  onSave?: (data: any) => void;
  title?: string;
}

// Biblioteca de símbolos eléctricos SVG
const ELECTRICAL_SYMBOLS = {
  enchufe10A: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <circle cx="25" cy="25" r="20" fill="none" stroke="black" stroke-width="2"/>
    <line x1="20" y1="15" x2="20" y2="25" stroke="black" stroke-width="2"/>
    <line x1="30" y1="15" x2="30" y2="25" stroke="black" stroke-width="2"/>
    <line x1="25" y1="30" x2="25" y2="35" stroke="black" stroke-width="2"/>
  </svg>`,
  
  interruptorSimple: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <circle cx="25" cy="25" r="20" fill="none" stroke="black" stroke-width="2"/>
    <line x1="25" y1="15" x2="25" y2="35" stroke="black" stroke-width="2"/>
    <line x1="15" y1="25" x2="25" y2="15" stroke="black" stroke-width="2"/>
  </svg>`,
  
  luminaria: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <circle cx="25" cy="25" r="20" fill="none" stroke="black" stroke-width="2"/>
    <line x1="15" y1="15" x2="35" y2="35" stroke="black" stroke-width="2"/>
    <line x1="35" y1="15" x2="15" y2="35" stroke="black" stroke-width="2"/>
  </svg>`,
  
  tablero: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="30" height="30" fill="none" stroke="black" stroke-width="2"/>
    <line x1="10" y1="25" x2="40" y2="25" stroke="black" stroke-width="2"/>
    <line x1="25" y1="10" x2="25" y2="40" stroke="black" stroke-width="2"/>
  </svg>`,
  
  cajaDerivacion: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="15" width="20" height="20" fill="none" stroke="black" stroke-width="2"/>
    <line x1="25" y1="15" x2="25" y2="10" stroke="black" stroke-width="2"/>
    <line x1="25" y1="35" x2="25" y2="40" stroke="black" stroke-width="2"/>
    <line x1="15" y1="25" x2="10" y2="25" stroke="black" stroke-width="2"/>
    <line x1="35" y1="25" x2="40" y2="25" stroke="black" stroke-width="2"/>
  </svg>`,
};

export default function DiagramEditor({ initialData, onSave, title = 'Nuevo Diagrama' }: DiagramEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [showGrid, setShowGrid] = useState(true);

  // Inicializar canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      selection: true,
    });

    // Grid
    if (showGrid) {
      const gridSize = 20;
      for (let i = 0; i < 800 / gridSize; i++) {
        fabricCanvas.add(new fabric.Line([i * gridSize, 0, i * gridSize, 600], {
          stroke: '#e5e7eb',
          strokeWidth: 1,
          selectable: false,
          evented: false,
        }));
        fabricCanvas.add(new fabric.Line([0, i * gridSize, 800, i * gridSize], {
          stroke: '#e5e7eb',
          strokeWidth: 1,
          selectable: false,
          evented: false,
        }));
      }
    }

    // Cargar datos iniciales si existen
    if (initialData) {
      fabricCanvas.loadFromJSON(initialData, () => {
        fabricCanvas.renderAll();
      });
    }

    // Guardar estado inicial
    saveState(fabricCanvas);

    // Event listeners para history
    fabricCanvas.on('object:added', () => saveState(fabricCanvas));
    fabricCanvas.on('object:modified', () => saveState(fabricCanvas));
    fabricCanvas.on('object:removed', () => saveState(fabricCanvas));

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  const saveState = (canvas: fabric.Canvas) => {
    const json = JSON.stringify(canvas.toJSON());
    setHistory(prev => {
      const newHistory = prev.slice(0, historyStep + 1);
      newHistory.push(json);
      return newHistory;
    });
    setHistoryStep(prev => prev + 1);
  };

  const undo = () => {
    if (historyStep > 0 && canvas) {
      const prevState = history[historyStep - 1];
      canvas.loadFromJSON(prevState, () => {
        canvas.renderAll();
        setHistoryStep(prev => prev - 1);
      });
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1 && canvas) {
      const nextState = history[historyStep + 1];
      canvas.loadFromJSON(nextState, () => {
        canvas.renderAll();
        setHistoryStep(prev => prev + 1);
      });
    }
  };

  const addSymbol = (symbolKey: keyof typeof ELECTRICAL_SYMBOLS) => {
    if (!canvas) return;

    const svgString = ELECTRICAL_SYMBOLS[symbolKey];
    
    fabric.loadSVGFromString(svgString).then((result: any) => {
      const objects = result.objects;
      
      // Crear un grupo con todos los objetos del SVG
      const group = new fabric.Group(objects, {
        left: 100,
        top: 100,
        scaleX: 1,
        scaleY: 1,
      });
      
      canvas.add(group);
      canvas.setActiveObject(group);
      canvas.renderAll();
    }).catch((error: any) => {
      console.error('Error loading SVG:', error);
    });
  };

  const addLine = () => {
    if (!canvas) return;

    const line = new fabric.Line([50, 50, 150, 50], {
      stroke: 'black',
      strokeWidth: 2,
      selectable: true,
    });
    canvas.add(line);
    canvas.setActiveObject(line);
  };

  const addText = () => {
    if (!canvas) return;

    const text = new fabric.IText('Texto', {
      left: 100,
      top: 100,
      fontSize: 16,
      fill: 'black',
    });
    canvas.add(text);
    canvas.setActiveObject(text);
  };

  const addRectangle = () => {
    if (!canvas) return;

    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 80,
      fill: 'transparent',
      stroke: 'black',
      strokeWidth: 2,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
  };

  const deleteSelected = () => {
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length) {
      activeObjects.forEach((obj: any) => canvas.remove(obj));
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  };

  const zoomIn = () => {
    if (!canvas) return;
    const zoom = canvas.getZoom();
    canvas.setZoom(zoom * 1.1);
  };

  const zoomOut = () => {
    if (!canvas) return;
    const zoom = canvas.getZoom();
    canvas.setZoom(zoom / 1.1);
  };

  const handleSave = () => {
    if (!canvas || !onSave) return;

    const json = canvas.toJSON();
    onSave(json);
  };

  const exportToPDF = () => {
    if (!canvas) return;

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [800, 600],
    });

    const imgData = canvas.toDataURL({ 
      format: 'png',
      multiplier: 1
    });
    pdf.addImage(imgData, 'PNG', 0, 0, 800, 600);
    pdf.save(`${title}.pdf`);
  };

  const clearCanvas = () => {
    if (!canvas) return;
    if (confirm('¿Estás seguro de limpiar el canvas?')) {
      canvas.clear();
      canvas.backgroundColor = '#ffffff';
      canvas.renderAll();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-slate-900">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={historyStep <= 0}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded disabled:opacity-50"
            title="Deshacer"
          >
            <Undo className="w-5 h-5" />
          </button>
          <button
            onClick={redo}
            disabled={historyStep >= history.length - 1}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded disabled:opacity-50"
            title="Rehacer"
          >
            <Redo className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-slate-300 mx-2"></div>
          <button
            onClick={zoomIn}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded"
            title="Acercar"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={zoomOut}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded"
            title="Alejar"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded ${showGrid ? 'bg-blue-100 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}
            title="Cuadrícula"
          >
            <Grid className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-slate-300 mx-2"></div>
          {onSave && (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Save className="w-4 h-4" />
              Guardar
            </button>
          )}
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Toolbar lateral */}
        <div className="w-64 bg-white border-r border-slate-200 p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* Símbolos eléctricos */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Símbolos Eléctricos</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => addSymbol('enchufe10A')}
                  className="p-3 border border-slate-300 rounded hover:bg-slate-50 flex flex-col items-center gap-1"
                >
                  <div dangerouslySetInnerHTML={{ __html: ELECTRICAL_SYMBOLS.enchufe10A }} className="w-12 h-12" />
                  <span className="text-xs text-slate-600">Enchufe 10A</span>
                </button>
                <button
                  onClick={() => addSymbol('interruptorSimple')}
                  className="p-3 border border-slate-300 rounded hover:bg-slate-50 flex flex-col items-center gap-1"
                >
                  <div dangerouslySetInnerHTML={{ __html: ELECTRICAL_SYMBOLS.interruptorSimple }} className="w-12 h-12" />
                  <span className="text-xs text-slate-600">Interruptor</span>
                </button>
                <button
                  onClick={() => addSymbol('luminaria')}
                  className="p-3 border border-slate-300 rounded hover:bg-slate-50 flex flex-col items-center gap-1"
                >
                  <div dangerouslySetInnerHTML={{ __html: ELECTRICAL_SYMBOLS.luminaria }} className="w-12 h-12" />
                  <span className="text-xs text-slate-600">Luminaria</span>
                </button>
                <button
                  onClick={() => addSymbol('tablero')}
                  className="p-3 border border-slate-300 rounded hover:bg-slate-50 flex flex-col items-center gap-1"
                >
                  <div dangerouslySetInnerHTML={{ __html: ELECTRICAL_SYMBOLS.tablero }} className="w-12 h-12" />
                  <span className="text-xs text-slate-600">Tablero</span>
                </button>
                <button
                  onClick={() => addSymbol('cajaDerivacion')}
                  className="p-3 border border-slate-300 rounded hover:bg-slate-50 flex flex-col items-center gap-1"
                >
                  <div dangerouslySetInnerHTML={{ __html: ELECTRICAL_SYMBOLS.cajaDerivacion }} className="w-12 h-12" />
                  <span className="text-xs text-slate-600">Caja Deriv.</span>
                </button>
              </div>
            </div>

            {/* Herramientas de dibujo */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Herramientas</h3>
              <div className="space-y-2">
                <button
                  onClick={addLine}
                  className="w-full p-2 border border-slate-300 rounded hover:bg-slate-50 text-sm text-left"
                >
                  ➖ Línea (Conductor)
                </button>
                <button
                  onClick={addRectangle}
                  className="w-full p-2 border border-slate-300 rounded hover:bg-slate-50 text-sm text-left"
                >
                  ▭ Rectángulo (Ambiente)
                </button>
                <button
                  onClick={addText}
                  className="w-full p-2 border border-slate-300 rounded hover:bg-slate-50 text-sm text-left"
                >
                  T Texto
                </button>
              </div>
            </div>

            {/* Acciones */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Acciones</h3>
              <div className="space-y-2">
                <button
                  onClick={deleteSelected}
                  className="w-full flex items-center gap-2 p-2 border border-red-300 rounded hover:bg-red-50 text-sm text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar Selección
                </button>
                <button
                  onClick={clearCanvas}
                  className="w-full p-2 border border-slate-300 rounded hover:bg-slate-50 text-sm"
                >
                  Limpiar Todo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
          <div className="bg-white shadow-lg">
            <canvas ref={canvasRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
