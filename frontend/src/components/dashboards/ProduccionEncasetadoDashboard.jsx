import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ComposedChart, Area, Cell } from 'recharts';
import { Factory, TrendingUp, Calendar, X, Info, Target, AlertCircle, CheckCircle2 } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';

export default function ProduccionEncasetadoDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  console.log('ProduccionEncasetadoDashboard - Datos recibidos:', data);

  if (!data || typeof data !== 'object') {
    return <div className="text-gray-600">No hay datos disponibles</div>;
  }

  const {
    encasetamiento = [],
    encasetamientoAnual = [],
    polloEntregado = [],
    totalesPorAnio = {},
    totales = {}
  } = data;

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Procesar encasetamiento mensual
  const ordenMeses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 
                      'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

  const encasetadoMap = {};
  ordenMeses.forEach(mes => {
    encasetadoMap[mes] = { mes, prog2024: 0, real2024: 0, prog2025: 0, real2025: 0 };
  });

  encasetamiento.forEach(d => {
    const mesNum = parseInt(d.mes);
    if (mesNum >= 1 && mesNum <= 12) {
      const mes = ordenMeses[mesNum - 1];
      const prog = parseFloat(d.valor_programado) || 0;
      const real = parseFloat(d.valor_real) || 0;
      
      if (d.anio === 2024) {
        encasetadoMap[mes].prog2024 = prog;
        encasetadoMap[mes].real2024 = real;
      } else if (d.anio === 2025) {
        encasetadoMap[mes].prog2025 = prog;
        encasetadoMap[mes].real2025 = real;
      }
    }
  });

  const encasetadoMeses = ordenMeses.map(mes => encasetadoMap[mes]);

  // Usar totales del BACKEND
  const totalEncasetado2024 = totalesPorAnio[2024]?.real || 0;
  const totalEncasetado2025 = totalesPorAnio[2025]?.real || 0;
  const totalProgramado2024 = totalesPorAnio[2024]?.programado || 0;
  const totalProgramado2025 = totalesPorAnio[2025]?.programado || 0;
  const variacionEncasetado = totalEncasetado2024 > 0 
    ? (((totalEncasetado2025 - totalEncasetado2024) / totalEncasetado2024) * 100).toFixed(1) 
    : 0;
  const cumplimiento2024 = totalProgramado2024 > 0 ? ((totalEncasetado2024 / totalProgramado2024) * 100).toFixed(1) : 0;
  const cumplimiento2025 = totalProgramado2025 > 0 ? ((totalEncasetado2025 / totalProgramado2025) * 100).toFixed(1) : 0;

  // Calcular promedios mensuales
  const promedioMensual2024 = totalesPorAnio[2024]?.meses > 0 ? (totalEncasetado2024 / totalesPorAnio[2024].meses) : 0;
  const promedioMensual2025 = totalesPorAnio[2025]?.meses > 0 ? (totalEncasetado2025 / totalesPorAnio[2025].meses) : 0;

  // Procesar pollo entregado anual
  const polloEntregadoChart = polloEntregado.map(p => ({
    anio: p.anio,
    total: parseInt(p.total) || 0,
    granjas: parseInt(p.real_granjas) || 0,
    comprado: parseInt(p.comprado) || 0
  }));

  return (
    <div className="space-y-8">


      {/* KPIs Principales - Expandidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Total Pollitos Encasetados 2025',
            `Se encasetaron ${formatNumber(totalEncasetado2025)} pollitos durante el año 2025. Este valor es la suma de todos los pollitos encasetados mes a mes durante el año. El encasetamiento es el proceso de colocar pollitos de un día de edad en los galpones de crianza, marcando el inicio del ciclo productivo de engorde que dura aproximadamente 42-45 días hasta el procesamiento. El valor programado fue de ${formatNumber(totalProgramado2025)} pollitos.`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Encasetado Real 2025</span>
            <Factory className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatNumber(totalEncasetado2025)}</div>
          <div className="text-sm text-gray-600 mt-1">Suma anual real</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Programado 2025 (suma anual)</div>
            <div className="text-lg font-semibold text-blue-400">{formatNumber(totalProgramado2025)} pollitos</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Total Pollitos Encasetados 2024',
            `Se encasetaron ${formatNumber(totalEncasetado2024)} pollitos durante el año 2024. Este valor es la suma de todos los pollitos encasetados mes a mes durante el año 2024. El encasetamiento es el proceso de colocar pollitos de un día de edad en los galpones de crianza, marcando el inicio del ciclo productivo de engorde. El valor programado fue de ${formatNumber(totalProgramado2024)} pollitos, logrando un cumplimiento del ${cumplimiento2024}%.`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Encasetado Real 2024</span>
            <Factory className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatNumber(totalEncasetado2024)}</div>
          <div className="text-sm text-gray-600 mt-1">Suma anual real</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Programado 2024 (suma anual)</div>
            <div className="text-lg font-semibold text-green-400">{formatNumber(totalProgramado2024)} pollitos</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Comparación 2025 vs 2024',
            `La variación de ${variacionEncasetado > 0 ? '+' : ''}${variacionEncasetado}% representa la comparación entre 2025 y 2024. Se encasetaron ${formatNumber(totalEncasetado2025)} pollitos en 2025 vs ${formatNumber(totalEncasetado2024)} pollitos en 2024. Fórmula: ((2025 - 2024) / 2024) × 100 = ((${formatNumber(totalEncasetado2025)} - ${formatNumber(totalEncasetado2024)}) / ${formatNumber(totalEncasetado2024)}) × 100 = ${variacionEncasetado}%. La diferencia absoluta es de ${formatNumber(Math.abs(totalEncasetado2025 - totalEncasetado2024))} pollitos ${variacionEncasetado > 0 ? 'más' : 'menos'}. Esta variación refleja ${variacionEncasetado > 0 ? 'un crecimiento' : 'una reducción'} en la capacidad productiva.`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Comparación 2025 vs 2024</span>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{variacionEncasetado > 0 ? '+' : ''}{variacionEncasetado}%</div>
          <div className="text-sm text-gray-600 mt-1">Fórmula: (2025-2024)/2024×100</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Diferencia 2025 - 2024</div>
            <div className={`text-lg font-semibold ${variacionEncasetado > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {variacionEncasetado > 0 ? '+' : ''}{formatNumber(Math.abs(totalEncasetado2025 - totalEncasetado2024))} pollitos
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Promedio Mensual de Encasetamiento 2025',
            `El promedio mensual es de ${formatNumber(promedioMensual2025)} pollitos. Se calcula dividiendo el total anual (${formatNumber(totalEncasetado2025)} pollitos) entre los ${totalesPorAnio[2025]?.meses || 12} meses con datos. Fórmula: ${formatNumber(totalEncasetado2025)} ÷ ${totalesPorAnio[2025]?.meses || 12} = ${formatNumber(promedioMensual2025)} pollitos/mes. Este indicador permite evaluar la consistencia de la operación y planificar recursos (alimento, personal, logística). En 2024 el promedio fue de ${formatNumber(promedioMensual2024)} pollitos/mes.`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Promedio Mensual 2025</span>
            <Calendar className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatNumber(promedioMensual2025)}</div>
          <div className="text-sm text-gray-600 mt-1">Total anual ÷ meses</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Promedio 2024</div>
            <div className="text-lg font-semibold text-orange-400">{formatNumber(promedioMensual2024)} pollitos/mes</div>
          </div>
        </motion.div>
      </div>

      {/* TABLA COMPARATIVA ENCASETAMIENTO 2025 vs 2024 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 backdrop-blur-xl rounded-xl p-6 border-2 border-blue-500/30"
      >
        <div className="flex items-center gap-3 mb-6">
          <Factory className="w-8 h-8 text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900">COMPARATIVO ENCASETAMIENTO MENSUAL 2025 vs 2024</h2>
        </div>
        
        <CollapsibleTable 
          title="Detalle Mensual de Encasetamiento"
          defaultOpen={false}
          totalRow={[
            { label: 'TOTAL ANUAL' },
            { label: `Prog 2025: ${formatNumber(totalProgramado2025)}`, color: 'text-gray-600' },
            { label: `Real 2025: ${formatNumber(totalEncasetado2025)}`, color: 'text-blue-500' },
            { label: `Real 2024: ${formatNumber(totalEncasetado2024)}`, color: 'text-gray-600' },
            { label: `Var: ${variacionEncasetado > 0 ? '+' : ''}${variacionEncasetado}%`, color: parseFloat(variacionEncasetado) >= 0 ? 'text-green-500' : 'text-red-500' },
          ]}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-blue-600">
                  <th className="text-left py-3 px-4 text-gray-700 font-bold bg-blue-900/30">MES</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-bold bg-gray-100/30">PROG 2025</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-bold bg-blue-900/30">REAL 2025</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-bold bg-gray-100/30">REAL 2024</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-bold bg-purple-900/30">DIFERENCIA</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-bold bg-orange-900/30">% VARIACIÓN</th>
                </tr>
              </thead>
              <tbody>
                {encasetadoMeses.map((mes, idx) => {
                  const diferencia = mes.real2025 - mes.real2024;
                  const variacion = mes.real2024 > 0 ? ((diferencia / mes.real2024) * 100).toFixed(2) : 0;
                  return (
                    <tr key={idx} className="border-b border-gray-200/50 hover:bg-gray-100/30 transition-colors">
                      <td className="py-3 px-4 text-gray-900 font-semibold">{mes.mes}</td>
                      <td className="py-3 px-4 text-right text-gray-600">{formatNumber(mes.prog2025)}</td>
                      <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatNumber(mes.real2025)}</td>
                      <td className="py-3 px-4 text-right text-gray-600">{formatNumber(mes.real2024)}</td>
                      <td className="py-3 px-4 text-right text-purple-400">{formatNumber(diferencia)}</td>
                      <td className={`py-3 px-4 text-right font-bold ${parseFloat(variacion) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {parseFloat(variacion) > 0 ? '+' : ''}{variacion}%
                      </td>
                    </tr>
                  );
                })}
                {/* Fila de totales */}
                <tr className="border-t-2 border-blue-600 bg-blue-900/20 font-bold">
                  <td className="py-3 px-4 text-yellow-300 font-bold">TOTAL</td>
                  <td className="py-3 px-4 text-right text-gray-700">{formatNumber(totalProgramado2025)}</td>
                  <td className="py-3 px-4 text-right text-blue-400 text-lg">{formatNumber(totalEncasetado2025)}</td>
                  <td className="py-3 px-4 text-right text-gray-700">{formatNumber(totalEncasetado2024)}</td>
                  <td className="py-3 px-4 text-right text-purple-400 text-lg">{formatNumber(totalEncasetado2025 - totalEncasetado2024)}</td>
                  <td className={`py-3 px-4 text-right text-lg ${parseFloat(variacionEncasetado) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {parseFloat(variacionEncasetado) > 0 ? '+' : ''}{variacionEncasetado}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 bg-gray-100/30 rounded-lg p-4 border border-gray-300">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-gray-900">Análisis Comparativo:</span> Esta tabla muestra el encasetamiento mensual comparando 2025 vs 2024. La diferencia y % de variación permiten identificar meses con crecimiento o reducción de la operación. Los valores en verde indican crecimiento, mientras que los rojos señalan reducción.
            </p>
          </div>
        </CollapsibleTable>
      </motion.div>

      {/* Gráfico Comparativo Programado vs Real */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.4 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-gray-200 hover:border-blue-500 transition-all cursor-pointer"
        onClick={() => openModal(
          'Cumplimiento Mensual del Programa',
          `Comparación mes a mes entre el encasetamiento programado y el real. Las barras azules muestran lo programado y las verdes lo ejecutado. Un cumplimiento consistente cercano al 100% indica buena planificación y ejecución.`
        )}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-2">Cumplimiento del Programado 2025</h3>
        <p className="text-x text-gray-600 mb-6">Programado vs Real mensual</p>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={encasetadoMeses} margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="mes" stroke="#6b7280" height={60} style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" width={80} style={{ fontSize: '12px' }} tickFormatter={(value) => formatNumber(value)} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', border: '2px solid #3b82f6', borderRadius: '12px', padding: '12px' }}
              labelStyle={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}
              formatter={(value, name) => {
                const formatted = formatNumber(value);
                return [formatted + ' pollitos', name];
              }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const prog = payload.find(p => p.dataKey === 'prog2025')?.value || 0;
                  const real = payload.find(p => p.dataKey === 'real2025')?.value || 0;
                  const cumplimiento = prog > 0 ? ((real / prog) * 100).toFixed(1) : 0;
                  const diferencia = real - prog;
                  
                  return (
                    <div className="bg-white border-2 border-blue-500 rounded-xl p-4 shadow-xl">
                      <p className="font-bold text-gray-900 mb-3 text-lg">{label}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-blue-600 font-medium">Programado:</span>
                          <span className="font-bold text-gray-900">{formatNumber(prog)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-green-600 font-medium">Real:</span>
                          <span className="font-bold text-gray-900">{formatNumber(real)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-gray-600 font-medium">Cumplimiento:</span>
                            <span className={`font-bold ${cumplimiento >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
                              {cumplimiento}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center gap-4 mt-1">
                            <span className="text-gray-600 font-medium">Diferencia:</span>
                            <span className={`font-bold ${diferencia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {diferencia >= 0 ? '+' : ''}{formatNumber(diferencia)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="prog2025" fill="#3b82f6" name="Programado 2025" radius={[8, 8, 0, 0]} />
            <Bar dataKey="real2025" fill="#10b981" name="Real 2025" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Gráfico de Comparación Anual 2024 vs 2025 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.5 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-gray-200 hover:border-purple-500 transition-all cursor-pointer"
        onClick={() => openModal(
          'Comparación Anual 2024 vs 2025',
          `Comparación del encasetamiento real entre 2024 y 2025 mes a mes. Permite identificar patrones estacionales y crecimiento de la operación.`
        )}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-2">Encasetamiento Real 2024 vs 2025</h3>
        <p className="text-sm text-gray-600 mb-6">Comparación año tras año</p>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={encasetadoMeses} margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="mes" stroke="#6b7280" height={60} style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" width={80} style={{ fontSize: '12px' }} tickFormatter={(value) => formatNumber(value)} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', border: '2px solid #8b5cf6', borderRadius: '12px', padding: '12px' }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const real2024 = payload.find(p => p.dataKey === 'real2024')?.value || 0;
                  const real2025 = payload.find(p => p.dataKey === 'real2025')?.value || 0;
                  const diferencia = real2025 - real2024;
                  const variacion = real2024 > 0 ? ((diferencia / real2024) * 100).toFixed(1) : 0;
                  
                  return (
                    <div className="bg-white border-2 border-purple-500 rounded-xl p-4 shadow-xl">
                      <p className="font-bold text-gray-900 mb-3 text-lg">{label}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-indigo-600 font-medium">Real 2024:</span>
                          <span className="font-bold text-gray-900">{formatNumber(real2024)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-green-600 font-medium">Real 2025:</span>
                          <span className="font-bold text-gray-900">{formatNumber(real2025)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-gray-600 font-medium">Diferencia:</span>
                            <span className={`font-bold ${diferencia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {diferencia >= 0 ? '+' : ''}{formatNumber(diferencia)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center gap-4 mt-1">
                            <span className="text-gray-600 font-medium">Variación:</span>
                            <span className={`font-bold ${variacion >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {variacion >= 0 ? '+' : ''}{variacion}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Area type="monotone" dataKey="real2024" fill="#6366f1" fillOpacity={0.3} stroke="#6366f1" strokeWidth={2} name="Real 2024" />
            <Area type="monotone" dataKey="real2025" fill="#10b981" fillOpacity={0.3} stroke="#10b981" strokeWidth={2} name="Real 2025" />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>



      {/* Modal de Explicación */}
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
              className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-blue-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-blue-400" />
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-gray-900 rounded-lg transition-colors"
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

