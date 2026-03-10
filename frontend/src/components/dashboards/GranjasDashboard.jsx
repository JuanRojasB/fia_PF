import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Home, TrendingUp, Layers, X, Info } from 'lucide-react';

export default function GranjasDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });
  const hasAnimated = useRef(false);

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  // Validar que data sea un array y filtrar las filas de totales
  const rawData = Array.isArray(data) ? data : (data?.items || []);
  const granjasData = rawData.filter(d => {
    const granja = (d.granja || '').toUpperCase();
    const tipo = (d.tipo || '').toUpperCase();
    return granja !== 'TOTAL' && tipo !== 'TOTAL GENERAL';
  });
  
  if (granjasData.length === 0) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const totalMetros = granjasData.reduce((sum, d) => sum + (parseFloat(d.metros) || 0), 0);
  const totalAves = granjasData.reduce((sum, d) => sum + (parseFloat(d.aves) || 0), 0);
  const totalGranjas = granjasData.length;

  // Cálculos de capacidad - Pollo Fiesta Solo
  const ciclosAnuales = 6.5; // Promedio de ciclos por año
  const capacidadAnual = totalAves * ciclosAnuales;
  const tasaMortalidad = 0.07; // 7%
  const polloSalido = capacidadAnual * (1 - tasaMortalidad);

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const COLORS = {
    'FRIO': '#3b82f6',      // Azul
    'CALIDO': '#10b981',    // Verde
    'CALIENTE': '#eab308'   // Amarillo
  };

  // Tooltip personalizado mejorado
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-4 shadow-2xl">
          <p className="text-white font-bold text-lg mb-3">{data.tipo || data.granja}</p>
          {data.aves && (
            <p className="text-blue-400 text-base mb-1">
              Aves: <span className="font-semibold">{data.aves.toLocaleString('es-ES', { useGrouping: true })}</span>
            </p>
          )}
          {data.metros && (
            <p className="text-green-400 text-base mb-1">
              Metros²: <span className="font-semibold">{data.metros.toLocaleString('es-ES', { useGrouping: true })}</span>
            </p>
          )}
          {data.granjas && (
            <p className="text-purple-400 text-base mb-1">
              Granjas: <span className="font-semibold">{data.granjas}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Agrupar por tipo
  const porTipo = granjasData.reduce((acc, d) => {
    const tipo = d.tipo || 'Sin tipo';
    if (!acc[tipo]) {
      acc[tipo] = { metros: 0, aves: 0, count: 0 };
    }
    acc[tipo].metros += parseFloat(d.metros) || 0;
    acc[tipo].aves += parseFloat(d.aves) || 0;
    acc[tipo].count += 1;
    return acc;
  }, {});

  const tipoData = Object.entries(porTipo).map(([tipo, values]) => ({
    tipo,
    metros: values.metros,
    aves: values.aves,
    granjas: values.count
  }));



  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Total de Granjas Activas',
            `${totalGranjas} instalaciones operativas clasificadas por clima: ${tipoData.map(t => `${t.tipo} (${t.granjas})`).join(', ')}. La diversificación geográfica reduce riesgos operativos (enfermedades, clima) y optimiza costos según condiciones locales.`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Total Granjas</span>
            <Home className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-4xl font-bold text-white mb-1">{totalGranjas}</div>
          <div className="text-xs text-blue-400">Instalaciones activas</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Área Total de Producción',
            `${formatNumber(totalMetros)} m² de galpones en operación. Densidad promedio: ${(totalAves / totalMetros).toFixed(2)} aves/m². La densidad óptima varía según clima: zonas cálidas requieren menor densidad para mejor ventilación, zonas frías permiten mayor densidad. Cumple normativa de bienestar animal.`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Área Total</span>
            <Layers className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{totalMetros.toLocaleString('es-ES')} m²</div>
          <div className="text-xs text-green-400">metros cuadrados</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Capacidad Total de Aves',
            `${formatNumber(totalAves)} aves simultáneas en todas las granjas. Proyección anual: ${formatNumber(totalAves * 6.5 * 0.93)} aves procesadas (6.5 ciclos/año × 93% supervivencia). Cada ciclo dura 45-50 días desde encasetamiento hasta sacrificio. La capacidad real varía según disponibilidad de pollitos, demanda y eventos sanitarios.`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Total Aves</span>
            <TrendingUp className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{totalAves.toLocaleString('es-ES')} aves</div>
          <div className="text-xs text-purple-400">capacidad total</div>
        </motion.div>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por Tipo - Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-slate-700 cursor-pointer hover:border-slate-500 transition-all"
          onClick={() => openModal(
            'Distribución por Tipo de Clima',
            `Clasificación: FRÍO (<18°C), CÁLIDO (18-24°C), CALIENTE (>24°C). Distribución: ${tipoData.map(t => `${t.tipo} ${formatNumber(t.aves)} aves (${((t.aves / totalAves) * 100).toFixed(1)}%)`).join(', ')}. Climas fríos requieren calefacción y permiten mayor densidad. Climas calientes necesitan ventilación intensiva y menor densidad. La diversificación optimiza producción según estación.`
          )}
        >
          <h3 className="text-xl font-bold text-white mb-6">Distribución de Aves por Tipo de Clima</h3>
          <ResponsiveContainer width="100%" height={350} key="pie-chart-clima">
            <PieChart>
              <Pie 
                isAnimationActive={!hasAnimated.current}
                animationBegin={0}
                animationDuration={800}
                onAnimationEnd={() => { hasAnimated.current = true; }}
                data={tipoData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ tipo, percent }) => `${tipo} (${(percent * 100).toFixed(2)}%)`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="aves"
              >
                {tipoData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.tipo] || '#8b5cf6'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Comparación por Tipo - Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-slate-700 cursor-pointer hover:border-slate-500 transition-all"
          onClick={() => openModal(
            'Comparación por Tipo de Clima',
            `Densidad por clima: ${tipoData.map(t => `${t.tipo} ${(t.aves / t.metros).toFixed(2)} aves/m²`).join(', ')}. Climas fríos permiten mayor densidad (aves generan calor). Climas calientes requieren menor densidad (evitar estrés térmico). Densidades optimizadas para maximizar productividad cumpliendo normativa de bienestar animal.`
          )}
        >
          <h3 className="text-xl font-bold text-white mb-6">Comparación por Tipo de Clima (Aves y Área)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={tipoData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="tipo" stroke="#9ca3af" style={{ fontSize: '14px', fontWeight: 'bold' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Bar dataKey="aves" fill="#3b82f6" name="Aves" radius={[8, 8, 0, 0]} />
              <Bar dataKey="metros" fill="#10b981" name="Metros²" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Capacidad por Granja - TOP 10 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <h3 className="text-xl font-bold text-white mb-6">Top 10 Granjas por Número de Aves</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={granjasData.sort((a, b) => (parseFloat(b.aves) || 0) - (parseFloat(a.aves) || 0)).slice(0, 10)} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9ca3af" />
            <YAxis dataKey="granja" type="category" stroke="#9ca3af" width={150} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="aves" name="Aves">
              {granjasData.sort((a, b) => (parseFloat(b.aves) || 0) - (parseFloat(a.aves) || 0)).slice(0, 10).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.tipo] || '#38bdf8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Tabla agrupada por tipo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700 overflow-x-auto"
      >
        <h3 className="text-xl font-bold text-white mb-4">Detalle Completo por Granja</h3>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-600">
              <th className="text-left py-2 px-2 text-gray-300 font-bold">Tipo</th>
              <th className="text-left py-2 px-2 text-gray-300 font-bold">Granja</th>
              <th className="text-right py-2 px-2 text-gray-300 font-bold">Metros²</th>
              <th className="text-right py-2 px-2 text-gray-300 font-bold">Aves</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const grouped = granjasData.reduce((acc, row) => {
                const tipo = row.tipo || 'Sin tipo';
                if (!acc[tipo]) acc[tipo] = [];
                acc[tipo].push(row);
                return acc;
              }, {});

              const rows = [];
              let globalMetros = 0;
              let globalAves = 0;

              // Ordenar los tipos para que aparezcan en orden consistente
              const tiposOrdenados = Object.keys(grouped).sort();

              tiposOrdenados.forEach((tipo) => {
                const granjas = grouped[tipo];
                let tipoMetros = 0;
                let tipoAves = 0;

                // Primero todas las granjas del tipo
                granjas.forEach((row, idx) => {
                  const metros = parseFloat(row.metros) || 0;
                  const aves = parseFloat(row.aves) || 0;
                  
                  tipoMetros += metros;
                  tipoAves += aves;

                  rows.push(
                    <tr key={`${tipo}-${idx}`} className="border-b border-slate-700/20 hover:bg-slate-700/30 transition-colors">
                      <td className="py-0.5 px-2">
                        {idx === 0 && (
                          <span className="inline-block px-1.5 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: COLORS[tipo] + '30', color: COLORS[tipo] }}>
                            {tipo}
                          </span>
                        )}
                      </td>
                      <td className="py-0.5 px-2 text-white">{row.granja || 'Sin nombre'}</td>
                      <td className="py-0.5 px-2 text-right text-green-400 tabular-nums">{metros.toLocaleString('es-ES')}</td>
                      <td className="py-0.5 px-2 text-right text-blue-400 tabular-nums">{aves.toLocaleString('es-ES')}</td>
                    </tr>
                  );
                });

                // Después el subtotal del tipo
                rows.push(
                  <tr key={`subtotal-${tipo}`} className="bg-amber-500/10 border-y border-amber-500/30 font-bold">
                    <td className="py-1 px-2 text-amber-400 text-xs">SUBTOTAL</td>
                    <td className="py-1 px-2 text-amber-400 text-xs">{tipo}</td>
                    <td className="py-1 px-2 text-right text-amber-400 text-xs tabular-nums">{tipoMetros.toLocaleString('es-ES')}</td>
                    <td className="py-1 px-2 text-right text-amber-400 text-xs tabular-nums">{tipoAves.toLocaleString('es-ES')}</td>
                  </tr>
                );

                globalMetros += tipoMetros;
                globalAves += tipoAves;
              });

              // Al final el total general
              rows.push(
                <tr key="total-general" className="bg-blue-600/20 border-t-4 border-blue-500 font-bold text-sm">
                  <td className="py-1.5 px-2 text-blue-200" colSpan="2">TOTAL GENERAL</td>
                  <td className="py-1.5 px-2 text-right text-blue-200 tabular-nums">{globalMetros.toLocaleString('es-ES')}</td>
                  <td className="py-1.5 px-2 text-right text-blue-200 tabular-nums">{globalAves.toLocaleString('es-ES')}</td>
                </tr>
              );

              return rows;
            })()}
          </tbody>
        </table>
      </motion.div>

      {/* Sección de Capacidad - Pollo Fiesta Solo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-xl rounded-xl p-6 border-4 border-slate-600 cursor-pointer hover:border-slate-400 transition-all"
        onClick={() => openModal(
          'Proyección Anual - Pollo Fiesta Solo',
          'Cálculo: Capacidad ('+formatNumber(totalAves)+' aves) × 6.5 ciclos/año × 93% supervivencia = '+formatNumber(capacidadAnual * (1 - tasaMortalidad))+' aves/año. Cada ciclo: 45-50 días engorde + 10 días limpieza. Mortalidad 7% es estándar industria. Proyección teórica máxima; producción real depende de disponibilidad de pollitos, demanda y mantenimientos.'
        )}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Pollo Fiesta Solo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Capacidad */}
          <div className="bg-slate-900/50 rounded-lg p-5 border border-blue-500/30">
            <div className="text-sm text-gray-400 mb-2">Capacidad × Ciclos anuales</div>
            <div className="text-4xl font-bold text-blue-400 mb-1">{formatNumber(capacidadAnual)}</div>
            <div className="text-xs text-gray-500">aves encasetadas/año</div>
          </div>

          {/* Mortalidad */}
          <div className="bg-slate-900/50 rounded-lg p-5 border border-red-500/30">
            <div className="text-sm text-gray-400 mb-2">Mortalidad</div>
            <div className="text-sm text-gray-500 mb-2">Tasa de pérdida estimada</div>
            <div className="text-4xl font-bold text-red-400 mb-1">{(tasaMortalidad * 100).toFixed(0)}%</div>
            <div className="text-xs text-gray-500">promedio anual</div>
          </div>

          {/* Pollo Salido Total */}
          <div className="bg-slate-900/50 rounded-lg p-5 border border-yellow-500/30">
            <div className="text-sm text-gray-400 mb-2">Pollo Salido Total</div>
            <div className="text-4xl font-bold text-yellow-400 mb-1">{formatNumber(polloSalido)}</div>
            <div className="text-xs text-gray-500">aves disponibles</div>
          </div>
        </div>
      </motion.div>

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
