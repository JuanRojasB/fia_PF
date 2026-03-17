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

// KPI estándar: valor2025 grande, border-t, 2024/2025/Var/Dif
// varPct: número (ej: 11.37), varAbs: string (ej: '+$4.382.605.477'), positiveIsGood: bool
function StdKpi({ title, value2025, value2024, varPct, varAbs, positiveIsGood = true, icon: Icon, borderColor = 'border-blue-400' }) {
  const pct = parseFloat(varPct);
  const isGood = positiveIsGood ? pct >= 0 : pct <= 0;
  const varColor = isGood ? 'text-green-600' : 'text-red-600';
  return (
    <div className={`bg-white/95 rounded-xl p-5 border-4 ${borderColor} shadow-sm`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-gray-600 text-xs font-medium uppercase tracking-wide">{title}</span>
        {Icon && <Icon className="w-5 h-5 text-gray-400" />}
      </div>
      <div className="text-xl font-bold text-gray-900 leading-tight break-all">{value2025}</div>
      <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
        <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{value2024}</span></div>
        <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{value2025}</span></div>
        <div className={`text-sm font-bold ${varColor}`}>Var: {pct >= 0 ? '+' : ''}{varPct}%</div>
        {varAbs && <div className={`text-xs font-semibold ${varColor}`}>Dif: {varAbs}</div>}
      </div>
    </div>
  );
}

// ── Secciones individuales ─────────────────────────────────────────────────

function SeccionNomina() {
  return (
    <div className="space-y-4">

      {/* Planta de Personal */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#3b82f620' }}>
            <Users className="w-5 h-5" style={{ color: '#3b82f6' }} />
          </div>
          <span className="font-bold text-gray-800 text-base">Planta de Personal</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <StdKpi title="Planta dic. 2025" value2025="840 personas" value2024="830 personas" varPct="1.20" varAbs="+10 colaboradores" positiveIsGood={true} icon={Users} borderColor="border-blue-400" />
          <StdKpi title="Costo de Nómina" value2025="$42.936.865.943" value2024="$38.554.260.466" varPct="11.37" varAbs="+$4.382.605.477" positiveIsGood={false} icon={DollarSign} borderColor="border-green-400" />
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          La planta cerró con <strong>840 personas</strong>, un incremento neto del <strong>1,20% (+10 colaboradores)</strong> respecto a diciembre de 2024. Este crecimiento moderado responde a la necesidad de fortalecer áreas estratégicas y cubrir requerimientos operativos específicos, garantizando la sostenibilidad de la operación.
        </p>
        <Section title="Ver tabla de planta" color="#3b82f6" icon={Users}>
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
      </div>

      {/* Costo de Nómina */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#10b98120' }}>
            <DollarSign className="w-5 h-5" style={{ color: '#10b981' }} />
          </div>
          <span className="font-bold text-gray-800 text-base">Costo de Nómina</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StdKpi title="Costo nómina 2025" value2025="$42.936.865.943" value2024="$38.554.260.466" varPct="11.37" varAbs="+$4.382.605.477" positiveIsGood={false} icon={DollarSign} borderColor="border-green-400" />
          <StdKpi title="Variación vs inflación" value2025="+11,37%" value2024="Inflación 5,10%" varPct="11.37" varAbs="+6,27pp por encima de inflación" positiveIsGood={false} icon={TrendingUp} borderColor="border-red-400" />
          <StdKpi title="Costo adicional" value2025="$4.382.605.477" value2024="—" varPct="0" varAbs="Horas diurnas + primas antigüedad" positiveIsGood={false} icon={DollarSign} borderColor="border-orange-400" />
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          El costo total de la nómina pasó de <strong>$38.554 millones</strong> en 2024 a <strong>$42.937 millones</strong> en 2025, con una variación del <strong className="text-red-600">11,37% (+$4.383 millones)</strong>. El aumento obedece principalmente a:
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
        <Section title="Ver tabla de nómina" color="#10b981" icon={DollarSign}>
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
                  <td className="p-3 text-center">$38.554.260.466</td>
                  <td className="p-3 text-center">$42.936.865.943</td>
                  <td className="p-3 text-center text-red-600">11,37%</td>
                  <td className="p-3 text-center text-red-600">$4.382.605.477</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>
      </div>

      {/* Costo de Horas Extras */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#8b5cf620' }}>
            <Clock className="w-5 h-5" style={{ color: '#8b5cf6' }} />
          </div>
          <span className="font-bold text-gray-800 text-base">Costo de Horas Extras</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StdKpi title="Horas extras 2025" value2025="130.890" value2024="127.199" varPct="2.90" varAbs="+3.691 horas" positiveIsGood={false} icon={Clock} borderColor="border-purple-400" />
          <StdKpi title="Crecimiento horas" value2025="+2,90%" value2024="127.199 horas" varPct="2.90" varAbs="+3.691 horas" positiveIsGood={false} icon={TrendingUp} borderColor="border-gray-400" />
          <StdKpi title="Costo total 2025" value2025="$1.286.579.002" value2024="$1.065.657.115" varPct="20.73" varAbs="+$220.921.887" positiveIsGood={false} icon={DollarSign} borderColor="border-red-400" />
          <StdKpi title="Costo/hora promedio" value2025="+17,32%" value2024="Reforma laboral" varPct="17.32" varAbs="Jornada reducida" positiveIsGood={false} icon={TrendingUp} borderColor="border-red-600" />
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          Las horas extras crecieron de <strong>127.199</strong> a <strong>130.890</strong> (+2,90%), mientras que el costo aumentó de <strong>$1.065.657.115</strong> a <strong>$1.286.579.002</strong> (+20,73%). La diferencia se explica por un mayor costo promedio por hora, asociado a la <strong>reforma laboral</strong> y reducción de la jornada.
        </p>
        <Section title="Ver tabla de horas extras" color="#8b5cf6" icon={Clock}>
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

    </div>
  );
}

function SeccionRotacion() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#ef444420' }}>
            <UserMinus className="w-5 h-5" style={{ color: '#ef4444' }} />
          </div>
          <span className="font-bold text-gray-800 text-base">Rotación de Personal</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StdKpi title="Tasa de retiros 2025" value2025="66,9%" value2024="—" varPct="5.24" varAbs="562 retiros ÷ 840 planta" positiveIsGood={false} icon={UserMinus} borderColor="border-red-400" />
          <StdKpi title="Retiros" value2025="562" value2024="534" varPct="5.24" varAbs="+28 personas" positiveIsGood={false} icon={UserMinus} borderColor="border-orange-400" />
          <StdKpi title="Ingresos" value2025="564" value2024="532" varPct="6.02" varAbs="+32 personas" positiveIsGood={true} icon={UserPlus} borderColor="border-green-400" />
          <StdKpi title="Balance neto" value2025="+4" value2024="—" varPct="0" varAbs="Ingresos superan retiros en 4" positiveIsGood={true} icon={TrendingUp} borderColor="border-blue-400" />
        </div>
        <p className="text-sm text-gray-700">
          Los ingresos pasaron de <strong>532</strong> a <strong>564</strong> (+6,02%) y los retiros de <strong>534</strong> a <strong>562</strong> (+5,24%).
        </p>
        <Section title="Ver tabla de rotación" color="#ef4444" icon={UserMinus}>
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
    </div>
  );
}

function SeccionCausas() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#0891b220' }}>
            <UserMinus className="w-5 h-5" style={{ color: '#0891b2' }} />
          </div>
          <span className="font-bold text-gray-800 text-base">Causas de Desvinculación</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Renuncia voluntaria', n: 471, pct: '84%', color: '#ef4444', sub: 'Principal causa de retiro' },
            { label: 'Terminaciones contrato', n: 66, pct: '12%', color: '#f97316', sub: 'SENA + justa/sin causa' },
            { label: 'Período de prueba', n: 15, pct: '3%', color: '#eab308', sub: 'Revisar proceso de selección' },
            { label: 'Otras causas', n: 10, pct: '1%', color: '#94a3b8', sub: 'Pensión, fallecimiento, mutuo acuerdo' },
          ].map((k, i) => (
            <div key={i} className="rounded-xl p-4 text-center border-2" style={{ borderColor: k.color, background: `${k.color}10` }}>
              <p className="text-3xl font-black" style={{ color: k.color }}>{k.pct}</p>
              <p className="text-2xl font-bold text-gray-800">{k.n} <span className="text-sm font-normal text-gray-500">personas</span></p>
              <p className="text-xs font-semibold text-gray-700 mt-1">{k.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{k.sub}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          En 2025 se registraron <strong>562 retiros</strong>. El predominio de renuncias voluntarias sugiere revisar estrategias de atracción, satisfacción y retención del talento.
        </p>
        <Section title="Ver tabla de causas" color="#0891b2" icon={UserMinus}>
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
    </div>
  );
}

function SeccionSMLV() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#f59e0b20' }}>
            <TrendingUp className="w-5 h-5" style={{ color: '#f59e0b' }} />
          </div>
          <span className="font-bold text-gray-800 text-base">Impacto Salario Mínimo</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StdKpi title="SMLV 2026" value2025="$1.750.905" value2024="$1.423.500" varPct="23.00" varAbs="+$327.405" positiveIsGood={false} icon={TrendingUp} borderColor="border-red-400" />
          <StdKpi title="SMLV 2025" value2025="$1.423.500" value2024="$1.300.000" varPct="9.50" varAbs="+$123.500" positiveIsGood={false} icon={TrendingUp} borderColor="border-yellow-400" />
          <StdKpi title="Brecha SMLV vs inflación" value2025="+17,65pp" value2024="—" varPct="17.65" varAbs="2026: SMLV 23% vs inflación 5,35%" positiveIsGood={false} icon={TrendingUp} borderColor="border-red-600" />
          <StdKpi title="PTF 2025" value2025="0,91%" value2024="—" varPct="0.91" varAbs="Productividad por debajo del alza salarial" positiveIsGood={true} icon={TrendingUp} borderColor="border-gray-400" />
        </div>
        <p className="text-sm text-gray-500">La PTF (productividad total de los factores) mide la eficiencia global de la economía.</p>
        <Section title="Ver gráfica y tabla de impacto" color="#f59e0b" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={SMVL_DATA} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="año" tick={{ fontSize: 13, fontWeight: 700 }} />
              <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} width={55} />
              <Tooltip formatter={v => [`${v.toLocaleString('es-CO')}`, 'SMLV']} />
              <Bar dataKey="valor" radius={[6, 6, 0, 0]} label={{ position: 'top', fontSize: 11, fontWeight: 700, formatter: (v) => `${v.toLocaleString('es-CO')}` }}>
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
