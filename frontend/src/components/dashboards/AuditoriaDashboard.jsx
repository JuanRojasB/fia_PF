import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CheckCircle, AlertTriangle, FileText, TrendingDown, X, Info } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';

export default function AuditoriaDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
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

  // Preparar datos de devoluciones mensuales para gráfico
  const datosDevolucionesMes = devolucionesMensuales.map(d => ({
    mes: d.mes_nombre,
    anio: d.anio,
    'Sede 1': parseFloat(d.sede_1_pct),
    'Sede 2': parseFloat(d.sede_2_pct),
    'Sede 3': parseFloat(d.sede_3_pct)
  }));

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
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal(
            'Total de Auditorías Ejecutadas',
            `Se han ejecutado ${totales.totalAuditorias} auditorías en total, distribuidas en ${totales.tiposAuditoria} tipos diferentes: auditorías de procesos misionales y auditorías de puntos de venta. Estas auditorías permiten evaluar el cumplimiento de estándares de calidad, operación y control en toda la compañía, identificando oportunidades de mejora y asegurando el cumplimiento normativo.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 cursor-pointer hover:border-blue-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Total Auditorías Ejecutadas 2025</span>
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{totales.totalAuditorias}</div>
          <div className="text-sm text-gray-600 mt-1">auditorías ejecutadas</div>
          <div className="text-xs text-blue-600 mt-2">{totales.tiposAuditoria} tipos diferentes</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal(
            'Porcentaje de Devolución 2025',
            `El porcentaje promedio de devoluciones en 2025 es de ${variacionDevoluciones ? variacionDevoluciones.pct_2025 : totales.promedioDevolucionGeneral}%, evaluado en ${totales.sedesEvaluadas} sedes de producción. Este indicador crítico mide la calidad del producto entregado y la efectividad de los procesos de distribución. Un porcentaje bajo indica alta calidad y buenos procesos. En 2024 el porcentaje fue de ${variacionDevoluciones ? variacionDevoluciones.pct_2024 : 'N/A'}%.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 cursor-pointer hover:border-green-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">% Devolución Promedio 2025</span>
            <TrendingDown className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{variacionDevoluciones ? variacionDevoluciones.pct_2025 : totales.promedioDevolucionGeneral}%</div>
          <div className="text-sm text-gray-600 mt-1">porcentaje promedio</div>
          <div className="text-xs text-gray-600 mt-2">{totales.sedesEvaluadas} sedes evaluadas</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal(
            'Variación de Devoluciones 2025 vs 2024',
            `La variación 2025 vs 2024 es de ${totales.variacion2025vs2024} puntos porcentuales (pp). ${totales.variacion2025vs2024 < 0 ? `Una reducción de ${Math.abs(totales.variacion2025vs2024)}pp indica mejora en la calidad del producto y eficiencia en los procesos de distribución. Esto refleja el impacto positivo de las acciones correctivas implementadas.` : `Un incremento de ${totales.variacion2025vs2024}pp indica deterioro en el indicador. Se requieren acciones correctivas inmediatas para reducir las devoluciones y mejorar la calidad.`} Fórmula: 2025 (${variacionDevoluciones ? variacionDevoluciones.pct_2025 : 'N/A'}%) - 2024 (${variacionDevoluciones ? variacionDevoluciones.pct_2024 : 'N/A'}%) = ${totales.variacion2025vs2024}pp.`
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
          <div className="text-sm text-gray-600 mt-1">puntos porcentuales</div>
          <div className={`text-xs font-medium mt-2 ${totales.variacion2025vs2024 < 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totales.variacion2025vs2024 < 0 ? '✓ Mejora continua' : '⚠ Requiere atención'}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal(
            'Datos Mensuales Registrados',
            `Se han registrado ${totales.totalDevolucionesMensuales} datos mensuales de devoluciones a lo largo del tiempo. Este seguimiento mensual detallado permite identificar tendencias estacionales, patrones de comportamiento, picos anormales y tomar acciones correctivas oportunas. El monitoreo continuo es fundamental para mantener y mejorar la calidad del producto entregado a los clientes.`
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => openModal(
            'Devoluciones Mensuales por Sede',
            'Este gráfico muestra la evolución mensual del porcentaje de devoluciones por sede. Permite identificar tendencias, picos estacionales y comparar el desempeño entre sedes. Una tendencia descendente indica mejora en la calidad del producto y procesos de distribución.'
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200 cursor-pointer hover:border-blue-400 transition-all"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Devoluciones Mensuales por Sede (%)</h3>
            <Info className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={datosDevolucionesMes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mes" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                labelStyle={{ color: '#111827' }}
                itemStyle={{ color: '#374151' }}
                formatter={(value) => value + '%'}
              />
              <Legend />
              <Line type="monotone" dataKey="Sede 1" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="Sede 2" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="Sede 3" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

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

      {/* Tabla de Auditorías Recientes */}
      {auditorias.length > 0 && (
        <CollapsibleTable 
          title="Auditorías Recientes"
          defaultOpen={false}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-3 px-4 text-gray-700">Fecha</th>
                  <th className="text-left py-3 px-4 text-gray-700">Tipo</th>
                  <th className="text-left py-3 px-4 text-gray-700">Área/Proceso</th>
                  <th className="text-left py-3 px-4 text-gray-700">Auditor</th>
                  <th className="text-left py-3 px-4 text-gray-700">Estado</th>
                  <th className="text-right py-3 px-4 text-gray-700">Días</th>
                </tr>
              </thead>
              <tbody>
                {auditorias.slice(0, 10).map((aud, idx) => (
                  <tr key={idx} className="border-b border-gray-200/50 hover:bg-gray-100/30">
                    <td className="py-3 px-4 text-gray-900">{new Date(aud.fecha_auditoria).toLocaleDateString('es-CO')}</td>
                    <td className="py-3 px-4 text-blue-400">{aud.tipo_auditoria}</td>
                    <td className="py-3 px-4 text-gray-600">{aud.area_proceso_auditado}</td>
                    <td className="py-3 px-4 text-gray-600">{aud.auditor_responsable}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        aud.estado === 'Completada' ? 'bg-green-500/20 text-green-400' :
                        aud.estado === 'En proceso' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-600'
                      }`}>
                        {aud.estado}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">{aud.dias_desde_auditoria}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleTable>
      )}

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

