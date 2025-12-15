import { Mail, Phone, MapPin, Send } from 'lucide-react'

export function Contact() {
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
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                <input
                  type="text"
                  id="name"
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-slate-900"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-slate-900"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">Asunto</label>
              <input
                type="text"
                id="subject"
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-slate-900"
                placeholder="Consulta sobre proyecto..."
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Mensaje</label>
              <textarea
                id="message"
                rows={4}
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-slate-900"
                placeholder="Cuéntanos más sobre tu proyecto..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              <Send className="h-4 w-4" />
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
