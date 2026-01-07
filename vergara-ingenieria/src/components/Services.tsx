"use client"

import { Lightbulb, Shield, Zap, BarChart } from 'lucide-react'
import { motion } from 'framer-motion'

const services = [
  {
    title: "Proyectos Eléctricos",
    description: "Diseño y ejecución de instalaciones eléctricas industriales y domiciliarias.",
    icon: Zap,
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    title: "Mantenimiento",
    description: "Planes de mantenimiento preventivo y correctivo para asegurar la continuidad operativa.",
    icon: Shield,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    title: "Eficiencia Energética",
    description: "Estudios y soluciones para optimizar el consumo y reducir costos.",
    icon: Lightbulb,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Consultoría",
    description: "Asesoría técnica especializada y regularización de instalaciones.",
    icon: BarChart,
    gradient: "from-purple-500 to-pink-500",
  }
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function Services() {
  return (
    <section id="servicios" className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.05),transparent_50%)]" />
      
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
            <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
              Nuestros Servicios
            </span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Soluciones Eléctricas{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Integrales
            </span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Ofrecemos un amplio rango de soluciones adaptadas a las necesidades de cada cliente.
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-300"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className={`w-14 h-14 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center mb-5 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <service.icon className="h-7 w-7 text-white" strokeWidth={2} />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed">
                  {service.description}
                </p>

                {/* Decorative line */}
                <div className={`mt-4 h-1 w-0 bg-gradient-to-r ${service.gradient} rounded-full group-hover:w-full transition-all duration-500`} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
