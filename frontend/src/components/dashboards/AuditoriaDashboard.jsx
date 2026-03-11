import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CheckCircle, AlertTriangle, FileText, TrendingDown } from 'lucide-react';

export default function AuditoriaDashboard({ data }) {
  console.log('AuditoriaDashboard - Datos recibidos:', data);

  if (!data || typeof data !== 'object') {
    return <div className="text-gray-400">No hay datos disponibles</div>;
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
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-blue-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Auditorías</span>
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">{totales.totalAuditorias}</div>
          <div className="text-sm text-gray-400 mt-1">{totales.tiposAuditoria} tipos</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-green-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Hallazgos</span>
            <AlertTriangle className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white">{totales.totalHallazgos}</div>
          <div className="text-sm text-gray-400 mt-1">{totales.totalPlanesAccion} planes de acción</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-orange-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Devolución Promedio</span>
            <TrendingDown className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-white">{totales.promedioDevolucionGeneral}%</div>
          <div className="text-sm text-gray-400 mt-1">{totales.sedesEvaluadas} sedes</div>
          {variacionDevoluciones && (
            <div className={`text-sm mt-2 font-bold ${totales.variacion2025vs2024 < 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totales.variacion2025vs2024 < 0 ? '↓' : '↑'} {Math.abs(totales.variacion2025vs2024)}pp vs 2024
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Registros Mensuales</span>
            <CheckCircle className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white">{totales.totalDevolucionesMensuales}</div>
          <div className="text-sm text-gray-400 mt-1">Devoluciones registradas</div>
        </motion.div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Devoluciones Mensuales por Sede */}
        {datosDevolucionesMes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
          >
            <h3 className="text-xl font-bold text-white mb-6">Devoluciones Mensuales por Sede (%)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={datosDevolucionesMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="mes" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
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

        {/* Resumen Anual de Devoluciones */}
        {datosResumenAnual.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
          >
            <h3 className="text-xl font-bold text-white mb-6">Promedio Anual de Devoluciones</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosResumenAnual}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="anio" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  formatter={(value, name) => {
                    if (value === null) return ['N/A', name];
                    return [value + '%', name];
                  }}
                />
                <Legend />
                <Bar dataKey="Compañía" fill="#8b5cf6" name="Compañía" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Sede 1" fill="#3b82f6" name="Sede 1" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Sede 2" fill="#10b981" name="Sede 2" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Sede 3" fill="#f59e0b" name="Sede 3" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>

      {/* Variación 2025 vs 2024 */}
      {variacionDevoluciones && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-xl rounded-xl p-6 border border-green-500/30"
        >
          <h3 className="text-xl font-bold text-white mb-4">Análisis de Variación 2025 vs 2024</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">2025</div>
              <div className="text-2xl font-bold text-white">{variacionDevoluciones.pct_2025}%</div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">2024</div>
              <div className="text-2xl font-bold text-white">{variacionDevoluciones.pct_2024}%</div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Variación</div>
              <div className={`text-2xl font-bold ${parseFloat(variacionDevoluciones.variacion_puntos_porcentuales) < 0 ? 'text-green-400' : 'text-red-400'}`}>
                {variacionDevoluciones.variacion_puntos_porcentuales}pp
              </div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Estado</div>
              <div className={`text-lg font-bold ${variacionDevoluciones.estado_auditoria.includes('Mejora') ? 'text-green-400' : 'text-red-400'}`}>
                {variacionDevoluciones.estado_auditoria}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Auditorías por Tipo */}
      {datosTipos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-xl font-bold text-white mb-4">Auditorías por Tipo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {datosTipos.map((tipo, idx) => (
              <div key={idx} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                <div className="font-bold text-white mb-2">{tipo.tipo}</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cantidad:</span>
                    <span className="text-blue-400 font-medium">{tipo.cantidad}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Áreas:</span>
                    <span className="text-green-400 font-medium">{tipo.areas}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tabla de Auditorías Recientes */}
      {auditorias.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-xl font-bold text-white mb-4">Auditorías Recientes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-3 px-4 text-gray-300">Fecha</th>
                  <th className="text-left py-3 px-4 text-gray-300">Tipo</th>
                  <th className="text-left py-3 px-4 text-gray-300">Área/Proceso</th>
                  <th className="text-left py-3 px-4 text-gray-300">Auditor</th>
                  <th className="text-left py-3 px-4 text-gray-300">Estado</th>
                  <th className="text-right py-3 px-4 text-gray-300">Días</th>
                </tr>
              </thead>
              <tbody>
                {auditorias.slice(0, 10).map((aud, idx) => (
                  <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="py-3 px-4 text-white">{new Date(aud.fecha_auditoria).toLocaleDateString('es-CO')}</td>
                    <td className="py-3 px-4 text-blue-400">{aud.tipo_auditoria}</td>
                    <td className="py-3 px-4 text-gray-400">{aud.area_proceso_auditado}</td>
                    <td className="py-3 px-4 text-gray-400">{aud.auditor_responsable}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        aud.estado === 'Completada' ? 'bg-green-500/20 text-green-400' :
                        aud.estado === 'En proceso' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {aud.estado}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-400">{aud.dias_desde_auditoria}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
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
              className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
            >
              <h3 className="text-xl font-bold text-white mb-4">Hallazgos Recientes</h3>
              <div className="space-y-3">
                {hallazgos.slice(0, 5).map((hall, idx) => (
                  <div key={idx} className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
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
                    <p className="text-sm text-white mb-1">{hall.descripcion_hallazgo}</p>
                    <p className="text-xs text-gray-400">{hall.area_proceso_auditado}</p>
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
              className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
            >
              <h3 className="text-xl font-bold text-white mb-4">Planes de Acción</h3>
              <div className="space-y-3">
                {planesAccion.slice(0, 5).map((plan, idx) => (
                  <div key={idx} className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
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
                    <p className="text-sm text-white mb-1">{plan.accion_correctiva}</p>
                    <p className="text-xs text-gray-400">{plan.descripcion_hallazgo}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
