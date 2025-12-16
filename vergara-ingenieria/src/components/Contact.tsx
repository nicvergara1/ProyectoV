'use client'

import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { useState, useRef } from 'react'
import { sendContactEmail } from '@/app/actions/contact'

export function Contact() {
  const [isPending, setIsPending] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [wordCount, setWordCount] = useState(0)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const result = await sendContactEmail(formData)

    setIsPending(false)

    if (result.success) {
      setMessage({ type: 'success', text: result.message || '¡Mensaje enviado!' })
      // Limpiar formulario usando la referencia
      formRef.current?.reset()
    } else {
      setMessage({ type: 'error', text: result.error || 'Error al enviar el mensaje' })
    }

    // Ocultar mensaje después de 5 segundos
    setTimeout(() => setMessage(null), 5000)
  }

  return (
    <section id="contacto" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Contáctanos</h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            ¿Tienes un proyecto en mente? Escríbenos y nuestro equipo te responderá a la brevedad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Información de Contacto</h3>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Teléfono</h4>
                  <p className="text-slate-600">+56 9 1234 5678</p>
                  <p className="text-sm text-slate-500">Lunes a Viernes, 9:00 - 18:00</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Email</h4>
                  <p className="text-slate-600">contacto@vergaraingenieria.cl</p>
                  <p className="text-sm text-slate-500">Consultas generales y cotizaciones</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Ubicación</h4>
                  <p className="text-slate-600">Av. Providencia 1234, Of. 505</p>
                  <p className="text-slate-600">Santiago, Chile</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-4">Síguenos en redes sociales</h4>
              <div className="flex gap-4">
                {/* Social placeholders */}
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
                  <span className="font-bold">in</span>
                </div>
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
                  <span className="font-bold">ig</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {message.text}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  disabled={isPending}
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-slate-900 disabled:opacity-50"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  disabled={isPending}
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-slate-900 disabled:opacity-50"
                  placeholder="+56 9 1234 5678"
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^\d+]/g, '')
                    
                    // Formato chileno: +56 9 XXXX XXXX
                    if (value.startsWith('569') && value.length > 3) {
                      const numbers = value.substring(3)
                      if (numbers.length <= 4) {
                        value = `+56 9 ${numbers}`
                      } else {
                        value = `+56 9 ${numbers.substring(0, 4)} ${numbers.substring(4, 8)}`
                      }
                    } else if (value.startsWith('56') && !value.startsWith('569')) {
                      value = '+56 ' + value.substring(2)
                    } else if (value.startsWith('9') && value.length > 1) {
                      const numbers = value.substring(1)
                      if (numbers.length <= 4) {
                        value = `+56 9 ${numbers}`
                      } else {
                        value = `+56 9 ${numbers.substring(0, 4)} ${numbers.substring(4, 8)}`
                      }
                    }
                    
                    e.target.value = value
                  }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                disabled={isPending}
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-slate-900 disabled:opacity-50"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">Asunto</label>
              <select
                id="subject"
                name="subject"
                required
                disabled={isPending}
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-slate-900 disabled:opacity-50"
              >
                <option value="">Selecciona un asunto</option>
                <option value="Instalaciones Eléctricas">Instalaciones Eléctricas</option>
                <option value="Mantención y Reparación">Mantención y Reparación</option>
                <option value="Automatización Industrial">Automatización Industrial</option>
                <option value="Proyectos Residenciales">Proyectos Residenciales</option>
                <option value="Proyectos Comerciales">Proyectos Comerciales</option>
                <option value="Certificaciones y Cumplimiento">Certificaciones y Cumplimiento</option>
                <option value="Cotización">Cotización</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                Mensaje <span className="text-slate-500 text-xs">(mínimo 20 palabras)</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                disabled={isPending}
                onChange={(e) => {
                  const words = e.target.value.trim().split(/\s+/).filter(word => word.length > 0)
                  setWordCount(words.length)
                }}
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-slate-900 disabled:opacity-50"
                placeholder="Cuéntanos más sobre tu proyecto o consulta... (mínimo 20 palabras)"
              ></textarea>
              <div className={`text-xs mt-1 ${wordCount < 20 ? 'text-orange-600' : 'text-green-600'}`}>
                {wordCount} / 20 palabras {wordCount < 20 && '(faltan ' + (20 - wordCount) + ')'}
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className={`h-4 w-4 ${isPending ? 'animate-pulse' : ''}`} />
              {isPending ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
