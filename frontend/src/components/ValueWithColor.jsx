import { getValueColor } from '../utils/colorUtils';

/**
 * Componente para mostrar valores numéricos con color según su estado
 * @param {number|string} value - Valor a mostrar
 * @param {number} threshold - Umbral para considerar neutral (default: 0.5)
 * @param {boolean} inline - Si debe mostrarse inline (default: true)
 * @param {string} suffix - Sufijo a agregar (ej: '%', 'M', etc)
 */
export default function ValueWithColor({ value, threshold = 0.5, inline = true, suffix = '' }) {
  const colors = getValueColor(value, threshold);
  
  const displayValue = typeof value === 'string' ? value : value?.toFixed?.(2) || value;
  
  return (
    <span 
      className={`font-semibold px-2 py-1 rounded ${colors.bg} ${colors.text} ${inline ? 'inline-block' : 'block'}`}
    >
      {displayValue}{suffix}
    </span>
  );
}
