import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, Factory, ShoppingCart, Award, Users, Leaf } from 'lucide-react';

export default function NegocioMarchaDashboard() {
  const sections = [
    {
      id: 1,
      icon: TrendingUp,
      title: 'Rentabilidad y Mercado 2025',
      color: 'from-green-500 to-green-600',
      highlights: [
        { text: '-2.19%', color: 'text-red-600 font-bold' },
        { text: 'fortalece el control interno', color: 'text-emerald-600 font-bold' }
      ],
      content: [
        'Durante el año 2025, el mercado de oferta y demanda se contrajo en el -2.19% en el precio de venta.',
        'La revisión de procesos de control con niveles de autorizaciones escalonados para la proveeduría de bienes y servicios fortalece el control interno en los procesos misionales de la compañía.'
      ]
    },
    {
      id: 2,
      icon: Factory,
      title: 'Producción Granjas - Resultados 2025',
      color: 'from-blue-500 to-blue-600',
      highlights: [
        { text: '+6.6%', color: 'text-blue-600 font-bold text-xl' },
        { text: '+1.04%', color: 'text-blue-600 font-bold text-xl' },
        { text: '3.88%', color: 'text-green-600 font-bold text-xl' }
      ],
      content: [
        'El área funcional de producción granjas pollo engorde creció el 6.6% en el encasetamiento, generando un incremento en las ventas netas del +1.04%.',
        'El margen de rentabilidad neta obtenida fue del 3.88%.',
        'En la parte operacional granjas se realizaron mantenimiento y reparaciones locativas a las casas de los administradores, redes eléctricas e hidro sanitarias, arreglo o reforzamiento de techos, equipos de comederos, bebederos y silos.'
      ]
    },
    {
      id: 3,
      icon: ShoppingCart,
      title: 'Mercadeo y Publicidad 360°',
      color: 'from-purple-500 to-purple-600',
      highlights: [
        { text: 'campañas 360°', color: 'text-purple-600 font-bold' },
        { text: 'indicadores ISO', color: 'text-purple-600 font-bold' }
      ],
      content: [
        'Se realizaron campañas publicitarias 360: (digitales BTL "Acciones de Marketing" y medios masivos):',
        '• Presencia en Radio',
        '• TV: Red Más Noticias, Caracol',
        '',
        'Se continuó con auto ventas en Bogotá y regionales, cuyos impactos fueron medidos y evaluados en los indicadores ISO de la empresa.'
      ]
    },
    {
      id: 4,
      icon: Factory,
      title: 'Planta de Beneficio - OEE y Mantenimiento',
      color: 'from-cyan-500 to-cyan-600',
      highlights: [
        { text: 'OEE', color: 'text-cyan-600 font-bold' },
        { text: '7.800 pollos/hora', color: 'text-cyan-600 font-bold' },
        { text: 'cero paradas', color: 'text-green-600 font-bold text-lg' }
      ],
      content: [
        'El indicador OEE (Overall Equipment Effectiveness – Eficiencia Global Productiva) mostró avances significativos como resultado de las acciones de mantenimiento ejecutadas durante el periodo.',
        '',
        '📍 Línea de Descargue: Overhaul mecánico y eléctrico que permitió mantener estable la capacidad operativa de 7.800 pollos por hora, garantizando continuidad en la primera etapa del proceso.',
        '',
        '📍 Zona de Máquinas y Calderas: Se logró estabilizar el problema de sobrecalentamiento mediante mantenimientos preventivos y correctivos, asegurando un funcionamiento confiable y eficiente.',
        '',
        '📍 Transfer: Desempeño operativo exitoso tras el mantenimiento total mejorando daño en el muñón del pollo, cambio en la línea de descargue y contribuyendo a una mayor fluidez del proceso.',
        '',
        '📍 Línea de Selección Linco: Intervenida con el cambio de la cadena y sus accesorios, mejorando la precisión y el rendimiento del sistema de selección.',
        '',
        '📍 Línea de Evisceración: Mantenimientos parciales y generales a los módulos (cloacas, abdomen, maestro, corta pescuezo y lavado de canales), mejorando rendimientos.',
        '',
        '📍 Desplumadura #1 (ITA): Se han venido efectuando mantenimientos frecuentes en bocines y dedos. Se proyecta reemplazo del equipo en 2026 debido al desgaste acumulado.',
        '',
        '🎯 Resultado: Desempeño óptimo de la planta de beneficio con cero paradas en la temporada más importante del año (diciembre, enero y febrero), arrojando menores costos en la operación y mayor cumplimiento a los clientes.'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-50 backdrop-blur-xl rounded-2xl p-8 lg:p-12 border-2 border-emerald-300"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-emerald-500 p-4 rounded-xl">
              <Briefcase className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                Negocio en Marcha
              </h1>
              <p className="text-xl text-gray-600">Informe de Gestión 2025</p>
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
            className="bg-white/95 backdrop-blur-xl rounded-xl p-6 lg:p-8 border-2 border-gray-200 hover:border-gray-300 transition-all"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
            </div>
            
            <div className="space-y-4 text-gray-700 leading-relaxed">
              {section.content.map((paragraph, idx) => {
                // Resaltar números y porcentajes importantes
                let highlightedText = paragraph;
                
                // Resaltar +6.6%, +1.04%, 3.88%
                highlightedText = highlightedText.replace(/6\.6%/g, '<span class="font-bold text-green-600">6.6%</span>');
                highlightedText = highlightedText.replace(/\+1\.04%/g, '<span class="font-bold text-green-600">+1.04%</span>');
                highlightedText = highlightedText.replace(/3\.88%/g, '<span class="font-bold text-green-600">3.88%</span>');
                
                // Resaltar 7.800 pollos/hora
                highlightedText = highlightedText.replace(/7\.800 pollos por hora/g, '<span class="font-bold">7.800 pollos/hora</span>');
                
                // Resaltar "cero paradas"
                highlightedText = highlightedText.replace(/cero paradas/g, '<span class="font-bold text-green-600">✓ CERO PARADAS</span>');
                
                // Resaltar "OEE"
                highlightedText = highlightedText.replace(/OEE \(Overall Equipment Effectiveness – Eficiencia Global Productiva\)/g, '<span class="font-bold">OEE (Overall Equipment Effectiveness – Eficiencia Global Productiva)</span>');
                
                // Resaltar "mejores precios"
                highlightedText = highlightedText.replace(/-2\.19%/g, '<span class="font-bold text-red-600">-2.19%</span>');
                
                // Resaltar "fortalece el control interno"
                highlightedText = highlightedText.replace(/fortalece el control interno/g, '<span class="font-bold">fortalece el control interno</span>');
                
                // Resaltar "menores costos" y "mayor cumplimiento"
                highlightedText = highlightedText.replace(/menores costos/g, '<span class="font-bold text-green-600">menores costos</span>');
                highlightedText = highlightedText.replace(/mayor cumplimiento/g, '<span class="font-bold text-green-600">mayor cumplimiento</span>');
                
                // Resaltar "indicadores ISO"
                highlightedText = highlightedText.replace(/indicadores ISO/g, '<span class="font-bold">indicadores ISO</span>');
                
                const isEmoji = paragraph.startsWith('📍') || paragraph.startsWith('🎯');
                const isBullet = paragraph.startsWith('•');
                
                return (
                  <p 
                    key={idx} 
                    className={`${isBullet ? 'ml-4' : ''} ${isEmoji ? 'bg-gray-50 p-3 rounded-lg border-l-4 border-cyan-500' : ''}`}
                    dangerouslySetInnerHTML={{ __html: highlightedText }}
                  />
                );
              })}
            </div>
          </motion.div>
        );
      })}

      {/* Calidad y Certificaciones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 lg:p-8 border-2 border-gray-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Calidad y Certificaciones INVIMA</h2>
        </div>
        
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            Las visitas del Invima IVC (Inspección de Vigilancia y Control), obtuvo en su última calificación en P.B. de <span className="font-bold text-orange-500">96.69%</span> frente al <span className="font-bold">97.55%</span>.
          </p>
          <p>
            La calificación fue afectada por aspectos locativos, limpieza y desinfección, implementación y mantenimiento de las acciones encaminadas a la dirección de la gestión ambiental, Seguridad y Salud en el trabajo y el sistema de gestión de calidad; velando por el cumplimiento de la normatividad vigente y requisitos de la <span className="font-bold">ISO 9001:2015</span>.
          </p>
        </div>

        {/* Tarjeta de Calificación */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-yellow-100 border-2 border-yellow-400 text-center">
            <p className="text-sm text-gray-600 mb-1">Calificación Anterior</p>
            <p className="text-4xl font-bold text-yellow-500">97.55%</p>
          </div>
          <div className="p-4 rounded-lg bg-yellow-50 border-2 border-yellow-300 text-center">
            <p className="text-sm text-gray-600 mb-1">Calificación Actual 2025</p>
            <p className="text-4xl font-bold text-yellow-600">96.69%</p>
            <p className="text-sm text-orange-600 font-semibold mt-1">↓ -0.86%</p>
          </div>
        </div>
      </motion.div>

      {/* HSEQ y Gestión Ambiental */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 lg:p-8 border-2 border-gray-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">HSEQ y Gestión Ambiental</h2>
        </div>
        
        <div className="space-y-4 text-gray-700 leading-relaxed">
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
            Velando por el cumplimiento de la normatividad vigente y requisitos de la <span className="font-bold">ISO 9001:2015</span>.
          </p>
        </div>
      </motion.div>

      {/* Mejoramiento Continuo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 lg:p-8 border-2 border-gray-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Mejoramiento Continuo</h2>
        </div>
        
        <div className="space-y-4 text-gray-700 leading-relaxed">
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
        className="bg-gradient-to-r from-emerald-50 to-teal-50 backdrop-blur-xl rounded-xl p-6 lg:p-8 border-2 border-emerald-300"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Indicadores Clave 2025</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-white border-2 border-green-300 text-center">
            <p className="text-sm text-gray-600 mb-2">Rentabilidad Neta</p>
            <p className="text-4xl font-bold text-green-600">3.88%</p>
            <p className="text-xs text-green-500 mt-1">↑ vs 2.84% (2024)</p>
          </div>
          <div className="p-4 rounded-lg bg-white border-2 border-blue-300 text-center">
            <p className="text-sm text-gray-600 mb-2">Crecimiento Encasetamiento</p>
            <p className="text-4xl font-bold text-blue-600">+6.6%</p>
            <p className="text-xs text-blue-500 mt-1">vs -4% (2024)</p>
          </div>
          <div className="p-4 rounded-lg bg-white border-2 border-cyan-300 text-center">
            <p className="text-sm text-gray-600 mb-2">Incremento Ventas Netas</p>
            <p className="text-4xl font-bold text-cyan-600">+1.04%</p>
            <p className="text-xs text-cyan-500 mt-1">vs -1.4% (2024)</p>
          </div>
          <div className="p-4 rounded-lg bg-white border-2 border-yellow-300 text-center">
            <p className="text-sm text-gray-600 mb-2">Calificación INVIMA</p>
            <p className="text-4xl font-bold text-yellow-600">96.69%</p>
            <p className="text-xs text-orange-500 mt-1">↓ vs 97.55% (2024)</p>
          </div>
        </div>

        {/* Destacado Especial */}
        <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center">
          <p className="text-sm font-semibold mb-2">🎯 LOGRO DESTACADO 2025</p>
          <p className="text-2xl font-bold">CERO PARADAS en Planta de Beneficio</p>
          <p className="text-sm mt-2 opacity-90">Durante la temporada más importante: Diciembre, Enero y Febrero</p>
        </div>
      </motion.div>
    </div>
  );
}
