import { TrendingUp, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import SectorComparison from '../SectorComparison';
import { useState } from 'react';

export default function EntornoSocioeconomicoDashboard() {
  const [showPibInfo, setShowPibInfo] = useState(false);
  const [showIpcInfo, setShowIpcInfo] = useState(false);
  const [showTrmInfo, setShowTrmInfo] = useState(false);
  const [showPrecioPolloInfo, setShowPrecioPolloInfo] = useState(false);
  const [showDesempleoInfo, setShowDesempleoInfo] = useState(false);
  // Datos PIB - Gasto en alimentos (Millones de pesos constantes)
  const pibData = [
    { trimestre: 'I', año: '2019', valor: 25000, index: 0 },
    { trimestre: 'II', año: '2019', valor: 25200, index: 1 },
    { trimestre: 'III', año: '2019', valor: 25800, index: 2 },
    { trimestre: 'IV', año: '2019', valor: 26300, index: 3 },
    { trimestre: 'I', año: '2020', valor: 28200, index: 4 },
    { trimestre: 'II', año: '2020', valor: 27500, index: 5 },
    { trimestre: 'III', año: '2020', valor: 27800, index: 6 },
    { trimestre: 'IV', año: '2020', valor: 28500, index: 7 },
    { trimestre: 'I', año: '2021', valor: 28300, index: 8 },
    { trimestre: 'II', año: '2021', valor: 30400, index: 9 },
    { trimestre: 'III', año: '2021', valor: 30500, index: 10 },
    { trimestre: 'IV', año: '2021', valor: 30600, index: 11 },
    { trimestre: 'I', año: '2022', valor: 30400, index: 12 },
    { trimestre: 'II', año: '2022', valor: 30200, index: 13 },
    { trimestre: 'III', año: '2022', valor: 30500, index: 14 },
    { trimestre: 'IV', año: '2022', valor: 30800, index: 15 },
    { trimestre: 'I', año: '2023p', valor: 31000, index: 16 },
    { trimestre: 'II', año: '2023p', valor: 31200, index: 17 },
    { trimestre: 'III', año: '2023p', valor: 31800, index: 18 },
    { trimestre: 'IV', año: '2023p', valor: 31200, index: 19 },
    { trimestre: 'I', año: '2024pr', valor: 31500, index: 20 },
    { trimestre: 'II', año: '2024pr', valor: 32000, index: 21 },
    { trimestre: 'III', año: '2024pr', valor: 32100, index: 22 },
    { trimestre: 'IV', año: '2024pr', valor: 32000, index: 23 },
    { trimestre: 'I', año: '2025pr', valor: 31800, index: 24 },
    { trimestre: 'II', año: '2025pr', valor: 31500, index: 25 },
    { trimestre: 'III', año: '2025pr', valor: 31200, index: 26 }
  ];

  // Datos para la línea de tendencia (línea roja)
  const tendenciaData = pibData.map((item, index) => ({
    ...item,
    tendencia: 25000 + (index * 250) // Línea de tendencia ascendente
  }));

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
      <div className="relative overflow-hidden bg-white/95 backdrop-blur-xl rounded-2xl p-8 lg:p-12 border-4 border-cyan-500/30 shadow-xl">
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
      </div>

      {/* Graphs Section */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl p-6 lg:p-8 border-4 border-cyan-500/30 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Indicadores Económicos</h2>
        </div>

        <div className="space-y-8">
          {/* PIB Chart */}
          <div className="rounded-xl overflow-hidden border-2 border-blue-500/30 bg-white/95 p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 text-center">
                  Gasto en alimentos
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  Millones de pesos constantes
                </p>
              </div>
              <button
                onClick={() => setShowPibInfo(!showPibInfo)}
                className="ml-4 p-2 rounded-full hover:bg-blue-100 transition-colors"
                title="Información sobre la gráfica"
              >
                <Info className="w-5 h-5 text-blue-600" />
              </button>
            </div>

            {/* Modal de información */}
            {showPibInfo && (
              <div className="mb-4 p-4 rounded-lg bg-blue-50 border-2 border-blue-300 relative">
                <button
                  onClick={() => setShowPibInfo(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold text-blue-700">Descripción:</span> La línea naranja muestra el gasto trimestral en alimentos en millones de pesos constantes desde 2019 hasta 2025. 
                  La línea roja punteada representa la tendencia general de crecimiento. Se observa un incremento significativo durante 2020-2021, 
                  seguido de una estabilización en 2022-2023, y una ligera contracción en 2024-2025.
                </p>
              </div>
            )}
            
            <div className="w-full">
              <ResponsiveContainer width="100%" height={450}>
                <LineChart data={tendenciaData} margin={{ bottom: 65, top: 20, left: 50, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis 
                    dataKey="trimestre" 
                    stroke="#94a3b8"
                    tick={{ fontSize: 13, fill: '#64748b' }}
                    angle={0}
                    interval={0}
                    height={20}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    tick={{ fontSize: 14, fill: '#64748b' }}
                    domain={[24000, 33000]}
                    ticks={[24000, 25000, 26000, 27000, 28000, 29000, 30000, 31000, 32000, 33000]}
                    tickFormatter={(value) => `${value.toLocaleString('es-CO')}`}
                    width={55}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    tick={{ fontSize: 15, fill: '#64748b' }}
                    domain={[24000, 33000]}
                    ticks={[24000, 25000, 26000, 27000, 28000, 29000, 30000, 31000, 32000, 33000]}
                    tickFormatter={(value) => `$${value.toLocaleString('es-CO')}`}
                    width={75}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '2px solid #3b82f6',
                      borderRadius: '8px',
                      fontSize: '14px',
                      padding: '10px'
                    }}
                    labelStyle={{ color: '#1f2937', fontSize: '14px', fontWeight: 'bold', marginBottom: '6px' }}
                    formatter={(value, name) => {
                      const formattedValue = `$${Math.round(value).toLocaleString('es-CO')}`;
                      if (name === 'valor') return [formattedValue, 'Gasto en alimentos'];
                      if (name === 'tendencia') return [formattedValue, 'Tendencia'];
                      return [formattedValue, name];
                    }}
                    labelFormatter={(label, payload) => {
                      if (payload && payload.length > 0) {
                        const data = payload[0].payload;
                        return `${data.trimestre} - ${data.año}`;
                      }
                      return label;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="valor" 
                    name="Gasto en alimentos" 
                    stroke="#f59e0b" 
                    strokeWidth={3.5}
                    dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="tendencia" 
                    name="Tendencia" 
                    stroke="#ef4444" 
                    strokeWidth={2.5}
                    strokeDasharray="6 3"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Etiquetas de años debajo de los trimestres - centradas entre cada grupo de 4 */}
            <div className="relative" style={{ marginTop: '-55px', paddingLeft: '50px', paddingRight: '30px', height: '20px' }}>
              <div className="flex" style={{ position: 'relative' }}>
                {/* Posicionar cada año exactamente en el medio de sus 4 trimestres */}
                <div className="text-xs font-bold text-gray-700 absolute" style={{ left: 'calc((100% / 27) * 3.5)', transform: 'translateX(-50%)' }}>2019</div>
                <div className="text-xs font-bold text-gray-700 absolute" style={{ left: 'calc((100% / 27) * 7)', transform: 'translateX(-50%)' }}>2020</div>
                <div className="text-xs font-bold text-gray-700 absolute" style={{ left: 'calc((100% / 27) * 11)', transform: 'translateX(-50%)' }}>2021</div>
                <div className="text-xs font-bold text-gray-700 absolute" style={{ left: 'calc((100% / 27) * 15)', transform: 'translateX(-50%)' }}>2022</div>
                <div className="text-xs font-bold text-gray-700 absolute" style={{ left: 'calc((100% / 27) * 19)', transform: 'translateX(-50%)' }}>2023p</div>
                <div className="text-xs font-bold text-gray-700 absolute" style={{ left: 'calc((100% / 27) * 23)', transform: 'translateX(-50%)' }}>2024pr</div>
                <div className="text-xs font-bold text-gray-700 absolute" style={{ left: 'calc((100% / 27) * 26.5)', transform: 'translateX(-50%)' }}>2025pr</div>
              </div>
            </div>
            
            {/* Leyenda personalizada debajo */}
            <div className="flex items-center justify-center gap-8 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-orange-500"></div>
                <span className="text-sm text-gray-700">Gasto en alimentos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-red-500 border-dashed" style={{ borderTop: '2px dashed #ef4444', height: '0' }}></div>
                <span className="text-sm text-gray-700">Tendencia</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 text-center mt-4">
              Fuente: DANE, Cuentas Nacionales
            </p>
          </div>

          {/* IPC Colombia Chart */}
          <div className="rounded-xl overflow-hidden border-2 border-purple-500/30 bg-white/95 p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 text-center">
                  IPC Colombia últimos 5 años
                </h3>
              </div>
              <button
                onClick={() => setShowIpcInfo(!showIpcInfo)}
                className="ml-4 p-2 rounded-full hover:bg-purple-100 transition-colors"
                title="Información sobre la gráfica"
              >
                <Info className="w-5 h-5 text-purple-600" />
              </button>
            </div>

            {/* Modal de información */}
            {showIpcInfo && (
              <div className="mb-4 p-4 rounded-lg bg-purple-50 border-2 border-purple-300 relative">
                <button
                  onClick={() => setShowIpcInfo(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold text-purple-700">Descripción:</span> El Índice de Precios al Consumidor (IPC) mide la variación de precios de bienes y servicios. 
                  Un IPC más alto indica mayor inflación. En 2022 se registró el pico más alto (13.12%), mientras que en 2025 se proyecta una estabilización en 5.1%, 
                  similar a los niveles de 2024 (5.2%).
                </p>
              </div>
            )}
            
            <div className="w-full">
              <ResponsiveContainer width="100%" aspect={1.5}>
                <BarChart 
                    data={[
                      { año: '2021', ipc: 5.62, color: '#6366f1' },
                      { año: '2022', ipc: 13.12, color: '#0891b2' },
                      { año: '2023', ipc: 9.28, color: '#14b8a6' },
                      { año: '2024', ipc: 5.2, color: '#10b981' },
                      { año: '2025', ipc: 5.1, color: '#84cc16' }
                    ]} 
                    margin={{ bottom: 60, top: 50, left: 20, right: 20 }}
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
                    <Bar dataKey="ipc" name="IPC (%)" radius={[8, 8, 0, 0]} maxBarSize={80} label={{ 
                      position: 'top', 
                      fill: '#1f2937',
                      fontSize: 16,
                      fontWeight: 'bold',
                      formatter: (value) => `${value}%`
                    }}>
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
                    <Line 
                      type="monotone" 
                      dataKey="ipc" 
                      stroke="#1f2937" 
                      strokeWidth={2}
                      dot={{ r: 4, fill: '#1f2937', strokeWidth: 0 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            
            <p className="text-xs text-gray-600 text-center mt-4">
              Fuente: datos oficiales del DANE
            </p>
          </div>

          {/* TRM Promedio Anual Chart */}
          <div className="rounded-xl overflow-hidden border-2 border-cyan-500/30 bg-white/95 p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 text-center">
                  TRM Promedio Anual con Línea de Tendencia - 2024, 2025, 2026 (YTD)
                </h3>
              </div>
              <button
                onClick={() => setShowTrmInfo(!showTrmInfo)}
                className="ml-4 p-2 rounded-full hover:bg-cyan-100 transition-colors"
                title="Información sobre la gráfica"
              >
                <Info className="w-5 h-5 text-cyan-600" />
              </button>
            </div>

            {/* Modal de información */}
            {showTrmInfo && (
              <div className="mb-4 p-4 rounded-lg bg-cyan-50 border-2 border-cyan-300 relative">
                <button
                  onClick={() => setShowTrmInfo(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold text-cyan-700">Descripción:</span> La TRM (Tasa Representativa del Mercado) muestra el valor promedio anual del dólar en pesos colombianos. 
                  La tendencia lineal refleja claramente la desaceleración del dólar entre 2024 y 2026 (a la fecha), mostrando un movimiento descendente consistente en el promedio anual de la TRM, 
                  cayendo el <span className="font-semibold text-red-600">-9.21%</span> de 2023 a la fecha.
                </p>
              </div>
            )}
            
            <div className="w-full">
              <ResponsiveContainer width="100%" aspect={1.5}>
                <BarChart 
                    data={[
                      { año: '2024', trm: 4071.28, tendencia: 4071.28 },
                      { año: '2025', trm: 4052.86, tendencia: 4000 },
                      { año: '2026 (YTD)', trm: 3640.27, tendencia: 3640.27 }
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
                      formatter={(value, name) => {
                        if (name === 'Línea de Tendencia') return [`$${value.toLocaleString()}`, 'Línea de Tendencia'];
                        return [`$${value.toLocaleString()}`, 'TRM Promedio'];
                      }}
                    />
                    <Bar dataKey="trm" name="TRM Promedio" radius={[8, 8, 0, 0]} maxBarSize={180}>
                      <Cell fill="#1e40af" />
                      <Cell fill="#3b82f6" />
                      <Cell fill="#60a5fa" />
                    </Bar>
                    <Line 
                      type="linear" 
                      dataKey="trm" 
                      name="Línea de Tendencia"
                      stroke="#ef4444" 
                      strokeWidth={3}
                      strokeDasharray="8 4"
                      dot={{ r: 6, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 8 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
                
                {/* Custom overlay con valores */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '500px', pointerEvents: 'none' }}>
                  {/* Valores encima de cada barra */}
                  <text x="29%" y="60" fill="#1e40af" fontSize="18" fontWeight="bold" textAnchor="middle">$4,071.28</text>
                  <text x="54%" y="60" fill="#3b82f6" fontSize="18" fontWeight="bold" textAnchor="middle">$4,052.86</text>
                  <text x="78%" y="60" fill="#60a5fa" fontSize="18" fontWeight="bold" textAnchor="middle">$3,640.27</text>
                </svg>
              </div>
            
            <p className="text-xs text-gray-600 text-center mt-4">
              Fuente: datos oficiales del DANE
            </p>
            
            {/* Análisis */}
            <div className="p-4 rounded-lg bg-cyan-50 border-2 border-cyan-300 mt-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-semibold text-cyan-700">Análisis:</span> La tendencia lineal refleja claramente la <span className="font-semibold text-cyan-600">desaceleración del dólar</span> entre 2024 y 2026 (a la fecha), mostrando un movimiento descendente consistente en el promedio anual de la TRM, cayendo el <span className="font-semibold text-red-600">-9.21%</span> de 2024 a la fecha.
              </p>
              <p className="text-xs text-gray-600 mt-2">Fuente: Actualícese</p>
            </div>
          </div>

          {/* Precio Promedio por Kilogramo Chart */}
          <div className="rounded-xl overflow-hidden border-2 border-teal-500/30 bg-white/95 p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 text-center">
                  Precio Promedio por Kilogramo - Variación Anual por Mercado Mayorista
                </h3>
              </div>
              <button
                onClick={() => setShowPrecioPolloInfo(!showPrecioPolloInfo)}
                className="ml-4 p-2 rounded-full hover:bg-teal-100 transition-colors"
                title="Información sobre la gráfica"
              >
                <Info className="w-5 h-5 text-teal-600" />
              </button>
            </div>

            {/* Modal de información */}
            {showPrecioPolloInfo && (
              <div className="mb-4 p-4 rounded-lg bg-teal-50 border-2 border-teal-300 relative">
                <button
                  onClick={() => setShowPrecioPolloInfo(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold text-teal-700">Descripción:</span> El precio del pollo en el año 2025-2024 
                  aumentó de 1.9%. Mientras que lo que va corrido de 2026 versus 2025 el mercado registró una contracción de precios lo que 
                  arroja una disminución del -4%, respecto a promedio de precios del año anterior.
                </p>
              </div>
            )}
            
            <div className="w-full" style={{ position: 'relative' }}>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart 
                    data={[
                      { año: '2024', precio: 10500 },
                      { año: '2025', precio: 10700 },
                      { año: '2026', precio: 10660 }
                    ]} 
                    margin={{ bottom: 60, top: 100, left: 70, right: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="año" 
                      stroke="#94a3b8"
                      tick={{ fontSize: 16 }}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      tick={{ fontSize: 16 }}
                      domain={[0, 11000]}
                      ticks={[0, 2000, 4000, 6000, 8000, 10000]}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '2px solid #14b8a6',
                        borderRadius: '8px',
                        fontSize: '15px'
                      }}
                      formatter={(value) => [`$${value.toLocaleString()} miles de millones de pesos`, 'Precio por Kg']}
                    />
                    <Bar dataKey="precio" name="Precio por Kg" radius={[8, 8, 0, 0]} maxBarSize={180}>
                      <Cell fill="#14b8a6" />
                      <Cell fill="#14b8a6" />
                      <Cell fill="#14b8a6" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                
                {/* Custom lines and labels overlay */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '500px', pointerEvents: 'none' }}>
                  {/* Línea horizontal ENCIMA de las barras */}
                  <line x1="15%" y1="80" x2="88%" y2="80" stroke="#64748b" strokeWidth="3" />
                  
                  {/* Etiquetas de porcentaje encima de la línea horizontal */}
                  <rect x="36%" y="50" width="70" height="32" fill="#14b8a6" stroke="#0d9488" strokeWidth="2" rx="16" />
                  <text x="39.5%" y="72" fill="#fff" fontSize="16" fontWeight="bold" textAnchor="middle">1,9%</text>
                  
                  <rect x="59%" y="50" width="70" height="32" fill="#14b8a6" stroke="#0d9488" strokeWidth="2" rx="16" />
                  <text x="62.5%" y="72" fill="#fff" fontSize="16" fontWeight="bold" textAnchor="middle">-,4%</text>
                  
                  {/* Líneas verticales desde la línea horizontal hasta los puntos de la línea punteada */}
                  {/* Primera barra (2024): punto más alto en la tendencia */}
                  <line x1="29%" y1="80" x2="29%" y2="210" stroke="#64748b" strokeWidth="2.5" />
                  {/* Segunda barra (2025): punto medio en la tendencia descendente */}
                  <line x1="54%" y1="80" x2="54%" y2="250" stroke="#64748b" strokeWidth="2.5" />
                  {/* Tercera barra (2026): punto más bajo en la tendencia */}
                  <line x1="78%" y1="80" x2="78%" y2="265" stroke="#64748b" strokeWidth="2.5" />
                  
                  {/* Línea punteada DESCENDENTE continua */}
                  <line x1="29%" y1="210" x2="54%" y2="250" stroke="#1e293b" strokeWidth="2.5" strokeDasharray="6 6" />
                  <line x1="54%" y1="250" x2="78%" y2="265" stroke="#1e293b" strokeWidth="2.5" strokeDasharray="6 6" />
                  
                  {/* Puntos en la línea punteada descendente */}
                  <circle cx="29%" cy="210" r="6" fill="#1e293b" />
                  <circle cx="54%" cy="250" r="6" fill="#1e293b" />
                  <circle cx="78%" cy="265" r="6" fill="#1e293b" />
                  
                  {/* Etiqueta adicional -0.4% cerca de la tercera barra */}
                  <text x="82%" y="290" fill="#fff" fontSize="15" fontWeight="bold" textAnchor="middle">-0.4%</text>
                </svg>
              </div>
            
            <p className="text-xs text-gray-600 text-center mt-4">
              Fuente: Fenavi
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border-2 border-rose-500/30 bg-white/95 p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 text-center">
                  Tasa Global de Participación (TGP), Tasa de Ocupación (TO) y Tasa de Desocupación (TD)
                </h3>
                <p className="text-sm text-gray-600 text-center mt-2">
                  Total nacional - Enero (2018 - 2026)
                </p>
              </div>
              <button
                onClick={() => setShowDesempleoInfo(!showDesempleoInfo)}
                className="ml-4 p-2 rounded-full hover:bg-rose-100 transition-colors"
                title="Información sobre la gráfica"
              >
                <Info className="w-5 h-5 text-rose-600" />
              </button>
            </div>

            {/* Modal de información */}
            {showDesempleoInfo && (
              <div className="mb-4 p-4 rounded-lg bg-rose-50 border-2 border-rose-300 relative">
                <button
                  onClick={() => setShowDesempleoInfo(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold text-rose-700">Descripción:</span> Esta gráfica muestra tres indicadores clave del mercado laboral colombiano:
                  <br/><br/>
                  • <span className="text-red-600 font-semibold">TGP (Línea roja)</span>: Tasa Global de Participación - porcentaje de la población en edad de trabajar que participa activamente en el mercado laboral.
                  <br/>
                  • <span className="text-orange-600 font-semibold">TO (Línea naranja)</span>: Tasa de Ocupación - porcentaje de la población en edad de trabajar que está empleada.
                  <br/>
                  • <span className="text-gray-700 font-semibold">TD (Línea gris)</span>: Tasa de Desocupación - porcentaje de la población Económicamente activa que está desempleada.
                </p>
              </div>
            )}
            
            <div className="w-full">
              <ResponsiveContainer width="100%" aspect={1.6}>
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
            
            <p className="text-xs text-gray-600 text-center mt-4">
              Fuente: chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/https://www.dane.gov.co/files/operaciones/GEIH/bol-GEIH-ene2026.pdf
            </p>
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
            <div className="w-full mb-6">
              <ResponsiveContainer width="100%" aspect={1.6}>
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
            <div className="w-full mb-6">
              <ResponsiveContainer width="100%" aspect={1.6}>
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
                        return [`${value.toLocaleString()} miles de millones de pesos`, labels[name] || name];
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
                      stroke="#fbbf24" 
                      strokeWidth={4}
                      dot={{ r: 6, fill: '#fbbf24' }}
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="soyaGrano" 
                      name="Soya grano" 
                      stroke="#84cc16" 
                      strokeWidth={4}
                      dot={{ r: 6, fill: '#84cc16' }}
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="tortaSoya" 
                      name="Torta de soya" 
                      stroke="#92400e" 
                      strokeWidth={4}
                      dot={{ r: 6, fill: '#92400e' }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
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
      </div>
    </div>
  );
}

