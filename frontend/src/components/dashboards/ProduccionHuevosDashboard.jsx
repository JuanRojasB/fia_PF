import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart, Area, LabelList } from 'recharts';
import { Egg, TrendingUp, X, Info, Target, Award, Activity } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';

export default function ProduccionHuevosDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
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
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-yellow-500/30 hover:border-yellow-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Producción Total de Huevos 2025',
            `Se produjeron ${formatNumber(totalHuevos2025)} huevos durante el año 2025 con ${formatNumber(aves2025)} aves en producción. La productividad real fue de ${formatDecimal(productividadReal2025)} huevos por gallina al mes. La producción de huevos es el resultado de la eficiencia reproductiva de las gallinas ponedoras, influenciada por genética, nutrición, manejo, bioseguridad y condiciones ambientales. El estándar de la industria es de ${formatDecimal(productividadTabla2025)} huevos/gallina/mes.`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Huevos Producidos 2025 vs Programado</span>
            <Egg className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatNumber(totalHuevos2025)}</div>
          <div className="text-sm text-gray-600 mt-1">Total anual</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Aves en producción 2025</div>
            <div className="text-lg font-semibold text-yellow-400">{formatNumber(aves2025)}</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Producción Total de Huevos 2024',
            `Se produjeron ${formatNumber(totalHuevos2024)} huevos durante el año 2024 con ${formatNumber(aves2024)} aves en producción. La productividad real fue de ${formatDecimal(productividadReal2024)} huevos por gallina al mes. Este valor sirve como base de comparación para evaluar el crecimiento y mejoras en la operación de postura entre años.`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Huevos Producidos 2024 vs Programado</span>
            <Egg className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatNumber(totalHuevos2024)}</div>
          <div className="text-sm text-gray-600 mt-1">Total anual</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Aves en producción 2024</div>
            <div className="text-lg font-semibold text-green-400">{formatNumber(aves2024)}</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Comparación Productividad 2025 vs 2024',
            `La productividad por gallina ${diferenciaProductividad > 0 ? 'aumentó' : 'disminuyó'} ${formatDecimal(Math.abs(diferenciaProductividad))} huevos/gallina/mes entre 2025 y 2024. En 2025 se alcanzaron ${formatDecimal(productividadReal2025)} huevos/gallina/mes vs ${formatDecimal(productividadReal2024)} en 2024. Esto representa una variación del ${variacionProductividad > 0 ? '+' : ''}${variacionProductividad}%. Fórmula: (2025 - 2024) / 2024 × 100 = (${formatDecimal(productividadReal2025)} - ${formatDecimal(productividadReal2024)}) / ${formatDecimal(productividadReal2024)} × 100 = ${variacionProductividad}%. ${diferenciaProductividad > 0 ? 'Esta mejora indica avances en genética, nutrición y manejo.' : 'Hay oportunidad de recuperar niveles anteriores.'}`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Comparación Huevos Producidos 2025 vs 2024</span>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{diferenciaProductividad > 0 ? '+' : ''}{formatDecimal(diferenciaProductividad)}</div>
          <div className="text-sm text-gray-600 mt-1">huevos/gallina/mes</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Variación porcentual</div>
            <div className={`text-lg font-semibold ${variacionProductividad >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {variacionProductividad > 0 ? '+' : ''}{variacionProductividad}%
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Diferencia vs Estándar Industria 2025',
            `La productividad real de 2025 es de ${formatDecimal(productividadReal2025)} huevos/gallina/mes, comparado con el estándar de la industria de ${formatDecimal(productividadTabla2025)} huevos/gallina/mes. La diferencia absoluta es de ${formatDecimal(productividadReal2025 - productividadTabla2025)} huevos ${productividadReal2025 > productividadTabla2025 ? 'por encima' : 'por debajo'} del estándar. ${productividadReal2025 > productividadTabla2025 ? 'Esta mejora indica excelencia en genética, nutrición, manejo y bioseguridad, traduciéndose en mayor rentabilidad por ave.' : 'Hay oportunidad de mejora para alcanzar el estándar de la industria.'}`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Productividad Real vs Estándar 2025</span>
            {productividadReal2025 > productividadTabla2025 ? <Award className="w-5 h-5 text-blue-400" /> : <Target className="w-5 h-5 text-orange-400" />}
          </div>
          <div className="text-3xl font-bold text-gray-900">{productividadReal2025 > productividadTabla2025 ? '+' : ''}{formatDecimal(productividadReal2025 - productividadTabla2025)}</div>
          <div className="text-sm text-gray-600 mt-1">huevos/gallina/mes</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Estándar industria 2025</div>
            <div className="text-lg font-semibold text-blue-400">{formatDecimal(productividadTabla2025)}</div>
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

      {/* Gráfica 1: Productividad Real vs Estándar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.5 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-gray-200 hover:border-blue-500 transition-all cursor-pointer"
        onClick={() => openModal(
          'Productividad Real vs Estándar de la Industria',
          `Comparación de la productividad real (huevos/gallina/mes) contra el estándar de la industria. Las barras verdes muestran el desempeño real y las azules el estándar. Superar el estándar demuestra excelencia operativa y genética superior.`
        )}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-2">Productividad Real vs Estándar Sector - Huevos 2025</h3>
        <p className="text-sm text-gray-600 mb-6">Comparación de desempeño contra benchmarks del sector</p>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={datosComparativos} margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="anio" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" width={80} label={{ value: 'Huevos/Gallina/Mes', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const estandar = payload.find(p => p.dataKey === 'estandar')?.value || 0;
                  const productividad = payload.find(p => p.dataKey === 'productividad')?.value || 0;
                  const diferencia = productividad - estandar;
                  const variacion = estandar > 0 ? ((diferencia / estandar) * 100).toFixed(1) : 0;
                  
                  return (
                    <div className="bg-white border-2 border-blue-500 rounded-xl p-4 shadow-xl">
                      <p className="font-bold text-gray-900 mb-3 text-lg">Año {label}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-blue-600 font-medium">Estándar:</span>
                          <span className="font-bold text-gray-900">{formatDecimal(estandar)} huevos</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-green-600 font-medium">Real:</span>
                          <span className="font-bold text-gray-900">{formatDecimal(productividad)} huevos</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-gray-600 font-medium">Diferencia:</span>
                            <span className={`font-bold ${diferencia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {diferencia >= 0 ? '+' : ''}{formatDecimal(diferencia)} huevos
                            </span>
                          </div>
                          <div className="flex justify-between items-center gap-4 mt-1">
                            <span className="text-gray-600 font-medium">vs Estándar:</span>
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
              }}
            />
            <Legend />
            <Bar dataKey="estandar" fill="#3b82f6" name="Estándar Industria" radius={[8, 8, 0, 0]}>
              <LabelList dataKey="anio" position="top" style={{ fontSize: '11px', fontWeight: 'bold', fill: '#374151' }} />
            </Bar>
            <Bar dataKey="productividad" fill="#10b981" name="Productividad Real" radius={[8, 8, 0, 0]} />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Gráfica 2: Mortalidad Real vs Tabla + Consumo de Alimento */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.6 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-gray-200 hover:border-red-500 transition-all cursor-pointer"
        onClick={() => openModal(
          'Mortalidad vs Consumo de Alimento',
          `Análisis de la relación entre mortalidad y consumo de alimento. La mortalidad real vs tabla indica la calidad del manejo sanitario. El consumo de alimento por ave muestra la eficiencia alimenticia. Una mortalidad baja con consumo controlado indica excelente manejo integral.`
        )}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-2">Mortalidad Real vs Tabla + Consumo de Alimento 2025</h3>
        <p className="text-sm text-gray-600 mb-6">Análisis de sanidad y eficiencia alimenticia</p>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={datosComparativos} margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="anio" stroke="#9ca3af" />
            <YAxis yAxisId="left" stroke="#9ca3af" label={{ value: '% Mortalidad', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
            <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" label={{ value: 'kg Alimento/Ave', angle: 90, position: 'insideRight', fill: '#9ca3af' }} />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const mortalidadTabla = payload.find(p => p.dataKey === 'mortalidadTabla')?.value || 0;
                  const mortalidadReal = payload.find(p => p.dataKey === 'mortalidadReal')?.value || 0;
                  const consumoReal = payload.find(p => p.dataKey === 'consumoReal')?.value || 0;
                  
                  return (
                    <div className="bg-white border-2 border-red-500 rounded-xl p-4 shadow-xl">
                      <p className="font-bold text-gray-900 mb-3 text-lg">Año {label}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-gray-600 font-medium">Mort. Tabla:</span>
                          <span className="font-bold text-gray-900">{formatDecimal(mortalidadTabla)}%</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-red-600 font-medium">Mort. Real:</span>
                          <span className="font-bold text-gray-900">{formatDecimal(mortalidadReal)}%</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-cyan-600 font-medium">Consumo:</span>
                          <span className="font-bold text-gray-900">{formatDecimal(consumoReal)} kg/ave</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="text-xs text-gray-600">
                            {mortalidadReal <= mortalidadTabla ? '✓ Mortalidad dentro de tabla' : '⚠ Mortalidad por encima de tabla'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
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
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-gray-200 hover:border-purple-500 transition-all cursor-pointer"
        onClick={() => openModal(
          'Población de Aves vs Productividad por Ave',
          `Comparación entre el número de aves en producción (barras azules) y la productividad por ave (línea verde). Esta gráfica muestra si el aumento o reducción de aves afecta la productividad individual. Idealmente, se busca mantener alta productividad independientemente del tamaño del lote.`
        )}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-2">Población de Aves vs Productividad por Ave 2025</h3>
        <p className="text-sm text-gray-600 mb-6">Relación entre tamaño del lote y eficiencia individual</p>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={datosComparativos} margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="anio" stroke="#9ca3af" />
            <YAxis yAxisId="left" stroke="#9ca3af" width={90} label={{ value: 'Aves en Producción', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} tickFormatter={(value) => formatNumber(value)} />
            <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" label={{ value: 'Huevos/Ave/Mes', angle: 90, position: 'insideRight', fill: '#9ca3af' }} />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const aves = payload.find(p => p.dataKey === 'aves')?.value || 0;
                  const productividad = payload.find(p => p.dataKey === 'productividad')?.value || 0;
                  
                  return (
                    <div className="bg-white border-2 border-purple-500 rounded-xl p-4 shadow-xl">
                      <p className="font-bold text-gray-900 mb-3 text-lg">Año {label}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-blue-600 font-medium">Aves:</span>
                          <span className="font-bold text-gray-900">{formatNumber(aves)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-green-600 font-medium">Productividad:</span>
                          <span className="font-bold text-gray-900">{formatDecimal(productividad)} huevos/ave/mes</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="aves" fill="#3b82f6" name="Aves en Producción" radius={[8, 8, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="productividad" stroke="#10b981" strokeWidth={3} name="Productividad por Ave" dot={{ fill: '#10b981', r: 6 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

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
              className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-blue-500 shadow-2xl"
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
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-gray-900 rounded-lg transition-colors"
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

