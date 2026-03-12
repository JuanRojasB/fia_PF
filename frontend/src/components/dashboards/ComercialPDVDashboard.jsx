import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Store, Users, X, Info, Building2, UserCircle } from 'lucide-react';

export default function ComercialPDVDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });
  const [vistaActiva, setVistaActiva] = useState('zona'); // 'zona' o 'coordinador'

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  if (!data || typeof data !== 'object') {
    return <div className="text-gray-600">No hay datos disponibles</div>;
  }

  const { puntosVenta = [] } = data;

  // Filtrar PDV válidos (excluir Planta Principal y Fiesta Express)
  const pdvValidos = puntosVenta.filter(pdv => {
    const nombre = (pdv.nombre_pdv || '').toLowerCase();
    return !nombre.includes('planta principal') && !nombre.includes('fiesta express');
  });

  // Agrupar por zona
  const pdvPorZona = pdvValidos.reduce((acc, pdv) => {
    const zona = pdv.zona_geografica || 'Sin zona';
    if (!acc[zona]) {
      acc[zona] = [];
    }
    acc[zona].push(pdv);
    return acc;
  }, {});

  // Agrupar por coordinador
  const pdvPorCoordinador = pdvValidos.reduce((acc, pdv) => {
    const coord = pdv.coordinador || 'Sin coordinador';
    if (!acc[coord]) {
      acc[coord] = { coordinador: coord, pdvs: [], zonas: new Set() };
    }
    acc[coord].pdvs.push(pdv);
    acc[coord].zonas.add(pdv.zona_geografica);
    return acc;
  }, {});

  const coloresZona = {
    'Zona Sur': { bg: 'from-red-500/20 to-red-600/10', border: 'border-red-500/30', text: 'text-red-600', badge: 'bg-red-100 text-red-700' },
    'Zona Norte': { bg: 'from-green-500/20 to-green-600/10', border: 'border-green-500/30', text: 'text-green-600', badge: 'bg-green-100 text-green-700' },
    'Zona Centro': { bg: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/30', text: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
    'Zona Oriente': { bg: 'from-orange-500/20 to-orange-600/10', border: 'border-orange-500/30', text: 'text-orange-600', badge: 'bg-orange-100 text-orange-700' }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-xl rounded-xl p-6 border-2 border-purple-500/30"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-8 h-8 text-purple-600" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">RED DE PUNTOS DE VENTA</h2>
              <p className="text-gray-700 mt-1">Distribución por zona geográfica y coordinador comercial</p>
            </div>
          </div>
          
          {/* Toggle Vista */}
          <div className="flex gap-2 bg-white/50 rounded-lg p-1">
            <button
              onClick={() => setVistaActiva('zona')}
              className={`px-4 py-2 rounded-lg transition-all ${
                vistaActiva === 'zona' 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">Por Zona</span>
              </div>
            </button>
            <button
              onClick={() => setVistaActiva('coordinador')}
              className={`px-4 py-2 rounded-lg transition-all ${
                vistaActiva === 'coordinador' 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <UserCircle className="w-4 h-4" />
                <span className="font-medium">Por Coordinador</span>
              </div>
            </button>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal(
            'Total Puntos de Venta',
            'Pollo Fiesta cuenta con 22 puntos de venta distribuidos estratégicamente en diferentes zonas geográficas del país.'
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 cursor-pointer hover:border-blue-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Total PDV</span>
            <Store className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{pdvValidos.length}</div>
          <div className="text-xs text-gray-600 mt-1">puntos de venta</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal(
            'Zonas Geográficas',
            'Los puntos de venta están distribuidos en diferentes zonas: Sur, Norte, Centro y Oriente, cubriendo las principales ciudades del país.'
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 cursor-pointer hover:border-green-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Zonas</span>
            <MapPin className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{Object.keys(pdvPorZona).length}</div>
          <div className="text-xs text-gray-600 mt-1">zonas geográficas</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal(
            'Coordinadores Comerciales',
            'La red comercial está organizada por coordinadores zonales responsables de la gestión y operación de los puntos de venta en sus respectivas áreas.'
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 cursor-pointer hover:border-purple-500 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Coordinadores</span>
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{Object.keys(pdvPorCoordinador).length}</div>
          <div className="text-xs text-gray-600 mt-1">coordinadores activos</div>
        </motion.div>
      </div>

      {/* PDV por Zona */}
      {vistaActiva === 'zona' && Object.entries(pdvPorZona).map(([zona, pdvs], idx) => {
        const color = coloresZona[zona] || { bg: 'from-gray-500/20 to-gray-600/10', border: 'border-gray-500/30', text: 'text-gray-700', badge: 'bg-gray-100 text-gray-700' };
        
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
            className={`bg-gradient-to-br ${color.bg} backdrop-blur-xl rounded-xl p-6 border-2 ${color.border}`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${color.badge}`}>
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className={`text-2xl font-bold ${color.text}`}>{zona}</h4>
                  <div className="text-sm text-gray-700 mt-1">{pdvs.length} puntos de venta</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {pdvs.map((pdv, pidx) => (
                <motion.div 
                  key={pidx} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + pidx * 0.05 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-5 h-5 text-gray-600" />
                        <div className="text-gray-900 font-bold text-base">{pdv.nombre_pdv}</div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                        <UserCircle className="w-4 h-4" />
                        <span className="font-medium">{pdv.coordinador}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                    <span className="text-xs text-gray-500">{pdv.tipo_sede}</span>
                    <div className={`px-2 py-1 rounded-full text-xs font-bold ${pdv.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {pdv.estado}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* PDV por Coordinador */}
      {vistaActiva === 'coordinador' && Object.entries(pdvPorCoordinador).map(([coord, data], idx) => {
        const zonasArray = Array.from(data.zonas);
        const colorPrincipal = coloresZona[zonasArray[0]] || { bg: 'from-gray-500/20 to-gray-600/10', border: 'border-gray-500/30', text: 'text-gray-700', badge: 'bg-gray-100 text-gray-700' };
        
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
            className={`bg-gradient-to-br ${colorPrincipal.bg} backdrop-blur-xl rounded-xl p-6 border-2 ${colorPrincipal.border}`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${colorPrincipal.badge}`}>
                  <UserCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className={`text-2xl font-bold ${colorPrincipal.text}`}>{data.coordinador}</h4>
                  <div className="text-sm text-gray-700 mt-1">
                    {data.pdvs.length} puntos de venta • {zonasArray.join(', ')}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.pdvs.map((pdv, pidx) => {
                const zonaColor = coloresZona[pdv.zona_geografica] || { badge: 'bg-gray-100 text-gray-700' };
                return (
                  <motion.div 
                    key={pidx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + pidx * 0.05 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="w-5 h-5 text-gray-600" />
                          <div className="text-gray-900 font-bold text-base">{pdv.nombre_pdv}</div>
                        </div>
                        <div className={`inline-flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-lg ${zonaColor.badge}`}>
                          <MapPin className="w-3 h-3" />
                          <span>{pdv.zona_geografica}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                      <span className="text-xs text-gray-500">{pdv.tipo_sede}</span>
                      <div className={`px-2 py-1 rounded-full text-xs font-bold ${pdv.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {pdv.estado}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      })}

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
