import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Briefcase, Target, CheckCircle, X, Info } from 'lucide-react';
import EnDesarrollo from './EnDesarrollo';

export default function GerenciaDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };
  const gerenciaData = Array.isArray(data) ? data : (data?.items || []);
  
  // Mostrar mensaje de desarrollo si no hay datos o hay mensaje del backend
  if (gerenciaData.length === 0 || data?.mensaje) {
    return (
      <EnDesarrollo
        titulo="Gestión Gerencia en Desarrollo"
        descripcion="El módulo de Gestión Gerencia está siendo configurado. Pronto estará disponible con indicadores estratégicos, objetivos corporativos y métricas de alto nivel."
        modulo="Gestión Gerencia Estratégica"
      />
    );
  }

  // Eliminar duplicados y filtrar registros vacíos o inválidos
  const uniqueMap = {};
  gerenciaData.forEach(d => {
    // Filtrar registros sin información útil
    if (!d.seccion || !d.proceso || !d.tema || !d.descripcion) return;
    if (d.seccion === 'Otros' || d.proceso === 'Otros') return;
    
    // Normalizar espacios y crear clave única
    const seccion = d.seccion.trim();
    const proceso = d.proceso.trim();
    const tema = d.tema.trim();
    const descripcion = d.descripcion.trim().replace(/\s+/g, ' '); // Normalizar espacios múltiples
    
    const key = `${seccion}|||${proceso}|||${tema}|||${descripcion}`;
    if (!uniqueMap[key]) {
      uniqueMap[key] = { seccion, proceso, tema, descripcion };
    }
  });
  const uniqueData = Object.values(uniqueMap);

  // Agrupar por sección (solo para contexto, no para gráficos principales)
  const seccionOrder = ['Introducción', 'Líneas de Acción', 'Acciones por Proceso', 'Conclusiones'];
  
  // Contar secciones únicas
  const seccionesUnicas = [...new Set(uniqueData.map(d => d.seccion))];
  
  // Contar solo acciones reales (no introducción ni conclusiones)
  const accionesReales = uniqueData.filter(d => d.seccion === 'Acciones por Proceso').length;

  // Agrupar por proceso (top 8)
  const procesoCount = {};
  uniqueData.forEach(d => {
    const proceso = d.proceso || 'Otros';
    procesoCount[proceso] = (procesoCount[proceso] || 0) + 1;
  });

  const procesoData = Object.entries(procesoCount)
    .map(([proceso, count]) => ({
      proceso: proceso.length > 30 ? proceso.substring(0, 30) + '...' : proceso,
      procesoFull: proceso,
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  // Colores únicos por proceso (solo los necesarios)
  const procesoColors = {
    'Aseguramiento de Calidad': '#f59e0b',
    'SST': '#ef4444',
    'Gestión Ambiental': '#10b981',
    'Sistema de Gestión de Calidad': '#3b82f6',
    'Vigías de Riesgos': '#8b5cf6',
    'Bienestar Animal': '#84cc16',
    'Compras': '#ec4899',
    'Transformación Digital': '#06b6d4'
  };

  const getProcesoColor = (proceso) => {
    return procesoColors[proceso] || '#64748b';
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-3 shadow-2xl">
          <p className="text-gray-900 font-bold mb-1">{data.seccionFull || data.procesoFull}</p>
          <p className="text-blue-400">{payload[0].value} iniciativas</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal('Secciones Estratégicas', 'Áreas clave del plan: Introducción, Líneas de Acción, Acciones por Proceso, Conclusiones.')}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Secciones</span>
            <Briefcase className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">{seccionesUnicas.length}</div>
          <div className="text-xs text-blue-400">secciones estratégicas</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onClick={() => openModal('Procesos en Gestión', 'Áreas operativas: Calidad, SST, Ambiental, Compras, Bienestar Animal, etc.')}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Procesos</span>
            <Target className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">{Object.keys(procesoCount).length}</div>
          <div className="text-xs text-green-400">en gestión</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          onClick={() => openModal('Iniciativas 2025', 'Acciones concretas implementadas en cada proceso durante el año.')}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Iniciativas</span>
            <CheckCircle className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">{accionesReales}</div>
          <div className="text-xs text-purple-400">acciones 2025</div>
        </motion.div>
      </div>

      {/* Contexto Estratégico - PRIMERO */}
      {(() => {
        const introduccion = uniqueData.filter(d => d.seccion === 'Introducción');
        const lineasAccion = uniqueData.filter(d => d.seccion === 'Líneas de Acción');
        
        if (introduccion.length === 0 && lineasAccion.length === 0) return null;
        
        return (
          <div className="space-y-6">
            {/* Introducción */}
            {introduccion.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 backdrop-blur-xl rounded-xl p-6 border border-blue-500/30"
              >
                <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-8 bg-blue-400 rounded-full"></div>
                  Introducción - Gerencia Estratégica 2025
                </h3>
                <div className="space-y-4">
                  {introduccion.map((item, idx) => (
                    <div key={idx} className="bg-white/95 rounded-lg p-4 border-l-4 border-blue-500">
                      <div className="text-base font-bold text-gray-900 mb-2">{item.tema}</div>
                      <p className="text-sm text-gray-700 leading-relaxed">{item.descripcion}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Líneas de Acción */}
            {lineasAccion.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-gradient-to-r from-green-500/10 to-green-600/5 backdrop-blur-xl rounded-xl p-6 border border-green-500/30"
              >
                <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-8 bg-green-400 rounded-full"></div>
                  Líneas de Acción Estratégicas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lineasAccion.map((item, idx) => (
                    <div key={idx} className="bg-white/95 rounded-lg p-4 border-l-4 border-green-500 hover:bg-gray-100/50 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-green-400 font-bold text-sm">{idx + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-gray-900 mb-2">{item.tema}</div>
                          <p className="text-xs text-gray-600 leading-relaxed">{item.descripcion}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        );
      })()}

      {/* Gráfico principal de Acciones por Proceso */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={() => openModal('Acciones por Proceso', 'Número de iniciativas implementadas en cada área. Identifica procesos con mayor actividad.')}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-gray-200 hover:border-blue-500 transition-all cursor-pointer"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">Acciones por Proceso</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={procesoData} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9ca3af" />
            <YAxis 
              dataKey="proceso" 
              type="category" 
              stroke="#9ca3af" 
              width={200}
              style={{ fontSize: '11px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="Iniciativas" radius={[0, 8, 8, 0]}>
              {procesoData.map((entry, index) => {
                const color = getProcesoColor(entry.procesoFull);
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Detalle de Acciones por Proceso */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Detalle de Acciones por Proceso</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(() => {
            const accionesPorProceso = uniqueData.filter(d => d.seccion === 'Acciones por Proceso');
            const procesoGroups = {};
            accionesPorProceso.forEach(item => {
              if (!procesoGroups[item.proceso]) {
                procesoGroups[item.proceso] = [];
              }
              procesoGroups[item.proceso].push(item);
            });

            return Object.entries(procesoGroups)
              .sort((a, b) => b[1].length - a[1].length) // Ordenar por cantidad
              .map(([proceso, items], idx) => {
                const color = getProcesoColor(proceso);
                const hasColor = procesoColors[proceso];
                return (
                  <div key={idx} className="bg-gray-100/30 rounded-lg p-4 border border-gray-300 hover:border-blue-500/50 transition-all">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-300">
                      {hasColor && <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }}></div>}
                      <h4 className={`text-sm font-bold break-words flex-1 ${hasColor ? '' : 'text-gray-600'}`} style={hasColor ? { color } : {}}>{proceso}</h4>
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold flex-shrink-0">
                        {items.length}
                      </span>
                    </div>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {items.map((item, itemIdx) => (
                        <div key={itemIdx} className="bg-white/95 rounded p-2.5 border-l-2 border-blue-500/50 hover:border-blue-500 transition-all">
                          <div className="text-xs font-semibold text-gray-900 mb-1 break-words">{item.tema}</div>
                          <p className="text-xs text-gray-600 leading-relaxed break-words">{item.descripcion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              });
          })()}
        </div>
      </motion.div>

      {/* Conclusiones - AL FINAL */}
      {(() => {
        const conclusiones = uniqueData.filter(d => d.seccion === 'Conclusiones');
        if (conclusiones.length === 0) return null;
        
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-purple-400 rounded"></div>
              Conclusiones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {conclusiones.map((item, idx) => (
                <div key={idx} className="bg-gray-100/30 rounded-lg p-4 border-l-2 border-purple-500">
                  <div className="text-sm font-bold text-gray-900 mb-2">{item.tema}</div>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.descripcion}</p>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })()}

      {/* Modal */}
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
              className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-purple-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-bold text-gray-900">{modalContent.title}</h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-gray-700 leading-relaxed">
                {modalContent.description}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-gray-900 rounded-lg transition-colors"
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

