import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { ShoppingCart, TrendingUp, DollarSign, X, Info, Package, Percent, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';

export default function ComercialVentasCompaniaDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  // Extraer datos de ventas pie/canal
  const ventasPieCanal = data?.ventasPieCanal || [];
  
  if (ventasPieCanal.length === 0) {
    return (
      <div className="bg-white/95 backdrop-blur-xl rounded-xl p-12 border border-gray-200 text-center">
        <div className="text-gray-600 text-lg">No hay datos disponibles de Ventas Total Compañía</div>
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

  // Procesar datos por año y categoría
  const datosPorAnio = {};
  ventasPieCanal.forEach(v => {
    const anio = v.anio;
    const categoria = v.nombre_categoria || 'Sin categoría';
    
    if (!datosPorAnio[anio]) {
      datosPorAnio[anio] = {
        anio,
        totalKilos: 0,
        totalIngresos: 0,
        pie: { kilos: 0, ingresos: 0 },
        canal: { kilos: 0, ingresos: 0 }
      };
    }
    
    const kilos = parseFloat(v.kilos_vendidos) || 0;
    const ingresos = parseFloat(v.ingresos_pesos) || 0;
    
    datosPorAnio[anio].totalKilos += kilos;
    datosPorAnio[anio].totalIngresos += ingresos;
    
    if (categoria.toLowerCase().includes('pie')) {
      datosPorAnio[anio].pie.kilos += kilos;
      datosPorAnio[anio].pie.ingresos += ingresos;
    } else if (categoria.toLowerCase().includes('canal')) {
      datosPorAnio[anio].canal.kilos += kilos;
      datosPorAnio[anio].canal.ingresos += ingresos;
    }
  });

  const datos2025 = datosPorAnio[2025] || { totalKilos: 0, totalIngresos: 0, pie: { kilos: 0, ingresos: 0 }, canal: { kilos: 0, ingresos: 0 } };
  const datos2024 = datosPorAnio[2024] || { totalKilos: 0, totalIngresos: 0, pie: { kilos: 0, ingresos: 0 }, canal: { kilos: 0, ingresos: 0 } };

  // Calcular variaciones
  const variacionKilosTotal = datos2024.totalKilos > 0 
    ? (((datos2025.totalKilos - datos2024.totalKilos) / datos2024.totalKilos) * 100).toFixed(2)
    : 0;
  
  const variacionIngresos = datos2024.totalIngresos > 0
    ? (((datos2025.totalIngresos - datos2024.totalIngresos) / datos2024.totalIngresos) * 100).toFixed(2)
    : 0;

  const variacionPieKilos = datos2024.pie.kilos > 0
    ? (((datos2025.pie.kilos - datos2024.pie.kilos) / datos2024.pie.kilos) * 100).toFixed(2)
    : 0;

  const variacionCanalKilos = datos2024.canal.kilos > 0
    ? (((datos2025.canal.kilos - datos2024.canal.kilos) / datos2024.canal.kilos) * 100).toFixed(2)
    : 0;

  // Precio promedio
  const precioProm2025 = datos2025.totalKilos > 0 ? (datos2025.totalIngresos / datos2025.totalKilos).toFixed(0) : 0;
  const precioProm2024 = datos2024.totalKilos > 0 ? (datos2024.totalIngresos / datos2024.totalKilos).toFixed(0) : 0;
  const variacionPrecio = precioProm2024 > 0
    ? (((precioProm2025 - precioProm2024) / precioProm2024) * 100).toFixed(2)
    : 0;

  // Participación 2025
  const partPie2025 = datos2025.totalKilos > 0 ? ((datos2025.pie.kilos / datos2025.totalKilos) * 100).toFixed(2) : 0;
  const partCanal2025 = datos2025.totalKilos > 0 ? ((datos2025.canal.kilos / datos2025.totalKilos) * 100).toFixed(2) : 0;

  // Participación 2024
  const partPie2024 = datos2024.totalKilos > 0 ? ((datos2024.pie.kilos / datos2024.totalKilos) * 100).toFixed(2) : 0;
  const partCanal2024 = datos2024.totalKilos > 0 ? ((datos2024.canal.kilos / datos2024.totalKilos) * 100).toFixed(2) : 0;

  // Datos para gráficas
  const datosComparativa = [
    {
      categoria: 'Pie',
      '2024': datos2024.pie.kilos,
      '2025': datos2025.pie.kilos,
      variacion: variacionPieKilos
    },
    {
      categoria: 'Canal',
      '2024': datos2024.canal.kilos,
      '2025': datos2025.canal.kilos,
      variacion: variacionCanalKilos
    }
  ];

  const datosParticipacion2025 = [
    { name: 'Pie', value: parseFloat(partPie2025), kilos: datos2025.pie.kilos },
    { name: 'Canal', value: parseFloat(partCanal2025), kilos: datos2025.canal.kilos }
  ];

  const datosParticipacion2024 = [
    { name: 'Pie', value: parseFloat(partPie2024), kilos: datos2024.pie.kilos },
    { name: 'Canal', value: parseFloat(partCanal2024), kilos: datos2024.canal.kilos }
  ];

  const COLORS = ['#3b82f6', '#10b981'];

  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500/20 to-green-600/10 backdrop-blur-xl rounded-xl p-6 border-2 border-blue-500/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <ShoppingCart className="w-8 h-8 text-blue-400" />
          <h2 className="text-3xl font-bold text-gray-900">VENTAS TOTAL COMPAÑÍA - PIE / CANAL</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          Análisis del desempeño del negocio de pollo, comparando las ventas en kilos de pollo en pie (mayorista) y pollo en canal. 
          El volumen total presentó un crecimiento de +3.03% frente al 2024, alcanzando 56.356.508 kilos.
        </p>
      </motion.div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal(
            'Ventas Totales 2025',
            `Total de kilos vendidos en 2025: ${formatNumber(datos2025.totalKilos)} kg. La variación del ${variacionKilosTotal}% vs 2024 representa un crecimiento de ${formatNumber(datos2025.totalKilos - datos2024.totalKilos)} kg. Este incremento se debe principalmente al mayor dinamismo en la línea Mayorista (+6.05%).`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Ventas Totales Compañía 2025 (kg)</span>
            <Package className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatNumber(datos2025.totalKilos)} kg</div>
          <div className={`text-xs flex items-center gap-1 ${parseFloat(variacionKilosTotal) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {parseFloat(variacionKilosTotal) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {variacionKilosTotal > 0 ? '+' : ''}{variacionKilosTotal}% vs 2024
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal(
            'Ingresos Totales 2025 - Toda la Compañía',
            `Ingresos totales en 2025: ${formatCurrency(datos2025.totalIngresos)}\nVariación vs 2024: ${variacionIngresos}%\n\nQUÉ INCLUYE:\n• Pollo en Pie (Mayorista)\n• Pollo en Canal (todas las líneas)\n• Huevos\n• Todas las sedes y canales\n\nEste es el ingreso MÁS ALTO porque incluye TODAS las operaciones de la compañía.\n\nCálculo: Suma de todos los ingresos por ventas (kg × precio) de todas las categorías.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Ingresos Totales Compañía 2025</span>
            <DollarSign className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(datos2025.totalIngresos)}</div>
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
            'Precio Promedio 2025',
            `Precio promedio por kilo en 2025: ${formatCurrency(precioProm2025)}/kg. La variación del ${variacionPrecio}% vs 2024 refleja una disminución en el precio promedio. El pollo en canal registró un aumento de +0.15%, mientras que el pollo Mayorista presentó una disminución de -4.19%.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Precio Promedio $/kg Compañía 2025</span>
            <TrendingUp className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(precioProm2025)}/kg</div>
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
            'Variación Total',
            `La variación total de ${formatNumber(datos2025.totalKilos - datos2024.totalKilos)} kg representa un crecimiento del ${variacionKilosTotal}%. Las ventas en kilos de pollo en canal mostraron un incremento marginal de +0.03%, mientras que las ventas en kilos de pollo Mayorista crecieron de manera más dinámica, con un +6.05% respecto al año anterior.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Variación Volumen 2025 vs 2024</span>
            <Percent className="w-6 h-6 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatNumber(datos2025.totalKilos - datos2024.totalKilos)} kg</div>
          <div className="text-xs text-orange-600">
            Crecimiento del {variacionKilosTotal}%
          </div>
        </motion.div>
      </div>


      {/* KPIs por Línea */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => openModal(
            'Pollo en Pie (Mayorista)',
            `Ventas 2025: ${formatNumber(datos2025.pie.kilos)} kg (${partPie2025}% del total). Variación: +${variacionPieKilos}% vs 2024. Las ventas en kilos de pollo Mayorista crecieron de manera más dinámica con un +6.05% respecto al año anterior, impulsando el crecimiento total de la compañía. Precio promedio: ${formatCurrency(datos2025.pie.kilos > 0 ? (datos2025.pie.ingresos / datos2025.pie.kilos).toFixed(0) : 0)}/kg.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Pollo en Pie (Mayorista) - Kilos y Precio 2025</h3>
            <Info className="w-5 h-5 text-blue-400" />
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600">Ventas 2025</div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(datos2025.pie.kilos)} kg</div>
              <div className="text-xs text-blue-600">Participación: {partPie2025}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Variación vs 2024</div>
              <div className={`text-xl font-bold flex items-center gap-1 ${parseFloat(variacionPieKilos) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {parseFloat(variacionPieKilos) >= 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                {variacionPieKilos > 0 ? '+' : ''}{variacionPieKilos}%
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => openModal(
            'Pollo en Canal',
            `Ventas 2025: ${formatNumber(datos2025.canal.kilos)} kg (${partCanal2025}% del total). Variación: +${variacionCanalKilos}% vs 2024. Las ventas en kilos de pollo en canal mostraron un incremento marginal de +0.03%. El precio registró un aumento de +0.15%. Precio promedio: ${formatCurrency(datos2025.canal.kilos > 0 ? (datos2025.canal.ingresos / datos2025.canal.kilos).toFixed(0) : 0)}/kg.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Pollo en Canal - Kilos y Precio 2025</h3>
            <Info className="w-5 h-5 text-green-400" />
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600">Ventas 2025</div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(datos2025.canal.kilos)} kg</div>
              <div className="text-xs text-green-600">Participación: {partCanal2025}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Variación vs 2024</div>
              <div className={`text-xl font-bold flex items-center gap-1 ${parseFloat(variacionCanalKilos) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {parseFloat(variacionCanalKilos) >= 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                {variacionCanalKilos > 0 ? '+' : ''}{variacionCanalKilos}%
              </div>
            </div>
          </div>
        </motion.div>
      </div>

{/* Tabla Detallada */}
      <CollapsibleTable 
        title="VENTAS TOTAL COMPAÑÍA - DETALLE PIE / CANAL"
        defaultOpen={false}
        totalRow={[
          { label: 'TOTAL COMPAÑÍA 2025' },
          { label: `${formatNumber(datos2025.totalKilos)} kg`, color: 'text-blue-600' },
          { label: `Var: ${variacionKilosTotal > 0 ? '+' : ''}${variacionKilosTotal}%`, color: parseFloat(variacionKilosTotal) >= 0 ? 'text-green-500' : 'text-red-500', badge: true, badgeColor: parseFloat(variacionKilosTotal) >= 0 ? 'bg-green-500' : 'bg-red-500', badgeIcon: parseFloat(variacionKilosTotal) >= 0 ? '↑' : '↓' },
          { label: `Ingresos: ${formatCurrency(datos2025.totalIngresos)}`, color: 'text-green-600' },
        ]}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-green-600 border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 text-gray-900 font-bold">PIE / CANAL</th>
                <th className="text-right py-3 px-4 text-gray-900 font-bold">Kls.</th>
                <th className="text-right py-3 px-4 text-gray-900 font-bold">% Part</th>
                <th className="text-right py-3 px-4 text-gray-900 font-bold">Venta</th>
                <th className="text-right py-3 px-4 text-gray-900 font-bold">% Part.</th>
              </tr>
            </thead>
            <tbody>
            {/* 2025 */}
            <tr className="bg-green-50 border-b border-gray-200">
              <td className="py-2 px-4 text-gray-900 font-bold">2025</td>
              <td className="py-2 px-4 text-right text-gray-900 font-bold tabular-nums">
                {formatNumber(datos2025.totalKilos)}
              </td>
              <td className="py-2 px-4 text-right text-gray-900 font-bold tabular-nums">
                50,75%
              </td>
              <td className="py-2 px-4 text-right text-gray-900 font-bold tabular-nums">
                {formatCurrency(datos2025.totalIngresos)}
              </td>
              <td className="py-2 px-4 text-right text-gray-900 font-bold tabular-nums">
                50,19%
              </td>
            </tr>
            <tr className="border-b border-gray-200/30 hover:bg-gray-100/20">
              <td className="py-2 px-4 text-green-700 pl-8">Pie</td>
              <td className="py-2 px-4 text-right text-green-700 tabular-nums">
                {formatNumber(datos2025.pie.kilos)}
              </td>
              <td className="py-2 px-4 text-right text-green-700 tabular-nums">
                {partPie2025}%
              </td>
              <td className="py-2 px-4 text-right text-green-700 tabular-nums">
                {formatCurrency(datos2025.pie.ingresos)}
              </td>
              <td className="py-2 px-4 text-right text-green-700 tabular-nums">
                {datos2025.totalIngresos > 0 ? ((datos2025.pie.ingresos / datos2025.totalIngresos) * 100).toFixed(2) : 0}%
              </td>
            </tr>
            <tr className="border-b border-gray-200/30 hover:bg-gray-100/20">
              <td className="py-2 px-4 text-green-700 pl-8">Canal</td>
              <td className="py-2 px-4 text-right text-green-700 tabular-nums">
                {formatNumber(datos2025.canal.kilos)}
              </td>
              <td className="py-2 px-4 text-right text-green-700 tabular-nums">
                {partCanal2025}%
              </td>
              <td className="py-2 px-4 text-right text-green-700 tabular-nums">
                {formatCurrency(datos2025.canal.ingresos)}
              </td>
              <td className="py-2 px-4 text-right text-green-700 tabular-nums">
                {datos2025.totalIngresos > 0 ? ((datos2025.canal.ingresos / datos2025.totalIngresos) * 100).toFixed(2) : 0}%
              </td>
            </tr>
            
            {/* 2024 */}
            <tr className="bg-blue-50 border-b border-gray-200">
              <td className="py-2 px-4 text-gray-900 font-bold">2024</td>
              <td className="py-2 px-4 text-right text-gray-900 font-bold tabular-nums">
                {formatNumber(datos2024.totalKilos)}
              </td>
              <td className="py-2 px-4 text-right text-gray-900 font-bold tabular-nums">
                49,25%
              </td>
              <td className="py-2 px-4 text-right text-gray-900 font-bold tabular-nums">
                {formatCurrency(datos2024.totalIngresos)}
              </td>
              <td className="py-2 px-4 text-right text-gray-900 font-bold tabular-nums">
                49,81%
              </td>
            </tr>
            <tr className="border-b border-gray-200/30 hover:bg-gray-100/20">
              <td className="py-2 px-4 text-blue-700 pl-8">Pie</td>
              <td className="py-2 px-4 text-right text-blue-700 tabular-nums">
                {formatNumber(datos2024.pie.kilos)}
              </td>
              <td className="py-2 px-4 text-right text-blue-700 tabular-nums">
                {partPie2024}%
              </td>
              <td className="py-2 px-4 text-right text-blue-700 tabular-nums">
                {formatCurrency(datos2024.pie.ingresos)}
              </td>
              <td className="py-2 px-4 text-right text-blue-700 tabular-nums">
                {datos2024.totalIngresos > 0 ? ((datos2024.pie.ingresos / datos2024.totalIngresos) * 100).toFixed(2) : 0}%
              </td>
            </tr>
            <tr className="border-b border-gray-200/30 hover:bg-gray-100/20">
              <td className="py-2 px-4 text-blue-700 pl-8">Canal</td>
              <td className="py-2 px-4 text-right text-blue-700 tabular-nums">
                {formatNumber(datos2024.canal.kilos)}
              </td>
              <td className="py-2 px-4 text-right text-blue-700 tabular-nums">
                {partCanal2024}%
              </td>
              <td className="py-2 px-4 text-right text-blue-700 tabular-nums">
                {formatCurrency(datos2024.canal.ingresos)}
              </td>
              <td className="py-2 px-4 text-right text-blue-700 tabular-nums">
                {datos2024.totalIngresos > 0 ? ((datos2024.canal.ingresos / datos2024.totalIngresos) * 100).toFixed(2) : 0}%
              </td>
            </tr>
            
            {/* Total */}
            <tr className="bg-gray-50 border-t-2 border-gray-400 font-bold">
              <td className="py-3 px-4 text-gray-900">Total.</td>
              <td className="py-3 px-4 text-right text-gray-900 tabular-nums">
                {formatNumber(datos2025.totalKilos + datos2024.totalKilos)}
              </td>
              <td className="py-3 px-4 text-right text-gray-900 tabular-nums">
                100,00%
              </td>
              <td className="py-3 px-4 text-right text-gray-900 tabular-nums">
                {formatCurrency(datos2025.totalIngresos + datos2024.totalIngresos)}
              </td>
              <td className="py-3 px-4 text-right text-gray-900 tabular-nums">
                100,00%
              </td>
            </tr>
          </tbody>
        </table>
        </div>

        {/* Tabla de Variaciones */}
        <div className="mt-6">
          <h4 className="text-lg font-bold text-gray-900 mb-3 bg-blue-500 text-white py-2 px-4 rounded">
            VARIACIONES
          </h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-blue-400 to-blue-500 border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 text-gray-900 font-bold">Variacion</th>
                <th className="text-right py-3 px-4 text-gray-900 font-bold">Kilos</th>
                <th className="text-right py-3 px-4 text-gray-900 font-bold">% var</th>
                <th className="text-right py-3 px-4 text-gray-900 font-bold">% var Vtas</th>
                <th className="text-right py-3 px-4 text-gray-900 font-bold">% Var $/p</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200/30 hover:bg-gray-100/20">
                <td className="py-2 px-4 text-gray-900">Pie</td>
                <td className="py-2 px-4 text-right tabular-nums">
                  <span className={parseFloat(variacionPieKilos) >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatNumber(datos2025.pie.kilos - datos2024.pie.kilos)}
                  </span>
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  <span className={`inline-flex items-center gap-1 ${parseFloat(variacionPieKilos) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${parseFloat(variacionPieKilos) >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                      {parseFloat(variacionPieKilos) >= 0 ? '↑' : '↓'}
                    </span>
                    {variacionPieKilos}%
                  </span>
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  <span className="inline-flex items-center gap-1 text-orange-600">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs bg-orange-500">
                      ⚠
                    </span>
                    {datos2024.pie.ingresos > 0 ? (((datos2025.pie.ingresos - datos2024.pie.ingresos) / datos2024.pie.ingresos) * 100).toFixed(2) : 0}%
                  </span>
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  <span className="inline-flex items-center gap-1 text-red-600">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs bg-red-500">
                      ●
                    </span>
                    {datos2024.pie.kilos > 0 ? ((((datos2025.pie.ingresos / datos2025.pie.kilos) - (datos2024.pie.ingresos / datos2024.pie.kilos)) / (datos2024.pie.ingresos / datos2024.pie.kilos)) * 100).toFixed(2) : 0}%
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-200/30 hover:bg-gray-100/20">
                <td className="py-2 px-4 text-gray-900">Canal</td>
                <td className="py-2 px-4 text-right tabular-nums">
                  <span className={parseFloat(variacionCanalKilos) >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatNumber(datos2025.canal.kilos - datos2024.canal.kilos)}
                  </span>
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  <span className={`inline-flex items-center gap-1 ${parseFloat(variacionCanalKilos) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${parseFloat(variacionCanalKilos) >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                      {parseFloat(variacionCanalKilos) >= 0 ? '↑' : '↓'}
                    </span>
                    {variacionCanalKilos}%
                  </span>
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  <span className="inline-flex items-center gap-1 text-orange-600">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs bg-orange-500">
                      ⚠
                    </span>
                    {datos2024.canal.ingresos > 0 ? (((datos2025.canal.ingresos - datos2024.canal.ingresos) / datos2024.canal.ingresos) * 100).toFixed(2) : 0}%
                  </span>
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  <span className="inline-flex items-center gap-1 text-orange-600">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs bg-orange-500">
                      ●
                    </span>
                    {datos2024.canal.kilos > 0 ? ((((datos2025.canal.ingresos / datos2025.canal.kilos) - (datos2024.canal.ingresos / datos2024.canal.kilos)) / (datos2024.canal.ingresos / datos2024.canal.kilos)) * 100).toFixed(2) : 0}%
                  </span>
                </td>
              </tr>
              <tr className="bg-gray-50 border-t-2 border-gray-400 font-bold">
                <td className="py-3 px-4 text-gray-900">Total Var.</td>
                <td className="py-3 px-4 text-right tabular-nums">
                  <span className={parseFloat(variacionKilosTotal) >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatNumber(datos2025.totalKilos - datos2024.totalKilos)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right tabular-nums">
                  <span className={`inline-flex items-center gap-1 ${parseFloat(variacionKilosTotal) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${parseFloat(variacionKilosTotal) >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                      {parseFloat(variacionKilosTotal) >= 0 ? '↑' : '↓'}
                    </span>
                    {variacionKilosTotal}%
                  </span>
                </td>
                <td className="py-3 px-4 text-right tabular-nums">
                  <span className="inline-flex items-center gap-1 text-orange-600">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs bg-orange-500">
                      ⚠
                    </span>
                    {variacionIngresos}%
                  </span>
                </td>
                <td className="py-3 px-4 text-right tabular-nums">
                  <span className="inline-flex items-center gap-1 text-red-600">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs bg-red-500">
                      ●
                    </span>
                    {variacionPrecio}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CollapsibleTable>

      {/* Gráficos de Participación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          onClick={() => openModal(
            'Participación en Kilos 2025',
            `Distribución de ventas en 2025: Pollo en Canal representa el ${partCanal2025}% con ${formatNumber(datos2025.canal.kilos)} kg, mientras que Pollo en Pie (Mayorista) aporta el ${partPie2025}% con ${formatNumber(datos2025.pie.kilos)} kg. El canal Mayorista mostró mayor dinamismo con un crecimiento de +6.05% vs 2024.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200 cursor-pointer hover:border-green-400 transition-all"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Participación en Kilos por Canal Comercial 2025</h3>
            <Info className="w-5 h-5 text-green-400 animate-pulse" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={datosParticipacion2025}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {datosParticipacion2025.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white border-2 border-green-500 rounded-xl p-4 shadow-xl">
                      <p className="font-bold text-gray-900 mb-3 text-lg">{data.name}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-gray-600 font-medium">Kilos:</span>
                          <span className="font-bold text-gray-900">{formatNumber(data.kilos)} kg</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-green-600 font-medium">Participación:</span>
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
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-700">Pie ({partPie2025}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-700">Canal ({partCanal2025}%)</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={() => openModal(
            'Participación en Kilos 2024',
            `Distribución de ventas en 2024: Pollo en Canal representaba el ${partCanal2024}% con ${formatNumber(datos2024.canal.kilos)} kg, mientras que Pollo en Pie (Mayorista) aportaba el ${partPie2024}% con ${formatNumber(datos2024.pie.kilos)} kg. Comparando con 2025, se observa un ligero cambio en la participación debido al mayor crecimiento del canal Mayorista.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200 cursor-pointer hover:border-cyan-400 transition-all"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Participación en Kilos por Canal Comercial 2024</h3>
            <Info className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={datosParticipacion2024}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {datosParticipacion2024.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white border-2 border-cyan-500 rounded-xl p-4 shadow-xl">
                      <p className="font-bold text-gray-900 mb-3 text-lg">{data.name}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-gray-600 font-medium">Kilos:</span>
                          <span className="font-bold text-gray-900">{formatNumber(data.kilos)} kg</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-cyan-600 font-medium">Participación:</span>
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
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-700">Pie ({partPie2024}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-700">Canal ({partCanal2024}%)</span>
            </div>
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-gray-900 rounded-lg transition-colors"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
            {/* Gráfico Comparativo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        onClick={() => openModal(
          'Comparativa de Ventas 2024 vs 2025',
          `Este gráfico muestra la evolución de ventas en kilos por categoría. Pollo en Pie (Mayorista) creció +6.05% con ${formatNumber(datos2025.pie.kilos)} kg en 2025. Pollo en Canal mostró un incremento marginal de +0.03% con ${formatNumber(datos2025.canal.kilos)} kg. El crecimiento total de la compañía fue de ${variacionKilosTotal}%, impulsado principalmente por el dinamismo del canal Mayorista.`
        )}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200 cursor-pointer hover:border-blue-400 transition-all"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Ventas en Kilos por Canal Comercial 2024 vs 2025</h3>
          <Info className="w-5 h-5 text-blue-400 animate-pulse" />
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={datosComparativa}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="categoria" stroke="#64748b" />
            <YAxis stroke="#64748b" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
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
            <Bar dataKey="2024" fill="#3b82f6" name="2024" radius={[8, 8, 0, 0]} />
            <Bar dataKey="2025" fill="#10b981" name="2025" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>


    </div>
  );
}
