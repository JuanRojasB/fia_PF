import { motion } from 'framer-motion';

/**
 * KpiCard — tarjeta estándar de KPI estilo dashboard profesional.
 *
 * Props:
 *  - title: string
 *  - value: string|number — valor principal (2025 o actual)
 *  - unit: string — texto debajo del valor principal
 *  - value2024: string|number — valor comparativo (año anterior / programado)
 *  - label2024: string — etiqueta para value2024 (default "2024")
 *  - varPct: number|string — variación % (puede ser negativo)
 *  - varAbs: string|number — diferencia absoluta formateada
 *  - varLabel: string — texto junto a varPct (default "vs 2024")
 *  - icon: ReactNode
 *  - borderColor: string — clase tailwind del borde activo
 *  - invertColors: bool — si true, negativo=verde (para gastos)
 *  - onClick: fn
 *  - delay: number
 */
export default function KpiCard({
  title,
  value,
  unit,
  value2024,
  label2024 = '2024',
  varPct,
  varAbs,
  varLabel = 'vs 2024',
  icon,
  borderColor = 'border-blue-500',
  invertColors = false,
  onClick,
  delay = 0,
}) {
  const pct = parseFloat(varPct);
  const isPositive = invertColors ? pct <= 0 : pct >= 0;
  const varColor = isNaN(pct) ? 'text-gray-500' : isPositive ? 'text-green-600' : 'text-red-600';
  const varBg   = isNaN(pct) ? '' : isPositive ? 'text-green-600' : 'text-red-600';
  const arrow   = isNaN(pct) ? '' : pct > 0 ? '▲' : pct < 0 ? '▼' : '=';
  const varSign = pct > 0 ? '+' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border-2 ${borderColor} shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md' : ''} transition-all`}
    >
      {/* Título + ícono */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-gray-600 text-sm font-medium leading-snug">{title}</span>
        {icon && <span className="shrink-0 mt-0.5">{icon}</span>}
      </div>

      {/* Valor principal */}
      <div className="text-4xl font-extrabold text-gray-900 leading-none tracking-tight mb-1">
        {value}
      </div>
      {unit && <div className="text-sm text-gray-500 mt-1">{unit}</div>}

      {/* Separador */}
      {(value2024 !== undefined || varPct !== undefined) && (
        <div className="border-t border-gray-200 mt-3 pt-3 space-y-1">

          {/* Valor comparativo */}
          {value2024 !== undefined && (
            <div className="text-sm text-gray-500">
              {label2024}:{' '}
              <span className="font-semibold text-gray-700">{value2024}</span>
            </div>
          )}

          {/* % variación con flecha */}
          {varPct !== undefined && !isNaN(pct) && (
            <div className={`text-base font-bold flex items-center gap-1 ${varBg}`}>
              <span>{arrow}</span>
              <span>{varSign}{pct.toFixed(2)}% {varLabel}</span>
            </div>
          )}

          {/* Diferencia absoluta */}
          {varAbs !== undefined && (
            <div className={`text-sm font-semibold ${varColor}`}>
              {varSign}{varAbs}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
