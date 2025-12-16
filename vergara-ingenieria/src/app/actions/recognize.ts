'use server'

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function analyzeImage(formData: FormData) {
  const file = formData.get('image') as File
  
  if (!file) {
    return { success: false, error: 'No image provided' }
  }

  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')
    const mimeType = file.type || 'image/jpeg'

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "Identifica este objeto para un inventario de ingeniería/construcción. Devuelve SOLO un objeto JSON (sin markdown) con las siguientes propiedades: 'nombre' (nombre técnico corto), 'categoria' (elige estrictamente una de: 'Materiales Eléctricos', 'Herramientas', 'Insumos de Oficina', 'Equipos de Protección Personal (EPP)', 'Cables y Conductores', 'Iluminación', 'Ferretería', 'Otros'), y 'descripcion' (breve descripción técnica de 1 frase)." 
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ],
        },
      ],
      max_tokens: 300,
    });

    const content = response.choices[0].message.content
    
    if (!content) {
      throw new Error('No response from AI')
    }

    // Clean up markdown if present (e.g. ```json ... ```)
    const jsonString = content.replace(/```json/g, '').replace(/```/g, '').trim()
    const data = JSON.parse(jsonString)

    return {
      success: true,
      data: {
        nombre: data.nombre || "Objeto desconocido",
        categoria: data.categoria || "Otros",
        descripcion: data.descripcion || ""
      }
    }

  } catch (error) {
    console.error('Error analyzing image:', error)
    return { success: false, error: 'Error al procesar la imagen con IA' }
  }
}

export async function analyzeInvoice(formData: FormData) {
  const file = formData.get('image') as File
  
  if (!file) {
    return { success: false, error: 'No image provided' }
  }

  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    let content = ''

    if (file.type === 'application/pdf') {
      // For PDFs, extract text using unpdf (works in serverless environments)
      const { extractText } = await import('unpdf')
      const uint8Array = new Uint8Array(buffer)
      const { text } = await extractText(uint8Array)
      const pdfText = text
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Analiza el siguiente texto extraído de una factura o boleta chilena. Extrae los siguientes datos y devuélvelos en un objeto JSON (sin markdown): 'numero_factura' (number, solo dígitos), 'fecha_emision' (string formato YYYY-MM-DD), 'entidad' (string, nombre del proveedor), 'rut_entidad' (string), 'direccion_entidad' (string), 'monto_neto' (number), 'iva' (number), 'monto_total' (number), 'descripcion' (string, resumen breve de la compra).\n\nTexto de la factura:\n${pdfText}`
          },
        ],
        max_tokens: 500,
      });
      content = response.choices[0].message.content || ''
    } else {
      // Handle Image
      const base64Image = buffer.toString('base64')
      const mimeType = file.type || 'image/jpeg'

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: "Analiza esta imagen de una factura o boleta chilena. Extrae los siguientes datos y devuélvelos en un objeto JSON (sin markdown): 'numero_factura' (number, solo dígitos), 'fecha_emision' (string formato YYYY-MM-DD), 'entidad' (string, nombre del proveedor), 'rut_entidad' (string), 'direccion_entidad' (string), 'monto_neto' (number), 'iva' (number), 'monto_total' (number), 'descripcion' (string, resumen breve de la compra)." 
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`
                }
              }
            ],
          },
        ],
        max_tokens: 500,
      });
      content = response.choices[0].message.content || ''
    }
    
    if (!content) {
      throw new Error('No response from AI')
    }

    const jsonString = content.replace(/```json/g, '').replace(/```/g, '').trim()
    const data = JSON.parse(jsonString)

    return {
      success: true,
      data: {
        numero_factura: Number(data.numero_factura) || 0,
        fecha_emision: data.fecha_emision || new Date().toISOString().split('T')[0],
        entidad: data.entidad || "",
        rut_entidad: data.rut_entidad || "",
        direccion_entidad: data.direccion_entidad || "",
        monto_neto: Number(data.monto_neto) || 0,
        iva: Number(data.iva) || 0,
        monto_total: Number(data.monto_total) || 0,
        descripcion: data.descripcion || ""
      }
    }

  } catch (error) {
    console.error('Error analyzing invoice:', error)
    return { success: false, error: 'Error al procesar la factura con IA' }
  }
}
