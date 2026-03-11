import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Home, TrendingUp, Layers, X, Info } from 'lucide-react';

export default function GranjasDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });
  const hasAnimated = useRef(false);

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  // Validar estructura de datos - soportar formato optimizado y antiguo
  let granjasData = [];
  
  console.log('GranjasDashboard - Datos recibidos:', data);
  
  if (data && typeof data === 'object') {
    // Formato optimizado: { granjas: [...], capacidadClima: [...], ... }
    if (data.granjas && Array.isArray(data.granjas)) {
      console.log('GranjasDashboard - Formato optimizado detectado');
      granjasData = data.granjas.map(g => ({
        granja: g.nombre_granja,
        tipo: g.zona_climatica || g.linea,
        metros: parseFloat(g.metros_cuadrados) || 0,
        aves: parseInt(g.capacidad_aves) || 0
      }));
    }
    // Formato antiguo: { items: [...] } o array directo
    else if (data.items && Array.isArray(data.items)) {
      granjasData = data.items;
    }
    else if (Array.isArray(data)) {
      granjasData = data;
    }
  } else if (Array.isArray(data)) {
    granjasData = data;
  }
  
  // Filtrar filas de totales
  granjasData = granjasData.filter(d => {
    const granja = (d.granja || '').toUpperCase();
    const tipo = (d.tipo || '').toUpperCase();
    return granja !== 'TOTAL' && tipo !== 'TOTAL GENERAL';
  });
  
  console.log('GranjasDashboard - Datos procesados:', {
    total: granjasData.length,
    sample: granjasData[0]
  });
  
  if (granjasData.length === 0) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const totalMetros = granjasData.reduce((sum, d) => sum + (parseFloat(d.metros) || 0), 0);
  const totalAves = granjasData.reduce((sum, d) => sum + (parseFloat(d.aves) || 0), 0);
  const totalGranjas = granjasData.length;

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const COLORS = {
    'FRIO': '#3b82f6',      // Azul
    'CALIDO': '#10b981',    // Verde
    'CALIENTE': '#eab308'   // Amarillo
  };

  // Tooltip personalizado mejorado
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const densidad = data.metros > 0 ? Math.round(data.aves / data.metros) : 0;
      
      return (
        <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-4 shadow-2xl">
          <p className="text-white font-bold text-lg mb-3">{data.tipo || data.granja}</p>
          {data.aves && (
            <p className="text-blue-400 text-base mb-1">
              Aves: <span className="font-semibold">{formatNumber(data.aves)}</span>
            </p>
          )}
          {data.metros && (
            <p className="text-green-400 text-base mb-1">
              Metros²: <span className="font-semibold">{formatNumber(data.metros)}</span>
            </p>
          )}
          {data.aves && data.metros && (
            <p className="text-yellow-400 text-base mb-1 font-bold">
              Aves/m²: <span className="font-semibold">{densidad}</span>
            </p>
          )}
          {data.granjas && (
            <p className="text-purple-400 text-base mb-1">
              Granjas: <span className="font-semibold">{data.granjas}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Agrupar por tipo
  const porTipo = granjasData.reduce((acc, d) => {
    const tipo = d.tipo || 'Sin tipo';
    if (!acc[tipo]) {
      acc[tipo] = { metros: 0, aves: 0, count: 0 };
    }
    acc[tipo].metros += parseFloat(d.metros) || 0;
    acc[tipo].aves += parseFloat(d.aves) || 0;
    acc[tipo].count += 1;
    return acc;
  }, {});

  const tipoData = Object.entries(porTipo).map(([tipo, values]) => ({
    tipo,
    metros: values.metros,
    aves: values.aves,
    granjas: values.count
  }));



  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Total de Granjas Activas',
            `${totalGranjas} instalaciones operativas clasificadas por clima: ${tipoData.map(t => `${t.tipo} (${t.granjas})`).join(', ')}. La diversificación geográfica reduce riesgos operativos (enfermedades, clima) y optimiza costos según condiciones locales.`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Total Granjas</span>
            <Home className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-4xl font-bold text-white mb-1">{totalGranjas}</div>
          <div className="text-xs text-blue-400">Instalaciones activas</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Aves por Metro Cuadrado',
            `La cantidad promedio es de ${Math.round(totalAves / totalMetros)} aves por metro cuadrado. Esto se calcula dividiendo el número total de aves (${formatNumber(totalAves)}) entre el área total (${formatNumber(totalMetros)} m²). La cantidad óptima varía según clima: zonas cálidas requieren menor cantidad (menos aves/m²) para mejor ventilación y evitar estrés térmico, zonas frías permiten mayor cantidad (más aves/m²) porque las aves generan calor corporal. Todas las instalaciones cumplen con la normativa de bienestar animal vigente.`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Aves por m²</span>
            <Layers className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{Math.round(totalAves / totalMetros)}</div>
          <div className="text-xs text-green-400">aves por metro cuadrado</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Capacidad Total de Aves',
            `${formatNumber(totalAves)} aves es la capacidad instalada total en todas las granjas activas. Esta capacidad representa el número máximo de aves que pueden alojarse simultáneamente en los galpones. La distribución por zona climática permite optimizar la producción según las condiciones ambientales de cada región.`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Total Aves</span>
            <TrendingUp className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{totalAves.toLocaleString('es-ES')} aves</div>
          <div className="text-xs text-purple-400">capacidad total</div>
        </motion.div>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por Tipo - Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-slate-700 cursor-pointer hover:border-blue-500 transition-all"
          onClick={() => openModal(
            'Distribución de Aves por Tipo de Clima',
            `La empresa cuenta con ${totalGranjas} granjas distribuidas en ${tipoData.length} zonas climáticas diferentes. Distribución actual: ${tipoData.map(t => `${t.tipo}: ${formatNumber(t.aves)} aves (${((t.aves / totalAves) * 100).toFixed(1)}%) en ${t.granjas} granjas con densidad de ${(t.metros / t.aves).toFixed(2)} m²/ave`).join(' • ')}. Esta diversificación geográfica reduce riesgos operativos (enfermedades, clima extremo) y optimiza costos de producción según las condiciones ambientales de cada región.`
          )}
        >
          <h3 className="text-xl font-bold text-white mb-6">Distribución de Aves por Tipo de Clima</h3>
          <ResponsiveContainer width="100%" height={350} key="pie-chart-clima">
            <PieChart>
              <Pie 
                isAnimationActive={!hasAnimated.current}
                animationBegin={0}
                animationDuration={800}
                onAnimationEnd={() => { hasAnimated.current = true; }}
                data={tipoData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ tipo, percent }) => `${tipo} (${(percent * 100).toFixed(2)}%)`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="aves"
              >
                {tipoData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.tipo] || '#8b5cf6'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Comparación de Granjas por Tipo de Clima */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-slate-700 cursor-pointer hover:border-green-500 transition-all"
          onClick={() => openModal(
            'Número de Granjas por Zona Climática',
            `Distribución de las ${totalGranjas} granjas por zona climática: ${tipoData.map(t => {
              const pct = ((t.granjas / totalGranjas) * 100).toFixed(1);
              return `Zona ${t.tipo}: ${t.granjas} granjas (${pct}%) con ${formatNumber(t.aves)} aves`;
            }).join(' • ')}. Esta distribución geográfica permite diversificar riesgos operativos (enfermedades, clima extremo) y optimizar costos según condiciones locales. Cada zona tiene características específicas de manejo según su clima.`
          )}
        >
          <h3 className="text-xl font-bold text-white mb-6">Número de Granjas por Tipo de Clima</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={tipoData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="tipo" stroke="#9ca3af" style={{ fontSize: '14px', fontWeight: 'bold' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} label={{ value: 'Número de Granjas', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                formatter={(value, name, props) => {
                  if (name === 'granjas') {
                    const pct = ((value / totalGranjas) * 100).toFixed(1);
                    return [`${value} granjas (${pct}%)`, 'Granjas'];
                  }
                  return [value, name];
                }}
              />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Bar dataKey="granjas" fill="#10b981" name="Granjas" radius={[8, 8, 0, 0]}>
                {tipoData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.tipo] || '#8b5cf6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Capacidad por Granja - TOP 10 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700 cursor-pointer hover:border-purple-500 transition-all"
        onClick={() => {
          const top10 = granjasData.sort((a, b) => (parseFloat(b.aves) || 0) - (parseFloat(a.aves) || 0)).slice(0, 10);
          const totalTop10 = top10.reduce((sum, g) => sum + (parseFloat(g.aves) || 0), 0);
          const porcentajeTop10 = ((totalTop10 / totalAves) * 100).toFixed(1);
          openModal(
            'Top 10 Granjas por Capacidad',
            `Las 10 granjas con mayor capacidad concentran ${formatNumber(totalTop10)} aves, representando el ${porcentajeTop10}% de la capacidad total instalada. Granja líder: ${top10[0].granja} con ${formatNumber(top10[0].aves)} aves en ${formatNumber(top10[0].metros)} m² (densidad ${(top10[0].metros / top10[0].aves).toFixed(2)} m²/ave), ubicada en zona ${top10[0].tipo}. Esta concentración permite economías de escala en operación, logística y supervisión técnica.`
          );
        }}
      >
        <h3 className="text-xl font-bold text-white mb-6">Top 10 Granjas por Número de Aves</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={granjasData.sort((a, b) => (parseFloat(b.aves) || 0) - (parseFloat(a.aves) || 0)).slice(0, 10)} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9ca3af" />
            <YAxis dataKey="granja" type="category" stroke="#9ca3af" width={150} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="aves" name="Aves">
              {granjasData.sort((a, b) => (parseFloat(b.aves) || 0) - (parseFloat(a.aves) || 0)).slice(0, 10).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.tipo] || '#38bdf8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Tabla agrupada por tipo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700 overflow-x-auto cursor-pointer hover:border-cyan-500 transition-all"
        onClick={() => openModal(
          'Detalle Completo de Todas las Granjas',
          `Inventario completo de las ${totalGranjas} granjas activas: Capacidad total instalada de ${formatNumber(totalAves)} aves en ${formatNumber(totalMetros)} m², con densidad promedio de ${(totalMetros / totalAves).toFixed(2)} m²/ave. Distribución por zona: ${tipoData.map(t => `${t.tipo}: ${t.granjas} granjas (${formatNumber(t.aves)} aves, ${formatNumber(t.metros)} m²)`).join(' • ')}. Cada granja está optimizada según su ubicación geográfica, clima local y capacidad operativa para maximizar eficiencia productiva.`
        )}
      >
        <h3 className="text-xl font-bold text-white mb-4">Detalle Completo por Granja</h3>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-600">
              <th className="text-left py-2 px-2 text-gray-300 font-bold">Tipo</th>
              <th className="text-left py-2 px-2 text-gray-300 font-bold">Granja</th>
              <th className="text-right py-2 px-2 text-gray-300 font-bold">Metros²</th>
              <th className="text-right py-2 px-2 text-gray-300 font-bold">Aves</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const grouped = granjasData.reduce((acc, row) => {
                const tipo = row.tipo || 'Sin tipo';
                if (!acc[tipo]) acc[tipo] = [];
                acc[tipo].push(row);
                return acc;
              }, {});

              const rows = [];
              let globalMetros = 0;
              let globalAves = 0;

              // Ordenar los tipos para que aparezcan en orden consistente
              const tiposOrdenados = Object.keys(grouped).sort();

              tiposOrdenados.forEach((tipo) => {
                const granjas = grouped[tipo];
                let tipoMetros = 0;
                let tipoAves = 0;

                // Primero todas las granjas del tipo
                granjas.forEach((row, idx) => {
                  const metros = parseFloat(row.metros) || 0;
                  const aves = parseFloat(row.aves) || 0;
                  
                  tipoMetros += metros;
                  tipoAves += aves;

                  rows.push(
                    <tr key={`${tipo}-${idx}`} className="border-b border-slate-700/20 hover:bg-slate-700/30 transition-colors">
                      <td className="py-0.5 px-2">
                        {idx === 0 && (
                          <span className="inline-block px-1.5 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: COLORS[tipo] + '30', color: COLORS[tipo] }}>
                            {tipo}
                          </span>
                        )}
                      </td>
                      <td className="py-0.5 px-2 text-white">{row.granja || 'Sin nombre'}</td>
                      <td className="py-0.5 px-2 text-right text-green-400 tabular-nums">{metros.toLocaleString('es-ES')}</td>
                      <td className="py-0.5 px-2 text-right text-blue-400 tabular-nums">{aves.toLocaleString('es-ES')}</td>
                    </tr>
                  );
                });

                // Después el subtotal del tipo
                rows.push(
                  <tr key={`subtotal-${tipo}`} className="bg-amber-500/10 border-y border-amber-500/30 font-bold">
                    <td className="py-1 px-2 text-amber-400 text-xs">SUBTOTAL</td>
                    <td className="py-1 px-2 text-amber-400 text-xs">{tipo}</td>
                    <td className="py-1 px-2 text-right text-amber-400 text-xs tabular-nums">{tipoMetros.toLocaleString('es-ES')}</td>
                    <td className="py-1 px-2 text-right text-amber-400 text-xs tabular-nums">{tipoAves.toLocaleString('es-ES')}</td>
                  </tr>
                );

                globalMetros += tipoMetros;
                globalAves += tipoAves;
              });

              // Al final el total general
              rows.push(
                <tr key="total-general" className="bg-blue-600/20 border-t-4 border-blue-500 font-bold text-sm">
                  <td className="py-1.5 px-2 text-blue-200" colSpan="2">TOTAL</td>
                  <td className="py-1.5 px-2 text-right text-blue-200 tabular-nums">{globalMetros.toLocaleString('es-ES')}</td>
                  <td className="py-1.5 px-2 text-right text-blue-200 tabular-nums">{globalAves.toLocaleString('es-ES')}</td>
                </tr>
              );

              return rows;
            })()}
          </tbody>
        </table>
      </motion.div>

      {/* Resumen de Capacidad por Zona Climática - DATOS REALES DE BD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-xl rounded-xl p-6 border-2 border-slate-600 cursor-pointer hover:border-yellow-500 transition-all"
        onClick={() => openModal(
          'Resumen Estratégico por Zona Climática',
          `Distribución estratégica de capacidad instalada: ${tipoData.map(t => {
            const pct = ((t.aves / totalAves) * 100).toFixed(1);
            const densidad = Math.round(t.aves / t.metros);
            return `Zona ${t.tipo}: ${t.granjas} granjas con ${formatNumber(t.aves)} aves (${pct}% del total), ${formatNumber(t.metros)} m², ${densidad} aves/m²`;
          }).join(' • ')}. Esta distribución multi-climática permite: 1) Diversificación de riesgos sanitarios y climáticos, 2) Optimización de costos operativos según condiciones locales, 3) Continuidad operativa ante eventos climáticos extremos, 4) Aprovechamiento de ventajas competitivas regionales (mano de obra, insumos, logística).`
        )}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Capacidad Instalada por Zona Climática</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tipoData.map((zona, idx) => {
            const colores = {
              'FRIO': { 
                bg: 'border-blue-500/30 hover:border-blue-500', 
                badge: 'bg-blue-500/20 text-blue-300',
                text: 'text-blue-400',
                densidad: 'text-blue-300',
                temp: '<18°C'
              },
              'CALIDO': { 
                bg: 'border-green-500/30 hover:border-green-500', 
                badge: 'bg-green-500/20 text-green-300',
                text: 'text-green-400',
                densidad: 'text-green-300',
                temp: '18-24°C'
              },
              'CALIENTE': { 
                bg: 'border-yellow-500/30 hover:border-yellow-500', 
                badge: 'bg-yellow-500/20 text-yellow-300',
                text: 'text-yellow-400',
                densidad: 'text-yellow-300',
                temp: '>24°C'
              }
            };
            
            const color = colores[zona.tipo] || colores['FRIO'];
            const porcentaje = ((zona.aves / totalAves) * 100).toFixed(1);
            const densidad = Math.round(zona.aves / zona.metros);
            
            return (
              <div key={idx} className={`bg-slate-900/50 rounded-lg p-5 border-2 ${color.bg} transition-all`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`text-lg font-bold ${color.text}`}>ZONA {zona.tipo}</div>
                  <div className={`text-xs ${color.badge} px-2 py-1 rounded`}>{color.temp}</div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-gray-400">Capacidad Total</div>
                    <div className="text-3xl font-bold text-white">{formatNumber(zona.aves)}</div>
                    <div className={`text-xs ${color.text}`}>aves ({porcentaje}%)</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700">
                    <div>
                      <div className="text-xs text-gray-400">Granjas</div>
                      <div className="text-lg font-bold text-white">{zona.granjas}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Área</div>
                      <div className="text-lg font-bold text-white">{formatNumber(zona.metros)} m²</div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-700">
                    <div className="text-xs text-gray-400">Aves por m²</div>
                    <div className={`text-xl font-bold ${color.densidad}`}>{densidad} aves/m²</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Nota informativa */}
        <div className="mt-4 bg-slate-700/30 rounded-lg p-4 border border-slate-600">
          <p className="text-sm text-gray-300">
            <span className="font-semibold text-white">Distribución estratégica:</span> Las {totalGranjas} granjas están distribuidas estratégicamente en {tipoData.length} zonas climáticas para diversificar riesgos operativos y optimizar costos de producción según las condiciones ambientales de cada región.
          </p>
        </div>
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
