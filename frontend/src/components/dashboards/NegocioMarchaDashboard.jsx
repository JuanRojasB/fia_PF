import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, Factory, ShoppingCart, Award, Users, Leaf } from 'lucide-react';

export default function NegocioMarchaDashboard() {
  const sections = [
    {
      id: 1,
      icon: TrendingUp,
      title: 'Rentabilidad y Mercado 2024',
      color: 'from-green-500 to-green-600',
      content: [
        'Durante el año 2024, el mercado de oferta y demanda generó mejores precios de ventas atípicos lo que generó rentabilidad no vista en años anteriores.',
        'Las materias primas tuvieron tendencia a la baja con relación a los años 2023 y 2022, este comportamiento se marcó más en el segundo semestre que en el primero.',
        'Se ha venido trabajando en una intensa revisión de procesos de control con niveles de autorizaciones escalonados para la proveeduría de bienes y servicios dada por el cambio en la Gerencia General.',
        'Todo lo anterior permitió fortalecer la estructuración de la rentabilidad obtenida en los procesos misionales de la compañía.'
      ]
    },
    {
      id: 2,
      icon: Factory,
      title: 'Producción y Operaciones',
      color: 'from-blue-500 to-blue-600',
      content: [
        'El área funcional de producción granjas pollo engorde decreció aproximadamente el 4% en el encasetamiento y pollo entregado a planta debido a factores zootécnicos y disponibilidad de pollo en el sector.',
        'Esta situación impactó en el 1.4% menos de las ventas anuales frente a las del año 2023. No obstante, se reitera los márgenes de rentabilidad neta obtenidas del 2.84%.',
        'En la parte operacional granjas se realizaron mantenimiento y reparaciones locativas a las casas de los administradores, redes eléctricas e hidro sanitarias, arreglo o reforzamiento de techos, equipos de comederos, bebederos y silos.'
      ]
    },
    {
      id: 3,
      icon: ShoppingCart,
      title: 'Mercadeo y Publicidad',
      color: 'from-purple-500 to-purple-600',
      content: [
        'Se realizaron campañas publicitarias 360 con presencia en:',
        '• Radio',
        '• Diario El Tiempo',
        '• TV: City TV, Red Más Noticias',
        '• Eventos puntuales con el Estado',
        '',
        'Se continuó con auto ventas en Bogotá y regionales.',
        'Se publicitó en el Tour de Francia y Vuelta a España.',
        'Página completa en el diario El Tiempo para los portafolios de productos navideños.'
      ]
    },
    {
      id: 4,
      icon: Factory,
      title: 'Planta de Beneficio',
      color: 'from-cyan-500 to-cyan-600',
      content: [
        'Se desmontó el túnel de congelación antiguo y se trasladó a la bodega Angel Blanco – VANTI, fortaleciendo toda la red de frío, totalmente climatizada.',
        'Esto permitió ampliar el área del chiller y empaque de víscera, ganando ergonomía en los puestos de trabajo y mejora en tiempos de proceso.',
        'Se fortaleció el área de procesados y adobados para cumplir con contratos de:',
        '• Frisby',
        '• Cencosud',
        '• Colsubsidio',
        '• Grupo Éxito',
        '• Jerónimo Martins',
        '',
        'En el caso de la comercialización de huevo, en el año 2024 se mantuvo la tendencia del año anterior en la conformación de la rentabilidad del negocio.'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-emerald-600/20 via-teal-600/20 to-cyan-600/20 backdrop-blur-xl rounded-2xl p-8 lg:p-12 border-2 border-emerald-500/30"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-emerald-500/20 p-4 rounded-xl">
              <Briefcase className="w-12 h-12 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                Negocio en Marcha
              </h1>
              <p className="text-xl text-emerald-300">Informe de Gestión 2024</p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
      </motion.div>

      {/* Content Sections */}
      {sections.map((section, index) => {
        const Icon = section.icon;
        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 lg:p-8 border-2 border-slate-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">{section.title}</h2>
            </div>
            
            <div className="space-y-4 text-gray-300 leading-relaxed">
              {section.content.map((paragraph, idx) => (
                <p key={idx} className={paragraph.startsWith('•') ? 'ml-4' : ''}>
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* Calidad y Certificaciones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 lg:p-8 border-2 border-slate-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Calidad y Certificaciones</h2>
        </div>
        
        <div className="space-y-4 text-gray-300 leading-relaxed">
          <p>
            Las visitas del Invima IVC (Inspección de Vigilancia y Control), obtuvo en su última calificación de <span className="font-semibold text-yellow-400">97.55%</span> frente al <span className="font-semibold">96.69%</span>.
          </p>
          <p>
            Esta mejora corresponde a la calidad del agua potable que presentó una característica física de color que no afecta al pollo.
          </p>
        </div>

        {/* Tarjeta de Calificación */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-yellow-900/20 border border-yellow-500/30 text-center">
            <p className="text-sm text-gray-400 mb-1">Calificación Anterior</p>
            <p className="text-3xl font-bold text-white">96.69%</p>
          </div>
          <div className="p-4 rounded-lg bg-yellow-900/20 border border-yellow-500/30 text-center">
            <p className="text-sm text-gray-400 mb-1">Calificación Actual</p>
            <p className="text-3xl font-bold text-yellow-400">97.55%</p>
            <p className="text-sm text-green-400 font-semibold mt-1">↑ +0.86%</p>
          </div>
        </div>
      </motion.div>

      {/* HSEQ y Gestión Ambiental */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 lg:p-8 border-2 border-slate-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">HSEQ y Gestión Ambiental</h2>
        </div>
        
        <div className="space-y-4 text-gray-300 leading-relaxed">
          <p>
            Desde la Dirección de HSEQ se continúa avanzando en el diseño, implementación y mantenimiento de las acciones encaminadas a:
          </p>
          <ul className="ml-6 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>Dirección de la gestión ambiental</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>Seguridad y Salud en el trabajo</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>Sistema de gestión de calidad</span>
            </li>
          </ul>
          <p>
            Velando por el cumplimiento de la normatividad vigente y requisitos de la <span className="font-semibold text-green-400">ISO 9001:2015</span>.
          </p>
        </div>
      </motion.div>

      {/* Mejoramiento Continuo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 lg:p-8 border-2 border-slate-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Mejoramiento Continuo</h2>
        </div>
        
        <div className="space-y-4 text-gray-300 leading-relaxed">
          <p>
            La compañía continúa con los procesos organizacionales de mejoramiento continuo con el acompañamiento de aliados productivos en renovación generacional.
          </p>
        </div>
      </motion.div>

      {/* Resumen de Indicadores Clave */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 backdrop-blur-xl rounded-xl p-6 lg:p-8 border-2 border-emerald-500/30"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Indicadores Clave 2024</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-slate-800/70 text-center">
            <p className="text-sm text-gray-400 mb-2">Rentabilidad Neta</p>
            <p className="text-3xl font-bold text-green-400">2.84%</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/70 text-center">
            <p className="text-sm text-gray-400 mb-2">Variación Ventas</p>
            <p className="text-3xl font-bold text-red-400">-1.4%</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/70 text-center">
            <p className="text-sm text-gray-400 mb-2">Variación Producción</p>
            <p className="text-3xl font-bold text-red-400">-4%</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/70 text-center">
            <p className="text-sm text-gray-400 mb-2">Calificación INVIMA</p>
            <p className="text-3xl font-bold text-yellow-400">97.55%</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
