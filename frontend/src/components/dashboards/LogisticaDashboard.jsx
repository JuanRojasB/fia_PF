import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LabelList } from 'recharts';
import { Truck, TrendingUp, Building, X, Info } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';
import CollapsibleChart from '../CollapsibleChart';
import KpiCard from '../KpiCard';
import { formatCurrencyFull } from './CustomTooltip';
import { formatCOPShort } from '../../utils/formatCurrency';

export default function LogisticaDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });
  const hasAnimated = useRef(false);

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  };

  // Manejar estructura del backend: { items: [...], totales: {...}, sedes: [...] }
  // o array directo para compatibilidad
  const logisticaData = Array.isArray(data) ? data : (data?.items || []);
  
  console.log('LogisticaDashboard - data recibida:', {
    isArray: Array.isArray(data),
    hasItems: !!data?.items,
    logisticaDataLength: logisticaData.length,
    sample: logisticaData[0],
    totales: data?.totales,
    sedes: data?.sedes
  });
  
  if (logisticaData.length === 0) {
    return <div className="text-gray-600">No hay datos disponibles</div>;
  }

  const formatCurrency = formatCOPShort;

  const conceptosMap = {};
  // Valor completo para tooltips (sin abreviar)
  const formatFull = (value) => {
    if (!value && value !== 0) return '$0';
    const v = parseFloat(value);
    return '$' + new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.round(v));
  };
  logisticaData.forEach(d => {
    // Filtrar registros con sede null, undefined o que no sean SEDE1, SEDE2, SEDE3
    const sedeNormalizada = (d.sede || '').toString().trim().toUpperCase();
    if (!sedeNormalizada || sedeNormalizada === 'NULL' || !['SEDE1', 'SEDE2', 'SEDE3'].includes(sedeNormalizada)) return;
    
    const conceptoNormalizado = (d.concepto || '').toString().trim();
    if (!conceptoNormalizado) return;
    
    // Filtrar filas de TOTAL que vienen de la base de datos
    const conceptoUpper = conceptoNormalizado.toUpperCase();
    if (conceptoUpper.includes('TOTAL') || conceptoUpper.includes('GASTOS LOGISTICOS')) return;
    
    const anio = parseInt(d.anio);
    if (anio !== 2024 && anio !== 2025) return;
    
    const key = `${sedeNormalizada}-${conceptoNormalizado}-${anio}`;
    const valor = parseFloat(d.valor) || 0;
    
    // Solo guardar si no existe o si el nuevo valor es diferente de 0
    if (!conceptosMap[key] || valor !== 0) {
      conceptosMap[key] = {
        sede: sedeNormalizada,
        concepto: conceptoNormalizado,
        anio: anio,
        valor: valor
      };
    }
  });
  
  // Reorganizar por concepto y sede
  const conceptosPorSede = {};
  Object.values(conceptosMap).forEach(d => {
    const key = `${d.sede}-${d.concepto}`;
    if (!conceptosPorSede[key]) {
      conceptosPorSede[key] = { sede: d.sede, concepto: d.concepto, valor2024: 0, valor2025: 0 };
    }
    if (d.anio === 2024) conceptosPorSede[key].valor2024 = d.valor;
    else if (d.anio === 2025) conceptosPorSede[key].valor2025 = d.valor;
  });
  
  const conceptosData = Object.values(conceptosPorSede);
  const total2025 = conceptosData.reduce((sum, d) => sum + d.valor2025, 0);
  const total2024 = conceptosData.reduce((sum, d) => sum + d.valor2024, 0);
  const variacionTotal = total2024 > 0 ? (((total2025 - total2024) / total2024) * 100).toFixed(1) : 0;

  const sedesMap = {};
  conceptosData.forEach(d => {
    // Solo incluir SEDE1, SEDE2, SEDE3
    const sedeNormalizada = (d.sede || '').toString().trim().toUpperCase();
    if (!['SEDE1', 'SEDE2', 'SEDE3'].includes(sedeNormalizada)) return;
    
    if (!sedesMap[sedeNormalizada]) sedesMap[sedeNormalizada] = { sede: sedeNormalizada, total2024: 0, total2025: 0 };
    sedesMap[sedeNormalizada].total2024 += d.valor2024;
    sedesMap[sedeNormalizada].total2025 += d.valor2025;
  });
  
  // Ordenar las sedes: SEDE1, SEDE2, SEDE3
  const sedesData = ['SEDE1', 'SEDE2', 'SEDE3']
    .map(sede => sedesMap[sede])
    .filter(Boolean);

  const COLORS = ['#38bdf8', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          title="Total Gastos Logísticos 2025"
          value={formatCurrencyFull(total2025)}
          value2024={formatCurrencyFull(total2024)}
          varPct={parseFloat(variacionTotal)}
          varAbs={`${parseFloat(variacionTotal) >= 0 ? '+' : ''}${formatCurrencyFull(total2025 - total2024)}`}
          icon={<Truck className="w-6 h-6 text-blue-400" />}
          borderColor="border-blue-400"
          invertColors={true}
          delay={0}
          onClick={() => openModal('Total Gastos Logísticos 2025', (
            <div className="space-y-4 text-gray-700">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Contexto del indicador</p>
                <p className="text-sm">El área logística opera con una capacidad de aproximadamente <strong className="text-blue-600">3 millones de kg/mes</strong> distribuidos en 3 sedes activas (Sede 1, Sede 2 y Sede 3). Los gastos logísticos incluyen transporte, almacenamiento, personal operativo y costos de distribución a puntos de venta y clientes mayoristas.</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Composición del gasto</p>
                <p className="text-sm">Los gastos se distribuyen entre las tres sedes operativas, cada una con su propia estructura de costos según el volumen de operación y la cobertura geográfica que atiende. La variación frente a 2024 refleja el crecimiento del volumen operado y los ajustes en la estructura logística.</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Impacto en el negocio</p>
                <p className="text-sm">Los gastos logísticos son un componente crítico del costo de ventas. Un incremento superior al crecimiento en ventas indica pérdida de eficiencia logística, mientras que un incremento menor al crecimiento en ventas indica mejora en la productividad del área.</p>
              </div>
            </div>
          ))}
        />
        <KpiCard
          title="Variación Gastos Logísticos 2025 vs 2024"
          value={formatCurrencyFull(Math.abs(total2025 - total2024))}
          value2024={formatCurrencyFull(total2024)}
          varPct={parseFloat(variacionTotal)}
          varLabel={parseFloat(variacionTotal) >= 0 ? 'incremento' : 'reducción'}
          icon={<TrendingUp className="w-6 h-6 text-green-400" />}
          borderColor="border-green-400"
          invertColors={true}
          delay={0.1}
          onClick={() => openModal('Variación de Gastos Logísticos 2025 vs 2024', (
            <div className="space-y-4 text-gray-700">
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Qué mide este indicador</p>
                <p className="text-sm">Este indicador muestra la <strong>diferencia absoluta en pesos</strong> entre el gasto logístico total de 2025 y el de 2024, así como el porcentaje de variación. Permite evaluar si la estructura de costos logísticos está creciendo de forma controlada o si hay desviaciones que requieren atención.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Cómo interpretar la variación</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Verde (reducción): el área logística mejoró su eficiencia de costos</li>
                  <li>Rojo (incremento): los costos crecieron, requiere análisis por concepto y sede</li>
                  <li>La variación debe compararse con el crecimiento en volumen de ventas para determinar si es proporcional</li>
                </ul>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Factores que pueden explicar variaciones</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Incremento en tarifas de transporte y combustible</li>
                  <li>Mayor volumen de operación en alguna sede</li>
                  <li>Cambios en la estructura de distribución</li>
                  <li>Ajustes salariales del personal logístico</li>
                </ul>
              </div>
            </div>
          ))}
        />
        <KpiCard
          title="Sedes Logísticas Activas 2025"
          value={sedesData.length}
          unit="Activas"
          icon={<Building className="w-6 h-6 text-purple-400" />}
          borderColor="border-purple-400"
          delay={0.2}
          onClick={() => openModal('Sedes Logísticas Activas 2025', (
            <div className="space-y-4 text-gray-700">
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Estructura operativa</p>
                <p className="text-sm">La operación logística se distribuye en <strong className="text-purple-600">3 centros de distribución</strong>: Sede 1, Sede 2 y Sede 3. Cada sede atiende una zona geográfica específica y tiene su propia estructura de costos según el volumen operado y la complejidad de la distribución.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Rol de cada sede</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Cada sede gestiona la distribución a puntos de venta y clientes de su zona</li>
                  <li>Los gastos varían según el volumen de kilos distribuidos y la cobertura geográfica</li>
                  <li>La comparación entre sedes permite identificar oportunidades de eficiencia</li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Análisis comparativo</p>
                <p className="text-sm">Las tablas detalladas por sede permiten identificar qué conceptos de gasto crecieron más en cada sede y tomar decisiones focalizadas para optimizar la estructura de costos logísticos.</p>
              </div>
            </div>
          ))}
        />
      </div>

      {/* Layout principal: sidebar consolidado + contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">

        {/* Sidebar: Tabla Consolidada */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl overflow-hidden"
        >
          <CollapsibleTable
            title="CONSOLIDADO TODAS LAS SEDES 2024 VS 2025"
            defaultOpen={true}
            totalRow={[
              { label: 'TOTAL CONSOLIDADO' },
              { label: `$ ${total2024.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, color: 'text-cyan-600' },
              { label: `$ ${total2025.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, color: 'text-orange-500' },
              { label: `${variacionTotal}%`, color: parseFloat(variacionTotal) > 0 ? 'text-red-500' : 'text-green-500', badge: true, badgeColor: parseFloat(variacionTotal) > 0 ? 'bg-red-500' : 'bg-green-500', badgeIcon: parseFloat(variacionTotal) > 0 ? '↑' : '↓' },
              { label: `$ ${Math.abs(total2025 - total2024).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, color: 'text-orange-500' },
            ]}
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-blue-600 border-b-2 border-gray-300">
                  <th className="text-left py-3 px-4 text-gray-900 font-bold">CONCEPTO</th>
                  <th className="text-right py-3 px-4 text-gray-900 font-bold">2024</th>
                  <th className="text-right py-3 px-4 text-gray-900 font-bold">2025</th>
                  <th className="text-right py-3 px-4 text-gray-900 font-bold">% Var</th>
                  <th className="text-right py-3 px-4 text-gray-900 font-bold">Dif. $</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const consolidado = {};
                  conceptosData.forEach(d => {
                    if (!consolidado[d.concepto]) {
                      consolidado[d.concepto] = { concepto: d.concepto, valor2024: 0, valor2025: 0 };
                    }
                    consolidado[d.concepto].valor2024 += d.valor2024;
                    consolidado[d.concepto].valor2025 += d.valor2025;
                  });
                  const consolidadoArray = Object.values(consolidado);
                  let totalConsolidado2024 = 0;
                  let totalConsolidado2025 = 0;
                  return (
                    <>
                      {consolidadoArray.map((row, idx) => {
                        totalConsolidado2024 += row.valor2024;
                        totalConsolidado2025 += row.valor2025;
                        const variacion = row.valor2024 > 0 ? (((row.valor2025 - row.valor2024) / row.valor2024) * 100) : 0;
                        const diferencia = row.valor2025 - row.valor2024;
                        const esIncremento = diferencia > 0;
                        return (
                          <tr key={idx} className="border-b border-gray-200/30 hover:bg-gray-100/20">
                            <td className="py-2 px-4 text-gray-900">{row.concepto}</td>
                            <td className="py-2 px-4 text-right text-cyan-300 tabular-nums">$ {row.valor2024.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                            <td className="py-2 px-4 text-right text-orange-300 tabular-nums">$ {row.valor2025.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                            <td className="py-2 px-4 text-right tabular-nums">
                              <span className={esIncremento ? 'text-red-400' : 'text-green-400'}>{variacion.toFixed(2)}%</span>
                            </td>
                            <td className="py-2 px-4 text-right tabular-nums">
                              <span className={`inline-flex items-center gap-1 ${esIncremento ? 'text-red-400' : 'text-green-400'}`}>
                                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${esIncremento ? 'bg-red-500' : 'bg-green-500'}`}>{esIncremento ? '↑' : '↓'}</span>
                                $ {Math.abs(diferencia).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="bg-gray-100/50 border-t-2 border-gray-400 font-bold">
                        <td className="py-3 px-4 text-gray-900">TOTAL</td>
                        <td className="py-3 px-4 text-right text-cyan-300 tabular-nums">$ {totalConsolidado2024.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                        <td className="py-3 px-4 text-right text-orange-300 tabular-nums">$ {totalConsolidado2025.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                        <td className="py-3 px-4 text-right tabular-nums">
                          <span className={totalConsolidado2025 > totalConsolidado2024 ? 'text-red-400' : 'text-green-400'}>
                            {(((totalConsolidado2025 - totalConsolidado2024) / totalConsolidado2024) * 100).toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums">
                          <span className={`inline-flex items-center gap-1 ${totalConsolidado2025 > totalConsolidado2024 ? 'text-red-400' : 'text-green-400'}`}>
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${totalConsolidado2025 > totalConsolidado2024 ? 'bg-red-500' : 'bg-green-500'}`}>
                              {totalConsolidado2025 > totalConsolidado2024 ? '↑' : '↓'}
                            </span>
                            $ {Math.abs(totalConsolidado2025 - totalConsolidado2024).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </span>
                        </td>
                      </tr>
                    </>
                  );
                })()}
              </tbody>
            </table>
          </CollapsibleTable>
        </motion.div>

        {/* Contenido principal: gráficas + tablas por sede */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CollapsibleChart title="Gastos Logísticos por Sede (2024 vs 2025)" defaultOpen={false}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={sedesData} margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="sede" stroke="#9ca3af" style={{ fontSize: '14px' }} />
              <YAxis stroke="#9ca3af" width={80} />
              <Tooltip content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const val2024 = payload.find(p => p.dataKey === 'total2024')?.value || 0;
                  const val2025 = payload.find(p => p.dataKey === 'total2025')?.value || 0;
                  const diferencia = val2025 - val2024;
                  const variacion = val2024 > 0 ? ((diferencia / val2024) * 100).toFixed(1) : 0;
                  return (
                    <div className="bg-white border-2 border-blue-500 rounded-xl p-4 shadow-xl">
                      <p className="font-bold text-gray-900 mb-3 text-lg">{label}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center gap-4"><span className="text-indigo-600 font-medium">2024:</span><span className="font-bold text-gray-900">{formatFull(val2024)}</span></div>
                        <div className="flex justify-between items-center gap-4"><span className="text-green-600 font-medium">2025:</span><span className="font-bold text-gray-900">{formatFull(val2025)}</span></div>
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="flex justify-between items-center gap-4"><span className="text-gray-600 font-medium">Diferencia:</span><span className={`font-bold ${diferencia >= 0 ? 'text-red-600' : 'text-green-600'}`}>{diferencia >= 0 ? '+' : ''}{formatFull(diferencia)}</span></div>
                          <div className="flex justify-between items-center gap-4 mt-1"><span className="text-gray-600 font-medium">Variación:</span><span className={`font-bold ${variacion >= 0 ? 'text-red-600' : 'text-green-600'}`}>{variacion >= 0 ? '+' : ''}{variacion}%</span></div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }} />
              <Bar dataKey="total2024" fill="#6366f1" name="2024" radius={[8, 8, 0, 0]}>
                <LabelList dataKey="total2024" position="top" style={{ fontSize: '11px', fill: '#6366f1', fontWeight: 'bold' }} formatter={() => '2024'} />
              </Bar>
              <Bar dataKey="total2025" fill="#10b981" name="2025" radius={[8, 8, 0, 0]}>
                <LabelList dataKey="total2025" position="top" style={{ fontSize: '11px', fill: '#10b981', fontWeight: 'bold' }} formatter={() => '2025'} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
            </CollapsibleChart>
            <CollapsibleChart title="Distribución de Gastos por Sede 2025 (%)" defaultOpen={false}>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie 
                isAnimationActive={!hasAnimated.current}
                animationBegin={0}
                animationDuration={800}
                onAnimationEnd={() => { hasAnimated.current = true; }}
                data={sedesData} dataKey="total2025" nameKey="sede" cx="50%" cy="50%" outerRadius={120}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}>
                {sedesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0];
                  const total = sedesData.reduce((sum, s) => sum + s.total2025, 0);
                  const porcentaje = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
                  return (
                    <div className="bg-white border-2 border-green-500 rounded-xl p-4 shadow-xl">
                      <p className="font-bold text-gray-900 mb-3 text-lg">{data.name}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center gap-4"><span className="text-gray-600 font-medium">Gasto 2025:</span><span className="font-bold text-gray-900">{formatFull(data.value)}</span></div>
                        <div className="flex justify-between items-center gap-4"><span className="text-green-600 font-medium">Participación:</span><span className="font-bold text-gray-900">{porcentaje}%</span></div>
                      </div>
                    </div>
                  );
                }
                return null;
              }} />
            </PieChart>
          </ResponsiveContainer>
            </CollapsibleChart>
          </div>

          {/* Tablas detalladas por sede */}
          {['SEDE1', 'SEDE2', 'SEDE3'].map((sede, idx) => {
        const conceptosSede = conceptosData.filter(d => d.sede === sede);
        if (conceptosSede.length === 0) return null;

        const totalSede2024 = conceptosSede.reduce((sum, d) => sum + d.valor2024, 0);
        const totalSede2025 = conceptosSede.reduce((sum, d) => sum + d.valor2025, 0);
        const variacionSede = totalSede2024 > 0 ? (((totalSede2025 - totalSede2024) / totalSede2024) * 100) : 0;

        return (
          <motion.div
            key={sede}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + idx * 0.1 }}
            className="rounded-xl overflow-hidden"
          >
            <CollapsibleTable
              title={`GASTOS OPERACIONALES LOGÍSTICOS ${sede} AÑO 2024 VS 2025`}
              defaultOpen={false}
              totalRow={[
                { label: `TOTAL GASTOS LOGÍSTICOS ${sede}` },
                { label: `$ ${totalSede2024.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, color: 'text-cyan-600' },
                { label: `$ ${totalSede2025.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, color: 'text-orange-500' },
                { label: `${variacionSede.toFixed(2)}%`, color: variacionSede > 0 ? 'text-red-500' : 'text-green-500', badge: true, badgeColor: variacionSede > 0 ? 'bg-red-500' : 'bg-green-500', badgeIcon: variacionSede > 0 ? '↑' : '↓' },
              ]}
            >
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-blue-600 border-b-2 border-gray-300">
                  <th className="text-left py-3 px-4 text-gray-900 font-bold">CONCEPTO</th>
                  <th className="text-right py-3 px-4 text-gray-900 font-bold">TOTAL 2024</th>
                  <th className="text-right py-3 px-4 text-gray-900 font-bold">TOTAL 2025</th>
                  <th className="text-right py-3 px-4 text-gray-900 font-bold">
                    <span className="inline-flex items-center gap-1 justify-end">
                      % Var 25/24
                      <span className="relative group cursor-help">
                        <span className="w-4 h-4 rounded-full bg-white/30 text-gray-900 text-xs flex items-center justify-center font-bold">?</span>
                        <span className="absolute right-0 top-6 z-50 hidden group-hover:block w-56 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl leading-relaxed">
                          🟢 Verde = reducción de gasto (positivo para la empresa)<br/>
                          🔴 Rojo = incremento de gasto (requiere atención)
                        </span>
                      </span>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {conceptosSede.map((row, rowIdx) => {
                  const variacion = row.valor2024 > 0 ? (((row.valor2025 - row.valor2024) / row.valor2024) * 100) : 0;
                  const esIncremento = variacion > 0;
                  
                  return (
                    <tr key={rowIdx} className="border-b border-gray-200/30 hover:bg-gray-100/20">
                      <td className="py-2 px-4 text-gray-900">{row.concepto}</td>
                      <td className="py-2 px-4 text-right text-cyan-300 tabular-nums">
                        $ {row.valor2024.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td className="py-2 px-4 text-right text-orange-300 tabular-nums">
                        $ {row.valor2025.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td className="py-2 px-4 text-right tabular-nums">
                        <span className={`inline-flex items-center gap-1 ${esIncremento ? 'text-red-400' : 'text-green-400'}`}>
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${esIncremento ? 'bg-red-500' : 'bg-green-500'}`}>
                            {esIncremento ? '↑' : '↓'}
                          </span>
                          {variacion.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-gray-100/50 border-t-2 border-gray-400 font-bold">
                  <td className="py-3 px-4 text-gray-900">TOTAL GASTOS LOGÍSTICOS 2023 VS 2024</td>
                  <td className="py-3 px-4 text-right text-cyan-300 tabular-nums">
                    $ {totalSede2024.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-4 text-right text-orange-300 tabular-nums">
                    $ {totalSede2025.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums">
                    <span className={`inline-flex items-center gap-1 ${variacionSede > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${variacionSede > 0 ? 'bg-red-500' : 'bg-green-500'}`}>
                        {variacionSede > 0 ? '↑' : '↓'}
                      </span>
                      {variacionSede.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            </CollapsibleTable>
          </motion.div>
        );
      })}
        </div>{/* end main content */}
      </div>{/* end sidebar+main grid */}

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
                className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-blue-500 shadow-2xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-4 flex-shrink-0">
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
                <div className="text-gray-700 leading-relaxed overflow-y-auto flex-1 pr-2">
                  {modalContent.content}
                </div>
                <div className="mt-6 flex justify-end flex-shrink-0">
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
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}