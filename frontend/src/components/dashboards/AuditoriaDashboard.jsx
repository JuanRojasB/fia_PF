import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { TrendingDown, AlertTriangle, Target, CheckCircle, X, Info } from 'lucide-react';

export default function AuditoriaDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  // Manejar tanto objetos directos como objetos envueltos
  const auditData = data?.mermaAnual ? data : (data?.items || {});
  
  if (!auditData || !auditData.mermaAnual) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const { mermaAnual, devoluciones, narrativas } = auditData;

  // Agrupar merma por año
  const merma2023 = mermaAnual.filter(d => d.anio === 2023);
  const merma2024 = mermaAnual.filter(d => d.anio === 2024);
  const merma2025 = mermaAnual.filter(d => d.anio === 2025);
  const merma2026 = mermaAnual.filter(d => d.anio === 2026);

  // Preparar datos para gráfico comparativo de merma (incluyendo 2026)
  const mesesNombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const mesesCompletos = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const chartDataMerma = mesesNombres.map((mes, idx) => ({
    mes,
    mesCompleto: mesesCompletos[idx],
    '2023': merma2023.find(m => m.mes === idx + 1)?.porcentaje_merma || null,
    '2024': merma2024.find(m => m.mes === idx + 1)?.porcentaje_merma || null,
    '2025': merma2025.find(m => m.mes === idx + 1)?.porcentaje_merma || null,
    '2026': merma2026.find(m => m.mes === idx + 1)?.porcentaje_merma || (idx === 0 ? 12.35 : null), // Enero 2026
  }));

  // Calcular promedios (filtrar valores válidos)
  const promedio2023 = merma2023.length > 0 
    ? merma2023.reduce((sum, d) => sum + (parseFloat(d.porcentaje_merma) || 0), 0) / merma2023.length 
    : 0;
  const promedio2024 = merma2024.length > 0 
    ? merma2024.reduce((sum, d) => sum + (parseFloat(d.porcentaje_merma) || 0), 0) / merma2024.length 
    : 0;
  const promedio2025 = merma2025.length > 0 
    ? merma2025.reduce((sum, d) => sum + (parseFloat(d.porcentaje_merma) || 0), 0) / merma2025.length 
    : 0;

  // Preparar datos de devoluciones - evolución mensual por sede (2024 y 2025 completos)
  const devolucionesEvolucion = [];
  
  // Crear datos para 2024 (12 meses)
  mesesNombres.forEach((mesNombre, idx) => {
    const mesNum = idx + 1;
    const dataPoint = { 
      mes: `${mesNombre} 2024`,
      mesCompleto: `${mesesCompletos[idx]} 2024`
    };
    
    // Obtener datos de cada sede para este mes de 2024
    [1, 2, 3].forEach(sede => {
      const devolucion = devoluciones.find(d => 
        d.anio === 2024 && d.mes === mesNum && d.sede === sede
      );
      dataPoint[`Sede ${sede}`] = devolucion ? devolucion.devolucion_pct : null;
    });
    
    devolucionesEvolucion.push(dataPoint);
  });
  
  // Crear datos para 2025 (12 meses)
  mesesNombres.forEach((mesNombre, idx) => {
    const mesNum = idx + 1;
    const dataPoint = { 
      mes: `${mesNombre} 2025`,
      mesCompleto: `${mesesCompletos[idx]} 2025`
    };
    
    // Obtener datos de cada sede para este mes de 2025
    [1, 2, 3].forEach(sede => {
      const devolucion = devoluciones.find(d => 
        d.anio === 2025 && d.mes === mesNum && d.sede === sede
      );
      dataPoint[`Sede ${sede}`] = devolucion ? devolucion.devolucion_pct : null;
    });
    
    devolucionesEvolucion.push(dataPoint);
  });

  // Obtener narrativas
  const narrativasTexto = narrativas.filter(n => n.categoria === 'NARRATIVA').map(n => n.comentario);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Merma Promedio 2024',
            'Porcentaje promedio de producto perdido durante el año. La merma incluye producto dañado, vencido o no apto para venta. Un porcentaje menor indica mejor control de calidad y manejo.'
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Merma Promedio 2024 (%)</span>
            <TrendingDown className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {!isNaN(promedio2024) && promedio2024 > 0 ? promedio2024.toFixed(2) : '0.00'}%
          </div>
          <div className="text-xs text-purple-400">Promedio anual</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Merma Promedio 2025',
            'Porcentaje promedio de merma durante 2025. Meta: 10%. Resultado: 11.70%. Segundo semestre mostró mejora con meses cercanos a 10.2%-10.7%. Centralización logística en Sede 3 permitió reselección y redistribución.'
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Merma Promedio 2025 (%)</span>
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {!isNaN(promedio2025) && promedio2025 > 0 ? promedio2025.toFixed(2) : '0.00'}%
          </div>
          <div className="text-xs text-green-400">Promedio anual</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-yellow-500/30 hover:border-yellow-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Meta Merma 2026',
            'Objetivo de merma para 2026: 10.0%. Histórico: 2023 (12.44%), 2024 (11.49%), 2025 (11.70%). La meta busca reducir pérdidas mediante mejor control de calidad, manejo y logística centralizada.'
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Meta Merma 2026 (%)</span>
            <Target className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">10.00%</div>
          <div className="text-xs text-yellow-400">Objetivo 2026</div>
        </motion.div>
      </div>

      {/* Gráfico comparativo de merma 2023-2026 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-slate-700 cursor-pointer hover:border-slate-500 transition-all"
        onClick={() => openModal(
          'Evolución de Merma 2023-2026',
          'Tendencia mensual de merma por año. Muestra progreso hacia meta del 10%. Auditorías mensuales a Logística, Producción, Comercial y puntos de venta enfocan controles, inventarios y devoluciones.'
        )}
      >
        <h3 className="text-xl font-bold text-white mb-6">Evolución de Merma 2023-2026</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartDataMerma} margin={{ left: 20, right: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="mes" stroke="#9ca3af" style={{ fontSize: '13px' }} height={50} />
            <YAxis 
              stroke="#9ca3af" 
              width={80} 
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              labelFormatter={(label) => {
                const dataPoint = chartDataMerma.find(d => d.mes === label);
                return dataPoint ? dataPoint.mesCompleto : label;
              }}
              formatter={(value) => {
                if (!value || isNaN(value)) return 'N/A';
                return `${parseFloat(value).toFixed(2)}%`;
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="2023" stroke="#3b82f6" name="2023" strokeWidth={2} dot={{ r: 4 }} connectNulls />
            <Line type="monotone" dataKey="2024" stroke="#a855f7" name="2024" strokeWidth={2} dot={{ r: 4 }} connectNulls />
            <Line type="monotone" dataKey="2025" stroke="#10b981" name="2025" strokeWidth={2} dot={{ r: 4 }} connectNulls />
            <Line type="monotone" dataKey="2026" stroke="#f59e0b" name="2026" strokeWidth={3} dot={{ r: 5 }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Gráfico de devoluciones - evolución mensual por sede */}
      {devolucionesEvolucion.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-slate-700 cursor-pointer hover:border-slate-500 transition-all"
          onClick={() => openModal(
            'Evolución de Devoluciones por Sede',
            'Devoluciones mensuales por sede (2024-2025). Promedio compañía: 2.26% (mejora vs 2024). Por sede: Sede 1 (2.85%), Sede 2 (1.61%), Sede 3 (2.31%). Menor devolución indica mejor calidad y servicio.'
          )}
        >
          <h3 className="text-xl font-bold text-white mb-6">Evolución de Devoluciones por Sede (2024-2025)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={devolucionesEvolucion} margin={{ left: 20, right: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="mes" 
                stroke="#9ca3af" 
                style={{ fontSize: '11px' }} 
                height={50}
              />
              <YAxis 
                stroke="#9ca3af" 
                width={80} 
                domain={[0, 6]} 
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                labelFormatter={(label) => {
                  const dataPoint = devolucionesEvolucion.find(d => d.mes === label);
                  return dataPoint ? dataPoint.mesCompleto : label;
                }}
                formatter={(value) => {
                  if (!value || isNaN(value)) return 'N/A';
                  return `${parseFloat(value).toFixed(2)}%`;
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="Sede 1" stroke="#3b82f6" name="Sede 1" strokeWidth={2} dot={{ r: 4 }} connectNulls />
              <Line type="monotone" dataKey="Sede 2" stroke="#f59e0b" name="Sede 2" strokeWidth={2} dot={{ r: 4 }} connectNulls />
              <Line type="monotone" dataKey="Sede 3" stroke="#10b981" name="Sede 3" strokeWidth={2} dot={{ r: 4 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full border-4 border-orange-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-purple-400" />
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
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
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
