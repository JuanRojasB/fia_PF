import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, ShoppingCart, Heart, AlertTriangle, FileCheck, Star, Eye,
  ChevronDown, ChevronUp
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// ── Datos ──────────────────────────────────────────────────────────────────

const comprasData = [
  { mes: 'Ene', c2025: 534282848, c2024: 474432855, c2023: 600564431 },
  { mes: 'Feb', c2025: 509837369, c2024: 621555555, c2023: 759316575 },
  { mes: 'Mar', c2025: 619736630, c2024: 550965800, c2023: 767903778 },
  { mes: 'Abr', c2025: 848845152, c2024: 784542904, c2023: 713190490 },
  { mes: 'May', c2025: 885707842, c2024: 753451113, c2023: 785715840 },
  { mes: 'Jun', c2025: 715067678, c2024: 712476001, c2023: 539106899 },
  { mes: 'Jul', c2025: 685759378, c2024: 731561700, c2023: 554146147 },
  { mes: 'Ago', c2025: 750725818, c2024: 553604110, c2023: 800416404 },
  { mes: 'Sep', c2025: 1019920685, c2024: 773445898, c2023: 716179812 },
  { mes: 'Oct', c2025: 983699938, c2024: 643101922, c2023: 777703724 },
  { mes: 'Nov', c2025: 718262645, c2024: 685082844, c2023: 682133592 },
  { mes: 'Dic', c2025: 896023288, c2024: 808824477, c2023: 714183870 },
];

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

const rehabilitacionData = [
  { categoria: 'Gestantes', valor: 8, color: '#f9a8d4' },
  { categoria: 'Accidente Laboral', valor: 14, color: '#fbbf24' },
  { categoria: 'Enfermedad Laboral', valor: 8, color: '#4ade80' },
  { categoria: 'Enfermedad Común', valor: 19, color: '#60a5fa' },
];

const aguaPlantaData = [
  { año: '2023', valor: 12.82, fill: '#60a5fa' },
  { año: '2024', valor: 11.44, fill: '#60a5fa' },
  { año: '2025', valor: 10.76, fill: '#fbbf24' },
];

const aguaSede2Data = [
  { año: '2023', valor: 3.53, fill: '#60a5fa' },
  { año: '2024', valor: 4.42, fill: '#60a5fa' },
  { año: '2025', valor: 3.43, fill: '#60a5fa' },
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

// ── Subcomponentes ─────────────────────────────────────────────────────────

function Section({ icon: Icon, title, color, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <span className="font-bold text-gray-800 text-base">{title}</span>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 pb-6 space-y-5 border-t border-gray-100"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

// trend: 'up' | 'down' | 'neutral'  — up=verde, down=rojo, neutral=gris
// upIsGood: true → up verde; false → up rojo (ej. accidentes)
function KpiCard({ label, value, sub, color, trend, upIsGood = true }) {
  const isPositive = (trend === 'up' && upIsGood) || (trend === 'down' && !upIsGood);
  const isNegative = (trend === 'up' && !upIsGood) || (trend === 'down' && upIsGood);
  const arrow = trend === 'up' ? '▲' : trend === 'down' ? '▼' : null;
  const arrowColor = isPositive ? '#10b981' : isNegative ? '#ef4444' : '#94a3b8';
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-1"
      style={{ background: `${color}10`, border: `1.5px solid ${color}35` }}
    >
      <p className="text-xs text-gray-500 leading-tight">{label}</p>
      <div className="flex items-end gap-1.5">
        <p className="text-2xl font-black leading-none" style={{ color }}>{value}</p>
        {arrow && <span className="text-sm font-bold mb-0.5" style={{ color: arrowColor }}>{arrow}</span>}
      </div>
      {sub && <p className="text-xs font-medium" style={{ color: isPositive ? '#10b981' : isNegative ? '#ef4444' : '#6b7280' }}>{sub}</p>}
    </div>
  );
}

function KpiRow({ items }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
      {items.map((k, i) => <KpiCard key={i} {...k} />)}
    </div>
  );
}

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

const fmt = (v) => `${(v / 1e6).toFixed(0)}M`;
const cop = (v) => `$${Number(v).toLocaleString('es-CO')}`;

// ── Tooltips personalizados ────────────────────────────────────────────────

function TooltipCompras({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const [a2025, a2024, a2023] = [payload.find(p => p.dataKey === 'c2025'), payload.find(p => p.dataKey === 'c2024'), payload.find(p => p.dataKey === 'c2023')];
  const diff = a2025 && a2024 ? a2025.value - a2024.value : null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs max-w-[220px]">
      <p className="font-bold text-gray-800 mb-2">{label}</p>
      {a2025 && <p className="text-amber-600 font-semibold">2025: {cop(a2025.value)}</p>}
      {a2024 && <p className="text-gray-500">2024: {cop(a2024.value)}</p>}
      {a2023 && <p className="text-gray-400">2023: {cop(a2023.value)}</p>}
      {diff !== null && (
        <p className={`mt-1.5 font-bold ${diff >= 0 ? 'text-red-500' : 'text-green-600'}`}>
          vs 2024: {diff >= 0 ? '+' : ''}{cop(diff)}
        </p>
      )}
      <p className="text-gray-400 mt-1.5 leading-tight">Compras de insumos y materiales. El alza en 2025 responde al +51% en volumen de producción.</p>
    </div>
  );
}

function TooltipPolloSangrado({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const p2025 = payload.find(p => p.dataKey === 'p2025');
  const p2024 = payload.find(p => p.dataKey === 'p2024');
  const p2023 = payload.find(p => p.dataKey === 'p2023');
  const mejora = p2025 && p2024 ? Math.round(((p2024.value - p2025.value) / p2024.value) * 100) : null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs max-w-[220px]">
      <p className="font-bold text-gray-800 mb-2">{label} — Pollos mal sangrados</p>
      {p2025 && <p className="text-blue-600 font-semibold">2025: {p2025.value} unidades</p>}
      {p2024 && <p className="text-yellow-600">2024: {p2024.value} unidades</p>}
      {p2023 && <p className="text-red-400">2023: {p2023.value} unidades</p>}
      {mejora !== null && mejora > 0 && (
        <p className="mt-1.5 font-bold text-green-600">Mejora vs 2024: –{mejora}%</p>
      )}
      <p className="text-gray-400 mt-1.5 leading-tight">Reducción lograda por mejoras en insensibilizado, capacitación del personal y ajustes técnicos en planta.</p>
    </div>
  );
}

function TooltipAccidentes({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  const pct = val ? Math.round((val / 112) * 100) : 0;
  const contexto = {
    Planta: 'Área de mayor riesgo osteomuscular por manipulación de canales y posturas forzadas.',
    Posproceso: 'Riesgo por cortes y movimientos repetitivos en empaque y clasificación.',
    Calidad: 'Exposición a superficies húmedas y riesgo de caídas durante inspecciones.',
    Granjas: 'Riesgo por manejo de animales, equipos y condiciones de terreno.',
    Otros: 'Incluye logística, administración, mantenimiento y otras áreas.',
  };
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs max-w-[220px]">
      <p className="font-bold text-gray-800 mb-1">{label}</p>
      <p className="text-red-600 font-semibold">{val} accidentes ({pct}% del total)</p>
      <p className="text-gray-400 mt-1.5 leading-tight">{contexto[label] || 'Área con accidentes registrados en 2025.'}</p>
    </div>
  );
}

function TooltipRehabilitacion({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  const total = 49;
  const pct = Math.round((val / total) * 100);
  const contexto = {
    Gestantes: 'Colaboradoras en período de gestación con reubicación temporal en puestos de menor riesgo.',
    'Accidente Laboral': 'Trabajadores en proceso de reintegro tras accidente de trabajo con incapacidad.',
    'Enfermedad Laboral': 'Casos de enfermedad de origen laboral (principalmente osteomuscular) en rehabilitación.',
    'Enfermedad Común': 'Mayor grupo: enfermedades no laborales que requieren reintegro gradual o adaptación del puesto.',
  };
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs max-w-[220px]">
      <p className="font-bold text-gray-800 mb-1">{label}</p>
      <p className="text-indigo-600 font-semibold">{val} personas ({pct}% de {total} total)</p>
      <p className="text-gray-400 mt-1.5 leading-tight">{contexto[label] || ''}</p>
    </div>
  );
}

function TooltipAgua({ active, payload, label, unidad, meta }) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs max-w-[210px]">
      <p className="font-bold text-gray-800 mb-1">Año {label}</p>
      <p className="text-blue-600 font-semibold">{val} {unidad}</p>
      {meta && <p className={`font-bold mt-1 ${val <= meta ? 'text-green-600' : 'text-red-500'}`}>{val <= meta ? `✓ Por debajo de meta (${meta})` : `⚠ Por encima de meta (${meta})`}</p>}
      <p className="text-gray-400 mt-1.5 leading-tight">Consumo de agua por unidad producida. La reducción sostenida refleja mejoras en eficiencia hídrica y cumplimiento ambiental.</p>
    </div>
  );
}

function TooltipSatisfaccion({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value, pct } = payload[0]?.payload || {};
  const contexto = {
    Excelente: 'Clientes que califican el servicio como sobresaliente en todos los atributos evaluados.',
    Bueno: 'Clientes satisfechos con el servicio, con oportunidades menores de mejora.',
    Regular: 'Clientes con experiencia mixta. Requieren seguimiento y plan de acción.',
    Malo: 'Clientes insatisfechos. Cada caso genera un plan de acción correctivo obligatorio.',
  };
  const color = { Excelente: '#1e3a8a', Bueno: '#38bdf8', Regular: '#7c3aed', Malo: '#f97316' };
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs max-w-[210px]">
      <p className="font-bold mb-1" style={{ color: color[name] }}>{name}</p>
      <p className="text-gray-700 font-semibold">{value} encuestas — {pct}%</p>
      <p className="text-gray-400 mt-1.5 leading-tight">{contexto[name] || ''}</p>
    </div>
  );
}

// ── Secciones individuales ─────────────────────────────────────────────────

function SeccionCalidad() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
        <h2 className="text-lg font-bold text-blue-900 mb-1">1. Aseguramiento de Calidad — 2025</h2>
      </div>
      <Section icon={Shield} title="Aseguramiento de Calidad" color="#6366f1" defaultOpen={true}>
        <KpiRow items={[
          { label: 'Desviaciones S2 vs S1', value: '+47%', sub: 'Pérdida de control 2do semestre', color: '#ef4444', trend: 'up', upIsGood: false, tooltip: 'El segundo semestre registró un 47% más de desviaciones que el primero, evidenciando pérdida de control en dosificación, desplumado y evisceración.' },
          { label: 'Incidentes Q4', value: 'Crítico', sub: 'Cambio proveedor dosificación', color: '#dc2626', trend: 'up', upIsGood: false, tooltip: 'Los picos críticos del Q4 obligaron a tomar la decisión de cambiar el sistema y proveedor de dosificación para 2026.' },
          { label: 'Auditorías aprobadas', value: '100%', sub: 'Cumplimiento INVIMA/HACCP', color: '#6366f1', trend: 'up', upIsGood: true, tooltip: 'Todas las auditorías externas de INVIMA y las verificaciones HACCP fueron aprobadas sin observaciones mayores.' },
          { label: 'Indicadores nuevos', value: '+12', sub: 'Desde junio 2025', color: '#10b981', trend: 'up', upIsGood: true, tooltip: 'A partir de junio 2025 se implementaron 12 nuevos indicadores de seguimiento para mejorar la trazabilidad del proceso productivo.' },
        ]} />
        <div className="grid md:grid-cols-2 gap-4 pt-2">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Fortalezas</p>
            <Bullet color="#6366f1" items={[
              'Fortalecimiento de prerrequisitos y control microbiológico',
              'Capacitación al personal y gestión técnica de auditorías',
              'Control de proveedores y variables operativas clave',
            ]} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Hallazgos críticos</p>
            <Bullet color="#ef4444" items={[
              'Variabilidad y pérdida de control en el segundo semestre',
              'Picos críticos en Q4 → cambio de sistema/proveedor de dosificación',
              'Incumplimientos por limitaciones de infraestructura y calibración',
            ]} />
          </div>
        </div>
      </Section>
    </div>
  );
}

function SeccionCompras() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-5 border border-yellow-200">
        <h2 className="text-lg font-bold text-yellow-900 mb-1">2. Compras — 2025</h2>
      </div>
      <Section icon={ShoppingCart} title="Compras" color="#f59e0b" defaultOpen={true}>
        <KpiRow items={[
          { label: 'Total compras 2025', value: '$8.927M', sub: '+$786M vs 2024', color: '#f59e0b', trend: 'up', upIsGood: false, tooltip: 'El total de compras pasó de $8.141M en 2024 a $8.927M en 2025. El incremento responde al aumento del 51% en producción.' },
          { label: 'Crecimiento anual', value: '+9,66%', sub: 'Impulsado por +51% producción', color: '#10b981', trend: 'up', upIsGood: true, tooltip: 'El crecimiento del 9,66% en compras es proporcionalmente menor al +51% de producción, lo que indica eficiencia en el abastecimiento.' },
          { label: 'Ratio consumo/compra', value: '73,42%', sub: '26,58% en inventario', color: '#3b82f6', trend: 'neutral', tooltip: 'Por cada $100 comprados, $73,42 se consumieron en el año. El 26,58% restante quedó en inventario, parte en repuestos importados.' },
          { label: 'Proveedores evaluados', value: '36', sub: 'Visitas conjuntas con Calidad', color: '#6366f1', trend: 'up', upIsGood: true, tooltip: 'Se evaluaron 36 proveedores con la matriz Kraljic. Los proveedores HACCP recibieron visitas conjuntas entre Compras y Calidad.' },
        ]} />
        <div className="pt-2">
          <p className="text-sm font-semibold text-gray-600 mb-3">Compras mensuales 2023 – 2025 (millones $)</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={comprasData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={fmt} tick={{ fontSize: 10 }} width={55} />
              <Tooltip content={<TooltipCompras />} />
              <Legend />
              <Line type="monotone" dataKey="c2025" name="2025" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="c2024" name="2024" stroke="#6b7280" strokeWidth={1.5} dot={{ r: 2 }} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="c2023" name="2023" stroke="#d1d5db" strokeWidth={1.5} dot={{ r: 2 }} strokeDasharray="2 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <Bullet color="#f59e0b" items={[
          'Aumento del 51% en producción impulsó el crecimiento de compras',
          'Crecimiento de demanda de clientes estratégicos: D1, ARA, Frisby',
          'Evaluación de 36 proveedores; visitas conjuntas con Calidad para proveedores HACCP',
          'Avance en la aplicación de la matriz Kraljic',
          'Aumento en volumen y costo del inventario por repuestos importados',
        ]} />
      </Section>
    </div>
  );
}

function SeccionBienestar() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-5 border border-pink-200">
        <h2 className="text-lg font-bold text-pink-900 mb-1">3. Bienestar Animal — 2025</h2>
      </div>
      <Section icon={Heart} title="Bienestar Animal" color="#ec4899" defaultOpen={true}>
        <KpiRow items={[
          { label: 'Pollo mal sangrado', value: '–63,3%', sub: '2025 vs 2024 (229→92 prom.)', color: '#10b981', trend: 'down', upIsGood: false, tooltip: 'El promedio mensual de pollos mal sangrados bajó de 229 unidades en 2024 a 92 en 2025, gracias a mejoras en insensibilizado y capacitación.' },
          { label: 'Aves mal aturdidas', value: '–8,21%', sub: 'Mejora sostenida en planta', color: '#10b981', trend: 'down', upIsGood: false, tooltip: 'La reducción del 8,21% en aves mal aturdidas refleja el impacto de los ajustes técnicos en el proceso de insensibilización.' },
          { label: 'Cargue en tubo', value: '100%', sub: 'Migración completa lograda', color: '#3b82f6', trend: 'up', upIsGood: true, tooltip: 'Se completó la migración total al sistema de cargue en tubo, eliminando el método anterior que generaba mayor estrés animal.' },
          { label: 'Transportadores cert.', value: '100%', sub: 'ICA / Mintransporte', color: '#6366f1', trend: 'up', upIsGood: true, tooltip: 'El 100% de los transportadores de aves cuentan con certificación vigente de ICA y Mintransporte, cumpliendo la normativa de bienestar animal.' },
        ]} />
        <div className="pt-2">
          <p className="text-sm font-semibold text-gray-600 mb-3">Pollo mal sangrado 2023 – 2025 (unidades)</p>
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
        </div>
        <Bullet color="#ec4899" items={[
          'Capacitación del personal operativo, supervisores y calidad',
          'Certificación de transportadores (ICA/Mintransporte)',
          'Diseño de mejoras en insensibilizado y sangrado',
          'Implementación del monitoreo de lesiones en granja y planta',
        ]} />
      </Section>
    </div>
  );
}

function SeccionHSEQ() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-5 border border-orange-200">
        <h2 className="text-lg font-bold text-orange-900 mb-1">4. HSEQ — 2025</h2>
      </div>
      <Section icon={AlertTriangle} title="HSEQ" color="#f97316" defaultOpen={true}>
        <KpiRow items={[
          { label: 'Accidentes 2025', value: '112', sub: 'Planta 24% · Posproceso 19%', color: '#ef4444', trend: 'up', upIsGood: false, tooltip: '112 accidentes en el año. Las áreas de mayor concentración son Planta (27), Posproceso (21) y Calidad (17). El riesgo osteomuscular es el principal factor.' },
          { label: 'Capacitaciones', value: '22', sub: '347 asistentes en el año', color: '#f97316', trend: 'up', upIsGood: true, tooltip: 'Se realizaron 22 jornadas de capacitación con 347 asistentes, incluyendo gimnasia laboral para mitigar el riesgo osteomuscular.' },
          { label: 'Agua/ave planta', value: '–5,9%', sub: '11,44 → 10,76 L/ave', color: '#10b981', trend: 'down', upIsGood: false, tooltip: 'El consumo de agua por ave en planta de beneficio bajó de 11,44 L en 2024 a 10,76 L en 2025, una reducción del 5,9% que representa ahorro ambiental y económico.' },
          { label: 'Residuos aprovechables', value: '+24,65%', sub: 'Mejora en gestión ambiental', color: '#10b981', trend: 'up', upIsGood: true, tooltip: 'El volumen de residuos aprovechables creció un 24,65%, indicando mejor separación en la fuente y mayor eficiencia en el programa de gestión ambiental.' },
        ]} />
        <div className="grid md:grid-cols-2 gap-6 pt-2">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-3">Accidentes por área</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                { area: 'Planta', n: 27, fill: '#ef4444' },
                { area: 'Posproceso', n: 21, fill: '#f97316' },
                { area: 'Calidad', n: 17, fill: '#fbbf24' },
                { area: 'Granjas', n: 16, fill: '#84cc16' },
                { area: 'Otros', n: 31, fill: '#94a3b8' },
              ]} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="area" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip content={<TooltipAccidentes />} />
                <Bar dataKey="n" name="Accidentes" radius={[4, 4, 0, 0]}>
                  {[
                    { fill: '#ef4444' }, { fill: '#f97316' }, { fill: '#fbbf24' },
                    { fill: '#84cc16' }, { fill: '#94a3b8' },
                  ].map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-3">Rehabilitación y Reintegro</p>
            <ResponsiveContainer width="100%" height={200}>
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
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-3">Consumo agua planta beneficio (L/ave)</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={aguaPlantaData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="año" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 16]} tick={{ fontSize: 10 }} />
                <Tooltip content={<TooltipAgua unidad="L/ave" meta={11} />} />
                <Bar dataKey="valor" name="L/ave" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 12, fontWeight: 700 }}>
                  {aguaPlantaData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-3">Consumo agua Sede 2 (L/kg)</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={aguaSede2Data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="año" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 6]} tick={{ fontSize: 10 }} />
                <Tooltip content={<TooltipAgua unidad="L/kg" meta={4} />} />
                <Bar dataKey="valor" name="L/kg" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 12, fontWeight: 700 }}>
                  {aguaSede2Data.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <Bullet color="#f97316" items={[
          'Implementación del programa de gimnasia laboral para mitigar riesgo osteomuscular',
          'Reducción del 20,02% en canastillas rotas',
          'Aumento del 29,84% en residuos peligrosos por jornadas extraordinarias (RAEE)',
          '100% cumplimiento en reportes ambientales al DANE, IDEAM y SDA',
          'Avances en concesiones de agua y gestión ante CAR en múltiples granjas',
        ]} />
      </Section>
    </div>
  );
}

function SeccionSGC() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl p-5 border border-sky-200">
        <h2 className="text-lg font-bold text-sky-900 mb-1">5. Sistema de Gestión de Calidad — 2025</h2>
      </div>
      <Section icon={FileCheck} title="Sistema de Gestión de Calidad" color="#0ea5e9" defaultOpen={true}>
        <KpiRow items={[
          { label: 'Auditorías internas', value: '15', sub: 'Procesos auditados en 2025', color: '#0ea5e9', trend: 'up', upIsGood: true, tooltip: 'Se auditaron 15 procesos internamente durante 2025, cubriendo las áreas críticas del sistema de gestión de calidad.' },
          { label: 'Módulos ISOLUCION', value: '3/3', sub: 'Actas, Tareas y Mejora al 100%', color: '#10b981', trend: 'up', upIsGood: true, tooltip: 'Los tres módulos prioritarios de ISOLUCION (Actas, Tareas y Mejora Continua) alcanzaron el 100% de implementación durante 2025.' },
          { label: 'Migración sistema', value: '100%', sub: 'De sistema anterior a ISOLUCION', color: '#6366f1', trend: 'up', upIsGood: true, tooltip: 'La migración completa al sistema ISOLUCION permite centralizar la gestión documental, trazabilidad de acciones y seguimiento de indicadores.' },
          { label: 'CRM unificado', value: 'SIESA', sub: 'Requisitos de clientes integrados', color: '#f59e0b', trend: 'up', upIsGood: true, tooltip: 'La integración del CRM SIESA permite unificar los requisitos de clientes con el sistema de gestión, reduciendo reprocesos y mejorando la respuesta.' },
        ]} />
        <Bullet color="#0ea5e9" items={[
          'Actualización de matrices estratégicas y políticas',
          'Implementación de metodologías de análisis causal',
          'Migración del sistema a ISOLUCION con módulos de Actas, Tareas y Mejora al 100%',
          'Integración del CRM SIESA para unificar requisitos de clientes',
        ]} />
      </Section>
    </div>
  );
}

function SeccionSatisfaccion() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-5 border border-violet-200">
        <h2 className="text-lg font-bold text-violet-900 mb-1">6. Satisfacción del Cliente — 2025</h2>
      </div>
      <Section icon={Star} title="Satisfacción del Cliente, PQRS y Planes de Acción" color="#8b5cf6" defaultOpen={true}>
        <KpiRow items={[
          { label: 'Satisfacción positiva 2025', value: '95,28%', sub: 'Excelente+Bueno (vs 96,75% en 2024)', color: '#8b5cf6', trend: 'down', upIsGood: false, tooltip: 'La satisfacción positiva (Excelente+Bueno) bajó de 96,75% en 2024 a 95,28% en 2025. Aunque sigue siendo alta, la tendencia requiere atención.' },
          { label: 'PQRs recibidas', value: '259', sub: '–28,45% vs 2024 (362 PQRs)', color: '#10b981', trend: 'down', upIsGood: false, tooltip: 'Las PQRs bajaron de 362 en 2024 a 259 en 2025 (–28,45%), lo que indica mejora en la experiencia del cliente y reducción de fallas en servicio.' },
          { label: 'Planes de acción', value: '154', sub: '+27,92% — mayor gestión correctiva', color: '#f59e0b', trend: 'up', upIsGood: true, tooltip: 'El aumento de planes de acción (+27,92%) refleja mayor madurez del sistema: se detectan y gestionan más oportunidades de mejora de forma proactiva.' },
          { label: 'No Conformidades', value: '+34,78%', sub: 'Alerta: mayor detección interna', color: '#ef4444', trend: 'up', upIsGood: false, tooltip: 'El incremento del 34,78% en no conformidades es una señal de alerta. Puede indicar mayor rigurosidad en la detección, pero también deterioro en la ejecución de procesos.' },
        ]} />
        <div className="grid md:grid-cols-2 gap-6 pt-2">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-3 text-center">Satisfacción 2025 — 1.166 encuestas</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={satisfaccion2025} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                  label={({ pct }) => `${pct}%`} labelLine={false}>
                  {satisfaccion2025.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip content={<TooltipSatisfaccion />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-3 text-center">Satisfacción 2024 — 1.894 encuestas</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={satisfaccion2024} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                  label={({ pct }) => `${pct}%`} labelLine={false}>
                  {satisfaccion2024.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip content={<TooltipSatisfaccion />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Section>
    </div>
  );
}

function SeccionVigia() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-5 border border-teal-200">
        <h2 className="text-lg font-bold text-teal-900 mb-1">7. Vigía de Riesgos — 2025</h2>
      </div>
      <Section icon={Eye} title="Vigía de Riesgos" color="#14b8a6" defaultOpen={true}>
        <KpiRow items={[
          { label: 'Quejas administrativas', value: '0', sub: 'Eliminadas vs años anteriores', color: '#10b981', trend: 'down', upIsGood: false, tooltip: 'El proceso de Vigía logró eliminar completamente las quejas administrativas que existían en años anteriores, garantizando seguridad patrimonial.' },
          { label: 'Control de acceso', value: '100%', sub: 'Carnetización activa todo el año', color: '#14b8a6', trend: 'up', upIsGood: true, tooltip: 'El sistema de carnetización y registro de visitantes operó al 100% durante todo el año, sin brechas en el control de acceso a instalaciones.' },
          { label: 'Activos trazados', value: '3 tipos', sub: 'Tinas, motores, precintos', color: '#6366f1', trend: 'up', upIsGood: true, tooltip: 'Se implementó trazabilidad sobre tres tipos de activos críticos: tinas de proceso, motores y precintos de seguridad, reduciendo pérdidas.' },
          { label: 'Plataformas digitales', value: '2', sub: 'Parqueaderos y correspondencia', color: '#f59e0b', trend: 'up', upIsGood: true, tooltip: 'Se digitalizaron dos procesos operativos: gestión de parqueaderos y control de correspondencia, mejorando trazabilidad y reduciendo tiempos.' },
        ]} />
        <Bullet color="#14b8a6" items={[
          'Protocolos de control de acceso, carnetización y registro de visitantes',
          'Trazabilidad de activos: tinas, motores, precintos de seguridad',
          'Gestión de parqueaderos y correspondencia mediante plataformas digitales',
          'Instalación de alarmas, redes de apoyo empresarial y control de carrotanques para ahorro de agua',
          'Proceso eliminó quejas administrativas y garantizó seguridad patrimonial y trazabilidad operacional',
        ]} />
      </Section>
    </div>
  );
}

// ── Dashboard principal ────────────────────────────────────────────────────

export default function CalidadDashboard({ data, section }) {
  const sectionMap = {
    calidad: <SeccionCalidad />,
    compras: <SeccionCompras />,
    bienestar: <SeccionBienestar />,
    hseq: <SeccionHSEQ />,
    sgc: <SeccionSGC />,
    satisfaccion: <SeccionSatisfaccion />,
    vigia: <SeccionVigia />,
  };

  if (section && sectionMap[section]) {
    return sectionMap[section];
  }

  // Vista completa (sin section prop)
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
        <h2 className="text-lg font-bold text-blue-900 mb-2">Gerencia Estratégica y Mejoramiento Continuo — 2025</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          Durante 2025, la Gerencia Estratégica y de Mejoramiento Continuo consolidó la madurez operativa de la organización mediante la articulación de los procesos de Calidad, Compras, HSEQ, Bienestar Animal y Vigías de Riesgos.
        </p>
      </div>
      <SeccionCalidad />
      <SeccionCompras />
      <SeccionBienestar />
      <SeccionHSEQ />
      <SeccionSGC />
      <SeccionSatisfaccion />
      <SeccionVigia />
    </div>
  );
}
