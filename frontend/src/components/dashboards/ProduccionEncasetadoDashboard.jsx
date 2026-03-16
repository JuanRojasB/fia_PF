import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ComposedChart, Area, Cell, ReferenceLine, Customized } from 'recharts';
import { Factory, TrendingUp, Calendar, X, Info, Target, AlertCircle, CheckCircle2 } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';

export default function ProduccionEncasetadoDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  console.log('ProduccionEncasetadoDashboard - Datos recibidos:', data);

  if (!data || typeof data !== 'object') {
    return <div className="text-gray-600">No hay datos disponibles</div>;
  }

  const {
    encasetamiento = [],
    encasetamientoAnual = [],
    polloEntregado = [],
    totalesPorAnio = {},
    totales = {}
  } = data;

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Procesar encasetamiento mensual
  const ordenMeses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 
                      'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

  // Datos hardcodeados de la tabla "POLLO ENCASETADO" (imagen de referencia)
  const encasetadoMesesHC = [
    { mes: 'ENERO',      prog2024: 2701500, real2024: 3591329, prog2025: 2709400, real2025: 6034568 },
    { mes: 'FEBRERO',    prog2024: 2529000, real2024: 2487270, prog2025: 2351600, real2025: 2379966 },
    { mes: 'MARZO',      prog2024: 2687200, real2024: 2568054, prog2025: 2640400, real2025: 2682901 },
    { mes: 'ABRIL',      prog2024: 2534000, real2024: 2520730, prog2025: 2649600, real2025: 2632722 },
    { mes: 'MAYO',       prog2024: 2901300, real2024: 2913489, prog2025: 2766400, real2025: 2727348 },
    { mes: 'JUNIO',      prog2024: 2644000, real2024: 2718402, prog2025: 2561200, real2025: 2592636 },
    { mes: 'JULIO',      prog2024: 2648400, real2024: 2565600, prog2025: 2788000, real2025: 2723340 },
    { mes: 'AGOSTO',     prog2024: 2918800, real2024: 2938518, prog2025: 2704800, real2025: 2589881 },
    { mes: 'SEPTIEMBRE', prog2024: 2539500, real2024: 2631600, prog2025: 2664000, real2025: 2681804 },
    { mes: 'OCTUBRE',    prog2024: 3016100, real2024: 2932069, prog2025: 2976800, real2025: 3052385 },
    { mes: 'NOVIEMBRE',  prog2024: 2820600, real2024: 2164644, prog2025: 2760600, real2025: 2330496 },
    { mes: 'DICIEMBRE',  prog2024: 2790000, real2024: 360162,  prog2025: 2676300, real2025: 0       },
  ];

  const encasetadoMap = {};
  ordenMeses.forEach(mes => {
    encasetadoMap[mes] = { mes, prog2024: 0, real2024: 0, prog2025: 0, real2025: 0 };
  });

  // Intentar poblar desde BD; si no hay datos usar hardcoded
  encasetamiento.forEach(d => {
    const mesNum = parseInt(d.mes);
    if (mesNum >= 1 && mesNum <= 12) {
      const mes = ordenMeses[mesNum - 1];
      const prog = parseFloat(d.valor_programado) || 0;
      const real = parseFloat(d.valor_real) || 0;
      if (d.anio === 2024) {
        encasetadoMap[mes].prog2024 = prog;
        encasetadoMap[mes].real2024 = real;
      } else if (d.anio === 2025) {
        encasetadoMap[mes].prog2025 = prog;
        encasetadoMap[mes].real2025 = real;
      }
    }
  });

  // Si la BD no devolvió datos, usar hardcoded
  const bdTieneData = encasetamiento.length > 0;
  const encasetadoMeses = (bdTieneData ? ordenMeses.map(mes => encasetadoMap[mes]) : encasetadoMesesHC)
    .map(d => ({
      ...d,
      cumplPct: d.prog2025 > 0 && d.real2025 > 0 ? parseFloat(((d.real2025 / d.prog2025) * 100).toFixed(1)) : null
    }));

  // Usar totales desde los datos (BD o hardcoded)
  const totalProgramado2024 = encasetadoMeses.reduce((s, m) => s + m.prog2024, 0);
  const totalEncasetado2024 = encasetadoMeses.reduce((s, m) => s + m.real2024, 0);
  const totalProgramado2025 = encasetadoMeses.reduce((s, m) => s + m.prog2025, 0);
  const totalEncasetado2025 = encasetadoMeses.reduce((s, m) => s + m.real2025, 0);

  // Para variaciones usar solo meses con real2025 > 0 (excluir Diciembre sin dato)
  const mesesConReal2025 = encasetadoMeses.filter(m => m.real2025 > 0);
  const totalReal2025ParaVar = mesesConReal2025.reduce((s, m) => s + m.real2025, 0);
  const totalReal2024ParaVar = mesesConReal2025.reduce((s, m) => s + m.real2024, 0);

  const variacionEncasetado = totalReal2024ParaVar > 0
    ? (((totalReal2025ParaVar - totalReal2024ParaVar) / totalReal2024ParaVar) * 100).toFixed(1)
    : 0;
  const cumplimiento2024 = totalProgramado2024 > 0 ? ((totalEncasetado2024 / totalProgramado2024) * 100).toFixed(1) : 0;
  const cumplimiento2025 = totalProgramado2025 > 0 ? ((totalEncasetado2025 / totalProgramado2025) * 100).toFixed(1) : 0;

  // Promedios mensuales (solo meses con datos)
  const promedioMensual2024 = totalEncasetado2024 > 0 ? totalEncasetado2024 / 12 : 0;
  const promedioMensual2025 = mesesConReal2025.length > 0 ? totalReal2025ParaVar / mesesConReal2025.length : 0;

  // Procesar pollo entregado anual
  const polloEntregadoChart = polloEntregado.map(p => ({
    anio: p.anio,
    total: parseInt(p.total) || 0,
    granjas: parseInt(p.real_granjas) || 0,
    comprado: parseInt(p.comprado) || 0
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
    return datos.map((d, i) => ({ ...d, tendencia: parseFloat((intercept + slope * i).toFixed(0)) }));
  };

  const encasetadoConTend = calcTendencia(
    encasetadoMeses.filter(m => m.real2025 > 0),
    'real2025'
  );

  return (
    <div className="space-y-8">


      {/* KPIs Principales - Expandidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Total Pollitos Encasetados 2025',
            `Se encasetaron ${formatNumber(totalEncasetado2025)} pollitos durante el año 2025. Este valor es la suma de todos los pollitos encasetados mes a mes durante el año. El encasetamiento es el proceso de colocar pollitos de un día de edad en los galpones de crianza, marcando el inicio del ciclo productivo de engorde que dura aproximadamente 42-45 días hasta el procesamiento. El valor programado fue de ${formatNumber(totalProgramado2025)} pollitos.`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Encasetamiento Real 2025 vs Programado 2025</span>
            <Factory className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatNumber(totalEncasetado2025)}</div>
          <div className="text-sm text-gray-600 mt-1">Suma anual real</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Programado 2025 (suma anual)</div>
            <div className="text-lg font-semibold text-blue-400">{formatNumber(totalProgramado2025)} pollitos</div>
            <div className={`text-sm font-bold mt-1 ${totalEncasetado2025 >= totalProgramado2025 ? 'text-green-500' : 'text-red-500'}`}>
              {totalEncasetado2025 >= totalProgramado2025 ? '▲' : '▼'} {totalProgramado2025 > 0 ? (((totalEncasetado2025 - totalProgramado2025) / totalProgramado2025) * 100).toFixed(2) : '0.00'}% vs programado
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Dif: {totalEncasetado2025 >= totalProgramado2025 ? '+' : ''}{formatNumber(totalEncasetado2025 - totalProgramado2025)} pollitos
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Total Pollitos Encasetados 2024',
            `Se encasetaron ${formatNumber(totalEncasetado2024)} pollitos durante el año 2024. Este valor es la suma de todos los pollitos encasetados mes a mes durante el año 2024. El encasetamiento es el proceso de colocar pollitos de un día de edad en los galpones de crianza, marcando el inicio del ciclo productivo de engorde. El valor programado fue de ${formatNumber(totalProgramado2024)} pollitos, logrando un cumplimiento del ${cumplimiento2024}%.`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Encasetamiento Real 2024 vs Programado 2024</span>
            <Factory className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatNumber(totalEncasetado2024)}</div>
          <div className="text-sm text-gray-600 mt-1">Suma anual real</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Programado 2024 (suma anual)</div>
            <div className="text-lg font-semibold text-green-400">{formatNumber(totalProgramado2024)} pollitos</div>
            <div className={`text-sm font-bold mt-1 ${totalEncasetado2024 >= totalProgramado2024 ? 'text-green-500' : 'text-red-500'}`}>
              {totalEncasetado2024 >= totalProgramado2024 ? '▲' : '▼'} {totalProgramado2024 > 0 ? (((totalEncasetado2024 - totalProgramado2024) / totalProgramado2024) * 100).toFixed(2) : '0.00'}% vs programado
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Dif: {totalEncasetado2024 >= totalProgramado2024 ? '+' : ''}{formatNumber(totalEncasetado2024 - totalProgramado2024)} pollitos
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Comparación 2025 vs 2024',
            `La variación de ${variacionEncasetado > 0 ? '+' : ''}${variacionEncasetado}% representa la comparación entre 2025 y 2024. Se encasetaron ${formatNumber(totalEncasetado2025)} pollitos en 2025 vs ${formatNumber(totalEncasetado2024)} pollitos en 2024. Fórmula: ((2025 - 2024) / 2024) × 100 = ((${formatNumber(totalEncasetado2025)} - ${formatNumber(totalEncasetado2024)}) / ${formatNumber(totalEncasetado2024)}) × 100 = ${variacionEncasetado}%. La diferencia absoluta es de ${formatNumber(Math.abs(totalEncasetado2025 - totalEncasetado2024))} pollitos ${variacionEncasetado > 0 ? 'más' : 'menos'}. Esta variación refleja ${variacionEncasetado > 0 ? 'un crecimiento' : 'una reducción'} en la capacidad productiva.`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Comparación Encasetamiento Real 2025 vs 2024</span>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{variacionEncasetado > 0 ? '+' : ''}{variacionEncasetado}%</div>
          <div className="text-sm text-gray-600 mt-1">Fórmula: (2025-2024)/2024×100</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Diferencia 2025 - 2024</div>
            <div className={`text-lg font-semibold ${variacionEncasetado > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {variacionEncasetado > 0 ? '+' : ''}{formatNumber(Math.abs(totalEncasetado2025 - totalEncasetado2024))} pollitos
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Promedio Mensual de Encasetamiento 2025',
            `El promedio mensual es de ${formatNumber(promedioMensual2025)} pollitos. Se calcula dividiendo el total anual (${formatNumber(totalEncasetado2025)} pollitos) entre los ${totalesPorAnio[2025]?.meses || 12} meses con datos. Fórmula: ${formatNumber(totalEncasetado2025)} ÷ ${totalesPorAnio[2025]?.meses || 12} = ${formatNumber(promedioMensual2025)} pollitos/mes. Este indicador permite evaluar la consistencia de la operación y planificar recursos (alimento, personal, logística). En 2024 el promedio fue de ${formatNumber(promedioMensual2024)} pollitos/mes.`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Promedio Mensual Encasetamiento 2025 vs 2024</span>
            <Calendar className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatNumber(promedioMensual2025)}</div>
          <div className="text-sm text-gray-600 mt-1">Total anual ÷ meses</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Promedio 2024</div>
            <div className="text-lg font-semibold text-orange-400">{formatNumber(promedioMensual2024)} pollitos/mes</div>
          </div>
        </motion.div>
      </div>

      {/* TABLA COMPARATIVA ENCASETAMIENTO 2025 vs 2024 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 backdrop-blur-xl rounded-xl p-6 border-2 border-blue-500/30"
      >
        <div className="flex items-center gap-3 mb-6">
          <Factory className="w-8 h-8 text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900">COMPARATIVO ENCASETAMIENTO MENSUAL 2025 vs 2024</h2>
        </div>
        
        <CollapsibleTable 
          title="Detalle Mensual de Encasetamiento — Pollo Encasetado 2024 vs 2025"
          defaultOpen={false}
          totalRow={[
            { label: 'TOTALES ANUALES' },
            { label: `Real 2024: ${new Intl.NumberFormat('es-CO').format(encasetadoMeses.reduce((s,m)=>s+m.real2024,0))}`, color: 'text-gray-700' },
            { label: `Real 2025: ${new Intl.NumberFormat('es-CO').format(encasetadoMeses.reduce((s,m)=>s+m.real2025,0))}`, color: 'text-blue-700' },
            { label: `Var Prog: -1.47%`, color: 'text-red-500' },
            { label: `Var Real: +6.70%`, color: 'text-green-600' },
            { label: `Var PvsR: +0.55%`, color: 'text-green-600' },
          ]}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-blue-800 text-white">
                  <th rowSpan={2} className="border border-blue-600 px-3 py-2 text-left font-bold">MES</th>
                  <th colSpan={2} className="border border-blue-600 px-3 py-2 text-center font-bold">2024</th>
                  <th colSpan={2} className="border border-blue-600 px-3 py-2 text-center font-bold">2025</th>
                  <th colSpan={2} className="border border-blue-500 px-3 py-2 text-center font-bold bg-blue-700">VAR. PROGRAMADA 2025-2024</th>
                  <th colSpan={2} className="border border-blue-500 px-3 py-2 text-center font-bold bg-indigo-700">VAR. REAL 2025-2024</th>
                  <th colSpan={2} className="border border-blue-500 px-3 py-2 text-center font-bold bg-purple-700">VAR. PROG VS REAL 2025</th>
                </tr>
                <tr className="bg-blue-700 text-white">
                  <th className="border border-blue-600 px-3 py-2 text-right font-semibold">PROG</th>
                  <th className="border border-blue-600 px-3 py-2 text-right font-semibold">REAL</th>
                  <th className="border border-blue-600 px-3 py-2 text-right font-semibold">PROG</th>
                  <th className="border border-blue-600 px-3 py-2 text-right font-semibold">REAL</th>
                  <th className="border border-blue-500 px-2 py-2 text-right font-semibold bg-blue-600">ABSOLUTA</th>
                  <th className="border border-blue-500 px-2 py-2 text-right font-semibold bg-blue-600">RELATIVA %</th>
                  <th className="border border-blue-500 px-2 py-2 text-right font-semibold bg-indigo-600">ABSOLUTA</th>
                  <th className="border border-blue-500 px-2 py-2 text-right font-semibold bg-indigo-600">RELATIVA %</th>
                  <th className="border border-blue-500 px-2 py-2 text-right font-semibold bg-purple-600">ABSOLUTA</th>
                  <th className="border border-blue-500 px-2 py-2 text-right font-semibold bg-purple-600">RELATIVA %</th>
                </tr>
              </thead>
              <tbody>
                {encasetadoMeses.map((mes, idx) => {
                  // Variación programada 2025 vs 2024
                  const varProgAbs = mes.prog2025 - mes.prog2024;
                  const varProgRel = mes.prog2024 > 0 ? ((varProgAbs / mes.prog2024) * 100).toFixed(2) : 0;
                  // Variación real 2025 vs 2024
                  const varRealAbs = mes.real2025 - mes.real2024;
                  const varRealRel = mes.real2024 > 0 ? ((varRealAbs / mes.real2024) * 100).toFixed(2) : 0;
                  // Variación programado vs real 2025
                  const varPvsRAbs = mes.real2025 - mes.prog2025;
                  const varPvsRRel = mes.prog2025 > 0 ? ((varPvsRAbs / mes.prog2025) * 100).toFixed(2) : 0;
                  const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/40';
                  return (
                    <tr key={idx} className={`${rowBg} hover:bg-blue-100/50 transition-colors`}>
                      <td className="border border-gray-200 px-3 py-2 font-semibold text-gray-900">{mes.mes}</td>
                      <td className="border border-gray-200 px-3 py-2 text-right text-gray-600">{formatNumber(mes.prog2024)}</td>
                      <td className="border border-gray-200 px-3 py-2 text-right text-gray-700 font-medium">{formatNumber(mes.real2024)}</td>
                      <td className="border border-gray-200 px-3 py-2 text-right text-blue-600">{formatNumber(mes.prog2025)}</td>
                      <td className="border border-gray-200 px-3 py-2 text-right text-blue-700 font-bold">{mes.real2025 > 0 ? formatNumber(mes.real2025) : '0'}</td>
                      {/* Var. Programada 2025-2024: siempre se muestra (no depende de real) */}
                      <td className={`border border-gray-200 px-2 py-2 text-right font-medium ${varProgAbs >= 0 ? 'text-green-600' : 'text-red-600'}`}>{varProgAbs >= 0 ? '+' : ''}{formatNumber(varProgAbs)}</td>
                      <td className={`border border-gray-200 px-2 py-2 text-right font-medium ${parseFloat(varProgRel) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{parseFloat(varProgRel) >= 0 ? '+' : ''}{varProgRel}%</td>
                      {/* Var. Real 2025-2024: siempre calcular */}
                      <td className={`border border-gray-200 px-2 py-2 text-right font-medium ${varRealAbs >= 0 ? 'text-green-600' : 'text-red-600'}`}>{varRealAbs >= 0 ? '+' : ''}{formatNumber(varRealAbs)}</td>
                      <td className={`border border-gray-200 px-2 py-2 text-right font-medium ${parseFloat(varRealRel) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{parseFloat(varRealRel) >= 0 ? '+' : ''}{varRealRel}%</td>
                      {/* Var. Prog vs Real 2025: siempre calcular */}
                      <td className={`border border-gray-200 px-2 py-2 text-right font-medium ${varPvsRAbs >= 0 ? 'text-green-600' : 'text-red-600'}`}>{varPvsRAbs >= 0 ? '+' : ''}{formatNumber(varPvsRAbs)}</td>
                      <td className={`border border-gray-200 px-2 py-2 text-right font-medium ${parseFloat(varPvsRRel) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{parseFloat(varPvsRRel) >= 0 ? '+' : ''}{varPvsRRel}%</td>
                    </tr>
                  );
                })}
                {/* Fila de totales */}
                {(() => {
                  const totProg2024 = encasetadoMeses.reduce((s, m) => s + m.prog2024, 0);
                  const totReal2024 = encasetadoMeses.reduce((s, m) => s + m.real2024, 0);
                  const totProg2025 = encasetadoMeses.reduce((s, m) => s + m.prog2025, 0);
                  const totReal2025 = encasetadoMeses.reduce((s, m) => s + m.real2025, 0);

                  // Var Programada: todos los meses
                  const tVarProgAbs = totProg2025 - totProg2024;
                  const tVarProgRel = totProg2024 > 0 ? ((tVarProgAbs / totProg2024) * 100).toFixed(2) : 0;
                  // Var Real: total real2025 vs total real2024 (todos los meses, igual que la imagen)
                  const tVarRealAbs = totReal2025 - totReal2024;
                  const tVarRealRel = totReal2024 > 0 ? ((tVarRealAbs / totReal2024) * 100).toFixed(2) : 0;
                  // Var Prog vs Real: todos los meses (incluyendo Diciembre sin real)
                  const tProg2025ParaVar = encasetadoMeses.reduce((s, m) => s + m.prog2025, 0);
                  const tReal2025ParaVar = encasetadoMeses.reduce((s, m) => s + m.real2025, 0);
                  const tVarPvsRAbs = tReal2025ParaVar - tProg2025ParaVar;
                  const tVarPvsRRel = tProg2025ParaVar > 0 ? ((tVarPvsRAbs / tProg2025ParaVar) * 100).toFixed(2) : 0;
                  return (
                    <tr className="font-bold border-t-4 border-blue-600 border-b-4">
                      <td className="border border-gray-300 px-3 py-3 text-blue-700 text-sm">TOTAL</td>
                      <td className="border border-gray-300 px-3 py-3 text-right text-blue-700 text-sm">{formatNumber(totProg2024)}</td>
                      <td className="border border-gray-300 px-3 py-3 text-right text-blue-700 text-sm">{formatNumber(totReal2024)}</td>
                      <td className="border border-gray-300 px-3 py-3 text-right text-blue-700 text-sm">{formatNumber(totProg2025)}</td>
                      <td className="border border-gray-300 px-3 py-3 text-right text-blue-700 text-sm">{formatNumber(totReal2025)}</td>
                      <td className={`border border-gray-300 px-2 py-3 text-right text-sm font-bold ${tVarProgAbs >= 0 ? 'text-green-600' : 'text-red-600'}`}>{tVarProgAbs >= 0 ? '+' : ''}{formatNumber(tVarProgAbs)}</td>
                      <td className={`border border-gray-300 px-2 py-3 text-right text-sm font-bold ${parseFloat(tVarProgRel) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{parseFloat(tVarProgRel) >= 0 ? '+' : ''}{tVarProgRel}%</td>
                      <td className={`border border-gray-300 px-2 py-3 text-right text-sm font-bold ${tVarRealAbs >= 0 ? 'text-green-600' : 'text-red-600'}`}>{tVarRealAbs >= 0 ? '+' : ''}{formatNumber(tVarRealAbs)}</td>
                      <td className={`border border-gray-300 px-2 py-3 text-right text-sm font-bold ${parseFloat(tVarRealRel) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{parseFloat(tVarRealRel) >= 0 ? '+' : ''}{tVarRealRel}%</td>
                      <td className={`border border-gray-300 px-2 py-3 text-right text-sm font-bold ${tVarPvsRAbs >= 0 ? 'text-green-600' : 'text-red-600'}`}>{tVarPvsRAbs >= 0 ? '+' : ''}{formatNumber(tVarPvsRAbs)}</td>
                      <td className={`border border-gray-300 px-2 py-3 text-right text-sm font-bold ${parseFloat(tVarPvsRRel) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{parseFloat(tVarPvsRRel) >= 0 ? '+' : ''}{tVarPvsRRel}%</td>
                    </tr>
                  );
                })()}
              </tbody>
            </table>
          </div>
        </CollapsibleTable>
      </motion.div>

      {/* Gráfico Comparativo Programado vs Real */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.4 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-gray-200 hover:border-blue-500 transition-all cursor-pointer"
        onClick={() => openModal(
          'Cumplimiento Mensual del Programa',
          `Comparación mes a mes entre el encasetamiento programado y el real. Las barras azules muestran lo programado y las verdes lo ejecutado. Un cumplimiento consistente cercano al 100% indica buena planificación y ejecución.`
        )}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-2">Cumplimiento del Programado de Encasetamiento 2025</h3>
        <p className="text-sm text-gray-600 mb-4">Pollitos programados vs real mensual + % cumplimiento acumulado</p>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={encasetadoMeses} margin={{ left: 20, right: 40, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="mes" stroke="#6b7280" height={60} style={{ fontSize: '12px' }} />
            <YAxis yAxisId="left" stroke="#6b7280" width={80} style={{ fontSize: '12px' }} tickFormatter={(value) => formatNumber(value)} />
            <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" width={50} style={{ fontSize: '12px' }} tickFormatter={(v) => `${v}%`} domain={[80, 120]} />
            <ReferenceLine yAxisId="right" y={100} stroke="#ef4444" strokeDasharray="6 3" strokeWidth={2} label={{ value: '100%', position: 'right', fill: '#ef4444', fontSize: 11 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', border: '2px solid #3b82f6', borderRadius: '12px', padding: '12px' }}
              labelStyle={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const prog = payload.find(p => p.dataKey === 'prog2025')?.value || 0;
                  const real = payload.find(p => p.dataKey === 'real2025')?.value || 0;
                  const cumpl = payload.find(p => p.dataKey === 'cumplPct')?.value;
                  const diferencia = real - prog;
                  return (
                    <div className="bg-white border-2 border-blue-500 rounded-xl p-4 shadow-xl">
                      <p className="font-bold text-gray-900 mb-3 text-lg">{label}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-blue-600 font-medium">Programado:</span>
                          <span className="font-bold text-gray-900">{formatNumber(prog)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-green-600 font-medium">Real:</span>
                          <span className="font-bold text-gray-900">{formatNumber(real)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-amber-600 font-medium">% Cumplimiento:</span>
                            <span className={`font-bold ${cumpl >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
                              {cumpl != null ? `${cumpl}%` : 'N/D'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center gap-4 mt-1">
                            <span className="text-gray-600 font-medium">Diferencia:</span>
                            <span className={`font-bold ${diferencia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {diferencia >= 0 ? '+' : ''}{formatNumber(diferencia)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="prog2025" fill="#3b82f6" name="Programado 2025" radius={[8, 8, 0, 0]} />
            <Bar yAxisId="left" dataKey="real2025" fill="#10b981" name="Real 2025" radius={[8, 8, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="cumplPct" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5, fill: '#f59e0b' }} name="% Cumplimiento" connectNulls={false} />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Totales anuales — dentro del card, debajo de la gráfica */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 text-center">Totales anuales</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {[
              { label: 'Prog 2025', value: formatNumber(totalProgramado2025), color: 'text-blue-700', bg: 'bg-blue-50' },
              { label: 'Real 2025', value: formatNumber(totalEncasetado2025), color: 'text-green-600', bg: 'bg-green-50' },
              { label: '% Cumpl 2025', value: `${cumplimiento2025}%`, color: parseFloat(cumplimiento2025) >= 100 ? 'text-green-600' : 'text-orange-600', bg: parseFloat(cumplimiento2025) >= 100 ? 'bg-green-50' : 'bg-orange-50' },
            ].map((item, i) => (
              <div key={i} className={`${item.bg} rounded-lg p-2 text-center`}>
                <div className="text-xs text-gray-400 mb-1">{item.label}</div>
                <div className={`text-sm font-bold ${item.color}`}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Gráfico de Comparación Anual 2024 vs 2025 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.5 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-gray-200 hover:border-purple-500 transition-all cursor-pointer"
        onClick={() => openModal(
          'Comparación Anual 2024 vs 2025',
          `Comparación del encasetamiento real entre 2024 y 2025 mes a mes. Permite identificar patrones estacionales y crecimiento de la operación.\n\nLínea roja punteada: tendencia calculada por regresión lineal sobre el encasetamiento real mensual de 2025, mostrando la dirección general del volumen productivo en el año.`
        )}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-2">Encasetamiento Real 2024 vs 2025</h3>
        <p className="text-sm text-gray-600 mb-4">Encasetamiento real mensual en pollitos — comparación interanual</p>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={encasetadoConTend} margin={{ left: 20, right: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="mes" stroke="#6b7280" height={60} style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" width={80} style={{ fontSize: '12px' }} tickFormatter={(value) => formatNumber(value)} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', border: '2px solid #8b5cf6', borderRadius: '12px', padding: '12px' }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const real2024 = payload.find(p => p.dataKey === 'real2024')?.value || 0;
                  const real2025 = payload.find(p => p.dataKey === 'real2025')?.value || 0;
                  const diferencia = real2025 - real2024;
                  const variacion = real2024 > 0 ? ((diferencia / real2024) * 100).toFixed(1) : 0;
                  return (
                    <div className="bg-white border-2 border-purple-500 rounded-xl p-4 shadow-xl">
                      <p className="font-bold text-gray-900 mb-3 text-lg">{label}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-indigo-600 font-medium">Real 2024:</span>
                          <span className="font-bold text-gray-900">{formatNumber(real2024)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-green-600 font-medium">Real 2025:</span>
                          <span className="font-bold text-gray-900">{formatNumber(real2025)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-gray-600 font-medium">Diferencia:</span>
                            <span className={`font-bold ${diferencia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {diferencia >= 0 ? '+' : ''}{formatNumber(diferencia)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center gap-4 mt-1">
                            <span className="text-gray-600 font-medium">Variación:</span>
                            <span className={`font-bold ${variacion >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {variacion >= 0 ? '+' : ''}{variacion}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Area type="monotone" dataKey="real2024" fill="#6366f1" fillOpacity={0.3} stroke="#6366f1" strokeWidth={2} name="Real 2024" />
            <Area type="monotone" dataKey="real2025" fill="#10b981" fillOpacity={0.3} stroke="#10b981" strokeWidth={2} name="Real 2025" />
            <Line type="linear" dataKey="tendencia" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Tendencia 2025" />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Totales anuales — dentro del card, debajo de la gráfica */}
        {(() => {
          const dif = totalEncasetado2025 - totalEncasetado2024;
          const varPct = totalEncasetado2024 > 0 ? (((totalEncasetado2025 - totalEncasetado2024) / totalEncasetado2024) * 100).toFixed(1) : '0';
          return (
            <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 text-center">Totales anuales</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { label: 'Total Real 2024', value: formatNumber(totalEncasetado2024), color: 'text-indigo-600', bg: 'bg-indigo-50' },
                  { label: 'Total Real 2025', value: formatNumber(totalEncasetado2025), color: 'text-green-600', bg: 'bg-green-50' },
                  { label: 'Diferencia', value: `${dif >= 0 ? '+' : ''}${formatNumber(dif)}`, color: dif >= 0 ? 'text-green-600' : 'text-red-600', bg: dif >= 0 ? 'bg-green-50' : 'bg-red-50' },
                  { label: 'Variación %', value: `${parseFloat(varPct) >= 0 ? '+' : ''}${varPct}%`, color: parseFloat(varPct) >= 0 ? 'text-green-600' : 'text-red-600', bg: parseFloat(varPct) >= 0 ? 'bg-green-50' : 'bg-red-50' },
                ].map((item, i) => (
                  <div key={i} className={`${item.bg} rounded-lg p-3 text-center`}>
                    <div className="text-xs text-gray-400 mb-1">{item.label}</div>
                    <div className={`text-sm font-bold ${item.color}`}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </motion.div>

      {/* Análisis de Encasetamiento */}
      {(() => {
        const mesesActivos = encasetadoMeses.filter(m => m.real2025 > 0);
        const mesPico2025 = mesesActivos.reduce((max, m) => m.real2025 > max.real2025 ? m : max, mesesActivos[0] || {});
        const mesMenorCumpl = mesesActivos.filter(m => m.cumplPct != null).reduce((min, m) => m.cumplPct < min.cumplPct ? m : min, mesesActivos.find(m => m.cumplPct != null) || {});
        const mesMayorCumpl = mesesActivos.filter(m => m.cumplPct != null).reduce((max, m) => m.cumplPct > max.cumplPct ? m : max, mesesActivos.find(m => m.cumplPct != null) || {});
        const mesesSobreProg = mesesActivos.filter(m => m.real2025 >= m.prog2025).length;
        const mesesBajoProg = mesesActivos.filter(m => m.real2025 < m.prog2025).length;
        const tendenciaPositiva = parseFloat(variacionEncasetado) > 0;

        const insights = [
          {
            icon: <TrendingUp className={`w-5 h-5 ${tendenciaPositiva ? 'text-green-500' : 'text-red-500'}`} />,
            color: tendenciaPositiva ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50',
            title: 'Tendencia 2025 vs 2024',
            text: `El encasetamiento real 2025 muestra una variación de ${variacionEncasetado > 0 ? '+' : ''}${variacionEncasetado}% frente a 2024 en los meses con datos disponibles (${mesesActivos.length} meses). Diferencia absoluta: ${tendenciaPositiva ? '+' : ''}${formatNumber(totalReal2025ParaVar - totalReal2024ParaVar)} pollitos.`
          },
          {
            icon: <Factory className="w-5 h-5 text-blue-500" />,
            color: 'border-blue-400 bg-blue-50',
            title: 'Mes pico de encasetamiento 2025',
            text: mesPico2025?.mes
              ? `${mesPico2025.mes} fue el mes con mayor encasetamiento real en 2025 con ${formatNumber(mesPico2025.real2025)} pollitos, representando ${totalEncasetado2025 > 0 ? ((mesPico2025.real2025 / totalEncasetado2025) * 100).toFixed(1) : 0}% del total anual.`
              : 'Sin datos suficientes.'
          },
          {
            icon: <Calendar className="w-5 h-5 text-orange-500" />,
            color: parseFloat(cumplimiento2025) >= 100 ? 'border-green-400 bg-green-50' : 'border-orange-400 bg-orange-50',
            title: 'Cumplimiento del programado 2025',
            text: `Cumplimiento global: ${cumplimiento2025}%. ${mesesSobreProg} mes${mesesSobreProg !== 1 ? 'es' : ''} superaron el programado y ${mesesBajoProg} quedaron por debajo. ${mesMayorCumpl?.mes ? `Mayor cumplimiento: ${mesMayorCumpl.mes} (${mesMayorCumpl.cumplPct}%).` : ''} ${mesMenorCumpl?.mes ? `Menor cumplimiento: ${mesMenorCumpl.mes} (${mesMenorCumpl.cumplPct}%).` : ''}`
          },
          {
            icon: <TrendingUp className="w-5 h-5 text-purple-500" />,
            color: 'border-purple-400 bg-purple-50',
            title: 'Comparativo totales anuales',
            text: `Real 2025 acumulado: ${formatNumber(totalEncasetado2025)} pollitos vs Real 2024: ${formatNumber(totalEncasetado2024)} pollitos. Promedio mensual 2025: ${formatNumber(Math.round(promedioMensual2025))} vs 2024: ${formatNumber(Math.round(promedioMensual2024))} pollitos/mes.`
          },
        ];

        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border-2 border-blue-200"
          >
            <div className="flex items-center gap-3 mb-5">
              <Info className="w-6 h-6 text-blue-500" />
              <h3 className="text-xl font-bold text-gray-900">Análisis de Encasetamiento</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((item, i) => (
                <div key={i} className={`rounded-xl p-4 border-2 ${item.color}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {item.icon}
                    <span className="font-bold text-gray-800 text-sm">{item.title}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })()}

      {/* Modal de Explicación */}
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
              className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-blue-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-gray-900">{modalContent.title}</h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-gray-700 leading-relaxed">
                {modalContent.description}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-gray-900 rounded-lg transition-colors"
                >
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

