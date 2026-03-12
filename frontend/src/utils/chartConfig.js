/**
 * Configuración de colores y estilos para gráficas (tema blanco)
 */

// Paleta de colores para gráficas
export const CHART_COLORS = {
  primary: '#3b82f6',      // blue-500
  secondary: '#8b5cf6',    // purple-500
  success: '#10b981',      // green-500
  warning: '#f59e0b',      // amber-500
  danger: '#ef4444',       // red-500
  info: '#06b6d4',         // cyan-500
  pink: '#ec4899',         // pink-500
  orange: '#f97316',       // orange-500
};

// Array de colores para múltiples series
export const CHART_COLOR_ARRAY = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#f97316', // orange
];

// Colores para comparativas 2024 vs 2025
export const COMPARISON_COLORS = {
  year2024: '#94a3b8', // slate-400
  year2025: '#3b82f6', // blue-500
};

// Estilos para tooltips
export const TOOLTIP_STYLES = {
  contentStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    border: '1px solid rgba(203, 213, 225, 0.5)',
    borderRadius: '12px',
    padding: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  labelStyle: {
    color: '#1e293b',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  itemStyle: {
    color: '#475569',
  },
};

// Estilos para ejes
export const AXIS_STYLES = {
  stroke: '#cbd5e1',
  style: {
    fontSize: '12px',
    fill: '#64748b',
  },
};

// Estilos para grid
export const GRID_STYLES = {
  stroke: '#e2e8f0',
  strokeDasharray: '3 3',
};

// Estilos para leyendas
export const LEGEND_STYLES = {
  wrapperStyle: {
    paddingTop: '20px',
  },
  iconType: 'circle',
};
