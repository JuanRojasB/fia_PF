import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Home, TrendingUp, Layers, X, Info } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';
import CollapsibleChart from '../CollapsibleChart';

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
    return <div className="text-gray-600">No hay datos disponibles</div>;
  }

  const totalMetros = granjasData.reduce((sum, d) => sum + (parseFloat(d.metros) || 0), 0);
  const totalAves = granjasData.reduce((sum, d) => sum + (parseFloat(d.aves) || 0), 0);
  const totalGranjas = granjasData.length;

  // Cálculo de capacidad anual
  const ciclosPorAnio = 6.5;
  const diasPorCiclo = 56;
  const mortalidadEstimada = 0.07; // 7%
  const capacidadAnual = totalAves * ciclosPorAnio;
  const avesEstimadasSalida = capacidadAnual * (1 - mortalidadEstimada);

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const COLORS = {
    'FRIO': '#3b82f6',      // Azul brillante
    'CALIDO': '#10b981',    // Verde esmeralda
    'CALIENTE': '#f59e0b'   // Naranja/Amarillo
  };

  // Colores adicionales para granjas individuales
  const COLOR_PALETTE = [
    '#3b82f6', // Azul
    '#10b981', // Verde
    '#f59e0b', // Naranja
    '#8b5cf6', // Púrpura
    '#ec4899', // Rosa
    '#06b6d4', // Cyan
    '#f97316', // Naranja oscuro
    '#14b8a6', // Teal
    '#6366f1', // Índigo
    '#a855f7', // Violeta
  ];

  // Tooltip personalizado mejorado
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const densidad = data.metros > 0 ? Math.round(data.aves / data.metros) : 0;
      
      return (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 shadow-2xl">
          <p className="text-gray-900 font-bold text-lg mb-3">{data.tipo || data.granja}</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Total de Granjas Activas',
            `${totalGranjas} granjas activas registradas en el sistema. Estas instalaciones están distribuidas en diferentes zonas climáticas (Frío, Cálido, Caliente) para optimizar las condiciones de crianza según las características de cada región.`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Total Granjas Activas 2025</span>
            <Home className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-4xl font-bold text-gray-900">{totalGranjas}</div>
          <div className="text-sm text-gray-600 mt-1">instalaciones activas</div>
          <div className="text-xs text-blue-600 mt-2">Zonas: Frío, Cálido, Caliente</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Densidad Promedio de Aves',
            `Densidad promedio: ${Math.round(totalAves / totalMetros)} aves/m². Este indicador mide la eficiencia del uso del espacio disponible. Cálculo: ${formatNumber(totalAves)} aves ÷ ${formatNumber(totalMetros)} m² = ${Math.round(totalAves / totalMetros)} aves/m². Una densidad adecuada garantiza el bienestar animal y optimiza la producción.`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Densidad Promedio Aves/m² 2025</span>
            <Layers className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-4xl font-bold text-gray-900">{Math.round(totalAves / totalMetros)}</div>
          <div className="text-sm text-gray-600 mt-1">aves por metro cuadrado</div>
          <div className="text-xs text-green-600 mt-2">{formatNumber(totalMetros)} m² totales</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Capacidad Total por Ciclo',
            `Capacidad total: ${formatNumber(totalAves)} aves por ciclo. Esta es la capacidad máxima de alojamiento en todas las granjas durante un ciclo de producción de ${diasPorCiclo} días. Representa el número total de aves que pueden estar en crianza simultáneamente en todas las instalaciones.`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Capacidad Aves por Ciclo 2025</span>
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-4xl font-bold text-gray-900">{formatNumber(totalAves)}</div>
          <div className="text-sm text-gray-600 mt-1">aves por ciclo</div>
          <div className="text-xs text-purple-600 mt-2">Ciclo: {diasPorCiclo} días</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Capacidad Anual Estimada',
            `Capacidad anual estimada: ${formatNumber(Math.round(avesEstimadasSalida))} aves. Cálculo detallado:\n\n1. Capacidad por ciclo: ${formatNumber(totalAves)} aves\n2. Ciclos por año: ${ciclosPorAnio} ciclos (cada ${diasPorCiclo} días)\n3. Capacidad bruta anual: ${formatNumber(totalAves)} × ${ciclosPorAnio} = ${formatNumber(Math.round(capacidadAnual))} aves\n4. Mortalidad estimada: ${(mortalidadEstimada * 100).toFixed(0)}%\n5. Capacidad neta anual: ${formatNumber(Math.round(capacidadAnual))} × ${((1 - mortalidadEstimada) * 100).toFixed(0)}% = ${formatNumber(Math.round(avesEstimadasSalida))} aves\n\nEste cálculo considera la rotación de ciclos y la mortalidad esperada durante el proceso de crianza.`
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Capacidad Anual Estimada 2025</span>
            <TrendingUp className="w-6 h-6 text-orange-600" />
          </div>
          <div className="text-4xl font-bold text-gray-900">{formatNumber(Math.round(avesEstimadasSalida))}</div>
          <div className="text-sm text-gray-600 mt-1">aves estimadas/año</div>
          <div className="text-xs text-orange-600 mt-2">{ciclosPorAnio} ciclos × {(100 - mortalidadEstimada * 100).toFixed(0)}% supervivencia</div>
        </motion.div>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por Tipo - Pie Chart */}
        <CollapsibleChart title="Distribución de Aves por Zona Climática 2025" defaultOpen={false}>
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
        </CollapsibleChart>

        {/* Comparación de Granjas por Tipo de Clima */}
        <CollapsibleChart title="Número de Granjas por Zona Climática 2025" defaultOpen={false}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={tipoData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="tipo" stroke="#64748b" style={{ fontSize: '14px', fontWeight: 'bold' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} label={{ value: 'Número de Granjas', angle: -90, position: 'insideLeft', fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.98)', border: '1px solid rgba(203, 213, 225, 0.5)', borderRadius: '8px' }}
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
        </CollapsibleChart>
      </div>

      {/* Participación Porcentual por Granja - TOP 10 con colores por zona */}
      <CollapsibleChart title="Top 10 Granjas por Capacidad/Participación de Aves (%)" defaultOpen={false}>
        <div className="flex justify-end gap-4 text-xs mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS['FRIO'] }}></div>
              <span className="text-gray-600 font-medium">Zona Fría</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS['CALIDO'] }}></div>
              <span className="text-gray-600 font-medium">Zona Cálida</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS['CALIENTE'] }}></div>
              <span className="text-gray-600 font-medium">Zona Caliente</span>
            </div>
          </div>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart 
            data={granjasData
              .sort((a, b) => (parseFloat(b.aves) || 0) - (parseFloat(a.aves) || 0))
              .slice(0, 10)
              .map(g => ({
                ...g,
                participacion: parseFloat(((parseFloat(g.aves) / totalAves) * 100).toFixed(2))
              }))} 
            layout="vertical"
            margin={{ top: 5, right: 80, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              type="number" 
              stroke="#6b7280"
              style={{ fontSize: '13px', fontWeight: '500' }}
              label={{ value: 'Participación (%)', position: 'insideBottom', offset: -5, fill: '#374151', fontWeight: 'bold' }}
            />
            <YAxis 
              dataKey="granja" 
              type="category" 
              stroke="#6b7280" 
              width={120}
              style={{ fontSize: '13px', fontWeight: '600' }}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const colorZona = COLORS[data.tipo] || '#3b82f6';
                  return (
                    <div className="bg-white border-2 rounded-lg p-4 shadow-2xl" style={{ borderColor: colorZona }}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorZona }}></div>
                        <p className="text-gray-900 font-bold text-lg">{data.granja}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-base" style={{ color: colorZona }}>
                          <span className="font-semibold">Zona:</span> {data.tipo}
                        </p>
                        <p className="text-blue-600 text-base">
                          <span className="font-semibold">Aves:</span> {formatNumber(data.aves)}
                        </p>
                        <p className="text-purple-600 text-base font-bold">
                          <span className="font-semibold">Participación:</span> {data.participacion}%
                        </p>
                        <p className="text-green-600 text-sm">
                          <span className="font-semibold">Área:</span> {formatNumber(data.metros)} m²
                        </p>
                        <p className="text-gray-600 text-sm">
                          <span className="font-semibold">Ave * m² :</span> {(data.aves / data.metros).toFixed(2)} 
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="participacion" 
              name="Participación (%)"
              label={{ 
                position: 'right', 
                formatter: (value) => `${value}%`,
                fill: '#1f2937',
                fontSize: 13,
                fontWeight: 'bold'
              }}
              radius={[0, 8, 8, 0]}
            >
              {granjasData
                .sort((a, b) => (parseFloat(b.aves) || 0) - (parseFloat(a.aves) || 0))
                .slice(0, 10)
                .map((entry, index) => {
                  const color = COLORS[entry.tipo] || '#3b82f6';
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
        {/* Resumen debajo de la gráfica */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {['FRIO', 'CALIDO', 'CALIENTE'].map(zona => {
            const granjasZona = granjasData.filter(g => g.tipo === zona);
            const avesZona = granjasZona.reduce((sum, g) => sum + (parseFloat(g.aves) || 0), 0);
            const participacionZona = ((avesZona / totalAves) * 100).toFixed(1);
            return (
              <div key={zona} className="bg-gray-50 rounded-lg p-3 border-2" style={{ borderColor: COLORS[zona] + '40' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[zona] }}></div>
                  <span className="text-xs font-bold text-gray-700">ZONA {zona}</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: COLORS[zona] }}>{participacionZona}%</div>
                <div className="text-xs text-gray-600">{granjasZona.length} granjas</div>
              </div>
            );
          })}
        </div>
      </CollapsibleChart>

      {/* Tabla agrupada por tipo con participación porcentual */}
      <CollapsibleTable 
        title="Detalle Completo por Granja - Participación Porcentual"
        defaultOpen={false}
        totalRow={[
          { label: 'TOTAL GRANJAS' },
          { label: `${totalGranjas} granjas`, color: 'text-blue-600' },
          { label: `${formatNumber(totalMetros)} m²`, color: 'text-gray-700' },
          { label: `${formatNumber(totalAves)} aves`, color: 'text-green-600' },
          { label: '100%', color: 'text-blue-600' },
        ]}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-blue-600 border-b-2 border-blue-700">
                <th className="text-left py-3 px-2 text-white font-bold">Tipo</th>
                <th className="text-left py-3 px-2 text-white font-bold">Granja</th>
                <th className="text-right py-3 px-2 text-white font-bold">Metros²</th>
                <th className="text-right py-3 px-2 text-white font-bold">Aves</th>
                <th className="text-right py-3 px-2 text-white font-bold">Participación %</th>
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
                    const participacion = ((aves / totalAves) * 100).toFixed(2);
                    
                    tipoMetros += metros;
                    tipoAves += aves;

                    rows.push(
                      <tr key={`${tipo}-${idx}`} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                        <td className="py-1.5 px-2">
                          {idx === 0 && (
                            <span 
                              className="inline-block px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm" 
                              style={{ backgroundColor: COLORS[tipo] }}
                            >
                              {tipo}
                            </span>
                          )}
                        </td>
                        <td className="py-1.5 px-2 text-gray-900 font-medium">{row.granja || 'Sin nombre'}</td>
                        <td className="py-1.5 px-2 text-right text-green-600 tabular-nums font-semibold">{metros.toLocaleString('es-ES')}</td>
                        <td className="py-1.5 px-2 text-right text-blue-600 tabular-nums font-semibold">{aves.toLocaleString('es-ES')}</td>
                        <td className="py-1.5 px-2 text-right tabular-nums">
                          <span 
                            className="inline-block px-2 py-1 rounded font-bold text-white text-xs"
                            style={{ backgroundColor: COLORS[tipo] }}
                          >
                            {participacion}%
                          </span>
                        </td>
                      </tr>
                    );
                  });

                  // Después el subtotal del tipo
                  const tipoParticipacion = ((tipoAves / totalAves) * 100).toFixed(2);
                  rows.push(
                    <tr key={`subtotal-${tipo}`} className="bg-amber-50 border-y-2 border-amber-300 font-bold">
                      <td className="py-2 px-2 text-amber-800 text-xs">SUBTOTAL</td>
                      <td className="py-2 px-2 text-amber-800 text-xs">{tipo}</td>
                      <td className="py-2 px-2 text-right text-amber-800 text-xs tabular-nums">{tipoMetros.toLocaleString('es-ES')}</td>
                      <td className="py-2 px-2 text-right text-amber-800 text-xs tabular-nums">{tipoAves.toLocaleString('es-ES')}</td>
                      <td className="py-2 px-2 text-right text-amber-800 text-xs tabular-nums">{tipoParticipacion}%</td>
                    </tr>
                  );

                  globalMetros += tipoMetros;
                  globalAves += tipoAves;
                });

                // Al final el total general
                rows.push(
                  <tr key="total-general" className="bg-gradient-to-r from-blue-50 to-blue-100 border-t-2 border-blue-400 font-bold text-sm">
                    <td className="py-2 px-2 text-blue-900" colSpan="2">TOTAL GENERAL</td>
                    <td className="py-2 px-2 text-right text-blue-900 tabular-nums">{globalMetros.toLocaleString('es-ES')}</td>
                    <td className="py-2 px-2 text-right text-blue-900 tabular-nums">{globalAves.toLocaleString('es-ES')}</td>
                    <td className="py-2 px-2 text-right text-blue-900 tabular-nums">100.00%</td>
                  </tr>
                );

                return rows;
              })()}
            </tbody>
          </table>
        </div>
      </CollapsibleTable>

      {/* Resumen de Capacidad por Zona Climática - DATOS REALES DE BD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-2 border-gray-200 cursor-pointer hover:border-yellow-500 transition-all"
        onClick={() => openModal(
          'Resumen por Zona',
          `${tipoData.map(t => {
            const pct = ((t.aves / totalAves) * 100).toFixed(1);
            return `${t.tipo}: ${t.granjas} granjas | ${formatNumber(t.aves)} aves (${pct}%)`;
          }).join('\n\n')}`
        )}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Capacidad Instalada por Zona Climática</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tipoData.map((zona, idx) => {
            const colores = {
              'FRIO': { 
                bg: 'border-blue-500/30 hover:border-blue-500', 
                badge: 'bg-blue-100 text-blue-700',
                text: 'text-blue-600',
                densidad: 'text-blue-600',
                temp: '<18°C'
              },
              'CALIDO': { 
                bg: 'border-green-500/30 hover:border-green-500', 
                badge: 'bg-green-100 text-green-700',
                text: 'text-green-600',
                densidad: 'text-green-600',
                temp: '18-24°C'
              },
              'CALIENTE': { 
                bg: 'border-yellow-500/30 hover:border-yellow-500', 
                badge: 'bg-yellow-100 text-yellow-700',
                text: 'text-yellow-600',
                densidad: 'text-yellow-600',
                temp: '>24°C'
              }
            };
            
            const color = colores[zona.tipo] || colores['FRIO'];
            const porcentaje = ((zona.aves / totalAves) * 100).toFixed(1);
            const densidad = Math.round(zona.aves / zona.metros);
            
            return (
              <div key={idx} className={`bg-white rounded-lg p-5 border-2 ${color.bg} transition-all shadow-sm`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`text-lg font-bold ${color.text}`}>ZONA {zona.tipo}</div>
                  <div className={`text-xs ${color.badge} px-2 py-1 rounded font-semibold`}>{color.temp}</div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-gray-600">Capacidad Total</div>
                    <div className="text-3xl font-bold text-gray-900">{formatNumber(zona.aves)}</div>
                    <div className={`text-xs ${color.text} font-semibold`}>aves ({porcentaje}%)</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                    <div>
                      <div className="text-xs text-gray-600">Granjas</div>
                      <div className="text-lg font-bold text-gray-900">{zona.granjas}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Área</div>
                      <div className="text-lg font-bold text-gray-900">{formatNumber(zona.metros)} m²</div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-600">Aves por m²</div>
                    <div className={`text-xl font-bold ${color.densidad}`}>{densidad} aves/m²</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Nota informativa */}
        <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-gray-900">Distribución estratégica:</span> Las {totalGranjas} granjas están distribuidas estratégicamente en {tipoData.length} zonas climáticas para diversificar riesgos operativos y optimizar costos de producción según las condiciones ambientales de cada región.
          </p>
        </div>
      </motion.div>

      {/* Modal de Explicación */}
      {createPortal(
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
              className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-blue-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-blue-600" />
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
      </AnimatePresence>, document.body)}
    </div>
  );
}

