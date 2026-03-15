import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, TrendingUp, DollarSign, X, Info, Percent, ArrowUpRight, ArrowDownRight, Building2 } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';

export default function ComercialAsaderoDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  // Extraer datos de ventas Sede 1 por temperatura
  const ventasSede1Temperatura = data?.ventasSede1Temperatura || [];
  
  if (ventasSede1Temperatura.length === 0) {
    return (
      <div className="bg-white/95 backdrop-blur-xl rounded-xl p-12 border border-gray-200 text-center">
        <div className="text-gray-600 text-lg">No hay datos disponibles de Ventas Asadero</div>
      </div>
    );
  }

  // Abreviado para KPIs: $1.234M / $1.23B
  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return '$0';
    const v = parseFloat(value);
    if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(2)} mil M`;
    if (v >= 1_000_000)     return `$${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000)         return `$${(v / 1_000).toFixed(0)}K`;
    return '$' + new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);
  };

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Procesar datos por temperatura
  // precio_2025/precio_2024 pueden llegar null desde BD si no hay registros en ese año
  const datosTabla = ventasSede1Temperatura.map(v => ({
    temperatura: v.temperatura,
    linea: v.nombre_linea,
    codigo: v.codigo_linea,
    kilos2025: parseFloat(v.kilos_2025) || 0,
    kilos2024: parseFloat(v.kilos_2024) || 0,
    precio2025: v.precio_2025 != null && v.precio_2025 !== '' ? parseFloat(v.precio_2025) : null,
    precio2024: v.precio_2024 != null && v.precio_2024 !== '' ? parseFloat(v.precio_2024) : null,
  }));

  // Calcular variaciones
  datosTabla.forEach(d => {
    d.variacion = d.kilos2025 - d.kilos2024;
    d.varPct = d.kilos2024 > 0 ? (((d.kilos2025 - d.kilos2024) / d.kilos2024) * 100).toFixed(2) : 0;
    // Solo calcular varPrecio si ambos precios existen y son > 0
    d.varPrecio = (d.precio2024 != null && d.precio2024 > 0 && d.precio2025 != null)
      ? (((d.precio2025 - d.precio2024) / d.precio2024) * 100).toFixed(2)
      : 'N/D';
  });

  // Agrupar por temperatura
  const refrigerado = datosTabla.filter(d => d.temperatura === 'Refrigerado');
  const congelado = datosTabla.filter(d => d.temperatura === 'Congelado');

  // Calcular totales por temperatura
  const totalRefrig2025 = refrigerado.reduce((sum, d) => sum + d.kilos2025, 0);
  const totalRefrig2024 = refrigerado.reduce((sum, d) => sum + d.kilos2024, 0);
  const totalCongel2025 = congelado.reduce((sum, d) => sum + d.kilos2025, 0);
  const totalCongel2024 = congelado.reduce((sum, d) => sum + d.kilos2024, 0);

  // Totales generales
  const total2025 = totalRefrig2025 + totalCongel2025;
  const total2024 = totalRefrig2024 + totalCongel2024;
  const variacionKilos = total2024 > 0 ? (((total2025 - total2024) / total2024) * 100).toFixed(2) : 0;

  // Calcular ingresos — solo incluir líneas con precio válido (no null)
  const ingresos2025 = datosTabla.reduce((sum, d) => sum + (d.precio2025 != null ? d.kilos2025 * d.precio2025 : 0), 0);
  const ingresos2024 = datosTabla.reduce((sum, d) => sum + (d.precio2024 != null ? d.kilos2024 * d.precio2024 : 0), 0);
  const variacionIngresos = ingresos2024 > 0 ? (((ingresos2025 - ingresos2024) / ingresos2024) * 100).toFixed(2) : 0;

  // Precio promedio — ponderado solo con líneas que tienen precio
  const kilosCon2025 = datosTabla.reduce((sum, d) => sum + (d.precio2025 != null ? d.kilos2025 : 0), 0);
  const kilosCon2024 = datosTabla.reduce((sum, d) => sum + (d.precio2024 != null ? d.kilos2024 : 0), 0);
  const precioProm2025 = kilosCon2025 > 0 ? Math.round(ingresos2025 / kilosCon2025) : 0;
  const precioProm2024 = kilosCon2024 > 0 ? Math.round(ingresos2024 / kilosCon2024) : 0;
  const variacionPrecio = precioProm2024 > 0 ? (((precioProm2025 - precioProm2024) / precioProm2024) * 100).toFixed(2) : 0;

  // Participación por temperatura
  const partRefrig = total2025 > 0 ? ((totalRefrig2025 / total2025) * 100).toFixed(2) : 0;
  const partCongel = total2025 > 0 ? ((totalCongel2025 / total2025) * 100).toFixed(2) : 0;

  // Datos para gráficas
  const datosComparativa = [
    { temperatura: 'Refrigerado', '2024': totalRefrig2024, '2025': totalRefrig2025 },
    { temperatura: 'Congelado', '2024': totalCongel2024, '2025': totalCongel2025 }
  ];

  const datosParticipacion = [
    { name: 'Refrigerado', value: parseFloat(partRefrig), kilos: totalRefrig2025 },
    { name: 'Congelado', value: parseFloat(partCongel), kilos: totalCongel2025 }
  ];

  const COLORS = ['#3b82f6', '#10b981'];

  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500/20 to-purple-600/10 backdrop-blur-xl rounded-xl p-6 border-2 border-blue-500/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <Building2 className="w-8 h-8 text-blue-400" />
          <h2 className="text-3xl font-bold text-gray-900">GESTIÓN COMERCIAL SEDE 1 CANAL ASADERO</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          Análisis de ventas del canal asadero (Sede 1). Total vendido en 2025: {formatNumber(total2025)} kg, 
          con variación de {variacionKilos > 0 ? '+' : ''}{variacionKilos}% vs 2024. Refrigerado representa el {partRefrig}% del volumen total.
        </p>
      </motion.div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal(
            'Ingresos Canal Asadero 2025',
            `Este valor representa el total de ingresos generados por las ventas del canal asadero en la Sede 1 durante 2025, calculado a partir de los registros de ventas por línea de producto (Pollo Entero, Presa, Menudencia, Carnes Frías) tanto en presentación Refrigerada como Congelada.\n\n` +
            `En 2025 se vendieron ${formatNumber(total2025)} kg en total, generando $${new Intl.NumberFormat('es-CO').format(Math.round(ingresos2025))} pesos (≈ $${new Intl.NumberFormat('es-CO').format(Math.round(ingresos2025/1000000))} millones).\n\n` +
            `En 2024 los ingresos fueron $${new Intl.NumberFormat('es-CO').format(Math.round(ingresos2024))} pesos, lo que representa una variación de ${variacionIngresos}% entre años.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Ingresos Canal Asadero 2025</span>
            <DollarSign className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">${new Intl.NumberFormat('es-CO').format(Math.round(ingresos2025 / 1000000))}M</div>
          <div className="text-xs text-gray-500 mb-1">{formatCurrency(ingresos2025)} pesos</div>
          <div className={`text-xs flex items-center gap-1 ${parseFloat(variacionIngresos) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {parseFloat(variacionIngresos) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {variacionIngresos > 0 ? '+' : ''}{variacionIngresos}% vs 2024
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal(
            'Precio Promedio por Kilogramo 2025',
            `Precio promedio por kilogramo en 2025: ${formatCurrency(precioProm2025)}/kg. La variación del ${variacionPrecio}% vs 2024 (${formatCurrency(precioProm2024)}/kg) refleja la dinámica de precios del canal asadero. La diferencia es de ${formatCurrency(Math.abs(precioProm2025 - precioProm2024))}/kg ${parseFloat(variacionPrecio) >= 0 ? 'más' : 'menos'}. Este precio promedio ponderado considera el volumen de ventas de cada línea de producto.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Precio Promedio $/kg Asadero 2025</span>
            <TrendingUp className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatCurrency(precioProm2025)}/kg</div>
          <div className="text-sm text-gray-600 mb-1">pesos por kilogramo</div>
          <div className={`text-xs flex items-center gap-1 ${parseFloat(variacionPrecio) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {parseFloat(variacionPrecio) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {variacionPrecio > 0 ? '+' : ''}{variacionPrecio}% vs 2024
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal(
            'Participación de Producto Refrigerado',
            `Producto refrigerado representa el ${partRefrig}% del volumen total con ${formatNumber(totalRefrig2025)} kg vendidos en 2025. Producto congelado aporta el ${partCongel}% con ${formatNumber(totalCongel2025)} kg. En 2024, refrigerado fue ${formatNumber(totalRefrig2024)} kg y congelado ${formatNumber(totalCongel2024)} kg. La distribución entre temperaturas refleja las preferencias del canal asadero.`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Participación Refrigerado vs Congelado 2025</span>
            <Percent className="w-6 h-6 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{partRefrig}%</div>
          <div className="text-sm text-gray-600 mb-1">del volumen total</div>
          <div className="text-xs text-gray-600">
            vs {partCongel}% Congelado
          </div>
        </motion.div>
      </div>

      {/* Tabla Detallada - Refrigerado */}
      <CollapsibleTable 
        title="100 - REFRIGERADO"
        defaultOpen={false}
        totalRow={[
          { label: 'REFRIGERADO 2025' },
          { label: `${formatNumber(totalRefrig2025)} kg`, color: 'text-blue-600' },
          { label: `Var: ${totalRefrig2024 > 0 ? (((totalRefrig2025 - totalRefrig2024) / totalRefrig2024) * 100).toFixed(2) : 0}%`, color: (totalRefrig2025 - totalRefrig2024) >= 0 ? 'text-green-500' : 'text-red-500', badge: true, badgeColor: (totalRefrig2025 - totalRefrig2024) >= 0 ? 'bg-green-500' : 'bg-red-500', badgeIcon: (totalRefrig2025 - totalRefrig2024) >= 0 ? '↑' : '↓' },
          { label: `Part: ${partRefrig}%`, color: 'text-purple-600' },
        ]}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-blue-600 border-b-2 border-gray-300">
              <th className="text-left py-3 px-4 text-white font-bold">Línea</th>
              <th className="text-right py-3 px-4 text-white font-bold">Kls. 2025</th>
              <th className="text-right py-3 px-4 text-white font-bold">% Part</th>
              <th className="text-right py-3 px-4 text-white font-bold">Kls. 2024</th>
              <th className="text-right py-3 px-4 text-white font-bold">% Part</th>
              <th className="text-right py-3 px-4 text-white font-bold">Variac.</th>
              <th className="text-right py-3 px-4 text-white font-bold">% Var</th>
              <th className="text-right py-3 px-4 text-white font-bold">$/p 2025</th>
              <th className="text-right py-3 px-4 text-white font-bold">$/p 2024</th>
              <th className="text-right py-3 px-4 text-white font-bold">Var $/p</th>
            </tr>
          </thead>
          <tbody>
            {refrigerado.map((d, idx) => {
              const part2025 = total2025 > 0 ? ((d.kilos2025 / total2025) * 100).toFixed(2) : 0;
              const part2024 = total2024 > 0 ? ((d.kilos2024 / total2024) * 100).toFixed(2) : 0;
              return (
                <tr key={idx} className="border-b border-gray-200/30 hover:bg-gray-100/20">
                  <td className="py-2 px-4 text-gray-900">{d.linea}</td>
                  <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{formatNumber(d.kilos2025)}</td>
                  <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{part2025}%</td>
                  <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{formatNumber(d.kilos2024)}</td>
                  <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{part2024}%</td>
                  <td className={`py-2 px-4 text-right tabular-nums ${parseFloat(d.varPct) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatNumber(d.variacion)}
                  </td>
                  <td className="py-2 px-4 text-right tabular-nums">
                    <span className={`inline-flex items-center gap-1 ${parseFloat(d.varPct) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${parseFloat(d.varPct) >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                        {parseFloat(d.varPct) >= 0 ? '↑' : '↓'}
                      </span>
                      {d.varPct}%
                    </span>
                  </td>
                  <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{d.precio2025 != null ? formatCurrency(d.precio2025) : 'N/D'}</td>
                  <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{d.precio2024 != null ? formatCurrency(d.precio2024) : 'N/D'}</td>
                  <td className="py-2 px-4 text-right tabular-nums">
                    {d.varPrecio === 'N/D' ? (
                      <span className="text-gray-400">N/D</span>
                    ) : (
                    <span className={`inline-flex items-center gap-1 ${parseFloat(d.varPrecio) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${parseFloat(d.varPrecio) >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                        ●
                      </span>
                      {d.varPrecio}%
                    </span>
                    )}
                  </td>
                </tr>
              );
            })}
            <tr className="bg-blue-50 border-t-2 border-blue-400 font-bold">
              <td className="py-3 px-4 text-gray-900">Total Refrigerado</td>
              <td className="py-3 px-4 text-right text-gray-900 tabular-nums">{formatNumber(totalRefrig2025)}</td>
              <td className="py-3 px-4 text-right text-gray-900 tabular-nums">{total2025 > 0 ? ((totalRefrig2025 / total2025) * 100).toFixed(2) : '0.00'}%</td>
              <td className="py-3 px-4 text-right text-gray-900 tabular-nums">{formatNumber(totalRefrig2024)}</td>
              <td className="py-3 px-4 text-right text-gray-900 tabular-nums">{total2024 > 0 ? ((totalRefrig2024 / total2024) * 100).toFixed(2) : '0.00'}%</td>
              <td className={`py-3 px-4 text-right tabular-nums ${(totalRefrig2025 - totalRefrig2024) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatNumber(totalRefrig2025 - totalRefrig2024)}
              </td>
              <td className="py-3 px-4 text-right tabular-nums">
                <span className={`inline-flex items-center gap-1 ${(totalRefrig2025 - totalRefrig2024) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalRefrig2024 > 0 ? (((totalRefrig2025 - totalRefrig2024) / totalRefrig2024) * 100).toFixed(2) : 0}%
                </span>
              </td>
              <td className="py-3 px-4 text-right text-gray-900 tabular-nums" colSpan="3"></td>
            </tr>
          </tbody>
        </table>
        </div>
      </CollapsibleTable>

      {/* Tabla Detallada - Congelado */}
      <CollapsibleTable 
        title="105 - CONGELADO"
        defaultOpen={false}
        totalRow={[
          { label: 'CONGELADO 2025' },
          { label: `${formatNumber(totalCongel2025)} kg`, color: 'text-green-600' },
          { label: `Var: ${totalCongel2024 > 0 ? (((totalCongel2025 - totalCongel2024) / totalCongel2024) * 100).toFixed(2) : 0}%`, color: (totalCongel2025 - totalCongel2024) >= 0 ? 'text-green-500' : 'text-red-500', badge: true, badgeColor: (totalCongel2025 - totalCongel2024) >= 0 ? 'bg-green-500' : 'bg-red-500', badgeIcon: (totalCongel2025 - totalCongel2024) >= 0 ? '↑' : '↓' },
          { label: `Part: ${partCongel}%`, color: 'text-purple-600' },
        ]}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-green-500 to-green-600 border-b-2 border-gray-300">
              <th className="text-left py-3 px-4 text-white font-bold">Línea</th>
              <th className="text-right py-3 px-4 text-white font-bold">Kls. 2025</th>
              <th className="text-right py-3 px-4 text-white font-bold">% Part</th>
              <th className="text-right py-3 px-4 text-white font-bold">Kls. 2024</th>
              <th className="text-right py-3 px-4 text-white font-bold">% Part</th>
              <th className="text-right py-3 px-4 text-white font-bold">Variac.</th>
              <th className="text-right py-3 px-4 text-white font-bold">% Var</th>
              <th className="text-right py-3 px-4 text-white font-bold">$/p 2025</th>
              <th className="text-right py-3 px-4 text-white font-bold">$/p 2024</th>
              <th className="text-right py-3 px-4 text-white font-bold">Var $/p</th>
            </tr>
          </thead>
          <tbody>
            {congelado.map((d, idx) => {
              const part2025 = total2025 > 0 ? ((d.kilos2025 / total2025) * 100).toFixed(2) : 0;
              const part2024 = total2024 > 0 ? ((d.kilos2024 / total2024) * 100).toFixed(2) : 0;
              return (
                <tr key={idx} className="border-b border-gray-200/30 hover:bg-gray-100/20">
                  <td className="py-2 px-4 text-gray-900">{d.linea}</td>
                  <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{formatNumber(d.kilos2025)}</td>
                  <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{part2025}%</td>
                  <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{formatNumber(d.kilos2024)}</td>
                  <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{part2024}%</td>
                  <td className={`py-2 px-4 text-right tabular-nums ${parseFloat(d.varPct) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatNumber(d.variacion)}
                  </td>
                  <td className="py-2 px-4 text-right tabular-nums">
                    <span className={`inline-flex items-center gap-1 ${parseFloat(d.varPct) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${parseFloat(d.varPct) >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                        {parseFloat(d.varPct) >= 0 ? '↑' : '↓'}
                      </span>
                      {d.varPct}%
                    </span>
                  </td>
                  <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{d.precio2025 != null ? formatCurrency(d.precio2025) : 'N/D'}</td>
                  <td className="py-2 px-4 text-right text-gray-900 tabular-nums">{d.precio2024 != null ? formatCurrency(d.precio2024) : 'N/D'}</td>
                  <td className="py-2 px-4 text-right tabular-nums">
                    {d.varPrecio === 'N/D' ? (
                      <span className="text-gray-400">N/D</span>
                    ) : (
                    <span className={`inline-flex items-center gap-1 ${parseFloat(d.varPrecio) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${parseFloat(d.varPrecio) >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                        ●
                      </span>
                      {d.varPrecio}%
                    </span>
                    )}
                  </td>
                </tr>
              );
            })}
            <tr className="bg-green-50 border-t-2 border-green-400 font-bold">
              <td className="py-3 px-4 text-gray-900">Total Congelado</td>
              <td className="py-3 px-4 text-right text-gray-900 tabular-nums">{formatNumber(totalCongel2025)}</td>
              <td className="py-3 px-4 text-right text-gray-900 tabular-nums">{total2025 > 0 ? ((totalCongel2025 / total2025) * 100).toFixed(2) : '0.00'}%</td>
              <td className="py-3 px-4 text-right text-gray-900 tabular-nums">{formatNumber(totalCongel2024)}</td>
              <td className="py-3 px-4 text-right text-gray-900 tabular-nums">{total2024 > 0 ? ((totalCongel2024 / total2024) * 100).toFixed(2) : '0.00'}%</td>
              <td className={`py-3 px-4 text-right tabular-nums ${(totalCongel2025 - totalCongel2024) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatNumber(totalCongel2025 - totalCongel2024)}
              </td>
              <td className="py-3 px-4 text-right tabular-nums">
                <span className={`inline-flex items-center gap-1 ${(totalCongel2025 - totalCongel2024) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalCongel2024 > 0 ? (((totalCongel2025 - totalCongel2024) / totalCongel2024) * 100).toFixed(2) : 0}%
                </span>
              </td>
              <td className="py-3 px-4 text-right text-gray-900 tabular-nums" colSpan="3"></td>
            </tr>
          </tbody>
        </table>
        </div>
      </CollapsibleTable>

      {/* Total General */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-xl rounded-xl p-6 border-2 border-purple-500/30"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">TOTAL GENERAL</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total 2025</p>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(total2025)} kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total 2024</p>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(total2024)} kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Variación</p>
            <p className={`text-2xl font-bold ${parseFloat(variacionKilos) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {variacionKilos > 0 ? '+' : ''}{variacionKilos}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Precio Promedio 2025</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(precioProm2025)}/kg</p>
          </div>
        </div>
      </motion.div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gráfico Comparativo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          onClick={() => openModal(
            'Comparativa por Temperatura',
            'Este gráfico muestra la evolución de las ventas por temperatura entre 2024 y 2025. Refrigerado domina con el 91.4% del volumen, mientras que Congelado representa el 8.6%.'
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200 cursor-pointer hover:border-blue-400 transition-all"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Ventas Canal Asadero en Kilos 2024 vs 2025</h3>
            <Info className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosComparativa}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="temperatura" stroke="#64748b" />
              <YAxis stroke="#64748b" tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <Tooltip content={({ active, payload, label }) => {
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
                          <span className="font-bold text-gray-900">{formatNumber(val2024)} kg</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-green-600 font-medium">2025:</span>
                          <span className="font-bold text-gray-900">{formatNumber(val2025)} kg</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-gray-600 font-medium">Diferencia:</span>
                            <span className={`font-bold ${diferencia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {diferencia >= 0 ? '+' : ''}{formatNumber(diferencia)} kg
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
              }} />
              <Bar dataKey="2024" fill="#3b82f6" name="2024" radius={[8, 8, 0, 0]} />
              <Bar dataKey="2025" fill="#10b981" name="2025" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Gráfico de Participación */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={() => openModal(
            'Participación por Temperatura 2025',
            `Refrigerado domina con ${partRefrig}% del volumen total (${formatNumber(totalRefrig2025)} kg), mientras que Congelado representa el ${partCongel}% (${formatNumber(totalCongel2025)} kg).`
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200 cursor-pointer hover:border-blue-400 transition-all"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Participación Refrigerado vs Congelado Canal Asadero 2025</h3>
            <Info className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={datosParticipacion}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ value }) => `${value.toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {datosParticipacion.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white border-2 border-blue-500 rounded-xl p-4 shadow-xl">
                        <p className="font-bold text-gray-900 mb-3 text-lg">{data.name}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-gray-600 font-medium">Kilos:</span>
                            <span className="font-bold text-gray-900">{formatNumber(data.kilos)} kg</span>
                          </div>
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-blue-600 font-medium">Participación:</span>
                            <span className="font-bold text-gray-900">{data.value.toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {datosParticipacion.map((d, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                <span className="text-sm text-gray-700">{d.name}</span>
              </div>
            ))}
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
      </AnimatePresence>
    </div>
  );
}
