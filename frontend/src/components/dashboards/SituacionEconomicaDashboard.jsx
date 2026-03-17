import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, DollarSign, FileText, X, Scale, Briefcase } from 'lucide-react';
import CollapsibleTable, { fmt as formatNumber } from '../CollapsibleTable';

export default function SituacionEconomicaDashboard({ onNavigate }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
  };

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
    { nombre: 'MAFERCAR SAS', nit: '900.681.733-6', acciones: 150000, capital: 750000000, participacion: 12.32 },
  ];
  const totalAcciones = 1218000;
  const totalCapital = 6090000000;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6 border-4 border-green-500/30">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Situación Económica</h2>
        <p className="text-gray-700">Estado de Resultados, Balance General y Composición Accionaria</p>
      </div>

      {/* Bases de Contabilización */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 rounded-xl p-6 border-4 border-blue-500/30">
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
            <p className="text-sm text-gray-700">Para el grupo II establecido en la ley 1314 de 2009, el Conjunto de los Estados de Situación Financiera han sido preparados de acuerdo con las Normas Internacionales de Información Financiera (en adelante NIIF), emitidas por el organismo internacional International Accounting Standards Board (IASB); Normas Internacionales de Contabilidad (NIC); comité de interpretaciones de NIIF (CINIFF); Internacional Financial Reporting Interpretation Committee (IFRIC).</p>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4 border-2 border-indigo-300">
            <p className="text-sm font-semibold text-gray-900 mb-3">Línea Normativa:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['Ley 1314 de 2009','Ley 2069 de 2020','Decreto 2706 de 2012','Decreto 2784 de 2012','Decreto Nacional 1854 de 2013','Decreto Nacional 302 de 2015','Decreto 2420 de 2015','Decreto 2496 de 2015','Decretos 210, 2131 y 2132 de 2016','Decreto 2170 de 2017','Decreto 2483 de 2019','Decreto 2270 de 2019'].map((n) => (
                <span key={n} className="text-xs bg-white border border-indigo-200 rounded px-2 py-1 text-indigo-800 font-medium">{n}</span>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-3">Conceptos Técnicos CTCP-2018-000015 del 17 de agosto de 2018 y 2-2018-017439 del 16 de agosto de 2018, aplicable a las entidades del Grupo II.</p>
          </div>
        </div>
      </motion.div>

      {/* 1. Ingresos operacionales Netos | Los Costes de ventas | Utilidad bruta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
          onClick={() => openModal('Ingresos operacionales Netos',
            <div className="space-y-4">
              <p>Los ingresos netos por actividades ordinarias devengados durante el año 2.025 fueron por <strong className="text-blue-600">$431.000.000.000</strong>, frente a <strong>$426.000.000.000</strong> del año 2.024.</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-600 mb-1">2024</p><p className="text-xl font-bold text-gray-900">${formatNumber(426000000000)}</p></div>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200"><p className="text-xs text-blue-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-blue-700">${formatNumber(431000000000)}</p></div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                <p className="text-sm font-semibold text-green-800 mb-2">Crecimiento:</p>
                <p className="text-sm text-gray-700">Presentaron un crecimiento de <strong>$4.451.000.000</strong>, es decir, <strong className="text-green-600">+1.04%</strong>.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Nota:</p>
                <p className="text-sm text-gray-700">Los Estados Financieros de la compañía son presentados en millones de pesos colombianos como moneda funcional.</p>
              </div>
            </div>
          )}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Ingresos operacionales Netos</span>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-gray-900 leading-tight">${formatNumber(431000000000)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold">${formatNumber(426000000000)}</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold">${formatNumber(431000000000)}</span></div>
            <div className="text-sm font-bold text-green-600">Var: +1.04%</div>
            <div className="text-xs font-semibold text-green-600">Dif: +${formatNumber(4451000000)}</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/95 rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
          onClick={() => openModal('Los Costes de ventas',
            <div className="space-y-4">
              <p>Pollo Fiesta S.A. cierra el ejercicio con costes de ventas por el año 2.025 en cuantía de <strong className="text-purple-600">$368.749.000.000</strong> y en el año 2.024 en cuantía de <strong>$370.332.000.000</strong>.</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-600 mb-1">2024</p><p className="text-xl font-bold text-gray-900">${formatNumber(370332000000)}</p></div>
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200"><p className="text-xs text-purple-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-purple-700">${formatNumber(368749000000)}</p></div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                <p className="text-sm font-semibold text-green-800 mb-2">Reducción:</p>
                <p className="text-sm text-gray-700">Es decir una disminución del <strong className="text-green-600">-0.43%</strong>, hecho explicado principalmente por la disminución en el costo directo del ABA.</p>
              </div>
            </div>
          )}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Los Costes de ventas</span>
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-xl font-bold text-gray-900 leading-tight">${formatNumber(368749000000)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold">${formatNumber(370332000000)}</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold">${formatNumber(368749000000)}</span></div>
            <div className="text-sm font-bold text-green-600">Var: -0.43%</div>
            <div className="text-xs font-semibold text-green-600">Dif: -${formatNumber(1583000000)}</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white/95 rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
          onClick={() => openModal('Utilidad bruta',
            <div className="space-y-4">
              <p>La utilidad bruta por los años de 2.025 y 2.024 se determinaron en <strong className="text-green-600">$64.781.000.000</strong> y <strong>$58.309.000.000</strong> respectivamente.</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-600 mb-1">2024</p><p className="text-xl font-bold text-gray-900">${formatNumber(58309000000)}</p></div>
                <div className="bg-green-50 rounded-lg p-3 border border-green-200"><p className="text-xs text-green-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-green-700">${formatNumber(64781000000)}</p></div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                <p className="text-sm font-semibold text-green-800 mb-2">Incremento:</p>
                <p className="text-sm text-gray-700">Generando un incremento de <strong>$6.472.000.000</strong> correspondiente al <strong className="text-green-600">11.1%</strong>, de margen de rentabilidad antes de gastos generales.</p>
              </div>
            </div>
          )}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Utilidad bruta</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-xl font-bold text-gray-900 leading-tight">${formatNumber(64781000000)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold">${formatNumber(58309000000)}</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold">${formatNumber(64781000000)}</span></div>
            <div className="text-sm font-bold text-green-600">Var: +11.1%</div>
            <div className="text-xs font-semibold text-green-600">Dif: +${formatNumber(6472000000)}</div>
          </div>
        </motion.div>
      </div>

      {/* 4. Gastos Generales */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white/95 rounded-xl p-6 border-4 border-orange-500/30">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Gastos Generales</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-300 cursor-pointer hover:border-orange-500 transition-all"
            onClick={() => openModal('Gastos de administración',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-600 mb-1">2024</p><p className="text-xl font-bold text-gray-900">${formatNumber(3744000000)}</p></div>
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-200"><p className="text-xs text-orange-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-orange-700">${formatNumber(3928000000)}</p></div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-300">
                  <p className="text-sm text-gray-700">Los gastos de administración que no incluyen el beneficio a empleados se incrementan en <strong>$183.000.000</strong>, que corresponde al <strong className="text-orange-600">4.91%</strong>, al pasar de <strong>$3.744.000.000</strong> del año 2.024 a <strong>$3.928.000.000</strong> del año 2.025.</p>
                </div>
              </div>
            )}>
            <p className="text-sm text-gray-600 mb-2">Gastos de administración</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(3928000000)}</p>
            <div className="border-t border-gray-200 pt-1 mt-1 space-y-0.5">
              <p className="text-xs text-gray-500">2024: <span className="font-semibold">${formatNumber(3744000000)}</span></p>
              <p className="text-xs font-bold text-red-600">Var: +4.91%</p>
              <p className="text-xs font-semibold text-red-600">Dif: +${formatNumber(184000000)}</p>
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300 cursor-pointer hover:border-red-500 transition-all"
            onClick={() => openModal('Gastos de ventas',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-600 mb-1">2024</p><p className="text-xl font-bold text-gray-900">${formatNumber(10490000000)}</p></div>
                  <div className="bg-red-50 rounded-lg p-3 border border-red-200"><p className="text-xs text-red-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-red-700">${formatNumber(11528000000)}</p></div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-300">
                  <p className="text-sm text-gray-700">Los gastos de ventas crecen <strong>$1.038.000.000</strong>, que corresponde al <strong className="text-red-600">9.90%</strong>, al pasar de <strong>$10.490.000.000</strong> en el año 2.024 a <strong>$11.528.000.000</strong> en el año 2.025.</p>
                </div>
              </div>
            )}>
            <p className="text-sm text-gray-600 mb-2">Gastos de ventas</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(11528000000)}</p>
            <div className="border-t border-gray-200 pt-1 mt-1 space-y-0.5">
              <p className="text-xs text-gray-500">2024: <span className="font-semibold">${formatNumber(10490000000)}</span></p>
              <p className="text-xs font-bold text-red-600">Var: +9.90%</p>
              <p className="text-xs font-semibold text-red-600">Dif: +${formatNumber(1038000000)}</p>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-300 cursor-pointer hover:border-yellow-500 transition-all"
            onClick={() => openModal('Los gastos de beneficios a empleados',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-600 mb-1">2024</p><p className="text-xl font-bold text-gray-900">${formatNumber(19369000000)}</p></div>
                  <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200"><p className="text-xs text-yellow-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-yellow-700">${formatNumber(21118000000)}</p></div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-300">
                  <p className="text-sm text-gray-700">Los gastos de personal sin incluir los centros operativos de producción granjas que van al coste, se incrementaron en <strong>$1.748.000.000</strong>, que corresponde al <strong className="text-yellow-600">9%</strong>, al pasar de <strong>$19.369.000.000</strong> en el año 2.024 a <strong>$21.118.000.000</strong> del año 2.025.</p>
                </div>
              </div>
            )}>
            <p className="text-sm text-gray-600 mb-2">Los gastos de beneficios a empleados</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(21118000000)}</p>
            <div className="border-t border-gray-200 pt-1 mt-1 space-y-0.5">
              <p className="text-xs text-gray-500">2024: <span className="font-semibold">${formatNumber(19369000000)}</span></p>
              <p className="text-xs font-bold text-red-600">Var: +9%</p>
              <p className="text-xs font-semibold text-red-600">Dif: +${formatNumber(1749000000)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 5. Utilidad Operacional | 6. Costo Neto Financiero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white/95 rounded-xl p-6 border-4 border-green-500/30">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Estado de Resultados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300 cursor-pointer hover:border-green-500 transition-all"
            onClick={() => openModal('Utilidad Operacional',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-600 mb-1">2024</p><p className="text-xl font-bold text-gray-900">${formatNumber(22534000000)}</p></div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200"><p className="text-xs text-green-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-green-700">${formatNumber(27229000000)}</p></div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                  <p className="text-sm text-gray-700">El valor de la utilidad operacional se determinó en <strong>$27.229.000.000</strong> para el año 2.025 y en <strong>$22.534.000.000</strong> para el año 2.024, reflejando un crecimiento del <strong className="text-green-600">+20.8%</strong> por valor de <strong>$4.695.000.000</strong>.</p>
                </div>
              </div>
            )}>
            <p className="text-sm text-gray-600 mb-2">Utilidad Operacional</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(27229000000)}</p>
            <div className="border-t border-gray-200 pt-1 mt-1 space-y-0.5">
              <p className="text-xs text-gray-500">2024: <span className="font-semibold">${formatNumber(22534000000)}</span></p>
              <p className="text-xs font-bold text-green-600">Var: +20.8%</p>
              <p className="text-xs font-semibold text-green-600">Dif: +${formatNumber(4695000000)}</p>
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300 cursor-pointer hover:border-red-500 transition-all"
            onClick={() => openModal('Costo Neto Financiero',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-600 mb-1">2024</p><p className="text-xl font-bold text-gray-900">${formatNumber(6880000000)}</p></div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200"><p className="text-xs text-green-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-green-700">${formatNumber(6061000000)}</p></div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                  <p className="text-sm text-gray-700">El coste financiero fue de <strong>$6.061.000.000</strong> para el año 2.025 y de <strong>$6.880.000.000</strong> para el año 2.024, arrojando un decrecimiento de <strong>$819.000.000</strong> que corresponde a un <strong className="text-green-600">-11.91%</strong>. En relación directa con los intereses pagados por obligaciones financieras y el gravamen al movimiento financiero (GMF) por la bancarización de los pagos.</p>
                </div>
                <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-300">
                  <p className="text-sm font-semibold text-cyan-800 mb-2">Los otros ingresos financieros:</p>
                  <p className="text-sm text-gray-700">Fueron determinados por los intereses recibidos en la colocación de recursos en portafolios de rentabilidad, aumentando en un <strong className="text-green-600">61.53%</strong>, es decir en <strong>$1.572.000.000</strong>, al pasar de <strong>$2.555.000.000</strong> en el año 2.024 a <strong>$4.127.000.000</strong> del año 2.025, resultado producto de la mayor colocación de recursos en las fiducias.</p>
                </div>
              </div>
            )}>
            <p className="text-sm text-gray-600 mb-2">Costo Neto Financiero</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(6061000000)}</p>
            <div className="border-t border-gray-200 pt-1 mt-1 space-y-0.5">
              <p className="text-xs text-gray-500">2024: <span className="font-semibold">${formatNumber(6880000000)}</span></p>
              <p className="text-xs font-bold text-green-600">Var: -11.91%</p>
              <p className="text-xs font-semibold text-green-600">Dif: -${formatNumber(819000000)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 8. Utilidad Neta */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-white/95 rounded-xl p-6 border-4 border-cyan-500/30 hover:border-cyan-500 transition-all cursor-pointer"
        onClick={() => openModal('Utilidad Neta',
          <div className="space-y-4">
            <p>La utilidad neta después de impuestos para el año 2.025 se determinó en <strong className="text-green-600">$16.714.000.000</strong> y de <strong>$12.129.000.000</strong> para el año 2.024.</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-600 mb-1">2024</p><p className="text-xl font-bold text-gray-900">${formatNumber(12129000000)}</p></div>
              <div className="bg-green-50 rounded-lg p-3 border border-green-200"><p className="text-xs text-green-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-green-700">${formatNumber(16714000000)}</p></div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
              <p className="text-sm font-semibold text-green-800 mb-2">Incremento:</p>
              <p className="text-sm text-gray-700">Arrojando un incremento de <strong>$4.585.000.000</strong>, que corresponde a un <strong className="text-green-600">37.8%</strong>. Situación detallada en el estado de resultados que hace parte integral del presente informe de gestión.</p>
            </div>
          </div>
        )}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 text-sm">Utilidad Neta</span>
          <TrendingUp className="w-5 h-5 text-green-600" />
        </div>
        <div className="text-2xl font-bold text-gray-900">${formatNumber(16714000000)}</div>
        <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
          <div className="text-xs text-gray-500">2024: <span className="font-semibold">${formatNumber(12129000000)}</span></div>
          <div className="text-xs text-gray-500">2025: <span className="font-semibold">${formatNumber(16714000000)}</span></div>
          <div className="text-sm font-bold text-green-600">Var: +37.8%</div>
          <div className="text-xs font-semibold text-green-600">Dif: +${formatNumber(4585000000)}</div>
        </div>
      </motion.div>

      {/* 9. Estado de Activos, Pasivos y Capital Contable */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="bg-white/95 rounded-xl p-6 border-4 border-blue-500/30">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Estado de Activos, Pasivos y Capital Contable</h3>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
          <p className="text-sm text-gray-700">Los activos totales a 31 de diciembre del ejercicio económico del año 2.025 cerraron en <strong>$311.430.000.000</strong>, para el año 2.024 quedaron en <strong>$137.287.000.000</strong>, variación de <strong>$174.143.000.000</strong>, determinando un aumento del <strong className="text-blue-600">127%</strong>, explicado principalmente por efectos en flujo de efectivo y avalúo de PPyE. Los pasivos totales quedaron en el año 2.025 en <strong>$66.097.000.000</strong> y para el 2.024 en <strong>$53.756.000.000</strong>, diferencia de <strong>$12.340.000.000</strong> que representa un <strong className="text-red-600">+23%</strong>, generado principalmente por reconocimiento dividendos por pagar y deuda con proveedores. El Patrimonio Contable al 31 de diciembre del año 2.025 quedó valorado en <strong>$245.333.000.000</strong> y para el año 2.024 en <strong>$83.530.000.000</strong>; diferencia de <strong>$161.802.000.000</strong>, un fortalecimiento al incrementar el <strong className="text-green-600">194%</strong>, directamente relacionado con valorizaciones, gestión y asuntos de la sociedad, respaldado por su Junta Directiva dentro del marco de las políticas del Gobierno Corporativo.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-cyan-50 rounded-lg p-4 border-2 border-cyan-300">
            <p className="text-sm text-gray-600 mb-2">Activos Totales 2025</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(311430000000)}</p>
            <div className="border-t border-gray-200 pt-1 mt-1 space-y-0.5">
              <p className="text-xs text-gray-500">2024: <span className="font-semibold">${formatNumber(137287000000)}</span></p>
              <p className="text-xs font-bold text-green-600">Var: +127%</p>
              <p className="text-xs font-semibold text-green-600">Dif: +${formatNumber(174143000000)}</p>
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300">
            <p className="text-sm text-gray-600 mb-2">Pasivos Totales 2025</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(66097000000)}</p>
            <div className="border-t border-gray-200 pt-1 mt-1 space-y-0.5">
              <p className="text-xs text-gray-500">2024: <span className="font-semibold">${formatNumber(53756000000)}</span></p>
              <p className="text-xs font-bold text-red-600">Var: +23%</p>
              <p className="text-xs font-semibold text-red-600">Dif: +${formatNumber(12341000000)}</p>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300">
            <p className="text-sm text-gray-600 mb-2">Patrimonio Contable 2025</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(245333000000)}</p>
            <div className="border-t border-gray-200 pt-1 mt-1 space-y-0.5">
              <p className="text-xs text-gray-500">2024: <span className="font-semibold">${formatNumber(83530000000)}</span></p>
              <p className="text-xs font-bold text-green-600">Var: +194%</p>
              <p className="text-xs font-semibold text-green-600">Dif: +${formatNumber(161803000000)}</p>
            </div>
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
          { label: `Capital: ${formatNumber(totalCapital)}`, color: 'text-blue-600' },
          { label: '13 accionistas', color: 'text-gray-600' },
          { label: '100.00%', color: 'text-blue-600' },
        ]}
      >
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
              {accionistas.map((a, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-3 text-gray-900">{a.nombre}</td>
                  <td className="py-3 px-3 text-gray-600">{a.nit}</td>
                  <td className="text-right py-3 px-3 text-gray-700">{formatNumber(a.acciones)}</td>
                  <td className="text-right py-3 px-3 text-gray-700">${formatNumber(a.capital)}</td>
                  <td className="text-right py-3 px-3 text-blue-600 font-semibold">{a.participacion}%</td>
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        className="bg-white/95 rounded-xl p-6 border-4 border-orange-500/30">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-orange-600" />
          Transacciones con Accionistas Pollo Fiesta 2025
        </h3>
        <div className="space-y-4">
          <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-300">
            <p className="text-sm font-semibold text-gray-900 mb-2">Deuda con Asociados:</p>
            <p className="text-sm text-gray-700">El comportamiento de la deuda para con los asociados aumentó en cuantía de <strong className="text-orange-600">$2.647.000</strong> (nota 17).</p>
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <h3 className="text-xl font-bold text-gray-900 mb-4">1. INDICADORES DE LIQUIDEZ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300 cursor-pointer hover:border-blue-500 transition-all"
            onClick={() => openModal('Capital de Trabajo 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-600 mb-1">2024</p><p className="text-xl font-bold text-gray-900">$57.705.588.903</p></div>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200"><p className="text-xs text-blue-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-blue-700">$96.138.091.362</p></div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-300"><p className="text-sm text-gray-700">Son los recursos con que se dispone para desarrollar la actividad fluidamente. Se calcula restando el Pasivo Corriente del Activo Corriente.</p></div>
              </div>
            )}>
            <p className="text-sm font-bold text-gray-900">CAPITAL DE TRABAJO</p>
            <p className="text-xs text-gray-600">(Activo Corriente - Pasivo Corriente)</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">96.138.091.362</p>
            <p className="text-xs text-gray-600 mt-1">2024: 57.705.588.903</p>
          </div>
          <div className="bg-cyan-50 rounded-lg p-4 border-2 border-cyan-300 cursor-pointer hover:border-cyan-500 transition-all"
            onClick={() => openModal('Razón Corriente 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-600 mb-1">2024</p><p className="text-xl font-bold text-gray-900">$3,35</p></div>
                  <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-200"><p className="text-xs text-cyan-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-cyan-700">$4,22</p></div>
                </div>
                <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-300"><p className="text-sm text-gray-700">Por cada peso de deuda en el corto plazo, la empresa dispone de $4.22 de respaldo para cumplir con la obligación.</p></div>
              </div>
            )}>
            <p className="text-sm font-bold text-gray-900">RAZÓN CORRIENTE</p>
            <p className="text-xs text-gray-600">Activo corriente / Pasivo corriente</p>
            <p className="text-2xl font-bold text-cyan-600 mt-2">$ 4,22</p>
            <p className="text-xs text-gray-600 mt-1">2024: $ 3,35</p>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4 border-2 border-indigo-300 cursor-pointer hover:border-indigo-500 transition-all"
            onClick={() => openModal('Prueba Ácida 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-600 mb-1">2024</p><p className="text-xl font-bold text-gray-900">$3,31</p></div>
                  <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200"><p className="text-xs text-indigo-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-indigo-700">$4,05</p></div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-300"><p className="text-sm text-gray-700">Es el respaldo para cancelar un peso en el corto plazo sin comprometer los inventarios. Fórmula: (Activo corriente - Inventario) / Pasivo corriente.</p></div>
              </div>
            )}>
            <p className="text-sm font-bold text-gray-900">PRUEBA ÁCIDA</p>
            <p className="text-xs text-gray-600">(Activo corriente - inventario) / pasivo corriente</p>
            <p className="text-2xl font-bold text-indigo-600 mt-2">$ 4,05</p>
            <p className="text-xs text-gray-600 mt-1">2024: $ 3,31</p>
          </div>
          <div className="bg-sky-50 rounded-lg p-4 border-2 border-sky-300 cursor-pointer hover:border-sky-500 transition-all"
            onClick={() => openModal('Solidez Financiera 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-600 mb-1">2024</p><p className="text-xl font-bold text-gray-900">$2,55</p></div>
                  <div className="bg-sky-50 rounded-lg p-3 border border-sky-200"><p className="text-xs text-sky-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-sky-700">$4,71</p></div>
                </div>
                <div className="bg-sky-50 rounded-lg p-4 border border-sky-300"><p className="text-sm text-gray-700">Mide la consistencia financiera para cubrir la deuda total. Por cada peso de deuda total, la empresa tiene $4.71 en activos.</p></div>
              </div>
            )}>
            <p className="text-sm font-bold text-gray-900">SOLIDEZ</p>
            <p className="text-xs text-gray-600">Activo total / Pasivo total</p>
            <p className="text-2xl font-bold text-sky-600 mt-2">$ 4,71</p>
            <p className="text-xs text-gray-600 mt-1">2024: $ 2,55</p>
          </div>
          <div className="bg-blue-100 rounded-lg p-4 border-2 border-blue-400 md:col-span-2 cursor-pointer hover:border-blue-600 transition-all"
            onClick={() => openModal('EBITDA 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-600 mb-1">2024</p><p className="text-xl font-bold text-gray-900">$25.734.246.272</p><p className="text-sm font-semibold text-gray-600">Margen: 6.0%</p></div>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200"><p className="text-xs text-blue-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-blue-700">$29.712.979.101</p><p className="text-sm font-semibold text-blue-600">Margen: 6.8%</p></div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-300"><p className="text-sm text-gray-700">Beneficio Bruto sin gastos financieros, amortizaciones e impuestos. Mide la rentabilidad operativa pura de la empresa.</p></div>
              </div>
            )}>
            <p className="text-sm font-bold text-gray-900">EBITDA</p>
            <p className="text-xs text-gray-600">Margen Ebitda = Ebitda / Ingresos Totales</p>
            <div className="flex gap-8 mt-2">
              <div><p className="text-2xl font-bold text-blue-600">29.712.979.101</p><p className="text-lg font-semibold text-blue-600">6,8%</p></div>
              <div><p className="text-sm text-gray-600">2024:</p><p className="text-xl font-bold text-gray-700">25.734.246.272</p><p className="text-md font-semibold text-gray-700">6,0%</p></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. INDICADORES DE ENDEUDAMIENTO */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
        <h3 className="text-xl font-bold text-gray-900 mb-4">2. INDICADORES DE ENDEUDAMIENTO</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300 cursor-pointer hover:border-red-500 transition-all"
            onClick={() => openModal('Nivel de Endeudamiento 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-600 mb-1">2024</p><p className="text-xl font-bold text-gray-900">39,2%</p></div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200"><p className="text-xs text-green-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-green-700">21,2%</p></div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-300"><p className="text-sm text-gray-700">Es el porcentaje en que participan los acreedores en los activos de la empresa. Fórmula: Pasivo / Activo.</p></div>
              </div>
            )}>
            <p className="text-sm font-bold text-gray-900">NIVEL DE ENDEUDAMIENTO</p>
            <p className="text-xs text-gray-600">Pasivo / Activo</p>
            <p className="text-2xl font-bold text-red-600 mt-2">21,2%</p>
            <p className="text-xs text-gray-600 mt-1">2024: 39,2%</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-300 cursor-pointer hover:border-orange-500 transition-all"
            onClick={() => openModal('Endeudamiento a Corto Plazo 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-600 mb-1">2024</p><p className="text-xl font-bold text-gray-900">45,7%</p></div>
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-200"><p className="text-xs text-orange-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-orange-700">45,1%</p></div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-300"><p className="text-sm text-gray-700">Es el porcentaje en que participan los acreedores de corto plazo en el pasivo total. Fórmula: Pasivo Corriente / Pasivo Total.</p></div>
              </div>
            )}>
            <p className="text-sm font-bold text-gray-900">ENDEUDAMIENTO A CORTO PLAZO</p>
            <p className="text-xs text-gray-600">Pasivo Corriente / Pasivo Total</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">45,1%</p>
            <p className="text-xs text-gray-600 mt-1">2024: 45,7%</p>
          </div>
          <div className="bg-rose-50 rounded-lg p-4 border-2 border-rose-300 cursor-pointer hover:border-rose-500 transition-all"
            onClick={() => openModal('Cobertura de Gastos Financieros 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-600 mb-1">2024</p><p className="text-xl font-bold text-gray-900">1,6%</p></div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200"><p className="text-xs text-green-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-green-700">1,4%</p></div>
                </div>
                <div className="bg-rose-50 rounded-lg p-4 border border-rose-300"><p className="text-sm text-gray-700">Es el porcentaje que representan los costos financieros sobre las ventas netas. Fórmula: Costos financieros / Ventas netas.</p></div>
              </div>
            )}>
            <p className="text-sm font-bold text-gray-900">COBERTURA DE GASTOS FINANCIEROS</p>
            <p className="text-xs text-gray-600">Costos financieros / Ventas netas</p>
            <p className="text-2xl font-bold text-rose-600 mt-2">1,4%</p>
            <p className="text-xs text-gray-600 mt-1">2024: 1,6%</p>
          </div>
          <div className="bg-red-100 rounded-lg p-4 border-2 border-red-400 md:col-span-3 cursor-pointer hover:border-red-600 transition-all"
            onClick={() => openModal('Indicador de Apalancamiento 2025 vs 2024',
              <div className="space-y-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-300"><p className="text-sm text-gray-700">Mide el grado de compromiso de los accionistas para con el sector financiero. Relaciona el pasivo con el capital contable desde tres perspectivas.</p></div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-red-200 text-center"><p className="text-xs text-gray-600 mb-1">Pasivo / Capital</p><p className="text-lg font-bold text-red-600">26,9%</p><p className="text-xs text-gray-500">2024: 64,4%</p></div>
                  <div className="bg-white rounded-lg p-3 border border-red-200 text-center"><p className="text-xs text-gray-600 mb-1">Pasivo Cte / Capital</p><p className="text-lg font-bold text-red-600">12,2%</p><p className="text-xs text-gray-500">2024: 29,4%</p></div>
                  <div className="bg-white rounded-lg p-3 border border-red-200 text-center"><p className="text-xs text-gray-600 mb-1">Pasivo Fin / Capital</p><p className="text-lg font-bold text-red-600">14,3%</p><p className="text-xs text-gray-500">2024: 37,4%</p></div>
                </div>
              </div>
            )}>
            <p className="text-sm font-bold text-gray-900 mb-3">INDICADOR DE APALANCAMIENTO</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-3 border border-red-300"><p className="text-xs text-gray-600 mb-1">Pasivo / Capital contable</p><p className="text-xl font-bold text-red-600">26,9%</p><p className="text-xs text-gray-600 mt-1">2024: 64,4%</p></div>
              <div className="bg-white rounded-lg p-3 border border-red-300"><p className="text-xs text-gray-600 mb-1">Pasivo corriente / Capital Contable</p><p className="text-xl font-bold text-red-600">12,2%</p><p className="text-xs text-gray-600 mt-1">2024: 29,4%</p></div>
              <div className="bg-white rounded-lg p-3 border border-red-300"><p className="text-xs text-gray-600 mb-1">Pasivo Financiero / Capital Contable</p><p className="text-xl font-bold text-red-600">14,3%</p><p className="text-xs text-gray-600 mt-1">2024: 37,4%</p></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. INDICADORES DE ACTIVIDAD */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
        <h3 className="text-xl font-bold text-gray-900 mb-4">3. INDICADORES DE ACTIVIDAD</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300 cursor-pointer hover:border-green-500 transition-all"
            onClick={() => openModal('Rotación de Cartera 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-600 mb-1">2024</p><p className="text-xl font-bold text-gray-900">14,99 veces</p></div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200"><p className="text-xs text-green-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-green-700">15,40 veces</p></div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300"><p className="text-sm text-gray-700">Es el número de veces que rota la cartera respecto a las ventas del año.</p></div>
              </div>
            )}>
            <p className="text-sm font-bold text-gray-900">ROTACIÓN DE CARTERA</p>
            <p className="text-2xl font-bold text-green-600 mt-2">15,40</p>
            <p className="text-xs text-gray-600 mt-1">2024: 14,99</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 border-2 border-emerald-300 cursor-pointer hover:border-emerald-500 transition-all"
            onClick={() => openModal('Rotación de Inventarios 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-600 mb-1">2024</p><p className="text-xl font-bold text-gray-900">22,2 veces</p></div>
                  <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200"><p className="text-xs text-emerald-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-emerald-700">39,2 veces</p></div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-300"><p className="text-sm text-gray-700">Es la cantidad de veces que el inventario se renueva en el año. Fórmula: Costo de mercancía / Promedio de inventarios.</p></div>
              </div>
            )}>
            <p className="text-sm font-bold text-gray-900">ROTACIÓN DE INVENTARIOS</p>
            <p className="text-xs text-gray-600">(Costo de Mcia / Prom. de Inventarios)</p>
            <p className="text-2xl font-bold text-emerald-600 mt-2">39,2</p>
            <p className="text-xs text-gray-600 mt-1">2024: 22,2</p>
          </div>
          <div className="bg-teal-50 rounded-lg p-4 border-2 border-teal-300 cursor-pointer hover:border-teal-500 transition-all"
            onClick={() => openModal('Rotación del Patrimonio 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-600 mb-1">2024</p><p className="text-xl font-bold text-gray-900">5,1 veces</p></div>
                  <div className="bg-teal-50 rounded-lg p-3 border border-teal-200"><p className="text-xs text-teal-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-teal-700">1,8 veces</p></div>
                </div>
                <div className="bg-teal-50 rounded-lg p-4 border border-teal-300"><p className="text-sm text-gray-700">Es el volumen de ventas generado por cada peso de patrimonio invertido. La reducción se explica por el crecimiento extraordinario del patrimonio (+194%).</p></div>
              </div>
            )}>
            <p className="text-sm font-bold text-gray-900">ROTACIÓN DEL PATRIMONIO</p>
            <p className="text-xs text-gray-600">(Vtas Netas / Patrimonio)</p>
            <p className="text-2xl font-bold text-teal-600 mt-2">1,8</p>
            <p className="text-xs text-gray-600 mt-1">2024: 5,1</p>
          </div>
          <div className="bg-green-100 rounded-lg p-4 border-2 border-green-400 cursor-pointer hover:border-green-600 transition-all"
            onClick={() => openModal('Variación de las Ventas Netas 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-600 mb-1">2024</p><p className="text-xl font-bold text-red-600">-1,6%</p></div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200"><p className="text-xs text-green-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-green-700">+1,5%</p></div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300"><p className="text-sm text-gray-700">La empresa revirtió la tendencia negativa de 2024 (-1.6%) para crecer 1.5% en 2025. Los ingresos operacionales pasaron de $426.000 millones a $431.000 millones.</p></div>
              </div>
            )}>
            <p className="text-sm font-bold text-gray-900">VARIACIÓN DE LAS VENTAS NETAS</p>
            <p className="text-xs text-gray-600">(Vtas Presente / Ventas Anterior)</p>
            <p className="text-2xl font-bold text-green-600 mt-2">1,5%</p>
            <p className="text-xs text-gray-600 mt-1">2024: -1,6%</p>
          </div>
        </div>
      </motion.div>

      {/* 4. INDICADORES DE RENDIMIENTO */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
        <h3 className="text-xl font-bold text-gray-900 mb-4">4. INDICADORES DE RENDIMIENTO</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-violet-50 rounded-lg p-4 border-2 border-violet-300 cursor-pointer hover:border-violet-500 transition-all"
            onClick={() => openModal('Margen Bruto de Utilidad 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-600 mb-1">2024</p><p className="text-xl font-bold text-gray-900">13,6%</p></div>
                  <div className="bg-violet-50 rounded-lg p-3 border border-violet-200"><p className="text-xs text-violet-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-violet-700">15,0%</p></div>
                </div>
                <div className="bg-violet-50 rounded-lg p-4 border border-violet-300"><p className="text-sm text-gray-700">Es el porcentaje de utilidad bruta sobre las ventas netas. Fórmula: Utilidad Bruta / Ventas Netas.</p></div>
              </div>
            )}>
            <p className="text-sm font-bold text-gray-900">MARGEN BRUTO DE UTILIDAD</p>
            <p className="text-xs text-gray-600">Utilidad Bruta / Ventas Netas</p>
            <p className="text-2xl font-bold text-violet-600 mt-2">15,0%</p>
            <p className="text-xs text-gray-600 mt-1">2024: 13,6%</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300 cursor-pointer hover:border-purple-500 transition-all"
            onClick={() => openModal('Margen Operacional de Utilidad 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-600 mb-1">2024</p><p className="text-xl font-bold text-gray-900">5,3%</p></div>
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200"><p className="text-xs text-purple-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-purple-700">6,3%</p></div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-300"><p className="text-sm text-gray-700">Es el porcentaje de utilidad operacional sobre las ventas netas. Fórmula: Utilidad Operacional / Ventas Netas.</p></div>
              </div>
            )}>
            <p className="text-sm font-bold text-gray-900">MARGEN OPERACIONAL</p>
            <p className="text-xs text-gray-600">Utilidad Operacional / Ventas Netas</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">6,3%</p>
            <p className="text-xs text-gray-600 mt-1">2024: 5,3%</p>
          </div>
          <div className="bg-fuchsia-50 rounded-lg p-4 border-2 border-fuchsia-300 cursor-pointer hover:border-fuchsia-500 transition-all"
            onClick={() => openModal('Margen Neto de Utilidad 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-600 mb-1">2024</p><p className="text-xl font-bold text-gray-900">2,8%</p></div>
                  <div className="bg-fuchsia-50 rounded-lg p-3 border border-fuchsia-200"><p className="text-xs text-fuchsia-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-fuchsia-700">3,9%</p></div>
                </div>
                <div className="bg-fuchsia-50 rounded-lg p-4 border border-fuchsia-300"><p className="text-sm text-gray-700">Es el porcentaje de utilidad neta sobre las ventas netas. Fórmula: Utilidad Neta / Ventas Netas.</p></div>
              </div>
            )}>
            <p className="text-sm font-bold text-gray-900">MARGEN NETO DE UTILIDAD</p>
            <p className="text-xs text-gray-600">Utilidad Neta / Ventas Netas</p>
            <p className="text-2xl font-bold text-fuchsia-600 mt-2">3,9%</p>
            <p className="text-xs text-gray-600 mt-1">2024: 2,8%</p>
          </div>
          <div className="bg-pink-50 rounded-lg p-4 border-2 border-pink-300 cursor-pointer hover:border-pink-500 transition-all"
            onClick={() => openModal('Rendimiento del Patrimonio (ROE) 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-600 mb-1">2024</p><p className="text-xl font-bold text-gray-900">14,5%</p></div>
                  <div className="bg-pink-50 rounded-lg p-3 border border-pink-200"><p className="text-xs text-pink-600 font-semibold mb-1">2025</p><p className="text-xl font-bold text-pink-700">6,8%</p></div>
                </div>
                <div className="bg-pink-50 rounded-lg p-4 border border-pink-300"><p className="text-sm text-gray-700">Es el rendimiento de la inversión de los accionistas. La reducción se explica por el crecimiento extraordinario del patrimonio (+194%). Fórmula: Utilidad Neta / Patrimonio.</p></div>
              </div>
            )}>
            <p className="text-sm font-bold text-gray-900">RENDIMIENTO DEL PATRIMONIO</p>
            <p className="text-xs text-gray-600">Utilidad Neta / Patrimonio</p>
            <p className="text-2xl font-bold text-pink-600 mt-2">6,8%</p>
            <p className="text-xs text-gray-600 mt-1">2024: 14,5%</p>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      {modalOpen && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{modalContent.title}</h3>
                <button onClick={() => setModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="text-sm text-gray-700">{modalContent.content}</div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
