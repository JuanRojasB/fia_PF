import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, ComposedChart, ReferenceLine, LabelList } from 'recharts';
import { Package, TrendingUp, Target, X, Info, Percent, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';

export default function ComercialPolloEnteroDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  // Extraer datos de KPIs de pollo entero
  const kpisPolloEntero = data?.kpisPollo || [];
  
  if (kpisPolloEntero.length === 0) {
    return (
      <div className="bg-white/95 backdrop-blur-xl rounded-xl p-12 border border-gray-200 text-center">
        <div className="text-gray-600 text-lg">No hay datos disponibles de Pollo Entero</div>
      </div>
    );
  }

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Procesar datos por año
  const datosPorAnio = {};
  kpisPolloEntero.forEach(k => {
    const anio = k.anio;
    datosPorAnio[anio] = {
      anio,
      polloEnteroPlanta: parseInt(k.pollo_entero_planta) || 0,
      ventaLineaAsadero: parseInt(k.venta_unidad_linea_asadero) || 0,
      participacionLograda: parseFloat(k.participacion_lograda_pct) || 0,
      metaObjetivo: parseFloat(k.meta_objetivo_pct) || 50,
      puntosFaltantes: parseFloat(k.puntos_faltantes) || 0
    };
  });

  const datos2025 = datosPorAnio[2025] || { polloEnteroPlanta: 0, ventaLineaAsadero: 0, participacionLograda: 0, metaObjetivo: 50, puntosFaltantes: 0 };
  const datos2024 = datosPorAnio[2024] || { polloEnteroPlanta: 0, ventaLineaAsadero: 0, participacionLograda: 0, metaObjetivo: 50, puntosFaltantes: 0 };
  const datos2023 = datosPorAnio[2023] || { polloEnteroPlanta: 0, ventaLineaAsadero: 0, participacionLograda: 0, metaObjetivo: 50, puntosFaltantes: 0 };

  // Calcular totales
  const totalPolloPlanta = datos2025.polloEnteroPlanta + datos2024.polloEnteroPlanta + datos2023.polloEnteroPlanta;
  const totalVentaAsadero = datos2025.ventaLineaAsadero + datos2024.ventaLineaAsadero + datos2023.ventaLineaAsadero;
  const participacionPromedio = totalPolloPlanta > 0 ? ((totalVentaAsadero / totalPolloPlanta) * 100).toFixed(2) : 0;

  // Variaciones
  const variacionPlanta2025vs2024 = datos2024.polloEnteroPlanta > 0 
    ? (((datos2025.polloEnteroPlanta - datos2024.polloEnteroPlanta) / datos2024.polloEnteroPlanta) * 100).toFixed(2)
    : 0;

  const variacionVenta2025vs2024 = datos2024.ventaLineaAsadero > 0
    ? (((datos2025.ventaLineaAsadero - datos2024.ventaLineaAsadero) / datos2024.ventaLineaAsadero) * 100).toFixed(2)
    : 0;

  const mejoraParticipacion = (datos2025.participacionLograda - datos2024.participacionLograda).toFixed(2);

  // Datos para gráficas
  const datosComparativa = [
    { anio: '2023', planta: datos2023.polloEnteroPlanta, asadero: datos2023.ventaLineaAsadero, participacion: datos2023.participacionLograda },
    { anio: '2024', planta: datos2024.polloEnteroPlanta, asadero: datos2024.ventaLineaAsadero, participacion: datos2024.participacionLograda },
    { anio: '2025', planta: datos2025.polloEnteroPlanta, asadero: datos2025.ventaLineaAsadero, participacion: datos2025.participacionLograda }
  ];

  // Regresión lineal para tendencia de volumen (planta + asadero combinados)
  const calcTendencia = (datos, key) => {
    const n = datos.length;
    const sumX = datos.reduce((s, _, i) => s + i, 0);
    const sumY = datos.reduce((s, d) => s + (d[key] || 0), 0);
    const sumXY = datos.reduce((s, d, i) => s + i * (d[key] || 0), 0);
    const sumX2 = datos.reduce((s, _, i) => s + i * i, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return datos.map((d, i) => ({ ...d, tendencia: Math.round(intercept + slope * i) }));
  };

  const datosConTendenciaPlanta = calcTendencia(datosComparativa, 'planta');
  const datosConTendenciaParticipacion = calcTendencia(datosComparativa, 'participacion');

  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-6 border-2 border-orange-500/30"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-4">
          <Package className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">INGRESOS VS VENTAS - POLLOS ENTEROS</h2>
        </div>
        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
          Análisis de la participación de la línea Asadero (pollo entero) respecto al total de pollos enteros producidos en planta Fiesta. 
          En 2025 se logró una participación del {datos2025.participacionLograda}%, mejorando {mejoraParticipacion} puntos porcentuales vs 2024.
        </p>
      </motion.div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal(
            'Pollo Entero Planta 2025',
            `Total de pollos enteros producidos en planta Fiesta durante 2025: ${formatNumber(datos2025.polloEnteroPlanta)} unidades. La variación del ${variacionPlanta2025vs2024}% vs 2024 representa ${variacionPlanta2025vs2024 > 0 ? 'un incremento' : 'una reducción'} de ${formatNumber(Math.abs(datos2025.polloEnteroPlanta - datos2024.polloEnteroPlanta))} unidades. Este volumen incluye toda la producción de pollo entero de la compañía.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Producción Pollo Entero Planta 2025</span>
            <Package className="w-6 h-6 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatNumber(datos2025.polloEnteroPlanta)}</div>
          <div className={`text-xs flex items-center gap-1 ${parseFloat(variacionPlanta2025vs2024) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {parseFloat(variacionPlanta2025vs2024) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {variacionPlanta2025vs2024 > 0 ? '+' : ''}{variacionPlanta2025vs2024}% vs 2024
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal(
            'Venta Línea Asadero 2025',
            `Ventas de la línea Asadero (pollo entero) durante 2025: ${formatNumber(datos2025.ventaLineaAsadero)} unidades. La variación del ${variacionVenta2025vs2024}% vs 2024 representa ${variacionVenta2025vs2024 > 0 ? 'un crecimiento' : 'una reducción'} de ${formatNumber(Math.abs(datos2025.ventaLineaAsadero - datos2024.ventaLineaAsadero))} unidades. Esta línea es estratégica para la comercialización de pollo entero tipo asadero.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Ventas Línea Asadero 2025 (und)</span>
            <TrendingUp className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatNumber(datos2025.ventaLineaAsadero)}</div>
          <div className={`text-xs flex items-center gap-1 ${parseFloat(variacionVenta2025vs2024) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {parseFloat(variacionVenta2025vs2024) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {variacionVenta2025vs2024 > 0 ? '+' : ''}{variacionVenta2025vs2024}% vs 2024
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal(
            'Participación Lograda 2025',
            `Participación de la línea Asadero respecto al total de pollos enteros: ${datos2025.participacionLograda}%. Fórmula: (Venta Asadero ÷ Pollo Entero Planta) × 100 = (${formatNumber(datos2025.ventaLineaAsadero)} ÷ ${formatNumber(datos2025.polloEnteroPlanta)}) × 100. La mejora de ${mejoraParticipacion} puntos porcentuales vs 2024 refleja una mayor eficiencia en la comercialización de pollo entero.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Participación Asadero vs Planta 2025</span>
            <Percent className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{datos2025.participacionLograda}%</div>
          <div className={`text-xs flex items-center gap-1 ${parseFloat(mejoraParticipacion) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {parseFloat(mejoraParticipacion) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {mejoraParticipacion > 0 ? '+' : ''}{mejoraParticipacion} pts vs 2024
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal(
            'Meta vs Logrado',
            `Meta objetivo: ${datos2025.metaObjetivo}%. Participación lograda: ${datos2025.participacionLograda}%. Puntos faltantes: ${datos2025.puntosFaltantes} puntos porcentuales. La compañía se encuentra a ${datos2025.puntosFaltantes} puntos de alcanzar la meta del 50% de participación. En 2024 faltaban ${datos2024.puntosFaltantes} puntos, mostrando una mejora en el cumplimiento del objetivo estratégico.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Puntos Faltantes para Meta 50%</span>
            <Target className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{datos2025.puntosFaltantes} pts</div>
          <div className="text-xs text-purple-600">
            Meta: {datos2025.metaObjetivo}%
          </div>
        </motion.div>
      </div>


      {/* Tabla Detallada */}
      <CollapsibleTable 
        title="POLLO FIESTA S.A. - INGRESOS VS VTAS. POLLOS ENTEROS (Años 2025/2024/2023)"
        defaultOpen={false}
        totalRow={[
          { label: 'POLLO ENTERO 2025' },
          { label: `Planta: ${formatNumber(datos2025.polloEnteroPlanta)}`, color: 'text-orange-600' },
          { label: `Asadero: ${formatNumber(datos2025.ventaLineaAsadero)}`, color: 'text-blue-600' },
          { label: `Part: ${datos2025.participacionLograda}%`, color: parseFloat(mejoraParticipacion) >= 0 ? 'text-green-500' : 'text-red-500', badge: true, badgeColor: parseFloat(mejoraParticipacion) >= 0 ? 'bg-green-500' : 'bg-red-500', badgeIcon: parseFloat(mejoraParticipacion) >= 0 ? '↑' : '↓' },
        ]}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-orange-400 to-orange-500 border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 text-gray-900 font-bold">Año</th>
                <th className="text-right py-3 px-4 text-gray-900 font-bold">Pollo entero planta Fiesta</th>
                <th className="text-right py-3 px-4 text-gray-900 font-bold">Vta Un. Línea Asadero</th>
                <th className="text-right py-3 px-4 text-gray-900 font-bold">% Part.</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200/30 hover:bg-gray-100/20">
                <td className="py-2 px-4 text-gray-900 font-bold">2025</td>
                <td className="py-2 px-4 text-right text-orange-600 tabular-nums">
                  {formatNumber(datos2025.polloEnteroPlanta)}
                </td>
                <td className="py-2 px-4 text-right text-blue-600 tabular-nums">
                  {formatNumber(datos2025.ventaLineaAsadero)}
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  <span className="inline-flex items-center gap-1 text-green-600 font-bold">
                    {datos2025.participacionLograda}%
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-200/30 hover:bg-gray-100/20">
                <td className="py-2 px-4 text-gray-900 font-bold">2024</td>
                <td className="py-2 px-4 text-right text-orange-600 tabular-nums">
                  {formatNumber(datos2024.polloEnteroPlanta)}
                </td>
                <td className="py-2 px-4 text-right text-blue-600 tabular-nums">
                  {formatNumber(datos2024.ventaLineaAsadero)}
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  <span className="inline-flex items-center gap-1 text-blue-600 font-bold">
                    {datos2024.participacionLograda}%
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-200/30 hover:bg-gray-100/20">
                <td className="py-2 px-4 text-gray-900 font-bold">2023</td>
                <td className="py-2 px-4 text-right text-orange-600 tabular-nums">
                  {formatNumber(datos2023.polloEnteroPlanta)}
                </td>
                <td className="py-2 px-4 text-right text-blue-600 tabular-nums">
                  {formatNumber(datos2023.ventaLineaAsadero)}
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  <span className="inline-flex items-center gap-1 text-cyan-600 font-bold">
                    {datos2023.participacionLograda}%
                  </span>
                </td>
              </tr>
              <tr className="bg-gray-50 border-t-2 border-gray-400 font-bold">
                <td className="py-3 px-4 text-gray-900">Total general</td>
                <td className="py-3 px-4 text-right text-gray-900 tabular-nums">
                  {formatNumber(totalPolloPlanta)}
                </td>
                <td className="py-3 px-4 text-right text-gray-900 tabular-nums">
                  {formatNumber(totalVentaAsadero)}
                </td>
                <td className="py-3 px-4 text-right text-gray-900 tabular-nums">
                  {participacionPromedio}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold text-gray-900">Análisis:</span> La participación de la línea Asadero ha mostrado una tendencia positiva, pasando de 45.82% en 2023 a 49.20% en 2025, con una mejora de {mejoraParticipacion} puntos porcentuales en el último año. La compañía se encuentra a solo {datos2025.puntosFaltantes} puntos de alcanzar la meta estratégica del 50% de participación. El volumen de ventas de la línea Asadero creció {variacionVenta2025vs2024}% en 2025, mientras que la producción total de pollo entero en planta varió {variacionPlanta2025vs2024}%, lo que refleja una mayor eficiencia en la comercialización de esta línea estratégica.
          </p>
        </div>
      </CollapsibleTable>

      {/* Gráfico Comparativo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => openModal(
          'Evolución Histórica 2023-2025',
          `Análisis de la evolución de la producción y ventas de pollo entero durante los últimos 3 años. 2023: Producción ${formatNumber(datos2023.polloEnteroPlanta)}, Ventas ${formatNumber(datos2023.ventaLineaAsadero)} (${datos2023.participacionLograda}%). 2024: Producción ${formatNumber(datos2024.polloEnteroPlanta)}, Ventas ${formatNumber(datos2024.ventaLineaAsadero)} (${datos2024.participacionLograda}%). 2025: Producción ${formatNumber(datos2025.polloEnteroPlanta)}, Ventas ${formatNumber(datos2025.ventaLineaAsadero)} (${datos2025.participacionLograda}%). La tendencia muestra una mejora sostenida en la participación de la línea Asadero.\n\nLínea roja punteada: tendencia calculada por regresión lineal sobre el volumen de planta anual, indicando la dirección general del crecimiento productivo.`
        )}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200 hover:border-orange-500 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Evolución Histórica Ventas Pollo Entero 2023-2025</h3>
          <Info className="w-5 h-5 text-orange-400 animate-pulse" />
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={datosConTendenciaPlanta}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="anio" stroke="#64748b" />
            <YAxis stroke="#64748b" tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} width={60} />
            <Tooltip content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const planta = payload.find(p => p.dataKey === 'planta')?.value || 0;
                const asadero = payload.find(p => p.dataKey === 'asadero')?.value || 0;
                const tendencia = payload.find(p => p.dataKey === 'tendencia')?.value;
                const total = planta + asadero;
                const participacion = total > 0 ? ((asadero / total) * 100).toFixed(1) : 0;
                
                return (
                  <div className="bg-white border-2 border-orange-500 rounded-xl p-4 shadow-xl">
                    <p className="font-bold text-gray-900 mb-3 text-lg">Año {label}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-orange-600 font-medium">Planta:</span>
                        <span className="font-bold text-gray-900">{formatNumber(planta)} kg</span>
                      </div>
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-blue-600 font-medium">Asadero:</span>
                        <span className="font-bold text-gray-900">{formatNumber(asadero)} kg</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-gray-600 font-medium">Total:</span>
                          <span className="font-bold text-gray-900">{formatNumber(total)} kg</span>
                        </div>
                        <div className="flex justify-between items-center gap-4 mt-1">
                          <span className="text-green-600 font-medium">Participación Asadero:</span>
                          <span className="font-bold text-gray-900">{participacion}%</span>
                        </div>
                        {tendencia != null && (
                          <div className="flex justify-between items-center gap-4 mt-1">
                            <span className="text-red-500 font-medium">Tendencia Planta:</span>
                            <span className="font-bold text-red-500">{formatNumber(tendencia)} kg</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }} />
            <Legend />
            <Bar dataKey="planta" fill="#f97316" name="Pollo Entero Planta" radius={[8, 8, 0, 0]}>
              <LabelList dataKey="anio" position="top" style={{ fontSize: '11px', fontWeight: 'bold', fill: '#374151' }} />
            </Bar>
            <Bar dataKey="asadero" fill="#3b82f6" name="Línea Asadero" radius={[8, 8, 0, 0]} />
            <Line type="linear" dataKey="tendencia" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 4, fill: '#ef4444' }} name="Tendencia Planta" />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Gráfico de Participación */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        onClick={() => openModal(
          'Evolución de Participación vs Meta',
          `Seguimiento de la participación de la línea Asadero vs la meta del 50%. 2023: ${datos2023.participacionLograda}% (faltaban ${datos2023.puntosFaltantes} pts). 2024: ${datos2024.participacionLograda}% (faltaban ${datos2024.puntosFaltantes} pts). 2025: ${datos2025.participacionLograda}% (faltan ${datos2025.puntosFaltantes} pts). La tendencia es positiva, acercándose cada vez más a la meta estratégica del 50%.\n\nLínea roja punteada: tendencia calculada por regresión lineal sobre la participación anual, mostrando si el avance hacia la meta del 50% está acelerando o estancándose.`
        )}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200 hover:border-green-500 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Evolución de Participación Pollo Entero vs Meta 2025</h3>
          <Info className="w-5 h-5 text-green-400 animate-pulse" />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={datosConTendenciaParticipacion}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="anio" stroke="#64748b" />
            <YAxis stroke="#64748b" domain={[40, 55]} />
            <Tooltip content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const participacion = payload.find(p => p.dataKey === 'participacion')?.value || 0;
                const tendencia = payload.find(p => p.dataKey === 'tendencia')?.value;
                const faltante = 50 - participacion;
                
                return (
                  <div className="bg-white border-2 border-green-500 rounded-xl p-4 shadow-xl">
                    <p className="font-bold text-gray-900 mb-3 text-lg">Año {label}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-green-600 font-medium">Participación:</span>
                        <span className="font-bold text-gray-900">{participacion.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-purple-600 font-medium">Meta:</span>
                        <span className="font-bold text-gray-900">50.00%</span>
                      </div>
                      {tendencia != null && (
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-red-500 font-medium">Tendencia:</span>
                          <span className="font-bold text-red-500">{tendencia.toFixed(2)}%</span>
                        </div>
                      )}
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-gray-600 font-medium">Faltante:</span>
                          <span className={`font-bold ${faltante > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {faltante.toFixed(2)} pts
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }} />
            <Line type="monotone" dataKey="participacion" stroke="#10b981" strokeWidth={3} name="Participación Lograda" dot={{ r: 6 }} />
            <Line type="monotone" dataKey="tendencia" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 4, fill: '#ef4444' }} name="Tendencia" />
            <Line type="monotone" dataKey={() => 50} stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" name="Meta 50%" />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
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
              className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-blue-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-orange-400" />
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
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-gray-900 rounded-lg transition-colors"
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
