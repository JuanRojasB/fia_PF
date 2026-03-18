import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LabelList } from 'recharts';
import { ShoppingCart, TrendingUp, DollarSign, X, Info, Package, Percent, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';
import CollapsibleChart from '../CollapsibleChart';
import KpiCard from '../KpiCard';
import { formatCOPShort } from '../../utils/formatCurrency';
import { formatCurrencyFull } from './CustomTooltip';

export default function ComercialVentasCompaniaDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  };

  const ventasPieCanal = data?.ventasPieCanal || [];

  if (ventasPieCanal.length === 0) {
    return (
      <div className="bg-white/95 backdrop-blur-xl rounded-xl p-12 border border-gray-200 text-center">
        <div className="text-gray-600 text-lg">No hay datos disponibles de Ventas Total Companía</div>
      </div>
    );
  }

  const formatCurrency = formatCOPShort;

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  };

  const datosPorAnio = {};
  ventasPieCanal.forEach(v => {
    const anio = v.anio;
    const categoria = v.nombre_categoria || 'Sin categoria';
    if (!datosPorAnio[anio]) {
      datosPorAnio[anio] = { anio, totalKilos: 0, totalIngresos: 0, pie: { kilos: 0, ingresos: 0 }, canal: { kilos: 0, ingresos: 0 } };
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

  const variacionKilosTotal = datos2024.totalKilos > 0 ? (((datos2025.totalKilos - datos2024.totalKilos) / datos2024.totalKilos) * 100).toFixed(2) : 0;
  const variacionIngresos = datos2024.totalIngresos > 0 ? (((datos2025.totalIngresos - datos2024.totalIngresos) / datos2024.totalIngresos) * 100).toFixed(2) : 0;
  const variacionPieKilos = datos2024.pie.kilos > 0 ? (((datos2025.pie.kilos - datos2024.pie.kilos) / datos2024.pie.kilos) * 100).toFixed(2) : 0;
  const variacionCanalKilos = datos2024.canal.kilos > 0 ? (((datos2025.canal.kilos - datos2024.canal.kilos) / datos2024.canal.kilos) * 100).toFixed(2) : 0;

  const precioProm2025 = datos2025.totalKilos > 0 ? (datos2025.totalIngresos / datos2025.totalKilos).toFixed(0) : 0;
  const precioProm2024 = datos2024.totalKilos > 0 ? (datos2024.totalIngresos / datos2024.totalKilos).toFixed(0) : 0;
  const variacionPrecio = precioProm2024 > 0 ? (((precioProm2025 - precioProm2024) / precioProm2024) * 100).toFixed(2) : 0;

  const partPie2025 = datos2025.totalKilos > 0 ? ((datos2025.pie.kilos / datos2025.totalKilos) * 100).toFixed(2) : 0;
  const partCanal2025 = datos2025.totalKilos > 0 ? ((datos2025.canal.kilos / datos2025.totalKilos) * 100).toFixed(2) : 0;
  const partPie2024 = datos2024.totalKilos > 0 ? ((datos2024.pie.kilos / datos2024.totalKilos) * 100).toFixed(2) : 0;
  const partCanal2024 = datos2024.totalKilos > 0 ? ((datos2024.canal.kilos / datos2024.totalKilos) * 100).toFixed(2) : 0;

  const datosComparativa = [
    { categoria: 'Pie', '2024': datos2024.pie.kilos, '2025': datos2025.pie.kilos },
    { categoria: 'Canal', '2024': datos2024.canal.kilos, '2025': datos2025.canal.kilos },
  ];

  const datosParticipacion2025 = [
    { name: 'Pie', value: parseFloat(partPie2025), kilos: datos2025.pie.kilos },
    { name: 'Canal', value: parseFloat(partCanal2025), kilos: datos2025.canal.kilos },
  ];

  const datosParticipacion2024 = [
    { name: 'Pie', value: parseFloat(partPie2024), kilos: datos2024.pie.kilos },
    { name: 'Canal', value: parseFloat(partCanal2024), kilos: datos2024.canal.kilos },
  ];

  const COLORS = ['#3b82f6', '#10b981'];

  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500/20 to-green-600/10 backdrop-blur-xl rounded-xl p-6 border-2 border-blue-500/30">
        <div className="flex items-center gap-3 mb-4">
          <ShoppingCart className="w-8 h-8 text-blue-400" />
          <h2 className="text-3xl font-bold text-gray-900">VENTAS TOTAL COMPANIA - PIE + CANAL</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          Analisis del desempeno del negocio de pollo, comparando las ventas en kilos de pollo en pie (mayorista) y pollo en canal.
          El volumen total presento un crecimiento de +3.03% frente al 2024, alcanzando 56.356.508 kilos.
        </p>
      </motion.div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal('Ventas Totales 2025',
            <div className="space-y-4 text-gray-700">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="font-semibold text-blue-700 mb-1">Contexto del indicador</p>
                <p className="text-sm">Mide el volumen total de kilos vendidos por la compañía en el año 2025, consolidando las líneas de Pollo en Pie (Mayorista) y Pollo en Canal en todas las sedes.</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="font-semibold text-green-700 mb-2">Resultado 2025</p>
                <p className="text-sm">Total vendido: <strong>{formatNumber(datos2025.totalKilos)} kg</strong> vs {formatNumber(datos2024.totalKilos)} kg en 2024. Variación: <strong className="text-green-600">+{variacionKilosTotal}%</strong>, equivalente a {formatNumber(datos2025.totalKilos - datos2024.totalKilos)} kg adicionales.</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-300">
                <p className="font-semibold text-yellow-700 mb-2">Causas del crecimiento</p>
                <p className="text-sm">El principal motor fue la línea Mayorista (Pollo en Pie) con un crecimiento de +6.05%, que compensó el crecimiento marginal de la línea Canal (+0.03%). El dinamismo mayorista refleja mayor demanda de clientes distribuidores y expansión de cobertura.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="font-semibold text-purple-700 mb-2">Impacto en el negocio</p>
                <p className="text-sm">El crecimiento en volumen consolida la posición competitiva de Pollo Fiesta en el mercado avícola. Sin embargo, la caída en precio promedio (-{Math.abs(variacionPrecio)}%) modera el impacto positivo en ingresos, lo que exige atención a la estrategia de precios en la línea mayorista.</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Ventas Totales Compania 2025 (kg)</span>
            <Package className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 leading-tight break-all">{formatNumber(datos2025.totalKilos)} kg</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{formatNumber(datos2024.totalKilos)} kg</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{formatNumber(datos2025.totalKilos)} kg</span></div>
            <div className={`text-sm font-bold ${parseFloat(variacionKilosTotal) >= 0 ? 'text-green-600' : 'text-red-600'}`}>Var: {variacionKilosTotal > 0 ? '+' : ''}{variacionKilosTotal}%</div>
            <div className={`text-xs font-semibold ${parseFloat(variacionKilosTotal) >= 0 ? 'text-green-600' : 'text-red-600'}`}>Dif: {parseFloat(variacionKilosTotal) >= 0 ? '+' : ''}{formatNumber(datos2025.totalKilos - datos2024.totalKilos)} kg</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onClick={() => openModal('Ingresos Totales 2025 - Toda la Compania',
            <div className="space-y-4 text-gray-700">
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="font-semibold text-green-700 mb-1">Contexto del indicador</p>
                <p className="text-sm">Consolida los ingresos de todas las operaciones: Pollo en Pie (Mayorista), Pollo en Canal en todas las sedes, Huevos y demás líneas. Es el indicador de mayor alcance financiero de la compañía.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="font-semibold text-blue-700 mb-2">Resultado 2025</p>
                <p className="text-sm">Ingresos totales: <strong>{formatCurrencyFull(datos2025.totalIngresos)}</strong> vs {formatCurrencyFull(datos2024.totalIngresos)} en 2024. Variación: <strong className={parseFloat(variacionIngresos) >= 0 ? 'text-green-600' : 'text-red-600'}>{variacionIngresos > 0 ? '+' : ''}{variacionIngresos}%</strong>.</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-300">
                <p className="font-semibold text-yellow-700 mb-2">Análisis de la variación</p>
                <p className="text-sm">El crecimiento en volumen (+{variacionKilosTotal}%) fue parcialmente contrarrestado por la caída en precio promedio (-{Math.abs(variacionPrecio)}%), especialmente en la línea Mayorista (-4.19%). Esto explica que el crecimiento en ingresos sea proporcionalmente menor al crecimiento en kilos.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="font-semibold text-purple-700 mb-2">Conclusión</p>
                <p className="text-sm">La compañía logró crecer en ingresos a pesar de la presión sobre precios, gracias al incremento en volumen. La diversificación de líneas (Canal + Mayorista) actúa como amortiguador ante la volatilidad de precios del mercado avícola.</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Ingresos Totales Compania 2025</span>
            <DollarSign className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-xl font-bold text-gray-900 leading-tight break-all">{formatCurrencyFull(datos2025.totalIngresos)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{formatCurrencyFull(datos2024.totalIngresos)}</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{formatCurrencyFull(datos2025.totalIngresos)}</span></div>
            <div className={`text-sm font-bold ${parseFloat(variacionIngresos) >= 0 ? 'text-green-600' : 'text-red-600'}`}>Var: {variacionIngresos > 0 ? '+' : ''}{variacionIngresos}%</div>
            <div className={`text-xs font-semibold ${parseFloat(variacionIngresos) >= 0 ? 'text-green-600' : 'text-red-600'}`}>Dif: {parseFloat(variacionIngresos) >= 0 ? '+' : ''}{formatCurrencyFull(datos2025.totalIngresos - datos2024.totalIngresos)}</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          onClick={() => openModal('Precio Promedio 2025',
            <div className="space-y-4 text-gray-700">
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="font-semibold text-purple-700 mb-1">Contexto del indicador</p>
                <p className="text-sm">El precio promedio por kilo refleja el valor de realización del producto en el mercado. Se calcula como el cociente entre ingresos totales y kilos vendidos, consolidando todas las líneas comerciales.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="font-semibold text-blue-700 mb-2">Resultado 2025</p>
                <p className="text-sm">Precio promedio 2025: <strong>{formatCurrencyFull(precioProm2025)}/kg</strong> vs {formatCurrencyFull(precioProm2024)}/kg en 2024. Variación: <strong className={parseFloat(variacionPrecio) >= 0 ? 'text-green-600' : 'text-red-600'}>{variacionPrecio > 0 ? '+' : ''}{variacionPrecio}%</strong>.</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-300">
                <p className="font-semibold text-yellow-700 mb-2">Comportamiento por línea</p>
                <p className="text-sm">El Pollo en Canal registró un aumento de precio de +0.15%, mientras que el Pollo Mayorista presentó una disminución de -4.19%. La mezcla de líneas explica la variación consolidada del precio promedio.</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-300">
                <p className="font-semibold text-red-700 mb-2">Impacto y alerta</p>
                <p className="text-sm">La caída en precio mayorista es una señal de alerta: aunque el volumen creció, la rentabilidad por kilo se redujo en esa línea. Es necesario monitorear la evolución de precios de mercado y la estrategia de negociación con clientes mayoristas para proteger el margen.</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Precio Promedio $/kg Compania 2025</span>
            <TrendingUp className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 leading-tight break-all">{formatCurrencyFull(precioProm2025)}/kg</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{formatCurrencyFull(precioProm2024)}/kg</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{formatCurrencyFull(precioProm2025)}/kg</span></div>
            <div className={`text-sm font-bold ${parseFloat(variacionPrecio) >= 0 ? 'text-green-600' : 'text-red-600'}`}>Var: {variacionPrecio > 0 ? '+' : ''}{variacionPrecio}%</div>
            <div className={`text-xs font-semibold ${parseFloat(variacionPrecio) >= 0 ? 'text-green-600' : 'text-red-600'}`}>Dif: {parseFloat(variacionPrecio) >= 0 ? '+' : ''}{formatCurrencyFull(precioProm2025 - precioProm2024)}/kg</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          onClick={() => openModal('Variacion Total',
            <div className="space-y-4 text-gray-700">
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-300">
                <p className="font-semibold text-orange-700 mb-1">Contexto del indicador</p>
                <p className="text-sm">Mide el delta absoluto y porcentual en kilos vendidos entre 2025 y 2024, desagregado por línea comercial. Permite identificar qué segmento impulsó o frenó el crecimiento total.</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="font-semibold text-green-700 mb-2">Resultado consolidado</p>
                <p className="text-sm">Variación total: <strong className="text-green-600">+{formatNumber(datos2025.totalKilos - datos2024.totalKilos)} kg (+{variacionKilosTotal}%)</strong>. La compañía creció en volumen por segundo año consecutivo, consolidando su tendencia de expansión.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="font-semibold text-blue-700 mb-2">Desagregación por línea</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li><strong>Pollo en Pie (Mayorista):</strong> +{variacionPieKilos}% — principal motor del crecimiento, con mayor dinamismo comercial en clientes distribuidores.</li>
                  <li><strong>Pollo en Canal:</strong> +{variacionCanalKilos}% — crecimiento marginal, refleja estabilidad en los canales de distribución directa (PDV, Asadero, Institucional).</li>
                </ul>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="font-semibold text-purple-700 mb-2">Conclusión estratégica</p>
                <p className="text-sm">El crecimiento está concentrado en la línea mayorista, lo que implica una dependencia creciente de ese segmento. Diversificar el crecimiento hacia el canal directo (mayor margen) es una oportunidad estratégica para mejorar la rentabilidad global.</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Variacion Volumen 2025 vs 2024</span>
            <Percent className="w-6 h-6 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{formatNumber(datos2025.totalKilos - datos2024.totalKilos)} kg</div>
          <div className="text-xs text-orange-600">Crecimiento del {variacionKilosTotal}%</div>
        </motion.div>
      </div>

      {/* KPIs por Linea */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          onClick={() => openModal('Pollo en Pie (Mayorista)',
            <div className="space-y-4 text-gray-700">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="font-semibold text-blue-700 mb-1">Contexto del indicador</p>
                <p className="text-sm">El canal Mayorista (Pollo en Pie) representa la venta directa a distribuidores y comercializadores que adquieren el pollo sin procesar. Es el canal de mayor volumen y el de mayor sensibilidad al precio de mercado.</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="font-semibold text-green-700 mb-2">Resultado 2025</p>
                <p className="text-sm">Ventas: <strong>{formatNumber(datos2025.pie.kilos)} kg</strong> ({partPie2025}% del total). Variación vs 2024: <strong className="text-green-600">+{variacionPieKilos}%</strong>. Precio promedio: {formatCurrency(datos2025.pie.kilos > 0 ? (datos2025.pie.ingresos / datos2025.pie.kilos).toFixed(0) : 0)}/kg.</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-300">
                <p className="font-semibold text-yellow-700 mb-2">Análisis de la variación</p>
                <p className="text-sm">El crecimiento de +{variacionPieKilos}% en kilos es el más dinámico de la compañía, impulsado por mayor demanda de clientes distribuidores. Sin embargo, el precio promedio cayó -4.19%, lo que indica presión competitiva en este segmento y posible ajuste a condiciones de mercado.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="font-semibold text-purple-700 mb-2">Impacto en el negocio</p>
                <p className="text-sm">Aunque el volumen creció significativamente, la caída de precio reduce el ingreso por kilo. La estrategia debe equilibrar el crecimiento en volumen con la defensa del precio para no sacrificar margen en el canal de mayor peso.</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Pollo en Pie (Mayorista) - Kilos y Precio 2025</h3>
            <Info className="w-5 h-5 text-blue-400" />
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600">Ventas 2025</div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(datos2025.pie.kilos)} kg</div>
              <div className="text-xs text-blue-600">Participacion: {partPie2025}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Ventas 2024</div>
              <div className="text-lg font-semibold text-gray-500">{formatNumber(datos2024.pie.kilos)} kg</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Diferencia</div>
              <div className={`text-lg font-bold ${datos2025.pie.kilos - datos2024.pie.kilos >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {datos2025.pie.kilos - datos2024.pie.kilos >= 0 ? '+' : ''}{formatNumber(datos2025.pie.kilos - datos2024.pie.kilos)} kg
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Variacion vs 2024</div>
              <div className={`text-xl font-bold flex items-center gap-1 ${parseFloat(variacionPieKilos) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {parseFloat(variacionPieKilos) >= 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                {variacionPieKilos > 0 ? '+' : ''}{variacionPieKilos}%
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          onClick={() => openModal('Pollo en Canal',
            <div className="space-y-4 text-gray-700">
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="font-semibold text-green-700 mb-1">Contexto del indicador</p>
                <p className="text-sm">El canal de Pollo en Canal agrupa las ventas a través de Puntos de Venta (PDV), Asadero, Institucional y otras líneas de distribución directa. Es el canal de mayor valor agregado y precio por kilo.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="font-semibold text-blue-700 mb-2">Resultado 2025</p>
                <p className="text-sm">Ventas: <strong>{formatNumber(datos2025.canal.kilos)} kg</strong> ({partCanal2025}% del total). Variación vs 2024: <strong className={parseFloat(variacionCanalKilos) >= 0 ? 'text-green-600' : 'text-red-600'}>{variacionCanalKilos > 0 ? '+' : ''}{variacionCanalKilos}%</strong>. Precio promedio: {formatCurrency(datos2025.canal.kilos > 0 ? (datos2025.canal.ingresos / datos2025.canal.kilos).toFixed(0) : 0)}/kg.</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-300">
                <p className="font-semibold text-yellow-700 mb-2">Análisis de la variación</p>
                <p className="text-sm">El crecimiento marginal de +{variacionCanalKilos}% en kilos refleja estabilidad en los canales directos. El precio registró un aumento de +0.15%, lo que indica que este canal mantiene mejor poder de fijación de precios frente al mayorista.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="font-semibold text-purple-700 mb-2">Oportunidad estratégica</p>
                <p className="text-sm">El canal directo (Canal) ofrece mayor margen por kilo que el mayorista. Fortalecer el crecimiento en PDV, Asadero e Institucional permitiría mejorar la rentabilidad global de la compañía, reduciendo la dependencia del canal mayorista de menor precio.</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Pollo en Canal - Kilos y Precio 2025</h3>
            <Info className="w-5 h-5 text-green-400" />
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600">Ventas 2025</div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(datos2025.canal.kilos)} kg</div>
              <div className="text-xs text-green-600">Participacion: {partCanal2025}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Ventas 2024</div>
              <div className="text-lg font-semibold text-gray-500">{formatNumber(datos2024.canal.kilos)} kg</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Diferencia</div>
              <div className={`text-lg font-bold ${datos2025.canal.kilos - datos2024.canal.kilos >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {datos2025.canal.kilos - datos2024.canal.kilos >= 0 ? '+' : ''}{formatNumber(datos2025.canal.kilos - datos2024.canal.kilos)} kg
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Variacion vs 2024</div>
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
        title="VENTAS TOTAL COMPANIA - DETALLE PIE + CANAL"
        defaultOpen={false}
        totalRow={[
          { label: 'TOTAL COMPANIA 2025' },
          { label: formatNumber(datos2025.totalKilos) + ' kg', color: 'text-blue-600' },
          { label: 'Var: ' + (variacionKilosTotal > 0 ? '+' : '') + variacionKilosTotal + '%', color: parseFloat(variacionKilosTotal) >= 0 ? 'text-green-500' : 'text-red-500', badge: true, badgeColor: parseFloat(variacionKilosTotal) >= 0 ? 'bg-green-500' : 'bg-red-500', badgeIcon: parseFloat(variacionKilosTotal) >= 0 ? '↑' : '↓' },
          { label: 'Ingresos: ' + formatCurrency(datos2025.totalIngresos), color: 'text-green-600' },
        ]}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-green-600 border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 text-gray-900 font-bold">PIE + CANAL</th>
                <th className="text-right py-3 px-4 text-gray-900 font-bold">Kls.</th>
                <th className="text-right py-3 px-4 text-gray-900 font-bold">% Part</th>
                <th className="text-right py-3 px-4 text-gray-900 font-bold">Venta</th>
                <th className="text-right py-3 px-4 text-gray-900 font-bold">% Part.</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-green-50 border-b border-gray-200">
                <td className="py-2 px-4 text-gray-900 font-bold">2025</td>
                <td className="py-2 px-4 text-right text-gray-900 font-bold tabular-nums">{formatNumber(datos2025.totalKilos)}</td>
                <td className="py-2 px-4 text-right text-gray-900 font-bold tabular-nums">50,75%</td>
                <td className="py-2 px-4 text-right text-gray-900 font-bold tabular-nums">{formatCurrency(datos2025.totalIngresos)}</td>
                <td className="py-2 px-4 text-right text-gray-900 font-bold tabular-nums">50,19%</td>
              </tr>
              <tr className="border-b border-gray-200/30 hover:bg-gray-100/20">
                <td className="py-2 px-4 text-green-700 pl-8">Pie</td>
                <td className="py-2 px-4 text-right text-green-700 tabular-nums">{formatNumber(datos2025.pie.kilos)}</td>
                <td className="py-2 px-4 text-right text-green-700 tabular-nums">{partPie2025}%</td>
                <td className="py-2 px-4 text-right text-green-700 tabular-nums">{formatCurrency(datos2025.pie.ingresos)}</td>
                <td className="py-2 px-4 text-right text-green-700 tabular-nums">{datos2025.totalIngresos > 0 ? ((datos2025.pie.ingresos / datos2025.totalIngresos) * 100).toFixed(2) : 0}%</td>
              </tr>
              <tr className="border-b border-gray-200/30 hover:bg-gray-100/20">
                <td className="py-2 px-4 text-green-700 pl-8">Canal</td>
                <td className="py-2 px-4 text-right text-green-700 tabular-nums">{formatNumber(datos2025.canal.kilos)}</td>
                <td className="py-2 px-4 text-right text-green-700 tabular-nums">{partCanal2025}%</td>
                <td className="py-2 px-4 text-right text-green-700 tabular-nums">{formatCurrency(datos2025.canal.ingresos)}</td>
                <td className="py-2 px-4 text-right text-green-700 tabular-nums">{datos2025.totalIngresos > 0 ? ((datos2025.canal.ingresos / datos2025.totalIngresos) * 100).toFixed(2) : 0}%</td>
              </tr>
              <tr className="bg-blue-50 border-b border-gray-200">
                <td className="py-2 px-4 text-gray-900 font-bold">2024</td>
                <td className="py-2 px-4 text-right text-gray-900 font-bold tabular-nums">{formatNumber(datos2024.totalKilos)}</td>
                <td className="py-2 px-4 text-right text-gray-900 font-bold tabular-nums">49,25%</td>
                <td className="py-2 px-4 text-right text-gray-900 font-bold tabular-nums">{formatCurrency(datos2024.totalIngresos)}</td>
                <td className="py-2 px-4 text-right text-gray-900 font-bold tabular-nums">49,81%</td>
              </tr>
              <tr className="border-b border-gray-200/30 hover:bg-gray-100/20">
                <td className="py-2 px-4 text-blue-700 pl-8">Pie</td>
                <td className="py-2 px-4 text-right text-blue-700 tabular-nums">{formatNumber(datos2024.pie.kilos)}</td>
                <td className="py-2 px-4 text-right text-blue-700 tabular-nums">{partPie2024}%</td>
                <td className="py-2 px-4 text-right text-blue-700 tabular-nums">{formatCurrency(datos2024.pie.ingresos)}</td>
                <td className="py-2 px-4 text-right text-blue-700 tabular-nums">{datos2024.totalIngresos > 0 ? ((datos2024.pie.ingresos / datos2024.totalIngresos) * 100).toFixed(2) : 0}%</td>
              </tr>
              <tr className="border-b border-gray-200/30 hover:bg-gray-100/20">
                <td className="py-2 px-4 text-blue-700 pl-8">Canal</td>
                <td className="py-2 px-4 text-right text-blue-700 tabular-nums">{formatNumber(datos2024.canal.kilos)}</td>
                <td className="py-2 px-4 text-right text-blue-700 tabular-nums">{partCanal2024}%</td>
                <td className="py-2 px-4 text-right text-blue-700 tabular-nums">{formatCurrency(datos2024.canal.ingresos)}</td>
                <td className="py-2 px-4 text-right text-blue-700 tabular-nums">{datos2024.totalIngresos > 0 ? ((datos2024.canal.ingresos / datos2024.totalIngresos) * 100).toFixed(2) : 0}%</td>
              </tr>
              <tr className="bg-gray-50 border-t-2 border-gray-400 font-bold">
                <td className="py-3 px-4 text-gray-900">Total.</td>
                <td className="py-3 px-4 text-right text-gray-900 tabular-nums">{formatNumber(datos2025.totalKilos + datos2024.totalKilos)}</td>
                <td className="py-3 px-4 text-right text-gray-900 tabular-nums">100,00%</td>
                <td className="py-3 px-4 text-right text-gray-900 tabular-nums">{formatCurrency(datos2025.totalIngresos + datos2024.totalIngresos)}</td>
                <td className="py-3 px-4 text-right text-gray-900 tabular-nums">100,00%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tabla de Variaciones */}
        <div className="mt-6">
          <h4 className="text-lg font-bold text-gray-900 mb-3 bg-blue-500 text-white py-2 px-4 rounded">VARIACIONES</h4>
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
                  <span className={parseFloat(variacionPieKilos) >= 0 ? 'text-green-600' : 'text-red-600'}>{formatNumber(datos2025.pie.kilos - datos2024.pie.kilos)}</span>
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  <span className={`inline-flex items-center gap-1 ${parseFloat(variacionPieKilos) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${parseFloat(variacionPieKilos) >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>{parseFloat(variacionPieKilos) >= 0 ? '↑' : '↓'}</span>
                    {variacionPieKilos}%
                  </span>
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  <span className="inline-flex items-center gap-1 text-orange-600">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs bg-orange-500">!</span>
                    {datos2024.pie.ingresos > 0 ? (((datos2025.pie.ingresos - datos2024.pie.ingresos) / datos2024.pie.ingresos) * 100).toFixed(2) : 0}%
                  </span>
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  <span className="inline-flex items-center gap-1 text-red-600">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs bg-red-500">$</span>
                    {datos2024.pie.kilos > 0 ? ((((datos2025.pie.ingresos / datos2025.pie.kilos) - (datos2024.pie.ingresos / datos2024.pie.kilos)) / (datos2024.pie.ingresos / datos2024.pie.kilos)) * 100).toFixed(2) : 0}%
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-200/30 hover:bg-gray-100/20">
                <td className="py-2 px-4 text-gray-900">Canal</td>
                <td className="py-2 px-4 text-right tabular-nums">
                  <span className={parseFloat(variacionCanalKilos) >= 0 ? 'text-green-600' : 'text-red-600'}>{formatNumber(datos2025.canal.kilos - datos2024.canal.kilos)}</span>
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  <span className={`inline-flex items-center gap-1 ${parseFloat(variacionCanalKilos) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${parseFloat(variacionCanalKilos) >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>{parseFloat(variacionCanalKilos) >= 0 ? '↑' : '↓'}</span>
                    {variacionCanalKilos}%
                  </span>
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  <span className="inline-flex items-center gap-1 text-orange-600">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs bg-orange-500">!</span>
                    {datos2024.canal.ingresos > 0 ? (((datos2025.canal.ingresos - datos2024.canal.ingresos) / datos2024.canal.ingresos) * 100).toFixed(2) : 0}%
                  </span>
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  <span className="inline-flex items-center gap-1 text-orange-600">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs bg-orange-500">$</span>
                    {datos2024.canal.kilos > 0 ? ((((datos2025.canal.ingresos / datos2025.canal.kilos) - (datos2024.canal.ingresos / datos2024.canal.kilos)) / (datos2024.canal.ingresos / datos2024.canal.kilos)) * 100).toFixed(2) : 0}%
                  </span>
                </td>
              </tr>
              <tr className="bg-gray-50 border-t-2 border-gray-400 font-bold">
                <td className="py-3 px-4 text-gray-900">Total Var.</td>
                <td className="py-3 px-4 text-right tabular-nums">
                  <span className={parseFloat(variacionKilosTotal) >= 0 ? 'text-green-600' : 'text-red-600'}>{formatNumber(datos2025.totalKilos - datos2024.totalKilos)}</span>
                </td>
                <td className="py-3 px-4 text-right tabular-nums">
                  <span className={`inline-flex items-center gap-1 ${parseFloat(variacionKilosTotal) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${parseFloat(variacionKilosTotal) >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>{parseFloat(variacionKilosTotal) >= 0 ? '↑' : '↓'}</span>
                    {variacionKilosTotal}%
                  </span>
                </td>
                <td className="py-3 px-4 text-right tabular-nums">
                  <span className="inline-flex items-center gap-1 text-orange-600">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs bg-orange-500">!</span>
                    {variacionIngresos}%
                  </span>
                </td>
                <td className="py-3 px-4 text-right tabular-nums">
                  <span className="inline-flex items-center gap-1 text-red-600">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs bg-red-500">$</span>
                    {variacionPrecio}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CollapsibleTable>

      {/* Graficos de Participacion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CollapsibleChart title="Participacion en Kilos por Canal Comercial 2025" defaultOpen={false}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={datosParticipacion2025} cx="50%" cy="50%" labelLine={false}
                label={({ name, value }) => name + ': ' + value + '%'}
                outerRadius={100} dataKey="value">
                {datosParticipacion2025.map((entry, index) => (
                  <Cell key={'cell-' + index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-white border-2 border-green-500 rounded-xl p-4 shadow-xl">
                      <p className="font-bold text-gray-900 mb-3 text-lg">{d.name}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-gray-600 font-medium">Kilos:</span>
                          <span className="font-bold text-gray-900">{formatNumber(d.kilos)} kg</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-green-600 font-medium">Participacion:</span>
                          <span className="font-bold text-gray-900">{d.value.toFixed(2)}%</span>
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
        </CollapsibleChart>

        <CollapsibleChart title="Participacion en Kilos por Canal Comercial 2024" defaultOpen={false}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={datosParticipacion2024} cx="50%" cy="50%" labelLine={false}
                label={({ name, value }) => name + ': ' + value + '%'}
                outerRadius={100} dataKey="value">
                {datosParticipacion2024.map((entry, index) => (
                  <Cell key={'cell-' + index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-white border-2 border-cyan-500 rounded-xl p-4 shadow-xl">
                      <p className="font-bold text-gray-900 mb-3 text-lg">{d.name}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-gray-600 font-medium">Kilos:</span>
                          <span className="font-bold text-gray-900">{formatNumber(d.kilos)} kg</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-cyan-600 font-medium">Participacion:</span>
                          <span className="font-bold text-gray-900">{d.value.toFixed(2)}%</span>
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
        </CollapsibleChart>
      </div>

      {/* Grafico Comparativo */}
      <CollapsibleChart title="Ventas en Kilos por Canal Comercial 2024 vs 2025" defaultOpen={false}>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={datosComparativa}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="categoria" stroke="#64748b" />
            <YAxis stroke="#64748b" tickFormatter={(value) => (value / 1000000).toFixed(0) + 'M'} width={60} />
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
                          <span className={`font-bold ${diferencia >= 0 ? 'text-green-600' : 'text-red-600'}`}>{diferencia >= 0 ? '+' : ''}{formatNumber(diferencia)} kg</span>
                        </div>
                        <div className="flex justify-between items-center gap-4 mt-1">
                          <span className="text-gray-600 font-medium">Variacion:</span>
                          <span className={`font-bold ${variacion >= 0 ? 'text-green-600' : 'text-red-600'}`}>{variacion >= 0 ? '+' : ''}{variacion}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }} />
            <Bar dataKey="2024" fill="#3b82f6" name="2024" radius={[8, 8, 0, 0]}>
              <LabelList dataKey="2024" position="top" style={{ fontSize: '10px', fontWeight: 'bold', fill: '#3b82f6' }} formatter={() => '2024'} />
            </Bar>
            <Bar dataKey="2025" fill="#10b981" name="2025" radius={[8, 8, 0, 0]}>
              <LabelList dataKey="2025" position="top" style={{ fontSize: '10px', fontWeight: 'bold', fill: '#10b981' }} formatter={() => '2025'} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CollapsibleChart>

      {/* Modal */}
      {createPortal(
        <AnimatePresence>
          {modalOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
              onClick={() => setModalOpen(false)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-blue-500 shadow-2xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Info className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-bold text-gray-900">{modalContent.title}</h3>
                  </div>
                  <button onClick={() => setModalOpen(false)} className="text-gray-600 hover:text-gray-900 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="overflow-y-auto flex-1 pr-2 text-gray-700 leading-relaxed">{modalContent.content}</div>
                <div className="mt-6 flex justify-end">
                  <button onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    Entendido
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>, document.body
      )}

    </div>
  );
}
