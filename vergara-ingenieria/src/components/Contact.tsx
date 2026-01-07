'use client'

import { Mail, Phone, MapPin, Send, Linkedin, Instagram } from 'lucide-react'
import { useState, useRef } from 'react'
import { sendContactEmail } from '@/app/actions/contact'
import { motion } from 'framer-motion'

const contactInfo = [
  {
    icon: Phone,
    title: "Teléfono",
    detail: "+56 9 1234 5678",
    subdued: "Lunes a Viernes, 9:00 - 18:00",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Mail,
    title: "Email",
    detail: "contacto@vergaraingenieria.cl",
    subdued: "Consultas generales y cotizaciones",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: MapPin,
    title: "Ubicación",
    detail: "Av. Providencia 1234, Of. 505",
    subdued: "Santiago, Chile",
    gradient: "from-purple-500 to-pink-500"
  }
]

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
      formRef.current?.reset()
      setWordCount(0)
    } else {
      setMessage({ type: 'error', text: result.error || 'Error al enviar el mensaje' })
    }

    setTimeout(() => setMessage(null), 5000)
  }

  return (
    <section id="contacto" className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(139,92,246,0.05),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-semibold">
              Contáctanos
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            ¿Tienes un{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Proyecto
            </span>{" "}
            en Mente?
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Escríbenos y nuestro equipo te responderá a la brevedad.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl border border-slate-200 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">Información de Contacto</h3>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className={`bg-gradient-to-br ${info.gradient} p-3 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                      <info.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">{info.title}</h4>
                      <p className="text-slate-700 font-medium">{info.detail}</p>
                      <p className="text-sm text-slate-500 mt-1">{info.subdued}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl border border-blue-100"
            >
              <h4 className="font-semibold text-slate-900 mb-4">Síguenos en redes sociales</h4>
              <div className="flex gap-4">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-shadow"
                >
                  <Linkedin className="h-6 w-6" />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-shadow"
                >
                  <Instagram className="h-6 w-6" />
                </motion.a>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            ref={formRef}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-lg"
          >
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-800 border-2 border-green-200' : 'bg-red-50 text-red-800 border-2 border-red-200'}`}
              >
                {message.text}
              </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">Nombre</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  disabled={isPending}
                  className="w-full rounded-xl border-2 border-slate-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 text-slate-900 disabled:opacity-50 transition-all"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label htmlFor="telefono" className="block text-sm font-semibold text-slate-700 mb-2">Teléfono</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  disabled={isPending}
                  className="w-full rounded-xl border-2 border-slate-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 text-slate-900 disabled:opacity-50 transition-all"
                  placeholder="+56 9 1234 5678"
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^\d+]/g, '')
                    
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
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                disabled={isPending}
                className="w-full rounded-xl border-2 border-slate-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 text-slate-900 disabled:opacity-50 transition-all"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">Asunto</label>
              <select
                id="subject"
                name="subject"
                required
                disabled={isPending}
                className="w-full rounded-xl border-2 border-slate-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 text-slate-900 disabled:opacity-50 transition-all"
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
              <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                Mensaje <span className="text-slate-500 text-xs font-normal">(mínimo 20 palabras)</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                disabled={isPending}
                onChange={(e) => {
                  const words = e.target.value.trim().split(/\s+/).filter(word => word.length > 0)
                  setWordCount(words.length)
                }}
                className="w-full rounded-xl border-2 border-slate-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 text-slate-900 disabled:opacity-50 transition-all resize-none"
                placeholder="Cuéntanos más sobre tu proyecto o consulta..."
              ></textarea>
              <div className={`text-xs mt-2 font-medium ${wordCount < 20 ? 'text-orange-600' : 'text-green-600'}`}>
                {wordCount} / 20 palabras {wordCount < 20 && `(faltan ${20 - wordCount})`}
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isPending || wordCount < 20}
              whileHover={{ scale: isPending ? 1 : 1.02 }}
              whileTap={{ scale: isPending ? 1 : 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              <Send className={`h-5 w-5 ${isPending ? 'animate-pulse' : ''}`} />
              {isPending ? 'Enviando...' : 'Enviar Mensaje'}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
