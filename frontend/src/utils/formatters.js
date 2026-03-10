/**
 * Formatea un valor numérico como moneda en COP (Pesos Colombianos)
 * @param {number|string} value - El valor a formatear
 * @returns {string} - El valor formateado como moneda COP
 */
export const formatCurrency = (value) => {
  if (!value || isNaN(value)) return '$0 COP';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '$0 COP';
  
  const formatted = new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numValue);
  
  return `$${formatted} COP`;
};

/**
 * Formatea un número sin símbolo de moneda
 * @param {number|string} value - El valor a formatear
 * @returns {string} - El valor formateado
 */
export const formatNumber = (value) => {
  if (!value || isNaN(value)) return '0';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '0';
  
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numValue);
};

/**
 * Formatea un porcentaje
 * @param {number|string} value - El valor a formatear
 * @param {number} decimals - Número de decimales (por defecto 1)
 * @returns {string} - El valor formateado como porcentaje
 */
export const formatPercentage = (value, decimals = 1) => {
  if (!value || isNaN(value)) return '0%';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '0%';
  
  return `${numValue.toFixed(decimals)}%`;
};
