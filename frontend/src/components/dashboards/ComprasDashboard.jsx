import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell, ComposedChart } from 'recharts';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, X, Info, ArrowUp, ArrowDown } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';
import CollapsibleChart from '../CollapsibleChart';
import KpiCard from '../KpiCard';
import { CustomCurrencyTooltip, CustomPctTooltip, formatCurrencyFull } from './CustomTooltip';
import { formatCOPShort } from '../../utils/formatCurrency';

export default function ComprasDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  };

  if (!data || !data.comprasMensuales) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const { comprasMensuales, totales, mesesMayorCrecimiento, mesesCaidas2024, mesesCaidas2025 } = data;

  const formatCurrency = formatCOPShort;



  // Preparar datos para gráficos
  const mesesCompletos = {
    'Ene': 'Enero', 'Feb': 'Febrero', 'Mar': 'Marzo', 'Abr': 'Abril',
    'May': 'Mayo', 'Jun': 'Junio', 'Jul': 'Julio', 'Ago': 'Agosto',
    'Sep': 'Septiembre', 'Oct': 'Octubre', 'Nov': 'Noviembre', 'Dic': 'Diciembre'
  };

  const datosComparativo = comprasMensuales.map(m => ({
    mes: m.mes.substring(0, 3),
    mesCompleto: m.mes,
    '2025': parseFloat(m.compras) / 1000000,
    '2024': parseFloat(m.compras2024) / 1000000,
    '2023': parseFloat(m.compras2023) / 1000000
  }));

  // Regresión lineal para tendencia de 2025
  const calcTendencia = (datos, key) => {
    const n = datos.length;
    const sumX = datos.reduce((s, _, i) => s + i, 0);
    const sumY = datos.reduce((s, d) => s + (d[key] || 0), 0);
    const sumXY = datos.reduce((s, d, i) => s + i * (d[key] || 0), 0);
    const sumX2 = datos.reduce((s, _, i) => s + i * i, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return datos.map((d, i) => ({ ...d, tendencia2025: parseFloat((intercept + slope * i).toFixed(2)) }));
  };

  const datosComparativoConTendencia = calcTendencia(datosComparativo, '2025');

  const datosVariacion = comprasMensuales.map(m => ({
    mes: m.mes.substring(0, 3),
    mesCompleto: m.mes,
    variacion: parseFloat(m.variacion2025vs2024)
  }));

  return (
    <div className="space-y-6">
      {/* Descripción */}
      <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-6 border border-green-300">
        <p className="text-gray-700">Análisis del proceso estratégico de compras que garantiza el suministro oportuno de materias primas, bienes y servicios, con impacto directo en costos, productividad y calidad. Crecimiento del 9.66% vs 2024, revirtiendo la contracción del año anterior.</p>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          title="Total Compras 2025"
          value={formatCurrencyFull(totales.total2025)}
          unit="Compras totales"
          value2024={formatCurrencyFull(totales.total2024)}
          varPct={parseFloat(totales.variacion2025vs2024)}
          varAbs={`${parseFloat(totales.variacion2025vs2024) >= 0 ? '+' : ''}${formatCurrencyFull(totales.total2025 - totales.total2024)}`}
          icon={<ShoppingCart className="w-5 h-5 text-blue-400" />}
          borderColor="border-blue-400"
          delay={0}
          onClick={() => openModal('Total Compras 2025', 
            <div className="space-y-4">
              <p>El total de compras en 2025 alcanzó <strong className="text-blue-600">{formatCurrencyFull(totales.total2025)}</strong>, representando un crecimiento del <strong className="text-green-600">+{totales.variacion2025vs2024}%</strong> respecto a 2024.</p>
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Contexto del Indicador:</p>
                <p className="text-sm text-gray-700">Las compras incluyen materias primas, bienes y servicios necesarios para la operación, excluyendo alimento, gas, pollo en pie y pollito. Este proceso estratégico garantiza el suministro oportuno con impacto directo en costos, productividad y calidad.</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                <p className="text-sm font-semibold text-green-800 mb-2">Análisis de la Variación:</p>
                <p className="text-sm text-gray-700">El crecimiento de <strong>+{totales.variacion2025vs2024}%</strong> ({formatCurrencyFull(totales.total2025 - totales.total2024)}) revierte la contracción del -2.97% registrada en 2024. Este resultado positivo indica una recuperación sólida en la gestión de compras.</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-300">
                <p className="text-sm font-semibold text-amber-800 mb-2">Factores Explicativos:</p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Restablecimiento de la demanda en el segundo semestre</li>
                  <li>Mejor planificación de inventarios</li>
                  <li>Optimización de la cadena de suministro</li>
                  <li>Recuperación del volumen de producción</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-300">
                <p className="text-sm font-semibold text-gray-800 mb-2">Impacto en el Negocio:</p>
                <p className="text-sm text-gray-700">La recuperación en compras refleja una mayor actividad operativa y respalda el crecimiento en ventas. El promedio mensual de {formatCurrencyFull(totales.total2025 / 12)} muestra estacionalidad con picos en el último trimestre.</p>
              </div>
            </div>
          )}
        />
        <KpiCard
          title="Crecimiento 2025 vs 2024"
          value={`+${totales.variacion2025vs2024}%`}
          unit="Variación anual"
          value2024={formatCurrencyFull(totales.total2024)}
          varPct={parseFloat(totales.variacion2025vs2024)}
          varAbs={`${parseFloat(totales.variacion2025vs2024) >= 0 ? '+' : ''}${formatCurrencyFull(totales.total2025 - totales.total2024)}`}
          icon={<TrendingUp className="w-5 h-5 text-green-400" />}
          borderColor="border-green-400"
          delay={0.1}
          onClick={() => openModal('Crecimiento 2025 vs 2024', 
            <div className="space-y-4">
              <p>El crecimiento de <strong className="text-green-600">+{totales.variacion2025vs2024}%</strong> en 2025 marca un punto de inflexión después del año de ajuste 2024.</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                  <p className="text-xs text-red-600 font-semibold mb-1">2024: Contracción</p>
                  <p className="text-2xl font-bold text-red-700">-2.97%</p>
                  <p className="text-xs text-gray-600 mt-1">Año de ajuste</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <p className="text-xs text-green-600 font-semibold mb-1">2025: Recuperación</p>
                  <p className="text-2xl font-bold text-green-700">+{totales.variacion2025vs2024}%</p>
                  <p className="text-xs text-gray-600 mt-1">Crecimiento sólido</p>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Patrón de Recuperación:</p>
                <p className="text-sm text-gray-700">9 de 12 meses presentan crecimiento positivo. Los meses destacados son Octubre (+49.83%), Agosto (+35.59%) y Septiembre (+31.87%), concentrados en el segundo semestre del año.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300">
                <p className="text-sm font-semibold text-purple-800 mb-2">Conclusión:</p>
                <p className="text-sm text-gray-700">La recuperación sostenida indica que la estrategia de optimización de compras está funcionando. El balance general es positivo con una tendencia al alza que se mantiene estable.</p>
              </div>
            </div>
          )}
        />
        <KpiCard
          title="Promedio Mensual 2025"
          value={formatCurrencyFull(totales.total2025 / 12)}
          unit="Por mes"
          value2024={formatCurrencyFull(totales.total2024 / 12)}
          varPct={parseFloat(totales.variacion2025vs2024)}
          varAbs={`${parseFloat(totales.variacion2025vs2024) >= 0 ? '+' : ''}${formatCurrencyFull((totales.total2025 - totales.total2024) / 12)}`}
          icon={<DollarSign className="w-5 h-5 text-purple-400" />}
          borderColor="border-purple-400"
          delay={0.2}
          onClick={() => openModal('Promedio Mensual de Compras', 
            <div className="space-y-4">
              <p>El promedio mensual de compras en 2025 fue de <strong className="text-purple-600">{formatCurrencyFull(totales.total2025 / 12)}</strong>, un incremento del <strong className="text-green-600">+{totales.variacion2025vs2024}%</strong> respecto al promedio de 2024.</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Promedio 2024</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrencyFull(totales.total2024 / 12)}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <p className="text-xs text-purple-600 font-semibold mb-1">Promedio 2025</p>
                  <p className="text-xl font-bold text-purple-700">{formatCurrencyFull(totales.total2025 / 12)}</p>
                </div>
              </div>
              <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-300">
                <p className="text-sm font-semibold text-amber-800 mb-2">Estacionalidad Identificada:</p>
                <p className="text-sm text-gray-700 mb-2">La distribución mensual muestra un patrón claro con picos en el último trimestre:</p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li><strong>Octubre:</strong> Mes más alto con crecimiento del +49.83%</li>
                  <li><strong>Agosto-Septiembre:</strong> Segundo pico con +35.59% y +31.87%</li>
                  <li><strong>Febrero-Julio:</strong> Meses con caídas moderadas (-6.26%, -2.38%, -1.76%)</li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Interpretación:</p>
                <p className="text-sm text-gray-700">El patrón estacional sugiere mayor demanda en el segundo semestre, posiblemente relacionado con temporadas de mayor producción y ventas. Esta información es clave para la planificación de inventarios y negociación con proveedores.</p>
              </div>
            </div>
          )}
        />
      </div>

      {/* Meses Destacados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={() => openModal('Análisis de Crecimiento 2025', 
          <div className="space-y-4">
            <p className="text-gray-700">Los tres meses con mayor crecimiento explican gran parte de la recuperación total en 2025:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {mesesMayorCrecimiento.map((mes, idx) => (
                <div key={idx} className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                  <p className="text-sm font-semibold text-green-700 mb-1">{mes.mes}</p>
                  <p className="text-3xl font-bold text-green-600">+{mes.variacion}%</p>
                  <p className="text-xs text-gray-600 mt-1">Crecimiento vs 2024</p>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
              <p className="text-sm font-semibold text-blue-800 mb-2">Patrón Identificado:</p>
              <p className="text-sm text-gray-700">El crecimiento se concentra en el segundo semestre (Agosto, Septiembre, Octubre), sugiriendo un restablecimiento de la demanda después del primer semestre más moderado.</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300">
              <p className="text-sm font-semibold text-purple-800 mb-2">Factores Explicativos:</p>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li><strong>Mejor planificación de inventarios:</strong> Optimización de stocks para temporada alta</li>
                <li><strong>Cadena de suministro:</strong> Mejoras en logística y tiempos de entrega</li>
                <li><strong>Demanda estacional:</strong> Mayor actividad productiva en Q3 y Q4</li>
                <li><strong>Recuperación post-ajuste:</strong> Normalización después del año 2024</li>
              </ul>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-300">
              <p className="text-sm font-semibold text-amber-800 mb-2">Impacto en el Negocio:</p>
              <p className="text-sm text-gray-700">Estos tres meses representan el motor de crecimiento del año. El patrón estacional debe considerarse en la planificación presupuestal 2026 para anticipar necesidades de capital de trabajo.</p>
            </div>
          </div>
        )}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 cursor-pointer hover:border-green-500 transition-all"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Análisis de Crecimiento 2025</h3>
            <p className="text-sm text-gray-600 mt-1">Meses con mayor aumento vs 2024</p>
          </div>
          <Info className="w-6 h-6 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mesesMayorCrecimiento.map((mes, idx) => (
            <div key={idx} className="bg-green-50 rounded-xl p-5 border-2 border-green-500/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-bold text-green-600">{mes.mes}</h4>
                <ArrowUp className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">+{mes.variacion}%</div>
              <div className="text-xs text-gray-600">Crecimiento vs 2024</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Gráfico Comparativo Anual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <CollapsibleChart
          title="Comparativo Mensual 2023-2025"
          subtitle="Evolución de compras por mes (en millones)"
          defaultOpen={true}
          className="border-blue-500/30 hover:border-blue-500"
        >
          <div onClick={() => openModal('Evolución Anual de Compras 2023-2025', 
            <div className="space-y-4">
              <p className="text-gray-700">El gráfico muestra tres años con comportamientos distintos que reflejan diferentes etapas de la gestión de compras:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-300">
                  <p className="text-sm font-semibold text-amber-700 mb-2">2023: Año Base</p>
                  <p className="text-sm text-gray-700">Nivel de referencia para comparaciones. Representa la operación normal antes de ajustes.</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300">
                  <p className="text-sm font-semibold text-red-700 mb-2">2024: Ajuste (-2.97%)</p>
                  <p className="text-sm text-gray-700">Año de contracción y optimización. Reducción estratégica del gasto.</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                  <p className="text-sm font-semibold text-green-700 mb-2">2025: Recuperación (+9.66%)</p>
                  <p className="text-sm text-gray-700">Crecimiento sostenido con tendencia positiva durante todo el año.</p>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Línea de Tendencia (Roja Punteada):</p>
                <p className="text-sm text-gray-700">Calculada por regresión lineal sobre los valores mensuales de 2025. Muestra la dirección general del gasto en el período, confirmando una tendencia al alza consistente.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300">
                <p className="text-sm font-semibold text-purple-800 mb-2">Análisis Comparativo:</p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>2025 supera consistentemente a 2024 en 9 de 12 meses</li>
                  <li>El segundo semestre 2025 muestra los mejores resultados</li>
                  <li>La estacionalidad se mantiene similar entre años</li>
                  <li>Octubre es consistentemente el mes más alto</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-300">
                <p className="text-sm font-semibold text-gray-800 mb-2">Conclusión:</p>
                <p className="text-sm text-gray-700">La evolución trianual muestra un ciclo completo: estabilidad (2023) → ajuste (2024) → recuperación (2025). La tendencia positiva de 2025 indica que la estrategia de optimización está dando resultados.</p>
              </div>
            </div>
          )} className="cursor-pointer">
            <ResponsiveContainer width="100%" height={450}>
          <ComposedChart data={datosComparativoConTendencia} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="mes" 
              stroke="#9ca3af" 
              style={{ fontSize: '12px' }} 
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#9ca3af" tickFormatter={(v) => `$${v}M`} style={{ fontSize: '13px' }} width={65} />
            <Tooltip content={<CustomCurrencyTooltip borderColor="#3b82f6" suffix="M" />} />
            <Line type="monotone" dataKey="2025" stroke="#3b82f6" strokeWidth={3} name="2025" />
            <Line type="monotone" dataKey="2024" stroke="#10b981" strokeWidth={2} name="2024" />
            <Line type="monotone" dataKey="2023" stroke="#f59e0b" strokeWidth={2} name="2023" />
            <Line type="linear" dataKey="tendencia2025" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 3, fill: '#ef4444' }} name="Tendencia 2025" />
          </ComposedChart>
        </ResponsiveContainer>
          </div>
        </CollapsibleChart>
      </motion.div>

      {/* Gráfico de Variación Mensual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <CollapsibleChart
          title="Variación Mensual 2025 vs 2024"
          subtitle="Porcentaje de crecimiento o caída por mes"
          defaultOpen={true}
          className="border-purple-500/30 hover:border-purple-500"
        >
          <div onClick={() => openModal('Variación Mensual 2025 vs 2024', 
            <div className="space-y-4">
              <p className="text-gray-700">El análisis mes a mes revela un patrón de recuperación con 9 de 12 meses en positivo:</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                  <p className="text-sm font-semibold text-green-700 mb-2">Meses Positivos (9)</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Octubre: <strong>+49.83%</strong></li>
                    <li>• Agosto: <strong>+35.59%</strong></li>
                    <li>• Septiembre: <strong>+31.87%</strong></li>
                    <li>• Enero, Marzo, Mayo, Junio, Noviembre, Diciembre</li>
                  </ul>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300">
                  <p className="text-sm font-semibold text-red-700 mb-2">Meses Negativos (3)</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Julio: <strong>-6.26%</strong></li>
                    <li>• Junio: <strong>-2.38%</strong></li>
                    <li>• Febrero: <strong>-1.76%</strong></li>
                  </ul>
                  <p className="text-xs text-gray-600 mt-2">Caídas moderadas y puntuales</p>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Causas de las Caídas:</p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li><strong>Ajustes estacionales:</strong> Febrero y Julio son meses tradicionalmente más bajos</li>
                  <li><strong>Estrategia de inventarios:</strong> Posible reducción planificada de stocks</li>
                  <li><strong>Ciclo productivo:</strong> Menor demanda en ciertos períodos del año</li>
                  <li><strong>Optimización:</strong> Compras más eficientes con menor volumen</li>
                </ul>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300">
                <p className="text-sm font-semibold text-purple-800 mb-2">Impacto en el Negocio:</p>
                <p className="text-sm text-gray-700">Las caídas son menores comparadas con las de 2024, lo que indica mayor estabilidad en la gestión. El balance general es positivo con una recuperación sostenida que se mantiene durante todo el año.</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-300">
                <p className="text-sm font-semibold text-amber-800 mb-2">Conclusión:</p>
                <p className="text-sm text-gray-700">El 75% de los meses en positivo (9/12) confirma una tendencia de recuperación sólida. Las caídas puntuales no afectan el resultado anual de +9.66%.</p>
              </div>
            </div>
          )} className="cursor-pointer">
            <ResponsiveContainer width="100%" height={450}>
          <BarChart data={datosVariacion} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="mes" 
              stroke="#9ca3af" 
              style={{ fontSize: '12px' }} 
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#9ca3af" 
              tickFormatter={(v) => `${v}%`} 
              style={{ fontSize: '13px' }}
              domain={[-25, 55]}
            />
            <Tooltip content={<CustomPctTooltip borderColor="#a855f7" />} />
            <Bar dataKey="variacion" radius={[8, 8, 0, 0]}>
              {datosVariacion.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.variacion >= 0 ? '#10b981' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
          </div>
        </CollapsibleChart>
      </motion.div>

      {/* Tabla Completa de Compras Mensuales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="rounded-xl overflow-hidden border-4 border-indigo-500/30"
      >
        <CollapsibleTable
          title="Detalle de Compras por Mes 2023-2025"
          defaultOpen={false}
          totalRow={[
            { label: 'TOTAL COMPRAS 2025' },
            { label: `${formatCurrency(totales.total2025)}`, color: 'text-blue-600' },
            { label: `Var: +${totales.variacion2025vs2024}%`, color: 'text-green-500', badge: true, badgeColor: 'bg-green-500', badgeIcon: '?' },
            { label: `vs 2024: ${formatCurrency(totales.total2024)}`, color: 'text-gray-500' },
          ]}
        >
          <p className="text-sm text-gray-600 mb-4">Valores en pesos colombianos y variaciones porcentuales</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-3 px-3">Mes</th>
                  <th className="text-right py-3 px-3">2025</th>
                  <th className="text-right py-3 px-3">2024</th>
                  <th className="text-right py-3 px-3">2023</th>
                  <th className="text-right py-3 px-3">Var 25/24</th>
                  <th className="text-right py-3 px-3">Var 24/23</th>
                </tr>
              </thead>
              <tbody>
                {comprasMensuales.map((mes, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-3 font-semibold">{mes.mes}</td>
                    <td className="py-3 px-3 text-right">${formatCurrencyFull(mes.compras)}</td>
                    <td className="py-3 px-3 text-right text-gray-600">${formatCurrencyFull(mes.compras2024)}</td>
                    <td className="py-3 px-3 text-right text-gray-600">${formatCurrencyFull(mes.compras2023)}</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`font-semibold px-2 py-1 rounded inline-block ${parseFloat(mes.variacion2025vs2024) >= 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                        {parseFloat(mes.variacion2025vs2024) >= 0 ? '+' : ''}{mes.variacion2025vs2024}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={`font-semibold px-2 py-1 rounded inline-block ${parseFloat(mes.variacion2024vs2023) >= 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                        {parseFloat(mes.variacion2024vs2023) >= 0 ? '+' : ''}{mes.variacion2024vs2023}%
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-gray-400 font-bold bg-gray-100">
                  <td className="py-3 px-3 text-gray-900">TOTALES</td>
                  <td className="py-3 px-3 text-right">${formatCurrencyFull(totales.total2025)}</td>
                  <td className="py-3 px-3 text-right text-gray-700">${formatCurrencyFull(totales.total2024)}</td>
                  <td className="py-3 px-3 text-right text-gray-700">${formatCurrencyFull(totales.total2023)}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="font-semibold px-2 py-1 rounded inline-block text-green-700 bg-green-50">+{totales.variacion2025vs2024}%</span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="font-semibold px-2 py-1 rounded inline-block text-red-700 bg-red-50">{totales.variacion2024vs2023}%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-300">
              <div className="text-xs text-gray-600 mb-1">Crecimiento 2025</div>
              <div className="text-2xl font-bold text-green-600">+9.66%</div>
              <div className="text-xs text-gray-600 mt-1">Recuperación sólida</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-300">
              <div className="text-xs text-gray-600 mb-1">Contracción 2024</div>
              <div className="text-2xl font-bold text-red-600">-2.97%</div>
              <div className="text-xs text-gray-600 mt-1">Año de ajuste</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
              <div className="text-xs text-gray-600 mb-1">Promedio Mensual 2025</div>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(totales.total2025 / 12)}</div>
              <div className="text-xs text-gray-600 mt-1">Por mes</div>
            </div>
          </div>
        </CollapsibleTable>
      </motion.div>

      {/* Análisis de Caídas 2025 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        onClick={() => openModal('Meses con Mayor Caída 2025 vs 2024', 
          <div className="space-y-4">
            <p className="text-gray-700">Aunque 2025 fue un año de recuperación general (+9.66%), estos tres meses presentaron caídas menores:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {mesesCaidas2025.map((mes, idx) => (
                <div key={idx} className="bg-red-50 rounded-lg p-4 border-2 border-red-300">
                  <p className="text-sm font-semibold text-red-700 mb-1">{mes.mes}</p>
                  <p className="text-3xl font-bold text-red-600">{mes.variacion}%</p>
                  <p className="text-xs text-gray-600 mt-1">Caída vs 2024</p>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
              <p className="text-sm font-semibold text-blue-800 mb-2">Contexto de las Caídas:</p>
              <p className="text-sm text-gray-700">Las reducciones fueron moderadas comparadas con las caídas de 2024 (que llegaron hasta -30.83% en Agosto). Esto indica una mayor estabilidad en la gestión de compras.</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300">
              <p className="text-sm font-semibold text-purple-800 mb-2">Análisis por Mes:</p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li><strong>Julio (-6.26%):</strong> Mayor caída del año, posiblemente relacionada con ajuste de inventarios post-semestre</li>
                <li><strong>Junio (-2.38%):</strong> Reducción menor, dentro de variación normal</li>
                <li><strong>Febrero (-1.76%):</strong> Caída mínima, mes tradicionalmente bajo</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
              <p className="text-sm font-semibold text-green-800 mb-2">Comparación con 2024:</p>
              <p className="text-sm text-gray-700">En 2024, las caídas fueron mucho más pronunciadas: Agosto (-30.83%), Marzo (-28.25%), Enero (-21%). Las caídas de 2025 son significativamente menores, lo que refleja mejor control y planificación.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-300">
              <p className="text-sm font-semibold text-gray-800 mb-2">Conclusión:</p>
              <p className="text-sm text-gray-700">Las caídas puntuales no comprometen el resultado anual positivo. La magnitud reducida de estas variaciones negativas demuestra una gestión más estable y predecible en 2025.</p>
            </div>
          </div>
        )}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-red-500/30 cursor-pointer hover:border-red-500 transition-all"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Meses con Mayor Caída 2025 vs 2024</h3>
            <p className="text-sm text-gray-600 mt-1">Caídas moderadas en año de recuperación</p>
          </div>
          <Info className="w-6 h-6 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mesesCaidas2025.map((mes, idx) => (
            <div key={idx} className="bg-red-50 rounded-xl p-5 border-2 border-red-500/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-bold text-red-600">{mes.mes}</h4>
                <ArrowDown className="w-6 h-6 text-red-400" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{mes.variacion}%</div>
              <div className="text-xs text-gray-600">Caída 2025 vs 2024</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Conclusiones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-5 border-2 border-green-500/30"
        >
          <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Crecimiento 2025
          </h4>
          <div className="space-y-2 text-xs sm:text-sm text-gray-700">
            <div>• Crecimiento total: +9.66% vs 2024</div>
            <div>• Octubre: +49.83% (mayor aumento)</div>
            <div>• Agosto: +35.59% (crecimiento fuerte)</div>
            <div>• Septiembre: +31.87% (demanda sostenida)</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-5 border-2 border-blue-500/30"
        >
          <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            Alcance del Proceso
          </h4>
          <div className="space-y-2 text-xs sm:text-sm text-gray-700">
            <div>• Suministro oportuno de materias primas</div>
            <div>• Optimización de costos operativos</div>
            <div>• Gestión estratégica de proveedores</div>
            <div>• Excluye: alimento, gas, pollo en pie, pollito</div>
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
              className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-blue-500 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-cyan-600" />
                  <h3 className="text-xl font-bold text-gray-900">{modalContent.title}</h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-gray-600 hover:text-gray-900 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 pr-2 text-gray-700 leading-relaxed">{modalContent.content}</div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
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
