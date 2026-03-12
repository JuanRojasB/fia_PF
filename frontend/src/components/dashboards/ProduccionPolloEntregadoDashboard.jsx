import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Truck, TrendingDown, Package, AlertCircle, X, Info } from 'lucide-react';

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

  // Obtener datos de 2024 y 2025
  const datos2025 = polloEntregado.find(p => p.anio === 2025) || {};
  const datos2024 = polloEntregado.find(p => p.anio === 2024) || {};

  // Preparar datos para gráfico comparativo
  const datosComparativo = [
    {
      categoria: 'Programado',
      '2024': parseInt(datos2024.programado) || 0,
      '2025': parseInt(datos2025.programado) || 0
    },
    {
      categoria: 'Real Granjas',
      '2024': parseInt(datos2024.real_granjas) || 0,
      '2025': parseInt(datos2025.real_granjas) || 0
    },
    {
      categoria: 'Comprado',
      '2024': parseInt(datos2024.comprado) || 0,
      '2025': parseInt(datos2025.comprado) || 0
    },
    {
      categoria: 'Total',
      '2024': parseInt(datos2024.total) || 0,
      '2025': parseInt(datos2025.total) || 0
    }
  ];

  // Datos para composición porcentual
  const composicion2024 = [
    { name: 'Real Granjas', value: parseInt(datos2024.real_granjas) || 0, color: '#10b981' },
    { name: 'Comprado', value: parseInt(datos2024.comprado) || 0, color: '#f59e0b' }
  ];

  const composicion2025 = [
    { name: 'Real Granjas', value: parseInt(datos2025.real_granjas) || 0, color: '#10b981' },
    { name: 'Comprado', value: parseInt(datos2025.comprado) || 0, color: '#f59e0b' }
  ];

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
            <span className="text-gray-600 text-sm font-medium">Programado 2025</span>
            <Package className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatNumber(Math.round(datos2025.programado / 1000000))}M</div>
          <div className="text-xs text-gray-600 mt-1">2024: {formatNumber(Math.round(datos2024.programado / 1000000))}M</div>
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
            <span className="text-gray-600 text-sm font-medium">Real 2025</span>
            <Truck className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatNumber(Math.round(datos2025.real_granjas / 1000000))}M</div>
          <div className="text-xs text-gray-600 mt-1">2024: {formatNumber(Math.round(datos2024.real_granjas / 1000000))}M</div>
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
            <span className="text-gray-600 text-sm font-medium">Comprado 2025</span>
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
            <span className="text-gray-600 text-sm font-medium">Total 2025</span>
            <TrendingDown className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatNumber(Math.round(datos2025.total / 1000000))}M</div>
          <div className="text-xs text-red-600 mt-1">{datos2025.var_pct}% vs 2024</div>
        </motion.div>
      </div>

      {/* Tabla Comparativa */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">Comparativo 2025 vs 2024</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Año</th>
                <th className="px-4 py-3 text-right text-sm font-bold text-gray-700">Programado</th>
                <th className="px-4 py-3 text-right text-sm font-bold text-gray-700 bg-green-50">REAL</th>
                <th className="px-4 py-3 text-right text-sm font-bold text-gray-700 bg-orange-50">Comprado</th>
                <th className="px-4 py-3 text-right text-sm font-bold text-gray-700 bg-blue-50">Total</th>
                <th className="px-4 py-3 text-right text-sm font-bold text-gray-700">%Var</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50 bg-yellow-50">
                <td className="px-4 py-3 text-sm font-bold text-gray-900">2025</td>
                <td className="px-4 py-3 text-sm text-right text-gray-700">{formatNumber(datos2025.programado)}</td>
                <td className="px-4 py-3 text-sm text-right font-bold text-gray-900 bg-green-50">{formatNumber(datos2025.real_granjas)}</td>
                <td className="px-4 py-3 text-sm text-right font-bold text-gray-900 bg-orange-50">{formatNumber(datos2025.comprado)}</td>
                <td className="px-4 py-3 text-sm text-right font-bold text-gray-900 bg-blue-50">{formatNumber(datos2025.total)}</td>
                <td className="px-4 py-3 text-sm text-right font-bold text-red-600">{datos2025.var_pct}%</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-bold text-gray-900">2024</td>
                <td className="px-4 py-3 text-sm text-right text-gray-700">{formatNumber(datos2024.programado)}</td>
                <td className="px-4 py-3 text-sm text-right font-bold text-gray-900 bg-green-50">{formatNumber(datos2024.real_granjas)}</td>
                <td className="px-4 py-3 text-sm text-right font-bold text-gray-900 bg-orange-50">{formatNumber(datos2024.comprado)}</td>
                <td className="px-4 py-3 text-sm text-right font-bold text-gray-900 bg-blue-50">{formatNumber(datos2024.total)}</td>
                <td className="px-4 py-3 text-sm text-right font-bold text-red-600">{datos2024.var_pct}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Gráficos Mejorados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1: Comparativo Barras */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          onClick={() => openModal(
            'Comparativo Visual 2025 vs 2024',
            'Gráfico de barras que compara las cuatro categorías principales entre 2024 (azul) y 2025 (verde). Permite visualizar fácilmente las diferencias absolutas en cada categoría.'
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200 cursor-pointer hover:border-blue-400 transition-all"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Comparativo por Categoría</h3>
            <Info className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={datosComparativo}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="categoria" stroke="#6b7280" />
              <YAxis stroke="#6b7280" tickFormatter={(value) => formatNumber(value)} />
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
          
          {/* Mini resumen debajo del gráfico */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {datosComparativo.map((item, idx) => {
              const dif = item['2025'] - item['2024'];
              return (
                <div key={idx} className="bg-gray-50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-600 mb-1">{item.categoria}</div>
                  <div className={`text-sm font-bold ${dif >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {dif >= 0 ? '+' : ''}{formatNumber(dif)}
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
            'Muestra la proporción entre pollos de granjas propias (Real) y pollos comprados a terceros. La alta proporción de Real indica autosuficiencia en la producción.'
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200 cursor-pointer hover:border-green-400 transition-all"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Composición: Real vs Comprado</h3>
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
                    <span className="text-sm font-medium text-gray-700">Comprado</span>
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
                    <span className="text-sm font-medium text-gray-700">Comprado</span>
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
