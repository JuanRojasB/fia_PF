import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, TrendingUp, UserMinus, UserPlus, Clock, DollarSign, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts';

// ── Datos estáticos ────────────────────────────────────────────────────────

const SMVL_DATA = [
  { año: '2024', valor: 1300000, var: '+12,07%', color: '#3b82f6' },
  { año: '2025', valor: 1423500, var: '+9,50%',  color: '#10b981' },
  { año: '2026', valor: 1750905, var: '+23,00%', color: '#f59e0b' },
];

const IMPACTO_SMVL = [
  {
    año: '2024',
    indicadores: 'Inflación 10,15%, PTF –1%, alta proporción de trabajadores afectados',
    impacto: 'Ajuste necesario para recuperar poder adquisitivo, pero con presión sobre costos laborales y baja productividad',
  },
  {
    año: '2025',
    indicadores: 'PTF 0,91%, inflación 5,10%, ocupación 58,7%',
    impacto: 'Crecimiento económico moderado, mejora en empleo, inflación en descenso y menor impacto inflacionario del incremento salarial',
  },
  {
    año: '2026',
    indicadores: 'Inflación 5,35% (enero), PTF 0,91%, aumento SMLV 23,7%',
    impacto: 'Impacto inflacionario inmediato, mayores costos en sectores laborales, desalineación productividad-salario que genera tensiones económicas',
  },
];

// ── Componente colapsable ──────────────────────────────────────────────────

function Section({ num, title, color, icon: Icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black"
            style={{ background: color }}>
            {num}
          </div>
          {Icon && <Icon className="w-5 h-5" style={{ color }} />}
          <span className="font-bold text-gray-800 text-base">{title}</span>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 pb-6 border-t border-gray-100 space-y-4"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

function CompareRow({ label, v2024, v2025, varPct, varAbs, highlight = false }) {
  const up = !varPct.startsWith('-');
  return (
    <div className={`grid grid-cols-4 gap-2 py-2 px-3 rounded-lg text-sm ${highlight ? 'bg-blue-50 font-bold' : 'bg-gray-50'}`}>
      <span className="text-gray-700 col-span-1">{label}</span>
      <span className="text-gray-600 text-center">{v2024}</span>
      <span className="text-gray-900 text-center font-semibold">{v2025}</span>
      <span className={`text-center font-bold ${up ? 'text-green-600' : 'text-red-600'}`}>{varPct}</span>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────

export default function HumanaDashboard() {
  return (
    <div className="space-y-4">

      {/* Intro */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-5 border border-cyan-200">
        <h2 className="text-lg font-bold text-cyan-900 mb-1">Gestión Humana — 2025</h2>
        <p className="text-sm text-gray-700">Análisis consolidado de planta de personal, costos de nómina, horas extras, rotación y causas de desvinculación.</p>
      </div>

      {/* 1. Planta de Personal */}
      <Section num="1" title="Planta de Personal" color="#3b82f6" icon={Users} defaultOpen={true}>
        <p className="text-sm text-gray-700 pt-3 leading-relaxed">
          La planta cerró con <strong>840 personas</strong>, un incremento neto del <strong>1,20% (+10 colaboradores)</strong> respecto a diciembre de 2024. Este crecimiento moderado responde a la necesidad de fortalecer áreas estratégicas y cubrir requerimientos operativos específicos, garantizando la sostenibilidad de la operación.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 text-left rounded-tl-lg">Mes</th>
                <th className="p-3 text-center">No. Personas 2024</th>
                <th className="p-3 text-center">No. Personas 2025</th>
                <th className="p-3 text-center">Var. %</th>
                <th className="p-3 text-center rounded-tr-lg">Var. P</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-blue-50 font-semibold">
                <td className="p-3">Diciembre</td>
                <td className="p-3 text-center">830</td>
                <td className="p-3 text-center">840</td>
                <td className="p-3 text-center text-green-600">1,20%</td>
                <td className="p-3 text-center text-green-600">+10</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* 2. Costo de Nómina */}
      <Section num="2" title="Costo de Nómina" color="#10b981" icon={DollarSign}>
        <p className="text-sm text-gray-700 pt-3 leading-relaxed">
          El costo total de la nómina pasó de <strong>$36.597 millones</strong> en 2024 a <strong>$41.979 millones</strong> en 2025, con una variación del <strong className="text-red-600">14,70% (+$5.382 millones)</strong>. El aumento obedece principalmente a:
        </p>
        <ul className="text-sm text-gray-700 space-y-1 pl-4">
          {[
            'Pago efectivo de horas diurnas antes compensadas con tiempo',
            'Reconocimiento de primas de antigüedad y otros beneficios laborales',
            'Ajustes necesarios para reflejar el costo real de la operación y cumplir obligaciones laborales',
          ].map((t, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
              {t}
            </li>
          ))}
        </ul>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="p-3 text-left rounded-tl-lg">Nómina</th>
                <th className="p-3 text-center">2024</th>
                <th className="p-3 text-center">2025</th>
                <th className="p-3 text-center">Var. %</th>
                <th className="p-3 text-center rounded-tr-lg">Var. $</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-green-50 font-semibold">
                <td className="p-3">Costo de nómina</td>
                <td className="p-3 text-center">$36.597.343.829</td>
                <td className="p-3 text-center">$41.978.924.466</td>
                <td className="p-3 text-center text-red-600">14,70%</td>
                <td className="p-3 text-center text-red-600">$5.381.580.637</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* 3. Impacto Salario Mínimo */}
      <Section num="3" title="Impacto Salario Mínimo" color="#f59e0b" icon={TrendingUp}>
        <p className="text-sm text-gray-700 pt-3">
          Evolución del SMLV en Colombia 2024–2026 y su impacto macroeconómico.
          <br /><span className="text-xs text-gray-500">La PTF (productividad total de los factores) mide la eficiencia global de la economía.</span>
        </p>
        {/* Gráfica SMLV */}
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={SMVL_DATA} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="año" tick={{ fontSize: 13, fontWeight: 700 }} />
            <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 10 }} width={55} />
            <Tooltip formatter={v => [`$${v.toLocaleString('es-CO')}`, 'SMLV']} />
            <Bar dataKey="valor" radius={[6, 6, 0, 0]} label={{ position: 'top', fontSize: 11, fontWeight: 700, formatter: (v) => `$${v.toLocaleString('es-CO')}` }}>
              {SMVL_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {/* Tabla impacto */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-2 text-left w-12">Año</th>
                <th className="p-2 text-left">Indicadores DANE clave</th>
                <th className="p-2 text-left">Impacto macroeconómico</th>
              </tr>
            </thead>
            <tbody>
              {IMPACTO_SMVL.map((r, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="p-2 font-bold text-gray-900">{r.año}</td>
                  <td className="p-2 text-gray-700">{r.indicadores}</td>
                  <td className="p-2 text-gray-700">{r.impacto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 4. Costo de Horas Extras */}
      <Section num="4" title="Costo de Horas Extras" color="#8b5cf6" icon={Clock}>
        <p className="text-sm text-gray-700 pt-3 leading-relaxed">
          Las horas extras crecieron de <strong>127.199</strong> a <strong>130.890</strong> (+2,90%), mientras que el costo aumentó de <strong>$1.065 millones</strong> a <strong>$1.287 millones</strong> (+20,73%). La diferencia se explica por un mayor costo promedio por hora, asociado a la <strong>reforma laboral</strong> y reducción de la jornada.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-purple-600 text-white">
                <th className="p-3 text-left rounded-tl-lg">Descripción</th>
                <th className="p-3 text-center">2024</th>
                <th className="p-3 text-center">2025</th>
                <th className="p-3 text-center rounded-tr-lg">% Variación</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-purple-50">
                <td className="p-3 font-semibold">Horas</td>
                <td className="p-3 text-center">127.199</td>
                <td className="p-3 text-center">130.890</td>
                <td className="p-3 text-center text-orange-600 font-bold">2,90%</td>
              </tr>
              <tr className="bg-white">
                <td className="p-3 font-semibold">Valor</td>
                <td className="p-3 text-center">$1.065.657.115</td>
                <td className="p-3 text-center">$1.286.579.002</td>
                <td className="p-3 text-center text-red-600 font-bold">20,73%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* 5. Rotación de Personal */}
      <Section num="5" title="Rotación de Personal" color="#ef4444" icon={UserMinus}>
        <p className="text-sm text-gray-700 pt-3">
          Los ingresos pasaron de <strong>532</strong> a <strong>564</strong> (+6,02%) y los retiros de <strong>534</strong> a <strong>562</strong> (+5,24%).
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-red-600 text-white">
                <th className="p-3 text-left rounded-tl-lg">Descripción</th>
                <th className="p-3 text-center">2024</th>
                <th className="p-3 text-center">2025</th>
                <th className="p-3 text-center">Variación</th>
                <th className="p-3 text-center rounded-tr-lg">% Variación</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-red-50">
                <td className="p-3 font-semibold flex items-center gap-2"><UserMinus className="w-4 h-4 text-red-500" /> Retiros</td>
                <td className="p-3 text-center">534</td>
                <td className="p-3 text-center">562</td>
                <td className="p-3 text-center text-red-600 font-bold">+28</td>
                <td className="p-3 text-center text-red-600 font-bold">5,24%</td>
              </tr>
              <tr className="bg-white">
                <td className="p-3 font-semibold flex items-center gap-2"><UserPlus className="w-4 h-4 text-green-500" /> Ingresos</td>
                <td className="p-3 text-center">532</td>
                <td className="p-3 text-center">564</td>
                <td className="p-3 text-center text-green-600 font-bold">+32</td>
                <td className="p-3 text-center text-green-600 font-bold">6,02%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* 6. Causas de Desvinculación */}
      <Section num="6" title="Causas de Desvinculación" color="#0891b2" icon={UserMinus}>
        <p className="text-sm text-gray-700 pt-3 leading-relaxed">
          En 2025 se registraron <strong>562 retiros</strong>, de los cuales:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Renuncia voluntaria', n: 471, pct: '84%', color: '#ef4444' },
            { label: 'Terminaciones de contrato', n: 66, pct: '12%', color: '#f97316' },
            { label: 'Período de prueba', n: 15, pct: '3%', color: '#eab308' },
            { label: 'Otras causas', n: 10, pct: '1%', color: '#94a3b8' },
          ].map((k, i) => (
            <div key={i} className="rounded-xl p-4 text-center border-2" style={{ borderColor: k.color, background: `${k.color}10` }}>
              <p className="text-3xl font-black" style={{ color: k.color }}>{k.pct}</p>
              <p className="text-xl font-bold text-gray-800">{k.n}</p>
              <p className="text-xs text-gray-600 mt-1">{k.label}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          El predominio de renuncias voluntarias sugiere revisar estrategias de atracción, satisfacción y retención del talento.
        </p>
        {/* Tabla detalle */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-cyan-700 text-white">
                <th className="p-3 text-left rounded-tl-lg">Motivo de Retiro</th>
                <th className="p-3 text-center rounded-tr-lg">Personas Retiradas</th>
              </tr>
            </thead>
            <tbody>
              {[
                { motivo: 'Mutuo Acuerdo', n: 4 },
                { motivo: 'Renuncia Voluntaria', n: 471, highlight: true },
                { motivo: 'Terminación con Justa Causa', n: 11 },
                { motivo: 'Terminación Contrato SENA', n: 32 },
                { motivo: 'Terminación de Contrato', n: 23 },
                { motivo: 'Terminación en Período de Prueba', n: 15 },
                { motivo: 'Terminación por Muerte del Trabajador', n: 1 },
                { motivo: 'Terminación por Pensión', n: 3 },
                { motivo: 'Terminación sin Justa Causa', n: 2 },
              ].map((r, i) => (
                <tr key={i} className={r.highlight ? 'bg-red-50 font-bold' : i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="p-3 text-gray-800">{r.motivo}</td>
                  <td className="p-3 text-center font-bold text-gray-900">{r.n}</td>
                </tr>
              ))}
              <tr className="bg-cyan-700 text-white font-bold">
                <td className="p-3 rounded-bl-lg">Total general</td>
                <td className="p-3 text-center rounded-br-lg">562</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

    </div>
  );
}
