import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, DollarSign, Building, FileText, X, Info, Users, Scale, Briefcase } from 'lucide-react';
import CollapsibleTable, { fmt as formatNumber } from '../CollapsibleTable';

export default function SituacionEconomicaDashboard({ onNavigate }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });

  useEffect(() => {
    // Hacer scroll al inicio cuando se monta el componente
    setTimeout(() => {
      const scrollContainer = document.querySelector('.dashboard-content')?.parentElement;
      if (scrollContainer) {
        scrollContainer.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 0);
      }
    }, 0);
  }, []);

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  };


  // Datos de composición accionaria
  const accionistas = [
    { nombre: 'INVERSIONES LILLY SAS', nit: '900.684.932-9', acciones: 174000, capital: 870000000, participacion: 14.29 },
    { nombre: 'INVERSIONES PROJEKTE SAS', nit: '900.683.453-8', acciones: 174000, capital: 870000000, participacion: 14.29 },
    { nombre: 'FENISY SAS', nit: '900.684.142-7', acciones: 174000, capital: 870000000, participacion: 14.29 },
    { nombre: 'DAVID ERNESTO CAMACHO', nit: '80.876.029', acciones: 30000, capital: 150000000, participacion: 2.46 },
    { nombre: 'LORENA CAMACHO ROA', nit: '52.990.725', acciones: 30000, capital: 150000000, participacion: 2.46 },
    { nombre: 'INVERSIONES AMLODA SAS', nit: '900.682.651-5', acciones: 114000, capital: 570000000, participacion: 9.36 },
    { nombre: 'MARIA CLEMENCIA ROA BARRERA', nit: '41.643.024', acciones: 59905, capital: 299525000, participacion: 4.92 },
    { nombre: 'DANIEL ROJAS ROA', nit: '80.137.053', acciones: 57047, capital: 285235000, participacion: 4.68 },
    { nombre: 'LAURA JIMENA ROJAS ROA', nit: '52.452.397', acciones: 57048, capital: 285240000, participacion: 4.68 },
    { nombre: 'LUZ MARINA ROA BARRERA', nit: '41.751.837', acciones: 12000, capital: 60000000, participacion: 0.99 },
    { nombre: 'UNION RB S.A.S.', nit: '900.441.703-6', acciones: 162000, capital: 810000000, participacion: 13.3 },
    { nombre: 'CARLOS ERNESTO ROA BARRERA', nit: '79.144.600', acciones: 24000, capital: 120000000, participacion: 1.97 },
    { nombre: 'MAFERCAR SAS', nit: '900.681.733-6', acciones: 150000, capital: 750000000, participacion: 12.32 }
  ];

  const totalAcciones = 1218000;
  const totalCapital = 6090000000;

  return (
    <div className="space-y-6">
      {/* Descripción */}
      <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6 border-4 border-green-500/30">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Situación Económica</h2>
        <p className="text-gray-700">Estado de Resultados, Balance General y Composición Accionaria</p>
      </div>

      {/* Bases de Contabilización */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 rounded-xl p-6 border-4 border-blue-500/30"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Scale className="w-6 h-6 text-blue-600" />
          Bases de Contabilización y Preparación - Estados Financieros 2025
        </h3>
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
            <p className="text-sm font-semibold text-gray-900 mb-2">LIBRO FISCAL – COLGAAP:</p>
            <p className="text-sm text-gray-700">Para el libro fiscal de regulación local colombiana la Sociedad para el registro de sus operaciones y presentación de los Estados Financieros se ajusta a los principios de contabilidad generalmente aceptados en Colombia (COLGAAP).</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
            <p className="text-sm font-semibold text-gray-900 mb-2">LIBRO NIIF – NIC:</p>
            <p className="text-sm text-gray-700">Para el grupo II establecido en la ley 1314 de 2009, el Conjunto de los Estados de Situación Financiera han sido preparados de acuerdo con las Normas Internacionales de Información Financiera (NIIF), emitidas por el IASB.</p>
          </div>
        </div>
      </motion.div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
          onClick={() => openModal('Utilidad Neta 2025', 'La utilidad neta después de impuestos para el año 2025 se determinó en $16,714 MM y de $12,129 MM para el año 2024, arrojando un incremento de $4,585 MM, que corresponde a un 37.8%.')}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Utilidad Neta 2025 vs 2024</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">${formatNumber(16714000000)}</div>
          <div className="text-sm text-gray-600 mt-1">Pesos colombianos</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Crecimiento vs 2024</div>
            <div className="text-lg font-semibold text-green-600">+37.8%</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/95 rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
          onClick={() => openModal('Ingresos Operacionales 2025', 'Los ingresos netos por actividades ordinarias devengados durante el año 2025 fueron por $431 MM, frente a $426 MM del año 2024, presentaron un crecimiento de $4.451 MM, es decir, +1.04%.')}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Ingresos Operacionales 2025 vs 2024</span>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{formatNumber(431000000000)}</div>
          <div className="text-sm text-gray-600 mt-1">Pesos colombianos</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Crecimiento vs 2024 ($426.000.000.000)</div>
            <div className="text-lg font-semibold text-blue-600">+1.04%</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/95 rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
          onClick={() => openModal('Patrimonio 2025', 'El Patrimonio Contable al 31 de diciembre del año 2025 quedó valorado en $245,333 MM y, para el año 2024 en $83,530 MM; diferencia de $161,802 MM un fortalecimiento al incrementar el 194%.')}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Patrimonio Total 2025 vs 2024</span>
            <Building className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">${formatNumber(245333000000)}</div>
          <div className="text-sm text-gray-600 mt-1">Pesos colombianos</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Crecimiento vs 2024</div>
            <div className="text-lg font-semibold text-purple-600">+194%</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/95 rounded-xl p-6 border-4 border-cyan-500/30 hover:border-cyan-500 transition-all cursor-pointer"
          onClick={() => openModal('Activos Totales 2025', 'Los activos totales a 31 de diciembre del ejercicio económico del año 2025 cerraron en $311,430 MM para el año 2024 quedaron en $137,287 MM, variación de $174,143 MM, determinando un aumento del 127%.')}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Activos Totales 2025 vs 2024</span>
            <FileText className="w-5 h-5 text-cyan-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">${formatNumber(311430000000)}</div>
          <div className="text-sm text-gray-600 mt-1">Pesos colombianos</div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">Crecimiento vs 2024</div>
            <div className="text-lg font-semibold text-cyan-600">+127%</div>
          </div>
        </motion.div>
      </div>

      {/* Estado de Resultados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/95 rounded-xl p-6 border-4 border-green-500/30"
      >
            <h3 className="text-xl font-bold text-gray-900">Estado de Resultados Pollo Fiesta 2025</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300 cursor-pointer hover:border-blue-500 transition-all"
            onClick={() => openModal('Utilidad Bruta', 'La utilidad bruta por los años de 2025 y 2024 se determinaron en: $64,781 y $58,309 MM respectivamente, generando un incremento $6,472 MM correspondiente al 11.1%.')}>
            <p className="text-sm text-gray-600 mb-2">Utilidad Bruta 2025</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(64781000000)}</p>
            <p className="text-xs text-green-600 mt-1">+11.1% vs 2024 ($58.309.000.000)</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300 cursor-pointer hover:border-green-500 transition-all"
            onClick={() => openModal('Utilidad Operacional', 'El valor de la utilidad operacional se determinó en $27,229 MM para el año 2025 y en $22,534 para el año 2024 reflejando crecimiento del +20.8% por valor de $4,695 MM.')}>
            <p className="text-sm text-gray-600 mb-2">Utilidad Operacional 2025</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(27229000000)}</p>
            <p className="text-xs text-green-600 mt-1">+20.8% vs 2024 ($22.534.000.000)</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300 cursor-pointer hover:border-purple-500 transition-all"
            onClick={() => openModal('Costos de Ventas', 'Pollo Fiesta S.A., cierra el ejercicio con costes de ventas por el año 2025, en cuantía de $368,749 MM y en el año 2024 en cuantía de $370,332 MM, es decir una disminución del -0.43%, hecho explicado principalmente por la disminución en el costo directo del ABA.')}>
            <p className="text-sm text-gray-600 mb-2">Costos de Ventas 2025</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(368749000000)}</p>
            <p className="text-xs text-green-600 mt-1">-0.43% vs 2024 ($370.332.000.000)</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300 cursor-pointer hover:border-red-500 transition-all"
            onClick={() => openModal('Costo Neto Financiero', 'El coste financiero fue de $6,061 MM para el año 2025 y de $6,880 MM para el año 2024, lo que arrojó un decrecimiento de $819 MM que corresponde a un -11.91%. En relación directa con los intereses pagados por obligaciones financieras, gravamen al movimiento financiero GMF por la bancarización de los pagos.')}>
            <p className="text-sm text-gray-600 mb-2">Costo Financiero 2025</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(6061000000)}</p>
            <p className="text-xs text-green-600 mt-1">-11.91% vs 2024 ($6.880.000.000)</p>
          </div>
          <div className="bg-cyan-50 rounded-lg p-4 border-2 border-cyan-300 cursor-pointer hover:border-cyan-500 transition-all"
            onClick={() => openModal('Otros Ingresos Financieros', 'Los otros ingresos financieros fueron determinados por los intereses recibidos en la colocación de recursos en portafolios de rentabilidad, aumentando en un 61.53% es decir en $1,572 MM, al pasar de $2,555 MM en el año 2024 a $4,127 MM del año 2025, resultado producto de la mayor colocación de recursos en las fiducias.')}>
            <p className="text-sm text-gray-600 mb-2">Ingresos Financieros 2025</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(4127000000)}</p>
            <p className="text-xs text-cyan-600 mt-1">+61.53% vs 2024 ($2.555.000.000)</p>
          </div>
        </div>
      </motion.div>

      {/* Gastos Generales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/95 rounded-xl p-6 border-4 border-orange-500/30"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Gastos Generales Pollo Fiesta 2025</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-300">
            <p className="text-sm text-gray-600 mb-2">Gastos de Administración</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(3928000000)}</p>
            <p className="text-xs text-orange-600 mt-1">+4.91% vs 2024 ($3.744.000.000)</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300">
            <p className="text-sm text-gray-600 mb-2">Gastos de Ventas</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(11528000000)}</p>
            <p className="text-xs text-red-600 mt-1">+9.90% vs 2024 ($10.490.000.000)</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-300">
            <p className="text-sm text-gray-600 mb-2">Beneficios a Empleados</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(21118000000)}</p>
            <p className="text-xs text-yellow-600 mt-1">+9% vs 2024 ($19.369.000.000)</p>
          </div>
        </div>
      </motion.div>

      {/* Balance General */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/95 rounded-xl p-6 border-4 border-blue-500/30"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Estado de Activos, Pasivos y Capital Contable 2025</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-cyan-50 rounded-lg p-4 border-2 border-cyan-300">
            <p className="text-sm text-gray-600 mb-2">Activos Totales 2025</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(311430000000)}</p>
            <p className="text-xs text-cyan-600 mt-1">+127% vs 2024 ($137.287.000.000)</p>
            <p className="text-xs text-gray-600 mt-2">Variación: +$174.143.000.000</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300">
            <p className="text-sm text-gray-600 mb-2">Pasivos Totales 2025</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(66097000000)}</p>
            <p className="text-xs text-red-600 mt-1">+23% vs 2024 ($53.756.000.000)</p>
            <p className="text-xs text-gray-600 mt-2">Variación: +$12.340.000.000</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300">
            <p className="text-sm text-gray-600 mb-2">Patrimonio 2025</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(245333000000)}</p>
            <p className="text-xs text-purple-600 mt-1">+194% vs 2024 ($83.530.000.000)</p>
            <p className="text-xs text-gray-600 mt-2">Variación: +$161.802.000.000</p>
          </div>
        </div>
      </motion.div>

      {/* Composición Accionaria */}
      <CollapsibleTable
        title="Composición Accionaria - 31 de Diciembre 2025"
        defaultOpen={false}
        totalRow={[
          { label: 'TOTALES' },
          { label: `${formatNumber(totalAcciones)} acciones`, color: 'text-gray-700' },
          { label: `Capital: $${formatNumber(totalCapital)}`, color: 'text-blue-600' },
          { label: '13 accionistas', color: 'text-gray-600' },
          { label: '100.00%', color: 'text-blue-600' },
        ]}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            Total: {formatNumber(totalAcciones)} acciones | Capital: ${formatNumber(totalCapital)}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-3 text-gray-900 font-bold">Accionista</th>
                <th className="text-left py-3 px-3 text-gray-900 font-bold">C.C. o NIT</th>
                <th className="text-right py-3 px-3 text-gray-900 font-bold">Acciones</th>
                <th className="text-right py-3 px-3 text-gray-900 font-bold">Capital Suscrito</th>
                <th className="text-right py-3 px-3 text-gray-900 font-bold">% Participación</th>
              </tr>
            </thead>
            <tbody>
              {accionistas.map((accionista, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-3 text-gray-900">{accionista.nombre}</td>
                  <td className="py-3 px-3 text-gray-600">{accionista.nit}</td>
                  <td className="text-right py-3 px-3 text-gray-700">{formatNumber(accionista.acciones)}</td>
                  <td className="text-right py-3 px-3 text-gray-700">${formatNumber(accionista.capital)}</td>
                  <td className="text-right py-3 px-3 text-blue-600 font-semibold">{accionista.participacion}%</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
                <td className="py-3 px-3 text-gray-900" colSpan="2">TOTALES</td>
                <td className="text-right py-3 px-3 text-gray-900">{formatNumber(totalAcciones)}</td>
                <td className="text-right py-3 px-3 text-gray-900">${formatNumber(totalCapital)}</td>
                <td className="text-right py-3 px-3 text-gray-900">100.00%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CollapsibleTable>

      {/* Transacciones con Accionistas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/95 rounded-xl p-6 border-4 border-orange-500/30"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-orange-600" />
          Transacciones con Accionistas Pollo Fiesta 2025
        </h3>
        <div className="space-y-4">
          <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-300">
            <p className="text-sm font-semibold text-gray-900 mb-2">Deuda con Asociados:</p>
            <p className="text-sm text-gray-700">El comportamiento de la deuda para con los asociados aumentó en cuantía de <strong className="text-orange-600">$2,647 MM</strong> (nota 17).</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
            <p className="text-sm font-semibold text-gray-900 mb-2">Vinculado Económico ALBATEQ S.A.:</p>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• Porcentaje de participación: <strong className="text-blue-600">17.1717%</strong> del total de capital suscrito y pagado</p>
              <p>• Valor patrimonial de acciones: <strong className="text-blue-600">$26,021,640,205</strong></p>
              <p>• Representando: <strong className="text-blue-600">$17,023,513,513</strong></p>
              <p>• Número de acciones: <strong className="text-blue-600">17,023,513</strong> acciones</p>
              <p>• Valor nominal: <strong className="text-blue-600">$1,000</strong> cada una</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 1. INDICADORES DE LIQUIDEZ */}
      <CollapsibleTable 
        title="1. INDICADORES DE LIQUIDEZ" 
        defaultOpen={false} 
        className="border-4 border-blue-500/30"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-gray-900">CAPITAL DE TRABAJO</p>
                <p className="text-xs text-gray-600">(Activo Corriente - Pasivo Corriente)</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-600">96.138.091.362</p>
            <p className="text-xs text-gray-600 mt-1">2024: 57.705.588.903</p>
            <p className="text-xs text-gray-500 mt-2 italic">Son los recursos con que se dispone para desarrollar su actividad fluidamente.</p>
          </div>

          <div className="bg-cyan-50 rounded-lg p-4 border-2 border-cyan-300">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-gray-900">RAZÓN CORRIENTE</p>
                <p className="text-xs text-gray-600">Activo corriente / Pasivo corriente</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-cyan-600">$ 4,22</p>
            <p className="text-xs text-gray-600 mt-1">2024: $ 3,35</p>
            <p className="text-xs text-gray-500 mt-2 italic">Por cada peso de deuda en cte. se dispone de n veces de respaldo para cumplir con la obligación.</p>
          </div>

          <div className="bg-indigo-50 rounded-lg p-4 border-2 border-indigo-300">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-gray-900">PRUEBA ÁCIDA</p>
                <p className="text-xs text-gray-600">(Activo corriente - inventario) / pasivo corriente</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-indigo-600">$ 4,05</p>
            <p className="text-xs text-gray-600 mt-1">2024: $ 3,31</p>
            <p className="text-xs text-gray-500 mt-2 italic">Es el respaldo que se tiene para cancelar un peso en el corto plazo sin comprometer los inventarios.</p>
          </div>

          <div className="bg-sky-50 rounded-lg p-4 border-2 border-sky-300">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-gray-900">SOLIDEZ</p>
                <p className="text-xs text-gray-600">Activo total / Pasivo total</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-sky-600">$ 4,71</p>
            <p className="text-xs text-gray-600 mt-1">2024: $ 2,55</p>
            <p className="text-xs text-gray-500 mt-2 italic">Es la consistencia financiera para cubrir su deuda total.</p>
          </div>

          <div className="bg-blue-100 rounded-lg p-4 border-2 border-blue-400 md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-gray-900">EBITDA</p>
                <p className="text-xs text-gray-600">Margen Ebitda = Ebitda / Ingresos Totales</p>
              </div>
            </div>
            <div className="flex gap-8">
              <div>
                <p className="text-2xl font-bold text-blue-600">29.712.979.101</p>
                <p className="text-lg font-semibold text-blue-600">6,8%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">2024:</p>
                <p className="text-xl font-bold text-gray-700">25.734.246.272</p>
                <p className="text-md font-semibold text-gray-700">6,0%</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 italic">Beneficio Bruto sin gastos financieros amortizaciones e impuestos</p>
          </div>
        </div>
      </CollapsibleTable>

      {/* 2. INDICADORES DE ENDEUDAMIENTO */}
      <CollapsibleTable 
        title="2. INDICADORES DE ENDEUDAMIENTO" 
        defaultOpen={false} 
        className="border-4 border-red-500/30"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-gray-900">NIVEL DE ENDEUDAMIENTO</p>
                <p className="text-xs text-gray-600">Pasivo / Activo</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-red-600">21,2%</p>
            <p className="text-xs text-gray-600 mt-1">2024: 39,2%</p>
            <p className="text-xs text-gray-500 mt-2 italic">Es el % en que participan los acreedores en los activos de la empresa</p>
          </div>

          <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-300">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-gray-900">ENDEUDAMIENTO A CORTO PLAZO</p>
                <p className="text-xs text-gray-600">Pasivo Corriente / Pasivo Total</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-orange-600">45,1%</p>
            <p className="text-xs text-gray-600 mt-1">2024: 45,7%</p>
            <p className="text-xs text-gray-500 mt-2 italic">Es el % en que participan los acreedores del corto plazo en los activos de la compañía.</p>
          </div>

          <div className="bg-rose-50 rounded-lg p-4 border-2 border-rose-300">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-gray-900">COBERTURA DE GASTOS FINANCIEROS</p>
                <p className="text-xs text-gray-600">Costos financieros / Ventas netas</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-rose-600">1,4%</p>
            <p className="text-xs text-gray-600 mt-1">2024: 1,6%</p>
            <p className="text-xs text-gray-500 mt-2 italic">Es el % en que participa de la parte de las ventas</p>
          </div>

          <div className="bg-red-100 rounded-lg p-4 border-2 border-red-400 md:col-span-3">
            <div className="mb-3">
              <p className="text-sm font-bold text-gray-900">INDICADOR DE APALANCAMIENTO</p>
              <p className="text-xs text-gray-500 italic mt-1">Mide el grado de compromiso de los accionistas para con el sector financiero.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-3 border border-red-300">
                <p className="text-xs text-gray-600 mb-1">Pasivo / Capital contable</p>
                <p className="text-xl font-bold text-red-600">26,9%</p>
                <p className="text-xs text-gray-600 mt-1">2024: 64,4%</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-red-300">
                <p className="text-xs text-gray-600 mb-1">Pasivo corriente / Capital Contable</p>
                <p className="text-xl font-bold text-red-600">12,2%</p>
                <p className="text-xs text-gray-600 mt-1">2024: 29,4%</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-red-300">
                <p className="text-xs text-gray-600 mb-1">Pasivo Financiero / Capital Contable</p>
                <p className="text-xl font-bold text-red-600">14,3%</p>
                <p className="text-xs text-gray-600 mt-1">2024: 37,4%</p>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleTable>

      {/* 3. INDICADORES DE ACTIVIDAD */}
      <CollapsibleTable 
        title="3. INDICADORES DE ACTIVIDAD" 
        defaultOpen={false} 
        className="border-4 border-green-500/30"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-gray-900">ROTACIÓN DE CARTERA</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-green-600">15,40</p>
            <p className="text-xs text-gray-600 mt-1">2024: 14,99</p>
            <p className="text-xs text-gray-500 mt-2 italic">Es el número de veces en que rota el inventario respecto al costo de ventas del año.</p>
          </div>

          <div className="bg-emerald-50 rounded-lg p-4 border-2 border-emerald-300">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-gray-900">ROTACIÓN DE INVENTARIOS</p>
                <p className="text-xs text-gray-600">(Costo de Mcia / Prom. de Inventarios)</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-600">30,2</p>
            <p className="text-xs text-gray-600 mt-1">2024: 22,2</p>
            <p className="text-xs text-gray-500 mt-2 italic">Es la cantidad de tiempo que estuvo el inventario en la compañía.</p>
          </div>

          <div className="bg-teal-50 rounded-lg p-4 border-2 border-teal-300">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-gray-900">ROTACIÓN DEL PATRIMONIO</p>
                <p className="text-xs text-gray-600">(Vtas Netas / Patrimonio)</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-teal-600">1,8</p>
            <p className="text-xs text-gray-600 mt-1">2024: 5,1</p>
            <p className="text-xs text-gray-500 mt-2 italic">Es el volumen de ventas generado con el patrimonio invertido.</p>
          </div>

          <div className="bg-green-100 rounded-lg p-4 border-2 border-green-400">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-gray-900">VARIACIÓN DE LAS VENTAS NETAS</p>
                <p className="text-xs text-gray-600">(Vtas Presente Ejercicio / Ventas Ejercicio Anterior)</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-green-600">1,5%</p>
            <p className="text-xs text-gray-600 mt-1">2024: -1,6%</p>
            <p className="text-xs text-gray-500 mt-2 italic">Es el % de crecimiento o decrecimiento con respecto al año anterior.</p>
          </div>
        </div>
      </CollapsibleTable>

      {/* 4. INDICADORES DE RENDIMIENTO */}
      <CollapsibleTable 
        title="4. INDICADORES DE RENDIMIENTO" 
        defaultOpen={false} 
        className="border-4 border-purple-500/30"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-gray-900">MARGEN BRUTO DE UTILIDAD</p>
                <p className="text-xs text-gray-600">Utilidad Bruta / Ventas netas</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-purple-600">15,0%</p>
            <p className="text-xs text-gray-600 mt-1">2024: 13,7%</p>
            <p className="text-xs text-gray-500 mt-2 italic">Es la participación de la utilidad operacional en las ventas del año.</p>
          </div>

          <div className="bg-violet-50 rounded-lg p-4 border-2 border-violet-300">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-gray-900">MARGEN OPERACIONAL DE UTILIDAD</p>
                <p className="text-xs text-gray-600">Utilidad Operativa / Ventas netas</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-violet-600">6,3%</p>
            <p className="text-xs text-gray-600 mt-1">2024: 5,3%</p>
            <p className="text-xs text-gray-500 mt-2 italic">Indica la rentabilidad si el negocio es o no lucrativo</p>
          </div>

          <div className="bg-fuchsia-50 rounded-lg p-4 border-2 border-fuchsia-300">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-gray-900">RENTABIL. DEL PATRIMONIO</p>
                <p className="text-xs text-gray-600">(Utilidad Antes de Impuesto / Patrimonio)</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-fuchsia-600">10,3%</p>
            <p className="text-xs text-gray-600 mt-1">2024: 21,8%</p>
            <p className="text-xs text-gray-500 mt-2 italic">Es el rendimiento de la inversión de los socios en el ejercicio económico.</p>
          </div>

          <div className="bg-purple-100 rounded-lg p-4 border-2 border-purple-400">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-gray-900">RENDIMIENTO DEL CAPITAL CONTABLE -ROE</p>
                <p className="text-xs text-gray-600">Utilidad Neta / Capital Contable</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-purple-600">6,8%</p>
            <p className="text-xs text-gray-600 mt-1">2024: 14,5%</p>
            <p className="text-xs text-gray-500 mt-2 italic">Representa que por cada peso invertido en activo cuanto se genera en utilidad.</p>
          </div>
        </div>
      </CollapsibleTable>

      {/* Agradecimientos — botón para ir al dashboard dedicado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex justify-center"
      >
        <button
          onClick={() => onNavigate && onNavigate('agradecimientos')}
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
        >
          Ver Agradecimientos
        </button>
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
                {modalContent.content}
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
      </AnimatePresence>, document.body)}
    </div>
  );
}
