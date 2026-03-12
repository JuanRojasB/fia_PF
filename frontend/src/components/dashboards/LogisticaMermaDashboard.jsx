import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { TrendingDown, TrendingUp, AlertTriangle, X, Info, Target, CheckCircle2 } from 'lucide-react';

export default function LogisticaMermaDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  // Extraer datos de mermas
  const mermas = data?.mermas || [];
  const cumplimiento2025 = data?.cumplimiento2025 || [];
  
  if (mermas.length === 0) {
    return (
      <div className="bg-white/95 backdrop-blur-xl rounded-xl p-12 border border-gray-200 text-center">
        <div className="text-gray-600 text-lg">No hay datos disponibles de Control de Mermas</div>
      </div>
    );
  }

  // Organizar datos por sede y año
  const datosPorSede = {};
  mermas.forEach(m => {
    const sede = m.sede;
    if (!datosPorSede[sede]) {
      datosPorSede[sede] = [];
    }
    datosPorSede[sede].push({
      anio: m.anio,
      merma: parseFloat(m.porcentaje_merma_real),
      meta: parseFloat(m.porcentaje_meta),
      brecha: parseFloat(m.porcentaje_merma_real) - parseFloat(m.porcentaje_meta)
    });
  });

  // Ordenar por año
  Object.keys(datosPorSede).forEach(sede => {
    datosPorSede[sede].sort((a, b) => a.anio - b.anio);
  });

  // Datos 2025
  const general2025 = cumplimiento2025.find(c => c.sede === 'General') || {};
  const u01_2025 = cumplimiento2025.find(c => c.sede === 'U01') || {};
  const u02_2025 = cumplimiento2025.find(c => c.sede === 'U02') || {};
  const u03_2025 = cumplimiento2025.find(c => c.sede === 'U03') || {};

  // Preparar datos para gráfico comparativo
  const datosGrafico = ['General', 'U01', 'U02', 'U03'].map(sede => {
    const datos = datosPorSede[sede] || [];
    const resultado = { sede };
    datos.forEach(d => {
      resultado[`${d.anio}`] = d.merma;
    });
    resultado.meta = datos[0]?.meta || 0;
    return resultado;
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-xl rounded-xl p-6 border-2 border-red-500/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
          <h2 className="text-3xl font-bold text-gray-900">COMPARATIVO DE MERMAS AÑOS 2025/24/23</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          Control de mermas por sede. En 2025 se implementaron cambios estructurales en la planta principal orientados a mejorar la eficiencia operativa. 
          General cerró en {general2025.merma_2025}% con una brecha de {general2025.brecha_puntos_porcentuales} puntos vs meta de {general2025.meta_establecida}%.
        </p>
      </motion.div>

      {/* KPIs Principales - 2025 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal(
            'Merma General 2025',
            `Merma general 2025: ${general2025.merma_2025}%. Meta: ${general2025.meta_establecida}%. Brecha: ${general2025.brecha_puntos_porcentuales} puntos porcentuales. Durante 2025 se implementaron cambios estructurales: la planta de beneficio pasó a despachar únicamente a Sede 3, que asumió la re-selección y redistribución hacia Sede 1, mejorando trazabilidad y centralizando control de calidad.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-red-500/30 hover:border-red-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">General 2025</span>
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{general2025.merma_2025}%</div>
          <div className="text-xs text-red-600 flex items-center gap-1">
            <Target className="w-4 h-4" />
            Meta: {general2025.meta_establecida}% | Brecha: {general2025.brecha_puntos_porcentuales}pp
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal(
            'Sede 1 (U01) - 2025',
            `Sede 1 cerró 2025 en ${u01_2025.merma_2025}%, una mejora significativa vs ${datosPorSede['U01']?.find(d => d.anio === 2024)?.merma}% en 2024. Pasó de operar históricamente en niveles superiores al 16% a estabilizarse después de marzo en rangos entre 7% y 8%. El promedio anual incluye los meses previos al cambio estructural. Opera bajo un modelo más eficiente y controlado.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Sede 1 (U01)</span>
            <TrendingDown className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{u01_2025.merma_2025}%</div>
          <div className="text-xs text-green-600 flex items-center gap-1">
            <TrendingDown className="w-4 h-4" />
            Mejora vs 2024: {datosPorSede['U01']?.find(d => d.anio === 2024)?.merma}%
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal(
            'Sede 2 (U02) - 2025',
            `Sede 2 cerró 2025 en ${u02_2025.merma_2025}%, acercándose a su meta de ${u02_2025.meta_establecida}%. Ha mostrado mejora progresiva en los últimos tres años. Tras la reorganización, la sede mantuvo estabilidad y mostró capacidad de adaptación al nuevo esquema operativo. Existe brecha frente a la meta, pero la tendencia es favorable y consistente.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Sede 2 (U02)</span>
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{u02_2025.merma_2025}%</div>
          <div className="text-xs text-green-600 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Mejora progresiva hacia meta
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal(
            'Sede 3 (U03) - 2025',
            `Sede 3 cerró 2025 en ${u03_2025.merma_2025}%, mostrando reducción progresiva. No alcanzó la meta de ${u03_2025.meta_establecida}%, manteniendo una brecha de ${u03_2025.brecha_puntos_porcentuales} puntos porcentuales. Con la reorganización, asumió el proceso de re-selección y redistribución de producto hacia Sede 1, concentrando el control en un punto intermedio.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Sede 3 (U03)</span>
            <TrendingDown className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{u03_2025.merma_2025}%</div>
          <div className="text-xs text-orange-600 flex items-center gap-1">
            <Target className="w-4 h-4" />
            Brecha: {u03_2025.brecha_puntos_porcentuales}pp vs meta
          </div>
        </motion.div>
      </div>

      {/* Tabla Comparativa por Sede y Año */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Comparativo Histórico por Sede</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 font-bold text-gray-900">Sede</th>
                <th className="text-center py-3 px-4 font-bold text-gray-900">Meta</th>
                <th className="text-center py-3 px-4 font-bold text-gray-900">2023</th>
                <th className="text-center py-3 px-4 font-bold text-gray-900">2024</th>
                <th className="text-center py-3 px-4 font-bold text-gray-900">2025</th>
                <th className="text-center py-3 px-4 font-bold text-gray-900">Tendencia</th>
              </tr>
            </thead>
            <tbody>
              {['General', 'U01', 'U02', 'U03'].map((sede, idx) => {
                const datos = datosPorSede[sede] || [];
                const d2023 = datos.find(d => d.anio === 2023);
                const d2024 = datos.find(d => d.anio === 2024);
                const d2025 = datos.find(d => d.anio === 2025);
                const meta = datos[0]?.meta || 0;
                
                const getTendencia = () => {
                  if (!d2023 || !d2025) return '-';
                  const mejora = d2025.merma < d2023.merma;
                  return mejora ? '↓ Mejora' : '↑ Deterioro';
                };
                
                const getTendenciaColor = () => {
                  if (!d2023 || !d2025) return 'text-gray-500';
                  return d2025.merma < d2023.merma ? 'text-green-600' : 'text-red-600';
                };
                
                return (
                  <tr key={sede} className={`border-b border-gray-200 hover:bg-gray-50 ${idx === 0 ? 'bg-red-50' : ''}`}>
                    <td className="py-3 px-4 font-semibold text-gray-900">{sede === 'U01' ? 'Sede 1' : sede === 'U02' ? 'Sede 2' : sede === 'U03' ? 'Sede 3' : sede}</td>
                    <td className="text-center py-3 px-4 text-blue-600 font-semibold">{meta.toFixed(2)}%</td>
                    <td className="text-center py-3 px-4 text-gray-700">{d2023 ? `${d2023.merma.toFixed(2)}%` : '-'}</td>
                    <td className="text-center py-3 px-4 text-gray-700">{d2024 ? `${d2024.merma.toFixed(2)}%` : '-'}</td>
                    <td className={`text-center py-3 px-4 font-bold ${d2025 && d2025.merma <= meta ? 'text-green-600' : 'text-red-600'}`}>
                      {d2025 ? `${d2025.merma.toFixed(2)}%` : '-'}
                    </td>
                    <td className={`text-center py-3 px-4 font-semibold ${getTendenciaColor()}`}>
                      {getTendencia()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Gráfico Comparativo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => openModal(
          'Evolución de Mermas por Sede',
          'Este gráfico muestra la evolución histórica de mermas por sede durante 2023-2025. La línea roja punteada indica la meta general del 10%. Se observa que General mantiene niveles entre 11-12%, Sede 1 (U01) mejoró significativamente de 16.98% a 9.49%, Sede 2 (U02) muestra valores negativos mejorando de -17.19% a -22.31%, y Sede 3 (U03) presenta reducción progresiva de 15.05% a 13.05%.'
        )}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200 cursor-pointer hover:border-red-400 transition-all"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Evolución de Mermas por Sede (2023-2025)</h3>
          <Info className="w-5 h-5 text-red-400 animate-pulse" />
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={datosGrafico}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="sede" stroke="#6b7280" />
            <YAxis stroke="#6b7280" label={{ value: 'Merma (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              formatter={(value) => `${parseFloat(value).toFixed(2)}%`}
            />
            <Legend />
            <ReferenceLine y={10} stroke="#ef4444" strokeDasharray="5 5" label="Meta General" />
            <Bar dataKey="2023" fill="#94a3b8" name="2023" />
            <Bar dataKey="2024" fill="#64748b" name="2024" />
            <Bar dataKey="2025" fill="#1e40af" name="2025" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Análisis Contextual */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200"
        >
          <div className="flex items-start gap-3 mb-3">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Cambios Estructurales 2025</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                Se implementaron cambios en el flujo logístico: la planta de beneficio pasó a despachar únicamente a Sede 3, 
                que asumió la re-selección y redistribución hacia Sede 1. Este rediseño concentró el control en un punto intermedio, 
                mejorando trazabilidad y centralizando la gestión de calidad.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200"
        >
          <div className="flex items-start gap-3 mb-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Resultados Segundo Semestre</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                Posterior a la reestructuración, el indicador presentó mayor control con meses cercanos a la meta 
                (septiembre 10.21%, julio 10.73%, octubre 10.64%). La nueva estructura comienza a generar resultados 
                operativos positivos, aunque persiste una brecha de 1.70 puntos porcentuales.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200"
        >
          <div className="flex items-start gap-3 mb-3">
            <TrendingDown className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Sede 1: Transformación Exitosa</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                Pasó de operar históricamente en niveles superiores al 16% a estabilizarse después de marzo en rangos 
                entre 7% y 8%. El promedio anual 2025 de 9.49% incluye los meses previos al cambio. El comportamiento 
                posterior evidencia una mejora real y sostenible.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200"
        >
          <div className="flex items-start gap-3 mb-3">
            <Target className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Sedes 2 y 3: Mejora Progresiva</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                Sede 2 cerró en -22.31%, acercándose a su meta de -25%, con tendencia favorable. Sede 3 cerró en 13.05%, 
                mostrando reducción progresiva pero manteniendo una brecha de 1.05 puntos vs meta de 12%. Ambas sedes 
                mostraron capacidad de adaptación al nuevo esquema operativo.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal de Información */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{modalContent.title}</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {modalContent.description}
              </p>
              <button
                onClick={() => setModalOpen(false)}
                className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
