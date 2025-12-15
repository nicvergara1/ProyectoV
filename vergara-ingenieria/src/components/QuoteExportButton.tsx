'use client'

import { Download } from 'lucide-react'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { Quote } from '@/types'

interface QuoteExportButtonProps {
  quote: Quote
}

export function QuoteExportButton({ quote }: QuoteExportButtonProps) {
  const handleExport = async () => {
    if (!quote.items) return

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Cotización')

    // Define columns
    worksheet.columns = [
      { header: 'Descripción', key: 'descripcion', width: 40 },
      { header: 'Cantidad', key: 'cantidad', width: 15 },
      { header: 'Precio Unitario', key: 'precio_unitario', width: 20 },
      { header: 'Total', key: 'total', width: 20 },
    ]

    // Style header row
    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2563EB' } // Blue-600
    }
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' }

    // Add data rows
    quote.items.forEach(item => {
      const row = worksheet.addRow({
        descripcion: item.descripcion,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        total: item.cantidad * item.precio_unitario
      })

      // Format currency cells
      row.getCell('precio_unitario').numFmt = '"$"#,##0'
      row.getCell('total').numFmt = '"$"#,##0'
      
      // Center quantity
      row.getCell('cantidad').alignment = { horizontal: 'center' }
    })

    // Add empty row
    worksheet.addRow({})

    // Add total row
    const totalRow = worksheet.addRow({
      descripcion: 'TOTAL',
      total: quote.monto_total
    })

    // Style total row
    totalRow.font = { bold: true }
    totalRow.getCell('total').numFmt = '"$"#,##0'
    totalRow.getCell('total').font = { bold: true, size: 12 }
    
    // Add borders to all cells
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      })
    })

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer()
    
    // Save file
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(blob, `Cotizacion_${quote.cliente_nombre}_${quote.proyecto_nombre}.xlsx`)
  }

  return (
    <button 
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
    >
      <Download className="h-4 w-4" />
      <span>Exportar Excel</span>
    </button>
  )
}
