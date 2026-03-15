import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Egg, TrendingDown, DollarSign, X, Info, AlertTriangle, Package } from 'lucide-react';

export default function ComercialHuevoDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
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

  // Abreviado para KPIs: $1.234M / $1.23B
  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return '$0';
    const v = parseFloat(value);
    if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(2)} mil M`;
    if (v >= 1_000_000)     return `$${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000)         return `$${(v / 1_000).toFixed(0)}K`;
    return '$' + new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);
  };

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

  // Preparar datos para el gráfico
  const datosOrdenadosAsc = datosOrdenados.reverse();
  const datosGrafico = datosOrdenadosAsc.map((v, idx) => {
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
            'Unidades Vendidas 2025',
            `Total de unidades vendidas en 2025: ${formatNumber(datos2025.unidades_vendidas)}. Variación vs 2024: ${varUnidades2025vs2024}%. El volumen se mantiene relativamente estable, con fluctuaciones dentro de un rango estrecho. En 2024 se logró el máximo volumen del periodo con ${formatNumber(datos2024.unidades_vendidas)} unidades.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Unidades Huevo Vendidas 2025</span>
            <Package className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatNumber(datos2025.unidades_vendidas)}</div>
          <div className={`text-xs flex items-center gap-1 ${parseFloat(varUnidades2025vs2024) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingDown className="w-4 h-4" />
            {varUnidades2025vs2024}% vs 2024
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal(
            'Precio Promedio 2025',
            `Precio promedio por unidad en 2025: ${formatCurrency(datos2025.precio_promedio_unidad)}. El precio presenta una tendencia descendente continua, acumulando una caída del ${Math.abs(varPrecio3años)}% en tres años (2023-2025). Esto indica presión en márgenes por mayor competencia en el mercado.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-red-500/30 hover:border-red-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Precio Promedio/Unidad Huevo 2025</span>
            <TrendingDown className="w-6 h-6 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(datos2025.precio_promedio_unidad)}</div>
          <div className="text-xs flex items-center gap-1 text-red-600">
            <AlertTriangle className="w-4 h-4" />
            {varPrecio2025vs2024}% vs 2024
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal(
            'Ingresos Totales 2025',
            `Ingresos totales en 2025: ${formatCurrency(datos2025.ingresos_totales_calculados)}. Variación vs 2024: ${varIngresos}%. Aunque la demanda se mantiene sólida, los ingresos disminuyen debido a la caída continua en precios. Se han adoptado estrategias de ajuste gradual de precios y segmentación de clientes.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Ingresos Huevo 2025</span>
            <DollarSign className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(datos2025.ingresos_totales_calculados)}</div>
          <div className={`text-xs flex items-center gap-1 ${parseFloat(varIngresos) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingDown className="w-4 h-4" />
            {varIngresos}% vs 2024
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal(
            'Caída de Precio en 3 Años',
            `El precio promedio ha caído ${Math.abs(varPrecio3años)}% en tres años, pasando de ${formatCurrency(datos2023.precio_promedio_unidad)} en 2023 a ${formatCurrency(datos2025.precio_promedio_unidad)} en 2025. Esta tendencia descendente continua indica presión competitiva en el mercado. Mientras el volumen se mantiene estable, la disminución del precio impacta los márgenes.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Caída Precio Huevo 2023→2025</span>
            <AlertTriangle className="w-6 h-6 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-red-600 mb-1">{Math.abs(varPrecio3años)}%</div>
          <div className="text-xs text-gray-600">
            2023 → 2025
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        onClick={() => openModal(
          'Evolución de Ventas de Huevo',
          'Este gráfico muestra la evolución de unidades vendidas (barras azules) y precio promedio (línea naranja) durante los años 2023-2025. Se observa claramente cómo el volumen se mantiene estable alrededor de 34 millones de unidades, mientras que el precio cae continuamente desde $512 en 2023 hasta $403 en 2025, una reducción del 21.29%.'
        )}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200 cursor-pointer hover:border-yellow-400 transition-all"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Evolución Unidades y Precio Promedio Huevo 2023-2025</h3>
          <Info className="w-5 h-5 text-yellow-400 animate-pulse" />
        </div>
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
            <Bar yAxisId="left" dataKey="unidades" fill="#3b82f6" name="Unidades Vendidas" radius={[8, 8, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="precio" stroke="#f97316" strokeWidth={3} name="Precio Promedio ($/Unidad)" dot={{ r: 6 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

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
              className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-yellow-500 shadow-2xl"
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
              <div className="text-gray-700 leading-relaxed">
                {modalContent.description}
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
      </AnimatePresence>
    </div>
  );
}
