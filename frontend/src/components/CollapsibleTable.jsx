import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const fmt = (value) => {
  if (value === null || value === undefined || value === '') return '0';
  const v = parseFloat(value);
  if (isNaN(v)) return String(value);
  return new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);
};

export { fmt };

/**
 * totalRow: array de celdas a mostrar cuando la tabla está cerrada
 * Cada celda: { label: string, color?: string (tailwind text class) }
 * Ejemplo: [
 *   { label: 'TOTAL GASTOS LOGÍSTICOS 2024 VS 2025' },
 *   { label: '$ 4.346.208', color: 'text-cyan-600' },
 *   { label: '$ 4.233.832', color: 'text-orange-500' },
 *   { label: '-2.59%', color: 'text-green-500', badge: true },
 *   { label: '$ 112.376', color: 'text-orange-500' },
 * ]
 */
export default function CollapsibleTable({ title, children, defaultOpen = false, className = '', totalRow = null }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Header clickeable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
      >
        <h3 className="text-base font-bold text-white">{title}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-white" />
        </motion.div>
      </button>

      {/* Fila de total visible cuando está cerrado */}
      <AnimatePresence initial={false}>
        {!isOpen && totalRow && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-gray-200"
          >
            <div className="flex items-center gap-4 px-6 py-3 bg-gray-50 flex-wrap">
              {totalRow.map((cell, idx) => (
                <span
                  key={idx}
                  className={`text-sm font-bold tabular-nums ${cell.color || 'text-gray-900'} ${idx === 0 ? 'flex-1 min-w-0' : 'shrink-0'}`}
                >
                  {cell.badge ? (
                    <span className={`inline-flex items-center gap-1 ${cell.color || 'text-gray-900'}`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs text-white ${cell.badgeColor || 'bg-gray-500'}`}>
                        {cell.badgeIcon || '•'}
                      </span>
                      {cell.type === 'number' ? fmt(cell.label) : cell.label}
                    </span>
                  ) : cell.type === 'number' ? fmt(cell.label) : cell.label}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenido desplegable */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 overflow-x-auto">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
