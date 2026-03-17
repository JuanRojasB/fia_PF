import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, X, Info, CreditCard, Percent } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';
import CollapsibleChart from '../CollapsibleChart';
import KpiCard from '../KpiCard';
import { formatCurrencyFull } from './CustomTooltip';
import { formatCOPShort } from '../../utils/formatCurrency';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#ffffff', border: '2px solid #10b981', borderRadius: '8px', padding: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
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

  const { resumenAnual, datosMensuales, datosMensuales2024, exposicionCartera } = data;

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO').format(value);
  };

  const formatCurrency = formatCOPShort;

  const calcTendencia = (datos, key) => {
    const n = datos.length;
    if (n < 3) return datos.map(d => ({ ...d }));
    const sumX = datos.reduce((s, _, i) => s + i, 0);
    const sumY = datos.reduce((s, d) => s + (parseFloat(d[key]) || 0), 0);
    const sumXY = datos.reduce((s, d, i) => s + i * (parseFloat(d[key]) || 0), 0);
    const sumX2 = datos.reduce((s, _, i) => s + i * i, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return datos.map((d, i) => ({ ...d, tendencia: parseFloat((intercept + slope * i).toFixed(2)) }));
  };

  const exposicionConTend = calcTendencia(exposicionCartera, 't2025');
  const rotacionConTend = calcTendencia(datosMensuales, 'dias_rotacion');
  const morosidadConTend = calcTendencia(datosMensuales, 'indice_morosidad');
  const contadoConTend = calcTendencia(datosMensuales, 'pct_contado');

  // Modal content variables (evita JSX-en-argumento que rompe Babel)
  const modalRotacion = (
    <div className="text-gray-700">
      <p className="mb-4 font-semibold">¿Qué es la rotación de cartera?</p>
      <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300 mb-4">
        <p className="text-sm">Es el tiempo promedio (en días) que tardan los clientes en pagar sus facturas después de recibir el producto.</p>
      </div>
      <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300 mb-4">
        <p className="text-sm font-semibold text-gray-900 mb-2">Resultado 2025:</p>
        <p className="text-sm">• Rotación actual: <strong className="text-green-600">{resumenAnual.rotacion_dic_2025} días</strong></p>
        <p className="text-sm">• Meta ISO: <strong>15 días</strong></p>
        <p className="text-sm">• Rotación Dic 2024: <strong>14,99 días</strong></p>
        <p className="text-sm mt-2"><strong className="text-green-600">Meta cumplida.</strong> La rotación se mantiene dentro del objetivo ISO.</p>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-300">
        <p className="text-sm font-semibold text-gray-900 mb-2">¿Por qué es importante?</p>
        <p className="text-sm">Menos días significa más rápido recuperamos el dinero, lo que resulta en mejor flujo de caja para la empresa.</p>
      </div>
    </div>
  );

  const modalContado = (
    <div className="text-gray-700">
      <p className="mb-4 font-semibold">¿Cómo se distribuyen las ventas?</p>
      <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300 mb-4">
        <p className="text-sm mb-3"><strong>Ventas de Contado (37,91%):</strong></p>
        <p className="text-sm">Los clientes pagan inmediatamente al recibir el producto. El dinero entra de inmediato a la empresa.</p>
      </div>
      <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300 mb-4">
        <p className="text-sm mb-3"><strong>Ventas de Crédito (62,09%):</strong></p>
        <p className="text-sm">Los clientes pagan después (a 15, 30 o más días). El dinero entra más tarde.</p>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-300">
        <p className="text-sm font-semibold text-gray-900 mb-2">Interpretación:</p>
        <p className="text-sm">La mayoría de las ventas (62,09%) son a crédito, por eso es importante cobrar rápido para mantener el flujo de caja.</p>
      </div>
    </div>
  );

  const modalMorosidad = (
    <div className="text-gray-700">
      <p className="mb-4 font-semibold">¿Qué es la morosidad?</p>
      <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-300 mb-4">
        <p className="text-sm">Es el porcentaje de dinero que los clientes deben y no han pagado a tiempo. Son facturas vencidas que aún no se han cobrado.</p>
      </div>
      <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-300 mb-4">
        <p className="text-sm font-semibold text-gray-900 mb-2">Situación actual:</p>
        <p className="text-sm">• Morosidad promedio: <strong className="text-orange-600">46,63%</strong></p>
        <p className="text-sm mt-2">Esto significa que de todo el dinero que deben los clientes, casi la mitad está vencido por recaudar.</p>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-300">
        <p className="text-sm font-semibold text-gray-900 mb-2">Acciones recomendadas:</p>
        <p className="text-sm">• Contactar a los clientes morosos</p>
        <p className="text-sm">• Establecer planes de pago</p>
        <p className="text-sm">• Mejorar el seguimiento de cobro</p>
      </div>
    </div>
  );

  const modalCartera = (
    <div className="text-gray-700">
      <p className="mb-4 font-semibold">¿Qué es la cartera total?</p>
      <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300 mb-4">
        <p className="text-sm">Es el total de dinero que los clientes deben a la empresa por ventas a crédito que aún no han pagado.</p>
      </div>
      <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300 mb-4">
        <p className="text-sm font-semibold text-gray-900 mb-2">Situación Diciembre 2025:</p>
        <p className="text-sm">• Cartera total: <strong className="text-purple-600">${formatNumber(resumenAnual.cartera_dic_2025)} millones</strong></p>
        <p className="text-sm">• Cartera Dic 2024: <strong>${formatNumber(17162)} millones</strong></p>
        <p className="text-sm mt-2">• Variación: <strong className="text-green-600">{resumenAnual.variacion_dic}%</strong></p>
        <p className="text-sm mt-2">Bajó un 2%, lo que significa que se cobró más de lo que se vendió a crédito.</p>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-300">
        <p className="text-sm font-semibold text-gray-900 mb-2">¿Por qué es importante?</p>
        <p className="text-sm">Una cartera baja significa que estamos cobrando bien. Una cartera alta significa que tenemos mucho dinero pendiente de cobro.</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-xl p-6 border-2 border-green-500/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-8 h-8 text-green-600" />
          <h2 className="text-3xl font-bold text-gray-900">GESTIÓN DE CARTERA 2025</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          El año 2025 fue un año de cambios estructurales en el área, orientados a tener un manejo más óptimo y real de los estados de cuenta de los diferentes clientes. La cartera presenta una rotación al final del periodo de 15,40 días a Dic/25, frente al periodo anterior con una rotación de 14,99 días. Las ventas de contado a dic representan el 46,85% y las ventas de crédito el 53,15%. El nivel de cierre de cartera a diciembre 2025 quedó en $16.787M frente a Dic/24 $17.162M, disminuyendo un -2%.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
          onClick={() => openModal('Rotación de Cartera', modalRotacion)}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Rotación Cartera Dic 2025 vs Meta</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 leading-tight">{resumenAnual.rotacion_dic_2025} días</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">14,99 días</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{resumenAnual.rotacion_dic_2025} días</span></div>
            <div className="text-sm font-bold text-green-600">Meta ISO ≤15 días ✓</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
          onClick={() => openModal('Ventas de Contado vs Crédito', modalContado)}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Ventas Contado 2025 vs 2024</span>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{resumenAnual.ventas_contado_promedio}%</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">Contado 2025: <span className="font-semibold text-gray-700">{resumenAnual.ventas_contado_promedio}%</span></div>
            <div className="text-xs text-gray-500">Crédito 2025: <span className="font-semibold text-gray-700">{resumenAnual.ventas_credito_promedio}%</span></div>
            <div className="text-sm font-bold text-blue-600">Promedio anual 2025</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-yellow-500/30 hover:border-yellow-500 transition-all cursor-pointer"
          onClick={() => openModal('Índice de Morosidad', modalMorosidad)}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Morosidad Promedio Cartera 2025 vs Meta</span>
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{resumenAnual.morosidad_promedio}%</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{resumenAnual.morosidad_promedio}% promedio</span></div>
            <div className="text-xs text-gray-500">Cartera vencida por recaudar</div>
            <div className="text-sm font-bold text-yellow-600">Requiere seguimiento</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
          onClick={() => openModal('Cartera Total', modalCartera)}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Saldo Cartera Dic 2025 vs Dic 2024</span>
            <CreditCard className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-xl font-bold text-gray-900 leading-tight break-all">{formatCurrencyFull((resumenAnual.cartera_dic_2025 || 0) * 1000000)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{formatCurrencyFull(17162 * 1000000)}</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{formatCurrencyFull((resumenAnual.cartera_dic_2025 || 0) * 1000000)}</span></div>
            <div className={`text-sm font-bold ${parseFloat(resumenAnual.variacion_dic) <= 0 ? 'text-green-600' : 'text-red-600'}`}>Var: {resumenAnual.variacion_dic}%</div>
            <div className={`text-xs font-semibold ${parseFloat(resumenAnual.variacion_dic) <= 0 ? 'text-green-600' : 'text-red-600'}`}>Dif: {formatCurrencyFull(((resumenAnual.cartera_dic_2025 || 0) - 17162) * 1000000)}</div>
          </div>
        </motion.div>
      </div>

      <CollapsibleChart title="Saldo Total de Cartera por Cobrar 2025 vs 2024" defaultOpen={false}>
        <p className="text-sm text-gray-600 mb-4">Comparación 2025 vs 2024 (millones de pesos)</p>
        <ResponsiveContainer width="100%" height={450}>
          <ComposedChart data={exposicionConTend} margin={{ left: 30, right: 30, bottom: 10, top: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
            <XAxis dataKey="mes" stroke="#1f2937" style={{ fontSize: '14px', fontWeight: '700' }} />
            <YAxis stroke="#1f2937" tickFormatter={(value) => `${value}M`} style={{ fontSize: '14px', fontWeight: '700' }} />
            <Tooltip content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const val2025 = payload.find(p => p.dataKey === 't2025')?.value || 0;
                const val2024 = payload.find(p => p.dataKey === 't2024')?.value || 0;
                const diferencia = val2025 - val2024;
                const variacion = val2024 > 0 ? ((diferencia / val2024) * 100).toFixed(1) : 0;
                return (
                  <div className="bg-white border-2 border-green-500 rounded-xl p-4 shadow-xl">
                    <p className="font-bold text-gray-900 mb-3">{label}</p>
                    <div className="space-y-1">
                      <p className="text-green-600 font-bold">2025: ${formatNumber(val2025)}M</p>
                      <p className="text-xs text-green-600">(${formatNumber(val2025 * 1000000)} pesos)</p>
                      <p className="text-gray-700 font-bold">2024: ${formatNumber(val2024)}M</p>
                      <p className="text-xs text-gray-600">(${formatNumber(val2024 * 1000000)} pesos)</p>
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <p className={`font-semibold ${diferencia >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          Variación: {diferencia >= 0 ? '+' : ''}${formatNumber(Math.abs(diferencia))}M ({variacion >= 0 ? '+' : ''}{variacion}%)
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }} />
            <Line type="monotone" dataKey="t2025" name="2025" stroke="#059669" strokeWidth={5} dot={{ r: 8, fill: '#059669', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 10 }} />
            <Line type="monotone" dataKey="t2024" name="2024" stroke="#374151" strokeWidth={4} dot={{ r: 7, fill: '#374151', strokeWidth: 3, stroke: '#fff' }} />
            <Line type="linear" dataKey="tendencia" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Tendencia 2025" />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="mt-4 bg-green-50 rounded-lg p-4 border-2 border-green-300">
          <p className="text-sm">El nivel de cierre de cartera a diciembre 2025 quedó en $16.787M frente a Dic/24 $17.162M, disminuyendo un -2%.</p>
        </div>
      </CollapsibleChart>

      <CollapsibleChart title="Evolución mensual de los días de rotación de cartera en 2025" defaultOpen={false}>
        <p className="text-sm text-gray-600 mb-4">Días que tardan los clientes en pagar (Meta: ≤15 días)</p>
        <ResponsiveContainer width="100%" height={450}>
          <ComposedChart data={rotacionConTend} margin={{ left: 30, right: 30, bottom: 10, top: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
            <XAxis dataKey="mes" stroke="#1f2937" style={{ fontSize: '14px', fontWeight: '700' }} />
            <YAxis stroke="#1f2937" label={{ value: 'Días', angle: -90, position: 'insideLeft', style: { fontSize: '14px', fontWeight: '700' } }} style={{ fontSize: '14px', fontWeight: '700' }} domain={[0, 25]} />
            <Tooltip content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const dias = payload.find(p => p.dataKey === 'dias_rotacion')?.value;
                if (dias == null) return null;
                const color = dias <= 15 ? '#059669' : dias <= 17 ? '#f59e0b' : '#ef4444';
                const estado = dias <= 15 ? 'Excelente - Meta cumplida' : dias <= 17 ? 'Aceptable - Cerca de la meta' : 'Requiere atención';
                return (
                  <div className="bg-white rounded-xl p-4 shadow-xl" style={{ border: `2px solid ${color}` }}>
                    <p className="font-bold text-gray-900 mb-2">{label}</p>
                    <p className="text-2xl font-bold" style={{ color }}>{dias} días</p>
                    <p className="text-xs text-gray-500">Tiempo promedio de pago</p>
                    <p className="text-sm font-semibold mt-2" style={{ color }}>{estado}</p>
                  </div>
                );
              }
              return null;
            }} />
            <Bar dataKey="dias_rotacion" name="Días Rotación" fill="#059669" radius={[8, 8, 0, 0]}>
              {rotacionConTend.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.dias_rotacion <= 15 ? '#059669' : entry.dias_rotacion <= 17 ? '#f59e0b' : '#ef4444'} />
              ))}
            </Bar>
            <Line type="linear" dataKey="tendencia" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Tendencia" />
          </ComposedChart>
        </ResponsiveContainer>
      </CollapsibleChart>

      <CollapsibleChart title="Cartera Vencida 2025 - % Facturas No Pagadas a Tiempo" defaultOpen={false}>
        <p className="text-sm text-gray-600 mb-4">Porcentaje de facturas no pagadas a tiempo</p>
        <ResponsiveContainer width="100%" height={450}>
          <ComposedChart data={morosidadConTend} margin={{ left: 30, right: 30, bottom: 10, top: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
            <XAxis dataKey="mes" stroke="#1f2937" style={{ fontSize: '14px', fontWeight: '700' }} />
            <YAxis stroke="#1f2937" tickFormatter={(value) => `${value}%`} style={{ fontSize: '14px', fontWeight: '700' }} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="indice_morosidad" name="Morosidad %" stroke="#f59e0b" strokeWidth={5} dot={{ r: 8, fill: '#f59e0b', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 10 }} />
            <Line type="linear" dataKey="tendencia" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Tendencia" />
          </ComposedChart>
        </ResponsiveContainer>
      </CollapsibleChart>

      <CollapsibleChart title="Forma de Pago de Clientes 2025 (Contado vs Crédito)" defaultOpen={false}>
        <p className="text-sm text-gray-600 mb-4">Porcentaje de ventas al contado vs crédito</p>
        <ResponsiveContainer width="100%" height={450}>
          <ComposedChart data={contadoConTend} margin={{ left: 30, right: 30, bottom: 10, top: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
            <XAxis dataKey="mes" stroke="#1f2937" style={{ fontSize: '14px', fontWeight: '700' }} />
            <YAxis stroke="#1f2937" tickFormatter={(value) => `${value}%`} style={{ fontSize: '14px', fontWeight: '700' }} domain={[0, 100]} />
            <Tooltip content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const mesData = datosMensuales.find(m => m.mes === label);
                if (!mesData) return null;
                const tendencia = payload.find(p => p.dataKey === 'tendencia')?.value;
                return (
                  <div className="bg-white border-2 border-purple-500 rounded-xl p-4 shadow-xl">
                    <p className="font-bold text-gray-900 mb-3">{label}</p>
                    <div className="space-y-1">
                      <p className="text-blue-600 font-semibold">Contado: {mesData.pct_contado}%</p>
                      <p className="text-xs text-blue-500">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(parseFloat(mesData.ventas_contado) || 0)}</p>
                      <p className="text-purple-600 font-semibold">Crédito: {mesData.pct_credito}%</p>
                      <p className="text-xs text-purple-500">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(parseFloat(mesData.ventas_credito) || 0)}</p>
                      {tendencia != null && <p className="text-red-500 text-xs border-t border-gray-200 pt-2 mt-2">Tendencia Contado: {Number(tendencia).toFixed(2)}%</p>}
                    </div>
                  </div>
                );
              }
              return null;
            }} />
            <Bar dataKey="pct_contado" name="% Contado" fill="#2563eb" radius={[8, 8, 0, 0]} />
            <Bar dataKey="pct_credito" name="% Crédito" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            <Line type="linear" dataKey="tendencia" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Tendencia Contado" />
          </ComposedChart>
        </ResponsiveContainer>
      </CollapsibleChart>

      {/* Análisis de cartera x mes: tabla izquierda + gráfico derecha */}
      <CollapsibleChart title="Análisis de Cartera x Mes (2025 vs 2024)" defaultOpen={false}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
            {/* Tabla resumen */}
            <div>
              <table className="text-sm border-collapse w-full">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="text-center py-2 px-3 font-bold w-10">Mes</th>
                    <th className="text-right py-2 px-3 font-bold">Cartera 2025</th>
                    <th className="text-right py-2 px-3 font-bold">Cartera 2024</th>
                    <th className="text-right py-2 px-3 font-bold whitespace-nowrap">% Var.</th>
                  </tr>
                </thead>
                <tbody>
                  {exposicionCartera.map((row, idx) => {
                    const varPct = row.t2024 > 0 ? parseFloat(((row.t2024 - row.t2025) / row.t2024 * 100).toFixed(2)) : 0;
                    const bajó = varPct > 0;
                    return (
                      <tr key={idx} className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/40'}`}>
                        <td className="py-1.5 px-3 text-center font-bold text-gray-700">{idx + 1}</td>
                        <td className="py-1.5 px-3 text-right tabular-nums text-gray-900 font-medium">${formatNumber(row.t2025)}</td>
                        <td className="py-1.5 px-3 text-right tabular-nums text-gray-500">${formatNumber(row.t2024)}</td>
                        <td className="py-1.5 px-3 text-right tabular-nums whitespace-nowrap">
                          <span className={`inline-flex items-center gap-0.5 font-bold ${bajó ? 'text-red-600' : 'text-green-600'}`}>
                            <span>{bajó ? '▼' : '▲'}</span>
                            {varPct.toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Gráfico */}
            <ResponsiveContainer width="100%" height={580}>
              <ComposedChart
                data={(() => {
                  const tend = calcTendencia(exposicionCartera, 't2024');
                  return tend.map(row => ({
                    ...row,
                    varPct: row.t2024 > 0 ? parseFloat(((row.t2024 - row.t2025) / row.t2024 * 100).toFixed(2)) : 0,
                  }));
                })()}
                margin={{ left: 10, right: 50, top: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="mes" stroke="#1f2937" style={{ fontSize: '18px' }} interval={0} tickFormatter={v => v?.substring(0, 3)} />
                <YAxis yAxisId="left" stroke="#1f2937" style={{ fontSize: '12px' }} tickFormatter={v => `${v}M`} />
                <YAxis yAxisId="right" orientation="right" stroke="#16a34a" style={{ fontSize: '18px' }}
                  tickFormatter={v => `${v.toFixed(0)}%`}
                  domain={[-30, 25]}
                  ticks={[-25, -20, -15, -10, -5, 0, 5, 10, 15, 20]}
                />
                <Tooltip content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const v2025 = payload.find(p => p.dataKey === 't2025')?.value || 0;
                  const v2024 = payload.find(p => p.dataKey === 't2024')?.value || 0;
                  const varP = payload.find(p => p.dataKey === 'varPct')?.value ?? 0;
                  return (
                    <div className="bg-white border-2 border-blue-400 rounded-xl p-3 shadow-xl text-sm">
                      <p className="font-bold text-gray-900 mb-2">{label}</p>
                      <p className="text-blue-600">2025: {formatCurrencyFull(v2025 * 1000000)}</p>
                      <p className="text-orange-500">2024: {formatCurrencyFull(v2024 * 1000000)}</p>
                      <p className={`font-semibold ${varP >= 0 ? 'text-red-600' : 'text-green-600'}`}>Variación: {varP.toFixed(2)}%</p>
                      <p className={`font-semibold ${varP >= 0 ? 'text-red-600' : 'text-green-600'}`}>Dif: {formatCurrencyFull((v2025 - v2024) * 1000000)}</p>
                    </div>
                  );
                }} />
                <Bar yAxisId="left" dataKey="t2025" name="Saldo Cartera 2025" fill="#4e9fd4" radius={[3, 3, 0, 0]} />
                <Bar yAxisId="left" dataKey="t2024" name="Saldo Cartera 2024" fill="#f97316" radius={[3, 3, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="varPct" name="% Variación vs 2024" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 4, fill: '#16a34a' }} />
                <Line yAxisId="left" type="linear" dataKey="tendencia" name="Tendencia lineal 2024" stroke="#f97316" strokeWidth={1.5} strokeDasharray="6 3" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          {/* Leyenda explicativa */}
          <div className="border-t border-gray-200 pt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-sm flex-shrink-0" style={{ backgroundColor: '#4e9fd4' }}></span>
              <span>Saldo de cartera 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-sm flex-shrink-0" style={{ backgroundColor: '#f97316' }}></span>
              <span>Saldo de cartera 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 flex-shrink-0 rounded" style={{ backgroundColor: '#16a34a', marginTop: 6 }}></span>
              <span>% variación mensual 2025 vs 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-0 flex-shrink-0 border-t-2 border-dashed" style={{ borderColor: '#f97316', marginTop: 6 }}></span>
              <span>Tendencia lineal del saldo 2024</span>
            </div>
          </div>
        </div>
      </CollapsibleChart>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl border-4 border-orange-500/30 overflow-hidden"
      >
        <CollapsibleTable
          title="Detalle Mensual de Gestión de Cartera 2024"
          defaultOpen={false}
          totalRow={[
            { label: 'CARTERA DIC 2024' },
            { label: formatCurrency(17161524439), color: 'text-orange-600' },
            { label: 'Rotación: 20,86 días', color: 'text-red-600' },
            { label: 'Morosidad: 50,67%', color: 'text-yellow-600' },
          ]}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300 bg-gray-50">
                  <th className="text-left py-3 px-2 font-bold text-gray-900">Mes</th>
                  <th className="text-right py-3 px-2 font-bold text-gray-900">Total Cartera</th>
                  <th className="text-right py-3 px-2 font-bold text-gray-900">Cartera Vencida</th>
                  <th className="text-right py-3 px-2 font-bold text-gray-900">Morosidad</th>
                  <th className="text-right py-3 px-2 font-bold text-gray-900">Var. Cartera Vencida</th>
                  <th className="text-right py-3 px-2 font-bold text-gray-900">Días Rotación</th>
                  <th className="text-right py-3 px-2 font-bold text-gray-900">% Contado</th>
                  <th className="text-right py-3 px-2 font-bold text-gray-900">Ventas Contado</th>
                  <th className="text-right py-3 px-2 font-bold text-gray-900">% Crédito</th>
                  <th className="text-right py-3 px-2 font-bold text-gray-900">Ventas Crédito</th>
                  <th className="text-right py-3 px-2 font-bold text-gray-900">Ventas Netas</th>
                </tr>
              </thead>
              <tbody>
                {(datosMensuales2024 || []).map((mes, idx) => {
                  const varPos = mes.variacion_cartera_vencida >= 0;
                  return (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-2 px-2 font-semibold text-gray-900">{mes.mes}</td>
                      <td className="py-2 px-2 text-right text-gray-900">{formatCurrency(mes.total_cartera)}</td>
                      <td className="py-2 px-2 text-right text-amber-700 font-semibold">{formatCurrency(mes.cartera_vencida)}</td>
                      <td className="py-2 px-2 text-right"><span className={mes.indice_morosidad > 50 ? 'text-red-600 font-bold' : 'text-gray-700'}>{mes.indice_morosidad}%</span></td>
                      <td className={`py-2 px-2 text-right font-semibold ${varPos ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(mes.variacion_cartera_vencida)}</td>
                      <td className="py-2 px-2 text-right"><span className={mes.dias_rotacion <= 15 ? 'text-green-600 font-bold' : mes.dias_rotacion <= 17 ? 'text-yellow-600' : 'text-red-600'}>{mes.dias_rotacion}</span></td>
                      <td className="py-2 px-2 text-right text-blue-600">{mes.pct_contado}%</td>
                      <td className="py-2 px-2 text-right text-blue-700">{formatCurrency(mes.ventas_contado)}</td>
                      <td className="py-2 px-2 text-right text-purple-600">{mes.pct_credito}%</td>
                      <td className="py-2 px-2 text-right text-purple-700">{formatCurrency(mes.ventas_credito)}</td>
                      <td className="py-2 px-2 text-right font-bold text-gray-900">{formatCurrency(mes.ventas_netas)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CollapsibleTable>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl border-4 border-indigo-500/30 overflow-hidden"
      >
        <CollapsibleTable
          title="Detalle Mensual de Gestión de Cartera 2025"
          defaultOpen={false}
          totalRow={[
            { label: 'CARTERA DIC 2025' },
            { label: `$${new Intl.NumberFormat('es-CO').format(resumenAnual.cartera_dic_2025_exacto || (resumenAnual.cartera_dic_2025 || 0) * 1000000)}`, color: 'text-purple-600' },
            { label: `Rotación: ${resumenAnual.rotacion_dic_2025} días`, color: 'text-green-600' },
            { label: `Morosidad: ${resumenAnual.morosidad_promedio}%`, color: 'text-yellow-600' },
          ]}
        >
          <p className="text-sm text-gray-600 mb-4">Valores en pesos colombianos y porcentajes</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300 bg-gray-50">
                  <th className="text-left py-3 px-2 font-bold text-gray-900">Mes</th>
                  <th className="text-right py-3 px-2 font-bold text-gray-900">Total Cartera</th>
                  <th className="text-right py-3 px-2 font-bold text-gray-900">Cartera Vencida</th>
                  <th className="text-right py-3 px-2 font-bold text-gray-900">Morosidad</th>
                  <th className="text-right py-3 px-2 font-bold text-gray-900">Var. Cartera Vencida</th>
                  <th className="text-right py-3 px-2 font-bold text-gray-900">Días Rotación</th>
                  <th className="text-right py-3 px-2 font-bold text-gray-900">% Contado</th>
                  <th className="text-right py-3 px-2 font-bold text-gray-900">Ventas Contado</th>
                  <th className="text-right py-3 px-2 font-bold text-gray-900">% Crédito</th>
                  <th className="text-right py-3 px-2 font-bold text-gray-900">Ventas Crédito</th>
                  <th className="text-right py-3 px-2 font-bold text-gray-900">Ventas Netas</th>
                </tr>
              </thead>
              <tbody>
                {datosMensuales.map((mes, idx) => {
                  const varPos = mes.variacion_cartera_vencida >= 0;
                  return (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-2 px-2 font-semibold text-gray-900">{mes.mes}</td>
                      <td className="py-2 px-2 text-right text-gray-900">{formatCurrency(mes.total_cartera)}</td>
                      <td className="py-2 px-2 text-right text-amber-700 font-semibold">{formatCurrency(mes.cartera_vencida)}</td>
                      <td className="py-2 px-2 text-right"><span className={mes.indice_morosidad > 50 ? 'text-red-600 font-bold' : 'text-gray-700'}>{mes.indice_morosidad}%</span></td>
                      <td className={`py-2 px-2 text-right font-semibold ${varPos ? 'text-red-600' : 'text-green-600'}`}>{varPos ? '' : ''}{formatCurrency(mes.variacion_cartera_vencida)}</td>
                      <td className="py-2 px-2 text-right"><span className={mes.dias_rotacion <= 15 ? 'text-green-600 font-bold' : mes.dias_rotacion <= 17 ? 'text-yellow-600' : 'text-red-600'}>{mes.dias_rotacion}</span></td>
                      <td className="py-2 px-2 text-right text-blue-600">{mes.pct_contado}%</td>
                      <td className="py-2 px-2 text-right text-blue-700">{formatCurrency(mes.ventas_contado)}</td>
                      <td className="py-2 px-2 text-right text-purple-600">{mes.pct_credito}%</td>
                      <td className="py-2 px-2 text-right text-purple-700">{formatCurrency(mes.ventas_credito)}</td>
                      <td className="py-2 px-2 text-right font-bold text-gray-900">{formatCurrency(mes.ventas_netas)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CollapsibleTable>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-5 border-2 border-green-500/30"
        >
          <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Logros 2025
          </h4>
          <div className="space-y-2 text-xs sm:text-sm text-gray-700">
            <div>• Rotación: {resumenAnual.rotacion_dic_2025} días (Meta ISO cumplida)</div>
            <div>• Mejora vs 2024: de 14,99 a {resumenAnual.rotacion_dic_2025} días</div>
            <div>• Cartera Dic: ${formatNumber(resumenAnual.cartera_dic_2025)}M ({resumenAnual.variacion_dic}% vs 2024)</div>
            <div>• Año de cambios estructurales en el área</div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
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
                className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-blue-500 shadow-2xl max-h-[90vh] overflow-y-auto"
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
                  <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    Entendido
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
