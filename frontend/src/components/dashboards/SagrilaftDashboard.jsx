import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Shield, AlertTriangle, CheckCircle, X, Info, Users, FileCheck, Target } from 'lucide-react';

export default function SagrilaftDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  };

  if (!data || !data.stakeholders) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const { stakeholders, totalNoConformes, hallazgos, resumen } = data;

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO').format(value);
  };

  const totalEvaluados = resumen.total_validados + resumen.total_rechazados;

  // Calcular porcentajes de cada contraparte frente al total de rechazados
  const calcularPorcentaje = (valor, total) => {
    return ((valor / total) * 100).toFixed(2);
  };

  // Datos para gráficos con porcentajes
  const rechazadosData = stakeholders.map(s => ({
    contraparte: s.contraparte,
    rechazados: s.rechazados,
    porcentaje: calcularPorcentaje(s.rechazados, totalNoConformes.rechazados)
  }));

  const motivosData = [
    { name: 'Documentación', fullName: 'Documentación (Inadecuada)', value: totalNoConformes.documentacion_pct, color: '#f59e0b' },
    { name: 'Antecedentes', fullName: 'Antecedentes (Penales)', value: totalNoConformes.antecedentes_pct, color: '#eab308' },
    { name: 'FT', fullName: 'FT (Financiación Terrorismo)', value: totalNoConformes.ft_pct, color: '#ea580c' },
    { name: 'LA', fullName: 'LA (Lavado de Activos)', value: totalNoConformes.la_pct, color: '#dc2626' },
    { name: 'PEPs', fullName: 'PEPs (Personas Expuestas Políticamente)', value: totalNoConformes.peps_pct, color: '#8b5cf6' }
  ];

  return (
    <div className="space-y-6">

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
          onClick={() => openModal('Total Stakeholders Evaluados', 
            <div className="text-gray-300">
              <p className="mb-4">Durante el periodo {resumen.periodo} se evaluaron un total de <strong className="text-white">{formatNumber(totalEvaluados)}</strong> stakeholders (personas naturales y jurídicas) a través del sistema SAGRILAFT.</p>
              
              <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700/50 mb-4">
                <p className="text-sm font-semibold text-white mb-3">Composición del total evaluado:</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between bg-green-900/30 rounded p-2">
                    <span>Stakeholders Validados:</span>
                    <span className="text-green-400 font-bold">{formatNumber(resumen.total_validados)}</span>
                  </div>
                  <div className="flex items-center justify-center text-gray-400 text-xs">+</div>
                  <div className="flex items-center justify-between bg-red-900/30 rounded p-2">
                    <span>Stakeholders Rechazados:</span>
                    <span className="text-red-400 font-bold">{formatNumber(resumen.total_rechazados)}</span>
                  </div>
                  <div className="flex items-center justify-center text-gray-400 text-xs">=</div>
                  <div className="flex items-center justify-between bg-slate-700 rounded p-2 border-2 border-blue-500">
                    <span className="font-bold text-white">Total Evaluados:</span>
                    <span className="text-blue-400 font-bold text-lg">{formatNumber(totalEvaluados)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-sm mb-2"><strong className="text-white">Proceso de evaluación:</strong></p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Debida diligencia intensificada</li>
                  <li>Plataforma: {resumen.plataforma}</li>
                  <li>Análisis y aceptación de contrapartes</li>
                  <li>Generación de mapa de calor de riesgos</li>
                </ul>
              </div>
            </div>
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Evaluados {resumen.periodo}</span>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">{formatNumber(totalEvaluados)}</div>
          <div className="text-sm text-gray-400 mt-1">Stakeholders evaluados</div>
          <div className="mt-3 pt-3 border-t border-slate-700">
            <div className="text-xs text-gray-500">Plataforma de análisis</div>
            <div className="text-sm font-semibold text-blue-400">{resumen.plataforma}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Stakeholders Validados',
            <div className="text-gray-300">
              <p className="mb-3">De <strong className="text-white">{formatNumber(totalEvaluados)}</strong> stakeholders evaluados, <strong className="text-green-400">{formatNumber(resumen.total_validados)}</strong> fueron validados exitosamente.</p>
              <div className="bg-green-900/30 rounded-lg p-4 border border-green-700/50 mt-4">
                <div className="text-lg font-bold text-green-400 mb-2">94.53% de aprobación</div>
                <p className="text-sm">Estos stakeholders cumplieron con todos los requisitos del sistema SAGRILAFT y pasaron el proceso de debida diligencia intensificada.</p>
              </div>
            </div>
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Stakeholders Validados</span>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white">{formatNumber(resumen.total_validados)}</div>
          <div className="text-sm text-gray-400 mt-1">Aprobados</div>
          <div className="mt-3 pt-3 border-t border-slate-700">
            <div className="text-xs text-gray-500">Tasa de aprobación</div>
            <div className="text-lg font-semibold text-green-400">94.53%</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-red-500/30 hover:border-red-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Análisis de Stakeholders Rechazados',
            <div className="text-gray-300">
              <div className="bg-red-900/30 rounded-lg p-4 border border-red-700/50 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Total rechazados:</span>
                  <span className="text-red-400 font-bold text-2xl">{formatNumber(resumen.total_rechazados)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tasa de rechazo:</span>
                  <span className="text-orange-400 font-bold text-xl">{resumen.porcentaje_rechazo}%</span>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-white mb-3">Distribución por contraparte:</p>
                <div className="space-y-2 text-sm">
                  {stakeholders.map((s, idx) => {
                    const porcentaje = calcularPorcentaje(s.rechazados, totalNoConformes.rechazados);
                    return (
                      <div key={idx} className="flex items-center justify-between">
                        <span>{s.contraparte}:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">{formatNumber(s.rechazados)}</span>
                          <span className="text-gray-400 text-xs">({porcentaje}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700/50">
                <p className="text-sm font-semibold text-white mb-2">Impacto:</p>
                <p className="text-sm">De cada 100 stakeholders evaluados, aproximadamente <strong className="text-red-400">5-6 son rechazados</strong> por no cumplir con los requisitos del sistema SAGRILAFT.</p>
              </div>
            </div>
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Stakeholders Rechazados</span>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-white">{formatNumber(resumen.total_rechazados)}</div>
          <div className="text-sm text-gray-400 mt-1">No conformes</div>
          <div className="mt-3 pt-3 border-t border-slate-700">
            <div className="text-xs text-gray-500">Tasa de rechazo</div>
            <div className="text-lg font-semibold text-red-400">{resumen.porcentaje_rechazo}%</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer"
          onClick={() => openModal(
            'Meta de Mejora - Documentación',
            <div className="text-gray-300">
              <p className="mb-3">Se identificó la necesidad de <strong className="text-white">reducir la documentación inadecuada de 24% a 10%</strong> en un periodo de 6 meses.</p>
              <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-700/50 mt-4">
                <p className="text-sm font-semibold text-white mb-2">Objetivo:</p>
                <p className="text-sm">Actualizar la documentación que afecta directamente al área de SAGRILAFT para reducir notablemente la no conformidad por documentación inadecuada en los procesos de selección de clientes, proveedores y empleados.</p>
              </div>
              <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700/50 mt-3">
                <p className="text-sm font-semibold text-white mb-2">Áreas involucradas:</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Gestión Humana</li>
                  <li>Logística</li>
                  <li>Compras</li>
                  <li>Comercial</li>
                </ul>
              </div>
            </div>
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Meta Documentación</span>
            <Target className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-white">24% → 10%</div>
          <div className="text-sm text-gray-400 mt-1">Reducción objetivo</div>
          <div className="mt-3 pt-3 border-t border-slate-700">
            <div className="text-xs text-gray-500">Plazo de cumplimiento</div>
            <div className="text-sm font-semibold text-orange-400">6 meses</div>
          </div>
        </motion.div>
      </div>

      {/* Gráficos Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rechazados por Contraparte */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Stakeholders Rechazados por Contraparte</h3>
            <button
              onClick={() => openModal(
                'Distribución de Rechazos por Contraparte',
                <div className="text-gray-300">
                  <p className="mb-4">Distribución de los {formatNumber(totalNoConformes.rechazados)} stakeholders rechazados:</p>
                  <div className="space-y-3">
                    {stakeholders.map((s, idx) => {
                      const porcentaje = calcularPorcentaje(s.rechazados, totalNoConformes.rechazados);
                      return (
                        <div key={idx} className="bg-slate-700/50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-semibold">{s.contraparte}</span>
                            <span className="text-red-400 font-bold text-lg">{formatNumber(s.rechazados)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Porcentaje del total rechazados</span>
                            <span className="text-orange-400 font-semibold">{porcentaje}%</span>
                          </div>
                        </div>
                      );
                    })}
                    <div className="bg-red-900/30 rounded-lg p-3 border-2 border-red-500/50">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold">TOTAL RECHAZADOS</span>
                        <span className="text-red-400 font-bold text-xl">{formatNumber(totalNoConformes.rechazados)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-gray-400">Del total evaluados</span>
                        <span className="text-orange-400 font-semibold">{resumen.porcentaje_rechazo}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Info className="w-5 h-5 text-blue-400" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={rechazadosData} margin={{ left: 20, right: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="contraparte" 
                stroke="#9ca3af" 
                angle={0} 
                textAnchor="middle" 
                interval={0}
                style={{ fontSize: '11px' }}
              />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value, name, props) => {
                  const porcentaje = props.payload.porcentaje;
                  return [
                    `${formatNumber(value)} de ${formatNumber(totalNoConformes.rechazados)} (${porcentaje}%)`,
                    'Rechazados'
                  ];
                }}
              />
              <Bar dataKey="rechazados" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Distribución de Motivos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Motivos de Rechazo</h3>
            <button
              onClick={() => openModal(
                'Motivos de No Conformidad - Tabla Completa',
                <div className="text-gray-300">
                  <div className="mb-4 bg-blue-900/30 rounded-lg p-3 border border-blue-700/50">
                    <p className="text-sm">
                      <strong className="text-white">Total Stakeholders Validados:</strong> {formatNumber(resumen.total_validados)} personas naturales y jurídicas
                    </p>
                  </div>
                  <p className="mb-4">Tabla No. 1: Análisis de Stakeholders No Conformes por SAGRILAFT 2022-2025</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-slate-600">
                          <th className="text-left py-2 px-3 text-white font-bold">Contraparte</th>
                          <th className="text-right py-2 px-3 text-white font-bold">Rechazados</th>
                          <th className="text-right py-2 px-3 text-white font-bold">LA</th>
                          <th className="text-right py-2 px-3 text-white font-bold">FT</th>
                          <th className="text-right py-2 px-3 text-white font-bold">Doc.</th>
                          <th className="text-right py-2 px-3 text-white font-bold">Ant.</th>
                          <th className="text-right py-2 px-3 text-white font-bold">PEPs</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stakeholders.map((row, idx) => {
                          const porcentaje = calcularPorcentaje(row.rechazados, totalNoConformes.rechazados);
                          return (
                            <tr key={idx} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                              <td className="py-2 px-3 text-white font-semibold">{row.contraparte}</td>
                              <td className="py-2 px-3 text-right">
                                <div className="text-red-400 font-bold">{formatNumber(row.rechazados)}</div>
                                <div className="text-orange-400 text-xs">({porcentaje}%)</div>
                              </td>
                              <td className="py-2 px-3 text-right text-red-400">{row.la_pct}%</td>
                              <td className="py-2 px-3 text-right text-orange-400">{row.ft_pct}%</td>
                              <td className="py-2 px-3 text-right text-yellow-400">{row.documentacion_pct}%</td>
                              <td className="py-2 px-3 text-right text-amber-400">{row.antecedentes_pct}%</td>
                              <td className="py-2 px-3 text-right text-purple-400">{row.peps_pct}%</td>
                            </tr>
                          );
                        })}
                        <tr className="border-t-2 border-slate-600 bg-slate-700/50">
                          <td className="py-2 px-3 text-white font-bold">{totalNoConformes.contraparte}</td>
                          <td className="py-2 px-3 text-right">
                            <div className="text-red-400 font-bold">{formatNumber(totalNoConformes.rechazados)}</div>
                            <div className="text-orange-400 text-xs">(100%)</div>
                          </td>
                          <td className="py-2 px-3 text-right text-red-400 font-bold">{totalNoConformes.la_pct}%</td>
                          <td className="py-2 px-3 text-right text-orange-400 font-bold">{totalNoConformes.ft_pct}%</td>
                          <td className="py-2 px-3 text-right text-yellow-400 font-bold">{totalNoConformes.documentacion_pct}%</td>
                          <td className="py-2 px-3 text-right text-amber-400 font-bold">{totalNoConformes.antecedentes_pct}%</td>
                          <td className="py-2 px-3 text-right text-purple-400 font-bold">{totalNoConformes.peps_pct}%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-xs space-y-1 bg-slate-700/50 rounded-lg p-3">
                    <p><strong className="text-white">LA:</strong> Lavado de Activos</p>
                    <p><strong className="text-white">FT:</strong> Financiación del Terrorismo</p>
                    <p><strong className="text-white">Doc.:</strong> Documentación Inadecuada</p>
                    <p><strong className="text-white">Ant.:</strong> Antecedentes</p>
                    <p><strong className="text-white">PEPs:</strong> Personas Expuestas Políticamente</p>
                  </div>
                </div>
              )}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Info className="w-5 h-5 text-blue-400" />
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={motivosData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label={false}
                >
                  {motivosData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value, name) => [`${value}%`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {motivosData.map((m, idx) => {
                const cantidad = Math.round(resumen.total_rechazados * m.value / 100);
                return (
                  <div key={idx} className="flex items-center justify-between text-sm bg-slate-700/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: m.color }}></div>
                      <span className="text-gray-300 truncate">{m.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                      <span className="font-bold text-white">{formatNumber(cantidad)}</span>
                      <span className="font-bold" style={{ color: m.color }}>({m.value}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Acciones por Área */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-green-400" />
          Acciones Implementadas por Área
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hallazgos.map((h, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * idx }}
              className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-lg p-4 border border-slate-600 hover:border-blue-500 transition-all cursor-pointer"
              onClick={() => openModal(
                `${h.area} - Acción Implementada`,
                <div className="text-gray-300">
                  <div className="bg-red-900/30 rounded-lg p-4 border border-red-700/50 mb-4">
                    <p className="text-sm font-semibold text-white mb-2">Hallazgo identificado:</p>
                    <p className="text-sm">{h.hallazgo}</p>
                    <div className="mt-2">
                      <span className="text-xs bg-red-500/30 text-red-400 px-2 py-1 rounded font-bold">{h.porcentaje}% de no conformidad</span>
                    </div>
                  </div>
                  <div className="bg-green-900/30 rounded-lg p-4 border border-green-700/50 mb-4">
                    <p className="text-sm font-semibold text-white mb-2">Acción implementada:</p>
                    <p className="text-sm">{h.accion}</p>
                  </div>
                  {h.fecha_reunion && (
                    <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700/50 mb-4">
                      <p className="text-sm font-semibold text-white mb-2">Fecha de reunión:</p>
                      <p className="text-sm">{h.fecha_reunion}</p>
                    </div>
                  )}
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-white mb-2">Responsable:</p>
                    <p className="text-sm">{h.responsable}</p>
                  </div>
                </div>
              )}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-900/50 rounded-lg flex-shrink-0">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white mb-1">{h.area}</h4>
                  <p className="text-sm text-gray-300 mb-2">{h.hallazgo}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">{h.porcentaje}%</span>
                    {h.fecha_reunion && <span className="text-xs text-gray-400">{h.fecha_reunion}</span>}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Marco Normativo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <h3 className="text-xl font-bold text-white mb-4">Marco Normativo y Plataforma</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 rounded-xl p-4 border border-cyan-700/50 cursor-pointer hover:border-cyan-500 transition-all"
            onClick={() => openModal(
              'Plataforma DATALAFT',
              <div className="text-gray-300">
                <p className="mb-3">Sistema de evaluación y gestión de riesgos SAGRILAFT:</p>
                <div className="bg-cyan-900/30 rounded-lg p-4 border border-cyan-700/50 mb-3">
                  <p className="text-sm font-semibold text-white mb-2">Plataforma:</p>
                  <p className="text-sm">{resumen.plataforma}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-white mb-2">Funciones principales:</p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Análisis y aceptación de contrapartes</li>
                    <li>Generación de mapa de calor para stakeholders</li>
                    <li>Proceso de debida diligencia intensificada</li>
                  </ul>
                </div>
              </div>
            )}
          >
            <Shield className="w-8 h-8 text-cyan-400 mb-3" />
            <div className="text-cyan-400 font-semibold mb-2">Plataforma</div>
            <div className="text-white text-sm">{resumen.plataforma}</div>
          </div>
          <div 
            className="bg-gradient-to-br from-indigo-900/40 to-indigo-800/20 rounded-xl p-4 border border-indigo-700/50 cursor-pointer hover:border-indigo-500 transition-all"
            onClick={() => openModal(
              'Marco Normativo',
              <div className="text-gray-300">
                <p className="mb-3">Normatividad aplicable según la Superintendencia de Sociedades:</p>
                <div className="space-y-2 mb-4">
                  {resumen.normatividad.map((norma, idx) => (
                    <div key={idx} className="bg-indigo-900/30 rounded-lg p-3 border border-indigo-700/50">
                      <p className="text-sm font-semibold text-white">{norma}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-white mb-2">Enfoque:</p>
                  <p className="text-sm">Basado en riesgos para identificación, segmentación, calificación y control de los riesgos asociados a lavado de activos y financiación del terrorismo.</p>
                </div>
              </div>
            )}
          >
            <FileCheck className="w-8 h-8 text-indigo-400 mb-3" />
            <div className="text-indigo-400 font-semibold mb-2">Normatividad</div>
            <div className="text-white text-xs space-y-1">
              {resumen.normatividad.map((norma, idx) => (
                <div key={idx}>• {norma}</div>
              ))}
            </div>
          </div>
          <div 
            className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 rounded-xl p-4 border border-emerald-700/50 cursor-pointer hover:border-emerald-500 transition-all"
            onClick={() => openModal(
              'Enfoque del Sistema',
              <div className="text-gray-300">
                <div className="bg-emerald-900/30 rounded-lg p-4 border border-emerald-700/50 mb-3">
                  <p className="text-sm font-semibold text-white mb-2">Enfoque Basado en Riesgos:</p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Identificación de riesgos</li>
                    <li>Segmentación de contrapartes</li>
                    <li>Calificación de riesgos</li>
                    <li>Control y monitoreo continuo</li>
                  </ul>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-white mb-2">Debida Diligencia Intensificada:</p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Evaluación de beneficiario final</li>
                    <li>Identificación de PEPs</li>
                    <li>Análisis de antecedentes</li>
                    <li>Validación documental</li>
                  </ul>
                </div>
              </div>
            )}
          >
            <CheckCircle className="w-8 h-8 text-emerald-400 mb-3" />
            <div className="text-emerald-400 font-semibold mb-2">Enfoque</div>
            <div className="text-white text-sm">Basado en Riesgos y Debida Diligencia Intensificada</div>
          </div>
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
              className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full border-4 border-red-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-red-400" />
                  <h3 className="text-xl font-bold text-white">{modalContent.title}</h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-gray-300 leading-relaxed">
                {modalContent.content}
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
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