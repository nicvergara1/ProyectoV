'use server'

import { Resend } from 'resend'
import { createClient } from '@/utils/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactFormData {
  name: string
  email: string
  telefono?: string
  subject: string
  message: string
}

export async function sendContactEmail(formData: FormData) {
  try {
    const data: ContactFormData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      telefono: formData.get('telefono') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    }

    // Validaciones básicas
    if (!data.name || !data.email || !data.subject || !data.message) {
      return { success: false, error: 'Todos los campos son requeridos' }
    }

    if (!data.email.includes('@')) {
      return { success: false, error: 'Email inválido' }
    }

    // Validar que el mensaje tenga al menos 20 palabras
    const wordCount = data.message.trim().split(/\s+/).length
    if (wordCount < 20) {
      return { success: false, error: `El mensaje debe tener al menos 20 palabras. Actualmente tiene ${wordCount} palabra${wordCount !== 1 ? 's' : ''}.` }
    }

    // Guardar el mensaje en la base de datos
    const supabase = await createClient()

    // Verificar si el usuario ya envió un mensaje en los últimos 2 minutos
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString()
    const { data: recentMessages, error: checkError } = await supabase
      .from('mensajes_contacto')
      .select('created_at')
      .eq('email', data.email)
      .gte('created_at', twoMinutesAgo)
      .order('created_at', { ascending: false })
      .limit(1)

    if (checkError) {
      console.error('Error checking recent messages:', checkError)
    }

    if (recentMessages && recentMessages.length > 0) {
      const lastMessageTime = new Date(recentMessages[0].created_at)
      const now = new Date()
      const diffInSeconds = Math.ceil((lastMessageTime.getTime() + 2 * 60 * 1000 - now.getTime()) / 1000)
      const minutes = Math.floor(diffInSeconds / 60)
      const seconds = diffInSeconds % 60
      
      const timeMessage = minutes > 0 
        ? `${minutes} minuto${minutes !== 1 ? 's' : ''} y ${seconds} segundo${seconds !== 1 ? 's' : ''}`
        : `${seconds} segundo${seconds !== 1 ? 's' : ''}`

      return { 
        success: false, 
        error: `Por seguridad, debes esperar ${timeMessage} antes de enviar otro mensaje.` 
      }
    }
    const { data: savedMessage, error: dbError } = await supabase
      .from('mensajes_contacto')
      .insert({
        nombre: data.name,
        email: data.email,
        telefono: data.telefono,
        asunto: data.subject,
        mensaje: data.message,
        estado: 'nuevo'
      })
      .select()
      .single()

    if (dbError) {
      console.error('Error saving to database:', dbError)
      return { success: false, error: 'Error al guardar el mensaje. Por favor intenta nuevamente.' }
    }

    const messageId = savedMessage.id

    // Obtener el email del administrador desde la configuración
    const adminEmail = process.env.ADMIN_EMAIL || 'contacto@vergaraingenieria.cl'

    // Enviar email usando Resend con el ID en el asunto
    const { data: emailData, error } = await resend.emails.send({
      from: 'Vergara Ingeniería <onboarding@resend.dev>', // En producción usar tu dominio verificado
      to: adminEmail,
      replyTo: data.email, // Para poder responder directamente al cliente
      subject: `[Contacto Web] ${data.subject} #${messageId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Nuevo mensaje desde el sitio web</h2>
          <p style="color: #64748b; font-size: 14px; margin-top: -10px;">ID: #${messageId}</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Nombre:</strong> ${data.name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${data.email}</p>
            ${data.telefono ? `<p style="margin: 10px 0;"><strong>Teléfono:</strong> ${data.telefono}</p>` : ''}
            <p style="margin: 10px 0;"><strong>Asunto:</strong> ${data.subject}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #334155;">Mensaje:</h3>
            <p style="color: #475569; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
          
          <p style="color: #94a3b8; font-size: 12px;">
            Este mensaje fue enviado desde el formulario de contacto de vergaraingenieria.cl<br/>
            Mensaje ID: #${messageId}
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending email:', error)
      // Actualizar estado del mensaje en BD
      await supabase
        .from('mensajes_contacto')
        .update({ notas: `Error al enviar email: ${error.message}` })
        .eq('id', messageId)
      
      return { success: false, error: 'Error al enviar el mensaje. Por favor intenta nuevamente.' }
    }

    return { success: true, message: `¡Mensaje enviado correctamente! Referencia: #${messageId}. Te responderemos pronto.` }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Error inesperado. Por favor intenta más tarde.' }
  }
}
