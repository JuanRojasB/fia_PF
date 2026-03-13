import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Truck, TrendingUp, Users, X, Info, DollarSign } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';

export default function LogisticaSede2Dashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '', showTable: false });

  const openModal = (title, description, showTable = false) => {
    setModalContent({ title, description, showTable });
    setModalOpen(true);
  };

  const logisticaData = Array.isArray(data) ? data : (data?.items || []);
  
  if (logisticaData.length === 0) {
    return (
      <div className="bg-white/95 backdrop-blur-xl rounded-xl p-12 border border-gray-200 text-center">
        <div className="text-gray-600 text-lg">No hay datos disponibles para Sede 2</div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return '$0';
    return '$' + new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Filtrar solo datos de SEDE2
  const sede2Data = logisticaData.filter(d => {
    const sede = (d.sede || '').toString().trim().toUpperCase();
    return sede === 'SEDE2';
  });

  // Agrupar por concepto
  const conceptosMap = {};
  sede2Data.forEach(d => {
    const concepto = d.concepto || 'Sin concepto';
    const anio = parseInt(d.anio);
    const valor = parseFloat(d.valor) || 0;
    
    if (!conceptosMap[concepto]) {
      conceptosMap[concepto] = { concepto, valor2024: 0, valor2025: 0 };
    }
    
    if (anio === 2024) conceptosMap[concepto].valor2024 = valor;
    if (anio === 2025) conceptosMap[concepto].valor2025 = valor;
  });

  const conceptosArray = Object.values(conceptosMap).map(c => ({
    ...c,
    variacion: c.valor2024 > 0 ? (((c.valor2025 - c.valor2024) / c.valor2024) * 100).toFixed(2) : 0,
    diferencia: c.valor2025 - c.valor2024
  }));

  const total2024 = conceptosArray.reduce((sum, c) => sum + c.valor2024, 0);
  const total2025 = conceptosArray.reduce((sum, c) => sum + c.valor2025, 0);
  const variacionTotal = total2024 > 0 ? (((total2025 - total2024) / total2024) * 100).toFixed(2) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500/20 to-emerald-600/10 backdrop-blur-xl rounded-xl p-6 border-2 border-green-500/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <Truck className="w-8 h-8 text-green-400" />
          <h2 className="text-3xl font-bold text-gray-900">GESTIÓN LOGÍSTICA - SEDE 2</h2>
        </div>
        <p className="text-gray-700 leading-relaxed mb-4">
          La Sede 2 está encargada del aprovechamiento de los sobrantes de pollo para su transformación en productos congelados en diversas referencias, 
          presentando un crecimiento en ventas del 31.3% influenciado por el traslado del cliente D1 y la vinculación del cliente ARA.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white/95 rounded-lg p-4 border border-gray-300">
            <div className="text-sm text-gray-600 mb-1">Responsable</div>
            <div className="text-xl font-bold text-green-400">Alexis Pérez</div>
          </div>
          <div className="bg-white/95 rounded-lg p-4 border border-gray-300">
            <div className="text-sm text-gray-600 mb-1">Colaboradores</div>
            <div className="text-3xl font-bold text-green-400">56</div>
          </div>
          <div className="bg-white/95 rounded-lg p-4 border border-gray-300">
            <div className="text-sm text-gray-600 mb-1">Variación Ventas</div>
            <div className="text-3xl font-bold text-green-400">+31.3%</div>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal(
            'Gastos Totales 2025',
            `Total de gastos operacionales logísticos Sede 2 para 2025: ${formatCurrency(total2025)}. El incremento del ${variacionTotal}% vs 2024 está directamente relacionado con el crecimiento del 31.3% en ventas, principalmente por mayor capacidad instalada y personal para atender la demanda de D1 y ARA.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Total Gastos 2025</span>
            <DollarSign className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">{formatCurrency(total2025)}</div>
          <div className={`text-xs ${parseFloat(variacionTotal) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
            {variacionTotal > 0 ? '+' : ''}{variacionTotal}% vs 2024
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal(
            'Variación Anual',
            `La variación anual de ${formatCurrency(Math.abs(total2025 - total2024))} representa un incremento del ${Math.abs(variacionTotal)}% en los gastos operacionales logísticos. Este aumento está justificado por el crecimiento del 31.3% en ventas, con incrementos en arriendos y congelación (+43.01%) y personal de postproceso (+13.65%).`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-emerald-500/30 hover:border-emerald-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Variación Anual</span>
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">{formatCurrency(Math.abs(total2025 - total2024))}</div>
          <div className={`text-xs ${parseFloat(variacionTotal) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
            {parseFloat(variacionTotal) >= 0 ? 'Incremento vs 2024' : 'Reducción vs 2024'}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal(
            'Conceptos de Gasto',
            `Sede 2 gestiona ${conceptosArray.length} conceptos de gasto operacional logístico, incluyendo arriendos y congelación, fletes, personal de postproceso, servicios públicos y otros rubros necesarios para la operación de productos congelados. Cada concepto es monitoreado mensualmente para optimizar costos.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-teal-500/30 hover:border-teal-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Conceptos de Gasto</span>
            <Users className="w-6 h-6 text-teal-400" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">{conceptosArray.length}</div>
          <div className="text-xs text-teal-400">Rubros controlados</div>
        </motion.div>
      </div>

      {/* Gráfico - Clickeable */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => openModal(
          'Detalle de Gastos Sede 2',
          `Análisis detallado de gastos operacionales logísticos Sede 2 para 2024 vs 2025. El incremento del ${variacionTotal}% en gastos totales está directamente relacionado con el crecimiento del 31.3% en ventas. Los principales aumentos se deben a arriendos y congelación (+43.01%) por mayor capacidad instalada, y personal de postproceso (+13.65%) para atender la demanda de D1 y ARA.`,
          true
        )}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200 hover:border-green-500 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Comparativa de Gastos 2024 vs 2025</h3>
          <Info className="w-5 h-5 text-green-400 animate-pulse" />
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={conceptosArray} layout="vertical" margin={{ left: 180, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9ca3af" tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
            <YAxis type="category" dataKey="concepto" stroke="#9ca3af" width={170} style={{ fontSize: '12px' }} />
            <Tooltip content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const val2024 = payload.find(p => p.dataKey === 'valor2024')?.value || 0;
                const val2025 = payload.find(p => p.dataKey === 'valor2025')?.value || 0;
                const diferencia = val2025 - val2024;
                const variacion = val2024 > 0 ? ((diferencia / val2024) * 100).toFixed(1) : 0;
                
                return (
                  <div className="bg-white border-2 border-green-500 rounded-xl p-4 shadow-xl">
                    <p className="font-bold text-gray-900 mb-3 text-lg">{label}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-cyan-600 font-medium">2024:</span>
                        <span className="font-bold text-gray-900">{formatCurrency(val2024)}</span>
                      </div>
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-green-600 font-medium">2025:</span>
                        <span className="font-bold text-gray-900">{formatCurrency(val2025)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-gray-600 font-medium">Diferencia:</span>
                          <span className={`font-bold ${diferencia >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {diferencia >= 0 ? '+' : ''}{formatCurrency(diferencia)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center gap-4 mt-1">
                          <span className="text-gray-600 font-medium">Variación:</span>
                          <span className={`font-bold ${variacion >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {variacion >= 0 ? '+' : ''}{variacion}%
                          </span>
                        </div>
                      </div>
                    </div>
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

      {/* Modal con Tabla */}
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
              className="bg-white rounded-xl p-6 max-w-6xl w-full border-4 border-green-500 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-bold text-gray-900">{modalContent.title}</h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {modalContent.description}
                </p>
              </div>

              {/* Tabla dentro del modal - solo si showTable es true */}
              {modalContent.showTable && (
                <div className="overflow-x-auto">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">
                    GASTOS OPERACIONALES LOGÍSTICOS SEDE 2 AÑO 2024 VS 2025
                  </h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-green-500 to-green-600 border-b-2 border-gray-300">
                        <th className="text-left py-3 px-4 text-gray-900 font-bold">CONCEPTO</th>
                        <th className="text-right py-3 px-4 text-gray-900 font-bold">TOTAL 2024</th>
                        <th className="text-right py-3 px-4 text-gray-900 font-bold">TOTAL 2025</th>
                        <th className="text-right py-3 px-4 text-gray-900 font-bold">% Var 25/24</th>
                        <th className="text-center py-3 px-4 text-gray-900 font-bold">DIFERENCIA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conceptosArray.map((row, idx) => {
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
                        <td className="py-3 px-4 text-gray-900">TOTAL GASTOS LOGÍSTICOS 2024 VS 2025</td>
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
                  
                  <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <span className="font-semibold text-gray-900">Análisis Sede 2:</span> El incremento del {variacionTotal}% en gastos totales está directamente relacionado con el crecimiento del 31.3% en ventas. Los principales aumentos se deben a arriendos y congelación (+43.01%) por mayor capacidad instalada para atender la demanda de D1 y ARA, y personal de postproceso (+13.65%) para soportar el volumen de producción de productos congelados.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-gray-900 rounded-lg transition-colors"
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

