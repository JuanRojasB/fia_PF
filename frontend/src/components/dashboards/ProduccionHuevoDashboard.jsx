import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Egg, Award, Shield, Zap, Home, X, Info } from 'lucide-react';

export default function ProduccionHuevoDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });
  const hasAnimated = useRef(false);

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Datos de capacidad por granja 2025
  const capacidadGranjas = [
    { granja: 'El Edén', aves: 34000, tipo: 'Nueva', color: '#10b981' },
    { granja: 'San Isidro', aves: 30000, tipo: 'Existente', color: '#3b82f6' },
    { granja: 'La Esperanza', aves: 28000, tipo: 'Existente', color: '#3b82f6' },
    { granja: 'Santa Rosa', aves: 26000, tipo: 'Existente', color: '#3b82f6' },
    { granja: 'El Paraíso', aves: 26000, tipo: 'Existente', color: '#3b82f6' }
  ];

  const totalAves2025 = 144000;

  // Indicadores clave
  const indicadores = [
    { nombre: 'Clasificadora', valor: '12,000', unidad: 'huevos/hora', icono: Zap, color: 'yellow' },
    { nombre: 'Certificaciones', valor: 'ISO + 2 GAB', unidad: 'Renovadas 2025', icono: Award, color: 'purple' },
    { nombre: 'Resistencia Cáscara', valor: '>3,000', unidad: 'kgf (todas las edades)', icono: Shield, color: 'green' }
  ];

  // Mejoras implementadas
  const mejoras = [
    { 
      categoria: 'Infraestructura', 
      items: [
        'Granja El Edén (34,000 aves) reemplaza Arrayanes (30,000). Infraestructura reutilizada con mejoras tecnológicas (ventilación, iluminación LED, sistemas de alimentación automatizados)', 
        'Clasificadora automática nueva de 12,000 huevos/hora con registro digital de lotes y trazabilidad mejorada', 
        'Bodega centro de acopio estratégicamente ubicada para optimizar logística de distribución y reducir tiempos de entrega'
      ] 
    },
    { 
      categoria: 'Zootécnica', 
      items: [
        'Pesos ideales alcanzados en semana 16 durante levante (etapa crítica de crecimiento antes de postura), mejorando arranque productivo', 
        'Mejores arranques productivos con picos de postura más tempranos y sostenidos, aumentando huevos por ave alojada', 
        'Plan vacunal optimizado que redujo costos en 15% y estrés en aves, manteniendo protección sanitaria efectiva'
      ] 
    },
    { 
      categoria: 'Certificaciones', 
      items: [
        'ISO 9001 renovada exitosamente (San Germán reconocida como mejor granja 2025 en parámetros zootécnicos)', 
        '2 granjas certificadas GAB - Granja Avícola Biosegura según Resolución ICA 3651 (bioseguridad, sanidad, trazabilidad)', 
        'Bioseguridad fortalecida con protocolos de ingreso, control de plagas, y monitoreo sanitario permanente'
      ] 
    },
    { 
      categoria: 'Calidad', 
      items: [
        'Resistencia de cáscara >3,000 kgf en todas las edades (validado por ALBATEQ S.A.), reduciendo quiebres en transporte', 
        'Eliminado suplemento de carbonato de calcio (piedrecilla) ya que alimento concentrado incluye calcio suficiente en premezcla, ahorrando costos', 
        'Reducción significativa de PQR (Peticiones, Quejas, Reclamos) de clientes gracias a mejor trazabilidad y control de calidad'
      ] 
    }
  ];

  const COLORS = {
    nueva: '#10b981',
    existente: '#3b82f6'
  };

  // Función personalizada para renderizar labels blancos en el pie chart
  const renderCustomLabel = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, index } = props;
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const granja = capacidadGranjas[index].granja;
    const percentage = (percent * 100).toFixed(1);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="14"
        fontWeight="500"
      >
        {`${granja}: ${percentage}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      <style>{`
        .recharts-pie-label-text {
          fill: #ffffff !important;
          font-size: 14px;
          font-weight: 500;
        }
      `}</style>
      {/* KPI Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-900/40 to-emerald-800/20 backdrop-blur-xl rounded-xl p-6 border-4 border-emerald-500/50 cursor-pointer hover:border-emerald-400/70 transition-all"
        onClick={() => openModal(
          'Capacidad Total de Aves 2025',
          '144,000 gallinas ponedoras en 5 granjas. Incremento +4.28% (+6,000 aves) vs 2024. Crecimiento por incorporación de granja El Edén (34,000 aves) que reemplazó Arrayanes (30,000), con infraestructura mejorada. Producción liderada por Dr. Alex García y Dr. Francisco Javier Monsalve, con mejoras en bioseguridad, nutrición y manejo.'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Egg className="w-10 h-10 text-emerald-400" />
            <div>
              <h2 className="text-lg font-semibold text-emerald-300 mb-1">Capacidad Total 2025</h2>
              <div className="text-4xl font-bold text-emerald-400">{formatNumber(totalAves2025)}</div>
              <div className="text-sm text-emerald-300">aves en producción</div>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-emerald-500/20 rounded-lg p-3 border border-emerald-500/30">
              <div className="text-xs text-emerald-300 mb-1">Incremento vs 2024</div>
              <div className="text-2xl font-bold text-emerald-400">+4.28%</div>
              <div className="text-xs text-emerald-300 mt-1">+6,000 aves</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Indicadores Clave */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {indicadores.map((ind, idx) => {
          const Icon = ind.icono;
          const colorClasses = {
            yellow: 'border-yellow-500/30 hover:border-yellow-500',
            purple: 'border-purple-500/30 hover:border-purple-500',
            green: 'border-green-500/30 hover:border-green-500'
          };
          const iconColors = {
            yellow: 'text-yellow-400',
            purple: 'text-purple-400',
            green: 'text-green-400'
          };
          
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 ${colorClasses[ind.color]} transition-all cursor-pointer hover:scale-105`}
              onClick={() => {
                const descriptions = {
                  'Clasificadora': 'Clasificadora automática 12,000 huevos/hora en El Edén. Clasifica por tamaño/peso (AA, A, B, C) según normativa. La anterior de Arrayanes se entregó como garantía por falencias. Reduce errores humanos, aumenta velocidad y mejora trazabilidad con registro digital de lotes.',
                  'Certificaciones': 'ISO renovada en San Germán (mejor granja 2025 en parámetros zootécnicos). 2 granjas con GAB (Granja Avícola Biosegura, Res. 3651 ICA). Certificaciones verificadas por entidades externas, requisito para mercados institucionales y exportación.',
                  'Resistencia Cáscara': 'Estudios ALBATEQ S.A. confirman >3,000 kgf en todas edades. Resistencia crítica para transporte y manipulación, reduce quiebres. Eliminado suplemento de carbonato de calcio (alimento concentrado ya lo incluye), reduciendo costos sin afectar calidad.'
                };
                openModal(ind.nombre, descriptions[ind.nombre]);
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm font-medium">{ind.nombre}</span>
                <Icon className={`w-6 h-6 ${iconColors[ind.color]}`} />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{ind.valor}</div>
              <div className="text-xs text-gray-400">{ind.unidad}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Mejoras Implementadas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <h3 className="text-xl font-bold text-white mb-6">Mejoras Estratégicas Implementadas en 2025</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mejoras.map((mejora, idx) => {
            const colors = [
              { bg: 'from-blue-900/40 to-blue-800/20', border: 'border-blue-700/50', text: 'text-blue-400' },
              { bg: 'from-purple-900/40 to-purple-800/20', border: 'border-purple-700/50', text: 'text-purple-400' },
              { bg: 'from-green-900/40 to-green-800/20', border: 'border-green-700/50', text: 'text-green-400' },
              { bg: 'from-orange-900/40 to-orange-800/20', border: 'border-orange-700/50', text: 'text-orange-400' }
            ];
            const color = colors[idx % colors.length];
            
            return (
              <div key={idx} className={`bg-gradient-to-br ${color.bg} rounded-lg p-4 border ${color.border}`}>
                <div className={`${color.text} font-semibold text-base mb-3`}>{mejora.categoria}</div>
                <ul className="space-y-2">
                  {mejora.items.map((item, itemIdx) => {
                    return (
                      <li key={itemIdx} className="flex items-start gap-2">
                        <span className={`${color.text} mt-1 text-xs flex-shrink-0`}>•</span>
                        <span className="text-white text-sm leading-relaxed">{item}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Distribución de Capacidad - Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-slate-700 cursor-pointer hover:border-slate-500 transition-all"
        onClick={() => openModal(
          'Distribución de Capacidad por Granja',
          '144,000 aves en 5 granjas. El Edén (34,000 - 23.6%) es la más reciente con mayor capacidad, incorporada en 2025 reemplazando Arrayanes, con tecnología mejorada (clasificadora automática, ventilación optimizada). Otras 4 granjas consolidadas con historial estable. Distribución geográfica reduce riesgos (enfermedades, clima) y permite flujo constante de huevo fresco.'
        )}
      >
        <h3 className="text-xl font-bold text-white mb-4">Distribución de Capacidad por Granja</h3>
        
        {/* Leyenda de colores */}
        <div className="flex items-center justify-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#10b981]"></div>
            <span className="text-sm text-gray-300">Granja Nueva (2025)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#3b82f6]"></div>
            <span className="text-sm text-gray-300">Granjas Existentes</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie 
              isAnimationActive={!hasAnimated.current}
              animationBegin={0}
              animationDuration={800}
              onAnimationEnd={() => { hasAnimated.current = true; }}
              data={capacidadGranjas}
              dataKey="aves"
              nameKey="granja"
              cx="50%"
              cy="50%"
              outerRadius={140}
              label={renderCustomLabel}
              labelLine={{ stroke: '#ffffff' }}
            >
              {capacidadGranjas.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #475569',
                color: '#ffffff'
              }}
              itemStyle={{ color: '#ffffff' }}
              labelStyle={{ color: '#ffffff' }}
              formatter={(value) => formatNumber(value) + ' aves'}
            />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Modal de Explicación */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full border-4 border-emerald-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-emerald-400" />
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
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
