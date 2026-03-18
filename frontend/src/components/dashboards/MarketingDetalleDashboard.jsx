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
