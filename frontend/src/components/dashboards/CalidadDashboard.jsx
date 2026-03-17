import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, TrendingDown, Users, Droplet, Recycle, FileCheck, X, Info, CheckCircle, AlertTriangle } from 'lucide-react';

export default function CalidadDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Descripción */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6 border border-blue-300">
        <p className="text-gray-700">Análisis consolidado de los procesos de Aseguramiento de Calidad, Compras, HSEQ, Bienestar Animal y Vigías de Riesgos.</p>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal('Accidentes de Trabajo 2025', (
            <div className="space-y-4 text-gray-700">
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Contexto del indicador</p>
                <p className="text-sm">En 2025 se registraron <strong className="text-orange-600">112 accidentes de trabajo</strong>, con mayor concentración en las áreas de planta de beneficio y posproceso, que por su naturaleza operativa presentan mayor exposición a riesgos osteomusculares y de seguridad física.</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Causas y factores explicativos</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Alta carga física en líneas de producción y posproceso</li>
                  <li>Movimientos repetitivos que generan lesiones osteomusculares</li>
                  <li>Condiciones propias del entorno de planta de beneficio</li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Acciones implementadas</p>
                <p className="text-sm">Se implementó <strong>gimnasia laboral</strong> como medida preventiva para mitigar riesgos osteomusculares y fortalecer el clima organizacional. Adicionalmente se realizaron 22 capacitaciones con 347 asistentes y un simulacro de evacuación en octubre.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Impacto en el negocio</p>
                <p className="text-sm">Los accidentes laborales generan ausentismo, costos de atención médica y afectación en la productividad operativa. El seguimiento continuo y las acciones preventivas son clave para reducir este indicador en 2026.</p>
              </div>
            </div>
          ))}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">Accidentes Laborales 2025</span>
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">112</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">referencia</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">112 accidentes</span></div>
            <div className="text-sm font-bold text-orange-600">Planta y posproceso</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal('Reducción de PQRs 2025 vs 2024', (
            <div className="space-y-4 text-gray-700">
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Contexto del indicador</p>
                <p className="text-sm">Las PQRs (Peticiones, Quejas y Reclamos) son el principal termómetro de la experiencia del cliente. En 2025 se logró una <strong className="text-green-600">reducción del 28.45%</strong> frente a 2024, uno de los resultados más destacados del área de Calidad.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Causas de la mejora</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Implementación de 154 planes de acción (+27.92% vs 2024)</li>
                  <li>Metodologías de análisis causal para identificar raíces de los problemas</li>
                  <li>Capacitación a líderes de proceso en gestión de calidad</li>
                  <li>Actualización del CRM SIESA para mejor trazabilidad de reclamos</li>
                  <li>Ejecución mensual del Comité Triángulo de Calidad</li>
                </ul>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Impacto en el negocio</p>
                <p className="text-sm">Menos PQRs significa mayor satisfacción del cliente, menor costo de atención posventa y mejor reputación de marca. Esta reducción es coherente con la ejecución de 1.166 encuestas de satisfacción realizadas en el año.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Conclusión</p>
                <p className="text-sm">La reducción del 28.45% en PQRs es un indicador sólido de que las acciones correctivas y preventivas implementadas están generando resultados tangibles en la experiencia del cliente.</p>
              </div>
            </div>
          ))}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">Reducción PQRs 2025 vs 2024</span>
            <TrendingDown className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">-28.45%</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">base comparación</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">reducción lograda</span></div>
            <div className="text-sm font-bold text-green-600">Var: -28,45% vs 2024</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal('Planes de Acción Ejecutados 2025', (
            <div className="space-y-4 text-gray-700">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Contexto del indicador</p>
                <p className="text-sm">En 2025 se ejecutaron <strong className="text-blue-600">154 planes de acción</strong>, lo que representa un incremento del <strong>+27.92%</strong> frente a 2024. Este aumento refleja una cultura organizacional más proactiva en la identificación y corrección de desviaciones.</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Factores que explican el incremento</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Implementación de metodologías de análisis causal</li>
                  <li>Capacitación a líderes en gestión de no conformidades</li>
                  <li>Digitalización del SGC mediante plataforma ISOLUCION</li>
                  <li>Mayor visibilidad de hallazgos gracias al CRM SIESA actualizado</li>
                </ul>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Relación con otros indicadores</p>
                <p className="text-sm">El aumento en planes de acción está directamente relacionado con la reducción del 28.45% en PQRs: más acciones correctivas ejecutadas generan menos reclamaciones de clientes. Es un ciclo virtuoso de mejora continua.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Conclusión</p>
                <p className="text-sm">154 planes ejecutados en 2025 demuestran que el sistema de gestión de calidad está madurando y que los procesos de mejora continua están institucionalizados en la organización.</p>
              </div>
            </div>
          ))}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">Planes de Acción Ejecutados 2025</span>
            <FileCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">154</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">~120 planes</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">154 planes</span></div>
            <div className="text-sm font-bold text-green-600">Var: +27,92% vs 2024</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal('Auditorías Internas ISO 9001:2015', (
            <div className="space-y-4 text-gray-700">
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Contexto del indicador</p>
                <p className="text-sm">En 2025 se realizaron auditorías internas bajo la norma <strong className="text-purple-600">ISO 9001:2015</strong> a <strong>14 procesos</strong> de la organización. Este ejercicio es fundamental para verificar el cumplimiento del sistema de gestión y preparar la transición hacia la nueva versión.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Avances en la transición ISO 9001:2026</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Actualización de matrices de partes interesadas, DOFA y PESTEL</li>
                  <li>Actualización de caracterización de procesos</li>
                  <li>Mayor integración digital y tecnológica del SGC</li>
                  <li>Reorganización del capítulo de mejora</li>
                  <li>Énfasis en la experiencia del cliente como eje central</li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Herramientas implementadas</p>
                <p className="text-sm">Se implementó la plataforma <strong>ISOLUCION</strong> para digitalizar el sistema de gestión de calidad, y se actualizó el CRM SIESA para mejorar la trazabilidad. El Comité Triángulo de Calidad se ejecutó mensualmente.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Impacto estratégico</p>
                <p className="text-sm">Las auditorías a 14 procesos garantizan que la organización mantiene sus estándares de calidad y está preparada para la transición a ISO 9001:2026, que exigirá mayor integración digital y enfoque en el cliente.</p>
              </div>
            </div>
          ))}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">Procesos Auditados ISO 9001:2015</span>
            <Shield className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">14</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">Norma: <span className="font-semibold text-gray-700">ISO 9001:2015</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">14 procesos auditados</span></div>
            <div className="text-sm font-bold text-purple-600">Transición → 2026</div>
          </div>
        </motion.div>
      </div>

      {/* Gestión Ambiental */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={() => openModal('Gestión Ambiental 2025', (
          <div className="space-y-4 text-gray-700">
            <div className="bg-green-50 rounded-lg p-4 border border-green-300">
              <p className="text-sm font-semibold text-gray-900 mb-2">Consumo de agua por ave beneficiada</p>
              <p className="text-sm">Se logró una reducción del <strong className="text-blue-600">5.9%</strong> en el consumo de agua potable por ave beneficiada frente a 2024, y del <strong className="text-blue-600">16.07%</strong> frente a 2023. Esta tendencia acumulada de tres años demuestra una gestión ambiental sostenida y efectiva.</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
              <p className="text-sm font-semibold text-gray-900 mb-2">Gestión de residuos sólidos</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Residuos aprovechables: <strong>+24.65%</strong> vs 2024 (más material reciclado)</li>
                <li>Canastillas rotas: <strong>-20.02%</strong> vs 2024 (menos desperdicio de activos)</li>
              </ul>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
              <p className="text-sm font-semibold text-gray-900 mb-2">Capacitaciones y sensibilizaciones</p>
              <p className="text-sm">Se realizaron <strong>23 capacitaciones</strong> y <strong>24 sensibilizaciones</strong> sobre prevención de plagas, manejo de residuos y ahorro de recursos, fortaleciendo la cultura ambiental en toda la organización.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
              <p className="text-sm font-semibold text-gray-900 mb-2">Conclusión</p>
              <p className="text-sm">La reducción acumulada del 16.07% en consumo de agua desde 2023 y el aumento del 24.65% en residuos aprovechables posicionan a la empresa en una trayectoria sólida de sostenibilidad ambiental.</p>
            </div>
          </div>
        ))}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 cursor-pointer transition-all"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Gestión Ambiental 2025</h3>
            <p className="text-sm text-gray-600 mt-1">Reducción de consumo y gestión de residuos</p>
          </div>
          <Info className="w-6 h-6 text-green-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reducción Agua */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border-2 border-blue-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Droplet className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              <h4 className="text-lg font-bold text-blue-600">Consumo de Agua</h4>
            </div>
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <div className="text-sm text-gray-600 mb-1">vs 2024</div>
                <div className="text-4xl font-bold text-gray-900 mb-2">-5.9%</div>
                <div className="text-xs text-gray-600 leading-relaxed">
                  Por ave beneficiada
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <div className="text-sm text-gray-600 mb-1">vs 2023</div>
                <div className="text-4xl font-bold text-gray-900 mb-2">-16.07%</div>
                <div className="text-xs text-gray-600 leading-relaxed">
                  Reducción acumulada
                </div>
              </div>
            </div>
          </div>

          {/* Residuos Aprovechables */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border-2 border-green-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Recycle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              <h4 className="text-lg font-bold text-green-600">Residuos Aprovechables</h4>
            </div>
            <div className="space-y-3">
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <div className="text-sm text-gray-600 mb-1">Incremento 2025</div>
                <div className="text-4xl font-bold text-gray-900 mb-2">+24.65%</div>
                <div className="text-xs text-gray-600 leading-relaxed">
                  vs 2024
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-300">
                <div className="text-sm text-gray-600 mb-1">Canastillas rotas</div>
                <div className="text-4xl font-bold text-gray-900 mb-2">-20.02%</div>
                <div className="text-xs text-gray-600 leading-relaxed">
                  Reducción vs 2024
                </div>
              </div>
            </div>
          </div>

          {/* Capacitaciones */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border-2 border-purple-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              <h4 className="text-lg font-bold text-purple-600">Capacitaciones</h4>
            </div>
            <div className="space-y-3">
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <div className="text-sm text-gray-600 mb-1">Ambientales</div>
                <div className="text-4xl font-bold text-gray-900 mb-2">23</div>
                <div className="text-xs text-gray-600 leading-relaxed">
                  Capacitaciones realizadas
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <div className="text-sm text-gray-600 mb-1">Sensibilizaciones</div>
                <div className="text-4xl font-bold text-gray-900 mb-2">24</div>
                <div className="text-xs text-gray-600 leading-relaxed">
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
        onClick={() => openModal('Seguridad y Salud en el Trabajo SST 2025', (
          <div className="space-y-4 text-gray-700">
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-300">
              <p className="text-sm font-semibold text-gray-900 mb-2">Actividades ejecutadas en 2025</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li><strong>22 capacitaciones</strong> con <strong>347 asistentes</strong> en temas de seguridad y salud</li>
                <li><strong>1 simulacro de evacuación</strong> realizado en octubre 2025</li>
                <li>Retorno de visitas a sedes y puntos de venta para inspecciones de seguridad</li>
                <li>Implementación de <strong>gimnasia laboral</strong> para prevención osteomuscular</li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
              <p className="text-sm font-semibold text-gray-900 mb-2">Actualización documental</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Actualización de la matriz legal SST</li>
                <li>Actualización de la matriz de riesgos</li>
                <li>Actualización del reglamento de higiene y seguridad industrial</li>
              </ul>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-300">
              <p className="text-sm font-semibold text-gray-900 mb-2">Contexto de los 112 accidentes</p>
              <p className="text-sm">Los 112 accidentes registrados en 2025 se concentran principalmente en planta de beneficio y posproceso. Las acciones de SST buscan reducir este número mediante prevención activa, capacitación y mejora de condiciones de trabajo.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
              <p className="text-sm font-semibold text-gray-900 mb-2">Impacto</p>
              <p className="text-sm">Un programa SST robusto reduce el ausentismo, mejora la productividad y protege el bienestar de los colaboradores. Las 347 personas capacitadas representan una cobertura significativa del personal operativo.</p>
            </div>
          </div>
        ))}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30 hover:border-orange-500 cursor-pointer transition-all"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Seguridad y Salud en el Trabajo SST 2025</h3>
            <p className="text-sm text-gray-600 mt-1">Actividades y capacitaciones SST 2025</p>
          </div>
          <Info className="w-6 h-6 text-orange-600" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-3 sm:p-4 border-2 border-cyan-500/30">
            <div className="text-xs text-gray-600 mb-1">Capacitaciones</div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">22</div>
            <div className="text-xs text-gray-600 mt-1">Realizadas</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 border-2 border-green-500/30">
            <div className="text-xs text-gray-600 mb-1">Asistentes</div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">347</div>
            <div className="text-xs text-gray-600 mt-1">Participantes</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 border-2 border-purple-500/30">
            <div className="text-xs text-gray-600 mb-1">Simulacros</div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">1</div>
            <div className="text-xs text-gray-600 mt-1">Octubre 2025</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 border-2 border-orange-500/30">
            <div className="text-xs text-gray-600 mb-1">Gimnasia Laboral</div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">Activa</div>
            <div className="text-xs text-gray-600 mt-1">Prevención</div>
          </div>
        </div>
      </motion.div>

      {/* Sistema de Gestión de Calidad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={() => openModal('Sistema de Gestión ISO 9001 - Transición 2025-2026', (
            <div className="space-y-4 text-gray-700">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Estado actual del SGC</p>
                <p className="text-sm">El sistema de gestión de calidad opera bajo la norma <strong>ISO 9001:2015</strong> con auditorías a 14 procesos. En 2025 se inició la preparación para la transición a <strong>ISO 9001:2026</strong>, que incorpora mayor integración digital y énfasis en la experiencia del cliente.</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Avances de digitalización</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Implementación de plataforma <strong>ISOLUCION</strong> para digitalizar el SGC</li>
                  <li>Actualización del CRM SIESA para mejor trazabilidad</li>
                  <li>Ejecución mensual del Comité Triángulo de Calidad</li>
                </ul>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Cambios para ISO 9001:2026</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Actualización de matrices de partes interesadas, DOFA y PESTEL</li>
                  <li>Actualización de caracterización de procesos</li>
                  <li>Reorganización del capítulo de mejora</li>
                  <li>Mayor énfasis en la experiencia del cliente</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Impacto estratégico</p>
                <p className="text-sm">La transición a ISO 9001:2026 posiciona a la empresa en la vanguardia de la gestión de calidad, con un sistema más digital, más orientado al cliente y más integrado con los riesgos del negocio.</p>
              </div>
            </div>
          ))}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Sistema de Gestión ISO 9001 - Transición 2025-2026</h3>
              <p className="text-xs text-gray-600 mt-1">Transición a ISO 9001:2026</p>
            </div>
            <Info className="w-5 h-5 text-blue-600" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-300">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Plataforma ISOLUCION</div>
                <div className="text-xs text-gray-600">Digitalización del SGC</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-300">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Comité Triángulo de Calidad</div>
                <div className="text-xs text-gray-600">Ejecución mensual</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-300">
              <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Actualización CRM SIESA</div>
                <div className="text-xs text-gray-600">Trazabilidad mejorada</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          onClick={() => openModal('Encuestas de Satisfacción al Cliente 2025', (
            <div className="space-y-4 text-gray-700">
              <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Contexto del indicador</p>
                <p className="text-sm">En 2025 se ejecutaron <strong className="text-cyan-600">1.166 encuestas de satisfacción</strong>, lo que representa una disminución del <strong>38%</strong> frente a 2024. Esta reducción en el número de encuestas puede estar relacionada con cambios en la metodología de medición o en la segmentación de clientes encuestados.</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Relación con PQRs y planes de acción</p>
                <p className="text-sm">A pesar de la reducción en encuestas, los indicadores de calidad muestran mejora: las PQRs bajaron un <strong>28.45%</strong> y los planes de acción aumentaron un <strong>27.92%</strong>. Esto sugiere que la calidad percibida por el cliente mejoró en 2025.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Herramientas de seguimiento</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>CRM SIESA actualizado para trazabilidad de reclamos</li>
                  <li>Comité Triángulo de Calidad con ejecución mensual</li>
                  <li>Plataforma ISOLUCION para gestión digital del SGC</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Conclusión</p>
                <p className="text-sm">La combinación de menos PQRs (-28.45%) y más planes de acción (+27.92%) indica que el sistema de calidad está funcionando: se detectan y corrigen problemas antes de que lleguen al cliente.</p>
              </div>
            </div>
          ))}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-cyan-500/30 hover:border-cyan-500 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Encuestas de Satisfacción al Cliente 2025</h3>
              <p className="text-xs text-gray-600 mt-1">Medición experiencia del cliente</p>
            </div>
            <Info className="w-5 h-5 text-cyan-600" />
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-5 border-2 border-cyan-500/30 mb-4">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">1,166</div>
              <div className="text-sm text-gray-600">Encuestas Realizadas 2025</div>
              <div className="text-xs text-gray-600 mt-1">-38% vs 2024</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-lg p-3 text-center border border-green-300">
              <div className="text-2xl font-bold text-green-600">-28.45%</div>
              <div className="text-xs text-gray-600 mt-1">Reducción PQRs</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-300">
              <div className="text-2xl font-bold text-blue-600">+27.92%</div>
              <div className="text-xs text-gray-600 mt-1">Planes acción</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Líneas de Acción */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-blue-500/30"
      >
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Líneas de Acción 2025</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-lg p-3 sm:p-4 border border-blue-500/30">
            <h4 className="text-xs sm:text-sm font-bold text-blue-600 mb-2">Dirección Estratégica</h4>
            <p className="text-xs text-gray-700 leading-relaxed">
              Conexión estrategia-ejecución, priorización de riesgos y decisiones informadas
            </p>
          </div>
          <div className="bg-white/95 backdrop-blur-xl rounded-lg p-3 sm:p-4 border border-green-500/30">
            <h4 className="text-xs sm:text-sm font-bold text-green-600 mb-2">Mejora Continua</h4>
            <p className="text-xs text-gray-700 leading-relaxed">
              Cultura de mejora y enfoque preventivo alineado con ISO 9001:2026
            </p>
          </div>
          <div className="bg-white/95 backdrop-blur-xl rounded-lg p-3 sm:p-4 border border-purple-500/30">
            <h4 className="text-xs sm:text-sm font-bold text-purple-600 mb-2">Gestión de Riesgos</h4>
            <p className="text-xs text-gray-700 leading-relaxed">
              Integración de riesgos y cumplimiento normativo sanitario y ambiental
            </p>
          </div>
          <div className="bg-white/95 backdrop-blur-xl rounded-lg p-3 sm:p-4 border border-cyan-500/30">
            <h4 className="text-xs sm:text-sm font-bold text-cyan-600 mb-2">Transformación Digital</h4>
            <p className="text-xs text-gray-700 leading-relaxed">
              Migración a ISOLUCION y actualización CRM SIESA para mejor trazabilidad
            </p>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      {createPortal(
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
              className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-blue-500 shadow-2xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-cyan-600" />
                  <h3 className="text-xl font-bold text-gray-900">{modalContent.title}</h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-gray-600 hover:text-gray-900 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-gray-700 leading-relaxed overflow-y-auto flex-1 pr-2">{modalContent.content}</div>
              <div className="mt-6 flex justify-end flex-shrink-0">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  Entendido
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </div>
  );
}
