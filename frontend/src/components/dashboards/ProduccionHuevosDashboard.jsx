import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { Egg, TrendingUp, Target, Award, Activity } from 'lucide-react';
import InfoModal from '../InfoModal';

export default function ProduccionHuevosDashboard({ data }) {
  const [modalInfo, setModalInfo] = useState(null);

  const showModal = (title, content) => {
    setModalInfo({ title, content });
  };

  const closeModal = () => {
    setModalInfo(null);
  };

  console.log('ProduccionHuevosDashboard - Datos recibidos:', data);

  if (!data || typeof data !== 'object') {
    return <div className="text-gray-400">No hay datos disponibles</div>;
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
  
  const productividadReal2025 = parseFloat(resumenActual.huevos_producidos_real_x_ave_mes) || 0;
  const productividadTabla2025 = parseFloat(resumenActual.huevos_producidos_tabla_x_ave_mes) || 0;
  
  // Parsear variaciones de la BD
  let varRelActual = {};
  try {
    varRelActual = resumenActual.variacion_relativa_pct ? JSON.parse(resumenActual.variacion_relativa_pct) : {};
  } catch (e) {
    console.error('Error parsing variations:', e);
  }
  const mejoraVsEstandar = varRelActual.huevos_producidos_real_x_ave_mes || 0;

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
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-yellow-500/30 hover:border-yellow-500 transition-all cursor-pointer"
          onClick={() => showModal(
            'Producción Total de Huevos 2025',
            `Se produjeron ${formatNumber(totalHuevos2025)} huevos durante el año 2025 con ${formatNumber(aves2025)} aves en producción. La producción de huevos es el resultado de la eficiencia reproductiva de las gallinas ponedoras, influenciada por genética, nutrición, manejo, bioseguridad y condiciones ambientales. En 2024 se produjeron ${formatNumber(totalHuevos2024)} huevos.`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Huevos Producidos 2025</span>
            <Egg className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-white">{formatNumber(totalHuevos2025)}</div>
          <div className="text-sm text-gray-400 mt-1">Total anual</div>
          <div className="mt-3 pt-3 border-t border-slate-700">
            <div className="text-xs text-gray-500">Aves en producción 2025</div>
            <div className="text-lg font-semibold text-yellow-400">{formatNumber(aves2025)}</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
          onClick={() => showModal(
            'Productividad Real por Gallina',
            `La productividad real es de ${formatDecimal(productividadReal2025)} huevos por gallina al mes. El estándar de la industria es de ${formatDecimal(productividadTabla2025)} huevos por gallina al mes. Este indicador mide la eficiencia reproductiva de las aves y es clave para evaluar el retorno de inversión en la operación de postura.`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Huevos/Gallina/Mes Real</span>
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">{formatDecimal(productividadReal2025)}</div>
          <div className="text-sm text-gray-400 mt-1">huevos por gallina al mes</div>
          <div className="mt-3 pt-3 border-t border-slate-700">
            <div className="text-xs text-gray-500">Estándar tabla</div>
            <div className="text-lg font-semibold text-blue-400">{formatDecimal(productividadTabla2025)}</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
          onClick={() => showModal(
            'Diferencia vs Estándar Industria',
            `La productividad real es de ${formatDecimal(productividadReal2025)} huevos/gallina/mes, comparado con el estándar de ${formatDecimal(productividadTabla2025)} huevos/gallina/mes. La diferencia absoluta es de ${formatDecimal(productividadReal2025 - productividadTabla2025)} huevos más por gallina al mes. ${productividadReal2025 > productividadTabla2025 ? 'Esta mejora indica excelencia en genética, nutrición, manejo y bioseguridad, traduciéndose en mayor rentabilidad por ave.' : 'Hay oportunidad de mejora para alcanzar el estándar de la industria.'}`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Diferencia vs Estándar</span>
            {productividadReal2025 > productividadTabla2025 ? <Award className="w-5 h-5 text-green-400" /> : <Target className="w-5 h-5 text-orange-400" />}
          </div>
          <div className="text-3xl font-bold text-white">{productividadReal2025 > productividadTabla2025 ? '+' : ''}{formatDecimal(productividadReal2025 - productividadTabla2025)}</div>
          <div className="text-sm text-gray-400 mt-1">huevos/gallina/mes</div>
          <div className="mt-3 pt-3 border-t border-slate-700">
            <div className="text-xs text-gray-500">Estándar industria</div>
            <div className="text-lg font-semibold text-blue-400">{formatDecimal(productividadTabla2025)}</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
          onClick={() => showModal(
            '% Variación Anual 2025 vs 2024',
            `La producción de huevos ${variacionHuevos > 0 ? 'creció' : 'disminuyó'} un ${Math.abs(variacionHuevos)}% respecto a 2024. Cálculo: ((2025 - 2024) / 2024) × 100 = ((${formatNumber(totalHuevos2025)} - ${formatNumber(totalHuevos2024)}) / ${formatNumber(totalHuevos2024)}) × 100 = ${variacionHuevos}%. La diferencia absoluta es de ${formatNumber(Math.abs(totalHuevos2025 - totalHuevos2024))} huevos ${variacionHuevos > 0 ? 'más' : 'menos'}. Esta variación refleja cambios en el tamaño del lote de aves, mejoras en productividad, o ajustes en la estrategia productiva.`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">% Variación Anual</span>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white">{variacionHuevos > 0 ? '+' : ''}{variacionHuevos}%</div>
          <div className="text-sm text-gray-400 mt-1">Fórmula: (2025-2024)/2024×100</div>
          <div className="mt-3 pt-3 border-t border-slate-700">
            <div className="text-xs text-gray-500">Diferencia (huevos)</div>
            <div className="text-lg font-semibold text-purple-400">{variacionHuevos > 0 ? '+' : ''}{formatNumber(Math.abs(totalHuevos2025 - totalHuevos2024))}</div>
          </div>
        </motion.div>
      </div>

      {/* TABLA COMPARATIVA COMPLETA 2025 vs 2024 */}
      {zootecniaHuevo.length >= 2 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-green-500/10 to-green-600/5 backdrop-blur-xl rounded-xl p-6 border-2 border-green-500/30"
        >
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-8 h-8 text-green-400" />
            <h2 className="text-2xl font-bold text-white">COMPARATIVO DATOS ZOOTÉCNICOS GRANJAS HUEVO 2025-2024</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-green-600">
                  <th className="text-left py-3 px-4 text-gray-300 font-bold bg-green-900/30">INDICADOR</th>
                  <th className="text-right py-3 px-4 text-gray-300 font-bold bg-blue-900/30">2025</th>
                  <th className="text-right py-3 px-4 text-gray-300 font-bold bg-slate-700/30">2024</th>
                  <th className="text-right py-3 px-4 text-gray-300 font-bold bg-purple-900/30">VAR. ABSOLUTA</th>
                  <th className="text-right py-3 px-4 text-gray-300 font-bold bg-orange-900/30">VAR. RELATIVA</th>
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
                      <tr className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                        <td className="py-3 px-4 text-white font-semibold">SALDO INICIAL DE AVES</td>
                        <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatNumber(resumenActual.saldo_inicial_aves)}</td>
                        <td className="py-3 px-4 text-right text-gray-400">{formatNumber(resumenAnterior.saldo_inicial_aves)}</td>
                        <td className="py-3 px-4 text-right text-purple-400">{formatNumber(varAbs.saldo_inicial_aves || 0)}</td>
                        <td className={`py-3 px-4 text-right font-bold ${(varRel.saldo_inicial_aves || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatDecimal(varRel.saldo_inicial_aves || 0)}%
                        </td>
                      </tr>

                      {/* Mortalidad de Aves */}
                      <tr className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                        <td className="py-3 px-4 text-white font-semibold">MORTALIDAD DE AVES</td>
                        <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatNumber(resumenActual.mortalidad_aves)}</td>
                        <td className="py-3 px-4 text-right text-gray-400">{formatNumber(resumenAnterior.mortalidad_aves)}</td>
                        <td className="py-3 px-4 text-right text-purple-400">{formatNumber(varAbs.mortalidad_aves || 0)}</td>
                        <td className={`py-3 px-4 text-right font-bold ${(varRel.mortalidad_aves || 0) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {formatDecimal(varRel.mortalidad_aves || 0)}%
                        </td>
                      </tr>

                      {/* Mortalidad Tabla % */}
                      <tr className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                        <td className="py-3 px-4 text-white font-semibold">MORTALIDAD DE AVES TABLA %</td>
                        <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatDecimal(resumenActual.mortalidad_aves_tabla_pct)}%</td>
                        <td className="py-3 px-4 text-right text-gray-400">{formatDecimal(resumenAnterior.mortalidad_aves_tabla_pct)}%</td>
                        <td className="py-3 px-4 text-right text-purple-400">{formatDecimal(varAbs.mortalidad_aves_tabla_pct || 0)}</td>
                        <td className={`py-3 px-4 text-right font-bold ${(varRel.mortalidad_aves_tabla_pct || 0) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {formatDecimal(varRel.mortalidad_aves_tabla_pct || 0)}%
                        </td>
                      </tr>

                      {/* Mortalidad Real % */}
                      <tr className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                        <td className="py-3 px-4 text-white font-semibold">MORTALIDAD DE AVES REAL %</td>
                        <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatDecimal(resumenActual.mortalidad_aves_real_pct)}%</td>
                        <td className="py-3 px-4 text-right text-gray-400">{formatDecimal(resumenAnterior.mortalidad_aves_real_pct)}%</td>
                        <td className="py-3 px-4 text-right text-purple-400">{formatDecimal(varAbs.mortalidad_aves_real_pct || 0)}</td>
                        <td className={`py-3 px-4 text-right font-bold ${(varRel.mortalidad_aves_real_pct || 0) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {formatDecimal(varRel.mortalidad_aves_real_pct || 0)}%
                        </td>
                      </tr>

                      {/* Venta o Selección de Aves */}
                      <tr className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                        <td className="py-3 px-4 text-white font-semibold">VENTA O SELECCIÓN DE AVES</td>
                        <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatNumber(resumenActual.venta_seleccion_aves)}</td>
                        <td className="py-3 px-4 text-right text-gray-400">{formatNumber(resumenAnterior.venta_seleccion_aves)}</td>
                        <td className="py-3 px-4 text-right text-purple-400">{formatNumber(varAbs.venta_seleccion_aves || 0)}</td>
                        <td className={`py-3 px-4 text-right font-bold ${(varRel.venta_seleccion_aves || 0) >= 0 ? 'text-orange-400' : 'text-cyan-400'}`}>
                          {formatDecimal(varRel.venta_seleccion_aves || 0)}%
                        </td>
                      </tr>

                      {/* Huevos Producidos */}
                      <tr className="border-b-2 border-yellow-600 bg-yellow-900/10 hover:bg-yellow-900/20 transition-colors">
                        <td className="py-3 px-4 text-yellow-300 font-bold">HUEVOS PRODUCIDOS</td>
                        <td className="py-3 px-4 text-right text-yellow-400 font-bold text-lg">{formatNumber(resumenActual.huevos_producidos)}</td>
                        <td className="py-3 px-4 text-right text-gray-400">{formatNumber(resumenAnterior.huevos_producidos)}</td>
                        <td className="py-3 px-4 text-right text-purple-400 font-bold">{formatNumber(varAbs.huevos_producidos || 0)}</td>
                        <td className={`py-3 px-4 text-right font-bold text-lg ${(varRel.huevos_producidos || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatDecimal(varRel.huevos_producidos || 0)}%
                        </td>
                      </tr>

                      {/* Huevos Enviados a Bodega */}
                      <tr className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                        <td className="py-3 px-4 text-white font-semibold">HUEVOS ENVIADOS A BODEGA</td>
                        <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatNumber(resumenActual.huevos_enviados_bodega)}</td>
                        <td className="py-3 px-4 text-right text-gray-400">{formatNumber(resumenAnterior.huevos_enviados_bodega)}</td>
                        <td className="py-3 px-4 text-right text-purple-400">{formatNumber(varAbs.huevos_enviados_bodega || 0)}</td>
                        <td className={`py-3 px-4 text-right font-bold ${(varRel.huevos_enviados_bodega || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatDecimal(varRel.huevos_enviados_bodega || 0)}%
                        </td>
                      </tr>

                      {/* Inventario Final Huevo */}
                      <tr className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                        <td className="py-3 px-4 text-white font-semibold">INVENTARIO FINAL HUEVO</td>
                        <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatNumber(resumenActual.inventario_final_huevo)}</td>
                        <td className="py-3 px-4 text-right text-gray-400">{formatNumber(resumenAnterior.inventario_final_huevo)}</td>
                        <td className="py-3 px-4 text-right text-purple-400">{formatNumber(varAbs.inventario_final_huevo || 0)}</td>
                        <td className={`py-3 px-4 text-right font-bold ${(varRel.inventario_final_huevo || 0) >= 0 ? 'text-orange-400' : 'text-cyan-400'}`}>
                          {formatDecimal(varRel.inventario_final_huevo || 0)}%
                        </td>
                      </tr>

                      {/* Huevos Producidos Tabla x Ave Mes */}
                      <tr className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                        <td className="py-3 px-4 text-white font-semibold">HUEVOS PRODUCIDOS TABLA X AVE MES</td>
                        <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatDecimal(resumenActual.huevos_producidos_tabla_x_ave_mes)}</td>
                        <td className="py-3 px-4 text-right text-gray-400">{formatDecimal(resumenAnterior.huevos_producidos_tabla_x_ave_mes)}</td>
                        <td className="py-3 px-4 text-right text-purple-400">{formatDecimal(varAbs.huevos_producidos_tabla_x_ave_mes || 0)}</td>
                        <td className={`py-3 px-4 text-right font-bold ${(varRel.huevos_producidos_tabla_x_ave_mes || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatDecimal(varRel.huevos_producidos_tabla_x_ave_mes || 0)}%
                        </td>
                      </tr>

                      {/* Huevos Producidos Real x Ave Mes */}
                      <tr className="border-b-2 border-green-600 bg-green-900/10 hover:bg-green-900/20 transition-colors">
                        <td className="py-3 px-4 text-green-300 font-bold">HUEVOS PRODUCIDOS REAL X AVE MES</td>
                        <td className="py-3 px-4 text-right text-green-400 font-bold text-lg">{formatDecimal(resumenActual.huevos_producidos_real_x_ave_mes)}</td>
                        <td className="py-3 px-4 text-right text-gray-400">{formatDecimal(resumenAnterior.huevos_producidos_real_x_ave_mes)}</td>
                        <td className="py-3 px-4 text-right text-purple-400 font-bold">{formatDecimal(varAbs.huevos_producidos_real_x_ave_mes || 0)}</td>
                        <td className={`py-3 px-4 text-right font-bold text-lg ${(varRel.huevos_producidos_real_x_ave_mes || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatDecimal(varRel.huevos_producidos_real_x_ave_mes || 0)}%
                        </td>
                      </tr>

                      {/* Consumo Alimento Tabla */}
                      <tr className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                        <td className="py-3 px-4 text-white font-semibold">CONSUMO DE ALIMENTO X AVE (kg) TABLA</td>
                        <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatDecimal(resumenActual.consumo_alimento_x_ave_kg_tabla)}</td>
                        <td className="py-3 px-4 text-right text-gray-400">{formatDecimal(resumenAnterior.consumo_alimento_x_ave_kg_tabla)}</td>
                        <td className="py-3 px-4 text-right text-purple-400">{formatDecimal(varAbs.consumo_alimento_x_ave_kg_tabla || 0)}</td>
                        <td className={`py-3 px-4 text-right font-bold ${(varRel.consumo_alimento_x_ave_kg_tabla || 0) >= 0 ? 'text-orange-400' : 'text-green-400'}`}>
                          {formatDecimal(varRel.consumo_alimento_x_ave_kg_tabla || 0)}%
                        </td>
                      </tr>

                      {/* Consumo Alimento Real */}
                      <tr className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                        <td className="py-3 px-4 text-white font-semibold">CONSUMO DE ALIMENTO X AVE (kg) REAL</td>
                        <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatDecimal(resumenActual.consumo_alimento_x_ave_kg_real)}</td>
                        <td className="py-3 px-4 text-right text-gray-400">{formatDecimal(resumenAnterior.consumo_alimento_x_ave_kg_real)}</td>
                        <td className="py-3 px-4 text-right text-purple-400">{formatDecimal(varAbs.consumo_alimento_x_ave_kg_real || 0)}</td>
                        <td className={`py-3 px-4 text-right font-bold ${(varRel.consumo_alimento_x_ave_kg_real || 0) >= 0 ? 'text-orange-400' : 'text-green-400'}`}>
                          {formatDecimal(varRel.consumo_alimento_x_ave_kg_real || 0)}%
                        </td>
                      </tr>

                      {/* Consumo Alimento Balanceado Total */}
                      <tr className="border-b-2 border-cyan-600 bg-cyan-900/10 hover:bg-cyan-900/20 transition-colors">
                        <td className="py-3 px-4 text-cyan-300 font-bold">CONSUMO ALIMENTO BALANCEADO KL</td>
                        <td className="py-3 px-4 text-right text-cyan-400 font-bold text-lg">{formatNumber(resumenActual.consumo_alimento_balanceado_kl)}</td>
                        <td className="py-3 px-4 text-right text-gray-400">{formatNumber(resumenAnterior.consumo_alimento_balanceado_kl)}</td>
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

          <div className="mt-6 bg-slate-700/30 rounded-lg p-4 border border-slate-600">
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-white">Análisis Comparativo:</span> Esta tabla muestra todos los indicadores zootécnicos de producción de huevo comparando 2025 vs 2024. Los valores en verde indican mejoras, mientras que los rojos señalan áreas que requieren atención. La variación relativa permite identificar rápidamente los cambios porcentuales más significativos en cada indicador.
            </p>
          </div>
        </motion.div>
      )}

      {/* Gráfica 1: Productividad Real vs Estándar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-slate-700 hover:border-blue-500 transition-all cursor-pointer"
        onClick={() => showModal(
          'Productividad Real vs Estándar de la Industria',
          `Comparación de la productividad real (huevos/gallina/mes) contra el estándar de la industria. Las barras verdes muestran el desempeño real y las azules el estándar. Superar el estándar demuestra excelencia operativa y genética superior.`
        )}
      >
        <h3 className="text-xl font-bold text-white mb-2">Productividad Real vs Estándar</h3>
        <p className="text-sm text-gray-400 mb-6">Comparación de desempeño contra benchmarks del sector</p>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={datosComparativos} margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="anio" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" label={{ value: 'Huevos/Gallina/Mes', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
              formatter={(value, name) => [formatDecimal(value) + ' huevos', name]}
            />
            <Legend />
            <Bar dataKey="estandar" fill="#3b82f6" name="Estándar Industria" radius={[8, 8, 0, 0]} />
            <Bar dataKey="productividad" fill="#10b981" name="Productividad Real" radius={[8, 8, 0, 0]} />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Gráfica 2: Mortalidad Real vs Tabla + Consumo de Alimento */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.6 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-slate-700 hover:border-red-500 transition-all cursor-pointer"
        onClick={() => showModal(
          'Mortalidad vs Consumo de Alimento',
          `Análisis de la relación entre mortalidad y consumo de alimento. La mortalidad real vs tabla indica la calidad del manejo sanitario. El consumo de alimento por ave muestra la eficiencia alimenticia. Una mortalidad baja con consumo controlado indica excelente manejo integral.`
        )}
      >
        <h3 className="text-xl font-bold text-white mb-2">Mortalidad Real vs Tabla + Consumo de Alimento</h3>
        <p className="text-sm text-gray-400 mb-6">Análisis de sanidad y eficiencia alimenticia</p>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={datosComparativos} margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="anio" stroke="#9ca3af" />
            <YAxis yAxisId="left" stroke="#9ca3af" label={{ value: '% Mortalidad', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
            <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" label={{ value: 'kg Alimento/Ave', angle: 90, position: 'insideRight', fill: '#9ca3af' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
              formatter={(value, name) => {
                if (name.includes('Mortalidad')) return [formatDecimal(value) + '%', name];
                return [formatDecimal(value) + ' kg', name];
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="mortalidadTabla" fill="#6b7280" name="Mortalidad Tabla" radius={[8, 8, 0, 0]} />
            <Bar yAxisId="left" dataKey="mortalidadReal" fill="#ef4444" name="Mortalidad Real" radius={[8, 8, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="consumoReal" stroke="#06b6d4" strokeWidth={3} name="Consumo Alimento Real" dot={{ fill: '#06b6d4', r: 5 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Gráfica 3: Población de Aves vs Huevos por Ave */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.7 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-slate-700 hover:border-purple-500 transition-all cursor-pointer"
        onClick={() => showModal(
          'Población de Aves vs Productividad por Ave',
          `Comparación entre el número de aves en producción (barras azules) y la productividad por ave (línea verde). Esta gráfica muestra si el aumento o reducción de aves afecta la productividad individual. Idealmente, se busca mantener alta productividad independientemente del tamaño del lote.`
        )}
      >
        <h3 className="text-xl font-bold text-white mb-2">Población de Aves vs Productividad por Ave</h3>
        <p className="text-sm text-gray-400 mb-6">Relación entre tamaño del lote y eficiencia individual</p>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={datosComparativos} margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="anio" stroke="#9ca3af" />
            <YAxis yAxisId="left" stroke="#9ca3af" label={{ value: 'Aves en Producción', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} tickFormatter={(value) => formatNumber(value)} />
            <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" label={{ value: 'Huevos/Ave/Mes', angle: 90, position: 'insideRight', fill: '#9ca3af' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
              formatter={(value, name) => {
                if (name === 'Productividad por Ave') return [formatDecimal(value) + ' huevos/ave/mes', name];
                return [formatNumber(value) + ' aves', name];
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="aves" fill="#3b82f6" name="Aves en Producción" radius={[8, 8, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="productividad" stroke="#10b981" strokeWidth={3} name="Productividad por Ave" dot={{ fill: '#10b981', r: 6 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Modal Reutilizable */}
      <InfoModal
        isOpen={!!modalInfo}
        onClose={closeModal}
        title={modalInfo?.title || ''}
        content={modalInfo?.content || ''}
      />
    </div>
  );
}
