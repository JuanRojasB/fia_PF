import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, X, Info, TrendingUp, Target, AlertTriangle, Award, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart, Area, Cell, LabelList } from 'recharts';
import CollapsibleTable from '../CollapsibleTable';

export default function ProduccionIndicadoresDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  console.log('ProduccionIndicadoresDashboard - Datos recibidos:', data);

  if (!data || typeof data !== 'object') {
    return <div className="text-gray-600">No hay datos disponibles</div>;
  }

  const {
    zootecniaPollo = []
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

  // Calcular KPIs de Pollo (año más reciente)
  const polloReciente = zootecniaPollo[0] || {};
  const conversionPollo = parseFloat(polloReciente.conversion) || 0;
  const mortalidadPollo = parseFloat(polloReciente.mortalidad_pct) || 0;
  const pesoPromedioPollo = parseFloat(polloReciente.peso_promedio) || 0;
  const diasEngordePollo = parseFloat(polloReciente.dias_promedio_engorde) || 0;
  const efiAlimPollo = parseFloat(polloReciente.efi_alim_ip) || 0;

  // Preparar datos para gráficos comparativos de Pollo
  const datosPolloChart = zootecniaPollo.map(p => ({
    anio: p.anio,
    conversion: parseFloat(p.conversion) || 0,
    mortalidad: parseFloat(p.mortalidad_pct) || 0,
    peso: parseFloat(p.peso_promedio) || 0,
    dias: parseFloat(p.dias_promedio_engorde) || 0,
    diasCiclo: parseFloat(p.dias_ciclo) || 0,
    efiAlim: parseFloat(p.efi_alim_ip) || 0,
    encasetado: parseInt(p.pollo_encasetado) || 0,
    procesado: parseInt(p.pollo_procesado) || 0,
    kgProcesado: parseInt(p.kg_pollo_procesado) || 0
  })).reverse();

  return (
    <div className="space-y-8">
      {/* SECCIÓN INDICADORES ZOOTÉCNICOS DE POLLO */}
      {zootecniaPollo.length > 0 && (
        <>
          {/* KPIs Principales de Pollo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-cyan-400" />
              <h2 className="text-2xl font-bold text-gray-900">INDICADORES TÉCNICOS - GRANJAS AVES (POLLO DE ENGORDE)</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-cyan-500/30 hover:border-cyan-500 transition-all cursor-pointer"
                onClick={() => openModal(
                  'Conversión Alimenticia',
                  `La conversión alimenticia actual es de ${formatDecimal(conversionPollo)} kg de alimento por kg de carne producida. Este es el indicador más importante de eficiencia productiva. Un valor ideal está entre 1.6-1.8. Factores que influyen: genética de las aves, calidad del alimento, manejo, temperatura, sanidad. Una conversión baja significa mayor rentabilidad.`
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Conversión Alimenticia Real vs Meta 2025</span>
                  <Target className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{formatDecimal(conversionPollo)}</div>
                <div className="text-sm text-gray-600 mt-1">kg alimento/kg carne</div>
                <div className={`mt-3 pt-3 border-t border-gray-200 text-xs ${conversionPollo <= 1.8 ? 'text-green-400' : 'text-orange-400'}`}>
                  {conversionPollo <= 1.8 ? '✓ Excelente eficiencia' : '⚠ Por encima del ideal'}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }}
                className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-red-500/30 hover:border-red-500 transition-all cursor-pointer"
                onClick={() => openModal(
                  'Mortalidad Pollo',
                  `La mortalidad actual es del ${formatDecimal(mortalidadPollo)}%. El estándar de la industria es <5%. Una mortalidad baja indica buena bioseguridad, manejo adecuado, calidad de pollitos BB y condiciones ambientales óptimas. Mortalidad alta puede deberse a enfermedades, estrés térmico, problemas de agua/alimento o deficiencias en bioseguridad.`
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Mortalidad Real vs Meta 2025</span>
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{formatDecimal(mortalidadPollo)}%</div>
                <div className="text-sm text-gray-600 mt-1">Tasa de mortalidad</div>
                <div className={`mt-3 pt-3 border-t border-gray-200 text-xs ${mortalidadPollo < 5 ? 'text-green-400' : 'text-red-400'}`}>
                  {mortalidadPollo < 5 ? '✓ Dentro del estándar' : '⚠ Por encima del ideal'}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-yellow-500/30 hover:border-yellow-500 transition-all cursor-pointer"
                onClick={() => openModal(
                  'Peso Promedio al Sacrificio',
                  `El peso promedio al sacrificio es de ${formatDecimal(pesoPromedioPollo, 3)} kg. El objetivo comercial típico es 2.4-2.6 kg. Este peso determina el rendimiento en canal y la presentación del producto. Factores: genética, nutrición, días de engorde, manejo. Un peso consistente facilita la comercialización y optimiza el procesamiento.`
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Peso Promedio Real vs Meta 2025</span>
                  <Award className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{formatDecimal(pesoPromedioPollo, 2)}</div>
                <div className="text-sm text-gray-600 mt-1">kg por ave</div>
                <div className={`mt-3 pt-3 border-t border-gray-200 text-xs ${pesoPromedioPollo >= 2.4 && pesoPromedioPollo <= 2.6 ? 'text-green-400' : 'text-orange-400'}`}>
                  {pesoPromedioPollo >= 2.4 && pesoPromedioPollo <= 2.6 ? '✓ Peso objetivo' : '⚠ Fuera del rango ideal'}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3 }}
                className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer"
                onClick={() => openModal(
                  'Días de Engorde',
                  `El ciclo de engorde promedio es de ${formatDecimal(diasEngordePollo)} días. El estándar de la industria es 42-45 días. Un ciclo más corto con buen peso indica excelente genética y manejo. Ciclos más largos aumentan costos de alimento y reducen rotación de galpones. El objetivo es alcanzar el peso objetivo en el menor tiempo posible.`
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Días de Engorde Real vs Meta 2025</span>
                  <TrendingUp className="w-5 h-5 text-orange-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{formatDecimal(diasEngordePollo)}</div>
                <div className="text-sm text-gray-600 mt-1">días promedio</div>
                <div className={`mt-3 pt-3 border-t border-gray-200 text-xs ${diasEngordePollo >= 42 && diasEngordePollo <= 45 ? 'text-green-400' : 'text-orange-400'}`}>
                  {diasEngordePollo >= 42 && diasEngordePollo <= 45 ? '✓ Ciclo estándar' : '⚠ Fuera del rango típico'}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4 }}
                className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
                onClick={() => openModal(
                  'Índice Productivo (IP)',
                  `El Índice Productivo (IP) o Eficiencia Alimenticia es de ${formatDecimal(efiAlimPollo)}. Este indicador integra peso, conversión, mortalidad y días de engorde en una sola métrica. Un IP >300 es excelente, 250-300 es bueno, <250 requiere mejoras. Fórmula: IP = (Peso promedio × Viabilidad) / (Conversión × Días) × 100. Es el mejor indicador global de eficiencia.`
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Índice Productivo Real vs Meta 2025</span>
                  <Zap className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{formatDecimal(efiAlimPollo)}</div>
                <div className="text-sm text-gray-600 mt-1">IP (Eficiencia)</div>
                <div className={`mt-3 pt-3 border-t border-gray-200 text-xs ${efiAlimPollo > 300 ? 'text-green-400' : efiAlimPollo > 250 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {efiAlimPollo > 300 ? '✓ Excelente' : efiAlimPollo > 250 ? '⚠ Bueno' : '⚠ Requiere mejora'}
                </div>
              </motion.div>
            </div>
          </div>

          {/* TABLA COMPARATIVA COMPLETA 2025 vs 2024 */}
          {zootecniaPollo.length >= 2 && (
            <CollapsibleTable 
              title="COMPARATIVO DATOS ZOOTÉCNICOS GRANJAS AVES 2025-2024"
              defaultOpen={false}
              totalRow={[
                { label: 'Indicadores Clave 2025' },
                { label: `Conversión: ${formatDecimal(conversionPollo)}`, color: conversionPollo <= 1.8 ? 'text-green-500' : 'text-orange-500' },
                { label: `Mortalidad: ${formatDecimal(mortalidadPollo)}%`, color: mortalidadPollo < 5 ? 'text-green-500' : 'text-red-500' },
                { label: `Peso: ${formatDecimal(pesoPromedioPollo)} kg`, color: 'text-blue-500' },
                { label: `IP: ${formatDecimal(efiAlimPollo)}`, color: efiAlimPollo > 300 ? 'text-green-500' : 'text-yellow-500' },
              ]}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-cyan-600">
                      <th className="text-left py-3 px-4 text-gray-700 font-bold bg-cyan-900/30">INDICADOR</th>
                      <th className="text-right py-3 px-4 text-gray-700 font-bold bg-blue-900/30">2025</th>
                      <th className="text-right py-3 px-4 text-gray-700 font-bold bg-gray-100/30">2024</th>
                      <th className="text-right py-3 px-4 text-gray-700 font-bold bg-purple-900/30">VAR. ABSOLUTA</th>
                      <th className="text-right py-3 px-4 text-gray-700 font-bold bg-orange-900/30">VAR. RELATIVA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const actual = zootecniaPollo[0] || {};
                      const anterior = zootecniaPollo[1] || {};
                      
                      // Parsear las variaciones del JSON
                      let varAbs = {};
                      let varRel = {};
                      try {
                        varAbs = actual.variacion_absoluta ? JSON.parse(actual.variacion_absoluta) : {};
                        varRel = actual.variacion_relativa_pct ? JSON.parse(actual.variacion_relativa_pct) : {};
                      } catch (e) {
                        console.error('Error parsing variations:', e);
                      }
                      
                      return (
                        <>
                          {/* Pollo Encasetado */}
                          <tr className="border-b border-gray-200/50 hover:bg-gray-100/30 transition-colors">
                            <td className="py-3 px-4 text-gray-900 font-semibold">POLLO ENCASETADO</td>
                            <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatNumber(actual.pollo_encasetado)}</td>
                            <td className="py-3 px-4 text-right text-gray-600">{formatNumber(anterior.pollo_encasetado)}</td>
                            <td className="py-3 px-4 text-right text-purple-400">{formatNumber(varAbs.pollo_encasetado || 0)}</td>
                            <td className={`py-3 px-4 text-right font-bold ${(varRel.pollo_encasetado || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {formatDecimal(varRel.pollo_encasetado || 0)}%
                            </td>
                          </tr>

                          {/* Pollo Procesado */}
                          <tr className="border-b-2 border-green-600 bg-green-900/10 hover:bg-green-900/20 transition-colors">
                            <td className="py-3 px-4 text-green-300 font-bold">POLLO PROCESADO</td>
                            <td className="py-3 px-4 text-right text-green-400 font-bold text-lg">{formatNumber(actual.pollo_procesado)}</td>
                            <td className="py-3 px-4 text-right text-gray-600">{formatNumber(anterior.pollo_procesado)}</td>
                            <td className="py-3 px-4 text-right text-purple-400 font-bold">{formatNumber(varAbs.pollo_procesado || 0)}</td>
                            <td className={`py-3 px-4 text-right font-bold text-lg ${(varRel.pollo_procesado || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {formatDecimal(varRel.pollo_procesado || 0)}%
                            </td>
                          </tr>

                          {/* Mortalidad Acumulada */}
                          <tr className="border-b border-gray-200/50 hover:bg-gray-100/30 transition-colors">
                            <td className="py-3 px-4 text-gray-900 font-semibold">MORTALIDAD ACUMULADA</td>
                            <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatNumber(actual.mortalidad_acumulada)}</td>
                            <td className="py-3 px-4 text-right text-gray-600">{formatNumber(anterior.mortalidad_acumulada)}</td>
                            <td className="py-3 px-4 text-right text-purple-400">{formatNumber(varAbs.mortalidad_acumulada || 0)}</td>
                            <td className={`py-3 px-4 text-right font-bold ${(varRel.mortalidad_acumulada || 0) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                              {formatDecimal(varRel.mortalidad_acumulada || 0)}%
                            </td>
                          </tr>

                          {/* Mortalidad % */}
                          <tr className="border-b border-gray-200/50 hover:bg-gray-100/30 transition-colors">
                            <td className="py-3 px-4 text-gray-900 font-semibold">MORTALIDAD %</td>
                            <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatDecimal(actual.mortalidad_pct)}%</td>
                            <td className="py-3 px-4 text-right text-gray-600">{formatDecimal(anterior.mortalidad_pct)}%</td>
                            <td className="py-3 px-4 text-right text-purple-400">{formatDecimal(varAbs.mortalidad_pct || 0)}</td>
                            <td className={`py-3 px-4 text-right font-bold ${(varRel.mortalidad_pct || 0) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                              {formatDecimal(varRel.mortalidad_pct || 0)}%
                            </td>
                          </tr>

                          {/* Peso Esperado */}
                          <tr className="border-b border-gray-200/50 hover:bg-gray-100/30 transition-colors">
                            <td className="py-3 px-4 text-gray-900 font-semibold">PESO ESPERADO (kg)</td>
                            <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatDecimal(actual.peso_esperado, 3)}</td>
                            <td className="py-3 px-4 text-right text-gray-600">{formatDecimal(anterior.peso_esperado, 3)}</td>
                            <td className="py-3 px-4 text-right text-purple-400">{formatDecimal(varAbs.peso_esperado || 0, 2)}</td>
                            <td className={`py-3 px-4 text-right font-bold ${(varRel.peso_esperado || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {formatDecimal(varRel.peso_esperado || 0)}%
                            </td>
                          </tr>

                          {/* Peso Promedio */}
                          <tr className="border-b border-gray-200/50 hover:bg-gray-100/30 transition-colors">
                            <td className="py-3 px-4 text-gray-900 font-semibold">PESO PROMEDIO (kg)</td>
                            <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatDecimal(actual.peso_promedio, 3)}</td>
                            <td className="py-3 px-4 text-right text-gray-600">{formatDecimal(anterior.peso_promedio, 3)}</td>
                            <td className="py-3 px-4 text-right text-purple-400">{formatDecimal(varAbs.peso_promedio || 0, 3)}</td>
                            <td className={`py-3 px-4 text-right font-bold ${(varRel.peso_promedio || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {formatDecimal(varRel.peso_promedio || 0)}%
                            </td>
                          </tr>

                          {/* DSG */}
                          <tr className="border-b border-gray-200/50 hover:bg-gray-100/30 transition-colors">
                            <td className="py-3 px-4 text-gray-900 font-semibold">DSG (Desviación Estándar Ganancia)</td>
                            <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatDecimal(actual.dsg)}</td>
                            <td className="py-3 px-4 text-right text-gray-600">{formatDecimal(anterior.dsg)}</td>
                            <td className="py-3 px-4 text-right text-purple-400">{formatDecimal(varAbs.dsg || 0)}</td>
                            <td className={`py-3 px-4 text-right font-bold ${(varRel.dsg || 0) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                              {formatDecimal(varRel.dsg || 0)}%
                            </td>
                          </tr>

                          {/* Conversión */}
                          <tr className="border-b-2 border-cyan-600 bg-cyan-900/10 hover:bg-cyan-900/20 transition-colors">
                            <td className="py-3 px-4 text-cyan-300 font-bold">CONVERSIÓN ALIMENTICIA</td>
                            <td className="py-3 px-4 text-right text-cyan-400 font-bold text-lg">{formatDecimal(actual.conversion)}</td>
                            <td className="py-3 px-4 text-right text-gray-600">{formatDecimal(anterior.conversion)}</td>
                            <td className="py-3 px-4 text-right text-purple-400 font-bold">{formatDecimal(varAbs.conversion || 0)}</td>
                            <td className={`py-3 px-4 text-right font-bold text-lg ${(varRel.conversion || 0) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                              {formatDecimal(varRel.conversion || 0)}%
                            </td>
                          </tr>

                          {/* Kg Alimento Consumido */}
                          <tr className="border-b border-gray-200/50 hover:bg-gray-100/30 transition-colors">
                            <td className="py-3 px-4 text-gray-900 font-semibold">KG. ALIMENTO CONSUMIDO</td>
                            <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatNumber(actual.kg_alimento_consumido)}</td>
                            <td className="py-3 px-4 text-right text-gray-600">{formatNumber(anterior.kg_alimento_consumido)}</td>
                            <td className="py-3 px-4 text-right text-purple-400">{formatNumber(varAbs.kg_alimento_consumido || 0)}</td>
                            <td className={`py-3 px-4 text-right font-bold ${(varRel.kg_alimento_consumido || 0) >= 0 ? 'text-orange-400' : 'text-green-400'}`}>
                              {formatDecimal(varRel.kg_alimento_consumido || 0)}%
                            </td>
                          </tr>

                          {/* Consumo Alimento x Pollo */}
                          <tr className="border-b border-gray-200/50 hover:bg-gray-100/30 transition-colors">
                            <td className="py-3 px-4 text-gray-900 font-semibold">CONSUMO ALIMENTO X POLLO (kg)</td>
                            <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatDecimal(actual.consumo_alimento_x_pollo)}</td>
                            <td className="py-3 px-4 text-right text-gray-600">{formatDecimal(anterior.consumo_alimento_x_pollo)}</td>
                            <td className="py-3 px-4 text-right text-purple-400">{formatDecimal(varAbs.consumo_alimento_x_pollo || 0)}</td>
                            <td className={`py-3 px-4 text-right font-bold ${(varRel.consumo_alimento_x_pollo || 0) >= 0 ? 'text-orange-400' : 'text-green-400'}`}>
                              {formatDecimal(varRel.consumo_alimento_x_pollo || 0)}%
                            </td>
                          </tr>

                          {/* Eficiencia Alimenticia IP */}
                          <tr className="border-b-2 border-purple-600 bg-purple-900/10 hover:bg-purple-900/20 transition-colors">
                            <td className="py-3 px-4 text-purple-300 font-bold">EFICIENCIA ALIMENTICIA (IP)</td>
                            <td className="py-3 px-4 text-right text-purple-400 font-bold text-lg">{formatDecimal(actual.efi_alim_ip)}</td>
                            <td className="py-3 px-4 text-right text-gray-600">{formatDecimal(anterior.efi_alim_ip)}</td>
                            <td className="py-3 px-4 text-right text-purple-400 font-bold">{formatDecimal(varAbs.efi_alim_ip || 0)}</td>
                            <td className={`py-3 px-4 text-right font-bold text-lg ${(varRel.efi_alim_ip || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {formatDecimal(varRel.efi_alim_ip || 0)}%
                            </td>
                          </tr>

                          {/* Valor Kg Alimento */}
                          <tr className="border-b border-gray-200/50 hover:bg-gray-100/30 transition-colors">
                            <td className="py-3 px-4 text-gray-900 font-semibold">VALOR KG. ALIMENTO ($)</td>
                            <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatDecimal(actual.vr_kg_alimento)}</td>
                            <td className="py-3 px-4 text-right text-gray-600">{formatDecimal(anterior.vr_kg_alimento)}</td>
                            <td className="py-3 px-4 text-right text-purple-400">{formatDecimal(varAbs.vr_kg_alimento || 0)}</td>
                            <td className={`py-3 px-4 text-right font-bold ${(varRel.vr_kg_alimento || 0) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                              {formatDecimal(varRel.vr_kg_alimento || 0)}%
                            </td>
                          </tr>

                          {/* Kg Pollo Procesado */}
                          <tr className="border-b border-gray-200/50 hover:bg-gray-100/30 transition-colors">
                            <td className="py-3 px-4 text-gray-900 font-semibold">KG. POLLO PROCESADO</td>
                            <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatNumber(actual.kg_pollo_procesado)}</td>
                            <td className="py-3 px-4 text-right text-gray-600">{formatNumber(anterior.kg_pollo_procesado)}</td>
                            <td className="py-3 px-4 text-right text-purple-400">{formatNumber(varAbs.kg_pollo_procesado || 0)}</td>
                            <td className={`py-3 px-4 text-right font-bold ${(varRel.kg_pollo_procesado || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {formatDecimal(varRel.kg_pollo_procesado || 0)}%
                            </td>
                          </tr>

                          {/* Días Promedio Engorde */}
                          <tr className="border-b border-gray-200/50 hover:bg-gray-100/30 transition-colors">
                            <td className="py-3 px-4 text-gray-900 font-semibold">DÍAS PROMEDIO ENGORDE</td>
                            <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatDecimal(actual.dias_promedio_engorde)}</td>
                            <td className="py-3 px-4 text-right text-gray-600">{formatDecimal(anterior.dias_promedio_engorde)}</td>
                            <td className="py-3 px-4 text-right text-purple-400">{formatDecimal(varAbs.dias_promedio_engorde || 0)}</td>
                            <td className={`py-3 px-4 text-right font-bold ${(varRel.dias_promedio_engorde || 0) >= 0 ? 'text-orange-400' : 'text-green-400'}`}>
                              {formatDecimal(varRel.dias_promedio_engorde || 0)}%
                            </td>
                          </tr>

                          {/* Días Ciclo */}
                          <tr className="border-b-2 border-orange-600 bg-orange-900/10 hover:bg-orange-900/20 transition-colors">
                            <td className="py-3 px-4 text-orange-300 font-bold">DÍAS CICLO</td>
                            <td className="py-3 px-4 text-right text-orange-400 font-bold text-lg">{formatDecimal(actual.dias_ciclo)}</td>
                            <td className="py-3 px-4 text-right text-gray-600">{formatDecimal(anterior.dias_ciclo)}</td>
                            <td className="py-3 px-4 text-right text-purple-400 font-bold">{formatDecimal(varAbs.dias_ciclo || 0)}</td>
                            <td className={`py-3 px-4 text-right font-bold text-lg ${(varRel.dias_ciclo || 0) >= 0 ? 'text-orange-400' : 'text-green-400'}`}>
                              {formatDecimal(varRel.dias_ciclo || 0)}%
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
                  <span className="font-semibold text-gray-900">Análisis Comparativo:</span> Esta tabla muestra todos los indicadores zootécnicos de pollo de engorde comparando 2025 vs 2024. Los valores en verde indican mejoras, mientras que los rojos señalan áreas que requieren atención. La variación relativa permite identificar rápidamente los cambios porcentuales más significativos en cada indicador. Indicadores clave: conversión alimenticia (menor es mejor), mortalidad (menor es mejor), peso promedio (objetivo 2.4-2.6 kg), eficiencia alimenticia IP (mayor es mejor).
                </p>
              </div>
            </CollapsibleTable>
          )}

          {/* Gráficos Comparativos de Pollo - 3 GRÁFICAS SENCILLAS */}
          <div className="grid grid-cols-1 gap-6">
            {/* Gráfica 1: Conversión Alimenticia 2024 vs 2025 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-gray-200 hover:border-cyan-500 transition-all cursor-pointer"
              onClick={() => openModal(
                'Conversión Alimenticia',
                `La conversión alimenticia mide cuántos kg de alimento se necesitan para producir 1 kg de carne. Ideal: <1.8. Menor conversión = mayor eficiencia y rentabilidad. Cada 0.1 de mejora representa ahorros significativos en costos de alimento.`
              )}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Conversión Alimenticia 2024 vs 2025</h3>
              <p className="text-sm text-gray-600 mb-6">kg alimento / kg carne (menor es mejor)</p>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={datosPolloChart} margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="anio" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" width={70} label={{ value: 'Conversión', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const conversion = payload[0].value;
                        
                        return (
                          <div className="bg-white border-2 border-cyan-500 rounded-xl p-4 shadow-xl">
                            <p className="font-bold text-gray-900 mb-3 text-lg">Año {label}</p>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center gap-4">
                                <span className="text-cyan-600 font-medium">Conversión:</span>
                                <span className="font-bold text-gray-900">{formatDecimal(conversion)}</span>
                              </div>
                              <div className="border-t border-gray-200 pt-2 mt-2">
                                <div className="text-xs text-gray-600">
                                  {conversion <= 1.8 ? '✓ Excelente eficiencia' : '⚠ Por encima del ideal (1.8)'}
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
                  <Bar dataKey="conversion" fill="#06b6d4" name="Conversión Alimenticia" radius={[8, 8, 0, 0]}>
                    <LabelList dataKey="anio" position="top" style={{ fontSize: '11px', fontWeight: 'bold', fill: '#374151' }} />
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Gráfica 3: Pollo Procesado (Volumen de Producción) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-gray-200 hover:border-green-500 transition-all cursor-pointer"
              onClick={() => openModal(
                'Volumen de Producción',
                `Número total de pollos procesados (sacrificados) por año. Este indicador muestra el crecimiento o reducción de la operación. Mayor volumen procesado indica expansión del negocio.`
              )}
            >
        <h3 className="text-xl font-bold text-gray-900 mb-2">Pollo Procesado en Planta de Beneficio 2024 vs 2025</h3>
              <p className="text-sm text-gray-600 mb-6">Volumen total de producción</p>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={datosPolloChart} margin={{ left: 20, right: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="anio" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" tickFormatter={(value) => formatNumber(value)} width={90} />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const procesado = payload[0].value;
                        const data2024 = datosPolloChart.find(d => d.anio === 2024);
                        const data2025 = datosPolloChart.find(d => d.anio === 2025);
                        
                        return (
                          <div className="bg-white border-2 border-green-500 rounded-xl p-4 shadow-xl">
                            <p className="font-bold text-gray-900 mb-3 text-lg">Año {label}</p>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center gap-4">
                                <span className="text-green-600 font-medium">Procesado:</span>
                                <span className="font-bold text-gray-900">{formatNumber(procesado)} pollos</span>
                              </div>
                              {data2024 && data2025 && label == 2025 && (
                                <div className="border-t border-gray-200 pt-2 mt-2">
                                  <div className="flex justify-between items-center gap-4">
                                    <span className="text-gray-600 font-medium">vs 2024:</span>
                                    <span className={`font-bold ${data2025.procesado >= data2024.procesado ? 'text-green-600' : 'text-red-600'}`}>
                                      {data2025.procesado >= data2024.procesado ? '+' : ''}{formatNumber(data2025.procesado - data2024.procesado)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center gap-4 mt-1">
                                    <span className="text-gray-600 font-medium">Variación:</span>
                                    <span className={`font-bold ${data2025.procesado >= data2024.procesado ? 'text-green-600' : 'text-red-600'}`}>
                                      {data2024.procesado > 0 ? (((data2025.procesado - data2024.procesado) / data2024.procesado) * 100).toFixed(1) : 0}%
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="procesado" radius={[8, 8, 0, 0]}>
                    {datosPolloChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.anio === 2024 ? '#3b82f6' : '#10b981'} />
                    ))}
                    <LabelList dataKey="anio" position="top" style={{ fontSize: '11px', fontWeight: 'bold', fill: '#374151' }} />
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </>
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
              className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-blue-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-cyan-400" />
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

