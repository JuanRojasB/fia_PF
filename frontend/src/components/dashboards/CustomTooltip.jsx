// Componente de Tooltip personalizado reutilizable
export const CustomBarTooltip = ({ active, payload, label, formatNumber }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border-2 border-blue-500 rounded-xl p-4 shadow-xl">
        <p className="font-bold text-gray-900 mb-3 text-lg">{label}</p>
        <div className="space-y-2">
          {payload.map((entry, index) => (
            <div key={index} className="flex justify-between items-center gap-4">
              <span style={{ color: entry.color }} className="font-medium">
                {entry.name}:
              </span>
              <span className="font-bold text-gray-900">
                {formatNumber ? formatNumber(entry.value) : entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const CustomComparisonTooltip = ({ active, payload, label, formatNumber, dataKey1, dataKey2, label1, label2 }) => {
  if (active && payload && payload.length) {
    const val1 = payload.find(p => p.dataKey === dataKey1)?.value || 0;
    const val2 = payload.find(p => p.dataKey === dataKey2)?.value || 0;
    const diferencia = val2 - val1;
    const variacion = val1 > 0 ? ((diferencia / val1) * 100).toFixed(1) : 0;
    
    return (
      <div className="bg-white border-2 border-purple-500 rounded-xl p-4 shadow-xl">
        <p className="font-bold text-gray-900 mb-3 text-lg">{label}</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center gap-4">
            <span className="text-indigo-600 font-medium">{label1}:</span>
            <span className="font-bold text-gray-900">
              {formatNumber ? formatNumber(val1) : val1}
            </span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-green-600 font-medium">{label2}:</span>
            <span className="font-bold text-gray-900">
              {formatNumber ? formatNumber(val2) : val2}
            </span>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between items-center gap-4">
              <span className="text-gray-600 font-medium">Diferencia:</span>
              <span className={`font-bold ${diferencia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {diferencia >= 0 ? '+' : ''}{formatNumber ? formatNumber(diferencia) : diferencia}
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
};
