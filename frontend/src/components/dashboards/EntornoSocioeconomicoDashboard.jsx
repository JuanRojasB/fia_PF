import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import SectorComparison from '../SectorComparison';

export default function EntornoSocioeconomicoDashboard() {
  // Datos PIB - Tasas de crecimiento anual en volumen
  const pibData = [
    { trimestre: '2023 periodo-I', valor: 3.0, letra: 'A' },
    { trimestre: '2023 periodo-II', valor: 0.7, letra: 'B' },
    { trimestre: '2023 periodo-III', valor: -0.3, letra: 'C' },
    { trimestre: '2023 periodo-IV', valor: 0.7, letra: 'D' },
    { trimestre: '2024 periodo-I', valor: 0.2, letra: 'E' },
    { trimestre: '2024 periodo-II', valor: 2.0, letra: 'F' },
    { trimestre: '2024 periodo-III', valor: 2.0, letra: 'G' },
    { trimestre: '2024 periodo-IV', valor: 2.4, letra: 'H' },
    { trimestre: '2025 periodo-I', valor: 2.4, letra: 'I' },
    { trimestre: '2025 periodo-II', valor: 2.0, letra: 'J' },
    { trimestre: '2025 periodo-III', valor: 3.7, letra: 'K' },
    { trimestre: '2025 periodo-IV', valor: 2.3, letra: 'L' }
  ];

  const pibLegend = [
    { letra: 'A', label: '2023 periodo-I' },
    { letra: 'B', label: '2023 periodo-II' },
    { letra: 'C', label: '2023 periodo-III' },
    { letra: 'D', label: '2023 periodo-IV' },
    { letra: 'E', label: '2024 periodo-I' },
    { letra: 'F', label: '2024 periodo-II' },
    { letra: 'G', label: '2024 periodo-III' },
    { letra: 'H', label: '2024 periodo-IV' },
    { letra: 'I', label: '2025 periodo-I' },
    { letra: 'J', label: '2025 periodo-II' },
    { letra: 'K', label: '2025 periodo-III' },
    { letra: 'L', label: '2025 periodo-IV' }
  ];

  // Datos de Tasas de Crecimiento por Actividad Económica
  const actividadesData = [
    { actividad: 'Agricultura, ganadería, caza, silvicultura y pesca', anual2025: 3.1, anual2025_IV: -0.4, trim2025_III: -2.6 },
    { actividad: 'Explotación de minas y canteras', anual2025: -6.2, anual2025_IV: -2.9, trim2025_III: 1.2 },
    { actividad: 'Industrias manufactureras', anual2025: 1.9, anual2025_IV: 1.0, trim2025_III: -1.6 },
    { actividad: 'Suministro de electricidad, gas, vapor y aire acondicionado', anual2025: 1.1, anual2025_IV: 2.9, trim2025_III: 0.8 },
    { actividad: 'Construcción', anual2025: -2.8, anual2025_IV: -2.6, trim2025_III: -1.5 },
    { actividad: 'Comercio al por mayor y al por menor', anual2025: 4.6, anual2025_IV: 3.4, trim2025_III: 1.6 },
    { actividad: 'Información y comunicaciones', anual2025: 1.0, anual2025_IV: -1.2, trim2025_III: -2.0 },
    { actividad: 'Actividades financieras y de seguros', anual2025: 2.8, anual2025_IV: 0.7, trim2025_III: -2.4 },
    { actividad: 'Actividades inmobiliarias', anual2025: 2.0, anual2025_IV: 1.9, trim2025_III: 0.4 },
    { actividad: 'Actividades profesionales, científicas y técnicas', anual2025: 1.3, anual2025_IV: 1.5, trim2025_III: 0.4 },
    { actividad: 'Administración pública, defensa, educación y salud', anual2025: 4.5, anual2025_IV: 4.8, trim2025_III: 0.2 },
    { actividad: 'Actividades artísticas, de entretenimiento y recreación y otras actividades de servicios', anual2025: 9.9, anual2025_IV: 11.5, trim2025_III: 4.6 },
    { actividad: 'Valor agregado bruto', anual2025: 2.7, anual2025_IV: 2.3, trim2025_III: -0.1 },
    { actividad: 'Impuestos menos subvenciones sobre los productos', anual2025: 2.5, anual2025_IV: 2.5, trim2025_III: 0.6 },
    { actividad: 'Producto Interno Bruto', anual2025: 2.6, anual2025_IV: 2.3, trim2025_III: 0.1 }
  ];

  // Datos de Tasas de Desempleo (TGP, TO, TD)
  const desempleoData = [
    { periodo: 'Ene 18', tgp: 65.3, to: 57.4, td: 12.1 },
    { periodo: 'Ene 19', tgp: 65.0, to: 56.5, td: 13.1 },
    { periodo: 'Ene 20', tgp: 63.9, to: 55.3, td: 13.5 },
    { periodo: 'Ene 21', tgp: 60.7, to: 50.1, td: 17.6 },
    { periodo: 'Ene 22', tgp: 62.6, to: 53.3, td: 14.6 },
    { periodo: 'Ene 23', tgp: 63.4, to: 54.7, td: 13.7 },
    { periodo: 'Ene 24', tgp: 63.3, to: 55.3, td: 12.7 },
    { periodo: 'Ene 25', tgp: 64.1, to: 56.7, td: 11.6 },
    { periodo: 'Ene 26', tgp: 63.6, to: 56.7, td: 10.9 }
  ];

  // Datos de Granos - Soya y Maíz (US$ por tonelada)
  const granosData = [
    { año: '2019', soya: 350, maiz: 180 },
    { año: '2020', soya: 380, maiz: 200 },
    { año: '2021', soya: 550, maiz: 280 },
    { año: '2022', soya: 700, maiz: 350 },
    { año: '2023', soya: 450, maiz: 250 },
    { año: '2024', soya: 420, maiz: 220 },
    { año: '2025', soya: 440, maiz: 230 }
  ];

  // Datos de Precios en Colombia - Maíz, Soya y Torta (miles de pesos por tonelada)
  const preciosColombiaData = [
    { año: '2023', maizAmarillo: 1567, soyaGrano: 1576, tortaSoya: 1133 },
    { año: '2024', maizAmarillo: 1735, soyaGrano: 1248, tortaSoya: 1248 },
    { año: '2025', maizAmarillo: 1806, soyaGrano: 1313, tortaSoya: 1313 },
    { año: '2026', maizAmarillo: 1904, soyaGrano: 1923, tortaSoya: 1382 }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-white/95 backdrop-blur-xl rounded-2xl p-8 lg:p-12 border-4 border-cyan-500/30 shadow-xl"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-cyan-500/20 p-4 rounded-xl">
              <TrendingUp className="w-12 h-12 text-cyan-600" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                Entorno Socio Económico Nacional
              </h1>
              <p className="text-xl text-cyan-700">Indicadores Económicos de Colombia</p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      </motion.div>

      {/* Graphs Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 lg:p-8 border-4 border-cyan-500/30 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Indicadores Económicos</h2>
        </div>

        <div className="space-y-8">
          {/* PIB Chart */}
          <div className="rounded-xl overflow-hidden border-2 border-blue-500/30 bg-white/95 p-4 sm:p-6 shadow-lg">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 text-center mb-4 sm:mb-6">
              Producto Interno Bruto (PIB) - Tasas de crecimiento anual en volumen
            </h3>
            <div className="w-full overflow-x-auto">
              <div style={{ minWidth: '700px', width: '100%', height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pibData} margin={{ bottom: 40, top: 20, left: 20, right: 20 }} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      dataKey="letra" 
                      stroke="#94a3b8"
                      tick={{ fontSize: 17 }}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      tick={{ fontSize: 17 }}
                      domain={[-1.0, 4.0]}
                      ticks={[-1, 0, 1, 2, 3, 4]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '2px solid #3b82f6',
                        borderRadius: '8px',
                        fontSize: '17px'
                      }}
                      labelStyle={{ color: '#f1f5f9', fontSize: '17px' }}
                      formatter={(value, name, props) => {
                        return [value + '%', props.payload.trimestre];
                      }}
                    />
                    <Bar dataKey="valor" name="Crecimiento (%)" radius={[6, 6, 0, 0]} maxBarSize={35}>
                      {pibData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.valor >= 0 ? '#22c55e' : '#ef4444'}
                          stroke={entry.valor >= 0 ? '#16a34a' : '#dc2626'}
                          strokeWidth={2}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Legend */}
            <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {pibLegend.map((item) => (
                <div key={item.letra} className="flex items-center gap-2 text-gray-700">
                  <span className="font-bold text-blue-600">{item.letra}:</span>
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-gray-600 text-center mt-4">
              Fuente: DANE, PIB. T | 2023 / 2025p - IV
            </p>
            
            {/* Explicación */}
            <div className="mt-4 p-4 rounded-lg bg-blue-50 border-2 border-blue-300">
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-semibold text-blue-700">Cómo leer esta gráfica:</span> Cada letra (A-L) representa un trimestre desde 2023 periodo-I hasta 2025 periodo-IV. 
                Las barras verdes indican crecimiento positivo del PIB, mientras que las rojas muestran decrecimiento. 
                La altura de cada barra representa el porcentaje de variación porcentual del PIB en ese trimestre.
              </p>
            </div>
          </div>

          {/* Actividades Económicas Chart */}
          <div className="rounded-xl overflow-hidden border-2 border-green-500/30 bg-white/95 p-4 sm:p-6 shadow-lg">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 text-center mb-4 sm:mb-6">
              Tasas de Crecimiento por Actividad Económica (%)
            </h3>
            <div className="w-full overflow-x-auto">
              <div style={{ minWidth: '1000px', width: '100%', height: '700px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={actividadesData} 
                    layout="vertical"
                    margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      type="number" 
                      stroke="#94a3b8" 
                      tick={{ fontSize: 17 }}
                      domain={[-10, 15]}
                    />
                    <YAxis 
                      dataKey="actividad" 
                      type="category" 
                      stroke="#94a3b8"
                      width={350}
                      tick={{ fontSize: 17 }}
                      interval={0}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '2px solid #3b82f6',
                        borderRadius: '8px',
                        fontSize: '17px'
                      }}
                      labelStyle={{ color: '#f1f5f9', fontSize: '17px' }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '17px', paddingTop: '10px' }}
                      iconType="rect"
                    />
                    <Bar dataKey="anual2025" name="año total 2025 periodo / 2024 periodo" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                    <Bar dataKey="anual2025_IV" name="Anual 2025 periodo-IV / 2024 periodo-IV" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                    <Bar dataKey="trim2025_III" name="Trimestral 2025 periodo-IV / 2025 periodo-III" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 text-center mt-4">
              Fuente: DANE, PIB. T | Serie original y ajustada por efecto estacional y calendario
            </p>
            
            {/* Explicación */}
            <div className="mt-4 p-4 rounded-lg bg-green-50 border-2 border-green-300">
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-semibold text-green-700">Cómo leer esta gráfica:</span> Esta gráfica compara las tasas de crecimiento de diferentes sectores Económicos en tres períodos: 
                año completo 2025 periodo vs 2024 periodo (azul), comparación anual del cuarto trimestre (verde), y comparación trimestral (naranja). 
                Las barras hacia la derecha indican crecimiento, mientras que las que van hacia la izquierda muestran decrecimiento en ese sector.
              </p>
            </div>
          </div>

          {/* IPC Colombia Chart */}
          <div className="rounded-xl overflow-hidden border-2 border-purple-500/30 bg-white/95 p-4 sm:p-6 shadow-lg">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 text-center mb-4 sm:mb-6">
              IPC Colombia últimos 5 años
            </h3>
            <div className="w-full overflow-x-auto">
              <div style={{ minWidth: '600px', width: '100%', height: '450px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[
                      { año: '2021', ipc: 5.62, color: '#6366f1' },
                      { año: '2022', ipc: 13.12, color: '#0891b2' },
                      { año: '2023', ipc: 9.28, color: '#14b8a6' },
                      { año: '2024', ipc: 5.2, color: '#10b981' },
                      { año: '2025', ipc: 5.1, color: '#84cc16' }
                    ]} 
                    margin={{ bottom: 60, top: 40, left: 20, right: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      dataKey="año" 
                      stroke="#94a3b8"
                      tick={{ fontSize: 17 }}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      tick={{ fontSize: 17 }}
                      domain={[0, 14]}
                      ticks={[0, 2, 4, 6, 8, 10, 12, 14]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '2px solid #3b82f6',
                        borderRadius: '8px',
                        fontSize: '17px'
                      }}
                      labelStyle={{ color: '#f1f5f9', fontSize: '17px' }}
                      formatter={(value) => [`${value}%`, 'IPC']}
                    />
                    <Bar dataKey="ipc" name="IPC (%)" radius={[8, 8, 0, 0]} maxBarSize={80}>
                      {[
                        { año: '2021', ipc: 5.62, color: '#6366f1' },
                        { año: '2022', ipc: 13.12, color: '#0891b2' },
                        { año: '2023', ipc: 9.28, color: '#14b8a6' },
                        { año: '2024', ipc: 5.2, color: '#10b981' },
                        { año: '2025', ipc: 5.1, color: '#84cc16' }
                      ].map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 text-center mt-4">
              Fuente: datos oficiales del DANE
            </p>
            
            {/* Explicación */}
            <div className="mt-4 p-4 rounded-lg bg-purple-50 border-2 border-purple-300">
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-semibold text-purple-700">Cómo leer esta gráfica:</span> El Índice de Precios al Consumidor (IPC) mide la variación de precios de bienes y servicios. 
                Un IPC más alto indica mayor inflación. En 2022 se registró el pico más alto (13.12%), mientras que en 2025 se proyecta una estabilización en 5.1%, 
                similar a los niveles de 2024 (5.2%).
              </p>
            </div>
            
            {/* Nota adicional */}
            <div className="mt-4 p-4 rounded-lg bg-blue-50 border-2 border-blue-300">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">Nota:</span> El Departamento Administrativo Nacional de Estadística (DANE), el Índice de Precios al Consumidor de diciembre pasado fue de 5.1% en todo el año frente al 5.2% de 2024.
              </p>
            </div>
          </div>

          {/* TRM Promedio Anual Chart */}
          <div className="rounded-xl overflow-hidden border-2 border-cyan-500/30 bg-white/95 p-4 sm:p-6 shadow-lg">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 text-center mb-4 sm:mb-6">
              TRM Promedio Anual con Línea de Tendencia - 2024, 2025, 2026 (YTD)
            </h3>
            <div className="w-full overflow-x-auto">
              <div style={{ minWidth: '600px', width: '100%', height: '450px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[
                      { año: '2024', trm: 4071.28, tendencia: 4071.28 },
                      { año: '2025', trm: 4052.86, tendencia: 4000 },
                      { año: '2026 (YTD)', trm: 3646.27, tendencia: 3646.27 }
                    ]} 
                    margin={{ bottom: 60, top: 80, left: 60, right: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      dataKey="año" 
                      stroke="#94a3b8"
                      tick={{ fontSize: 17 }}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      tick={{ fontSize: 17 }}
                      domain={[0, 4500]}
                      ticks={[0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500]}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '2px solid #3b82f6',
                        borderRadius: '8px',
                        fontSize: '17px'
                      }}
                      labelStyle={{ color: '#f1f5f9', fontSize: '17px' }}
                      formatter={(value) => [`$${value.toLocaleString()}`, 'TRM Promedio']}
                    />
                    <Bar dataKey="trm" name="TRM Promedio" radius={[8, 8, 0, 0]} maxBarSize={120}>
                      <Cell fill="#0e7490" />
                      <Cell fill="#0891b2" />
                      <Cell fill="#67e8f9" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 text-center mt-4">
              Fuente: Actualícese
            </p>
            
            {/* Explicación */}
            <div className="mt-4 p-4 rounded-lg bg-cyan-50 border-2 border-cyan-300">
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-semibold text-cyan-700">Cómo leer esta gráfica:</span> La TRM (Tasa Representativa del Mercado) muestra el valor promedio anual del dólar en pesos colombianos. 
                La tendencia lineal refleja claramente la desaceleración del dólar entre 2024 y 2026 (a la fecha), mostrando un movimiento descendente consistente en el promedio anual de la TRM, 
                cayendo el <span className="font-semibold text-red-600">-9.21%</span> de 2023 a la fecha.
              </p>
            </div>
            
            {/* Nota adicional */}
            <div className="mt-4 p-4 rounded-lg bg-cyan-50 border-2 border-cyan-300">
              <div className="space-y-2">
                <p className="text-sm text-cyan-700">
                  <span className="font-semibold">2024:</span> $4,071.28 COP/USD
                </p>
                <p className="text-sm text-cyan-700">
                  <span className="font-semibold">2025:</span> $4,052.86 COP/USD
                </p>
                <p className="text-sm text-cyan-700">
                  <span className="font-semibold">2026 (YTD):</span> $3,646.27 COP/USD
                </p>
                <p className="text-sm text-cyan-700 mt-3 pt-3 border-t border-cyan-300">
                  <span className="font-semibold">variación:</span> Caída del 9.21% desde 2023 hasta la fecha actual
                </p>
              </div>
            </div>
          </div>

          {/* Precio Promedio por Kilogramo Chart */}
          <div className="rounded-xl overflow-hidden border-2 border-teal-500/30 bg-white/95 p-4 sm:p-6 shadow-lg">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 text-center mb-4 sm:mb-6">
              Precio Promedio por Kilogramo - Variación Anual por Mercado Mayorista
            </h3>
            <div className="w-full overflow-x-auto">
              <div style={{ minWidth: '600px', width: '100%', height: '450px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[
                      { año: '2024', precio: 10500, variacion: null },
                      { año: '2025', precio: 10700, variacion: 1.9 },
                      { año: '2026', precio: 10660, variacion: -0.4 }
                    ]} 
                    margin={{ bottom: 60, top: 80, left: 60, right: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      dataKey="año" 
                      stroke="#94a3b8"
                      tick={{ fontSize: 17 }}
                      label={{ value: 'año', position: 'insideBottom', offset: -10, style: { fontSize: 17, fill: '#94a3b8' } }}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      tick={{ fontSize: 17 }}
                      domain={[0, 12000]}
                      ticks={[0, 1000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000]}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '2px solid #3b82f6',
                        borderRadius: '8px',
                        fontSize: '17px'
                      }}
                      labelStyle={{ color: '#f1f5f9', fontSize: '17px' }}
                      formatter={(value, name) => {
                        if (name === 'precio') return [``, 'Precio por Kg'];
                        if (name === 'variacion') return [`%`, 'variación'];
                        return [value, name];
                      }}
                    />
                    <Bar yAxisId="left" dataKey="precio" name="Precio por Kg" radius={[8, 8, 0, 0]} maxBarSize={120}>
                      <Cell fill="#14b8a6" />
                      <Cell fill="#0d9488" />
                      <Cell fill="#0f766e" />
                    </Bar>
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="variacion" 
                      name="variación (%)" 
                      stroke="#1e293b" 
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      dot={{ r: 6, fill: '#1e293b', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 8 }}
                      connectNulls={false}
                      label={({ x, y, value, index }) => {
                        if (value === null || index === 0) return null;
                        return (
                          <g>
                            <rect
                              x={x - 35}
                              y={y - 35}
                              width={70}
                              height={30}
                              fill="#0f766e"
                              stroke="#14b8a6"
                              strokeWidth={2}
                              rx={15}
                            />
                            <text
                              x={x}
                              y={y - 15}
                              fill="#fff"
                              fontSize={16}
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              {value > 0 ? '+' : ''}{value}%
                            </text>
                          </g>
                        );
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 text-center mt-4">
              Fuente: Fenavi
            </p>
            
            {/* Explicación */}
            <div className="mt-4 p-4 rounded-lg bg-teal-50 border-2 border-teal-300">
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-semibold text-teal-700">Cómo leer esta gráfica:</span> El precio del pollo en el año 2025-2024 
                aumentó de 1.9%. Mientras que lo que va corrido de 2026 versus 2025 el mercado registró una contracción de precios lo que 
                arroja una disminución del -4%, respecto a promedio de precios del año anterior.
              </p>
            </div>
            
            {/* Nota adicional con variaciones */}
            <div className="mt-4 p-4 rounded-lg bg-teal-50 border-2 border-teal-300">
              <div className="space-y-2">
                <p className="text-sm text-teal-700">
                  <span className="font-semibold">variación 2024-2025:</span> +1.9% (aumento de $200)
                </p>
                <p className="text-sm text-teal-700">
                  <span className="font-semibold">variación 2025-2026:</span> -0.4% (disminución de $40)
                </p>
                <p className="text-sm text-teal-700 mt-3 pt-3 border-t border-teal-300">
                  <span className="font-semibold">Tendencia:</span> Después del aumento en 2025, se observa una ligera contracción en 2026
                </p>
              </div>
            </div>
          </div>

          {/* Tasas de Desempleo Chart */}
          <div className="rounded-xl overflow-hidden border-2 border-rose-500/30 bg-white/95 p-4 sm:p-6 shadow-lg">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 text-center mb-4 sm:mb-6">
              Tasa Global de Participación (TGP), Tasa de Ocupación (TO) y Tasa de Desocupación (TD)
            </h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              Total nacional - Enero (2018 - 2026)
            </p>
            <div className="w-full overflow-x-auto">
              <div style={{ minWidth: '800px', width: '100%', height: '500px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={desempleoData} 
                    margin={{ bottom: 60, top: 40, left: 20, right: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      dataKey="periodo" 
                      stroke="#94a3b8"
                      tick={{ fontSize: 17 }}
                      angle={0}
                    />
                    <YAxis 
                      yAxisId="left"
                      stroke="#94a3b8" 
                      tick={{ fontSize: 17 }}
                      domain={[40, 70]}
                      ticks={[40, 45, 50, 55, 60, 65, 70]}
                      label={{ value: 'Tasa TGP - TO%', angle: -90, position: 'insideLeft', style: { fontSize: 17, fill: '#94a3b8' } }}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      stroke="#94a3b8" 
                      tick={{ fontSize: 17 }}
                      domain={[5, 25]}
                      ticks={[5, 10, 15, 20, 25]}
                      label={{ value: 'Tasa TD%', angle: 90, position: 'insideRight', style: { fontSize: 17, fill: '#94a3b8' } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '2px solid #3b82f6',
                        borderRadius: '8px',
                        fontSize: '17px'
                      }}
                      labelStyle={{ color: '#f1f5f9', fontSize: '17px' }}
                      formatter={(value, name) => {
                        const labels = {
                          tgp: 'TGP',
                          to: 'TO',
                          td: 'TD'
                        };
                        return [`${value}%`, labels[name] || name];
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '17px', paddingTop: '20px' }}
                      iconType="line"
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="tgp" 
                      name="TGP (Tasa Global de Participación)" 
                      stroke="#ef4444" 
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#ef4444' }}
                      activeDot={{ r: 7 }}
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="to" 
                      name="TO (Tasa de Ocupación)" 
                      stroke="#f59e0b" 
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#f59e0b' }}
                      activeDot={{ r: 7 }}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="td" 
                      name="TD (Tasa de Desocupación)" 
                      stroke="#6b7280" 
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#6b7280' }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 text-center mt-4">
              Fuente: chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/https://www.dane.gov.co/files/operaciones/GEIH/bol-GEIH-ene2026.pdf
            </p>
            
            {/* Explicación */}
            <div className="mt-4 p-4 rounded-lg bg-rose-50 border-2 border-rose-300">
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-semibold text-rose-700">Cómo leer esta gráfica:</span> Esta gráfica muestra tres indicadores clave del mercado laboral colombiano:
                <br/><br/>
                • <span className="text-red-600 font-semibold">TGP (Línea roja)</span>: Tasa Global de Participación - porcentaje de la población en edad de trabajar que participa activamente en el mercado laboral.
                <br/>
                • <span className="text-orange-600 font-semibold">TO (Línea naranja)</span>: Tasa de Ocupación - porcentaje de la población en edad de trabajar que está empleada.
                <br/>
                • <span className="text-gray-700 font-semibold">TD (Línea gris)</span>: Tasa de Desocupación - porcentaje de la población Económicamente activa que está desempleada.
              </p>
            </div>
            
            {/* Nota adicional */}
            <div className="mt-4 p-4 rounded-lg bg-rose-50 border-2 border-rose-300">
              <div className="space-y-2">
                <h4 className="text-base font-semibold text-rose-700 mb-3">Análisis de Desempleo</h4>
                <p className="text-sm text-rose-600">
                  <span className="font-semibold">Desempleo:</span> Colombia cerró en enero 2026 con una tasa de desempleo del 10.9%, 
                  mientras que en enero 2025 fue de 11.6%, lo que supuso una disminución de 0.7 puntos porcentuales.
                </p>
                <p className="text-sm text-rose-600 mt-2">
                  La tendencia muestra una mejora sostenida desde el pico de 17.6% en enero 2021 (pandemia), 
                  alcanzando el nivel más bajo de la serie en enero 2026.
                </p>
              </div>
            </div>
          </div>

          {/* Sector en Cifras */}
          <div className="my-8">
            <SectorComparison />
          </div>

          {/* Producción de Carne de Pollo y Costos de Materia Prima */}
          <div className="rounded-xl overflow-hidden border-2 border-amber-500/30 bg-white/95 p-4 sm:p-6 shadow-lg">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 text-center mb-4 sm:mb-6">
              Producción de Carne de Pollo y Costos de Materia Prima Esencial
            </h3>
            
            {/* Texto de Producción */}
            <div className="mb-6 p-4 rounded-lg bg-amber-50 border-2 border-amber-300">
              <p className="text-sm text-gray-700 leading-relaxed">
                La Producción de carne pollo en el 2025 fue de <span className="font-semibold text-amber-700">2.003.000 de toneladas</span> presentando 
                un crecimiento de <span className="font-semibold text-green-600">9%</span> frente a <span className="font-semibold text-gray-900">1.836.032 del 2024</span> lo 
                que se tradujo en un incremento en el consumo per cápita de <span className="font-semibold text-amber-700">2.7%</span> pasado 
                de <span className="font-semibold">36.8 kilos en 2024</span> a <span className="font-semibold text-amber-700">37.8 kilos en 2025</span>. 
                En el caso de huevo el consumo per cápita creció pasando de <span className="font-semibold">342 a 366 huevos</span> siendo 
                un crecimiento de <span className="font-semibold text-green-600">7%</span> y la Producción paso <span className="font-semibold">18.019 millones de huevos</span> a 
                <span className="font-semibold text-amber-700"> 19.402</span> que corresponde a <span className="font-semibold text-green-600">+7.6%</span>. 
                El sector presentó un crecimiento en el 2025 de <span className="font-semibold text-green-600">6.3 Puntos porcentuales</span> respecto al 2024.
              </p>
            </div>

            {/* Título de Costos */}
            <h4 className="text-lg font-bold text-gray-900 mb-4">Costos materia prima esencial</h4>

            {/* gráfica de Granos */}
            <div className="w-full overflow-x-auto mb-6">
              <div style={{ minWidth: '700px', width: '100%', height: '450px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={granosData} 
                    margin={{ bottom: 60, top: 40, left: 60, right: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      dataKey="año" 
                      stroke="#94a3b8"
                      tick={{ fontSize: 17 }}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      tick={{ fontSize: 17 }}
                      domain={[150, 750]}
                      ticks={[150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750]}
                      label={{ value: 'US$ x Tonelada', angle: -90, position: 'insideLeft', style: { fontSize: 17, fill: '#94a3b8' } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '2px solid #3b82f6',
                        borderRadius: '8px',
                        fontSize: '17px'
                      }}
                      labelStyle={{ color: '#f1f5f9', fontSize: '17px' }}
                      formatter={(value, name) => {
                        const labels = {
                          soya: 'Soya',
                          maiz: 'Maíz'
                        };
                        return [`${value} US$/t`, labels[name] || name];
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '17px', paddingTop: '20px' }}
                      iconType="line"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="soya" 
                      name="F. Soya" 
                      stroke="#f59e0b" 
                      strokeWidth={4}
                      dot={{ r: 6, fill: '#f59e0b' }}
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="maiz" 
                      name="Maíz" 
                      stroke="#ef4444" 
                      strokeWidth={4}
                      dot={{ r: 6, fill: '#ef4444' }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <p className="text-xs text-gray-600 text-center mb-4">
              Fuente: CAN. Cálculos Fenavi -PEE
            </p>

            {/* Análisis de Costos */}
            <div className="p-4 rounded-lg bg-amber-50 border-2 border-amber-300">
              <h5 className="text-base font-semibold text-amber-700 mb-3">Análisis de Precios de Granos</h5>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                De 2019 a 2023 precios bajos y estables, <span className="font-semibold text-red-600">2021-2022</span> fuerte incremento alcanzando punto 
                máximo Soya <span className="font-semibold">700 US/t</span>, Maíz <span className="font-semibold">650-700 US/t</span> reducción oferta post pandemia. 
                <span className="font-semibold text-green-600"> 2023-2024</span> el Maíz <span className="font-semibold">200 US $/t</span> y la soya caen 
                <span className="font-semibold"> 400-450 US $/t</span>, y en <span className="font-semibold text-amber-700">2025</span> el Maíz 
                <span className="font-semibold"> 220-240 US $/t</span> y la <span className="font-semibold">soya 430-450 US $/t</span> se estabilizan los precios 
                debido a mayor Producción en Brasil y mayor disponibilidad en EEUU.
              </p>
            </div>
          </div>

          {/* Estimación de Precios en Colombia */}
          <div className="rounded-xl overflow-hidden border-2 border-sky-500/30 bg-white/95 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 text-center mb-2">
              Estimación de precios en Colombia (2023-2026)
            </h3>
            <p className="text-sm text-gray-700 text-center mb-6">
              Maíz, Soya y Torta - miles de pesos por tonelada
            </p>

            {/* gráfica de Precios Colombia */}
            <div className="w-full overflow-x-auto mb-6">
              <div style={{ minWidth: '700px', width: '100%', height: '450px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={preciosColombiaData} 
                    margin={{ bottom: 60, top: 40, left: 60, right: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      dataKey="año" 
                      stroke="#94a3b8"
                      tick={{ fontSize: 17 }}
                      label={{ value: 'año', position: 'insideBottom', offset: -10, style: { fontSize: 17, fill: '#94a3b8' } }}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      tick={{ fontSize: 17 }}
                      domain={[1000, 2000]}
                      ticks={[1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000]}
                      label={{ value: 'Miles de pesos por tonelada', angle: -90, position: 'insideLeft', style: { fontSize: 17, fill: '#94a3b8' } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '2px solid #3b82f6',
                        borderRadius: '8px',
                        fontSize: '17px'
                      }}
                      labelStyle={{ color: '#f1f5f9', fontSize: '17px' }}
                      formatter={(value, name) => {
                        const labels = {
                          maizAmarillo: 'Maíz amarillo',
                          soyaGrano: 'Soya grano',
                          tortaSoya: 'Torta de soya'
                        };
                        return [`${value.toLocaleString()} miles`, labels[name] || name];
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '17px', paddingTop: '20px' }}
                      iconType="line"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="maizAmarillo" 
                      name="Maíz amarillo" 
                      stroke="#60a5fa" 
                      strokeWidth={4}
                      dot={{ r: 6, fill: '#60a5fa' }}
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="soyaGrano" 
                      name="Soya grano" 
                      stroke="#3b82f6" 
                      strokeWidth={4}
                      dot={{ r: 6, fill: '#3b82f6' }}
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="tortaSoya" 
                      name="Torta de soya" 
                      stroke="#1e40af" 
                      strokeWidth={4}
                      dot={{ r: 6, fill: '#1e40af' }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Análisis */}
            <div className="p-4 rounded-lg bg-sky-50 border-2 border-sky-300">
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-semibold text-sky-700">Análisis:</span> Los precios de materias primas para el ABA a nivel nacional presentan 
                una tendencia al alza desde el año 2023 creciendo el <span className="font-semibold text-green-600">22%</span> a 2026.
              </p>
            </div>

            {/* Datos específicos */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-sky-50 border-2 border-sky-300">
                <h6 className="text-sm font-semibold text-sky-700 mb-2">Maíz Amarillo</h6>
                <div className="space-y-1 text-xs text-gray-700">
                  <p>2023: <span className="font-semibold">1,567</span></p>
                  <p>2024: <span className="font-semibold">1,735</span></p>
                  <p>2025: <span className="font-semibold">1,806</span></p>
                  <p>2026: <span className="font-semibold text-sky-700">1,904</span></p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-50 border-2 border-blue-300">
                <h6 className="text-sm font-semibold text-blue-700 mb-2">Soya Grano</h6>
                <div className="space-y-1 text-xs text-gray-700">
                  <p>2023: <span className="font-semibold">1,576</span></p>
                  <p>2024: <span className="font-semibold">1,248</span></p>
                  <p>2025: <span className="font-semibold">1,313</span></p>
                  <p>2026: <span className="font-semibold text-blue-700">1,923</span></p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-indigo-50 border-2 border-indigo-300">
                <h6 className="text-sm font-semibold text-indigo-700 mb-2">Torta de Soya</h6>
                <div className="space-y-1 text-xs text-gray-700">
                  <p>2023: <span className="font-semibold">1,133</span></p>
                  <p>2024: <span className="font-semibold">1,248</span></p>
                  <p>2025: <span className="font-semibold">1,313</span></p>
                  <p>2026: <span className="font-semibold text-indigo-700">1,382</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

