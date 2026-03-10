import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Truck, TrendingUp, Building, X, Info } from 'lucide-react';

export default function LogisticaDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });
  const hasAnimated = useRef(false);

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  // Manejar estructura del backend: { items: [...], totales: {...}, sedes: [...] }
  // o array directo para compatibilidad
  const logisticaData = Array.isArray(data) ? data : (data?.items || []);
  
  console.log('LogisticaDashboard - data recibida:', {
    isArray: Array.isArray(data),
    hasItems: !!data?.items,
    logisticaDataLength: logisticaData.length,
    sample: logisticaData[0],
    totales: data?.totales,
    sedes: data?.sedes
  });
  
  if (logisticaData.length === 0) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return '$0';
    return '$' + new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const conceptosMap = {};
  logisticaData.forEach(d => {
    // Filtrar registros con sede null, undefined o que no sean SEDE1, SEDE2, SEDE3
    const sedeNormalizada = (d.sede || '').toString().trim().toUpperCase();
    if (!sedeNormalizada || sedeNormalizada === 'NULL' || !['SEDE1', 'SEDE2', 'SEDE3'].includes(sedeNormalizada)) return;
    
    const conceptoNormalizado = (d.concepto || '').toString().trim();
    if (!conceptoNormalizado) return;
    
    // Filtrar filas de TOTAL que vienen de la base de datos
    const conceptoUpper = conceptoNormalizado.toUpperCase();
    if (conceptoUpper.includes('TOTAL') || conceptoUpper.includes('GASTOS LOGISTICOS')) return;
    
    const anio = parseInt(d.anio);
    if (anio !== 2024 && anio !== 2025) return;
    
    const key = `${sedeNormalizada}-${conceptoNormalizado}-${anio}`;
    const valor = parseFloat(d.valor) || 0;
    
    // Solo guardar si no existe o si el nuevo valor es diferente de 0
    if (!conceptosMap[key] || valor !== 0) {
      conceptosMap[key] = {
        sede: sedeNormalizada,
        concepto: conceptoNormalizado,
        anio: anio,
        valor: valor
      };
    }
  });
  
  // Reorganizar por concepto y sede
  const conceptosPorSede = {};
  Object.values(conceptosMap).forEach(d => {
    const key = `${d.sede}-${d.concepto}`;
    if (!conceptosPorSede[key]) {
      conceptosPorSede[key] = { sede: d.sede, concepto: d.concepto, valor2024: 0, valor2025: 0 };
    }
    if (d.anio === 2024) conceptosPorSede[key].valor2024 = d.valor;
    else if (d.anio === 2025) conceptosPorSede[key].valor2025 = d.valor;
  });
  
  const conceptosData = Object.values(conceptosPorSede);
  const total2025 = conceptosData.reduce((sum, d) => sum + d.valor2025, 0);
  const total2024 = conceptosData.reduce((sum, d) => sum + d.valor2024, 0);
  const variacionTotal = total2024 > 0 ? (((total2025 - total2024) / total2024) * 100).toFixed(1) : 0;

  const sedesMap = {};
  conceptosData.forEach(d => {
    // Solo incluir SEDE1, SEDE2, SEDE3
    const sedeNormalizada = (d.sede || '').toString().trim().toUpperCase();
    if (!['SEDE1', 'SEDE2', 'SEDE3'].includes(sedeNormalizada)) return;
    
    if (!sedesMap[sedeNormalizada]) sedesMap[sedeNormalizada] = { sede: sedeNormalizada, total2024: 0, total2025: 0 };
    sedesMap[sedeNormalizada].total2024 += d.valor2024;
    sedesMap[sedeNormalizada].total2025 += d.valor2025;
  });
  
  // Ordenar las sedes: SEDE1, SEDE2, SEDE3
  const sedesData = ['SEDE1', 'SEDE2', 'SEDE3']
    .map(sede => sedesMap[sede])
    .filter(Boolean);

  const topConceptos = conceptosData
    .sort((a, b) => b.valor2025 - a.valor2025)
    .slice(0, 8)
    .map(d => ({
      ...d,
      nombre: `${d.sede || 'Sin sede'} - ${(d.concepto || 'Sin concepto').substring(0, 20)}`,
      variacion: d.valor2024 > 0 ? (((d.valor2025 - d.valor2024) / d.valor2024) * 100) : 0
    }));

  const COLORS = ['#38bdf8', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal('Gastos Logísticos', '3M kg/mes, 12 muelles, 197 colaboradores.')}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Total Gastos 2025 ($)</span>
            <Truck className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-4xl font-bold text-white mb-1">{formatCurrency(total2025)}</div>
          <div className={`text-xs ${variacionTotal >= 0 ? 'text-red-400' : 'text-green-400'}`}>
            {variacionTotal > 0 ? '+' : ''}{variacionTotal}% vs 2024
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onClick={() => openModal('Variación Anual', 'Diferencia en gastos 2025 vs 2024.')}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Variación Anual ($)</span>
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-4xl font-bold text-white mb-1">{formatCurrency(Math.abs(total2025 - total2024))}</div>
          <div className={`text-xs ${variacionTotal >= 0 ? 'text-red-400' : 'text-green-400'}`}>
            {variacionTotal >= 0 ? 'Incremento' : 'Reducción'}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          onClick={() => openModal('Sedes Activas', 'Centros de distribución operativos.')}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Sedes</span>
            <Building className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-4xl font-bold text-white mb-1">{sedesData.length}</div>
          <div className="text-xs text-purple-400">Activas</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          onClick={() => openModal('Gastos por Sede', 'Comparación de costos operativos.')}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-slate-700 hover:border-blue-500 transition-all cursor-pointer">
          <h3 className="text-xl font-bold text-white mb-6">Gastos Logísticos por Sede (2024 vs 2025)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={sedesData} margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="sede" stroke="#9ca3af" style={{ fontSize: '14px' }} />
              <YAxis stroke="#9ca3af" width={80} />
              <Tooltip content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
                      <p className="text-white font-semibold mb-2">{payload[0].payload.sede}</p>
                      {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                          {entry.name}: {formatCurrency(entry.value)}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }} />
              <Bar dataKey="total2024" fill="#6366f1" name="2024" radius={[8, 8, 0, 0]} />
              <Bar dataKey="total2025" fill="#10b981" name="2025" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-6">Distribución de Gastos por Sede 2025 (%)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie 
                isAnimationActive={!hasAnimated.current}
                animationBegin={0}
                animationDuration={800}
                onAnimationEnd={() => { hasAnimated.current = true; }}
                data={sedesData} dataKey="total2025" nameKey="sede" cx="50%" cy="50%" outerRadius={120}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}>
                {sedesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
                      <p className="text-white font-semibold">{payload[0].name}</p>
                      <p className="text-green-400">{formatCurrency(payload[0].value)}</p>
                    </div>
                  );
                }
                return null;
              }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Tablas detalladas por sede */}
      {['SEDE1', 'SEDE2', 'SEDE3'].map((sede, idx) => {
        const conceptosSede = conceptosData.filter(d => d.sede === sede);
        if (conceptosSede.length === 0) return null;

        const totalSede2024 = conceptosSede.reduce((sum, d) => sum + d.valor2024, 0);
        const totalSede2025 = conceptosSede.reduce((sum, d) => sum + d.valor2025, 0);
        const variacionSede = totalSede2024 > 0 ? (((totalSede2025 - totalSede2024) / totalSede2024) * 100) : 0;

        return (
          <motion.div
            key={sede}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + idx * 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700 overflow-x-auto"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              GASTOS OPERACIONALES LOGÍSTICOS {sede} AÑO 2024 VS 2025
            </h3>
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
                        <span className={`inline-flex items-center gap-1 ${esIncremento ? 'text-red-400' : 'text-green-400'}`}>
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${esIncremento ? 'bg-red-500' : 'bg-green-500'}`}>
                            {esIncremento ? '↑' : '↓'}
                          </span>
                          {variacion.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-slate-700/50 border-t-2 border-slate-500 font-bold">
                  <td className="py-3 px-4 text-white">TOTAL GASTOS LOGÍSTICOS 2023 VS 2024</td>
                  <td className="py-3 px-4 text-right text-cyan-300 tabular-nums">
                    $ {totalSede2024.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-4 text-right text-orange-300 tabular-nums">
                    $ {totalSede2025.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums">
                    <span className={`inline-flex items-center gap-1 ${variacionSede > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${variacionSede > 0 ? 'bg-red-500' : 'bg-green-500'}`}>
                        {variacionSede > 0 ? '↑' : '↓'}
                      </span>
                      {variacionSede.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        );
      })}

      {/* Tabla consolidada de todas las sedes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700 overflow-x-auto"
      >
        <h3 className="text-xl font-bold text-white mb-4">
          GASTOS OPERACIONALES LOGÍSTICOS SEDES 2024 VS 2025
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cyan-700/50 border-b-2 border-slate-600">
              <th className="text-left py-3 px-4 text-white font-bold">CONCEPTO</th>
              <th className="text-right py-3 px-4 text-white font-bold">TOTAL 2024</th>
              <th className="text-right py-3 px-4 text-white font-bold">TOTAL 2025</th>
              <th className="text-right py-3 px-4 text-white font-bold">% Var 25/24</th>
              <th className="text-center py-3 px-4 text-white font-bold">DISMINUCIÓN O INCREMENTO</th>
              <th className="text-right py-3 px-4 text-white font-bold">INCREMENTO 2025 EN $</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              // Agrupar por concepto sumando todas las sedes
              const consolidado = {};
              conceptosData.forEach(d => {
                if (!consolidado[d.concepto]) {
                  consolidado[d.concepto] = { concepto: d.concepto, valor2024: 0, valor2025: 0 };
                }
                consolidado[d.concepto].valor2024 += d.valor2024;
                consolidado[d.concepto].valor2025 += d.valor2025;
              });

              const consolidadoArray = Object.values(consolidado);
              let totalConsolidado2024 = 0;
              let totalConsolidado2025 = 0;

              return (
                <>
                  {consolidadoArray.map((row, idx) => {
                    totalConsolidado2024 += row.valor2024;
                    totalConsolidado2025 += row.valor2025;
                    const variacion = row.valor2024 > 0 ? (((row.valor2025 - row.valor2024) / row.valor2024) * 100) : 0;
                    const diferencia = row.valor2025 - row.valor2024;
                    const esIncremento = diferencia > 0;

                    return (
                      <tr key={idx} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                        <td className="py-2 px-4 text-white">{row.concepto}</td>
                        <td className="py-2 px-4 text-right text-cyan-300 tabular-nums">
                          $ {row.valor2024.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </td>
                        <td className="py-2 px-4 text-right text-orange-300 tabular-nums">
                          $ {row.valor2025.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </td>
                        <td className="py-2 px-4 text-right tabular-nums">
                          <span className={esIncremento ? 'text-red-400' : 'text-green-400'}>
                            {variacion.toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-2 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 ${esIncremento ? 'text-red-400' : 'text-green-400'}`}>
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${esIncremento ? 'bg-red-500' : 'bg-green-500'}`}>
                              {esIncremento ? '↑' : '↓'}
                            </span>
                            $ {Math.abs(diferencia).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-right text-orange-300 tabular-nums">
                          $ {diferencia.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-slate-700/50 border-t-2 border-slate-500 font-bold">
                    <td className="py-3 px-4 text-white">TOTAL GASTOS LOGÍSTICOS 2023 VS 2024</td>
                    <td className="py-3 px-4 text-right text-cyan-300 tabular-nums">
                      $ {totalConsolidado2024.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-3 px-4 text-right text-orange-300 tabular-nums">
                      $ {totalConsolidado2025.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums">
                      <span className={totalConsolidado2025 > totalConsolidado2024 ? 'text-red-400' : 'text-green-400'}>
                        {(((totalConsolidado2025 - totalConsolidado2024) / totalConsolidado2024) * 100).toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 ${totalConsolidado2025 > totalConsolidado2024 ? 'text-red-400' : 'text-green-400'}`}>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${totalConsolidado2025 > totalConsolidado2024 ? 'bg-red-500' : 'bg-green-500'}`}>
                          {totalConsolidado2025 > totalConsolidado2024 ? '↑' : '↓'}
                        </span>
                        $ {Math.abs(totalConsolidado2025 - totalConsolidado2024).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-orange-300 tabular-nums">
                      $ {(totalConsolidado2025 - totalConsolidado2024).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                </>
              );
            })()}
          </tbody>
        </table>
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
