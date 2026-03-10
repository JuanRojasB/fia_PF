import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, X, Info } from 'lucide-react';

export default function HumanaDetalleDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  const humanaData = Array.isArray(data) ? data : (data?.items || []);
  
  if (humanaData.length === 0) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return '$0';
    return '$' + new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Agrupar datos por categoría y eliminar duplicados
  const categorias = {
    'Costo de Nómina': [],
    'Horas Extras': []
  };

  // Usar un Map para eliminar duplicados
  const uniqueData = new Map();
  humanaData.forEach(d => {
    const cat = d.categoria || d.categor_a;
    const key = `${cat}-${d.concepto}-${d.anio}`;
    if (!uniqueData.has(key)) {
      uniqueData.set(key, d);
    }
  });

  // Agrupar los datos únicos
  Array.from(uniqueData.values()).forEach(d => {
    const cat = d.categoria || d.categor_a;
    if (categorias[cat]) {
      categorias[cat].push(d);
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Gestión Humana - Detalle de Nómina</h2>
        <p className="text-gray-400 mt-2">Desglose completo de costos de nómina y horas extras</p>
      </div>

      {/* Costo de Nómina Detallado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Detalle Costo de Nómina</h3>
          <button
            onClick={() => openModal('Costo de Nómina', 'Desglose completo de costos de nómina por concepto.')}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Info className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cyan-700/50 border-b-2 border-slate-600">
                <th className="text-left py-3 px-4 text-white font-bold">Concepto</th>
                <th className="text-right py-3 px-4 text-white font-bold">2024</th>
                <th className="text-right py-3 px-4 text-white font-bold">2025</th>
                <th className="text-right py-3 px-4 text-white font-bold">Variación</th>
              </tr>
            </thead>
            <tbody>
              {categorias['Costo de Nómina'].filter(d => d.anio === '2024' || d.anio === 2024).map((row2024, idx) => {
                const row2025 = categorias['Costo de Nómina'].find(d => 
                  (d.anio === '2025' || d.anio === 2025) && d.concepto === row2024.concepto
                );
                
                return (
                  <tr key={idx} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                    <td className="py-3 px-4 text-white font-medium">{row2024.concepto}</td>
                    <td className="py-3 px-4 text-right text-cyan-300 tabular-nums">{formatCurrency(row2024.valor)}</td>
                    <td className="py-3 px-4 text-right text-orange-300 tabular-nums">{formatCurrency(row2025?.valor || 0)}</td>
                    <td className="py-3 px-4 text-right">
                      {row2025?.variacion_pct && (
                        <span className="text-green-400 font-semibold flex items-center justify-end gap-1">
                          <ArrowUp className="w-4 h-4" />
                          {row2025.variacion_pct}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Horas Extras Detallado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Detalle Horas Extras</h3>
          <button
            onClick={() => openModal('Horas Extras', 'Desglose completo de horas extras por concepto.')}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Info className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-purple-700/50 border-b-2 border-slate-600">
                <th className="text-left py-3 px-4 text-white font-bold">Concepto</th>
                <th className="text-right py-3 px-4 text-white font-bold">2024</th>
                <th className="text-right py-3 px-4 text-white font-bold">2025</th>
                <th className="text-right py-3 px-4 text-white font-bold">Variación</th>
              </tr>
            </thead>
            <tbody>
              {categorias['Horas Extras'].filter(d => d.anio === '2024' || d.anio === 2024).map((row2024, idx) => {
                const row2025 = categorias['Horas Extras'].find(d => 
                  (d.anio === '2025' || d.anio === 2025) && d.concepto === row2024.concepto
                );
                
                return (
                  <tr key={idx} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                    <td className="py-3 px-4 text-white font-medium">{row2024.concepto}</td>
                    <td className="py-3 px-4 text-right text-purple-300 tabular-nums">
                      {row2024.concepto.includes('Valor') ? formatCurrency(row2024.valor) : row2024.valor.toLocaleString('es-CO')}
                    </td>
                    <td className="py-3 px-4 text-right text-pink-300 tabular-nums">
                      {row2025?.concepto.includes('Valor') ? formatCurrency(row2025?.valor || 0) : (row2025?.valor || 0).toLocaleString('es-CO')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {row2025?.variacion_pct && (
                        <span className="text-green-400 font-semibold flex items-center justify-end gap-1">
                          <ArrowUp className="w-4 h-4" />
                          {row2025.variacion_pct}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
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
