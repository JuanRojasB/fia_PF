import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { CheckCircle, AlertTriangle, FileText, TrendingDown, X, Info } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';
import CollapsibleChart from '../CollapsibleChart';
import { CustomPctTooltip } from './CustomTooltip';

export default function AuditoriaDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  };

  console.log('AuditoriaDashboard - Datos recibidos:', data);

  if (!data || typeof data !== 'object') {
    return <div className="text-gray-600">No hay datos disponibles</div>;
  }

  const {
    auditorias = [],
    devolucionesMensuales = [],
    devolucionesResumen = [],
    variacionDevoluciones = null,
    devolucionesPorSede = {},
    hallazgos = [],
    planesAccion = [],
    porTipo = {},
    totales = {}
  } = data;

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO').format(value);
  };

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

  // Preparar datos de devoluciones mensuales para gráfico con tendencia compañía
  const datosDevolucionesMesBase = devolucionesMensuales.map(d => ({
    mes: d.mes_nombre,
    anio: d.anio,
    'Sede 1': parseFloat(d.sede_1_pct),
    'Sede 2': parseFloat(d.sede_2_pct),
    'Sede 3': parseFloat(d.sede_3_pct),
    promedio: parseFloat(((parseFloat(d.sede_1_pct) + parseFloat(d.sede_2_pct) + parseFloat(d.sede_3_pct)) / 3).toFixed(3))
  }));

  const datosDevolucionesMes = calcTendencia(datosDevolucionesMesBase, 'promedio');

  // Preparar datos de resumen anual
  const datosResumenAnual = devolucionesResumen.map(r => ({
    anio: r.anio,
    'Compañía': parseFloat(r.promedio_compania_pct),
    'Sede 1': r.promedio_sede_1_pct ? parseFloat(r.promedio_sede_1_pct) : null,
    'Sede 2': r.promedio_sede_2_pct ? parseFloat(r.promedio_sede_2_pct) : null,
    'Sede 3': r.promedio_sede_3_pct ? parseFloat(r.promedio_sede_3_pct) : null
  }));

  // Preparar datos por tipo de auditoría
  const datosTipos = Object.entries(porTipo).map(([tipo, data]) => ({
    tipo,
    cantidad: data.cantidad,
    areas: data.areas.length
  }));

  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-xl rounded-xl p-6 border-2 border-blue-500/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">AUDITORÍA INTERNA Y CONTROL INTERNO 2025</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          Durante 2025, el área ejecutó auditorías a 4 procesos: Posproceso, Logística y Comercial con seguimiento diario e informe mensual (12 informes/año cada uno), y Puntos de Venta con dos esquemas: PDV Yopal (4 auditorías/año a 6 PDV = 24) y PDV Bogotá, Tunja y Sogamoso (17 auditorías/año a 17 PDV = 289). Total PDV: 313 auditorías. Total general: 349 auditorías/informes ejecutados en 2025.
        </p>
      </motion.div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal(
            'Total Auditorías / Informes Ejecutados 2025',
            <div className="space-y-4 text-gray-700">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Contexto del indicador</p>
                <p className="text-sm">En 2025 se ejecutaron un total de <strong className="text-blue-600">349 auditorías e informes</strong>, distribuidos entre procesos misionales y puntos de venta. Este volumen refleja la cobertura integral del sistema de control interno sobre las operaciones críticas de la empresa.</p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Desglose por proceso</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Posproceso (diario → informe mensual):</span><strong>12 informes</strong></div>
                  <div className="flex justify-between"><span>Logística (diario → informe mensual):</span><strong>12 informes</strong></div>
                  <div className="flex justify-between"><span>Comercial (diario → informe mensual):</span><strong>12 informes</strong></div>
                  <div className="flex justify-between"><span>PDV Yopal (4/año × 6 PDV):</span><strong>24 auditorías</strong></div>
                  <div className="flex justify-between"><span>PDV Bogotá, Tunja, Sogamoso (17/año × 17 PDV):</span><strong>289 auditorías</strong></div>
                  <div className="border-t border-indigo-200 pt-2 flex justify-between font-bold"><span>Total PDV:</span><span className="text-indigo-600">313</span></div>
                  <div className="flex justify-between font-bold text-blue-600"><span>Gran Total:</span><span>349</span></div>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Impacto en el negocio</p>
                <p className="text-sm">La cobertura de 349 auditorías garantiza visibilidad continua sobre los procesos operativos y comerciales, permitiendo detectar desviaciones oportunamente. Las alertas preventivas diarias y semanales emitidas contribuyeron a la reducción del 0.28 p.p. en devoluciones.</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 cursor-pointer hover:border-blue-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Total Auditorías Ejecutadas 2025</span>
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">349</div>
          <div className="text-sm text-gray-600 mt-1">auditorías e informes totales</div>
          <div className="text-xs text-blue-600 mt-2">PDV: 313 · Procesos: 36</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal(
            'Porcentaje de Devolución Promedio 2025',
            <div className="space-y-4 text-gray-700">
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Contexto del indicador</p>
                <p className="text-sm">El porcentaje de devolución se calcula como los <strong>kilos devueltos sobre la venta bruta</strong>. En 2025 el promedio de la compañía fue de <strong className="text-green-600">2.26%</strong>, con una reducción de <strong>0.28 p.p.</strong> frente al 2.54% de 2024.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Resultado por sede 2025</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between bg-indigo-50 rounded p-2"><span>Sede 1:</span><strong className="text-indigo-600">2.85%</strong></div>
                  <div className="flex justify-between bg-emerald-50 rounded p-2"><span>Sede 2:</span><strong className="text-emerald-600">1.61%</strong></div>
                  <div className="flex justify-between bg-amber-50 rounded p-2"><span>Sede 3:</span><strong className="text-amber-600">2.31%</strong></div>
                  <div className="flex justify-between bg-blue-100 rounded p-2 font-bold"><span>Compañía (promedio):</span><strong className="text-blue-600">2.26%</strong></div>
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Causas de la mejora</p>
                <p className="text-sm">Las alertas preventivas diarias y semanales emitidas por el área de Auditoría permitieron corregir desviaciones oportunamente en los procesos de logística y comercial, que son los principales generadores de devoluciones.</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 cursor-pointer hover:border-green-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">% Devolución Promedio 2025</span>
            <TrendingDown className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{variacionDevoluciones ? variacionDevoluciones.pct_2025 : totales.promedioDevolucionGeneral}%</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{variacionDevoluciones ? variacionDevoluciones.pct_2024 : '2,54'}%</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{variacionDevoluciones ? variacionDevoluciones.pct_2025 : totales.promedioDevolucionGeneral}%</span></div>
            <div className="text-sm font-bold text-green-600">Var: {variacionDevoluciones ? variacionDevoluciones.variacion_puntos_porcentuales : '-0,28'}pp</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal(
            'Variación de Devoluciones 2025 vs 2024',
            <div className="space-y-4 text-gray-700">
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Análisis de la variación</p>
                <p className="text-sm">El promedio de devoluciones pasó de <strong>2.54%</strong> en 2024 a <strong className="text-green-600">2.26%</strong> en 2025, una reducción de <strong>0.28 p.p.</strong> Esta mejora, aunque moderada en términos absolutos, es significativa porque se logró en un contexto de crecimiento del volumen operado.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Factores que explican la mejora</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Alertas preventivas diarias y semanales del área de Auditoría</li>
                  <li>Corrección oportuna de desviaciones en logística y comercial</li>
                  <li>Fortalecimiento de los controles existentes en los procesos</li>
                  <li>Seguimiento mensual por sede con análisis comparativo</li>
                </ul>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Impacto económico</p>
                <p className="text-sm">Cada punto porcentual de reducción en devoluciones representa kilos de producto que no regresan a la planta, reduciendo costos de reprocesso, transporte de retorno y pérdida de producto. La reducción de 0.28 p.p. tiene un impacto directo en la rentabilidad operativa.</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 cursor-pointer hover:border-purple-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Variación Devoluciones 2025 vs 2024</span>
            {totales.variacion2025vs2024 < 0 ? (
              <TrendingDown className="w-5 h-5 text-green-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-orange-400" />
            )}
          </div>
          <div className={`text-3xl font-bold ${totales.variacion2025vs2024 < 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totales.variacion2025vs2024 < 0 ? '↓' : '↑'} {Math.abs(totales.variacion2025vs2024)}pp
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{variacionDevoluciones ? variacionDevoluciones.pct_2024 : '2,54'}%</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{variacionDevoluciones ? variacionDevoluciones.pct_2025 : '2,26'}%</span></div>
            <div className={`text-sm font-bold ${totales.variacion2025vs2024 < 0 ? 'text-green-600' : 'text-red-600'}`}>
              Var: {totales.variacion2025vs2024 < 0 ? '' : '+'}{totales.variacion2025vs2024}pp
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal(
            'Seguimiento Mensual de Devoluciones',
            <div className="space-y-4 text-gray-700">
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Metodología de seguimiento</p>
                <p className="text-sm">El área de Auditoría realiza seguimiento mensual al proceso de devoluciones por sede, evidenciando su comportamiento al cierre del año 2025 en comparación con 2024. El indicador se calcula como los <strong>kilos devueltos sobre la venta bruta</strong>.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Cómo leer el gráfico</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Cada línea representa el % de devolución mensual de una sede</li>
                  <li>La línea roja punteada es la tendencia calculada por regresión lineal sobre el promedio mensual de la compañía</li>
                  <li>Una tendencia descendente indica mejora sostenida en el proceso</li>
                  <li>Picos en meses específicos pueden indicar problemas puntuales de calidad o logística</li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Valor del seguimiento continuo</p>
                <p className="text-sm">El monitoreo mensual permite identificar variaciones, tendencias y oportunidades de mejora en la gestión del proceso. Las alertas preventivas emitidas por Auditoría son el mecanismo de corrección temprana que explica la reducción de 0.28 p.p. en el año.</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30 cursor-pointer hover:border-orange-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Registros Mensuales de Devoluciones</span>
            <CheckCircle className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{totales.totalDevolucionesMensuales}</div>
          <div className="text-sm text-gray-600 mt-1">datos registrados</div>
          <div className="text-xs text-gray-600 mt-2">seguimiento continuo</div>
        </motion.div>
      </div>

      {/* Gráfico de Devoluciones Mensuales */}
      {datosDevolucionesMes.length > 0 && (
        <CollapsibleChart title="Devoluciones Mensuales por Sede (%)" defaultOpen={false}>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={datosDevolucionesMes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mes" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip content={<CustomPctTooltip borderColor="#3b82f6" />} />
              <Legend />
              <Line type="monotone" dataKey="Sede 1" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="Sede 2" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="Sede 3" stroke="#f59e0b" strokeWidth={2} />
              <Line type="linear" dataKey="tendencia" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Tendencia Cía." />
            </ComposedChart>
          </ResponsiveContainer>
        </CollapsibleChart>
      )}

      {/* Devoluciones por Sede 2025 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Devoluciones por Sede — Cierre 2025 vs 2024</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200 text-center">
            <div className="text-sm text-blue-700 font-medium mb-1">Compañía (promedio)</div>
            <div className="text-3xl font-bold text-blue-900">2,26%</div>
            <div className="text-xs text-green-600 mt-1">↓ 0,28 p.p. vs 2024 (2,54%)</div>
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
        <p className="text-sm text-gray-600 mt-4 leading-relaxed">
          El proceso de devoluciones es analizado por sede, evidenciando su comportamiento al cierre del año 2025 en comparación con 2024, permitiendo identificar variaciones, tendencias y oportunidades de mejora en la gestión del proceso.
        </p>
      </motion.div>

      {/* Variación 2025 vs 2024 */}
      {variacionDevoluciones && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-xl rounded-xl p-6 border border-green-500/30"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Análisis de Variación 2025 vs 2024</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-100/30 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">2025</div>
              <div className="text-2xl font-bold text-gray-900">{variacionDevoluciones.pct_2025}%</div>
            </div>
            <div className="bg-gray-100/30 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">2024</div>
              <div className="text-2xl font-bold text-gray-900">{variacionDevoluciones.pct_2024}%</div>
            </div>
            <div className="bg-gray-100/30 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Variación</div>
              <div className={`text-2xl font-bold ${parseFloat(variacionDevoluciones.variacion_puntos_porcentuales) < 0 ? 'text-green-400' : 'text-red-400'}`}>
                {variacionDevoluciones.variacion_puntos_porcentuales}pp
              </div>
            </div>
            <div className="bg-gray-100/30 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Estado</div>
              <div className={`text-lg font-bold ${variacionDevoluciones.estado_auditoria.includes('Mejora') ? 'text-green-400' : 'text-red-400'}`}>
                {variacionDevoluciones.estado_auditoria}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabla de Auditorías Ejecutadas 2025 */}
      <CollapsibleTable 
        title="Auditorías Ejecutadas 2025 — Resumen por Proceso"
        defaultOpen={false}
        totalRow={[
          { label: 'TOTAL 2025' },
          { label: '349 auditorías / informes', color: 'text-blue-600' },
          { label: '4 procesos auditados', color: 'text-gray-500' },
        ]}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-indigo-600">
                <th className="text-left py-3 px-4 text-white font-bold">Proceso / Área</th>
                <th className="text-left py-3 px-4 text-white font-bold">Tipo</th>
                <th className="text-center py-3 px-4 text-white font-bold">Frecuencia</th>
                <th className="text-center py-3 px-4 text-white font-bold">Unidades</th>
                <th className="text-center py-3 px-4 text-white font-bold">Total Auditorías</th>
                <th className="text-left py-3 px-4 text-white font-bold">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                <td className="py-3 px-4 text-gray-900 font-semibold">Posproceso</td>
                <td className="py-3 px-4 text-blue-600">Proceso Misional</td>
                <td className="py-3 px-4 text-center text-gray-700">Diaria → informe mensual</td>
                <td className="py-3 px-4 text-center text-gray-600">1 proceso</td>
                <td className="py-3 px-4 text-center font-bold text-gray-900">12</td>
                <td className="py-3 px-4"><span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700 font-medium">Completadas</span></td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                <td className="py-3 px-4 text-gray-900 font-semibold">Logística</td>
                <td className="py-3 px-4 text-blue-600">Proceso Misional</td>
                <td className="py-3 px-4 text-center text-gray-700">Diaria → informe mensual</td>
                <td className="py-3 px-4 text-center text-gray-600">1 proceso</td>
                <td className="py-3 px-4 text-center font-bold text-gray-900">12</td>
                <td className="py-3 px-4"><span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700 font-medium">Completadas</span></td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                <td className="py-3 px-4 text-gray-900 font-semibold">Comercial</td>
                <td className="py-3 px-4 text-blue-600">Proceso Misional</td>
                <td className="py-3 px-4 text-center text-gray-700">Diaria → informe mensual</td>
                <td className="py-3 px-4 text-center text-gray-600">1 proceso</td>
                <td className="py-3 px-4 text-center font-bold text-gray-900">12</td>
                <td className="py-3 px-4"><span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700 font-medium">Completadas</span></td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-indigo-50 transition-colors bg-indigo-50/30">
                <td className="py-3 px-4 text-gray-900 font-semibold">PDV Yopal</td>
                <td className="py-3 px-4 text-indigo-600">Punto de Venta</td>
                <td className="py-3 px-4 text-center text-gray-700">4 auditorías/año por PDV</td>
                <td className="py-3 px-4 text-center text-gray-600">6 PDV</td>
                <td className="py-3 px-4 text-center font-bold text-indigo-700">24</td>
                <td className="py-3 px-4"><span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700 font-medium">Completadas</span></td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-indigo-50 transition-colors bg-indigo-50/30">
                <td className="py-3 px-4 text-gray-900 font-semibold">
                  PDV Bogotá, Tunja y Sogamoso
                  <div className="text-xs text-gray-500 font-normal mt-0.5">Bogotá: 15 PDV · Tunja: 1 PDV · Sogamoso: 1 PDV</div>
                </td>
                <td className="py-3 px-4 text-indigo-600">Punto de Venta</td>
                <td className="py-3 px-4 text-center text-gray-700">17 auditorías/año por PDV</td>
                <td className="py-3 px-4 text-center text-gray-600">17 PDV</td>
                <td className="py-3 px-4 text-center font-bold text-indigo-700">289</td>
                <td className="py-3 px-4"><span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700 font-medium">Completadas</span></td>
              </tr>
              <tr className="bg-indigo-100 border-t-2 border-indigo-400 font-bold">
                <td className="py-3 px-4 text-indigo-900" colSpan={4}>Subtotal PDV</td>
                <td className="py-3 px-4 text-center text-indigo-900">313</td>
                <td className="py-3 px-4"></td>
              </tr>
              <tr className="bg-blue-100 border-t-2 border-blue-500 font-bold">
                <td className="py-3 px-4 text-blue-900" colSpan={4}>TOTAL GENERAL 2025</td>
                <td className="py-3 px-4 text-center text-blue-900 text-lg">349</td>
                <td className="py-3 px-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-gray-900">Nota metodológica:</span> Posproceso, Logística y Comercial realizan seguimiento diario con consolidación en informe mensual (12 informes/año). Los PDV de Yopal tienen menor frecuencia (4/año) por su ubicación geográfica. Los PDV de Bogotá (15), Tunja (1) y Sogamoso (1) — 17 PDV en total — tienen mayor intensidad de control (17 auditorías/año cada uno).
          </p>
        </div>
      </CollapsibleTable>

      {/* Hallazgos y Planes de Acción */}
      {(hallazgos.length > 0 || planesAccion.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hallazgos */}
          {hallazgos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Hallazgos de Auditoría Recientes 2025</h3>
              <div className="space-y-3">
                {hallazgos.slice(0, 5).map((hall, idx) => (
                  <div key={idx} className="bg-gray-100/30 rounded-lg p-3 border border-gray-300">
                    <div className="flex items-start justify-between mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        hall.nivel_riesgo === 'Alto' ? 'bg-red-500/20 text-red-400' :
                        hall.nivel_riesgo === 'Medio' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {hall.nivel_riesgo}
                      </span>
                      <span className="text-xs text-gray-500">{hall.tipo_auditoria}</span>
                    </div>
                    <p className="text-sm text-gray-900 mb-1">{hall.descripcion_hallazgo}</p>
                    <p className="text-xs text-gray-600">{hall.area_proceso_auditado}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Planes de Acción */}
          {planesAccion.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Planes de Acción Correctiva 2025</h3>
              <div className="space-y-3">
                {planesAccion.slice(0, 5).map((plan, idx) => (
                  <div key={idx} className="bg-gray-100/30 rounded-lg p-3 border border-gray-300">
                    <div className="flex items-start justify-between mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        plan.estado_plan === 'Completado' ? 'bg-green-500/20 text-green-400' :
                        plan.dias_para_vencimiento < 0 ? 'bg-red-500/20 text-red-400' :
                        plan.dias_para_vencimiento < 7 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {plan.estado_plan}
                      </span>
                      <span className="text-xs text-gray-500">
                        {plan.dias_para_vencimiento < 0 ? 'Vencido' : `${plan.dias_para_vencimiento} días`}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 mb-1">{plan.accion_correctiva}</p>
                    <p className="text-xs text-gray-600">{plan.descripcion_hallazgo}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Modal */}
      {createPortal(
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
              className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-blue-500 shadow-2xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4 flex-shrink-0">
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
              <div className="text-gray-700 leading-relaxed overflow-y-auto flex-1 pr-2">
                {modalContent.content}
              </div>
              <div className="mt-6 flex justify-end flex-shrink-0">
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
      </AnimatePresence>, document.body)}
    </div>
  );
}

