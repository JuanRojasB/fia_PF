import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { TrendingDown, TrendingUp, AlertTriangle, X, Info, Target, CheckCircle2 } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';

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
      <CollapsibleTable
        title="Comparativo Histórico de Mermas por Sede"
        defaultOpen={false}
        totalRow={[
          { label: 'Merma 2025 por sede' },
          { label: `General: ${general2025.merma_2025}%`, color: 'text-red-500' },
          { label: `Sede 1: ${u01_2025.merma_2025}%`, color: 'text-green-600' },
          { label: `Sede 2: ${u02_2025.merma_2025}%`, color: 'text-blue-600' },
          { label: `Sede 3: ${u03_2025.merma_2025}%`, color: 'text-orange-500' },
        ]}
      >
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
                // U02 tiene merma negativa: más negativo = mejor rendimiento
                const esNegativo = meta < 0;
                
                const cumpleMeta = d2025
                  ? (esNegativo ? d2025.merma <= meta : d2025.merma <= meta)
                  : false;

                const getTendencia = () => {
                  if (!d2023 || !d2025) return '-';
                  // Para negativos: más negativo en 2025 vs 2023 = mejora
                  const mejora = esNegativo
                    ? d2025.merma < d2023.merma
                    : d2025.merma < d2023.merma;
                  return mejora ? '↓ Mejora' : '↑ Deterioro';
                };
                
                const getTendenciaColor = () => {
                  if (!d2023 || !d2025) return 'text-gray-500';
                  const mejora = esNegativo
                    ? d2025.merma < d2023.merma
                    : d2025.merma < d2023.merma;
                  return mejora ? 'text-green-600' : 'text-red-600';
                };
                
                return (
                  <tr key={sede} className={`border-b border-gray-200 hover:bg-gray-50 ${idx === 0 ? 'bg-red-50' : ''}`}>
                    <td className="py-3 px-4 font-semibold text-gray-900">{sede === 'U01' ? 'Sede 1' : sede === 'U02' ? 'Sede 2' : sede === 'U03' ? 'Sede 3' : sede}</td>
                    <td className="text-center py-3 px-4 text-blue-600 font-semibold">{meta.toFixed(2)}%</td>
                    <td className="text-center py-3 px-4 text-gray-700">{d2023 ? `${d2023.merma.toFixed(2)}%` : '-'}</td>
                    <td className="text-center py-3 px-4 text-gray-700">{d2024 ? `${d2024.merma.toFixed(2)}%` : '-'}</td>
                    <td className={`text-center py-3 px-4 font-bold ${cumpleMeta ? 'text-green-600' : 'text-red-600'}`}>
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
      </CollapsibleTable>

      {/* Gráfico Unificado — igual al comparativo de referencia */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-2 border-gray-200"
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-900">COMPARATIVO DE MERMAS AÑOS 2025/24/23</h3>
            <p className="text-xs text-gray-500 mt-1">Suma de % — U02 presenta valores negativos (ganancia de peso en proceso)</p>
          </div>
          <Info
            className="w-5 h-5 text-red-400 cursor-pointer hover:text-red-600 transition-colors"
            onClick={() => openModal(
              'Comparativo de Mermas 2025/24/23',
              'Gráfico unificado con las 4 sedes:\n\n• GENERAL: 11.70% (2025) vs meta 10% — brecha 1.70pp\n• U01: 9.49% (2025) vs meta 10% — ✓ Cumple meta\n• U02: -22.31% (2025) vs meta -25% — valores negativos = ganancia de peso\n• U03: 13.05% (2025) vs meta 12% — brecha 1.05pp\n\nLas barras grises representan la meta establecida para cada sede.'
            )}
          />
        </div>

        <ResponsiveContainer width="100%" height={480}>
          <BarChart
            data={datosGrafico}
            margin={{ top: 30, right: 30, left: 20, bottom: 20 }}
            barCategoryGap="25%"
            barGap={2}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="sede"
              stroke="#6b7280"
              tick={{ fontSize: 13, fontWeight: 'bold', fontStyle: 'italic' }}
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `${v.toFixed(2)}%`}
              domain={['auto', 'auto']}
              label={{ value: 'Suma de %', angle: -90, position: 'insideLeft', offset: -5, style: { fontSize: 12, fill: '#6b7280' } }}
            />
            <ReferenceLine y={0} stroke="#374151" strokeWidth={2} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const sedeLabel = label === 'U01' ? 'Sede 1 (U01)' : label === 'U02' ? 'Sede 2 (U02)' : label === 'U03' ? 'Sede 3 (U03)' : label;
                return (
                  <div className="bg-white border-2 border-blue-500 rounded-xl p-4 shadow-xl min-w-[180px]">
                    <p className="font-bold text-gray-900 mb-3">{sedeLabel}</p>
                    <div className="space-y-1.5">
                      {payload.map((entry, i) => (
                        entry.value != null && (
                          <div key={i} className="flex justify-between items-center gap-4">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
                              <span className="text-gray-600 text-sm">{entry.name}:</span>
                            </div>
                            <span className="font-bold text-gray-900 text-sm">{parseFloat(entry.value).toFixed(2)}%</span>
                          </div>
                        )
                      ))}
                    </div>
                    {label === 'U02' && (
                      <p className="text-xs text-green-600 mt-2 pt-2 border-t border-gray-100">Negativo = ganancia de peso</p>
                    )}
                  </div>
                );
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '16px' }}
              iconType="rect"
              iconSize={14}
              formatter={(value) => <span style={{ fontSize: 13, fontWeight: 500 }}>{value}</span>}
            />
            {/* Etiquetas de valor dentro/sobre las barras */}
            <Bar dataKey="2025" fill="#f59e0b" name="2025" barSize={28}
              label={{ position: 'insideTop', fontSize: 10, fontWeight: 'bold', fill: '#78350f', formatter: (v) => v != null ? `${parseFloat(v).toFixed(2)}%` : '' }}
            />
            <Bar dataKey="2024" fill="#3b82f6" name="2024" barSize={28}
              label={{ position: 'insideTop', fontSize: 10, fontWeight: 'bold', fill: '#1e3a8a', formatter: (v) => v != null ? `${parseFloat(v).toFixed(2)}%` : '' }}
            />
            <Bar dataKey="2023" fill="#f97316" name="2023" barSize={28}
              label={{ position: 'insideTop', fontSize: 10, fontWeight: 'bold', fill: '#7c2d12', formatter: (v) => v != null ? `${parseFloat(v).toFixed(2)}%` : '' }}
            />
            <Bar dataKey="meta" fill="#9ca3af" name="Meta" barSize={28}
              label={{ position: 'insideTop', fontSize: 10, fontWeight: 'bold', fill: '#374151', formatter: (v) => v != null ? `${parseFloat(v).toFixed(2)}%` : '' }}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Resumen por sede debajo del gráfico */}
        <div className="grid grid-cols-4 gap-3 mt-6 pt-5 border-t border-gray-200">
          {[
            { label: 'General', val: general2025.merma_2025, meta: general2025.meta_establecida, brecha: general2025.brecha_puntos_porcentuales, color: 'text-red-600' },
            { label: 'Sede 1 (U01)', val: u01_2025.merma_2025, meta: u01_2025.meta_establecida, brecha: u01_2025.brecha_puntos_porcentuales, color: 'text-green-600' },
            { label: 'Sede 2 (U02)', val: u02_2025.merma_2025, meta: u02_2025.meta_establecida, brecha: u02_2025.brecha_puntos_porcentuales, color: 'text-blue-600' },
            { label: 'Sede 3 (U03)', val: u03_2025.merma_2025, meta: u03_2025.meta_establecida, brecha: u03_2025.brecha_puntos_porcentuales, color: 'text-orange-600' },
          ].map(({ label, val, meta, brecha, color }) => (
            <div key={label} className="text-center bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">{label}</div>
              <div className={`text-xl font-bold ${color}`}>{val}%</div>
              <div className="text-xs text-gray-500 mt-1">Meta: {meta}%</div>
              <div className={`text-xs font-semibold mt-0.5 ${parseFloat(brecha) === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                {parseFloat(brecha) === 0 ? '✓ Cumple' : `Brecha: ${brecha}pp`}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Análisis Contextual */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-blue-500/30"
        >
          <div className="flex items-start gap-2 sm:gap-3 mb-3">
            <Info className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-2">Cambios Estructurales 2025</h4>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
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
          className="bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-green-500/30"
        >
          <div className="flex items-start gap-2 sm:gap-3 mb-3">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-2">Resultados Segundo Semestre</h4>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
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
          className="bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-purple-500/30"
        >
          <div className="flex items-start gap-2 sm:gap-3 mb-3">
            <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-2">Sede 1: Transformación Exitosa</h4>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
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
          className="bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-orange-500/30"
        >
          <div className="flex items-start gap-2 sm:gap-3 mb-3">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-2">Sedes 2 y 3: Mejora Progresiva</h4>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
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
