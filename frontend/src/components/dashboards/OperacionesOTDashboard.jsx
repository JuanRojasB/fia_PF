import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Info, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import CollapsibleTable from '../CollapsibleTable';
import CollapsibleChart from '../CollapsibleChart';
import { CustomBarTooltip } from './CustomTooltip';

export default function OperacionesOTDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null, table: null });

  const openModal = (title, content, table = null) => {
    setModalContent({ title, content, table });
    setModalOpen(true);
  };

  if (!data || !data.ordenesTrabajo) {
    // datos hardcodeados, continuar con array vacío
  }

  const { ordenesTrabajo = [], totales } = data || {};

  const datosOT = ordenesTrabajo.map(o => ({
    mes: o.mes_nombre?.substring(0, 3) || o.mes_num,
    mesCompleto: o.mes_nombre || `Mes ${o.mes_num}`,
    Correctivas: parseInt(o.ot_correctivas) || 0,
    Preventivas: parseInt(o.ot_preventivas) || 0,
    total: (parseInt(o.ot_preventivas) || 0) + (parseInt(o.ot_correctivas) || 0),
  }));

  // Regresión lineal tendencia
  const n = datosOT.length;
  const sumX = datosOT.reduce((s, _, i) => s + i, 0);
  const sumY = datosOT.reduce((s, d) => s + d.total, 0);
  const sumXY = datosOT.reduce((s, d, i) => s + i * d.total, 0);
  const sumX2 = datosOT.reduce((s, _, i) => s + i * i, 0);
  const slope = n > 2 ? (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX) : 0;
  const intercept = n > 2 ? (sumY - slope * sumX) / n : 0;
  const datosOTConTend = datosOT.map((d, i) => ({ ...d, tendencia: parseFloat((intercept + slope * i).toFixed(2)) }));

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-6 border border-purple-300">
        <p className="text-gray-700">El <strong className="text-green-700">88%</strong> de las intervenciones fueron de carácter preventivo y <strong>12% correctivas</strong> de acuerdo con reporte SIESA, lo que indica que se tiene un enfoque preventivo sólido.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Análisis de la Gestión de Órdenes de Trabajo (OT) SIESA 2025</h3>
            <p className="text-sm text-gray-600 mt-1">El 88% preventivo y 12% correctivas</p>
          </div>
          <button onClick={() => openModal('Análisis Detallado de Órdenes de Trabajo 2025',
            <div className="space-y-4">
              <p className="text-gray-700">El <strong className="text-green-600">88%</strong> de las intervenciones fueron preventivas y <strong>12% correctivas</strong>.</p>
              <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300">
                <p className="text-sm font-semibold text-red-800 mb-2">Meses con Más Correctivas:</p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li><strong>Enero:</strong> 35,8%</li>
                  <li><strong>Agosto:</strong> 26%</li>
                  <li><strong>Febrero:</strong> 25,7%</li>
                  <li><strong>Marzo:</strong> 23,7%</li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                <p className="text-sm font-semibold text-green-800 mb-2">Mejor Gestión Preventiva:</p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li><strong>Diciembre:</strong> 2% correctivas</li>
                  <li><strong>Noviembre:</strong> 3% correctivas</li>
                  <li><strong>Junio:</strong> 4,3% correctivas</li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Conclusión:</p>
                <p className="text-sm text-gray-700">El enfoque preventivo sólido evidencia una gestión planificada del mantenimiento. Se debe continuar fortaleciendo el mantenimiento predictivo para reducir las correctivas en los meses de mayor producción.</p>
              </div>
            </div>
          )} className="cursor-pointer hover:opacity-70 transition-opacity">
            <Info className="w-6 h-6 text-purple-600" />
          </button>
        </div>

        <CollapsibleChart title="Órdenes de Trabajo por Mes" defaultOpen={false}>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={datosOTConTend} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <XAxis dataKey="mes" stroke="#6b7280" style={{ fontSize: '12px' }} angle={-45} textAnchor="end" height={60} />
              <YAxis stroke="#6b7280" style={{ fontSize: '13px' }} />
              <Tooltip content={<CustomBarTooltip borderColor="#a855f7" />} />
              <Bar dataKey="Preventivas" stackId="a" fill="#10b981" />
              <Bar dataKey="Correctivas" stackId="a" fill="#ef4444" radius={[8, 8, 0, 0]} />
              <Line type="linear" dataKey="tendencia" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Tendencia Total OT" />
            </ComposedChart>
          </ResponsiveContainer>
        </CollapsibleChart>

        <CollapsibleTable
          title="Detalle Mensual de OT"
          defaultOpen={false}
          totalRow={[
            { label: 'Total general' },
            { label: '403', color: 'text-red-600' },
            { label: '3.298', color: 'text-green-600' },
            { label: '3.701', color: 'text-gray-900' },
            { label: '10,9%', color: 'text-green-600' },
          ]}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-3 text-gray-900 font-bold">Mes</th>
                <th className="text-right py-3 px-3 text-gray-900 font-bold">OT Correctiva</th>
                <th className="text-right py-3 px-3 text-gray-900 font-bold">OT Preventiva</th>
                <th className="text-right py-3 px-3 text-gray-900 font-bold">Total</th>
                <th className="text-right py-3 px-3 text-gray-900 font-bold">% Correctivos</th>
              </tr>
            </thead>
            <tbody>
              {ordenesTrabajo.map((mes, idx) => {
                const pct = parseFloat(mes.porcentaje_correctivas);
                return (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-3 text-gray-900 font-semibold">{mes.mes_nombre}</td>
                    <td className="py-3 px-3 text-right text-red-600 font-bold">{mes.ot_correctivas}</td>
                    <td className="py-3 px-3 text-right text-green-600">{mes.ot_preventivas}</td>
                    <td className="py-3 px-3 text-right text-gray-900 font-bold">{mes.total}</td>
                    <td className={`py-3 px-3 text-right font-bold ${pct > 15 ? 'text-red-600' : 'text-green-600'}`}>{mes.porcentaje_correctivas}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CollapsibleTable>

        <div className="mt-4 bg-green-50 rounded-lg p-4 border border-green-300">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <span className="font-semibold text-gray-900">Enfoque Preventivo:</span> El 88% de las intervenciones fueron de carácter preventivo y 12% correctivas de acuerdo con reporte SIESA, lo que indica que se tiene un enfoque preventivo sólido.
            </div>
          </div>
        </div>
      </motion.div>

      {createPortal(
        <AnimatePresence>
          {modalOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
              onClick={() => setModalOpen(false)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-cyan-500 shadow-2xl"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Info className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-xl font-bold text-gray-900">{modalContent.title}</h3>
                  </div>
                  <button onClick={() => setModalOpen(false)} className="text-gray-600 hover:text-gray-900"><X className="w-6 h-6" /></button>
                </div>
                <div className="text-gray-700 leading-relaxed">{modalContent.content}</div>
                <div className="mt-6 flex justify-end">
                  <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Entendido</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>, document.body
      )}
    </div>
  );
}
