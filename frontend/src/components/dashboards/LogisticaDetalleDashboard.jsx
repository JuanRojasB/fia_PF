import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, TrendingUp, TrendingDown } from 'lucide-react';

export default function LogisticaDetalleDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  // Manejar estructura del backend: { items: [...], totales: {...}, sedes: [...] }
  // o array directo para compatibilidad
  const logisticaData = Array.isArray(data) ? data : (data?.items || []);

  // Agrupar por sede
  const sedes = [...new Set(logisticaData.map(d => d.sede))].filter(Boolean).sort();

  // Función para obtener conceptos por sede
  const getConceptosPorSede = (sede) => {
    const conceptosMap = {};
    
    logisticaData
      .filter(d => d.sede === sede)
      .forEach(d => {
        const concepto = d.concepto || 'Sin concepto';
        if (!conceptosMap[concepto]) {
          conceptosMap[concepto] = { concepto, valor2024: 0, valor2025: 0 };
        }
        
        const valor = parseFloat(d.valor) || 0;
        if (d.anio === 2024 || d.anio === '2024') {
          conceptosMap[concepto].valor2024 += valor;
        } else if (d.anio === 2025 || d.anio === '2025') {
          conceptosMap[concepto].valor2025 += valor;
        }
      });
    
    return Object.values(conceptosMap).sort((a, b) => b.valor2025 - a.valor2025);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Logística - Detalle por Sede</h2>
        <p className="text-gray-400 mt-2">Gastos operacionales logísticos detallados por cada sede</p>
      </div>

      {/* Tablas por Sede */}
      {sedes.map((sede, idx) => {
        const conceptosSede = getConceptosPorSede(sede);
        const totalSede2024 = conceptosSede.reduce((sum, c) => sum + c.valor2024, 0);
        const totalSede2025 = conceptosSede.reduce((sum, c) => sum + c.valor2025, 0);
        
        return (
          <motion.div
            key={sede}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700 overflow-x-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                GASTOS OPERACIONALES LOGÍSTICOS {sede} AÑO 2024 VS 2025
              </h3>
              <button
                onClick={() => showModal(`Gastos ${sede}`, `Detalle de gastos operacionales logísticos para ${sede}.`)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Info className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cyan-700/50 border-b-2 border-slate-600">
                  <th className="text-left py-3 px-4 text-white font-bold">CONCEPTO</th>
                  <th className="text-right py-3 px-4 text-white font-bold">TOTAL 2024</th>
                  <th className="text-right py-3 px-4 text-white font-bold">TOTAL 2025</th>
                  <th className="text-right py-3 px-4 text-white font-bold">% Var 25/24</th>
                </tr>
              </thead>
              <tbody>
                {conceptosSede.map((row, rowIdx) => {
                  const variacion = row.valor2024 > 0 ? (((row.valor2025 - row.valor2024) / row.valor2024) * 100) : 0;
                  const esIncremento = variacion > 0;
                  
                  return (
                    <tr key={rowIdx} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                      <td className="py-2 px-4 text-white">{row.concepto}</td>
                      <td className="py-2 px-4 text-right text-cyan-300 tabular-nums">
                        $ {row.valor2024.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td className="py-2 px-4 text-right text-orange-300 tabular-nums">
                        $ {row.valor2025.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td className="py-2 px-4 text-right tabular-nums">
                        <span className={`flex items-center justify-end gap-1 ${esIncremento ? 'text-red-400' : 'text-green-400'}`}>
                          {esIncremento ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          {Math.abs(variacion).toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {/* Total por sede */}
                <tr className="bg-cyan-900/30 border-t-2 border-cyan-700 font-bold">
                  <td className="py-3 px-4 text-cyan-200">TOTAL {sede}</td>
                  <td className="py-3 px-4 text-right text-cyan-100 tabular-nums">
                    $ {totalSede2024.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-4 text-right text-orange-100 tabular-nums">
                    $ {totalSede2025.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-4 text-right text-white tabular-nums">
                    {totalSede2024 > 0 ? (((totalSede2025 - totalSede2024) / totalSede2024) * 100).toFixed(2) : 0}%
                  </td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        );
      })}

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
