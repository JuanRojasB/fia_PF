import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info } from 'lucide-react';

export default function HumanaCausasDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
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
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">Causas de Desvinculación 2025</h3>
            <p className="text-gray-400 text-sm">
              Total de retiros: <span className="text-cyan-400 font-bold">{formatNumber(kpis.totalRetiros2025)}</span> personas
            </p>
          </div>
          <button
            onClick={() => openModal('Causas de Desvinculación', 'En 2025 se registraron 562 retiros, de los cuales 84% (471) corresponden a renuncia voluntaria, 12% (66) a terminaciones de contrato (con y sin causa), 3% (15) por período de prueba. El restante 1% corresponde a causas marginales (pensión, fallecimiento, mutuo acuerdo). El predominio de renuncias voluntarias sugiere revisar estrategias de atracción, satisfacción y retención del talento.')}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Info className="w-5 h-5 text-gray-400" />
          </button>
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
                className={`relative group cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br ${color.from} ${color.to} p-[2px] hover:scale-105 transition-transform duration-300`}
              >
                <div className="relative bg-slate-900/95 backdrop-blur-xl rounded-2xl p-5 h-full">
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg">
                    <span className="text-white font-bold text-lg">{idx + 1}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="text-white font-bold text-base leading-tight min-h-[40px]">
                      {motivo.motivo}
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <div className={`text-4xl font-black bg-gradient-to-r ${color.from} ${color.to} bg-clip-text text-transparent`}>
                          {formatNumber(motivo.cantidad)}
                        </div>
                        <div className="text-gray-400 text-xs font-medium mt-1">personas</div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-white">
                          {motivo.porcentaje}%
                        </div>
                        <div className="text-gray-400 text-xs font-medium">del total</div>
                      </div>
                    </div>

                    <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
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
              className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full border-4 border-cyan-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">{modalContent.title}</h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-gray-300 leading-relaxed">
                {modalContent.description}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
