import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ComposedChart, LabelList } from 'recharts';
import { Factory, TrendingDown, Info, X, Activity, Award, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { CustomBarTooltip, CustomPctTooltip } from './CustomTooltip';
import CollapsibleChart from '../CollapsibleChart';

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal(
            'Total Aves Procesadas 2025',
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="text-sm text-blue-600 font-semibold mb-1">Total 2025</div>
                  <div className="text-2xl font-bold text-blue-700">{formatNumber(totalAves2025)}</div>
                  <div className="text-xs text-blue-500 mt-1">aves procesadas</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <div className="text-sm text-green-600 font-semibold mb-1">Total 2024</div>
                  <div className="text-2xl font-bold text-green-700">{formatNumber(totalAves2024)}</div>
                  <div className="text-xs text-green-500 mt-1">aves procesadas</div>
                </div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-200 flex items-center gap-3">
                <TrendingDown className="w-6 h-6 text-orange-500 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-orange-700">Variación anual: -0,77%</div>
                  <div className="text-sm text-orange-600">Diferencia de {formatNumber(totalAves2024 - totalAves2025)} aves menos en 2025</div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="font-semibold text-gray-700 mb-2">Meses destacados 2025</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Mayor volumen:</span><span className="font-semibold text-blue-600">Oct — {formatNumber(1844070)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Menor volumen:</span><span className="font-semibold text-red-500">Feb — {formatNumber(987813)}</span></div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-blue-600">Mes</th>
                    <th className="text-right py-2 px-3 text-blue-600">2025</th>
                    <th className="text-right py-2 px-3 text-green-600">2024</th>
                    <th className="text-right py-2 px-3 text-gray-500">Diferencia</th>
                  </tr></thead>
                  <tbody>
                    {avesProcessadasMensual.map((m, idx) => {
                      const diff = m.aves_2025 - m.aves_2024;
                      return (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-2 px-3 text-gray-700">{mesesCompletos[idx]}</td>
                          <td className="py-2 px-3 text-right font-semibold text-blue-600">{formatNumber(m.aves_2025)}</td>
                          <td className="py-2 px-3 text-right text-green-600">{formatNumber(m.aves_2024)}</td>
                          <td className={`py-2 px-3 text-right font-semibold ${diff >= 0 ? 'text-green-600' : 'text-red-500'}`}>{diff >= 0 ? '+' : ''}{formatNumber(diff)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Total Aves Beneficiadas 2025</span>
            <Factory className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{(totales.totalAves2025 / 1000000).toFixed(2)}M</div>
          <div className="text-xs text-gray-500 mt-0.5 mb-2">Aves procesadas</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{(totales.totalAves2024 / 1000000).toFixed(2)}M</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{(totales.totalAves2025 / 1000000).toFixed(2)}M</span></div>
            <div className="text-sm font-bold text-red-600">Var: -0,77%</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal(
            'Promedio de Peso',
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <div className="text-sm text-green-600 font-semibold mb-1">Promedio 2025</div>
                  <div className="text-2xl font-bold text-green-700">{totales.promedioPeso2025}g</div>
                  <div className="text-xs text-green-500 mt-1">por ave</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="text-sm text-blue-600 font-semibold mb-1">Promedio 2024</div>
                  <div className="text-2xl font-bold text-blue-700">{totales.promedioPeso2024}g</div>
                  <div className="text-xs text-blue-500 mt-1">por ave</div>
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-200 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-green-700">Mayor estabilidad en 2025</div>
                  <div className="text-sm text-green-600">El peso promedio en 2025 muestra menor variabilidad mensual, indicando mejor control en granjas.</div>
                </div>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Peso Promedio Canal 2025 vs Meta</span>
            <Activity className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{totales.promedioPeso2025}g</div>
          <div className="text-xs text-gray-500 mt-0.5 mb-2">Por ave</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{totales.promedioPeso2024}g</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{totales.promedioPeso2025}g</span></div>
            <div className="text-sm font-bold text-green-600">Var: +0,20%</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal(
            'Merma de Planta',
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <div className="text-sm text-green-600 font-semibold mb-1">Merma 2025</div>
                  <div className="text-2xl font-bold text-green-700">5,38%</div>
                  <div className="text-xs text-green-500 mt-1">reducción lograda</div>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                  <div className="text-sm text-orange-600 font-semibold mb-1">Merma 2024</div>
                  <div className="text-2xl font-bold text-orange-700">6,55%</div>
                  <div className="text-xs text-orange-500 mt-1">año anterior</div>
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-200 flex items-center gap-3">
                <TrendingDown className="w-6 h-6 text-green-500 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-green-700">Mejora de 1,17 puntos porcentuales</div>
                  <div className="text-sm text-green-600">La reducción de merma representa una mejora significativa en la eficiencia operativa de la planta.</div>
                </div>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Merma Planta Beneficio 2025 vs Meta</span>
            <TrendingDown className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">5,38%</div>
          <div className="text-xs text-gray-500 mt-0.5 mb-2">Merma planta</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">6,55%</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">5,38%</span></div>
            <div className="text-sm font-bold text-green-600">Var: -1,17pp</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal(
            'Participación Canal + Víscera',
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <div className="text-sm text-purple-600 font-semibold mb-1">Canal + Víscera 2025</div>
                  <div className="text-2xl font-bold text-purple-700">94,68%</div>
                  <div className="text-xs text-purple-500 mt-1">rendimiento total</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="text-sm text-blue-600 font-semibold mb-1">Canal + Víscera 2024</div>
                  <div className="text-2xl font-bold text-blue-700">93,45%</div>
                  <div className="text-xs text-blue-500 mt-1">año anterior</div>
                </div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-purple-500 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-purple-700">Incremento de +1,23 puntos porcentuales</div>
                  <div className="text-sm text-purple-600">La participación de canal y víscera muestra incrementos favorables respecto a años anteriores, reflejando mejor aprovechamiento del ave.</div>
                </div>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Rendimiento Canal + Víscera 2025</span>
            <Award className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">94,68%</div>
          <div className="text-xs text-gray-500 mt-0.5 mb-2">Canal + Víscera</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">93,45%</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">94,68%</span></div>
            <div className="text-sm font-bold text-green-600">Var: +1,23pp</div>
          </div>
        </motion.div>
      </div>

      {/* Gráfico 1: Aves Procesadas Mensual */}
      <CollapsibleChart title="Aves Procesadas Mensual 2024 vs 2025" defaultOpen={false}>
        <p className="text-sm text-gray-600 mb-4">Azul: 2025 • Verde: 2024</p>
        <ResponsiveContainer width="100%" height={450}>
          <ComposedChart data={avesConTend} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="mes" 
              stroke="#9ca3af" 
              style={{ fontSize: '12px' }} 
              angle={0}
              textAnchor="middle"
              height={60}
              interval={0}
            />
            <YAxis stroke="#9ca3af" tickFormatter={(v) => `${(v/1000).toFixed(0)}mil`} style={{ fontSize: '13px' }} width={70} />
            <Tooltip content={<TooltipAves />} />
            <Line type="monotone" dataKey="2025" stroke="#3b82f6" strokeWidth={3} name="2025" />
            <Line type="monotone" dataKey="2024" stroke="#10b981" strokeWidth={2} name="2024" />
            <Line type="linear" dataKey="tendencia" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Tendencia 2025" />
          </ComposedChart>
        </ResponsiveContainer>
      </CollapsibleChart>

      {/* Gráfico 2: Promedio de Pesos */}
      <CollapsibleChart title="Promedio de Peso por Ave Mensual 2024 vs 2025 (g)" defaultOpen={false}>
        <p className="text-sm text-gray-600 mb-4">Peso en gramos • Más estable en 2025</p>
        <ResponsiveContainer width="100%" height={450}>
          <ComposedChart data={pesosConTend} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="mes" 
              stroke="#9ca3af" 
              style={{ fontSize: '12px' }} 
              angle={0}
              textAnchor="middle"
              height={60}
              interval={0}
            />
            <YAxis stroke="#9ca3af" tickFormatter={(v) => `${v}g`} style={{ fontSize: '13px' }} domain={[1850, 2050]} width={65} />
            <Tooltip content={<TooltipPesos />} />
            <Line type="monotone" dataKey="2025" stroke="#3b82f6" strokeWidth={3} name="2025" />
            <Line type="monotone" dataKey="2024" stroke="#10b981" strokeWidth={2} name="2024" />
            <Line type="linear" dataKey="tendencia" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Tendencia 2025" />
          </ComposedChart>
        </ResponsiveContainer>
      </CollapsibleChart>

      {/* Gráfico 3: Participación por Rangos */}
      <CollapsibleChart title="Participación por Rangos de Peso 2024 vs 2025 (%)" defaultOpen={false}>
        <p className="text-sm text-gray-600 mb-4">Distribución de aves por categoría de peso</p>
        <ResponsiveContainer width="100%" height={450}>
          <LineChart data={datosRangos} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="rango" 
              stroke="#9ca3af" 
              style={{ fontSize: '12px' }} 
              angle={0}
              textAnchor="middle"
              height={60}
              interval={0}
            />
            <YAxis stroke="#9ca3af" tickFormatter={(v) => `${v}%`} style={{ fontSize: '13px' }} />
            <Tooltip content={<CustomPctTooltip borderColor="#eab308" />} />
            <Legend />
            <Line type="monotone" dataKey="2024" stroke="#10b981" strokeWidth={3} name="2024" />
            <Line type="monotone" dataKey="2025" stroke="#3b82f6" strokeWidth={3} name="2025" />
          </LineChart>
        </ResponsiveContainer>
      </CollapsibleChart>

      {/* Gráfico 4: Descartes en Kilos */}
      <CollapsibleChart title="Descartes en Kilos - Análisis 2024 vs 2025" defaultOpen={false}>
        <p className="text-sm text-gray-600 mb-4">Azul: 2024 • Naranja: 2025</p>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={datosDescartes} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="categoria" 
              stroke="#9ca3af" 
              style={{ fontSize: '11px' }} 
              angle={0}
              textAnchor="middle"
              height={60}
              interval={0}
            />
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
      <CollapsibleChart title="Participación Canal y Vísceras - Histórico Rendimientos 2021-2025 (%)" defaultOpen={false}>
        <p className="text-sm text-gray-600 mb-4">Evolución de rendimientos operativos</p>
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

