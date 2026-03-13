import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { Users, TrendingUp, UserMinus, UserPlus, Clock, DollarSign, X, Info, ArrowUp, ArrowDown } from 'lucide-react';

export default function HumanaDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  if (!data || !data.kpis) {
    return <div className="text-gray-600">No hay datos disponibles</div>;
  }

  const { kpis, costos, rotacion } = data;

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return '$0';
    const millions = parseFloat(value) / 1000000;
    return `$${millions.toFixed(0)}M`;
  };

  const formatCurrencyFull = (value) => {
    if (!value || isNaN(value)) return '$0';
    return '$' + new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parseFloat(value));
  };

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO').format(value);
  };

  // Datos para gráfico de evolución de nómina
  const nominaData = costos.map(c => ({
    anio: c.anio,
    nomina: parseFloat(c.costo_nomina_total_pesos) / 1000000,
    horasExtras: parseFloat(c.costo_horas_extras_pesos) / 1000000
  }));

  // Datos para gráfico de rotación
  const rotacionData = rotacion.map(r => ({
    anio: r.anio,
    ingresos: r.ingresos_personas,
    retiros: r.retiros_personas
  }));

  return (
    <div className="space-y-6">
      {/* Descripción */}
      <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-xl p-6 border border-cyan-300">
        <p className="text-gray-700">Análisis consolidado de la planta de personal, costos de nómina y rotación de colaboradores, reflejando el crecimiento moderado para fortalecer áreas estratégicas y garantizar la sostenibilidad de la operación.</p>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal('Planta de Personal', `La planta cerró con ${kpis.personal2025} personas, un incremento del ${kpis.variacionPersonal}% (+${kpis.personal2025 - kpis.personal2024} colaboradores) respecto a diciembre de 2024. Este crecimiento moderado responde a la necesidad de fortalecer áreas estratégicas y cubrir requerimientos operativos específicos, garantizando la sostenibilidad de la operación.`)}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Colaboradores</span>
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">{formatNumber(kpis.personal2025)}</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-600">2024: {formatNumber(kpis.personal2024)}</span>
            <span className={`flex items-center ${kpis.variacionPersonal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {kpis.variacionPersonal >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {Math.abs(kpis.variacionPersonal)}%
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal('Costo de Nómina', `El costo total de la nómina pasó de ${formatCurrencyFull(kpis.nomina2024)} en 2024 a ${formatCurrencyFull(kpis.nomina2025)} en 2025, con una variación del ${kpis.variacionNomina}% (+${formatCurrencyFull(parseFloat(kpis.nomina2025) - parseFloat(kpis.nomina2024))}). El aumento obedece principalmente a: Pago efectivo de horas diurnas antes compensadas con tiempo, reconocimiento de primas de antigüedad y otros beneficios laborales, y ajustes necesarios para reflejar el costo real de la operación y cumplir obligaciones laborales.`)}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Costo Nómina</span>
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(kpis.nomina2025)}</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-600">2024: {formatCurrency(kpis.nomina2024)}</span>
            <span className={`flex items-center ${kpis.variacionNomina >= 0 ? 'text-orange-600' : 'text-green-600'}`}>
              {kpis.variacionNomina >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {Math.abs(kpis.variacionNomina)}%
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal('Retiros', `Los retiros pasaron de ${kpis.retiros2024} a ${kpis.retiros2025} (+${kpis.variacionRetiros}%). En 2025 se registraron ${kpis.totalRetiros2025} retiros. Ver dashboard de Causas de Desvinculación para más detalles.`)}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-red-500/30 hover:border-red-500 transition-all cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Retiros</span>
            <UserMinus className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">{formatNumber(kpis.retiros2025)}</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-600">2024: {formatNumber(kpis.retiros2024)}</span>
            <span className={`flex items-center ${kpis.variacionRetiros >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {kpis.variacionRetiros >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {Math.abs(kpis.variacionRetiros)}%
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal('Ingresos', `Los ingresos pasaron de ${kpis.ingresos2024} a ${kpis.ingresos2025} (+${kpis.variacionIngresos}%). Nuevos colaboradores contratados para fortalecer áreas estratégicas y cubrir requerimientos operativos específicos.`)}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Ingresos</span>
            <UserPlus className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">{formatNumber(kpis.ingresos2025)}</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-600">2024: {formatNumber(kpis.ingresos2024)}</span>
            <span className={`flex items-center ${kpis.variacionIngresos >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {kpis.variacionIngresos >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {Math.abs(kpis.variacionIngresos)}%
            </span>
          </div>
        </motion.div>
      </div>

      {/* KPIs de Horas Extras */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => openModal('Horas Extras', `Las horas extras crecieron de ${formatNumber(kpis.horas2024)} a ${formatNumber(kpis.horas2025)} (+${kpis.variacionHoras}%), mientras que el costo aumentó de ${formatCurrencyFull(kpis.valorHoras2024)} a ${formatCurrencyFull(kpis.valorHoras2025)} (+${kpis.variacionValorHoras}%). La diferencia se explica por un mayor costo promedio por hora, asociado a la reforma laboral y reducción de la jornada.`)}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-cyan-500/30 hover:border-cyan-500 transition-all cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Horas Extras</span>
            <Clock className="w-6 h-6 text-cyan-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatNumber(kpis.horas2025)}</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-600">2024: {formatNumber(kpis.horas2024)}</span>
            <span className={`flex items-center ${kpis.variacionHoras >= 0 ? 'text-orange-600' : 'text-green-600'}`}>
              {kpis.variacionHoras >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {Math.abs(kpis.variacionHoras)}%
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => openModal('Costo Horas Extras', `El costo aumentó de ${formatCurrencyFull(kpis.valorHoras2024)} a ${formatCurrencyFull(kpis.valorHoras2025)} (+${kpis.variacionValorHoras}%). Mayor costo promedio por hora asociado a la reforma laboral.`)}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Costo Horas Extras</span>
            <DollarSign className="w-6 h-6 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(kpis.valorHoras2025)}</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-600">2024: {formatCurrency(kpis.valorHoras2024)}</span>
            <span className={`flex items-center ${kpis.variacionValorHoras >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {kpis.variacionValorHoras >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {Math.abs(kpis.variacionValorHoras)}%
            </span>
          </div>
        </motion.div>
      </div>

      {/* Gráficos de Análisis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolución de Nómina */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Evolución de Costos de Nómina</h3>
            <button
              onClick={() => openModal('Evolución de Nómina', 'Comparación de costos de nómina y horas extras entre 2024 y 2025. El incremento del 14.70% en nómina y 20.73% en horas extras refleja ajustes salariales, reconocimiento de beneficios y cumplimiento de obligaciones laborales.')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Info className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={nominaData} margin={{ left: 30, right: 20, top: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="anio" stroke="#9ca3af" />
              <YAxis 
                stroke="#9ca3af"
                width={100}
                tickFormatter={(value) => `$${value.toLocaleString('es-CO')}`}
              />
              <Tooltip
                contentStyle={{ backgroundcolor: '#1f2937', border: '2px solid #3b82f6', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
                formatter={(value, name) => {
                  const fullValue = value * 1000000;
                  return [`$${fullValue.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, name];
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="nomina" fill="#10b981" name="Nómina Total" radius={[8, 8, 0, 0]} />
              <Bar dataKey="horasExtras" fill="#f59e0b" name="Horas Extras" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Rotación de Personal - Tabla Comparativa */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-300"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Rotación de Personal</h3>
            <button
              onClick={() => openModal('Rotación', 'Los ingresos pasaron de 532 a 564 (+6.02%) y los retiros de 534 a 562 (+5.24%). El incremento en ambos indicadores refleja una dinámica activa de renovación de personal.')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Info className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 2024 */}
            <div className="space-y-3">
              <div className="text-center">
                <h4 className="text-lg font-bold text-cyan-600">2024</h4>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-500/30 h-[90px]">
                <div className="flex items-center justify-between h-full">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Ingresos</div>
                    <div className="text-2xl font-bold text-gray-900">{formatNumber(rotacionData[1]?.ingresos || 0)}</div>
                  </div>
                  <UserPlus className="w-6 h-6 text-purple-600" />
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4 border-2 border-red-500/30 h-[90px]">
                <div className="flex items-center justify-between h-full">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Retiros</div>
                    <div className="text-2xl font-bold text-gray-900">{formatNumber(rotacionData[1]?.retiros || 0)}</div>
                  </div>
                  <UserMinus className="w-6 h-6 text-red-600" />
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-3 border border-gray-300 text-center h-[70px] flex flex-col justify-center">
                <div className="text-xs text-gray-600 mb-1">Saldo Neto</div>
                <div className={`text-xl font-bold ${(rotacionData[1]?.ingresos - rotacionData[1]?.retiros) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(rotacionData[1]?.ingresos - rotacionData[1]?.retiros) >= 0 ? '+' : ''}{formatNumber((rotacionData[1]?.ingresos || 0) - (rotacionData[1]?.retiros || 0))}
                </div>
              </div>
            </div>

            {/* 2025 */}
            <div className="space-y-3">
              <div className="text-center">
                <h4 className="text-lg font-bold text-orange-600">2025</h4>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-500/30 h-[90px]">
                <div className="flex items-center justify-between h-full">
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 mb-1">Ingresos</div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-2xl font-bold text-gray-900">{formatNumber(rotacionData[0]?.ingresos || 0)}</div>
                      <div className="text-xs text-green-600 flex items-center gap-1">
                        <ArrowUp className="w-3 h-3" />
                        +{formatNumber((rotacionData[0]?.ingresos || 0) - (rotacionData[1]?.ingresos || 0))}
                      </div>
                    </div>
                  </div>
                  <UserPlus className="w-6 h-6 text-purple-600" />
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4 border-2 border-red-500/30 h-[90px]">
                <div className="flex items-center justify-between h-full">
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 mb-1">Retiros</div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-2xl font-bold text-gray-900">{formatNumber(rotacionData[0]?.retiros || 0)}</div>
                      <div className="text-xs text-orange-600 flex items-center gap-1">
                        <ArrowUp className="w-3 h-3" />
                        +{formatNumber((rotacionData[0]?.retiros || 0) - (rotacionData[1]?.retiros || 0))}
                      </div>
                    </div>
                  </div>
                  <UserMinus className="w-6 h-6 text-red-600" />
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-3 border border-gray-300 text-center h-[70px] flex flex-col justify-center">
                <div className="text-xs text-gray-600 mb-1">Saldo Neto</div>
                <div className={`text-xl font-bold ${(rotacionData[0]?.ingresos - rotacionData[0]?.retiros) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(rotacionData[0]?.ingresos - rotacionData[0]?.retiros) >= 0 ? '+' : ''}{formatNumber((rotacionData[0]?.ingresos || 0) - (rotacionData[0]?.retiros || 0))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

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
              className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-cyan-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-cyan-600" />
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
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
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

