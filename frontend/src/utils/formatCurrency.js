/**
 * Formatea un valor monetario COP de forma legible.
 * Valores >= 1.000M  → "$1.234M"
 * Valores >= 1B      → "$1.23B"
 * Valores menores    → número completo con separadores
 *
 * Úsalo en tarjetas KPI y cualquier lugar donde el número
 * completo (ej: 41.978.924.466) sería ilegible.
 */
export const formatCOPShort = (value) => {
  if (value == null || isNaN(value)) return '$0';
  const v = parseFloat(value);
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(2)} mil M`;
  if (v >= 1_000_000)     return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)         return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
};

/**
 * Formatea un valor COP completo con separadores de miles.
 * Úsalo en tooltips, modales y tablas donde el detalle importa.
 */
export const formatCOPFull = (value) => {
  if (value == null || isNaN(value)) return '$0';
  return '$ ' + new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseFloat(value));
};
