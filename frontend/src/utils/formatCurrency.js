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
 * Formatea valor en millones con 2 decimales. Ej: $852,98MM
 * Usado en dashboards de logística para evitar confusión con el informe.
 */
export const formatMM = (value) => {
  if (value == null || isNaN(value)) return '$0MM';
  const mm = parseFloat(value) / 1_000_000;
  return `$${mm.toLocaleString('es-CO', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}MM`;
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
