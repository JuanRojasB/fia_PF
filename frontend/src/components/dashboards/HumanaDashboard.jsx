import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, TrendingUp, UserMinus, UserPlus, Clock, DollarSign, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

// ── Datos estáticos ────────────────────────────────────────────────────────

const SMVL_DATA = [
  { año: '2024', valor: 1300000, color: '#3b82f6' },
  { año: '2025', valor: 1423500, color: '#10b981' },
  { año: '2026', valor: 1750905, color: '#f59e0b' },
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

function Section({ title, color, icon: Icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
            {Icon && <Icon className="w-5 h-5" style={{ color }} />}
          </div>
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

// trend: 'up' | 'down' | 'neutral'
function KpiCard({ label, value, sub, color, trend, upIsGood = true, tooltip }) {
  const [show, setShow] = useState(false);
  const isPositive = (trend === 'up' && upIsGood) || (trend === 'down' && !upIsGood);
  const isNegative = (trend === 'up' && !upIsGood) || (trend === 'down' && upIsGood);
  const arrow = trend === 'up' ? '▲' : trend === 'down' ? '▼' : null;
  const arrowColor = isPositive ? '#10b981' : isNegative ? '#ef4444' : '#94a3b8';
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-1 relative cursor-default"
      style={{ background: `${color}10`, border: `1.5px solid ${color}35` }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <p className="text-xs text-gray-500 leading-tight">{label}</p>
      <div className="flex items-end gap-1.5">
        <p className="text-2xl font-black leading-none" style={{ color }}>{value}</p>
        {arrow && <span className="text-sm font-bold mb-0.5" style={{ color: arrowColor }}>{arrow}</span>}
      </div>
      {sub && <p className="text-xs font-medium" style={{ color: isPositive ? '#10b981' : isNegative ? '#ef4444' : '#6b7280' }}>{sub}</p>}
      {tooltip && show && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl leading-relaxed pointer-events-none"
          style={{ whiteSpace: 'normal' }}>
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
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

// ── Secciones individuales ─────────────────────────────────────────────────

function SeccionNomina() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-5 border border-cyan-200">
        <h2 className="text-lg font-bold text-cyan-900 mb-1">1. Costo de la Nómina — 2025</h2>
        <p className="text-sm text-gray-700">Planta de personal, costo de nómina y horas extras.</p>
      </div>

      {/* Planta de Personal */}
      <Section title="Planta de Personal" color="#3b82f6" icon={Users} defaultOpen={true}>
        <KpiRow items={[
          { label: 'Planta dic. 2025', value: '840', sub: '+10 vs dic. 2024 (830)', color: '#3b82f6', trend: 'up', upIsGood: true, tooltip: 'La planta cerró diciembre con 840 colaboradores, 10 más que en diciembre de 2024. El crecimiento se concentró en áreas estratégicas y operativas.' },
          { label: 'Crecimiento neto', value: '+1,20%', sub: 'Crecimiento moderado y sostenible', color: '#10b981', trend: 'up', upIsGood: true, tooltip: 'Un crecimiento del 1,20% es moderado y sostenible. Indica que la empresa no está sobredimensionando su planta frente al crecimiento productivo.' },
          { label: 'Costo por persona/mes', value: '$4,17M', sub: '$41.979M ÷ 840 ÷ 12', color: '#6366f1', trend: 'up', upIsGood: false, tooltip: 'El costo promedio mensual por colaborador es de $4,17M, calculado sobre el costo total de nómina 2025 dividido entre la planta y los 12 meses.' },
          { label: 'Costo nómina/planta', value: '+13,35%', sub: 'Nómina creció más que la planta', color: '#ef4444', trend: 'up', upIsGood: false, tooltip: 'La nómina creció 14,70% mientras la planta solo creció 1,20%. La diferencia de 13,5pp refleja el impacto de la reforma laboral y reconocimiento de beneficios.' },
        ]} />
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

      {/* Costo de Nómina */}
      <Section title="Costo de Nómina" color="#10b981" icon={DollarSign}>
        <KpiRow items={[
          { label: 'Costo nómina 2025', value: '$41.979M', sub: '+$5.382M vs 2024', color: '#10b981', trend: 'up', upIsGood: false, tooltip: 'El costo total de nómina pasó de $36.597M en 2024 a $41.979M en 2025. El incremento de $5.382M equivale al 14,70% de crecimiento anual.' },
          { label: 'Variación anual', value: '+14,70%', sub: 'Supera inflación 2025 (5,10%)', color: '#ef4444', trend: 'up', upIsGood: false, tooltip: 'El crecimiento del 14,70% en nómina casi triplica la inflación del 5,10% en 2025, generando un incremento real del costo laboral del 9,6%.' },
          { label: 'Incremento real', value: '+9,6pp', sub: 'Por encima de la inflación', color: '#f97316', trend: 'up', upIsGood: false, tooltip: 'El incremento real (descontando inflación) es de 9,6 puntos porcentuales. Esto se explica por el pago de horas diurnas y primas de antigüedad antes no reconocidas.' },
          { label: 'Costo adicional', value: '$5.382M', sub: 'Horas diurnas + primas antigüedad', color: '#6b7280', trend: 'neutral', tooltip: 'Los $5.382M adicionales se originan principalmente en: pago efectivo de horas diurnas antes compensadas con tiempo libre y reconocimiento de primas de antigüedad.' },
        ]} />
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

      {/* Costo de Horas Extras */}
      <Section title="Costo de Horas Extras" color="#8b5cf6" icon={Clock}>
        <KpiRow items={[
          { label: 'Horas extras 2025', value: '130.890', sub: '+3.691 horas vs 2024', color: '#8b5cf6', trend: 'up', upIsGood: false, tooltip: 'Las horas extras aumentaron de 127.199 en 2024 a 130.890 en 2025 (+3.691 horas). El volumen creció moderadamente, pero el costo lo hizo mucho más.' },
          { label: 'Crecimiento horas', value: '+2,90%', sub: 'Volumen moderado', color: '#6b7280', trend: 'up', upIsGood: false, tooltip: 'El volumen de horas extras solo creció 2,90%, pero el costo creció 20,73%. La diferencia de 17,83pp se explica por el mayor valor de la hora extra tras la reforma laboral.' },
          { label: 'Costo total 2025', value: '$1.287M', sub: '+$221M vs 2024', color: '#ef4444', trend: 'up', upIsGood: false, tooltip: 'El costo de horas extras pasó de $1.066M a $1.287M (+$221M). Este incremento desproporcionado frente al volumen es la principal señal de alerta.' },
          { label: 'Costo/hora promedio', value: '+17,32%', sub: 'Reforma laboral + jornada reducida', color: '#dc2626', trend: 'up', upIsGood: false, tooltip: 'El costo promedio por hora extra aumentó un 17,32% (calculado: +20,73% costo / +2,90% horas). La reforma laboral y la reducción de jornada encarecen cada hora adicional.' },
        ]} />
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
    </div>
  );
}

function SeccionRotacion() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-5 border border-red-200">
        <h2 className="text-lg font-bold text-red-900 mb-1">2. Rotación de Personal — 2025</h2>
        <p className="text-sm text-gray-700">Ingresos y retiros de personal durante el año.</p>
      </div>
      <Section title="Rotación de Personal" color="#ef4444" icon={UserMinus} defaultOpen={true}>
        <KpiRow items={[
          { label: 'Tasa de retiros 2025', value: '66,9%', sub: '562 retiros ÷ 840 planta', color: '#ef4444', trend: 'up', upIsGood: false, tooltip: 'La tasa de rotación es del 66,9% (562 retiros sobre 840 personas). Una tasa superior al 30% anual es considerada alta en la industria y genera costos de reemplazo significativos.' },
          { label: 'Retiros vs 2024', value: '+5,24%', sub: '534 → 562 (+28 personas)', color: '#f97316', trend: 'up', upIsGood: false, tooltip: 'Los retiros aumentaron de 534 en 2024 a 562 en 2025, un incremento de 28 personas (+5,24%). La tendencia al alza requiere intervención en retención.' },
          { label: 'Ingresos vs 2024', value: '+6,02%', sub: '532 → 564 (+32 personas)', color: '#10b981', trend: 'up', upIsGood: true, tooltip: 'Los ingresos crecieron de 532 a 564 (+32 personas, +6,02%), superando ligeramente los retiros. Esto permitió el crecimiento neto de la planta.' },
          { label: 'Balance neto', value: '+4', sub: 'Ingresos superan retiros en 4', color: '#3b82f6', trend: 'up', upIsGood: true, tooltip: 'El balance neto de 2025 es +4 personas (564 ingresos – 562 retiros + ajustes). Aunque positivo, el alto volumen de rotación genera costos de selección y capacitación.' },
        ]} />
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
                <td className="p-3 font-semibold">
                  <span className="flex items-center gap-2"><UserMinus className="w-4 h-4 text-red-500" /> Retiros</span>
                </td>
                <td className="p-3 text-center">534</td>
                <td className="p-3 text-center">562</td>
                <td className="p-3 text-center text-red-600 font-bold">+28</td>
                <td className="p-3 text-center text-red-600 font-bold">5,24%</td>
              </tr>
              <tr className="bg-white">
                <td className="p-3 font-semibold">
                  <span className="flex items-center gap-2"><UserPlus className="w-4 h-4 text-green-500" /> Ingresos</span>
                </td>
                <td className="p-3 text-center">532</td>
                <td className="p-3 text-center">564</td>
                <td className="p-3 text-center text-green-600 font-bold">+32</td>
                <td className="p-3 text-center text-green-600 font-bold">6,02%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

function SeccionCausas() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl p-5 border border-cyan-200">
        <h2 className="text-lg font-bold text-cyan-900 mb-1">3. Causas de Desvinculación — 2025</h2>
        <p className="text-sm text-gray-700">Análisis de los 562 retiros registrados en 2025.</p>
      </div>
      <Section title="Causas de Desvinculación" color="#0891b2" icon={UserMinus} defaultOpen={true}>
        <KpiRow items={[
          { label: 'Renuncia voluntaria', value: '84%', sub: '471 de 562 retiros — señal de alerta', color: '#ef4444', trend: 'up', upIsGood: false, tooltip: '471 de los 562 retiros (84%) fueron renuncias voluntarias. Este porcentaje tan alto sugiere problemas de clima laboral, compensación o expectativas no cumplidas.' },
          { label: 'Terminaciones contrato', value: '12%', sub: '66 personas (SENA + causa)', color: '#f97316', trend: 'neutral', tooltip: '66 retiros por terminación de contrato: 32 contratos SENA, 23 terminaciones regulares y 11 con justa causa. Representa el 12% del total.' },
          { label: 'Período de prueba', value: '3%', sub: '15 personas — revisar selección', color: '#eab308', trend: 'up', upIsGood: false, tooltip: '15 personas (3%) no superaron el período de prueba. Aunque es un porcentaje bajo, indica oportunidades de mejora en el proceso de selección y perfilamiento.' },
          { label: 'Causas marginales', value: '1%', sub: 'Pensión, fallecimiento, mutuo acuerdo', color: '#94a3b8', trend: 'neutral', tooltip: 'El 1% restante corresponde a causas no controlables: 3 pensiones, 1 fallecimiento, 4 mutuos acuerdos y 2 terminaciones sin justa causa.' },
        ]} />
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

function SeccionSMLV() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-200">
        <h2 className="text-lg font-bold text-amber-900 mb-1">4. Impacto Salario Mínimo — 2025</h2>
        <p className="text-sm text-gray-700">Evolución del SMLV en Colombia 2024–2026 y su impacto macroeconómico.</p>
      </div>
      <Section title="Impacto Salario Mínimo" color="#f59e0b" icon={TrendingUp} defaultOpen={true}>
        <KpiRow items={[
          { label: 'SMLV 2026', value: '$1.750.905', sub: '+23,0% vs 2025 — mayor alza reciente', color: '#ef4444', trend: 'up', upIsGood: false, tooltip: 'El SMLV 2026 de $1.750.905 representa el mayor incremento porcentual reciente (+23%). Para Pollo Fiesta, esto impacta directamente el costo de nómina del año siguiente.' },
          { label: 'SMLV 2025', value: '$1.423.500', sub: '+9,5% vs 2024', color: '#f59e0b', trend: 'up', upIsGood: false, tooltip: 'El SMLV 2025 fue de $1.423.500, un incremento del 9,5% sobre los $1.300.000 de 2024. Este ajuste contribuyó al aumento del 14,70% en el costo de nómina.' },
          { label: 'Brecha SMLV vs inflación', value: '+17,65pp', sub: '2026: SMLV 23% vs inflación 5,35%', color: '#dc2626', trend: 'up', upIsGood: false, tooltip: 'En 2026, el SMLV sube 23% mientras la inflación es del 5,35%. La brecha de 17,65pp genera presión sobre los costos laborales muy por encima del crecimiento económico real.' },
          { label: 'PTF 2025', value: '0,91%', sub: 'Productividad por debajo del alza salarial', color: '#6b7280', trend: 'neutral', tooltip: 'La Productividad Total de los Factores (PTF) fue del 0,91% en 2025, muy por debajo del incremento salarial del 9,5%. Esto indica que los salarios crecen más rápido que la productividad.' },
        ]} />
        <p className="text-sm text-gray-500 pt-2">La PTF (productividad total de los factores) mide la eficiencia global de la economía.</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={SMVL_DATA} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="año" tick={{ fontSize: 13, fontWeight: 700 }} />
            <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} width={55} />
            <Tooltip formatter={v => [`$${v.toLocaleString('es-CO')}`, 'SMLV']} />
            <Bar dataKey="valor" radius={[6, 6, 0, 0]} label={{ position: 'top', fontSize: 11, fontWeight: 700, formatter: (v) => `$${v.toLocaleString('es-CO')}` }}>
              {SMVL_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
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
    </div>
  );
}

// ── Dashboard principal ────────────────────────────────────────────────────

export default function HumanaDashboard({ data, section }) {
  const sectionMap = {
    nomina: <SeccionNomina />,
    rotacion: <SeccionRotacion />,
    causas: <SeccionCausas />,
    smlv: <SeccionSMLV />,
  };

  if (section && sectionMap[section]) {
    return sectionMap[section];
  }

  // Vista completa
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-5 border border-cyan-200">
        <h2 className="text-lg font-bold text-cyan-900 mb-1">Gestión Humana — 2025</h2>
        <p className="text-sm text-gray-700">Análisis consolidado de planta de personal, costos de nómina, horas extras, rotación y causas de desvinculación.</p>
      </div>
      <SeccionNomina />
      <SeccionRotacion />
      <SeccionCausas />
      <SeccionSMLV />
    </div>
  );
}
