import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, ShoppingCart, Heart, AlertTriangle, FileCheck, Star, Eye, X, Info,
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import CollapsibleTable from '../CollapsibleTable';
import CollapsibleChart from '../CollapsibleChart';

// ── Datos ──────────────────────────────────────────────────────────────────

const comprasData = [
  { mes: 'Enero',      mesCorto: 'Ene', c2025: 534282848,  c2024: 474432855,  c2023: 600564431,  var2425:  12.62, var2324: -21.00 },
  { mes: 'Febrero',    mesCorto: 'Feb', c2025: 509837369,  c2024: 621555555,  c2023: 759316575,  var2425: -17.97, var2324: -18.14 },
  { mes: 'Marzo',      mesCorto: 'Mar', c2025: 619736830,  c2024: 550965800,  c2023: 767903778,  var2425:  12.48, var2324: -28.25 },
  { mes: 'Abril',      mesCorto: 'Abr', c2025: 648645152,  c2024: 784542984,  c2023: 713190490,  var2425: -17.32, var2324:  10.00 },
  { mes: 'Mayo',       mesCorto: 'May', c2025: 865707842,  c2024: 753451113,  c2023: 765715840,  var2425:  14.90, var2324:  -1.60 },
  { mes: 'Junio',      mesCorto: 'Jun', c2025: 715067678,  c2024: 732476001,  c2023: 539106699,  var2425:  -2.38, var2324:  35.87 },
  { mes: 'Julio',      mesCorto: 'Jul', c2025: 685759378,  c2024: 731561700,  c2023: 554146147,  var2425:  -6.26, var2324:  32.02 },
  { mes: 'Agosto',     mesCorto: 'Ago', c2025: 750725818,  c2024: 553684110,  c2023: 800416404,  var2425:  35.59, var2324: -30.83 },
  { mes: 'Septiembre', mesCorto: 'Sep', c2025: 1019920685, c2024: 773445898,  c2023: 716179612,  var2425:  31.87, var2324:   8.00 },
  { mes: 'Octubre',    mesCorto: 'Oct', c2025: 963699938,  c2024: 643181922,  c2023: 777703724,  var2425:  49.83, var2324: -17.30 },
  { mes: 'Noviembre',  mesCorto: 'Nov', c2025: 718262645,  c2024: 685082844,  c2023: 682133592,  var2425:   4.84, var2324:   0.43 },
  { mes: 'Diciembre',  mesCorto: 'Dic', c2025: 896023288,  c2024: 836824477,  c2023: 714183870,  var2425:   7.07, var2324:  17.17 },
];

const total2025Compras = 8927669471;
const total2024Compras = 8141205259;
const total2023Compras = 8390561162;
const varCompras2425 = 9.66;
const varCompras2324 = -2.97;

const polloMalSangradoData = [
  { mes: 'Ene', p2023: 134, p2024: 229, p2025: 94 },
  { mes: 'Feb', p2023: 217, p2024: 419, p2025: 106 },
  { mes: 'Mar', p2023: 282, p2024: 529, p2025: 170 },
  { mes: 'Abr', p2023: 247, p2024: 614, p2025: 150 },
  { mes: 'May', p2023: 243, p2024: 488, p2025: 153 },
  { mes: 'Jun', p2023: 297, p2024: 556, p2025: 143 },
  { mes: 'Jul', p2023: 219, p2024: 310, p2025: 203 },
  { mes: 'Ago', p2023: 174, p2024: 374, p2025: 134 },
  { mes: 'Sep', p2023: 304, p2024: 398, p2025: 115 },
  { mes: 'Oct', p2023: 475, p2024: 394, p2025: 146 },
  { mes: 'Nov', p2023: 549, p2024: 315, p2025: 105 },
  { mes: 'Dic', p2023: 545, p2024: 289, p2025: 176 },
];

const prom2025Sangrado = Math.round(polloMalSangradoData.reduce((s, d) => s + d.p2025, 0) / 12);
const prom2024Sangrado = Math.round(polloMalSangradoData.reduce((s, d) => s + d.p2024, 0) / 12);

const rehabilitacionData = [
  { categoria: 'Gestantes', valor: 8, color: '#f9a8d4' },
  { categoria: 'Accidente Laboral', valor: 14, color: '#fbbf24' },
  { categoria: 'Enfermedad Laboral', valor: 8, color: '#4ade80' },
  { categoria: 'Enfermedad Común', valor: 19, color: '#60a5fa' },
];

const aguaPlantaData = [
  { año: '2023', valor: 12.82, fill: '#93c5fd' },
  { año: '2024', valor: 11.44, fill: '#60a5fa' },
  { año: '2025', valor: 10.76, fill: '#fbbf24' },
];

const aguaSede2Data = [
  { año: '2023', valor: 3.53, fill: '#93c5fd' },
  { año: '2024', valor: 4.42, fill: '#60a5fa' },
  { año: '2025', valor: 3.43, fill: '#34d399' },
];

const satisfaccion2025 = [
  { name: 'Excelente', value: 550, pct: 47.17, color: '#1e3a8a' },
  { name: 'Bueno', value: 561, pct: 48.11, color: '#38bdf8' },
  { name: 'Regular', value: 4, pct: 0.35, color: '#7c3aed' },
  { name: 'Malo', value: 51, pct: 4.37, color: '#f97316' },
];

const satisfaccion2024 = [
  { name: 'Excelente', value: 1100, pct: 58.21, color: '#1e3a8a' },
  { name: 'Bueno', value: 730, pct: 38.54, color: '#38bdf8' },
  { name: 'Regular', value: 14, pct: 0.70, color: '#7c3aed' },
  { name: 'Malo', value: 50, pct: 2.55, color: '#f97316' },
];

// ── Helpers ────────────────────────────────────────────────────────────────

const n = (v) => Number(v).toLocaleString('es-CO');
const fmt = (v) => `${(v / 1e6).toFixed(0)}M`;
const pct = (a, b) => b > 0 ? (((a - b) / b) * 100).toFixed(2) : '0.00';

// ── Modal ──────────────────────────────────────────────────────────────────

function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return createPortal(
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}>
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="p-6 space-y-4 text-gray-700">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

// ── KPI Card clickeable ────────────────────────────────────────────────────

function KpiClickCard({ label, value2025, value2024, unit = '', varPct, varAbs, color, icon: Icon, good = true, onClick, children }) {
  const isUp = parseFloat(varPct) >= 0;
  const isGood = good ? isUp : !isUp;
  const varColor = isGood ? 'text-green-600' : 'text-red-400';
  const borderColor = isGood ? 'border-green-500/30 hover:border-green-500' : 'border-red-400/40 hover:border-red-400';
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={`bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 ${borderColor} cursor-pointer transition-all`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600 text-xs font-medium leading-tight">{label}</span>
        {Icon && <Icon className="w-5 h-5 flex-shrink-0" style={{ color }} />}
      </div>
      <div className="text-2xl font-bold text-gray-900 leading-tight">{value2025}{unit}</div>
      <div className="border-t border-gray-100 pt-2 mt-2 space-y-0.5">
        {value2024 && !['Ref. 2024', 'Base 2024', '—', 'N/A'].includes(value2024) && (
          <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{value2024}{unit}</span></div>
        )}
        <div className={`text-sm font-bold ${varColor}`}>
          {isUp ? <ArrowUpRight className="inline w-3.5 h-3.5" /> : <ArrowDownRight className="inline w-3.5 h-3.5" />}
          {' '}Var: {isUp ? '+' : ''}{varPct}%
        </div>
        {varAbs && <div className={`text-xs font-semibold ${varColor}`}>Dif: {isUp ? '+' : ''}{varAbs}</div>}
      </div>
      {children}
    </motion.div>
  );
}

// ── Tooltips gráficas ──────────────────────────────────────────────────────

function TooltipCompras({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const a25 = payload.find(p => p.dataKey === 'c2025');
  const a24 = payload.find(p => p.dataKey === 'c2024');
  const diff = a25 && a24 ? a25.value - a24.value : null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs max-w-[210px]">
      <p className="font-bold text-gray-800 mb-2">{label}</p>
      {a25 && <p className="text-amber-600 font-semibold">2025: ${n(a25.value)}</p>}
      {a24 && <p className="text-gray-500">2024: ${n(a24.value)}</p>}
      {diff !== null && <p className={`mt-1 font-bold ${diff >= 0 ? 'text-red-500' : 'text-green-600'}`}>vs 2024: {diff >= 0 ? '+' : ''}${n(diff)}</p>}
    </div>
  );
}

function TooltipPolloSangrado({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const p25 = payload.find(p => p.dataKey === 'p2025');
  const p24 = payload.find(p => p.dataKey === 'p2024');
  const mejora = p25 && p24 && p24.value > 0 ? Math.round(((p24.value - p25.value) / p24.value) * 100) : null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs max-w-[200px]">
      <p className="font-bold text-gray-800 mb-2">{label} — Pollos mal sangrados</p>
      {p25 && <p className="text-blue-600 font-semibold">2025: {n(p25.value)} unidades</p>}
      {p24 && <p className="text-yellow-600">2024: {n(p24.value)} unidades</p>}
      {mejora !== null && mejora > 0 && <p className="mt-1 font-bold text-green-600">Mejora vs 2024: –{mejora}%</p>}
    </div>
  );
}

function TooltipAccidentes({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  const pctVal = val ? Math.round((val / 112) * 100) : 0;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs max-w-[180px]">
      <p className="font-bold text-gray-800 mb-1">{label}</p>
      <p className="text-red-600 font-semibold">{val} accidentes ({pctVal}% del total)</p>
    </div>
  );
}

function TooltipRehabilitacion({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  const pctVal = Math.round((val / 49) * 100);
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs max-w-[180px]">
      <p className="font-bold text-gray-800 mb-1">{label}</p>
      <p className="text-indigo-600 font-semibold">{val} personas ({pctVal}% de 49 total)</p>
    </div>
  );
}

function TooltipAgua({ unidad, meta }) {
  return function TT({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    const val = payload[0]?.value;
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs max-w-[180px]">
        <p className="font-bold text-gray-800 mb-1">Año {label}</p>
        <p className="text-blue-600 font-semibold">{val} {unidad}</p>
        {meta && <p className={`font-bold mt-1 ${val <= meta ? 'text-green-600' : 'text-red-500'}`}>{val <= meta ? `✓ Bajo meta (${meta})` : `⚠ Sobre meta (${meta})`}</p>}
      </div>
    );
  };
}

function TooltipSatisfaccion({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value, pct: p } = payload[0]?.payload || {};
  const clr = { Excelente: '#1e3a8a', Bueno: '#38bdf8', Regular: '#7c3aed', Malo: '#f97316' };
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs max-w-[180px]">
      <p className="font-bold mb-1" style={{ color: clr[name] }}>{name}</p>
      <p className="text-gray-700 font-semibold">{n(value)} encuestas — {p}%</p>
    </div>
  );
}

// ── Bullet list ────────────────────────────────────────────────────────────

function Bullet({ items, color = '#3b82f6' }) {
  return (
    <ul className="space-y-1.5 pt-2">
      {items.map((t, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
          <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
          {t}
        </li>
      ))}
    </ul>
  );
}

// ── Secciones ──────────────────────────────────────────────────────────────

function SeccionCalidad() {
  const [modal, setModal] = useState({ open: false, title: '', content: null });
  const open = (title, content) => setModal({ open: true, title, content });
  const close = () => setModal(m => ({ ...m, open: false }));

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500/20 to-blue-600/10 rounded-xl p-6 border-2 border-indigo-500/30">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-7 h-7 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">Aseguramiento de Calidad — 2025</h2>
        </div>
        <p className="text-gray-700 text-sm">Se garantizó la inocuidad y conformidad normativa bajo HACCP e INVIMA.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {/* Card cualitativa — sin variación inventada */}
        {[
          {
            icon: Shield,
            color: 'border-indigo-400 bg-indigo-50',
            iconColor: 'text-indigo-600',
            tag: 'Inocuidad HACCP / INVIMA',
            status: 'Garantizada',
            statusColor: 'text-indigo-700',
            detail: 'Cumplimiento normativo total durante 2025. Sin observaciones mayores en auditorías externas.',
            modalTitle: 'Inocuidad HACCP / INVIMA',
            modalContent: <div className="space-y-3">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="font-semibold text-green-700 mb-1">Cumplimiento normativo</p>
                <p className="text-sm">Se garantizó la inocuidad y conformidad normativa bajo HACCP e INVIMA durante todo el año.</p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                <p className="font-semibold text-indigo-700 mb-2">Énfasis del año</p>
                <Bullet color="#6366f1" items={[
                  'Fortalecimiento de prerrequisitos y control microbiológico',
                  'Capacitación al personal y gestión técnica de auditorías',
                  'Control de proveedores y variables operativas clave',
                ]} />
              </div>
            </div>,
          },
        ].map(({ icon: Icon, color, iconColor, tag, status, statusColor, detail, modalTitle, modalContent }, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            onClick={() => open(modalTitle, modalContent)}
            className={`rounded-xl p-5 border-2 ${color} cursor-pointer hover:shadow-md transition-all`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-600">{tag}</span>
              <Icon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
            </div>
            <p className={`text-xl font-bold ${statusColor} mb-2`}>{status}</p>
            <p className="text-xs text-gray-500 leading-snug">{detail}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-1 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Énfasis del año</p>
          <Bullet color="#6366f1" items={[
            'Fortalecimiento de prerrequisitos y control microbiológico',
            'Capacitación al personal y gestión técnica de auditorías',
            'Control de proveedores y variables operativas clave',
          ]} />
        </div>
      </div>

      <Modal open={modal.open} title={modal.title} onClose={close}>{modal.content}</Modal>
    </div>
  );
}

function SeccionCompras() {
  const [modal, setModal] = useState({ open: false, title: '', content: null });
  const open = (title, content) => setModal({ open: true, title, content });
  const close = () => setModal(m => ({ ...m, open: false }));

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-500/20 to-yellow-600/10 rounded-xl p-6 border-2 border-amber-500/30">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingCart className="w-7 h-7 text-amber-600" />
          <h2 className="text-2xl font-bold text-gray-900">Compras — 2025</h2>
        </div>
        <p className="text-gray-700 text-sm">Compras de insumos y materiales. Fuente: SIESA / doccompra por ítem/grupo bodega L01.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiClickCard
          label="Total compras 2025"
          value2025={`$${n(total2025Compras)}`}
          value2024={`$${n(total2024Compras)}`}
          varPct={varCompras2425.toFixed(2)}
          varAbs={`$${n(total2025Compras - total2024Compras)}`}
          color="#f59e0b" icon={ShoppingCart} good={false}
          onClick={() => open('Total Compras 2025 vs 2024', <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-500 mb-1">2024</p><p className="text-xl font-bold text-gray-900">${n(total2024Compras)}</p></div>
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200"><p className="text-xs text-amber-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-amber-700">${n(total2025Compras)}</p></div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <p className="font-semibold text-orange-700 mb-1">Variación 2024→2025: +{varCompras2425}%</p>
              <p className="text-sm">Diferencia absoluta: ${n(total2025Compras - total2024Compras)}.</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="font-semibold text-blue-700 mb-1">vs 2023: ${n(total2023Compras)}</p>
              <p className="text-sm">Variación 2023→2024: {varCompras2324}%. En 2025 se retomó el crecimiento.</p>
            </div>
          </div>)}
        />

        <KpiClickCard
          label="Mes de mayor compra"
          value2025="Sep — $1.019.920.685"
          value2024="Dic — $836.824.477"
          varPct="21.90"
          varAbs="Septiembre lideró en 2025"
          color="#ef4444" icon={TrendingUp} good={false}
          onClick={() => open('Mes de mayor compra', <div className="space-y-3">
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <p className="font-semibold text-red-700 mb-1">Septiembre 2025: $1.019.920.685</p>
              <p className="text-sm">+31,87% vs septiembre 2024 ($773.445.898). Octubre también fue alto: $963.699.938 (+49,83% vs 2024).</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <p className="font-semibold text-amber-700 mb-1">Meses con mayor crecimiento vs 2024</p>
              <Bullet color="#f59e0b" items={['Octubre: +49,83%', 'Agosto: +35,59%', 'Septiembre: +31,87%']} />
            </div>
          </div>)}
        />

        <KpiClickCard
          label="Variación total 2024→2025"
          value2025="+9,66%"
          value2024="-2,97% (2023→2024)"
          varPct="9.66"
          varAbs={`$${n(total2025Compras - total2024Compras)} más que 2024`}
          color="#10b981" icon={TrendingUp} good={false}
          onClick={() => open('Variación anual de compras', <div className="space-y-3">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="font-semibold text-green-700 mb-1">2024→2025: +9,66%</p>
              <p className="text-sm">Las compras crecieron ${n(total2025Compras - total2024Compras)} en términos absolutos respecto a 2024.</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="font-semibold text-blue-700 mb-1">2023→2024: -2,97%</p>
              <p className="text-sm">En 2024 las compras habían bajado respecto a 2023 (${n(total2023Compras)}). En 2025 se retomó el crecimiento.</p>
            </div>
          </div>)}
        />
      </div>

      <CollapsibleChart title="Compras mensuales 2023 – 2025" subtitle="Valores en pesos" defaultOpen={false}>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={comprasData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="mesCorto" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={fmt} tick={{ fontSize: 10 }} width={55} />
            <Tooltip content={<TooltipCompras />} />
            <Legend />
            <Line type="monotone" dataKey="c2025" name="2025" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="c2024" name="2024" stroke="#6b7280" strokeWidth={1.5} dot={{ r: 2 }} strokeDasharray="4 2" />
            <Line type="monotone" dataKey="c2023" name="2023" stroke="#d1d5db" strokeWidth={1.5} dot={{ r: 2 }} strokeDasharray="2 2" />
          </LineChart>
        </ResponsiveContainer>
      </CollapsibleChart>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Factores del comportamiento anual</p>
          <Bullet color="#f59e0b" items={[
            'Aumento del 51% en producción',
            'Crecimiento de demanda de clientes estratégicos (D1, ARA, Frisby)',
            'Eventos extraordinarios del sector y mantenimientos OVERHAUL',
          ]} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Hallazgos clave</p>
          <Bullet color="#ef4444" items={[
            'Consumo promedio del 73,42% sobre las compras (ajuste positivo frente a 2024)',
            'Cierre del año con compras a la baja, excepto picos por auditorías HACCP y dotaciones',
            'Aumento en volumen y costo del inventario por repuestos importados',
            'Evaluación de 36 proveedores y visitas conjuntas con Calidad para proveedores críticos (HACCP)',
          ]} />
        </div>
      </div>

      <CollapsibleTable title="Compras mensuales 2023 – 2025 con variaciones" defaultOpen={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">MES</th>
                <th className="text-right py-3 px-4 font-semibold text-amber-700">COMPRAS 2025</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-600">COMPRAS 2024</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-400">COMPRAS 2023</th>
                <th className="text-right py-3 px-4 font-semibold text-red-600">% VAR 2024-2025</th>
                <th className="text-right py-3 px-4 font-semibold text-green-700">% VAR 2023-2024</th>
              </tr>
            </thead>
            <tbody>
              {comprasData.map((row, i) => (
                <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="py-2.5 px-4 font-medium text-gray-800">{row.mes}</td>
                  <td className="py-2.5 px-4 text-right font-semibold text-amber-700">${n(row.c2025)}</td>
                  <td className="py-2.5 px-4 text-right text-gray-600">${n(row.c2024)}</td>
                  <td className="py-2.5 px-4 text-right text-gray-400">${n(row.c2023)}</td>
                  <td className={`py-2.5 px-4 text-right font-semibold ${row.var2425 >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {row.var2425 >= 0 ? '+' : ''}{row.var2425.toFixed(2)}%
                  </td>
                  <td className={`py-2.5 px-4 text-right font-semibold ${row.var2324 >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {row.var2324 >= 0 ? '+' : ''}{row.var2324.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-amber-50 border-t-2 border-amber-300 font-bold">
                <td className="py-3 px-4 text-gray-900">TOTALES</td>
                <td className="py-3 px-4 text-right text-amber-700">${n(total2025Compras)}</td>
                <td className="py-3 px-4 text-right text-gray-700">${n(total2024Compras)}</td>
                <td className="py-3 px-4 text-right text-gray-500">${n(total2023Compras)}</td>
                <td className="py-3 px-4 text-right text-red-600">+{varCompras2425}%</td>
                <td className="py-3 px-4 text-right text-green-700">{varCompras2324}%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CollapsibleTable>

      <Modal open={modal.open} title={modal.title} onClose={close}>{modal.content}</Modal>
    </div>
  );
}

function SeccionBienestar() {
  const [modal, setModal] = useState({ open: false, title: '', content: null });
  const open = (title, content) => setModal({ open: true, title, content });
  const close = () => setModal(m => ({ ...m, open: false }));

  const varSangrado = pct(prom2025Sangrado, prom2024Sangrado);

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-pink-500/20 to-rose-600/10 rounded-xl p-6 border-2 border-pink-500/30">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-7 h-7 text-pink-600" />
          <h2 className="text-2xl font-bold text-gray-900">Bienestar Animal — 2025</h2>
        </div>
        <p className="text-gray-700 text-sm">Indicadores de bienestar en transporte, insensibilizado y proceso de beneficio.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiClickCard label="Reducción pollo mal sangrado vs 2024" value2025="–63,3%" value2024={n(prom2024Sangrado) + ' u/mes prom.'}
          varPct="-63.3" varAbs="Disminución de pérdidas económicas"
          color="#10b981" icon={TrendingDown} good={false}
          onClick={() => open('Pollo mal sangrado 2025 vs 2024', <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-500 mb-1">Promedio 2024</p><p className="text-xl font-bold text-gray-900">{n(prom2024Sangrado)} u/mes</p></div>
              <div className="bg-green-50 rounded-lg p-3 border border-green-200"><p className="text-xs text-green-600 font-semibold mb-1">Promedio 2025</p><p className="text-xl font-bold text-green-700">{n(prom2025Sangrado)} u/mes</p></div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200"><p className="font-semibold text-green-700 mb-1">Reducción: –63,3% vs 2024</p><p className="text-sm">Logrado mediante mejoras en insensibilizado, capacitación del personal y ajustes técnicos en planta. Disminuyó pérdidas económicas significativamente.</p></div>
          </div>)} />

        <KpiClickCard label="Aves mal aturdidas" value2025="–8,21%"  varPct="-8.21" varAbs="Mejora sostenida en planta" color="#10b981" icon={TrendingDown} good={false}
          onClick={() => open('Aves mal aturdidas 2025 vs 2024', <div className="space-y-3">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200"><p className="font-semibold text-green-700 mb-1">Reducción del 8,21%</p><p className="text-sm">La reducción refleja el impacto de los ajustes técnicos en el proceso de insensibilización y la capacitación continua del personal operativo.</p></div>
          </div>)} />

        <KpiClickCard label="Cargue en tubo (migración)" value2025="100%" value2024="En proceso" varPct="100" varAbs="Migración completa lograda" color="#3b82f6" icon={TrendingUp} good={true}
          onClick={() => open('Migración a cargue en tubo', <div className="space-y-3">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200"><p className="font-semibold text-blue-700 mb-1">100% migrado</p><p className="text-sm">Se completó la migración total al sistema de cargue en tubo, eliminando el método anterior que generaba mayor estrés animal durante el proceso de carga.</p></div>
          </div>)} />

        <KpiClickCard label="Transportadores certificados ICA/Mintransporte" value2025="100%" value2024="100%" varPct="0" varAbs="Cumplimiento normativo total" color="#6366f1" icon={Shield} good={true}
          onClick={() => open('Certificación de transportadores', <div className="space-y-3">
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200"><p className="font-semibold text-indigo-700 mb-1">100% certificados</p><p className="text-sm">El 100% de los transportadores de aves cuentan con certificación vigente de ICA y Mintransporte, cumpliendo la normativa de bienestar animal en transporte.</p></div>
          </div>)} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Fortalecimiento del programa</p>
          <Bullet color="#ec4899" items={[
            'Capacitación del personal operativo, supervisores y calidad',
            'Certificación de transportadores (ICA/Mintransporte)',
            'Diseño de mejoras en insensibilizado y sangrado',
          ]} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Resultados destacados</p>
          <Bullet color="#10b981" items={[
            'Reducción del 63,3% de pollo mal sangrado vs. 2024, disminuyendo pérdidas económicas',
            'Disminución del 8,21% en aves mal aturdidas, gracias a ajustes en la entrada a la cuba de aturdido',
            'Migración del 100% al sistema de cargue en tubo',
            'Implementación del monitoreo de lesiones en granja y planta',
            'Consolidación del Programa de Bienestar Animal bajo estándares ISO',
          ]} />
        </div>
      </div>

      <CollapsibleChart title="Pollo mal sangrado mensual 2023 – 2025" subtitle="Unidades por mes" defaultOpen={false}>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={polloMalSangradoData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip content={<TooltipPolloSangrado />} />
            <Legend />
            <Line type="monotone" dataKey="p2023" name="2023" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="p2024" name="2024" stroke="#eab308" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="p2025" name="2025" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </CollapsibleChart>

      <Modal open={modal.open} title={modal.title} onClose={close}>{modal.content}</Modal>
    </div>
  );
}

function SeccionHSEQ() {
  const [modal, setModal] = useState({ open: false, title: '', content: null });
  const open = (title, content) => setModal({ open: true, title, content });
  const close = () => setModal(m => ({ ...m, open: false }));

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-500/20 to-red-600/10 rounded-xl p-6 border-2 border-orange-500/30">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-7 h-7 text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-900">HSEQ — 2025</h2>
        </div>
        <p className="text-gray-700 text-sm">Seguridad, salud, medio ambiente y calidad. Accidentalidad, agua y residuos.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiClickCard label="Accidentes laborales 2025" value2025="112" value2024="95" varPct="17.89" varAbs="Planta 27 · Posproceso 21 · Calidad 17" color="#ef4444" icon={AlertTriangle} good={false}
          onClick={() => open('Accidentes laborales 2025', <div className="space-y-3">
            <div className="bg-red-50 rounded-lg p-4 border border-red-200"><p className="font-semibold text-red-700 mb-1">112 accidentes en 2025</p><p className="text-sm">Distribución por área: Planta 27 (24%), Posproceso 21 (19%), Calidad 17 (15%), Granjas 16 (14%), Otros 31 (28%). El riesgo osteomuscular es el principal factor.</p></div>
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200"><p className="font-semibold text-orange-700 mb-1">Acción: gimnasia laboral</p><p className="text-sm">Se implementó el programa de gimnasia laboral con 22 capacitaciones y 347 asistentes para mitigar el riesgo osteomuscular.</p></div>
          </div>)} />

        <KpiClickCard label="Capacitaciones SST realizadas" value2025="22" value2024="—" varPct="100" varAbs="347 asistentes en total" color="#f97316" icon={TrendingUp} good={true}
          onClick={() => open('Capacitaciones SST 2025', <div className="space-y-3">
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200"><p className="font-semibold text-orange-700 mb-1">22 capacitaciones — 347 asistentes</p><p className="text-sm">Incluye el programa de gimnasia laboral para mitigar riesgo osteomuscular, principal causa de accidentalidad en planta y posproceso.</p></div>
          </div>)} />

        <KpiClickCard label="Agua/ave planta beneficio" value2025="10,76 L/ave" value2024="11,44 L/ave" varPct="-5.94" varAbs="–0,68 L/ave ahorrados" color="#10b981" icon={TrendingDown} good={false}
          onClick={() => open('Consumo de agua planta beneficio', <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {aguaPlantaData.map((d, i) => <div key={i} className="bg-blue-50 rounded-lg p-3 border border-blue-200 text-center"><p className="text-xs text-gray-500">{d.año}</p><p className="text-lg font-bold text-blue-700">{d.valor} L/ave</p></div>)}
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200"><p className="font-semibold text-green-700 mb-1">Reducción sostenida 2023→2025</p><p className="text-sm">De 12,82 L/ave en 2023 a 10,76 L/ave en 2025: reducción total de 2,06 L/ave (–16%). Refleja mejoras en eficiencia hídrica y cumplimiento ambiental.</p></div>
          </div>)} />

        <KpiClickCard label="Agua Sede 2" value2025="3,43 L/kg" value2024="4,42 L/kg" varPct="-22.40" varAbs="–0,99 L/kg ahorrados" color="#10b981" icon={TrendingDown} good={false}
          onClick={() => open('Consumo de agua Sede 2', <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {aguaSede2Data.map((d, i) => <div key={i} className="bg-blue-50 rounded-lg p-3 border border-blue-200 text-center"><p className="text-xs text-gray-500">{d.año}</p><p className="text-lg font-bold text-blue-700">{d.valor} L/kg</p></div>)}
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200"><p className="font-semibold text-green-700 mb-1">Reducción 2024→2025: –22,4%</p><p className="text-sm">Sede 2 pasó de 4,42 L/kg en 2024 a 3,43 L/kg en 2025, recuperando el nivel de 2023 (3,53 L/kg) y superándolo.</p></div>
          </div>)} />

        <KpiClickCard label="Residuos aprovechables" value2025="+24,65%" varPct="24.65" varAbs="Mayor separación en la fuente" color="#10b981" icon={TrendingUp} good={true}
          onClick={() => open('Gestión de residuos aprovechables', <div className="space-y-3">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200"><p className="font-semibold text-green-700 mb-1">+24,65% en residuos aprovechables</p><p className="text-sm">El crecimiento indica mejor separación en la fuente y mayor eficiencia en el programa de gestión ambiental. 100% cumplimiento en reportes al DANE, IDEAM y SDA.</p></div>
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200"><p className="font-semibold text-orange-700 mb-1">Alerta: residuos peligrosos</p><p className="text-sm">Aumento del 29,84% en residuos peligrosos por jornadas extraordinarias de disposición de RAEE (equipos electrónicos en desuso).</p></div>
          </div>)} />
      </div>

      <CollapsibleChart title="Accidentes por área — 112 total 2025" defaultOpen={false}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={[
            { area: 'Planta', n: 27 }, { area: 'Posproceso', n: 21 }, { area: 'Calidad', n: 17 },
            { area: 'Granjas', n: 16 }, { area: 'Otros', n: 31 },
          ]} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="area" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip content={<TooltipAccidentes />} />
            <Bar dataKey="n" name="Accidentes" radius={[4, 4, 0, 0]}>
              {['#ef4444','#f97316','#fbbf24','#84cc16','#94a3b8'].map((fill, i) => <Cell key={i} fill={fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CollapsibleChart>

      <CollapsibleChart title="Rehabilitación y Reintegro — 49 personas" defaultOpen={false}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={rehabilitacionData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="categoria" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip content={<TooltipRehabilitacion />} />
            <Bar dataKey="valor" name="Personas" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 11, fontWeight: 700 }}>
              {rehabilitacionData.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CollapsibleChart>


      <Modal open={modal.open} title={modal.title} onClose={close}>{modal.content}</Modal>
    </div>
  );
}

function SeccionAmbiental() {
  const [modal, setModal] = useState({ open: false, title: '', content: null });
  const open = (title, content) => setModal({ open: true, title, content });
  const close = () => setModal(m => ({ ...m, open: false }));

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500/20 to-emerald-600/10 rounded-xl p-6 border-2 border-green-500/30">
        <div className="flex items-center gap-3 mb-2">
          <TrendingDown className="w-7 h-7 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">Gestión Ambiental — 2025</h2>
        </div>
        <p className="text-gray-700 text-sm">Consumo hídrico, gestión de residuos y cumplimiento de reportes ambientales.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiClickCard label="Agua/ave planta beneficio" value2025="10,76 L/ave" value2024="11,44 L/ave"
          varPct="-5.94" varAbs="–0,68 L/ave ahorrados" color="#10b981" icon={TrendingDown} good={false}
          onClick={() => open('Consumo de agua planta beneficio', <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {aguaPlantaData.map((d, i) => <div key={i} className="bg-blue-50 rounded-lg p-3 border border-blue-200 text-center"><p className="text-xs text-gray-500">{d.año}</p><p className="text-lg font-bold text-blue-700">{d.valor} L/ave</p></div>)}
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200"><p className="font-semibold text-green-700 mb-1">Reducción sostenida 2023→2025</p><p className="text-sm">De 12,82 L/ave en 2023 a 10,76 L/ave en 2025: reducción total de 2,06 L/ave (–16%). Refleja mejoras en eficiencia hídrica y cumplimiento ambiental.</p></div>
          </div>)} />

        <KpiClickCard label="Agua Sede 2" value2025="3,43 L/kg" value2024="4,42 L/kg"
          varPct="-22.40" varAbs="–0,99 L/kg ahorrados" color="#10b981" icon={TrendingDown} good={false}
          onClick={() => open('Consumo de agua Sede 2', <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {aguaSede2Data.map((d, i) => <div key={i} className="bg-blue-50 rounded-lg p-3 border border-blue-200 text-center"><p className="text-xs text-gray-500">{d.año}</p><p className="text-lg font-bold text-blue-700">{d.valor} L/kg</p></div>)}
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200"><p className="font-semibold text-green-700 mb-1">Reducción 2024→2025: –22,4%</p><p className="text-sm">Sede 2 pasó de 4,42 L/kg en 2024 a 3,43 L/kg en 2025, recuperando y superando el nivel de 2023 (3,53 L/kg).</p></div>
          </div>)} />

        <KpiClickCard label="Residuos aprovechables" value2025="+24,65%" 
          varPct="24.65" varAbs="Mayor separación en la fuente" color="#10b981" icon={TrendingUp} good={true}
          onClick={() => open('Residuos aprovechables 2025 vs 2024', <div className="space-y-3">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200"><p className="font-semibold text-green-700 mb-1">+24,65% en residuos aprovechables</p><p className="text-sm">Indica mejor separación en la fuente y mayor eficiencia en el programa de gestión ambiental. 100% cumplimiento en reportes al DANE, IDEAM y SDA.</p></div>
          </div>)} />

        <KpiClickCard label="Residuos peligrosos (RAEE)" value2025="+29,84%" 
          varPct="29.84" varAbs="Jornadas extraordinarias RAEE" color="#f97316" icon={AlertTriangle} good={false}
          onClick={() => open('Residuos peligrosos RAEE', <div className="space-y-3">
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200"><p className="font-semibold text-orange-700 mb-1">+29,84% — jornadas extraordinarias</p><p className="text-sm">El aumento se explica por jornadas extraordinarias de disposición de RAEE (equipos electrónicos en desuso). No refleja deterioro operativo sino una gestión activa de pasivos ambientales.</p></div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200"><p className="font-semibold text-blue-700 mb-1">Cumplimiento normativo</p><p className="text-sm">100% de reportes ambientales entregados a DANE, IDEAM y SDA. Avances en concesiones de agua y gestión ante CAR en múltiples granjas.</p></div>
          </div>)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiClickCard label="Canastillas rotas" value2025="–20,02%" 
          varPct="-20.02" varAbs="Reducción de pérdidas en logística" color="#10b981" icon={TrendingDown} good={false}
          onClick={() => open('Canastillas rotas 2025 vs 2024', <div className="space-y-3">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200"><p className="font-semibold text-green-700 mb-1">Reducción del 20,02%</p><p className="text-sm">La reducción en canastillas rotas refleja mejoras en el manejo logístico y el cuidado de activos durante el transporte y proceso de beneficio.</p></div>
          </div>)} />

        <KpiClickCard label="Cumplimiento reportes ambientales" value2025="100%" value2024="100%"
          varPct="0" varAbs="DANE, IDEAM y SDA" color="#0ea5e9" icon={FileCheck} good={true}
          onClick={() => open('Reportes ambientales 2025', <div className="space-y-3">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200"><p className="font-semibold text-blue-700 mb-1">100% cumplimiento</p><p className="text-sm">Todos los reportes ambientales exigidos por DANE, IDEAM y SDA fueron entregados en tiempo y forma. Avances en concesiones de agua y gestión ante CAR en múltiples granjas.</p></div>
          </div>)} />

        <KpiClickCard label="Agua/ave planta — reducción total 2023→2025" value2025="–16%" value2024="12,82 L/ave (2023)"
          varPct="-16" varAbs="De 12,82 a 10,76 L/ave" color="#10b981" icon={TrendingDown} good={false}
          onClick={() => open('Reducción hídrica acumulada', <div className="space-y-3">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200"><p className="font-semibold text-green-700 mb-1">–16% en 3 años</p><p className="text-sm">De 12,82 L/ave en 2023 a 10,76 L/ave en 2025. Reducción sostenida que refleja eficiencia hídrica y cumplimiento ambiental.</p></div>
          </div>)} />
      </div>

      <CollapsibleChart title="Consumo agua planta beneficio (L/ave)" subtitle="2023 – 2025" defaultOpen={false}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={aguaPlantaData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="año" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 16]} tick={{ fontSize: 10 }} />
            <Tooltip content={TooltipAgua({ unidad: 'L/ave', meta: 11 })} />
            <Bar dataKey="valor" name="L/ave" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 12, fontWeight: 700 }}>
              {aguaPlantaData.map((e, i) => <Cell key={i} fill={e.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CollapsibleChart>

      <CollapsibleChart title="Consumo agua Sede 2 (L/kg)" subtitle="2023 – 2025" defaultOpen={false}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={aguaSede2Data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="año" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 6]} tick={{ fontSize: 10 }} />
            <Tooltip content={TooltipAgua({ unidad: 'L/kg', meta: 4 })} />
            <Bar dataKey="valor" name="L/kg" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 12, fontWeight: 700 }}>
              {aguaSede2Data.map((e, i) => <Cell key={i} fill={e.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CollapsibleChart>

      <Modal open={modal.open} title={modal.title} onClose={close}>{modal.content}</Modal>
    </div>
  );
}

function SeccionSGC() {
  const [modal, setModal] = useState({ open: false, title: '', content: null });
  const open = (title, content) => setModal({ open: true, title, content });
  const close = () => setModal(m => ({ ...m, open: false }));

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-sky-500/20 to-blue-600/10 rounded-xl p-6 border-2 border-sky-500/30">
        <div className="flex items-center gap-3 mb-2">
          <FileCheck className="w-7 h-7 text-sky-600" />
          <h2 className="text-2xl font-bold text-gray-900">Sistema de Gestión de Calidad — 2025</h2>
        </div>
        <p className="text-gray-700 text-sm">Auditorías internas, migración a ISOLUCION e integración CRM SIESA.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiClickCard label="Auditorías internas realizadas" value2025="15" value2024="N/A" varPct="100" varAbs="Procesos auditados en 2025" color="#0ea5e9" icon={FileCheck} good={true}
          onClick={() => open('Auditorías internas 2025', <div className="space-y-3">
            <div className="bg-sky-50 rounded-lg p-4 border border-sky-200"><p className="font-semibold text-sky-700 mb-1">15 procesos auditados</p><p className="text-sm">Se auditaron 15 procesos internamente durante 2025, cubriendo las áreas críticas del sistema de gestión de calidad con metodologías de análisis causal.</p></div>
          </div>)} />

        <KpiClickCard label="Módulos ISOLUCION implementados" value2025="3 / 3" value2024="0 / 3" varPct="100" varAbs="Actas, Tareas y Mejora Continua" color="#10b981" icon={TrendingUp} good={true}
          onClick={() => open('Migración a ISOLUCION', <div className="space-y-3">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200"><p className="font-semibold text-green-700 mb-1">100% implementado</p><p className="text-sm">Los tres módulos prioritarios (Actas, Tareas y Mejora Continua) alcanzaron el 100% de implementación. La migración completa centraliza gestión documental, trazabilidad de acciones y seguimiento de indicadores.</p></div>
          </div>)} />

        <KpiClickCard label="Migración sistema documental" value2025="100%" value2024="0%" varPct="100" varAbs="De sistema anterior a ISOLUCION" color="#6366f1" icon={TrendingUp} good={true}
          onClick={() => open('Migración sistema documental', <div className="space-y-3">
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200"><p className="font-semibold text-indigo-700 mb-1">Migración completa</p><p className="text-sm">La migración al sistema ISOLUCION permite centralizar la gestión documental, trazabilidad de acciones correctivas y seguimiento de indicadores de calidad en una sola plataforma.</p></div>
          </div>)} />

        <KpiClickCard label="CRM integrado" value2025="SIESA" value2024="Separado" varPct="100" varAbs="Requisitos de clientes unificados" color="#f59e0b" icon={Info} good={true}
          onClick={() => open('Integración CRM SIESA', <div className="space-y-3">
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200"><p className="font-semibold text-amber-700 mb-1">CRM SIESA integrado</p><p className="text-sm">La integración del CRM SIESA permite unificar los requisitos de clientes con el sistema de gestión, reduciendo reprocesos y mejorando la velocidad de respuesta ante solicitudes.</p></div>
          </div>)} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm font-semibold text-gray-700 mb-3">Logros del Sistema de Gestión de Calidad 2025</p>
        <Bullet color="#0ea5e9" items={[
          'Actualización de matrices estratégicas y políticas',
          'Ejecución de auditorías internas en 15 procesos',
          'Implementación de metodologías de análisis causal',
          'Migración del sistema a ISOLUCION, con módulos de Actas, Tareas y Mejora implementados al 100%',
          'Integración del CRM SIESA para unificar requisitos de clientes',
        ]} />
      </div>

      <Modal open={modal.open} title={modal.title} onClose={close}>{modal.content}</Modal>
    </div>
  );
}

function SeccionSatisfaccion() {
  const [modal, setModal] = useState({ open: false, title: '', content: null });
  const open = (title, content) => setModal({ open: true, title, content });
  const close = () => setModal(m => ({ ...m, open: false }));

  const pos2025 = 47.17 + 48.11;   // 95.28%
  const pos2024 = 58.21 + 38.54;   // 96.75%
  const varPos = pct(pos2025, pos2024);
  const varPQRS = (((259 - 362) / 362) * 100).toFixed(2);   // –28,45%
  const varPlanes = (((154 - 120) / 120) * 100).toFixed(2); // +27,92% (exacto del texto fuente)

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-violet-500/20 to-purple-600/10 rounded-xl p-6 border-2 border-violet-500/30">
        <div className="flex items-center gap-3 mb-2">
          <Star className="w-7 h-7 text-violet-600" />
          <h2 className="text-2xl font-bold text-gray-900">Satisfacción del Cliente, PQRS y Planes de Acción — 2025</h2>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">
          1.166 encuestas realizadas (–38% frente a 2024), principalmente por caída del canal PDV. Distribución más equilibrada entre canales Asadores y Tienda a Tienda.
          154 planes de acción (+27,92%), con incremento del 34,78% en No Conformidades.
          PQRs disminuyeron 28,45% (259 casos), mostrando mayor control y reducción de incidencias.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiClickCard label="Encuestas realizadas" value2025="1.166" value2024="1.894"
          varPct="-38.44" varAbs="–728 encuestas · caída canal PDV"
          color="#8b5cf6" icon={Star} good={true}
          onClick={() => open('Encuestas de satisfacción 2025 vs 2024', <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-500 mb-1">2024</p><p className="text-xl font-bold text-gray-900">1.894 encuestas</p></div>
              <div className="bg-violet-50 rounded-lg p-3 border border-violet-200"><p className="text-xs text-violet-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-violet-700">1.166 encuestas</p></div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <p className="font-semibold text-yellow-700 mb-1">–38,44% · caída del canal PDV</p>
              <p className="text-sm">La reducción se explica por la caída del canal Puntos de Venta. La distribución entre canales Asadores y Tienda a Tienda fue más equilibrada en 2025.</p>
            </div>
          </div>)} />

        <KpiClickCard label="PQRs recibidas" value2025="259" value2024="362"
          varPct={varPQRS} varAbs="–103 PQRs · mayor control de incidencias"
          color="#10b981" icon={TrendingDown} good={false}
          onClick={() => open('PQRs 2025 vs 2024', <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-500 mb-1">2024</p><p className="text-xl font-bold text-gray-900">362 PQRs</p></div>
              <div className="bg-green-50 rounded-lg p-3 border border-green-200"><p className="text-xs text-green-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-green-700">259 PQRs</p></div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="font-semibold text-green-700 mb-1">–28,45% · reducción de incidencias</p>
              <p className="text-sm">Las PQRs bajaron 103 casos (–28,45%), mostrando mayor control y reducción de incidencias en el servicio al cliente.</p>
            </div>
          </div>)} />

        <KpiClickCard label="Planes de acción generados" value2025="154" value2024="120"
          varPct={varPlanes} varAbs="hgas34 planes · mayor madurez del sistema"
          color="#f59e0b" icon={TrendingUp} good={false}
          onClick={() => open('Planes de acción 2025 vs 2024', <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-500 mb-1">2024</p><p className="text-xl font-bold text-gray-900">120 planes</p></div>
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200"><p className="text-xs text-amber-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-amber-700">154 planes</p></div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="font-semibold text-green-700 mb-1">+27,92% · mayor rigurosidad</p>
              <p className="text-sm">El aumento refleja mayor rigurosidad en la detección y gestión proactiva de oportunidades de mejora, no necesariamente más problemas.</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <p className="font-semibold text-red-700 mb-1">No Conformidades: +34,78%</p>
              <p className="text-sm">El incremento en No Conformidades puede indicar mayor rigurosidad en la detección interna. Requiere análisis causal para determinar la causa raíz.</p>
            </div>
          </div>)} />
      </div>

      {/* Satisfacción positiva + No Conformidades — fila secundaria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KpiClickCard label="Satisfacción positiva (Excelente + Bueno)" value2025={`${pos2025.toFixed(2)}%`} value2024={`${pos2024.toFixed(2)}%`}
          varPct={varPos} varAbs={`${Math.abs(pos2025 - pos2024).toFixed(2)} pp de diferencia`}
          color="#8b5cf6" icon={Star} good={true}
          onClick={() => open('Satisfacción positiva 2025 vs 2024', <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-500 mb-1">2024 — 1.894 encuestas</p><p className="text-xl font-bold text-gray-900">{pos2024.toFixed(2)}%</p></div>
              <div className="bg-violet-50 rounded-lg p-3 border border-violet-200"><p className="text-xs text-violet-600 font-semibold mb-1">2025 — 1.166 encuestas</p><p className="text-xl font-bold text-violet-700">{pos2025.toFixed(2)}%</p></div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <p className="font-semibold text-yellow-700 mb-1">Variación: {varPos}%</p>
              <p className="text-sm">La satisfacción positiva bajó {Math.abs(pos2025 - pos2024).toFixed(2)} pp. Aunque sigue siendo alta, la tendencia requiere atención.</p>
            </div>
          </div>)} />

        <KpiClickCard label="No Conformidades detectadas" value2025="+34,78%" 
          varPct="34.78" varAbs="Mayor detección interna"
          color="#ef4444" icon={AlertTriangle} good={false}
          onClick={() => open('No Conformidades 2025 vs 2024', <div className="space-y-3">
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <p className="font-semibold text-red-700 mb-1">+34,78% — señal de alerta</p>
              <p className="text-sm">El incremento puede indicar mayor rigurosidad en la detección interna, pero también deterioro en la ejecución de procesos. Requiere análisis causal para determinar la causa raíz.</p>
            </div>
          </div>)} />
      </div>

      <CollapsibleChart title="Satisfacción del Cliente, PQRS y Planes de Acción" subtitle="Distribución de calificaciones 2025 vs 2024" defaultOpen={false}>
        <div className="grid md:grid-cols-2 gap-4 pt-2">
          {[
            { title: 'Satisfacción 2025 — 1.166 encuestas', data: satisfaccion2025 },
            { title: 'Satisfacción 2024 — 1.894 encuestas', data: satisfaccion2024 },
          ].map(({ title, data }, idx) => (
            <div key={idx} className="bg-gray-50 rounded-xl border border-gray-200 p-4">
              <p className="text-sm font-semibold text-gray-600 mb-3 text-center">{title}</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%" cy="48%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                    label={false}
                    labelLine={false}
                  >
                    {data.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip content={<TooltipSatisfaccion />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
                {data.map((e, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                    <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: e.color }} />
                    <span className="font-medium">{e.name}</span>
                    <span className="ml-auto font-bold">{e.value} ({e.pct}%)</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CollapsibleChart>

      <Modal open={modal.open} title={modal.title} onClose={close}>{modal.content}</Modal>
    </div>
  );
}

function SeccionVigia() {
  const [modal, setModal] = useState({ open: false, title: '', content: null });
  const open = (title, content) => setModal({ open: true, title, content });
  const close = () => setModal(m => ({ ...m, open: false }));

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-teal-500/20 to-cyan-600/10 rounded-xl p-6 border-2 border-teal-500/30">
        <div className="flex items-center gap-3 mb-2">
          <Eye className="w-7 h-7 text-teal-600" />
          <h2 className="text-2xl font-bold text-gray-900">Vigía de Riesgos — 2025</h2>
        </div>
        <p className="text-gray-700 text-sm">Control de acceso, trazabilidad de activos, seguridad patrimonial y gestión de alarmas y carrotanques.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiClickCard label="Quejas administrativas" value2025="0" value2024=">0" varPct="-100" varAbs="Eliminadas completamente" color="#10b981" icon={TrendingDown} good={false}
          onClick={() => open('Quejas administrativas 2025 vs 2024', <div className="space-y-3">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200"><p className="font-semibold text-green-700 mb-1">0 quejas en 2025</p><p className="text-sm">El proceso de Vigía logró eliminar completamente las quejas administrativas que existían en años anteriores, garantizando seguridad patrimonial y trazabilidad operacional.</p></div>
          </div>)} />

        <KpiClickCard label="Control de acceso (carnetización)" value2025="100%" value2024="100%" varPct="0" varAbs="Sin brechas en el año" color="#14b8a6" icon={Shield} good={true}
          onClick={() => open('Control de acceso 2025', <div className="space-y-3">
            <div className="bg-teal-50 rounded-lg p-4 border border-teal-200"><p className="font-semibold text-teal-700 mb-1">100% operativo todo el año</p><p className="text-sm">El sistema de carnetización y registro de visitantes operó al 100% durante todo el año, sin brechas en el control de acceso a instalaciones.</p></div>
          </div>)} />

        <KpiClickCard label="Tipos de activos trazados" value2025="3 tipos" value2024="0" varPct="100" varAbs="Tinas, motores, precintos" color="#6366f1" icon={TrendingUp} good={true}
          onClick={() => open('Trazabilidad de activos', <div className="space-y-3">
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200"><p className="font-semibold text-indigo-700 mb-1">3 tipos de activos críticos</p><p className="text-sm">Se implementó trazabilidad sobre: tinas de proceso, motores y precintos de seguridad. Esto reduce pérdidas y mejora el control patrimonial.</p></div>
          </div>)} />

        <KpiClickCard label="Plataformas digitales implementadas" value2025="2" value2024="0" varPct="100" varAbs="Parqueaderos y correspondencia" color="#f59e0b" icon={TrendingUp} good={true}
          onClick={() => open('Digitalización de procesos', <div className="space-y-3">
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200"><p className="font-semibold text-amber-700 mb-1">2 procesos digitalizados</p><p className="text-sm">Gestión de parqueaderos y control de correspondencia ahora operan mediante plataformas digitales, mejorando trazabilidad y reduciendo tiempos de gestión.</p></div>
          </div>)} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm font-semibold text-gray-700 mb-3">Acciones de seguridad operativa 2025</p>
        <Bullet color="#14b8a6" items={[
          'Protocolos de control de acceso, carnetización y registro de visitantes',
          'Trazabilidad de activos: tinas, motores y precintos de seguridad',
          'Gestión de parqueaderos y correspondencia mediante plataformas digitales',
          'Instalación de alarmas y redes de apoyo empresarial',
          'Control de carrotanques para ahorro de agua',
          'Eliminación de quejas administrativas y garantía de seguridad patrimonial y trazabilidad operacional',
        ]} />
      </div>

      <Modal open={modal.open} title={modal.title} onClose={close}>{modal.content}</Modal>
    </div>
  );
}

// ── Dashboard principal ────────────────────────────────────────────────────

export default function CalidadDashboard({ data: _data, section }) {
  const sectionMap = {
    calidad: <SeccionCalidad />,
    compras: <SeccionCompras />,
    bienestar: <SeccionBienestar />,
    hseq: <SeccionHSEQ />,
    ambiental: <SeccionAmbiental />,
    sgc: <SeccionSGC />,
    satisfaccion: <SeccionSatisfaccion />,
    vigia: <SeccionVigia />,
  };

  if (section && sectionMap[section]) return sectionMap[section];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500/20 to-teal-600/10 rounded-xl p-6 border-2 border-indigo-500/30">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-8 h-8 text-indigo-600" />
          <h2 className="text-3xl font-bold text-gray-900">Gerencia Estratégica y Mejoramiento Continuo — 2025</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          Durante 2025, la Gerencia Estratégica consolidó la madurez operativa mediante la articulación de Calidad, Compras, HSEQ, Bienestar Animal, SGC, Satisfacción del Cliente y Vigías de Riesgos.
        </p>
      </motion.div>
      <SeccionCalidad />
      <SeccionCompras />
      <SeccionBienestar />
      <SeccionHSEQ />
      <SeccionAmbiental />
      <SeccionSGC />
      <SeccionSatisfaccion />
      <SeccionVigia />
    </div>
  );
}
