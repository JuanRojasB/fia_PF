import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';
import CollapsibleChart from '../CollapsibleChart';
import { Users, TrendingUp, UserMinus, UserPlus, Clock, DollarSign, X, Info, ArrowUp, ArrowDown } from 'lucide-react';

export default function HumanaDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  };

  if (!data || !data.kpis) {
    return <div className="text-gray-600">No hay datos disponibles</div>;
  }

  const { kpis, costos, rotacion } = data;

  // Formato COP completo: $1.234.567.890
  const formatCOP = (value) => {
    if (!value || isNaN(value)) return '$0';
    return '$ ' + new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parseFloat(value));
  };


  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO').format(value);
  };

  const nominaData = costos.map(c => ({
    anio: c.anio,
    nomina: parseFloat(c.costo_nomina_total_pesos) / 1_000_000,
    horasExtras: parseFloat(c.costo_horas_extras_pesos) / 1_000_000
  }));

  const rotacionData = rotacion.map(r => ({
    anio: r.anio,
    ingresos: r.ingresos_personas,
    retiros: r.retiros_personas
  }));

  const r2025 = rotacionData[0] || {};
  const r2024 = rotacionData[1] || {};

  return (
    <div className="space-y-6">
      {/* Descripción */}
      <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-xl p-6 border border-cyan-300">
        <p className="text-gray-700">Análisis consolidado de la planta de personal, costos de nómina y rotación de colaboradores. El crecimiento moderado responde a la necesidad de fortalecer áreas estratégicas y garantizar la sostenibilidad de la operación.</p>
      </div>

      {/* KPIs Principales — fila 1 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Planta de Personal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal('Planta de Personal 2025 vs 2024',
            <div className="space-y-3">
              <p>La planta cerró 2025 con <strong>{formatNumber(kpis.personal2025)} colaboradores</strong>, frente a {formatNumber(kpis.personal2024)} en 2024.</p>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-sm font-semibold text-blue-800 mb-1">Variación: {kpis.variacionPersonal >= 0 ? '+' : ''}{kpis.variacionPersonal}% ({kpis.personal2025 - kpis.personal2024 >= 0 ? '+' : ''}{kpis.personal2025 - kpis.personal2024} personas)</p>
                <p className="text-sm text-gray-700">El crecimiento moderado responde al fortalecimiento de áreas estratégicas y la cobertura de requerimientos operativos específicos en las tres sedes, sin comprometer la eficiencia del gasto en nómina.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <p className="text-sm font-semibold text-purple-800 mb-1">Contexto:</p>
                <p className="text-sm text-gray-700">Los nuevos ingresos responden al fortalecimiento de áreas estratégicas y la cobertura de requerimientos operativos específicos. El saldo neto 2025 fue de {kpis.ingresos2025 - kpis.retiros2025 >= 0 ? '+' : ''}{formatNumber(kpis.ingresos2025 - kpis.retiros2025)} personas (Ingresos: {formatNumber(kpis.ingresos2025)} - Retiros: {formatNumber(kpis.retiros2025)}).</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600 text-xs font-medium uppercase tracking-wide">Planta de Personal</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-4xl font-bold text-gray-900 leading-tight mb-1">{formatNumber(kpis.personal2025)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{formatNumber(kpis.personal2024)}</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{formatNumber(kpis.personal2025)}</span></div>
            <div className={`text-sm font-bold ${kpis.variacionPersonal >= 0 ? 'text-green-600' : 'text-red-600'}`}>Var: {kpis.variacionPersonal >= 0 ? '+' : ''}{kpis.variacionPersonal}%</div>
          </div>
        </motion.div>

        {/* Costo Nómina */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onClick={() => openModal('Costo Total de Nómina 2025 vs 2024',
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
                  <div className="text-xs text-gray-500 mb-1">2024</div>
                  <div className="text-lg font-bold text-gray-900">{formatCOP(kpis.nomina2024)}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border border-green-200 text-center">
                  <div className="text-xs text-gray-500 mb-1">2025</div>
                  <div className="text-lg font-bold text-gray-900">{formatCOP(kpis.nomina2025)}</div>
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                <p className="text-sm font-semibold text-orange-800 mb-1">Incremento: {kpis.variacionNomina >= 0 ? '+' : ''}{kpis.variacionNomina}%</p>
                <p className="text-sm text-gray-700">Diferencia: <strong>{formatCOP(parseFloat(kpis.nomina2025) - parseFloat(kpis.nomina2024))}</strong></p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-sm font-semibold text-blue-800 mb-1">¿Por qué aumentó?</p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Pago efectivo de horas diurnas antes compensadas con tiempo</li>
                  <li>Reconocimiento de primas de antigüedad y beneficios laborales</li>
                  <li>Ajustes para reflejar el costo real de la operación</li>
                  <li>Cumplimiento de obligaciones laborales vigentes</li>
                </ul>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600 text-xs font-medium uppercase tracking-wide">Costo Nómina Total</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-xl font-bold text-gray-900 leading-tight mb-1 break-all">{formatCOP(kpis.nomina2025)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{formatCOP(kpis.nomina2024)}</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{formatCOP(kpis.nomina2025)}</span></div>
            <div className={`text-sm font-bold ${kpis.variacionNomina >= 0 ? 'text-red-600' : 'text-green-600'}`}>Var: {kpis.variacionNomina >= 0 ? '+' : ''}{kpis.variacionNomina}%</div>
          </div>
        </motion.div>

        {/* Retiros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          onClick={() => openModal('Retiros de Personal 2025 vs 2024',
            <div className="space-y-3">
              <p>En 2025 se registraron <strong>{formatNumber(kpis.retiros2025)} retiros</strong>, frente a {formatNumber(kpis.retiros2024)} en 2024 ({kpis.variacionRetiros >= 0 ? '+' : ''}{kpis.variacionRetiros}%).</p>
              <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                <p className="text-sm font-semibold text-red-800 mb-1">Contexto</p>
                <p className="text-sm text-gray-700">El incremento en retiros es consistente con el mayor volumen de ingresos, reflejando una dinámica activa de renovación de personal. La renuncia voluntaria representa el <strong>83.81%</strong> de los retiros, lo que indica que la mayoría de las salidas son decisiones del colaborador.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-sm text-gray-600">Ver el dashboard de <strong>Causas de Desvinculación</strong> para el detalle completo por motivo de retiro.</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-red-500/30 hover:border-red-500 transition-all cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600 text-xs font-medium uppercase tracking-wide">Retiros de Personal</span>
            <UserMinus className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-4xl font-bold text-gray-900 leading-tight mb-1">{formatNumber(kpis.retiros2025)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{formatNumber(kpis.retiros2024)}</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{formatNumber(kpis.retiros2025)}</span></div>
            <div className={`text-sm font-bold ${kpis.variacionRetiros >= 0 ? 'text-red-600' : 'text-green-600'}`}>Var: {kpis.variacionRetiros >= 0 ? '+' : ''}{kpis.variacionRetiros}%</div>
          </div>
        </motion.div>

        {/* Ingresos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          onClick={() => openModal('Ingresos de Personal 2025 vs 2024',
            <div className="space-y-3">
              <p>En 2025 ingresaron <strong>{formatNumber(kpis.ingresos2025)} colaboradores</strong>, frente a {formatNumber(kpis.ingresos2024)} en 2024 ({kpis.variacionIngresos >= 0 ? '+' : ''}{kpis.variacionIngresos}%).</p>
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <p className="text-sm font-semibold text-purple-800 mb-1">Saldo neto 2025</p>
                <p className="text-sm text-gray-700">
                  Ingresos ({formatNumber(kpis.ingresos2025)}) − Retiros ({formatNumber(kpis.retiros2025)}) = <strong className={kpis.ingresos2025 - kpis.retiros2025 >= 0 ? 'text-green-700' : 'text-red-700'}>{kpis.ingresos2025 - kpis.retiros2025 >= 0 ? '+' : ''}{formatNumber(kpis.ingresos2025 - kpis.retiros2025)} personas</strong>
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-sm text-gray-700">Los nuevos ingresos responden al fortalecimiento de áreas estratégicas y la cobertura de requerimientos operativos específicos en las tres sedes.</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600 text-xs font-medium uppercase tracking-wide">Ingresos de Personal</span>
            <UserPlus className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-4xl font-bold text-gray-900 leading-tight mb-1">{formatNumber(kpis.ingresos2025)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{formatNumber(kpis.ingresos2024)}</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{formatNumber(kpis.ingresos2025)}</span></div>
            <div className={`text-sm font-bold ${kpis.variacionIngresos >= 0 ? 'text-green-600' : 'text-red-600'}`}>Var: {kpis.variacionIngresos >= 0 ? '+' : ''}{kpis.variacionIngresos}%</div>
          </div>
        </motion.div>
      </div>

      {/* KPIs Horas Extras — fila 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Horas Extras Cantidad */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          onClick={() => openModal('Horas Extras 2025 vs 2024',
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
                  <div className="text-xs text-gray-500 mb-1">2024</div>
                  <div className="text-xl font-bold text-gray-900">{formatNumber(kpis.horas2024)} hrs</div>
                </div>
                <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-200 text-center">
                  <div className="text-xs text-gray-500 mb-1">2025</div>
                  <div className="text-xl font-bold text-gray-900">{formatNumber(kpis.horas2025)} hrs</div>
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                <p className="text-sm font-semibold text-orange-800 mb-1">Variación: {kpis.variacionHoras >= 0 ? '+' : ''}{kpis.variacionHoras}%</p>
                <p className="text-sm text-gray-700">El incremento en horas extras refleja la mayor demanda operativa, especialmente en Sede 2 y Sede 3 por el crecimiento en ventas.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-sm font-semibold text-blue-800 mb-1">Costo por hora extra</p>
                <p className="text-sm text-gray-700">
                  2024: {formatCOP(kpis.valorHoras2024 / (kpis.horas2024 || 1))} / hora<br/>
                  2025: {formatCOP(kpis.valorHoras2025 / (kpis.horas2025 || 1))} / hora
                </p>
                <p className="text-xs text-gray-500 mt-1">El mayor costo por hora está asociado a la reforma laboral y reducción de la jornada.</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-cyan-500/30 hover:border-cyan-500 transition-all cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600 text-xs font-medium uppercase tracking-wide">Horas Extras</span>
            <Clock className="w-5 h-5 text-cyan-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 leading-tight mb-1">{formatNumber(kpis.horas2025)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{formatNumber(kpis.horas2024)} hrs</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{formatNumber(kpis.horas2025)} hrs</span></div>
            <div className={`text-sm font-bold ${kpis.variacionHoras >= 0 ? 'text-red-600' : 'text-green-600'}`}>Var: {kpis.variacionHoras >= 0 ? '+' : ''}{kpis.variacionHoras}%</div>
          </div>
        </motion.div>

        {/* Costo Horas Extras */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          onClick={() => openModal('Costo de Horas Extras 2025 vs 2024',
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
                  <div className="text-xs text-gray-500 mb-1">2024</div>
                  <div className="text-lg font-bold text-gray-900">{formatCOP(kpis.valorHoras2024)}</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-200 text-center">
                  <div className="text-xs text-gray-500 mb-1">2025</div>
                  <div className="text-lg font-bold text-gray-900">{formatCOP(kpis.valorHoras2025)}</div>
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                <p className="text-sm font-semibold text-red-800 mb-1">Incremento: {kpis.variacionValorHoras >= 0 ? '+' : ''}{kpis.variacionValorHoras}%</p>
                <p className="text-sm text-gray-700">Diferencia: <strong>{formatCOP(parseFloat(kpis.valorHoras2025) - parseFloat(kpis.valorHoras2024))}</strong></p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <p className="text-sm font-semibold text-yellow-800 mb-1">Nota importante</p>
                <p className="text-sm text-gray-700">El costo creció más que las horas ({kpis.variacionValorHoras}% vs {kpis.variacionHoras}%), lo que indica un mayor costo promedio por hora asociado a la <strong>reforma laboral</strong> y la reducción de la jornada laboral.</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600 text-xs font-medium uppercase tracking-wide">Costo Horas Extras</span>
            <DollarSign className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-xl font-bold text-gray-900 leading-tight mb-1 break-all">{formatCOP(kpis.valorHoras2025)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{formatCOP(kpis.valorHoras2024)}</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{formatCOP(kpis.valorHoras2025)}</span></div>
            <div className={`text-sm font-bold ${kpis.variacionValorHoras >= 0 ? 'text-red-600' : 'text-green-600'}`}>Var: {kpis.variacionValorHoras >= 0 ? '+' : ''}{kpis.variacionValorHoras}%</div>
          </div>
        </motion.div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Evolución de Nómina */}
        <CollapsibleChart title="Evolución de Costos de Nómina" defaultOpen={false}>
          <div className="flex items-center justify-between mb-2">
            <div></div>
            <button
              onClick={() => openModal('Evolución de Nómina 2024 vs 2025',
                <div className="space-y-3">
                  <p>Comparación de costos de nómina y horas extras entre 2024 y 2025.</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <p className="text-xs text-gray-500 mb-1">Nómina 2024</p>
                      <p className="font-bold text-gray-900">{formatCOP(kpis.nomina2024)}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <p className="text-xs text-gray-500 mb-1">Nómina 2025</p>
                      <p className="font-bold text-gray-900">{formatCOP(kpis.nomina2025)}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                      <p className="text-xs text-gray-500 mb-1">H. Extras 2024</p>
                      <p className="font-bold text-gray-900">{formatCOP(kpis.valorHoras2024)}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                      <p className="text-xs text-gray-500 mb-1">H. Extras 2025</p>
                      <p className="font-bold text-gray-900">{formatCOP(kpis.valorHoras2025)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">El incremento del {kpis.variacionNomina}% en nómina y {kpis.variacionValorHoras}% en horas extras refleja ajustes salariales, reconocimiento de beneficios y cumplimiento de obligaciones laborales.</p>
                </div>
              )}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Info className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-4">Valores en millones de pesos COP</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={nominaData} margin={{ left: 30, right: 20, top: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="anio" stroke="#9ca3af" />
              <YAxis
                stroke="#9ca3af"
                width={80}
                tickFormatter={(v) => `$${v.toLocaleString('es-CO')}M`}
              />
              <Tooltip
                formatter={(value, name) => [
                  `${formatCOP(value * 1_000_000)}`,
                  name
                ]}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="nomina" fill="#10b981" name="Nómina Total" radius={[8, 8, 0, 0]}>
                <LabelList dataKey="anio" position="top" style={{ fontSize: '11px', fontWeight: 'bold', fill: '#374151' }} />
              </Bar>
              <Bar dataKey="horasExtras" fill="#f59e0b" name="Horas Extras" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CollapsibleChart>

        {/* Rotación de Personal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-300"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Rotación de Personal 2024 vs 2025</h3>
            <button
              onClick={() => openModal('Rotación de Personal',
                <div className="space-y-3">
                  <p>Comparación de ingresos y retiros de personal entre 2024 y 2025.</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200 text-center">
                      <p className="text-xs text-gray-500">Ingresos 2024 → 2025</p>
                      <p className="text-lg font-bold text-gray-900">{formatNumber(kpis.ingresos2024)} → {formatNumber(kpis.ingresos2025)}</p>
                      <p className="text-xs text-green-600 font-semibold">{kpis.variacionIngresos >= 0 ? '+' : ''}{kpis.variacionIngresos}%</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 border border-red-200 text-center">
                      <p className="text-xs text-gray-500">Retiros 2024 → 2025</p>
                      <p className="text-lg font-bold text-gray-900">{formatNumber(kpis.retiros2024)} → {formatNumber(kpis.retiros2025)}</p>
                      <p className="text-xs text-orange-600 font-semibold">{kpis.variacionRetiros >= 0 ? '+' : ''}{kpis.variacionRetiros}%</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">El incremento en ambos indicadores refleja una dinámica activa de renovación de personal, con saldo neto positivo en 2025.</p>
                </div>
              )}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Info className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[{ label: '2024', data: r2024, color: 'cyan' }, { label: '2025', data: r2025, color: 'orange' }].map(({ label, data: rd, color }) => (
              <div key={label} className="space-y-3">
                <div className="text-center">
                  <h4 className={`text-lg font-bold text-${color}-600`}>{label}</h4>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-500/30 h-[90px]">
                  <div className="flex items-center justify-between h-full">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Ingresos</div>
                      <div className="text-2xl font-bold text-gray-900">{formatNumber(rd.ingresos || 0)}</div>
                    </div>
                    <UserPlus className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border-2 border-red-500/30 h-[90px]">
                  <div className="flex items-center justify-between h-full">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Retiros</div>
                      <div className="text-2xl font-bold text-gray-900">{formatNumber(rd.retiros || 0)}</div>
                    </div>
                    <UserMinus className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-3 border border-gray-300 text-center h-[70px] flex flex-col justify-center">
                  <div className="text-xs text-gray-600 mb-1">Saldo Neto</div>
                  <div className={`text-xl font-bold ${((rd.ingresos || 0) - (rd.retiros || 0)) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {((rd.ingresos || 0) - (rd.retiros || 0)) >= 0 ? '+' : ''}{formatNumber((rd.ingresos || 0) - (rd.retiros || 0))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      {createPortal(
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-blue-500 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-cyan-600" />
                  <h3 className="text-xl font-bold text-gray-900">{modalContent.title}</h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-gray-600 hover:text-gray-900 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 pr-2 text-gray-700 leading-relaxed">{modalContent.content}</div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
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
