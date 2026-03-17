import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, Info, X } from 'lucide-react';

export default function OperacionesVehiculosDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);

  if (!data || !data.mantenimientoVehiculos) {
    // datos hardcodeados, continuar
  }

  const { mantenimientoVehiculos = [] } = data || {};

  // Valores hardcodeados del texto fuente (reducción de $166.084.545 vs 2024)
  const costo2024 = 356022963;
  const costo2025 = 189938418;
  const ahorro = costo2024 - costo2025; // 166.084.545

  const fmt = (v) => v.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-6 border border-green-300">
        <p className="text-gray-700">Se observa una reducción de <strong className="text-green-700">$166.084.545,00</strong> respecto al año anterior, para el año 2026 se proyecta realizar renovación de la flota.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        onClick={() => setModalOpen(true)}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 cursor-pointer hover:border-purple-500 transition-all">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Mantenimiento de Vehículos</h3>
            <p className="text-sm text-gray-600 mt-1">Reducción de $166.084.545 (-46,65%) vs 2024</p>
          </div>
          <Info className="w-6 h-6 text-purple-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-300">
            <h4 className="text-lg font-bold text-gray-600 mb-3">2024</h4>
            <div className="text-3xl font-bold text-gray-900 mb-1">${fmt(costo2024)}</div>
            <div className="text-xs text-gray-600">Costo total mantenimiento</div>
          </div>

          <div className="bg-green-50 rounded-xl p-5 border-2 border-green-500/50">
            <h4 className="text-lg font-bold text-green-600 mb-3">2025</h4>
            <div className="text-3xl font-bold text-gray-900 mb-1">${fmt(costo2025)}</div>
            <div className="text-xs text-gray-600">Costo total mantenimiento</div>
            <div className="mt-3 pt-3 border-t border-gray-300 flex items-center gap-1">
              <TrendingDown className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-bold text-sm">-46,65%</span>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-500/50">
            <h4 className="text-lg font-bold text-blue-600 mb-3">Ahorro Logrado</h4>
            <div className="text-3xl font-bold text-gray-900 mb-1">${fmt(ahorro)}</div>
            <div className="text-xs text-gray-600">Reducción vs año anterior</div>
            <div className="mt-3 pt-3 border-t border-gray-300">
              <div className="text-xs text-blue-600">Proyección 2026: renovación de flota</div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-amber-50 rounded-lg p-3 border border-amber-300">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Vehículo con mayor costo:</span> SPS-047 — en abril 2025 se cambió sistema hidráulico de dirección y la caja de este sistema.
          </p>
        </div>
      </motion.div>

      {createPortal(
        <AnimatePresence>
          {modalOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
              onClick={() => setModalOpen(false)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-cyan-500 shadow-2xl"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Info className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-xl font-bold text-gray-900">Costos de Mantenimiento de Vehículos</h3>
                  </div>
                  <button onClick={() => setModalOpen(false)} className="text-gray-600 hover:text-gray-900"><X className="w-6 h-6" /></button>
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>Se observa una reducción de <strong className="text-green-600">$166.084.545,00</strong> respecto al año anterior, para el año 2026 se proyecta realizar renovación de la flota.</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">2024</p>
                      <p className="text-xl font-bold text-gray-900">${fmt(costo2024)}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <p className="text-xs text-green-600 font-semibold mb-1">2025</p>
                      <p className="text-xl font-bold text-green-700">${fmt(costo2025)}</p>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                    <p className="text-sm font-semibold text-green-800 mb-2">Reducción Lograda:</p>
                    <p className="text-sm text-gray-700">La reducción del <strong>46,65%</strong> representa una gestión eficiente de mantenimiento vehicular.</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300">
                    <p className="text-sm font-semibold text-red-800 mb-2">Vehículo con Mayor Costo:</p>
                    <p className="text-sm text-gray-700"><strong>SPS-047</strong> — en abril 2025 se cambió sistema hidráulico de dirección y la caja de este sistema.</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                    <p className="text-sm font-semibold text-blue-800 mb-2">Proyección 2026:</p>
                    <p className="text-sm text-gray-700">Se proyecta realizar renovación de la flota.</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Entendido</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>, document.body
      )}
    </div>
  );
}
