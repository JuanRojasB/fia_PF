import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, X, Info } from 'lucide-react';
import EnDesarrollo from './EnDesarrollo';

export default function FuentesUsosDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };
  // Validar que data sea un array
  const financialData = Array.isArray(data) ? data : (data?.items || []);
  
  // Mostrar mensaje de desarrollo si no hay datos o hay mensaje del backend
  if (financialData.length === 0 || data?.mensaje) {
    return (
      <EnDesarrollo
        titulo="Balance General en Desarrollo"
        descripcion="El módulo de Balance General (Fuentes y Usos) está siendo configurado. Pronto estará disponible con información financiera detallada sobre activos, pasivos, patrimonio y flujos de efectivo."
        modulo="Balance General / Fuentes y Usos"
      />
    );
  }

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return '$0';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '$0';
    
    const formatted = new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numValue);
    return `$${formatted}`;
  };

  // Separar por tipo
  const activos = financialData.filter(d => d.tipo === 'ACTIVOS');
  const pasivos = financialData.filter(d => d.tipo === 'PASIVOS');
  const patrimonio = financialData.filter(d => d.tipo === 'PATRIMONIO');

  // Calcular totales 2024 y 2025
  const totalActivos2025 = activos.reduce((sum, d) => sum + (parseFloat(d.valor_2025) || 0), 0);
  const totalActivos2024 = activos.reduce((sum, d) => sum + (parseFloat(d.valor_2024) || 0), 0);
  
  const totalPasivos2025 = pasivos.reduce((sum, d) => sum + (parseFloat(d.valor_2025) || 0), 0);
  const totalPasivos2024 = pasivos.reduce((sum, d) => sum + (parseFloat(d.valor_2024) || 0), 0);
  
  const totalPatrimonio2025 = patrimonio.reduce((sum, d) => sum + (parseFloat(d.valor_2025) || 0), 0);
  const totalPatrimonio2024 = patrimonio.reduce((sum, d) => sum + (parseFloat(d.valor_2024) || 0), 0);

  // Calcular variaciones
  const varActivos = totalActivos2024 > 0 ? (((totalActivos2025 - totalActivos2024) / totalActivos2024) * 100).toFixed(1) : 0;
  const varPasivos = totalPasivos2024 > 0 ? (((totalPasivos2025 - totalPasivos2024) / totalPasivos2024) * 100).toFixed(1) : 0;
  const varPatrimonio = totalPatrimonio2024 > 0 ? (((totalPatrimonio2025 - totalPatrimonio2024) / totalPatrimonio2024) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* KPIs Comparativos 2024 vs 2025 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal('Activos', 'Recursos controlados por la empresa.')}
          className="bg-slate-800/50 backdrop-blur-xl rounded-lg sm:rounded-xl p-4 sm:p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs sm:text-sm font-medium">Total Activos 2025</span>
            <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400" />
          </div>
          <div className="text-xl sm:text-3xl font-bold text-white mb-1 break-all">${formatCurrency(totalActivos2025)}</div>
          <div className="text-xs sm:text-sm text-gray-400 break-all">2024: ${formatCurrency(totalActivos2024)}</div>
          <div className={`text-xs sm:text-sm mt-1 ${varActivos >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {varActivos > 0 ? '+' : ''}{varActivos}% vs 2024
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal('Pasivos', 'Obligaciones y deudas de la empresa.')}
          className="bg-slate-800/50 backdrop-blur-xl rounded-lg sm:rounded-xl p-4 sm:p-6 border-4 border-red-500/30 hover:border-red-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs sm:text-sm font-medium">Total Pasivos 2025</span>
            <TrendingDown className="w-4 h-4 sm:w-6 sm:h-6 text-red-400" />
          </div>
          <div className="text-xl sm:text-3xl font-bold text-white mb-1 break-all">${formatCurrency(totalPasivos2025)}</div>
          <div className="text-xs sm:text-sm text-gray-400 break-all">2024: ${formatCurrency(totalPasivos2024)}</div>
          <div className={`text-xs sm:text-sm mt-1 ${varPasivos >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {varPasivos > 0 ? '+' : ''}{varPasivos}% vs 2024
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal('Patrimonio', 'Valor neto: Activos - Pasivos.')}
          className="bg-slate-800/50 backdrop-blur-xl rounded-lg sm:rounded-xl p-4 sm:p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs sm:text-sm font-medium">Patrimonio 2025</span>
            <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-green-400" />
          </div>
          <div className="text-xl sm:text-3xl font-bold text-white mb-1 break-all">${formatCurrency(totalPatrimonio2025)}</div>
          <div className="text-xs sm:text-sm text-gray-400 break-all">2024: ${formatCurrency(totalPatrimonio2024)}</div>
          <div className={`text-xs sm:text-sm mt-1 ${varPatrimonio >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {varPatrimonio > 0 ? '+' : ''}{varPatrimonio}% vs 2024
          </div>
        </motion.div>
      </div>

      {/* Gráficos Comparativos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Comparación 2024 vs 2025 - Totales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-700"
        >
          <h3 className="text-base sm:text-xl font-bold text-white mb-3 sm:mb-6">Balance General 2024 vs 2025</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              { name: 'Activos', '2024': totalActivos2024, '2025': totalActivos2025 },
              { name: 'Pasivos', '2024': totalPasivos2024, '2025': totalPasivos2025 },
              { name: 'Patrimonio', '2024': totalPatrimonio2024, '2025': totalPatrimonio2025 }
            ]} margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '14px' }} />
              <YAxis stroke="#9ca3af" width={80} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                formatter={(value) => formatCurrency(value)}
              />
              <Legend />
              <Bar dataKey="2024" fill="#6366f1" name="2024" />
              <Bar dataKey="2025" fill="#10b981" name="2025" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Principales Activos Comparativa */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-700"
        >
          <h3 className="text-base sm:text-xl font-bold text-white mb-3 sm:mb-6">Principales Activos 2025 vs 2024</h3>
          <div className="space-y-2 sm:space-y-3 max-h-[250px] overflow-y-auto">
            {activos.slice(0, 8).map((item, idx) => {
              const valor2025 = parseFloat(item.valor_2025) || 0;
              const valor2024 = parseFloat(item.valor_2024) || 0;
              const variacion = valor2024 > 0 ? (((valor2025 - valor2024) / valor2024) * 100).toFixed(1) : 0;
              
              return (
                <div 
                  key={idx}
                  className="bg-slate-700/30 rounded-lg p-3 border border-slate-600"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-gray-300 font-medium">{item.categoria}</span>
                    <span className={`text-xs px-2 py-1 rounded ${variacion >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {variacion > 0 ? '+' : ''}{variacion}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-gray-500">2025</div>
                      <div className="text-green-400 font-semibold">{formatCurrency(valor2025)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">2024</div>
                      <div className="text-blue-400 font-semibold">{formatCurrency(valor2024)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Tabla detallada */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-700 overflow-x-auto"
      >
        <h3 className="text-base sm:text-xl font-bold text-white mb-3 sm:mb-6">Balance General Detallado 2024 vs 2025</h3>
        <div className="space-y-4 sm:space-y-6">
          {['ACTIVOS', 'PASIVOS', 'PATRIMONIO'].map((tipo) => {
            const items = financialData.filter(d => d.tipo === tipo);
            if (items.length === 0) return null;
            
            return (
              <div key={tipo}>
                <h4 className="text-sm sm:text-md font-semibold text-blue-400 mb-2">{tipo}</h4>
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-2 px-2 sm:px-4 text-gray-400">Categoría</th>
                      <th className="text-right py-2 px-2 sm:px-4 text-gray-400 hidden sm:table-cell">2024</th>
                      <th className="text-right py-2 px-2 sm:px-4 text-gray-400">2025</th>
                      <th className="text-right py-2 px-2 sm:px-4 text-gray-400 hidden md:table-cell">Variación</th>
                      <th className="text-right py-2 px-2 sm:px-4 text-gray-400">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((row, idx) => {
                      const val2025 = parseFloat(row.valor_2025) || 0;
                      const val2024 = parseFloat(row.valor_2024) || 0;
                      const variacion = val2025 - val2024;
                      const variacionPct = val2024 > 0 ? ((variacion / val2024) * 100).toFixed(1) : 0;
                      
                      return (
                        <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                          <td className="py-2 px-2 sm:px-4 text-white break-words">{row.categoria}</td>
                          <td className="py-2 px-2 sm:px-4 text-right text-blue-400 hidden sm:table-cell">{formatCurrency(val2024)}</td>
                          <td className="py-2 px-2 sm:px-4 text-right text-green-400">{formatCurrency(val2025)}</td>
                          <td className={`py-2 px-2 sm:px-4 text-right hidden md:table-cell ${variacion >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formatCurrency(Math.abs(variacion))}
                          </td>
                          <td className={`py-2 px-2 sm:px-4 text-right ${variacionPct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {variacionPct > 0 ? '+' : ''}{variacionPct}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
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
            
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full border-4 border-green-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-green-400" />
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
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
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
