import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Target, DollarSign, Zap, X, Info } from 'lucide-react';

export default function MarketingDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  // SOLO datos explícitos del texto
  const seguidoresData = [
    { periodo: 'Enero 2024', seguidores: 4175, descripcion: 'Inicio del periodo' },
    { periodo: 'Diciembre 2025', seguidores: 10610, descripcion: 'Crecimiento sostenido último semestre' }
  ];

  const canalesData = [
    { canal: 'Cencosud', roi: 29.9, descripcion: 'Canal de mayor retorno - Alto potencial' },
    { canal: 'Asadero', roi: 16.6, descripcion: 'Canal con mayor oportunidad de mejora' }
  ];

  return (
    <div className="space-y-6">
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal('ROI de Campañas', 'El mejor mes fue Enero con 41.01%, mientras que Diciembre bajó a 11.07% debido a la pauta extraordinaria en medios masivos (TV y radio). La caída de 3 puntos vs 2024 sugiere necesidad de optimizar la inversión hacia canales de mayor retorno como Cencosud (29.9%).')}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">ROI Promedio Campañas 2025</span>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">17.4%</div>
          <div className="text-xs text-gray-600">ROI Promedio 2025</div>
          <div className="text-xs text-gray-500 mt-1">Inversión: $401.7M</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal('Campañas BTL', 'El rango mensual varió entre 78% (enero) y 90% (septiembre). Agosto registró 73% debido a incapacidad del activador Harol Alfonso. La brecha de 13 puntos vs meta (95%) requiere reforzar la planificación y ejecución de activaciones en punto de venta.')}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">Efectividad Campañas BTL 2025</span>
            <Target className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">82%</div>
          <div className="text-xs text-gray-600">Efectividad Lograda</div>
          <div className="text-xs text-red-400 mt-1">Meta: 95% (-13pts)</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal('Presupuesto', 'El ahorro de $78.3M representa una gestión eficiente, aunque también puede indicar oportunidades perdidas. Los picos en Octubre (obsequios corporativos) y Diciembre (medios masivos) contrastan con Junio ($5.3M), evidenciando una brecha de continuidad en la pauta que debe corregirse.')}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">Ejecución Presupuestal Marketing 2025</span>
            <DollarSign className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">83.7%</div>
          <div className="text-xs text-gray-600">$401.7M de $480M</div>
          <div className="text-xs text-blue-400 mt-1">Ahorro: $78.3M</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal('Digital', 'Noviembre fue el mejor mes con CTR 5.3% (175.93% de efectividad), mientras que Junio tuvo el CPC más alto ($435, 45% sobre meta). Agosto no tuvo pauta activa. El crecimiento de seguidores (+154%) demuestra buena gestión de redes, pero el CTR debe mejorar 0.3 puntos para alcanzar la meta del 3%.')}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">CTR Pauta Digital 2025</span>
            <Zap className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">CTR 2.7%</div>
          <div className="text-xs text-gray-600">Costo por Clic: $248</div>
          <div className="text-xs text-green-400 mt-1">Seguidores: +154%</div>
        </motion.div>
      </div>

      {/* Inversión Publicitaria 2025 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={() => openModal('Análisis de Gasto', 'Mes de menor inversión: Junio $5.297.343 (brecha de continuidad en pauta). Octubre: $163.175.712 (compra centralizada obsequios corporativos fin de año). Diciembre: $123.995.310 (pauta medios masivos RCN TV, Caracol TV, Red + TV y pauta radial).')}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 shadow-lg cursor-pointer hover:border-blue-500 transition-all"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Inversión Publicitaria 2025</h3>
            <p className="text-sm text-gray-600 mt-1">Análisis de meses con mayor y menor gasto</p>
          </div>
          <Info className="w-6 h-6 text-gray-600" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Menor Inversión */}
          <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl p-5 border-2 border-red-500/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <h4 className="text-lg font-bold text-red-400">Menor Inversión</h4>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-red-500/30 shadow">
              <div className="text-sm text-gray-600 mb-1">Junio 2025</div>
              <div className="text-4xl font-bold text-gray-900 mb-2">$5.3M</div>
              <div className="text-xs text-gray-600 leading-relaxed">
                Brecha de continuidad en pauta publicitaria
              </div>
            </div>
          </div>

          {/* Mayor Inversión */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl p-5 border-2 border-blue-500/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <h4 className="text-lg font-bold text-blue-400">Mayor Inversión</h4>
            </div>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 border-2 border-blue-500/30 shadow">
                <div className="text-sm text-gray-600 mb-1">Octubre 2025</div>
                <div className="text-4xl font-bold text-gray-900 mb-2">$163.2M</div>
                <div className="text-xs text-gray-600 leading-relaxed">
                  Compra centralizada de obsequios corporativos fin de año
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border-2 border-purple-500/30 shadow">
                <div className="text-sm text-gray-600 mb-1">Diciembre 2025</div>
                <div className="text-4xl font-bold text-gray-900 mb-2">$124.0M</div>
                <div className="text-xs text-gray-600 leading-relaxed">
                  Pauta medios masivos: RCN TV, Caracol TV, Red+ TV y radial
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Gráficos Secundarios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crecimiento Seguidores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => openModal('Seguidores Digitales', 'Crecimiento de seguidores: De 4,175 (enero 2024) a 10,610 (diciembre 2025) — incremento del 154%. Se destaca el crecimiento sostenido de seguidores durante el último semestre del año.')}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-cyan-500/30 shadow-lg cursor-pointer hover:border-cyan-500 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Crecimiento de Seguidores en Redes Sociales 2025</h3>
              <p className="text-xs text-gray-600 mt-1">Seguidores en plataformas digitales</p>
            </div>
            <Info className="w-5 h-5 text-gray-600" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4 border-2 border-cyan-500/30 shadow">
              <div className="text-xs text-gray-600 mb-1">Enero 2024</div>
              <div className="text-3xl font-bold text-gray-900">4,175</div>
              <div className="text-xs text-gray-600 mt-1">Seguidores</div>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-cyan-500/50 shadow">
              <div className="text-xs text-gray-600 mb-1">Diciembre 2025</div>
              <div className="text-3xl font-bold text-cyan-600">10,610</div>
              <div className="text-xs text-gray-600 mt-1">Seguidores</div>
            </div>
          </div>

          <div className="text-center p-4 bg-white rounded-lg border-2 border-green-500/30 shadow">
            <div className="text-4xl font-bold text-green-600 mb-1">+154%</div>
            <div className="text-sm text-gray-900">Crecimiento Total</div>
            <div className="text-xs text-gray-600 mt-1">+6,435 nuevos seguidores en 24 meses</div>
          </div>
        </motion.div>

        {/* ROI por Canal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={() => openModal('Análisis de Canales', 'Canal de mayor retorno: Cencosud con 29.9% promedio (canal con alto potencial). Canal Foco: PDV (Canal prioritario para 2026). Canal con mayor oportunidad: Asadero con 16.6%. Recomendación: Reforzar la inversión hacia Cencosud y PDV en 2026. Evaluar rentabilidad del canal Asadero y ajustar parámetros de activación.')}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 shadow-lg cursor-pointer hover:border-green-500 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">ROI por Canal de Venta - Campañas 2025</h3>
              <p className="text-xs text-gray-600 mt-1">ROI = Retorno sobre Inversión Publicitaria</p>
            </div>
            <Info className="w-5 h-5 text-gray-600" />
          </div>
          
          <div className="space-y-4">
            {/* Cencosud */}
            <div className="bg-white rounded-lg p-4 border-2 border-green-500/30 shadow">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-medium text-gray-900">Cencosud</div>
                  <div className="text-xs text-gray-600">Canal de Mayor Retorno</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">29.9%</div>
                  <div className="text-xs text-gray-600">ROI</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <div className="text-xs text-gray-600 mt-2">Por cada $100 invertidos, retornan $29.90</div>
            </div>

            {/* Asadero */}
            <div className="bg-white rounded-lg p-4 border-2 border-orange-500/30 shadow">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-medium text-gray-900">Asadero</div>
                  <div className="text-xs text-gray-600">Oportunidad de Mejora</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-orange-600">16.6%</div>
                  <div className="text-xs text-gray-600">ROI</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '55%' }}></div>
              </div>
              <div className="text-xs text-gray-600 mt-2">Por cada $100 invertidos, retornan $16.60</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Resumen Compacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-5 border-2 border-green-500/30"
        >
          <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Fortalezas 2025
          </h4>
          <div className="space-y-2 text-xs sm:text-sm text-gray-700">
            <div>• Calificación Efectividad Campañas Digitales: 3.7</div>
            <div>• Crecimiento de seguidores digitales: +154%</div>
            <div>• ROI promedio: 17.4%</div>
            <div>• Ahorro presupuestal: $78.338.335</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-5 border-2 border-blue-500/30"
        >
          <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Oportunidades 2026
          </h4>
          <div className="space-y-2 text-xs sm:text-sm text-gray-700">
            <div>• Mejorar ROI en canal PDV</div>
            <div>• Garantizar pauta digital activa 12 meses</div>
            <div>• Redistribuir ahorro hacia canales de alto ROI</div>
            <div>• Aumentar % Efectividad por encima del 3% promedio</div>
          </div>
        </motion.div>
      </div>

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
              className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-cyan-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-cyan-600" />
                  <h3 className="text-xl font-bold text-gray-900">{modalContent.title}</h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-gray-600 hover:text-gray-900 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-gray-700 leading-relaxed">{modalContent.description}</div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors shadow">
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
