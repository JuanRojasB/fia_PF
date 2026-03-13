import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Truck, TrendingUp, Building, X, Info, Users, Package, DollarSign, TrendingDown } from 'lucide-react';

export default function GestionLogisticaDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '', showTable: false });
  const hasAnimated = useRef(false);

  const openModal = (title, description, showTable = false) => {
    setModalContent({ title, description, showTable });
    setModalOpen(true);
  };

  // Manejar estructura del backend
  const logisticaData = Array.isArray(data) ? data : (data?.items || []);
  
  if (logisticaData.length === 0) {
    return <div className="text-gray-600">No hay datos disponibles</div>;
  }

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return '$0';
    return '$' + new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Procesar datos por sede y concepto
  const conceptosMap = {};
  logisticaData.forEach(d => {
    const sedeNormalizada = (d.sede || '').toString().trim().toUpperCase();
    if (!sedeNormalizada || sedeNormalizada === 'NULL' || !['SEDE1', 'SEDE2', 'SEDE3'].includes(sedeNormalizada)) return;
    
    const conceptoNormalizado = (d.concepto || '').toString().trim();
    if (!conceptoNormalizado) return;
    
    const conceptoUpper = conceptoNormalizado.toUpperCase();
    if (conceptoUpper.includes('TOTAL') || conceptoUpper.includes('GASTOS LOGISTICOS')) return;
    
    const anio = parseInt(d.anio);
    if (anio !== 2024 && anio !== 2025) return;
    
    const key = `${sedeNormalizada}-${conceptoNormalizado}-${anio}`;
    const valor = parseFloat(d.valor) || 0;
    
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
  const variacionTotal = total2024 > 0 ? (((total2025 - total2024) / total2024) * 100).toFixed(2) : 0;

  // Datos por sede
  const sedesMap = {};
  conceptosData.forEach(d => {
    const sedeNormalizada = (d.sede || '').toString().trim().toUpperCase();
    if (!['SEDE1', 'SEDE2', 'SEDE3'].includes(sedeNormalizada)) return;
    
    if (!sedesMap[sedeNormalizada]) sedesMap[sedeNormalizada] = { sede: sedeNormalizada, total2024: 0, total2025: 0 };
    sedesMap[sedeNormalizada].total2024 += d.valor2024;
    sedesMap[sedeNormalizada].total2025 += d.valor2025;
  });
  
  const sedesData = ['SEDE1', 'SEDE2', 'SEDE3']
    .map(sede => sedesMap[sede])
    .filter(Boolean)
    .map(s => ({
      ...s,
      variacion: s.total2024 > 0 ? (((s.total2025 - s.total2024) / s.total2024) * 100).toFixed(2) : 0
    }));

  // Consolidado por concepto
  const consolidado = {};
  conceptosData.forEach(d => {
    if (!consolidado[d.concepto]) {
      consolidado[d.concepto] = { concepto: d.concepto, valor2024: 0, valor2025: 0 };
    }
    consolidado[d.concepto].valor2024 += d.valor2024;
    consolidado[d.concepto].valor2025 += d.valor2025;
  });

  const consolidadoArray = Object.values(consolidado).map(c => ({
    ...c,
    variacion: c.valor2024 > 0 ? (((c.valor2025 - c.valor2024) / c.valor2024) * 100).toFixed(2) : 0,
    diferencia: c.valor2025 - c.valor2024
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-6 border-2 border-purple-500/30"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-4">
          <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">GESTIÓN LOGÍSTICA - ANÁLISIS CONSOLIDADO</h2>
        </div>
        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
          Análisis consolidado de la gestión logística de las sedes operativas de Pollo Fiesta, comparando el desempeño y la eficiencia del gasto 2024 vs. 2025.
        </p>
      </motion.div>

      {/* KPIs Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal(
            'Total Consolidado 2025',
            `Total consolidado de gastos operacionales logísticos de las 3 sedes para 2025: ${formatCurrency(total2025)}. La variación del ${variacionTotal}% vs 2024 refleja el crecimiento operativo de Sede 2 y Sede 3, compensado parcialmente por la optimización en Sede 1.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Total Gastos Operacionales 2025</span>
            <DollarSign className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(total2025)}</div>
          <div className={`text-xs ${parseFloat(variacionTotal) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
            {variacionTotal > 0 ? '+' : ''}{variacionTotal}% vs 2024
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal(
            'Sede 1 - Pollo Asadero',
            `Gastos operacionales logísticos Sede 1 para 2025: ${formatCurrency(sedesData[0]?.total2025 || 0)}. La variación del ${sedesData[0]?.variacion || 0}% vs 2024 representa una reducción controlada gracias a la optimización de fletes y reducción de personal de postproceso por la unificación de procesos en Sede 3.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Sede 1 - Gastos Operacionales</span>
            <Building className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(sedesData[0]?.total2025 || 0)}</div>
          <div className={`text-xs ${parseFloat(sedesData[0]?.variacion || 0) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
            {sedesData[0]?.variacion || 0}% vs 2024
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal(
            'Sede 2 - Productos Congelados',
            `Gastos operacionales logísticos Sede 2 para 2025: ${formatCurrency(sedesData[1]?.total2025 || 0)}. El incremento del ${sedesData[1]?.variacion || 0}% vs 2024 está directamente relacionado con el crecimiento del 31.3% en ventas, principalmente por mayor capacidad instalada y personal para atender la demanda de D1 y ARA.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Sede 2 - Gastos Operacionales</span>
            <Building className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(sedesData[1]?.total2025 || 0)}</div>
          <div className={`text-xs ${parseFloat(sedesData[1]?.variacion || 0) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
            {sedesData[1]?.variacion || 0}% vs 2024
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal(
            'Sede 3 - Clientes Institucionales',
            `Gastos operacionales logísticos Sede 3 para 2025: ${formatCurrency(sedesData[2]?.total2025 || 0)}. El incremento del ${sedesData[2]?.variacion || 0}% vs 2024 refleja el crecimiento operativo y la consolidación de procesos, principalmente por personal de postproceso (+23.43%) y fletes (+28.17%) para atender clientes institucionales.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Sede 3 - Gastos Operacionales</span>
            <Building className="w-6 h-6 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(sedesData[2]?.total2025 || 0)}</div>
          <div className={`text-xs ${parseFloat(sedesData[2]?.variacion || 0) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
            {sedesData[2]?.variacion || 0}% vs 2024
          </div>
        </motion.div>
      </div>

      {/* Gráfico Comparativo por Sede */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={() => openModal(
          'Comparativa por Sede 2024 vs 2025',
          `Análisis comparativo de gastos operacionales logísticos por sede. Sede 1: ${formatCurrency(sedesData[0]?.total2025 || 0)} (${sedesData[0]?.variacion || 0}% vs 2024) - Reducción por optimización de fletes y personal. Sede 2: ${formatCurrency(sedesData[1]?.total2025 || 0)} (${sedesData[1]?.variacion || 0}% vs 2024) - Incremento por crecimiento del 31.3% en ventas. Sede 3: ${formatCurrency(sedesData[2]?.total2025 || 0)} (${sedesData[2]?.variacion || 0}% vs 2024) - Crecimiento operativo y consolidación de procesos.`
        )}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200 hover:border-purple-500 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Gastos Operacionales Logísticos por Sede 2024 vs 2025</h3>
          <Info className="w-5 h-5 text-purple-400 animate-pulse" />
        </div>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={sedesData} margin={{ top: 20, right: 30, bottom: 20, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="sede" 
              stroke="#9ca3af"
            />
            <YAxis 
              stroke="#9ca3af" 
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-xl">
                    <p className="text-gray-900 font-semibold mb-2">{data.sede}</p>
                    <p className="text-sm text-cyan-400">2024: {formatCurrency(data.total2024)}</p>
                    <p className="text-sm text-green-400">2025: {formatCurrency(data.total2025)}</p>
                    <p className={`text-sm font-bold mt-1 ${parseFloat(data.variacion) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                      Variación: {data.variacion}%
                    </p>
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

      {/* Gráfico Consolidado por Concepto - Clickeable */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => openModal(
          'Detalle de Gastos Consolidados',
          `Análisis detallado de gastos operacionales logísticos consolidados de las 3 sedes. El incremento del ${variacionTotal}% refleja el crecimiento operativo, especialmente en Sede 2 y Sede 3, mientras que Sede 1 optimizó procesos logrando una reducción.`,
          true
        )}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200 hover:border-purple-500 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Gastos Operacionales por Tipo de Gasto (Consolidado 3 Sedes)</h3>
          <Info className="w-5 h-5 text-purple-400 animate-pulse" />
        </div>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={consolidadoArray} layout="vertical" margin={{ left: 250, right: 40, top: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              type="number" 
              stroke="#9ca3af" 
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <YAxis 
              type="category" 
              dataKey="concepto" 
              stroke="#9ca3af" 
              width={240} 
              style={{ fontSize: '11px' }}
            />
            <Tooltip content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-xl">
                    <p className="text-gray-900 font-semibold mb-2">{data.concepto}</p>
                    <p className="text-sm text-cyan-400">2024: {formatCurrency(data.valor2024)}</p>
                    <p className="text-sm text-green-400">2025: {formatCurrency(data.valor2025)}</p>
                    <p className={`text-sm font-bold mt-1 ${parseFloat(data.variacion) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                      Variación: {data.variacion}%
                    </p>
                  </div>
                );
              }
              return null;
            }} />
            <Bar dataKey="valor2024" fill="#6366f1" name="2024" radius={[0, 8, 8, 0]} />
            <Bar dataKey="valor2025" fill="#10b981" name="2025" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Modal con Tabla Consolidada */}
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
              className="bg-white rounded-xl p-6 max-w-6xl w-full border-4 border-purple-500 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-bold text-gray-900">{modalContent.title}</h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-6 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {modalContent.description}
                </p>
              </div>

              {/* Tabla dentro del modal - solo si showTable es true */}
              {modalContent.showTable && (
                <div className="overflow-x-auto">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">
                    GASTOS OPERACIONALES LOGÍSTICOS CONSOLIDADOS 2024 VS 2025
                  </h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-purple-500 to-purple-600 border-b-2 border-gray-300">
                        <th className="text-left py-3 px-4 text-gray-900 font-bold">CONCEPTO</th>
                        <th className="text-right py-3 px-4 text-gray-900 font-bold">TOTAL 2024</th>
                        <th className="text-right py-3 px-4 text-gray-900 font-bold">TOTAL 2025</th>
                        <th className="text-right py-3 px-4 text-gray-900 font-bold">% Var 25/24</th>
                        <th className="text-center py-3 px-4 text-gray-900 font-bold">DIFERENCIA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {consolidadoArray.map((row, idx) => {
                        const esIncremento = row.diferencia > 0;
                        
                        return (
                          <tr key={idx} className="border-b border-gray-200/30 hover:bg-gray-100/20">
                            <td className="py-2 px-4 text-gray-900">{row.concepto}</td>
                            <td className="py-2 px-4 text-right text-cyan-600 tabular-nums">
                              $ {row.valor2024.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </td>
                            <td className="py-2 px-4 text-right text-orange-600 tabular-nums">
                              $ {row.valor2025.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </td>
                            <td className="py-2 px-4 text-right tabular-nums">
                              <span className={`inline-flex items-center gap-1 ${esIncremento ? 'text-red-600' : 'text-green-600'}`}>
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${esIncremento ? 'bg-red-500' : 'bg-green-500'}`}>
                                  {esIncremento ? '↑' : '↓'}
                                </span>
                                {row.variacion}%
                              </span>
                            </td>
                            <td className="py-2 px-4 text-center">
                              <span className={esIncremento ? 'text-red-600' : 'text-green-600'}>
                                $ {Math.abs(row.diferencia).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="bg-gray-50 border-t-2 border-gray-400 font-bold">
                        <td className="py-3 px-4 text-gray-900">TOTAL GASTOS LOGÍSTICOS CONSOLIDADOS</td>
                        <td className="py-3 px-4 text-right text-cyan-700 tabular-nums">
                          $ {total2024.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </td>
                        <td className="py-3 px-4 text-right text-orange-700 tabular-nums">
                          $ {total2025.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums">
                          <span className={`inline-flex items-center gap-1 ${parseFloat(variacionTotal) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${parseFloat(variacionTotal) > 0 ? 'bg-red-500' : 'bg-green-500'}`}>
                              {parseFloat(variacionTotal) > 0 ? '↑' : '↓'}
                            </span>
                            {variacionTotal}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={parseFloat(variacionTotal) > 0 ? 'text-red-600' : 'text-green-600'}>
                            $ {Math.abs(total2025 - total2024).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <div className="mt-6 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <span className="font-semibold text-gray-900">Análisis Consolidado:</span> El incremento del {variacionTotal}% en gastos totales consolidados refleja el crecimiento operativo de las sedes. Sede 2 presenta el mayor incremento (+{sedesData[1]?.variacion || 0}%) debido al crecimiento del 31.3% en ventas. Sede 3 incrementó {sedesData[2]?.variacion || 0}% por consolidación de procesos. Sede 1 logró una reducción del {Math.abs(parseFloat(sedesData[0]?.variacion || 0))}% mediante optimización de fletes y personal.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-gray-900 rounded-lg transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


