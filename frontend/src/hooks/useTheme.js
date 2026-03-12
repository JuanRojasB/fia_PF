import { useState, useEffect } from 'react';

/**
 * Hook personalizado para manejar el tema claro/oscuro
 * Guarda la preferencia en localStorage
 */
export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true; // Por defecto oscuro
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  // Clases de tema para diferentes elementos
  const theme = {
    // Fondos
    bg: {
      primary: isDark ? 'bg-slate-900' : 'bg-gray-50',
      secondary: isDark ? 'bg-slate-800/50' : 'bg-white',
      card: isDark ? 'bg-slate-800/50' : 'bg-white',
      modal: isDark ? 'bg-slate-800' : 'bg-white',
    },
    // Textos
    text: {
      primary: isDark ? 'text-white' : 'text-gray-900',
      secondary: isDark ? 'text-gray-300' : 'text-gray-700',
      muted: isDark ? 'text-gray-400' : 'text-gray-500',
    },
    // Bordes
    border: {
      primary: isDark ? 'border-slate-700' : 'border-gray-200',
      secondary: isDark ? 'border-slate-600' : 'border-gray-300',
      accent: isDark ? 'border-blue-500/50' : 'border-blue-400',
    },
    // Gráficas
    chart: {
      grid: isDark ? '#374151' : '#e5e7eb',
      axis: isDark ? '#9ca3af' : '#6b7280',
      tooltip: {
        bg: isDark ? '#1e293b' : '#ffffff',
        border: isDark ? '#475569' : '#d1d5db',
      }
    }
  };

  return { isDark, toggleTheme, theme };
}
