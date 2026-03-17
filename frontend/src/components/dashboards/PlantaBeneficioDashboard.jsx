import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ComposedChart, LabelList } from 'recharts';
import { Factory, TrendingDown, Info, X, Activity, Award, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { CustomBarTooltip, CustomPctTooltip } from './CustomTooltip';
import CollapsibleChart from '../CollapsibleChart';
import KpiCard from '../KpiCard';

const fmtN = (v) => new Intl.NumberFormat('es-CO').format(Math.round(v));

const TooltipAves = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const mesCompleto = payload[0]?.payload?.mesCompleto || label;
  return (
    <div className="bg-white rounded-xl shadow-2xl p-4 min-w-[210px] border-2 border-blue-400">
      <p className="font-bold text-gray-900 text-sm mb-3 pb-2 border-b border-gray-100">{mesCompleto}</p>
      <div className="space-y-2">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="text-sm text-gray-600">{entry.name}:</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{fmtN(entry.value)} aves</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TooltipPesos = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const mesCompleto = payload[0]?.payload?.mesCompleto || label;
  return (
    <div className="bg-white rounded-xl shadow-2xl p-4 min-w-[200px] border-2 border-green-400">
      <p className="font-bold text-gray-900 text-sm mb-3 pb-2 border-b border-gray-100">{mesCompleto}</p>
      <div className="space-y-2">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="text-sm text-gray-600">{entry.name}:</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{entry.value}g</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TooltipKg = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const cat = payload[0]?.payload?.categoriaCompleta || label;
  return (
    <div className="bg-white rounded-xl shadow-2xl p-4 min-w-[230px] border-2 border-orange-400">
      <p className="font-bold text-gray-900 text-sm mb-3 pb-2 border-b border-gray-100">{cat}</p>
      <div className="space-y-2">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="text-sm text-gray-600">{entry.name}:</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{fmtN(entry.value)} kg</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function PlantaBeneficioDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  };

  // Datos hardcodeados de aves procesadas mensual 2024 vs 2025
  const avesProcessadasMensual = [
    { aves_2024: 1381940, aves_2025: 1138593 },
    { aves_2024: 1497420, aves_2025: 987813 },
    { aves_2024: 1514470, aves_2025: 1503670 },
    { aves_2024: 1565990, aves_2025: 1461700 },
    { aves_2024: 1460260, aves_2025: 1743130 },
    { aves_2024: 1474570, aves_2025: 1536490 },
    { aves_2024: 1381820, aves_2025: 1455100 },
    { aves_2024: 1502890, aves_2025: 1587210 },
    { aves_2024: 1398310, aves_2025: 1417860 },
    { aves_2024: 1736570, aves_2025: 1844070 },
    { aves_2024: 1526970, aves_2025: 1663280 },
    { aves_2024: 1441070, aves_2025: 1405190 },
  ];

  const totalAves2024 = 17882340;
  const totalAves2025 = 17744156;

  // Usar datos de BD para el resto, con fallback
  const promedioPesos = data?.promedioPesos || [];
  const participacionRangos = data?.participacionRangos || [];
  const descartesKilos = data?.descartesKilos || [];
  const participacionCanal = data?.participacionCanal || [];
  const totales = data?.totales || {
    totalAves2024,
    totalAves2025,
    promedioPeso2024: 1983,
    promedioPeso2025: 1987
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('es-CO').format(value);
  };

  const formatDecimal = (value, decimals = 2) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };

  // Preparar datos para gráficos
  const mesesAbrev = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const mesesCompletos = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const datosAvesMensuales = avesProcessadasMensual.map((m, idx) => ({
    mes: mesesAbrev[idx],
    mesCompleto: mesesCompletos[idx],
    '2025': m.aves_2025,
    '2024': m.aves_2024
  }));

  const datosPesosMensuales = promedioPesos.map((m, idx) => ({
    mes: mesesAbrev[idx],
    mesCompleto: mesesCompletos[idx],
    '2025': m.promedio_2025,
    '2024': m.promedio_2024
  }));

  // Datos para participación por rangos (líneas)
  const datosRangos = [
    { rango: '570-1377g', '2024': participacionRangos[0].rango_570_1377, '2025': participacionRangos[1].rango_570_1377 },
    { rango: '1378-1816g (Asadero)', '2024': participacionRangos[0].rango_1378_1816, '2025': participacionRangos[1].rango_1378_1816 },
    { rango: '1817-1928g', '2024': participacionRangos[0].rango_1817_1928, '2025': participacionRangos[1].rango_1817_1928 }
  ];

  // Datos para descartes (barras agrupadas)
  const datosDescartes = descartesKilos.map(d => ({
    categoria: d.categoria.length > 20 ? d.categoria.substring(0, 18) + '...' : d.categoria,
    categoriaCompleta: d.categoria,
    '2024': d.kilos_2024,
    '2025': d.kilos_2025
  }));

  // Datos para participación canal y vísceras (barras agrupadas por año)
  const datosCanal = participacionCanal.map(p => ({
    año: p.anio.toString(),
    'Canal': p.pct_canal,
    'Víscera': p.pct_viscera,
    'Merma': p.merma_planta
  }));

  // Regresión lineal para tendencia
  const calcTendencia = (datos, key) => {
    const n = datos.length;
    if (n < 3) return datos.map(d => ({ ...d }));
    const sumX = datos.reduce((s, _, i) => s + i, 0);
    const sumY = datos.reduce((s, d) => s + (parseFloat(d[key]) || 0), 0);
    const sumXY = datos.reduce((s, d, i) => s + i * (parseFloat(d[key]) || 0), 0);
    const sumX2 = datos.reduce((s, _, i) => s + i * i, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return datos.map((d, i) => ({ ...d, tendencia: parseFloat((intercept + slope * i).toFixed(2)) }));
  };

  const avesConTend = calcTendencia(datosAvesMensuales, '2025');
  const pesosConTend = calcTendencia(datosPesosMensuales, '2025');
  const canalConTend = calcTendencia(datosCanal, 'Canal');

  return (
    <div className="space-y-8">
      {/* Descripción */}
      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-6 border border-blue-300">
        <p className="text-gray-700">Análisis operativo de la planta de beneficio con 17.744.156 aves procesadas (-0,77% vs 2024). Peso promedio de 1.987g por ave, merma reducida a 5,38% (vs 6,55% en 2024) y participación canal+víscera de 94,68%. Los meses de menor procesamiento fueron enero (1.138.593) y febrero (987.813).</p>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Aves Beneficiadas 2025"
          value={formatNumber(totales.totalAves2025)}
          unit="Aves procesadas"
          value2024={formatNumber(totales.totalAves2024 || totalAves2024)}
          varPct={-0.77}
          varAbs={`-${formatNumber(totalAves2024 - totalAves2025)} aves`}
          icon={<Factory className="w-5 h-5 text-blue-400" />}
          borderColor="border-blue-400"
          delay={0}
          onClick={() => openModal('Total Aves Procesadas 2025', 
            <div className="space-y-4">
              <p>En 2025 se procesaron <strong className="text-blue-600">{formatNumber(totalAves2025)} aves</strong>, una reducción del <strong className="text-orange-600">-0,77%</strong> respecto a 2024.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="text-sm text-blue-600 font-semibold mb-1">Total 2025</div>
                  <div className="text-2xl font-bold text-blue-700">{formatNumber(totalAves2025)}</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <div className="text-sm text-green-600 font-semibold mb-1">Total 2024</div>
                  <div className="text-2xl font-bold text-green-700">{formatNumber(totalAves2024)}</div>
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-300">
                <p className="text-sm font-semibold text-orange-800 mb-2">Meses de Menor Procesamiento:</p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li><strong>Enero:</strong> 1.138.593 aves (mes más bajo del año)</li>
                  <li><strong>Febrero:</strong> 987.813 aves (segundo más bajo)</li>
                </ul>
                <p className="text-xs text-gray-600 mt-2">Estos dos meses representan el período de menor actividad operativa del año.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300">
                <p className="text-sm font-semibold text-purple-800 mb-2">Meses de Mayor Procesamiento:</p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li><strong>Octubre:</strong> 1.844.070 aves (mes más alto)</li>
                  <li><strong>Mayo:</strong> 1.743.130 aves</li>
                  <li><strong>Noviembre:</strong> 1.663.280 aves</li>
                </ul>
              </div>
            </div>
          )}
        />
        <KpiCard
          title="Peso Promedio Canal 2025 vs 2024"
          value={`${totales.promedioPeso2025}g`}
          unit="Por ave"
          value2024={`${totales.promedioPeso2024}g`}
          varPct={totales.promedioPeso2024 > 0 ? (((totales.promedioPeso2025 - totales.promedioPeso2024) / totales.promedioPeso2024) * 100) : 0}
          varAbs={`${totales.promedioPeso2025 - totales.promedioPeso2024}g`}
          icon={<Activity className="w-5 h-5 text-green-400" />}
          borderColor="border-green-400"
          delay={0.1}
          onClick={() => openModal('Promedio de Peso por Ave', 
            <div className="space-y-4">
              <p>El peso promedio por ave en 2025 fue de <strong className="text-green-600">{totales.promedioPeso2025}g</strong>, un incremento de <strong>{totales.promedioPeso2025 - totales.promedioPeso2024}g</strong> respecto a 2024.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <div className="text-sm text-green-600 font-semibold mb-1">Promedio 2025</div>
                  <div className="text-2xl font-bold text-green-700">{totales.promedioPeso2025}g</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="text-sm text-blue-600 font-semibold mb-1">Promedio 2024</div>
                  <div className="text-2xl font-bold text-blue-700">{totales.promedioPeso2024}g</div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Contexto:</p>
                <p className="text-sm text-gray-700">El peso promedio se mantuvo más estable en 2025 comparado con 2024, lo que indica mejor control en el proceso de crianza y alimentación.</p>
              </div>
            </div>
          )}
        />
        <KpiCard
          title="Merma Planta Beneficio 2025 vs 2024"
          value="5,38%"
          unit="Reducción de merma"
          value2024="6,55%"
          varPct={-17.86}
          varAbs="-1,17 puntos porcentuales"
          icon={<TrendingDown className="w-5 h-5 text-green-400" />}
          borderColor="border-green-400"
          invertColors={true}
          delay={0.2}
          onClick={() => openModal('Merma de Planta Beneficio', 
            <div className="space-y-4">
              <p>La merma de planta se redujo significativamente de <strong className="text-orange-600">6,55%</strong> en 2024 a <strong className="text-green-600">5,38%</strong> en 2025.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <div className="text-sm text-green-600 font-semibold mb-1">Merma 2025</div>
                  <div className="text-2xl font-bold text-green-700">5,38%</div>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                  <div className="text-sm text-orange-600 font-semibold mb-1">Merma 2024</div>
                  <div className="text-2xl font-bold text-orange-700">6,55%</div>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                <p className="text-sm font-semibold text-green-800 mb-2">Reducción Lograda:</p>
                <p className="text-sm text-gray-700">La reducción de <strong>-1,17 puntos porcentuales</strong> representa una mejora del <strong>-17.86%</strong> en la merma, lo que indica mejor eficiencia operativa en la planta de beneficio.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Impacto:</p>
                <p className="text-sm text-gray-700">La reducción de merma contribuye directamente a mejorar el rendimiento canal + víscera, que alcanzó 94,68% en 2025 vs 93,45% en 2024.</p>
              </div>
            </div>
          )}
        />
        <KpiCard
          title="Rendimiento Canal + Víscera 2025"
          value="94,68%"
          unit="Participación 2025"
          value2024="93,45%"
          varPct={1.32}
          varAbs="+1,23 puntos porcentuales"
          icon={<Award className="w-5 h-5 text-purple-400" />}
          borderColor="border-purple-400"
          delay={0.3}
          onClick={() => openModal('Participación Canal + Víscera', 
            <div className="space-y-4">
              <p>El rendimiento canal + víscera alcanzó <strong className="text-purple-600">94,68%</strong> en 2025, un incremento de <strong className="text-green-600">+1,23 puntos porcentuales</strong> respecto a 2024.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <div className="text-sm text-purple-600 font-semibold mb-1">Canal + Víscera 2025</div>
                  <div className="text-2xl font-bold text-purple-700">94,68%</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="text-sm text-blue-600 font-semibold mb-1">Canal + Víscera 2024</div>
                  <div className="text-2xl font-bold text-blue-700">93,45%</div>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                <p className="text-sm font-semibold text-green-800 mb-2">Mejora Operativa:</p>
                <p className="text-sm text-gray-700">El incremento del +1,32% en participación canal + víscera está directamente relacionado con la reducción de merma de planta (de 6,55% a 5,38%), lo que indica mejor aprovechamiento del producto.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Contexto:</p>
                <p className="text-sm text-gray-700">Este indicador mide el rendimiento total aprovechable de cada ave procesada. Un valor de 94,68% significa que solo el 5,38% se pierde como merma en el proceso de beneficio.</p>
              </div>
            </div>
          )}
        />
      </div>
      {/* Gráfico 1: Aves Procesadas Mensual */}
      <CollapsibleChart title="Aves Procesadas Mensual 2024 vs 2025" subtitle="Azul: 2025 • Verde: 2024" defaultOpen={false}>
        <ResponsiveContainer width="100%" height={450}>
          <ComposedChart data={avesConTend} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="mes" stroke="#9ca3af" style={{ fontSize: '12px' }} angle={0} textAnchor="middle" height={60} interval={0} />
            <YAxis stroke="#9ca3af" tickFormatter={(v) => `${(v/1000).toFixed(0)}mil`} style={{ fontSize: '13px' }} width={70} />
            <Tooltip content={<TooltipAves />} />
            <Line type="monotone" dataKey="2025" stroke="#3b82f6" strokeWidth={3} name="2025" />
            <Line type="monotone" dataKey="2024" stroke="#10b981" strokeWidth={2} name="2024" />
            <Line type="linear" dataKey="tendencia" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Tendencia 2025" />
          </ComposedChart>
        </ResponsiveContainer>
      </CollapsibleChart>

      {/* Gráfico 2: Promedio de Pesos */}
      <CollapsibleChart title="Promedio de Peso por Ave Mensual 2024 vs 2025 (g)" subtitle="Peso en gramos • Más estable en 2025" defaultOpen={false}>
        <ResponsiveContainer width="100%" height={450}>
          <ComposedChart data={pesosConTend} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="mes" stroke="#9ca3af" style={{ fontSize: '12px' }} angle={0} textAnchor="middle" height={60} interval={0} />
            <YAxis stroke="#9ca3af" tickFormatter={(v) => `${v}g`} style={{ fontSize: '13px' }} domain={[1850, 2050]} width={65} />
            <Tooltip content={<TooltipPesos />} />
            <Line type="monotone" dataKey="2025" stroke="#3b82f6" strokeWidth={3} name="2025" />
            <Line type="monotone" dataKey="2024" stroke="#10b981" strokeWidth={2} name="2024" />
            <Line type="linear" dataKey="tendencia" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Tendencia 2025" />
          </ComposedChart>
        </ResponsiveContainer>
      </CollapsibleChart>

      {/* Gráfico 3: Participación por Rangos */}
      <CollapsibleChart title="Participación por Rangos de Peso 2024 vs 2025 (%)" subtitle="Distribución de aves por categoría de peso" defaultOpen={false}>
        <ResponsiveContainer width="100%" height={450}>
          <LineChart data={datosRangos} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="rango" stroke="#9ca3af" style={{ fontSize: '12px' }} angle={0} textAnchor="middle" height={60} interval={0} />
            <YAxis stroke="#9ca3af" tickFormatter={(v) => `${v}%`} style={{ fontSize: '13px' }} />
            <Tooltip content={<CustomPctTooltip borderColor="#eab308" />} />
            <Legend />
            <Line type="monotone" dataKey="2024" stroke="#10b981" strokeWidth={3} name="2024" />
            <Line type="monotone" dataKey="2025" stroke="#3b82f6" strokeWidth={3} name="2025" />
          </LineChart>
        </ResponsiveContainer>
      </CollapsibleChart>

      {/* Gráfico 4: Descartes en Kilos */}
      <CollapsibleChart title="Descartes en Kilos - Análisis 2024 vs 2025" subtitle="Azul: 2024 • Naranja: 2025" defaultOpen={false}>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={datosDescartes} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="categoria" stroke="#9ca3af" style={{ fontSize: '11px' }} angle={0} textAnchor="middle" height={60} interval={0} />
            <YAxis stroke="#9ca3af" tickFormatter={(v) => formatNumber(v)} style={{ fontSize: '13px' }} width={90} />
            <Tooltip content={<TooltipKg />} />
            <Legend />
            <Bar dataKey="2024" fill="#3b82f6" name="2024" radius={[8, 8, 0, 0]}>
              <LabelList dataKey="2024" position="top" style={{ fontSize: '10px', fontWeight: 'bold', fill: '#3b82f6' }} formatter={() => '2024'} />
            </Bar>
            <Bar dataKey="2025" fill="#f97316" name="2025" radius={[8, 8, 0, 0]}>
              <LabelList dataKey="2025" position="top" style={{ fontSize: '10px', fontWeight: 'bold', fill: '#f97316' }} formatter={() => '2025'} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CollapsibleChart>

      {/* Gráfico 5: Participación Canal y Vísceras - Histórico */}
      <CollapsibleChart title="Participación Canal y Vísceras - Histórico Rendimientos 2021-2025 (%)" subtitle="Evolución de rendimientos operativos" defaultOpen={false}>
        <ResponsiveContainer width="100%" height={450}>
          <ComposedChart data={canalConTend} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="año" stroke="#9ca3af" style={{ fontSize: '13px' }} />
            <YAxis stroke="#9ca3af" tickFormatter={(v) => `${v}%`} style={{ fontSize: '13px' }} />
            <Tooltip content={<CustomPctTooltip borderColor="#a855f7" />} />
            <Legend />
            <Bar dataKey="Canal" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Víscera" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Merma" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Line type="linear" dataKey="tendencia" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Tendencia Canal" />
          </ComposedChart>
        </ResponsiveContainer>
      </CollapsibleChart>

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
              className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-cyan-500 shadow-2xl"
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
              <div className="text-gray-700 leading-relaxed">{modalContent.content}</div>

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

