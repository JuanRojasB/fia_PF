import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';
import { Egg, TrendingDown, DollarSign, X, Info, AlertTriangle, Package } from 'lucide-react';
import { formatCurrencyFull } from './CustomTooltip';
import CollapsibleChart from '../CollapsibleChart';
import KpiCard from '../KpiCard';
import { formatCOPShort } from '../../utils/formatCurrency';

export default function ComercialHuevoDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  };

  // Extraer datos de ventas de huevo
  const ventasHuevo = data?.ventasHuevo || [];
  
  if (ventasHuevo.length === 0) {
    return (
      <div className="bg-white/95 backdrop-blur-xl rounded-xl p-12 border border-gray-200 text-center">
        <div className="text-gray-600 text-lg">No hay datos disponibles de Ventas de Huevo</div>
      </div>
    );
  }

  const formatCurrency = formatCOPShort;

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Ordenar por año descendente
  const datosOrdenados = [...ventasHuevo].sort((a, b) => b.anio - a.anio);
  
  // Datos del año más reciente (2025)
  const datos2025 = datosOrdenados.find(v => v.anio === 2025) || {};
  const datos2024 = datosOrdenados.find(v => v.anio === 2024) || {};
  const datos2023 = datosOrdenados.find(v => v.anio === 2023) || {};

  // Calcular variaciones
  const varUnidades2025vs2024 = datos2024.unidades_vendidas > 0 
    ? (((datos2025.unidades_vendidas - datos2024.unidades_vendidas) / datos2024.unidades_vendidas) * 100).toFixed(2)
    : 0;
  
  const varPrecio2025vs2024 = datos2024.precio_promedio_unidad > 0
    ? (((datos2025.precio_promedio_unidad - datos2024.precio_promedio_unidad) / datos2024.precio_promedio_unidad) * 100).toFixed(2)
    : 0;

  const varPrecio3años = datos2023.precio_promedio_unidad > 0
    ? (((datos2025.precio_promedio_unidad - datos2023.precio_promedio_unidad) / datos2023.precio_promedio_unidad) * 100).toFixed(2)
    : 0;

  const varIngresos = datos2024.ingresos_totales_calculados > 0
    ? (((datos2025.ingresos_totales_calculados - datos2024.ingresos_totales_calculados) / datos2024.ingresos_totales_calculados) * 100).toFixed(2)
    : 0;

  // Regresión lineal para tendencia de precio
  const calcTendenciaPrecio = (datos, key) => {
    const n = datos.length;
    const sumX = datos.reduce((s, _, i) => s + i, 0);
    const sumY = datos.reduce((s, d) => s + (d[key] || 0), 0);
    const sumXY = datos.reduce((s, d, i) => s + i * (d[key] || 0), 0);
    const sumX2 = datos.reduce((s, _, i) => s + i * i, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return datos.map((d, i) => ({ ...d, tendenciaPrecio: Math.round(intercept + slope * i) }));
  };

  // Preparar datos para el gráfico
  const datosOrdenadosAsc = datosOrdenados.reverse();
  const datosGraficoBase = datosOrdenadosAsc.map((v, idx) => {
    const prev = datosOrdenadosAsc[idx - 1];
    const ingresosActual = parseFloat(v.ingresos_totales_calculados) || 0;
    const ingresosPrev = prev ? (parseFloat(prev.ingresos_totales_calculados) || 0) : 0;
    const varVentas = ingresosPrev > 0
      ? (((ingresosActual - ingresosPrev) / ingresosPrev) * 100).toFixed(2)
      : null;
    return {
      año: v.anio.toString(),
      unidades: parseInt(v.unidades_vendidas),
      precio: parseInt(v.precio_promedio_unidad),
      ingresos: ingresosActual,
      varVentas
    };
  });

  const datosGrafico = calcTendenciaPrecio(datosGraficoBase, 'precio');

  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-xl p-6 border-2 border-yellow-500/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <Egg className="w-8 h-8 text-yellow-600" />
          <h2 className="text-3xl font-bold text-gray-900">VENTAS DE HUEVO (AÑOS 2025/24/23)</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          Nuestra unidad de negocio de huevo con producción de la raza Hy-Line Brown. 
          En 2025 se vendieron {formatNumber(datos2025.unidades_vendidas)} unidades a un precio promedio de {formatCurrency(datos2025.precio_promedio_unidad)}, 
          mostrando una caída del precio del {Math.abs(varPrecio3años)}% en 3 años, indicando presión por mayor competencia.
        </p>
      </motion.div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal(
            'Unidades Vendidas Huevo 2025 vs 2024',
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">2024</p>
                  <p className="text-xl font-bold text-gray-900">{formatNumber(datos2024.unidades_vendidas)} uds</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-blue-600 font-semibold mb-1">2025</p>
                  <p className="text-xl font-bold text-blue-700">{formatNumber(datos2025.unidades_vendidas)} uds</p>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Variación:</p>
                <p className="text-sm text-gray-700">El volumen varió <strong className={parseFloat(varUnidades2025vs2024) >= 0 ? 'text-green-600' : 'text-red-600'}>{parseFloat(varUnidades2025vs2024) >= 0 ? '+' : ''}{varUnidades2025vs2024}%</strong> respecto a 2024. En 2024 se logró el máximo volumen del periodo con {formatNumber(datos2024.unidades_vendidas)} unidades.</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="text-sm font-semibold text-green-800 mb-2">Análisis:</p>
                <p className="text-sm text-gray-700">El comportamiento del volumen sugiere estabilidad general en la demanda, con fluctuaciones dentro de un rango estrecho. La unidad de negocio de huevo opera con producción de la raza Hy-Line Brown.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                <p className="text-sm text-gray-700">La estabilidad en volumen indica una demanda consolidada, aunque la presión en precios (-{Math.abs(varPrecio3años)}% en 3 años) impacta los ingresos totales del canal.</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Unidades Huevo Vendidas 2025</span>
            <Package className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatNumber(datos2025.unidades_vendidas)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{formatNumber(datos2024.unidades_vendidas)}</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{formatNumber(datos2025.unidades_vendidas)}</span></div>
            <div className={`text-sm font-bold ${parseFloat(varUnidades2025vs2024) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Var: {parseFloat(varUnidades2025vs2024) >= 0 ? '+' : ''}{varUnidades2025vs2024}%
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal(
            'Precio Promedio por Unidad Huevo 2025 vs 2024',
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">2024</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrencyFull(datos2024.precio_promedio_unidad)}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                  <p className="text-xs text-red-600 font-semibold mb-1">2025</p>
                  <p className="text-xl font-bold text-red-700">{formatCurrencyFull(datos2025.precio_promedio_unidad)}</p>
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-300">
                <p className="text-sm font-semibold text-red-800 mb-2">Tendencia descendente:</p>
                <p className="text-sm text-gray-700">El precio presenta una caída acumulada del <strong className="text-red-600">{Math.abs(varPrecio3años)}%</strong> en tres años (2023-2025), pasando de {formatCurrencyFull(datos2023.precio_promedio_unidad)} a {formatCurrencyFull(datos2025.precio_promedio_unidad)}.</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-300">
                <p className="text-sm font-semibold text-yellow-800 mb-2">Causas:</p>
                <p className="text-sm text-gray-700">La tendencia descendente indica presión en márgenes por mayor competencia en el mercado avícola. Mientras el volumen se mantiene estable, la disminución del precio promedio comprime los ingresos.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="text-sm font-semibold text-purple-800 mb-2">Estrategia:</p>
                <p className="text-sm text-gray-700">Se han adoptado estrategias de ajuste gradual de precios y segmentación de clientes para mitigar el impacto de la presión competitiva en el canal de huevo.</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-red-500/30 hover:border-red-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Precio Promedio/Unidad Huevo 2025</span>
            <TrendingDown className="w-6 h-6 text-red-400" />
          </div>
          <div className="text-xl font-bold text-gray-900 mb-1 break-all">{formatCurrencyFull(datos2025.precio_promedio_unidad)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{formatCurrencyFull(datos2024.precio_promedio_unidad)}</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{formatCurrencyFull(datos2025.precio_promedio_unidad)}</span></div>
            <div className="text-sm font-bold text-red-600">Var: {varPrecio2025vs2024}%</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal(
            'Ingresos Totales Huevo 2025 vs 2024',
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">2024</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrencyFull(datos2024.ingresos_totales_calculados)}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <p className="text-xs text-green-600 font-semibold mb-1">2025</p>
                  <p className="text-xl font-bold text-green-700">{formatCurrencyFull(datos2025.ingresos_totales_calculados)}</p>
                </div>
              </div>
              <div className={`rounded-lg p-4 border ${parseFloat(varIngresos) >= 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <p className={`text-sm font-semibold mb-2 ${parseFloat(varIngresos) >= 0 ? 'text-green-800' : 'text-red-800'}`}>Variación:</p>
                <p className="text-sm text-gray-700">Los ingresos variaron <strong className={parseFloat(varIngresos) >= 0 ? 'text-green-600' : 'text-red-600'}>{parseFloat(varIngresos) >= 0 ? '+' : ''}{varIngresos}%</strong> respecto a 2024.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Análisis:</p>
                <p className="text-sm text-gray-700">Aunque la demanda se mantiene sólida, los ingresos se ven afectados por la caída continua en precios (-{Math.abs(varPrecio3años)}% en 3 años). El volumen estable no logra compensar la presión de precios.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                <p className="text-sm text-gray-700">La combinación de volumen estable con precios decrecientes genera una tendencia de ingresos a la baja, requiriendo estrategias de diferenciación y segmentación para recuperar márgenes.</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Ingresos Huevo 2025</span>
            <DollarSign className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-xl font-bold text-gray-900 mb-1 break-all">{formatCurrencyFull(datos2025.ingresos_totales_calculados)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{formatCurrencyFull(datos2024.ingresos_totales_calculados)}</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{formatCurrencyFull(datos2025.ingresos_totales_calculados)}</span></div>
            <div className={`text-sm font-bold ${parseFloat(varIngresos) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Var: {parseFloat(varIngresos) >= 0 ? '+' : ''}{varIngresos}%
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal(
            'Caída de Precio Huevo 2023 → 2025',
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
                  <p className="text-xs text-gray-600 mb-1">2023</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrencyFull(datos2023.precio_promedio_unidad)}</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200 text-center">
                  <p className="text-xs text-yellow-600 mb-1">2024</p>
                  <p className="text-lg font-bold text-yellow-700">{formatCurrencyFull(datos2024.precio_promedio_unidad)}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 border border-red-200 text-center">
                  <p className="text-xs text-red-600 font-semibold mb-1">2025</p>
                  <p className="text-lg font-bold text-red-700">{formatCurrencyFull(datos2025.precio_promedio_unidad)}</p>
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-300">
                <p className="text-sm font-semibold text-red-800 mb-2">Caída acumulada:</p>
                <p className="text-sm text-gray-700">El precio acumula una caída del <strong className="text-red-600">{Math.abs(varPrecio3años)}%</strong> en tres años, una tendencia descendente continua y sostenida.</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-300">
                <p className="text-sm font-semibold text-yellow-800 mb-2">Contexto del mercado:</p>
                <p className="text-sm text-gray-700">Esta tendencia descendente continua indica presión competitiva en el mercado avícola. Mientras el volumen se mantiene estable, la disminución del precio impacta directamente los márgenes del canal de huevo.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="text-sm font-semibold text-purple-800 mb-2">Impacto estratégico:</p>
                <p className="text-sm text-gray-700">La caída sostenida de precios requiere una revisión de la estrategia comercial del canal de huevo, incluyendo diferenciación por calidad (raza Hy-Line Brown) y segmentación de clientes de mayor valor.</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Caída Precio Huevo 2023→2025</span>
            <AlertTriangle className="w-6 h-6 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-red-600 mb-1">{Math.abs(varPrecio3años)}%</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2023: <span className="font-semibold text-gray-700">{formatCurrencyFull(datos2023.precio_promedio_unidad)}</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{formatCurrencyFull(datos2025.precio_promedio_unidad)}</span></div>
            <div className="text-sm font-bold text-red-600">Var: -{Math.abs(varPrecio3años)}%</div>
          </div>
        </motion.div>
      </div>

      {/* Análisis de Comportamiento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200"
        >
          <h4 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Comportamiento de Volumen
          </h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>En 2024 se logra el máximo volumen del periodo ({formatNumber(datos2024.unidades_vendidas)} unidades), con un incremento frente a 2023.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>En 2025 se observa una corrección a la baja ({formatNumber(datos2025.unidades_vendidas)} unidades), aunque el volumen permanece por encima del nivel de 2023.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>El comportamiento sugiere estabilidad general en la demanda, con fluctuaciones dentro de un rango estrecho.</span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-red-50 rounded-xl p-6 border-2 border-red-200"
        >
          <h4 className="text-lg font-bold text-red-900 mb-3 flex items-center gap-2">
            <TrendingDown className="w-5 h-5" />
            Comportamiento de Precios
          </h4>
          <ul className="space-y-2 text-sm text-red-800">
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span>El precio promedio presenta una tendencia descendente continua, acumulando una caída del {Math.abs(varPrecio3años)}% en tres años.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span>Mientras el volumen se mantiene relativamente estable, la disminución del precio promedio indica presión en márgenes por mayor competencia.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span>Aunque la demanda se mantiene sólida, los precios siguen descendiendo, por lo que se han adoptado estrategias de ajuste gradual de precios y segmentación de clientes.</span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Gráfico Combinado */}
      <CollapsibleChart title="Evolución Unidades y Precio Promedio Huevo 2023-2025" defaultOpen={false}>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={datosGrafico}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="año" stroke="#64748b" />
            <YAxis 
              yAxisId="left" 
              stroke="#3b82f6" 
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              label={{ value: 'Unidades', angle: -90, position: 'insideLeft', style: { fill: '#3b82f6' } }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#f97316"
              tickFormatter={(value) => `$${value}`}
              label={{ value: '$/Unidad', angle: 90, position: 'insideRight', style: { fill: '#f97316' } }}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const { unidades, precio, ingresos, varVentas } = payload[0].payload;
                  return (
                    <div className="bg-white border-2 border-yellow-500 rounded-xl p-4 shadow-xl">
                      <p className="font-bold text-gray-900 mb-3 text-lg">Año {label}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-blue-600 font-medium">Unidades:</span>
                          <span className="font-bold text-gray-900">{formatNumber(unidades)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-orange-600 font-medium">Precio:</span>
                          <span className="font-bold text-gray-900">{formatCurrency(precio)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-green-600 font-medium">Ventas:</span>
                          <span className="font-bold text-gray-900">{formatCurrency(ingresos)}</span>
                        </div>
                        {payload[0].payload.tendenciaPrecio != null && (
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-purple-600 font-medium">Tend. Precio:</span>
                            <span className="font-bold text-purple-600">{formatCurrency(payload[0].payload.tendenciaPrecio)}</span>
                          </div>
                        )}
                        {varVentas !== null && (
                          <div className="border-t border-gray-200 pt-2 flex justify-between items-center gap-4">
                            <span className="text-gray-600 font-medium">Var. Ventas:</span>
                            <span className={`font-bold ${parseFloat(varVentas) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {parseFloat(varVentas) >= 0 ? '+' : ''}{varVentas}% vs año ant.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="unidades" fill="#3b82f6" name="Unidades Vendidas" radius={[8, 8, 0, 0]}>
              <LabelList dataKey="año" position="top" style={{ fontSize: '11px', fontWeight: 'bold', fill: '#374151' }} />
            </Bar>
            <Line yAxisId="right" type="monotone" dataKey="precio" stroke="#f97316" strokeWidth={3} name="Precio Promedio ($/Unidad)" dot={{ r: 6 }} />
            <Line yAxisId="right" type="linear" dataKey="tendenciaPrecio" stroke="#7c3aed" strokeWidth={2} strokeDasharray="8 4" dot={false} name="Tendencia Precio" />
          </ComposedChart>
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
                  <Info className="w-6 h-6 text-yellow-400" />
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
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
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
