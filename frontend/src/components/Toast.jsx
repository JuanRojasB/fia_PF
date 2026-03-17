import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, X } from 'lucide-react';

/**
 * Notificación fija de cambio de dashboard.
 * Se muestra en la esquina superior derecha y permanece visible.
 * Se cierra al hacer click en X o al cambiar de dashboard (el padre la reemplaza).
 */
export default function Toast({ message, isVisible, onClose }) {

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key={message}
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed top-24 right-4 z-[9999]"
          style={{ minWidth: '260px', maxWidth: '380px' }}
        >
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl"
            style={{
              background: 'rgba(255,255,255,0.97)',
              border: '2px solid rgba(59,130,246,0.4)',
              backdropFilter: 'blur(12px)'
            }}
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium">Dashboard activo</p>
              <p className="text-sm font-bold text-gray-900 truncate">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
