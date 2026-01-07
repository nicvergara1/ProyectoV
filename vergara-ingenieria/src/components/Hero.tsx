"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { AnimatedGradient } from '@/components/ui/animated-gradient'
import { Sparkles } from '@/components/ui/sparkles'
import { AnimatedText } from '@/components/ui/animated-text'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { FloatingIcons } from '@/components/ui/floating-icons'
import { ChevronRight, Zap } from 'lucide-react'

export function Hero() {
  return (
    <AnimatedGradient className="text-white py-20 md:py-32 lg:py-40 relative">
      {/* Floating background elements */}
      <Sparkles />
      <FloatingIcons />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Badge animado */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm"
          >
            <Zap className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-200">
              Innovación en Ingeniería Eléctrica
            </span>
          </motion.div>

          {/* Título principal animado */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <AnimatedText 
              text="Ingeniería Eléctrica de" 
              className="text-white"
            />
            <br />
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="inline-block bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent"
            >
              Excelencia
            </motion.span>
          </h1>

          {/* Subtítulo animado */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Desarrollamos proyectos eléctricos{" "}
            <span className="text-blue-400 font-semibold">innovadores y seguros</span>{" "}
            para impulsar el crecimiento de su empresa
          </motion.p>

          {/* Botones con animación */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4 items-center"
          >
            <Link href="#contacto">
              <ShimmerButton className="group">
                Cotizar Proyecto
                <ChevronRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </ShimmerButton>
            </Link>
            
            <Link href="#servicios">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-lg text-lg font-semibold transition-all border-2 border-white/20 hover:border-white/40 hover:bg-white/5 backdrop-blur-sm"
              >
                Nuestros Servicios
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats animados */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { value: "10+", label: "Años de Experiencia" },
              { value: "500+", label: "Proyectos Completados" },
              { value: "98%", label: "Clientes Satisfechos" },
              { value: "24/7", label: "Soporte Técnico" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </AnimatedGradient>
  )
}
