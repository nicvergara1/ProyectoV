'use client'

import { FileText } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Invoice } from '@/types'

interface InvoicePDFButtonProps {
  invoice: Invoice
}

export function InvoicePDFButton({ invoice }: InvoicePDFButtonProps) {
  const generatePDF = () => {
    const doc = new jsPDF()

    // --- Header ---
    // Company Info (Left)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('VERGARA INGENIERÍA', 20, 20)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Servicios de Ingeniería y Construcción', 20, 26)
    doc.text('Casa Matriz: Av. Providencia 1234, Santiago', 20, 32)
    doc.text('Fono: +56 9 1234 5678', 20, 38)
    doc.text('Email: contacto@vergaraingenieria.cl', 20, 44)

    // SII Box (Right)
    doc.setDrawColor(255, 0, 0) // Red border
    doc.setLineWidth(1)
    doc.rect(130, 15, 60, 25)
    
    doc.setTextColor(255, 0, 0) // Red text
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('R.U.T.: 76.123.456-7', 160, 22, { align: 'center' })
    doc.text('FACTURA ELECTRÓNICA', 160, 29, { align: 'center' })
    doc.text(`Nº ${invoice.numero_factura}`, 160, 36, { align: 'center' })
    
    doc.setTextColor(0, 0, 0) // Reset to black

    // --- Client Info ---
    doc.setDrawColor(0, 0, 0)
    doc.setLineWidth(0.1)
    doc.rect(15, 55, 180, 35) // Box for client info

    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    
    // Row 1
    doc.text('Señor(es):', 20, 65)
    doc.setFont('helvetica', 'normal')
    doc.text(invoice.entidad, 50, 65)
    
    doc.setFont('helvetica', 'bold')
    doc.text('Fecha Emisión:', 120, 65)
    doc.setFont('helvetica', 'normal')
    doc.text(new Date(invoice.fecha_emision).toLocaleDateString('es-CL'), 150, 65)

    // Row 2
    doc.setFont('helvetica', 'bold')
    doc.text('R.U.T.:', 20, 72)
    doc.setFont('helvetica', 'normal')
    doc.text(invoice.rut_entidad || 'Sin Información', 50, 72)

    doc.setFont('helvetica', 'bold')
    doc.text('Giro:', 120, 72)
    doc.setFont('helvetica', 'normal')
    doc.text(invoice.servicio || 'Servicio', 150, 72)

    // Row 3
    doc.setFont('helvetica', 'bold')
    doc.text('Dirección:', 20, 79)
    doc.setFont('helvetica', 'normal')
    doc.text(invoice.direccion_entidad || 'Sin Información', 50, 79)

    doc.setFont('helvetica', 'bold')
    doc.text('Comuna:', 120, 79)
    doc.setFont('helvetica', 'normal')
    doc.text('Santiago', 150, 79)

    // --- Details Table ---
    const tableBody = [
      [
        invoice.servicio || 'Servicios Profesionales', // Item Name
        invoice.descripcion || 'Sin descripción', // Description
        1, // Quantity (Hardcoded as 1 for now)
        `$${invoice.monto_neto.toLocaleString('es-CL')}`, // Unit Price
        `$${invoice.monto_neto.toLocaleString('es-CL')}` // Total
      ]
    ]

    autoTable(doc, {
      startY: 100,
      head: [['Item', 'Descripción', 'Cant.', 'Precio Unit.', 'Total']],
      body: tableBody,
      theme: 'plain',
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold', lineWidth: 0.1, lineColor: 200 },
      bodyStyles: { lineWidth: 0.1, lineColor: 200 },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 15, halign: 'center' },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 30, halign: 'right' }
      }
    })

    // --- Totals ---
    const finalY = (doc as any).lastAutoTable.finalY + 10
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    
    // Box for totals
    doc.rect(130, finalY, 65, 25)
    
    doc.text('Monto Neto:', 135, finalY + 6)
    doc.text(`$${invoice.monto_neto.toLocaleString('es-CL')}`, 190, finalY + 6, { align: 'right' })
    
    doc.text('I.V.A. (19%):', 135, finalY + 13)
    doc.text(`$${invoice.iva.toLocaleString('es-CL')}`, 190, finalY + 13, { align: 'right' })
    
    doc.text('Total:', 135, finalY + 20)
    doc.text(`$${invoice.monto_total.toLocaleString('es-CL')}`, 190, finalY + 20, { align: 'right' })

    // Footer / Timbre placeholder
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Timbre Electrónico SII', 105, 250, { align: 'center' })
    doc.text('Res. 80 de 2014 Verifique documento: www.sii.cl', 105, 255, { align: 'center' })
    
    // Save
    doc.save(`Factura_${invoice.numero_factura}.pdf`)
  }

  return (
    <button
      onClick={generatePDF}
      className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
      title="Descargar PDF"
    >
      <FileText className="h-4 w-4" />
    </button>
  )
}
