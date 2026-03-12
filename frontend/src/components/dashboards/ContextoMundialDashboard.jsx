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
        className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-8 lg:p-12 border-2 border-blue-500/30"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-500/20 p-4 rounded-xl">
              <Globe className="w-12 h-12 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                Contexto Mundial 2026
              </h1>
              <p className="text-xl text-blue-300">Análisis del Sector Avícola Global</p>
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
                <p key={idx} className={paragraph.startsWith('•') || paragraph.startsWith('  -') ? 'ml-4' : ''}>
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* Alert Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-xl rounded-xl p-6 border-2 border-yellow-500/30"
      >
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Factores de Riesgo</h3>
            <p className="text-gray-300">
              Monitoreo continuo de conflictos geopolíticos, influenza aviar y volatilidad en mercados de granos. 
              La gestión proactiva de estos riesgos es fundamental para mantener la competitividad del sector.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
