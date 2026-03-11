import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, Target, TrendingUp } from 'lucide-react';

export default function ComercialProductosDashboard({ data }) {
  if (!data || typeof data !== 'object') {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const {
    ventasSede3 = [],
    kpisPollo = [],
    ventasPieCanal = [],
    unidadesPorCentro = []
  } = data;

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO').format(value);
  };

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return '$0';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Procesar ventas Sede 3 por línea
  const ventasPorLinea = ventasSede3.reduce((acc, v) => {
    const linea = v.nombre_linea || 'Sin línea';
    const kilos = parseFloat(v.kilos_vendidos) || 0;
    
    if (!acc[linea]) {
      acc[linea] = { linea, kilos: 0 };
    }
    acc[linea].kilos += kilos;
    
    return acc;
  }, {});

  const datosLinea = Object.values(ventasPorLinea).sort((a, b) => b.kilos - a.kilos).slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-xl rounded-xl p-6 border border-green-500/30">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-green-400" />
          <div>
            <h2 className="text-3xl font-bold text-white">Análisis de Productos</h2>
            <p className="text-gray-400 mt-1">Desempeño por línea de producto y categoría</p>
          </div>
        </div>
      </div>

      {/* Top 10 Líneas de Producto */}
      {datosLinea.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-5 h-5 text-green-400" />
            <h3 className="text-xl font-bold text-white">Top 10 Líneas de Producto - Sede 3</h3>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={datosLinea} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" tickFormatter={(value) => formatNumber(value)} />
              <YAxis dataKey="linea" type="category" stroke="#9ca3af" width={150} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                formatter={(value) => formatNumber(value) + ' kg'}
              />
              <Bar dataKey="kilos" fill="#10b981" name="Kilos" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Ventas Pie vs Canal */}
      {ventasPieCanal.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-yellow-400" />
            <h3 className="text-2xl font-bold text-white">Ventas Pollo en Pie vs Canal</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ventasPieCanal.map((item, idx) => (
              <div key={idx} className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                <div className="text-center mb-4">
                  <div className="text-lg font-bold text-white mb-1">{item.nombre_categoria}</div>
                  <div className="text-sm text-gray-400">Año {item.anio}</div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Kilos Vendidos</div>
                    <div className="text-2xl font-bold text-blue-400">{formatNumber(item.kilos_vendidos)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Ingresos</div>
                    <div className="text-xl font-bold text-green-400">{formatCurrency(item.ingresos_pesos)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Precio Promedio/Kg</div>
                    <div className="text-lg font-bold text-purple-400">{formatCurrency(item.precio_promedio_kg)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* KPIs de Pollo Entero */}
      {kpisPollo.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-xl font-bold text-white mb-6">KPIs Pollo Entero - Línea Asadero (Meta: 50%)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {kpisPollo.map((kpi, idx) => (
              <div key={idx} className="bg-gradient-to-br from-slate-700/50 to-slate-800/30 rounded-lg p-6 border border-slate-600">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-white mb-2">Año {kpi.anio}</div>
                  <div className={`text-4xl font-bold mb-2 ${parseFloat(kpi.participacion_lograda_pct) >= 50 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {kpi.participacion_lograda_pct}%
                  </div>
                  <div className="text-sm text-gray-400">Participación Lograda</div>
                </div>
                <div className="space-y-3">
                  <div className="bg-slate-700/30 rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Pollo Entero Planta</div>
                    <div className="text-lg font-bold text-blue-400">{formatNumber(kpi.pollo_entero_planta)}</div>
                  </div>
                  <div className="bg-slate-700/30 rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Venta Línea Asadero</div>
                    <div className="text-lg font-bold text-green-400">{formatNumber(kpi.venta_unidad_linea_asadero)}</div>
                  </div>
                  <div className="bg-slate-700/30 rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Puntos Faltantes</div>
                    <div className={`text-lg font-bold ${parseFloat(kpi.puntos_faltantes) <= 2 ? 'text-green-400' : 'text-red-400'}`}>
                      {kpi.puntos_faltantes}pp
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Unidades Procesadas por Centro */}
      {unidadesPorCentro.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Unidades Procesadas por Centro de Operación</h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={unidadesPorCentro}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="centro_operacion" stroke="#9ca3af" angle={-20} textAnchor="end" height={100} />
              <YAxis stroke="#9ca3af" tickFormatter={(value) => formatNumber(value)} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                formatter={(value) => formatNumber(value) + ' unidades'}
              />
              <Legend />
              <Bar dataKey="unidades" fill="#8b5cf6" name="Unidades" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
}
