import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart, LabelList } from 'recharts';
import { Egg, TrendingUp, X, Info, Target, Award, Activity } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';
import CollapsibleChart from '../CollapsibleChart';
import KpiCard from '../KpiCard';

export default function ProduccionHuevosDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  };

  console.log('ProduccionHuevosDashboard - Datos recibidos:', data);

  if (!data || typeof data !== 'object') {
    return <div className="text-gray-600">No hay datos disponibles</div>;
  }

  const {
    zootecniaHuevo = []
  } = data;

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDecimal = (value, decimals = 2) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };

  // Calcular métricas adicionales - USAR ZOOTECNIA HUEVO
  const resumenActual = zootecniaHuevo[0] || {};
  const resumenAnterior = zootecniaHuevo[1] || {};
  
  const totalHuevos2025 = parseInt(resumenActual.huevos_producidos) || 0;
  const totalHuevos2024 = parseInt(resumenAnterior.huevos_producidos) || 0;
  const variacionHuevos = totalHuevos2024 > 0 ? (((totalHuevos2025 - totalHuevos2024) / totalHuevos2024) * 100).toFixed(1) : 0;
  
  const aves2025 = parseInt(resumenActual.saldo_inicial_aves) || 0;
  const aves2024 = parseInt(resumenAnterior.saldo_inicial_aves) || 0;
  
  const productividadReal2025 = parseFloat(resumenActual.huevos_producidos_real_x_ave_mes) || 0;
  const productividadReal2024 = parseFloat(resumenAnterior.huevos_producidos_real_x_ave_mes) || 0;
  const productividadTabla2025 = parseFloat(resumenActual.huevos_producidos_tabla_x_ave_mes) || 0;
  
  // Diferencia de productividad 2025 vs 2024
  const diferenciaProductividad = productividadReal2025 - productividadReal2024;
  const variacionProductividad = productividadReal2024 > 0 ? (((productividadReal2025 - productividadReal2024) / productividadReal2024) * 100).toFixed(1) : 0;

  // Preparar datos para gráficos comparativos - USAR ZOOTECNIA HUEVO
  const datosComparativos = zootecniaHuevo.map(r => {
    // Parsear variaciones de cada año
    let varRel = {};
    try {
      varRel = r.variacion_relativa_pct ? JSON.parse(r.variacion_relativa_pct) : {};
    } catch (e) {
      console.error('Error parsing variations:', e);
    }
    
    return {
      anio: r.anio,
      huevos: parseInt(r.huevos_producidos) || 0,
      aves: parseInt(r.saldo_inicial_aves) || 0,
      productividad: parseFloat(r.huevos_producidos_real_x_ave_mes) || 0,
      estandar: parseFloat(r.huevos_producidos_tabla_x_ave_mes) || 0,
      mortalidadReal: parseFloat(r.mortalidad_aves_real_pct) || 0,
      mortalidadTabla: parseFloat(r.mortalidad_aves_tabla_pct) || 0,
      consumoReal: parseFloat(r.consumo_alimento_x_ave_kg_real) || 0,
      consumoTabla: parseFloat(r.consumo_alimento_x_ave_kg_tabla) || 0,
      huevosEnviados: parseInt(r.huevos_enviados_bodega) || 0,
      inventarioFinal: parseInt(r.inventario_final_huevo) || 0,
      consumoAlimentoKL: parseInt(r.consumo_alimento_balanceado_kl) || 0
    };
  }).reverse();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Activity className="w-8 h-8 text-yellow-400" />
        <h2 className="text-2xl font-bold text-gray-900">INDICADORES TÉCNICOS - GRANJAS AVES (POSTURA DE HUEVO)</h2>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Huevos producidos 2025 vs 2024 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-yellow-500/30 hover:border-yellow-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Huevos Producidos 2025 vs 2024',
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">2024</p>
                  <p className="text-xl font-bold text-gray-900">{formatNumber(totalHuevos2024)} huevos</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                  <p className="text-xs text-yellow-600 font-semibold mb-1">2025</p>
                  <p className="text-xl font-bold text-yellow-700">{formatNumber(totalHuevos2025)} huevos</p>
                </div>
              </div>
              <div className={`rounded-lg p-4 border ${parseFloat(variacionHuevos) >= 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <p className={`text-sm font-semibold mb-2 ${parseFloat(variacionHuevos) >= 0 ? 'text-green-800' : 'text-red-800'}`}>Variación:</p>
                <p className="text-sm text-gray-700">La producción <strong className={parseFloat(variacionHuevos) >= 0 ? 'text-green-600' : 'text-red-600'}>{parseFloat(variacionHuevos) >= 0 ? 'creció' : 'cayó'} {variacionHuevos > 0 ? '+' : ''}{variacionHuevos}%</strong> respecto al año anterior.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Contexto:</p>
                <p className="text-sm text-gray-700">Con <strong>{formatNumber(aves2025)}</strong> aves en producción en 2025 vs <strong>{formatNumber(aves2024)}</strong> en 2024. El volumen de producción está directamente relacionado con el tamaño del plantel y la productividad por ave.</p>
              </div>
            </div>
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Huevos Producidos 2025 vs 2024</span>
            <Egg className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatNumber(totalHuevos2025)}</div>
          <div className="text-sm text-gray-600 mt-1">Total anual 2025</div>
          <div className="mt-3 pt-3 border-t border-gray-200 text-xs space-y-0.5">
            <div className="text-gray-500">2024: <span className="font-semibold text-gray-700">{formatNumber(totalHuevos2024)}</span></div>
            <div className="text-gray-500">2025: <span className="font-semibold text-gray-700">{formatNumber(totalHuevos2025)}</span></div>
            <div className={`font-bold ${parseFloat(variacionHuevos) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              Var: {parseFloat(variacionHuevos) >= 0 ? '+' : ''}{variacionHuevos}%
            </div>
            <div className={`text-xs font-semibold ${parseFloat(variacionHuevos) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              Dif: {totalHuevos2025 - totalHuevos2024 >= 0 ? '+' : ''}{formatNumber(totalHuevos2025 - totalHuevos2024)}
            </div>
          </div>
        </motion.div>

        {/* KPI 2: Aves en producción 2025 vs 2024 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Aves en Producción 2025 vs 2024',
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">2024</p>
                  <p className="text-xl font-bold text-gray-900">{formatNumber(aves2024)} aves</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <p className="text-xs text-green-600 font-semibold mb-1">2025</p>
                  <p className="text-xl font-bold text-green-700">{formatNumber(aves2025)} aves</p>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">¿Qué representa?</p>
                <p className="text-sm text-gray-700">El saldo inicial de aves es el inventario de gallinas ponedoras al inicio del período. Es la base para calcular la productividad por ave y determinar la capacidad productiva del plantel.</p>
              </div>
              <div className={`rounded-lg p-4 border ${aves2025 >= aves2024 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <p className={`text-sm font-semibold mb-2 ${aves2025 >= aves2024 ? 'text-green-800' : 'text-red-800'}`}>Impacto:</p>
                <p className="text-sm text-gray-700">{aves2025 >= aves2024 ? 'Un mayor plantel permite incrementar la producción total de huevos, siempre que la productividad por ave se mantenga.' : 'Una reducción en el plantel puede impactar el volumen total de producción si no se compensa con mayor productividad por ave.'}</p>
              </div>
            </div>
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Aves en Producción 2025 vs 2024</span>
            <Egg className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatNumber(aves2025)}</div>
          <div className="text-sm text-gray-600 mt-1">Saldo inicial aves 2025</div>
          <div className="mt-3 pt-3 border-t border-gray-200 text-xs space-y-0.5">
            <div className="text-gray-500">2024: <span className="font-semibold text-gray-700">{formatNumber(aves2024)}</span></div>
            <div className="text-gray-500">2025: <span className="font-semibold text-gray-700">{formatNumber(aves2025)}</span></div>
            <div className={`font-bold ${aves2025 >= aves2024 ? 'text-green-500' : 'text-red-500'}`}>
              Var: {aves2024 > 0 ? `${aves2025 >= aves2024 ? '+' : ''}${(((aves2025 - aves2024) / aves2024) * 100).toFixed(1)}%` : 'N/A'}
            </div>
            <div className={`text-xs font-semibold ${aves2025 >= aves2024 ? 'text-green-500' : 'text-red-500'}`}>
              Dif: {aves2025 - aves2024 >= 0 ? '+' : ''}{formatNumber(aves2025 - aves2024)} aves
            </div>
          </div>
        </motion.div>

        {/* KPI 3: Productividad Real vs Tabla 2025 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Productividad Real vs Tabla 2025',
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-blue-600 font-semibold mb-1">Valor de Tabla (Estándar)</p>
                  <p className="text-xl font-bold text-blue-700">{formatDecimal(productividadTabla2025)} h/g/mes</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <p className="text-xs text-purple-600 font-semibold mb-1">Productividad Real</p>
                  <p className="text-xl font-bold text-purple-700">{formatDecimal(productividadReal2025)} h/g/mes</p>
                </div>
              </div>
              <div className={`rounded-lg p-4 border ${productividadReal2025 >= productividadTabla2025 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <p className={`text-sm font-semibold mb-2 ${productividadReal2025 >= productividadTabla2025 ? 'text-green-800' : 'text-red-800'}`}>Resultado vs Estándar:</p>
                <p className="text-sm text-gray-700">Diferencia: <strong className={productividadReal2025 >= productividadTabla2025 ? 'text-green-600' : 'text-red-600'}>{productividadReal2025 >= productividadTabla2025 ? '+' : ''}{formatDecimal(productividadReal2025 - productividadTabla2025)} huevos/gallina/mes</strong> ({productividadReal2025 >= productividadTabla2025 ? 'por encima' : 'por debajo'} del estándar).</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-300">
                <p className="text-sm font-semibold text-yellow-800 mb-2">Fuente del estándar:</p>
                <p className="text-sm text-gray-700">El valor de tabla proviene de la genética Hy-Line Brown, que establece los parámetros de producción esperados según la edad del lote. Superar este estándar indica un manejo nutricional y sanitario óptimo.</p>
              </div>
            </div>
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Productividad Real vs Tabla 2025</span>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatDecimal(productividadReal2025)}</div>
          <div className="text-sm text-gray-600 mt-1">huevos/gallina/mes (real)</div>
          <div className="mt-3 pt-3 border-t border-gray-200 text-xs space-y-0.5">
            <div className="text-gray-500">Tabla: <span className="font-semibold text-gray-700">{formatDecimal(productividadTabla2025)}</span></div>
            <div className="text-gray-500">Real: <span className="font-semibold text-gray-700">{formatDecimal(productividadReal2025)}</span></div>
            <div className={`font-bold ${productividadReal2025 >= productividadTabla2025 ? 'text-green-500' : 'text-red-500'}`}>
              Dif: {productividadReal2025 >= productividadTabla2025 ? '+' : ''}{formatDecimal(productividadReal2025 - productividadTabla2025)}
            </div>
          </div>
        </motion.div>

        {/* KPI 4: Productividad Real 2025 vs 2024 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Productividad Real 2025 vs 2024',
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">2024</p>
                  <p className="text-xl font-bold text-gray-900">{formatDecimal(productividadReal2024)} h/g/mes</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-blue-600 font-semibold mb-1">2025</p>
                  <p className="text-xl font-bold text-blue-700">{formatDecimal(productividadReal2025)} h/g/mes</p>
                </div>
              </div>
              <div className={`rounded-lg p-4 border ${diferenciaProductividad >= 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <p className={`text-sm font-semibold mb-2 ${diferenciaProductividad >= 0 ? 'text-green-800' : 'text-red-800'}`}>Variación interanual:</p>
                <p className="text-sm text-gray-700">La productividad real <strong className={diferenciaProductividad >= 0 ? 'text-green-600' : 'text-red-600'}>{diferenciaProductividad > 0 ? 'mejoró' : 'bajó'} {diferenciaProductividad > 0 ? '+' : ''}{formatDecimal(diferenciaProductividad)} h/g/mes ({variacionProductividad > 0 ? '+' : ''}{variacionProductividad}%)</strong> respecto a 2024.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Fórmula:</p>
                <p className="text-sm text-gray-700 font-mono">({formatDecimal(productividadReal2025)} - {formatDecimal(productividadReal2024)}) / {formatDecimal(productividadReal2024)} × 100 = {variacionProductividad > 0 ? '+' : ''}{variacionProductividad}%</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                <p className="text-sm text-gray-700">{diferenciaProductividad >= 0 ? 'Una mayor productividad por ave permite producir más huevos con el mismo plantel, mejorando la eficiencia del capital invertido en aves.' : 'Una menor productividad por ave puede indicar factores como envejecimiento del lote, problemas nutricionales o sanitarios que requieren atención.'}</p>
              </div>
            </div>
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Productividad Real 2025 vs 2024</span>
            {diferenciaProductividad >= 0 ? <Award className="w-5 h-5 text-blue-400" /> : <Target className="w-5 h-5 text-orange-400" />}
          </div>
          <div className="text-3xl font-bold text-gray-900">{diferenciaProductividad > 0 ? '+' : ''}{formatDecimal(diferenciaProductividad)}</div>
          <div className="text-sm text-gray-600 mt-1">huevos/gallina/mes</div>
          <div className="mt-3 pt-3 border-t border-gray-200 text-xs space-y-0.5">
            <div className="text-gray-500">2024: <span className="font-semibold text-gray-700">{formatDecimal(productividadReal2024)}</span></div>
            <div className="text-gray-500">2025: <span className="font-semibold text-gray-700">{formatDecimal(productividadReal2025)}</span></div>
            <div className={`font-bold ${parseFloat(variacionProductividad) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              Var: {parseFloat(variacionProductividad) >= 0 ? '+' : ''}{variacionProductividad}%
            </div>
            <div className={`text-xs font-semibold ${parseFloat(variacionProductividad) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              Dif: {diferenciaProductividad >= 0 ? '+' : ''}{formatDecimal(diferenciaProductividad)} h/g/mes
            </div>
          </div>
        </motion.div>
      </div>

      {/* TABLA COMPARATIVA COMPLETA 2025 vs 2024 */}
      {zootecniaHuevo.length >= 2 && (
        <CollapsibleTable 
          title="COMPARATIVO DATOS ZOOTÉCNICOS GRANJAS HUEVO 2025-2024"
          defaultOpen={false}
          totalRow={[
            { label: 'Indicadores Clave 2025' },
            { label: `Huevos: ${formatNumber(totalHuevos2025)}`, color: 'text-yellow-500' },
            { label: `Aves: ${formatNumber(aves2025)}`, color: 'text-blue-500' },
            { label: `Productividad: ${formatDecimal(productividadReal2025)} h/g/mes`, color: 'text-green-500' },
            { label: `Var: ${variacionHuevos > 0 ? '+' : ''}${variacionHuevos}%`, color: parseFloat(variacionHuevos) >= 0 ? 'text-green-500' : 'text-red-500' },
          ]}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-green-600">
                  <th className="text-left py-3 px-4 text-gray-700 font-bold bg-green-900/30">INDICADOR</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-bold bg-blue-900/30">2025</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-bold bg-gray-100/30">2024</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-bold bg-purple-900/30">VAR. ABSOLUTA</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-bold bg-orange-900/30">VAR. RELATIVA</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  // Parsear las variaciones del JSON
                  let varAbs = {};
                  let varRel = {};
                  try {
                    varAbs = resumenActual.variacion_absoluta ? JSON.parse(resumenActual.variacion_absoluta) : {};
                    varRel = resumenActual.variacion_relativa_pct ? JSON.parse(resumenActual.variacion_relativa_pct) : {};
                  } catch (e) {
                    console.error('Error parsing variations:', e);
                  }
                  
                  return (
                    <>
                      {/* Saldo Inicial de Aves */}
                      <tr className="border-b border-gray-200/50 hover:bg-gray-100/30 transition-colors">
                        <td className="py-3 px-4 text-gray-900 font-semibold">SALDO INICIAL DE AVES</td>
                        <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatNumber(resumenActual.saldo_inicial_aves)}</td>
                        <td className="py-3 px-4 text-right text-gray-600">{formatNumber(resumenAnterior.saldo_inicial_aves)}</td>
                        <td className="py-3 px-4 text-right text-purple-400">{formatNumber(varAbs.saldo_inicial_aves || 0)}</td>
                        <td className={`py-3 px-4 text-right font-bold ${(varRel.saldo_inicial_aves || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatDecimal(varRel.saldo_inicial_aves || 0)}%
                        </td>
                      </tr>

                      {/* Mortalidad de Aves */}
                      <tr className="border-b border-gray-200/50 hover:bg-gray-100/30 transition-colors">
                        <td className="py-3 px-4 text-gray-900 font-semibold">MORTALIDAD DE AVES</td>
                        <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatNumber(resumenActual.mortalidad_aves)}</td>
                        <td className="py-3 px-4 text-right text-gray-600">{formatNumber(resumenAnterior.mortalidad_aves)}</td>
                        <td className="py-3 px-4 text-right text-purple-400">{formatNumber(varAbs.mortalidad_aves || 0)}</td>
                        <td className={`py-3 px-4 text-right font-bold ${(varRel.mortalidad_aves || 0) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {formatDecimal(varRel.mortalidad_aves || 0)}%
                        </td>
                      </tr>

                      {/* Mortalidad Tabla % */}
                      <tr className="border-b border-gray-200/50 hover:bg-gray-100/30 transition-colors">
                        <td className="py-3 px-4 text-gray-900 font-semibold">MORTALIDAD DE AVES TABLA %</td>
                        <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatDecimal(resumenActual.mortalidad_aves_tabla_pct)}%</td>
                        <td className="py-3 px-4 text-right text-gray-600">{formatDecimal(resumenAnterior.mortalidad_aves_tabla_pct)}%</td>
                        <td className="py-3 px-4 text-right text-purple-400">{formatDecimal(varAbs.mortalidad_aves_tabla_pct || 0)}</td>
                        <td className={`py-3 px-4 text-right font-bold ${(varRel.mortalidad_aves_tabla_pct || 0) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {formatDecimal(varRel.mortalidad_aves_tabla_pct || 0)}%
                        </td>
                      </tr>

                      {/* Mortalidad Real % */}
                      <tr className="border-b border-gray-200/50 hover:bg-gray-100/30 transition-colors">
                        <td className="py-3 px-4 text-gray-900 font-semibold">MORTALIDAD DE AVES REAL %</td>
                        <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatDecimal(resumenActual.mortalidad_aves_real_pct)}%</td>
                        <td className="py-3 px-4 text-right text-gray-600">{formatDecimal(resumenAnterior.mortalidad_aves_real_pct)}%</td>
                        <td className="py-3 px-4 text-right text-purple-400">{formatDecimal(varAbs.mortalidad_aves_real_pct || 0)}</td>
                        <td className={`py-3 px-4 text-right font-bold ${(varRel.mortalidad_aves_real_pct || 0) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {formatDecimal(varRel.mortalidad_aves_real_pct || 0)}%
                        </td>
                      </tr>

                      {/* Venta o Selección de Aves */}
                      <tr className="border-b border-gray-200/50 hover:bg-gray-100/30 transition-colors">
                        <td className="py-3 px-4 text-gray-900 font-semibold">VENTA O SELECCIÓN DE AVES</td>
                        <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatNumber(resumenActual.venta_seleccion_aves)}</td>
                        <td className="py-3 px-4 text-right text-gray-600">{formatNumber(resumenAnterior.venta_seleccion_aves)}</td>
                        <td className="py-3 px-4 text-right text-purple-400">{formatNumber(varAbs.venta_seleccion_aves || 0)}</td>
                        <td className={`py-3 px-4 text-right font-bold ${(varRel.venta_seleccion_aves || 0) >= 0 ? 'text-orange-400' : 'text-cyan-400'}`}>
                          {formatDecimal(varRel.venta_seleccion_aves || 0)}%
                        </td>
                      </tr>

                      {/* Huevos Producidos */}
                      <tr className="border-b-2 border-yellow-600 bg-yellow-900/10 hover:bg-yellow-900/20 transition-colors">
                        <td className="py-3 px-4 text-yellow-300 font-bold">HUEVOS PRODUCIDOS</td>
                        <td className="py-3 px-4 text-right text-yellow-400 font-bold text-lg">{formatNumber(resumenActual.huevos_producidos)}</td>
                        <td className="py-3 px-4 text-right text-gray-600">{formatNumber(resumenAnterior.huevos_producidos)}</td>
                        <td className="py-3 px-4 text-right text-purple-400 font-bold">{formatNumber(varAbs.huevos_producidos || 0)}</td>
                        <td className={`py-3 px-4 text-right font-bold text-lg ${(varRel.huevos_producidos || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatDecimal(varRel.huevos_producidos || 0)}%
                        </td>
                      </tr>

                      {/* Huevos Enviados a Bodega */}
                      <tr className="border-b border-gray-200/50 hover:bg-gray-100/30 transition-colors">
                        <td className="py-3 px-4 text-gray-900 font-semibold">HUEVOS ENVIADOS A BODEGA</td>
                        <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatNumber(resumenActual.huevos_enviados_bodega)}</td>
                        <td className="py-3 px-4 text-right text-gray-600">{formatNumber(resumenAnterior.huevos_enviados_bodega)}</td>
                        <td className="py-3 px-4 text-right text-purple-400">{formatNumber(varAbs.huevos_enviados_bodega || 0)}</td>
                        <td className={`py-3 px-4 text-right font-bold ${(varRel.huevos_enviados_bodega || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatDecimal(varRel.huevos_enviados_bodega || 0)}%
                        </td>
                      </tr>

                      {/* Inventario Final Huevo */}
                      <tr className="border-b border-gray-200/50 hover:bg-gray-100/30 transition-colors">
                        <td className="py-3 px-4 text-gray-900 font-semibold">INVENTARIO FINAL HUEVO</td>
                        <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatNumber(resumenActual.inventario_final_huevo)}</td>
                        <td className="py-3 px-4 text-right text-gray-600">{formatNumber(resumenAnterior.inventario_final_huevo)}</td>
                        <td className="py-3 px-4 text-right text-purple-400">{formatNumber(varAbs.inventario_final_huevo || 0)}</td>
                        <td className={`py-3 px-4 text-right font-bold ${(varRel.inventario_final_huevo || 0) >= 0 ? 'text-orange-400' : 'text-cyan-400'}`}>
                          {formatDecimal(varRel.inventario_final_huevo || 0)}%
                        </td>
                      </tr>

                      {/* Huevos Producidos Tabla x Ave Mes */}
                      <tr className="border-b border-gray-200/50 hover:bg-gray-100/30 transition-colors">
                        <td className="py-3 px-4 text-gray-900 font-semibold">HUEVOS PRODUCIDOS TABLA X AVE MES</td>
                        <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatDecimal(resumenActual.huevos_producidos_tabla_x_ave_mes)}</td>
                        <td className="py-3 px-4 text-right text-gray-600">{formatDecimal(resumenAnterior.huevos_producidos_tabla_x_ave_mes)}</td>
                        <td className="py-3 px-4 text-right text-purple-400">{formatDecimal(varAbs.huevos_producidos_tabla_x_ave_mes || 0)}</td>
                        <td className={`py-3 px-4 text-right font-bold ${(varRel.huevos_producidos_tabla_x_ave_mes || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatDecimal(varRel.huevos_producidos_tabla_x_ave_mes || 0)}%
                        </td>
                      </tr>

                      {/* Huevos Producidos Real x Ave Mes */}
                      <tr className="border-b-2 border-green-600 bg-green-900/10 hover:bg-green-900/20 transition-colors">
                        <td className="py-3 px-4 text-green-300 font-bold">HUEVOS PRODUCIDOS REAL X AVE MES</td>
                        <td className="py-3 px-4 text-right text-green-400 font-bold text-lg">{formatDecimal(resumenActual.huevos_producidos_real_x_ave_mes)}</td>
                        <td className="py-3 px-4 text-right text-gray-600">{formatDecimal(resumenAnterior.huevos_producidos_real_x_ave_mes)}</td>
                        <td className="py-3 px-4 text-right text-purple-400 font-bold">{formatDecimal(varAbs.huevos_producidos_real_x_ave_mes || 0)}</td>
                        <td className={`py-3 px-4 text-right font-bold text-lg ${(varRel.huevos_producidos_real_x_ave_mes || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatDecimal(varRel.huevos_producidos_real_x_ave_mes || 0)}%
                        </td>
                      </tr>

                      {/* Consumo Alimento Tabla */}
                      <tr className="border-b border-gray-200/50 hover:bg-gray-100/30 transition-colors">
                        <td className="py-3 px-4 text-gray-900 font-semibold">CONSUMO DE ALIMENTO X AVE (kg) TABLA</td>
                        <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatDecimal(resumenActual.consumo_alimento_x_ave_kg_tabla)}</td>
                        <td className="py-3 px-4 text-right text-gray-600">{formatDecimal(resumenAnterior.consumo_alimento_x_ave_kg_tabla)}</td>
                        <td className="py-3 px-4 text-right text-purple-400">{formatDecimal(varAbs.consumo_alimento_x_ave_kg_tabla || 0)}</td>
                        <td className={`py-3 px-4 text-right font-bold ${(varRel.consumo_alimento_x_ave_kg_tabla || 0) >= 0 ? 'text-orange-400' : 'text-green-400'}`}>
                          {formatDecimal(varRel.consumo_alimento_x_ave_kg_tabla || 0)}%
                        </td>
                      </tr>

                      {/* Consumo Alimento Real */}
                      <tr className="border-b border-gray-200/50 hover:bg-gray-100/30 transition-colors">
                        <td className="py-3 px-4 text-gray-900 font-semibold">CONSUMO DE ALIMENTO X AVE (kg) REAL</td>
                        <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatDecimal(resumenActual.consumo_alimento_x_ave_kg_real)}</td>
                        <td className="py-3 px-4 text-right text-gray-600">{formatDecimal(resumenAnterior.consumo_alimento_x_ave_kg_real)}</td>
                        <td className="py-3 px-4 text-right text-purple-400">{formatDecimal(varAbs.consumo_alimento_x_ave_kg_real || 0)}</td>
                        <td className={`py-3 px-4 text-right font-bold ${(varRel.consumo_alimento_x_ave_kg_real || 0) >= 0 ? 'text-orange-400' : 'text-green-400'}`}>
                          {formatDecimal(varRel.consumo_alimento_x_ave_kg_real || 0)}%
                        </td>
                      </tr>

                      {/* Consumo Alimento Balanceado Total */}
                      <tr className="border-b-2 border-cyan-600 bg-cyan-900/10 hover:bg-cyan-900/20 transition-colors">
                        <td className="py-3 px-4 text-cyan-300 font-bold">CONSUMO ALIMENTO BALANCEADO KL</td>
                        <td className="py-3 px-4 text-right text-cyan-400 font-bold text-lg">{formatNumber(resumenActual.consumo_alimento_balanceado_kl)}</td>
                        <td className="py-3 px-4 text-right text-gray-600">{formatNumber(resumenAnterior.consumo_alimento_balanceado_kl)}</td>
                        <td className="py-3 px-4 text-right text-purple-400 font-bold">{formatNumber(varAbs.consumo_alimento_balanceado_kl || 0)}</td>
                        <td className={`py-3 px-4 text-right font-bold text-lg ${(varRel.consumo_alimento_balanceado_kl || 0) >= 0 ? 'text-orange-400' : 'text-green-400'}`}>
                          {formatDecimal(varRel.consumo_alimento_balanceado_kl || 0)}%
                        </td>
                      </tr>
                    </>
                  );
                })()}
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-gray-100/30 rounded-lg p-4 border border-gray-300">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-gray-900">Análisis Comparativo:</span> Esta tabla muestra todos los indicadores zootécnicos de producción de huevo comparando 2025 vs 2024. Los valores en verde indican mejoras, mientras que los rojos señalan áreas que requieren atención. La variación relativa permite identificar rápidamente los cambios porcentuales más significativos en cada indicador.
            </p>
          </div>
        </CollapsibleTable>
      )}

      {/* Modal de Explicación */}
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
              <div className="overflow-y-auto flex-1 pr-2 text-gray-700 leading-relaxed">
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

