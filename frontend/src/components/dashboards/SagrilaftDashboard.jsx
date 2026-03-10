import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Shield, AlertTriangle, CheckCircle, X, Info } from 'lucide-react';

export default function SagrilaftDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const hasAnimatedRef = useRef(false);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    if (!hasAnimatedRef.current) {
      hasAnimatedRef.current = true;
      const timer = setTimeout(() => {
        setShouldAnimate(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  // Validar que data sea un objeto con las propiedades esperadas
  // Manejar tanto objetos directos como objetos envueltos
  const sagrilaftData = data?.stakeholders ? data : (data?.items || {});
  
  if (!sagrilaftData || typeof sagrilaftData !== 'object') {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const stakeholders = Array.isArray(sagrilaftData.stakeholders) ? sagrilaftData.stakeholders : [];
  const totales = sagrilaftData.totales || { total_validados: 0 };
  const analisis = Array.isArray(sagrilaftData.analisis) ? sagrilaftData.analisis : [];

  if (stakeholders.length === 0) {
    return <div className="text-gray-400">No hay datos de stakeholders disponibles</div>;
  }

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '0';

    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numValue);
  };

  // Calcular totales
  const totalRechazados = stakeholders.reduce((sum, d) => sum + (parseFloat(d.rechazados) || 0), 0);
  const promedioLaFt = stakeholders.reduce((sum, d) => sum + (parseFloat(d.la_pct) || 0), 0) / stakeholders.length;
  const promedioFallaDoc = stakeholders.reduce((sum, d) => sum + (parseFloat(d.documentacion_pct) || 0), 0) / stakeholders.length;
  const promedioAntecedentes = stakeholders.reduce((sum, d) => sum + (parseFloat(d.antecedentes_pct) || 0), 0) / stakeholders.length;

  // Datos para gráficos
  const chartData = stakeholders.map(d => ({
    contraparte: d.contraparte && d.contraparte.length > 15 ? d.contraparte.substring(0, 15) + '...' : (d.contraparte || 'Sin nombre'),
    rechazados: parseFloat(d.rechazados) || 0,
    laFt: parseFloat(d.la_pct) || 0,
    fallaDoc: parseFloat(d.documentacion_pct) || 0,
    antecedentes: parseFloat(d.antecedentes_pct) || 0
  }));

  // Datos para gráfico de pastel de motivos
  const motivosData = [
    { name: 'LA/FT', value: promedioLaFt },
    { name: 'Falla Doc', value: promedioFallaDoc },
    { name: 'Antecedentes', value: promedioAntecedentes }
  ];

  const COLORS = ['#ef4444', '#f59e0b', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal('Rechazados', '314 rechazados de 5,732 evaluados (5.47%).')}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-red-500/30 hover:border-red-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Total Contrapartes Rechazadas</span>
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{formatNumber(totalRechazados)}</div>
          <div className="text-xs text-red-400">Contrapartes rechazadas</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal('LA/FT', 'Lavado de Activos / Financiación del Terrorismo.')}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-yellow-500/30 hover:border-yellow-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Promedio LA/FT (%)</span>
            <Shield className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{promedioLaFt.toFixed(1)}%</div>
          <div className="text-xs text-yellow-400">Lavado de activos</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal('Total Validados', 'Stakeholders aprobados. Sistema: DATALAFT / Risk Consulting.')}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Total Validados</span>
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-4xl font-bold text-white mb-1">{formatNumber(totales.total_validados)}</div>
          <div className="text-xs text-green-400">Contrapartes validadas</div>
        </motion.div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rechazados por Contraparte */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-xl font-bold text-white mb-6">Número de Rechazados por Contraparte</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="contraparte" type="category" stroke="#9ca3af" width={120} style={{ fontSize: '11px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                formatter={(value) => formatNumber(value)}
              />
              <Bar dataKey="rechazados" fill="#ef4444" name="Rechazados" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Distribución de Motivos de Rechazo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-xl font-bold text-white mb-6">Distribución de Motivos de Rechazo en Porcentaje</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                isAnimationActive={!hasAnimatedRef.current}
                animationBegin={0}
                animationDuration={800}
                onAnimationEnd={() => { hasAnimatedRef.current = true; }}
                data={motivosData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.name}: ${entry.value.toFixed(1)}%`}
              >
                {motivosData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                formatter={(value) => `${value.toFixed(1)}%`}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Tabla Detallada */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700 overflow-x-auto"
      >
        <h3 className="text-xl font-bold text-white mb-6">Detalle de Cumplimiento SAGRILAFT</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b-2 border-slate-600">
                <th className="text-left py-2 px-2 text-gray-300 font-bold">Contraparte</th>
                <th className="text-right py-2 px-2 text-gray-300 font-bold">Rechazados</th>
                <th className="text-right py-2 px-2 text-gray-300 font-bold">% LA/FT</th>
                <th className="text-right py-2 px-2 text-gray-300 font-bold">% Falla Doc</th>
                <th className="text-right py-2 px-2 text-gray-300 font-bold">% Antecedentes</th>
                <th className="text-right py-2 px-2 text-gray-300 font-bold">% PEPs</th>
              </tr>
            </thead>
            <tbody>
              {stakeholders.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-700/20 hover:bg-slate-700/30 transition-colors">
                  <td className="py-1 px-2 text-white font-medium">{row.contraparte || 'Sin nombre'}</td>
                  <td className="py-1 px-2 text-right text-red-400 tabular-nums">{formatNumber(row.rechazados)}</td>
                  <td className="py-1 px-2 text-right text-yellow-400 tabular-nums">{parseFloat(row.la_pct || 0).toFixed(1)}%</td>
                  <td className="py-1 px-2 text-right text-orange-400 tabular-nums">{parseFloat(row.documentacion_pct || 0).toFixed(1)}%</td>
                  <td className="py-1 px-2 text-right text-purple-400 tabular-nums">{parseFloat(row.antecedentes_pct || 0).toFixed(1)}%</td>
                  <td className="py-1 px-2 text-right text-pink-400 tabular-nums">{parseFloat(row.peps_pct || 0).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Análisis de Hallazgos - Gráficas */}
      {analisis.length > 0 && (
        <>
          {/* Hallazgos Generales - Gráfica de Barras */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
          >
            <h3 className="text-xl font-bold text-white mb-6">Hallazgos de No Conformidad por Categoría</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart 
                data={[
                  { categoria: 'Doc. Inadecuada', nombreCompleto: 'Documentación Inadecuada', porcentaje: 24, meta: 10 },
                  { categoria: 'Candidatos', nombreCompleto: 'Candidatos No Conformes por Antecedentes', porcentaje: 27, meta: null },
                  { categoria: 'Transport. Doc.', nombreCompleto: 'Transportadores No Conformes por Documentación', porcentaje: 47, meta: null },
                  { categoria: 'Transport. Ant.', nombreCompleto: 'Transportadores No Aptos por Antecedentes', porcentaje: 8, meta: null },
                  { categoria: 'Proveedores FT', nombreCompleto: 'Proveedores con Novedad FT', porcentaje: 50, meta: null },
                  { categoria: 'Comercial Doc.', nombreCompleto: 'Incumplimiento Documental Comercial', porcentaje: 47, meta: null }
                ]}
                margin={{ left: 20, right: 20, bottom: 20, top: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="categoria" 
                  stroke="#9ca3af" 
                  height={60}
                  style={{ fontSize: '12px' }}
                  interval={0}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  label={{ value: '%', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                  domain={[0, 60]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelFormatter={(label, payload) => {
                    if (payload && payload.length > 0) {
                      return payload[0].payload.nombreCompleto;
                    }
                    return label;
                  }}
                  formatter={(value, name) => {
                    if (name === 'porcentaje') return [`${value}%`, 'No Conforme'];
                    if (name === 'meta') return [`${value}%`, 'Meta'];
                    return value;
                  }}
                />
                <Legend />
                <Bar dataKey="porcentaje" fill="#ef4444" name="% No Conforme" radius={[8, 8, 0, 0]} />
                <Bar dataKey="meta" fill="#10b981" name="Meta" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-400">
              <p>• Doc. Inadecuada: Documentación Inadecuada (Meta: 10% en 6 meses)</p>
              <p>• Candidatos: Candidatos No Conformes por Antecedentes</p>
              <p>• Transport. Doc.: Transportadores No Conformes por Documentación</p>
              <p>• Transport. Ant.: Transportadores No Aptos por Antecedentes</p>
              <p>• Proveedores FT: Proveedores con Novedad FT (3 casos)</p>
              <p>• Comercial Doc.: Incumplimiento Documental Comercial</p>
            </div>
          </motion.div>

          {/* Información General - KPIs Adicionales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
          >
            <h3 className="text-xl font-bold text-white mb-6">Resumen de Validación 2022-2025</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gráfica de Pastel - Validados vs Rechazados */}
              <div>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie 
                      isAnimationActive={!hasAnimatedRef.current}
                      animationBegin={0}
                      animationDuration={800}
                      data={[
                        { name: 'Validados', value: 5732 },
                        { name: 'Rechazados', value: 314 }
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.name}: ${formatNumber(entry.value)}`}
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                      formatter={(value) => formatNumber(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center text-sm text-gray-400 mt-2">
                  Total Stakeholders: {formatNumber(5732 + 314)}
                </div>
              </div>

              {/* Acciones por Área */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-white mb-4">Acciones Implementadas por Área</h4>
                <div className="space-y-2">
                  <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-700/50">
                    <div className="text-blue-400 font-semibold text-sm">Gestión Humana</div>
                    <div className="text-white text-xs mt-1">Actualización PGH-04 • Nuevos filtros</div>
                  </div>
                  <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-700/50">
                    <div className="text-purple-400 font-semibold text-sm">Logística</div>
                    <div className="text-white text-xs mt-1">Actualización PGH-06 • FCO-05 y FCO-03</div>
                  </div>
                  <div className="bg-orange-900/30 rounded-lg p-3 border border-orange-700/50">
                    <div className="text-orange-400 font-semibold text-sm">Compras</div>
                    <div className="text-white text-xs mt-1">Mejora filtros proveedores</div>
                  </div>
                  <div className="bg-green-900/30 rounded-lg p-3 border border-green-700/50">
                    <div className="text-green-400 font-semibold text-sm">Comercial</div>
                    <div className="text-white text-xs mt-1">Divulgaciones • Reducción riesgo documental</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sistema y Cumplimiento - Cards Informativos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
          >
            <h3 className="text-xl font-bold text-white mb-6">Sistema y Cumplimiento Normativo</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 rounded-xl p-4 border border-cyan-700/50">
                <Shield className="w-8 h-8 text-cyan-400 mb-3" />
                <div className="text-cyan-400 font-semibold mb-2">Plataforma</div>
                <div className="text-white text-sm">DATALAFT / Risk Consulting</div>
              </div>
              <div className="bg-gradient-to-br from-indigo-900/40 to-indigo-800/20 rounded-xl p-4 border border-indigo-700/50">
                <CheckCircle className="w-8 h-8 text-indigo-400 mb-3" />
                <div className="text-indigo-400 font-semibold mb-2">Normatividad</div>
                <div className="text-white text-sm">Circular 100-00005 de 2017 y 100-000016 de 2020</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 rounded-xl p-4 border border-emerald-700/50">
                <AlertTriangle className="w-8 h-8 text-emerald-400 mb-3" />
                <div className="text-emerald-400 font-semibold mb-2">Enfoque</div>
                <div className="text-white text-sm">Basado en Riesgos y Debida Diligencia Intensificada</div>
              </div>
            </div>
          </motion.div>
        </>
      )}

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
              className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full border-4 border-red-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-red-400" />
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
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
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
