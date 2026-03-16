import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Truck, TrendingDown, Package, AlertCircle, X, Info } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';
import { getValueColor } from '../../utils/colorUtils';

export default function ProduccionPolloEntregadoDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  if (!data || typeof data !== 'object') {
    return <div className="text-gray-600">No hay datos disponibles</div>;
  }

  const { polloEntregado = [] } = data;

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO').format(value);
  };

  // Datos históricos hardcodeados como fuente de verdad
  const historico = [
    { anio: 2018, programado: 26617724, real_granjas: 26353497, comprado: 664575,  total: 27018072, var_pct: null },
    { anio: 2019, programado: 27353834, real_granjas: 27201661, comprado: 618577,  total: 27820238, var_pct: 3.0  },
    { anio: 2020, programado: 27816195, real_granjas: 23666296, comprado: 659756,  total: 24326052, var_pct: -12.5 },
    { anio: 2021, programado: 31212400, real_granjas: 28303721, comprado: 398578,  total: 28702299, var_pct: 18.0 },
    { anio: 2022, programado: 33632300, real_granjas: 30042350, comprado: 582264,  total: 30624614, var_pct: 6.7  },
    { anio: 2023, programado: 30805997, real_granjas: 29171431, comprado: 427670,  total: 29599101, var_pct: -3.3 },
    { anio: 2024, programado: 30581067, real_granjas: 28604260, comprado: 274229,  total: 28878489, var_pct: -2.4 },
    { anio: 2025, programado: 30872786, real_granjas: 29435711, comprado: 238502,  total: 29674213, var_pct: 2.7  },
  ];

  // La BD tiene 2025 con datos idénticos a 2024 (no actualizado).
  // Usamos BD para 2018-2024 y hardcodeado para 2025.
  const mergeRow = (anio) => {
    if (anio === 2025) return historico.find(p => p.anio === 2025);
    const fromBD = polloEntregado.find(p => parseInt(p.anio) === anio);
    const fromHC = historico.find(p => p.anio === anio);
    if (!fromBD) return fromHC;
    return {
      anio,
      programado:   parseInt(fromBD.programado)   || fromHC?.programado   || 0,
      real_granjas: parseInt(fromBD.real_granjas)  || fromHC?.real_granjas || 0,
      comprado:     parseInt(fromBD.comprado)      || fromHC?.comprado     || 0,
      total:        parseInt(fromBD.total)         || fromHC?.total        || 0,
      var_pct:      fromBD.var_pct != null ? parseFloat(fromBD.var_pct) : fromHC?.var_pct,
      notas:        fromBD.notas
    };
  };

  const datos2025 = mergeRow(2025) || historico.find(p => p.anio === 2025);
  const datos2024 = mergeRow(2024) || historico.find(p => p.anio === 2024);
  const tablaData = historico.map(h => mergeRow(h.anio));

  // Preparar datos para gráfico comparativo - Real vs Programado
  const datosComparativo = [
    { categoria: 'Programado', '2024': datos2024.programado, '2025': datos2025.programado },
    { categoria: 'Real Granjas', '2024': datos2024.real_granjas, '2025': datos2025.real_granjas },
    { categoria: 'Comprado',    '2024': datos2024.comprado,    '2025': datos2025.comprado    },
    { categoria: 'Total',       '2024': datos2024.total,       '2025': datos2025.total       },
  ];

  // Datos para el resumen completo (incluye todas las categorías)
  const datosResumen = datosComparativo.map(d => ({
    categoria: d.categoria,
    diferencia: d['2025'] - d['2024']
  }));



  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-xl p-6 border-2 border-blue-500/30"
      >
        <div className="flex items-center gap-3">
          <Truck className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-3xl font-bold text-gray-900">POLLO ENTREGADO</h2>
            <p className="text-gray-700 mt-1">Comparativo 2025 vs 2024 - Análisis de recepción</p>
          </div>
        </div>
      </motion.div>

      {/* Alerta Contexto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="text-sm text-gray-700">
            {datos2025.notas || 'Del total recibido (REAL) de granjas para el año 2024 sumado al pollo comprado arroja un total de 28.6 millones de pollos el cual presentó un decrecimiento frente al año anterior de -2.4%, lo que representa -733.456 pollos menos.'}
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal(
            'Programado',
            `2024: ${formatNumber(datos2024.programado)} | 2025: ${formatNumber(datos2025.programado)}`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 cursor-pointer hover:border-purple-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Programado Aves 2025</span>
            <Package className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatNumber(datos2025.programado)}</div>
          <div className="text-xs text-gray-600 mt-1">2024: {formatNumber(datos2024.programado)}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal(
            'Real de Granjas',
            `2024: ${formatNumber(datos2024.real_granjas)} | 2025: ${formatNumber(datos2025.real_granjas)}`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 cursor-pointer hover:border-green-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Real Aves Entregadas en 2025</span>
            <Truck className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatNumber(datos2025.real_granjas)}</div>
          <div className="text-xs text-gray-600 mt-1">2024: {formatNumber(datos2024.real_granjas)}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => openModal(
            'Comprado',
            `2024: ${formatNumber(datos2024.comprado)} | 2025: ${formatNumber(datos2025.comprado)}`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30 cursor-pointer hover:border-orange-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Comprado de Aves en 2025</span>
            <Package className="w-6 h-6 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatNumber(datos2025.comprado)}</div>
          <div className="text-xs text-gray-600 mt-1">2024: {formatNumber(datos2024.comprado)}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => openModal(
            'Total',
            `2024: ${formatNumber(datos2024.total)} | 2025: ${formatNumber(datos2025.total)} | Variación: ${datos2025.var_pct}%`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 cursor-pointer hover:border-blue-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Total de Aves en 2025</span>
            <TrendingDown className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatNumber(datos2025.total)}</div>
          <div className={`text-xs mt-1 font-semibold px-2 py-1 rounded inline-block ${getValueColor(datos2025.var_pct).bg} ${getValueColor(datos2025.var_pct).text}`}>
            {datos2025.var_pct}% vs 2024
          </div>
        </motion.div>
      </div>

      {/* Tabla Histórica Pollo Entregado */}
      <CollapsibleTable
        title="Pollo Entregado — Cantidad en Unidades (Histórico 2018-2025)"
        defaultOpen={false}
        totalRow={[
          { label: 'Histórico 2018-2025' },
          { label: 'Real 2025: 29.435.711', color: 'text-green-600' },
          { label: 'Total 2025: 29.674.213', color: 'text-blue-600' },
          { label: 'Var 2025: +2.7%', color: 'text-green-600' },
        ]}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th colSpan={6} className="text-center py-2 text-blue-600 font-bold text-base border-b-2 border-blue-200">
                  Cantidad en Unidades
                </th>
              </tr>
              <tr className="border-b-2 border-blue-300">
                <th className="text-left py-3 px-4 text-blue-600 font-bold">Año</th>
                <th className="text-right py-3 px-4 text-blue-600 font-bold">Programado</th>
                <th className="text-right py-3 px-4 text-blue-600 font-bold">REAL</th>
                <th className="text-right py-3 px-4 text-blue-600 font-bold">Comprado</th>
                <th className="text-right py-3 px-4 text-blue-600 font-bold">Total</th>
                <th className="text-right py-3 px-4 text-blue-600 font-bold">%Var Vertical<br/>sobre Total</th>
              </tr>
            </thead>
            <tbody>
              {tablaData.sort((a, b) => a.anio - b.anio).map((row, idx) => {
                const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/30';
                const es2025 = row.anio === 2025;
                return (
                  <tr key={row.anio} className={`${rowBg} hover:bg-blue-100/40 transition-colors border-b border-gray-100`}>
                    <td className="py-2 px-4 font-bold text-gray-800">
                      {es2025 ? (
                        <span className="inline-block bg-blue-600 text-white px-2 py-0.5 rounded font-bold">{row.anio}</span>
                      ) : row.anio}
                    </td>
                    <td className="py-2 px-4 text-right text-gray-700">{formatNumber(row.programado)}</td>
                    <td className="py-2 px-4 text-right text-gray-800 font-medium">{formatNumber(row.real_granjas)}</td>
                    <td className="py-2 px-4 text-right text-gray-700">{formatNumber(row.comprado)}</td>
                    <td className="py-2 px-4 text-right text-blue-700 font-bold">{formatNumber(row.total)}</td>
                    <td className={`py-2 px-4 text-right font-bold ${
                      row.var_pct === null ? 'text-gray-400' :
                      row.var_pct >= 0 ? 'text-gray-800' : 'text-red-600'
                    }`}>
                      {row.var_pct === null ? '' : `${row.var_pct.toFixed(1)}%`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CollapsibleTable>

      {/* Gráficos Mejorados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1: Comparativo Barras */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          onClick={() => openModal(
            'Comparativo Real vs Programado',
            'Gráfico de barras que compara el pollo Real recibido de granjas contra el Programado entre 2024 (azul) y 2025 (verde). Permite visualizar el cumplimiento del programa de producción y las diferencias entre lo planificado y lo ejecutado. El resumen debajo muestra las diferencias para todas las categorías incluyendo Comprado y Total.'
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200 cursor-pointer hover:border-blue-400 transition-all"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Aves Entregadas Real vs Programado por Mes 2025</h3>
            <Info className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={datosComparativo} margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="categoria" stroke="#6b7280" />
              <YAxis stroke="#6b7280" tickFormatter={(value) => formatNumber(value)} width={90} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', border: '2px solid #3b82f6', borderRadius: '12px', padding: '12px' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const val2024 = payload.find(p => p.dataKey === '2024')?.value || 0;
                    const val2025 = payload.find(p => p.dataKey === '2025')?.value || 0;
                    const diferencia = val2025 - val2024;
                    const variacion = val2024 > 0 ? ((diferencia / val2024) * 100).toFixed(1) : 0;
                    
                    return (
                      <div className="bg-white border-2 border-blue-500 rounded-xl p-4 shadow-xl">
                        <p className="font-bold text-gray-900 mb-3 text-lg">{label}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-blue-600 font-medium">2024:</span>
                            <span className="font-bold text-gray-900">{formatNumber(val2024)}</span>
                          </div>
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-green-600 font-medium">2025:</span>
                            <span className="font-bold text-gray-900">{formatNumber(val2025)}</span>
                          </div>
                          <div className="border-t border-gray-200 pt-2 mt-2">
                            <div className="flex justify-between items-center gap-4">
                              <span className="text-gray-600 font-medium">Diferencia:</span>
                              <span className={`font-bold ${diferencia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {diferencia >= 0 ? '+' : ''}{formatNumber(diferencia)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center gap-4 mt-1">
                              <span className="text-gray-600 font-medium">Variación:</span>
                              <span className={`font-bold ${variacion >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {variacion >= 0 ? '+' : ''}{variacion}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="2024" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="2025" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          
          {/* Mini resumen debajo del gráfico - Muestra todas las categorías */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {datosResumen.map((item, idx) => {
              return (
                <div key={idx} className="bg-gray-50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-600 mb-1">{item.categoria}</div>
                  <div className={`text-sm font-bold ${item.diferencia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.diferencia >= 0 ? '+' : ''}{formatNumber(item.diferencia)}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Gráfico 2: Composición Real vs Comprado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={() => openModal(
            'Composición: Real vs Comprado',
            'Muestra la proporción entre pollos de granjas propias (Real) y pollos comprados a avi/cambulos. La alta proporción de Real indica autosuficiencia en la producción.'
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200 cursor-pointer hover:border-green-400 transition-all"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Composición Aves Entregadas: Granjas Propias vs Comprado (Avi/Cambulos) 2025</h3>
            <Info className="w-5 h-5 text-green-400 animate-pulse" />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {/* 2024 */}
            <div>
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-gray-900">2024</div>
                <div className="text-sm text-gray-600">{formatNumber(datos2024.total)} pollos</div>
              </div>
              <div className="space-y-3">
                <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Real Granjas</span>
                    <span className="text-lg font-bold text-green-600">
                      {((datos2024.real_granjas / datos2024.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">{formatNumber(datos2024.real_granjas)} pollos</div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${((datos2024.real_granjas / datos2024.total) * 100).toFixed(1)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Comprado(Avi/cambulos)</span>
                    <span className="text-lg font-bold text-orange-600">
                      {((datos2024.comprado / datos2024.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">{formatNumber(datos2024.comprado)} pollos</div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-orange-500 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${((datos2024.comprado / datos2024.total) * 100).toFixed(1)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2025 */}
            <div>
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-gray-900">2025</div>
                <div className="text-sm text-gray-600">{formatNumber(datos2025.total)} pollos</div>
              </div>
              <div className="space-y-3">
                <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Real Granjas</span>
                    <span className="text-lg font-bold text-green-600">
                      {((datos2025.real_granjas / datos2025.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">{formatNumber(datos2025.real_granjas)} pollos</div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${((datos2025.real_granjas / datos2025.total) * 100).toFixed(1)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Comprado(Avi/cambulos)</span>
                    <span className="text-lg font-bold text-orange-600">
                      {((datos2025.comprado / datos2025.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">{formatNumber(datos2025.comprado)} pollos</div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-orange-500 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${((datos2025.comprado / datos2025.total) * 100).toFixed(1)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
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
              className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-blue-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-gray-900">{modalContent.title}</h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-gray-700 leading-relaxed">
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
