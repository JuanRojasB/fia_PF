import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart, LabelList } from 'recharts';
import { TrendingUp, DollarSign, AlertCircle, X, Info, PieChart as PieChartIcon, FileText, Scale } from 'lucide-react';
import CollapsibleChart from '../CollapsibleChart';

const CustomTooltip = ({ active, payload, label, formatNumber }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#ffffff', border: '2px solid #3b82f6', borderRadius: '8px', padding: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <p style={{ color: '#111827', fontWeight: 'bold', marginBottom: '8px' }}>{label}</p>
        {payload.map((entry, index) => {
          const labels = { 'real_2025': 'Ejecución Real 2025', 'ppto_2025': 'Presupuesto 2025', 'real_2024': 'Ejecución Real 2024', 'real_2023': 'Ejecución Real 2023' };
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

  const { variablesMacro, presupuestoCaja, ejecucionTrimestral, tributacion } = data;

  if (!variablesMacro || !presupuestoCaja || !ejecucionTrimestral) {
    return <div className="text-gray-600">Datos incompletos</div>;
  }

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO').format(value);
  };

  // Convierte millones a pesos completos formateados
  const formatMillones = (millones) => {
    if (!millones || isNaN(millones)) return '$0';
    return '$' + new Intl.NumberFormat('es-CO').format(millones * 1_000_000);
  };

  const formatMiles = (value) => (value / 1000).toFixed(0);

  // Regresión lineal para tendencia
  const calcTendencia = (datos, key) => {
    const n = datos.length;
    if (n < 3) return datos.map(d => ({ ...d }));
    const sumX = datos.reduce((s, _, i) => s + i, 0);
    const sumY = datos.reduce((s, d) => s + (parseFloat(d[key]) || 0), 0);
    const sumXY = datos.reduce((s, d, i) => s + i * (parseFloat(d[key]) || 0), 0);
    const sumX2 = datos.reduce((s, _, i) => s + i * i, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return datos.map((d, i) => ({ ...d, tendencia: parseFloat((intercept + slope * i).toFixed(0)) }));
  };

  const totalPFConTend = calcTendencia(ejecucionTrimestral.totalPF.data, 'real_2025');
  const polloCanalConTend = calcTendencia(ejecucionTrimestral.polloCanal.data, 'real_2025');
  const integradoMayoristaConTend = calcTendencia(ejecucionTrimestral.integradoMayorista.data, 'real_2025');

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 backdrop-blur-xl rounded-xl p-6 border border-blue-500/30">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Presupuesto 2025</h2>
        <p className="text-gray-700">Análisis de ejecución presupuestal, variables macroeconómicas y marco tributario. Haga clic en los gráficos para ver detalles.</p>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
          onClick={() => openModal('Crecimiento Unidades',
            <div className="text-gray-700 space-y-4">
              <p className="mb-3">El crecimiento de <strong className="text-green-600">{variablesMacro.crecimiento}%</strong> en unidades presupuestadas para 2025 marca una recuperación importante.</p>
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Contexto Macroeconómico:</p>
                <p className="text-sm">La inflación estuvo muy similar año 2024 (<strong>5.2%</strong>), respecto al 2025 (<strong>5.1%</strong>) lo que ayudó con el crecimiento del <strong className="text-green-600">5.4%</strong>.</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                <p className="text-sm font-semibold text-green-800 mb-2">Factor Clave - Reducción de Mortalidad:</p>
                <p className="text-sm">Es de resaltar que se redujo el índice de mortalidad que en el 2024 fue de <strong>10.05%</strong> en comparación al 2025 que fue de <strong className="text-green-600">9.03%</strong>.</p>
                <p className="text-xs text-gray-600 mt-2">Esta reducción de 1.02 puntos porcentuales impacta positivamente la productividad y rentabilidad.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300">
                <p className="text-sm font-semibold text-purple-800 mb-2">Impacto en el Negocio:</p>
                <p className="text-sm">El crecimiento del 5.4% en ventas, combinado con la reducción de mortalidad y la estabilidad inflacionaria, crea condiciones favorables para mejorar los márgenes operativos.</p>
              </div>
            </div>
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Crecimiento en Unidades</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{variablesMacro.crecimiento}%</div>
          <div className="text-sm text-gray-600 mt-1">Crecimiento anual</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
          onClick={() => openModal('Presupuesto de Caja',
            <div className="text-gray-700">
              <p className="mb-3">El presupuesto de caja determinó un aumento en el Efectivo y sus equivalentes en cuantía de <strong className="text-blue-600">{formatMillones(presupuestoCaja.incremento_absoluto)}</strong> que corresponde a un mayor valor del <strong className="text-blue-600">{presupuestoCaja.incremento_porcentual}%</strong> en este flujo.</p>
              <p>Pasó de <strong>{formatMillones(presupuestoCaja.efectivo_2024)}</strong> en el año 2024 a establecerse en <strong className="text-green-600">{formatMillones(presupuestoCaja.efectivo_2025)}</strong> para el ejercicio económico de 2025.</p>
              <p className="mt-3 text-sm text-gray-500">Situación que refleja los resultados positivos durante el año.</p>
            </div>
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Flujo de Efectivo Presupuestado 2025</span>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatMillones(presupuestoCaja.efectivo_2025)}</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{formatMillones(presupuestoCaja.efectivo_2024)}</span></div>
            <div className="text-xs text-gray-500 mt-0.5">2025: <span className="font-semibold text-gray-700">{formatMillones(presupuestoCaja.efectivo_2025)}</span></div>
            <div className="text-sm font-bold text-green-600 mt-1">Var: +{presupuestoCaja.incremento_porcentual}%</div>
            <div className="text-xs font-semibold text-green-600">Dif: +{formatMillones(presupuestoCaja.incremento_absoluto)}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-yellow-500/30 hover:border-yellow-500 transition-all cursor-pointer"
          onClick={() => openModal('Índice de Mortalidad Presupuestado 2025',
            <div className="text-gray-700 space-y-4">
              <p className="mb-3">Se redujo el índice de mortalidad que en el 2024 fue de <strong>10.05%</strong> en comparación al 2025 que fue de <strong className="text-green-600">9.03%</strong>.</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                  <p className="text-xs text-red-600 font-semibold mb-1">2024</p>
                  <p className="text-2xl font-bold text-red-700">10.05%</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <p className="text-xs text-green-600 font-semibold mb-1">2025</p>
                  <p className="text-2xl font-bold text-green-700">{variablesMacro.mortalidad_2025}%</p>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                <p className="text-sm font-semibold text-green-800 mb-2">Reducción Lograda:</p>
                <p className="text-sm">Reducción de <strong className="text-green-600">{variablesMacro.reduccion_mortalidad} puntos porcentuales</strong>, lo que refleja mejoras en los procesos productivos, manejo sanitario y condiciones de crianza.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Impacto Operativo:</p>
                <p className="text-sm">La reducción de mortalidad significa mayor cantidad de aves disponibles para procesamiento, lo que impacta directamente en la productividad y rentabilidad del negocio.</p>
              </div>
            </div>
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Mortalidad Presupuestada 2025 vs Meta</span>
            <AlertCircle className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{variablesMacro.mortalidad_2025}%</div>
          <div className="text-sm text-gray-600 mt-1">Índice de mortalidad</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">10.05%</span></div>
            <div className="text-xs text-gray-500 mt-0.5">2025: <span className="font-semibold text-gray-700">{variablesMacro.mortalidad_2025}%</span></div>
            <div className="text-sm font-bold text-green-600 mt-1">Var: -{variablesMacro.reduccion_mortalidad}pp</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
          onClick={() => openModal('Inflación Proyectada 2025 vs 2024',
            <div className="text-gray-700 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 font-semibold mb-1">2024</p>
                  <p className="text-2xl font-bold text-gray-900">{variablesMacro.inflacion_2024}%</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <p className="text-xs text-purple-600 font-semibold mb-1">2025</p>
                  <p className="text-2xl font-bold text-purple-700">{variablesMacro.inflacion_2025}%</p>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300">
                <p className="text-sm text-gray-700">La inflación estuvo muy similar año 2024 (<strong>5.2%</strong>), respecto al 2025 (<strong>5.1%</strong>) lo que ayudó con el crecimiento del <strong className="text-green-600">5.4%</strong>.</p>
              </div>
            </div>
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Inflación Proyectada 2025 vs 2024</span>
            <PieChartIcon className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{variablesMacro.inflacion_2025}%</div>
          <div className="text-sm text-gray-600 mt-1">Tasa de inflación</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{variablesMacro.inflacion_2024}%</span></div>
            <div className="text-xs text-gray-500 mt-0.5">2025: <span className="font-semibold text-gray-700">{variablesMacro.inflacion_2025}%</span></div>
            <div className="text-sm font-bold text-green-600 mt-1">Var: -0.1pp</div>
          </div>
        </motion.div>
      </div>

      {/* Gráficos de Ejecución Trimestral */}
      <div className="grid grid-cols-1 gap-6">
        <CollapsibleChart title="Total Pollo Fiesta - Ejecución Trimestral" defaultOpen={false}>
          <ResponsiveContainer width="100%" height={450}>
            <ComposedChart data={totalPFConTend} margin={{ left: 30, right: 30, bottom: 10, top: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="trimestre" stroke="#1f2937" style={{ fontSize: '14px', fontWeight: '700' }} />
              <YAxis stroke="#1f2937" tickFormatter={(v) => `${formatMiles(v)}M`} style={{ fontSize: '14px', fontWeight: '700' }} domain={[6000000, 8000000]} ticks={[6000000, 6500000, 7000000, 7500000, 8000000]} width={75} />
              <Tooltip content={<CustomTooltip formatNumber={formatNumber} />} />
              <Legend wrapperStyle={{ paddingTop: '24px', fontSize: '14px', fontWeight: '600' }} iconType="line" />
              <Line type="monotone" dataKey="real_2025" name="Real 2025" stroke="#059669" strokeWidth={5} dot={{ r: 8, fill: '#059669', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 10 }} />
              <Line type="monotone" dataKey="ppto_2025" name="Ppto 2025" stroke="#2563eb" strokeWidth={4} strokeDasharray="10 5" dot={{ r: 7, fill: '#2563eb', strokeWidth: 3, stroke: '#fff' }} />
              <Line type="monotone" dataKey="real_2024" name="Real 2024" stroke="#374151" strokeWidth={4} dot={{ r: 7, fill: '#374151', strokeWidth: 3, stroke: '#fff' }} />
              <Line type="linear" dataKey="tendencia" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Tendencia 2025" />
            </ComposedChart>
          </ResponsiveContainer>
        </CollapsibleChart>

        <CollapsibleChart title="Integrado Mayorista - Ejecución Trimestral" defaultOpen={false}>
          <ResponsiveContainer width="100%" height={450}>
            <ComposedChart data={integradoMayoristaConTend} margin={{ left: 30, right: 30, bottom: 10, top: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="trimestre" stroke="#1f2937" style={{ fontSize: '14px', fontWeight: '700' }} />
              <YAxis stroke="#1f2937" tickFormatter={(v) => `${formatMiles(v)}M`} style={{ fontSize: '14px', fontWeight: '700' }} domain={[700000, 1100000]} ticks={[700000, 800000, 900000, 1000000, 1100000]} width={75} />
              <Tooltip content={<CustomTooltip formatNumber={formatNumber} />} />
              <Legend wrapperStyle={{ paddingTop: '24px', fontSize: '14px', fontWeight: '600' }} iconType="rect" />
              <Bar dataKey="real_2025" name="Real 2025" fill="#059669" radius={[8, 8, 0, 0]}>
                <LabelList dataKey="real_2025" position="top" style={{ fontSize: '10px', fontWeight: 'bold', fill: '#059669' }} formatter={() => '2025'} />
              </Bar>
              <Bar dataKey="ppto_2025" name="Ppto 2025" fill="#2563eb" radius={[8, 8, 0, 0]}>
                <LabelList dataKey="ppto_2025" position="top" style={{ fontSize: '10px', fontWeight: 'bold', fill: '#2563eb' }} formatter={() => 'Ppto'} />
              </Bar>
              <Bar dataKey="real_2024" name="Real 2024" fill="#374151" radius={[8, 8, 0, 0]}>
                <LabelList dataKey="real_2024" position="top" style={{ fontSize: '10px', fontWeight: 'bold', fill: '#374151' }} formatter={() => '2024'} />
              </Bar>
              <Line type="linear" dataKey="tendencia" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Tendencia 2025" />
            </ComposedChart>
          </ResponsiveContainer>
        </CollapsibleChart>

        <CollapsibleChart title="Pollo Canal - Ejecución Trimestral" defaultOpen={false}>
          <ResponsiveContainer width="100%" height={450}>
            <ComposedChart data={polloCanalConTend} margin={{ left: 30, right: 30, bottom: 10, top: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="trimestre" stroke="#1f2937" style={{ fontSize: '14px', fontWeight: '700' }} />
              <YAxis stroke="#1f2937" tickFormatter={(v) => `${formatMiles(v)}M`} style={{ fontSize: '14px', fontWeight: '700' }} domain={[5500000, 7000000]} ticks={[5500000, 6000000, 6500000, 7000000]} width={75} />
              <Tooltip content={<CustomTooltip formatNumber={formatNumber} />} />
              <Legend wrapperStyle={{ paddingTop: '24px', fontSize: '14px', fontWeight: '600' }} iconType="line" />
              <Line type="monotone" dataKey="real_2025" name="Real 2025" stroke="#059669" strokeWidth={5} dot={{ r: 8, fill: '#059669', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 10 }} />
              <Line type="monotone" dataKey="ppto_2025" name="Ppto 2025" stroke="#2563eb" strokeWidth={4} strokeDasharray="10 5" dot={{ r: 7, fill: '#2563eb', strokeWidth: 3, stroke: '#fff' }} />
              <Line type="monotone" dataKey="real_2024" name="Real 2024" stroke="#374151" strokeWidth={4} dot={{ r: 7, fill: '#374151', strokeWidth: 3, stroke: '#fff' }} />
              <Line type="monotone" dataKey="real_2023" name="Real 2023" stroke="#6b7280" strokeWidth={4} dot={{ r: 7, fill: '#6b7280', strokeWidth: 3, stroke: '#fff' }} />
              <Line type="linear" dataKey="tendencia" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Tendencia 2025" />
            </ComposedChart>
          </ResponsiveContainer>
        </CollapsibleChart>
      </div>

      {/* Modal */}
      {createPortal(
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-4xl w-full border-4 border-blue-500 shadow-2xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">{modalContent.title}</h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-gray-600 hover:text-gray-900 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-gray-700 leading-relaxed overflow-y-auto flex-1 pr-2">
                {modalContent.content}
              </div>
              <div className="mt-6 flex justify-end flex-shrink-0">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  Entendido
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </div>
  );
}
