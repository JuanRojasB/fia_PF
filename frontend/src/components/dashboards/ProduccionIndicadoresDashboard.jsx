import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, X, Info, TrendingUp, Target, AlertTriangle, Award, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell, ComposedChart, Line, Legend } from 'recharts';
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
              {(() => {
                let varRel = {};
                try { varRel = polloReciente.variacion_relativa_pct ? JSON.parse(polloReciente.variacion_relativa_pct) : {}; } catch(e) {}
                const anterior = zootecniaPollo[1] || {};

                const cards = [
                  { label: 'Conversión Alimenticia 2025', value: formatDecimal(conversionPollo), sub: 'kg alimento/kg carne', icon: <Target className="w-5 h-5 text-cyan-400" />, border: 'border-cyan-500/30 hover:border-cyan-500', varKey: 'conversion', invertir: true, modal: { title: 'Conversión Alimenticia', desc: `Actual: ${formatDecimal(conversionPollo)} · 2024: ${formatDecimal(anterior.conversion)}. Mide kg de alimento por kg de carne producida. Menor valor = mayor eficiencia.` } },
                  { label: 'Mortalidad 2025', value: `${formatDecimal(mortalidadPollo)}%`, sub: 'Tasa de mortalidad', icon: <AlertTriangle className="w-5 h-5 text-red-400" />, border: 'border-red-500/30 hover:border-red-500', varKey: 'mortalidad_pct', invertir: true, modal: { title: 'Mortalidad Pollo', desc: `Actual: ${formatDecimal(mortalidadPollo)}% · 2024: ${formatDecimal(anterior.mortalidad_pct)}%. Una mortalidad baja indica buena bioseguridad y manejo adecuado.` } },
                  { label: 'Peso Promedio 2025', value: formatDecimal(pesoPromedioPollo, 2), sub: 'kg por ave', icon: <Award className="w-5 h-5 text-yellow-400" />, border: 'border-yellow-500/30 hover:border-yellow-500', varKey: 'peso_promedio', invertir: false, modal: { title: 'Peso Promedio al Sacrificio', desc: `Actual: ${formatDecimal(pesoPromedioPollo, 3)} kg · 2024: ${formatDecimal(anterior.peso_promedio, 3)} kg. Determina el rendimiento en canal y la presentación del producto.` } },
                  { label: 'Días de Engorde 2025', value: formatDecimal(diasEngordePollo), sub: 'días promedio', icon: <TrendingUp className="w-5 h-5 text-orange-400" />, border: 'border-orange-500/30 hover:border-orange-500', varKey: 'dias_promedio_engorde', invertir: true, modal: { title: 'Días de Engorde', desc: `Actual: ${formatDecimal(diasEngordePollo)} días · 2024: ${formatDecimal(anterior.dias_promedio_engorde)} días. Un ciclo más corto con buen peso indica excelente genética y manejo.` } },
                  { label: 'Índice Productivo (IP) 2025', value: formatDecimal(efiAlimPollo), sub: 'IP (Eficiencia)', icon: <Zap className="w-5 h-5 text-purple-400" />, border: 'border-purple-500/30 hover:border-purple-500', varKey: 'efi_alim_ip', invertir: false, modal: { title: 'Índice Productivo (IP)', desc: `Actual: ${formatDecimal(efiAlimPollo)} · 2024: ${formatDecimal(anterior.efi_alim_ip)}. Integra peso, conversión, mortalidad y días de engorde. Mayor IP = mejor eficiencia global.` } },
                ];

                return cards.map((c, i) => {
                  const vr = parseFloat(varRel[c.varKey] || 0);
                  const esBueno = c.invertir ? vr <= 0 : vr >= 0;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 ${c.border} transition-all cursor-pointer`}
                      onClick={() => openModal(c.modal.title, c.modal.desc)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600 text-sm">{c.label}</span>
                        {c.icon}
                      </div>
                      <div className="text-3xl font-bold text-gray-900">{c.value}</div>
                      <div className="text-sm text-gray-600 mt-1">{c.sub}</div>
                      <div className={`mt-3 pt-3 border-t border-gray-200 text-xs font-semibold ${esBueno ? 'text-green-500' : 'text-red-500'}`}>
                        vs 2024: {vr >= 0 ? '+' : ''}{formatDecimal(vr)}%
                      </div>
                    </motion.div>
                  );
                });
              })()}
            </div>
          </div>

          {/* TABLA COMPARATIVA COMPLETA 2025 vs 2024 */}
          {zootecniaPollo.length >= 2 && (
            <CollapsibleTable 
              title="COMPARATIVO DATOS ZOOTÉCNICOS GRANJAS AVES 2025-2024"
              defaultOpen={true}
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
                  <span className="font-semibold text-gray-900">Análisis Comparativo:</span> Esta tabla muestra todos los indicadores zootécnicos de pollo de engorde comparando 2025 vs 2024. Los valores en verde indican mejoras, mientras que los rojos señalan áreas que requieren atención. La variación relativa permite identificar rápidamente los cambios porcentuales más significativos en cada indicador. Indicadores clave: conversión alimenticia (menor es mejor), mortalidad (menor es mejor), peso promedio (valor de tabla 2.4-2.6 kg), eficiencia alimenticia IP (mayor es mejor).
                </p>
              </div>
            </CollapsibleTable>
          )}

          {/* Gráficos Comparativos de Pollo */}
          <div className="grid grid-cols-1 gap-6">
            {/* Gráfica 1: Tendencia indicadores zootécnicos históricos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-gray-200 hover:border-cyan-500 transition-all cursor-pointer"
              onClick={() => openModal(
                'Tendencia Indicadores Zootécnicos',
                'Evolución histórica de mortalidad %, peso promedio e índice productivo (IP). Permite identificar tendencias de mejora o deterioro en el desempeño de las granjas a lo largo del tiempo.'
              )}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-1">Tendencia Indicadores Zootécnicos — Histórico</h3>
              <p className="text-sm text-gray-500 mb-4">Mortalidad % · Peso promedio (kg) · IP (Eficiencia)</p>
              {(() => {
                const d2024 = datosPolloChart.find(d => d.anio === 2024);
                const d2025 = datosPolloChart.find(d => d.anio === 2025);
                const varMort = d2024?.mortalidad > 0 ? (((d2025?.mortalidad - d2024?.mortalidad) / d2024.mortalidad) * 100).toFixed(1) : 0;
                const varPeso = d2024?.peso > 0 ? (((d2025?.peso - d2024?.peso) / d2024.peso) * 100).toFixed(1) : 0;
                const varIP = d2024?.efiAlim > 0 ? (((d2025?.efiAlim - d2024?.efiAlim) / d2024.efiAlim) * 100).toFixed(1) : 0;
                return (
                  <>
                    <ResponsiveContainer width="100%" height={320}>
                      <ComposedChart data={datosPolloChart} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="anio" stroke="#6b7280" tick={{ fontSize: 12 }} />
                        <YAxis yAxisId="left" stroke="#ef4444" width={45} tick={{ fontSize: 11 }} label={{ value: 'Mort %', angle: -90, position: 'insideLeft', fill: '#ef4444', fontSize: 11 }} />
                        <YAxis yAxisId="right" orientation="right" stroke="#8b5cf6" width={50} tick={{ fontSize: 11 }} label={{ value: 'IP', angle: 90, position: 'insideRight', fill: '#8b5cf6', fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: 'white', border: '2px solid #e5e7eb', borderRadius: '10px', padding: '10px' }}
                          formatter={(v, name) => {
                            if (name === 'Mortalidad %') return [`${formatDecimal(v)}%`, name];
                            if (name === 'Peso (kg)') return [`${formatDecimal(v, 3)} kg`, name];
                            if (name === 'IP') return [formatDecimal(v), name];
                            return [v, name];
                          }}
                        />
                        <Legend />
                        <Bar yAxisId="left" dataKey="mortalidad" name="Mortalidad %" fill="#fca5a5" radius={[4, 4, 0, 0]} opacity={0.8} />
                        <Line yAxisId="left" type="monotone" dataKey="peso" name="Peso (kg)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 5, fill: '#f59e0b' }} />
                        <Line yAxisId="right" type="monotone" dataKey="efiAlim" name="IP" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 5, fill: '#8b5cf6' }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {[
                        { label: 'Mortalidad', vr: varMort, invertir: true, color: '#ef4444' },
                        { label: 'Peso promedio', vr: varPeso, invertir: false, color: '#f59e0b' },
                        { label: 'IP (Eficiencia)', vr: varIP, invertir: false, color: '#8b5cf6' },
                      ].map((item, i) => {
                        const esBueno = item.invertir ? parseFloat(item.vr) <= 0 : parseFloat(item.vr) >= 0;
                        return (
                          <div key={i} className="bg-gray-50 rounded-lg p-3 text-center">
                            <div className="text-xs mb-1 font-semibold" style={{ color: item.color }}>{item.label}</div>
                            <div className={`text-sm font-bold ${esBueno ? 'text-green-600' : 'text-red-600'}`}>
                              {parseFloat(item.vr) >= 0 ? '+' : ''}{item.vr}% vs 2024
                            </div>
                            <div className={`text-xs mt-0.5 ${esBueno ? 'text-green-500' : 'text-red-500'}`}>
                              {esBueno ? '↑ mejora' : '↓ desmejora'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </motion.div>

            {/* Gráfica 2: Pollo Procesado 2024 vs 2025 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-gray-200 hover:border-green-500 transition-all cursor-pointer"
              onClick={() => openModal(
                'Volumen de Producción',
                'Número total de pollos procesados (sacrificados) por año. Este indicador muestra el crecimiento o reducción de la operación. Mayor volumen procesado indica expansión del negocio.'
              )}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-1">Pollo Procesado en Planta de Beneficio — 2024 vs 2025</h3>
              <p className="text-sm text-gray-500 mb-6">Unidades totales procesadas</p>
              {(() => {
                const d2024 = datosPolloChart.find(d => d.anio === 2024);
                const d2025 = datosPolloChart.find(d => d.anio === 2025);
                const chartData = [
                  { label: '2024', value: d2024?.procesado || 0 },
                  { label: '2025', value: d2025?.procesado || 0 },
                ];
                const dif = d2025 && d2024 ? (d2025.procesado - d2024.procesado) : 0;
                const varPct = d2024?.procesado > 0 ? ((dif / d2024.procesado) * 100).toFixed(1) : 0;
                return (
                  <>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={chartData} margin={{ top: 30, right: 30, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="label" stroke="#6b7280" tick={{ fontSize: 14, fontWeight: 'bold' }} />
                        <YAxis stroke="#6b7280" tickFormatter={(v) => formatNumber(v)} width={80} />
                        <Tooltip formatter={(v) => [formatNumber(v), 'Procesado']} />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {chartData.map((entry, i) => <Cell key={i} fill={i === 0 ? '#3b82f6' : '#10b981'} />)}
                          <LabelList dataKey="value" position="top" style={{ fontSize: '13px', fontWeight: 'bold', fill: '#111827' }} formatter={(v) => formatNumber(v)} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-3 flex justify-center">
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${dif >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        Variación: {dif >= 0 ? '+' : ''}{formatNumber(dif)} ({dif >= 0 ? '+' : ''}{varPct}%)
                      </span>
                    </div>
                  </>
                );
              })()}
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

