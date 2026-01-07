"use client"

import { CheckCircle2, Users, Award, Clock, Zap, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import { BentoCard } from '@/components/ui/bento-card'

const features = [
  {
    title: "Calidad Certificada",
    description: "Cumplimos con todas las normativas SEC vigentes.",
    icon: CheckCircle2,
    gradient: "from-green-500 to-emerald-500"
  },
  {
    title: "Equipo Experto",
    description: "Profesionales altamente capacitados.",
    icon: Users,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "Garantía Total",
    description: "Respaldo completo en todos nuestros trabajos.",
    icon: Award,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "Puntualidad",
    description: "Compromiso con los plazos acordados.",
    icon: Clock,
    gradient: "from-orange-500 to-red-500"
  }
]

export function About() {
  return (
    <section id="nosotros" className="py-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(59,130,246,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(139,92,246,0.05),transparent_50%)]" />
      
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
              Sobre Nosotros
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Experiencia y{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Profesionalismo
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Somos una empresa líder en soluciones de ingeniería eléctrica, comprometidos con la excelencia y la innovación en cada proyecto.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
              Transformando la Energía en{" "}
              <span className="text-blue-600">Soluciones</span>
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              En Vergara Ingeniería, combinamos años de experiencia técnica con las últimas tecnologías del sector para entregar resultados superiores. Nuestro equipo de ingenieros certificados trabaja incansablemente para garantizar la seguridad y eficiencia de sus instalaciones.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100"
              >
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">Alta Tecnología</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full border border-purple-100"
              >
                <Target className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-semibold text-purple-900">Resultados Garantizados</span>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-video bg-gradient-to-br from-blue-100 via-purple-50 to-cyan-100 rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
              {/* Placeholder with animated gradient */}
              <div className="w-full h-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 flex items-center justify-center relative">
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10"
                />
                <Users className="h-24 w-24 text-slate-400 relative z-10" />
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-6 -left-6 bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl shadow-2xl hidden md:block border border-blue-500"
            >
              <p className="text-4xl font-bold text-white mb-1">10+</p>
              <p className="text-blue-100 font-medium">Años de Experiencia</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <BentoCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              gradient={feature.gradient}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
