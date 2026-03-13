import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, DollarSign, Building, FileText, X, Info } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';

export default function SituacionEconomicaDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('es-CO').format(value);
  };

  return (
    <div className="space-y-6 p-4">
      {/* Título */}
      <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6 border-4 border-green-500/30 shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Situación Económica 2025</h2>
        <p className="text-gray-700">Estado de Resultados, Balance General y Composición Accionaria</p>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer shadow-lg"
          onClick={() => openModal('Utilidad Neta 2025', 'La utilidad neta después de impuestos para el año 2025 se determinó en $15,000 MM con un incremento del 50% respecto a 2024.')}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Utilidad Neta 2025</span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">${formatNumber(15000)}</div>
          <div className="text-sm text-gray-600 mt-1">Millones de pesos</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Crecimiento vs 2024</div>
            <div className="text-lg font-semibold text-green-600">+50.0%</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/95 rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer shadow-lg"
          onClick={() => openModal('Ingresos 2025', 'Los ingresos netos por actividades ordinarias fueron por $165,000 MM con un crecimiento del 10% frente al año 2024.')}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Ingresos 2025</span>
            <DollarSign className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">${formatNumber(165000)}</div>
          <div className="text-sm text-gray-600 mt-1">Millones de pesos</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Crecimiento vs 2024</div>
            <div className="text-lg font-semibold text-blue-600">+10.0%</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/95 rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer shadow-lg"
          onClick={() => openModal('Patrimonio 2025', 'El Patrimonio Contable al 31 de diciembre del año 2025 quedó valorado en $145,000 MM con un fortalecimiento del 20.8%.')}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Patrimonio 2025</span>
            <Building className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">${formatNumber(145000)}</div>
          <div className="text-sm text-gray-600 mt-1">Millones de pesos</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Crecimiento vs 2024</div>
            <div className="text-lg font-semibold text-purple-600">+20.8%</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/95 rounded-xl p-6 border-4 border-cyan-500/30 hover:border-cyan-500 transition-all cursor-pointer shadow-lg"
          onClick={() => openModal('Activos Totales 2025', 'Los activos totales a 31 de diciembre del ejercicio económico del año 2025 cerraron en $230,000 MM con un aumento del 15%.')}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Activos Totales 2025</span>
            <FileText className="w-5 h-5 text-cyan-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">${formatNumber(230000)}</div>
          <div className="text-sm text-gray-600 mt-1">Millones de pesos</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Crecimiento vs 2024</div>
            <div className="text-lg font-semibold text-cyan-600">+15.0%</div>
          </div>
        </motion.div>
      </div>

      {/* Composición Accionaria */}
      <CollapsibleTable 
        title="Composición Accionaria"
        defaultOpen={false}
        className="border-4 border-purple-500/30"
      >
        <div className="mb-4 text-sm text-gray-600">
          Total: {formatNumber(10000)} acciones | Capital: ${formatNumber(100000000)}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-3 text-gray-700 font-bold">Accionista</th>
                <th className="text-left py-3 px-3 text-gray-700 font-bold">NIT</th>
                <th className="text-right py-3 px-3 text-gray-700 font-bold">Acciones</th>
                <th className="text-right py-3 px-3 text-gray-700 font-bold">Capital</th>
                <th className="text-right py-3 px-3 text-gray-700 font-bold">Participación</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-3 text-gray-900">Accionista Principal</td>
                <td className="py-3 px-3 text-gray-600">900.123.456-7</td>
                <td className="text-right py-3 px-3 text-gray-700">{formatNumber(7500)}</td>
                <td className="text-right py-3 px-3 text-gray-700">${formatNumber(75000000)}</td>
                <td className="text-right py-3 px-3 text-blue-600 font-semibold">75.0%</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-3 text-gray-900">Accionista Secundario</td>
                <td className="py-3 px-3 text-gray-600">900.234.567-8</td>
                <td className="text-right py-3 px-3 text-gray-700">{formatNumber(2500)}</td>
                <td className="text-right py-3 px-3 text-gray-700">${formatNumber(25000000)}</td>
                <td className="text-right py-3 px-3 text-blue-600 font-semibold">25.0%</td>
              </tr>
              <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
                <td className="py-3 px-3 text-gray-900" colSpan="2">TOTALES</td>
                <td className="text-right py-3 px-3 text-gray-900">{formatNumber(10000)}</td>
                <td className="text-right py-3 px-3 text-gray-900">${formatNumber(100000000)}</td>
                <td className="text-right py-3 px-3 text-gray-900">100.0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CollapsibleTable>

      {/* Deuda con Accionistas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/95 rounded-xl p-6 border-4 border-green-500/30 shadow-lg"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Deuda con Accionistas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-300 shadow">
            <p className="text-gray-600 text-sm mb-2">Deuda 2024</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(50000)}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border-2 border-green-500/50 shadow">
            <p className="text-gray-600 text-sm mb-2">Deuda 2025</p>
            <p className="text-2xl font-bold text-green-600">${formatNumber(35000)}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border-2 border-green-500/50 shadow">
            <p className="text-gray-600 text-sm mb-2">Reducción</p>
            <p className="text-2xl font-bold text-green-600">-30.0%</p>
            <p className="text-xs text-gray-600 mt-1">${formatNumber(15000)} menos</p>
          </div>
        </div>
        <div className="mt-4 bg-green-50 rounded-lg p-4 border-2 border-green-500/30 shadow">
          <p className="text-sm text-gray-700">
            La deuda con accionistas se disminuyó en cuantía de <strong className="text-green-600">${formatNumber(15000)}</strong>, 
            representando una reducción del <strong className="text-gray-900">30%</strong> respecto al año anterior.
          </p>
        </div>
      </motion.div>

      {/* Agradecimientos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8 border-4 border-amber-500/30 shadow-lg"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">AGRADECIMIENTOS</h3>
        <div className="text-gray-700 text-center max-w-4xl mx-auto space-y-4">
          <p className="text-base leading-relaxed">
            La Gerencia General expresa su más profundo agradecimiento a nuestros estimados accionistas por la confianza depositada en 
            la empresa durante este año de retos y logros compartidos. Su respaldo constante ha sido fundamental para seguir consolidando 
            nuestro liderazgo en el sector avícola, impulsar proyectos estratégicos y fortalecer nuestro compromiso con la calidad, la 
            innovación y la sostenibilidad.
          </p>
          <p className="text-base leading-relaxed">
            Gracias familia Roa a su visión y apoyo, continuamos avanzando con firmeza hacia un crecimiento responsable y sostenible, 
            enfocado en generar valor para todos nuestros grupos de interés y para el futuro de nuestra organización.
          </p>
          <div className="mt-8 pt-6 border-t-2 border-amber-500/30">
            <p className="text-gray-600 text-sm mb-2">Atentamente,</p>
            <div className="mt-6">
              <p className="text-xl font-bold text-gray-900">JOHN HENRY RESTREPO MELO</p>
              <p className="text-amber-600 font-semibold">Gerente General</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-blue-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-blue-600" />
                  <h3 className="text-2xl font-bold text-gray-900">{modalContent.title}</h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              <div className="text-gray-700 leading-relaxed">
                {modalContent.content}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow"
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
