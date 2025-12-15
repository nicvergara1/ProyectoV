import Link from 'next/link'

export function Hero() {
  return (
    <div className="bg-slate-900 text-white py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Ingeniería Eléctrica de <span className="text-blue-500">Excelencia</span>
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Desarrollamos proyectos eléctricos innovadores y seguros para impulsar el crecimiento de su empresa.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="#contacto" className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors">
            Cotizar Proyecto
          </Link>
          <Link href="#servicios" className="bg-transparent border border-white text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-white/10 transition-colors">
            Nuestros Servicios
          </Link>
        </div>
      </div>
    </div>
  )
}
