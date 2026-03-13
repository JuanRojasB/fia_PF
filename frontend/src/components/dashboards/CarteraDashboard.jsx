import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Calendar, AlertTriangle, X, Info, CreditCard, Percent } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';

// Componente de Tooltip personalizado
const CustomTooltip = ({ active, payload, label, formatNumber }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ 
        backgroundColor: '#ffffff', 
        border: '2px solid #10b981',
        borderRadius: '8px',
        padding: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <p style={{ color: '#111827', fontWeight: 'bold', marginBottom: '8px' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color, padding: '4px 0', margin: 0 }}>
            <strong>{entry.name}:</strong> {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function CarteraDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  };

  if (!data || !data.resumenAnual) {
    return <div className="text-gray-600">No hay datos disponibles</div>;
  }

  const { resumenAnual, datosMensuales, exposicionCartera } = data;

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO').format(value);
  };

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return '$0';
    return `$${new Intl.NumberFormat('es-CO').format(value)}`;
  };

  return (
    <div className="space-y-6">
      {/* Descripción */}
      <div className="bg-gradient-to-r from-green-100 to-emerald-100 backdrop-blur-xl rounded-xl p-6 border border-green-500/30">
        <p className="text-gray-700">
          El año 2025 fue un año de cambios estructurales en el área, orientados a tener un manejo más óptimo y real de los estados de cuenta de los diferentes clientes. Se cumplió la meta de rotación establecida en ISO de 15 días.
        </p>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal(
            'Rotación de Cartera',
            <div className="text-gray-700">
              <p className="mb-4 font-semibold">¿Qué es la rotación de cartera?</p>
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300 mb-4">
                <p className="text-sm">Es el tiempo promedio (en días) que tardan los clientes en pagar sus facturas después de recibir el producto.</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300 mb-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Resultado 2025:</p>
                <p className="text-sm">• Rotación actual: <strong className="text-green-600">{resumenAnual.rotacion_dic_2025} días</strong></p>
                <p className="text-sm">• Meta ISO: <strong>15 días</strong></p>
                <p className="text-sm">• Rotación 2024: <strong>{resumenAnual.rotacion_dic_2024} días</strong></p>
                <p className="text-sm mt-2"><strong className="text-green-600">Meta cumplida.</strong> Se mejoró en 5 días respecto al año anterior.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">¿Por qué es importante?</p>
                <p className="text-sm">Menos días significa más rápido recuperamos el dinero, lo que resulta en mejor flujo de caja para la empresa.</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Rotación Dic 2025</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{resumenAnual.rotacion_dic_2025} días</div>
          <div className="text-sm text-gray-600 mt-1">Meta ISO: 15 días</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">vs Dic 2024</div>
            <div className="text-lg font-semibold text-green-600">{resumenAnual.rotacion_dic_2024} días</div>
          </div>
          <Info className="w-4 h-4 text-green-600 animate-pulse mt-2" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal(
            'Ventas de Contado vs Crédito',
            <div className="text-gray-700">
              <p className="mb-4 font-semibold">¿Cómo se distribuyen las ventas?</p>
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300 mb-4">
                <p className="text-sm mb-3"><strong>Ventas de Contado ({resumenAnual.ventas_contado_promedio}%):</strong></p>
                <p className="text-sm">Los clientes pagan inmediatamente al recibir el producto. El dinero entra de inmediato a la empresa.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300 mb-4">
                <p className="text-sm mb-3"><strong>Ventas de Crédito ({resumenAnual.ventas_credito_promedio}%):</strong></p>
                <p className="text-sm">Los clientes pagan después (a 15, 30 o más días). El dinero entra más tarde.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Interpretación:</p>
                <p className="text-sm">La mayoría de las ventas (62%) son a crédito, por eso es importante cobrar rápido para mantener el flujo de caja.</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Ventas Contado</span>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{resumenAnual.ventas_contado_promedio}%</div>
          <div className="text-sm text-gray-600 mt-1">Promedio anual</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Ventas de crédito</div>
            <div className="text-lg font-semibold text-blue-600">{resumenAnual.ventas_credito_promedio}%</div>
          </div>
          <Info className="w-4 h-4 text-blue-600 animate-pulse mt-2" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal(
            'Índice de Morosidad',
            <div className="text-gray-700">
              <p className="mb-4 font-semibold">¿Qué es la morosidad?</p>
              <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-300 mb-4">
                <p className="text-sm">Es el porcentaje de dinero que los clientes deben y no han pagado a tiempo. Son facturas vencidas que aún no se han cobrado.</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-300 mb-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Situación actual:</p>
                <p className="text-sm">• Morosidad promedio: <strong className="text-orange-600">{resumenAnual.morosidad_promedio}%</strong></p>
                <p className="text-sm mt-2">Esto significa que de todo el dinero que deben los clientes, casi la mitad está atrasado.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Acciones recomendadas:</p>
                <p className="text-sm">• Contactar a los clientes morosos</p>
                <p className="text-sm">• Establecer planes de pago</p>
                <p className="text-sm">• Mejorar el seguimiento de cobro</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-yellow-500/30 hover:border-yellow-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Morosidad Promedio</span>
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{resumenAnual.morosidad_promedio}%</div>
          <div className="text-sm text-gray-600 mt-1">Cartera vencida por recaudar</div>
          <Info className="w-4 h-4 text-yellow-600 animate-pulse mt-2" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal(
            'Cartera Total',
            <div className="text-gray-700">
              <p className="mb-4 font-semibold">¿Qué es la cartera total?</p>
              <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300 mb-4">
                <p className="text-sm">Es el total de dinero que los clientes deben a la empresa por ventas a crédito que aún no han pagado.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300 mb-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Situación Diciembre 2025:</p>
                <p className="text-sm">• Cartera total: <strong className="text-purple-600">${formatNumber(resumenAnual.cartera_dic_2025)} millones</strong></p>
                <p className="text-sm">• Cartera Dic 2024: <strong>${formatNumber(16971)} millones</strong></p>
                <p className="text-sm mt-2">• Variación: <strong className="text-green-600">{resumenAnual.variacion_dic}%</strong></p>
                <p className="text-sm mt-2">Bajó un 1%, lo que significa que se cobró más de lo que se vendió a crédito.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">¿Por qué es importante?</p>
                <p className="text-sm">Una cartera baja significa que estamos cobrando bien. Una cartera alta significa que tenemos mucho dinero pendiente de cobro.</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Cartera Dic 2025</span>
            <CreditCard className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">${formatNumber(resumenAnual.cartera_dic_2025)}M</div>
          <div className="text-sm text-gray-600 mt-1">Millones de pesos</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Variación vs Dic 2024</div>
            <div className="text-lg font-semibold text-green-600">{resumenAnual.variacion_dic}%</div>
          </div>
          <Info className="w-4 h-4 text-purple-600 animate-pulse mt-2" />
        </motion.div>
      </div>

      {/* Gráfico de Exposición de Cartera 2025 vs 2024 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={() => openModal(
          'Exposición de Cartera - Detalle Completo',
          <div className="text-gray-700">
            <p className="mb-4 font-semibold">Comparativa mensual de exposición de cartera (valores en millones de pesos)</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-600">
                    <th className="text-left py-2 px-3 text-gray-900 font-bold">Mes</th>
                    <th className="text-right py-2 px-3 text-gray-900 font-bold">2025</th>
                    <th className="text-right py-2 px-3 text-gray-900 font-bold">2024</th>
                    <th className="text-right py-2 px-3 text-gray-900 font-bold">% Var</th>
                  </tr>
                </thead>
                <tbody>
                  {exposicionCartera.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-2 px-3 text-gray-900 font-semibold">{row.mes}</td>
                      <td className="py-2 px-3 text-right text-green-600 font-bold">${formatNumber(row.t2025)}</td>
                      <td className="py-2 px-3 text-right text-gray-600">${formatNumber(row.t2024)}</td>
                      <td className={`py-2 px-3 text-right font-bold ${parseFloat(row.variacion) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {row.variacion}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 bg-green-50 rounded-lg p-4 border-2 border-green-300">
              <p className="text-sm">El nivel de cierre de cartera a diciembre 2025, quedó en 16,785 millones disminuyendo un -1% frente a Dic/24.</p>
            </div>
          </div>
        )}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Saldo Total de Cartera por Cobrar</h3>
            <p className="text-sm text-gray-600 mt-1">Comparación 2025 vs 2024 (millones de pesos)</p>
          </div>
          <Info className="w-5 h-5 text-blue-600 animate-pulse" />
        </div>
        <div>
          <ResponsiveContainer width="100%" height={450}>
            <LineChart data={exposicionCartera} margin={{ left: 30, right: 30, bottom: 10, top: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis 
                dataKey="mes" 
                stroke="#1f2937"
                style={{ fontSize: '14px', fontWeight: '700' }}
              />
              <YAxis 
                stroke="#1f2937" 
                tickFormatter={(value) => `${value}M`}
                label={{ value: '', angle: -90, position: 'insideLeft', style: { fontSize: '14px', fontWeight: '700' } }}
                style={{ fontSize: '14px', fontWeight: '700' }}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const val2025 = payload.find(p => p.dataKey === 't2025')?.value || 0;
                    const val2024 = payload.find(p => p.dataKey === 't2024')?.value || 0;
                    const diferencia = val2025 - val2024;
                    const variacion = val2024 > 0 ? ((diferencia / val2024) * 100).toFixed(1) : 0;
                    
                    return (
                      <div style={{ 
                        backgroundColor: '#ffffff', 
                        border: '2px solid #10b981',
                        borderRadius: '8px',
                        padding: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}>
                        <p style={{ color: '#111827', fontWeight: 'bold', marginBottom: '8px' }}>{label}</p>
                        <div style={{ marginBottom: '8px' }}>
                          <p style={{ color: '#059669', padding: '4px 0', margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
                            2025: ${formatNumber(val2025)} millones
                          </p>
                          <p style={{ color: '#059669', padding: '0', margin: 0, fontSize: '11px' }}>
                            (${formatNumber(val2025 * 1000000)} pesos)
                          </p>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <p style={{ color: '#374151', padding: '4px 0', margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
                            2024: ${formatNumber(val2024)} millones
                          </p>
                          <p style={{ color: '#374151', padding: '0', margin: 0, fontSize: '11px' }}>
                            (${formatNumber(val2024 * 1000000)} pesos)
                          </p>
                        </div>
                        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
                          <p style={{ color: diferencia >= 0 ? '#ef4444' : '#059669', padding: '0', margin: 0, fontSize: '13px', fontWeight: '600' }}>
                            Variación: {diferencia >= 0 ? '+' : ''}${formatNumber(Math.abs(diferencia))}M ({variacion >= 0 ? '+' : ''}{variacion}%)
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="t2025" 
                name="2025" 
                stroke="#059669" 
                strokeWidth={5} 
                dot={{ r: 8, fill: '#059669', strokeWidth: 3, stroke: '#fff' }}
                activeDot={{ r: 10 }}
              />
              <Line 
                type="monotone" 
                dataKey="t2024" 
                name="2024" 
                stroke="#374151" 
                strokeWidth={4}
                dot={{ r: 7, fill: '#374151', strokeWidth: 3, stroke: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Gráfico de Días de Rotación */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => openModal(
          'Días de Rotación - Análisis',
          <div className="text-gray-700">
            <p className="mb-4 font-semibold">Evolución mensual de los días de rotación de cartera</p>
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300 mb-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">¿Qué son los días de rotación?</p>
              <p className="text-sm">Es el tiempo promedio (en días) que tardan los clientes en pagar sus facturas. Menos días = mejor cobro.</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300 mb-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">Meta ISO cumplida:</p>
              <p className="text-sm">La cartera presenta una rotación al final del periodo de 15,40 días a Dic/25, frente al periodo anterior con una rotación de cartera en 20,86 días. Se cumplió la meta de rotación establecida en ISO de 15 días.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-300">
              <p className="text-sm font-semibold text-gray-900 mb-2">Interpretación:</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li className="text-green-600">Verde (≤15 días): Excelente - Meta cumplida</li>
                <li className="text-yellow-600">Amarillo (16-17 días): Aceptable - Cerca de la meta</li>
                <li className="text-red-600">Rojo (&gt;17 días): Requiere atención</li>
              </ul>
            </div>
          </div>
        )}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Tiempo Promedio de Cobro</h3>
            <p className="text-sm text-gray-600 mt-1">Días que tardan los clientes en pagar (Meta: ≤15 días)</p>
          </div>
          <Info className="w-5 h-5 text-blue-600 animate-pulse" />
        </div>
        <div>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={datosMensuales} margin={{ left: 30, right: 30, bottom: 10, top: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis 
                dataKey="mes" 
                stroke="#1f2937"
                style={{ fontSize: '14px', fontWeight: '700' }}
              />
              <YAxis 
                stroke="#1f2937" 
                label={{ value: 'Días', angle: -90, position: 'insideLeft', style: { fontSize: '14px', fontWeight: '700' } }}
                style={{ fontSize: '14px', fontWeight: '700' }}
                domain={[0, 25]}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const dias = payload[0].value;
                    let estado = '';
                    let color = '';
                    if (dias <= 15) {
                      estado = 'Excelente - Meta cumplida';
                      color = '#059669';
                    } else if (dias <= 17) {
                      estado = 'Aceptable - Cerca de la meta';
                      color = '#f59e0b';
                    } else {
                      estado = 'Requiere atención';
                      color = '#ef4444';
                    }
                    
                    return (
                      <div style={{ 
                        backgroundColor: '#ffffff', 
                        border: `2px solid ${color}`,
                        borderRadius: '8px',
                        padding: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}>
                        <p style={{ color: '#111827', fontWeight: 'bold', marginBottom: '8px' }}>{label}</p>
                        <p style={{ color: color, padding: '4px 0', margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                          {dias} días
                        </p>
                        <p style={{ color: '#6b7280', padding: '4px 0', margin: 0, fontSize: '12px' }}>
                          Tiempo promedio de pago
                        </p>
                        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
                          <p style={{ color: color, padding: '0', margin: 0, fontSize: '13px', fontWeight: '600' }}>
                            {estado}
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="dias_rotacion" name="Días Rotación" fill="#059669" radius={[8, 8, 0, 0]}>
                {datosMensuales.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.dias_rotacion <= 15 ? '#059669' : entry.dias_rotacion <= 17 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Gráfico de Índice de Morosidad */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        onClick={() => openModal(
          'Índice de Morosidad - Detalle',
          <div className="text-gray-700">
            <p className="mb-4 font-semibold">Porcentaje mensual de cartera vencida</p>
            <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-300">
              <p className="text-sm">El índice de morosidad promedio del año fue de {resumenAnual.morosidad_promedio}%, representando la cartera morosa vencida por recaudar.</p>
            </div>
          </div>
        )}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-yellow-500/30 hover:border-yellow-500 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Cartera Vencida</h3>
            <p className="text-sm text-gray-600 mt-1">Porcentaje de facturas no pagadas a tiempo</p>
          </div>
          <Info className="w-5 h-5 text-blue-600 animate-pulse" />
        </div>
        <div>
          <ResponsiveContainer width="100%" height={450}>
            <LineChart data={datosMensuales} margin={{ left: 30, right: 30, bottom: 10, top: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis 
                dataKey="mes" 
                stroke="#1f2937"
                style={{ fontSize: '14px', fontWeight: '700' }}
              />
              <YAxis 
                stroke="#1f2937" 
                tickFormatter={(value) => `${value}%`}
                style={{ fontSize: '14px', fontWeight: '700' }}
              />
              <Tooltip content={<CustomTooltip formatNumber={formatNumber} />} />
              <Line 
                type="monotone" 
                dataKey="indice_morosidad" 
                name="Morosidad %" 
                stroke="#f59e0b" 
                strokeWidth={5} 
                dot={{ r: 8, fill: '#f59e0b', strokeWidth: 3, stroke: '#fff' }}
                activeDot={{ r: 10 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Tabla Detallada Mensual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl border-4 border-indigo-500/30 overflow-hidden"
      >
        <CollapsibleTable
          title="Detalle Mensual de Gestión de Cartera 2025"
          defaultOpen={true}
        >
          <p className="text-sm text-gray-600 mb-4">Valores en pesos colombianos y porcentajes</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-3 px-3">Mes</th>
                  <th className="text-right py-3 px-3">Total Cartera</th>
                  <th className="text-right py-3 px-3">Cartera Vencida</th>
                  <th className="text-right py-3 px-3">Morosidad</th>
                  <th className="text-right py-3 px-3">Rotación</th>
                  <th className="text-right py-3 px-3">% Contado</th>
                  <th className="text-right py-3 px-3">% Crédito</th>
                </tr>
              </thead>
              <tbody>
                {datosMensuales.map((mes, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-3 font-semibold">{mes.mes}</td>
                    <td className="py-3 px-3 text-right">{formatCurrency(mes.total_cartera)}</td>
                    <td className="py-3 px-3 text-right text-amber-700">{formatCurrency(mes.cartera_vencida)}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="value-neutral">{mes.indice_morosidad}%</span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold">
                      <span className={mes.dias_rotacion <= 15 ? 'value-positive' : mes.dias_rotacion <= 17 ? 'value-neutral' : 'value-negative'}>
                        {mes.dias_rotacion}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-blue-600">{mes.pct_contado}%</td>
                    <td className="py-3 px-3 text-right text-purple-600">{mes.pct_credito}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-300">
              <div className="text-xs text-gray-600 mb-1">Rotación Dic 2025</div>
              <div className="text-2xl font-bold text-green-600">{resumenAnual.rotacion_dic_2025} días</div>
              <div className="text-xs text-gray-600 mt-1">Meta ISO cumplida</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
              <div className="text-xs text-gray-600 mb-1">Ventas Contado Promedio</div>
              <div className="text-2xl font-bold text-blue-600">{resumenAnual.ventas_contado_promedio}%</div>
              <div className="text-xs text-gray-600 mt-1">Año 2025</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-300">
              <div className="text-xs text-gray-600 mb-1">Morosidad Promedio</div>
              <div className="text-2xl font-bold text-yellow-600">{resumenAnual.morosidad_promedio}%</div>
              <div className="text-xs text-gray-600 mt-1">Cartera vencida</div>
            </div>
          </div>
        </CollapsibleTable>
      </motion.div>

      {/* Distribución de Ventas Contado vs Crédito */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onClick={() => openModal(
          'Distribución de Ventas - Análisis',
          <div className="text-gray-700">
            <p className="mb-4 font-semibold">Distribución de ventas entre contado y crédito</p>
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300 mb-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">Promedio Anual:</p>
              <p className="text-sm">Las ventas de contado en promedio representan el {resumenAnual.ventas_contado_promedio}% y las ventas de crédito el {resumenAnual.ventas_credito_promedio}%.</p>
            </div>
          </div>
        )}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Forma de Pago de los Clientes</h3>
            <p className="text-sm text-gray-600 mt-1">Porcentaje de ventas al contado vs crédito</p>
          </div>
          <Info className="w-5 h-5 text-blue-600 animate-pulse" />
        </div>
        <div>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={datosMensuales} margin={{ left: 30, right: 30, bottom: 10, top: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis 
                dataKey="mes" 
                stroke="#1f2937"
                style={{ fontSize: '14px', fontWeight: '700' }}
              />
              <YAxis 
                stroke="#1f2937" 
                tickFormatter={(value) => `${value}%`}
                style={{ fontSize: '14px', fontWeight: '700' }}
                domain={[0, 100]}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const mesData = datosMensuales.find(m => m.mes === label);
                    return (
                      <div style={{ 
                        backgroundColor: '#ffffff', 
                        border: '2px solid #8b5cf6',
                        borderRadius: '8px',
                        padding: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}>
                        <p style={{ color: '#111827', fontWeight: 'bold', marginBottom: '8px' }}>{label}</p>
                        <div style={{ marginBottom: '8px' }}>
                          <p style={{ color: '#2563eb', padding: '4px 0', margin: 0 }}>
                            <strong>Contado:</strong> {mesData.pct_contado}%
                          </p>
                          <p style={{ color: '#2563eb', padding: '0 0 4px 0', margin: 0, fontSize: '12px' }}>
                            ${formatCurrency(mesData.ventas_contado)}
                          </p>
                        </div>
                        <div>
                          <p style={{ color: '#8b5cf6', padding: '4px 0', margin: 0 }}>
                            <strong>Crédito:</strong> {mesData.pct_credito}%
                          </p>
                          <p style={{ color: '#8b5cf6', padding: '0', margin: 0, fontSize: '12px' }}>
                            ${formatCurrency(mesData.ventas_credito)}
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="pct_contado" name="% Contado" fill="#2563eb" radius={[8, 8, 0, 0]} />
              <Bar dataKey="pct_credito" name="% Crédito" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Conclusiones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-5 border-2 border-green-500/30"
        >
          <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Logros 2025
          </h4>
          <div className="space-y-2 text-xs sm:text-sm text-gray-700">
            <div>• Rotación: {resumenAnual.rotacion_dic_2025} días (Meta ISO cumplida)</div>
            <div>• Mejora vs 2024: de {resumenAnual.rotacion_dic_2024} a {resumenAnual.rotacion_dic_2025} días</div>
            <div>• Cartera Dic: ${formatNumber(resumenAnual.cartera_dic_2025)}M ({resumenAnual.variacion_dic}% vs 2024)</div>
            <div>• Año de cambios estructurales en el área</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-5 border-2 border-blue-500/30"
        >
          <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Percent className="w-5 h-5 text-blue-600" />
            Indicadores Clave
          </h4>
          <div className="space-y-2 text-xs sm:text-sm text-gray-700">
            <div>• Ventas contado promedio: {resumenAnual.ventas_contado_promedio}%</div>
            <div>• Ventas crédito promedio: {resumenAnual.ventas_credito_promedio}%</div>
            <div>• Morosidad promedio: {resumenAnual.morosidad_promedio}%</div>
            <div>• Manejo óptimo de estados de cuenta</div>
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
              className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-green-500 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-900">{modalContent.title}</h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-gray-600 hover:text-gray-900 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-gray-700 leading-relaxed">{modalContent.content}</div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
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
