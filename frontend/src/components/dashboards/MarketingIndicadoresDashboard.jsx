import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, CheckCircle, AlertTriangle, TrendingUp, Target, DollarSign, Zap } from 'lucide-react';

export default function MarketingIndicadoresDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Descripción */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 border border-purple-300">
        <p className="text-gray-700">Análisis consolidado de la gestión de publicidad y mercadeo, evaluando el retorno de inversión en campañas, efectividad de estrategias BTL, cumplimiento presupuestal y desempeño en canales digitales para fortalecer el posicionamiento de marca.</p>
      </div>

      {/* KPIs Visuales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal(
            'ROI de Campañas',
            <div className="text-gray-700">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200 mb-3">
                <p className="text-lg font-bold text-green-700 mb-2">17.4% Promedio 2025</p>
                <p className="text-sm">Inversión total: $401.661.665 COP</p>
              </div>
              <p className="mb-3">3 puntos porcentuales por debajo del registrado en 2024.</p>
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-sm font-semibold mb-2 text-gray-900">Destacados:</p>
                <p className="text-sm">• Mejor desempeño: Enero 2025 con 41.01%</p>
                <p className="text-sm">• Canal mayor retorno: Cencosud 29.9%</p>
                <p className="text-sm">• Canal Foco: PDV (prioritario 2026)</p>
                <p className="text-sm">• Canal oportunidad: Asadero 16.6%</p>
                <p className="text-sm">• ROI diciembre: 11.07%</p>
              </div>
            </div>
          )}
          className="bg-white rounded-xl p-6 border-4 border-green-200 hover:border-green-400 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">ROI de Campañas</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">17.4%</div>
          <div className="text-sm text-gray-600 mt-1">Promedio 2025</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div className="text-xs text-green-600">Cumplido</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal(
            'Campañas BTL',
            <div className="text-gray-700">
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 mb-3">
                <p className="text-lg font-bold text-yellow-700 mb-2">82% Acumulado 2025</p>
                <p className="text-sm">Meta: ≥ 95%</p>
              </div>
              <p className="mb-3">13 puntos porcentuales por debajo de la meta. Se sitúa 3 puntos por debajo del resultado de 2024 (85%).</p>
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-sm font-semibold mb-2 text-gray-900">Rango mensual 2025:</p>
                <p className="text-sm">• Mínimo: 78% (enero)</p>
                <p className="text-sm">• Máximo: 90% (septiembre)</p>
                <p className="text-sm">• Agosto: 73% (incapacidad Harol Alfonso)</p>
              </div>
            </div>
          )}
          className="bg-white rounded-xl p-6 border-4 border-yellow-200 hover:border-yellow-400 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Campañas BTL</span>
            <Target className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">82%</div>
          <div className="text-sm text-gray-600 mt-1">vs meta 95%</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <div className="text-xs text-yellow-600">Acción correctiva</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal(
            'Cumplimiento Presupuesto',
            <div className="text-gray-700">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-3">
                <p className="text-lg font-bold text-blue-700 mb-2">$401.6 MM / $480 MM (83.7%)</p>
                <p className="text-sm">Ahorro: $78.338.000</p>
              </div>
              <p className="mb-3">Distribución mensual: $40.000.000. Promedio mensual real: $33.471.000 (eficiencia 83.7%).</p>
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-sm font-semibold mb-2 text-gray-900">Inversión atípica:</p>
                <p className="text-sm">• Octubre: $163.175.712 (obsequios corporativos)</p>
                <p className="text-sm">• Diciembre: $123.995.310 (medios masivos)</p>
                <p className="text-sm">• Junio: $5.297.343 (menor inversión)</p>
              </div>
            </div>
          )}
          className="bg-white rounded-xl p-6 border-4 border-blue-200 hover:border-blue-400 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Cumplimiento Presupuesto</span>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">83.7%</div>
          <div className="text-sm text-gray-600 mt-1">$401.6 MM / $480 MM</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div className="text-xs text-green-600">Ahorro $78.3 MM</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal(
            'Efectividad Digital',
            <div className="text-gray-700">
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 mb-3">
                <p className="text-lg font-bold text-purple-700 mb-2">Efectividad 3.7</p>
                <p className="text-sm">CPC: $248 | CTR: 2.7%</p>
              </div>
              <p className="mb-3">Acumulado 2025: 82.76% de efectividad. CTR promedio 2.7% vs meta 3% (0.3 puntos por debajo).</p>
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-sm font-semibold mb-2 text-gray-900">Destacados:</p>
                <p className="text-sm">• Seguidores: 4,175 → 10,610 (+154%)</p>
                <p className="text-sm">• Mejor mes: Noviembre 175.93%, CTR 5.3%</p>
                <p className="text-sm">• Mayor CPC: Junio $435</p>
                <p className="text-sm">• Agosto: Sin pauta (inactividad cuenta)</p>
              </div>
            </div>
          )}
          className="bg-white rounded-xl p-6 border-4 border-purple-200 hover:border-purple-400 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Efectividad Digital</span>
            <Zap className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">3.7</div>
          <div className="text-sm text-gray-600 mt-1">CPC $248 | CTR 2.7%</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <div className="text-xs text-purple-600">Seguidores +154%</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabla Resumen */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={() => openModal(
          'Resumen de Indicadores 2025',
          <div className="text-gray-700">
            <p className="mb-4">Análisis consolidado de los 4 indicadores estratégicos del área de Mercadeo y Publicidad.</p>
            
            <div className="space-y-3">
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <p className="font-semibold text-green-900 mb-1">ROI de Campañas: 17.4%</p>
                <p className="text-sm">Inversión $401.6MM. Cumplido con oportunidad de mejora. Mejor mes: Enero 41.01%. Canal destacado: Cencosud 29.9%.</p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <p className="font-semibold text-yellow-900 mb-1">Campañas BTL: 82%</p>
                <p className="text-sm">13 puntos por debajo de meta 95%. Requiere plan de acción correctivo. Rango: 78%-90%. Agosto afectado por incapacidad.</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="font-semibold text-blue-900 mb-1">Cumplimiento Presupuesto: 83.7%</p>
                <p className="text-sm">Ejecutado $401.6MM de $480MM. Ahorro logrado: $78.3MM. Gestión eficiente con inversión atípica en octubre y diciembre.</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <p className="font-semibold text-purple-900 mb-1">Efectividad Digital: 3.7</p>
                <p className="text-sm">CTR 2.7% (meta 3%), CPC $248 (meta $300). Variable pero óptimo. Seguidores: +154% (4,175 → 10,610).</p>
              </div>
            </div>
          </div>
        )}
        className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-400 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Resumen de Indicadores</h3>
          <Info className="w-5 h-5 text-purple-600 animate-pulse" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-purple-100 to-pink-100 border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 text-gray-900 font-bold">INDICADOR</th>
                <th className="text-center py-3 px-4 text-gray-900 font-bold">RESULTADO 2025</th>
                <th className="text-center py-3 px-4 text-gray-900 font-bold">META</th>
                <th className="text-center py-3 px-4 text-gray-900 font-bold">ESTADO</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900 font-medium">ROI de Campañas</td>
                <td className="py-3 px-4 text-center text-green-700 font-bold">17.4% promedio 2025</td>
                <td className="py-3 px-4 text-center text-gray-700">&gt; 0% (cubrir inversión)</td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    Cumplido, oportunidad de mejora
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900 font-medium">Campañas BTL</td>
                <td className="py-3 px-4 text-center text-yellow-700 font-bold">82% (vs meta 95%)</td>
                <td className="py-3 px-4 text-center text-gray-700">≥ 95%</td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                    <AlertTriangle className="w-3 h-3" />
                    Plan de acción correctivo
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900 font-medium">Cumplimiento Presupuesto</td>
                <td className="py-3 px-4 text-center text-blue-700 font-bold">$401.6 MM / $480 MM (83.7%)</td>
                <td className="py-3 px-4 text-center text-gray-700">100% ($480 MM)</td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    Ahorro logrado
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900 font-medium">Efectividad Digital</td>
                <td className="py-3 px-4 text-center text-purple-700 font-bold">
                  <div>Promedio CPC: $248</div>
                  <div>Promedio CTR: 2.7%</div>
                  <div>Promedio Efectividad: 3.7</div>
                </td>
                <td className="py-3 px-4 text-center text-gray-700">
                  <div>CTR ≥ 3% (70%)</div>
                  <div>CPC ≤ $300 (30%)</div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                    <TrendingUp className="w-3 h-3" />
                    Variable, óptimo, puede mejorar
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal */}
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
              className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-purple-300 shadow-2xl max-h-[90vh] overflow-y-auto"
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
              
              <div className="text-gray-700">
                {modalContent.content}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
