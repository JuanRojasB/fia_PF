import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LabelList } from 'recharts';
import { Package, TrendingUp, DollarSign, X, Info, Percent, ArrowUpRight, ArrowDownRight, ShoppingBag } from 'lucide-react';
import CollapsibleTable, { fmt as formatNumber } from '../CollapsibleTable';
import { formatCurrencyFull } from './CustomTooltip';

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

  // Abreviado para KPIs: $1.234M / $1.23B
  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return '$0';
    const v = parseFloat(value);
    if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(2)}MM`;
    if (v >= 1_000_000)     return `$${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000)         return `$${(v / 1_000).toFixed(0)}mil`;
    return '$' + new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);
  };

  // Procesar datos - la tabla ya tiene los datos calculados por año
  const ORDEN_LINEAS = {
    'POLLO ENTERO': 1,
    'POLLO CAMPESINO': 2,
    'PRESA': 3,
    'MENUDENCIA': 4,
    'GALLOS': 5,
    'GALLINAS': 5,
    'CARNES': 6,
    'COMBOS': 7,
    'MAYORISTA': 8,
  };

  const getOrden = (linea) => {
    const upper = linea.toUpperCase();
    for (const [key, val] of Object.entries(ORDEN_LINEAS)) {
      if (upper.includes(key)) return val;
    }
    return 99;
  };

  const datosTabla = ventasResumenLinea.map(v => ({
    linea: v.nombre_linea,
    kilos2025: parseFloat(v.kilos_2025) || 0,
    part2025: parseFloat(v.participacion_pct_2025) || 0,
    kilos2024: parseFloat(v.kilos_2024) || 0,
    part2024: 0,
    variacion: parseFloat(v.variacion_kilos) || 0,
    varPct: parseFloat(v.variacion_kilos_pct) || 0,
    precio2025: parseFloat(v.precio_promedio_2025) || 0,
    precio2024: parseFloat(v.precio_promedio_2024) || 0,
    varPrecio: parseFloat(v.variacion_precio_pct) || 0
  })).sort((a, b) => getOrden(a.linea) - getOrden(b.linea));

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

  const COLOR_MAP = {
    'POLLO ENTERO':    '#2563eb', // azul
    'POLLO CAMPESINO': '#16a34a', // verde oscuro
    'PRESA':           '#f59e0b', // naranja
    'MENUDENCIA':      '#ef4444', // rojo
    'GALLOS':          '#7c3aed', // violeta
    'GALLINAS':        '#7c3aed', // violeta (mismo grupo)
    'CARNES':          '#ec4899', // rosa
    'COMBOS':          '#0891b2', // cyan
    'MAYORISTA':       '#1e3a5f', // azul marino oscuro
  };

  const getColor = (linea) => {
    const upper = linea.toUpperCase();
    for (const [key, color] of Object.entries(COLOR_MAP)) {
      if (upper.includes(key)) return color;
    }
    return '#94a3b8';
  };

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
            <span className="text-gray-600 text-sm font-medium">Ventas Pollo Canal 2025 (kg)</span>
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
            <span className="text-gray-600 text-sm font-medium">Ingresos Pollo Canal 2025</span>
            <DollarSign className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatCurrencyFull(ingresos2025)}</div>
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
            <span className="text-gray-600 text-sm font-medium">Precio Promedio $/kg Canal 2025</span>
            <TrendingUp className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatCurrencyFull(precioProm2025)}/kg</div>
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
            <span className="text-gray-600 text-sm font-medium">Líneas de Producto en Crecimiento 2025</span>
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
        totalRow={[
          { label: 'TOTAL LÍNEAS 2025' },
          { label: `${formatNumber(total2025)} kg`, color: 'text-blue-600' },
          { label: `Var: ${variacionKilos > 0 ? '+' : ''}${variacionKilos}%`, color: parseFloat(variacionKilos) >= 0 ? 'text-green-500' : 'text-red-500', badge: true, badgeColor: parseFloat(variacionKilos) >= 0 ? 'bg-green-500' : 'bg-red-500', badgeIcon: parseFloat(variacionKilos) >= 0 ? '↑' : '↓' },
          { label: `Ingresos: ${formatCurrency(ingresos2025)}`, color: 'text-green-600' },
        ]}
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
                <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{formatNumber(d.precio2025)}</td>
                <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{formatNumber(d.precio2024)}</td>
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
              <td className="py-3 px-4 text-right text-gray-900 tabular-nums">{formatNumber(precioProm2025)}</td>
              <td className="py-3 px-4 text-right text-gray-900 tabular-nums">{formatNumber(precioProm2024)}</td>
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

      {/* Total General */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={() => openModal(
          'Total General — Ventas Pollo en Canal',
          `Kilos 2025: ${formatNumber(total2025)} kg\nKilos 2024: ${formatNumber(total2024)} kg\nVariación: ${formatNumber(total2025-total2024)} kg (${variacionKilos}%)\nPrecio prom. 2025: $${formatNumber(precioProm2025)}/kg\nPrecio prom. 2024: $${formatNumber(precioProm2024)}/kg\nVar. precio: ${variacionPrecio}%`
        )}
        className="bg-gradient-to-r from-blue-500/20 to-purple-600/10 backdrop-blur-xl rounded-xl p-6 border-2 border-blue-500/30 cursor-pointer hover:border-blue-500 transition-all"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">TOTAL GENERAL — VENTAS POLLO EN CANAL</h3>
          <Info className="w-5 h-5 text-blue-400 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Kls. 2025</p>
            <p className="text-xl font-bold text-gray-900">{formatNumber(total2025)}</p>
            <p className="text-xs text-gray-500 mt-1">100,00%</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Kls. 2024</p>
            <p className="text-xl font-bold text-gray-900">{formatNumber(total2024)}</p>
            <p className="text-xs text-gray-500 mt-1">100,00%</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Variación</p>
            <p className={`text-xl font-bold ${parseFloat(variacionKilos)>=0?'text-green-600':'text-red-600'}`}>{formatNumber(total2025-total2024)}</p>
            <span className={`inline-flex items-center gap-1 text-xs ${parseFloat(variacionKilos)>=0?'text-green-600':'text-red-600'}`}>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-white ${parseFloat(variacionKilos)>=0?'bg-green-500':'bg-red-500'}`}>{parseFloat(variacionKilos)>=0?'↑':'↓'}</span>
              {variacionKilos}%
            </span>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">$/p 2025</p>
            <p className="text-xl font-bold text-gray-900">{formatNumber(precioProm2025)}</p>
            <p className="text-xs text-gray-500 mt-1">precio prom.</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">$/p 2024 / Var</p>
            <p className="text-lg font-bold text-gray-900">{formatNumber(precioProm2024)}</p>
            <span className={`inline-flex items-center gap-1 text-xs ${parseFloat(variacionPrecio)>=0?'text-green-600':'text-red-600'}`}>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-white ${parseFloat(variacionPrecio)>=0?'bg-green-500':'bg-red-500'}`}>●</span>
              {variacionPrecio}%
            </span>
          </div>
        </div>
      </motion.div>

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
            <h3 className="text-xl font-bold text-gray-900">Ventas en Kilos por Línea de Producto 2024 vs 2025</h3>
            <Info className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={datosComparativa} layout="vertical" margin={{ left: 120, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" tickFormatter={(value) => formatNumber(value)} />
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
              <Bar dataKey="2024" fill="#3b82f6" name="2024" radius={[0, 8, 8, 0]}>
                <LabelList dataKey="2024" position="insideRight" style={{ fontSize: '10px', fontWeight: 'bold', fill: '#fff' }} formatter={() => '2024'} />
              </Bar>
              <Bar dataKey="2025" fill="#10b981" name="2025" radius={[0, 8, 8, 0]}>
                <LabelList dataKey="2025" position="insideRight" style={{ fontSize: '10px', fontWeight: 'bold', fill: '#fff' }} formatter={() => '2025'} />
              </Bar>
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
            <h3 className="text-xl font-bold text-gray-900">Participación en Ventas por Línea de Producto 2025 (%)</h3>
            <Info className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={380}>
              <PieChart>
                <Pie
                  data={datosParticipacion}
                  cx="50%"
                  cy="50%"
                  labelLine={(props) => props.value >= 1}
                  label={({ value, cx, cy, midAngle, innerRadius, outerRadius }) => {
                    if (value < 1) return null;
                    const RADIAN = Math.PI / 180;
                    const radius = outerRadius + 28;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text x={x} y={y} fill="#1f2937" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={13} fontWeight="600">
                        {`${value.toFixed(1)}%`}
                      </text>
                    );
                  }}
                  outerRadius={120}
                  dataKey="value"
                >
                  {datosParticipacion.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={getColor(datosParticipacion[index].name)} />
                  ))}
                </Pie>
                <Tooltip content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-white border-2 border-blue-500 rounded-xl p-4 shadow-xl">
                        <p className="font-bold text-gray-900 mb-2">{d.name}</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between gap-4">
                            <span className="text-gray-600">Kilos:</span>
                            <span className="font-bold">{formatNumber(d.kilos)} kg</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-blue-600">Participación:</span>
                            <span className="font-bold">{d.value.toFixed(2)}%</span>
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
          {/* Leyenda con porcentajes */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {datosParticipacion.map((d, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2 px-2 py-1 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: getColor(d.name) }}></div>
                  <span className="text-xs text-gray-700 truncate">{d.name}</span>
                </div>
                <span className="text-xs font-bold text-gray-900 flex-shrink-0">{d.value.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

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
      </AnimatePresence>, document.body)}
    </div>
  );
}