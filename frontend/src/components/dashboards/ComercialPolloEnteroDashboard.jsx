import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, ComposedChart, ReferenceLine, LabelList } from 'recharts';
import { Package, TrendingUp, Target, X, Info, Percent, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';
import CollapsibleChart from '../CollapsibleChart';

export default function ComercialPolloEnteroDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });

  const openModal = (title, content) => {
    setModalContent({ title, content });
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
            'Producción Pollo Entero Planta 2025 vs 2024',
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">2024</p>
                  <p className="text-xl font-bold text-gray-900">{formatNumber(datos2024.polloEnteroPlanta)} uds</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                  <p className="text-xs text-orange-600 font-semibold mb-1">2025</p>
                  <p className="text-xl font-bold text-orange-700">{formatNumber(datos2025.polloEnteroPlanta)} uds</p>
                </div>
              </div>
              <div className={`rounded-lg p-4 border ${parseFloat(variacionPlanta2025vs2024) >= 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <p className={`text-sm font-semibold mb-2 ${parseFloat(variacionPlanta2025vs2024) >= 0 ? 'text-green-800' : 'text-red-800'}`}>Variación:</p>
                <p className="text-sm text-gray-700">La producción varió <strong className={parseFloat(variacionPlanta2025vs2024) >= 0 ? 'text-green-600' : 'text-red-600'}>{variacionPlanta2025vs2024 > 0 ? '+' : ''}{variacionPlanta2025vs2024}%</strong>, representando {parseFloat(variacionPlanta2025vs2024) >= 0 ? 'un incremento' : 'una reducción'} de {formatNumber(Math.abs(datos2025.polloEnteroPlanta - datos2024.polloEnteroPlanta))} unidades.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Contexto:</p>
                <p className="text-sm text-gray-700">Este volumen incluye toda la producción de pollo entero de la compañía en planta Fiesta. El crecimiento del encasetamiento del 6.6% en 2025 impacta directamente en el volumen disponible para comercialización.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                <p className="text-sm text-gray-700">Mayor producción en planta amplía la base disponible para la línea Asadero, contribuyendo al objetivo estratégico de alcanzar el 50% de participación.</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Producción Pollo Entero Planta 2025</span>
            <Package className="w-6 h-6 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 leading-tight">{formatNumber(datos2025.polloEnteroPlanta)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{formatNumber(datos2024.polloEnteroPlanta)}</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{formatNumber(datos2025.polloEnteroPlanta)}</span></div>
            <div className={`text-sm font-bold ${parseFloat(variacionPlanta2025vs2024) >= 0 ? 'text-green-600' : 'text-red-600'}`}>Var: {variacionPlanta2025vs2024 > 0 ? '+' : ''}{variacionPlanta2025vs2024}%</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal(
            'Ventas Línea Asadero 2025 vs 2024',
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">2024</p>
                  <p className="text-xl font-bold text-gray-900">{formatNumber(datos2024.ventaLineaAsadero)} uds</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-blue-600 font-semibold mb-1">2025</p>
                  <p className="text-xl font-bold text-blue-700">{formatNumber(datos2025.ventaLineaAsadero)} uds</p>
                </div>
              </div>
              <div className={`rounded-lg p-4 border ${parseFloat(variacionVenta2025vs2024) >= 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <p className={`text-sm font-semibold mb-2 ${parseFloat(variacionVenta2025vs2024) >= 0 ? 'text-green-800' : 'text-red-800'}`}>Variación:</p>
                <p className="text-sm text-gray-700">Las ventas variaron <strong className={parseFloat(variacionVenta2025vs2024) >= 0 ? 'text-green-600' : 'text-red-600'}>{variacionVenta2025vs2024 > 0 ? '+' : ''}{variacionVenta2025vs2024}%</strong>, representando {parseFloat(variacionVenta2025vs2024) >= 0 ? 'un crecimiento' : 'una reducción'} de {formatNumber(Math.abs(datos2025.ventaLineaAsadero - datos2024.ventaLineaAsadero))} unidades.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Análisis:</p>
                <p className="text-sm text-gray-700">La línea Asadero es estratégica para la comercialización de pollo entero. Su crecimiento contribuye directamente a mejorar la participación respecto al total producido en planta, acercándose a la meta del 50%.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                <p className="text-sm text-gray-700">La participación lograda en 2025 ({datos2025.participacionLograda}%) refleja la eficiencia en la comercialización de esta línea, con solo {datos2025.puntosFaltantes} puntos para alcanzar la meta estratégica.</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Ventas Línea Asadero 2025 (und)</span>
            <TrendingUp className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 leading-tight">{formatNumber(datos2025.ventaLineaAsadero)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{formatNumber(datos2024.ventaLineaAsadero)}</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{formatNumber(datos2025.ventaLineaAsadero)}</span></div>
            <div className={`text-sm font-bold ${parseFloat(variacionVenta2025vs2024) >= 0 ? 'text-green-600' : 'text-red-600'}`}>Var: {variacionVenta2025vs2024 > 0 ? '+' : ''}{variacionVenta2025vs2024}%</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal(
            'Participación Asadero vs Planta 2025 vs 2024',
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">2024</p>
                  <p className="text-xl font-bold text-gray-900">{datos2024.participacionLograda}%</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <p className="text-xs text-green-600 font-semibold mb-1">2025</p>
                  <p className="text-xl font-bold text-green-700">{datos2025.participacionLograda}%</p>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="text-sm font-semibold text-green-800 mb-2">Fórmula y resultado:</p>
                <p className="text-sm text-gray-700">Participación = (Venta Asadero ÷ Pollo Entero Planta) × 100 = ({formatNumber(datos2025.ventaLineaAsadero)} ÷ {formatNumber(datos2025.polloEnteroPlanta)}) × 100 = <strong className="text-green-600">{datos2025.participacionLograda}%</strong></p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Análisis:</p>
                <p className="text-sm text-gray-700">La mejora de <strong>{mejoraParticipacion} puntos porcentuales</strong> vs 2024 refleja mayor eficiencia en la comercialización de pollo entero. La tendencia histórica muestra crecimiento sostenido: 45.82% (2023) → {datos2024.participacionLograda}% (2024) → {datos2025.participacionLograda}% (2025).</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                <p className="text-sm text-gray-700">Con solo {datos2025.puntosFaltantes} puntos para alcanzar la meta del 50%, la empresa está muy cerca de lograr el objetivo estratégico de comercializar la mitad de su producción de pollo entero a través del canal Asadero.</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Participación Asadero vs Planta 2025</span>
            <Percent className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 leading-tight">{datos2025.participacionLograda}%</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{datos2024.participacionLograda}%</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{datos2025.participacionLograda}%</span></div>
            <div className={`text-sm font-bold ${parseFloat(mejoraParticipacion) >= 0 ? 'text-green-600' : 'text-red-600'}`}>Var: {mejoraParticipacion > 0 ? '+' : ''}{mejoraParticipacion} pts</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal(
            'Puntos Faltantes para Meta 50%',
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Meta objetivo</p>
                  <p className="text-xl font-bold text-gray-900">{datos2025.metaObjetivo}%</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <p className="text-xs text-purple-600 font-semibold mb-1">Logrado 2025</p>
                  <p className="text-xl font-bold text-purple-700">{datos2025.participacionLograda}%</p>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="text-sm font-semibold text-purple-800 mb-2">Brecha actual:</p>
                <p className="text-sm text-gray-700">La empresa se encuentra a solo <strong className="text-purple-600">{datos2025.puntosFaltantes} puntos porcentuales</strong> de alcanzar la meta estratégica del 50% de participación.</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="text-sm font-semibold text-green-800 mb-2">Progreso histórico:</p>
                <p className="text-sm text-gray-700">En 2024 faltaban {datos2024.puntosFaltantes} puntos, mostrando una mejora de {(datos2024.puntosFaltantes - datos2025.puntosFaltantes).toFixed(2)} puntos en el cumplimiento del objetivo estratégico durante 2025.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Proyección:</p>
                <p className="text-sm text-gray-700">Manteniendo el ritmo de mejora actual, la empresa podría alcanzar la meta del 50% en el próximo ejercicio, consolidando la línea Asadero como el canal principal de comercialización de pollo entero.</p>
              </div>
            </div>
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
          { label: 'TOTAL GENERAL (2023-2025)' },
          { label: `Planta: ${formatNumber(totalPolloPlanta)}`, color: 'text-orange-600' },
          { label: `Asadero: ${formatNumber(totalVentaAsadero)}`, color: 'text-blue-600' },
          { label: `Part: ${participacionPromedio}%`, color: 'text-green-600' },
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
      <CollapsibleChart title="Evolución Histórica Ventas Pollo Entero 2023-2025" defaultOpen={false}>
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
      </CollapsibleChart>

      {/* Gráfico de Participación */}
      <CollapsibleChart title="Evolución de Participación Pollo Entero vs Meta 2025" defaultOpen={false}>
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
      </CollapsibleChart>

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
              <div className="text-gray-700 leading-relaxed overflow-y-auto flex-1 pr-2">
                {modalContent.content}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
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
