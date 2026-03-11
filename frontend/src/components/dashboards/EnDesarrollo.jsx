import { motion } from 'framer-motion';
import { Construction, Clock, Database } from 'lucide-react';

export default function EnDesarrollo({ titulo, descripcion, modulo }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border-2 border-slate-700 shadow-2xl">
          {/* Icono animado */}
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full"></div>
              <Construction className="w-24 h-24 text-yellow-500 relative z-10" />
            </div>
          </motion.div>

          {/* Título */}
          <h2 className="text-3xl font-bold text-center text-white mb-4">
            {titulo || 'Módulo en Desarrollo'}
          </h2>

          {/* Descripción */}
          <p className="text-center text-gray-400 text-lg mb-8">
            {descripcion || 'Este dashboard está siendo configurado y pronto estará disponible con información actualizada.'}
          </p>

          {/* Cards informativos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-700/50 rounded-xl p-4 border border-slate-600"
            >
              <Clock className="w-8 h-8 text-blue-400 mb-2" />
              <h3 className="text-sm font-semibold text-white mb-1">En Proceso</h3>
              <p className="text-xs text-gray-400">Configuración en curso</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-700/50 rounded-xl p-4 border border-slate-600"
            >
              <Database className="w-8 h-8 text-green-400 mb-2" />
              <h3 className="text-sm font-semibold text-white mb-1">Datos Pendientes</h3>
              <p className="text-xs text-gray-400">Esperando información</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-700/50 rounded-xl p-4 border border-slate-600"
            >
              <Construction className="w-8 h-8 text-yellow-400 mb-2" />
              <h3 className="text-sm font-semibold text-white mb-1">Próximamente</h3>
              <p className="text-xs text-gray-400">Disponible pronto</p>
            </motion.div>
          </div>

          {/* Módulo específico */}
          {modulo && (
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
              <p className="text-sm text-gray-300 text-center">
                <span className="font-semibold text-yellow-400">Módulo:</span> {modulo}
              </p>
            </div>
          )}

          {/* Mensaje adicional */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Este dashboard se activará automáticamente cuando los datos estén disponibles en la base de datos.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
