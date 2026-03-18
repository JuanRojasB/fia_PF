import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CheckCircle, AlertTriangle, TrendingDown, X, Info } from 'lucide-react';
import CollapsibleChart from '../CollapsibleChart';
import { CustomPctTooltip } from './CustomTooltip';

export default function AuditoriaDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  };

  if (!data || typeof data !== 'object') {
    return <div className="text-gray-600">No hay datos disponibles</div>;
  }

  const {
    devolucionesMensuales = [],
    devolucionesResumen = [],
    variacionDevoluciones = null,
  } = data;

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
    return datos.map((d, i) => ({ ...d, tendencia: parseFloat((intercept + slope * i).toFixed(3)) }));
  };

  const datosDevolucionesMesBase = [...devolucionesMensuales]
    .sort((a, b) => a.anio !== b.anio ? a.anio - b.anio : a.mes_num - b.mes_num)
    .map(d => ({
    mes: d.mes_nombre,
    anio: d.anio,
    mesCompleto: `${d.mes_nombre} ${d.anio}`,
    label: `${d.mes_nombre} ${d.anio}`,
    'Sede 1': parseFloat(d.sede_1_pct),
    'Sede 2': parseFloat(d.sede_2_pct),
    'Sede 3': parseFloat(d.sede_3_pct),
    promedio: parseFloat(((parseFloat(d.sede_1_pct) + parseFloat(d.sede_2_pct) + parseFloat(d.sede_3_pct)) / 3).toFixed(3))
  }));
  const datosDevolucionesMes = calcTendencia(datosDevolucionesMesBase, 'promedio');

  // Calcular posiciones de etiquetas de año (ya no se usan con el nuevo tick personalizado)
  const aniosUnicos = [...new Set(datosDevolucionesMes.map(d => d.anio))];

  // Valores de devoluciones — desde BD o fallback del texto
  const resumen2025 = devolucionesResumen.find(r => r.anio == 2025) || {};
  const resumen2024 = devolucionesResumen.find(r => r.anio == 2024) || {};
  const pct2025 = variacionDevoluciones?.pct_2025 ?? resumen2025.promedio_compania_pct ?? '2,26';
  const pct2024 = variacionDevoluciones?.pct_2024 ?? resumen2024.promedio_compania_pct ?? '2,54';
  const variacion = variacionDevoluciones?.variacion_puntos_porcentuales ?? '-0,28';
  const variacionNum = parseFloat(String(variacion).replace(',', '.'));

  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-xl rounded-xl p-6 border-2 border-blue-500/30"
      >
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Auditoría Interna y Control Interno 2025</h2>
        </div>
        <p className="text-gray-700 leading-relaxed text-sm">
          Durante el año 2025, el área ejecutó auditorías a los procesos misionales con frecuencias diferenciadas: Posproceso (diaria con informe mensual), Logística y Comercial (mensual — 12 al año). Los PDV de Bogotá, Tunja, Sogamoso y Chiquinquirá reciben 17 auditorías al año por punto, mientras que los 4 PDV de Yopal reciben 6 auditorías al año. Las auditorías evaluaron la correcta aplicación de controles para mitigar riesgos y su impacto en la gestión de inventarios, la merma y la eficiencia operativa.
        </p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Auditorías por proceso */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal(
            'Auditorías por Proceso Misional 2025',
            <div className="space-y-3 text-gray-700">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm">Frecuencias diferenciadas según el proceso. Posproceso se audita diariamente pero el informe es mensual. Logística y Comercial tienen auditoría mensual (12 al año).</p>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  { p: 'Posproceso', f: 'Diaria (informe mensual)', n: '12 informes/año' },
                  { p: 'Logística', f: 'Mensual', n: '12 auditorías/año' },
                  { p: 'Comercial', f: 'Mensual', n: '12 auditorías/año' },
                ].map(({ p, f, n }) => (
                  <div key={p} className="flex justify-between items-center bg-indigo-50 rounded p-3 border border-indigo-200">
                    <div>
                      <span className="font-medium">{p}</span>
                      <span className="text-xs text-gray-500 ml-2">— {f}</span>
                    </div>
                    <strong className="text-indigo-600">{n}</strong>
                  </div>
                ))}
              </div>
              <div className="flex justify-between bg-blue-100 rounded p-3 border border-blue-300 font-bold text-sm">
                <span>Total procesos misionales</span>
                <strong className="text-blue-700">36 auditorías/año</strong>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-300 text-sm">
                Las auditorías evaluaron la correcta aplicación de controles para mitigar riesgos e impacto en inventarios, merma y eficiencia operativa.
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 cursor-pointer hover:border-blue-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Auditorías por Proceso Misional</span>
            <CheckCircle className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">36</div>
          <div className="text-sm text-gray-600 mt-1">auditorías totales / año</div>
          <div className="text-xs text-blue-600 mt-1">Posproceso · Logística · Comercial — 12 c/u</div>
          <Info className="w-4 h-4 text-blue-500 animate-pulse mt-2" />
        </motion.div>

        {/* Auditorías PDV */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal(
            'Auditorías a Puntos de Venta 2025',
            <div className="space-y-3 text-gray-700">
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="text-sm">La frecuencia de auditoría varía según la ciudad. Los PDV de Bogotá, Tunja, Sogamoso y Chiquinquirá reciben <strong>17 auditorías al año</strong> cada uno (14 PDV en total). Los 4 PDV de Yopal reciben <strong>6 auditorías al año</strong> cada uno.</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center bg-purple-50 rounded p-3 border border-purple-200">
                  <div>
                    <span className="font-medium">Bogotá · Tunja · Sogamoso · Chiquinquirá</span>
                    <span className="text-xs text-gray-500 ml-2"></span>
                  </div>
                  <strong className="text-purple-600">238 auditorías</strong>
                </div>
                <div className="flex justify-between items-center bg-indigo-50 rounded p-3 border border-indigo-200">
                  <div>
                    <span className="font-medium">Yopal</span>
                    <span className="text-xs text-gray-500 ml-2"></span>
                  </div>
                  <strong className="text-indigo-600">24 auditorías</strong>
                </div>
                <div className="flex justify-between bg-blue-100 rounded p-3 border border-blue-300 font-bold">
                  <span>Total PDV</span>
                  <strong className="text-blue-700">262 auditorías/año</strong>
                </div>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 cursor-pointer hover:border-purple-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Auditorías a Puntos de Venta</span>
            <CheckCircle className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">262</div>
          <div className="text-sm text-gray-600 mt-1">auditorías totales PDV / año</div>
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between items-center text-xs bg-purple-50 rounded px-2 py-1">
              <span className="text-gray-600">Bogotá · Tunja · Sogamoso · Chiquinquirá</span>
              <span className="font-bold text-purple-700">238 auditorías</span>
            </div>
            <div className="flex justify-between items-center text-xs bg-indigo-50 rounded px-2 py-1">
              <span className="text-gray-600">Yopal (4 PDV)</span>
              <span className="font-bold text-indigo-700">24 auditorías</span>
            </div>
          </div>
          <Info className="w-4 h-4 text-purple-500 animate-pulse mt-2" />
        </motion.div>

        {/* % Devolución promedio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal(
            '% Devolución Promedio Compañía 2025',
            <div className="space-y-3 text-gray-700">
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="text-sm">El indicador se calcula como los <strong>kilos devueltos sobre la venta bruta</strong>. En 2025 el promedio de la compañía fue <strong className="text-green-600">2,26%</strong>, con una reducción de <strong>0,28 p.p.</strong> frente al 2,54% de 2024.</p>
              </div>
              <div className="space-y-2 text-sm">
                {[['Sede 1', '2,85%', 'indigo'], ['Sede 2', '1,61%', 'emerald'], ['Sede 3', '2,31%', 'amber']].map(([sede, val, color]) => (
                  <div key={sede} className={`flex justify-between bg-${color}-50 rounded p-3 border border-${color}-200`}>
                    <span className="font-medium">{sede}</span>
                    <strong className={`text-${color}-600`}>{val}</strong>
                  </div>
                ))}
                <div className="flex justify-between bg-blue-100 rounded p-3 border border-blue-300 font-bold">
                  <span>Compañía (promedio)</span>
                  <strong className="text-blue-600">2,26%</strong>
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-300 text-sm">
                Las alertas preventivas diarias y semanales del área de Auditoría permitieron corregir desviaciones oportunamente en logística y comercial.
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 cursor-pointer hover:border-green-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">% Devolución Promedio 2025</span>
            <TrendingDown className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{pct2025}%</div>
          <div className="mt-3 pt-3 border-t border-gray-200 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{pct2024}%</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{pct2025}%</span></div>
            <div className={`text-sm font-bold ${variacionNum < 0 ? 'text-green-600' : 'text-red-600'}`}>
              Var: {variacion} p.p.
            </div>
          </div>
          <Info className="w-4 h-4 text-green-500 animate-pulse mt-2" />
        </motion.div>
      </div>

      {/* Devoluciones por Sede */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Devoluciones por Sede — Cierre 2025 vs 2024</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200 text-center">
            <div className="text-sm text-blue-700 font-medium mb-1">Compañía (promedio)</div>
            <div className="text-3xl font-bold text-blue-900">{pct2025}%</div>
            <div className="text-xs text-green-600 mt-1">↓ 0,28 p.p. vs 2024 ({pct2024}%)</div>
          </div>
          <div className="bg-indigo-50 rounded-xl p-4 border-2 border-indigo-200 text-center">
            <div className="text-sm text-indigo-700 font-medium mb-1">Sede 1</div>
            <div className="text-3xl font-bold text-indigo-900">2,85%</div>
            <div className="text-xs text-gray-500 mt-1">kilos devueltos / venta bruta</div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 border-2 border-emerald-200 text-center">
            <div className="text-sm text-emerald-700 font-medium mb-1">Sede 2</div>
            <div className="text-3xl font-bold text-emerald-900">1,61%</div>
            <div className="text-xs text-gray-500 mt-1">kilos devueltos / venta bruta</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-200 text-center">
            <div className="text-sm text-amber-700 font-medium mb-1">Sede 3</div>
            <div className="text-3xl font-bold text-amber-900">2,31%</div>
            <div className="text-xs text-gray-500 mt-1">kilos devueltos / venta bruta</div>
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          El proceso de devoluciones es analizado por sede, evidenciando su comportamiento al cierre del año 2025 en comparación con 2024, permitiendo identificar variaciones, tendencias y oportunidades de mejora en la gestión del proceso.
        </p>
      </motion.div>

      {/* Gráfico mensual */}
      {datosDevolucionesMes.length > 0 && (
        <CollapsibleChart title="Devoluciones Mensuales por Sede (%)" defaultOpen={false}>
          <ResponsiveContainer width="100%" height={420}>
            <ComposedChart data={datosDevolucionesMes} margin={{ top: 10, right: 20, left: 10, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

              <XAxis
                dataKey="mes"
                interval={0}
                height={60}
                tick={({ x, y, payload, index }) => {
                  const item = datosDevolucionesMes[index];
                  const prev = datosDevolucionesMes[index - 1];
                  const isNewYear = !prev || prev.anio !== item?.anio;
                  const mesCorto = (payload.value || '').substring(0, 3);
                  // Índice central de cada año para mostrar la etiqueta
                  const indicesAnio = datosDevolucionesMes
                    .map((d, i) => d.anio === item?.anio ? i : -1)
                    .filter(i => i >= 0);
                  const centroAnio = Math.floor((indicesAnio[0] + indicesAnio[indicesAnio.length - 1]) / 2);
                  const showYear = index === centroAnio;

                  return (
                    <g transform={`translate(${x},${y})`}>
                      {/* Separador vertical al inicio de cada año */}
                      {isNewYear && index > 0 && (
                        <line x1={-12} y1={2} x2={-12} y2={42} stroke="#94a3b8" strokeWidth={1.5} />
                      )}
                      {/* Mes abreviado */}
                      <text x={0} y={16} textAnchor="middle" fill="#6b7280" fontSize={11}>
                        {mesCorto}
                      </text>
                      {/* Año centrado bajo el grupo */}
                      {showYear && (
                        <text x={0} y={38} textAnchor="middle" fill="#1e40af" fontSize={13} fontWeight="bold">
                          {item?.anio}
                        </text>
                      )}
                    </g>
                  );
                }}
              />

              <YAxis
                stroke="#6b7280"
                tickFormatter={v => `${v}%`}
                domain={[0, 6]}
                width={45}
              />
              <Tooltip content={<CustomPctTooltip borderColor="#3b82f6" />} />
              <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 8 }} />
              <Line type="monotone" dataKey="Sede 1" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Sede 2" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Sede 3" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="linear" dataKey="tendencia" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Tendencia Cía." />
            </ComposedChart>
          </ResponsiveContainer>
        </CollapsibleChart>
      )}

      {/* Alertas preventivas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Alertas Preventivas</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Como resultado de las auditorías y procesos a cargo, el área realizó <strong>alertas preventivas diarias y semanales</strong> a las áreas involucradas, con el fin de corregir desviaciones oportunamente, fortalecer los controles existentes y apoyar la toma de decisiones, contribuyendo a los objetivos estratégicos de la compañía y a la mejora continua del proceso.
            </p>
          </div>
        </div>
      </motion.div>

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
                className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-blue-500 shadow-2xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-4 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <Info className="w-6 h-6 text-blue-500" />
                    <h3 className="text-xl font-bold text-gray-900">{modalContent.title}</h3>
                  </div>
                  <button onClick={() => setModalOpen(false)} className="text-gray-600 hover:text-gray-900 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="text-gray-700 leading-relaxed overflow-y-auto flex-1 pr-2">{modalContent.content}</div>
                <div className="mt-6 flex justify-end flex-shrink-0">
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
