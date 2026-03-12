import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, TrendingDown, Users, Droplet, Recycle, FileCheck, X, Info, CheckCircle, AlertTriangle } from 'lucide-react';

export default function CalidadDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal('Accidentes de Trabajo', 'Se registraron 112 accidentes de trabajo en 2025, con picos en áreas como planta de beneficio y posproceso. Se implementó gimnasia laboral para mitigar riesgos osteomusculares y fortalecer el clima organizacional.')}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">Accidentes Laborales</span>
            <AlertTriangle className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">112</div>
          <div className="text-xs text-gray-600">Registrados en 2025</div>
          <div className="text-xs text-gray-500 mt-1">Planta y posproceso</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal('Reducción de PQRs', 'Reducción de PQRs en un 28.45% respecto a 2024, reflejando mejoras en la experiencia del cliente y en los procesos de calidad.')}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">Reducción PQRs</span>
            <TrendingDown className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">-28.45%</div>
          <div className="text-xs text-gray-600">vs 2024</div>
          <div className="text-xs text-green-400 mt-1">Mejora continua</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal('Planes de Acción', 'Incremento en planes de acción: 154 en 2025, un 27.92% más que en 2024. Implementación de metodologías de análisis causales y capacitación a líderes.')}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">Planes de Acción</span>
            <FileCheck className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">154</div>
          <div className="text-xs text-gray-600">Ejecutados en 2025</div>
          <div className="text-xs text-blue-400 mt-1">+27.92% vs 2024</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal('Auditorías Internas', 'Realización de auditorías internas bajo la norma ISO 9001:2015 en 14 procesos. Avances en la transición hacia la ISO 9001:2026.')}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">Auditorías ISO</span>
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">14</div>
          <div className="text-xs text-gray-600">Procesos auditados</div>
          <div className="text-xs text-purple-400 mt-1">ISO 9001:2015</div>
        </motion.div>
      </div>

      {/* Gestión Ambiental */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Gestión Ambiental 2025</h3>
            <p className="text-sm text-gray-400 mt-1">Reducción de consumo y gestión de residuos</p>
          </div>
          <button onClick={() => openModal('Gestión Ambiental', 'Reducción del consumo de agua potable por ave beneficiada: 5.9% respecto a 2024 y 16.07% respecto a 2023. Gestión de residuos sólidos: aumento del 24.65% en residuos aprovechables respecto a 2024. Realización de 23 capacitaciones y 24 sensibilizaciones sobre prevención de plagas, manejo de residuos y ahorro de recursos.')} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <Info className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reducción Agua */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl p-5 border-2 border-blue-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Droplet className="w-6 h-6 text-blue-400" />
              <h4 className="text-lg font-bold text-blue-400">Consumo de Agua</h4>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-blue-500/20">
                <div className="text-sm text-gray-400 mb-1">vs 2024</div>
                <div className="text-4xl font-bold text-white mb-2">-5.9%</div>
                <div className="text-xs text-gray-400 leading-relaxed">
                  Por ave beneficiada
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-blue-500/20">
                <div className="text-sm text-gray-400 mb-1">vs 2023</div>
                <div className="text-4xl font-bold text-white mb-2">-16.07%</div>
                <div className="text-xs text-gray-400 leading-relaxed">
                  Reducción acumulada
                </div>
              </div>
            </div>
          </div>

          {/* Residuos Aprovechables */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl p-5 border-2 border-green-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Recycle className="w-6 h-6 text-green-400" />
              <h4 className="text-lg font-bold text-green-400">Residuos Aprovechables</h4>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-green-500/20">
                <div className="text-sm text-gray-400 mb-1">Incremento 2025</div>
                <div className="text-4xl font-bold text-white mb-2">+24.65%</div>
                <div className="text-xs text-gray-400 leading-relaxed">
                  vs 2024
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-red-500/20">
                <div className="text-sm text-gray-400 mb-1">Canastillas rotas</div>
                <div className="text-4xl font-bold text-white mb-2">-20.02%</div>
                <div className="text-xs text-gray-400 leading-relaxed">
                  Reducción vs 2024
                </div>
              </div>
            </div>
          </div>

          {/* Capacitaciones */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-5 border-2 border-purple-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-6 h-6 text-purple-400" />
              <h4 className="text-lg font-bold text-purple-400">Capacitaciones</h4>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
                <div className="text-sm text-gray-400 mb-1">Ambientales</div>
                <div className="text-4xl font-bold text-white mb-2">23</div>
                <div className="text-xs text-gray-400 leading-relaxed">
                  Capacitaciones realizadas
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
                <div className="text-sm text-gray-400 mb-1">Sensibilizaciones</div>
                <div className="text-4xl font-bold text-white mb-2">24</div>
                <div className="text-xs text-gray-400 leading-relaxed">
                  Prevención y manejo
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Seguridad y Salud en el Trabajo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Seguridad y Salud en el Trabajo</h3>
            <p className="text-sm text-gray-400 mt-1">Actividades y capacitaciones SST 2025</p>
          </div>
          <button onClick={() => openModal('SST 2025', 'Ejecución de un simulacro de evacuación en octubre y 22 capacitaciones con 347 asistentes. Implementación de gimnasia laboral para mitigar riesgos osteomusculares. Retorno de visitas a sedes y puntos de venta para inspecciones de seguridad. Actualización de documentos como matriz legal, matriz de riesgos y reglamento de higiene y seguridad industrial.')} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <Info className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 rounded-lg p-4 border border-cyan-500/30">
            <div className="text-xs text-gray-400 mb-1">Capacitaciones</div>
            <div className="text-3xl font-bold text-white">22</div>
            <div className="text-xs text-gray-500 mt-1">Realizadas</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-lg p-4 border border-green-500/30">
            <div className="text-xs text-gray-400 mb-1">Asistentes</div>
            <div className="text-3xl font-bold text-white">347</div>
            <div className="text-xs text-gray-500 mt-1">Participantes</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-lg p-4 border border-purple-500/30">
            <div className="text-xs text-gray-400 mb-1">Simulacros</div>
            <div className="text-3xl font-bold text-white">1</div>
            <div className="text-xs text-gray-500 mt-1">Octubre 2025</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-lg p-4 border border-orange-500/30">
            <div className="text-xs text-gray-400 mb-1">Gimnasia Laboral</div>
            <div className="text-2xl font-bold text-white">Activa</div>
            <div className="text-xs text-gray-500 mt-1">Prevención</div>
          </div>
        </div>
      </motion.div>

      {/* Sistema de Gestión de Calidad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">Sistema de Gestión ISO</h3>
              <p className="text-xs text-gray-400 mt-1">Transición a ISO 9001:2026</p>
            </div>
            <button onClick={() => openModal('ISO 9001', 'Actualización de matrices de partes interesadas, DOFA/PESTEL y caracterización de procesos. Implementación de la plataforma ISOLUCION para digitalizar el sistema de gestión de calidad. Avances en la transición hacia la ISO 9001:2026, con mayor integración digital y tecnológica, reorganización del capítulo de mejora y énfasis en la experiencia del cliente.')} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
              <Info className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium text-white">Plataforma ISOLUCION</div>
                <div className="text-xs text-gray-400">Digitalización del SGC</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium text-white">Comité Triángulo de Calidad</div>
                <div className="text-xs text-gray-400">Ejecución mensual</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
              <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium text-white">Actualización CRM SIESA</div>
                <div className="text-xs text-gray-400">Trazabilidad mejorada</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">Encuestas de Satisfacción</h3>
              <p className="text-xs text-gray-400 mt-1">Medición experiencia del cliente</p>
            </div>
            <button onClick={() => openModal('Satisfacción Cliente', 'Ejecución de 1.166 encuestas de satisfacción, con una disminución del 38% frente a 2024. La reducción de PQRs en un 28.45% refleja mejoras en la experiencia del cliente.')} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
              <Info className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 rounded-lg p-5 border border-cyan-500/30 mb-4">
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">1,166</div>
              <div className="text-sm text-gray-300">Encuestas Realizadas 2025</div>
              <div className="text-xs text-gray-500 mt-1">-38% vs 2024</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-700/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-400">-28.45%</div>
              <div className="text-xs text-gray-400 mt-1">Reducción PQRs</div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-400">+27.92%</div>
              <div className="text-xs text-gray-400 mt-1">Planes acción</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Líneas de Acción */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-xl p-6 border border-blue-500/30"
      >
        <h3 className="text-xl font-bold text-white mb-4">Líneas de Acción 2025</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
            <h4 className="text-sm font-bold text-blue-400 mb-2">Dirección Estratégica</h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              Conexión estrategia-ejecución, priorización de riesgos y decisiones informadas
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
            <h4 className="text-sm font-bold text-green-400 mb-2">Mejora Continua</h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              Cultura de mejora y enfoque preventivo alineado con ISO 9001:2026
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
            <h4 className="text-sm font-bold text-purple-400 mb-2">Gestión de Riesgos</h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              Integración de riesgos y cumplimiento normativo sanitario y ambiental
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
            <h4 className="text-sm font-bold text-cyan-400 mb-2">Transformación Digital</h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              Migración a ISOLUCION y actualización CRM SIESA para mejor trazabilidad
            </p>
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full border-4 border-cyan-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">{modalContent.title}</h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-gray-300 leading-relaxed">{modalContent.description}</div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors">
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
