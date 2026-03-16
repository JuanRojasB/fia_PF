// Componentes de Tooltip personalizados reutilizables

const fmt = (v) => new Intl.NumberFormat('es-CO').format(Math.round(v));
const fmtDec = (v, d = 2) => new Intl.NumberFormat('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d }).format(v);

// Tooltip genérico — muestra nombre + valor formateado con unidad opcional
export const CustomBarTooltip = ({ active, payload, label, formatNumber, unit = '', borderColor = '#3b82f6' }) => {
  if (!active || !payload || !payload.length) return null;
  const mesCompleto = payload[0]?.payload?.mesCompleto || payload[0]?.payload?.mes_nombre || label;
  return (
    <div className="bg-white rounded-xl shadow-2xl p-4 min-w-[180px]" style={{ border: `2px solid ${borderColor}` }}>
      <p className="font-bold text-gray-900 text-sm mb-3 pb-2 border-b border-gray-100">{mesCompleto}</p>
      <div className="space-y-2">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="text-sm text-gray-600">{entry.name}:</span>
            </div>
            <span className="text-sm font-bold text-gray-900">
              {formatNumber ? formatNumber(entry.value) : fmt(entry.value)}{unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Tooltip comparativo 2025 vs 2024 con diferencia y variación
export const CustomComparisonTooltip = ({ active, payload, label, formatNumber, dataKey1, dataKey2, label1 = '2025', label2 = '2024', unit = '', borderColor = '#8b5cf6' }) => {
  if (!active || !payload || !payload.length) return null;
  const mesCompleto = payload[0]?.payload?.mesCompleto || payload[0]?.payload?.mes_nombre || label;
  const val1 = payload.find(p => p.dataKey === dataKey1)?.value ?? 0;
  const val2 = payload.find(p => p.dataKey === dataKey2)?.value ?? 0;
  const diferencia = val1 - val2;
  const variacion = val2 > 0 ? ((diferencia / val2) * 100).toFixed(1) : '—';
  const fmtVal = formatNumber || fmt;

  return (
    <div className="bg-white rounded-xl shadow-2xl p-4 min-w-[220px]" style={{ border: `2px solid ${borderColor}` }}>
      <p className="font-bold text-gray-900 text-sm mb-3 pb-2 border-b border-gray-100">{mesCompleto}</p>
      <div className="space-y-2 mb-3">
        {payload.filter(p => p.dataKey !== 'tendencia').map((entry, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="text-sm text-gray-600">{entry.name}:</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{fmtVal(entry.value)}{unit}</span>
          </div>
        ))}
      </div>
      {dataKey1 && dataKey2 && (
        <div className="pt-2 border-t border-gray-100 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Diferencia:</span>
            <span className={`font-bold ${diferencia >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {diferencia >= 0 ? '+' : ''}{fmtVal(diferencia)}{unit}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Variación:</span>
            <span className={`font-bold ${diferencia >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {diferencia >= 0 ? '+' : ''}{variacion}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Tooltip para porcentajes
export const CustomPctTooltip = ({ active, payload, label, borderColor = '#8b5cf6' }) => {
  if (!active || !payload || !payload.length) return null;
  const mesCompleto = payload[0]?.payload?.mesCompleto || payload[0]?.payload?.mes_nombre || label;
  return (
    <div className="bg-white rounded-xl shadow-2xl p-4 min-w-[180px]" style={{ border: `2px solid ${borderColor}` }}>
      <p className="font-bold text-gray-900 text-sm mb-3 pb-2 border-b border-gray-100">{mesCompleto}</p>
      <div className="space-y-2">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="text-sm text-gray-600">{entry.name}:</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{fmtDec(entry.value, 2)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Tooltip para moneda (millones)
export const CustomCurrencyTooltip = ({ active, payload, label, borderColor = '#3b82f6', suffix = 'M' }) => {
  if (!active || !payload || !payload.length) return null;
  const mesCompleto = payload[0]?.payload?.mesCompleto || payload[0]?.payload?.mes_nombre || label;
  return (
    <div className="bg-white rounded-xl shadow-2xl p-4 min-w-[200px]" style={{ border: `2px solid ${borderColor}` }}>
      <p className="font-bold text-gray-900 text-sm mb-3 pb-2 border-b border-gray-100">{mesCompleto}</p>
      <div className="space-y-2">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="text-sm text-gray-600">{entry.name}:</span>
            </div>
            <span className="text-sm font-bold text-gray-900">
              ${typeof entry.value === 'number' ? fmt(entry.value * 1000000) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Formatea número completo en pesos colombianos para usar en title=""
export const formatCurrencyFull = (value) => {
  if (!value || isNaN(value)) return '$0';
  return '$' + new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.round(parseFloat(value)));
};

// Wrapper para KPI cards con dinero abreviado — muestra el número completo al hacer hover
// Uso: <KpiMoney value={rawValue} formatted={formatCurrency(rawValue)} className="text-4xl font-bold..." />
export const KpiMoney = ({ value, formatted, className = '' }) => (
  <div
    className={className}
    title={formatCurrencyFull(value)}
    style={{ cursor: 'help' }}
  >
    {formatted}
  </div>
);
