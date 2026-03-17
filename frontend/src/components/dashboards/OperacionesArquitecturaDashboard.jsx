import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';

const DATOS = {
  arquitectura: [
    { planta: 'Planta de Beneficio', abiertas: 42, cerradas: 175, total: 217, ejecucion: 81 },
    { planta: 'Sede 1',              abiertas: 22, cerradas:   4, total:  26, ejecucion: 15 },
    { planta: 'Sede 2',              abiertas: 46, cerradas:  29, total:  75, ejecucion: 39 },
    { planta: 'Sede 3',              abiertas: 58, cerradas:  36, total:  94, ejecucion: 38 },
    { planta: 'Sede 4',              abiertas:  9, cerradas:   5, total:  14, ejecucion: 36 },
  ],
  mantenimiento: [
    { planta: 'Planta de Beneficio', abiertas: 13, cerradas: 145, total: 158, ejecucion: 92 },
    { planta: 'Sede 1',              abiertas:  3, cerradas:  17, total:  20, ejecucion: 85 },
    { planta: 'Sede 2',              abiertas: 37, cerradas:  70, total: 107, ejecucion: 65 },
    { planta: 'Sede 3',              abiertas:  5, cerradas:  70, total:  75, ejecucion: 93 },
    { planta: 'Sede 4',              abiertas:  2, cerradas:  13, total:  15, ejecucion: 87 },
  ],
};

export default function OperacionesArquitecturaDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);

  const arqTotales = { abiertas: 177, cerradas: 249, total: 426, ejecucion: 58 };
  const mantTotales = { abiertas: 60,  cerradas: 315, total: 375, ejecucion: 84 };
  const globalTotales = { abiertas: 237, cerradas: 564, total: 801, ejecucion: 70 };

  return (
    <div className="space-y-6">
      {/* Descripción */}
      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-6 border border-blue-300">
        <p className="text-gray-700">
          Actualmente tenemos un cumplimiento global del <strong className="text-blue-700">70%</strong> en la gestión de novedades correctivas reportadas por líderes de sedes. Mantenimiento presenta un desempeño del <strong className="text-green-700">84%</strong>, sin embargo, en el área de Arquitectura tenemos un <strong className="text-red-700">58%</strong>, principalmente impactada por la baja ejecución en la Sede 1 (15%) y la Sede 4 (36%). Esta área cuenta con 4 técnicos ejecutando tareas por todas las sedes — vacaciones del señor Cástulo del 2 al 20 de enero y renuncia de Edwin Torres hace 5 meses. Se solicita al área de RH resolver lo antes posible.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Arquitectura', ejecucion: 58, abiertas: 177, cerradas: 249, total: 426, color: 'red' },
          { label: 'Mantenimiento', ejecucion: 84, abiertas: 60, cerradas: 315, total: 375, color: 'green' },
          { label: 'Total General', ejecucion: 70, abiertas: 237, cerradas: 564, total: 801, color: 'blue' },
        ].map((area, idx) => (
          <motion.div key={idx}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * idx }}
            className={`bg-white/95 rounded-xl p-5 border-4 border-${area.color}-500/30`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-semibold text-sm">{area.label}</span>
              <div className={`text-3xl font-bold ${area.ejecucion >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                {area.ejecucion}%
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
              <div className={`h-2.5 rounded-full ${area.ejecucion >= 70 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${area.ejecucion}%` }} />
            </div>
            <div className="border-t border-gray-200 pt-2 space-y-0.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" /> Cerradas</span>
                <span className="font-bold text-gray-900">{area.cerradas}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 flex items-center gap-1"><XCircle className="w-3 h-3 text-red-500" /> Abiertas</span>
                <span className="font-bold text-gray-900">{area.abiertas}</span>
              </div>
              <div className="flex justify-between text-xs pt-1 border-t border-gray-100">
                <span className="text-gray-500">Total</span>
                <span className="font-bold text-gray-900">{area.total}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabla detallada */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white/95 rounded-xl border-4 border-blue-500/30">
        <CollapsibleTable
          title="Cuenta de Novedades por Área y Sede"
          defaultOpen={true}
          totalRow={[
            { label: 'Total general', color: 'text-gray-700' },
            { label: '237', sublabel: 'Abiertas', color: 'text-red-600' },
            { label: '564', sublabel: 'Cerradas', color: 'text-green-600' },
            { label: '801', sublabel: 'Total', color: 'text-gray-900' },
            { label: '70%', sublabel: 'Ejecución', color: 'text-green-700' },
          ]}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-3 text-gray-900 font-bold">Plantas</th>
                <th className="text-right py-3 px-3 text-gray-900 font-bold">Abierta</th>
                <th className="text-right py-3 px-3 text-gray-900 font-bold">Cerrada</th>
                <th className="text-right py-3 px-3 text-gray-900 font-bold">Total general</th>
                <th className="text-right py-3 px-3 text-gray-900 font-bold">Ejecución</th>
              </tr>
            </thead>
            <tbody>
              {/* Arquitectura subtotal */}
              <tr style={{ backgroundColor: '#e2e8f0' }}>
                <td className="py-2 px-3 font-bold text-gray-900">≡ Arquitectura</td>
                <td className="py-2 px-3 text-right font-bold text-gray-900">{arqTotales.abiertas}</td>
                <td className="py-2 px-3 text-right font-bold text-gray-900">{arqTotales.cerradas}</td>
                <td className="py-2 px-3 text-right font-bold text-gray-900">{arqTotales.total}</td>
                <td className="py-2 px-3 text-right font-bold text-gray-900">{arqTotales.ejecucion}%</td>
              </tr>
              {DATOS.arquitectura.map((row, idx) => (
                <tr key={idx} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}>
                  <td className="py-2 px-3 pl-6 text-gray-700">{row.planta}</td>
                  <td className="py-2 px-3 text-right text-red-600 font-semibold">{row.abiertas}</td>
                  <td className="py-2 px-3 text-right text-green-600">{row.cerradas}</td>
                  <td className="py-2 px-3 text-right text-gray-900 font-semibold">{row.total}</td>
                  <td className={`py-2 px-3 text-right font-bold ${row.ejecucion >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                    {row.ejecucion}%
                  </td>
                </tr>
              ))}
              {/* Mantenimiento subtotal */}
              <tr style={{ backgroundColor: '#e2e8f0' }}>
                <td className="py-2 px-3 font-bold text-gray-900">≡ Mantenimiento</td>
                <td className="py-2 px-3 text-right font-bold text-gray-900">{mantTotales.abiertas}</td>
                <td className="py-2 px-3 text-right font-bold text-gray-900">{mantTotales.cerradas}</td>
                <td className="py-2 px-3 text-right font-bold text-gray-900">{mantTotales.total}</td>
                <td className="py-2 px-3 text-right font-bold text-gray-900">{mantTotales.ejecucion}%</td>
              </tr>
              {DATOS.mantenimiento.map((row, idx) => (
                <tr key={idx} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}>
                  <td className="py-2 px-3 pl-6 text-gray-700">{row.planta}</td>
                  <td className="py-2 px-3 text-right text-red-600 font-semibold">{row.abiertas}</td>
                  <td className="py-2 px-3 text-right text-green-600">{row.cerradas}</td>
                  <td className="py-2 px-3 text-right text-gray-900 font-semibold">{row.total}</td>
                  <td className={`py-2 px-3 text-right font-bold ${row.ejecucion >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                    {row.ejecucion}%
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-900" style={{ backgroundColor: '#f9fafb' }}>
                <td className="py-3 px-3 font-bold text-gray-900">Total general</td>
                <td className="py-3 px-3 text-right font-bold text-red-600">{globalTotales.abiertas}</td>
                <td className="py-3 px-3 text-right font-bold text-green-600">{globalTotales.cerradas}</td>
                <td className="py-3 px-3 text-right font-bold text-gray-900">{globalTotales.total}</td>
                <td className="py-3 px-3 text-right font-bold" style={{ backgroundColor: '#fef08a', color: '#166534' }}>{globalTotales.ejecucion}%</td>
              </tr>
            </tfoot>
          </table>
        </CollapsibleTable>
      </motion.div>

      {/* Alerta RH */}
      <div className="bg-red-50 rounded-lg p-4 border border-red-300">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-700">
            <span className="font-semibold">Acción urgente — RH:</span> Arquitectura opera con 4 técnicos para todas las sedes. Vacaciones de Cástulo (2–20 enero) y renuncia de Edwin Torres (hace 5 meses) impactan directamente la ejecución en Sede 1 (15%) y Sede 4 (36%). Se solicita resolver la vacante lo antes posible.
          </div>
        </div>
      </div>
    </div>
  );
}
