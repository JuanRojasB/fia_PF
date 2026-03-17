import { motion } from 'framer-motion';
import { Wrench, ClipboardList, Truck, Building2, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';

// Dashboard consolidado de Operaciones y Mantenimiento

export default function OperacionesDashboard({ onNavigate }) {
  const secciones = [
    {
      id: 'operaciones-tpm',
      icon: Wrench,
      titulo: 'Mantenimiento — Indicadores TPM',
      color: 'orange',
      borderColor: '#f97316',
      bgColor: '#fff7ed',
      resumen: 'La gestión 2025 cumplió la meta de OEE (86,4% vs meta 86%), pero el MTBF cayó y el MTTR aumentó, acumulando 104,30 hrs de paro.',
      kpis: [
        { label: 'OEE 2025', valor: '86,4%', sub: 'Meta 86% ✓', positivo: true },
        { label: 'Disponibilidad', valor: '95,70%', sub: 'vs 97% (2024)', positivo: false },
        { label: 'MTBF', valor: '10,42 hrs', sub: 'vs 13,35 (2024)', positivo: false },
        { label: 'MTTR', valor: '0,47 hrs', sub: 'vs 0,35 (2024)', positivo: false },
      ],
      alerta: 'Invertir en confiabilidad de Línea de Descargue y Calderas — riesgo >$250M en 2026.',
    },
    {
      id: 'operaciones-ot',
      icon: ClipboardList,
      titulo: 'Órdenes de Trabajo SIESA',
      color: 'purple',
      borderColor: '#a855f7',
      bgColor: '#faf5ff',
      resumen: 'El 88% de las intervenciones fueron preventivas y 12% correctivas. Enfoque preventivo sólido durante el año.',
      kpis: [
        { label: 'Preventivas', valor: '88%', sub: '3.298 OT', positivo: true },
        { label: 'Correctivas', valor: '12%', sub: '403 OT', positivo: true },
        { label: 'Total OT', valor: '3.701', sub: 'año 2025', positivo: true },
        { label: 'Mejor mes', valor: 'Dic', sub: 'Solo 2% correctivas', positivo: true },
      ],
      alerta: null,
    },
    {
      id: 'operaciones-vehiculos',
      icon: Truck,
      titulo: 'Mantenimiento de Vehículos',
      color: 'green',
      borderColor: '#22c55e',
      bgColor: '#f0fdf4',
      resumen: 'Reducción de $166.084.545 (-46,65%) en costos de mantenimiento vehicular vs 2024. Para 2026 se proyecta renovación de flota.',
      kpis: [
        { label: 'Costo 2024', valor: '$356M', sub: '$356.022.963', positivo: null },
        { label: 'Costo 2025', valor: '$189M', sub: '$189.938.418', positivo: true },
        { label: 'Ahorro', valor: '$166M', sub: '-46,65%', positivo: true },
        { label: 'Proyección', valor: '2026', sub: 'Renovación flota', positivo: true },
      ],
      alerta: null,
    },
    {
      id: 'operaciones-arquitectura',
      icon: Building2,
      titulo: 'Arquitectura — Novedades Correctivas',
      color: 'blue',
      borderColor: '#3b82f6',
      bgColor: '#eff6ff',
      resumen: 'Cumplimiento global del 70%. Mantenimiento al 84%, pero Arquitectura solo al 58%, impactada por Sede 1 (15%) y Sede 4 (36%).',
      kpis: [
        { label: 'Global', valor: '70%', sub: '564 cerradas / 801', positivo: true },
        { label: 'Mantenimiento', valor: '84%', sub: '315 cerradas / 375', positivo: true },
        { label: 'Arquitectura', valor: '58%', sub: '249 cerradas / 426', positivo: false },
        { label: 'Técnicos', valor: '4', sub: 'Para todas las sedes', positivo: null },
      ],
      alerta: 'RH: resolver vacante de Edwin Torres (renuncia hace 5 meses) para mejorar ejecución.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-100 to-gray-100 rounded-xl p-6 border border-gray-300">
        <p className="text-gray-700">
          Resumen consolidado del área de <strong>Operaciones y Mantenimiento 2025</strong>. La gestión logró cumplir el OEE, redujo costos vehiculares en un 46,65% y mantuvo un enfoque preventivo del 88% en OT. El principal reto es la confiabilidad de equipos críticos y la capacidad del equipo de Arquitectura.
        </p>
      </div>

      {/* Cards resumen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {secciones.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <motion.div
              key={sec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/95 rounded-xl border-2 overflow-hidden"
              style={{ borderColor: sec.borderColor }}
            >
              {/* Card header */}
              <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: sec.bgColor }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: sec.borderColor + '22' }}>
                    <Icon className="w-5 h-5" style={{ color: sec.borderColor }} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm">{sec.titulo}</h3>
                </div>
                {onNavigate && (
                  <button
                    onClick={() => onNavigate(sec.id)}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:opacity-80"
                    style={{ backgroundColor: sec.borderColor, color: '#fff' }}
                  >
                    Ver detalle <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Resumen */}
              <div className="px-5 py-3 border-b border-gray-100">
                <p className="text-xs text-gray-600 leading-relaxed">{sec.resumen}</p>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-4 divide-x divide-gray-100 px-0">
                {sec.kpis.map((kpi, i) => (
                  <div key={i} className="px-4 py-3 text-center">
                    <div className={`text-lg font-bold ${
                      kpi.positivo === true ? 'text-green-600' :
                      kpi.positivo === false ? 'text-red-500' :
                      'text-gray-900'
                    }`}>{kpi.valor}</div>
                    <div className="text-xs text-gray-500 mt-0.5 leading-tight">{kpi.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5 leading-tight">{kpi.sub}</div>
                  </div>
                ))}
              </div>

              {/* Alerta */}
              {sec.alerta && (
                <div className="px-5 py-3 border-t border-gray-100 flex items-start gap-2" style={{ backgroundColor: '#fef9c3' }}>
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-yellow-800">{sec.alerta}</p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Resumen global */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'OEE Planta', valor: '86,4%', meta: 'Meta: 86%', icon: CheckCircle, color: 'text-green-600' },
          { label: 'Horas de Paro', valor: '104,30 hrs', meta: 'Año 2025', icon: AlertTriangle, color: 'text-orange-500' },
          { label: 'OT Preventivas', valor: '88%', meta: '3.298 de 3.701', icon: TrendingUp, color: 'text-green-600' },
          { label: 'Ahorro Vehículos', valor: '$166M', meta: '-46,65% vs 2024', icon: TrendingDown, color: 'text-green-600' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div key={idx}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + idx * 0.05 }}
              className="bg-white/95 rounded-xl p-4 border border-gray-200 text-center">
              <Icon className={`w-5 h-5 mx-auto mb-2 ${item.color}`} />
              <div className={`text-2xl font-bold ${item.color}`}>{item.valor}</div>
              <div className="text-xs text-gray-700 font-medium mt-1">{item.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{item.meta}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
