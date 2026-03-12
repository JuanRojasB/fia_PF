// Paleta de colores para tema claro/blanco
export const lightTheme = {
  // Backgrounds
  bg: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    card: '#ffffff',
    cardHover: '#f8fafc',
  },
  
  // Borders
  border: {
    light: '#e2e8f0',
    medium: '#cbd5e1',
    dark: '#94a3b8',
  },
  
  // Text
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    tertiary: '#64748b',
    muted: '#94a3b8',
  },
  
  // Colors for charts and data visualization
  chart: {
    blue: '#3b82f6',
    green: '#10b981',
    yellow: '#f59e0b',
    red: '#ef4444',
    purple: '#8b5cf6',
    orange: '#f97316',
    pink: '#ec4899',
    indigo: '#6366f1',
    teal: '#14b8a6',
    cyan: '#06b6d4',
  },
  
  // Gradients for cards
  gradient: {
    blue: 'from-blue-50 to-blue-100',
    green: 'from-green-50 to-green-100',
    yellow: 'from-yellow-50 to-yellow-100',
    red: 'from-red-50 to-red-100',
    purple: 'from-purple-50 to-purple-100',
    orange: 'from-orange-50 to-orange-100',
    pink: 'from-pink-50 to-pink-100',
    indigo: 'from-indigo-50 to-indigo-100',
    gray: 'from-gray-50 to-gray-100',
  },
  
  // Border colors for cards
  borderColor: {
    blue: 'border-blue-300',
    green: 'border-green-300',
    yellow: 'border-yellow-300',
    red: 'border-red-300',
    purple: 'border-purple-300',
    orange: 'border-orange-300',
    pink: 'border-pink-300',
    indigo: 'border-indigo-300',
    gray: 'border-gray-300',
  },
  
  // Icon colors
  icon: {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    pink: 'text-pink-600',
    indigo: 'text-indigo-600',
  },
  
  // Status colors
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
};

// Estilos comunes para componentes
export const commonStyles = {
  card: `bg-white rounded-xl p-6 border-2 shadow-sm hover:shadow-md transition-all`,
  cardGradient: (color) => `bg-gradient-to-br ${lightTheme.gradient[color]} rounded-xl p-6 border-2 ${lightTheme.borderColor[color]} shadow-sm hover:shadow-md transition-all`,
  table: {
    container: 'bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm',
    header: 'border-b-2 border-gray-300 bg-gray-50',
    row: 'border-b border-gray-200 hover:bg-gray-50 transition-colors',
    cell: 'py-3 px-4',
  },
  chart: {
    container: 'bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-md transition-all',
    tooltip: { backgroundColor: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' },
    grid: '#e2e8f0',
    axis: '#64748b',
  },
};
