'use client'

import Link from 'next/link'
import { Zap, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Zap className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">Vergara Ingeniería</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-slate-600 hover:text-blue-600 transition-colors">Inicio</Link>
            <Link href="#servicios" className="text-slate-600 hover:text-blue-600 transition-colors">Servicios</Link>
            <Link href="#nosotros" className="text-slate-600 hover:text-blue-600 transition-colors">Nosotros</Link>
            <Link href="#contacto" className="text-slate-600 hover:text-blue-600 transition-colors">Contacto</Link>
            <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Panel Administrador
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/" 
              className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Inicio
            </Link>
            <Link 
              href="#servicios" 
              className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Servicios
            </Link>
            <Link 
              href="#nosotros" 
              className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Nosotros
            </Link>
            <Link 
              href="#contacto" 
              className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Contacto
            </Link>
            <Link 
              href="/login" 
              className="block px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Panel Administrador
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
