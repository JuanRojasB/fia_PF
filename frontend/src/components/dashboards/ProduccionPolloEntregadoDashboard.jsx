import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Truck, TrendingDown, Package, AlertCircle, X, Info } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';
import CollapsibleChart from '../CollapsibleChart';
import { getValueColor } from '../../utils/colorUtils';

export default function ProduccionPolloEntregadoDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  if (!data || typeof data !== 'object') {
    return <div className="text-gray-600">No hay datos disponibles</div>;
  }

  const { polloEntregado = [] } = data;

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO').format(value);
  };

  // Datos históricos hardcodeados como fuente de verdad
  const historico = [
    { anio: 2018, programado: 26617724, real_granjas: 26353497, comprado: 664575,  total: 27018072, var_pct: null },
    { anio: 2019, programado: 27353834, real_granjas: 27201661, comprado: 618577,  total: 27820238, var_pct: 3.0  },
    { anio: 2020, programado: 27816195, real_granjas: 23666296, comprado: 659756,  total: 24326052, var_pct: -12.5 },
    { anio: 2021, programado: 31212400, real_granjas: 28303721, comprado: 398578,  total: 28702299, var_pct: 18.0 },
    { anio: 2022, programado: 33632300, real_granjas: 30042350, comprado: 582264,  total: 30624614, var_pct: 6.7  },
    { anio: 2023, programado: 30805997, real_granjas: 29171431, comprado: 427670,  total: 29599101, var_pct: -3.3 },
    { anio: 2024, programado: 30581067, real_granjas: 28604260, comprado: 274229,  total: 28878489, var_pct: -2.4 },
    { anio: 2025, programado: 30872786, real_granjas: 29435711, comprado: 238502,  total: 29674213, var_pct: 2.7  },
  ];

  // La BD tiene 2025 con datos idénticos a 2024 (no actualizado).
  // Usamos BD para 2018-2024 y hardcodeado para 2025.
  const mergeRow = (anio) => {
    if (anio === 2025) return historico.find(p => p.anio === 2025);
    const fromBD = polloEntregado.find(p => parseInt(p.anio) === anio);
    const fromHC = historico.find(p => p.anio === anio);
    if (!fromBD) return fromHC;
    return {
      anio,
      programado:   parseInt(fromBD.programado)   || fromHC?.programado   || 0,
      real_granjas: parseInt(fromBD.real_granjas)  || fromHC?.real_granjas || 0,
      comprado:     parseInt(fromBD.comprado)      || fromHC?.comprado     || 0,
      total:        parseInt(fromBD.total)         || fromHC?.total        || 0,
      var_pct:      fromBD.var_pct != null ? parseFloat(fromBD.var_pct) : fromHC?.var_pct,
      notas:        fromBD.notas
    };
  };

  const datos2025 = mergeRow(2025) || historico.find(p => p.anio === 2025);
  const datos2024 = mergeRow(2024) || historico.find(p => p.anio === 2024);
  const tablaData = historico.map(h => mergeRow(h.anio));

  // Preparar datos para gráfico comparativo - Real vs Programado
  const datosComparativo = [
    { categoria: 'Programado', '2024': datos2024.programado, '2025': datos2025.programado },
    { categoria: 'Real Granjas', '2024': datos2024.real_granjas, '2025': datos2025.real_granjas },
    { categoria: 'Comprado',    '2024': datos2024.comprado,    '2025': datos2025.comprado    },
    { categoria: 'Total',       '2024': datos2024.total,       '2025': datos2025.total       },
  ];

  // Datos para el resumen completo (incluye todas las categorías)
  const datosResumen = datosComparativo.map(d => ({
    categoria: d.categoria,
    diferencia: d['2025'] - d['2024']
  }));



  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-xl p-6 border-2 border-blue-500/30"
      >
        <div className="flex items-center gap-3">
          <Truck className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-3xl font-bold text-gray-900">POLLO ENTREGADO</h2>
            <p className="text-gray-700 mt-1">Comparativo 2025 vs 2024 - Análisis de recepción</p>
          </div>
        </div>
      </motion.div>

      {/* Alerta Contexto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="text-sm text-gray-700">
            {datos2025.notas || 'Del total recibido (REAL) de granjas para el año 2024 sumado al pollo comprado arroja un total de 28.6 millones de pollos el cual presentó un decrecimiento frente al año anterior de -2.4%, lo que representa -733.456 pollos menos.'}
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal(
            'Programado Aves 2025',
            `El volumen programado para 2025 fue de ${formatNumber(datos2025.programado)} aves, frente a ${formatNumber(datos2024.programado)} programadas en 2024, lo que representa un incremento del ${(((datos2025.programado - datos2024.programado) / datos2024.programado) * 100).toFixed(1)}% en la meta de producción. Este valor refleja la proyección de capacidad instalada en granjas propias para el ciclo productivo del año. El cumplimiento real vs programado 2025 fue del ${(datos2025.real_granjas / datos2025.programado * 100).toFixed(1)}%, con una diferencia de ${formatNumber(datos2025.real_granjas - datos2025.programado)} aves respecto a la meta.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 cursor-pointer hover:border-purple-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Programado Aves 2025</span>
            <Package className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 leading-tight">{formatNumber(datos2025.programado)}</div>
          {(() => {
            const vPct = datos2024.programado > 0 ? (((datos2025.programado - datos2024.programado) / datos2024.programado) * 100).toFixed(1) : 0;
            return (
              <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
                <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{formatNumber(datos2024.programado)}</span></div>
                <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{formatNumber(datos2025.programado)}</span></div>
                <div className={`text-sm font-bold ${parseFloat(vPct) >= 0 ? 'text-green-600' : 'text-red-600'}`}>Var: {parseFloat(vPct) >= 0 ? '+' : ''}{vPct}%</div>
              </div>
            );
          })()}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal(
            'Real Aves Entregadas en 2025',
            `Las granjas propias entregaron ${formatNumber(datos2025.real_granjas)} aves en 2025, frente a ${formatNumber(datos2024.real_granjas)} en 2024. Esto representa un crecimiento del ${(((datos2025.real_granjas - datos2024.real_granjas) / datos2024.real_granjas) * 100).toFixed(1)}%, equivalente a ${formatNumber(datos2025.real_granjas - datos2024.real_granjas)} aves adicionales. El cumplimiento frente al programado 2025 (${formatNumber(datos2025.programado)}) fue del ${(datos2025.real_granjas / datos2025.programado * 100).toFixed(1)}%. Este indicador mide exclusivamente la producción de granjas propias, sin incluir el pollo comprado a terceros.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 cursor-pointer hover:border-green-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Real Aves Entregadas en 2025</span>
            <Truck className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 leading-tight">{formatNumber(datos2025.real_granjas)}</div>
          {(() => {
            const vPct = datos2024.real_granjas > 0 ? (((datos2025.real_granjas - datos2024.real_granjas) / datos2024.real_granjas) * 100).toFixed(1) : 0;
            return (
              <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
                <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{formatNumber(datos2024.real_granjas)}</span></div>
                <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{formatNumber(datos2025.real_granjas)}</span></div>
                <div className={`text-sm font-bold ${parseFloat(vPct) >= 0 ? 'text-green-600' : 'text-red-600'}`}>Var: {parseFloat(vPct) >= 0 ? '+' : ''}{vPct}%</div>
              </div>
            );
          })()}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => openModal(
            'Comprado de Aves en 2025',
            `En 2025 se compraron ${formatNumber(datos2025.comprado)} aves a terceros, frente a ${formatNumber(datos2024.comprado)} en 2024, una reducción del ${Math.abs((((datos2025.comprado - datos2024.comprado) / datos2024.comprado) * 100)).toFixed(1)}% (${formatNumber(Math.abs(datos2025.comprado - datos2024.comprado))} aves menos). El pollo comprado representa el ${(datos2025.comprado / datos2025.total * 100).toFixed(2)}% del total entregado en 2025, vs ${(datos2024.comprado / datos2024.total * 100).toFixed(2)}% en 2024. La disminución en compras externas refleja mayor autosuficiencia productiva de las granjas propias.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30 cursor-pointer hover:border-orange-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Comprado de Aves(Avi/cambulos) en 2025</span>
            <Package className="w-6 h-6 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 leading-tight">{formatNumber(datos2025.comprado)}</div>
          {(() => {
            const vPct = datos2024.comprado > 0 ? (((datos2025.comprado - datos2024.comprado) / datos2024.comprado) * 100).toFixed(1) : 0;
            return (
              <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
                <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{formatNumber(datos2024.comprado)}</span></div>
                <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{formatNumber(datos2025.comprado)}</span></div>
                <div className={`text-sm font-bold ${parseFloat(vPct) >= 0 ? 'text-green-600' : 'text-red-600'}`}>Var: {parseFloat(vPct) >= 0 ? '+' : ''}{vPct}%</div>
              </div>
            );
          })()}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => openModal(
            'Total de Aves en 2025',
            `El total de aves entregadas en 2025 fue de ${formatNumber(datos2025.total)} (granjas propias + comprado), frente a ${formatNumber(datos2024.total)} en 2024, con un crecimiento del +${datos2025.var_pct}% equivalente a ${formatNumber(datos2025.total - datos2024.total)} aves adicionales. Composición 2025: ${formatNumber(datos2025.real_granjas)} de granjas propias (${(datos2025.real_granjas / datos2025.total * 100).toFixed(1)}%) + ${formatNumber(datos2025.comprado)} compradas (${(datos2025.comprado / datos2025.total * 100).toFixed(1)}%). Este es el mejor resultado desde 2022 (${formatNumber(historico.find(h=>h.anio===2022)?.total || 0)} aves).`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 cursor-pointer hover:border-blue-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Total de Aves en 2025</span>
            <TrendingDown className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 leading-tight">{formatNumber(datos2025.total)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{formatNumber(datos2024.total)}</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{formatNumber(datos2025.total)}</span></div>
            <div className={`text-sm font-bold ${datos2025.var_pct >= 0 ? 'text-green-600' : 'text-red-600'}`}>Var: {datos2025.var_pct >= 0 ? '+' : ''}{datos2025.var_pct}%</div>
          </div>
        </motion.div>
      </div>

      {/* Tabla Histórica Pollo Entregado */}
      <CollapsibleTable
        title="Pollo Entregado — Cantidad en Unidades (Histórico 2018-2025)"
        defaultOpen={false}
        totalRow={[
          { label: 'Histórico 2018-2025' },
          { label: 'Real 2025: 29.435.711', color: 'text-green-600' },
          { label: 'Total 2025: 29.674.213', color: 'text-blue-600' },
          { label: 'Var 2025: +2.7%', color: 'text-green-600' },
        ]}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th colSpan={6} className="text-center py-2 text-blue-600 font-bold text-base border-b-2 border-blue-200">
                  Cantidad en Unidades
                </th>
              </tr>
              <tr className="border-b-2 border-blue-300">
                <th className="text-left py-3 px-4 text-blue-600 font-bold">Año</th>
                <th className="text-right py-3 px-4 text-blue-600 font-bold">Programado</th>
                <th className="text-right py-3 px-4 text-blue-600 font-bold">REAL</th>
                <th className="text-right py-3 px-4 text-blue-600 font-bold">Comprado</th>
                <th className="text-right py-3 px-4 text-blue-600 font-bold">Total</th>
                <th className="text-right py-3 px-4 text-blue-600 font-bold">%Var Vertical<br/>sobre Total</th>
              </tr>
            </thead>
            <tbody>
              {tablaData.sort((a, b) => a.anio - b.anio).map((row, idx) => {
                const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/30';
                const es2025 = row.anio === 2025;
                return (
                  <tr key={row.anio} className={`${rowBg} hover:bg-blue-100/40 transition-colors border-b border-gray-100`}>
                    <td className="py-2 px-4 font-bold text-gray-800">
                      {es2025 ? (
                        <span className="inline-block bg-blue-600 text-white px-2 py-0.5 rounded font-bold">{row.anio}</span>
                      ) : row.anio}
                    </td>
                    <td className="py-2 px-4 text-right text-gray-700">{formatNumber(row.programado)}</td>
                    <td className="py-2 px-4 text-right text-gray-800 font-medium">{formatNumber(row.real_granjas)}</td>
                    <td className="py-2 px-4 text-right text-gray-700">{formatNumber(row.comprado)}</td>
                    <td className="py-2 px-4 text-right text-blue-700 font-bold">{formatNumber(row.total)}</td>
                    <td className={`py-2 px-4 text-right font-bold ${
                      row.var_pct === null ? 'text-gray-400' :
                      row.var_pct >= 0 ? 'text-gray-800' : 'text-red-600'
                    }`}>
                      {row.var_pct === null ? '' : `${row.var_pct.toFixed(1)}%`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CollapsibleTable>

      {/* Gráficos Mejorados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1: Comparativo Barras */}
        <CollapsibleChart
          title="Aves Entregadas Real vs Programado por Año"
          defaultOpen={false}
        >
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={datosComparativo} margin={{ top: 5, right: 20, left: 60, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="categoria" 
                stroke="#6b7280" 
                angle={0}
                textAnchor="middle"
                interval={0}
                height={60}
                tick={{ fontSize: 13 }}
              />
              <YAxis stroke="#6b7280" tickFormatter={(value) => formatNumber(value)} width={90} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', border: '2px solid #3b82f6', borderRadius: '12px', padding: '12px' }}
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
                            <span className="text-blue-600 font-medium">2024:</span>
                            <span className="font-bold text-gray-900">{formatNumber(val2024)}</span>
                          </div>
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-green-600 font-medium">2025:</span>
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
              <Bar dataKey="2024" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                <LabelList dataKey="2024" position="top" style={{ fontSize: '10px', fill: '#3b82f6', fontWeight: 'bold' }} formatter={() => '2024'} />
              </Bar>
              <Bar dataKey="2025" fill="#10b981" radius={[8, 8, 0, 0]}>
                <LabelList dataKey="2025" position="top" style={{ fontSize: '10px', fill: '#10b981', fontWeight: 'bold' }} formatter={() => '2025'} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          {/* Totales anuales debajo del gráfico */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 text-center">Totales anuales</p>
            <div className="grid grid-cols-4 gap-2">
              {datosComparativo.map((item, idx) => {
                const dif = item['2025'] - item['2024'];
                const varPct = item['2024'] > 0 ? ((dif / item['2024']) * 100).toFixed(1) : 0;
                return (
                  <div key={idx} className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs font-semibold text-gray-500 mb-1">{item.categoria}</div>
                    <div className="text-xs text-blue-600 font-medium">2024: {formatNumber(item['2024'])}</div>
                    <div className="text-xs text-green-600 font-medium">2025: {formatNumber(item['2025'])}</div>
                    <div className={`text-xs font-bold mt-1 ${dif >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {dif >= 0 ? '+' : ''}{varPct}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CollapsibleChart>

        {/* Gráfico 2: Composición Real vs Comprado */}
        <CollapsibleChart
          title="Composición Aves Entregadas: Granjas Propias vs Comprado 2025"
          defaultOpen={false}
        >
          <div className="grid grid-cols-2 gap-6">
            {/* 2024 */}
            <div>
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-gray-900">2024</div>
                <div className="text-sm text-gray-600">{formatNumber(datos2024.total)} pollos</div>
              </div>
              <div className="space-y-3">
                <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Real Granjas</span>
                    <span className="text-lg font-bold text-green-600">
                      {((datos2024.real_granjas / datos2024.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">{formatNumber(datos2024.real_granjas)} pollos</div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${((datos2024.real_granjas / datos2024.total) * 100).toFixed(1)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Comprado(Avi/cambulos)</span>
                    <span className="text-lg font-bold text-orange-600">
                      {((datos2024.comprado / datos2024.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">{formatNumber(datos2024.comprado)} pollos</div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-orange-500 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${((datos2024.comprado / datos2024.total) * 100).toFixed(1)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2025 */}
            <div>
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-gray-900">2025</div>
                <div className="text-sm text-gray-600">{formatNumber(datos2025.total)} pollos</div>
              </div>
              <div className="space-y-3">
                <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Real Granjas</span>
                    <span className="text-lg font-bold text-green-600">
                      {((datos2025.real_granjas / datos2025.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">{formatNumber(datos2025.real_granjas)} pollos</div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${((datos2025.real_granjas / datos2025.total) * 100).toFixed(1)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Comprado(Avi/cambulos)</span>
                    <span className="text-lg font-bold text-orange-600">
                      {((datos2025.comprado / datos2025.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">{formatNumber(datos2025.comprado)} pollos</div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-orange-500 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${((datos2025.comprado / datos2025.total) * 100).toFixed(1)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleChart>
      </div>

      {/* Análisis */}
      {(() => {
        const varTotal = datos2024.total > 0 ? (((datos2025.total - datos2024.total) / datos2024.total) * 100).toFixed(1) : 0;
        const varReal = datos2024.real_granjas > 0 ? (((datos2025.real_granjas - datos2024.real_granjas) / datos2024.real_granjas) * 100).toFixed(1) : 0;
        const varComprado = datos2024.comprado > 0 ? (((datos2025.comprado - datos2024.comprado) / datos2024.comprado) * 100).toFixed(1) : 0;
        const pctRealGranjas2025 = datos2025.total > 0 ? ((datos2025.real_granjas / datos2025.total) * 100).toFixed(1) : 0;
        const pctRealGranjas2024 = datos2024.total > 0 ? ((datos2024.real_granjas / datos2024.total) * 100).toFixed(1) : 0;
        const cumplProg = datos2025.programado > 0 ? ((datos2025.total / datos2025.programado) * 100).toFixed(1) : 0;

        // Tendencia histórica: últimos 3 años
        const ultimos3 = historico.slice(-3);
        const tendenciaHistorica = ultimos3.every((r, i) => i === 0 || r.total >= ultimos3[i - 1].total)
          ? 'creciente' : ultimos3.every((r, i) => i === 0 || r.total <= ultimos3[i - 1].total)
          ? 'decreciente' : 'variable';

        const insights = [
          {
            icon: <TrendingDown className={`w-5 h-5 ${parseFloat(varTotal) >= 0 ? 'text-green-500' : 'text-red-500'}`} />,
            color: parseFloat(varTotal) >= 0 ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50',
            title: 'Variación total 2025 vs 2024',
            text: `El total de aves entregadas en 2025 fue ${formatNumber(datos2025.total)}, una variación de ${varTotal >= 0 ? '+' : ''}${varTotal}% frente a 2024 (${formatNumber(datos2024.total)}). Diferencia absoluta: ${parseFloat(varTotal) >= 0 ? '+' : ''}${formatNumber(datos2025.total - datos2024.total)} aves.`
          },
          {
            icon: <Truck className={`w-5 h-5 ${parseFloat(varReal) >= 0 ? 'text-green-500' : 'text-red-500'}`} />,
            color: parseFloat(varReal) >= 0 ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50',
            title: 'Real de granjas propias',
            text: `Las granjas propias entregaron ${formatNumber(datos2025.real_granjas)} aves en 2025 (${varReal >= 0 ? '+' : ''}${varReal}% vs 2024). Representan el ${pctRealGranjas2025}% del total 2025 vs ${pctRealGranjas2024}% en 2024, indicando ${parseFloat(pctRealGranjas2025) >= parseFloat(pctRealGranjas2024) ? 'mayor' : 'menor'} autosuficiencia productiva.`
          },
          {
            icon: <Package className={`w-5 h-5 ${parseFloat(varComprado) <= 0 ? 'text-green-500' : 'text-orange-500'}`} />,
            color: parseFloat(varComprado) <= 0 ? 'border-green-400 bg-green-50' : 'border-orange-400 bg-orange-50',
            title: 'Pollo comprado (Avi/Cambulos)',
            text: `El pollo comprado fue ${formatNumber(datos2025.comprado)} aves en 2025 (${varComprado >= 0 ? '+' : ''}${varComprado}% vs 2024). ${parseFloat(varComprado) < 0 ? 'La reducción en compras externas refleja mayor capacidad de producción propia.' : 'El incremento en compras externas puede indicar déficit en producción propia.'}`
          },
          {
            icon: <Info className="w-5 h-5 text-blue-500" />,
            color: 'border-blue-400 bg-blue-50',
            title: 'Cumplimiento y tendencia histórica',
            text: `Cumplimiento del programado 2025: ${cumplProg}% (${formatNumber(datos2025.total)} de ${formatNumber(datos2025.programado)} aves). La tendencia histórica de los últimos 3 años es ${tendenciaHistorica}. El año 2025 registra ${parseFloat(varTotal) >= 0 ? 'crecimiento' : 'decrecimiento'} frente al año anterior.`
          },
        ];

        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border-2 border-blue-200"
          >
            <div className="flex items-center gap-3 mb-5">
              <Info className="w-6 h-6 text-blue-500" />
              <h3 className="text-xl font-bold text-gray-900">Análisis de Pollo Entregado</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((item, i) => (
                <div key={i} className={`rounded-xl p-4 border-2 ${item.color}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {item.icon}
                    <span className="font-bold text-gray-800 text-sm">{item.title}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })()}

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
