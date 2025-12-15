import { Lightbulb, Shield, Zap, BarChart } from 'lucide-react'

const services = [
  {
    title: "Proyectos Eléctricos",
    description: "Diseño y ejecución de instalaciones eléctricas industriales y domiciliarias.",
    icon: Zap
  },
  {
    title: "Mantenimiento",
    description: "Planes de mantenimiento preventivo y correctivo para asegurar la continuidad operativa.",
    icon: Shield
  },
  {
    title: "Eficiencia Energética",
    description: "Estudios y soluciones para optimizar el consumo y reducir costos.",
    icon: Lightbulb
  },
  {
    title: "Consultoría",
    description: "Asesoría técnica especializada y regularización de instalaciones.",
    icon: BarChart
  }
]

export function Services() {
  return (
    <section id="servicios" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Nuestros Servicios</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Ofrecemos un amplio rango de soluciones adaptadas a las necesidades de cada cliente.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <service.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{service.title}</h3>
              <p className="text-slate-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
