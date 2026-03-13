import { motion } from 'framer-motion';
import { Globe, DollarSign, TrendingUp, Target, AlertTriangle } from 'lucide-react';

export default function ContextoMundialDashboard() {
  const sections = [
    {
      id: 1,
      icon: Globe,
      title: '1. Entorno Global',
      color: 'from-blue-500 to-blue-600',
      content: [
        'El año 2026 sigue marcado por alta inestabilidad geopolítica, destacándose la prolongación del conflicto Rusia–Ucrania, que continúa afectando rutas logísticas y disponibilidad de granos fundamentales para la alimentación avícola.',
        'El conflicto Israel–Irán representa un riesgo para los mercados de proteína animal, especialmente porque el Medio Oriente es un importador clave de pollo.',
        'A nivel económico, el crecimiento global proyectado se sitúa en 2,6%, estable pero vulnerable a tensiones comerciales y desaceleración moderada de la demanda mundial.'
      ]
    },
    {
      id: 2,
      icon: DollarSign,
      title: '2. Insumos Clave para la Producción Avícola',
      color: 'from-green-500 to-green-600',
      content: [
        'Los costos de alimentación muestran tendencia a la estabilidad:',
        '• Brasil proyecta una cosecha récord de soya, lo que contribuye a contener precios de este insumo esencial.',
        '• En EE. UU., la siembra de maíz cae en 4,8 millones de acres, mientras aumenta la de soya por mejores márgenes asociados a biocombustibles y exceso de inventarios previos.',
        '• El Índice Global de Ingredientes reporta baja en harina de soya y estabilidad en maíz, mejorando la rentabilidad productiva.',
        '• El principal riesgo permanece en la influenza aviar, que continúa generando presiones sobre la oferta y riesgo de restricciones comerciales.'
      ]
    },
    {
      id: 3,
      icon: TrendingUp,
      title: '3. Sector Avícola Global',
      color: 'from-purple-500 to-purple-600',
      content: [
        'La avicultura mantiene su liderazgo como proteína de mayor crecimiento. Para 2026 se proyecta un aumento de 2,5% en la producción mundial, impulsado por:',
        '• Asequibilidad del pollo frente a otras proteínas más costosas.',
        '• Tendencias de salud y dietas altas en proteína magra, reforzadas por el uso creciente de medicamentos GLP‑1 que recomiendan consumo de pollo.',
        '• Expansión tecnológica en bioseguridad, automatización y nutrición de precisión en países líderes.'
      ]
    },
    {
      id: 4,
      icon: Globe,
      title: '4. Panorama Regional y Colombia',
      color: 'from-orange-500 to-orange-600',
      content: [
        'En América Latina, la producción avícola sigue en expansión, con Brasil como principal motor, aunque persisten riesgos por volatilidad de granos y eventos sanitarios. El uso de enzimas y vitaminas avanza rápidamente como parte de la nutrición de precisión en la región.',
        'En Colombia, el mercado avícola alcanzó máximos históricos en 2025, manteniendo proyección de crecimiento para 2026 gracias al consumo de pollo y huevo.',
        'El sector de alimento balanceado crece a un ritmo anual del 5,4%, impulsado por urbanización y demanda de proteína.'
      ]
    },
    {
      id: 5,
      icon: Target,
      title: '5. Conclusiones Estratégicas',
      color: 'from-red-500 to-red-600',
      content: [
        '• El sector avícola global sigue fuerte pese a la volatilidad geopolítica.',
        '• Los costos de alimentación se estabilizan, creando espacio para mejorar márgenes.',
        '• Colombia mantiene un mercado interno robusto, pero sensible al tipo de cambio y riesgos sanitarios.',
        '',
        'Prioridades estratégicas:',
        '  - Fortalecer bioseguridad.',
        '  - Gestionar insumos con estrategias de cobertura y diversificación.',
        '  - Incrementar eficiencia y automatización.',
        '  - Profundizar en nutrición de precisión para mejorar conversión alimenticia.'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-blue-100 via-purple-50 to-pink-50 backdrop-blur-xl rounded-2xl p-8 lg:p-12 border-2 border-blue-300"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-500 p-4 rounded-xl">
              <Globe className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                Contexto Mundial 2026
              </h1>
              <p className="text-xl text-blue-600">Análisis del Sector Avícola Global</p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
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
                
                // Resaltar porcentajes
                highlightedText = highlightedText.replace(/2,6%/g, '<span class="text-blue-600 font-bold text-lg bg-blue-50 px-2 py-1 rounded">2.6%</span>');
                highlightedText = highlightedText.replace(/2,5%/g, '<span class="text-purple-600 font-bold text-lg bg-purple-50 px-2 py-1 rounded">2.5%</span>');
                highlightedText = highlightedText.replace(/5,4%/g, '<span class="text-orange-600 font-bold text-lg bg-orange-50 px-2 py-1 rounded">5.4%</span>');
                highlightedText = highlightedText.replace(/4,8 millones de acres/g, '<span class="text-green-600 font-semibold">4.8 millones de acres</span>');
                
                // Resaltar conceptos clave
                highlightedText = highlightedText.replace(/costos de alimentación muestran tendencia a la estabilidad/g, '<span class="text-green-600 font-semibold">costos de alimentación muestran tendencia a la estabilidad</span>');
                highlightedText = highlightedText.replace(/cosecha récord de soya/g, '<span class="text-green-600 font-semibold">cosecha récord de soya</span>');
                highlightedText = highlightedText.replace(/mejorando la rentabilidad productiva/g, '<span class="text-green-600 font-semibold">mejorando la rentabilidad productiva</span>');
                highlightedText = highlightedText.replace(/influenza aviar/g, '<span class="text-red-600 font-bold">influenza aviar</span>');
                highlightedText = highlightedText.replace(/proteína de mayor crecimiento/g, '<span class="text-purple-600 font-semibold">proteína de mayor crecimiento</span>');
                highlightedText = highlightedText.replace(/máximos históricos en 2025/g, '<span class="text-orange-600 font-bold">máximos históricos en 2025</span>');
                highlightedText = highlightedText.replace(/bioseguridad/g, '<span class="text-red-600 font-semibold">bioseguridad</span>');
                highlightedText = highlightedText.replace(/nutrición de precisión/g, '<span class="text-blue-600 font-semibold">nutrición de precisión</span>');
                
                // Resaltar riesgos
                highlightedText = highlightedText.replace(/alta inestabilidad geopolítica/g, '<span class="text-red-600 font-semibold">alta inestabilidad geopolítica</span>');
                highlightedText = highlightedText.replace(/conflicto Rusia–Ucrania/g, '<span class="text-red-600 font-semibold">conflicto Rusia–Ucrania</span>');
                highlightedText = highlightedText.replace(/conflicto Israel–Irán/g, '<span class="text-red-600 font-semibold">conflicto Israel–Irán</span>');
                
                const isBullet = paragraph.startsWith('•') || paragraph.startsWith('  -');
                
                return (
                  <p 
                    key={idx} 
                    className={isBullet ? 'ml-4' : ''}
                    dangerouslySetInnerHTML={{ __html: highlightedText }}
                  />
                );
              })}
            </div>
          </motion.div>
        );
      })}

      {/* Barreras a la Entrada en el Negocio Avícola */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 lg:p-8 border-2 border-indigo-300"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">6. Barreras a la Entrada en el Negocio Avícola</h2>
        </div>

        <p className="text-gray-700 mb-6 leading-relaxed">
          Las barreras a la entrada en el negocio avícola son <span className="text-indigo-600 font-bold">normativas</span> y requieren cumplimiento estricto para operar en el sector:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="border-2 border-indigo-700 p-3 text-left font-bold">Categoría</th>
                <th className="border-2 border-indigo-700 p-3 text-left font-bold">Descripción</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-indigo-50 transition-colors">
                <td className="border-2 border-indigo-200 p-4 bg-indigo-100">
                  <span className="font-bold text-indigo-700">Sanitaria y Bioseguridad (ICA)</span>
                </td>
                <td className="border-2 border-indigo-200 p-4">
                  <p className="mb-2">
                    <span className="text-blue-600 font-semibold">Certificación de granja biosegura</span>, protocolos estrictos de ingreso, manejo de mortalidades, limpieza, control de plagas, trazabilidad y movilización de animales.
                  </p>
                  <p className="text-sm text-gray-600 italic mt-2">
                    <span className="font-semibold text-indigo-600">Inversión en infraestructura</span>
                  </p>
                </td>
              </tr>
              <tr className="hover:bg-indigo-50 transition-colors">
                <td className="border-2 border-indigo-200 p-4 bg-indigo-100">
                  <span className="font-bold text-indigo-700">Inocuidad y Plantas de Beneficio (Pollo)</span>
                </td>
                <td className="border-2 border-indigo-200 p-4">
                  <p className="mb-2">
                    Cumplimiento del <span className="text-blue-600 font-semibold">Decreto 1500</span> y normativa sanitaria para plantas de beneficio, desprese, almacenamiento y comercialización.
                  </p>
                  <p className="text-sm text-gray-600 italic mt-2">
                    <span className="font-semibold text-indigo-600">Inversión en infraestructura</span>
                  </p>
                </td>
              </tr>
              <tr className="hover:bg-indigo-50 transition-colors">
                <td className="border-2 border-indigo-200 p-4 bg-indigo-100">
                  <span className="font-bold text-indigo-700">Capital Inicial y Economías de Escala</span>
                </td>
                <td className="border-2 border-indigo-200 p-4">
                  <p>
                    Inversión en <span className="text-green-600 font-semibold">galpones, equipos, silos, energía, logística y capital de trabajo</span> para sostener ciclos productivos.
                  </p>
                </td>
              </tr>
              <tr className="hover:bg-indigo-50 transition-colors">
                <td className="border-2 border-indigo-200 p-4 bg-indigo-100">
                  <span className="font-bold text-indigo-700">Ambiental y Territorial</span>
                </td>
                <td className="border-2 border-indigo-200 p-4">
                  <p>
                    Uso de suelo, manejo de residuos (<span className="text-orange-600 font-semibold">gallinaza/pollinaza</span>), olores, vectores, cumplimiento ambiental y aceptación comunitaria.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-indigo-50 border-2 border-indigo-300">
          <p className="text-sm text-gray-700">
            <span className="font-bold text-indigo-700">Fuente:</span> FENAVI - Federación Nacional de Avicultores de Colombia
          </p>
        </div>
      </motion.div>

      {/* Alert Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-yellow-50 to-orange-50 backdrop-blur-xl rounded-xl p-6 border-2 border-yellow-300"
      >
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Factores de Riesgo</h3>
            <p className="text-gray-700">
              Monitoreo continuo de conflictos geopolíticos, influenza aviar y volatilidad en mercados de granos. 
              La gestión proactiva de estos riesgos es fundamental para mantener la competitividad del sector.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
