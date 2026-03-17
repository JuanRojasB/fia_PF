import { motion, AnimatePresence } from 'framer-motion';
import { Package, Info, TrendingUp, X, ArrowUpDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import CollapsibleTable from '../CollapsibleTable';
import CollapsibleChart from '../CollapsibleChart';

export default function ComercialEstructuraDashboard({ data }) {
  const [showEquipoModal, setShowEquipoModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  };
  
  if (!data || typeof data !== 'object') {
    return <div className="text-gray-600">No hay datos disponibles</div>;
  }

  const { asignacionMayorista = [] } = data;

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO').format(value);
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

  const datos2024 = asignacionMayorista.filter(a => a.anio === 2024);
  const datos2025 = asignacionMayorista.filter(a => a.anio === 2025);
  const total2024 = datos2024.reduce((sum, d) => sum + (parseInt(d.unidades) || 0), 0);
  const total2025 = datos2025.reduce((sum, d) => sum + (parseInt(d.unidades) || 0), 0);
  
  const analisisAsignacion = datos2025.map(d2025 => {
    const d2024 = datos2024.find(d => d.centro_operacion === d2025.centro_operacion);
    const unidades2024 = d2024 ? parseInt(d2024.unidades) : 0;
    const unidades2025 = parseInt(d2025.unidades);
    const participacion2024 = total2024 > 0 ? ((unidades2024 / total2024) * 100) : 0;
    const participacion2025 = total2025 > 0 ? ((unidades2025 / total2025) * 100) : 0;
    const variacion = unidades2025 - unidades2024;
    const variacionPct = unidades2024 > 0 ? ((variacion / unidades2024) * 100) : 0;
    return { asignacion: d2025.centro_operacion, unidades2025, participacion2025, unidades2024, participacion2024, variacion, variacionPct };
  }).sort((a, b) => b.participacion2025 - a.participacion2025);

  // U01 y U03 — buscar por nombre flexible (puede venir como "Sede U01", "U01", etc.)
  const u01_2025 = analisisAsignacion.find(a => a.asignacion.toUpperCase().includes('U01'));
  const u03_2025 = analisisAsignacion.find(a => a.asignacion.toUpperCase().includes('U03'));
  const totalU01U03_2025 = (u01_2025?.unidades2025 || 0) + (u03_2025?.unidades2025 || 0);
  const totalU01U03_2024 = (u01_2025?.unidades2024 || 0) + (u03_2025?.unidades2024 || 0);
  const participacionU01U03_2025 = total2025 > 0 ? ((totalU01U03_2025 / total2025) * 100) : 0;
  const participacionU01U03_2024 = total2024 > 0 ? ((totalU01U03_2024 / total2024) * 100) : 0;
  const variacionU01U03 = totalU01U03_2025 - totalU01U03_2024;
  const variacionU01U03Pct = totalU01U03_2024 > 0 ? ((variacionU01U03 / totalU01U03_2024) * 100) : 0;

  const datosGraficaComparativa = analisisAsignacion.map(row => ({ nombre: row.asignacion.replace('Sede ', ''), '2024': row.unidades2024, '2025': row.unidades2025 }));
  const datosGraficaParticipacion2025 = analisisAsignacion.map(row => ({ name: row.asignacion.replace('Sede ', ''), value: row.participacion2025, unidades: row.unidades2025 }));
  const datosGraficaVariacion = analisisAsignacion.filter(row => row.unidades2024 > 0).map(row => ({ nombre: row.asignacion.replace('Sede ', ''), variacion: row.variacionPct })).sort((a, b) => b.variacion - a.variacion);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer" 
          onClick={() => openModal(
            'Total Unidades Procesadas 2025 vs 2024',
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">2024</p>
                  <p className="text-xl font-bold text-gray-900">{formatNumber(total2024)} uds</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                  <p className="text-xs text-indigo-600 font-semibold mb-1">2025</p>
                  <p className="text-xl font-bold text-indigo-700">{formatNumber(total2025)} uds</p>
                </div>
              </div>
              <div className={`rounded-lg p-4 border ${total2025 >= total2024 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <p className={`text-sm font-semibold mb-2 ${total2025 >= total2024 ? 'text-green-800' : 'text-red-800'}`}>Variación:</p>
                <p className="text-sm text-gray-700">Las unidades procesadas variaron <strong className={total2025 >= total2024 ? 'text-green-600' : 'text-red-600'}>{total2024 > 0 ? (((total2025 - total2024) / total2024) * 100).toFixed(1) : 0}%</strong> respecto a 2024.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Análisis:</p>
                <p className="text-sm text-gray-700">La redistribución estratégica entre sedes permitió optimizar la eficiencia operativa y mejorar el control de calidad en el proceso de selección y despacho. Sede 1 fue trasladada a Sede U03 (Ángel Blanco).</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                <p className="text-sm text-gray-700">La reorganización generó un incremento en U03 de +119.28% y una disminución en U01 de -84.45%, concentrando el procesamiento mayorista en la sede más eficiente.</p>
              </div>
            </div>
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <Package className="w-10 h-10 opacity-80" />
            <Info className="w-5 h-5 opacity-60 hover:opacity-100" />
          </div>
          <div className="text-4xl font-bold mb-2">{formatNumber(total2025)}</div>
          <div className="text-sm opacity-90">Unidades Procesadas 2025</div>
          <div className="text-xs opacity-75 mt-2">
            {total2025 > total2024 ? '↗' : '↘'} {total2024 > 0 ? Math.abs(((total2025 - total2024) / total2024) * 100).toFixed(1) : 0}% vs 2024 ({formatNumber(total2024)})
          </div>
        </div>

        <div 
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer" 
          onClick={() => openModal(
            'Sede U03 — Liderazgo en Procesamiento 2025',
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">2024</p>
                  <p className="text-xl font-bold text-gray-900">{formatNumber(u03_2025?.unidades2024 || 0)} uds</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <p className="text-xs text-purple-600 font-semibold mb-1">2025</p>
                  <p className="text-xl font-bold text-purple-700">{formatNumber(u03_2025?.unidades2025 || 0)} uds</p>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="text-sm font-semibold text-purple-800 mb-2">Participación:</p>
                <p className="text-sm text-gray-700">Sede U03 lidera el procesamiento con <strong className="text-purple-600">{u03_2025?.participacion2025.toFixed(1) || 0}%</strong> del total, experimentando un crecimiento de <strong className="text-green-600">+{u03_2025?.variacionPct.toFixed(1) || 0}%</strong> respecto a 2024.</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="text-sm font-semibold text-green-800 mb-2">Causa:</p>
                <p className="text-sm text-gray-700">La consolidación de Sede U03 como centro principal de selección y despacho se debe a la reorganización estratégica implementada en 2025, trasladando operaciones de Sede U01 para mayor eficiencia.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Impacto:</p>
                <p className="text-sm text-gray-700">La concentración en U03 mejora el control de calidad, reduce costos logísticos y permite una gestión más eficiente del canal mayorista.</p>
              </div>
            </div>
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-10 h-10 opacity-80" />
            <Info className="w-5 h-5 opacity-60 hover:opacity-100" />
          </div>
          <div className="text-4xl font-bold mb-2">{participacionU01U03_2025.toFixed(1)}%</div>
          <div className="text-sm opacity-90">Participación Sedes UO1 y UO3</div>
          <div className="text-xs opacity-75 mt-2">
            UO1: {formatNumber(u01_2025?.unidades2025 || 0)} • UO3: {formatNumber(u03_2025?.unidades2025 || 0)}
          </div>
        </div>

        <div 
          className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer" 
          onClick={() => openModal(
            'Estructura del Equipo Comercial 2025',
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Pollo en Pie (1 Agrupación):</p>
                <p className="text-sm text-gray-700">Mayorista — José Rodríguez</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="text-sm font-semibold text-green-800 mb-2">Pollo en Canal (5 Agrupaciones):</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Institucional — Hernán Benito</li>
                  <li>• Asadero — German Rodríguez</li>
                  <li>• Sede 5 — Yenny Alvarado</li>
                  <li>• PDV — Elmira González & Michael Arias</li>
                  <li>• Yopal — Julián Mora</li>
                </ul>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-300">
                <p className="text-sm font-semibold text-yellow-800 mb-2">Huevos (1 Agrupación):</p>
                <p className="text-sm text-gray-700">Comercial — Margarita Roa Barrera</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                <p className="text-sm text-gray-700">Esta estructura de 3 categorías, 7 agrupaciones y 10 líderes permite atención especializada y enfoque estratégico en cada segmento de mercado, contribuyendo al crecimiento de ventas del +1.04% en 2025.</p>
              </div>
            </div>
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <ArrowUpDown className="w-10 h-10 opacity-80" />
            <Info className="w-5 h-5 opacity-60 hover:opacity-100" />
          </div>
          <div className="text-2xl font-bold mb-1 break-all">{analisisAsignacion[0]?.asignacion || '—'}</div>
          <div className="text-sm opacity-90">Sede UO3 2025</div>
          <div className="text-xs opacity-75 mt-2">
            {formatNumber(analisisAsignacion[0]?.unidades2025 || 0)} und • {analisisAsignacion[0]?.participacion2025.toFixed(1) || 0}% del total
          </div>
        </div>
      </motion.div>

      <CollapsibleTable 
        title="ASIGNACIÓN DE POLLO - Distribución de unidades procesadas 2024 vs 2025"
        defaultOpen={false}
        totalRow={[
          { label: 'TOTAL MAYORISTA 2025' },
          { label: `${formatNumber(total2025)} und`, color: 'text-blue-600' },
          { label: `Var: ${total2024 > 0 ? (((total2025 - total2024) / total2024) * 100).toFixed(2) : 0}%`, color: (total2025 - total2024) >= 0 ? 'text-green-500' : 'text-red-500', badge: true, badgeColor: (total2025 - total2024) >= 0 ? 'bg-green-500' : 'bg-red-500', badgeIcon: (total2025 - total2024) >= 0 ? '↑' : '↓' },
          { label: `vs 2024: ${formatNumber(total2024)}`, color: 'text-gray-500' },
        ]}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gradient-to-r from-blue-500 to-blue-600"><th className="text-left py-3 px-4 text-white font-bold">ASIGNACIÓN</th><th className="text-right py-3 px-4 text-white font-bold">Und. 2025</th><th className="text-right py-3 px-4 text-white font-bold">% Part</th><th className="text-right py-3 px-4 text-white font-bold">Und. 2024</th><th className="text-right py-3 px-4 text-white font-bold">% Part</th><th className="text-right py-3 px-4 text-white font-bold">Variación</th><th className="text-right py-3 px-4 text-white font-bold">Var %</th></tr></thead>
            <tbody>
              {analisisAsignacion.map((row, idx) => {
                const esIncremento = row.variacion > 0;
                const colorVariacion = esIncremento ? 'text-green-600' : 'text-red-600';
                const iconoVariacion = esIncremento ? '⬆' : '⬇';
                return (<tr key={idx} className="border-b border-gray-200 hover:bg-blue-50 transition-colors"><td className="py-3 px-4 text-gray-900 font-semibold">{row.asignacion}</td><td className="py-3 px-4 text-right text-blue-600 font-bold">{formatNumber(row.unidades2025)}</td><td className="py-3 px-4 text-right text-blue-700 font-semibold">{row.participacion2025.toFixed(2)}%</td><td className="py-3 px-4 text-right text-gray-600">{formatNumber(row.unidades2024)}</td><td className="py-3 px-4 text-right text-gray-600">{row.participacion2024.toFixed(2)}%</td><td className="py-3 px-4 text-right text-gray-900 font-semibold">{formatNumber(row.variacion)}</td><td className="py-3 px-4 text-right"><span className={`inline-flex items-center gap-1 font-bold ${colorVariacion}`}>{iconoVariacion} {Math.abs(row.variacionPct).toFixed(2)}%</span></td></tr>);
              })}
              <tr className="bg-blue-50 border-t-2 border-blue-400 font-bold"><td className="py-3 px-4 text-blue-900">Total</td><td className="py-3 px-4 text-right text-blue-900">{formatNumber(total2025)}</td><td className="py-3 px-4 text-right text-blue-900">100.00%</td><td className="py-3 px-4 text-right text-blue-900">{formatNumber(total2024)}</td><td className="py-3 px-4 text-right text-blue-900">100.00%</td><td className="py-3 px-4 text-right text-blue-900">{formatNumber(total2025 - total2024)}</td><td className="py-3 px-4 text-right text-blue-900">{total2024 > 0 ? (((total2025 - total2024) / total2024) * 100).toFixed(2) : 0}%</td></tr>
              <tr className="bg-amber-50 border-t-2 border-amber-400 font-bold"><td className="py-3 px-4 text-amber-900">UO1 + UO3</td><td className="py-3 px-4 text-right text-amber-900">{formatNumber(totalU01U03_2025)}</td><td className="py-3 px-4 text-right text-amber-900">{participacionU01U03_2025.toFixed(2)}%</td><td className="py-3 px-4 text-right text-amber-900">{formatNumber(totalU01U03_2024)}</td><td className="py-3 px-4 text-right text-amber-900">{participacionU01U03_2024.toFixed(2)}%</td><td className="py-3 px-4 text-right text-amber-900">{formatNumber(variacionU01U03)}</td><td className="py-3 px-4 text-right"><span className={`inline-flex items-center gap-1 font-bold ${variacionU01U03 > 0 ? 'text-green-600' : 'text-red-600'}`}>{variacionU01U03 > 0 ? '⬆' : '⬇'} {Math.abs(variacionU01U03Pct).toFixed(2)}%</span></td></tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200"><p className="text-sm text-gray-700"><span className="font-semibold text-gray-900">Redistribución 2025:</span> Sede 1 trasladada a Sede U03 (Ángel Blanco) para selección y despacho. Incremento U03 +119.28%, disminución U01 -84.45%.</p></div>
      </CollapsibleTable>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CollapsibleChart title="Unidades Procesadas por Sede 2024 vs 2025" defaultOpen={false}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosGraficaComparativa}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="nombre" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const val2024 = payload.find(p => p.dataKey === '2024')?.value || 0;
                    const val2025 = payload.find(p => p.dataKey === '2025')?.value || 0;
                    const diferencia = val2025 - val2024;
                    const variacion = val2024 > 0 ? ((diferencia / val2024) * 100).toFixed(1) : 0;
                    
                    return (
                      <div className="bg-white border-2 border-blue-500 rounded-xl p-4 shadow-xl">
                        <p className="font-bold text-gray-900 mb-3 text-lg">{label}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-gray-600 font-medium">2024:</span>
                            <span className="font-bold text-gray-900">{formatNumber(val2024)}</span>
                          </div>
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-blue-600 font-medium">2025:</span>
                            <span className="font-bold text-gray-900">{formatNumber(val2025)}</span>
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
              <Bar dataKey="2024" fill="#94a3b8" name="2024" radius={[8, 8, 0, 0]} />
              <Bar dataKey="2025" fill="#3b82f6" name="2025" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CollapsibleChart>
        
        <CollapsibleChart title="Participación de Unidades Procesadas por Sede 2025 (%)" defaultOpen={false}>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="60%" height={300}>
              <PieChart>
                <Pie data={datosGraficaParticipacion2025} cx="50%" cy="50%" labelLine={false} label={false} outerRadius={100} fill="#8884d8" dataKey="value">
                  {datosGraficaParticipacion2025.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border-2 border-green-500 rounded-xl p-4 shadow-xl">
                          <p className="font-bold text-gray-900 mb-3 text-lg">{data.name}</p>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center gap-4">
                              <span className="text-gray-600 font-medium">Unidades:</span>
                              <span className="font-bold text-gray-900">{formatNumber(data.unidades)}</span>
                            </div>
                            <div className="flex justify-between items-center gap-4">
                              <span className="text-green-600 font-medium">Participación:</span>
                              <span className="font-bold text-gray-900">{data.value.toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {datosGraficaParticipacion2025.map((entry, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 transition-colors">
                  <div className="w-4 h-4 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">{entry.name}</div>
                    <div className="text-xs text-gray-600">{entry.value.toFixed(2)}% • {formatNumber(entry.unidades)} und</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleChart>
      </div>
      
      <CollapsibleChart title="Variación Porcentual de Unidades Procesadas 2024 a 2025" defaultOpen={false}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datosGraficaVariacion} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis dataKey="nombre" type="category" tick={{ fill: '#64748b', fontSize: 12 }} width={100} />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const variacion = payload[0].value;
                  const sedeData = analisisAsignacion.find(a => a.asignacion.replace('Sede ', '') === label);
                  
                  return (
                    <div className="bg-white border-2 border-purple-500 rounded-xl p-4 shadow-xl">
                      <p className="font-bold text-gray-900 mb-3 text-lg">{label}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-gray-600 font-medium">Unidades 2024:</span>
                          <span className="font-bold text-gray-900">{formatNumber(sedeData?.unidades2024 || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-blue-600 font-medium">Unidades 2025:</span>
                          <span className="font-bold text-gray-900">{formatNumber(sedeData?.unidades2025 || 0)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-gray-600 font-medium">Variación:</span>
                            <span className={`font-bold ${variacion >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {variacion >= 0 ? '+' : ''}{variacion.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center gap-4 mt-1">
                            <span className="text-gray-600 font-medium">Diferencia:</span>
                            <span className={`font-bold ${sedeData?.variacion >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {sedeData?.variacion >= 0 ? '+' : ''}{formatNumber(sedeData?.variacion || 0)}
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
            <Bar dataKey="variacion" fill="#8b5cf6" radius={[0, 8, 8, 0]}>
              {datosGraficaVariacion.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.variacion >= 0 ? '#10b981' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CollapsibleChart>

      {/* Modal */}
      {createPortal(
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
              className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-blue-500 shadow-2xl max-h-[90vh] flex flex-col"
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
              <div className="text-gray-700 leading-relaxed overflow-y-auto flex-1 pr-2">
                {modalContent.content}
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
      </AnimatePresence>, document.body)}
    </div>
  );
}
