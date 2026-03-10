import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info } from 'lucide-react';

export default function ProduccionDetalleDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  // Manejar estructura del backend: { sacrificio: [...], encasetado: [...], totales: {...} }
  // o array directo para compatibilidad
  let sacrificioData = [];
  
  if (Array.isArray(data)) {
    // Formato antiguo: array con tipo
    sacrificioData = data.filter(d => d.tipo === 'SACRIFICIO');
  } else if (data && typeof data === 'object') {
    // Formato nuevo: objeto con propiedades
    sacrificioData = data.sacrificio || [];
  }
  
  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Orden correcto de meses
  const ordenMeses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 
                      'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
  
  const mesesAbreviados = {
    'ENERO': 'ENE',
    'FEBRERO': 'FEB',
    'MARZO': 'MAR',
    'ABRIL': 'ABR',
    'MAYO': 'MAY',
    'JUNIO': 'JUN',
    'JULIO': 'JUL',
    'AGOSTO': 'AGO',
    'SEPTIEMBRE': 'SEP',
    'OCTUBRE': 'OCT',
    'NOVIEMBRE': 'NOV',
    'DICIEMBRE': 'DIC'
  };

  // Procesar datos de SACRIFICIO
  const sacrificioMap = {};
  
  ordenMeses.forEach(mes => {
    sacrificioMap[mes] = { 
      mes: mesesAbreviados[mes] || mes,
      mesCompleto: mes,
      prog2024: 0, 
      real2024: 0,
      comprado2024: 0,
      total2024: 0,
      maximalim2024: 0,
      progr_fiesta2024: 0,
      entre_real_pf2024: 0,
      prog2025: 0, 
      real2025: 0,
      comprado2025: 0,
      total2025: 0,
      maximalim2025: 0,
      progr_fiesta2025: 0,
      entre_real_pf2025: 0
    };
  });
  
  sacrificioData.forEach(d => {
    const mes = d.mes || 'N/A';
    if (sacrificioMap[mes]) {
      const prog = parseFloat(d.programado) || 0;
      const real = parseFloat(d.real) || 0;
      const comprado = parseFloat(d.comprado) || 0;
      const total = parseFloat(d.total) || 0;
      const maximalim = parseFloat(d.maximalim) || 0;
      const progrFiesta = parseFloat(d.progr_fiesta) || 0;
      const entreRealPf = parseFloat(d.entre_real_pf) || 0;
      
      if (d.anio === 2024) {
        sacrificioMap[mes].prog2024 += prog;
        sacrificioMap[mes].real2024 += real;
        sacrificioMap[mes].comprado2024 += comprado;
        sacrificioMap[mes].total2024 += total;
        sacrificioMap[mes].maximalim2024 += maximalim;
        sacrificioMap[mes].progr_fiesta2024 += progrFiesta;
        sacrificioMap[mes].entre_real_pf2024 += entreRealPf;
      } else if (d.anio === 2025) {
        sacrificioMap[mes].prog2025 += prog;
        sacrificioMap[mes].real2025 += real;
        sacrificioMap[mes].comprado2025 += comprado;
        sacrificioMap[mes].total2025 += total;
        sacrificioMap[mes].maximalim2025 += maximalim;
        sacrificioMap[mes].progr_fiesta2025 += progrFiesta;
        sacrificioMap[mes].entre_real_pf2025 += entreRealPf;
      }
    }
  });

  const sacrificioMeses = ordenMeses.map(mes => sacrificioMap[mes]);

  // Calcular totales
  const totalSacrificio2024 = sacrificioMeses.reduce((sum, d) => sum + (d.real2024 || 0), 0);
  const totalSacrificio2025 = sacrificioMeses.reduce((sum, d) => sum + (d.real2025 || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Gestión de Producción - Detalle Mensual</h2>
        <p className="text-gray-400 mt-2">Información completa de sacrificio de pollo por mes</p>
      </div>

      {/* Tabla Detallada de Sacrificio */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700 overflow-x-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Detalle Mensual - Pollo Sacrificado</h3>
          <button
            onClick={() => openModal(
              'Detalle Mensual - Pollo Sacrificado', 
              'Desglose completo del sacrificio mensual. PROG=meta planificada. REAL=producción propia Pollo Fiesta. COMPRADO=aves externas para complementar. TOTAL=Real+Comprado (volumen procesado). MAXIALIM=compromiso con cliente Maxialim. PROGR FIESTA=programación interna. ENTRE-REAL-PF=diferencia entre entrega real y programación. Evalúa cumplimiento de metas, dependencia de compras externas y eficiencia operativa.'
            )}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Info className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-red-900/30 border-b-2 border-red-700">
              <th className="text-left py-3 px-3 text-white font-bold">AÑO</th>
              <th className="text-left py-3 px-3 text-white font-bold">MES</th>
              <th className="text-right py-3 px-3 text-white font-bold">PROG</th>
              <th className="text-right py-3 px-3 text-white font-bold">REAL</th>
              <th className="text-right py-3 px-3 text-white font-bold">COMPRADO</th>
              <th className="text-right py-3 px-3 text-white font-bold">TOTAL</th>
              <th className="text-right py-3 px-3 text-white font-bold">MAXIALIM</th>
              <th className="text-right py-3 px-3 text-white font-bold">PROGR FIESTA</th>
              <th className="text-right py-3 px-3 text-white font-bold">ENTRE-REAL-PF</th>
            </tr>
          </thead>
          <tbody>
            {/* 2024 */}
            {sacrificioMeses.map((row2024, idx) => {
              if (!row2024.prog2024 && !row2024.real2024) return null;
              const comprado = row2024.comprado2024 || 0;
              const total = row2024.total2024 || 0;
              const maximalim = row2024.maximalim2024 || 0;
              const progrFiesta = row2024.progr_fiesta2024 || 0;
              const entreRealPf = row2024.entre_real_pf2024 || 0;
              
              return (
                <tr key={`2024-${idx}`} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                  <td className="py-2 px-3 text-indigo-400 font-semibold">2024</td>
                  <td className="py-2 px-3 text-white">{row2024.mes}</td>
                  <td className="py-2 px-3 text-right text-indigo-300 tabular-nums">{formatNumber(row2024.prog2024)}</td>
                  <td className="py-2 px-3 text-right text-indigo-200 font-bold tabular-nums">{formatNumber(row2024.real2024)}</td>
                  <td className="py-2 px-3 text-right text-yellow-300 tabular-nums">{formatNumber(comprado)}</td>
                  <td className="py-2 px-3 text-right text-green-300 font-semibold tabular-nums">{formatNumber(total)}</td>
                  <td className="py-2 px-3 text-right text-orange-300 tabular-nums">{formatNumber(maximalim)}</td>
                  <td className="py-2 px-3 text-right text-cyan-300 tabular-nums">{formatNumber(progrFiesta)}</td>
                  <td className="py-2 px-3 text-right text-purple-300 tabular-nums">{formatNumber(entreRealPf)}</td>
                </tr>
              );
            })}
            {/* Total 2024 */}
            <tr className="bg-indigo-900/20 border-y-2 border-indigo-700 font-bold">
              <td className="py-3 px-3 text-indigo-300">2024</td>
              <td className="py-3 px-3 text-indigo-300">TOTAL</td>
              <td className="py-3 px-3 text-right text-indigo-200 tabular-nums">{formatNumber(sacrificioMeses.reduce((sum, d) => sum + (d.prog2024 || 0), 0))}</td>
              <td className="py-3 px-3 text-right text-indigo-100 tabular-nums">{formatNumber(totalSacrificio2024)}</td>
              <td className="py-3 px-3 text-right text-yellow-200 tabular-nums">{formatNumber(sacrificioMeses.reduce((sum, d) => sum + (d.comprado2024 || 0), 0))}</td>
              <td className="py-3 px-3 text-right text-green-200 tabular-nums">{formatNumber(sacrificioMeses.reduce((sum, d) => sum + (d.total2024 || 0), 0))}</td>
              <td className="py-3 px-3 text-right text-orange-200 tabular-nums">{formatNumber(sacrificioMeses.reduce((sum, d) => sum + (d.maximalim2024 || 0), 0))}</td>
              <td className="py-3 px-3 text-right text-cyan-200 tabular-nums">{formatNumber(sacrificioMeses.reduce((sum, d) => sum + (d.progr_fiesta2024 || 0), 0))}</td>
              <td className="py-3 px-3 text-right text-purple-200 tabular-nums">{formatNumber(sacrificioMeses.reduce((sum, d) => sum + (d.entre_real_pf2024 || 0), 0))}</td>
            </tr>
            {/* 2025 */}
            {sacrificioMeses.map((row2025, idx) => {
              if (!row2025.prog2025 && !row2025.real2025) return null;
              const comprado = row2025.comprado2025 || 0;
              const total = row2025.total2025 || 0;
              const maximalim = row2025.maximalim2025 || 0;
              const progrFiesta = row2025.progr_fiesta2025 || 0;
              const entreRealPf = row2025.entre_real_pf2025 || 0;
              
              return (
                <tr key={`2025-${idx}`} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                  <td className="py-2 px-3 text-emerald-400 font-semibold">2025</td>
                  <td className="py-2 px-3 text-white">{row2025.mes}</td>
                  <td className="py-2 px-3 text-right text-emerald-300 tabular-nums">{formatNumber(row2025.prog2025)}</td>
                  <td className="py-2 px-3 text-right text-emerald-200 font-bold tabular-nums">{formatNumber(row2025.real2025)}</td>
                  <td className="py-2 px-3 text-right text-yellow-300 tabular-nums">{formatNumber(comprado)}</td>
                  <td className="py-2 px-3 text-right text-green-300 font-semibold tabular-nums">{formatNumber(total)}</td>
                  <td className="py-2 px-3 text-right text-orange-300 tabular-nums">{formatNumber(maximalim)}</td>
                  <td className="py-2 px-3 text-right text-cyan-300 tabular-nums">{formatNumber(progrFiesta)}</td>
                  <td className="py-2 px-3 text-right text-purple-300 tabular-nums">{formatNumber(entreRealPf)}</td>
                </tr>
              );
            })}
            {/* Total 2025 */}
            <tr className="bg-emerald-900/20 border-y-2 border-emerald-700 font-bold">
              <td className="py-3 px-3 text-emerald-300">2025</td>
              <td className="py-3 px-3 text-emerald-300">TOTAL</td>
              <td className="py-3 px-3 text-right text-emerald-200 tabular-nums">{formatNumber(sacrificioMeses.reduce((sum, d) => sum + (d.prog2025 || 0), 0))}</td>
              <td className="py-3 px-3 text-right text-emerald-100 tabular-nums">{formatNumber(totalSacrificio2025)}</td>
              <td className="py-3 px-3 text-right text-yellow-200 tabular-nums">{formatNumber(sacrificioMeses.reduce((sum, d) => sum + (d.comprado2025 || 0), 0))}</td>
              <td className="py-3 px-3 text-right text-green-200 tabular-nums">{formatNumber(sacrificioMeses.reduce((sum, d) => sum + (d.total2025 || 0), 0))}</td>
              <td className="py-3 px-3 text-right text-orange-200 tabular-nums">{formatNumber(sacrificioMeses.reduce((sum, d) => sum + (d.maximalim2025 || 0), 0))}</td>
              <td className="py-3 px-3 text-right text-cyan-200 tabular-nums">{formatNumber(sacrificioMeses.reduce((sum, d) => sum + (d.progr_fiesta2025 || 0), 0))}</td>
              <td className="py-3 px-3 text-right text-purple-200 tabular-nums">{formatNumber(sacrificioMeses.reduce((sum, d) => sum + (d.entre_real_pf2025 || 0), 0))}</td>
            </tr>
          </tbody>
        </table>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-xl p-6 max-w-4xl w-full border-4 border-indigo-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-indigo-400" />
                  <h3 className="text-xl font-bold text-white">{modalContent.title}</h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-gray-300 leading-relaxed">
                {modalContent.description}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
