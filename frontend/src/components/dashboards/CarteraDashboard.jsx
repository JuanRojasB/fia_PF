import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ComposedChart } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Users, AlertTriangle, Calendar, CreditCard, Percent } from 'lucide-react';

export default function CarteraDashboard({ data }) {
  console.log('CarteraDashboard - Datos recibidos:', data);

  if (!data || typeof data !== 'object') {
    return <div className="text-gray-400">No hay datos disponibles</div>;
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
    return new Intl.NumberFormat('es-CO').format(value);
  };

  // Preparar datos para gráfico de asesores
  const datosAsesores = Object.entries(porAsesor).map(([asesor, data]) => ({
    asesor,
    clientes: data.clientes,
    cartera: data.cartera / 1000000, // En millones
    rotacion: parseFloat(data.rotacionPromedio)
  }));

  // Preparar datos para gráfico de rangos
  const datosRangos = Object.entries(porRangoRotacion).map(([rango, cantidad]) => ({
    rango,
    cantidad
  }));

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
  
  // Nombres de meses
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  return (
    <div className="space-y-6">
      {/* Comparativa Exposición de Cartera 2025 vs 2024 */}
      {exposicionCartera.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-blue-400" />
            <h3 className="text-2xl font-bold text-white">Exposición de Cartera - Comparativa 2025 vs 2024</h3>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={exposicionCartera.map(d => ({
              mes: meses[d.mes_num - 1],
              '2025': parseFloat(d.t2025),
              '2024': parseFloat(d.t2024),
              variacion: parseFloat(d.variacion_pct)
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="mes" stroke="#9ca3af" />
              <YAxis yAxisId="left" stroke="#9ca3af" label={{ value: 'Millones $', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" label={{ value: 'Variación %', angle: 90, position: 'insideRight', fill: '#9ca3af' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                formatter={(value, name) => {
                  if (name === 'variacion') return [value + '%', 'Variación'];
                  return ['$' + formatNumber(value) + 'M', name];
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="2025" fill="#10b981" name="2025" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="left" dataKey="2024" fill="#6366f1" name="2024" radius={[8, 8, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="variacion" stroke="#f59e0b" strokeWidth={3} name="Variación %" />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Mix de Ventas 2025: Contado vs Crédito */}
      {mixVentas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-6 h-6 text-green-400" />
            <h3 className="text-2xl font-bold text-white">Mix de Ventas 2025 - Contado vs Crédito</h3>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={mixVentas.map(d => ({
              mes: meses[d.mes_num - 1],
              contado: parseFloat(d.pct_contado),
              credito: parseFloat(d.pct_credito),
              morosidad: parseFloat(d.morosidad_vencida_pct),
              rotacion: parseFloat(d.dias_rotacion)
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="mes" stroke="#9ca3af" />
              <YAxis yAxisId="left" stroke="#9ca3af" label={{ value: 'Porcentaje %', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" label={{ value: 'Días', angle: 90, position: 'insideRight', fill: '#9ca3af' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                formatter={(value, name) => {
                  if (name === 'rotacion') return [value + ' días', 'Rotación'];
                  return [value + '%', name];
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="contado" stackId="a" fill="#10b981" name="% Contado" radius={[0, 0, 0, 0]} />
              <Bar yAxisId="left" dataKey="credito" stackId="a" fill="#3b82f6" name="% Crédito" radius={[8, 8, 0, 0]} />
              <Line yAxisId="left" type="monotone" dataKey="morosidad" stroke="#ef4444" strokeWidth={3} name="% Morosidad" />
              <Line yAxisId="right" type="monotone" dataKey="rotacion" stroke="#f59e0b" strokeWidth={3} name="Días Rotación" />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>
      )}
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-green-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Cartera Total</span>
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{formatCurrency(totales.totalCartera)}</div>
          <div className="text-sm text-gray-400 mt-1">${totales.totalCarteraMillones}M</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-blue-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Rotación Promedio</span>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">{totales.promedioRotacion}</div>
          <div className="text-sm text-gray-400 mt-1">días</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Clientes</span>
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white">{totales.totalClientes}</div>
          <div className="text-sm text-gray-400 mt-1">{totales.totalAsesores} asesores</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-red-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Clientes Críticos</span>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-white">{totales.clientesCriticos}</div>
          <div className="text-sm text-red-400 mt-1">{totales.porcentajeCriticos}% del total</div>
        </motion.div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cartera por Asesor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-xl font-bold text-white mb-6">Cartera por Asesor (Millones)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosAsesores} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="asesor" type="category" stroke="#9ca3af" width={120} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                formatter={(value, name) => {
                  if (name === 'cartera') return ['$' + value.toFixed(2) + 'M', 'Cartera'];
                  if (name === 'rotacion') return [value + ' días', 'Rotación'];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar dataKey="cartera" fill="#10b981" name="Cartera (M)" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Distribución por Rango de Rotación */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-xl font-bold text-white mb-6">Clientes por Rango de Rotación</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={datosRangos}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ rango, cantidad }) => `${rango.split('(')[0]}: ${cantidad}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="cantidad"
              >
                {datosRangos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top 10 Clientes */}
      {top10Clientes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-xl font-bold text-white mb-4">Top 10 Clientes por Saldo</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-3 px-4 text-gray-300">Cliente</th>
                  <th className="text-right py-3 px-4 text-gray-300">Saldo Pendiente</th>
                  <th className="text-right py-3 px-4 text-gray-300">Rotación (días)</th>
                  <th className="text-left py-3 px-4 text-gray-300">Asesor</th>
                </tr>
              </thead>
              <tbody>
                {top10Clientes.map((cliente, idx) => (
                  <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="py-3 px-4 text-white font-medium">{cliente.nombre_cliente}</td>
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
                    <td className="py-3 px-4 text-gray-400">{cliente.asesor_asignado}</td>
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
          transition={{ delay: 0.7 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-red-500/30"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Clientes Críticos (Rotación &gt; 60 días)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-red-600">
                  <th className="text-left py-3 px-4 text-gray-300">Cliente</th>
                  <th className="text-right py-3 px-4 text-gray-300">Saldo</th>
                  <th className="text-right py-3 px-4 text-gray-300">Días Rotación</th>
                  <th className="text-left py-3 px-4 text-gray-300">Asesor</th>
                </tr>
              </thead>
              <tbody>
                {clientesCriticos.map((cliente, idx) => (
                  <tr key={idx} className="border-b border-slate-700/50 hover:bg-red-900/20">
                    <td className="py-3 px-4 text-white font-medium">{cliente.nombre_cliente}</td>
                    <td className="py-3 px-4 text-right text-red-400 font-bold">
                      {formatCurrency(cliente.saldo_pendiente)}
                    </td>
                    <td className="py-3 px-4 text-right text-red-400 font-bold">
                      {cliente.dias_rotacion_real}
                    </td>
                    <td className="py-3 px-4 text-gray-400">{cliente.asesor_asignado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Detalle por Asesor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <h3 className="text-xl font-bold text-white mb-4">Detalle por Asesor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(porAsesor).map(([asesor, data], idx) => (
            <div key={idx} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
              <div className="font-bold text-white mb-2">{asesor}</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Clientes:</span>
                  <span className="text-white font-medium">{data.clientes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Cartera:</span>
                  <span className="text-green-400 font-medium">{formatCurrency(data.cartera)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rotación Prom:</span>
                  <span className="text-blue-400 font-medium">{data.rotacionPromedio} días</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">% Cartera:</span>
                  <span className="text-purple-400 font-medium">{data.carteraPorcentaje}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
