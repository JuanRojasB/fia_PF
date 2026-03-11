import { motion } from 'framer-motion';
import { Egg, TrendingUp, TrendingDown } from 'lucide-react';

export default function ComercialHuevoDashboard({ data }) {
  if (!data || typeof data !== 'object') {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const {
    ventasHuevo = [],
    comparativoHuevo = []
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

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-xl p-6 border border-yellow-500/30">
        <div className="flex items-center gap-3">
          <Egg className="w-8 h-8 text-yellow-400" />
          <div>
            <h2 className="text-3xl font-bold text-white">Ventas de Huevo</h2>
            <p className="text-gray-400 mt-1">Análisis de ventas por raza y comparativas multianuales</p>
          </div>
        </div>
      </div>

      {/* Tabla de Ventas de Huevo */}
      {ventasHuevo.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-xl font-bold text-white mb-4">Ventas de Huevo por Raza</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-600">
                  <th className="text-left py-3 px-4 text-gray-300 font-bold">Año</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-bold">Raza</th>
                  <th className="text-right py-3 px-4 text-gray-300 font-bold">Unidades</th>
                  <th className="text-right py-3 px-4 text-gray-300 font-bold">Precio Prom.</th>
                  <th className="text-right py-3 px-4 text-gray-300 font-bold">Ingresos</th>
                  <th className="text-right py-3 px-4 text-gray-300 font-bold">Utilidad (M)</th>
                  <th className="text-right py-3 px-4 text-gray-300 font-bold">Margen %</th>
                </tr>
              </thead>
              <tbody>
                {ventasHuevo.map((v, idx) => (
                  <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-4 text-white font-medium">{v.anio}</td>
                    <td className="py-3 px-4 text-white">{v.raza_produccion}</td>
                    <td className="py-3 px-4 text-right text-blue-400 font-bold">{formatNumber(v.unidades_vendidas)}</td>
                    <td className="py-3 px-4 text-right text-green-400">{formatCurrency(v.precio_promedio_unidad)}</td>
                    <td className="py-3 px-4 text-right text-purple-400 font-bold">{formatCurrency(v.ingresos_totales_calculados)}</td>
                    <td className="py-3 px-4 text-right text-yellow-400">${v.utilidad_neta_millones}M</td>
                    <td className={`py-3 px-4 text-right font-bold ${v.margen_neto_pct > 10 ? 'text-green-400' : v.margen_neto_pct > 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {v.margen_neto_pct}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Comparativo Multianual de Huevo */}
      {comparativoHuevo.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-xl font-bold text-white mb-6">Análisis Comparativo Multianual - Ventas de Huevo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {comparativoHuevo.map((comp, idx) => (
              <div key={idx} className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 backdrop-blur-xl rounded-lg p-6 border border-yellow-500/30">
                <div className="text-center mb-4">
                  <div className="text-xl font-bold text-white mb-2">{comp.periodo_comparado}</div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-2 flex items-center justify-center gap-2">
                      {parseInt(comp.variacion_unidades) >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                      <span>Variación en Unidades</span>
                    </div>
                    <div className={`text-2xl font-bold ${parseInt(comp.variacion_unidades) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {parseInt(comp.variacion_unidades) >= 0 ? '+' : ''}{formatNumber(comp.variacion_unidades)}
                    </div>
                    <div className={`text-sm font-bold ${parseFloat(comp.variacion_unidades_pct) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {parseFloat(comp.variacion_unidades_pct) >= 0 ? '+' : ''}{comp.variacion_unidades_pct}%
                    </div>
                  </div>
                  <div className="border-t border-slate-600 pt-4">
                    <div className="text-sm text-gray-400 mb-2 flex items-center justify-center gap-2">
                      {parseFloat(comp.variacion_precio) >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                      <span>Variación en Precio</span>
                    </div>
                    <div className={`text-2xl font-bold ${parseFloat(comp.variacion_precio) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {parseFloat(comp.variacion_precio) >= 0 ? '+' : ''}{formatCurrency(comp.variacion_precio)}
                    </div>
                    <div className={`text-sm font-bold ${parseFloat(comp.variacion_precio_pct) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {parseFloat(comp.variacion_precio_pct) >= 0 ? '+' : ''}{comp.variacion_precio_pct}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
