import { Zap, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-bold">Vergara Ingeniería</span>
            </div>
            <p className="text-slate-400">
              Soluciones eléctricas integrales para empresas y particulares en todo Chile.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contacto@vergaraingenieria.cl</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+56 9 1234 5678</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Santiago, Chile</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-blue-400">Inicio</a></li>
              <li><a href="#servicios" className="hover:text-blue-400">Servicios</a></li>
              <li><a href="#nosotros" className="hover:text-blue-400">Nosotros</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-500">
          © {new Date().getFullYear()} Vergara Ingeniería. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
