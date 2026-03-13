import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, TrendingUp, DollarSign, X, Info, Percent, ArrowUpRight, ArrowDownRight, ShoppingBag } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';

export default function ComercialProductosDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  // Extraer datos de ventas por línea de producto
  const ventasResumenLinea = data?.ventasResumenLinea || [];
  
  if (ventasResumenLinea.length === 0) {
    return (
      <div className="bg-white/95 backdrop-blur-xl rounded-xl p-12 border border-gray-200 text-center">
        <div className="text-gray-600 text-lg">No hay datos disponibles de Ventas por Líneas de Producto</div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return '$0';
    return '$' + new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Procesar datos - la tabla ya tiene los datos calculados por año
  const datosTabla = ventasResumenLinea.map(v => ({
    linea: v.nombre_linea,
    kilos2025: parseFloat(v.kilos_2025) || 0,
    part2025: parseFloat(v.participacion_pct_2025) || 0,
    kilos2024: parseFloat(v.kilos_2024) || 0,
    part2024: 0, // Calcularemos después
    variacion: parseFloat(v.variacion_kilos) || 0,
    varPct: parseFloat(v.variacion_kilos_pct) || 0,
    precio2025: parseFloat(v.precio_promedio_2025) || 0,
    precio2024: parseFloat(v.precio_promedio_2024) || 0,
    varPrecio: parseFloat(v.variacion_precio_pct) || 0
  }));

  // Calcular totales
  const total2025 = datosTabla.reduce((sum, d) => sum + d.kilos2025, 0);
  const total2024 = datosTabla.reduce((sum, d) => sum + d.kilos2024, 0);
  const ingresos2025 = datosTabla.reduce((sum, d) => sum + (d.kilos2025 * d.precio2025), 0);
  const ingresos2024 = datosTabla.reduce((sum, d) => sum + (d.kilos2024 * d.precio2024), 0);

  // Calcular participación 2024
  datosTabla.forEach(d => {
    d.part2024 = total2024 > 0 ? ((d.kilos2024 / total2024) * 100).toFixed(2) : 0;
  });

  const variacionKilos = total2024 > 0 ? (((total2025 - total2024) / total2024) * 100).toFixed(2) : 0;
  const variacionIngresos = ingresos2024 > 0 ? (((ingresos2025 - ingresos2024) / ingresos2024) * 100).toFixed(2) : 0;
  const precioProm2025 = total2025 > 0 ? (ingresos2025 / total2025).toFixed(0) : 0;
  const precioProm2024 = total2024 > 0 ? (ingresos2024 / total2024).toFixed(0) : 0;
  const variacionPrecio = precioProm2024 > 0 ? (((precioProm2025 - precioProm2024) / precioProm2024) * 100).toFixed(2) : 0;

  // Clasificar líneas en crecimiento y contracción
  const lineasCrecimiento = datosTabla.filter(d => parseFloat(d.varPct) > 0);
  const lineasContraccion = datosTabla.filter(d => parseFloat(d.varPct) < 0);

  // Datos para gráficas
  const datosComparativa = datosTabla.map(d => ({
    linea: d.linea,
    '2024': d.kilos2024,
    '2025': d.kilos2025
  }));

  const datosParticipacion = datosTabla.map(d => ({
    name: d.linea,
    value: parseFloat(d.part2025),
    kilos: d.kilos2025
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500/20 to-purple-600/10 backdrop-blur-xl rounded-xl p-6 border-2 border-blue-500/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <ShoppingBag className="w-8 h-8 text-blue-400" />
          <h2 className="text-3xl font-bold text-gray-900">VENTAS EN POLLO EN CANAL - POR LÍNEAS DE PRODUCTO</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          Análisis detallado de las ventas por líneas de producto en pollo en canal. El total vendido en 2025 fue de {formatNumber(total2025)} kg, 
          creciendo +{variacionKilos}% respecto a 2024. El precio promedio cayó –{Math.abs(variacionPrecio)}%, reflejando crecimiento en volumen pero presión en precios.
        </p>
      </motion.div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal(
            'Ventas Totales 2025 en Kilogramos',
            `Total de kilogramos vendidos en 2025: ${formatNumber(total2025)} kg. La variación del ${variacionKilos}% vs 2024 representa un crecimiento de ${formatNumber(total2025 - total2024)} kg adicionales. Este incremento se debe principalmente al mayor dinamismo en las líneas Mayorista (+6.05%) y Pollo Entero (+4.94%). En 2024 se vendieron ${formatNumber(total2024)} kg.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Ventas Totales 2025</span>
            <Package className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatNumber(total2025)}</div>
          <div className="text-sm text-gray-600 mb-1">kg vendidos</div>
          <div className={`text-xs flex items-center gap-1 ${parseFloat(variacionKilos) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {parseFloat(variacionKilos) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {variacionKilos > 0 ? '+' : ''}{variacionKilos}% vs 2024
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal(
            'Ingresos Totales 2025 - Solo Pollo en Canal',
            `Ingresos totales en 2025: ${formatCurrency(ingresos2025)}\nVariación vs 2024: ${variacionIngresos}%\n\nQUÉ INCLUYE:\n• Solo Pollo en Canal por líneas de producto\n• Mayorista, Pollo Entero, Presa, Menudencia, Combos, Carnes Frías, Pollo Campesino, Gallos/Gallinas\n\nNO INCLUYE:\n• Pollo en Pie\n• Huevos\n\nEste ingreso es MENOR que "Ventas Total Compañía" porque solo incluye pollo procesado en canal.\n\nCálculo: Suma de (kg vendidos × precio) de cada línea de producto en canal.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Ingresos Totales 2025</span>
            <DollarSign className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatCurrency(ingresos2025)}</div>
          <div className="text-sm text-gray-600 mb-1">pesos colombianos</div>
          <div className={`text-xs flex items-center gap-1 ${parseFloat(variacionIngresos) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {parseFloat(variacionIngresos) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {variacionIngresos > 0 ? '+' : ''}{variacionIngresos}% vs 2024
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal(
            'Precio Promedio por Kilogramo 2025',
            `Precio promedio por kilogramo en 2025: ${formatCurrency(precioProm2025)}/kg. La variación del ${variacionPrecio}% vs 2024 (${formatCurrency(precioProm2024)}/kg) refleja presión en precios en la mayoría de las líneas. Menudencia (-3.56%), Gallos/Gallinas (-8.84%), y Pollo Entero (-0.42%) presentaron disminuciones, mientras que Presa (+0.16%) y Combos (+12.24%) registraron aumentos. El precio promedio ponderado considera el volumen de ventas de cada línea de producto.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Precio Promedio 2025</span>
            <TrendingUp className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatCurrency(precioProm2025)}/kg</div>
          <div className="text-sm text-gray-600 mb-1">pesos por kilogramo</div>
          <div className={`text-xs flex items-center gap-1 ${parseFloat(variacionPrecio) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {parseFloat(variacionPrecio) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {variacionPrecio > 0 ? '+' : ''}{variacionPrecio}% vs 2024
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal(
            'Líneas de Producto en Crecimiento',
            `${lineasCrecimiento.length} líneas de producto presentan crecimiento en kilogramos vendidos: ${lineasCrecimiento.map(l => l.linea).join(', ')}. Las líneas que impulsan el crecimiento son Mayorista (+6.05%), Pollo Entero (+4.94%), Gallos/Gallinas (+12.41%), y Menudencia (+0.46%). Estas líneas compensan las contracciones en Carnes Frías (-88.69%), Pollo Campesino (-83.26%), Presa (-2.20%), y Combos (-42.12%). El balance neto es positivo con ${lineasCrecimiento.length} líneas en expansión vs ${lineasContraccion.length} en contracción.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Líneas en Crecimiento</span>
            <Percent className="w-6 h-6 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{lineasCrecimiento.length}</div>
          <div className="text-sm text-gray-600 mb-1">líneas de producto</div>
          <div className="text-xs text-green-600">
            vs {lineasContraccion.length} en contracción
          </div>
        </motion.div>
      </div>

      {/* Tabla Detallada */}
      <CollapsibleTable 
        title="VENTAS POR LÍNEA DE PRODUCTO - DETALLE"
        defaultOpen={false}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-purple-600 border-b-2 border-gray-300">
              <th className="text-left py-3 px-4 text-white font-bold">Agrupación Línea</th>
              <th className="text-right py-3 px-4 text-white font-bold">Kls. 2025</th>
              <th className="text-right py-3 px-4 text-white font-bold">% Part</th>
              <th className="text-right py-3 px-4 text-white font-bold">Kls. 2024</th>
              <th className="text-right py-3 px-4 text-white font-bold">% Part</th>
              <th className="text-right py-3 px-4 text-white font-bold">Variac.</th>
              <th className="text-right py-3 px-4 text-white font-bold">% Var</th>
              <th className="text-right py-3 px-4 text-white font-bold">$/p 2025</th>
              <th className="text-right py-3 px-4 text-white font-bold">$/p 2024</th>
              <th className="text-right py-3 px-4 text-white font-bold">Var $/p</th>
            </tr>
          </thead>
          <tbody>
            {datosTabla.map((d, idx) => (
              <tr key={idx} className="border-b border-gray-200/30 hover:bg-gray-100/20">
                <td className="py-2 px-4 text-gray-900">{d.linea}</td>
                <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{formatNumber(d.kilos2025)}</td>
                <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{d.part2025}%</td>
                <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{formatNumber(d.kilos2024)}</td>
                <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{d.part2024}%</td>
                <td className={`py-2 px-4 text-right tabular-nums ${parseFloat(d.varPct) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatNumber(d.variacion)}
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  <span className={`inline-flex items-center gap-1 ${parseFloat(d.varPct) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${parseFloat(d.varPct) >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                      {parseFloat(d.varPct) >= 0 ? '↑' : '↓'}
                    </span>
                    {d.varPct}%
                  </span>
                </td>
                <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{formatCurrency(d.precio2025)}</td>
                <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{formatCurrency(d.precio2024)}</td>
                <td className="py-2 px-4 text-right tabular-nums">
                  <span className={`inline-flex items-center gap-1 ${parseFloat(d.varPrecio) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${parseFloat(d.varPrecio) >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                      ●
                    </span>
                    {d.varPrecio}%
                  </span>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50 border-t-2 border-gray-400 font-bold">
              <td className="py-3 px-4 text-gray-900">Total</td>
              <td className="py-3 px-4 text-right text-gray-900 tabular-nums">{formatNumber(total2025)}</td>
              <td className="py-3 px-4 text-right text-gray-900 tabular-nums">100.00%</td>
              <td className="py-3 px-4 text-right text-gray-900 tabular-nums">{formatNumber(total2024)}</td>
              <td className="py-3 px-4 text-right text-gray-900 tabular-nums">100.00%</td>
              <td className={`py-3 px-4 text-right tabular-nums ${parseFloat(variacionKilos) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatNumber(total2025 - total2024)}
              </td>
              <td className="py-3 px-4 text-right tabular-nums">
                <span className={`inline-flex items-center gap-1 ${parseFloat(variacionKilos) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${parseFloat(variacionKilos) >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                    {parseFloat(variacionKilos) >= 0 ? '↑' : '↓'}
                  </span>
                  {variacionKilos}%
                </span>
              </td>
              <td className="py-3 px-4 text-right text-gray-900 tabular-nums">{formatCurrency(precioProm2025)}</td>
              <td className="py-3 px-4 text-right text-gray-900 tabular-nums">{formatCurrency(precioProm2024)}</td>
              <td className="py-3 px-4 text-right tabular-nums">
                <span className={`inline-flex items-center gap-1 ${parseFloat(variacionPrecio) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${parseFloat(variacionPrecio) >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                    ●
                  </span>
                  {variacionPrecio}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        </div>

        {/* Análisis */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h4 className="text-lg font-bold text-green-800 mb-2">Líneas en Crecimiento</h4>
            <ul className="space-y-1 text-sm text-green-700">
              {lineasCrecimiento.map((l, idx) => (
                <li key={idx}>• {l.linea}: +{l.varPct}%</li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h4 className="text-lg font-bold text-red-800 mb-2">Líneas en Contracción</h4>
            <ul className="space-y-1 text-sm text-red-700">
              {lineasContraccion.map((l, idx) => (
                <li key={idx}>• {l.linea}: {l.varPct}%</li>
              ))}
            </ul>
          </div>
        </div>
      </CollapsibleTable>

      {/* Gráficos - Solo 2 gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gráfico Comparativo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => openModal(
            'Comparativa de Ventas por Línea',
            'Este gráfico muestra la evolución de las ventas en kilos por línea de producto entre 2024 y 2025. Las barras azules representan 2024 y las verdes 2025. Se observa claramente el crecimiento en Mayorista (+6.05%) y Pollo Entero (+4.94%), mientras que Carnes Frías (-88.69%) y Pollo Campesino (-83.26%) presentan fuertes contracciones.'
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200 cursor-pointer hover:border-blue-400 transition-all"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Comparativa 2024 vs 2025</h3>
            <Info className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={datosComparativa} layout="vertical" margin={{ left: 120, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
              <YAxis type="category" dataKey="linea" stroke="#64748b" width={110} style={{ fontSize: '12px' }} />
              <Tooltip content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const val2024 = payload.find(p => p.dataKey === '2024')?.value || 0;
                  const val2025 = payload.find(p => p.dataKey === '2025')?.value || 0;
                  const diferencia = val2025 - val2024;
                  const variacion = val2024 > 0 ? ((diferencia / val2024) * 100).toFixed(1) : 0;
                  
                  return (
                    <div className="bg-white border-2 border-blue-500 rounded-xl p-4 shadow-xl">
                      <p className="font-bold text-gray-900 mb-3 text-lg">{label}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-blue-600 font-medium">2024:</span>
                          <span className="font-bold text-gray-900">{formatNumber(val2024)} kg</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-green-600 font-medium">2025:</span>
                          <span className="font-bold text-gray-900">{formatNumber(val2025)} kg</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-gray-600 font-medium">Diferencia:</span>
                            <span className={`font-bold ${diferencia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {diferencia >= 0 ? '+' : ''}{formatNumber(diferencia)} kg
                            </span>
                          </div>
                          <div className="flex justify-between items-center gap-4 mt-1">
                            <span className="text-gray-600 font-medium">Variación:</span>
                            <span className={`font-bold ${variacion >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {variacion >= 0 ? '+' : ''}{variacion}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }} />
              <Bar dataKey="2024" fill="#3b82f6" name="2024" radius={[0, 8, 8, 0]} />
              <Bar dataKey="2025" fill="#10b981" name="2025" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Gráfico de Participación */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          onClick={() => openModal(
            'Participación por Línea 2025',
            'Este gráfico muestra la participación porcentual de cada línea de producto en el total de ventas 2025. Mayorista domina con 51.24% del volumen total, seguido de Presa (22.53%) y Pollo Entero (19.13%). Estas tres líneas representan el 92.9% del total de ventas.'
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200 cursor-pointer hover:border-blue-400 transition-all"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Participación en Ventas 2025</h3>
            <Info className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={datosParticipacion}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ value }) => `${value.toFixed(1)}%`}
                  outerRadius={130}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {datosParticipacion.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white border-2 border-blue-500 rounded-xl p-4 shadow-xl">
                        <p className="font-bold text-gray-900 mb-3 text-lg">{data.name}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-gray-600 font-medium">Kilos:</span>
                            <span className="font-bold text-gray-900">{formatNumber(data.kilos)} kg</span>
                          </div>
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-blue-600 font-medium">Participación:</span>
                            <span className="font-bold text-gray-900">{data.value.toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {datosParticipacion.map((d, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                <span className="text-sm text-gray-700 truncate">{d.name}</span>
              </div>
            ))}
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
