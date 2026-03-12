import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ComposedChart } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Users, AlertTriangle, Calendar, CreditCard, Percent, X, Info } from 'lucide-react';

export default function CarteraDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  console.log('CarteraDashboard - Datos recibidos:', data);

  if (!data || typeof data !== 'object') {
    return <div className="text-gray-600">No hay datos disponibles</div>;
  }

  const {
    exposicionCartera = [],
    mixVentas = [],
    clientes = [],
    porAsesor = {},
    porRangoRotacion = {},
    top10Clientes = [],
    clientesCriticos = [],
    totales = {}
  } = data;

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return '$0';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Preparar datos para gráficos
  const datosExposicion = exposicionCartera.map(d => ({
    mes: d.mes_nombre?.substring(0, 3) || '',
    '2024': parseFloat(d.t2024) || 0,
    '2025': parseFloat(d.t2025) || 0,
    variacion: parseFloat(d.variacion_pct) || 0
  }));

  const datosMix = mixVentas.map(d => ({
    mes: d.mes_nombre?.substring(0, 3) || '',
    contado: parseFloat(d.pct_contado) || 0,
    credito: parseFloat(d.pct_credito) || 0,
    morosidad: parseFloat(d.morosidad_vencida_pct) || 0,
    rotacion: parseFloat(d.dias_rotacion) || 0
  }));

  const datosRangos = Object.entries(porRangoRotacion).map(([rango, cantidad]) => ({
    name: rango.split('(')[0].trim(),
    value: cantidad,
    fullName: rango
  }));

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500/20 to-blue-600/10 backdrop-blur-xl rounded-xl p-6 border-2 border-green-500/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="w-8 h-8 text-green-400" />
          <h2 className="text-3xl font-bold text-gray-900">GESTIÓN DE CARTERA</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          Análisis integral de la cartera de clientes, exposición financiera, rotación de cartera y gestión de cobranza. 
          Monitoreo de indicadores clave para optimizar el flujo de caja y minimizar riesgos crediticios.
        </p>
      </motion.div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal(
            'Cartera Total',
            `La cartera total es de ${formatCurrency(totales.totalCartera)} (${totales.totalCarteraMillones}M). Este valor representa el saldo pendiente de cobro de todos los clientes. Una cartera saludable debe tener baja morosidad y rotación rápida. El objetivo es mantener un equilibrio entre ventas a crédito (para impulsar ventas) y cobro eficiente (para mantener liquidez).`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Cartera Total</span>
            <DollarSign className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">${totales.totalCarteraMillones}M</div>
          <div className="text-sm text-gray-600 mt-1">{formatCurrency(totales.totalCartera)}</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Saldo pendiente total</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal(
            'Rotación Promedio de Cartera',
            `La rotación promedio es de ${totales.promedioRotacion} días. Este indicador mide cuántos días en promedio tarda un cliente en pagar. Ideal: <30 días. Entre 30-45 días es aceptable. >45 días requiere atención. >60 días es crítico. Una rotación baja indica cobro eficiente y buena salud financiera.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Rotación Promedio</span>
            <TrendingUp className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{totales.promedioRotacion}</div>
          <div className="text-sm text-gray-600 mt-1">días</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className={`text-xs ${parseFloat(totales.promedioRotacion) <= 30 ? 'text-green-400' : parseFloat(totales.promedioRotacion) <= 45 ? 'text-yellow-400' : 'text-red-400'}`}>
              {parseFloat(totales.promedioRotacion) <= 30 ? '✓ Excelente' : parseFloat(totales.promedioRotacion) <= 45 ? '⚠ Aceptable' : '⚠ Requiere atención'}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal(
            'Total de Clientes',
            `Total de ${totales.totalClientes} clientes activos gestionados por ${totales.totalAsesores} asesores comerciales. La distribución equilibrada de clientes por asesor permite mejor seguimiento y atención personalizada. Cada asesor debe mantener contacto regular con sus clientes para asegurar cobro oportuno.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Total Clientes</span>
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{totales.totalClientes}</div>
          <div className="text-sm text-gray-600 mt-1">{totales.totalAsesores} asesores</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              ~{Math.round(totales.totalClientes / totales.totalAsesores)} clientes/asesor
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal(
            'Clientes Críticos',
            `${totales.clientesCriticos} clientes (${totales.porcentajeCriticos}% del total) tienen rotación >60 días. Estos clientes requieren atención inmediata: llamadas de seguimiento, planes de pago, visitas personales. Alto riesgo de incobrabilidad. Prioridad máxima para el equipo de cobranza.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-red-500/30 hover:border-red-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Clientes Críticos</span>
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{totales.clientesCriticos}</div>
          <div className="text-sm text-red-400 mt-1">{totales.porcentajeCriticos}% del total</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-red-400">⚠ Rotación &gt;60 días</div>
          </div>
        </motion.div>
      </div>

      {/* Tabla Comparativa Exposición de Cartera */}
      {exposicionCartera.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-blue-500/10 to-green-600/5 backdrop-blur-xl rounded-xl p-6 border-2 border-blue-500/30"
        >
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-8 h-8 text-blue-400" />
            <h2 className="text-2xl font-bold text-gray-900">EXPOSICIÓN DE CARTERA 2025 vs 2024</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-blue-600">
                  <th className="text-left py-3 px-4 text-gray-700 font-bold bg-blue-900/30">MES</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-bold bg-green-900/30">T.2025 (M)</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-bold bg-gray-100/30">T.2024 (M)</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-bold bg-purple-900/30">DIFERENCIA</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-bold bg-orange-900/30">% VAR</th>
                </tr>
              </thead>
              <tbody>
                {exposicionCartera.map((row, idx) => {
                  const diferencia = parseFloat(row.t2025) - parseFloat(row.t2024);
                  const variacion = parseFloat(row.variacion_pct);
                  return (
                    <tr key={idx} className="border-b border-gray-200/50 hover:bg-gray-100/30 transition-colors">
                      <td className="py-3 px-4 text-gray-900 font-semibold">{row.mes_nombre}</td>
                      <td className="py-3 px-4 text-right text-green-400 font-bold">${formatNumber(row.t2025)}</td>
                      <td className="py-3 px-4 text-right text-gray-600">${formatNumber(row.t2024)}</td>
                      <td className="py-3 px-4 text-right text-purple-400">${formatNumber(Math.abs(diferencia))}</td>
                      <td className={`py-3 px-4 text-right font-bold ${variacion >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {variacion >= 0 ? '+' : ''}{variacion}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-gray-100/30 rounded-lg p-4 border border-gray-300">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-gray-900">Análisis:</span> Comparativa mensual de la exposición de cartera. 
              Valores negativos indican reducción de cartera (mejora en cobro). Valores positivos indican aumento (más ventas a crédito o menor cobro).
            </p>
          </div>
        </motion.div>
      )}

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfica 1: Exposición de Cartera */}
        {datosExposicion.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => openModal(
              'Exposición de Cartera 2025 vs 2024',
              'Evolución mensual de la cartera. Permite identificar tendencias, estacionalidad y comparar el desempeño año tras año. Una cartera estable o decreciente indica buen cobro.'
            )}
            className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-gray-200 hover:border-blue-500 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Exposición de Cartera (Millones)</h3>
              <Info className="w-5 h-5 text-blue-400 animate-pulse" />
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={datosExposicion}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="mes" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
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
                              <span className="text-indigo-600 font-medium">2024:</span>
                              <span className="font-bold text-gray-900">${formatNumber(val2024)}M</span>
                            </div>
                            <div className="flex justify-between items-center gap-4">
                              <span className="text-green-600 font-medium">2025:</span>
                              <span className="font-bold text-gray-900">${formatNumber(val2025)}M</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2 mt-2">
                              <div className="flex justify-between items-center gap-4">
                                <span className="text-gray-600 font-medium">Diferencia:</span>
                                <span className={`font-bold ${diferencia >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                  {diferencia >= 0 ? '+' : ''}${formatNumber(diferencia)}M
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
                  }}
                />
                <Legend />
                <Bar dataKey="2024" fill="#6366f1" name="2024" radius={[8, 8, 0, 0]} />
                <Bar dataKey="2025" fill="#10b981" name="2025" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Gráfica 2: Distribución por Rango de Rotación */}
        {datosRangos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={() => openModal(
              'Clientes por Rango de Rotación',
              'Distribución de clientes según días de rotación. Excelente (0-15): cobro rápido. Bueno (16-30): estándar. Regular (31-45): requiere seguimiento. Malo (46-60): atención prioritaria. Crítico (>60): riesgo alto.'
            )}
            className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-gray-200 hover:border-green-500 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Clientes por Rango de Rotación</h3>
              <Info className="w-5 h-5 text-green-400 animate-pulse" />
            </div>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="60%" height={350}>
                <PieChart>
                  <Pie
                    data={datosRangos}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {datosRangos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const total = datosRangos.reduce((sum, r) => sum + r.value, 0);
                        const porcentaje = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
                        return (
                          <div className="bg-white border-2 border-green-500 rounded-xl p-4 shadow-xl">
                            <p className="font-bold text-gray-900 mb-3 text-lg">{data.fullName}</p>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center gap-4">
                                <span className="text-gray-600 font-medium">Clientes:</span>
                                <span className="font-bold text-gray-900">{data.value}</span>
                              </div>
                              <div className="flex justify-between items-center gap-4">
                                <span className="text-green-600 font-medium">Porcentaje:</span>
                                <span className="font-bold text-gray-900">{porcentaje}%</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {datosRangos.map((entry, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 transition-colors">
                    <div className="w-4 h-4 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">{entry.name}</div>
                      <div className="text-xs text-gray-600">{entry.value} clientes</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Top 10 Clientes */}
      {top10Clientes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Top 10 Clientes por Saldo</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Cliente</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-bold">Saldo Pendiente</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-bold">Rotación (días)</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Asesor</th>
                </tr>
              </thead>
              <tbody>
                {top10Clientes.map((cliente, idx) => (
                  <tr key={idx} className="border-b border-gray-200/50 hover:bg-gray-100/30 transition-colors">
                    <td className="py-3 px-4 text-gray-900 font-medium">{cliente.nombre_cliente}</td>
                    <td className="py-3 px-4 text-right text-green-400 font-bold">
                      {formatCurrency(cliente.saldo_pendiente)}
                    </td>
                    <td className={`py-3 px-4 text-right font-medium ${
                      cliente.dias_rotacion_real > 60 ? 'text-red-400' :
                      cliente.dias_rotacion_real > 45 ? 'text-orange-400' :
                      cliente.dias_rotacion_real > 30 ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {cliente.dias_rotacion_real}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{cliente.asesor_asignado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Clientes Críticos */}
      {clientesCriticos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-red-500/30"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Clientes Críticos (Rotación &gt; 60 días)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-red-600">
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Cliente</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-bold">Saldo</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-bold">Días Rotación</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Asesor</th>
                </tr>
              </thead>
              <tbody>
                {clientesCriticos.map((cliente, idx) => (
                  <tr key={idx} className="border-b border-gray-200/50 hover:bg-red-50/50 transition-colors">
                    <td className="py-3 px-4 text-gray-900 font-medium">{cliente.nombre_cliente}</td>
                    <td className="py-3 px-4 text-right text-red-400 font-bold">
                      {formatCurrency(cliente.saldo_pendiente)}
                    </td>
                    <td className="py-3 px-4 text-right text-red-400 font-bold">
                      {cliente.dias_rotacion_real}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{cliente.asesor_asignado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

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
              className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-green-500 shadow-2xl"
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
              <div className="text-gray-700 leading-relaxed">
                {modalContent.description}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
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
