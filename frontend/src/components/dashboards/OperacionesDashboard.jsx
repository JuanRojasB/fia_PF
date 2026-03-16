import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell, PieChart, Pie, ComposedChart } from 'recharts';
import { Wrench, AlertTriangle, TrendingUp, TrendingDown, CheckCircle, XCircle, Info, X, Clock, Activity } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';
import { CustomBarTooltip } from './CustomTooltip';

export default function OperacionesDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '', table: null });

  const openModal = (title, description, table = null) => {
    setModalContent({ title, description, table });
    setModalOpen(true);
  };

  if (!data || !data.kpisTpm) {
    return <div className="text-gray-600">No hay datos disponibles</div>;
  }

  const { kpisTpm, kpisTpmDetalle, equiposOfensores, ordenesTrabajo, mantenimientoVehiculos, novedadesArquitectura, novedadesInfraestructura, novedadesDetalladas, totales } = data;

  // Obtener KPIs 2024 y 2025
  const kpi2025 = kpisTpm.find(k => k.anio === 2025) || {};
  const kpi2024 = kpisTpm.find(k => k.anio === 2024) || {};

  // Preparar datos para gráficos
  const datosOrdenesTrabajo = ordenesTrabajo.map(o => ({
    mes: o.mes_nombre?.substring(0, 3) || o.mes_num,
    mesCompleto: o.mes_nombre || `Mes ${o.mes_num}`,
    Correctivas: parseInt(o.ot_correctivas) || 0,
    Preventivas: parseInt(o.ot_preventivas) || 0,
    porcentaje: parseFloat(o.porcentaje_correctivas) || 0
  }));

  // Datos de disponibilidad mensual
  const datosDisponibilidad = kpisTpmDetalle.filter(k => k.anio === 2025).map(k => ({
    mes: k.mes_nombre?.substring(0, 3) || k.mes_num,
    mesCompleto: k.mes_nombre || `Mes ${k.mes_num}`,
    disponibilidad: parseFloat(k.disponibilidad_pct) || 0,
    oee: parseFloat(k.oee_pct) || 0,
    mttr: parseFloat(k.mttr_horas) || 0
  }));

  // Datos de novedades por área
  const datosNovedadesArea = [
    { area: 'Arquitectura', cumplimiento: 58, abiertas: novedadesArquitectura.reduce((s, n) => s + parseInt(n.abiertas || 0), 0), cerradas: novedadesArquitectura.reduce((s, n) => s + parseInt(n.cerradas || 0), 0) },
    { area: 'Mantenimiento', cumplimiento: 84, abiertas: novedadesInfraestructura.reduce((s, n) => s + parseInt(n.abiertas || 0), 0), cerradas: novedadesInfraestructura.reduce((s, n) => s + parseInt(n.cerradas || 0), 0) }
  ];

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
    return datos.map((d, i) => ({ ...d, tendencia: parseFloat((intercept + slope * i).toFixed(2)) }));
  };

  const datosOTConTend = calcTendencia(
    datosOrdenesTrabajo.map(d => ({ ...d, total: (d.Preventivas || 0) + (d.Correctivas || 0) })),
    'total'
  );

  return (
    <div className="space-y-6">
      {/* Descripción */}
      <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl p-6 border border-orange-300">
        <p className="text-gray-700">La gestión de 2025 logró cumplir los objetivos de productividad (OEE), pero enfrenta un reto con los preventivos. El descenso del MTBF y el aumento del MTTR indican que los equipos están fallando con más frecuencia y las reparaciones son más largas, por esto se acumulan 104,30 horas de paro en el año. Se requiere revisar los planes de mantenimiento preventivo para estabilizar la frecuencia de fallas de los equipos críticos.</p>
      </div>

      {/* 1. Indicadores Clave de Desempeño TPM */}
      
      {/* KPIs Visuales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal('Disponibilidad de Mantenimiento', 'La disponibilidad cayó de 97% (2024) a 95,70% (2025). Picos de eficiencia: Septiembre (98,75%) y Diciembre (98,51%) presentan los niveles de disponibilidad más altos del año, coincidiendo con los tiempos medios de reparación (MTTR) más bajos: 0,10 y 0,11 horas respectivamente. Puntos Críticos: Agosto (94,77%) y Noviembre (94,71%) muestran las caídas más significativas. En noviembre, esto impactó directamente el OEE Global, llevándolo a su punto más bajo del año (80,1%). Se requiere enfoque en mantenimiento preventivo para estabilizar estos indicadores.')}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-green-500/30 cursor-pointer hover:border-green-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">Disponibilidad Mantenimiento 2025 vs 2024</span>
            <TrendingDown className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">95,70%</div>
          <div className="text-xs text-gray-600">2025</div>
          <div className="text-xs text-orange-600 mt-1">vs 97% (2024)</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={() => openModal('OEE Global 2025', 'Se acumularon 104,30 horas de paro por mantenimiento en el año 2025. El promedio global del OEE se mantuvo en 86,4%, logrando superar la meta general del 86%. En 8 de los 12 meses se logró o superó la meta del 86%, lo que indica una gestión de mantenimiento estable. Noviembre fue el mes más bajo (80,1%) debido a problemas de disponibilidad. Los meses de septiembre y diciembre destacaron con los mejores resultados. Este logro demuestra una gestión efectiva del mantenimiento preventivo, aunque se identifican oportunidades de mejora en equipos críticos.')}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-blue-500/30 cursor-pointer hover:border-blue-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">OEE Global Planta 2025 vs Meta</span>
            <Activity className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">86,4%</div>
          <div className="text-xs text-gray-600">Meta: 86% ✓</div>
          <div className="text-xs text-green-600 mt-1">vs 84% (2024)</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal('MTBF - Tiempo Medio Entre Fallas', 'El MTBF cayó de 13,35 hrs (2024) a 10,42 hrs (2025), indicando que los equipos están fallando con más frecuencia. Este indicador para la planta de beneficio es inestable. El valor más alto se registró en abril (4,16 hrs), indicando mayor confiabilidad, mientras que en septiembre cayó a 1,77 hrs, sugiriendo una alta frecuencia de intervenciones cortas. Esta tendencia negativa requiere atención inmediata. Se requiere revisar los planes de mantenimiento preventivo para estabilizar la frecuencia de fallas de los equipos críticos, especialmente Línea de Descargue, Zona de Máquinas y Calderas, y Transferidor.')}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-red-500/30 cursor-pointer hover:border-red-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">MTBF Tiempo Entre Fallas 2025 vs 2024</span>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">10,42 hrs</div>
          <div className="text-xs text-gray-600">Tiempo entre fallas</div>
          <div className="text-xs text-red-600 mt-1">vs 13,35 hrs (2024)</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onClick={() => openModal('MTTR - Tiempo Medio de Reparación', 'El MTTR aumentó de 0,35 hrs (2024) a 0,47 hrs (2025), indicando que las reparaciones son más largas. A pesar del incremento, se observa una gestión de respuesta relativamente rápida. El promedio suele estar por debajo de 0,30 horas (18 minutos) en la mayoría de los meses. Sin embargo, meses como mayo y octubre (0,37 hrs) muestran reparaciones más complejas que castigaron la disponibilidad mensual. Los mejores tiempos se registraron en septiembre (0,10 hrs) y diciembre (0,11 hrs). El aumento del MTTR combinado con la caída del MTBF indica que los equipos fallan más seguido y tardan más en repararse, lo que impacta directamente la productividad.')}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-yellow-500/30 cursor-pointer hover:border-yellow-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">MTTR Tiempo de Reparación 2025 vs 2024</span>
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">0,47 hrs</div>
          <div className="text-xs text-gray-600">Tiempo de reparación</div>
          <div className="text-xs text-yellow-600 mt-1">vs 0,35 hrs (2024)</div>
        </motion.div>
      </div>

      {/* Tabla Detallada TPM */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl border-4 border-blue-500/30"
      >
        <CollapsibleTable
          title="1. Indicadores Clave de Desempeño TPM - Comparativa 2024-2025"
          defaultOpen={false}
          totalRow={[
            { label: 'Indicadores TPM 2025' },
            { label: 'Disponibilidad: 95,70%', color: 'text-orange-500' },
            { label: 'OEE: 86,4%', color: 'text-green-600' },
            { label: 'MTBF: 10,42 hrs', color: 'text-red-500' },
            { label: 'MTTR: 0,47 hrs', color: 'text-yellow-600' },
          ]}
        >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-3 text-gray-900 font-bold">Indicador</th>
                <th className="text-center py-3 px-3 text-gray-900 font-bold">2024</th>
                <th className="text-center py-3 px-3 text-gray-900 font-bold">2025</th>
                <th className="text-left py-3 px-3 text-gray-900 font-bold">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-3 text-gray-900 font-semibold">Disponibilidad mantenimiento</td>
                <td className="py-3 px-3 text-center text-gray-900">97%</td>
                <td className="py-3 px-3 text-center text-orange-600 font-bold">95,70%</td>
                <td className="py-3 px-3 text-gray-700 text-xs">
                  • Picos de eficiencia: Sep (98,75%) y Dic (98,51%) con MTTR más bajos (0,10 y 0,11 hrs)<br/>
                  • Puntos Críticos: Ago (94,77%) y Nov (94,71%). Nov impactó el OEE Global a 80,1%
                </td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-3 text-gray-900 font-semibold">OEE</td>
                <td className="py-3 px-3 text-center text-gray-900">84,00%</td>
                <td className="py-3 px-3 text-center text-green-600 font-bold">86,40%</td>
                <td className="py-3 px-3 text-gray-700 text-xs">
                  Se acumularon 104,30 horas de paro. Promedio global 86,4% superó meta del 86%. 8 de 12 meses cumplieron meta.
                </td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-3 text-gray-900 font-semibold">MTBF (Tiempo entre fallas)</td>
                <td className="py-3 px-3 text-center text-gray-900">13,35 hrs</td>
                <td className="py-3 px-3 text-center text-red-600 font-bold">10,42 hrs</td>
                <td className="py-3 px-3 text-gray-700 text-xs">
                  Indicador inestable. Máximo en Abr (4,16), mínimo en Sep (1,77). Alta frecuencia de fallas.
                </td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-3 text-gray-900 font-semibold">MTTR (Tiempo de reparación)</td>
                <td className="py-3 px-3 text-center text-gray-900">0,35</td>
                <td className="py-3 px-3 text-center text-orange-600 font-bold">0,47</td>
                <td className="py-3 px-3 text-gray-700 text-xs">
                  Promedio menor a 0,30 hrs (18 min). May y Oct (0,37) con reparaciones más complejas.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-yellow-50 rounded-lg p-4 border border-yellow-300">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <span className="font-semibold text-gray-900">Conclusión:</span> En 8 de los 12 meses se logró o superó la meta del 86% del OEE, lo que indica una gestión de mantenimiento estable, pero con vulnerabilidades específicas en equipos críticos. Es importante invertir en la confiabilidad de la Línea de Descargue y Calderas para evitar que impacto económico supere los $250 millones en el 2026. Se debe implementar y/o fortalecer el mantenimiento predictivo.
            </div>
          </div>
        </div>
        </CollapsibleTable>
      </motion.div>

      {/* Equipos Ofensores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={() => {
          const tableData = equiposOfensores.map(e => ({
            'Equipo': e.equipo,
            'Horas de Paro': `${e.horas_paro} hrs`,
            'Eventos': e.numero_novedades,
            'Impacto': e.impacto
          }));
          openModal('Equipos Ofensores', 'Línea de Descargue (17,32 hrs, 22 eventos) - Crítico 17% del tiempo total. Se realizó overhaul mecánico y eléctrico con buenos resultados. Zona de Máquinas y Calderas (14,15 hrs, 23 eventos) - Muy Alto 14%. Ya estabilizada con preventivo. Transferidor (10,47 hrs, 42 eventos) - Frecuencia Alarmante. Línea de Selección Linco (9,70 hrs, 17 eventos) - Se cambió cadena y accesorios. Desplumadora #1 ITA (6,78 hrs, 20 eventos) - Priorizar inspecciones en bocines y dedos. Es importante invertir en la confiabilidad de Línea de Descargue y Calderas para evitar que impacto económico supere los $250 millones en 2026.', tableData);
        }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-red-500/30 cursor-pointer hover:border-red-500 transition-all"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Equipos Críticos - 104,30 hrs de Paro</h3>
            <p className="text-sm text-gray-600 mt-1">Top 5 equipos con mayor impacto en producción 2025</p>
          </div>
          <Info className="w-6 h-6 text-gray-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-red-50 rounded-xl p-4 border-2 border-red-500/30">
            <div className="flex items-center justify-between mb-2">
              <Wrench className="w-5 h-5 text-red-600" />
              <span className="text-xs text-red-600 font-bold">CRÍTICO</span>
            </div>
            <h4 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">Línea de Descargue</h4>
            <div className="text-2xl font-bold text-gray-900 mb-1">17,32 hrs</div>
            <div className="text-xs text-gray-600">22 eventos</div>
            <div className="text-xs text-red-400 mt-1">17% del tiempo</div>
          </div>

          <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-500/30">
            <div className="flex items-center justify-between mb-2">
              <Wrench className="w-5 h-5 text-orange-600" />
              <span className="text-xs text-orange-600 font-bold">MUY ALTO</span>
            </div>
            <h4 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">Zona Máquinas y Calderas</h4>
            <div className="text-2xl font-bold text-gray-900 mb-1">14,15 hrs</div>
            <div className="text-xs text-gray-600">23 eventos</div>
            <div className="text-xs text-orange-400 mt-1">14% del tiempo</div>
          </div>

          <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-500/30">
            <div className="flex items-center justify-between mb-2">
              <Wrench className="w-5 h-5 text-yellow-600" />
              <span className="text-xs text-yellow-600 font-bold">ALARMANTE</span>
            </div>
            <h4 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">Transferidor</h4>
            <div className="text-2xl font-bold text-gray-900 mb-1">10,47 hrs</div>
            <div className="text-xs text-gray-600">42 eventos</div>
            <div className="text-xs text-yellow-400 mt-1">Frecuencia alta</div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-500/30">
            <div className="flex items-center justify-between mb-2">
              <Wrench className="w-5 h-5 text-blue-600" />
              <span className="text-xs text-blue-600 font-bold">ALTO</span>
            </div>
            <h4 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">Línea Selección Linco</h4>
            <div className="text-2xl font-bold text-gray-900 mb-1">9,70 hrs</div>
            <div className="text-xs text-gray-600">17 eventos</div>
            <div className="text-xs text-blue-400 mt-1">9% del tiempo</div>
          </div>

          <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-500/30">
            <div className="flex items-center justify-between mb-2">
              <Wrench className="w-5 h-5 text-purple-600" />
              <span className="text-xs text-purple-600 font-bold">MOD-ALTO</span>
            </div>
            <h4 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">Desplumadora #1 (ITA)</h4>
            <div className="text-2xl font-bold text-gray-900 mb-1">6,78 hrs</div>
            <div className="text-xs text-gray-600">20 eventos</div>
            <div className="text-xs text-purple-400 mt-1">7% del tiempo</div>
          </div>
        </div>
      </motion.div>

      {/* 2. Análisis de la Gestión de Órdenes de Trabajo (OT) SIESA 2025 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => {
          const tableData = ordenesTrabajo.map(o => ({
            'Mes': o.mes_nombre,
            'Correctivas': o.ot_correctivas,
            'Preventivas': o.ot_preventivas,
            'Total': o.total_ot,
            '% Correctivas': `${o.porcentaje_correctivas}%`
          }));
          openModal('Análisis Detallado de Órdenes de Trabajo', 'El 89,3% de las intervenciones totales (3.807 OT) fueron de carácter preventivo y 456 correctivas de acuerdo con reporte SIESA, lo que indica que se tiene un enfoque preventivo sólido. Meses con más correctivas: Enero (35,8%), Agosto (26%), Febrero (25,7%) y Marzo (23,7%). Estos picos pueden estar relacionados con el inicio de año y períodos de alta producción. Meses con mejor gestión preventiva: Diciembre (2%), Noviembre (3%), Junio (4,3%) y Julio (16,5%). El objetivo es mantener el porcentaje de correctivas por debajo del 15% mensual.\n\nLínea roja punteada: tendencia calculada por regresión lineal sobre el total mensual de OT, mostrando si el volumen de intervenciones está aumentando o disminuyendo en el año.', tableData);
        }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 cursor-pointer hover:border-purple-500 transition-all"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">2. Análisis de la Gestión de Órdenes de Trabajo (OT) SIESA 2025</h3>
            <p className="text-sm text-gray-600 mt-1">El 89,3% de las intervenciones totales (3.807 OT) fueron de carácter preventivo</p>
          </div>
          <Info className="w-6 h-6 text-purple-600" />
        </div>

        {/* Gráfico de Barras */}
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={datosOTConTend} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
            <XAxis 
              dataKey="mes" 
              stroke="#6b7280" 
              style={{ fontSize: '12px' }} 
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis stroke="#6b7280" style={{ fontSize: '13px' }} />
            <Tooltip content={<CustomBarTooltip borderColor="#a855f7" />} />
            <Bar dataKey="Preventivas" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Correctivas" stackId="a" fill="#ef4444" radius={[8, 8, 0, 0]} />
            <Line type="linear" dataKey="tendencia" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Tendencia Total OT" />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Tabla Detallada */}

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-3 text-gray-900 font-bold">Mes</th>
                <th className="text-right py-3 px-3 text-gray-900 font-bold">OT Correctiva</th>
                <th className="text-right py-3 px-3 text-gray-900 font-bold">OT Preventiva</th>
                <th className="text-right py-3 px-3 text-gray-900 font-bold">Total</th>
                <th className="text-right py-3 px-3 text-gray-900 font-bold">% Correctivos</th>
              </tr>
            </thead>
            <tbody>
              {ordenesTrabajo.map((mes, idx) => {
                const pct = parseFloat(mes.porcentaje_correctivas);
                return (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-3 text-gray-900 font-semibold">{mes.mes_nombre}</td>
                    <td className="py-3 px-3 text-right text-red-600 font-bold">{mes.ot_correctivas}</td>
                    <td className="py-3 px-3 text-right text-green-600">{mes.ot_preventivas}</td>
                    <td className="py-3 px-3 text-right text-gray-900 font-bold">{mes.total}</td>
                    <td className={`py-3 px-3 text-right font-bold ${pct > 15 ? 'text-red-600' : 'text-green-600'}`}>
                      {mes.porcentaje_correctivas}%
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-gray-300 bg-gray-100 font-bold">
                <td className="py-3 px-3 text-gray-900">Total general</td>
                <td className="py-3 px-3 text-right text-red-600">{totales.totalOtCorrectivas}</td>
                <td className="py-3 px-3 text-right text-green-600">{totales.totalOtPreventivas}</td>
                <td className="py-3 px-3 text-right text-gray-900">{totales.totalOt}</td>
                <td className="py-3 px-3 text-right text-gray-900">{totales.porcentajeCorrectivas}%</td>
              </tr>
            </tbody>
          </table>
      

        <div className="mt-4 bg-green-50 rounded-lg p-4 border border-green-300">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <span className="font-semibold text-gray-900">Enfoque Preventivo:</span> El 89,3% de las intervenciones totales (3.807 OT) fueron de carácter preventivo y 456 correctivas de acuerdo con reporte SIESA, lo que indica que se tiene un enfoque preventivo sólido.
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Mantenimiento de Vehículos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        onClick={() => openModal('Costos de Vehículos', 'Se observa una reducción de $166.084.545 respecto al año anterior, aunque cabe notar que los datos de diciembre 2025 aún no están contabilizados. Vehículo SPS-047 fue el vehículo con el costo más alto en el año. En el mes de abril 2025 se cambió sistema hidráulico de dirección y la caja de este sistema. Esta reducción del 46,65% representa una gestión eficiente de mantenimiento vehicular.')}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 cursor-pointer hover:border-purple-500 transition-all"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">3. Mantenimiento de Vehículos</h3>
            <p className="text-sm text-gray-600 mt-1">Reducción de $166M (-46,65%) vs 2024</p>
          </div>
          <Info className="w-6 h-6 text-purple-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mantenimientoVehiculos.map((mv, idx) => (
            <div key={idx} className={`${idx === 0 ? 'bg-orange-50 border-orange-500/30' : 'bg-green-50 border-green-500/30'} rounded-xl p-5 border-2`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`text-lg font-bold ${idx === 0 ? 'text-orange-600' : 'text-green-600'}`}>Año {mv.anio}</h4>
                {mv.variacion_pct && (
                  <div className="flex items-center gap-1">
                    <TrendingDown className="w-5 h-5 text-green-600" />
                    <span className="text-green-600 font-bold">{Math.abs(parseFloat(mv.variacion_pct)).toFixed(1)}%</span>
                  </div>
                )}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                ${parseFloat(mv.costo_total).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs text-gray-600">Costo total mantenimiento</div>
              {mv.variacion_pct && (
                <div className="mt-3 pt-3 border-t border-gray-300">
                  <div className="text-xs text-green-600 font-semibold">
                    Ahorro: ${Math.abs(parseFloat(mantenimientoVehiculos[0].costo_total) - parseFloat(mv.costo_total)).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* 4. Arquitectura - Gestión de Novedades */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        onClick={() => {
          const tableData = novedadesDetalladas.map(n => ({
            'Área': n.area,
            'Planta': n.planta,
            'Abiertas': n.abiertas,
            'Cerradas': n.cerradas,
            'Total': n.total,
            'Ejecución': `${n.ejecucion_pct}%`,
            isSubtotal: n.isSubtotal || false
          }));
          
          // Agregar fila de totales
          tableData.push({
            'Área': 'Total general',
            'Planta': '',
            'Abiertas': 237,
            'Cerradas': 564,
            'Total': 801,
            'Ejecución': '70%',
            isTotal: true
          });
          
          openModal('Novedades Correctivas', 'Cumplimiento global del 70% en la gestión de novedades correctivas reportadas por líderes de sedes. Mantenimiento presenta un desempeño del 84% (buen nivel). Arquitectura tiene 58%, principalmente impactada por la baja ejecución en Sede 1 (15%) y Sede 4 (36%). Esta área cuenta con 4 técnicos ejecutando tareas por todas las sedes. Factores: vacaciones del señor Cástulo del 2 al 20 de enero y renuncia de Edwin Torres hace 5 meses. Se solicita al área de RH resolver lo antes posible.', tableData);
        }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-300 cursor-pointer hover:border-gray-400 transition-all"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">4. Arquitectura - Gestión de Novedades</h3>
            <p className="text-sm text-gray-600 mt-1">Cumplimiento global {totales.cumplimientoGlobal}% • Arquitectura vs Mantenimiento</p>
          </div>
          <Info className="w-6 h-6 text-gray-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {datosNovedadesArea.map((area, idx) => (
            <div key={idx} className="bg-white rounded-xl p-5 border-2 border-gray-300">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-900">{area.area}</h4>
                <div className={`text-3xl font-bold ${area.cumplimiento >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                  {area.cumplimiento}%
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cerradas</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-900 font-bold">{area.cerradas}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Abiertas</span>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-gray-900 font-bold">{area.abiertas}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-300">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="text-gray-900 font-bold">{area.abiertas + area.cerradas}</span>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${area.cumplimiento >= 70 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${area.cumplimiento}%` }}
                  ></div>
                </div>
              </div>

              {/* Estado */}
              <div className={`mt-3 text-xs ${area.cumplimiento >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                {area.cumplimiento >= 70 ? '✓ Buen desempeño' : '⚠ Requiere atención'}
              </div>
            </div>
          ))}

          {/* Total General */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-500/50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-900">Total General</h4>
              <div className={`text-3xl font-bold ${totales.cumplimientoGlobal >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
                {totales.cumplimientoGlobal}%
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cerradas</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-gray-900 font-bold">{totales.totalCerradas}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Abiertas</span>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-gray-900 font-bold">{totales.totalAbiertas}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-300">
                <span className="text-sm text-gray-600">Total</span>
                <span className="text-gray-900 font-bold">{totales.totalNovedades}</span>
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${totales.cumplimientoGlobal >= 70 ? 'bg-green-500' : 'bg-orange-500'}`}
                  style={{ width: `${totales.cumplimientoGlobal}%` }}
                ></div>
              </div>
            </div>

            {/* Estado */}
            <div className={`mt-3 text-xs ${totales.cumplimientoGlobal >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
              {totales.cumplimientoGlobal >= 70 ? '✓ Meta cumplida' : '⚠ Por debajo de meta'}
            </div>
          </div>
        </div>

        {/* Alerta de Arquitectura */}
        {datosNovedadesArea.find(a => a.area === 'Arquitectura' && a.cumplimiento < 70) && (
          <div className="mt-4 bg-red-50 rounded-lg p-3 border border-red-500/30">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-red-700">
                <span className="font-semibold">Arquitectura:</span> 4 técnicos para todas las sedes. Vacaciones de Cástulo y renuncia de Edwin Torres (5 meses) afectan ejecución. Apoyo urgente de RH requerido.
              </div>
            </div>
          </div>
        )}
      </motion.div>

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
              className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-cyan-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold text-gray-900">{modalContent.title}</h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-gray-600 hover:text-gray-900 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-gray-700 leading-relaxed mb-4">{modalContent.description}</div>
              
              {/* Tabla de datos */}
              {modalContent.table && modalContent.table.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-3">Datos Detallados</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-cyan-500 to-blue-600 border-b-2 border-gray-300">
                          {Object.keys(modalContent.table[0]).filter(key => key !== 'isTotal' && key !== 'isSubtotal').map((key) => (
                            <th key={key} className="text-left py-3 px-4 text-white font-bold">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {modalContent.table.map((row, idx) => {
                          const isTotal = row.isTotal || row['Área'] === 'Total general' || row['Mes'] === 'Total general';
                          const isSubtotal = row.isSubtotal || false;
                          const keys = Object.keys(row).filter(k => k !== 'isTotal' && k !== 'isSubtotal');
                          return (
                            <tr key={idx} className={`border-b border-gray-200 ${
                              isTotal ? 'bg-white font-bold border-t-2 border-gray-900' : 
                              isSubtotal ? 'bg-cyan-400 font-bold border-t border-gray-300' :
                              idx % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'
                            }`}>
                              {Object.entries(row).filter(([key]) => key !== 'isTotal' && key !== 'isSubtotal').map(([key, value], i) => {
                                const isCorrectiva = key === 'OT Correctiva' || key === 'Correctivas';
                                const isPreventiva = key === 'OT Preventiva' || key === 'Preventivas';
                                const isPct = key === '% Correctivas';
                                const pctVal = isPct ? parseFloat(value) : 0;
                                const isEmpty = value === '' || value === null || value === undefined;
                                // Columnas de texto (Área, Planta, Mes) van a la izquierda, números a la derecha
                                const isTextColumn = key === 'Área' || key === 'Planta' || key === 'Mes';
                                const alignment = isTextColumn ? 'text-left' : 'text-right';
                                
                                return (
                                  <td key={i} className={`py-2 px-4 ${alignment} ${
                                    isTotal ? 'text-gray-900 font-bold' :
                                    isSubtotal ? 'text-gray-900 font-bold' :
                                    isCorrectiva ? 'text-red-600 font-semibold' :
                                    isPreventiva ? 'text-green-600' :
                                    isPct ? `font-bold ${pctVal > 15 ? 'text-red-600' : 'text-green-600'}` :
                                    isTextColumn ? 'text-gray-900 font-semibold' : 'text-gray-700'
                                  }`}>
                                    {isEmpty ? '' : value}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
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

