import { useState } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Target, Package, X, Info } from 'lucide-react';

export default function ComercialDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };
  
  const comercialData = Array.isArray(data) ? data : (data?.items || []);
  
  if (comercialData.length === 0) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Función para obtener datos por descripción y año
  const getData = (linea, anio) => {
    const item = comercialData.find(d => 
      d.linea && d.linea.includes(linea) && parseInt(d.anio) === anio
    );
    return item ? parseFloat(item.kg) || 0 : 0;
  };

  // Obtener datos de categorías principales desde la BD
  const refrigerado2025 = getData('REFRIGERADO', 2025);
  const refrigerado2024 = getData('REFRIGERADO', 2024);
  const congelado2025 = getData('CONGELADO', 2025);
  const congelado2024 = getData('CONGELADO', 2024);
  
  // Obtener datos de sublíneas REFRIGERADO desde la BD
  const polloEntero2025 = getData('POLLO ENTERO', 2025);
  const polloEntero2024 = getData('POLLO ENTERO', 2024);
  const presa2025 = getData('PRESA', 2025);
  const presa2024 = getData('PRESA', 2024);
  const menudencia2025 = getData('MENUDENCIA', 2025);
  const menudencia2024 = getData('MENUDENCIA', 2024);
  const carnesFrias2025 = getData('CARNES FRIAS', 2025);
  const carnesFrias2024 = getData('CARNES FRIAS', 2024);
  
  // Obtener datos de sublíneas CONGELADO desde la BD (con (C) en el nombre)
  const polloEnteroC2025 = getData('POLLO ENTERO (C)', 2025);
  const polloEnteroC2024 = getData('POLLO ENTERO (C)', 2024);
  const presaC2025 = getData('PRESA (C)', 2025);
  const presaC2024 = getData('PRESA (C)', 2024);
  const menudenciaC2025 = getData('MENUDENCIA (C)', 2025);
  const menudenciaC2024 = getData('MENUDENCIA (C)', 2024);
  const carnesFriasC2025 = getData('CARNES FRIAS (C)', 2025);
  const carnesFriasC2024 = getData('CARNES FRIAS (C)', 2024);
  
  // Totales
  const totalKg2025 = refrigerado2025 + congelado2025;
  const totalKg2024 = refrigerado2024 + congelado2024;
  const variacionTotal = totalKg2024 > 0 ? (((totalKg2025 - totalKg2024) / totalKg2024) * 100).toFixed(2) : 0;
  
  const COLORS = ['#38bdf8', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
  
  // Datos para el gráfico principal
  const datosGrafico = [
    { nombre: 'REFRIGERADO', kg2024: refrigerado2024, kg2025: refrigerado2025 },
    { nombre: '  1', nombreCompleto: 'POLLO ENTERO', kg2024: polloEntero2024, kg2025: polloEntero2025 },
    { nombre: '  2', nombreCompleto: 'PRESA', kg2024: presa2024, kg2025: presa2025 },
    { nombre: '  3', nombreCompleto: 'MENUDENCIA', kg2024: menudencia2024, kg2025: menudencia2025 },
    { nombre: '  4', nombreCompleto: 'CARNES FRIAS', kg2024: carnesFrias2024, kg2025: carnesFrias2025 },
    { nombre: '', kg2024: 0, kg2025: 0 }, // Separador
    { nombre: 'CONGELADO', kg2024: congelado2024, kg2025: congelado2025 },
    { nombre: '  5', nombreCompleto: 'POLLO ENTERO (C)', kg2024: polloEnteroC2024, kg2025: polloEnteroC2025 },
    { nombre: '  6', nombreCompleto: 'PRESA (C)', kg2024: presaC2024, kg2025: presaC2025 },
    { nombre: '  7', nombreCompleto: 'MENUDENCIA (C)', kg2024: menudenciaC2024, kg2025: menudenciaC2025 },
    { nombre: '  8', nombreCompleto: 'CARNES FRIAS (C)', kg2024: carnesFriasC2024, kg2025: carnesFriasC2025 },
    { nombre: '', kg2024: 0, kg2025: 0 }, // Separador
    { nombre: 'TOTAL', kg2024: totalKg2024, kg2025: totalKg2025 }
  ];

  // Datos para el gráfico de composición
  const datosComposicion = [
    {
      categoria: 'REFRIGERADO',
      'POLLO ENTERO': polloEntero2025,
      'PRESA': presa2025,
      'MENUDENCIA': menudencia2025,
      'CARNES FRIAS': carnesFrias2025
    },
    {
      categoria: 'CONGELADO',
      'POLLO ENTERO': polloEnteroC2025,
      'PRESA': presaC2025,
      'MENUDENCIA': menudenciaC2025,
      'CARNES FRIAS': carnesFriasC2025
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = datosGrafico.find(d => d.nombre === label);
      const displayName = item?.nombreCompleto || label;
      
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold mb-2">{displayName}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatNumber(entry.value)} kg
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal('Total Ventas 2025', 'Total de kilogramos vendidos en 2025 comparado con 2024.')}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Total Ventas 2025 (Kg)</span>
            <Package className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{formatNumber(totalKg2025)}</div>
          <div className={`text-xs ${variacionTotal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {variacionTotal > 0 ? '+' : ''}{variacionTotal}% vs 2024
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal('Total Ventas 2024', 'Total de kilogramos vendidos en 2024.')}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Total Ventas 2024 (Kg)</span>
            <Target className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{formatNumber(totalKg2024)}</div>
          <div className="text-xs text-green-400">Año anterior</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal('Variación', 'Diferencia en kilogramos entre 2025 y 2024.')}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Variación (Kg)</span>
            <TrendingUp className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{formatNumber(totalKg2025 - totalKg2024)}</div>
          <div className={`text-xs ${variacionTotal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            Diferencia anual
          </div>
        </motion.div>
      </div>

      {/* Gráfico de Barras Agrupadas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => openModal('Ventas por Categoría y Línea de Producto', 'Comparación 2024 vs 2025: REFRIGERADO representa 91.91% del total. PRESA es la segunda línea más importante con 19.71% del total general.')}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700 cursor-pointer hover:border-blue-500 transition-all"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Ventas por Categoría y Línea de Producto (Kg)</h3>
          <Info className="w-5 h-5 text-blue-400" />
        </div>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={datosGrafico} margin={{ top: 30, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="nombre" 
              stroke="#94a3b8"
              angle={0}
              textAnchor="middle"
              height={60}
              tick={(props) => {
                const { x, y, payload } = props;
                const esBold = payload.value === 'REFRIGERADO' || payload.value === 'CONGELADO' || payload.value === 'TOTAL';
                const color = payload.value === 'TOTAL' ? '#f59e0b' : esBold ? '#38bdf8' : '#94a3b8';
                
                return (
                  <text 
                    x={x} 
                    y={y + 10} 
                    textAnchor="middle" 
                    fill={color}
                    fontSize={esBold ? 13 : 11}
                    fontWeight={esBold ? 'bold' : 'normal'}
                  >
                    {payload.value}
                  </text>
                );
              }}
            />
            <YAxis 
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8' }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="square"
            />
            <Bar dataKey="kg2024" fill="#10b981" name="2024" radius={[8, 8, 0, 0]} label={{ position: 'top', fill: '#10b981', fontSize: 9, formatter: (value) => value > 0 ? `${(value / 1000000).toFixed(1)}M` : '' }} />
            <Bar dataKey="kg2025" fill="#38bdf8" name="2025" radius={[8, 8, 0, 0]} label={{ position: 'top', fill: '#38bdf8', fontSize: 9, formatter: (value) => value > 0 ? `${(value / 1000000).toFixed(1)}M` : '' }} />
          </BarChart>
        </ResponsiveContainer>
        
        {/* Leyenda */}
        <div className="mt-6 space-y-4">
          <div>
            <h4 className="text-sm font-bold text-blue-400 mb-2">REFRIGERADO:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">1</span>
                <span className="text-gray-300">POLLO ENTERO</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">2</span>
                <span className="text-gray-300">PRESA</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">3</span>
                <span className="text-gray-300">MENUDENCIA</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">4</span>
                <span className="text-gray-300">CARNES FRIAS</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-purple-400 mb-2">CONGELADO:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">5</span>
                <span className="text-gray-300">POLLO ENTERO</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">6</span>
                <span className="text-gray-300">PRESA</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">7</span>
                <span className="text-gray-300">MENUDENCIA</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">8</span>
                <span className="text-gray-300">CARNES FRIAS</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Gráfico de Composición - Porcentajes de Participación */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={() => openModal('Porcentaje de Participación', 'POLLO ENTERO lidera con 52.76% del total. CONGELADO cayó de 12.35% (2024) a 8.09% (2025), reducción de -36.43%.')}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700 cursor-pointer hover:border-blue-500 transition-all"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Porcentaje de Participación sobre Total General</h3>
          <Info className="w-5 h-5 text-blue-400" />
        </div>
        
        {/* Dos gráficos separados lado a lado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* REFRIGERADO - Porcentajes 2024 vs 2025 */}
          <div>
            <h4 className="text-blue-400 font-bold mb-3 text-center">REFRIGERADO</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={[
                  { nombre: 'POLLO ENTERO', pct2024: ((polloEntero2024/totalKg2024)*100), pct2025: ((polloEntero2025/totalKg2025)*100) },
                  { nombre: 'PRESA', pct2024: ((presa2024/totalKg2024)*100), pct2025: ((presa2025/totalKg2025)*100) },
                  { nombre: 'MENUDENCIA', pct2024: ((menudencia2024/totalKg2024)*100), pct2025: ((menudencia2025/totalKg2025)*100) },
                  { nombre: 'CARNES FRIAS', pct2024: ((carnesFrias2024/totalKg2024)*100), pct2025: ((carnesFrias2025/totalKg2025)*100) }
                ]}
                margin={{ top: 30, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="nombre" 
                  stroke="#94a3b8"
                  angle={0}
                  textAnchor="middle"
                  height={60}
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  interval={0}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickFormatter={(value) => `${value.toFixed(1)}%`}
                  domain={[0, 60]}
                />
                <Tooltip 
                  formatter={(value) => `${value.toFixed(2)}%`}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="pct2024" fill="#10b981" name="2024 %" radius={[8, 8, 0, 0]} label={{ position: 'top', fill: '#10b981', fontSize: 10, formatter: (value) => `${value.toFixed(1)}%` }} />
                <Bar dataKey="pct2025" fill="#38bdf8" name="2025 %" radius={[8, 8, 0, 0]} label={{ position: 'top', fill: '#38bdf8', fontSize: 10, formatter: (value) => `${value.toFixed(1)}%` }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* CONGELADO - Porcentajes 2024 vs 2025 */}
          <div>
            <h4 className="text-purple-400 font-bold mb-3 text-center">CONGELADO</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={[
                  { nombre: 'POLLO ENTERO', pct2024: ((polloEnteroC2024/totalKg2024)*100), pct2025: ((polloEnteroC2025/totalKg2025)*100) },
                  { nombre: 'PRESA', pct2024: ((presaC2024/totalKg2024)*100), pct2025: ((presaC2025/totalKg2025)*100) },
                  { nombre: 'MENUDENCIA', pct2024: ((menudenciaC2024/totalKg2024)*100), pct2025: ((menudenciaC2025/totalKg2025)*100) },
                  { nombre: 'CARNES FRIAS', pct2024: ((carnesFriasC2024/totalKg2024)*100), pct2025: ((carnesFriasC2025/totalKg2025)*100) }
                ]}
                margin={{ top: 30, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="nombre" 
                  stroke="#94a3b8"
                  angle={0}
                  textAnchor="middle"
                  height={60}
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  interval={0}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickFormatter={(value) => `${value.toFixed(1)}%`}
                  domain={[0, 12]}
                />
                <Tooltip 
                  formatter={(value) => `${value.toFixed(2)}%`}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="pct2024" fill="#10b981" name="2024 %" radius={[8, 8, 0, 0]} label={{ position: 'top', fill: '#10b981', fontSize: 10, formatter: (value) => `${value.toFixed(1)}%` }} />
                <Bar dataKey="pct2025" fill="#a855f7" name="2025 %" radius={[8, 8, 0, 0]} label={{ position: 'top', fill: '#a855f7', fontSize: 10, formatter: (value) => `${value.toFixed(1)}%` }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Tabla resumen con porcentajes y variaciones */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-4 border border-blue-500/30">
            <h4 className="text-blue-400 font-bold mb-3">REFRIGERADO - Detalle</h4>
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-4 gap-2 font-bold text-gray-400 pb-2 border-b border-slate-700">
                <span>Producto</span>
                <span className="text-right">% 2024</span>
                <span className="text-right">% 2025</span>
                <span className="text-right">Var. %</span>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center">
                <span className="text-gray-300">POLLO ENTERO</span>
                <span className="text-right text-white">{((polloEntero2024/totalKg2024)*100).toFixed(2)}%</span>
                <span className="text-right text-white">{((polloEntero2025/totalKg2025)*100).toFixed(2)}%</span>
                <span className={`text-right font-semibold ${(((polloEntero2025-polloEntero2024)/polloEntero2024)*100) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(((polloEntero2025-polloEntero2024)/polloEntero2024)*100) >= 0 ? '+' : ''}{(((polloEntero2025-polloEntero2024)/polloEntero2024)*100).toFixed(2)}%
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center">
                <span className="text-gray-300">PRESA</span>
                <span className="text-right text-white">{((presa2024/totalKg2024)*100).toFixed(2)}%</span>
                <span className="text-right text-white">{((presa2025/totalKg2025)*100).toFixed(2)}%</span>
                <span className={`text-right font-semibold ${(((presa2025-presa2024)/presa2024)*100) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(((presa2025-presa2024)/presa2024)*100) >= 0 ? '+' : ''}{(((presa2025-presa2024)/presa2024)*100).toFixed(2)}%
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center">
                <span className="text-gray-300">MENUDENCIA</span>
                <span className="text-right text-white">{((menudencia2024/totalKg2024)*100).toFixed(2)}%</span>
                <span className="text-right text-white">{((menudencia2025/totalKg2025)*100).toFixed(2)}%</span>
                <span className={`text-right font-semibold ${(((menudencia2025-menudencia2024)/menudencia2024)*100) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(((menudencia2025-menudencia2024)/menudencia2024)*100) >= 0 ? '+' : ''}{(((menudencia2025-menudencia2024)/menudencia2024)*100).toFixed(2)}%
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center">
                <span className="text-gray-300">CARNES FRIAS</span>
                <span className="text-right text-white">{((carnesFrias2024/totalKg2024)*100).toFixed(2)}%</span>
                <span className="text-right text-white">{((carnesFrias2025/totalKg2025)*100).toFixed(2)}%</span>
                <span className={`text-right font-semibold ${(((carnesFrias2025-carnesFrias2024)/carnesFrias2024)*100) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(((carnesFrias2025-carnesFrias2024)/carnesFrias2024)*100) >= 0 ? '+' : ''}{(((carnesFrias2025-carnesFrias2024)/carnesFrias2024)*100).toFixed(2)}%
                </span>
              </div>
              <div className="pt-2 border-t border-slate-700 grid grid-cols-4 gap-2 font-bold">
                <span className="text-blue-400">TOTAL</span>
                <span className="text-right text-blue-400">{((refrigerado2024/totalKg2024)*100).toFixed(2)}%</span>
                <span className="text-right text-blue-400">{((refrigerado2025/totalKg2025)*100).toFixed(2)}%</span>
                <span className={`text-right ${(((refrigerado2025-refrigerado2024)/refrigerado2024)*100) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(((refrigerado2025-refrigerado2024)/refrigerado2024)*100) >= 0 ? '+' : ''}{(((refrigerado2025-refrigerado2024)/refrigerado2024)*100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900/50 rounded-lg p-4 border border-purple-500/30">
            <h4 className="text-purple-400 font-bold mb-3">CONGELADO - Detalle</h4>
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-4 gap-2 font-bold text-gray-400 pb-2 border-b border-slate-700">
                <span>Producto</span>
                <span className="text-right">% 2024</span>
                <span className="text-right">% 2025</span>
                <span className="text-right">Var. %</span>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center">
                <span className="text-gray-300">POLLO ENTERO</span>
                <span className="text-right text-white">{((polloEnteroC2024/totalKg2024)*100).toFixed(2)}%</span>
                <span className="text-right text-white">{((polloEnteroC2025/totalKg2025)*100).toFixed(2)}%</span>
                <span className={`text-right font-semibold ${(((polloEnteroC2025-polloEnteroC2024)/polloEnteroC2024)*100) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(((polloEnteroC2025-polloEnteroC2024)/polloEnteroC2024)*100) >= 0 ? '+' : ''}{(((polloEnteroC2025-polloEnteroC2024)/polloEnteroC2024)*100).toFixed(2)}%
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center">
                <span className="text-gray-300">PRESA</span>
                <span className="text-right text-white">{((presaC2024/totalKg2024)*100).toFixed(2)}%</span>
                <span className="text-right text-white">{((presaC2025/totalKg2025)*100).toFixed(2)}%</span>
                <span className={`text-right font-semibold ${(((presaC2025-presaC2024)/presaC2024)*100) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(((presaC2025-presaC2024)/presaC2024)*100) >= 0 ? '+' : ''}{(((presaC2025-presaC2024)/presaC2024)*100).toFixed(2)}%
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center">
                <span className="text-gray-300">MENUDENCIA</span>
                <span className="text-right text-white">{((menudenciaC2024/totalKg2024)*100).toFixed(2)}%</span>
                <span className="text-right text-white">{((menudenciaC2025/totalKg2025)*100).toFixed(2)}%</span>
                <span className={`text-right font-semibold ${(((menudenciaC2025-menudenciaC2024)/menudenciaC2024)*100) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(((menudenciaC2025-menudenciaC2024)/menudenciaC2024)*100) >= 0 ? '+' : ''}{(((menudenciaC2025-menudenciaC2024)/menudenciaC2024)*100).toFixed(2)}%
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center">
                <span className="text-gray-300">CARNES FRIAS</span>
                <span className="text-right text-white">{((carnesFriasC2024/totalKg2024)*100).toFixed(2)}%</span>
                <span className="text-right text-white">{((carnesFriasC2025/totalKg2025)*100).toFixed(2)}%</span>
                <span className={`text-right font-semibold ${(((carnesFriasC2025-carnesFriasC2024)/carnesFriasC2024)*100) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(((carnesFriasC2025-carnesFriasC2024)/carnesFriasC2024)*100) >= 0 ? '+' : ''}{(((carnesFriasC2025-carnesFriasC2024)/carnesFriasC2024)*100).toFixed(2)}%
                </span>
              </div>
              <div className="pt-2 border-t border-slate-700 grid grid-cols-4 gap-2 font-bold">
                <span className="text-purple-400">TOTAL</span>
                <span className="text-right text-purple-400">{((congelado2024/totalKg2024)*100).toFixed(2)}%</span>
                <span className="text-right text-purple-400">{((congelado2025/totalKg2025)*100).toFixed(2)}%</span>
                <span className={`text-right ${(((congelado2025-congelado2024)/congelado2024)*100) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(((congelado2025-congelado2024)/congelado2024)*100) >= 0 ? '+' : ''}{(((congelado2025-congelado2024)/congelado2024)*100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

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
