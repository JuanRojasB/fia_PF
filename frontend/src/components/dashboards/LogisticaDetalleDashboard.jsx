import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, TrendingUp, TrendingDown } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';

export default function LogisticaDetalleDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });

  const openModal = (title, content) => {
    setModalContent({ title, content });
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
        <h2 className="text-3xl font-bold text-gray-900">Logística - Detalle por Sede</h2>
        <p className="text-gray-600 mt-2">Gastos operacionales logísticos detallados por cada sede</p>
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
            className="bg-white/95 backdrop-blur-xl rounded-xl border border-gray-200"
          >
            <CollapsibleTable
              title={`GASTOS OPERACIONALES LOGÍSTICOS ${sede} AÑO 2024 VS 2025`}
              defaultOpen={false}
            >
            <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-blue-600 border-b-2 border-gray-300">
                  <th className="text-left py-3 px-4 text-gray-900 font-bold">CONCEPTO</th>
                  <th className="text-right py-3 px-4 text-gray-900 font-bold">TOTAL 2024</th>
                  <th className="text-right py-3 px-4 text-gray-900 font-bold">TOTAL 2025</th>
                  <th className="text-right py-3 px-4 text-gray-900 font-bold">
                    <span className="inline-flex items-center gap-1 justify-end">
                      % Var 25/24
                      <span className="relative group cursor-help">
                        <span className="w-4 h-4 rounded-full bg-white/30 text-gray-900 text-xs flex items-center justify-center font-bold">?</span>
                        <span className="absolute right-0 top-6 z-50 hidden group-hover:block w-56 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl leading-relaxed">
                          🟢 Verde = reducción de gasto (positivo para la empresa)<br/>
                          🔴 Rojo = incremento de gasto (requiere atención)
                        </span>
                      </span>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {conceptosSede.map((row, rowIdx) => {
                  const variacion = row.valor2024 > 0 ? (((row.valor2025 - row.valor2024) / row.valor2024) * 100) : 0;
                  const esIncremento = variacion > 0;
                  
                  return (
                    <tr key={rowIdx} className="border-b border-gray-200/30 hover:bg-gray-100/20">
                      <td className="py-2 px-4 text-gray-900">{row.concepto}</td>
                      <td className="py-2 px-4 text-right text-cyan-600 tabular-nums">
                        $ {row.valor2024.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td className="py-2 px-4 text-right text-orange-600 tabular-nums">
                        $ {row.valor2025.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td className="py-2 px-4 text-right tabular-nums">
                        <span className={`flex items-center justify-end gap-1 ${esIncremento ? 'text-red-600' : 'text-green-600'}`}>
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs text-white ${esIncremento ? 'bg-red-500' : 'bg-green-500'}`}>
                            {esIncremento ? '↑' : '↓'}
                          </span>
                          {variacion.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {/* Total por sede */}
                <tr className="bg-blue-50 border-t-2 border-blue-600 font-bold">
                  <td className="py-3 px-4 text-blue-900 font-bold">TOTAL {sede}</td>
                  <td className="py-3 px-4 text-right text-cyan-700 tabular-nums">
                    $ {totalSede2024.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-4 text-right text-orange-700 tabular-nums">
                    $ {totalSede2025.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums">
                    {(() => {
                      const varTotal = totalSede2024 > 0 ? (((totalSede2025 - totalSede2024) / totalSede2024) * 100) : 0;
                      const esInc = varTotal > 0;
                      return (
                        <span className={`inline-flex items-center justify-end gap-1 ${esInc ? 'text-red-600' : 'text-green-600'}`}>
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs text-white ${esInc ? 'bg-red-500' : 'bg-green-500'}`}>
                            {esInc ? '↑' : '↓'}
                          </span>
                          {varTotal.toFixed(2)}%
                        </span>
                      );
                    })()}
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
            </CollapsibleTable>
          </motion.div>
        );
      })}

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
                  <Info className="w-6 h-6 text-cyan-400" />
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

