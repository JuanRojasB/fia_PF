import { motion } from 'framer-motion';

/**
 * KpiCard — tarjeta estándar de KPI con comparación 2024 vs 2025.
 *
 * Props:
 *  - title: string — etiqueta del KPI
 *  - value: string|number — valor 2025 (ya formateado)
 *  - unit: string — unidad debajo del valor (ej: "kg", "pesos/kg")
 *  - value2024: string|number — valor 2024 formateado
 *  - varPct: number|string — variación % (número, puede ser negativo)
 *  - icon: ReactNode — ícono lucide
 *  - borderColor: string — clase tailwind del borde (ej: "border-blue-500/30")
 *  - hoverColor: string — clase tailwind hover (ej: "hover:border-blue-500")
 *  - invertColors: bool — si true, negativo=verde (indicadores técnicos como mortalidad)
 *  - onClick: fn — abre modal
 *  - delay: number — delay de animación
 */
export default function KpiCard({
  title,
  value,
  unit,
  value2024,
  varPct,
  icon,
  borderColor = 'border-blue-500/30',
  hoverColor = 'hover:border-blue-500',
  invertColors = false,
  onClick,
  delay = 0,
}) {
  const pct = parseFloat(varPct);
  const isPositive = invertColors ? pct <= 0 : pct >= 0;
  const varColor = isPositive ? 'text-green-600' : 'text-red-600';
  const varSign = pct > 0 ? '+' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className={`bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 ${borderColor} ${hoverColor} transition-all ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Título + ícono */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600 text-sm font-medium leading-tight">{title}</span>
        {icon && <span className="shrink-0 ml-2">{icon}</span>}
      </div>

      {/* Valor principal 2025 */}
      <div className="text-3xl font-bold text-gray-900 leading-tight">{value}</div>
      {unit && <div className="text-xs text-gray-500 mt-0.5 mb-2">{unit}</div>}

      {/* Separador + comparación */}
      {(value2024 !== undefined || varPct !== undefined) && (
        <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
          {value2024 !== undefined && (
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{value2024}</span></div>
          )}
          {value !== undefined && (
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{value}</span></div>
          )}
          {varPct !== undefined && (
            <div className={`text-sm font-bold ${varColor}`}>
              Var: {varSign}{pct.toFixed(2)}%
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
