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
                  { label: 'Conversión Alimenticia 2025', value: formatDecimal(conversionPollo, 3), val2025: conversionPollo, val2024: parseFloat(anterior.conversion)||0, decimals: 3, suffix: '', sub: 'kg alimento/kg carne', icon: <Target className="w-5 h-5 text-cyan-400" />, border: 'border-cyan-500/30 hover:border-cyan-500', varKey: 'conversion', invertir: true, modal: { title: 'Conversión Alimenticia', desc: `Actual 2025: ${formatDecimal(conversionPollo, 3)} kg alimento/kg carne\nAnterior 2024: ${formatDecimal(anterior.conversion, 3)} kg alimento/kg carne\n\nMide cuántos kg de alimento se necesitan para producir 1 kg de carne. Un valor MENOR es mejor — significa que el ave aprovecha más eficientemente el alimento.\n\nPor eso el color es VERDE cuando baja y ROJO cuando sube, al contrario del estándar financiero.` } },
                  { label: 'Mortalidad 2025', value: `${formatDecimal(mortalidadPollo, 3)}%`, val2025: mortalidadPollo, val2024: parseFloat(anterior.mortalidad_pct)||0, decimals: 3, suffix: '%', sub: 'Tasa de mortalidad', icon: <AlertTriangle className="w-5 h-5 text-red-400" />, border: 'border-red-500/30 hover:border-red-500', varKey: 'mortalidad_pct', invertir: true, modal: { title: 'Mortalidad Pollo', desc: `Actual 2025: ${formatDecimal(mortalidadPollo, 3)}%\nAnterior 2024: ${formatDecimal(anterior.mortalidad_pct, 3)}%\n\nRepresenta el porcentaje de aves que mueren durante el ciclo de engorde. Un valor MENOR es mejor — indica buena bioseguridad, manejo sanitario y condiciones de bienestar animal.\n\nPor eso el color es VERDE cuando baja y ROJO cuando sube, aunque el número sea negativo.` } },
                  { label: 'Peso Promedio 2025', value: formatDecimal(pesoPromedioPollo, 3), val2025: pesoPromedioPollo, val2024: parseFloat(anterior.peso_promedio)||0, decimals: 3, suffix: ' kg', sub: 'kg por ave', icon: <Award className="w-5 h-5 text-yellow-400" />, border: 'border-yellow-500/30 hover:border-yellow-500', varKey: 'peso_promedio', invertir: false, modal: { title: 'Peso Promedio al Sacrificio', desc: `Actual 2025: ${formatDecimal(pesoPromedioPollo, 3)} kg\nAnterior 2024: ${formatDecimal(anterior.peso_promedio, 3)} kg\n\nPeso promedio del ave al momento del sacrificio. Un valor MAYOR es mejor — más peso por ave significa mayor rendimiento en canal y mejor aprovechamiento del ciclo productivo.\n\nPor eso sigue el estándar normal: VERDE cuando sube, ROJO cuando baja.` } },
                  { label: 'Días de Engorde 2025', value: formatDecimal(diasEngordePollo, 3), val2025: diasEngordePollo, val2024: parseFloat(anterior.dias_promedio_engorde)||0, decimals: 3, suffix: ' días', sub: 'días promedio', icon: <TrendingUp className="w-5 h-5 text-orange-400" />, border: 'border-orange-500/30 hover:border-orange-500', varKey: 'dias_promedio_engorde', invertir: true, modal: { title: 'Días de Engorde', desc: `Actual 2025: ${formatDecimal(diasEngordePollo, 3)} días\nAnterior 2024: ${formatDecimal(anterior.dias_promedio_engorde, 3)} días\n\nDías promedio que tarda el ave en alcanzar el peso de sacrificio. Un valor MENOR es mejor — ciclos más cortos reducen costos de alimento, mano de obra y rotación de galpones.\n\nPor eso el color es VERDE cuando baja y ROJO cuando sube, al contrario del estándar financiero.` } },
                  { label: 'Índice Productivo (IP) 2025', value: formatDecimal(efiAlimPollo, 3), val2025: efiAlimPollo, val2024: parseFloat(anterior.efi_alim_ip)||0, decimals: 3, suffix: '', sub: 'IP (Eficiencia)', icon: <Zap className="w-5 h-5 text-purple-400" />, border: 'border-purple-500/30 hover:border-purple-500', varKey: 'efi_alim_ip', invertir: false, modal: { title: 'Índice Productivo (IP)', desc: `Actual 2025: ${formatDecimal(efiAlimPollo, 3)}\nAnterior 2024: ${formatDecimal(anterior.efi_alim_ip, 3)}\n\nIndicador compuesto que integra peso promedio, conversión alimenticia, mortalidad y días de engorde en una sola cifra de eficiencia global. Un valor MAYOR es mejor — refleja que la operación es más eficiente en todos los frentes simultáneamente.\n\nSigue el estándar normal: VERDE cuando sube, ROJO cuando baja.` } },
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
                      <div className="mt-3 pt-3 border-t border-gray-200 text-xs space-y-0.5">
                        <div className="text-gray-500">2024: <span className="font-semibold text-gray-700">{formatDecimal(c.val2024, c.decimals)}{c.suffix}</span></div>
                        <div className="text-gray-500">2025: <span className="font-semibold text-gray-700">{formatDecimal(c.val2025, c.decimals)}{c.suffix}</span></div>
                        <div className={`font-bold ${esBueno ? 'text-green-500' : 'text-red-500'}`}>
                          Var: {vr >= 0 ? '+' : ''}{formatDecimal(vr)}%
                        </div>
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
                  <span className="font-semibold text-gray-900">Análisis Comparativo:</span> Esta tabla muestra todos los indicadores zootécnicos de pollo de engorde comparando 2025 vs 2024. Los valores en verde indican mejoras, mientras que los rojos señalan áreas que requieren atención. La variación relativa permite identificar rápidamente los cambios porcentuales más significativos en cada indicador. Indicadores clave: conversión alimenticia (menor es mejor), mortalidad (menor es mejor), peso promedio (valor de tabla 2.4-2.6 kg), eficiencia alimenticia IP (mayor es mejor).
                </p>
              </div>
            </CollapsibleTable>
          )}
        </>
      )}
    </div>
  );
}

