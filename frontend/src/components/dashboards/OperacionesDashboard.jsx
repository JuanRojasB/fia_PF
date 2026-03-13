import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell, PieChart, Pie } from 'recharts';
import { Wrench, AlertTriangle, TrendingUp, TrendingDown, CheckCircle, XCircle, Info, X, Clock, Activity } from 'lucide-react';

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

  const { kpisTpm, kpisTpmDetalle, equiposOfensores, ordenesTrabajo, mantenimientoVehiculos, novedadesArquitectura, novedadesInfraestructura, totales } = data;

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

  return (
    <div className="space-y-6">

      {/* KPIs Principales TPM */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal('OEE Global 2025', 'Se acumularon 104,30 horas de paro por mantenimiento en el año 2025. El promedio global del OEE se mantuvo en 86,4%, logrando superar la meta general del 86%. En 8 de los 12 meses se logró o superó la meta del 86%, lo que indica una gestión de mantenimiento estable. Noviembre fue el mes más bajo (80,1%) debido a problemas de disponibilidad.')}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">OEE Global 2025</span>
            <Activity className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">86,4%</div>
          <div className="text-xs text-gray-600">Meta: 86% ✓</div>
          <div className="text-xs text-green-400 mt-1">vs 84% (2024)</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal('Disponibilidad Mantenimiento', 'Disponibilidad cayó de 97% (2024) a 95,70% (2025). Picos de eficiencia: Septiembre (98,75%) y Diciembre (98,51%) con MTTR más bajos (0,10 y 0,11 horas). Puntos Críticos: Agosto (94,77%) y Noviembre (94,71%). En noviembre, esto impactó directamente el OEE Global, llevándolo a su punto más bajo del año (80,1%).')}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">Disponibilidad</span>
            <TrendingDown className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">95,70%</div>
          <div className="text-xs text-gray-600">2025</div>
          <div className="text-xs text-orange-400 mt-1">vs 97% (2024)</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal('MTBF - Tiempo entre Fallas', 'MTBF cayó de 13,35 hrs (2024) a 10,42 hrs (2025), indicando que los equipos están fallando con más frecuencia. Este indicador para la planta de beneficio es inestable. El valor más alto se registró en abril (4,16), indicando mayor confiabilidad, mientras que en septiembre cayó a 1,77, sugiriendo una alta frecuencia de intervenciones cortas. Se requiere revisar los planes de mantenimiento preventivo para estabilizar la frecuencia de fallas.')}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-red-500/30 hover:border-red-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">MTBF</span>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">10,42 hrs</div>
          <div className="text-xs text-gray-600">Tiempo entre fallas</div>
          <div className="text-xs text-red-400 mt-1">vs 13,35 hrs (2024)</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal('MTTR - Tiempo de Reparación', 'MTTR aumentó de 0,35 hrs (2024) a 0,47 hrs (2025), indicando que las reparaciones son más largas. Se observa una gestión de respuesta rápida. El promedio suele estar por debajo de 0,30 horas (18 minutos). Sin embargo, meses como mayo y octubre (0,37) muestran reparaciones más complejas que castigaron la disponibilidad mensual.')}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-yellow-500/30 hover:border-yellow-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">MTTR</span>
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">0,47 hrs</div>
          <div className="text-xs text-gray-600">Tiempo de reparación</div>
          <div className="text-xs text-yellow-400 mt-1">vs 0,35 hrs (2024)</div>
        </motion.div>
      </div>

      {/* Equipos Ofensores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-red-500/30"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Equipos Críticos - 104,30 hrs de Paro</h3>
            <p className="text-sm text-gray-600 mt-1">Top 5 equipos con mayor impacto en producción 2025</p>
          </div>
          <button onClick={() => {
            const tableData = equiposOfensores.map(e => ({
              'Equipo': e.equipo,
              'Horas de Paro': `${e.horas_paro} hrs`,
              'Eventos': e.numero_novedades,
              'Impacto': e.impacto
            }));
            openModal('Equipos Ofensores', 'Línea de Descargue (17,32 hrs, 22 eventos) - Crítico 17% del tiempo total. Se realizó overhaul mecánico y eléctrico con buenos resultados. Zona de Máquinas y Calderas (14,15 hrs, 23 eventos) - Muy Alto 14%. Ya estabilizada con preventivo. Transferidor (10,47 hrs, 42 eventos) - Frecuencia Alarmante. Línea de Selección Linco (9,70 hrs, 17 eventos) - Se cambió cadena y accesorios. Desplumadora #1 ITA (6,78 hrs, 20 eventos) - Priorizar inspecciones en bocines y dedos. Es importante invertir en la confiabilidad de Línea de Descargue y Calderas para evitar que impacto económico supere los $250 millones en 2026.', tableData);
          }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Info className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-xl p-4 border-2 border-red-500/30">
            <div className="flex items-center justify-between mb-2">
              <Wrench className="w-5 h-5 text-red-400" />
              <span className="text-xs text-red-400 font-bold">CRÍTICO</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-2 line-clamp-2">Línea de Descargue</h4>
            <div className="text-2xl font-bold text-white mb-1">17,32 hrs</div>
            <div className="text-xs text-gray-600">22 eventos</div>
            <div className="text-xs text-red-400 mt-1">17% del tiempo</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-xl p-4 border-2 border-orange-500/30">
            <div className="flex items-center justify-between mb-2">
              <Wrench className="w-5 h-5 text-orange-400" />
              <span className="text-xs text-orange-400 font-bold">MUY ALTO</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-2 line-clamp-2">Zona Máquinas y Calderas</h4>
            <div className="text-2xl font-bold text-white mb-1">14,15 hrs</div>
            <div className="text-xs text-gray-600">23 eventos</div>
            <div className="text-xs text-orange-400 mt-1">14% del tiempo</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-xl p-4 border-2 border-yellow-500/30">
            <div className="flex items-center justify-between mb-2">
              <Wrench className="w-5 h-5 text-yellow-400" />
              <span className="text-xs text-yellow-400 font-bold">ALARMANTE</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-2 line-clamp-2">Transferidor</h4>
            <div className="text-2xl font-bold text-white mb-1">10,47 hrs</div>
            <div className="text-xs text-gray-600">42 eventos</div>
            <div className="text-xs text-yellow-400 mt-1">Frecuencia alta</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl p-4 border-2 border-blue-500/30">
            <div className="flex items-center justify-between mb-2">
              <Wrench className="w-5 h-5 text-blue-400" />
              <span className="text-xs text-blue-400 font-bold">ALTO</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-2 line-clamp-2">Línea Selección Linco</h4>
            <div className="text-2xl font-bold text-white mb-1">9,70 hrs</div>
            <div className="text-xs text-gray-600">17 eventos</div>
            <div className="text-xs text-blue-400 mt-1">9% del tiempo</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl p-4 border-2 border-purple-500/30">
            <div className="flex items-center justify-between mb-2">
              <Wrench className="w-5 h-5 text-purple-400" />
              <span className="text-xs text-purple-400 font-bold">MOD-ALTO</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-2 line-clamp-2">Desplumadora #1 (ITA)</h4>
            <div className="text-2xl font-bold text-white mb-1">6,78 hrs</div>
            <div className="text-xs text-gray-600">20 eventos</div>
            <div className="text-xs text-purple-400 mt-1">7% del tiempo</div>
          </div>
        </div>
      </motion.div>

      {/* Gráfico de Disponibilidad y OEE Mensual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Disponibilidad y OEE Mensual 2025</h3>
            <p className="text-xs text-gray-600 mt-1">Meta OEE: 86% • Verde: Disponibilidad • Azul: OEE</p>
          </div>
          <button onClick={() => {
            const tableData = kpisTpmDetalle.map(k => ({
              'Mes': k.mes_nombre,
              'Disponibilidad': `${k.disponibilidad_pct}%`,
              'OEE': `${k.oee_pct}%`,
              'MTTR': `${k.mttr_horas} hrs`
            }));
            openModal('Evolución Mensual TPM', 'Picos de eficiencia: Septiembre (98,75%) y Diciembre (98,51%) presentan los niveles de disponibilidad más altos del año. Coinciden con los tiempos medios de reparación (MTTR) más bajos: 0,10 y 0,11 horas respectivamente. Puntos Críticos: Agosto (94,77%) y Noviembre (94,71%) muestran las caídas más significativas. En noviembre, esto impactó directamente el OEE Global, llevándolo a su punto más bajo del año (80,1%). En 8 de los 12 meses se logró o superó la meta del 86% del OEE.', tableData);
          }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Info className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={datosDisponibilidad} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="mes" 
              stroke="#9ca3af" 
              style={{ fontSize: '12px' }} 
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#9ca3af" tickFormatter={(v) => `${v}%`} style={{ fontSize: '13px' }} domain={[75, 100]} />
            <Tooltip
              contentStyle={{ 
                backgroundcolor: '#1f2937', 
                border: '2px solid #10b981', 
                borderRadius: '8px',
                fontSize: '14px',
                padding: '12px'
              }}
              labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
              itemStyle={{ color: '#374151' }}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.mesCompleto;
                }
                return label;
              }}
              formatter={(value, name) => [`${value.toFixed(2)}%`, name === 'disponibilidad' ? 'Disponibilidad' : 'OEE']}
            />
            <Line type="monotone" dataKey="disponibilidad" stroke="#10b981" strokeWidth={3} name="disponibilidad" />
            <Line type="monotone" dataKey="oee" stroke="#3b82f6" strokeWidth={3} name="oee" />
          </LineChart>
        </ResponsiveContainer>

        {/* Análisis rápido */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/30">
            <div className="text-xs text-green-400 font-semibold mb-1">MEJORES MESES</div>
            <div className="text-sm text-white">Septiembre (98,75%) y Diciembre (98,51%)</div>
          </div>
          <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/30">
            <div className="text-xs text-orange-400 font-semibold mb-1">MÁS BAJOS</div>
            <div className="text-sm text-white">Agosto (94,77%) y Noviembre (94,71%)</div>
          </div>
          <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/30">
            <div className="text-xs text-blue-400 font-semibold mb-1">CUMPLIMIENTO META</div>
            <div className="text-sm text-white">8 de 12 meses ≥ 86%</div>
          </div>
        </div>
      </motion.div>

      {/* Órdenes de Trabajo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Órdenes de Trabajo 2025 - Enfoque Preventivo</h3>
            <p className="text-xs text-gray-600 mt-1">Verde: Preventivas (3.807) • Rojo: Correctivas (456) • Total: 4.263 OT</p>
          </div>
          <button onClick={() => {
            const tableData = ordenesTrabajo.map(o => ({
              'Mes': o.mes_nombre,
              'Correctivas': o.ot_correctivas,
              'Preventivas': o.ot_preventivas,
              'Total': o.total,
              '% Correctivas': `${o.porcentaje_correctivas}%`
            }));
            openModal('Gestión de OT SIESA', 'El 89,3% de las intervenciones totales (3.807 OT) fueron de carácter preventivo y 456 correctivas de acuerdo con reporte SIESA, lo que indica que se tiene un enfoque preventivo. Meses con más correctivas: Enero (35,8%), Agosto (26%), Febrero (25,7%) y Marzo (23,7%). Meses con menos correctivas: Diciembre (2%), Noviembre (3%), Junio (4,3%).', tableData);
          }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Info className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={datosOrdenesTrabajo} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="mes" 
              stroke="#9ca3af" 
              style={{ fontSize: '12px' }} 
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#9ca3af" style={{ fontSize: '13px' }} />
            <Tooltip
              contentStyle={{ 
                backgroundcolor: '#1f2937', 
                border: '2px solid #3b82f6', 
                borderRadius: '8px',
                fontSize: '14px',
                padding: '12px',
                color: '#1f2937'
              }}
              labelStyle={{ color: '#1f2937' }}
              itemStyle={{ color: '#1f2937' }}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.mesCompleto;
                }
                return label;
              }}
            />
            <Bar dataKey="Preventivas" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Correctivas" stackId="a" fill="#ef4444" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* Análisis rápido */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/30">
            <div className="text-xs text-green-400 font-semibold mb-1">ENFOQUE PREVENTIVO</div>
            <div className="text-sm text-white">89,3% preventivas</div>
          </div>
          <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/30">
            <div className="text-xs text-red-400 font-semibold mb-1">MÁS CORRECTIVAS</div>
            <div className="text-sm text-white">Enero (35,8%), Agosto (26%)</div>
          </div>
          <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/30">
            <div className="text-xs text-blue-400 font-semibold mb-1">MEJOR GESTIÓN</div>
            <div className="text-sm text-white">Diciembre (2%), Noviembre (3%)</div>
          </div>
        </div>
      </motion.div>

      {/* Mantenimiento de Vehículos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Mantenimiento de Vehículos</h3>
            <p className="text-sm text-gray-600 mt-1">Ahorro de $166M (-46,65%) vs 2024</p>
          </div>
          <button onClick={() => openModal('Costos de Vehículos', 'Se observa una reducción de $166.084.545 respecto al año anterior, aunque cabe notar que los datos de diciembre 2025 aún no están contabilizados. Vehículo SPS-047 fue el vehículo con el costo más alto en el año. En el mes de abril 2025 se cambió sistema hidráulico de dirección y la caja de este sistema. Esta reducción del 46,65% representa una gestión eficiente de mantenimiento vehicular.')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Info className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mantenimientoVehiculos.map((mv, idx) => (
            <div key={idx} className={`bg-gradient-to-br ${idx === 0 ? 'from-orange-500/20 to-orange-600/10 border-orange-500/30' : 'from-green-500/20 to-green-600/10 border-green-500/30'} rounded-xl p-5 border-2`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`text-lg font-bold ${idx === 0 ? 'text-orange-400' : 'text-green-400'}`}>Año {mv.anio}</h4>
                {mv.variacion_pct && (
                  <div className="flex items-center gap-1">
                    <TrendingDown className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-bold">{Math.abs(parseFloat(mv.variacion_pct)).toFixed(1)}%</span>
                  </div>
                )}
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                ${(parseFloat(mv.costo_total) / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-gray-600">Costo total mantenimiento</div>
              {mv.variacion_pct && (
                <div className="mt-3 pt-3 border-t border-gray-300">
                  <div className="text-xs text-green-400">
                    Ahorro: ${((parseFloat(mantenimientoVehiculos[0].costo_total) - parseFloat(mv.costo_total)) / 1000000).toFixed(1)}M
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Gestión de Novedades */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-300"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Gestión de Novedades - Cumplimiento {totales.cumplimientoGlobal}%</h3>
            <p className="text-sm text-gray-600 mt-1">Arquitectura vs Mantenimiento por sede</p>
          </div>
          <button onClick={() => {
            const tableData = [...novedadesArquitectura, ...novedadesInfraestructura].map(n => ({
              'Área': n.planta.includes('BENEFICIO') ? 'Arquitectura' : 'Mantenimiento',
              'Planta': n.planta,
              'Abiertas': n.abiertas,
              'Cerradas': n.cerradas,
              'Total': n.total,
              'Ejecución': `${n.ejecucion_pct}%`
            }));
            openModal('Novedades Correctivas', 'Cumplimiento global del 70% en la gestión de novedades correctivas reportadas por líderes de sedes. Mantenimiento presenta un desempeño del 84% (buen nivel). Arquitectura tiene 58%, principalmente impactada por la baja ejecución en Sede 1 (15%) y Sede 4 (36%). Esta área cuenta con 4 técnicos ejecutando tareas por todas las sedes. Factores: vacaciones del señor Cástulo del 2 al 20 de enero y renuncia de Edwin Torres hace 5 meses. Se solicita al área de RH resolver lo antes posible.', tableData);
          }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Info className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {datosNovedadesArea.map((area, idx) => (
            <div key={idx} className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-5 border border-gray-300">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-white">{area.area}</h4>
                <div className={`text-3xl font-bold ${area.cumplimiento >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                  {area.cumplimiento}%
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cerradas</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white font-bold">{area.cerradas}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Abiertas</span>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span className="text-white font-bold">{area.abiertas}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-300">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="text-white font-bold">{area.abiertas + area.cerradas}</span>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="mt-4">
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${area.cumplimiento >= 70 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${area.cumplimiento}%` }}
                  ></div>
                </div>
              </div>

              {/* Estado */}
              <div className={`mt-3 text-xs ${area.cumplimiento >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                {area.cumplimiento >= 70 ? '✓ Buen desempeño' : '⚠ Requiere atención'}
              </div>
            </div>
          ))}
        </div>

        {/* Alerta de Arquitectura */}
        {datosNovedadesArea.find(a => a.area === 'Arquitectura' && a.cumplimiento < 70) && (
          <div className="mt-4 bg-red-500/10 rounded-lg p-3 border border-red-500/30">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-red-200">
                <span className="font-semibold">Arquitectura:</span> 4 técnicos para todas las sedes. Vacaciones de Cástulo y renuncia de Edwin Torres (5 meses) afectan ejecución. Apoyo urgente de RH requerido.
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Conclusiones y Recomendaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl p-5 border border-green-500/30"
        >
          <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Logros 2025
          </h4>
          <div className="space-y-2 text-sm text-gray-700">
            <div>• OEE 86.4% superó meta del 86%</div>
            <div>• 8 de 12 meses cumplieron meta</div>
            <div>• 89.3% de OT fueron preventivas</div>
            <div>• Reducción $166M en costos vehículos</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-xl p-5 border border-red-500/30"
        >
          <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Retos y Acciones
          </h4>
          <div className="space-y-2 text-sm text-gray-700">
            <div>• MTBF cayó: revisar preventivos</div>
            <div>• 104.3 hrs paro: priorizar equipos críticos</div>
            <div>• Arquitectura 58%: reforzar equipo</div>
            <div>• Implementar mantenimiento predictivo</div>
          </div>
        </motion.div>
      </div>

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
              className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-cyan-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">{modalContent.title}</h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-gray-600 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-gray-700 leading-relaxed mb-4">{modalContent.description}</div>
              
              {/* Tabla de datos */}
              {modalContent.table && modalContent.table.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-bold text-white mb-3">Datos Detallados</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-300">
                          {Object.keys(modalContent.table[0]).map((key) => (
                            <th key={key} className="text-left py-3 px-4 text-cyan-400 font-semibold">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {modalContent.table.map((row, idx) => (
                          <tr key={idx} className="border-b border-gray-300 hover:bg-gray-100/30">
                            {Object.values(row).map((value, i) => (
                              <td key={i} className="py-3 px-4 text-gray-700">
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors">
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

