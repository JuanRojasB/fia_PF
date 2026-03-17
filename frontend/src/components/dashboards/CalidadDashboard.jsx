import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, ShoppingCart, Heart, Leaf, FileCheck, Star, Eye,
  ChevronDown, ChevronUp, TrendingDown, TrendingUp, AlertTriangle, CheckCircle
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
  { mes: 'Ene',  p2023: 134, p2024: 229, p2025: 92  },
  { mes: 'Feb',  p2023: 217, p2024: 419, p2025: 106 },
  { mes: 'Mar',  p2023: 282, p2024: 529, p2025: 170 },
  { mes: 'Abr',  p2023: 247, p2024: 614, p2025: 169 },
  { mes: 'May',  p2023: 243, p2024: 488, p2025: 183 },
  { mes: 'Jun',  p2023: 297, p2024: 556, p2025: 143 },
  { mes: 'Jul',  p2023: 249, p2024: 310, p2025: 209 },
  { mes: 'Ago',  p2023: 179, p2024: 370, p2025: 129 },
  { mes: 'Sep',  p2023: 304, p2024: 356, p2025: 115 },
  { mes: 'Oct',  p2023: 549, p2024: 394, p2025: 140 },
  { mes: 'Nov',  p2023: 105, p2024: 315, p2025: 176 },
  { mes: 'Dic',  p2023: 545, p2024: 289, p2025: 176 },
];

const rehabilitacionData = [
  { categoria: 'Gestantes',          valor: 8,  color: '#f9a8d4' },
  { categoria: 'Accidente Laboral',  valor: 14, color: '#fbbf24' },
  { categoria: 'Enfermedad Laboral', valor: 8,  color: '#4ade80' },
  { categoria: 'Enfermedad Común',   valor: 19, color: '#60a5fa' },
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
  { name: 'Bueno',     value: 561, pct: 48.11, color: '#38bdf8' },
  { name: 'Regular',   value: 4,   pct: 0.35,  color: '#7c3aed' },
  { name: 'Malo',      value: 51,  pct: 4.37,  color: '#f97316' },
];

const satisfaccion2024 = [
  { name: 'Excelente', value: 1100, pct: 58.21, color: '#1e3a8a' },
  { name: 'Bueno',     value: 730,  pct: 38.54, color: '#38bdf8' },
  { name: 'Regular',   value: 14,   pct: 0.70,  color: '#7c3aed' },
  { name: 'Malo',      value: 50,   pct: 2.55,  color: '#f97316' },
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

function KpiRow({ items }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
      {items.map((k, i) => (
        <div key={i} className="rounded-lg p-3 text-center" style={{ background: `${k.color}15`, border: `1px solid ${k.color}40` }}>
          <p className="text-xs text-gray-500 mb-1">{k.label}</p>
          <p className="text-xl font-black" style={{ color: k.color }}>{k.value}</p>
          {k.sub && <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>}
        </div>
      ))}
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

const fmt = (v) => `$${(v / 1e6).toFixed(0)}M`;

// ── Dashboard principal ────────────────────────────────────────────────────

export default function CalidadDashboard() {
  return (
    <div className="space-y-4">

      {/* Intro */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
        <h2 className="text-lg font-bold text-blue-900 mb-2">Gerencia Estratégica y Mejoramiento Continuo — 2025</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          Durante 2025, la Gerencia Estratégica y de Mejoramiento Continuo consolidó la madurez operativa de la organización mediante la articulación de los procesos de Calidad, Compras, HSEQ, Bienestar Animal y Vigías de Riesgos. El año estuvo marcado por una transición hacia un enfoque más preventivo, digital y orientado al cumplimiento normativo (ISO 9001:2026, HACCP), fortaleciendo el control interno, reduciendo desviaciones operativas y mejorando la capacidad de respuesta ante variables regulatorias y productivas.
        </p>
      </div>

      {/* 1. Aseguramiento de Calidad */}
      <Section icon={Shield} title="1. Aseguramiento de Calidad" color="#6366f1" defaultOpen={true}>
        <KpiRow items={[
          { label: 'Norma base', value: 'HACCP', color: '#6366f1' },
          { label: 'Ente regulador', value: 'INVIMA', color: '#8b5cf6' },
          { label: 'Nuevos indicadores', value: 'Jun 2025', color: '#a855f7', sub: 'desde junio' },
          { label: 'Decisión Q4', value: 'Cambio proveedor dosificación', color: '#ef4444', sub: 'picos críticos' },
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
              'Variabilidad y pérdida de control en el segundo semestre (dosificación, desplumado, evisceración)',
              'Picos críticos en Q4 → cambio de sistema/proveedor de dosificación',
              'Incumplimientos reiterados por limitaciones de infraestructura y calibración de máquinas',
            ]} />
          </div>
        </div>
      </Section>

      {/* 2. Compras */}
      <Section icon={ShoppingCart} title="2. Compras" color="#f59e0b">
        <KpiRow items={[
          { label: 'Total compras 2025', value: '$8.927M', color: '#f59e0b' },
          { label: 'Total compras 2024', value: '$8.141M', color: '#6b7280' },
          { label: 'Var 2024→2025', value: '+9,66%', color: '#10b981' },
          { label: 'Consumo / compra', value: '73,42%', color: '#3b82f6', sub: 'promedio anual' },
        ]} />
        <div className="pt-2">
          <p className="text-sm font-semibold text-gray-600 mb-3">Compras mensuales 2023 – 2025 (millones $)</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={comprasData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={fmt} tick={{ fontSize: 10 }} width={55} />
              <Tooltip formatter={(v) => [`$${v.toLocaleString('es-CO')}`, '']} />
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

      {/* 3. Bienestar Animal */}
      <Section icon={Heart} title="3. Bienestar Animal" color="#ec4899">
        <KpiRow items={[
          { label: 'Pollo mal sangrado', value: '–63,3%', color: '#10b981', sub: 'vs 2024' },
          { label: 'Aves mal aturdidas', value: '–8,21%', color: '#10b981', sub: 'vs 2024' },
          { label: 'Cargue en tubo', value: '100%', color: '#3b82f6', sub: 'migración completa' },
          { label: 'Estándar', value: 'ISO', color: '#6366f1', sub: 'Programa consolidado' },
        ]} />
        <div className="pt-2">
          <p className="text-sm font-semibold text-gray-600 mb-3">Pollo mal sangrado 2023 – 2025 (unidades)</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={polloMalSangradoData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
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

      {/* 4. HSEQ */}
      <Section icon={AlertTriangle} title="4. HSEQ" color="#f97316">
        <KpiRow items={[
          { label: 'Accidentes 2025', value: '112', color: '#ef4444' },
          { label: 'Capacitaciones', value: '22', color: '#f97316', sub: '347 asistentes' },
          { label: 'Agua/ave –', value: '–5,9%', color: '#10b981', sub: 'vs 2024' },
          { label: 'Residuos aprovechables', value: '+24,65%', color: '#10b981', sub: 'vs 2024' },
        ]} />

        {/* Accidentes por área */}
        <div className="grid md:grid-cols-2 gap-6 pt-2">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-3">Accidentes por área</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                { area: 'Planta',      n: 27, fill: '#ef4444' },
                { area: 'Posproceso', n: 21, fill: '#f97316' },
                { area: 'Calidad',    n: 17, fill: '#fbbf24' },
                { area: 'Granjas',    n: 16, fill: '#84cc16' },
                { area: 'Otros',      n: 31, fill: '#94a3b8' },
              ]} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="area" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="n" name="Accidentes" radius={[4, 4, 0, 0]}>
                  {[
                    { area: 'Planta', n: 27, fill: '#ef4444' },
                    { area: 'Posproceso', n: 21, fill: '#f97316' },
                    { area: 'Calidad', n: 17, fill: '#fbbf24' },
                    { area: 'Granjas', n: 16, fill: '#84cc16' },
                    { area: 'Otros', n: 31, fill: '#94a3b8' },
                  ].map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Rehabilitación */}
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-3">Rehabilitación y Reintegro</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={rehabilitacionData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="categoria" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="valor" name="Personas" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 11, fontWeight: 700 }}>
                  {rehabilitacionData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agua */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-3">Consumo agua planta beneficio (L/ave)</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={aguaPlantaData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="año" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 16]} tick={{ fontSize: 10 }} />
                <Tooltip />
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
                <Tooltip />
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

      {/* 5. Sistema de Gestión de Calidad */}
      <Section icon={FileCheck} title="5. Sistema de Gestión de Calidad" color="#0ea5e9">
        <KpiRow items={[
          { label: 'Auditorías internas', value: '15', color: '#0ea5e9', sub: 'procesos auditados' },
          { label: 'Sistema migrado', value: 'ISOLUCION', color: '#6366f1' },
          { label: 'Módulos al 100%', value: '3', color: '#10b981', sub: 'Actas, Tareas, Mejora' },
          { label: 'CRM integrado', value: 'SIESA', color: '#f59e0b' },
        ]} />
        <Bullet color="#0ea5e9" items={[
          'Actualización de matrices estratégicas y políticas',
          'Implementación de metodologías de análisis causal',
          'Migración del sistema a ISOLUCION con módulos de Actas, Tareas y Mejora al 100%',
          'Integración del CRM SIESA para unificar requisitos de clientes',
        ]} />
      </Section>

      {/* 6. Satisfacción del Cliente, PQRS y Planes de Acción */}
      <Section icon={Star} title="6. Satisfacción del Cliente, PQRS y Planes de Acción" color="#8b5cf6">
        <KpiRow items={[
          { label: 'Encuestas 2025', value: '1.166', color: '#8b5cf6', sub: '–38% vs 2024' },
          { label: 'Planes de acción', value: '154', color: '#f59e0b', sub: '+27,92%' },
          { label: 'PQRs 2025', value: '259', color: '#10b981', sub: '–28,45%' },
          { label: 'No Conformidades', value: '+34,78%', color: '#ef4444' },
        ]} />
        <div className="grid md:grid-cols-2 gap-6 pt-2">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-3 text-center">Satisfacción 2025 — 1.166 encuestas</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={satisfaccion2025} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                  label={({ name, pct }) => `${pct}%`} labelLine={false}>
                  {satisfaccion2025.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-3 text-center">Satisfacción 2024 — 1.894 encuestas</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={satisfaccion2024} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                  label={({ name, pct }) => `${pct}%`} labelLine={false}>
                  {satisfaccion2024.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Section>

      {/* 7. Vigía de Riesgos */}
      <Section icon={Eye} title="7. Vigía de Riesgos" color="#14b8a6">
        <KpiRow items={[
          { label: 'Quejas administrativas', value: '0', color: '#10b981', sub: 'eliminadas' },
          { label: 'Control acceso', value: '✓', color: '#14b8a6', sub: 'Carnetización activa' },
          { label: 'Trazabilidad activos', value: '✓', color: '#6366f1', sub: 'Tinas, motores, precintos' },
          { label: 'Plataformas digitales', value: '✓', color: '#f59e0b', sub: 'Parqueaderos y correspondencia' },
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
