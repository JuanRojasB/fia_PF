import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MapPin, Store, Users, X, Info, Building2, UserCircle, TrendingUp, Package } from 'lucide-react';

export default function ComercialPDVDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  };

  if (!data || !data.resumen) {
    return <div className="text-gray-600">No hay datos disponibles</div>;
  }

  const { resumen, coordinadores, crecimientoBogota } = data;

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO').format(value);
  };

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return '$0';
    return `$${new Intl.NumberFormat('es-CO').format(value)}`;
  };

  return (
    <div className="space-y-6">
      {/* Descripción */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30">
        <p className="text-gray-700">
          Pollo Fiesta cuenta con {resumen.total_pdv} puntos de venta distribuidos estratégicamente en diferentes zonas del país. Haga clic en los gráficos para ver detalles.
        </p>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal(
            'Total Puntos de Venta',
            <div className="text-gray-700">
              <p className="mb-4">Pollo Fiesta cuenta con <strong className="text-purple-600">22 puntos de venta</strong> distribuidos estratégicamente en diferentes zonas del país.</p>
              <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300">
                <p className="font-semibold mb-2">Distribución:</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>7 PDV coordinados por Elmira Gonzalez (Sur de Bogotá y Fusagasugá)</li>
                  <li>5 PDV coordinados por Michael Arias (Norte de Bogotá)</li>
                  <li>5 PDV coordinados por Julián Mora (Yopal y Aguazul)</li>
                  <li>2 PDV coordinados por John Ramirez (Tunja y Sogamoso)</li>
                  <li>1 PDV coordinado por Adriana (Chiquinquirá)</li>
                  <li>1 PDV coordinado por Ivan Romero (Guadalupe)</li>
                  <li>1 PDV coordinado por Belisario Eguis (Visión Colombia)</li>
                </ul>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Total PDV</span>
            <Store className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{resumen.total_pdv}</div>
          <div className="text-sm text-gray-600 mt-1">Puntos de venta activos</div>
          <Info className="w-4 h-4 text-purple-600 animate-pulse mt-2" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal(
            'Coordinadores Comerciales',
            <div className="text-gray-700">
              <p className="mb-4">La red de puntos de venta está gestionada por <strong className="text-blue-600">7 coordinadores comerciales</strong> especializados en diferentes zonas geográficas.</p>
              <div className="space-y-3">
                {coordinadores.map((coord, idx) => (
                  <div key={idx} className="bg-blue-50 rounded-lg p-3 border-2 border-blue-300">
                    <p className="font-semibold text-gray-900">{coord.nombre}</p>
                    <p className="text-sm text-gray-600">{coord.cantidad_pdv} {coord.cantidad_pdv === 1 ? 'punto de venta' : 'puntos de venta'}</p>
                    <p className="text-xs text-gray-500 mt-1">{coord.ubicaciones.join(', ')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Coordinadores</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{resumen.total_coordinadores}</div>
          <div className="text-sm text-gray-600 mt-1">Coordinadores comerciales</div>
          <Info className="w-4 h-4 text-blue-600 animate-pulse mt-2" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal(
            'Crecimiento Bogotá 2025',
            <div className="text-gray-700">
              <p className="mb-4">Para el año 2025, los puntos de venta en Bogotá tuvieron un crecimiento significativo:</p>
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                  <p className="font-semibold text-gray-900 mb-2">Crecimiento en Kilos: <span className="text-green-600">+7%</span></p>
                  <p className="text-sm">Se pasó de <strong>675 toneladas</strong> en 2024 a <strong>723 toneladas</strong> en 2025</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                  <p className="font-semibold text-gray-900 mb-2">Crecimiento en Ventas: <span className="text-green-600">+9%</span></p>
                  <p className="text-sm">Se pasó de <strong>${formatNumber(5964898060)}</strong> en 2024 a <strong>${formatNumber(6514296741)}</strong> en 2025</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                  <p className="font-semibold text-gray-900 mb-2">Zona Norte - Destacada:</p>
                  <p className="text-sm">Creció un <strong className="text-blue-600">12% en kilos</strong> y <strong className="text-blue-600">18% en ventas</strong></p>
                </div>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Crecimiento Bogotá</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">+{crecimientoBogota.crecimiento_kilos_pct}%</div>
          <div className="text-sm text-gray-600 mt-1">En kilos 2025 vs 2024</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Crecimiento en ventas</div>
            <div className="text-lg font-semibold text-green-600">+{crecimientoBogota.crecimiento_millones_pct}%</div>
          </div>
          <Info className="w-4 h-4 text-green-600 animate-pulse mt-2" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal(
            'Ventas Bogotá 2025',
            <div className="text-gray-700">
              <p className="mb-4">Resultados de ventas en Bogotá para el año 2025:</p>
              <div className="space-y-4">
                <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-300">
                  <p className="font-semibold text-gray-900 mb-2">Volumen Total:</p>
                  <p className="text-3xl font-bold text-orange-600">{crecimientoBogota.kilos_2025_ton} toneladas</p>
                  <p className="text-sm text-gray-600 mt-2">Comparado con {crecimientoBogota.kilos_2024_ton} toneladas en 2024</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-300">
                  <p className="font-semibold text-gray-900 mb-2">Valor en Ventas:</p>
                  <p className="text-3xl font-bold text-orange-600">${formatNumber(crecimientoBogota.millones_2025)} millones</p>
                  <p className="text-sm text-gray-600 mt-2">Comparado con ${formatNumber(crecimientoBogota.millones_2024)} millones en 2024</p>
                </div>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Ventas Bogotá 2025</span>
            <Package className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{crecimientoBogota.kilos_2025_ton} ton</div>
          <div className="text-sm text-gray-600 mt-1">Toneladas vendidas</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Valor en millones</div>
            <div className="text-lg font-semibold text-orange-600">${formatNumber(crecimientoBogota.millones_2025)}M</div>
          </div>
          <Info className="w-4 h-4 text-orange-600 animate-pulse mt-2" />
        </motion.div>
      </div>

      {/* Distribución por Coordinador */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Distribución de Puntos de Venta por Coordinador</h3>
            <p className="text-sm text-gray-600 mt-1">Organización de la red comercial</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coordinadores.map((coord, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5 border-2 border-purple-200"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <UserCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900">{coord.nombre}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Store className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{coord.cantidad_pdv} {coord.cantidad_pdv === 1 ? 'punto de venta' : 'puntos de venta'}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                {coord.ubicaciones.map((ub, ubIdx) => (
                  <div key={ubIdx} className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700">{ub}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Crecimiento Bogotá por Zona */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        onClick={() => openModal(
          'Crecimiento Bogotá - Detalle Completo',
          <div className="text-gray-700">
            <p className="mb-4 font-semibold">Análisis de crecimiento por zona en Bogotá</p>
            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Zona Norte:</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Crecimiento en kilos: <strong className="text-green-600">+12%</strong> (217 ton en 2024 → 244 ton en 2025)</li>
                  <li>Crecimiento en ventas: <strong className="text-green-600">+18%</strong> (${formatNumber(2123022507)} → ${formatNumber(2503649389)})</li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Zona Sur:</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Crecimiento en kilos: <strong className="text-blue-600">+7%</strong></li>
                  <li>Crecimiento en ventas: <strong className="text-blue-600">+7%</strong></li>
                </ul>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300">
                <p className="text-sm font-semibold text-gray-900 mb-2">Total Bogotá:</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Crecimiento en kilos: <strong className="text-purple-600">+7%</strong> (675 ton en 2024 → 723 ton en 2025)</li>
                  <li>Crecimiento en ventas: <strong className="text-purple-600">+9%</strong> (${formatNumber(5964898060)} → ${formatNumber(6514296741)})</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Crecimiento Bogotá 2025 vs 2024</h3>
            <p className="text-sm text-gray-600 mt-1">Comparación por zona (kilos y millones de pesos)</p>
          </div>
          <Info className="w-5 h-5 text-blue-600 animate-pulse" />
        </div>
        <div>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={crecimientoBogota.por_zona} margin={{ left: 30, right: 30, bottom: 10, top: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis 
                dataKey="zona" 
                stroke="#1f2937"
                style={{ fontSize: '14px', fontWeight: '700' }}
              />
              <YAxis 
                stroke="#1f2937" 
                tickFormatter={(value) => `${value}%`}
                label={{ value: 'Crecimiento %', angle: -90, position: 'insideLeft', style: { fontSize: '14px', fontWeight: '700' } }}
                style={{ fontSize: '14px', fontWeight: '700' }}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const zonaData = crecimientoBogota.por_zona.find(z => z.zona === label);
                    return (
                      <div style={{ 
                        backgroundColor: '#ffffff', 
                        border: '2px solid #10b981',
                        borderRadius: '8px',
                        padding: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}>
                        <p style={{ color: '#111827', fontWeight: 'bold', marginBottom: '8px' }}>{label}</p>
                        <div style={{ marginBottom: '8px' }}>
                          <p style={{ color: '#059669', padding: '4px 0', margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
                            Kilos: +{zonaData.crecimiento_kilos}%
                          </p>
                          <p style={{ color: '#059669', padding: '0', margin: 0, fontSize: '12px' }}>
                            {zonaData.kilos_2024} ton (2024) → {zonaData.kilos_2025} ton (2025)
                          </p>
                        </div>
                        <div>
                          <p style={{ color: '#8b5cf6', padding: '4px 0', margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
                            Ventas: +{zonaData.crecimiento_millones}%
                          </p>
                          <p style={{ color: '#8b5cf6', padding: '0', margin: 0, fontSize: '12px' }}>
                            ${formatNumber(zonaData.millones_2024)}M → ${formatNumber(zonaData.millones_2025)}M
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="crecimiento_kilos" name="Crecimiento Kilos %" fill="#059669" radius={[8, 8, 0, 0]} />
              <Bar dataKey="crecimiento_millones" name="Crecimiento Ventas %" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

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
              className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-purple-500 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-gray-900">{modalContent.title}</h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-gray-600 hover:text-gray-900 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-gray-700 leading-relaxed">{modalContent.content}</div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
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
