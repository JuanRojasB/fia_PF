import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Target, DollarSign, Zap, CheckCircle, X, Info } from 'lucide-react';

export default function MarketingDetalleDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 border border-purple-300">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Análisis</h2>
        <p className="text-gray-700">Desglose de indicadores estratégicos</p>
      </div>

      {/* ROI */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => openModal(
          'ROI de Campañas - Detalle',
          <div className="text-gray-700">
            <p className="mb-3">Inversión total: <strong>$401.661.665</strong>. ROI promedio: <strong>17.4%</strong> (3 puntos por debajo de 2024).</p>
            <div className="bg-green-50 rounded-lg p-3 border border-green-200 mb-3">
              <p className="font-semibold text-green-900 mb-2">Mejor Desempeño</p>
              <p className="text-sm">• Enero 2025: 41.01%</p>
              <p className="text-sm">• Canal Cencosud: 29.9% promedio (alto potencial)</p>
              <p className="text-sm">• Canal Foco: PDV (prioritario 2026)</p>
              <p className="text-sm">• Canal Asadero: 16.6% (oportunidad)</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200 mb-3">
              <p className="font-semibold text-orange-900 mb-2">Meses de Mayor Inversión</p>
              <p className="text-sm">• Octubre: $163.175.712 (obsequios corporativos)</p>
              <p className="text-sm">• Diciembre: $123.995.310 (medios masivos: RCN, Caracol, Red+, radio)</p>
              <p className="text-sm">• ROI diciembre: 11.07% (impactado por pauta extraordinaria)</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <p className="font-semibold text-purple-900 mb-1">Recomendación</p>
              <p className="text-sm">Reforzar inversión hacia Cencosud y PDV en 2026. Evaluar rentabilidad del canal Asadero.</p>
            </div>
          </div>
        )}
        className="bg-white rounded-xl p-6 border border-gray-200 hover:border-green-400 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-gray-900">ROI de Campañas Publicitarias 2025</h3>
          </div>
          <Info className="w-5 h-5 text-green-600 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="font-semibold text-green-900 mb-2">Mejor Desempeño</p>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Enero: 41.01%</li>
              <li>• Cencosud: 29.9%</li>
              <li>• Asadero: 16.6%</li>
            </ul>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="font-semibold text-orange-900 mb-2">Mayor Inversión</p>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Oct: $163.175.712</li>
              <li>• Dic: $123.995.310</li>
              <li>• ROI Dic: 11.07%</li>
            </ul>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="font-semibold text-purple-900 mb-2">Recomendación</p>
            <p className="text-sm text-gray-700">Reforzar Cencosud y PDV</p>
          </div>
        </div>
      </motion.div>

      {/* BTL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onClick={() => openModal(
          'Campañas BTL - Detalle',
          <div className="text-gray-700">
            <p className="mb-3">Resultado acumulado: <strong>82%</strong> vs. meta <strong>95%</strong> (13 puntos por debajo). Se sitúa 3 puntos por debajo del resultado de 2024 (85%).</p>
            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200 mb-3">
              <p className="font-semibold text-yellow-900 mb-2">Resultados 2025</p>
              <p className="text-sm">• Acumulado: 82% vs. meta 95%</p>
              <p className="text-sm">• Vs. 2024: De 85% a 82% (-3 puntos)</p>
              <p className="text-sm">• Rango mensual: 78% (enero) - 90% (septiembre)</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 border border-red-200 mb-3">
              <p className="font-semibold text-red-900 mb-2">Situación Especial</p>
              <p className="text-sm">El activador de marca Harol Alfonso estuvo incapacitado durante todo agosto 2025, reflejando la efectividad más baja del año: <strong>73%</strong>.</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <p className="font-semibold text-purple-900 mb-1">Recomendación</p>
              <p className="text-sm">Documentar y escalar mejores prácticas de eventos con mejor calificación.</p>
            </div>
          </div>
        )}
        className="bg-white rounded-xl p-6 border border-gray-200 hover:border-yellow-400 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-yellow-600" />
            <h3 className="text-xl font-bold text-gray-900">Efectividad Campañas BTL 2025 vs Meta</h3>
          </div>
          <Info className="w-5 h-5 text-yellow-600 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="font-semibold text-yellow-900 mb-2">Resultados</p>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Acumulado: 82%</li>
              <li>• Rango: 78%-90%</li>
              <li>• Vs 2024: -3 puntos</li>
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="font-semibold text-red-900 mb-2">Situación Especial</p>
            <p className="text-sm text-gray-700">Agosto: 73% (incapacidad)</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="font-semibold text-purple-900 mb-2">Recomendación</p>
            <p className="text-sm text-gray-700">Documentar mejores prácticas</p>
          </div>
        </div>
      </motion.div>

      {/* Presupuesto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => openModal(
          'Cumplimiento Presupuesto - Detalle',
          <div className="text-gray-700">
            <p className="mb-3">Presupuesto aprobado: <strong>$480.000.000</strong> (distribución mensual: $40.000.000). Ejecución real: <strong>$401.661.665</strong> (83.7%). Ahorro: <strong>$78.338.335</strong>.</p>
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 mb-3">
              <p className="font-semibold text-blue-900 mb-2">Ejecución</p>
              <p className="text-sm">• Promedio mensual real: $33.471.805 vs $40.000.000 presupuestado</p>
              <p className="text-sm">• Eficiencia: 83.7%</p>
              <p className="text-sm">• Mes de menor inversión: Junio $5.297.343 (brecha de continuidad)</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200 mb-3">
              <p className="font-semibold text-orange-900 mb-2">Inversión Atípica (justificada)</p>
              <p className="text-sm">• Octubre: $163.175.712 (obsequios corporativos fin de año)</p>
              <p className="text-sm">• Diciembre: $123.995.310 (pauta medios masivos - cierre comercial)</p>
            </div>
          </div>
        )}
        className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-400 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Cumplimiento Presupuesto Marketing 2025</h3>
          </div>
          <Info className="w-5 h-5 text-blue-600 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-blue-900 mb-2">Ejecución</p>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Ejecutado: 83.7%</li>
              <li>• Ahorro: $78.338.335</li>
              <li>• Promedio: $33.471.805</li>
            </ul>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="font-semibold text-orange-900 mb-2">Atípica</p>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Oct: $163.175.712</li>
              <li>• Dic: $123.995.310</li>
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="font-semibold text-red-900 mb-2">Menor Inversión</p>
            <p className="text-sm text-gray-700">Junio: $5.297.343</p>
          </div>
        </div>
      </motion.div>

      {/* Digital */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => openModal(
          'Efectividad Digital - Detalle',
          <div className="text-gray-700">
            <p className="mb-3">Métricas ponderadas: <strong>CTR (70%)</strong> y <strong>CPC (30%)</strong>. Acumulado 2025: <strong>82.76%</strong> de efectividad. CTR promedio: <strong>2.7%</strong> (meta 3%). CPC promedio: <strong>$248</strong> (meta $300).</p>
            <div className="bg-green-50 rounded-lg p-3 border border-green-200 mb-3">
              <p className="font-semibold text-green-900 mb-2">Crecimiento de Seguidores</p>
              <p className="text-sm">• Enero 2025: 4,175 seguidores</p>
              <p className="text-sm">• Diciembre 2025: 10,610 seguidores</p>
              <p className="text-sm">• Incremento: <strong>+154%</strong></p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200 mb-3">
              <p className="font-semibold text-purple-900 mb-2">Datos Destacados</p>
              <p className="text-sm">• Mejor mes: Noviembre 175.93% efectividad, CTR 5.3%</p>
              <p className="text-sm">• Mayor CPC: Junio $435 (45.3% sobre meta)</p>
              <p className="text-sm">• CTR acumulado: 2.7% vs meta 3% (0.3 puntos por debajo)</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
              <p className="font-semibold text-red-900 mb-1">Sin Pauta</p>
              <p className="text-sm">Agosto: No se registró inversión digital por inactividad de cuenta.</p>
            </div>
          </div>
        )}
        className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-400 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-900">Efectividad Digital CTR/CPC Pauta 2025</h3>
          </div>
          <Info className="w-5 h-5 text-purple-600 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="font-semibold text-green-900 mb-2">Seguidores</p>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• 4,175 → 10,610</li>
              <li>• Incremento: +154%</li>
            </ul>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="font-semibold text-purple-900 mb-2">Destacados</p>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Nov: 175.93%</li>
              <li>• Jun CPC: $435</li>
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="font-semibold text-red-900 mb-2">Sin Pauta</p>
            <p className="text-sm text-gray-700">Agosto: Inactividad</p>
          </div>
        </div>
      </motion.div>

      {/* Balance Estratégico */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-gray-900">Fortalezas 2025</h3>
          </div>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• Efectividad Campañas Digitales 3.7</li>
            <li>• Seguidores digitales +154%</li>
            <li>• ROI promedio 17.4%</li>
            <li>• Ahorro presupuestal $78.338.335</li>
          </ul>
        </div>

        <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-orange-600" />
            <h3 className="text-xl font-bold text-gray-900">Oportunidades 2026</h3>
          </div>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• Mejorar ROI en canal PDV</li>
            <li>• Pauta digital activa 12 meses</li>
            <li>• Redistribuir ahorro a canales alto ROI</li>
            <li>• Aumentar efectividad &gt; 3%</li>
          </ul>
        </div>
      </motion.div>

      {/* Modal */}
      {createPortal(
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-blue-500 shadow-2xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-gray-900">{modalContent.title}</h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="overflow-y-auto flex-1 pr-2 text-gray-700">
                {modalContent.content}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </div>
  );
}
