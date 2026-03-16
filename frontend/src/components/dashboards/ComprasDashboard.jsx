import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell, ComposedChart } from 'recharts';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, X, Info, ArrowUp, ArrowDown } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';
import { CustomCurrencyTooltip, CustomPctTooltip, formatCurrencyFull } from './CustomTooltip';

export default function ComprasDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  if (!data || !data.comprasMensuales) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const { comprasMensuales, totales, mesesMayorCrecimiento, mesesCaidas2024 } = data;

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return "$0";
    const v = parseFloat(value);
    if (v >= 1000000000) return "$" + (v / 1000000000).toFixed(2) + "MM";
    const millones = v / 1000000;
    return "$" + millones.toFixed(1) + "M";
  };



  // Preparar datos para gráficos
  const mesesCompletos = {
    'Ene': 'Enero', 'Feb': 'Febrero', 'Mar': 'Marzo', 'Abr': 'Abril',
    'May': 'Mayo', 'Jun': 'Junio', 'Jul': 'Julio', 'Ago': 'Agosto',
    'Sep': 'Septiembre', 'Oct': 'Octubre', 'Nov': 'Noviembre', 'Dic': 'Diciembre'
  };

  const datosComparativo = comprasMensuales.map(m => ({
    mes: m.mes.substring(0, 3),
    mesCompleto: m.mes,
    '2025': parseFloat(m.compras) / 1000000,
    '2024': parseFloat(m.compras2024) / 1000000,
    '2023': parseFloat(m.compras2023) / 1000000
  }));

  // Regresión lineal para tendencia de 2025
  const calcTendencia = (datos, key) => {
    const n = datos.length;
    const sumX = datos.reduce((s, _, i) => s + i, 0);
    const sumY = datos.reduce((s, d) => s + (d[key] || 0), 0);
    const sumXY = datos.reduce((s, d, i) => s + i * (d[key] || 0), 0);
    const sumX2 = datos.reduce((s, _, i) => s + i * i, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return datos.map((d, i) => ({ ...d, tendencia2025: parseFloat((intercept + slope * i).toFixed(2)) }));
  };

  const datosComparativoConTendencia = calcTendencia(datosComparativo, '2025');

  const datosVariacion = comprasMensuales.map(m => ({
    mes: m.mes.substring(0, 3),
    mesCompleto: m.mes,
    variacion: parseFloat(m.variacion2025vs2024)
  }));

  return (
    <div className="space-y-6">
      {/* Descripción */}
      <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-6 border border-green-300">
        <p className="text-gray-700">Análisis del proceso estratégico de compras que garantiza el suministro oportuno de materias primas, bienes y servicios, con impacto directo en costos, productividad y calidad. Crecimiento del 9.66% vs 2024, revirtiendo la contracción del año anterior.</p>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal('Total Compras 2025', `El total de compras incluye materias primas, bienes y servicios necesarios para la operación. Excluye: alimento, gas, pollo en pie y pollito. Este crecimiento del ${totales.variacion2025vs2024}% revierte la contracción del año anterior y refleja un restablecimiento de la demanda.`)}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">Total Compras 2025</span>
            <ShoppingCart className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrencyFull(totales.total2025)}</div>
          <div className="text-xs text-gray-600">Compras totales</div>
          <div className="text-xs text-blue-400 mt-1">vs ${formatCurrency(totales.total2024)} (2024)</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal('Crecimiento 2025', `Después de un año de contracción en 2024 (-2.97%), las compras se recuperaron con fuerza. Los meses de mayor impulso fueron Octubre (+49.83%), Agosto (+35.59%) y Septiembre (+31.87%), sugiriendo un mejor flujo de abastecimiento y restablecimiento de la demanda.`)}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">Crecimiento 2025</span>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">+{totales.variacion2025vs2024}%</div>
          <div className="text-xs text-gray-600">vs 2024</div>
          <div className="text-xs text-green-400 mt-1">Crecimiento sólido</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal('Ajuste 2024', `El año 2024 representó un periodo de ajuste con los descensos más fuertes en Agosto (-30.83%), Marzo (-28.25%) y Enero (-21.00%). Sin embargo, estos mismos meses lograron recuperarse con fuerza en 2025, demostrando la capacidad de respuesta del área.`)}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">Ajuste 2024</span>
            <TrendingDown className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">{totales.variacion2024vs2023}%</div>
          <div className="text-xs text-gray-600">vs 2023</div>
          <div className="text-xs text-orange-400 mt-1">Año de ajuste</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal('Promedio Mensual', `La distribución mensual muestra estacionalidad con picos en el último trimestre. Octubre fue el mes más alto, seguido de Septiembre y Agosto. Los meses de menor actividad fueron Junio, Febrero y Abril, coincidiendo con periodos de menor demanda.`)}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-5 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-xs font-medium">Promedio Mensual</span>
            <DollarSign className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrencyFull(totales.total2025 / 12)}</div>
          <div className="text-xs text-gray-600">Por mes 2025</div>
          <div className="text-xs text-purple-400 mt-1">12 meses</div>
        </motion.div>
      </div>

      {/* Meses Destacados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={() => openModal('Meses Destacados', 'Estos tres meses explican gran parte del crecimiento total en 2025. El patrón sugiere un restablecimiento de la demanda en el segundo semestre, posiblemente relacionado con mejor planificación de inventarios y optimización de la cadena de suministro.')}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 cursor-pointer hover:border-green-500 transition-all"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Análisis de Crecimiento 2025</h3>
            <p className="text-sm text-gray-600 mt-1">Meses con mayor aumento vs 2024</p>
          </div>
          <Info className="w-6 h-6 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mesesMayorCrecimiento.map((mes, idx) => (
            <div key={idx} className="bg-green-50 rounded-xl p-5 border-2 border-green-500/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-bold text-green-600">{mes.mes}</h4>
                <ArrowUp className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">+{mes.variacion}%</div>
              <div className="text-xs text-gray-600">Crecimiento vs 2024</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Gráfico Comparativo Anual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => openModal('Evolución Anual', 'El gráfico muestra tres años con comportamientos distintos: 2023 como año base, 2024 con ajuste y contracción, y 2025 con recuperación sostenida.\n\nLínea roja punteada: tendencia calculada por regresión lineal sobre los valores mensuales de 2025, mostrando la dirección general del gasto en el período.')}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 cursor-pointer hover:border-blue-500 transition-all"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Comparativo Mensual 2023-2025</h3>
            <p className="text-xs text-gray-600 mt-1">Evolución de compras por mes (en millones)</p>
          </div>
          <Info className="w-5 h-5 text-gray-400" />
        </div>
        <ResponsiveContainer width="100%" height={450}>
          <ComposedChart data={datosComparativoConTendencia} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="mes" 
              stroke="#9ca3af" 
              style={{ fontSize: '12px' }} 
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#9ca3af" tickFormatter={(v) => `$${v}M`} style={{ fontSize: '13px' }} width={65} />
            <Tooltip content={<CustomCurrencyTooltip borderColor="#3b82f6" suffix="M" />} />
            <Line type="monotone" dataKey="2025" stroke="#3b82f6" strokeWidth={3} name="2025" />
            <Line type="monotone" dataKey="2024" stroke="#10b981" strokeWidth={2} name="2024" />
            <Line type="monotone" dataKey="2023" stroke="#f59e0b" strokeWidth={2} name="2023" />
            <Line type="linear" dataKey="tendencia2025" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 3, fill: '#ef4444' }} name="Tendencia 2025" />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Gráfico de Variación Mensual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        onClick={() => openModal('Variación Mensual', '9 de 12 meses presentan crecimiento positivo. Las caídas en Febrero, Abril y Julio pueden estar relacionadas con ajustes estacionales o cambios en la estrategia de inventarios. El balance general es positivo con recuperación sostenida.')}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 cursor-pointer hover:border-purple-500 transition-all"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Variación Mensual 2025 vs 2024</h3>
            <p className="text-xs text-gray-600 mt-1">Porcentaje de crecimiento o caída por mes</p>
          </div>
          <Info className="w-5 h-5 text-gray-400" />
        </div>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={datosVariacion} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="mes" 
              stroke="#9ca3af" 
              style={{ fontSize: '12px' }} 
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#9ca3af" 
              tickFormatter={(v) => `${v}%`} 
              style={{ fontSize: '13px' }}
              domain={[-25, 55]}
            />
            <Tooltip content={<CustomPctTooltip borderColor="#a855f7" />} />
            <Bar dataKey="variacion" radius={[8, 8, 0, 0]}>
              {datosVariacion.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.variacion >= 0 ? '#10b981' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Tabla Completa de Compras Mensuales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="rounded-xl overflow-hidden border-4 border-indigo-500/30"
      >
        <CollapsibleTable
          title="Detalle de Compras por Mes 2023-2025"
          defaultOpen={false}
          totalRow={[
            { label: 'TOTAL COMPRAS 2025' },
            { label: `${formatCurrency(totales.total2025)}`, color: 'text-blue-600' },
            { label: `Var: +${totales.variacion2025vs2024}%`, color: 'text-green-500', badge: true, badgeColor: 'bg-green-500', badgeIcon: '?' },
            { label: `vs 2024: ${formatCurrency(totales.total2024)}`, color: 'text-gray-500' },
          ]}
        >
          <p className="text-sm text-gray-600 mb-4">Valores en pesos colombianos y variaciones porcentuales</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-3 px-3">Mes</th>
                  <th className="text-right py-3 px-3">2025</th>
                  <th className="text-right py-3 px-3">2024</th>
                  <th className="text-right py-3 px-3">2023</th>
                  <th className="text-right py-3 px-3">Var 25/24</th>
                  <th className="text-right py-3 px-3">Var 24/23</th>
                </tr>
              </thead>
              <tbody>
                {comprasMensuales.map((mes, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-3 font-semibold">{mes.mes}</td>
                    <td className="py-3 px-3 text-right">${formatCurrencyFull(mes.compras)}</td>
                    <td className="py-3 px-3 text-right text-gray-600">${formatCurrencyFull(mes.compras2024)}</td>
                    <td className="py-3 px-3 text-right text-gray-600">${formatCurrencyFull(mes.compras2023)}</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`font-semibold px-2 py-1 rounded inline-block ${parseFloat(mes.variacion2025vs2024) >= 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                        {parseFloat(mes.variacion2025vs2024) >= 0 ? '+' : ''}{mes.variacion2025vs2024}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={`font-semibold px-2 py-1 rounded inline-block ${parseFloat(mes.variacion2024vs2023) >= 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                        {parseFloat(mes.variacion2024vs2023) >= 0 ? '+' : ''}{mes.variacion2024vs2023}%
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-gray-400 font-bold bg-gray-100">
                  <td className="py-3 px-3 text-gray-900">TOTALES</td>
                  <td className="py-3 px-3 text-right">${formatCurrencyFull(totales.total2025)}</td>
                  <td className="py-3 px-3 text-right text-gray-700">${formatCurrencyFull(totales.total2024)}</td>
                  <td className="py-3 px-3 text-right text-gray-700">${formatCurrencyFull(totales.total2023)}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="font-semibold px-2 py-1 rounded inline-block text-green-700 bg-green-50">+{totales.variacion2025vs2024}%</span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="font-semibold px-2 py-1 rounded inline-block text-red-700 bg-red-50">{totales.variacion2024vs2023}%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-300">
              <div className="text-xs text-gray-600 mb-1">Crecimiento 2025</div>
              <div className="text-2xl font-bold text-green-600">+9.66%</div>
              <div className="text-xs text-gray-600 mt-1">Recuperación sólida</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-300">
              <div className="text-xs text-gray-600 mb-1">Contracción 2024</div>
              <div className="text-2xl font-bold text-red-600">-2.97%</div>
              <div className="text-xs text-gray-600 mt-1">Año de ajuste</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
              <div className="text-xs text-gray-600 mb-1">Promedio Mensual 2025</div>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(totales.total2025 / 12)}</div>
              <div className="text-xs text-gray-600 mt-1">Por mes</div>
            </div>
          </div>
        </CollapsibleTable>
      </motion.div>

      {/* Análisis de Contracción 2024 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        onClick={() => openModal('Contracción 2024', 'El análisis de estos meses críticos permite identificar patrones de riesgo. La recuperación exitosa en 2025 demuestra que las medidas correctivas implementadas fueron efectivas. Se recomienda mantener monitoreo especial en estos periodos.')}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-red-500/30 cursor-pointer hover:border-red-500 transition-all"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Meses con Mayor Caída 2024 vs 2023</h3>
            <p className="text-sm text-gray-600 mt-1">Análisis del año de ajuste</p>
          </div>
          <Info className="w-6 h-6 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mesesCaidas2024.map((mes, idx) => (
            <div key={idx} className="bg-red-50 rounded-xl p-5 border-2 border-red-500/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-bold text-red-600">{mes.mes}</h4>
                <ArrowDown className="w-6 h-6 text-red-400" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{mes.variacion}%</div>
              <div className="text-xs text-gray-600">Caída 2024 vs 2023</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Conclusiones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-5 border-2 border-green-500/30"
        >
          <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Crecimiento 2025
          </h4>
          <div className="space-y-2 text-xs sm:text-sm text-gray-700">
            <div>• Crecimiento total: +9.66% vs 2024</div>
            <div>• Octubre: +49.83% (mayor aumento)</div>
            <div>• Agosto: +35.59% (crecimiento fuerte)</div>
            <div>• Septiembre: +31.87% (demanda sostenida)</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-5 border-2 border-blue-500/30"
        >
          <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            Alcance del Proceso
          </h4>
          <div className="space-y-2 text-xs sm:text-sm text-gray-700">
            <div>• Suministro oportuno de materias primas</div>
            <div>• Optimización de costos operativos</div>
            <div>• Gestión estratégica de proveedores</div>
            <div>• Excluye: alimento, gas, pollo en pie, pollito</div>
          </div>
        </motion.div>
      </div>

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
                  <Info className="w-6 h-6 text-cyan-600" />
                  <h3 className="text-xl font-bold text-gray-900">{modalContent.title}</h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-gray-600 hover:text-gray-900 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-gray-700 leading-relaxed">{modalContent.description}</div>
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