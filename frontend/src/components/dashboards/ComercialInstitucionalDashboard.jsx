import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, X, Info, Building2, Scale } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';
import CollapsibleChart from '../CollapsibleChart';

// Datos oficiales hardcodeados (fuente: reporte Gestión Comercial Sede 3 Canal Institucional o Moderno)
const REFRIGERADO = [
  { linea: '100 - POLLO ENTERO',    k25: 3456220, pct25: 33.24, k24: 2104976, pct24: 20.45, var: 1351243,  varPct: 64.19,    p25: 10199, p24: 10327, varP: -1.24   },
  { linea: '102 - POLLO CAMPESINO', k25: 0,       pct25: 0.00,  k24: 346,     pct24: 0.00,  var: -346,     varPct: -100.00,  p25: 0,     p24: 13164, varP: -100.00 },
  { linea: '105 - PRESA',           k25: 4935246, pct25: 47.47, k24: 4718855, pct24: 45.84, var: 216391,   varPct: 4.59,     p25: 10448, p24: 11242, varP: -7.06   },
  { linea: '110 - MENUDENCIA',      k25: 1109430, pct25: 10.67, k24: 976141,  pct24: 9.48,  var: 133289,   varPct: 13.65,    p25: 1629,  p24: 2019,  varP: -19.32  },
  { linea: '120 - CARNES FRÍAS',    k25: 735,     pct25: 0.01,  k24: 1687,    pct24: 0.02,  var: -952,     varPct: -56.43,   p25: 40250, p24: 18038, varP: 123.14  },
  { linea: '122 - COMBOS',          k25: 1056,    pct25: 0.01,  k24: 0,       pct24: 0.00,  var: 1056,     varPct: 0.00,     p25: 24042, p24: 0,     varP: 0.00    },
];
const REFRIG_TOT = { k25: 9502687, pct25: 91.40, k24: 7802006, pct24: 75.79, var: 1700681, varPct: 21.80, p25: 9332, p24: 9843, varP: -5.19 };

const CONGELADO = [
  { linea: '100 - POLLO ENTERO',    k25: 620394, pct25: 5.97, k24: 1083815, pct24: 10.53, var: -463420,  varPct: -42.76, p25: 11484, p24: 10429, varP: 10.11  },
  { linea: '102 - POLLO CAMPESINO', k25: 42,     pct25: 0.00, k24: 9571,    pct24: 0.09,  var: -9529,    varPct: -99.57, p25: 15895, p24: 14312, varP: 11.06  },
  { linea: '105 - PRESA',           k25: 265997, pct25: 2.56, k24: 1165862, pct24: 11.32, var: -899864,  varPct: -77.18, p25: 11933, p24: 10347, varP: 15.33  },
  { linea: '110 - MENUDENCIA',      k25: 2,      pct25: 0.00, k24: 0,       pct24: 0.00,  var: 2,        varPct: 0.00,   p25: 3200,  p24: 0,     varP: 0.00   },
  { linea: '120 - CARNES FRÍAS',    k25: 8097,   pct25: 0.08, k24: 233497,  pct24: 2.27,  var: -225400,  varPct: -96.53, p25: 4068,  p24: 5071,  varP: -19.78 },
];
const CONGEL_TOT = { k25: 894532, pct25: 8.60, k24: 2492744, pct24: 24.21, var: -1598212, varPct: -64.11, p25: 11550, p24: 9904, varP: 16.63 };

const TOTAL = { k25: 10397219, pct25: 100, k24: 10294749, pct24: 100, var: 102469, varPct: 1.00, p25: 9523, p24: 9858, varP: -3.40 };

const fmt = (n) => new Intl.NumberFormat('es-CO').format(Math.round(n));
const fmtPct = (n) => Number(n).toFixed(2);

const VarBadge = ({ val }) => {
  const up = val >= 0;
  return (
    <span className={`inline-flex items-center gap-1 ${up ? 'text-green-600' : 'text-red-600'}`}>
      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs text-white ${up ? 'bg-green-500' : 'bg-red-500'}`}>
        {up ? '↑' : '↓'}
      </span>
      {val > 0 ? '+' : ''}{fmtPct(val)}%
    </span>
  );
};

const PriceBadge = ({ val }) => {
  const up = val >= 0;
  return (
    <span className={`inline-flex items-center gap-1 ${up ? 'text-green-600' : 'text-red-600'}`}>
      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs text-white ${up ? 'bg-green-500' : 'bg-red-500'}`}>●</span>
      {val > 0 ? '+' : ''}{fmtPct(val)}%
    </span>
  );
};

export default function ComercialInstitucionalDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });

  const openModal = (title, content) => { setModalContent({ title, content }); setModalOpen(true); };

  const datosGrafica = [
    { name: 'Refrigerado', '2025': REFRIG_TOT.k25, '2024': REFRIG_TOT.k24 },
    { name: 'Congelado',   '2025': CONGEL_TOT.k25, '2024': CONGEL_TOT.k24 },
  ];
  const datosParticipacion = [
    { name: 'Refrigerado', value: REFRIG_TOT.pct25, kilos: REFRIG_TOT.k25 },
    { name: 'Congelado',   value: CONGEL_TOT.pct25, kilos: CONGEL_TOT.k25 },
  ];
  const COLORS = ['#3b82f6', '#10b981'];

  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500/20 to-purple-600/10 backdrop-blur-xl rounded-xl p-6 border-2 border-blue-500/30">
        <div className="flex items-center gap-3 mb-3">
          <Building2 className="w-8 h-8 text-blue-500" />
          <h2 className="text-3xl font-bold text-gray-900">GESTIÓN COMERCIAL SEDE 3 CANAL INSTITUCIONAL O MODERNO</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          Ventas canal institucional/moderno 2025: {fmt(TOTAL.k25)} kg vs {fmt(TOTAL.k24)} kg en 2024.
          Variación: +{TOTAL.varPct}%. Refrigerado representa el {REFRIG_TOT.pct25}% del volumen total.
          Precio promedio $/kg 2025: ${fmt(TOTAL.p25)} vs ${fmt(TOTAL.p24)} en 2024 ({TOTAL.varP}%).
        </p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1 - Total Kilos */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal('Total Kilos Vendidos',
            <div className="text-gray-700 space-y-3">
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                <p className="text-sm font-semibold mb-2">Volumen total canal institucional:</p>
                <p className="text-sm">• 2025: <strong className="text-blue-600">{fmt(TOTAL.k25)} kg</strong></p>
                <p className="text-sm">• 2024: <strong>{fmt(TOTAL.k24)} kg</strong></p>
                <p className="text-sm">• Variación: <strong className="text-green-600">+{fmt(TOTAL.var)} kg (+{TOTAL.varPct}%)</strong></p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                <p className="text-sm">Refrigerado: {fmt(REFRIG_TOT.k25)} kg ({REFRIG_TOT.pct25}%)</p>
                <p className="text-sm">Congelado: {fmt(CONGEL_TOT.k25)} kg ({CONGEL_TOT.pct25}%)</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Total Kilos 2025 vs 2024</span>
            <Scale className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{fmt(TOTAL.k25)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{fmt(TOTAL.k24)} kg</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{fmt(TOTAL.k25)} kg</span></div>
            <div className="text-sm font-bold text-green-600">Var: +{fmtPct(TOTAL.varPct)}%</div>
          </div>
        </motion.div>

        {/* KPI 2 - Refrigerado */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onClick={() => openModal('Refrigerado — Detalle',
            <div className="text-gray-700 space-y-3">
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                <p className="text-sm font-semibold mb-2">Refrigerado 2025 vs 2024:</p>
                <p className="text-sm">• 2025: <strong className="text-blue-600">{fmt(REFRIG_TOT.k25)} kg ({fmtPct(REFRIG_TOT.pct25)}%)</strong></p>
                <p className="text-sm">• 2024: <strong>{fmt(REFRIG_TOT.k24)} kg ({fmtPct(REFRIG_TOT.pct24)}%)</strong></p>
                <p className="text-sm">• Variación: <strong className="text-green-600">+{fmt(REFRIG_TOT.var)} kg (+{fmtPct(REFRIG_TOT.varPct)}%)</strong></p>
                <p className="text-sm">• $/kg 2025: <strong>${fmt(REFRIG_TOT.p25)}</strong> | 2024: <strong>${fmt(REFRIG_TOT.p24)}</strong> | Var: <strong className="text-red-600">{fmtPct(REFRIG_TOT.varP)}%</strong></p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Refrigerado 2025 vs 2024</span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{fmt(REFRIG_TOT.k25)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{fmt(REFRIG_TOT.k24)} kg</span></div>
            <div className="text-xs text-gray-500">Part. 2025: <span className="font-semibold text-gray-700">{fmtPct(REFRIG_TOT.pct25)}%</span></div>
            <div className="text-sm font-bold text-green-600">Var: +{fmtPct(REFRIG_TOT.varPct)}%</div>
          </div>
        </motion.div>

        {/* KPI 3 - Congelado */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          onClick={() => openModal('Congelado — Detalle',
            <div className="text-gray-700 space-y-3">
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                <p className="text-sm font-semibold mb-2">Congelado 2025 vs 2024:</p>
                <p className="text-sm">• 2025: <strong className="text-green-600">{fmt(CONGEL_TOT.k25)} kg ({fmtPct(CONGEL_TOT.pct25)}%)</strong></p>
                <p className="text-sm">• 2024: <strong>{fmt(CONGEL_TOT.k24)} kg ({fmtPct(CONGEL_TOT.pct24)}%)</strong></p>
                <p className="text-sm">• Variación: <strong className="text-red-600">{fmt(CONGEL_TOT.var)} kg ({fmtPct(CONGEL_TOT.varPct)}%)</strong></p>
                <p className="text-sm">• $/kg 2025: <strong>${fmt(CONGEL_TOT.p25)}</strong> | 2024: <strong>${fmt(CONGEL_TOT.p24)}</strong> | Var: <strong className="text-green-600">+{fmtPct(CONGEL_TOT.varP)}%</strong></p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Congelado 2025 vs 2024</span>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{fmt(CONGEL_TOT.k25)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{fmt(CONGEL_TOT.k24)} kg</span></div>
            <div className="text-xs text-gray-500">Part. 2025: <span className="font-semibold text-gray-700">{fmtPct(CONGEL_TOT.pct25)}%</span></div>
            <div className="text-sm font-bold text-red-600">Var: {fmtPct(CONGEL_TOT.varPct)}%</div>
          </div>
        </motion.div>

        {/* KPI 4 - Precio promedio */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          onClick={() => openModal('Precio Promedio $/kg',
            <div className="text-gray-700 space-y-3">
              <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300">
                <p className="text-sm font-semibold mb-2">Precio promedio ponderado total:</p>
                <p className="text-sm">• 2025: <strong className="text-purple-600">${fmt(TOTAL.p25)}/kg</strong></p>
                <p className="text-sm">• 2024: <strong>${fmt(TOTAL.p24)}/kg</strong></p>
                <p className="text-sm">• Variación: <strong className="text-red-600">{fmtPct(TOTAL.varP)}%</strong></p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                <p className="text-sm">Refrigerado: ${fmt(REFRIG_TOT.p25)}/kg (2024: ${fmt(REFRIG_TOT.p24)}) — Var: {fmtPct(REFRIG_TOT.varP)}%</p>
                <p className="text-sm">Congelado: ${fmt(CONGEL_TOT.p25)}/kg (2024: ${fmt(CONGEL_TOT.p24)}) — Var: +{fmtPct(CONGEL_TOT.varP)}%</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Precio Promedio $/kg 2025 vs 2024</span>
            <DollarSign className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">${fmt(TOTAL.p25)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">${fmt(TOTAL.p24)}/kg</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">${fmt(TOTAL.p25)}/kg</span></div>
            <div className="text-sm font-bold text-red-600">Var: {fmtPct(TOTAL.varP)}%</div>
          </div>
        </motion.div>
      </div>

      {/* Tabla unificada colapsable */}
      <CollapsibleTable
        title="GESTIÓN COMERCIAL SEDE 3 CANAL INSTITUCIONAL O MODERNO — Detalle por Temperatura"
        defaultOpen={false}
        totalRow={[
          { label: 'TOTAL GENERAL' },
          { label: `${fmt(TOTAL.k25)} kg`, color: 'text-gray-900' },
          { label: `2024: ${fmt(TOTAL.k24)} kg`, color: 'text-gray-600' },
          { label: `Var: +${TOTAL.varPct}%`, color: 'text-green-600', badge: true, badgeColor: 'bg-green-500', badgeIcon: '↑' },
        ]}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-blue-700 to-blue-900">
                <th className="text-left py-3 px-4 text-white font-bold">TEMPERATURA</th>
                <th className="text-right py-3 px-4 text-white font-bold">Kls. 2025</th>
                <th className="text-right py-3 px-4 text-white font-bold">% Part</th>
                <th className="text-right py-3 px-4 text-white font-bold">Kls. 2024</th>
                <th className="text-right py-3 px-4 text-white font-bold">% Part.</th>
                <th className="text-right py-3 px-4 text-white font-bold">Variac.</th>
                <th className="text-right py-3 px-4 text-white font-bold">% Var</th>
                <th className="text-right py-3 px-4 text-white font-bold">$/p 2025</th>
                <th className="text-right py-3 px-4 text-white font-bold">$/p 2024</th>
                <th className="text-right py-3 px-4 text-white font-bold">Var $/p</th>
              </tr>
            </thead>
            <tbody>
              {/* REFRIGERADO header */}
              <tr className="bg-blue-100 font-bold border-b border-blue-300">
                <td className="py-2 px-4 text-blue-900">100 - REFRIGERADO</td>
                <td className="py-2 px-4 text-right text-blue-900 tabular-nums">{fmt(REFRIG_TOT.k25)}</td>
                <td className="py-2 px-4 text-right text-blue-900 tabular-nums">{REFRIG_TOT.pct25}%</td>
                <td className="py-2 px-4 text-right text-blue-900 tabular-nums">{fmt(REFRIG_TOT.k24)}</td>
                <td className="py-2 px-4 text-right text-blue-900 tabular-nums">{REFRIG_TOT.pct24}%</td>
                <td className="py-2 px-4 text-right tabular-nums font-bold text-green-700">{fmt(REFRIG_TOT.var)}</td>
                <td className="py-2 px-4 text-right tabular-nums"><VarBadge val={REFRIG_TOT.varPct} /></td>
                <td className="py-2 px-4 text-right text-blue-900 tabular-nums">{fmt(REFRIG_TOT.p25)}</td>
                <td className="py-2 px-4 text-right text-blue-900 tabular-nums">{fmt(REFRIG_TOT.p24)}</td>
                <td className="py-2 px-4 text-right tabular-nums"><PriceBadge val={REFRIG_TOT.varP} /></td>
              </tr>
              {REFRIGERADO.map((d, i) => (
                <tr key={i} className="border-b border-gray-200 hover:bg-blue-50/40">
                  <td className="py-2 px-4 pl-8 text-gray-700">{d.linea}</td>
                  <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{fmt(d.k25)}</td>
                  <td className="py-2 px-4 text-right text-gray-600 tabular-nums">{d.pct25}%</td>
                  <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{fmt(d.k24)}</td>
                  <td className="py-2 px-4 text-right text-gray-600 tabular-nums">{d.pct24}%</td>
                  <td className={`py-2 px-4 text-right tabular-nums ${d.var >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(d.var)}</td>
                  <td className="py-2 px-4 text-right tabular-nums"><VarBadge val={d.varPct} /></td>
                  <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{d.p25 > 0 ? fmt(d.p25) : 'N/D'}</td>
                  <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{d.p24 > 0 ? fmt(d.p24) : 'N/D'}</td>
                  <td className="py-2 px-4 text-right tabular-nums"><PriceBadge val={d.varP} /></td>
                </tr>
              ))}

              {/* CONGELADO header */}
              <tr className="bg-green-100 font-bold border-b border-green-300">
                <td className="py-2 px-4 text-green-900">105 - CONGELADO</td>
                <td className="py-2 px-4 text-right text-green-900 tabular-nums">{fmt(CONGEL_TOT.k25)}</td>
                <td className="py-2 px-4 text-right text-green-900 tabular-nums">{CONGEL_TOT.pct25}%</td>
                <td className="py-2 px-4 text-right text-green-900 tabular-nums">{fmt(CONGEL_TOT.k24)}</td>
                <td className="py-2 px-4 text-right text-green-900 tabular-nums">{CONGEL_TOT.pct24}%</td>
                <td className="py-2 px-4 text-right tabular-nums font-bold text-red-700">{fmt(CONGEL_TOT.var)}</td>
                <td className="py-2 px-4 text-right tabular-nums"><VarBadge val={CONGEL_TOT.varPct} /></td>
                <td className="py-2 px-4 text-right text-green-900 tabular-nums">{fmt(CONGEL_TOT.p25)}</td>
                <td className="py-2 px-4 text-right text-green-900 tabular-nums">{fmt(CONGEL_TOT.p24)}</td>
                <td className="py-2 px-4 text-right tabular-nums"><PriceBadge val={CONGEL_TOT.varP} /></td>
              </tr>
              {CONGELADO.map((d, i) => (
                <tr key={i} className="border-b border-gray-200 hover:bg-green-50/40">
                  <td className="py-2 px-4 pl-8 text-gray-700">{d.linea}</td>
                  <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{fmt(d.k25)}</td>
                  <td className="py-2 px-4 text-right text-gray-600 tabular-nums">{d.pct25}%</td>
                  <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{fmt(d.k24)}</td>
                  <td className="py-2 px-4 text-right text-gray-600 tabular-nums">{d.pct24}%</td>
                  <td className={`py-2 px-4 text-right tabular-nums ${d.var >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(d.var)}</td>
                  <td className="py-2 px-4 text-right tabular-nums"><VarBadge val={d.varPct} /></td>
                  <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{d.p25 > 0 ? fmt(d.p25) : 'N/D'}</td>
                  <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{d.p24 > 0 ? fmt(d.p24) : 'N/D'}</td>
                  <td className="py-2 px-4 text-right tabular-nums"><PriceBadge val={d.varP} /></td>
                </tr>
              ))}

              {/* TOTAL GENERAL */}
              <tr className="bg-gray-200 border-t-2 border-gray-500 font-bold text-gray-900">
                <td className="py-3 px-4">Total general</td>
                <td className="py-3 px-4 text-right tabular-nums">{fmt(TOTAL.k25)}</td>
                <td className="py-3 px-4 text-right tabular-nums">100,00%</td>
                <td className="py-3 px-4 text-right tabular-nums">{fmt(TOTAL.k24)}</td>
                <td className="py-3 px-4 text-right tabular-nums">100,00%</td>
                <td className="py-3 px-4 text-right tabular-nums text-green-700">{fmt(TOTAL.var)}</td>
                <td className="py-3 px-4 text-right tabular-nums"><VarBadge val={TOTAL.varPct} /></td>
                <td className="py-3 px-4 text-right tabular-nums">{fmt(TOTAL.p25)}</td>
                <td className="py-3 px-4 text-right tabular-nums">{fmt(TOTAL.p24)}</td>
                <td className="py-3 px-4 text-right tabular-nums"><PriceBadge val={TOTAL.varP} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </CollapsibleTable>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CollapsibleChart title="Kilos 2024 vs 2025 por Temperatura" defaultOpen={false}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosGrafica}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} width={60} />
              <Tooltip formatter={(v, name) => [`${fmt(v)} kg`, name]} />
              <Bar dataKey="2024" fill="#3b82f6" name="2024" radius={[6,6,0,0]} />
              <Bar dataKey="2025" fill="#10b981" name="2025" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </CollapsibleChart>

        <CollapsibleChart title="Participación por Temperatura 2025" defaultOpen={false}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={datosParticipacion} cx="50%" cy="50%"
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100} dataKey="value">
                {datosParticipacion.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v, name, props) => [`${fmt(props.payload.kilos)} kg (${v}%)`, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            {datosParticipacion.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-sm text-gray-700">{d.name}</span>
              </div>
            ))}
          </div>
        </CollapsibleChart>
      </div>

      {/* Modal */}
      {createPortal(
        <AnimatePresence>
          {modalOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
              onClick={() => setModalOpen(false)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-lg w-full border-4 border-blue-500 shadow-2xl max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Info className="w-6 h-6 text-blue-500" />
                    <h3 className="text-xl font-bold text-gray-900">{modalContent.title}</h3>
                  </div>
                  <button onClick={() => setModalOpen(false)} className="text-gray-600 hover:text-gray-900">
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
        </AnimatePresence>, document.body
      )}
    </div>
  );
}
