import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, AlertTriangle, TrendingDown, Activity, Clock, Info, X } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';

export default function OperacionesTPMDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  };

  if (!data || !data.kpisTpm) {
    // datos hardcodeados, continuar
  }

  const { equiposOfensores } = data || {};

  return (
    <div className="space-y-6">
      {/* Descripción */}
      <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl p-6 border border-orange-300">
        <p className="text-gray-700">La gestión de 2025 logró cumplir los objetivos de productividad (OEE), pero enfrenta un reto con los preventivos. El descenso del MTBF y el aumento del MTTR indican que los equipos están fallando con más frecuencia y las reparaciones son más largas, por esto se acumulan <strong>104,30 horas de paro</strong> en el año. Se requiere revisar los planes de mantenimiento preventivo para estabilizar la frecuencia de fallas de los equipos críticos.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onClick={() => openModal('Disponibilidad de Mantenimiento 2025 vs 2024',
            <div className="space-y-4">
              <p>La disponibilidad cayó de <strong className="text-gray-700">97%</strong> en 2024 a <strong className="text-orange-600">95,70%</strong> en 2025.</p>
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                <p className="text-sm font-semibold text-green-800 mb-2">Picos de Eficiencia:</p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li><strong>Septiembre:</strong> 98,75% (MTTR: 0,10 hrs)</li>
                  <li><strong>Diciembre:</strong> 98,51% (MTTR: 0,11 hrs)</li>
                </ul>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300">
                <p className="text-sm font-semibold text-red-800 mb-2">Puntos Críticos:</p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li><strong>Agosto:</strong> 94,77%</li>
                  <li><strong>Noviembre:</strong> 94,71% — impactó OEE a 80,1%</li>
                </ul>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-green-500/30 cursor-pointer hover:border-green-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">Disponibilidad Mantenimiento</span>
            <TrendingDown className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">95,70%</div>
          <div className="border-t border-gray-200 mt-2 pt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="text-gray-700 font-semibold">97,00%</span></div>
            <div className="text-xs text-gray-500">2025: <span className="text-gray-700 font-semibold">95,70%</span></div>
            <div className="text-xs text-orange-600 font-semibold">Var: -1,30 pp</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          onClick={() => openModal('OEE Global Planta 2025',
            <div className="space-y-4">
              <p>Se acumularon <strong className="text-red-600">104,30 horas de paro</strong> en 2025. El OEE promedio fue <strong className="text-green-600">86,4%</strong>, superando la meta del 86%.</p>
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                <p className="text-sm font-semibold text-green-800 mb-2">Cumplimiento de Meta:</p>
                <p className="text-sm text-gray-700">En <strong>8 de los 12 meses</strong> se logró o superó la meta del 86%.</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300">
                <p className="text-sm font-semibold text-red-800 mb-2">Mes Crítico:</p>
                <p className="text-sm text-gray-700"><strong>Noviembre:</strong> 80,1% (mes más bajo del año).</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-blue-500/30 cursor-pointer hover:border-blue-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">OEE Global Planta</span>
            <Activity className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">86,4%</div>
          <div className="border-t border-gray-200 mt-2 pt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="text-gray-700 font-semibold">84,00%</span></div>
            <div className="text-xs text-gray-500">2025: <span className="text-gray-700 font-semibold">86,40%</span></div>
            <div className="text-xs text-green-600 font-semibold">Var: +2,40 pp · Meta 86% ✓</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          onClick={() => openModal('MTBF - Tiempo Medio Entre Fallas',
            <div className="space-y-4">
              <p>El MTBF cayó de <strong className="text-gray-700">13,35 hrs</strong> en 2024 a <strong className="text-red-600">10,42 hrs</strong> en 2025.</p>
              <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300">
                <p className="text-sm font-semibold text-red-800 mb-2">Equipos Críticos:</p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Línea de Descargue: 17,32 hrs (22 eventos)</li>
                  <li>Zona Máquinas y Calderas: 14,15 hrs (23 eventos)</li>
                  <li>Transferidor: 10,47 hrs (42 eventos)</li>
                </ul>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-red-500/30 cursor-pointer hover:border-red-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">MTBF — Tiempo Entre Fallas</span>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">10,42 hrs</div>
          <div className="border-t border-gray-200 mt-2 pt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="text-gray-700 font-semibold">13,35 hrs</span></div>
            <div className="text-xs text-gray-500">2025: <span className="text-gray-700 font-semibold">10,42 hrs</span></div>
            <div className="text-xs text-red-600 font-semibold">Var: -2,93 hrs · -21,95%</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          onClick={() => openModal('MTTR - Tiempo Medio de Reparación',
            <div className="space-y-4">
              <p>El MTTR aumentó de <strong className="text-gray-700">0,35 hrs</strong> en 2024 a <strong className="text-yellow-600">0,47 hrs</strong> en 2025.</p>
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                <p className="text-sm font-semibold text-green-800 mb-2">Mejores Tiempos:</p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Septiembre: 0,10 hrs (6 min)</li>
                  <li>Diciembre: 0,11 hrs (7 min)</li>
                </ul>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-300">
                <p className="text-sm font-semibold text-orange-800 mb-2">Meses Complejos:</p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Mayo: 0,37 hrs (22 min)</li>
                  <li>Octubre: 0,37 hrs (22 min)</li>
                </ul>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-yellow-500/30 cursor-pointer hover:border-yellow-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">MTTR — Tiempo de Reparación</span>
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">0,47 hrs</div>
          <div className="border-t border-gray-200 mt-2 pt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="text-gray-700 font-semibold">0,35 hrs</span> <span className="text-gray-400">(21 min)</span></div>
            <div className="text-xs text-gray-500">2025: <span className="text-gray-700 font-semibold">0,47 hrs</span> <span className="text-gray-400">(28 min)</span></div>
            <div className="text-xs text-yellow-600 font-semibold">Var: +0,12 hrs · +34,29%</div>
          </div>
        </motion.div>
      </div>

      {/* Tabla TPM */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl border-4 border-blue-500/30">
        <CollapsibleTable
          title="Indicadores Clave de Desempeño TPM - Comparativa 2024-2025"
          defaultOpen={false}
          totalRow={[
            { label: 'Indicadores TPM 2025' },
            { label: 'Disponibilidad: 95,70%', color: 'text-orange-500' },
            { label: 'OEE: 86,4%', color: 'text-green-600' },
            { label: 'MTBF: 10,42 hrs', color: 'text-red-500' },
            { label: 'MTTR: 0,47 hrs', color: 'text-yellow-600' },
          ]}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 px-3 text-gray-900 font-bold">Indicador</th>
                  <th className="text-center py-3 px-3 text-gray-900 font-bold">2024</th>
                  <th className="text-center py-3 px-3 text-gray-900 font-bold">2025</th>
                  <th className="text-left py-3 px-3 text-gray-900 font-bold">Observaciones</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-3 text-gray-900 font-semibold">Disponibilidad mantenimiento</td>
                  <td className="py-3 px-3 text-center text-gray-900">97%</td>
                  <td className="py-3 px-3 text-center text-orange-600 font-bold">95,70%</td>
                  <td className="py-3 px-3 text-gray-700 text-xs">
                    • Picos de eficiencia: Los meses de septiembre (98,75%) y diciembre (98,51%) presentan los niveles de disponibilidad más altos del año. Coinciden con los tiempos medios de reparación (MTTR) más bajos: 0,10 y 0,11 horas respectivamente.<br/>
                    • Puntos Críticos: El mes de agosto (94,77%) y noviembre (94,71%) muestran las caídas más significativas. En noviembre, esto impactó directamente el OEE Global, llevándolo a su punto más bajo del año (80,1%).
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-3 text-gray-900 font-semibold">OEE</td>
                  <td className="py-3 px-3 text-center text-gray-900">84,00%</td>
                  <td className="py-3 px-3 text-center text-green-600 font-bold">86,40%</td>
                  <td className="py-3 px-3 text-gray-700 text-xs">Se acumularon 104,30 horas de paro por mantenimiento en el año 2025, el promedio global del OEE se mantuvo en 86,4%, logrando superar la meta general del 86%.</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-3 text-gray-900 font-semibold">MTBF (Tiempo entre fallas)</td>
                  <td className="py-3 px-3 text-center text-gray-900">13,35 hrs</td>
                  <td className="py-3 px-3 text-center text-red-600 font-bold">10,42 hrs</td>
                  <td className="py-3 px-3 text-gray-700 text-xs">• MTBF (Tiempo Medio entre Fallas): Este indicador para la planta de beneficio es inestable. El valor más alto se registró en abril (4,16), indicando mayor confiabilidad, mientras que en septiembre cayó a 1,77, sugiriendo una alta frecuencia de intervenciones cortas.</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-3 text-gray-900 font-semibold">MTTR (Tiempo de reparación)</td>
                  <td className="py-3 px-3 text-center text-gray-900">0,35</td>
                  <td className="py-3 px-3 text-center text-orange-600 font-bold">0,47</td>
                  <td className="py-3 px-3 text-gray-700 text-xs">• MTTR (Tiempo Medio de Reparación): Se observa una gestión de respuesta rápida. El promedio suele estar por debajo de 0,30 horas (18 minutos). Sin embargo, meses como mayo y octubre (0,37) muestran reparaciones más complejas que castigaron la disponibilidad mensual.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 bg-yellow-50 rounded-lg p-4 border border-yellow-300">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Conclusión:</span> En 8 de los 12 meses se logró o superó la meta del 86% del OEE, lo que indica una gestión de mantenimiento estable, pero con vulnerabilidades específicas en equipos como línea de descargue (se realizó un overhaul mecánico y eléctrico dando buenos resultados hasta la fecha), Zona de Máquinas y Calderas (ya se logró estabilizar aplicando mantenimiento preventivo e inspecciones periódicas), Transferidor (fue puntual luego del cambio de la línea de descargue por enredo este fallo menos sin embargo las reparaciones fueron más largas), Línea de Selección Linco (se cambió cadena y accesorios importantes) y Desplumadura #1 (ITA) se debe priorizar inspecciones y recambios más frecuentes en bocines y dedos. Es importante invertir en la confiabilidad de la Línea de Descargue y Calderas para evitar que el impacto económico supere los $250 millones en el 2026. Se debe implementar y/o fortalecer el mantenimiento predictivo.
              </div>
            </div>
          </div>
        </CollapsibleTable>
      </motion.div>

      {/* Modal */}
      {createPortal(
        <AnimatePresence>
          {modalOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
              onClick={() => setModalOpen(false)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-cyan-500 shadow-2xl"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Info className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-xl font-bold text-gray-900">{modalContent.title}</h3>
                  </div>
                  <button onClick={() => setModalOpen(false)} className="text-gray-600 hover:text-gray-900">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="text-gray-700 leading-relaxed">{modalContent.content}</div>
                <div className="mt-6 flex justify-end">
                  <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Entendido</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>, document.body
      )}
    </div>
  );
}
