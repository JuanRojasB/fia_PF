import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ComposedChart, Area } from 'recharts';
import { Factory, TrendingUp, Calendar, Egg, Drumstick, X, Info } from 'lucide-react';
import React from 'react';

export default function ProduccionDashboard({ data }) {
  const [selectedMonth, setSelectedMonth] = React.useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  // Manejar estructura del backend: { sacrificio: [...], encasetado: [...], totales: {...} }
  // Los datos ya vienen procesados por mes con prog2024, real2024, prog2025, real2025
  let sacrificioMeses = [];
  let encasetadoMeses = [];
  
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    // Formato nuevo: objeto con propiedades ya procesadas
    sacrificioMeses = data.sacrificio || [];
    encasetadoMeses = data.encasetado || [];
    
    console.log('ProduccionDashboard - Datos del backend:', { 
      sacrificioLength: sacrificioMeses.length,
      encasetadoLength: encasetadoMeses.length,
      sampleSacrificio: sacrificioMeses[0],
      sampleEncasetado: encasetadoMeses[0]
    });
  } else if (Array.isArray(data)) {
    // Formato antiguo: array con tipo - necesita procesamiento
    console.log('ProduccionDashboard - Formato array antiguo, procesando...');
    const sacrificioData = data.filter(d => d.tipo === 'SACRIFICIO');
    const encasetadoData = data.filter(d => d.tipo === 'ENCASETADO');
    
    // Procesar datos...
    const ordenMeses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 
                        'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
    
    const encasetadoMap = {};
    ordenMeses.forEach(mes => {
      encasetadoMap[mes] = { 
        mes, 
        prog2024: 0, real2024: 0, 
        prog2025: 0, real2025: 0 
      };
    });
    
    encasetadoData.forEach(d => {
      const mes = d.mes || 'N/A';
      if (encasetadoMap[mes]) {
        const prog = parseFloat(d.programado) || 0;
        const real = parseFloat(d.real) || 0;
        
        if (d.anio === 2024) {
          encasetadoMap[mes].prog2024 += prog;
          encasetadoMap[mes].real2024 += real;
        } else if (d.anio === 2025) {
          encasetadoMap[mes].prog2025 += prog;
          encasetadoMap[mes].real2025 += real;
        }
      }
    });
    
    encasetadoMeses = ordenMeses.map(mes => encasetadoMap[mes]);
    
    const sacrificioMap = {};
    ordenMeses.forEach(mes => {
      sacrificioMap[mes] = { 
        mes,
        prog2024: 0, real2024: 0, comprado2024: 0, total2024: 0, maximalim2024: 0, progr_fiesta2024: 0, entre_real_pf2024: 0,
        prog2025: 0, real2025: 0, comprado2025: 0, total2025: 0, maximalim2025: 0, progr_fiesta2025: 0, entre_real_pf2025: 0
      };
    });
    
    sacrificioData.forEach(d => {
      const mes = d.mes || 'N/A';
      if (sacrificioMap[mes]) {
        const prog = parseFloat(d.programado) || 0;
        const real = parseFloat(d.real) || 0;
        const comprado = parseFloat(d.comprado) || 0;
        const total = parseFloat(d.total) || 0;
        const maximalim = parseFloat(d.maximalim) || 0;
        const progrFiesta = parseFloat(d.progr_fiesta) || 0;
        const entreRealPf = parseFloat(d.entre_real_pf) || 0;
        
        if (d.anio === 2024) {
          sacrificioMap[mes].prog2024 += prog;
          sacrificioMap[mes].real2024 += real;
          sacrificioMap[mes].comprado2024 += comprado;
          sacrificioMap[mes].total2024 += total;
          sacrificioMap[mes].maximalim2024 += maximalim;
          sacrificioMap[mes].progr_fiesta2024 += progrFiesta;
          sacrificioMap[mes].entre_real_pf2024 += entreRealPf;
        } else if (d.anio === 2025) {
          sacrificioMap[mes].prog2025 += prog;
          sacrificioMap[mes].real2025 += real;
          sacrificioMap[mes].comprado2025 += comprado;
          sacrificioMap[mes].total2025 += total;
          sacrificioMap[mes].maximalim2025 += maximalim;
          sacrificioMap[mes].progr_fiesta2025 += progrFiesta;
          sacrificioMap[mes].entre_real_pf2025 += entreRealPf;
        }
      }
    });
    
    sacrificioMeses = ordenMeses.map(mes => sacrificioMap[mes]);
  }
  
  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calcular totales de ENCASETADO
  const totalEncasetado2024 = encasetadoMeses.reduce((sum, d) => sum + (d.real2024 || 0), 0);
  const totalEncasetado2025 = encasetadoMeses.reduce((sum, d) => sum + (d.real2025 || 0), 0);

  // Calcular totales de SACRIFICIO
  const totalSacrificio2024 = sacrificioMeses.reduce((sum, d) => sum + (d.real2024 || 0), 0);
  const totalSacrificio2025 = sacrificioMeses.reduce((sum, d) => sum + (d.real2025 || 0), 0);

  // Variaciones
  const variacionEncasetado = totalEncasetado2024 > 0 
    ? (((totalEncasetado2025 - totalEncasetado2024) / totalEncasetado2024) * 100).toFixed(1) 
    : 0;
  const variacionSacrificio = totalSacrificio2024 > 0 
    ? (((totalSacrificio2025 - totalSacrificio2024) / totalSacrificio2024) * 100).toFixed(1) 
    : 0;

  return (
    <div className="space-y-8">
      {(sacrificioMeses.length === 0 && encasetadoMeses.length === 0) ? (
        <div className="text-gray-400">No hay datos disponibles</div>
      ) : (
        <>
      {/* SECCIÓN ENCASETADO */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Egg className="w-8 h-8 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">ENCASETADO</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total 2025</span>
              <Factory className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white">{formatNumber(totalEncasetado2025)}</div>
            <div className="text-sm text-gray-400 mt-1">Aves encasetadas</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total 2024</span>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white">{formatNumber(totalEncasetado2024)}</div>
            <div className="text-sm text-gray-400 mt-1">Año anterior</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Diferencia</span>
              <Calendar className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white">{formatNumber(totalEncasetado2025 - totalEncasetado2024)}</div>
            <div className={`text-sm mt-1 ${variacionEncasetado >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {variacionEncasetado > 0 ? '+' : ''}{variacionEncasetado}% vs 2024
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-slate-700 cursor-pointer hover:border-slate-500 transition-all"
          onClick={() => openModal(
            'Aves Encasetadas - Comparación Mensual',
            'ENCASETADO: Ingreso de pollitos de 1 día a granjas. Define disponibilidad para sacrificio 45-50 días después. Programado vs Real muestra ejecución del plan. 2025: -0.35% encasetamiento pero compensado con menor mortalidad, logrando mayor disponibilidad final. Meses con mayor encasetamiento responden a proyecciones de demanda alta posterior.'
          )}
        >
          <h3 className="text-xl font-bold text-white mb-6">Aves Encasetadas por Mes (2024 vs 2025)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={encasetadoMeses.filter(d => d.mes !== 'TOTAL')} margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="mes" stroke="#9ca3af" height={60} style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" width={80} style={{ fontSize: '12px' }} />
              <Tooltip content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const diff2024 = data.real2024 - data.prog2024;
                  const diff2025 = data.real2025 - data.prog2025;
                  const pct2024 = ((diff2024 / data.prog2024) * 100).toFixed(1);
                  const pct2025 = ((diff2025 / data.prog2025) * 100).toFixed(1);
                  
                  return (
                    <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-4 shadow-2xl" style={{ minWidth: '280px' }}>
                      <p className="text-white font-bold mb-4 text-center text-lg">{label}</p>
                      
                      {/* 2024 */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-indigo-400 font-semibold">2024</span>
                          <span className={`text-xs font-bold ${diff2024 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {diff2024 >= 0 ? '+' : ''}{pct2024}%
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-indigo-300">Programado</span>
                              <span className="text-white font-bold">{formatNumber(data.prog2024)}</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-400 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-indigo-200">Real</span>
                              <span className="text-white font-bold">{formatNumber(data.real2024)}</span>
                            </div>
                            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(data.real2024 / data.prog2024) * 100}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-600 my-3"></div>

                      {/* 2025 */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-emerald-400 font-semibold">2025</span>
                          <span className={`text-xs font-bold ${diff2025 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {diff2025 >= 0 ? '+' : ''}{pct2025}%
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-emerald-300">Programado</span>
                              <span className="text-white font-bold">{formatNumber(data.prog2025)}</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-400 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-emerald-200">Real</span>
                              <span className="text-white font-bold">{formatNumber(data.real2025)}</span>
                            </div>
                            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(data.real2025 / data.prog2025) * 100}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="real2024" fill="#6366f1" name="2024" radius={[8, 8, 0, 0]} />
              <Bar dataKey="real2025" fill="#10b981" name="2025" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* SECCIÓN SACRIFICIO */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Drumstick className="w-8 h-8 text-red-400" />
          <h2 className="text-2xl font-bold text-white">POLLO SACRIFICADO</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-red-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total 2025</span>
              <Factory className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-3xl font-bold text-white">{formatNumber(sacrificioMeses.filter(d => d.mes !== 'TOTAL').reduce((sum, d) => sum + (d.total2025 || 0), 0))}</div>
            <div className="text-sm text-gray-400 mt-1">Aves sacrificadas</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-orange-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total 2024</span>
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-white">{formatNumber(sacrificioMeses.filter(d => d.mes !== 'TOTAL').reduce((sum, d) => sum + (d.total2024 || 0), 0))}</div>
            <div className="text-sm text-gray-400 mt-1">Año anterior</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-yellow-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Diferencia</span>
              <Calendar className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-white">{formatNumber(
              sacrificioMeses.filter(d => d.mes !== 'TOTAL').reduce((sum, d) => sum + (d.total2025 || 0), 0) -
              sacrificioMeses.filter(d => d.mes !== 'TOTAL').reduce((sum, d) => sum + (d.total2024 || 0), 0)
            )}</div>
            <div className={`text-sm mt-1 ${
              (sacrificioMeses.filter(d => d.mes !== 'TOTAL').reduce((sum, d) => sum + (d.total2025 || 0), 0) -
               sacrificioMeses.filter(d => d.mes !== 'TOTAL').reduce((sum, d) => sum + (d.total2024 || 0), 0)) >= 0 
                ? 'text-green-400' : 'text-red-400'
            }`}>
              {(() => {
                const total2024 = sacrificioMeses.filter(d => d.mes !== 'TOTAL').reduce((sum, d) => sum + (d.total2024 || 0), 0);
                const total2025 = sacrificioMeses.filter(d => d.mes !== 'TOTAL').reduce((sum, d) => sum + (d.total2025 || 0), 0);
                const diff = total2025 - total2024;
                const pct = total2024 > 0 ? ((diff / total2024) * 100).toFixed(1) : 0;
                return `${diff >= 0 ? '+' : ''}${pct}% vs 2024`;
              })()}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-slate-700 cursor-pointer hover:border-slate-500 transition-all"
          onClick={() => openModal(
            'Aves Sacrificadas - Comparación Mensual',
            'SACRIFICIO: Aves procesadas mensualmente en planta. Total = producción propia (Real PF) + compras externas. 2025: +0.81% más procesamiento vs 2024, con menos encasetamiento inicial (mejor supervivencia). Compras externas se realizan estratégicamente cuando producción propia no cubre demanda. Maxialim y Progr Fiesta son compromisos comerciales específicos con seguimiento independiente.'
          )}
        >
          <h3 className="text-xl font-bold text-white mb-6">Aves Sacrificadas por Mes (2024 vs 2025)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={sacrificioMeses.filter(d => d.mes !== 'TOTAL')} margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="mes" 
                stroke="#9ca3af" 
                height={50} 
                style={{ fontSize: '12px' }} 
                interval={0}
              />
              <YAxis stroke="#9ca3af" width={80} style={{ fontSize: '12px' }} />
              <Tooltip content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const mesCompleto = data.mesCompleto || label;
                  const diff2024 = data.total2024 - data.prog2024;
                  const diff2025 = data.total2025 - data.prog2025;
                  const pct2024 = data.prog2024 > 0 ? ((diff2024 / data.prog2024) * 100).toFixed(1) : 0;
                  const pct2025 = data.prog2025 > 0 ? ((diff2025 / data.prog2025) * 100).toFixed(1) : 0;
                  
                  return (
                    <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-4 shadow-2xl" style={{ minWidth: '280px' }}>
                      <p className="text-white font-bold mb-4 text-center text-lg">{mesCompleto}</p>
                      
                      {/* 2024 */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-indigo-400 font-semibold">2024</span>
                          <span className={`text-xs font-bold ${diff2024 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {diff2024 >= 0 ? '+' : ''}{pct2024}%
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-indigo-300">Programado</span>
                              <span className="text-white font-bold">{formatNumber(data.prog2024)}</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-400 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-indigo-200">Total</span>
                              <span className="text-white font-bold">{formatNumber(data.total2024)}</span>
                            </div>
                            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(data.total2024 / data.prog2024) * 100}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-600 my-3"></div>

                      {/* 2025 */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-emerald-400 font-semibold">2025</span>
                          <span className={`text-xs font-bold ${diff2025 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {diff2025 >= 0 ? '+' : ''}{pct2025}%
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-emerald-300">Programado</span>
                              <span className="text-white font-bold">{formatNumber(data.prog2025)}</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-400 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-emerald-200">Total</span>
                              <span className="text-white font-bold">{formatNumber(data.total2025)}</span>
                            </div>
                            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(data.total2025 / data.prog2025) * 100}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line type="monotone" dataKey="total2024" stroke="#6366f1" strokeWidth={3} name="2024" dot={{ fill: '#6366f1', r: 4 }} />
              <Line type="monotone" dataKey="total2025" stroke="#10b981" strokeWidth={3} name="2025" dot={{ fill: '#10b981', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Vista de Tarjetas Interactivas por Mes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-xl font-bold text-white mb-6">Pollo Sacrificado - Vista Mensual</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {sacrificioMeses.filter(d => d.mes !== 'TOTAL').map((mes, idx) => {
              const diff = mes.total2025 - mes.total2024;
              const pct = mes.total2024 > 0 ? ((diff / mes.total2024) * 100).toFixed(1) : 0;
              
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="cursor-pointer transition-all duration-300 bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 rounded-xl p-4"
                  onClick={() => setSelectedMonth(mes)}
                >
                  <div className="text-center mb-3">
                    <div className="text-lg font-bold text-white mb-1">{mes.mes}</div>
                    <div className={`text-xs font-semibold ${diff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {diff >= 0 ? '↑' : '↓'} {pct}%
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="bg-indigo-900/30 rounded p-2">
                      <div className="text-xs text-indigo-300 mb-1">2024</div>
                      <div className="text-lg font-bold text-white">{formatNumber(mes.total2024)}</div>
                    </div>
                    <div className="bg-emerald-900/30 rounded p-2">
                      <div className="text-xs text-emerald-300 mb-1">2025</div>
                      <div className="text-lg font-bold text-white">{formatNumber(mes.total2025)}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Modal de Detalle */}
        {selectedMonth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMonth(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-2xl border-2 border-cyan-500 shadow-2xl shadow-cyan-500/20 max-w-5xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between z-10">
                <div>
                  <h3 className="text-3xl font-bold text-white">{selectedMonth.mes}</h3>
                  <div className={`text-xl font-bold mt-1 ${(selectedMonth.total2025 - selectedMonth.total2024) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {(selectedMonth.total2025 - selectedMonth.total2024) >= 0 ? '↑' : '↓'} {formatNumber(Math.abs(selectedMonth.total2025 - selectedMonth.total2024))} 
                    ({selectedMonth.total2024 > 0 ? (((selectedMonth.total2025 - selectedMonth.total2024) / selectedMonth.total2024) * 100).toFixed(1) : 0}%)
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMonth(null)}
                  className="text-gray-400 hover:text-white transition-colors text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-700"
                >
                  ×
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 2024 */}
                <div className="bg-gradient-to-br from-indigo-900/40 to-indigo-800/20 rounded-xl p-6 border-2 border-indigo-700/50">
                  <div className="text-center mb-6">
                    <div className="text-indigo-400 font-semibold text-lg mb-2">AÑO 2024</div>
                    <div className="text-5xl font-bold text-white mb-2">{formatNumber(selectedMonth.total2024)}</div>
                    <div className="text-sm text-gray-400">Total Sacrificado</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-slate-800/70 rounded-lg p-4 border border-indigo-700/30">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-400">Programado</span>
                        <span className="text-xl font-bold text-indigo-300">{formatNumber(selectedMonth.prog2024)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Real PF</span>
                        <span className="text-xl font-bold text-white">{formatNumber(selectedMonth.real2024)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-yellow-900/30 rounded-lg p-3 border border-yellow-700/50">
                        <div className="text-xs text-yellow-400 mb-2">Comprado</div>
                        <div className="text-lg font-bold text-white">{formatNumber(selectedMonth.comprado2024)}</div>
                      </div>
                      <div className="bg-orange-900/30 rounded-lg p-3 border border-orange-700/50">
                        <div className="text-xs text-orange-400 mb-2">Maxialim</div>
                        <div className="text-lg font-bold text-white">{formatNumber(selectedMonth.maximalim2024)}</div>
                      </div>
                      <div className="bg-cyan-900/30 rounded-lg p-3 border border-cyan-700/50">
                        <div className="text-xs text-cyan-400 mb-2">Progr Fiesta</div>
                        <div className="text-lg font-bold text-white">{formatNumber(selectedMonth.progr_fiesta2024)}</div>
                      </div>
                      <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-700/50">
                        <div className="text-xs text-purple-400 mb-2">Entre Real-PF</div>
                        <div className="text-lg font-bold text-white">{formatNumber(selectedMonth.entre_real_pf2024)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2025 */}
                <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 rounded-xl p-6 border-2 border-emerald-700/50">
                  <div className="text-center mb-6">
                    <div className="text-emerald-400 font-semibold text-lg mb-2">AÑO 2025</div>
                    <div className="text-5xl font-bold text-white mb-2">{formatNumber(selectedMonth.total2025)}</div>
                    <div className="text-sm text-gray-400">Total Sacrificado</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-slate-800/70 rounded-lg p-4 border border-emerald-700/30">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-400">Programado</span>
                        <span className="text-xl font-bold text-emerald-300">{formatNumber(selectedMonth.prog2025)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Real PF</span>
                        <span className="text-xl font-bold text-white">{formatNumber(selectedMonth.real2025)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-yellow-900/30 rounded-lg p-3 border border-yellow-700/50">
                        <div className="text-xs text-yellow-400 mb-2">Comprado</div>
                        <div className="text-lg font-bold text-white">{formatNumber(selectedMonth.comprado2025)}</div>
                      </div>
                      <div className="bg-orange-900/30 rounded-lg p-3 border border-orange-700/50">
                        <div className="text-xs text-orange-400 mb-2">Maxialim</div>
                        <div className="text-lg font-bold text-white">{formatNumber(selectedMonth.maximalim2025)}</div>
                      </div>
                      <div className="bg-cyan-900/30 rounded-lg p-3 border border-cyan-700/50">
                        <div className="text-xs text-cyan-400 mb-2">Progr Fiesta</div>
                        <div className="text-lg font-bold text-white">{formatNumber(selectedMonth.progr_fiesta2025)}</div>
                      </div>
                      <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-700/50">
                        <div className="text-xs text-purple-400 mb-2">Entre Real-PF</div>
                        <div className="text-lg font-bold text-white">{formatNumber(selectedMonth.entre_real_pf2025)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección de Explicación de Métricas */}
              <div className="px-6 pb-6">
                <div className="bg-slate-900/50 rounded-xl p-5 border border-cyan-500/30">
                  <h4 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Explicación de Métricas
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-3">
                      <div>
                        <span className="font-semibold text-indigo-300">Programado:</span>
                        <span className="text-gray-300 ml-2">Meta de sacrificio planificada para el mes según proyección de demanda y disponibilidad de aves.</span>
                      </div>
                      <div>
                        <span className="font-semibold text-white">Real PF:</span>
                        <span className="text-gray-300 ml-2">Aves sacrificadas de producción propia de Pollo Fiesta (granjas propias).</span>
                      </div>
                      <div>
                        <span className="font-semibold text-yellow-300">Comprado:</span>
                        <span className="text-gray-300 ml-2">Aves adquiridas externamente para complementar producción cuando la demanda supera disponibilidad propia.</span>
                      </div>
                      <div>
                        <span className="font-semibold text-green-300">Total:</span>
                        <span className="text-gray-300 ml-2">Suma de Real PF + Comprado. Representa el volumen total procesado en planta.</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="font-semibold text-orange-300">Maxialim:</span>
                        <span className="text-gray-300 ml-2">Compromiso comercial específico con cliente Maxialim. Requiere seguimiento independiente por contrato.</span>
                      </div>
                      <div>
                        <span className="font-semibold text-cyan-300">Progr Fiesta:</span>
                        <span className="text-gray-300 ml-2">Programación interna de entregas de Pollo Fiesta según pedidos confirmados.</span>
                      </div>
                      <div>
                        <span className="font-semibold text-purple-300">Entre Real-PF:</span>
                        <span className="text-gray-300 ml-2">Diferencia entre entrega real y programación de Pollo Fiesta. Indica cumplimiento de compromisos.</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <p className="text-xs text-gray-400 italic">
                      💡 Tip: Un Total mayor que Programado indica buena ejecución. Comprado alto sugiere oportunidad de aumentar producción propia.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
        </>
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full border-4 border-indigo-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-indigo-400" />
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
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
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
