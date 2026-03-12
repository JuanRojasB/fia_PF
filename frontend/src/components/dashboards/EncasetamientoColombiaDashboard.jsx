import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

export default function EncasetamientoColombiaDashboard() {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [viewMode, setViewMode] = useState('general'); // 'general', 'por-año', 'por-mes', 'comparacion'
  const [compareYears, setCompareYears] = useState([2024, 2025]);

  // Datos de Encasetamiento Pollito 2020-2025 (millones de aves)
  const encasetamientoData = [
    { mes: 'Enero', 2020: 73.562888, 2021: 67.177991, 2022: 73.814052, 2023: 77.780694, 2024: 76.570535, 2025: 81.468535 },
    { mes: 'Febrero', 2020: 65.151532, 2021: 63.691276, 2022: 68.281496, 2023: 67.768356, 2024: 71.155094, 2025: 73.456151 },
    { mes: 'Marzo', 2020: 68.425009, 2021: 73.968776, 2022: 76.313153, 2023: 75.103872, 2024: 73.537564, 2025: 77.721409 },
    { mes: 'Abril', 2020: 51.700998, 2021: 72.385209, 2022: 74.444922, 2023: 66.963648, 2024: 76.996233, 2025: 79.950675 },
    { mes: 'Mayo', 2020: 49.907000, 2021: 60.846094, 2022: 78.773148, 2023: 73.497077, 2024: 78.696556, 2025: 81.060166 },
    { mes: 'Junio', 2020: 62.715400, 2021: 65.832403, 2022: 73.988602, 2023: 76.035025, 2024: 72.097334, 2025: 76.063317 },
    { mes: 'Julio', 2020: 71.248323, 2021: 72.504945, 2022: 77.755554, 2023: 75.228863, 2024: 77.151480, 2025: 82.034723 },
    { mes: 'Agosto', 2020: 70.922275, 2021: 73.586423, 2022: 79.446614, 2023: 81.311122, 2024: 77.028631, 2025: 79.901057 },
    { mes: 'Septiembre', 2020: 71.152570, 2021: 73.806860, 2022: 79.859780, 2023: 77.119645, 2024: 74.706219, 2025: 83.531101 },
    { mes: 'Octubre', 2020: 74.531194, 2021: 75.653586, 2022: 79.011016, 2023: 81.726509, 2024: 80.406617, 2025: 87.041058 },
    { mes: 'Noviembre', 2020: 68.043264, 2021: 76.920167, 2022: 77.439680, 2023: 76.813697, 2024: 76.793286, 2025: 80.544846 },
    { mes: 'Diciembre', 2020: 66.082593, 2021: 73.135987, 2022: 75.664394, 2023: 71.740785, 2024: 75.402893, 2025: 80.299750 }
  ];

  const totalesEncasetamiento = {
    2020: 793.443046,
    2021: 853.799717,
    2022: 909.734421,
    2023: 901.483713,
    2024: 911.542442,
    2025: 963.372787
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-violet-600/20 via-purple-600/20 to-fuchsia-600/20 backdrop-blur-xl rounded-2xl p-8 lg:p-12 border-2 border-violet-500/30"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-violet-500/20 p-4 rounded-xl">
              <TrendingUp className="w-12 h-12 text-violet-400" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                Encasetamiento en Colombia
              </h1>
              <p className="text-xl text-violet-300">Análisis de Producción Avícola Nacional 2020-2025</p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 lg:p-8 border-2 border-slate-700"
      >
        {/* Texto Introductorio */}
        <div className="mb-6 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
          <p className="text-sm text-gray-300 leading-relaxed">
            El encasetamiento nacional cerró en el 2025 en <span className="font-semibold text-violet-400">963.3 millones</span> mientras que en el 2024 
            cerró con un acumulado de <span className="font-semibold">911.5 millones</span> de aves arrojando un crecimiento 
            del <span className="font-semibold text-green-400">5.6%</span> que en millones de unidades representa <span className="font-semibold text-violet-400">51 millones de aves más</span>. 
            Pollo fiesta encasetó durante el 2025 <span className="font-semibold text-violet-400">32.4 millones de aves</span>, participando 
            el <span className="font-semibold text-green-400">3.3%</span> del encasetamiento nacional.
          </p>
        </div>

        {/* Selector de Vista */}
        <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/30">
          <h4 className="text-lg font-bold text-indigo-300 mb-4 text-center">
            🔍 Selecciona el tipo de análisis
          </h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={() => setViewMode('general')}
              className={`p-4 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                viewMode === 'general'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50'
                  : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700'
              }`}
            >
              📊 Vista General
            </button>
            <button
              onClick={() => setViewMode('por-año')}
              className={`p-4 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                viewMode === 'por-año'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50'
                  : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700'
              }`}
            >
              📅 Por Año
            </button>
            <button
              onClick={() => setViewMode('por-mes')}
              className={`p-4 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                viewMode === 'por-mes'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50'
                  : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700'
              }`}
            >
              📆 Por Mes
            </button>
            <button
              onClick={() => setViewMode('comparacion')}
              className={`p-4 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                viewMode === 'comparacion'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50'
                  : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700'
              }`}
            >
              ⚖️ Comparación
            </button>
          </div>
        </div>

        {/* Vista General */}
        {viewMode === 'general' && (
          <>
        {/* Gráfica de Encasetamiento */}
        <div className="w-full overflow-x-auto mb-6">
          <div style={{ minWidth: '900px', width: '100%', height: '500px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={encasetamientoData} 
                margin={{ bottom: 80, top: 40, left: 80, right: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="mes" 
                  stroke="#94a3b8"
                  tick={{ fontSize: 14 }}
                  angle={0}
                  textAnchor="middle"
                  height={60}
                  interval={0}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  tick={{ fontSize: 17 }}
                  domain={[45, 90]}
                  ticks={[45, 50, 55, 60, 65, 70, 75, 80, 85, 90]}
                  label={{ value: 'Millones de aves', angle: -90, position: 'insideLeft', style: { fontSize: 17, fill: '#94a3b8' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    fontSize: '17px'
                  }}
                  labelStyle={{ color: '#f1f5f9', fontSize: '17px' }}
                  formatter={(value, name) => [`${value.toFixed(2)}M`, name]}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '17px', paddingTop: '20px' }}
                  iconType="line"
                />
                <Line type="monotone" dataKey="2020" stroke="#6b7280" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="2021" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="2022" stroke="#a78bfa" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="2023" stroke="#c4b5fd" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="2024" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="2025" stroke="#8b5cf6" strokeWidth={4} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mb-6">
          Fuente: FONAV - FENAVI
        </p>

        {/* Selector de Mes Interactivo */}
        <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-violet-900/30 to-purple-900/30 border border-violet-500/30">
          <h4 className="text-lg font-bold text-violet-300 mb-4 text-center">
            📊 Análisis por Mes - Selecciona un mes para ver comparativa detallada
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {encasetamientoData.map((item) => (
              <button
                key={item.mes}
                onClick={() => setSelectedMonth(selectedMonth === item.mes ? null : item.mes)}
                className={`p-3 rounded-lg font-semibold text-sm transition-all transform hover:scale-105 ${
                  selectedMonth === item.mes
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/50'
                    : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700'
                }`}
              >
                {item.mes}
              </button>
            ))}
          </div>
          {!selectedMonth && (
            <p className="text-center text-sm text-gray-400 mt-4">
              👆 Haz clic en cualquier mes para ver el análisis comparativo
            </p>
          )}
        </div>

        {/* Análisis del Mes Seleccionado */}
        {selectedMonth && (() => {
          const mesData = encasetamientoData.find(m => m.mes === selectedMonth);
          const calcularCambio = (val1, val2) => ((val2 - val1) / val1 * 100).toFixed(1);
          const calcularDiferencia = (val1, val2) => (val2 - val1).toFixed(2);
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-6 rounded-lg bg-gradient-to-br from-violet-900/40 to-purple-900/40 border-2 border-violet-500/50"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-bold text-violet-300">
                  📅 Análisis de {selectedMonth}
                </h4>
                <button
                  onClick={() => setSelectedMonth(null)}
                  className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-semibold"
                >
                  ✕ Cerrar
                </button>
              </div>

              {/* Valores por Año */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                {[2020, 2021, 2022, 2023, 2024, 2025].map((año) => (
                  <div key={año} className="p-3 rounded-lg bg-slate-800/70 text-center">
                    <p className="text-xs text-gray-400 mb-1">{año}</p>
                    <p className={`text-lg font-bold ${año === 2025 ? 'text-violet-400' : 'text-white'}`}>
                      {mesData[año].toFixed(2)}M
                    </p>
                  </div>
                ))}
              </div>

              {/* Comparativas Año a Año */}
              <div className="space-y-3">
                <h5 className="text-base font-semibold text-white mb-3">Comparativas Interanuales:</h5>
                
                {/* 2024 vs 2025 */}
                <div className="p-3 rounded-lg bg-slate-800/50 border border-violet-500/30">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-sm font-semibold text-violet-300">2024 → 2025</span>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm text-gray-400">
                        {mesData[2024].toFixed(2)}M → {mesData[2025].toFixed(2)}M
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        mesData[2025] > mesData[2024] ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {mesData[2025] > mesData[2024] ? '↑' : '↓'} {calcularCambio(mesData[2024], mesData[2025])}%
                      </span>
                      <span className={`text-sm font-semibold ${
                        mesData[2025] > mesData[2024] ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {mesData[2025] > mesData[2024] ? '+' : ''}{calcularDiferencia(mesData[2024], mesData[2025])}M
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2023 vs 2024 */}
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-600">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-sm font-semibold text-blue-300">2023 → 2024</span>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm text-gray-400">
                        {mesData[2023].toFixed(2)}M → {mesData[2024].toFixed(2)}M
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        mesData[2024] > mesData[2023] ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {mesData[2024] > mesData[2023] ? '↑' : '↓'} {calcularCambio(mesData[2023], mesData[2024])}%
                      </span>
                      <span className={`text-sm font-semibold ${
                        mesData[2024] > mesData[2023] ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {mesData[2024] > mesData[2023] ? '+' : ''}{calcularDiferencia(mesData[2023], mesData[2024])}M
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2022 vs 2023 */}
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-600">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-sm font-semibold text-purple-300">2022 → 2023</span>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm text-gray-400">
                        {mesData[2022].toFixed(2)}M → {mesData[2023].toFixed(2)}M
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        mesData[2023] > mesData[2022] ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {mesData[2023] > mesData[2022] ? '↑' : '↓'} {calcularCambio(mesData[2022], mesData[2023])}%
                      </span>
                      <span className={`text-sm font-semibold ${
                        mesData[2023] > mesData[2022] ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {mesData[2023] > mesData[2022] ? '+' : ''}{calcularDiferencia(mesData[2022], mesData[2023])}M
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tendencia 2020-2025 */}
                <div className="p-4 rounded-lg bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 mt-4">
                  <h6 className="text-sm font-semibold text-green-300 mb-2">Tendencia 2020-2025 en {selectedMonth}</h6>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Crecimiento Total</p>
                      <p className="text-xl font-bold text-green-400">
                        {calcularCambio(mesData[2020], mesData[2025])}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Diferencia Absoluta</p>
                      <p className="text-xl font-bold text-green-400">
                        +{calcularDiferencia(mesData[2020], mesData[2025])}M
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })()}

        {/* Totales Anuales */}
        <div className="mb-6 p-4 rounded-lg bg-violet-900/20 border border-violet-500/30">
          <h4 className="text-lg font-bold text-violet-300 mb-4 text-center">Totales Anuales (millones de aves)</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(totalesEncasetamiento).map(([año, total]) => (
              <div key={año} className="text-center p-3 rounded-lg bg-slate-800/50">
                <p className="text-sm text-gray-400 mb-1">{año}</p>
                <p className={`text-lg font-bold ${año === '2025' ? 'text-violet-400' : 'text-white'}`}>
                  {total.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Análisis Comparativo Detallado */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-white mb-4">Análisis Comparativo entre Años</h4>

          {/* 2024 vs 2025 */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-violet-900/30 to-blue-900/30 border border-violet-500/30">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-base font-semibold text-violet-300">2024 vs 2025</h5>
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-semibold">
                +5.6% ↑
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400">2024 Total</p>
                <p className="text-lg font-bold text-white">911.54M</p>
              </div>
              <div>
                <p className="text-gray-400">2025 Total</p>
                <p className="text-lg font-bold text-violet-400">963.37M</p>
              </div>
              <div>
                <p className="text-gray-400">Diferencia</p>
                <p className="text-lg font-bold text-green-400">+51.83M aves</p>
              </div>
            </div>
            <p className="text-xs text-gray-300 mt-3">
              Crecimiento sostenido impulsado por mayor demanda nacional y mejora en condiciones de producción.
            </p>
          </div>

          {/* 2023 vs 2024 */}
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-base font-semibold text-blue-300">2023 vs 2024</h5>
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-semibold">
                +1.1% ↑
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400">2023 Total</p>
                <p className="text-lg font-bold text-white">901.48M</p>
              </div>
              <div>
                <p className="text-gray-400">2024 Total</p>
                <p className="text-lg font-bold text-blue-400">911.54M</p>
              </div>
              <div>
                <p className="text-gray-400">Diferencia</p>
                <p className="text-lg font-bold text-green-400">+10.06M aves</p>
              </div>
            </div>
            <p className="text-xs text-gray-300 mt-3">
              Recuperación moderada después de la ligera caída en 2023.
            </p>
          </div>

          {/* 2022 vs 2023 */}
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-base font-semibold text-purple-300">2022 vs 2023</h5>
              <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-semibold">
                -0.9% ↓
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400">2022 Total</p>
                <p className="text-lg font-bold text-white">909.73M</p>
              </div>
              <div>
                <p className="text-gray-400">2023 Total</p>
                <p className="text-lg font-bold text-purple-400">901.48M</p>
              </div>
              <div>
                <p className="text-gray-400">Diferencia</p>
                <p className="text-lg font-bold text-red-400">-8.25M aves</p>
              </div>
            </div>
            <p className="text-xs text-gray-300 mt-3">
              Ligera contracción debido a ajustes en el mercado y factores económicos.
            </p>
          </div>

          {/* Tendencia 2020-2025 */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30">
            <h5 className="text-base font-semibold text-green-300 mb-3">Tendencia General 2020-2025</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Crecimiento Total</p>
                <p className="text-2xl font-bold text-green-400">+21.4%</p>
                <p className="text-xs text-gray-400 mt-1">De 793.44M a 963.37M</p>
              </div>
              <div>
                <p className="text-gray-400">Incremento Absoluto</p>
                <p className="text-2xl font-bold text-green-400">+169.93M</p>
                <p className="text-xs text-gray-400 mt-1">Aves adicionales en 5 años</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-green-700">
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-green-400">Conclusión:</span> El sector avícola colombiano muestra una tendencia 
                de crecimiento sostenido con un incremento promedio anual de aproximadamente 4.3%, destacando especialmente el 
                crecimiento del 5.6% en 2025, el más alto del período analizado.
              </p>
            </div>
          </div>

          {/* Participación Pollo Fiesta */}
          <div className="p-4 rounded-lg bg-violet-900/20 border border-violet-500/30">
            <h5 className="text-base font-semibold text-violet-300 mb-3">Participación Pollo Fiesta 2025</h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-slate-800/50">
                <p className="text-xs text-gray-400 mb-1">Encasetamiento PF</p>
                <p className="text-xl font-bold text-violet-400">32.4M</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-800/50">
                <p className="text-xs text-gray-400 mb-1">Total Nacional</p>
                <p className="text-xl font-bold text-white">963.37M</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-800/50">
                <p className="text-xs text-gray-400 mb-1">Participación</p>
                <p className="text-xl font-bold text-green-400">3.3%</p>
              </div>
            </div>
          </div>
        </div>
          </>
        )}

        {/* Vista Por Año */}
        {viewMode === 'por-año' && (
          <div className="space-y-6">
            {/* Selector de Año */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/30">
              <h4 className="text-lg font-bold text-blue-300 mb-4 text-center">
                Selecciona un año para ver análisis detallado
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[2020, 2021, 2022, 2023, 2024, 2025].map((año) => (
                  <button
                    key={año}
                    onClick={() => setSelectedYear(selectedYear === año ? null : año)}
                    className={`p-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 ${
                      selectedYear === año
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                        : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700'
                    }`}
                  >
                    {año}
                  </button>
                ))}
              </div>
            </div>

            {selectedYear && (() => {
              const datosAño = encasetamientoData.map(m => ({ mes: m.mes, valor: m[selectedYear] }));
              const total = totalesEncasetamiento[selectedYear];
              const promedio = (total / 12).toFixed(2);
              const max = Math.max(...datosAño.map(d => d.valor));
              const min = Math.min(...datosAño.map(d => d.valor));
              const mesMax = datosAño.find(d => d.valor === max).mes;
              const mesMin = datosAño.find(d => d.valor === min).mes;

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Estadísticas del Año */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-500/30 text-center">
                      <p className="text-sm text-gray-400 mb-1">Total Anual</p>
                      <p className="text-2xl font-bold text-blue-400">{total.toFixed(2)}M</p>
                    </div>
                    <div className="p-4 rounded-lg bg-green-900/20 border border-green-500/30 text-center">
                      <p className="text-sm text-gray-400 mb-1">Promedio Mensual</p>
                      <p className="text-2xl font-bold text-green-400">{promedio}M</p>
                    </div>
                    <div className="p-4 rounded-lg bg-emerald-900/20 border border-emerald-500/30 text-center">
                      <p className="text-sm text-gray-400 mb-1">Mes Máximo</p>
                      <p className="text-lg font-bold text-emerald-400">{mesMax}</p>
                      <p className="text-sm text-emerald-300">{max.toFixed(2)}M</p>
                    </div>
                    <div className="p-4 rounded-lg bg-red-900/20 border border-red-500/30 text-center">
                      <p className="text-sm text-gray-400 mb-1">Mes Mínimo</p>
                      <p className="text-lg font-bold text-red-400">{mesMin}</p>
                      <p className="text-sm text-red-300">{min.toFixed(2)}M</p>
                    </div>
                  </div>

                  {/* Tabla de Datos Mensuales */}
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <h5 className="text-lg font-bold text-white mb-4">Datos Mensuales {selectedYear}</h5>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {datosAño.map((item, idx) => {
                        const prevValor = idx > 0 ? datosAño[idx - 1].valor : null;
                        const cambio = prevValor ? ((item.valor - prevValor) / prevValor * 100).toFixed(1) : null;
                        
                        return (
                          <div key={item.mes} className="p-3 rounded-lg bg-slate-900/50 border border-slate-600">
                            <p className="text-xs text-gray-400 mb-1">{item.mes}</p>
                            <p className="text-lg font-bold text-white">{item.valor.toFixed(2)}M</p>
                            {cambio && (
                              <p className={`text-xs font-semibold ${parseFloat(cambio) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {parseFloat(cambio) >= 0 ? '↑' : '↓'} {Math.abs(cambio)}% vs mes anterior
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        )}

        {/* Vista Por Mes */}
        {viewMode === 'por-mes' && (
          <div className="space-y-6">
            {/* Selector de Mes */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30">
              <h4 className="text-lg font-bold text-purple-300 mb-4 text-center">
                Selecciona un mes para ver evolución a través de los años
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {encasetamientoData.map((item) => (
                  <button
                    key={item.mes}
                    onClick={() => setSelectedMonth(selectedMonth === item.mes ? null : item.mes)}
                    className={`p-3 rounded-lg font-semibold text-sm transition-all transform hover:scale-105 ${
                      selectedMonth === item.mes
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                        : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700'
                    }`}
                  >
                    {item.mes}
                  </button>
                ))}
              </div>
            </div>

            {selectedMonth && (() => {
              const mesData = encasetamientoData.find(m => m.mes === selectedMonth);
              const años = [2020, 2021, 2022, 2023, 2024, 2025];
              const valores = años.map(año => mesData[año]);
              const incrementos = años.slice(1).map((año, idx) => {
                const actual = mesData[año];
                const anterior = mesData[años[idx]];
                return {
                  año,
                  añoAnterior: años[idx],
                  incremento: (actual - anterior).toFixed(2),
                  porcentaje: (((actual - anterior) / anterior) * 100).toFixed(1)
                };
              });

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Valores por Año */}
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <h5 className="text-lg font-bold text-white mb-4">Evolución de {selectedMonth} (2020-2025)</h5>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                      {años.map((año) => (
                        <div key={año} className="p-3 rounded-lg bg-slate-900/50 border border-slate-600 text-center">
                          <p className="text-xs text-gray-400 mb-1">{año}</p>
                          <p className={`text-lg font-bold ${año === 2025 ? 'text-purple-400' : 'text-white'}`}>
                            {mesData[año].toFixed(2)}M
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Incrementos Año a Año */}
                    <h6 className="text-base font-semibold text-white mb-3">Incrementos Interanuales:</h6>
                    <div className="space-y-2">
                      {incrementos.map((inc) => (
                        <div key={inc.año} className="p-3 rounded-lg bg-slate-900/50 border border-slate-600">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="text-sm font-semibold text-purple-300">
                              {inc.añoAnterior} → {inc.año}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded text-sm font-bold ${
                                parseFloat(inc.incremento) >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                              }`}>
                                {parseFloat(inc.incremento) >= 0 ? '↑' : '↓'} {Math.abs(inc.porcentaje)}%
                              </span>
                              <span className={`text-sm font-semibold ${
                                parseFloat(inc.incremento) >= 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {parseFloat(inc.incremento) >= 0 ? '+' : ''}{inc.incremento}M
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        )}

        {/* Vista Comparación */}
        {viewMode === 'comparacion' && (
          <div className="space-y-6">
            {/* Selector de Años a Comparar */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-500/30">
              <h4 className="text-lg font-bold text-orange-300 mb-4 text-center">
                Selecciona dos años para comparar (actualmente: {compareYears[0]} vs {compareYears[1]})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[2020, 2021, 2022, 2023, 2024, 2025].map((año) => (
                  <button
                    key={año}
                    onClick={() => {
                      if (compareYears.includes(año)) {
                        setCompareYears(compareYears.filter(y => y !== año));
                      } else if (compareYears.length < 2) {
                        setCompareYears([...compareYears, año].sort());
                      } else {
                        setCompareYears([compareYears[1], año].sort());
                      }
                    }}
                    className={`p-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 ${
                      compareYears.includes(año)
                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/50'
                        : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700'
                    }`}
                  >
                    {año}
                  </button>
                ))}
              </div>
            </div>

            {compareYears.length === 2 && (() => {
              const [año1, año2] = compareYears;
              const total1 = totalesEncasetamiento[año1];
              const total2 = totalesEncasetamiento[año2];
              const diferencia = total2 - total1;
              const porcentaje = ((diferencia / total1) * 100).toFixed(1);

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Resumen de Comparación */}
                  <div className="p-6 rounded-lg bg-gradient-to-r from-orange-900/40 to-red-900/40 border-2 border-orange-500/50">
                    <h5 className="text-xl font-bold text-orange-300 mb-4 text-center">
                      Comparación {año1} vs {año2}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-lg bg-slate-800/70">
                        <p className="text-sm text-gray-400 mb-1">{año1} Total</p>
                        <p className="text-2xl font-bold text-white">{total1.toFixed(2)}M</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-slate-800/70">
                        <p className="text-sm text-gray-400 mb-1">{año2} Total</p>
                        <p className="text-2xl font-bold text-orange-400">{total2.toFixed(2)}M</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-slate-800/70">
                        <p className="text-sm text-gray-400 mb-1">Diferencia</p>
                        <p className={`text-2xl font-bold ${diferencia >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {diferencia >= 0 ? '+' : ''}{diferencia.toFixed(2)}M
                        </p>
                        <p className={`text-lg font-semibold ${diferencia >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                          {diferencia >= 0 ? '↑' : '↓'} {Math.abs(porcentaje)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Comparación Mensual */}
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <h5 className="text-lg font-bold text-white mb-4">Comparación Mensual</h5>
                    <div className="space-y-2">
                      {encasetamientoData.map((mesData) => {
                        const val1 = mesData[año1];
                        const val2 = mesData[año2];
                        const diff = val2 - val1;
                        const pct = ((diff / val1) * 100).toFixed(1);

                        return (
                          <div key={mesData.mes} className="p-3 rounded-lg bg-slate-900/50 border border-slate-600">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="text-sm font-semibold text-orange-300 min-w-[100px]">
                                {mesData.mes}
                              </span>
                              <div className="flex items-center gap-4 flex-wrap">
                                <span className="text-sm text-gray-400">
                                  {val1.toFixed(2)}M → {val2.toFixed(2)}M
                                </span>
                                <span className={`px-3 py-1 rounded text-sm font-bold ${
                                  diff >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                }`}>
                                  {diff >= 0 ? '↑' : '↓'} {Math.abs(pct)}%
                                </span>
                                <span className={`text-sm font-semibold min-w-[80px] text-right ${
                                  diff >= 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  {diff >= 0 ? '+' : ''}{diff.toFixed(2)}M
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        )}
      </motion.div>
    </div>
  );
}
