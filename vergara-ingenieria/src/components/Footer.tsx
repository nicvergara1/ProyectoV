"use client"

import { Zap, Mail, Phone, MapPin, Linkedin, Instagram, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const footerLinks = [
  { name: 'Inicio', href: '#' },
  { name: 'Servicios', href: '#servicios' },
  { name: 'Nosotros', href: '#nosotros' },
  { name: 'Contacto', href: '#contacto' },
]

const socialLinks = [
  { icon: Linkedin, href: '#', color: 'from-blue-600 to-blue-700' },
  { icon: Instagram, href: '#', color: 'from-pink-600 to-purple-700' },
]

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Vergara Ingeniería
              </span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed max-w-md">
              Soluciones eléctricas integrales para empresas y particulares en todo Chile. 
              Innovación, calidad y compromiso en cada proyecto.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 bg-gradient-to-br ${social.color} rounded-lg flex items-center justify-center hover:shadow-lg transition-shadow`}
                >
                  <social.icon className="h-5 w-5 text-white" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white">Contacto</h3>
            <div className="space-y-3 text-slate-400">
              <motion.a
                href="mailto:contacto@vergaraingenieria.cl"
                whileHover={{ x: 5 }}
                className="flex items-center gap-2 hover:text-blue-400 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span className="text-sm">contacto@vergaraingenieria.cl</span>
              </motion.a>
              <motion.a
                href="tel:+56912345678"
                whileHover={{ x: 5 }}
                className="flex items-center gap-2 hover:text-blue-400 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span className="text-sm">+56 9 1234 5678</span>
              </motion.a>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Santiago, Chile</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              {footerLinks.map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }}>
                  <Link 
                    href={link.href}
                    className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1 text-sm group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Vergara Ingeniería. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm text-slate-500">
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                className="hover:text-blue-400 transition-colors"
              >
                Privacidad
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                className="hover:text-blue-400 transition-colors"
              >
                Términos
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
