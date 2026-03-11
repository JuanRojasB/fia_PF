import { motion } from 'framer-motion';
import { MapPin, Users } from 'lucide-react';

export default function ComercialPDVDashboard({ data }) {
  if (!data || typeof data !== 'object') {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const {
    pdvParticipacionZona = [],
    puntosVenta = []
  } = data;

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO').format(value);
  };

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30">
        <div className="flex items-center gap-3">
          <MapPin className="w-8 h-8 text-purple-400" />
          <div>
            <h2 className="text-3xl font-bold text-white">Puntos de Venta por Zona</h2>
            <p className="text-gray-400 mt-1">Análisis de participación y desempeño - Año 2024</p>
          </div>
        </div>
      </div>

      {/* Distribución PDV por Zona con Datos Reales 2024 */}
      {pdvParticipacionZona.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <div className="space-y-6">
            {Object.entries(pdvParticipacionZona.reduce((acc, pdv) => {
              const zona = pdv.zona_asignacion || 'Sin zona';
              if (!acc[zona]) acc[zona] = [];
              acc[zona].push(pdv);
              return acc;
            }, {})).map(([zona, pdvs], idx) => {
              const colores = {
                'Zona Sur': { bg: 'from-red-500/20 to-red-600/10', border: 'border-red-500/30', text: 'text-red-400' },
                'Zona Norte': { bg: 'from-green-500/20 to-green-600/10', border: 'border-green-500/30', text: 'text-green-400' },
                'Zona Centro': { bg: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/30', text: 'text-blue-400' },
                'Zona Oriente': { bg: 'from-orange-500/20 to-orange-600/10', border: 'border-orange-500/30', text: 'text-orange-400' }
              };
              const color = colores[zona] || { bg: 'from-gray-500/20 to-gray-600/10', border: 'border-gray-500/30', text: 'text-gray-400' };
              
              // Calcular totales de la zona
              const totalKilosZona = parseFloat(pdvs[0]?.zona_total_kilos || 0);
              const totalHuevosZona = parseInt(pdvs[0]?.zona_total_huevos || 0);
              
              return (
                <div key={idx} className={`bg-gradient-to-br ${color.bg} backdrop-blur-xl rounded-xl p-5 border ${color.border}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className={`text-2xl font-bold ${color.text}`}>{zona}</h4>
                      <div className="text-sm text-gray-400 mt-1">
                        Total: {formatNumber(totalKilosZona)} kg pollo • {formatNumber(totalHuevosZona)} und huevo
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full bg-slate-700/50 ${color.text} font-bold text-lg`}>
                      {pdvs.length} PDV
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pdvs.map((pdv, pidx) => (
                      <div key={pidx} className="bg-slate-700/40 backdrop-blur-sm rounded-lg p-4 border border-slate-600/50 hover:border-slate-500 transition-all">
                        <div className="mb-3">
                          <div className="text-white font-bold text-base mb-2">{pdv.nombre_pdv}</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="bg-slate-700/30 rounded p-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-gray-400">Pollo</span>
                              <span className="text-sm font-bold text-blue-400">{formatNumber(pdv.pdv_kilos_pollo)} kg</span>
                            </div>
                            <div className="w-full bg-slate-600/30 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${Math.min(parseFloat(pdv.participacion_pollo_pct || 0), 100)}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">{pdv.participacion_pollo_pct}% de la zona</div>
                          </div>
                          
                          <div className="bg-slate-700/30 rounded p-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-gray-400">Huevo</span>
                              <span className="text-sm font-bold text-yellow-400">{formatNumber(pdv.pdv_unidades_huevo)} und</span>
                            </div>
                            <div className="w-full bg-slate-600/30 rounded-full h-2">
                              <div 
                                className="bg-yellow-500 h-2 rounded-full" 
                                style={{ width: `${Math.min(parseFloat(pdv.participacion_huevo_pct || 0), 100)}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">{pdv.participacion_huevo_pct}% de la zona</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Resumen de Coordinadores */}
      {puntosVenta.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-blue-400" />
            <h3 className="text-2xl font-bold text-white">Coordinadores por Zona</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(puntosVenta.reduce((acc, pdv) => {
              const zona = pdv.zona || 'Sin zona';
              if (!acc[zona]) {
                acc[zona] = {
                  pdvs: [],
                  coordinadores: new Set()
                };
              }
              acc[zona].pdvs.push(pdv);
              if (pdv.coordinador_responsable) {
                acc[zona].coordinadores.add(pdv.coordinador_responsable);
              }
              return acc;
            }, {})).map(([zona, data], idx) => {
              const colores = {
                'Sur': { bg: 'from-red-500/20 to-red-600/10', border: 'border-red-500/30', text: 'text-red-400' },
                'Norte': { bg: 'from-green-500/20 to-green-600/10', border: 'border-green-500/30', text: 'text-green-400' },
                'Centro': { bg: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/30', text: 'text-blue-400' },
                'Oriente': { bg: 'from-orange-500/20 to-orange-600/10', border: 'border-orange-500/30', text: 'text-orange-400' }
              };
              const color = colores[zona] || { bg: 'from-gray-500/20 to-gray-600/10', border: 'border-gray-500/30', text: 'text-gray-400' };
              
              return (
                <div key={idx} className={`bg-gradient-to-br ${color.bg} backdrop-blur-xl rounded-xl p-5 border ${color.border}`}>
                  <div className="text-center mb-4">
                    <h4 className={`text-xl font-bold ${color.text} mb-2`}>Zona {zona}</h4>
                    <div className={`text-4xl font-bold text-white mb-1`}>{data.pdvs.length}</div>
                    <div className="text-sm text-gray-400">Puntos de Venta</div>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t border-slate-600/50">
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <Users className="w-4 h-4" />
                      <span>{data.coordinadores.size} Coordinador{data.coordinadores.size !== 1 ? 'es' : ''}</span>
                    </div>
                    <div className="text-xs text-gray-400 max-h-20 overflow-y-auto">
                      {Array.from(data.coordinadores).map((coord, cidx) => (
                        <div key={cidx} className="py-1">• {coord}</div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
