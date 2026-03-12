import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Componente Toggle de Tema Claro/Oscuro
 * Permite alternar entre modo claro (para informes/impresión) y modo oscuro (para pantalla)
 */
export default function ThemeToggle({ isDark, onToggle }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`fixed top-4 right-4 z-50 p-3 rounded-xl shadow-lg transition-all ${
        isDark 
          ? 'bg-slate-800 border border-slate-700 text-yellow-400 hover:bg-slate-700' 
          : 'bg-white border border-gray-300 text-blue-600 hover:bg-gray-50'
      }`}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {isDark ? (
        <Sun className="w-6 h-6" />
      ) : (
        <Moon className="w-6 h-6" />
      )}
    </motion.button>
  );
}
