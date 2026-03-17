import { motion } from 'framer-motion';
import { Globe, DollarSign, TrendingUp, Target, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';
import { useState } from 'react';

export default function ContextoMundialDashboard() {
  const [showGastoInfo, setShowGastoInfo] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const pibData = [
    { trimestre: 'I',   año: '2019',   valor: 25000, index: 0 },
    { trimestre: 'II',  año: '2019',   valor: 25200, index: 1 },
    { trimestre: 'III', año: '2019',   valor: 25800, index: 2 },
    { trimestre: 'IV',  año: '2019',   valor: 26300, index: 3 },
    { trimestre: 'I',   año: '2020',   valor: 28200, index: 4 },
    { trimestre: 'II',  año: '2020',   valor: 27500, index: 5 },
    { trimestre: 'III', año: '2020',   valor: 27800, index: 6 },
    { trimestre: 'IV',  año: '2020',   valor: 28500, index: 7 },
    { trimestre: 'I',   año: '2021',   valor: 28300, index: 8 },
    { trimestre: 'II',  año: '2021',   valor: 30400, index: 9 },
    { trimestre: 'III', año: '2021',   valor: 30500, index: 10 },
    { trimestre: 'IV',  año: '2021',   valor: 30600, index: 11 },
    { trimestre: 'I',   año: '2022',   valor: 30400, index: 12 },
    { trimestre: 'II',  año: '2022',   valor: 30200, index: 13 },
    { trimestre: 'III', año: '2022',   valor: 30500, index: 14 },
    { trimestre: 'IV',  año: '2022',   valor: 30800, index: 15 },
    { trimestre: 'I',   año: '2023p',  valor: 31000, index: 16 },
    { trimestre: 'II',  año: '2023p',  valor: 31200, index: 17 },
    { trimestre: 'III', año: '2023p',  valor: 31800, index: 18 },
    { trimestre: 'IV',  año: '2023p',  valor: 31200, index: 19 },
    { trimestre: 'I',   año: '2024pr', valor: 31500, index: 20 },
    { trimestre: 'II',  año: '2024pr', valor: 32000, index: 21 },
    { trimestre: 'III', año: '2024pr', valor: 32100, index: 22 },
    { trimestre: 'IV',  año: '2024pr', valor: 32000, index: 23 },
    { trimestre: 'I',   año: '2025pr', valor: 31800, index: 24 },
    { trimestre: 'II',  año: '2025pr', valor: 31500, index: 25 },
    { trimestre: 'III', año: '2025pr', valor: 31200, index: 26 }
  ];

  const tendenciaData = pibData.map((item, index) => ({
    ...item,
    tendencia: 25000 + (index * 250)
  }));

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
        '• Tendencias de salud y dietas altas en proteína magra, reforzadas por el uso creciente de medicamentos GLP-1 que recomiendan consumo de pollo.',
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
        'Colombia mantiene un mercado interno robusto con consumo per cápita en crecimiento. Sin embargo, enfrenta presiones por:',
        '• Tipo de cambio: la devaluación del peso encarece insumos importados (maíz, soya, premezclas).',
        '• Riesgo sanitario: la influenza aviar sigue siendo una amenaza latente que requiere bioseguridad reforzada.',
        '• Competencia de proteínas sustitutas y contrabando de productos avícolas en zonas fronterizas.',
        'FENAVI reporta que el sector avícola colombiano representa más del 60% de la proteína animal consumida en el país, consolidándose como pilar de la seguridad alimentaria nacional.'
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
        '  - Incrementar eficiencia y automatización.'
      ]
    }
  ];

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 lg:p-8 border-2 border-blue-200 shadow-lg"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Globe className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Contexto Mundial 2026</h1>
            <p className="text-gray-600 text-sm lg:text-base">Análisis del entorno global para el sector avícola</p>
          </div>
        </div>
      </motion.div>

      {/* Sections */}
      {sections.map((section, index) => {
        const Icon = section.icon;
        const isExpanded = expandedSections[section.id];
        
        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/95 backdrop-blur-xl rounded-xl p-6 lg:p-8 border-2 border-gray-200 shadow-sm cursor-pointer hover:border-gray-300 transition-all"
            onClick={() => toggleSection(section.id)}
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{section.title}</h2>
              </div>
              <div className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                {isExpanded ? (
                  <ChevronUp className="w-6 h-6 text-gray-600" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-600" />
                )}
              </div>
            </div>
            
            {isExpanded && (
              <>
                <div className="space-y-2">
                  {section.content.map((line, i) => (
                    <p key={i} className={`leading-relaxed ${line === '' ? 'mt-2' : 'text-gray-700'}`}>
                      {line}
                    </p>
                  ))}
                </div>

                {/* Barreras a la Entrada — solo dentro de Conclusiones Estratégicas */}
                {section.id === 5 && (
                  <div className="mt-6 pt-6 border-t-2 border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md">
                        <AlertTriangle className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg lg:text-xl font-bold text-gray-900">Barreras a la Entrada en el Negocio Avícola</h3>
                    </div>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      Las barreras a la entrada en el negocio avícola son <span className="font-bold">normativas</span> y requieren cumplimiento estricto para operar en el sector:
                    </p>
                    <div className="overflow-x-auto">
                      <CollapsibleTable title="Barreras a la Entrada en el Negocio Avícola" defaultOpen={true}>
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
                                <p className="mb-2"><span className="font-bold">Certificación de granja biosegura</span>, protocolos estrictos de ingreso, manejo de mortalidades, limpieza, control de plagas, trazabilidad y movilización de animales.</p>
                                <p className="text-sm text-gray-600 italic mt-2"><span className="font-bold">Inversión en infraestructura</span></p>
                              </td>
                            </tr>
                            <tr className="hover:bg-indigo-50 transition-colors">
                              <td className="border-2 border-indigo-200 p-4 bg-indigo-100">
                                <span className="font-bold text-indigo-700">Inocuidad y Plantas de Beneficio (Pollo)</span>
                              </td>
                              <td className="border-2 border-indigo-200 p-4">
                                <p className="mb-2">Cumplimiento del <span className="font-bold">Decreto 1500</span> y normativa sanitaria para plantas de beneficio, desprese, almacenamiento y comercialización.</p>
                                <p className="text-sm text-gray-600 italic mt-2"><span className="font-bold">Inversión en infraestructura</span></p>
                              </td>
                            </tr>
                            <tr className="hover:bg-indigo-50 transition-colors">
                              <td className="border-2 border-indigo-200 p-4 bg-indigo-100">
                                <span className="font-bold text-indigo-700">Capital Inicial y Economías de Escala</span>
                              </td>
                              <td className="border-2 border-indigo-200 p-4">
                                <p>Inversión en <span className="font-bold">galpones, equipos, silos, energía, logística y capital de trabajo</span> para sostener ciclos productivos.</p>
                              </td>
                            </tr>
                            <tr className="hover:bg-indigo-50 transition-colors">
                              <td className="border-2 border-indigo-200 p-4 bg-indigo-100">
                                <span className="font-bold text-indigo-700">Ambiental y Territorial</span>
                              </td>
                              <td className="border-2 border-indigo-200 p-4">
                                <p>Uso de suelo, manejo de residuos (<span className="font-bold">gallinaza/pollinaza</span>), olores, vectores, cumplimiento ambiental y aceptación comunitaria.</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </CollapsibleTable>
                    </div>
                    <div className="mt-4 p-4 rounded-lg bg-indigo-50 border-2 border-indigo-200">
                      <p className="text-sm text-gray-700">
                        <span className="font-bold text-indigo-700">Fuente:</span> FENAVI - Federación Nacional de Avicultores de Colombia
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        );
      })}

      {/* Alert Box - Factores de Riesgo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 lg:p-8"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-amber-800 text-lg mb-2">Factores de Riesgo a Monitorear</h3>
            <ul className="space-y-1 text-amber-700 text-sm lg:text-base">
              <li>• Escalada del conflicto en Medio Oriente que afecte rutas de exportación de pollo.</li>
              <li>• Brote de influenza aviar de alta patogenicidad en Colombia o países vecinos.</li>
              <li>• Depreciación acelerada del peso colombiano que encarezca insumos importados.</li>
              <li>• Cambios regulatorios en uso de antibióticos promotores de crecimiento.</li>
              <li>• Fenómenos climáticos (El Niño/La Niña) que afecten cosechas de maíz y soya.</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
