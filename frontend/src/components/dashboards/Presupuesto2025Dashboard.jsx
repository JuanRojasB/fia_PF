import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, DollarSign, AlertCircle, X, Info, PieChart as PieChartIcon, FileText, Scale } from 'lucide-react';

export default function Presupuesto2025Dashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  };

  if (!data || !data.variablesMacro) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const { variablesMacro, presupuestoCaja, ejecucionTrimestral, tributacion, marcoLegal } = data;

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO').format(value);
  };

  const formatMiles = (value) => {
    // Convertir miles a millones para mejor legibilidad
    return (value / 1000).toFixed(0);
  };

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-xl p-6 border border-blue-500/30">
        <h2 className="text-3xl font-bold text-white mb-2">Presupuesto 2025</h2>
        <p className="text-gray-300">Análisis de ejecución presupuestal, variables macroeconómicas y marco tributario</p>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Crecimiento 2025',
            <div className="text-gray-300">
              <p className="mb-4">El crecimiento del <strong className="text-green-400">{variablesMacro.crecimiento}%</strong> en 2025 refleja los resultados positivos de la gestión empresarial.</p>
              <div className="bg-green-900/30 rounded-lg p-4 border border-green-700/50">
                <p className="text-sm font-semibold text-white mb-2">Factores clave:</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Inflación controlada similar a 2024</li>
                  <li>Reducción del índice de mortalidad</li>
                  <li>Incremento en flujo de efectivo del 59%</li>
                </ul>
              </div>
            </div>
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Crecimiento 2025</span>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white">{variablesMacro.crecimiento}%</div>
          <div className="text-sm text-gray-400 mt-1">Crecimiento anual</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Presupuesto de Caja',
            <div className="text-gray-300">
              <p className="mb-4">El efectivo y sus equivalentes aumentaron en <strong className="text-blue-400">${formatNumber(presupuestoCaja.incremento_absoluto)} MM</strong>, representando un incremento del <strong className="text-white">{presupuestoCaja.incremento_porcentual}%</strong>.</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">2024</p>
                  <p className="text-lg font-bold text-white">${formatNumber(presupuestoCaja.efectivo_2024)} MM</p>
                </div>
                <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-700/50">
                  <p className="text-xs text-gray-400 mb-1">2025</p>
                  <p className="text-lg font-bold text-blue-400">${formatNumber(presupuestoCaja.efectivo_2025)} MM</p>
                </div>
              </div>
              <div className="bg-green-900/30 rounded-lg p-3 border border-green-700/50">
                <p className="text-sm">Esta situación refleja los <strong className="text-green-400">resultados positivos durante el año</strong>.</p>
              </div>
            </div>
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Efectivo 2025</span>
            <DollarSign className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">${formatNumber(presupuestoCaja.efectivo_2025)}</div>
          <div className="text-sm text-gray-400 mt-1">Millones de pesos</div>
          <div className="mt-3 pt-3 border-t border-slate-700">
            <div className="text-xs text-gray-500">Incremento vs 2024</div>
            <div className="text-lg font-semibold text-green-400">+{presupuestoCaja.incremento_porcentual}%</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-yellow-500/30 hover:border-yellow-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Reducción de Mortalidad',
            <div className="text-gray-300">
              <p className="mb-4">Es de resaltar que se redujo el índice de mortalidad significativamente:</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-red-900/30 rounded-lg p-3 border border-red-700/50">
                  <p className="text-xs text-gray-400 mb-1">2024</p>
                  <p className="text-2xl font-bold text-red-400">{variablesMacro.mortalidad_2024}%</p>
                </div>
                <div className="bg-green-900/30 rounded-lg p-3 border border-green-700/50">
                  <p className="text-xs text-gray-400 mb-1">2025</p>
                  <p className="text-2xl font-bold text-green-400">{variablesMacro.mortalidad_2025}%</p>
                </div>
              </div>
              <div className="bg-yellow-900/30 rounded-lg p-3 border border-yellow-700/50">
                <p className="text-sm">Reducción de <strong className="text-yellow-400">{variablesMacro.reduccion_mortalidad} puntos porcentuales</strong>, mejorando la eficiencia operativa.</p>
              </div>
            </div>
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Mortalidad 2025</span>
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-white">{variablesMacro.mortalidad_2025}%</div>
          <div className="text-sm text-gray-400 mt-1">Índice de mortalidad</div>
          <div className="mt-3 pt-3 border-t border-slate-700">
            <div className="text-xs text-gray-500">Reducción vs 2024</div>
            <div className="text-lg font-semibold text-green-400">-{variablesMacro.reduccion_mortalidad}pp</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Inflación Controlada',
            <div className="text-gray-300">
              <p className="mb-4">La inflación se mantuvo estable y controlada entre 2024 y 2025:</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">2024</p>
                  <p className="text-2xl font-bold text-white">{variablesMacro.inflacion_2024}%</p>
                </div>
                <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-700/50">
                  <p className="text-xs text-gray-400 mb-1">2025</p>
                  <p className="text-2xl font-bold text-purple-400">{variablesMacro.inflacion_2025}%</p>
                </div>
              </div>
              <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-700/50">
                <p className="text-sm">La inflación muy similar año tras año <strong className="text-blue-400">ayudó con el crecimiento del {variablesMacro.crecimiento}%</strong>.</p>
              </div>
            </div>
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Inflación 2025</span>
            <PieChartIcon className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white">{variablesMacro.inflacion_2025}%</div>
          <div className="text-sm text-gray-400 mt-1">Tasa de inflación</div>
          <div className="mt-3 pt-3 border-t border-slate-700">
            <div className="text-xs text-gray-500">Similar a 2024</div>
            <div className="text-lg font-semibold text-purple-400">{variablesMacro.inflacion_2024}%</div>
          </div>
        </motion.div>
      </div>

      {/* Gráficos de Ejecución Trimestral */}
      <div className="grid grid-cols-1 gap-6">
        {/* Total PF */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Total Pollo Fiesta - Ejecución Trimestral</h3>
            <button
              onClick={() => openModal(
                'Total PF - Tabla Completa',
                <div className="text-gray-300">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-slate-600">
                          <th className="text-left py-2 px-3 text-white font-bold">Trimestre</th>
                          <th className="text-right py-2 px-3 text-white font-bold">2025 Real</th>
                          <th className="text-right py-2 px-3 text-white font-bold">2025 Ppto</th>
                          <th className="text-right py-2 px-3 text-white font-bold">2024 Real</th>
                          <th className="text-right py-2 px-3 text-white font-bold">Var Ppto</th>
                          <th className="text-right py-2 px-3 text-white font-bold">Var 25/24</th>
                          <th className="text-right py-2 px-3 text-white font-bold">Var 24/23</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ejecucionTrimestral.totalPF.data.map((row, idx) => (
                          <tr key={idx} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                            <td className="py-2 px-3 text-white font-semibold">{row.trimestre}</td>
                            <td className="py-2 px-3 text-right text-green-400 font-bold">${formatNumber(row.real_2025)}</td>
                            <td className="py-2 px-3 text-right text-blue-400">${formatNumber(row.ppto_2025)}</td>
                            <td className="py-2 px-3 text-right text-gray-400">${formatNumber(row.real_2024)}</td>
                            <td className={`py-2 px-3 text-right font-bold ${row.var_25_ppto_vs_real >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {row.var_25_ppto_vs_real}%
                            </td>
                            <td className={`py-2 px-3 text-right font-bold ${row.var_25_vs_24 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {row.var_25_vs_24}%
                            </td>
                            <td className={`py-2 px-3 text-right font-bold ${row.var_24_vs_23 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {row.var_24_vs_23}%
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t-2 border-slate-600 bg-slate-700/50 font-bold">
                          <td className="py-2 px-3 text-white">TOTAL</td>
                          <td className="py-2 px-3 text-right text-green-400">${formatNumber(ejecucionTrimestral.totalPF.totales.real_2025)}</td>
                          <td className="py-2 px-3 text-right text-blue-400">${formatNumber(ejecucionTrimestral.totalPF.totales.ppto_2025)}</td>
                          <td className="py-2 px-3 text-right text-gray-400">${formatNumber(ejecucionTrimestral.totalPF.totales.real_2024)}</td>
                          <td className={`py-2 px-3 text-right ${parseFloat(ejecucionTrimestral.totalPF.variaciones.var_25_ppto_vs_real) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {ejecucionTrimestral.totalPF.variaciones.var_25_ppto_vs_real}%
                          </td>
                          <td className={`py-2 px-3 text-right ${parseFloat(ejecucionTrimestral.totalPF.variaciones.var_25_vs_24) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {ejecucionTrimestral.totalPF.variaciones.var_25_vs_24}%
                          </td>
                          <td className={`py-2 px-3 text-right ${parseFloat(ejecucionTrimestral.totalPF.variaciones.var_24_vs_23) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {ejecucionTrimestral.totalPF.variaciones.var_24_vs_23}%
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Info className="w-5 h-5 text-blue-400" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={ejecucionTrimestral.totalPF.data} margin={{ left: 10, right: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="trimestre" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" tickFormatter={(value) => `${formatMiles(value)}M`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value) => [`$${formatNumber(value)}`, '']}
              />
              <Legend />
              <Line type="monotone" dataKey="real_2025" name="Real 2025" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="ppto_2025" name="Ppto 2025" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" />
              <Line type="monotone" dataKey="real_2024" name="Real 2024" stroke="#6b7280" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Integrado Mayorista */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Integrado Mayorista - Ejecución Trimestral</h3>
            <button
              onClick={() => openModal(
                'Integrado Mayorista - Tabla Completa',
                <div className="text-gray-300">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-slate-600">
                          <th className="text-left py-2 px-3 text-white font-bold">Trimestre</th>
                          <th className="text-right py-2 px-3 text-white font-bold">2025 Real</th>
                          <th className="text-right py-2 px-3 text-white font-bold">2025 Ppto</th>
                          <th className="text-right py-2 px-3 text-white font-bold">2024 Real</th>
                          <th className="text-right py-2 px-3 text-white font-bold">Var Ppto</th>
                          <th className="text-right py-2 px-3 text-white font-bold">Var 25/24</th>
                          <th className="text-right py-2 px-3 text-white font-bold">Var 24/23</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ejecucionTrimestral.integradoMayorista.data.map((row, idx) => (
                          <tr key={idx} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                            <td className="py-2 px-3 text-white font-semibold">{row.trimestre}</td>
                            <td className="py-2 px-3 text-right text-green-400 font-bold">${formatNumber(row.real_2025)}</td>
                            <td className="py-2 px-3 text-right text-blue-400">${formatNumber(row.ppto_2025)}</td>
                            <td className="py-2 px-3 text-right text-gray-400">${formatNumber(row.real_2024)}</td>
                            <td className={`py-2 px-3 text-right font-bold ${row.var_25_ppto_vs_real >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {row.var_25_ppto_vs_real}%
                            </td>
                            <td className={`py-2 px-3 text-right font-bold ${row.var_25_vs_24 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {row.var_25_vs_24}%
                            </td>
                            <td className={`py-2 px-3 text-right font-bold ${row.var_24_vs_23 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {row.var_24_vs_23}%
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t-2 border-slate-600 bg-slate-700/50 font-bold">
                          <td className="py-2 px-3 text-white">TOTAL</td>
                          <td className="py-2 px-3 text-right text-green-400">${formatNumber(ejecucionTrimestral.integradoMayorista.totales.real_2025)}</td>
                          <td className="py-2 px-3 text-right text-blue-400">${formatNumber(ejecucionTrimestral.integradoMayorista.totales.ppto_2025)}</td>
                          <td className="py-2 px-3 text-right text-gray-400">${formatNumber(ejecucionTrimestral.integradoMayorista.totales.real_2024)}</td>
                          <td className={`py-2 px-3 text-right ${parseFloat(ejecucionTrimestral.integradoMayorista.variaciones.var_25_ppto_vs_real) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {ejecucionTrimestral.integradoMayorista.variaciones.var_25_ppto_vs_real}%
                          </td>
                          <td className={`py-2 px-3 text-right ${parseFloat(ejecucionTrimestral.integradoMayorista.variaciones.var_25_vs_24) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {ejecucionTrimestral.integradoMayorista.variaciones.var_25_vs_24}%
                          </td>
                          <td className={`py-2 px-3 text-right ${parseFloat(ejecucionTrimestral.integradoMayorista.variaciones.var_24_vs_23) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {ejecucionTrimestral.integradoMayorista.variaciones.var_24_vs_23}%
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Info className="w-5 h-5 text-blue-400" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={ejecucionTrimestral.integradoMayorista.data} margin={{ left: 10, right: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="trimestre" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" tickFormatter={(value) => `${formatMiles(value)}M`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value) => [`$${formatNumber(value)}`, '']}
              />
              <Legend />
              <Bar dataKey="real_2025" name="Real 2025" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="ppto_2025" name="Ppto 2025" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="real_2024" name="Real 2024" fill="#6b7280" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

      {/* Pollo Canal - Gráfico completo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Pollo Canal - Ejecución Trimestral</h3>
          <button
            onClick={() => openModal(
              'Pollo Canal - Tabla Completa',
              <div className="text-gray-300">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-slate-600">
                        <th className="text-left py-2 px-3 text-white font-bold">Trimestre</th>
                        <th className="text-right py-2 px-3 text-white font-bold">2025 Real</th>
                        <th className="text-right py-2 px-3 text-white font-bold">2025 Ppto</th>
                        <th className="text-right py-2 px-3 text-white font-bold">2024 Real</th>
                        <th className="text-right py-2 px-3 text-white font-bold">Var Ppto</th>
                        <th className="text-right py-2 px-3 text-white font-bold">Var 25/24</th>
                        <th className="text-right py-2 px-3 text-white font-bold">Var 24/23</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ejecucionTrimestral.polloCanal.data.map((row, idx) => (
                        <tr key={idx} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                          <td className="py-2 px-3 text-white font-semibold">{row.trimestre}</td>
                          <td className="py-2 px-3 text-right text-green-400 font-bold">${formatNumber(row.real_2025)}</td>
                          <td className="py-2 px-3 text-right text-blue-400">${formatNumber(row.ppto_2025)}</td>
                          <td className="py-2 px-3 text-right text-gray-400">${formatNumber(row.real_2024)}</td>
                          <td className={`py-2 px-3 text-right font-bold ${row.var_25_ppto_vs_real >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {row.var_25_ppto_vs_real}%
                          </td>
                          <td className={`py-2 px-3 text-right font-bold ${row.var_25_vs_24 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {row.var_25_vs_24}%
                          </td>
                          <td className={`py-2 px-3 text-right font-bold ${row.var_24_vs_23 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {row.var_24_vs_23}%
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t-2 border-slate-600 bg-slate-700/50 font-bold">
                        <td className="py-2 px-3 text-white">TOTAL</td>
                        <td className="py-2 px-3 text-right text-green-400">${formatNumber(ejecucionTrimestral.polloCanal.totales.real_2025)}</td>
                        <td className="py-2 px-3 text-right text-blue-400">${formatNumber(ejecucionTrimestral.polloCanal.totales.ppto_2025)}</td>
                        <td className="py-2 px-3 text-right text-gray-400">${formatNumber(ejecucionTrimestral.polloCanal.totales.real_2024)}</td>
                        <td className={`py-2 px-3 text-right ${parseFloat(ejecucionTrimestral.polloCanal.variaciones.var_25_ppto_vs_real) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {ejecucionTrimestral.polloCanal.variaciones.var_25_ppto_vs_real}%
                        </td>
                        <td className={`py-2 px-3 text-right ${parseFloat(ejecucionTrimestral.polloCanal.variaciones.var_25_vs_24) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {ejecucionTrimestral.polloCanal.variaciones.var_25_vs_24}%
                        </td>
                        <td className={`py-2 px-3 text-right ${parseFloat(ejecucionTrimestral.polloCanal.variaciones.var_24_vs_23) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {ejecucionTrimestral.polloCanal.variaciones.var_24_vs_23}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Info className="w-5 h-5 text-blue-400" />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={ejecucionTrimestral.polloCanal.data} margin={{ left: 10, right: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="trimestre" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" tickFormatter={(value) => `${formatMiles(value)}M`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#fff' }}
              formatter={(value) => [`$${formatNumber(value)}`, '']}
            />
            <Legend />
            <Line type="monotone" dataKey="real_2025" name="Real 2025" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
            <Line type="monotone" dataKey="ppto_2025" name="Ppto 2025" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" />
            <Line type="monotone" dataKey="real_2024" name="Real 2024" stroke="#6b7280" strokeWidth={2} />
            <Line type="monotone" dataKey="real_2023" name="Real 2023" stroke="#9ca3af" strokeWidth={1} strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
      </div>

      {/* Marco Tributario */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Scale className="w-6 h-6 text-orange-400" />
          Marco Tributario 2025
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            className="bg-gradient-to-br from-orange-900/40 to-orange-800/20 rounded-xl p-4 border border-orange-700/50 cursor-pointer hover:border-orange-500 transition-all"
            onClick={() => openModal(
              'Tasa Mínima de Tributación',
              <div className="text-gray-300">
                <p className="mb-4">El artículo 240, parágrafo 6 establece una <strong className="text-orange-400">tasa mínima de tributación del {tributacion.tasa_minima}%</strong> para los contribuyentes del impuesto sobre la renta.</p>
                <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-700/50 mb-4">
                  <p className="text-sm font-semibold text-white mb-2">Tasa de Tributación Depurada (TTD):</p>
                  <p className="text-sm">TTD = Impuesto Depurado (ID) / Utilidad Depurada (UD)</p>
                  <p className="text-sm mt-2">La TTD no podrá ser inferior al 15%</p>
                </div>
                <div className="bg-green-900/30 rounded-lg p-4 border border-green-700/50">
                  <p className="text-sm font-semibold text-white mb-2">Resultado Pollo Fiesta:</p>
                  <p className="text-sm">Para el año gravable 2025, Pollo Fiesta incrementó su tasa de tributación en <strong className="text-green-400">{tributacion.incremento_tributacion_2025}%</strong> con relación al impuesto neto de renta del año 2024.</p>
                </div>
              </div>
            )}
          >
            <Scale className="w-8 h-8 text-orange-400 mb-3" />
            <div className="text-orange-400 font-semibold mb-2">Tasa Mínima</div>
            <div className="text-white text-2xl font-bold">{tributacion.tasa_minima}%</div>
            <div className="text-xs text-gray-400 mt-2">Incremento 2025: +{tributacion.incremento_tributacion_2025}%</div>
          </div>

          <div 
            className="bg-gradient-to-br from-red-900/40 to-red-800/20 rounded-xl p-4 border border-red-700/50 cursor-pointer hover:border-red-500 transition-all"
            onClick={() => openModal(
              'Impuestos Saludables',
              <div className="text-gray-300">
                <p className="mb-4">Continúa vigente el impuesto sobre alimentos ultra procesados o azucarados:</p>
                <div className="space-y-2 mb-4">
                  {tributacion.impuestos_saludables.map((imp, idx) => (
                    <div key={idx} className="bg-slate-700/50 rounded-lg p-3 flex items-center justify-between">
                      <span className="font-semibold text-white">{imp.anio}</span>
                      <span className={`text-xl font-bold ${imp.anio === 2025 ? 'text-red-400' : 'text-gray-400'}`}>{imp.tasa}%</span>
                    </div>
                  ))}
                </div>
                <div className="bg-red-900/30 rounded-lg p-4 border border-red-700/50">
                  <p className="text-sm">El impuesto aplica sobre bebidas ultra procesadas azucaradas y alimentos ultra procesados o azucarados.</p>
                </div>
              </div>
            )}
          >
            <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
            <div className="text-red-400 font-semibold mb-2">Impuestos Saludables</div>
            <div className="text-white text-2xl font-bold">20%</div>
            <div className="text-xs text-gray-400 mt-2">Tasa 2025 y siguientes</div>
          </div>

          <div 
            className="bg-gradient-to-br from-green-900/40 to-green-800/20 rounded-xl p-4 border border-green-700/50 cursor-pointer hover:border-green-500 transition-all"
            onClick={() => openModal(
              'Cumplimiento Tributario',
              <div className="text-gray-300">
                <p className="mb-4">En materia tributaria por el año gravable 2025, Pollo Fiesta S.A. elaboró y presentó oportunamente todas las declaraciones de impuestos.</p>
                <div className="bg-green-900/30 rounded-lg p-4 border border-green-700/50 mb-4">
                  <p className="text-sm font-semibold text-white mb-2">Recuperación de cartera fiscal:</p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Saldos a favor en IVA recuperados</li>
                    <li>Sin ningún tipo de glosa ante la DIAN</li>
                    <li>Impuesto al Consumo y retenciones en la fuente al día</li>
                    <li>Impuestos de orden territorial cumplidos</li>
                  </ul>
                </div>
              </div>
            )}
          >
            <FileText className="w-8 h-8 text-green-400 mb-3" />
            <div className="text-green-400 font-semibold mb-2">Cumplimiento</div>
            <div className="text-white text-lg font-bold">100%</div>
            <div className="text-xs text-gray-400 mt-2">Declaraciones presentadas</div>
          </div>
        </div>
      </motion.div>

      {/* Marco Legal y Tecnológico */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <h3 className="text-xl font-bold text-white mb-4">Situación Jurídica y Tecnológica</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 rounded-xl p-4 border border-blue-700/50 cursor-pointer hover:border-blue-500 transition-all"
            onClick={() => openModal(
              'Marco Legal - Protección de Datos',
              <div className="text-gray-300">
                <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700/50 mb-4">
                  <p className="text-sm font-semibold text-white mb-2">{marcoLegal.ley_603_2000}</p>
                  <p className="text-sm">Propiedad intelectual y derechos de autor en Proceso Electrónico de Datos (PED).</p>
                </div>
                <div className="bg-green-900/30 rounded-lg p-4 border border-green-700/50 mb-4">
                  <p className="text-sm font-semibold text-white mb-2">Ley 1581 de 2012</p>
                  <p className="text-sm mb-3">{marcoLegal.ley_1581_2012}</p>
                  <p className="text-sm font-semibold text-white mb-2">Principios aplicados por Pollo Fiesta:</p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li><strong>Legalidad:</strong> Inscrita en el RNBD (Habeas Data)</li>
                    <li><strong>Finalidad:</strong> Datos para fines legítimos informados</li>
                    <li><strong>Libertad:</strong> Consentimiento previo y expreso</li>
                    <li><strong>Veracidad:</strong> Datos veraces y actualizados</li>
                    <li><strong>Transparencia:</strong> Información disponible al titular</li>
                  </ul>
                </div>
              </div>
            )}
          >
            <FileText className="w-8 h-8 text-blue-400 mb-3" />
            <div className="text-blue-400 font-semibold mb-2">Marco Legal</div>
            <div className="text-white text-sm mb-2">Ley 603/2000 - Ley 1581/2012</div>
            <div className="text-xs text-gray-400">Protección de datos y PED</div>
          </div>

          <div 
            className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 rounded-xl p-4 border border-purple-700/50 cursor-pointer hover:border-purple-500 transition-all"
            onClick={() => openModal(
              'Sistema ERP Enterprise',
              <div className="text-gray-300">
                <p className="mb-4">El sistema de información con su nube (cloud) navega con el <strong className="text-purple-400">{marcoLegal.erp_sistema}</strong></p>
                <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700/50 mb-4">
                  <p className="text-sm font-semibold text-white mb-2">Aplicativos activos:</p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Nómina, Comercial y Finanzas</li>
                    <li>CRM - Gestión de Relación con Clientes</li>
                    <li>PQRS - Servicio al Cliente</li>
                    <li>Mobile phone - Captura de pedidos</li>
                    <li>Business Intelligence (BI) - Finanzas</li>
                    <li>Reporteadores Flex, Mobile, Generic Transfer</li>
                  </ul>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-white mb-2">En proceso de Re-parametrización:</p>
                  <p className="text-sm">Compras, Almacén, Inventarios y Mantenimiento</p>
                </div>
              </div>
            )}
          >
            <PieChartIcon className="w-8 h-8 text-purple-400 mb-3" />
            <div className="text-purple-400 font-semibold mb-2">ERP Enterprise</div>
            <div className="text-white text-sm mb-2">SIESA DIGITAL S.A.S.</div>
            <div className="text-xs text-gray-400">Minería de datos y BI</div>
          </div>

          <div 
            className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 rounded-xl p-4 border border-yellow-700/50 cursor-pointer hover:border-yellow-500 transition-all"
            onClick={() => openModal(
              'Proceso Ronda Río Fucha',
              <div className="text-gray-300">
                <div className="bg-yellow-900/30 rounded-lg p-4 border border-yellow-700/50 mb-4">
                  <p className="text-sm font-semibold text-white mb-2">Estado actual:</p>
                  <p className="text-sm">{marcoLegal.proceso_rio_fucha.estado}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-white mb-2">Antecedentes:</p>
                  <ul className="text-sm space-y-2">
                    <li>• Auto de fecha {marcoLegal.proceso_rio_fucha.fecha_auto}: Juez 19 Administrativa solicitó informe final de entrega de predios</li>
                    <li>• Cumplimiento por interiores 1 y 3 (Globerty no involucrada)</li>
                    <li>• Incidente de desacato no prosperó en favor de Alcaldía de Kennedy</li>
                  </ul>
                </div>
                <div className="bg-red-900/30 rounded-lg p-4 border border-red-700/50">
                  <p className="text-sm font-semibold text-white mb-2">Recursos presentados (fuera de término legal):</p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Recurso de excepción de pérdida de ejecutoriedad (2023)</li>
                    <li>Recurso de reposición subsidiariamente con apelación (2023)</li>
                    <li>Oposición a {marcoLegal.proceso_rio_fucha.resolucion}</li>
                  </ul>
                </div>
              </div>
            )}
          >
            <AlertCircle className="w-8 h-8 text-yellow-400 mb-3" />
            <div className="text-yellow-400 font-semibold mb-2">Río Fucha</div>
            <div className="text-white text-sm mb-2">Recurso de excepción</div>
            <div className="text-xs text-gray-400">Pérdida de ejecutoriedad</div>
          </div>
        </div>
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
              className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border-4 border-blue-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">{modalContent.title}</h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-gray-300 leading-relaxed">
                {modalContent.content}
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
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
