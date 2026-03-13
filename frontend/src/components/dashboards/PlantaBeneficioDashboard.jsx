import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Factory, TrendingDown, Info, X, Activity, Award } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';

export default function PlantaBeneficioDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '', table: null });

  const openModal = (title, description, table = null) => {
    setModalContent({ title, description, table });
    setModalOpen(true);
  };

  if (!data || !data.avesProcessadasMensual) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const { avesProcessadasMensual, promedioPesos, participacionRangos, descartesKilos, participacionCanal, totales } = data;

  const formatNumber = (value) => {
    return new Intl.NumberFormat('es-CO').format(value);
  };

  const formatDecimal = (value, decimals = 2) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };

  // Preparar datos para gráficos
  const mesesAbrev = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const mesesCompletos = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const datosAvesMensuales = avesProcessadasMensual.map((m, idx) => ({
    mes: mesesAbrev[idx],
    mesCompleto: mesesCompletos[idx],
    '2025': m.aves_2025,
    '2024': m.aves_2024
  }));

  const datosPesosMensuales = promedioPesos.map((m, idx) => ({
    mes: mesesAbrev[idx],
    mesCompleto: mesesCompletos[idx],
    '2025': m.promedio_2025,
    '2024': m.promedio_2024
  }));

  // Datos para participación por rangos (líneas)
  const datosRangos = [
    { rango: '570-1377g', '2024': participacionRangos[0].rango_570_1377, '2025': participacionRangos[1].rango_570_1377 },
    { rango: '1378-1816g (Asadero)', '2024': participacionRangos[0].rango_1378_1816, '2025': participacionRangos[1].rango_1378_1816 },
    { rango: '1817-1928g', '2024': participacionRangos[0].rango_1817_1928, '2025': participacionRangos[1].rango_1817_1928 }
  ];

  // Datos para descartes (barras agrupadas)
  const datosDescartes = descartesKilos.map(d => ({
    categoria: d.categoria.length > 20 ? d.categoria.substring(0, 18) + '...' : d.categoria,
    categoriaCompleta: d.categoria,
    '2024': d.kilos_2024,
    '2025': d.kilos_2025
  }));

  // Datos para participación canal y vísceras (barras agrupadas por año)
  const datosCanal = participacionCanal.map(p => ({
    año: p.anio.toString(),
    'Canal': p.pct_canal,
    'Víscera': p.pct_viscera,
    'Merma': p.merma_planta
  }));

  return (
    <div className="space-y-8">

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal(
            'Total Aves Procesadas 2025',
            `Se procesaron ${formatNumber(totales.totalAves2025)} aves en 2025, con una disminución del 0,77% respecto a 2024 (${formatNumber(totales.totalAves2024)} aves). Los meses de enero y febrero fueron los de menor procesamiento.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Total Aves 2025</span>
            <Factory className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{(totales.totalAves2025 / 1000000).toFixed(2)}M</div>
          <div className="text-sm text-gray-600 mt-1">Aves procesadas</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">vs 2024</div>
            <div className="text-lg font-semibold text-orange-400">-0,77%</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal(
            'Promedio de Peso',
            `El promedio de peso en 2025 fue de ${totales.promedioPeso2025} gramos por ave, con respecto al año 2024 (${totales.promedioPeso2024} gramos), siendo mucho más estable en el año 2025.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Peso Promedio 2025</span>
            <Activity className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{totales.promedioPeso2025}g</div>
          <div className="text-sm text-gray-600 mt-1">Por ave</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">vs 2024</div>
            <div className="text-lg font-semibold text-green-400">{totales.promedioPeso2024}g</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal(
            'Merma de Planta',
            `La merma presenta un descenso favorable pasando del 6,55% en el año 2024 al 5,38% en el año 2025. Esto representa una mejora significativa en la eficiencia operativa.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Merma Planta 2025</span>
            <TrendingDown className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">5,38%</div>
          <div className="text-sm text-gray-600 mt-1">Reducción de merma</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">vs 2024</div>
            <div className="text-lg font-semibold text-green-400">6,55%</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal(
            'Participación Canal + Víscera',
            `La participación de pollo en canal y víscera alcanzó 94,68% en 2025, mostrando incrementos favorables respecto a años anteriores (93,45% en 2024).`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Canal + Víscera</span>
            <Award className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">94,68%</div>
          <div className="text-sm text-gray-600 mt-1">Participación 2025</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">vs 2024</div>
            <div className="text-lg font-semibold text-purple-400">93,45%</div>
          </div>
        </motion.div>
      </div>

      {/* Gráfico 1: Aves Procesadas Mensual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        onClick={() => {
          const tableData = avesProcessadasMensual.map((m, idx) => ({
            'Mes': mesesCompletos[idx],
            '2025': formatNumber(m.aves_2025),
            '2024': formatNumber(m.aves_2024),
            'Diferencia': formatNumber(m.aves_2025 - m.aves_2024)
          }));
          openModal(
            'Aves Procesadas Detalle',
            `En el año 2025 se procesaron en total ${formatNumber(totales.totalAves2025)} aves con una muy leve disminución respecto al año 2024 con un total de ${formatNumber(totales.totalAves2024)} aves, siendo una disminución del 0,77%.`,
            tableData
          );
        }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-2">Aves Procesadas Mensual 2024 vs 2025</h3>
        <p className="text-sm text-gray-600 mb-6">Azul: 2025 • Verde: 2024</p>
        <ResponsiveContainer width="100%" height={450}>
          <LineChart data={datosAvesMensuales} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="mes" 
              stroke="#9ca3af" 
              style={{ fontSize: '12px' }} 
              angle={0}
              textAnchor="middle"
              height={60}
              interval={0}
            />
            <YAxis stroke="#9ca3af" tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} style={{ fontSize: '13px' }} />
            <Tooltip
              contentStyle={{ 
                backgroundcolor: '#1f2937', 
                border: '2px solid #3b82f6', 
                borderRadius: '8px',
                fontSize: '14px',
                padding: '12px'
              }}
              labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
              itemStyle={{ color: '#374151' }}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.mesCompleto;
                }
                return label;
              }}
              formatter={(value) => [formatNumber(value) + ' aves', '']}
            />
            <Line type="monotone" dataKey="2025" stroke="#3b82f6" strokeWidth={3} name="2025" />
            <Line type="monotone" dataKey="2024" stroke="#10b981" strokeWidth={2} name="2024" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Gráfico 2: Promedio de Pesos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        onClick={() => {
          const tableData = promedioPesos.map((m, idx) => ({
            'Mes': mesesCompletos[idx],
            '2025': `${m.promedio_2025}g`,
            '2024': `${m.promedio_2024}g`,
            'Diferencia': `${m.promedio_2025 - m.promedio_2024}g`
          }));
          openModal(
            'Promedio de Pesos Detalle',
            `Con relación al promedio de rangos se nota un mejor comportamiento durante el año 2025 con un promedio de peso de aves de ${totales.promedioPeso2025} gramos por ave, con respecto al año 2024 el promedio es de ${totales.promedioPeso2024} gramos siendo mucho más estable en el año 2025.`,
            tableData
          );
        }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-2">Promedio de Peso por Ave Mensual</h3>
        <p className="text-sm text-gray-600 mb-6">Peso en gramos • Más estable en 2025</p>
        <ResponsiveContainer width="100%" height={450}>
          <LineChart data={datosPesosMensuales} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="mes" 
              stroke="#9ca3af" 
              style={{ fontSize: '12px' }} 
              angle={0}
              textAnchor="middle"
              height={60}
              interval={0}
            />
            <YAxis stroke="#9ca3af" tickFormatter={(v) => `${v}g`} style={{ fontSize: '13px' }} domain={[1850, 2050]} />
            <Tooltip
              contentStyle={{ 
                backgroundcolor: '#1f2937', 
                border: '2px solid #3b82f6', 
                borderRadius: '8px',
                fontSize: '14px',
                padding: '12px'
              }}
              labelStyle={{ color: '#1f2937' }}
              itemStyle={{ color: '#1f2937' }}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.mesCompleto;
                }
                return label;
              }}
              formatter={(value) => [`${value}g`, '']}
            />
            <Line type="monotone" dataKey="2025" stroke="#3b82f6" strokeWidth={3} name="2025" />
            <Line type="monotone" dataKey="2024" stroke="#10b981" strokeWidth={2} name="2024" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Gráfico 3: Participación por Rangos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-yellow-500/30 hover:border-yellow-500 transition-all cursor-pointer"
        onClick={() => {
          const tableData = participacionRangos.map(p => ({
            'Año': p.anio,
            '570-1377g': `${p.rango_570_1377}%`,
            '1378-1816g (Asadero)': `${p.rango_1378_1816}%`,
            '1817-1928g': `${p.rango_1817_1928}%`
          }));
          openModal(
            'Participación por Rangos',
            'En la participación por rangos se observa que se mantiene en porcentajes de participación prácticamente iguales siendo los rangos de pollo asadero (1378-1816g) los de mayor participación con 50,96% en 2024 y 49,42% en el año 2025.',
            tableData
          );
        }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-2">Participación por Rangos de Peso</h3>
        <p className="text-sm text-gray-600 mb-6">Distribución de aves por categoría de peso</p>
        <ResponsiveContainer width="100%" height={450}>
          <LineChart data={datosRangos} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="rango" 
              stroke="#9ca3af" 
              style={{ fontSize: '12px' }} 
              angle={0}
              textAnchor="middle"
              height={60}
              interval={0}
            />
            <YAxis stroke="#9ca3af" tickFormatter={(v) => `${v}%`} style={{ fontSize: '13px' }} />
            <Tooltip
              contentStyle={{ 
                backgroundcolor: '#1f2937', 
                border: '2px solid #3b82f6', 
                borderRadius: '8px',
                fontSize: '14px',
                padding: '12px'
              }}
              labelStyle={{ color: '#1f2937' }}
              itemStyle={{ color: '#1f2937' }}
              formatter={(value) => [`${value}%`, '']}
            />
            <Legend />
            <Line type="monotone" dataKey="2024" stroke="#10b981" strokeWidth={3} name="2024" />
            <Line type="monotone" dataKey="2025" stroke="#3b82f6" strokeWidth={3} name="2025" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Gráfico 4: Descartes en Kilos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer"
        onClick={() => {
          const tableData = descartesKilos.map(d => ({
            'Categoría': d.categoria,
            '2024': formatNumber(d.kilos_2024),
            '2025': formatNumber(d.kilos_2025),
            'Variación': `${d.variacion_pct > 0 ? '+' : ''}${d.variacion_pct}%`
          }));
          openModal(
            'Descartes Detallado',
            'Los descartes durante el año 2025 presentan decrementos representativos en pollos ahogados con descenso de 120.230 kilos en 2024 a 78.088 kilos en 2025 (reducción del 35,1%). Se aprecian incrementos importantes en aves descartadas por granjas pasando de 116.105,3 kilos en 2024 a 176.136,3 kilos en 2025 con un incremento del 51,7%.',
            tableData
          );
        }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-2">Descartes en Kilos - Análisis 2024 vs 2025</h3>
        <p className="text-sm text-gray-600 mb-6">Azul: 2024 • Naranja: 2025</p>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={datosDescartes} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="categoria" 
              stroke="#9ca3af" 
              style={{ fontSize: '11px' }} 
              angle={0}
              textAnchor="middle"
              height={60}
              interval={0}
            />
            <YAxis stroke="#9ca3af" tickFormatter={(v) => formatNumber(v)} style={{ fontSize: '13px' }} />
            <Tooltip
              contentStyle={{ 
                backgroundcolor: '#1f2937', 
                border: '2px solid #3b82f6', 
                borderRadius: '8px',
                fontSize: '14px',
                padding: '12px'
              }}
              labelStyle={{ color: '#1f2937' }}
              itemStyle={{ color: '#1f2937' }}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.categoriaCompleta;
                }
                return label;
              }}
              formatter={(value) => [formatNumber(value) + ' kg', '']}
            />
            <Legend />
            <Bar dataKey="2024" fill="#3b82f6" name="2024" radius={[8, 8, 0, 0]} />
            <Bar dataKey="2025" fill="#f97316" name="2025" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Gráfico 5: Participación Canal y Vísceras - Histórico */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
        onClick={() => {
          const tableData = participacionCanal.map(p => ({
            'Año': p.anio,
            '% Canal': `${p.pct_canal}%`,
            '% Víscera': `${p.pct_viscera}%`,
            'Merma': `${p.merma_planta}%`,
            'Hidratación': `${p.hidratacion}%`,
            'Canal+Víscera': `${p.canal_viscera}%`
          }));
          openModal(
            'Rendimiento Operativo',
            'Los resultados operativos de la planta de beneficio se mantienen en valores muy similares a los obtenidos en años anteriores, mostrando incrementos favorables en la participación de pollo en canal, hidratación y participación de pollo en canal y víscera. La merma presenta un descenso pasando del 6,55% en el año 2024 al 5,38% en el año 2025.',
            tableData
          );
        }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-2">Participación Canal y Vísceras - Histórico 2021-2025</h3>
        <p className="text-sm text-gray-600 mb-6">Evolución de rendimientos operativos</p>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={datosCanal} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="año" stroke="#9ca3af" style={{ fontSize: '13px' }} />
            <YAxis stroke="#9ca3af" tickFormatter={(v) => `${v}%`} style={{ fontSize: '13px' }} />
            <Tooltip
              contentStyle={{ 
                backgroundcolor: '#1f2937', 
                border: '2px solid #3b82f6', 
                borderRadius: '8px',
                fontSize: '14px',
                padding: '12px'
              }}
              labelStyle={{ color: '#1f2937' }}
              itemStyle={{ color: '#1f2937' }}
              formatter={(value) => [`${value}%`, '']}
            />
            <Legend />
            <Bar dataKey="Canal" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Víscera" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Merma" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
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
              className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-cyan-500 shadow-2xl"
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
              <div className="text-gray-700 leading-relaxed mb-4">{modalContent.description}</div>
              
              {/* Tabla de datos */}
              {modalContent.table && modalContent.table.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-bold text-white mb-3">Datos Detallados</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-600">
                          {Object.keys(modalContent.table[0]).map((key) => (
                            <th key={key} className="text-left py-3 px-4 text-cyan-400 font-semibold">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {modalContent.table.map((row, idx) => (
                          <tr key={idx} className="border-b border-gray-300 hover:bg-gray-50">
                            {Object.values(row).map((value, i) => (
                              <td key={i} className="py-3 px-4 text-gray-700">
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

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

