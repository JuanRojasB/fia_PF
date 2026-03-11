import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { TrendingUp, Users, Package, Target } from 'lucide-react';
import { useState } from 'react';
import InfoModal from '../InfoModal';

export default function ComercialResumenDashboard({ data }) {
  const [modalInfo, setModalInfo] = useState(null);

  if (!data || typeof data !== 'object') {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const {
    unidadesPorCentro = [],
    agrupaciones = [],
    totales = {}
  } = data;

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO').format(value);
  };

  const formatPercent = (value) => {
    if (!value || isNaN(value)) return '0.00%';
    return `${parseFloat(value).toFixed(2)}%`;
  };

  // Procesar datos por agrupación
  const agrupacionesPorAnio = unidadesPorCentro.reduce((acc, item) => {
    const nombre = item.centro_operacion;
    if (!acc[nombre]) {
      acc[nombre] = { nombre, und2024: 0, und2025: 0, part2024: 0, part2025: 0 };
    }
    if (item.anio === 2024) {
      acc[nombre].und2024 = parseInt(item.unidades) || 0;
    }
    if (item.anio === 2025) {
      acc[nombre].und2025 = parseInt(item.unidades) || 0;
    }
    return acc;
  }, {});

  const datosAgrupaciones = Object.values(agrupacionesPorAnio);

  // Calcular totales
  const total2024 = datosAgrupaciones.reduce((sum, a) => sum + a.und2024, 0);
  const total2025 = datosAgrupaciones.reduce((sum, a) => sum + a.und2025, 0);
  const variacionTotal = total2024 > 0 ? (((total2025 - total2024) / total2024) * 100) : 0;

  // Calcular participaciones
  datosAgrupaciones.forEach(ag => {
    ag.part2024 = total2024 > 0 ? ((ag.und2024 / total2024) * 100) : 0;
    ag.part2025 = total2025 > 0 ? ((ag.und2025 / total2025) * 100) : 0;
    ag.variacion = ag.und2024 > 0 ? (((ag.und2025 - ag.und2024) / ag.und2024) * 100) : 0;
    ag.varPart = ag.part2025 - ag.part2024;
  });

  // Ordenar por unidades 2025
  datosAgrupaciones.sort((a, b) => b.und2025 - a.und2025);

  // Datos para gráfica de participación (solo 2025)
  const datosParticipacion = datosAgrupaciones.map(ag => ({
    nombre: ag.nombre,
    participacion: ag.part2025
  }));

  // Datos para gráfica comparativa
  const datosComparativa = datosAgrupaciones.map(ag => ({
    nombre: ag.nombre.length > 15 ? ag.nombre.substring(0, 15) + '...' : ag.nombre,
    '2024': ag.und2024,
    '2025': ag.und2025
  }));

  // Top 3 agrupaciones
  const top3 = datosAgrupaciones.slice(0, 3);

  // Colores para gráficas
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const showModal = (title, content) => {
    setModalInfo({ title, content });
  };

  const closeModal = () => {
    setModalInfo(null);
  };

  return (
    <div className="space-y-6">
      {/* Modal Reutilizable */}
      <InfoModal
        isOpen={!!modalInfo}
        onClose={closeModal}
        title={modalInfo?.title || ''}
        content={modalInfo?.content || ''}
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-xl rounded-xl p-6 border border-blue-500/30 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => showModal(
            'Total Unidades 2025',
            `${formatNumber(total2025)} unidades procesadas en el año 2025 por todas las agrupaciones comerciales.\n\nEste indicador representa el volumen total de unidades gestionadas por el equipo comercial de Pollo Fiesta durante el año 2025.\n\nComparativa con 2024:\n• 2024: ${formatNumber(total2024)} unidades\n• 2025: ${formatNumber(total2025)} unidades\n• Variación: ${variacionTotal > 0 ? '+' : ''}${variacionTotal.toFixed(2)}%\n\nEl ${variacionTotal >= 0 ? 'crecimiento' : 'decrecimiento'} refleja la dinámica del mercado y la efectividad de las estrategias comerciales implementadas.`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm font-medium">Total Unidades 2025</span>
            <Package className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">{formatNumber(total2025)}</div>
          <div className="text-sm text-gray-400 mt-1">unidades procesadas</div>
          <div className={`text-sm mt-2 font-semibold ${variacionTotal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {variacionTotal > 0 ? '↑' : '↓'} {Math.abs(variacionTotal).toFixed(2)}% vs 2024
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-xl rounded-xl p-6 border border-green-500/30 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => showModal(
            'Agrupaciones Activas',
            `${datosAgrupaciones.length} agrupaciones comerciales operativas en el sistema.\n\nCada agrupación representa un canal de distribución estratégico que atiende diferentes segmentos del mercado:\n\n${datosAgrupaciones.map((a, i) => `${i + 1}. ${a.nombre}\n   • Unidades 2025: ${formatNumber(a.und2025)}\n   • Participación: ${a.part2025.toFixed(2)}%\n   • Variación vs 2024: ${a.variacion > 0 ? '+' : ''}${a.variacion.toFixed(2)}%`).join('\n\n')}\n\nLa diversificación de canales permite optimizar la cobertura de mercado y reducir riesgos operativos.`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm font-medium">Agrupaciones Activas</span>
            <Users className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white">{datosAgrupaciones.length}</div>
          <div className="text-sm text-gray-400 mt-1">canales comerciales</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => showModal(
            'Líder del Año',
            `🏆 Agrupación con mayor volumen de unidades procesadas en 2025.\n\nLíder: ${top3[0]?.nombre}\n\nEsta agrupación lidera el mercado con ${formatNumber(top3[0]?.und2025)} unidades procesadas, representando el ${top3[0]?.part2025.toFixed(2)}% del volumen total de la compañía.\n\n📊 Desempeño 2025:\n• Unidades procesadas: ${formatNumber(top3[0]?.und2025)}\n• Participación de mercado: ${top3[0]?.part2025.toFixed(2)}%\n• Variación vs 2024: ${top3[0]?.variacion > 0 ? '+' : ''}${top3[0]?.variacion.toFixed(2)}%\n\n💡 Importancia Estratégica:\nEl liderazgo de esta agrupación es fundamental para la estabilidad operativa y financiera de la compañía, concentrando casi la mitad del volumen total de negocio.`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm font-medium">Líder del Año</span>
            <Target className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{top3[0]?.nombre || 'N/A'}</div>
          <div className="text-sm text-gray-400 mt-1">{formatNumber(top3[0]?.und2025)} und</div>
          <div className="text-sm mt-2 text-purple-400 font-semibold">
            {top3[0]?.part2025.toFixed(2)}% participación
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 backdrop-blur-xl rounded-xl p-6 border border-orange-500/30 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => showModal(
            'Mayor Crecimiento',
            `📈 Agrupación con mayor crecimiento porcentual 2025 vs 2024.\n\nDestacado: ${datosAgrupaciones.sort((a, b) => b.variacion - a.variacion)[0]?.nombre}\n\nEsta agrupación muestra el mejor desempeño relativo con un crecimiento de ${datosAgrupaciones.sort((a, b) => b.variacion - a.variacion)[0]?.variacion.toFixed(2)}% respecto al año anterior.\n\n📊 Análisis de Crecimiento:\n• Unidades 2024: ${formatNumber(datosAgrupaciones.sort((a, b) => b.variacion - a.variacion)[0]?.und2024)}\n• Unidades 2025: ${formatNumber(datosAgrupaciones.sort((a, b) => b.variacion - a.variacion)[0]?.und2025)}\n• Incremento: +${formatNumber(datosAgrupaciones.sort((a, b) => b.variacion - a.variacion)[0]?.und2025 - datosAgrupaciones.sort((a, b) => b.variacion - a.variacion)[0]?.und2024)} unidades\n• Tasa de crecimiento: +${datosAgrupaciones.sort((a, b) => b.variacion - a.variacion)[0]?.variacion.toFixed(2)}%\n\n✅ Este crecimiento indica una expansión exitosa del canal y efectividad en las estrategias comerciales implementadas.`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm font-medium">Mayor Crecimiento</span>
            <TrendingUp className="w-6 h-6 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {datosAgrupaciones.sort((a, b) => b.variacion - a.variacion)[0]?.nombre || 'N/A'}
          </div>
          <div className="text-sm text-gray-400 mt-1">mejor desempeño</div>
          <div className="text-sm mt-2 text-orange-400 font-semibold">
            +{datosAgrupaciones.sort((a, b) => b.variacion - a.variacion)[0]?.variacion.toFixed(2)}% vs 2024
          </div>
        </motion.div>
      </div>

      {/* Tabla Comparativa */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <h3 className="text-xl font-bold text-white mb-4">Comparativa por Agrupación 2024 vs 2025</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-gray-300 font-semibold">AGRUPACIÓN</th>
                <th className="text-right py-3 px-4 text-gray-300 font-semibold">Und. 2025</th>
                <th className="text-right py-3 px-4 text-gray-300 font-semibold">% Part</th>
                <th className="text-right py-3 px-4 text-gray-300 font-semibold">Und. 2024</th>
                <th className="text-right py-3 px-4 text-gray-300 font-semibold">% Part</th>
                <th className="text-right py-3 px-4 text-gray-300 font-semibold">Variación</th>
                <th className="text-right py-3 px-4 text-gray-300 font-semibold">Var %</th>
              </tr>
            </thead>
            <tbody>
              {datosAgrupaciones.map((ag, idx) => (
                <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 px-4 text-white font-medium">{ag.nombre}</td>
                  <td className="py-3 px-4 text-right text-blue-400 font-semibold">{formatNumber(ag.und2025)}</td>
                  <td className="py-3 px-4 text-right text-gray-300">{ag.part2025.toFixed(2)}%</td>
                  <td className="py-3 px-4 text-right text-gray-400">{formatNumber(ag.und2024)}</td>
                  <td className="py-3 px-4 text-right text-gray-400">{ag.part2024.toFixed(2)}%</td>
                  <td className="py-3 px-4 text-right text-white">{formatNumber(ag.und2025 - ag.und2024)}</td>
                  <td className={`py-3 px-4 text-right font-semibold ${ag.variacion >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {ag.variacion > 0 ? '↑' : ag.variacion < 0 ? '↓' : '='} {Math.abs(ag.variacion).toFixed(2)}%
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-slate-600 bg-slate-700/50">
                <td className="py-3 px-4 text-white font-bold">TOTAL</td>
                <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatNumber(total2025)}</td>
                <td className="py-3 px-4 text-right text-gray-300 font-bold">100.00%</td>
                <td className="py-3 px-4 text-right text-gray-400 font-bold">{formatNumber(total2024)}</td>
                <td className="py-3 px-4 text-right text-gray-400 font-bold">100.00%</td>
                <td className="py-3 px-4 text-right text-white font-bold">{formatNumber(total2025 - total2024)}</td>
                <td className={`py-3 px-4 text-right font-bold ${variacionTotal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {variacionTotal > 0 ? '↑' : '↓'} {Math.abs(variacionTotal).toFixed(2)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Gráfica 1: Participación por Agrupación 2025 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <h3 className="text-xl font-bold text-white mb-4">Participación por Agrupación 2025</h3>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={datosParticipacion}
                dataKey="participacion"
                nameKey="nombre"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={false}
                onClick={(data) => {
                  if (data && data.nombre) {
                    const agData = datosAgrupaciones.find(a => a.nombre === data.nombre);
                    if (agData) {
                      showModal(
                        `${agData.nombre} - Análisis de Participación 2025`,
                        `📊 Participación en el mercado: ${agData.part2025.toFixed(2)}%\n\nEsta agrupación procesó ${formatNumber(agData.und2025)} unidades durante 2025, representando ${agData.part2025.toFixed(2)}% del volumen total de la compañía.\n\n📈 Comparativa Anual:\n• Unidades 2024: ${formatNumber(agData.und2024)}\n• Unidades 2025: ${formatNumber(agData.und2025)}\n• Diferencia: ${agData.variacion > 0 ? '+' : ''}${formatNumber(agData.und2025 - agData.und2024)} unidades\n• Variación: ${agData.variacion > 0 ? '+' : ''}${agData.variacion.toFixed(2)}%\n\n🎯 Evolución de Participación:\n• Participación 2024: ${agData.part2024.toFixed(2)}%\n• Participación 2025: ${agData.part2025.toFixed(2)}%\n• Cambio: ${agData.varPart > 0 ? '+' : ''}${agData.varPart.toFixed(2)} puntos porcentuales\n\n${agData.variacion >= 0 ? '✅ Esta agrupación muestra un desempeño positivo, contribuyendo al crecimiento general de la compañía.' : '⚠️ Esta agrupación presenta una disminución que requiere análisis de las causas y estrategias de recuperación.'}`
                      );
                    }
                  }
                }}
                cursor="pointer"
              >
                {datosParticipacion.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                formatter={(value, name) => [`${value.toFixed(2)}%`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Leyenda personalizada al lado derecho */}
          <div className="flex flex-col gap-3 lg:min-w-[280px]">
            {datosParticipacion.map((entry, index) => {
              const agData = datosAgrupaciones.find(a => a.nombre === entry.nombre);
              return (
                <div 
                  key={index} 
                  className="flex items-center gap-3 bg-slate-700/30 rounded-lg p-3 hover:bg-slate-700/50 transition-colors cursor-pointer"
                  onClick={() => {
                    if (agData) {
                      showModal(
                        `${agData.nombre} - Análisis de Participación 2025`,
                        `📊 Participación en el mercado: ${agData.part2025.toFixed(2)}%\n\nEsta agrupación procesó ${formatNumber(agData.und2025)} unidades durante 2025, representando ${agData.part2025.toFixed(2)}% del volumen total de la compañía.\n\n📈 Comparativa Anual:\n• Unidades 2024: ${formatNumber(agData.und2024)}\n• Unidades 2025: ${formatNumber(agData.und2025)}\n• Diferencia: ${agData.variacion > 0 ? '+' : ''}${formatNumber(agData.und2025 - agData.und2024)} unidades\n• Variación: ${agData.variacion > 0 ? '+' : ''}${agData.variacion.toFixed(2)}%\n\n🎯 Evolución de Participación:\n• Participación 2024: ${agData.part2024.toFixed(2)}%\n• Participación 2025: ${agData.part2025.toFixed(2)}%\n• Cambio: ${agData.varPart > 0 ? '+' : ''}${agData.varPart.toFixed(2)} puntos porcentuales\n\n${agData.variacion >= 0 ? '✅ Esta agrupación muestra un desempeño positivo, contribuyendo al crecimiento general de la compañía.' : '⚠️ Esta agrupación presenta una disminución que requiere análisis de las causas y estrategias de recuperación.'}`
                      );
                    }
                  }}
                >
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div className="flex-1">
                    <div className="text-white font-semibold text-sm">{entry.nombre}</div>
                    <div className="text-gray-400 text-xs">{formatNumber(agData?.und2025)} und</div>
                  </div>
                  <div className="text-white font-bold text-lg">{entry.participacion.toFixed(1)}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Gráfica 2: Comparativa 2024 vs 2025 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <h3 className="text-xl font-bold text-white mb-4">Unidades Procesadas 2024 vs 2025</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
            data={datosComparativa}
            onClick={(data) => {
              if (data && data.activePayload) {
                const agrupacion = data.activePayload[0].payload.nombre;
                const agData = datosAgrupaciones.find(a => a.nombre.startsWith(agrupacion));
                if (agData) {
                  showModal(
                    `${agData.nombre} - Comparativa 2024 vs 2025`,
                    `📊 Análisis Comparativo de Unidades Procesadas\n\nEsta gráfica muestra la evolución del volumen de unidades procesadas por ${agData.nombre} entre 2024 y 2025.\n\n📈 Datos Anuales:\n• Unidades 2024: ${formatNumber(agData.und2024)}\n• Unidades 2025: ${formatNumber(agData.und2025)}\n\n📉 Variación:\n• Diferencia absoluta: ${agData.variacion > 0 ? '+' : ''}${formatNumber(agData.und2025 - agData.und2024)} unidades\n• Variación porcentual: ${agData.variacion > 0 ? '+' : ''}${agData.variacion.toFixed(2)}%\n\n🎯 Participación de Mercado:\n• Participación 2024: ${agData.part2024.toFixed(2)}%\n• Participación 2025: ${agData.part2025.toFixed(2)}%\n• Cambio: ${agData.varPart > 0 ? '+' : ''}${agData.varPart.toFixed(2)} puntos porcentuales\n\n💡 Interpretación:\n${agData.variacion >= 0 ? `El crecimiento de ${agData.variacion.toFixed(2)}% indica una expansión exitosa del canal. Este resultado positivo refleja la efectividad de las estrategias comerciales y la demanda del mercado.` : `La disminución de ${Math.abs(agData.variacion).toFixed(2)}% requiere atención. Es importante analizar las causas (competencia, cambios de mercado, problemas operativos) y desarrollar estrategias de recuperación.`}`
                  );
                }
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="nombre" 
              stroke="#9ca3af" 
              angle={0} 
              textAnchor="middle" 
              height={60}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#9ca3af" 
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                return value;
              }} 
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
              formatter={(value) => formatNumber(value) + ' und'}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="rect"
            />
            <Bar dataKey="2024" fill="#6366f1" name="2024" radius={[8, 8, 0, 0]} cursor="pointer" />
            <Bar dataKey="2025" fill="#10b981" name="2025" radius={[8, 8, 0, 0]} cursor="pointer" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Gráfica 3: Variación Porcentual por Agrupación */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <h3 className="text-xl font-bold text-white mb-4">Variación Porcentual 2025 vs 2024</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
            data={datosAgrupaciones} 
            layout="vertical"
            onClick={(data) => {
              if (data && data.activePayload) {
                const agData = data.activePayload[0].payload;
                showModal(
                  `${agData.nombre} - Análisis de Variación`,
                  `📊 Variación Porcentual 2025 vs 2024: ${agData.variacion > 0 ? '+' : ''}${agData.variacion.toFixed(2)}%\n\nEsta gráfica muestra el crecimiento o decrecimiento relativo de cada agrupación comercial.\n\n📈 Datos de ${agData.nombre}:\n• Unidades 2024: ${formatNumber(agData.und2024)}\n• Unidades 2025: ${formatNumber(agData.und2025)}\n• Diferencia: ${agData.variacion > 0 ? '+' : ''}${formatNumber(agData.und2025 - agData.und2024)} unidades\n• Tasa de variación: ${agData.variacion > 0 ? '+' : ''}${agData.variacion.toFixed(2)}%\n\n🎯 Impacto en Participación:\n• Participación 2024: ${agData.part2024.toFixed(2)}%\n• Participación 2025: ${agData.part2025.toFixed(2)}%\n• Cambio: ${agData.varPart > 0 ? '+' : ''}${agData.varPart.toFixed(2)} puntos porcentuales\n\n💡 Análisis:\n${agData.variacion >= 0 ? `✅ Crecimiento positivo de ${agData.variacion.toFixed(2)}%. Esta agrupación está expandiéndose exitosamente, lo que indica buena aceptación del mercado y efectividad en la ejecución comercial.` : `⚠️ Decrecimiento de ${Math.abs(agData.variacion).toFixed(2)}%. Se recomienda:\n• Analizar causas raíz (competencia, precios, servicio)\n• Revisar estrategias comerciales\n• Evaluar satisfacción de clientes\n• Implementar planes de acción correctivos`}`
                );
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9ca3af" tickFormatter={(value) => `${value.toFixed(0)}%`} />
            <YAxis type="category" dataKey="nombre" stroke="#9ca3af" width={150} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
              formatter={(value) => `${value.toFixed(2)}%`}
            />
            <Bar dataKey="variacion" radius={[0, 8, 8, 0]} cursor="pointer">
              {datosAgrupaciones.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.variacion >= 0 ? '#10b981' : '#ef4444'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
