import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, X, Info, ArrowUp, ArrowDown } from 'lucide-react';

export default function ComprasDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  if (!data || !data.comprasMensuales) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const { comprasMensuales, totales, mesesMayorCrecimiento, mesesCaidas2024 } = data;

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return '$0';
    const millones = parseFloat(value) / 1000000;
    return `$${millones.toFixed(1)}M`;
  };

  const formatCurrencyFull = (value) => {
    if (!value || isNaN(value)) return '$0';
    return '$' + new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parseFloat(value));
  };

  // Preparar datos para gráficos
  const mesesCompletos = {
    'Ene': 'Enero', 'Feb': 'Febrero', 'Mar': 'Marzo', 'Abr': 'Abril',
    'May': 'Mayo', 'Jun': 'Junio', 'Jul': 'Julio', 'Ago': 'Agosto',
    'Sep': 'Septiembre', 'Oct': 'Octubre', 'Nov': 'Noviembre', 'Dic': 'Diciembre'
  };

  const datosComparativo = comprasMensuales.map(m => ({
    mes: m.mes.substring(0, 3),
    mesCompleto: m.mes,
    '2025': parseFloat(m.compras) / 1000000,
    '2024': parseFloat(m.compras2024) / 1000000,
    '2023': parseFloat(m.compras2023) / 1000000
  }));

  const datosVariacion = comprasMensuales.map(m => ({
    mes: m.mes.substring(0, 3),
    mesCompleto: m.mes,
    variacion: parseFloat(m.variacion2025vs2024)
  }));

  return (
    <div className="space-y-6">

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal('Total Compras 2025', `Total: ${formatCurrencyFull(totales.total2025)}. Crecimiento del ${totales.variacion2025vs2024}% vs 2024.`)}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">Total Compras 2025</span>
            <ShoppingCart className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(totales.total2025)}</div>
          <div className="text-xs text-gray-600">Compras totales</div>
          <div className="text-xs text-blue-400 mt-1">vs ${formatCurrency(totales.total2024)} (2024)</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal('Crecimiento 2025', `Compras: ${formatCurrency(totales.total2024)} → ${formatCurrency(totales.total2025)} (+${totales.variacion2025vs2024}%). Crecimiento sólido después del ajuste de 2024.`)}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">Crecimiento 2025</span>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">+{totales.variacion2025vs2024}%</div>
          <div className="text-xs text-gray-600">vs 2024</div>
          <div className="text-xs text-green-400 mt-1">Crecimiento sólido</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal('Ajuste 2024', `Caída de ${totales.variacion2024vs2023}% en 2024 vs 2023. Compras: ${formatCurrency(totales.total2023)} → ${formatCurrency(totales.total2024)}. Año de ajuste.`)}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">Ajuste 2024</span>
            <TrendingDown className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">{totales.variacion2024vs2023}%</div>
          <div className="text-xs text-gray-600">vs 2023</div>
          <div className="text-xs text-orange-400 mt-1">Año de ajuste</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal('Promedio Mensual', `Promedio: ${formatCurrency(totales.total2025 / 12)} por mes. Meses más altos: Octubre, Septiembre, Agosto.`)}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">Promedio Mensual</span>
            <DollarSign className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(totales.total2025 / 12)}</div>
          <div className="text-xs text-gray-600">Por mes 2025</div>
          <div className="text-xs text-purple-400 mt-1">12 meses</div>
        </motion.div>
      </div>

      {/* Meses Destacados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Análisis de Crecimiento 2025</h3>
            <p className="text-sm text-gray-400 mt-1">Meses con mayor aumento vs 2024</p>
          </div>
          <button onClick={() => openModal('Meses Destacados', 'Los meses con mayor crecimiento anual 2024→2025 fueron: Octubre (+49.83%), Agosto (+35.59%) y Septiembre (+31.87%). Estos tres meses explican gran parte del crecimiento total en 2025, sugiriendo un restablecimiento de la demanda o un mejor flujo de abastecimiento.')} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <Info className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mesesMayorCrecimiento.map((mes, idx) => (
            <div key={idx} className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl p-5 border-2 border-green-500/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-bold text-green-400">{mes.mes}</h4>
                <ArrowUp className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">+{mes.variacion}%</div>
              <div className="text-xs text-gray-400">Crecimiento vs 2024</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Gráfico Comparativo Anual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Comparativo Mensual 2023-2025</h3>
            <p className="text-xs text-gray-400 mt-1">Evolución de compras por mes (en millones)</p>
          </div>
          <button onClick={() => openModal('Evolución Anual', 'Comparación de compras mensuales entre 2023, 2024 y 2025. Se observa que 2024 fue un año de contracción (-2.97%), mientras que 2025 muestra una recuperación del +9.66%. Los meses de mayor actividad en 2025 fueron Octubre, Septiembre y Agosto.')} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <Info className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={450}>
          <LineChart data={datosComparativo} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="mes" 
              stroke="#9ca3af" 
              style={{ fontSize: '12px' }} 
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#9ca3af" tickFormatter={(v) => `$${v}M`} style={{ fontSize: '13px' }} />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #475569', 
                borderRadius: '8px',
                fontSize: '14px',
                padding: '12px',
                color: '#ffffff'
              }}
              labelStyle={{ color: '#ffffff' }}
              itemStyle={{ color: '#ffffff' }}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.mesCompleto;
                }
                return label;
              }}
              formatter={(value, name) => [`$${value.toFixed(1)}M`, name]}
            />
            <Line type="monotone" dataKey="2025" stroke="#3b82f6" strokeWidth={3} name="2025" />
            <Line type="monotone" dataKey="2024" stroke="#10b981" strokeWidth={2} name="2024" />
            <Line type="monotone" dataKey="2023" stroke="#f59e0b" strokeWidth={2} name="2023" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Gráfico de Variación Mensual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Variación Mensual 2025 vs 2024</h3>
            <p className="text-xs text-gray-400 mt-1">Porcentaje de crecimiento o caída por mes</p>
          </div>
          <button onClick={() => openModal('Variación Mensual', 'La mayoría de los meses en 2025 presentan crecimientos positivos respecto a 2024. Los meses con mayor crecimiento fueron Octubre (+49.83%), Agosto (+35.59%) y Septiembre (+31.87%). Solo algunos meses presentaron caídas: Febrero (-17.97%), Abril (-17.32%) y Julio (-6.26%).')} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <Info className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={datosVariacion} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="mes" 
              stroke="#9ca3af" 
              style={{ fontSize: '12px' }} 
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#9ca3af" 
              tickFormatter={(v) => `${v}%`} 
              style={{ fontSize: '13px' }}
              domain={[-25, 55]}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #475569', 
                borderRadius: '8px',
                fontSize: '14px',
                padding: '12px',
                color: '#ffffff'
              }}
              labelStyle={{ color: '#ffffff' }}
              itemStyle={{ color: '#ffffff' }}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.mesCompleto;
                }
                return label;
              }}
              formatter={(value) => [`${value.toFixed(2)}%`, 'Variación']}
            />
            <Bar dataKey="variacion" radius={[8, 8, 0, 0]}>
              {datosVariacion.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.variacion >= 0 ? '#10b981' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Análisis de Contracción 2024 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Meses con Mayor Caída 2024 vs 2023</h3>
            <p className="text-sm text-gray-400 mt-1">Análisis del año de ajuste</p>
          </div>
          <button onClick={() => openModal('Contracción 2024', 'Los descensos más fuertes entre 2023 y 2024 se observaron en: Agosto (-30.83%), Marzo (-28.25%) y Enero (-21.00%). Esto refuerza que 2024 fue un año con contracción. Sin embargo, estos mismos meses lograron recuperarse con fuerza en 2025.')} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <Info className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mesesCaidas2024.map((mes, idx) => (
            <div key={idx} className="bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-xl p-5 border-2 border-red-500/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-bold text-red-400">{mes.mes}</h4>
                <ArrowDown className="w-6 h-6 text-red-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">{mes.variacion}%</div>
              <div className="text-xs text-gray-400">Caída 2024 vs 2023</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Conclusiones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl p-5 border border-green-500/30"
        >
          <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Crecimiento 2025
          </h4>
          <div className="space-y-2 text-sm text-gray-300">
            <div>• Crecimiento total: +9.66% vs 2024</div>
            <div>• Octubre: +49.83% (mayor aumento)</div>
            <div>• Agosto: +35.59% (crecimiento fuerte)</div>
            <div>• Septiembre: +31.87% (demanda sostenida)</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl p-5 border border-blue-500/30"
        >
          <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Alcance del Proceso
          </h4>
          <div className="space-y-2 text-sm text-gray-300">
            <div>• Suministro oportuno de materias primas</div>
            <div>• Optimización de costos operativos</div>
            <div>• Gestión estratégica de proveedores</div>
            <div>• Excluye: alimento, gas, pollo en pie, pollito</div>
          </div>
        </motion.div>
      </div>

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
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-gray-300 leading-relaxed">{modalContent.description}</div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors">
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
