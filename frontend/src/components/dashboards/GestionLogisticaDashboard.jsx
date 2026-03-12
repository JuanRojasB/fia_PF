import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Truck, TrendingUp, Building, X, Info, Users, Package, DollarSign, TrendingDown } from 'lucide-react';

export default function GestionLogisticaDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });
  const hasAnimated = useRef(false);

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  // Manejar estructura del backend
  const logisticaData = Array.isArray(data) ? data : (data?.items || []);
  
  if (logisticaData.length === 0) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return '$0';
    return '$' + new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Procesar datos por sede y concepto
  const conceptosMap = {};
  logisticaData.forEach(d => {
    const sedeNormalizada = (d.sede || '').toString().trim().toUpperCase();
    if (!sedeNormalizada || sedeNormalizada === 'NULL' || !['SEDE1', 'SEDE2', 'SEDE3'].includes(sedeNormalizada)) return;
    
    const conceptoNormalizado = (d.concepto || '').toString().trim();
    if (!conceptoNormalizado) return;
    
    const conceptoUpper = conceptoNormalizado.toUpperCase();
    if (conceptoUpper.includes('TOTAL') || conceptoUpper.includes('GASTOS LOGISTICOS')) return;
    
    const anio = parseInt(d.anio);
    if (anio !== 2024 && anio !== 2025) return;
    
    const key = `${sedeNormalizada}-${conceptoNormalizado}-${anio}`;
    const valor = parseFloat(d.valor) || 0;
    
    if (!conceptosMap[key] || valor !== 0) {
      conceptosMap[key] = {
        sede: sedeNormalizada,
        concepto: conceptoNormalizado,
        anio: anio,
        valor: valor
      };
    }
  });
  
  // Reorganizar por concepto y sede
  const conceptosPorSede = {};
  Object.values(conceptosMap).forEach(d => {
    const key = `${d.sede}-${d.concepto}`;
    if (!conceptosPorSede[key]) {
      conceptosPorSede[key] = { sede: d.sede, concepto: d.concepto, valor2024: 0, valor2025: 0 };
    }
    if (d.anio === 2024) conceptosPorSede[key].valor2024 = d.valor;
    else if (d.anio === 2025) conceptosPorSede[key].valor2025 = d.valor;
  });
  
  const conceptosData = Object.values(conceptosPorSede);
  const total2025 = conceptosData.reduce((sum, d) => sum + d.valor2025, 0);
  const total2024 = conceptosData.reduce((sum, d) => sum + d.valor2024, 0);
  const variacionTotal = total2024 > 0 ? (((total2025 - total2024) / total2024) * 100).toFixed(2) : 0;

  // Datos por sede
  const sedesMap = {};
  conceptosData.forEach(d => {
    const sedeNormalizada = (d.sede || '').toString().trim().toUpperCase();
    if (!['SEDE1', 'SEDE2', 'SEDE3'].includes(sedeNormalizada)) return;
    
    if (!sedesMap[sedeNormalizada]) sedesMap[sedeNormalizada] = { sede: sedeNormalizada, total2024: 0, total2025: 0 };
    sedesMap[sedeNormalizada].total2024 += d.valor2024;
    sedesMap[sedeNormalizada].total2025 += d.valor2025;
  });
  
  const sedesData = ['SEDE1', 'SEDE2', 'SEDE3']
    .map(sede => sedesMap[sede])
    .filter(Boolean)
    .map(s => ({
      ...s,
      variacion: s.total2024 > 0 ? (((s.total2025 - s.total2024) / s.total2024) * 100).toFixed(2) : 0
    }));

  // Consolidado por concepto
  const consolidado = {};
  conceptosData.forEach(d => {
    if (!consolidado[d.concepto]) {
      consolidado[d.concepto] = { concepto: d.concepto, valor2024: 0, valor2025: 0 };
    }
    consolidado[d.concepto].valor2024 += d.valor2024;
    consolidado[d.concepto].valor2025 += d.valor2025;
  });

  const consolidadoArray = Object.values(consolidado).map(c => ({
    ...c,
    variacion: c.valor2024 > 0 ? (((c.valor2025 - c.valor2024) / c.valor2024) * 100).toFixed(2) : 0,
    diferencia: c.valor2025 - c.valor2024
  }));

  const COLORS = ['#38bdf8', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Información de sedes
  const sedesInfo = [
    { nombre: 'SEDE1', responsable: 'Clara Fontalvo', colaboradores: 52, especialidad: 'Pollo entero tipo asadero', variacionVentas: -9.4 },
    { nombre: 'SEDE2', responsable: 'Alexis Pérez', colaboradores: 56, especialidad: 'Productos congelados', variacionVentas: 31.3 },
    { nombre: 'SEDE3', responsable: 'Angélica Cárdenas', colaboradores: 89, especialidad: 'Clientes institucionales', variacionVentas: 0.93 }
  ];

  return (
    <div className="space-y-6">
      {/* Header con información general */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500/20 to-purple-600/10 backdrop-blur-xl rounded-xl p-6 border-2 border-blue-500/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <Truck className="w-8 h-8 text-blue-400" />
          <h2 className="text-3xl font-bold text-white">GESTIÓN LOGÍSTICA</h2>
        </div>
        <p className="text-gray-300 leading-relaxed mb-4">
          La Gerencia Logística es responsable de la gestión y el movimiento del pollo desde su recepción en la planta de beneficio hasta su distribución final a los clientes. 
          Actualmente, administra tres centros de operación, cada uno especializado en un segmento específico del mercado.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
            <div className="text-sm text-gray-400 mb-1">Muelles de Operación</div>
            <div className="text-3xl font-bold text-blue-400">12</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
            <div className="text-sm text-gray-400 mb-1">Total Colaboradores</div>
            <div className="text-3xl font-bold text-green-400">197</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
            <div className="text-sm text-gray-400 mb-1">Centros de Operación</div>
            <div className="text-3xl font-bold text-purple-400">3</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
            <div className="text-sm text-gray-400 mb-1">Variación Gastos</div>
            <div className={`text-3xl font-bold ${parseFloat(variacionTotal) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
              {variacionTotal}%
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal(
            'Gastos Logísticos Totales 2025',
            `Total de gastos operacionales logísticos para el año 2025: ${formatCurrency(total2025)}. Incluye personal de distribución, personal de postproceso, arriendos y congelación, fletes, combustibles y peajes. La variación del ${variacionTotal}% vs 2024 representa un incremento controlado, significativamente inferior a los incrementos base del período (salario mínimo 9.54%, fletes 9.5%, IPC 5.1%).`
          )}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Total Gastos 2025</span>
            <DollarSign className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-4xl font-bold text-white mb-1">{formatCurrency(total2025)}</div>
          <div className={`text-xs ${parseFloat(variacionTotal) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
            {variacionTotal > 0 ? '+' : ''}{variacionTotal}% vs 2024
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal(
            'Variación Anual',
            `Diferencia absoluta en gastos 2025 vs 2024: ${formatCurrency(Math.abs(total2025 - total2024))}. Este comportamiento evidencia una gestión eficiente del gasto, destacándose especialmente el ahorro en el costo de personal de distribución y las eficiencias operativas implementadas durante el año. La organización logró contener el crecimiento del gasto por debajo de los incrementos estructurales del mercado, generando un ahorro efectivo superior al 5% frente al escenario proyectado.`
          )}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Variación Anual</span>
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-4xl font-bold text-white mb-1">{formatCurrency(Math.abs(total2025 - total2024))}</div>
          <div className={`text-xs ${parseFloat(variacionTotal) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
            {parseFloat(variacionTotal) >= 0 ? 'Incremento' : 'Reducción'}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal(
            'Sedes Activas',
            'Tres centros de distribución operativos: Sede 1 (pollo entero tipo asadero), Sede 2 (productos congelados) y Sede 3 (clientes institucionales). Cada sede cuenta con personal especializado y opera de manera independiente para optimizar la atención a sus segmentos de mercado.'
          )}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Sedes Operativas</span>
            <Building className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-4xl font-bold text-white mb-1">{sedesData.length}</div>
          <div className="text-xs text-purple-400">Centros especializados</div>
        </motion.div>
      </div>

      {/* Información de Sedes con Responsables */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-blue-400" />
          <h3 className="text-2xl font-bold text-white">Estructura Organizacional por Sede</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sedesInfo.map((sede, idx) => {
            const sedeData = sedesData.find(s => s.sede === sede.nombre);
            const colores = [
              { bg: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/50', text: 'text-blue-400' },
              { bg: 'from-green-500/20 to-green-600/10', border: 'border-green-500/50', text: 'text-green-400' },
              { bg: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/50', text: 'text-purple-400' }
            ];
            const color = colores[idx];
            
            return (
              <div key={idx} className={`bg-gradient-to-br ${color.bg} rounded-xl p-6 border-2 ${color.border}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`text-2xl font-bold ${color.text}`}>{sede.nombre}</div>
                  <Users className={`w-6 h-6 ${color.text}`} />
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-400">Responsable</div>
                    <div className="text-lg font-semibold text-white">{sede.responsable}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Colaboradores</div>
                    <div className="text-2xl font-bold text-white">{sede.colaboradores}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Especialidad</div>
                    <div className="text-sm text-gray-300">{sede.especialidad}</div>
                  </div>
                  <div className="pt-3 border-t border-slate-600">
                    <div className="text-xs text-gray-400">Variación Ventas 2025</div>
                    <div className={`text-xl font-bold ${sede.variacionVentas >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {sede.variacionVentas > 0 ? '+' : ''}{sede.variacionVentas}%
                    </div>
                  </div>
                  {sedeData && (
                    <div className="pt-3 border-t border-slate-600">
                      <div className="text-xs text-gray-400">Gastos 2025</div>
                      <div className="text-lg font-bold text-white">{formatCurrency(sedeData.total2025)}</div>
                      <div className={`text-xs ${parseFloat(sedeData.variacion) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {sedeData.variacion > 0 ? '+' : ''}{sedeData.variacion}% vs 2024
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Gráficos Comparativos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => openModal(
            'Gastos por Sede',
            'Comparación de costos operativos entre las tres sedes. Sede 1 muestra una reducción del -2.59% gracias a la optimización de fletes y reducción de personal de postproceso. Sede 2 presenta un incremento del 14.37% debido al crecimiento en ventas del 30.42% y nuevos clientes. Sede 3 logra una reducción del -1.96% mediante optimización de congelación y gestión eficiente.'
          )}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-slate-700 hover:border-blue-500 transition-all cursor-pointer"
        >
          <h3 className="text-xl font-bold text-white mb-6">Gastos Logísticos por Sede (2024 vs 2025)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={sedesData} margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="sede" stroke="#9ca3af" style={{ fontSize: '14px' }} />
              <YAxis stroke="#9ca3af" width={80} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <Tooltip content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
                      <p className="text-white font-semibold mb-2">{payload[0].payload.sede}</p>
                      {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                          {entry.name}: {formatCurrency(entry.value)}
                        </p>
                      ))}
                      <p className="text-xs text-gray-400 mt-2">
                        Variación: {payload[0].payload.variacion}%
                      </p>
                    </div>
                  );
                }
                return null;
              }} />
              <Bar dataKey="total2024" fill="#6366f1" name="2024" radius={[8, 8, 0, 0]} />
              <Bar dataKey="total2025" fill="#10b981" name="2025" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-xl font-bold text-white mb-6">Distribución de Gastos por Sede 2025</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie 
                isAnimationActive={!hasAnimated.current}
                animationBegin={0}
                animationDuration={800}
                onAnimationEnd={() => { hasAnimated.current = true; }}
                data={sedesData}
                dataKey="total2025"
                nameKey="sede"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              >
                {sedesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
                      <p className="text-white font-semibold">{payload[0].name}</p>
                      <p className="text-green-400">{formatCurrency(payload[0].value)}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {((payload[0].value / total2025) * 100).toFixed(2)}% del total
                      </p>
                    </div>
                  );
                }
                return null;
              }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Gráfico de Variación por Concepto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <h3 className="text-xl font-bold text-white mb-6">Variación por Concepto (2024 vs 2025)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={consolidadoArray} layout="vertical" margin={{ left: 150, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9ca3af" tickFormatter={(value) => `${value.toFixed(1)}%`} />
            <YAxis type="category" dataKey="concepto" stroke="#9ca3af" width={140} style={{ fontSize: '12px' }} />
            <Tooltip content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
                    <p className="text-white font-semibold mb-2">{data.concepto}</p>
                    <p className="text-sm text-cyan-400">2024: {formatCurrency(data.valor2024)}</p>
                    <p className="text-sm text-green-400">2025: {formatCurrency(data.valor2025)}</p>
                    <p className={`text-sm font-bold mt-1 ${parseFloat(data.variacion) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                      Variación: {data.variacion}%
                    </p>
                  </div>
                );
              }
              return null;
            }} />
            <Bar dataKey="variacion" fill="#10b981" radius={[0, 8, 8, 0]}>
              {consolidadoArray.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={parseFloat(entry.variacion) >= 0 ? '#ef4444' : '#10b981'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>


      {/* Tablas detalladas por sede */}
      {['SEDE1', 'SEDE2', 'SEDE3'].map((sede, idx) => {
        const conceptosSede = conceptosData.filter(d => d.sede === sede);
        if (conceptosSede.length === 0) return null;

        const totalSede2024 = conceptosSede.reduce((sum, d) => sum + d.valor2024, 0);
        const totalSede2025 = conceptosSede.reduce((sum, d) => sum + d.valor2025, 0);
        const variacionSede = totalSede2024 > 0 ? (((totalSede2025 - totalSede2024) / totalSede2024) * 100) : 0;

        return (
          <motion.div
            key={sede}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + idx * 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700 overflow-x-auto"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              GASTOS OPERACIONALES LOGÍSTICOS {sede} AÑO 2024 VS 2025
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cyan-700/50 border-b-2 border-slate-600">
                  <th className="text-left py-3 px-4 text-white font-bold">CONCEPTO</th>
                  <th className="text-right py-3 px-4 text-white font-bold">TOTAL 2024</th>
                  <th className="text-right py-3 px-4 text-white font-bold">TOTAL 2025</th>
                  <th className="text-right py-3 px-4 text-white font-bold">% Var 25/24</th>
                </tr>
              </thead>
              <tbody>
                {conceptosSede.map((row, rowIdx) => {
                  const variacion = row.valor2024 > 0 ? (((row.valor2025 - row.valor2024) / row.valor2024) * 100) : 0;
                  const esIncremento = variacion > 0;
                  
                  return (
                    <tr key={rowIdx} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                      <td className="py-2 px-4 text-white">{row.concepto}</td>
                      <td className="py-2 px-4 text-right text-cyan-300 tabular-nums">
                        $ {row.valor2024.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td className="py-2 px-4 text-right text-orange-300 tabular-nums">
                        $ {row.valor2025.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td className="py-2 px-4 text-right tabular-nums">
                        <span className={`inline-flex items-center gap-1 ${esIncremento ? 'text-red-400' : 'text-green-400'}`}>
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${esIncremento ? 'bg-red-500' : 'bg-green-500'}`}>
                            {esIncremento ? '↑' : '↓'}
                          </span>
                          {variacion.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-slate-700/50 border-t-2 border-slate-500 font-bold">
                  <td className="py-3 px-4 text-white">TOTAL GASTOS LOGÍSTICOS 2024 VS 2025</td>
                  <td className="py-3 px-4 text-right text-cyan-300 tabular-nums">
                    $ {totalSede2024.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-4 text-right text-orange-300 tabular-nums">
                    $ {totalSede2025.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums">
                    <span className={`inline-flex items-center gap-1 ${variacionSede > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${variacionSede > 0 ? 'bg-red-500' : 'bg-green-500'}`}>
                        {variacionSede > 0 ? '↑' : '↓'}
                      </span>
                      {variacionSede.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        );
      })}

      {/* Tabla consolidada de todas las sedes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700 overflow-x-auto"
      >
        <h3 className="text-xl font-bold text-white mb-4">
          GASTOS OPERACIONALES LOGÍSTICOS SEDES 2024 VS 2025
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cyan-700/50 border-b-2 border-slate-600">
              <th className="text-left py-3 px-4 text-white font-bold">CONCEPTO</th>
              <th className="text-right py-3 px-4 text-white font-bold">TOTAL 2024</th>
              <th className="text-right py-3 px-4 text-white font-bold">TOTAL 2025</th>
              <th className="text-right py-3 px-4 text-white font-bold">% Var 25/24</th>
              <th className="text-center py-3 px-4 text-white font-bold">DISMINUCIÓN O INCREMENTO</th>
            </tr>
          </thead>
          <tbody>
            {consolidadoArray.map((row, idx) => {
              const esIncremento = row.diferencia > 0;
              
              return (
                <tr key={idx} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                  <td className="py-2 px-4 text-white">{row.concepto}</td>
                  <td className="py-2 px-4 text-right text-cyan-300 tabular-nums">
                    $ {row.valor2024.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-2 px-4 text-right text-orange-300 tabular-nums">
                    $ {row.valor2025.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-2 px-4 text-right tabular-nums">
                    <span className={esIncremento ? 'text-red-400' : 'text-green-400'}>
                      {row.variacion}%
                    </span>
                  </td>
                  <td className="py-2 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 ${esIncremento ? 'text-red-400' : 'text-green-400'}`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${esIncremento ? 'bg-red-500' : 'bg-green-500'}`}>
                        {esIncremento ? '↑' : '↓'}
                      </span>
                      $ {Math.abs(row.diferencia).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </td>
                </tr>
              );
            })}
            <tr className="bg-slate-700/50 border-t-2 border-slate-500 font-bold">
              <td className="py-3 px-4 text-white">TOTAL GASTOS LOGÍSTICOS 2024 VS 2025</td>
              <td className="py-3 px-4 text-right text-cyan-300 tabular-nums">
                $ {total2024.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </td>
              <td className="py-3 px-4 text-right text-orange-300 tabular-nums">
                $ {total2025.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </td>
              <td className="py-3 px-4 text-right tabular-nums">
                <span className={parseFloat(variacionTotal) > 0 ? 'text-red-400' : 'text-green-400'}>
                  {variacionTotal}%
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <span className={`inline-flex items-center gap-1 ${parseFloat(variacionTotal) > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${parseFloat(variacionTotal) > 0 ? 'bg-red-500' : 'bg-green-500'}`}>
                    {parseFloat(variacionTotal) > 0 ? '↑' : '↓'}
                  </span>
                  $ {Math.abs(total2025 - total2024).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-sm text-gray-300 leading-relaxed">
            <span className="font-semibold text-white">Análisis Consolidado:</span> El gasto logístico total presentó un incremento controlado del {variacionTotal}%, 
            cifra significativamente inferior a los incrementos base del período: aumento salarial del 9.54%, ajuste en tarifas de fletes del 9.5% y el incremento 
            promedio del IPC del 5.1% en otros servicios. Este comportamiento evidencia una gestión eficiente del gasto, destacándose especialmente el ahorro en el 
            costo de personal de distribución y las eficiencias operativas implementadas durante el año. En términos reales, la organización logró contener el 
            crecimiento del gasto por debajo de los incrementos estructurales del mercado, generando un ahorro efectivo superior al 5% frente al escenario proyectado para 2025.
          </p>
        </div>
      </motion.div>

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
              className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full border-4 border-blue-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-blue-400" />
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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
