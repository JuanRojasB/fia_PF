import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, DollarSign, AlertCircle, X, Info, PieChart as PieChartIcon, FileText, Scale } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';

// Componente de Tooltip personalizado
const CustomTooltip = ({ active, payload, label, formatNumber }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ 
        backgroundColor: '#ffffff', 
        border: '2px solid #3b82f6',
        borderRadius: '8px',
        padding: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <p style={{ color: '#111827', fontWeight: 'bold', marginBottom: '8px' }}>{label}</p>
        {payload.map((entry, index) => {
          const labels = {
            'real_2025': 'Ejecución Real 2025',
            'ppto_2025': 'Presupuesto 2025',
            'real_2024': 'Ejecución Real 2024',
            'real_2023': 'Ejecución Real 2023'
          };
          return (
            <p key={index} style={{ color: entry.color, padding: '4px 0', margin: 0 }}>
              <strong>{labels[entry.dataKey] || entry.name}:</strong> ${formatNumber(entry.value)} millones
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

export default function Presupuesto2025Dashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  };

  if (!data || !data.variablesMacro) {
    return <div className="text-gray-600">No hay datos disponibles</div>;
  }

  const { variablesMacro, presupuestoCaja, ejecucionTrimestral, tributacion, marcoLegal } = data;

  // Validar que existan los datos necesarios
  if (!variablesMacro || !presupuestoCaja || !ejecucionTrimestral) {
    return <div className="text-gray-600">Datos incompletos</div>;
  }

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO').format(value);
  };

  const formatMiles = (value) => {
    return (value / 1000).toFixed(0);
  };

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 backdrop-blur-xl rounded-xl p-6 border border-blue-500/30">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Presupuesto 2025</h2>
        <p className="text-gray-700">Análisis de ejecución presupuestal, variables macroeconómicas y marco tributario. Haga clic en los gráficos para ver detalles.</p>
      </div>

      {/* KPIs Principales - Mantener igual */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Crecimiento 2025</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{variablesMacro.crecimiento}%</div>
          <div className="text-sm text-gray-600 mt-1">Crecimiento anual</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Efectivo 2025</span>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">${formatNumber(presupuestoCaja.efectivo_2025)}</div>
          <div className="text-sm text-gray-600 mt-1">Millones de pesos</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Incremento vs 2024</div>
            <div className="text-lg font-semibold text-green-600">+{presupuestoCaja.incremento_porcentual}%</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-yellow-500/30 hover:border-yellow-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Mortalidad 2025</span>
            <AlertCircle className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{variablesMacro.mortalidad_2025}%</div>
          <div className="text-sm text-gray-600 mt-1">Índice de mortalidad</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Reducción vs 2024</div>
            <div className="text-lg font-semibold text-green-600">-{variablesMacro.reduccion_mortalidad}pp</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Inflación 2025</span>
            <PieChartIcon className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{variablesMacro.inflacion_2025}%</div>
          <div className="text-sm text-gray-600 mt-1">Tasa de inflación</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Similar a 2024</div>
            <div className="text-lg font-semibold text-purple-600">{variablesMacro.inflacion_2024}%</div>
          </div>
        </motion.div>
      </div>

      {/* Gráficos de Ejecución Trimestral */}
      <div className="grid grid-cols-1 gap-6">
        {/* Total PF - MEJORADO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => openModal(
            'Total PF - Detalle Completo',
            <div className="text-gray-700">
              <p className="mb-4 font-semibold">Ejecución presupuestal trimestral de Total Pollo Fiesta (valores en millones de pesos)</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-600">
                      <th className="text-left py-2 px-3 text-gray-900 font-bold">Trimestre</th>
                      <th className="text-right py-2 px-3 text-gray-900 font-bold">2025 Real</th>
                      <th className="text-right py-2 px-3 text-gray-900 font-bold">2025 Ppto</th>
                      <th className="text-right py-2 px-3 text-gray-900 font-bold">2024 Real</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ejecucionTrimestral.totalPF.data.map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-2 px-3 text-gray-900 font-semibold">{row.trimestre}</td>
                        <td className="py-2 px-3 text-right text-green-600 font-bold">${formatNumber(row.real_2025)}</td>
                        <td className="py-2 px-3 text-right text-blue-600">${formatNumber(row.ppto_2025)}</td>
                        <td className="py-2 px-3 text-right text-gray-600">${formatNumber(row.real_2024)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Total Pollo Fiesta - Ejecución Trimestral</h3>
            <Info className="w-5 h-5 text-blue-600 animate-pulse" />
          </div>
          <div>
            <ResponsiveContainer width="100%" height={450}>
              <LineChart data={ejecucionTrimestral.totalPF.data} margin={{ left: 30, right: 30, bottom: 10, top: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis 
                  dataKey="trimestre" 
                  stroke="#1f2937"
                  style={{ fontSize: '14px', fontWeight: '700' }}
                />
                <YAxis 
                  stroke="#1f2937" 
                  tickFormatter={(value) => `$${formatMiles(value)}M`}
                  style={{ fontSize: '14px', fontWeight: '700' }}
                  domain={[6000000, 8000000]}
                  ticks={[6000000, 6500000, 7000000, 7500000, 8000000]}
                />
                <Tooltip content={<CustomTooltip formatNumber={formatNumber} />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '24px', fontSize: '14px', fontWeight: '600' }}
                  iconType="line"
                />
                <Line 
                  type="monotone" 
                  dataKey="real_2025" 
                  name="Real 2025" 
                  stroke="#059669" 
                  strokeWidth={5} 
                  dot={{ r: 8, fill: '#059669', strokeWidth: 3, stroke: '#fff' }}
                  activeDot={{ r: 10 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="ppto_2025" 
                  name="Ppto 2025" 
                  stroke="#2563eb" 
                  strokeWidth={4} 
                  strokeDasharray="10 5"
                  dot={{ r: 7, fill: '#2563eb', strokeWidth: 3, stroke: '#fff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="real_2024" 
                  name="Real 2024" 
                  stroke="#374151" 
                  strokeWidth={4}
                  dot={{ r: 7, fill: '#374151', strokeWidth: 3, stroke: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Integrado Mayorista - MEJORADO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => openModal(
            'Integrado Mayorista - Detalle',
            <div className="text-gray-700">
              <p className="mb-4 font-semibold">Ejecución presupuestal trimestral de Integrado Mayorista (valores en millones de pesos)</p>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Integrado Mayorista - Ejecución Trimestral</h3>
            <Info className="w-5 h-5 text-blue-600 animate-pulse" />
          </div>
          <div>
            <ResponsiveContainer width="100%" height={450}>
              <BarChart data={ejecucionTrimestral.integradoMayorista.data} margin={{ left: 30, right: 30, bottom: 10, top: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis 
                  dataKey="trimestre" 
                  stroke="#1f2937"
                  style={{ fontSize: '14px', fontWeight: '700' }}
                />
                <YAxis 
                  stroke="#1f2937" 
                  tickFormatter={(value) => `$${formatMiles(value)}M`}
                  style={{ fontSize: '14px', fontWeight: '700' }}
                  domain={[700000, 1100000]}
                  ticks={[700000, 750000, 800000, 850000, 900000, 950000, 1000000, 1050000, 1100000]}
                />
                <Tooltip content={<CustomTooltip formatNumber={formatNumber} />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '24px', fontSize: '14px', fontWeight: '600' }}
                  iconType="rect"
                />
                <Bar dataKey="real_2025" name="Real 2025" fill="#059669" radius={[8, 8, 0, 0]} />
                <Bar dataKey="ppto_2025" name="Ppto 2025" fill="#2563eb" radius={[8, 8, 0, 0]} />
                <Bar dataKey="real_2024" name="Real 2024" fill="#374151" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pollo Canal - MEJORADO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={() => openModal(
            'Pollo Canal - Detalle Completo',
            <div className="text-gray-700">
              <p className="mb-4 font-semibold">Ejecución presupuestal trimestral de Pollo Canal (valores en millones de pesos)</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-600">
                      <th className="text-left py-2 px-3 text-gray-900 font-bold">Trimestre</th>
                      <th className="text-right py-2 px-3 text-gray-900 font-bold">2025 Real</th>
                      <th className="text-right py-2 px-3 text-gray-900 font-bold">2025 Ppto</th>
                      <th className="text-right py-2 px-3 text-gray-900 font-bold">2024 Real</th>
                      <th className="text-right py-2 px-3 text-gray-900 font-bold">2023 Real</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ejecucionTrimestral.polloCanal.data.map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-2 px-3 text-gray-900 font-semibold">{row.trimestre}</td>
                        <td className="py-2 px-3 text-right text-green-600 font-bold">${formatNumber(row.real_2025)}</td>
                        <td className="py-2 px-3 text-right text-blue-600">${formatNumber(row.ppto_2025)}</td>
                        <td className="py-2 px-3 text-right text-gray-600">${formatNumber(row.real_2024)}</td>
                        <td className="py-2 px-3 text-right text-gray-500">${formatNumber(row.real_2023)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Pollo Canal - Ejecución Trimestral</h3>
            <Info className="w-5 h-5 text-blue-600 animate-pulse" />
          </div>
          <div>
            <ResponsiveContainer width="100%" height={450}>
              <LineChart data={ejecucionTrimestral.polloCanal.data} margin={{ left: 30, right: 30, bottom: 10, top: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis 
                  dataKey="trimestre" 
                  stroke="#1f2937"
                  style={{ fontSize: '14px', fontWeight: '700' }}
                />
                <YAxis 
                  stroke="#1f2937" 
                  tickFormatter={(value) => `$${formatMiles(value)}M`}
                  style={{ fontSize: '14px', fontWeight: '700' }}
                  domain={[5500000, 7000000]}
                  ticks={[5500000, 5750000, 6000000, 6250000, 6500000, 6750000, 7000000]}
                />
                <Tooltip content={<CustomTooltip formatNumber={formatNumber} />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '24px', fontSize: '14px', fontWeight: '600' }}
                  iconType="line"
                />
                <Line 
                  type="monotone" 
                  dataKey="real_2025" 
                  name="Real 2025" 
                  stroke="#059669" 
                  strokeWidth={5} 
                  dot={{ r: 8, fill: '#059669', strokeWidth: 3, stroke: '#fff' }}
                  activeDot={{ r: 10 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="ppto_2025" 
                  name="Ppto 2025" 
                  stroke="#2563eb" 
                  strokeWidth={4} 
                  strokeDasharray="10 5"
                  dot={{ r: 7, fill: '#2563eb', strokeWidth: 3, stroke: '#fff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="real_2024" 
                  name="Real 2024" 
                  stroke="#374151" 
                  strokeWidth={4}
                  dot={{ r: 7, fill: '#374151', strokeWidth: 3, stroke: '#fff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="real_2023" 
                  name="Real 2023" 
                  stroke="#6b7280" 
                  strokeWidth={4}
                  dot={{ r: 7, fill: '#6b7280', strokeWidth: 3, stroke: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Marco Tributario */}
      {tributacion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Scale className="w-6 h-6 text-orange-600" />
            Marco Tributario 2025
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              className="bg-white/95 rounded-xl p-4 border-2 border-orange-500/30 cursor-pointer hover:border-orange-500 transition-all"
              onClick={() => openModal(
                'Tasa Mínima de Tributación',
                <div className="text-gray-700">
                  <p className="mb-4">El artículo 240, parágrafo 6 establece una <strong className="text-orange-600">tasa mínima de tributación del {tributacion.tasa_minima}%</strong> para los contribuyentes del impuesto sobre la renta.</p>
                  <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-300 mb-4">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Tasa de Tributación Depurada (TTD):</p>
                    <p className="text-sm">TTD = Impuesto Depurado (ID) / Utilidad Depurada (UD)</p>
                    <p className="text-sm mt-2">La TTD no podrá ser inferior al 15%</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Resultado Pollo Fiesta:</p>
                    <p className="text-sm">Para el año gravable 2025, Pollo Fiesta incrementó su tasa de tributación en <strong className="text-green-600">{tributacion.incremento_tributacion_2025}%</strong> con relación al impuesto neto de renta del año 2024.</p>
                  </div>
                </div>
              )}
            >
              <Scale className="w-8 h-8 text-orange-600 mb-3" />
              <div className="text-orange-600 font-semibold mb-2">Tasa Mínima</div>
              <div className="text-gray-900 text-2xl font-bold">{tributacion.tasa_minima}%</div>
              <div className="text-xs text-gray-600 mt-2">Incremento 2025: +{tributacion.incremento_tributacion_2025}%</div>
            </div>

            <div 
              className="bg-white/95 rounded-xl p-4 border-2 border-red-500/30 cursor-pointer hover:border-red-500 transition-all"
              onClick={() => openModal(
                'Impuestos Saludables',
                <div className="text-gray-700">
                  <p className="mb-4">Continúa vigente el impuesto sobre alimentos ultra procesados o azucarados:</p>
                  <div className="space-y-2 mb-4">
                    {tributacion.impuestos_saludables && tributacion.impuestos_saludables.map((imp, idx) => (
                      <div key={idx} className="bg-gray-100 rounded-lg p-3 flex items-center justify-between">
                        <span className="font-semibold text-gray-900">{imp.anio}</span>
                        <span className={`text-xl font-bold ${imp.anio === 2025 ? 'text-red-600' : 'text-gray-600'}`}>{imp.tasa}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300">
                    <p className="text-sm">El impuesto aplica sobre bebidas ultra procesadas azucaradas y alimentos ultra procesados o azucarados.</p>
                  </div>
                </div>
              )}
            >
              <AlertCircle className="w-8 h-8 text-red-600 mb-3" />
              <div className="text-red-600 font-semibold mb-2">Impuestos Saludables</div>
              <div className="text-gray-900 text-2xl font-bold">20%</div>
              <div className="text-xs text-gray-600 mt-2">Tasa 2025 y siguientes</div>
            </div>

            <div 
              className="bg-white/95 rounded-xl p-4 border-2 border-green-500/30 cursor-pointer hover:border-green-500 transition-all"
              onClick={() => openModal(
                'Cumplimiento Tributario',
                <div className="text-gray-700">
                  <p className="mb-4">En materia tributaria por el año gravable 2025, Pollo Fiesta S.A. elaboró y presentó oportunamente todas las declaraciones de impuestos.</p>
                  <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300 mb-4">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Recuperación de cartera fiscal:</p>
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
              <FileText className="w-8 h-8 text-green-600 mb-3" />
              <div className="text-green-600 font-semibold mb-2">Cumplimiento</div>
              <div className="text-gray-900 text-lg font-bold">100%</div>
              <div className="text-xs text-gray-600 mt-2">Declaraciones presentadas</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Marco Legal y Tecnológico */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Situación Jurídica y Tecnológica</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            className="bg-white/95 rounded-xl p-4 border-2 border-blue-500/30 cursor-pointer hover:border-blue-500 transition-all"
          >
            <FileText className="w-8 h-8 text-blue-600 mb-3" />
            <div className="text-blue-600 font-semibold mb-2">Marco Legal</div>
            <div className="text-gray-900 text-sm mb-2">Ley 603/2000 - Ley 1581/2012</div>
            <div className="text-xs text-gray-600">Protección de datos y PED</div>
          </div>

          <div 
            className="bg-white/95 rounded-xl p-4 border-2 border-purple-500/30 cursor-pointer hover:border-purple-500 transition-all"
          >
            <PieChartIcon className="w-8 h-8 text-purple-600 mb-3" />
            <div className="text-purple-600 font-semibold mb-2">ERP Enterprise</div>
            <div className="text-gray-900 text-sm mb-2">SIESA DIGITAL S.A.S.</div>
            <div className="text-xs text-gray-600">Minería de datos y BI</div>
          </div>

          <div 
            className="bg-white/95 rounded-xl p-4 border-2 border-yellow-500/30 cursor-pointer hover:border-yellow-500 transition-all"
          >
            <AlertCircle className="w-8 h-8 text-yellow-600 mb-3" />
            <div className="text-yellow-600 font-semibold mb-2">Río Fucha</div>
            <div className="text-gray-900 text-sm mb-2">Recurso de excepción</div>
            <div className="text-xs text-gray-600">Pérdida de ejecutoriedad</div>
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
              className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border-4 border-blue-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">{modalContent.title}</h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-gray-600 hover:text-gray-900 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-gray-700 leading-relaxed">
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

      {/* Marco Tributario */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Scale className="w-6 h-6 text-orange-600" />
          Marco Tributario 2025
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            className="bg-white/95 rounded-xl p-4 border-2 border-orange-500/30 cursor-pointer hover:border-orange-500 transition-all"
            onClick={() => openModal(
              'Tasa Mínima de Tributación',
              <div className="text-gray-700">
                <p className="mb-4">El artículo 240, parágrafo 6 establece una <strong className="text-orange-600">tasa mínima de tributación del {tributacion.tasa_minima}%</strong> para los contribuyentes del impuesto sobre la renta.</p>
                <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-300 mb-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Tasa de Tributación Depurada (TTD):</p>
                  <p className="text-sm">TTD = Impuesto Depurado (ID) / Utilidad Depurada (UD)</p>
                  <p className="text-sm mt-2">La TTD no podrá ser inferior al 15%</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Resultado Pollo Fiesta:</p>
                  <p className="text-sm">Para el año gravable 2025, Pollo Fiesta incrementó su tasa de tributación en <strong className="text-green-600">{tributacion.incremento_tributacion_2025}%</strong> con relación al impuesto neto de renta del año 2024.</p>
                </div>
              </div>
            )}
          >
            <Scale className="w-8 h-8 text-orange-600 mb-3" />
            <div className="text-orange-600 font-semibold mb-2">Tasa Mínima</div>
            <div className="text-gray-900 text-2xl font-bold">{tributacion.tasa_minima}%</div>
            <div className="text-xs text-gray-600 mt-2">Incremento 2025: +{tributacion.incremento_tributacion_2025}%</div>
          </div>

          <div 
            className="bg-white/95 rounded-xl p-4 border-2 border-red-500/30 cursor-pointer hover:border-red-500 transition-all"
            onClick={() => openModal(
              'Impuestos Saludables',
              <div className="text-gray-700">
                <p className="mb-4">Continúa vigente el impuesto sobre alimentos ultra procesados o azucarados:</p>
                <div className="space-y-2 mb-4">
                  {tributacion.impuestos_saludables.map((imp, idx) => (
                    <div key={idx} className="bg-gray-100 rounded-lg p-3 flex items-center justify-between">
                      <span className="font-semibold text-gray-900">{imp.anio}</span>
                      <span className={`text-xl font-bold ${imp.anio === 2025 ? 'text-red-600' : 'text-gray-600'}`}>{imp.tasa}%</span>
                    </div>
                  ))}
                </div>
                <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300">
                  <p className="text-sm">El impuesto aplica sobre bebidas ultra procesadas azucaradas y alimentos ultra procesados o azucarados.</p>
                </div>
              </div>
            )}
          >
            <AlertCircle className="w-8 h-8 text-red-600 mb-3" />
            <div className="text-red-600 font-semibold mb-2">Impuestos Saludables</div>
            <div className="text-gray-900 text-2xl font-bold">20%</div>
            <div className="text-xs text-gray-600 mt-2">Tasa 2025 y siguientes</div>
          </div>

          <div 
            className="bg-white/95 rounded-xl p-4 border-2 border-green-500/30 cursor-pointer hover:border-green-500 transition-all"
            onClick={() => openModal(
              'Cumplimiento Tributario',
              <div className="text-gray-700">
                <p className="mb-4">En materia tributaria por el año gravable 2025, Pollo Fiesta S.A. elaboró y presentó oportunamente todas las declaraciones de impuestos.</p>
                <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300 mb-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Recuperación de cartera fiscal:</p>
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
            <FileText className="w-8 h-8 text-green-600 mb-3" />
            <div className="text-green-600 font-semibold mb-2">Cumplimiento</div>
            <div className="text-gray-900 text-lg font-bold">100%</div>
            <div className="text-xs text-gray-600 mt-2">Declaraciones presentadas</div>
          </div>
        </div>
      </motion.div>

      {/* Marco Legal y Tecnológico */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Situación Jurídica y Tecnológica</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            className="bg-white/95 rounded-xl p-4 border-2 border-blue-500/30 cursor-pointer hover:border-blue-500 transition-all"
          >
            <FileText className="w-8 h-8 text-blue-600 mb-3" />
            <div className="text-blue-600 font-semibold mb-2">Marco Legal</div>
            <div className="text-gray-900 text-sm mb-2">Ley 603/2000 - Ley 1581/2012</div>
            <div className="text-xs text-gray-600">Protección de datos y PED</div>
          </div>

          <div 
            className="bg-white/95 rounded-xl p-4 border-2 border-purple-500/30 cursor-pointer hover:border-purple-500 transition-all"
          >
            <PieChartIcon className="w-8 h-8 text-purple-600 mb-3" />
            <div className="text-purple-600 font-semibold mb-2">ERP Enterprise</div>
            <div className="text-gray-900 text-sm mb-2">SIESA DIGITAL S.A.S.</div>
            <div className="text-xs text-gray-600">Minería de datos y BI</div>
          </div>

          <div 
            className="bg-white/95 rounded-xl p-4 border-2 border-yellow-500/30 cursor-pointer hover:border-yellow-500 transition-all"
          >
            <AlertCircle className="w-8 h-8 text-yellow-600 mb-3" />
            <div className="text-yellow-600 font-semibold mb-2">Río Fucha</div>
            <div className="text-gray-900 text-sm mb-2">Recurso de excepción</div>
            <div className="text-xs text-gray-600">Pérdida de ejecutoriedad</div>
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
              className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border-4 border-blue-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">{modalContent.title}</h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-gray-600 hover:text-gray-900 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-gray-700 leading-relaxed">
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
