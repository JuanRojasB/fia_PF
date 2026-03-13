/**
 * Utilidades para estandarizar colores en la aplicación
 */

/**
 * Obtiene el color según el valor numérico
 * @param {number} value - Valor numérico (puede incluir %)
 * @param {number} threshold - Umbral para considerar neutral (default: 0.5)
 * @returns {object} - Objeto con colores para texto y fondo
 */
export const getValueColor = (value, threshold = 0.5) => {
  const numValue = typeof value === 'string' ? parseFloat(value.replace('%', '').replace(',', '.')) : value;
  
  if (isNaN(numValue)) {
    return {
      text: 'text-gray-700',
      bg: 'bg-gray-100',
      border: 'border-gray-300',
      textRgb: 'rgb(55, 65, 81)',
      bgRgb: 'rgba(243, 244, 246, 0.8)',
      borderRgb: 'rgb(209, 213, 219)'
    };
  }
  
  // Positivo (verde)
  if (numValue > threshold) {
    return {
      text: 'text-green-700',
      bg: 'bg-green-50',
      border: 'border-green-300',
      textRgb: 'rgb(21, 128, 61)',
      bgRgb: 'rgba(240, 253, 244, 0.9)',
      borderRgb: 'rgb(134, 239, 172)'
    };
  }
  
  // Negativo (rojo)
  if (numValue < -threshold) {
    return {
      text: 'text-red-700',
      bg: 'bg-red-50',
      border: 'border-red-300',
      textRgb: 'rgb(185, 28, 28)',
      bgRgb: 'rgba(254, 242, 242, 0.9)',
      borderRgb: 'rgb(252, 165, 165)'
    };
  }
  
  // Neutral/Constante (naranja/amarillo)
  return {
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    textRgb: 'rgb(180, 83, 9)',
    bgRgb: 'rgba(255, 251, 235, 0.9)',
    borderRgb: 'rgb(252, 211, 77)'
  };
};

/**
 * Obtiene el color según el tipo de variación
 * @param {string} variation - 'increase', 'decrease', 'neutral'
 * @returns {object} - Objeto con colores
 */
export const getVariationColor = (variation) => {
  switch (variation) {
    case 'increase':
    case 'positive':
      return {
        text: 'text-green-700',
        bg: 'bg-green-50',
        border: 'border-green-300',
        textRgb: 'rgb(21, 128, 61)',
        bgRgb: 'rgba(240, 253, 244, 0.9)',
        borderRgb: 'rgb(134, 239, 172)'
      };
    case 'decrease':
    case 'negative':
      return {
        text: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-300',
        textRgb: 'rgb(185, 28, 28)',
        bgRgb: 'rgba(254, 242, 242, 0.9)',
        borderRgb: 'rgb(252, 165, 165)'
      };
    case 'neutral':
    case 'constant':
    default:
      return {
        text: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-300',
        textRgb: 'rgb(180, 83, 9)',
        bgRgb: 'rgba(255, 251, 235, 0.9)',
        borderRgb: 'rgb(252, 211, 77)'
      };
  }
};

/**
 * Colores mejorados para tablas con mejor contraste
 */
export const tableColors = {
  header: {
    bg: 'bg-gradient-to-r from-blue-600 to-blue-700',
    text: 'text-white',
    bgRgb: 'linear-gradient(to right, rgb(37, 99, 235), rgb(29, 78, 216))',
    textRgb: 'rgb(255, 255, 255)'
  },
  row: {
    even: {
      bg: 'bg-white',
      bgRgb: 'rgba(255, 255, 255, 0.95)'
    },
    odd: {
      bg: 'bg-gray-50',
      bgRgb: 'rgba(249, 250, 251, 0.95)'
    },
    hover: {
      bg: 'hover:bg-blue-50',
      bgRgb: 'rgba(239, 246, 255, 0.95)'
    }
  },
  cell: {
    text: 'text-gray-900',
    textRgb: 'rgb(17, 24, 39)',
    border: 'border-gray-200',
    borderRgb: 'rgb(229, 231, 235)'
  }
};

/**
 * Formatea un valor con su color correspondiente
 * @param {number|string} value - Valor a formatear
 * @param {boolean} isPercentage - Si es porcentaje
 * @param {number} threshold - Umbral para neutral
 * @returns {object} - Objeto con valor formateado y colores
 */
export const formatValueWithColor = (value, isPercentage = false, threshold = 0.5) => {
  const colors = getValueColor(value, threshold);
  const numValue = typeof value === 'string' ? parseFloat(value.replace('%', '').replace(',', '.')) : value;
  
  let formattedValue = numValue;
  if (!isNaN(numValue)) {
    formattedValue = numValue.toFixed(2);
    if (isPercentage) {
      formattedValue += '%';
    }
  }
  
  return {
    value: formattedValue,
    colors
  };
};
