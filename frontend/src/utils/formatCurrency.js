/**
 * Formatea un valor COP completo con separadores de miles.
 * SIEMPRE muestra el valor completo, sin abreviaciones MM/Mil/K/M.
 */
export const formatCOPShort = (value) => {
  if (value == null || isNaN(value)) return '$0';
  return '$ ' + new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseFloat(value));
};

/**
 * Formatea un valor COP completo con separadores de miles.
 */
export const formatCOPFull = (value) => {
  if (value == null || isNaN(value)) return '$0';
  return '$ ' + new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseFloat(value));
};

/**
 * Formatea número sin símbolo de moneda, con separadores de miles.
 */
export const formatNumber = (value) => {
  if (value == null || isNaN(value)) return '0';
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseFloat(value));
};
