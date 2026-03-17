import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info } from 'lucide-react';

export default function HumanaCausasDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  };

  if (!data || !data.kpis) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const { kpis, motivos } = data;

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO').format(value);
  };

  return (
    <div className="space-y-6">
      {/* Causas de Desvinculación 2025 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-cyan-500/30 hover:border-cyan-500 shadow-lg cursor-pointer transition-all"
        onClick={() => openModal(
          'Análisis de Causas de Desvinculación 2025',
          <div className="space-y-4">
            <p>Durante 2025 se registraron <strong className="text-cyan-600">{formatNumber(kpis.totalRetiros2025)}</strong> retiros de personal, distribuidos en 9 categorías principales.</p>
            
            <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-300">
              <p className="text-sm font-semibold text-gray-900 mb-2">Hallazgo Principal:</p>
              <p className="text-sm text-gray-700">La <strong>Renuncia Voluntaria</strong> representa el 83.81% de los retiros, siendo la causa predominante de desvinculación. Esto indica que la mayoría de las salidas son decisiones del colaborador, no de la empresa.</p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 border border-orange-300">
              <p className="text-sm font-semibold text-gray-900 mb-2">Causas Administrativas:</p>
              <p className="text-sm text-gray-700">Las terminaciones por contrato SENA (5.69%), terminación de contrato (4.09%) y período de prueba (2.67%) suman el 12.45% de los retiros, reflejando procesos normales de gestión contractual.</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
              <p className="text-sm font-semibold text-gray-900 mb-2">Causas Menores:</p>
              <p className="text-sm text-gray-700">Las terminaciones con justa causa (1.96%), mutuo acuerdo (0.71%), sin justa causa (0.36%), por pensión (0.53%) y por muerte (0.18%) representan menos del 4% del total.</p>
            </div>

            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">Implicaciones:</p>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Alta rotación voluntaria puede indicar oportunidades de mejora en retención</li>
                <li>Bajo porcentaje de despidos sugiere buena gestión del desempeño</li>
                <li>Importante analizar motivos detrás de las renuncias voluntarias</li>
              </ul>
            </div>
          </div>
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Causas de Desvinculación 2025</h3>
            <p className="text-gray-600 text-sm">
              Total de retiros: <span className="text-cyan-600 font-bold">{formatNumber(kpis.totalRetiros2025)}</span> personas
            </p>
          </div>
          <Info className="w-6 h-6 text-cyan-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {motivos.map((motivo, idx) => {
            const colors = [
              { from: 'from-cyan-500', to: 'to-blue-600', shadow: 'shadow-cyan-500/50' },
              { from: 'from-orange-500', to: 'to-red-600', shadow: 'shadow-orange-500/50' },
              { from: 'from-green-500', to: 'to-emerald-600', shadow: 'shadow-green-500/50' },
              { from: 'from-purple-500', to: 'to-pink-600', shadow: 'shadow-purple-500/50' },
              { from: 'from-yellow-500', to: 'to-orange-600', shadow: 'shadow-yellow-500/50' },
              { from: 'from-pink-500', to: 'to-rose-600', shadow: 'shadow-pink-500/50' },
              { from: 'from-indigo-500', to: 'to-blue-600', shadow: 'shadow-indigo-500/50' },
              { from: 'from-teal-500', to: 'to-cyan-600', shadow: 'shadow-teal-500/50' },
              { from: 'from-red-500', to: 'to-pink-600', shadow: 'shadow-red-500/50' }
            ];
            const color = colors[idx % colors.length];
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08, type: "spring", bounce: 0.3 }}
                className={`relative group overflow-hidden rounded-2xl bg-gradient-to-br ${color.from} ${color.to} p-[2px] hover:scale-105 transition-transform duration-300`}
              >
                <div className="relative bg-white backdrop-blur-xl rounded-2xl p-5 h-full shadow-lg">
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-gray-300 shadow-lg">
                    <span className="text-gray-900 font-bold text-lg">{idx + 1}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="text-gray-900 font-bold text-base leading-tight min-h-[40px]">
                      {motivo.motivo}
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <div className={`text-4xl font-black bg-gradient-to-r ${color.from} ${color.to} bg-clip-text text-transparent`}>
                          {formatNumber(motivo.cantidad)}
                        </div>
                        <div className="text-gray-600 text-xs font-medium mt-1">personas</div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-gray-900">
                          {motivo.porcentaje % 1 === 0 ? Math.round(motivo.porcentaje) : motivo.porcentaje}%
                        </div>
                        <div className="text-gray-600 text-xs font-medium">del total</div>
                      </div>
                    </div>

                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${motivo.porcentaje}%` }}
                        transition={{ duration: 1, delay: idx * 0.08 + 0.3, ease: "easeOut" }}
                        className={`absolute inset-y-0 left-0 bg-gradient-to-r ${color.from} ${color.to} rounded-full`}
                      />
                      <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '400%' }}
                        transition={{ duration: 2, delay: idx * 0.08 + 0.5, ease: "easeInOut" }}
                        className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      />
                    </div>
                  </div>

                  <div className={`absolute inset-0 bg-gradient-to-br ${color.from} ${color.to} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`} />
                </div>
              </motion.div>
            );
          })}
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
                  <Info className="w-6 h-6 text-cyan-600" />
                  <h3 className="text-xl font-bold text-gray-900">{modalContent.title}</h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 pr-2 text-gray-700 leading-relaxed">
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
