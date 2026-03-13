import { getValueColor, tableColors } from '../utils/colorUtils';

/**
 * Componente de tabla estandarizada con colores mejorados
 * @param {Array} headers - Array de objetos con {label, key, align, type}
 * @param {Array} rows - Array de objetos con los datos
 * @param {boolean} highlightVariations - Si debe resaltar variaciones automáticamente
 */
export default function StandardTable({ headers, rows, highlightVariations = true, className = '' }) {
  
  const getCellValue = (row, header) => {
    const value = row[header.key];
    
    // Si es un valor de variación y debe resaltarse
    if (highlightVariations && (header.key.includes('var') || header.key.includes('variacion') || header.type === 'variation')) {
      const colors = getValueColor(value);
      return (
        <span className={`font-semibold px-2 py-1 rounded ${colors.bg} ${colors.text}`}>
          {value}
        </span>
      );
    }
    
    // Si tiene tipo específico
    if (header.type === 'percentage' && typeof value === 'number') {
      const colors = getValueColor(value);
      return (
        <span className={`font-semibold px-2 py-1 rounded ${colors.bg} ${colors.text}`}>
          {value.toFixed(2)}%
        </span>
      );
    }
    
    return value;
  };
  
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className={tableColors.header.bg}>
            {headers.map((header, index) => (
              <th
                key={index}
                className={`px-4 py-3 text-${header.align || 'left'} text-sm font-bold ${tableColors.header.text} border-r border-white/20 last:border-r-0`}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`border-b ${tableColors.cell.border} ${
                rowIndex % 2 === 0 ? tableColors.row.even.bg : tableColors.row.odd.bg
              } ${tableColors.row.hover.bg} transition-colors`}
            >
              {headers.map((header, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-4 py-3 text-sm text-${header.align || 'left'} ${tableColors.cell.text} ${
                    header.bold ? 'font-bold' : ''
                  }`}
                  style={header.bgColor ? { backgroundColor: header.bgColor } : {}}
                >
                  {getCellValue(row, header)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
