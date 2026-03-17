import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Store, Users, X, Info, UserCircle, TrendingUp, Package } from 'lucide-react';

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

  const { resumen, coordinadores = [], crecimiento = {} } = data;
  const destacados = crecimiento.destacados || [];

  const fmt = (n) => new Intl.NumberFormat('es-CO').format(n ?? 0);
  const fmtPesos = (n) => `$${new Intl.NumberFormat('es-CO').format(n ?? 0)}`;

  const kilos2024 = crecimiento.kilos_2024 ?? 2013000;
  const kilos2025 = crecimiento.kilos_2025 ?? 2451000;
  const pesos2024 = crecimiento.pesos_2024 ?? 18830000000;
  const pesos2025 = crecimiento.pesos_2025 ?? 23818000000;
  const d0 = destacados[0] ?? { nombre: 'Toberín', aporte_pesos: 2222000000, kilos: 171000 };
  const d1 = destacados[1] ?? { nombre: 'Distribuidora Yopal', aporte_pesos: 6922000000, kilos: 755000 };

  return (
    <div className="space-y-6">
      {/* Descripción */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 backdrop-blur-xl rounded-xl p-5 border border-purple-500/30">
        <p className="text-gray-700 leading-relaxed text-sm">
          Pollo Fiesta cuenta con puntos de venta distribuidos en diferentes zonas del país, coordinados por 7 líderes comerciales. En 2025 los PDV crecieron un <strong className="text-green-700">21,76% en kilos</strong> (de {fmt(kilos2024)} a {fmt(kilos2025)} kilos) y un <strong className="text-green-700">26,49% en ventas</strong> (de {fmtPesos(pesos2024)} en 2024 a {fmtPesos(pesos2025)} en 2025). El punto Toberín aportó {fmtPesos(d0.aporte_pesos)} adicionales con {fmt(d0.kilos)} kilos, y la distribuidora Yopal aportó {fmtPesos(d1.aporte_pesos)} con {fmt(d1.kilos)} kilos vendidos.
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
                  <li>7 PDV — Elmira Gonzalez (6 sur de Bogotá, 1 Fusagasugá)</li>
                  <li>5 PDV — Michael Arias (Norte de Bogotá)</li>
                  <li>5 PDV — Julián Mora (4 Yopal, 1 Aguazul)</li>
                  <li>2 PDV — John Ramirez (Tunja, Sogamoso)</li>
                  <li>1 PDV — Adriana (Chiquinquirá)</li>
                  <li>1 PDV — Ivan Romero (Frigorífico Guadalupe)</li>
                  <li>1 PDV — Belisario Eguis (Visión Colombia)</li>
                </ul>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Total Puntos de Venta 2025</span>
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
              <p className="mb-4">La red de puntos de venta está gestionada por <strong className="text-blue-600">7 coordinadores comerciales</strong>.</p>
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
            <span className="text-gray-600 text-sm">Coordinadores PDV 2025</span>
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
            'Crecimiento Ventas PDV 2025',
            <div className="text-gray-700 space-y-3">
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                <p className="font-semibold text-gray-900 mb-2">Crecimiento en Ventas: <span className="text-green-600">+26,49%</span></p>
                <p className="text-sm">De <strong>{fmtPesos(pesos2024)}</strong> en 2024 a <strong>{fmtPesos(pesos2025)}</strong> en 2025</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                <p className="font-semibold text-gray-900 mb-2">Destacados 2025:</p>
                <p className="text-sm">• Toberín: {fmtPesos(d0.aporte_pesos)} adicionales, {fmt(d0.kilos)} kilos</p>
                <p className="text-sm">• Distribuidora Yopal: {fmtPesos(d1.aporte_pesos)}, {fmt(d1.kilos)} kilos</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Crecimiento Ventas 2025 vs 2024</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">+26,49%</div>
          <div className="text-sm text-gray-600 mt-1">En pesos vs 2024</div>
          <div className="mt-3 pt-3 border-t border-gray-200 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{fmtPesos(pesos2024)}</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{fmtPesos(pesos2025)}</span></div>
            <div className="text-sm font-bold text-green-600">Dif: +{fmtPesos(pesos2025 - pesos2024)}</div>
          </div>
          <Info className="w-4 h-4 text-green-600 animate-pulse mt-2" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal(
            'Crecimiento en Kilos PDV 2025',
            <div className="text-gray-700 space-y-3">
              <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-300">
                <p className="font-semibold text-gray-900 mb-2">Volumen Total 2025:</p>
                <p className="text-3xl font-bold text-orange-600">{fmt(kilos2025)} kg</p>
                <p className="text-sm text-gray-600 mt-2">vs {fmt(kilos2024)} kg en 2024</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-300">
                <p className="font-semibold text-gray-900 mb-1">Crecimiento: <span className="text-orange-600">+21,76%</span></p>
                <p className="text-sm">Diferencia: <strong>+{fmt(kilos2025 - kilos2024)} kg</strong></p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Crecimiento Kilos 2025 vs 2024</span>
            <Package className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">+21,76%</div>
          <div className="text-sm text-gray-600 mt-1">En kilos vs 2024</div>
          <div className="mt-3 pt-3 border-t border-gray-200 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{fmt(kilos2024)} kg</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{fmt(kilos2025)} kg</span></div>
            <div className="text-sm font-bold text-orange-600">Dif: +{fmt(kilos2025 - kilos2024)} kg</div>
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
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900">Distribución de Puntos de Venta por Coordinador 2025</h3>
          <p className="text-sm text-gray-600 mt-1">7 coordinadores · 22 puntos de venta en todo el país</p>
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

      {/* Destacados 2025 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Puntos Destacados 2025</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Toberín */}
          <div
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200 cursor-pointer hover:border-green-400 transition-all"
            onClick={() => openModal(
              'Toberín — Punto Destacado 2025',
              <div className="text-gray-700 space-y-3">
                <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                  <p className="font-semibold mb-1">Incremento vs 2024</p>
                  <p className="text-2xl font-bold text-green-600">{fmtPesos(d0.aporte_pesos)}</p>
                  <p className="text-sm text-gray-500 mt-1">Este valor representa el aporte adicional generado por el punto Toberín en 2025 respecto al año anterior.</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-300">
                  <p className="font-semibold mb-1">Kilos vendidos 2025</p>
                  <p className="text-2xl font-bold text-orange-600">{fmt(d0.kilos)} kg</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                  <p className="text-sm text-gray-700">Toberín es uno de los puntos de venta coordinados por <strong>Michael Arias</strong> en el Norte de Bogotá.</p>
                </div>
              </div>
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-lg font-bold text-gray-900">{d0.nombre}</h4>
              <Info className="w-4 h-4 text-green-600 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Aporte adicional vs 2024:</span>
                <span className="font-bold text-green-700">{fmtPesos(d0.aporte_pesos)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Kilos vendidos:</span>
                <span className="font-bold text-orange-700">{fmt(d0.kilos)} kg</span>
              </div>
            </div>
          </div>

          {/* Distribuidora Yopal */}
          <div
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200 cursor-pointer hover:border-green-400 transition-all"
            onClick={() => openModal(
              'Distribuidora Yopal — Punto Destacado 2025',
              <div className="text-gray-700 space-y-3">
                <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                  <p className="font-semibold mb-1">Ventas totales 2025</p>
                  <p className="text-2xl font-bold text-green-600">{fmtPesos(d1.aporte_pesos)}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-300">
                  <p className="font-semibold mb-1">Kilos vendidos 2025</p>
                  <p className="text-2xl font-bold text-orange-600">{fmt(d1.kilos)} kg</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                  <p className="text-sm text-gray-700">La distribuidora Yopal hace parte de los 5 locales coordinados por <strong>Julián Mora</strong>, con 4 puntos en Yopal y 1 en Aguazul.</p>
                </div>
              </div>
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-lg font-bold text-gray-900">{d1.nombre}</h4>
              <Info className="w-4 h-4 text-green-600 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Ventas totales 2025:</span>
                <span className="font-bold text-green-700">{fmtPesos(d1.aporte_pesos)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Kilos vendidos:</span>
                <span className="font-bold text-orange-700">{fmt(d1.kilos)} kg</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

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
                className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-blue-500 shadow-2xl max-h-[90vh] overflow-y-auto"
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
                  <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    Entendido
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
