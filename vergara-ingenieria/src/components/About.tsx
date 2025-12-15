import { CheckCircle2, Users, Award, Clock } from 'lucide-react'

export function About() {
  return (
    <section id="nosotros" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Sobre Nosotros</h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Somos una empresa líder en soluciones de ingeniería eléctrica, comprometidos con la excelencia y la innovación en cada proyecto.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-slate-900">
              Experiencia y Profesionalismo a su Servicio
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              En Vergara Ingeniería, combinamos años de experiencia técnica con las últimas tecnologías del sector para entregar resultados superiores. Nuestro equipo de ingenieros certificados trabaja incansablemente para garantizar la seguridad y eficiencia de sus instalaciones.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900">Calidad Certificada</h4>
                  <p className="text-sm text-slate-600">Cumplimos con todas las normativas SEC vigentes.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-6 w-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900">Equipo Experto</h4>
                  <p className="text-sm text-slate-600">Profesionales altamente capacitados.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="h-6 w-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900">Garantía Total</h4>
                  <p className="text-sm text-slate-600">Respaldo completo en todos nuestros trabajos.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-6 w-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900">Puntualidad</h4>
                  <p className="text-sm text-slate-600">Compromiso con los plazos acordados.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-video bg-slate-200 rounded-2xl overflow-hidden shadow-xl">
              {/* Placeholder for an image - in a real project use next/image */}
              <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                <Users className="h-20 w-20 text-slate-400" />
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-blue-600 p-6 rounded-xl shadow-lg hidden md:block">
              <p className="text-4xl font-bold text-white">10+</p>
              <p className="text-blue-100 font-medium">Años de Experiencia</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
