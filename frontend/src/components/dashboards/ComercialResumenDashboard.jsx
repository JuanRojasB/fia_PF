import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, DollarSign, MapPin, Users, TrendingUp } from 'lucide-react';

export default function ComercialResumenDashboard({ data }) {
  if (!data || typeof data !== 'object') {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const {
    analisisVentas = [],
    metasSede3 = [],
    sedesInfo = [],
    totales = {}
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

  // Procesar análisis de ventas por categoría
  const ventasPorCategoria = analisisVentas.reduce((acc, v) => {
    const categoria = v.nombre_categoria || 'Sin categoría';
    const anio = v.anio;
    const kilos = parseFloat(v.kilos_vendidos) || 0;
    
    if (!acc[categoria]) {
      acc[categoria] = { categoria, kg2024: 0, kg2025: 0 };
    }
    
    if (anio === 2024) acc[categoria].kg2024 += kilos;
    if (anio === 2025) acc[categoria].kg2025 += kilos;
    
    return acc;
  }, {});

  const datosCategoria = Object.values(ventasPorCategoria);

  // Procesar información de sedes
  const sedesPorAnio = sedesInfo.reduce((acc, s) => {
    if (!acc[s.anio]) acc[s.anio] = [];
    acc[s.anio].push(s);
    return acc;
  }, {});

  const sedes2025 = sedesPorAnio[2025] || [];
  const sedes2024 = sedesPorAnio[2024] || [];

  return (
    <div className="space-y-6">
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-xl rounded-xl p-6 border border-blue-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm font-medium">Ventas 2025</span>
            <Package className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">{formatNumber(totales.kilos2025)}</div>
          <div className="text-sm text-gray-400 mt-1">kg vendidos</div>
          <div className={`text-sm mt-2 font-semibold ${totales.variacionKilosPct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totales.variacionKilosPct > 0 ? '↑' : '↓'} {Math.abs(totales.variacionKilosPct)}% vs 2024
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-xl rounded-xl p-6 border border-green-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm font-medium">Ingresos 2025</span>
            <DollarSign className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{formatCurrency(totales.ingresos2025)}</div>
          <div className="text-sm text-gray-400 mt-1">pesos colombianos</div>
          <div className={`text-sm mt-2 font-semibold ${totales.variacionIngresosPct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totales.variacionIngresosPct > 0 ? '↑' : '↓'} {Math.abs(totales.variacionIngresosPct)}% vs 2024
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm font-medium">Puntos de Venta</span>
            <MapPin className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white">{totales.totalPuntosVenta || 0}</div>
          <div className="text-sm text-gray-400 mt-1">activos</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 backdrop-blur-xl rounded-xl p-6 border border-orange-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm font-medium">Fuerza Comercial</span>
            <Users className="w-6 h-6 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-white">
            {metasSede3[0]?.total_fuerza_comercial || 0}
          </div>
          <div className="text-sm text-gray-400 mt-1">personas</div>
          <div className="text-sm mt-2 text-orange-400 font-semibold">
            {totales.totalAgrupaciones || 0} agrupaciones
          </div>
        </motion.div>
      </div>

      {/* Gráfico Principal: Ventas por Categoría */}
      {datosCategoria.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            <h3 className="text-2xl font-bold text-white">Ventas por Categoría (Kg) - Comparativa 2024 vs 2025</h3>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={datosCategoria}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="categoria" stroke="#9ca3af" angle={-20} textAnchor="end" height={100} />
              <YAxis stroke="#9ca3af" tickFormatter={(value) => formatNumber(value)} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                formatter={(value) => formatNumber(value) + ' kg'}
              />
              <Legend />
              <Bar dataKey="kg2024" fill="#6366f1" name="2024" radius={[8, 8, 0, 0]} />
              <Bar dataKey="kg2025" fill="#10b981" name="2025" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Sedes de Pollo Fiesta - NUEVO */}
      {sedes2025.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-600/5 backdrop-blur-xl rounded-xl p-6 border-2 border-blue-500/30"
        >
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-8 h-8 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">SEDES COMERCIALES POLLO FIESTA</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sedes2025.map((sede, idx) => {
              const sedeAnterior = sedes2024.find(s => s.centro_operacion === sede.centro_operacion);
              const variacion = sedeAnterior 
                ? (((sede.unidades - sedeAnterior.unidades) / sedeAnterior.unidades) * 100).toFixed(1)
                : 0;
              
              const colores = {
                'Sede U01': { 
                  bg: 'from-blue-500/20 to-blue-600/10', 
                  border: 'border-blue-500/50',
                  text: 'text-blue-400',
                  badge: 'bg-blue-500/20 text-blue-300'
                },
                'Sede U02': { 
                  bg: 'from-green-500/20 to-green-600/10', 
                  border: 'border-green-500/50',
                  text: 'text-green-400',
                  badge: 'bg-green-500/20 text-green-300'
                },
                'Sede U03': { 
                  bg: 'from-purple-500/20 to-purple-600/10', 
                  border: 'border-purple-500/50',
                  text: 'text-purple-400',
                  badge: 'bg-purple-500/20 text-purple-300'
                }
              };
              
              const color = colores[sede.centro_operacion] || colores['Sede U01'];
              
              return (
                <div key={idx} className={`bg-gradient-to-br ${color.bg} rounded-xl p-6 border-2 ${color.border} hover:scale-105 transition-transform`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`text-2xl font-bold ${color.text}`}>
                      {sede.centro_operacion.replace('Sede ', '')}
                    </div>
                    <div className={`text-xs ${color.badge} px-3 py-1 rounded-full font-semibold`}>
                      2025
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Unidades Procesadas</div>
                      <div className="text-3xl font-bold text-white">{formatNumber(sede.unidades)}</div>
                      <div className={`text-sm mt-1 font-semibold ${variacion >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {variacion > 0 ? '↑' : variacion < 0 ? '↓' : '='} {Math.abs(variacion)}% vs 2024
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-slate-600">
                      <div className="text-xs text-gray-400 mb-1">Participación</div>
                      <div className={`text-2xl font-bold ${color.text}`}>
                        {parseFloat(sede.participacion_porcentaje).toFixed(2)}%
                      </div>
                      <div className="text-xs text-gray-400 mt-1">del total procesado</div>
                    </div>
                    
                    {sede.merma_2025 && (
                      <div className="pt-3 border-t border-slate-600">
                        <div className="text-xs text-gray-400 mb-1">Control de Mermas</div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-lg font-bold text-white">{sede.merma_2025}%</div>
                            <div className="text-xs text-gray-400">Real</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-gray-300">{sede.meta_establecida}%</div>
                            <div className="text-xs text-gray-400">Meta</div>
                          </div>
                        </div>
                        <div className={`mt-2 text-xs px-2 py-1 rounded text-center font-semibold ${
                          sede.estado_evaluacion === 'Cumple' 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {sede.estado_evaluacion}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 bg-slate-700/30 rounded-lg p-4 border border-slate-600">
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-white">Red Comercial:</span> Pollo Fiesta opera con 3 sedes comerciales estratégicamente ubicadas para atender diferentes segmentos del mercado. Cada sede procesa y distribuye productos según la demanda de su zona de influencia, optimizando logística y tiempos de entrega.
            </p>
          </div>
        </motion.div>
      )}

      {/* Metas Sede 3 */}
      {metasSede3.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-xl font-bold text-white mb-4">Metas Operativas Sede 3</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metasSede3.map((meta, idx) => (
              <div key={idx} className="bg-gradient-to-br from-slate-700/50 to-slate-800/30 rounded-lg p-6 border border-slate-600">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-white">Año {meta.anio}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Kg Recibidos</div>
                    <div className="text-lg font-bold text-blue-400">{formatNumber(meta.kilos_recibidos_canal)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Kg Vendidos</div>
                    <div className="text-lg font-bold text-green-400">{formatNumber(meta.ventas_kilos_generales)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Ingresos</div>
                    <div className="text-lg font-bold text-purple-400">{formatCurrency(meta.ingresos_totales)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Precio Prom/Kg</div>
                    <div className="text-lg font-bold text-yellow-400">{formatCurrency(meta.precio_promedio_kilo)}</div>
                  </div>
                  {meta.dias_rotacion_cartera && (
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Rotación Cartera</div>
                      <div className="text-lg font-bold text-cyan-400">{meta.dias_rotacion_cartera} días</div>
                    </div>
                  )}
                  {meta.total_fuerza_comercial > 0 && (
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Fuerza Comercial</div>
                      <div className="text-lg font-bold text-orange-400">{meta.total_fuerza_comercial} personas</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
