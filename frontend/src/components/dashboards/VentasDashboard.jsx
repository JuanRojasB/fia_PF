import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Award, X, Info } from 'lucide-react';

export default function VentasDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });
  const hasAnimated = useRef(false);

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  // Handle both array and object with items structure
  const salesData = Array.isArray(data) ? data : (data?.items || []);
  
  // Filter for product sales data from asadero
  const ventasData = salesData.filter(item => 
    item.sede === 'ASADERO' && 
    item.categoria === 'VENTA_PRODUCTO' &&
    item.linea && 
    !item.linea.includes('TOTAL')
  );

  if (!ventasData || ventasData.length === 0) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }
  
  // Group by product (linea) and year
  const productMap = {};
  ventasData.forEach(item => {
    const producto = item.linea;
    const anio = parseInt(item.anio);
    const kg = parseFloat(item.kg) || 0;
    const participacion = parseFloat(item.participacion_pct) || 0;
    
    if (!productMap[producto]) {
      productMap[producto] = {
        producto,
        temperatura: producto.includes('CONGELADO') ? 'CONGELADO' : 'REFRIGERADO',
        kls_2025: 0,
        kls_2024: 0,
        part_2025: 0,
        part_2024: 0
      };
    }
    
    if (anio === 2025) {
      productMap[producto].kls_2025 = kg;
      productMap[producto].part_2025 = participacion;
    } else if (anio === 2024) {
      productMap[producto].kls_2024 = kg;
      productMap[producto].part_2024 = participacion;
    }
  });
  
  const processedData = Object.values(productMap).map(item => ({
    ...item,
    var_percent: item.kls_2024 > 0 
      ? (((item.kls_2025 - item.kls_2024) / item.kls_2024) * 100).toFixed(2)
      : 0
  }));

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value) => {
    if (!value || isNaN(value)) return '0.00%';
    return `${parseFloat(value).toFixed(2)}%`;
  };

  const COLORS = ['#38bdf8', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];

  // Calcular totales
  const total2025 = processedData.reduce((sum, d) => sum + (parseFloat(d.kls_2025) || 0), 0);
  const total2024 = processedData.reduce((sum, d) => sum + (parseFloat(d.kls_2024) || 0), 0);
  const variacionTotal = total2024 > 0 ? (((total2025 - total2024) / total2024) * 100).toFixed(2) : 0;
  
  // Agrupar por temperatura (REFRIGERADO/CONGELADO)
  const porTemperatura = processedData.reduce((acc, d) => {
    const temp = d.temperatura || 'Sin clasificar';
    if (!acc[temp]) {
      acc[temp] = { temperatura: temp, kls_2025: 0, kls_2024: 0, count: 0 };
    }
    acc[temp].kls_2025 += parseFloat(d.kls_2025) || 0;
    acc[temp].kls_2024 += parseFloat(d.kls_2024) || 0;
    acc[temp].count += 1;
    return acc;
  }, {});

  const temperaturaData = Object.values(porTemperatura);

  // Top productos por ventas 2025
  const topProductos = [...processedData]
    .sort((a, b) => (parseFloat(b.kls_2025) || 0) - (parseFloat(a.kls_2025) || 0))
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal('Total Ventas 2025', `Total de kilogramos vendidos en 2025: ${formatNumber(total2025)} Kls`)}
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Ventas 2025</span>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{formatNumber(total2025)} Kls</div>
          <div className="text-sm text-gray-400 mt-1">Kilogramos vendidos</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal('Total Ventas 2024', `Total de kilogramos vendidos en 2024: ${formatNumber(total2024)} Kls`)}
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Ventas 2024</span>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{formatNumber(total2024)} Kls</div>
          <div className="text-sm text-gray-400 mt-1">Año anterior</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal('Variación Anual', `Cambio en ventas 2025 vs 2024: ${variacionTotal}%`)}
          className={`bg-gradient-to-br ${parseFloat(variacionTotal) >= 0 ? 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 hover:border-emerald-500' : 'from-red-500/20 to-red-600/20 border-red-500/30 hover:border-red-500'} backdrop-blur-xl rounded-xl p-6 border-4 transition-all cursor-pointer`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Variación</span>
            <Target className={`w-5 h-5 ${parseFloat(variacionTotal) >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
          </div>
          <div className={`text-2xl font-bold ${parseFloat(variacionTotal) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {parseFloat(variacionTotal) > 0 ? '+' : ''}{variacionTotal}%
          </div>
          <div className="text-sm text-gray-400 mt-1">vs 2024</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal('Productos Activos', `Total de productos/categorías en venta: ${processedData.length}`)}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Productos</span>
            <Award className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{processedData.length}</div>
          <div className="text-sm text-gray-400 mt-1">Categorías activas</div>
        </motion.div>
      </div>

      {/* Top 10 Productos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={() => openModal('Top Productos', 'Productos con mayores ventas en kilogramos durante 2025')}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-slate-700 hover:border-blue-500 transition-all cursor-pointer"
      >
        <h3 className="text-xl font-bold text-white mb-6">Top 10 Productos por Ventas 2025 (Kilogramos)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={topProductos} layout="vertical" margin={{ left: 150, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9ca3af" />
            <YAxis 
              dataKey="producto" 
              type="category" 
              stroke="#9ca3af" 
              width={140}
              style={{ fontSize: '11px' }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              formatter={(value) => formatNumber(value) + ' Kls'}
            />
            <Legend />
            <Bar dataKey="kls_2025" fill="#10b981" name="2025 (Kls)" radius={[0, 8, 8, 0]} />
            <Bar dataKey="kls_2024" fill="#6366f1" name="2024 (Kls)" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Distribución por Temperatura */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => openModal('Distribución por Temperatura', 'Ventas agrupadas por tipo de producto: Refrigerado vs Congelado')}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-slate-700 hover:border-cyan-500 transition-all cursor-pointer"
        >
          <h3 className="text-xl font-bold text-white mb-6">Distribución por Temperatura 2025</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                isAnimationActive={!hasAnimated.current}
                animationBegin={0}
                animationDuration={800}
                onAnimationEnd={() => { hasAnimated.current = true; }}
                data={temperaturaData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ temperatura, kls_2025 }) => `${temperatura}: ${formatNumber(kls_2025)} Kls`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="kls_2025"
              >
                {temperaturaData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatNumber(value) + ' Kls'} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Comparación por Temperatura */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-xl font-bold text-white mb-6">Comparación 2024 vs 2025 por Temperatura</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={temperaturaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="temperatura" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                formatter={(value) => formatNumber(value) + ' Kls'}
              />
              <Legend />
              <Bar dataKey="kls_2024" fill="#6366f1" name="2024" radius={[8, 8, 0, 0]} />
              <Bar dataKey="kls_2025" fill="#10b981" name="2025" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Tabla detallada */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700 overflow-x-auto"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Detalle Completo de Productos</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b-2 border-slate-700">
              <th className="text-left py-3 px-3 text-gray-400 font-bold">Temperatura</th>
              <th className="text-left py-3 px-3 text-gray-400 font-bold">Producto</th>
              <th className="text-right py-3 px-3 text-gray-400 font-bold">Kls 2025</th>
              <th className="text-right py-3 px-3 text-gray-400 font-bold">% Part 2025</th>
              <th className="text-right py-3 px-3 text-gray-400 font-bold">Kls 2024</th>
              <th className="text-right py-3 px-3 text-gray-400 font-bold">% Part 2024</th>
              <th className="text-right py-3 px-3 text-gray-400 font-bold">Variación</th>
              <th className="text-right py-3 px-3 text-gray-400 font-bold">% Var</th>
            </tr>
          </thead>
          <tbody>
            {processedData.map((row, idx) => {
              const variacion = (parseFloat(row.kls_2025) || 0) - (parseFloat(row.kls_2024) || 0);
              const pctVar = parseFloat(row.var_percent) || 0;
              
              return (
                <tr key={idx} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                  <td className="py-2 px-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      row.temperatura === 'REFRIGERADO' ? 'bg-blue-500/20 text-blue-400' : 'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      {row.temperatura}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-white font-medium">{row.producto}</td>
                  <td className="py-2 px-3 text-right text-green-400 tabular-nums">{formatNumber(row.kls_2025)}</td>
                  <td className="py-2 px-3 text-right text-green-300 tabular-nums">{formatPercent(row.part_2025)}</td>
                  <td className="py-2 px-3 text-right text-indigo-400 tabular-nums">{formatNumber(row.kls_2024)}</td>
                  <td className="py-2 px-3 text-right text-indigo-300 tabular-nums">{formatPercent(row.part_2024)}</td>
                  <td className={`py-2 px-3 text-right tabular-nums ${variacion >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {variacion >= 0 ? '+' : ''}{formatNumber(variacion)}
                  </td>
                  <td className={`py-2 px-3 text-right font-bold tabular-nums ${pctVar >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {pctVar >= 0 ? '+' : ''}{pctVar.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
