import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar, X, Info } from 'lucide-react';

export default function CarteraDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  // Verificar que data sea un array
  const carteraData = Array.isArray(data) ? data : (data?.items || []);

  if (carteraData.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-12 border border-slate-700 text-center">
        <div className="text-gray-400 text-lg">No hay datos disponibles para Gestión de Cartera</div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return '$0';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '$0';
    
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numValue);
  };

  // Calcular promedios
  const promedioCartera = carteraData.reduce((sum, d) => sum + (parseFloat(d.total_cartera) || 0), 0) / carteraData.length;
  const promedioMora = carteraData.reduce((sum, d) => sum + (parseFloat(d.indice_mora) || 0), 0) / carteraData.length;
  const promedioRotacion = carteraData.reduce((sum, d) => sum + (parseFloat(d.rotacion_dias) || 0), 0) / carteraData.length;

  // Datos para gráficos
  const chartData = carteraData.map(d => ({
    mes: (d.mes || '').toUpperCase(),
    exp2024: parseFloat(d.exp_millones_2024) || 0,
    exp2025: parseFloat(d.exp_millones_2025) || 0,
    mora: parseFloat(d.indice_mora) || 0,
    rotacion: parseFloat(d.rotacion_dias) || 0
  }));

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal('Cartera Promedio', 'Dinero pendiente de cobro a clientes. Rotación: 15.40 días (cumple meta ISO). Total: $16.785M (-1% vs 2024).')}
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Cartera Promedio</span>
            <DollarSign className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{formatCurrency(promedioCartera)}</div>
          <div className="text-sm text-gray-400 mt-1">Promedio mensual 2025</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal('Índice de Mora', 'Porcentaje de cartera vencida. Corriente: 50.56% | Vencida: 49.44%. Sin deterioro en 2025.')}
          className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-xl rounded-xl p-6 border-4 border-yellow-500/30 hover:border-yellow-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Índice de Mora</span>
            <TrendingDown className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white">{promedioMora.toFixed(1)}%</div>
          <div className="text-sm text-gray-400 mt-1">Promedio anual</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal('Rotación de Cartera', 'Días promedio para cobrar. Meta ISO: ≤30 días. Resultado: 15.40 días (cumple).')}
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Rotación Cartera</span>
            <Calendar className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{promedioRotacion.toFixed(0)} días</div>
          <div className="text-sm text-gray-400 mt-1">Promedio anual</div>
        </motion.div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comparación 2024 vs 2025 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal('Cartera Mensual', 'Evolución del dinero por cobrar cada mes. Compara 2024 vs 2025 para identificar tendencias.')}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-slate-700 hover:border-blue-500 transition-all cursor-pointer"
        >
          <h3 className="text-xl font-bold text-white mb-6">Cartera en Millones de Pesos (2024 vs 2025)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" width={80} />
              <YAxis 
                dataKey="mes" 
                type="category" 
                stroke="#9ca3af" 
                width={60}
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                formatter={(value) => `$${value.toFixed(1)}M`}
              />
              <Legend />
              <Bar dataKey="exp2024" fill="#6366f1" name="2024" radius={[0, 8, 8, 0]} />
              <Bar dataKey="exp2025" fill="#10b981" name="2025" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Evolución Índice de Mora */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => openModal('Índice de Mora Mensual', 'Porcentaje de cartera vencida por mes. Permite detectar meses críticos y tomar acciones.')}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-slate-700 hover:border-yellow-500 transition-all cursor-pointer"
        >
          <h3 className="text-xl font-bold text-white mb-6">Índice de Mora Mensual 2025 (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="mes" stroke="#9ca3af" height={60} style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" width={80} style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                formatter={(value) => `${value.toFixed(1)}%`}
              />
              <Legend />
              <Line type="monotone" dataKey="mora" stroke="#f59e0b" strokeWidth={2} name="Índice Mora %" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Tabla Detallada */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700 overflow-x-auto"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Detalle Mensual de Cartera 2025</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-2 px-4 text-gray-400">Mes</th>
              <th className="text-right py-2 px-4 text-gray-400">Total Cartera</th>
              <th className="text-right py-2 px-4 text-gray-400">Mora %</th>
              <th className="text-right py-2 px-4 text-gray-400">Rotación</th>
              <th className="text-right py-2 px-4 text-gray-400">2024 (M)</th>
              <th className="text-right py-2 px-4 text-gray-400">2025 (M)</th>
              <th className="text-right py-2 px-4 text-gray-400">Var %</th>
            </tr>
          </thead>
          <tbody>
            {carteraData.map((row, idx) => (
              <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                <td className="py-2 px-4 text-white font-medium">{(row.mes || 'N/A').toUpperCase()}</td>
                <td className="py-2 px-4 text-right text-blue-400">{formatCurrency(row.total_cartera)}</td>
                <td className="py-2 px-4 text-right text-yellow-400">{parseFloat(row.indice_mora || 0).toFixed(1)}%</td>
                <td className="py-2 px-4 text-right text-green-400">{parseFloat(row.rotacion_dias || 0).toFixed(0)} días</td>
                <td className="py-2 px-4 text-right text-purple-400">${parseFloat(row.exp_millones_2024 || 0).toFixed(1)}M</td>
                <td className="py-2 px-4 text-right text-green-400">${parseFloat(row.exp_millones_2025 || 0).toFixed(1)}M</td>
                <td className={`py-2 px-4 text-right font-bold ${parseFloat(row.variacion_pct || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {parseFloat(row.variacion_pct || 0) >= 0 ? '+' : ''}{parseFloat(row.variacion_pct || 0).toFixed(0)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Comentarios */}
      {carteraData.some(d => d.comentario) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Análisis y Comentarios</h3>
          <div className="space-y-3">
            {carteraData.filter(d => d.comentario).map((row, idx) => (
              <div key={idx} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <p className="text-gray-300 text-sm leading-relaxed">{row.comentario}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Modal de Explicación */}
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
              className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full border-4 border-blue-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-blue-400" />
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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
