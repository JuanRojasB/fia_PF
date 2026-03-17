import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Target, DollarSign, Zap, X, Info } from 'lucide-react';

export default function MarketingDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });

  const openModal = (title, content) => {
    setModalContent({ title, content });
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
          onClick={() => openModal('ROI de Campañas 2025', (
            <div className="space-y-4 text-gray-700">
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Contexto del indicador</p>
                <p className="text-sm">El ROI promedio de campañas en 2025 fue de <strong className="text-green-600">17.4%</strong>, frente a aproximadamente 20.4% en 2024, una caída de <strong>3 puntos porcentuales</strong>. Este indicador mide el retorno generado por cada peso invertido en publicidad y activaciones.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Variación mensual destacada</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Mejor mes: <strong>Enero con 41.01%</strong> de ROI</li>
                  <li>Peor mes: <strong>Diciembre con 11.07%</strong> por pauta extraordinaria en medios masivos (TV y radio)</li>
                </ul>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Causas de la caída vs 2024</p>
                <p className="text-sm">La inversión en medios masivos (RCN TV, Caracol TV, Red+ TV y radio) en diciembre generó un alto gasto con retorno diferido, afectando el promedio anual. La pauta en TV y radio tiene un efecto de construcción de marca a largo plazo que no se refleja inmediatamente en el ROI.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Recomendación</p>
                <p className="text-sm">Optimizar la inversión hacia canales de mayor retorno como Cencosud (29.9%) y PDV, que es el canal prioritario para 2026.</p>
              </div>
            </div>
          ))}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">ROI Promedio Campañas 2025</span>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">17.4%</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">~20.4%</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">17.4%</span></div>
            <div className="text-sm font-bold text-red-600">Var: -3,0pp</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal('Efectividad Campañas BTL 2025', (
            <div className="space-y-4 text-gray-700">
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Contexto del indicador</p>
                <p className="text-sm">La efectividad de campañas BTL (Below The Line) en 2025 fue del <strong className="text-orange-600">82%</strong>, frente a una meta del <strong>95%</strong>. Esto representa una brecha de <strong>13 puntos porcentuales</strong> que requiere atención en la planificación y ejecución de activaciones en punto de venta.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Variación mensual</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Mejor mes: <strong>Septiembre con 90%</strong></li>
                  <li>Peor mes: <strong>Agosto con 73%</strong> por incapacidad del activador Harol Alfonso</li>
                  <li>Rango mensual: entre 78% (enero) y 90% (septiembre)</li>
                </ul>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Causas de la brecha vs meta</p>
                <p className="text-sm">La dependencia de activadores específicos genera vulnerabilidad operativa. La incapacidad de un activador en agosto impactó directamente el indicador mensual, evidenciando la necesidad de planes de contingencia y mayor cobertura de personal.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Impacto en el negocio</p>
                <p className="text-sm">Las activaciones BTL en punto de venta son clave para impulsar la rotación del producto en los canales de distribución. Una efectividad del 82% significa que el 18% de las activaciones planificadas no se ejecutaron, representando oportunidades de venta perdidas.</p>
              </div>
            </div>
          ))}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">Efectividad Campañas BTL 2025</span>
            <Target className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">82%</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">Meta: <span className="font-semibold text-gray-700">95%</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">82%</span></div>
            <div className="text-sm font-bold text-red-600">Var: -13pp vs meta</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal('Ejecución Presupuestal Marketing 2025', (
            <div className="space-y-4 text-gray-700">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Contexto del indicador</p>
                <p className="text-sm">El presupuesto de marketing 2025 fue de <strong>$480 millones</strong>, de los cuales se ejecutaron <strong className="text-blue-600">$401.7 millones (83.7%)</strong>, generando un ahorro de <strong>$78.3 millones</strong>. La ejecución refleja una gestión eficiente del presupuesto, aunque también puede indicar oportunidades de inversión no aprovechadas.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Meses de mayor y menor inversión</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Mayor inversión: <strong>Octubre $163.175.712</strong> (compra centralizada de obsequios corporativos fin de año)</li>
                  <li>Segunda mayor: <strong>Diciembre $123.995.310</strong> (pauta medios masivos: RCN TV, Caracol TV, Red+ TV y radio)</li>
                  <li>Menor inversión: <strong>Junio $5.297.343</strong> (brecha de continuidad en pauta)</li>
                </ul>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Análisis de la distribución</p>
                <p className="text-sm">La concentración del gasto en octubre y diciembre (más del 70% del presupuesto en 2 meses) contrasta con la baja inversión en junio, evidenciando una distribución irregular que puede afectar la continuidad de la presencia de marca durante el año.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Recomendación para 2026</p>
                <p className="text-sm">Redistribuir el ahorro de $78.338.335 hacia canales de alto ROI (Cencosud 29.9%) y garantizar pauta digital activa los 12 meses del año para evitar brechas de continuidad como la de junio.</p>
              </div>
            </div>
          ))}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">Ejecución Presupuestal Marketing 2025</span>
            <DollarSign className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">83.7%</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">Presupuesto: <span className="font-semibold text-gray-700">$480.000.000</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">$401.661.665 ejecutado</span></div>
            <div className="text-sm font-bold text-blue-600">Ahorro: $78.338.335</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal('CTR Pauta Digital 2025', (
            <div className="space-y-4 text-gray-700">
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Contexto del indicador</p>
                <p className="text-sm">El CTR (Click Through Rate) promedio de la pauta digital en 2025 fue de <strong className="text-purple-600">2.7%</strong>, frente a una meta del <strong>3.0%</strong>. El CPC (Costo Por Clic) promedio fue de <strong>$248</strong>. Estos indicadores miden la efectividad de la inversión en publicidad digital.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Variación mensual destacada</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Mejor mes: <strong>Noviembre con CTR 5.3%</strong> (175.93% de efectividad vs meta)</li>
                  <li>Peor CPC: <strong>Junio con $435</strong> (45% sobre la meta de CPC)</li>
                  <li>Sin pauta activa: <strong>Agosto</strong> (mes sin inversión digital)</li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Crecimiento en redes sociales</p>
                <p className="text-sm">Los seguidores crecieron de <strong>4.175</strong> (enero 2024) a <strong>10.610</strong> (diciembre 2025), un incremento del <strong>+154%</strong> en 24 meses. El crecimiento fue especialmente sostenido durante el último semestre del año.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Impacto y recomendación</p>
                <p className="text-sm">El CTR de 2.7% está 0.3 puntos por debajo de la meta. Garantizar pauta digital activa los 12 meses (evitar el vacío de agosto) y optimizar la segmentación de audiencias permitiría alcanzar y superar el 3% en 2026.</p>
              </div>
            </div>
          ))}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">CTR Pauta Digital 2025</span>
            <Zap className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">CTR 2.7%</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">Meta CTR: <span className="font-semibold text-gray-700">3.0%</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">CTR 2.7% / CPC $248</span></div>
            <div className="text-sm font-bold text-green-600">Seguidores: +154%</div>
          </div>
        </motion.div>
      </div>

      {/* Inversión Publicitaria 2025 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={() => openModal('Análisis de Inversión Publicitaria 2025', (
          <div className="space-y-4 text-gray-700">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
              <p className="text-sm font-semibold text-gray-900 mb-2">Distribución del gasto</p>
              <p className="text-sm">El gasto total ejecutado fue de <strong className="text-blue-600">$401.7 millones</strong> sobre un presupuesto de $480M. La distribución fue muy irregular, con dos meses concentrando la mayor parte del gasto.</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-300">
              <p className="text-sm font-semibold text-gray-900 mb-2">Mes de menor inversión: Junio</p>
              <p className="text-sm">Junio registró solo <strong>$5.297.343</strong>, evidenciando una brecha de continuidad en la pauta publicitaria. Esta ausencia de inversión puede haber afectado la presencia de marca en un mes de temporada media.</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-300">
              <p className="text-sm font-semibold text-gray-900 mb-2">Meses de mayor inversión</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li><strong>Octubre: $163.175.712</strong> — Compra centralizada de obsequios corporativos para fin de año</li>
                <li><strong>Diciembre: $123.995.310</strong> — Pauta en medios masivos: RCN TV, Caracol TV, Red+ TV y pauta radial</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
              <p className="text-sm font-semibold text-gray-900 mb-2">Conclusión</p>
              <p className="text-sm">La concentración del gasto en octubre y diciembre, combinada con la brecha de junio, sugiere que la planificación de medios para 2026 debe buscar una distribución más uniforme para mantener presencia de marca durante todo el año.</p>
            </div>
          </div>
        ))}
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
              <div className="text-4xl font-bold text-gray-900 mb-2">$5.297.343</div>
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
                <div className="text-4xl font-bold text-gray-900 mb-2">$163.175.712</div>
                <div className="text-xs text-gray-600 leading-relaxed">
                  Compra centralizada de obsequios corporativos fin de año
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border-2 border-purple-500/30 shadow">
                <div className="text-sm text-gray-600 mb-1">Diciembre 2025</div>
                <div className="text-4xl font-bold text-gray-900 mb-2">$123.995.310</div>
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
          onClick={() => openModal('Crecimiento de Seguidores en Redes Sociales 2025', (
            <div className="space-y-4 text-gray-700">
              <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Evolución del indicador</p>
                <p className="text-sm">Los seguidores en redes sociales crecieron de <strong>4.175</strong> en enero 2024 a <strong className="text-cyan-600">10.610</strong> en diciembre 2025, un incremento de <strong>+6.435 seguidores (+154%)</strong> en 24 meses.</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Factores del crecimiento</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Crecimiento sostenido especialmente durante el último semestre de 2025</li>
                  <li>Inversión en pauta digital con CTR promedio de 2.7%</li>
                  <li>Calificación de efectividad de campañas digitales: 3.7</li>
                  <li>Presencia en medios masivos (TV y radio) en diciembre que amplió el alcance</li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Impacto en el negocio</p>
                <p className="text-sm">Una comunidad digital de 10.610 seguidores representa un canal de comunicación directa con clientes y consumidores. El crecimiento del 154% en 24 meses indica que la estrategia de contenidos y pauta digital está generando resultados tangibles en construcción de audiencia.</p>
              </div>
            </div>
          ))}
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
          onClick={() => openModal('ROI por Canal de Venta - Campañas 2025', (
            <div className="space-y-4 text-gray-700">
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Canal de mayor retorno: Cencosud</p>
                <p className="text-sm">Cencosud registró el <strong className="text-green-600">ROI más alto con 29.9%</strong>. Por cada $100 invertidos en activaciones en este canal, retornan $29.90 en ventas adicionales. Es el canal con mayor potencial y debe priorizarse en la estrategia de 2026.</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Canal con oportunidad de mejora: Asadero</p>
                <p className="text-sm">El canal Asadero registró un <strong className="text-orange-600">ROI de 16.6%</strong>, el más bajo entre los canales medidos. Por cada $100 invertidos, retornan $16.60. Requiere revisión de la estrategia de activación y evaluación de la rentabilidad de la inversión en este canal.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Canal foco para 2026: PDV</p>
                <p className="text-sm">Los Puntos de Venta (PDV) son el canal prioritario para 2026. La estrategia debe enfocarse en mejorar la efectividad BTL (actualmente 82% vs meta 95%) y aumentar la frecuencia de activaciones en PDV para maximizar el retorno.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Recomendación estratégica</p>
                <p className="text-sm">Redistribuir la inversión hacia Cencosud y PDV, evaluar la rentabilidad del canal Asadero y ajustar los parámetros de activación para mejorar el ROI promedio por encima del 17.4% actual.</p>
              </div>
            </div>
          ))}
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
