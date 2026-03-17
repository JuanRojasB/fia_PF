import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, DollarSign, Building, FileText, X, Info, Users, Scale, Briefcase } from 'lucide-react';
import CollapsibleTable, { fmt as formatNumber } from '../CollapsibleTable';

export default function SituacionEconomicaDashboard({ onNavigate }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });

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
          onClick={() => openModal('Utilidad Neta 2025 vs 2024', 
            <div className="space-y-4">
              <p>La utilidad neta después de impuestos para el año 2025 se determinó en <strong className="text-green-600">$16.714.000</strong> y de <strong>$12.129.000</strong> para el año 2024.</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">2024</p>
                  <p className="text-xl font-bold text-gray-900">${formatNumber(12129000000)}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <p className="text-xs text-green-600 font-semibold mb-1">2025</p>
                  <p className="text-xl font-bold text-green-700">${formatNumber(16714000000)}</p>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                <p className="text-sm font-semibold text-green-800 mb-2">Incremento Logrado:</p>
                <p className="text-sm text-gray-700">Arrojando un incremento de <strong>$4.585.000</strong>, que corresponde a un <strong className="text-green-600">37.8%</strong>.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Contexto:</p>
                <p className="text-sm text-gray-700">Este crecimiento en utilidad neta refleja la mejora en la eficiencia operativa, el control de costos y el incremento en ingresos operacionales del 1.04%.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300">
                <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                <p className="text-sm text-gray-700">El incremento del 37.8% en utilidad neta fortalece el patrimonio y mejora la capacidad de inversión de la empresa para el año 2026.</p>
              </div>
            </div>
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Utilidad Neta 2025 vs 2024</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-xl font-bold text-gray-900 leading-tight break-all">${formatNumber(16714000000)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">${formatNumber(12129000000)}</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">${formatNumber(16714000000)}</span></div>
            <div className="text-sm font-bold text-green-600">Var: +37.8%</div>
            <div className="text-xs font-semibold text-green-600">Dif: +${formatNumber(16714000000 - 12129000000)}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/95 rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
          onClick={() => openModal('Ingresos Operacionales 2025 vs 2024', 
            <div className="space-y-4">
              <p>Los ingresos netos por actividades ordinarias devengados durante el año 2025 fueron por <strong className="text-blue-600">$431.000.000</strong>, frente a <strong>$426.000.000</strong> del año 2024.</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">2024</p>
                  <p className="text-xl font-bold text-gray-900">${formatNumber(426000000000)}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-blue-600 font-semibold mb-1">2025</p>
                  <p className="text-xl font-bold text-blue-700">${formatNumber(431000000000)}</p>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                <p className="text-sm font-semibold text-green-800 mb-2">Crecimiento:</p>
                <p className="text-sm text-gray-700">Presentaron un crecimiento de <strong>$4.451.000.000</strong>, es decir, <strong className="text-green-600">+1.04%</strong>.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Contexto:</p>
                <p className="text-sm text-gray-700">El crecimiento moderado del 1.04% en ingresos, combinado con la reducción de costos de ventas (-0.43%), permitió mejorar la utilidad bruta en un 11.1%.</p>
              </div>
            </div>
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Ingresos Operacionales 2025 vs 2024</span>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-gray-900 leading-tight break-all">{formatNumber(431000000000)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{formatNumber(426000000000)}</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{formatNumber(431000000000)}</span></div>
            <div className="text-sm font-bold text-green-600">Var: +1.04%</div>
            <div className="text-xs font-semibold text-green-600">Dif: +${formatNumber(431000000000 - 426000000000)}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/95 rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
          onClick={() => openModal('Patrimonio Total 2025 vs 2024', 
            <div className="space-y-4">
              <p>El Patrimonio Contable al 31 de diciembre del año 2025 quedó valorado en <strong className="text-purple-600">$245.333.000</strong> y, para el año 2024 en <strong>$83.530.000</strong>.</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">2024</p>
                  <p className="text-xl font-bold text-gray-900">${formatNumber(83530000000)}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <p className="text-xs text-purple-600 font-semibold mb-1">2025</p>
                  <p className="text-xl font-bold text-purple-700">${formatNumber(245333000000)}</p>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                <p className="text-sm font-semibold text-green-800 mb-2">Fortalecimiento Patrimonial:</p>
                <p className="text-sm text-gray-700">Diferencia de <strong>$161.802.000</strong>, un fortalecimiento al incrementar el <strong className="text-green-600">194%</strong>.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Causas del Incremento:</p>
                <p className="text-sm text-gray-700">El crecimiento patrimonial se explica principalmente por la utilidad neta del ejercicio ($16.714.000) y la capitalización de resultados acumulados.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300">
                <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                <p className="text-sm text-gray-700">El fortalecimiento patrimonial mejora la solidez financiera (4,71 en 2025 vs 2,55 en 2024) y reduce el nivel de endeudamiento (21,2% vs 39,2%).</p>
              </div>
            </div>
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Patrimonio Total 2025 vs 2024</span>
            <Building className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-xl font-bold text-gray-900 leading-tight break-all">${formatNumber(245333000000)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">${formatNumber(83530000000)}</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">${formatNumber(245333000000)}</span></div>
            <div className="text-sm font-bold text-green-600">Var: +194%</div>
            <div className="text-xs font-semibold text-green-600">Dif: +${formatNumber(245333000000 - 83530000000)}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/95 rounded-xl p-6 border-4 border-cyan-500/30 hover:border-cyan-500 transition-all cursor-pointer"
          onClick={() => openModal('Activos Totales 2025 vs 2024', 
            <div className="space-y-4">
              <p>Los activos totales a 31 de diciembre del ejercicio económico del año 2025 cerraron en <strong className="text-cyan-600">$311.430.000</strong> para el año 2024 quedaron en <strong>$137.287.000</strong>.</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">2024</p>
                  <p className="text-xl font-bold text-gray-900">${formatNumber(137287000000)}</p>
                </div>
                <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-200">
                  <p className="text-xs text-cyan-600 font-semibold mb-1">2025</p>
                  <p className="text-xl font-bold text-cyan-700">${formatNumber(311430000000)}</p>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                <p className="text-sm font-semibold text-green-800 mb-2">Crecimiento de Activos:</p>
                <p className="text-sm text-gray-700">Variación de <strong>$174.143.000</strong>, determinando un aumento del <strong className="text-green-600">127%</strong>.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Composición:</p>
                <p className="text-sm text-gray-700">El incremento se concentra principalmente en activos corrientes, mejorando el capital de trabajo de $57.705.588.903 en 2024 a $96.138.091.362 en 2025.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300">
                <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                <p className="text-sm text-gray-700">El crecimiento de activos mejora la razón corriente (4,22 vs 3,35) y fortalece la capacidad operativa de la empresa.</p>
              </div>
            </div>
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Activos Totales 2025 vs 2024</span>
            <FileText className="w-5 h-5 text-cyan-600" />
          </div>
          <div className="text-xl font-bold text-gray-900 leading-tight break-all">${formatNumber(311430000000)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">${formatNumber(137287000000)}</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">${formatNumber(311430000000)}</span></div>
            <div className="text-sm font-bold text-green-600">Var: +127%</div>
            <div className="text-xs font-semibold text-green-600">Dif: +${formatNumber(311430000000 - 137287000000)}</div>
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
            onClick={() => openModal('Utilidad Bruta 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">2024</p>
                    <p className="text-xl font-bold text-gray-900">${formatNumber(58309000000)}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-xs text-blue-600 font-semibold mb-1">2025</p>
                    <p className="text-xl font-bold text-blue-700">${formatNumber(64781000000)}</p>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                  <p className="text-sm font-semibold text-green-800 mb-2">Incremento logrado:</p>
                  <p className="text-sm text-gray-700">La utilidad bruta creció <strong>$6.472.000.000</strong>, equivalente al <strong className="text-green-600">+11.1%</strong>, superando ampliamente el crecimiento de ingresos del 1.04%.</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                  <p className="text-sm font-semibold text-blue-800 mb-2">Causas:</p>
                  <p className="text-sm text-gray-700">El resultado se explica por la combinación de ingresos operacionales crecientes (+1.04%) y la reducción simultánea de costos de ventas (-0.43%), principalmente por la disminución en el costo directo del ABA (alimento balanceado avícola).</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                  <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                  <p className="text-sm text-gray-700">El margen bruto mejoró de 13.7% en 2024 a 15.0% en 2025, reflejando mayor eficiencia en la estructura de costos productivos.</p>
                </div>
              </div>
            )}>
            <p className="text-sm text-gray-600 mb-2">Utilidad Bruta 2025</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(64781000000)}</p>
            <div className="border-t border-gray-200 pt-1 mt-1 space-y-0.5">
              <p className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">${formatNumber(58309000000)}</span></p>
              <p className="text-xs font-bold text-green-600">Var: +11.1%</p>
              <p className="text-xs font-semibold text-green-600">Dif: +${formatNumber(64781000000 - 58309000000)}</p>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300 cursor-pointer hover:border-green-500 transition-all"
            onClick={() => openModal('Utilidad Operacional 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">2024</p>
                    <p className="text-xl font-bold text-gray-900">${formatNumber(22534000000)}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-green-600 font-semibold mb-1">2025</p>
                    <p className="text-xl font-bold text-green-700">${formatNumber(27229000000)}</p>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                  <p className="text-sm font-semibold text-green-800 mb-2">Crecimiento:</p>
                  <p className="text-sm text-gray-700">La utilidad operacional creció <strong>$4.695.000.000</strong>, un <strong className="text-green-600">+20.8%</strong>, duplicando el ritmo de crecimiento de los ingresos.</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                  <p className="text-sm font-semibold text-blue-800 mb-2">Análisis:</p>
                  <p className="text-sm text-gray-700">El margen operacional mejoró de 5.3% a 6.3%. Aunque los gastos de ventas (+9.90%) y beneficios a empleados (+9%) aumentaron, el crecimiento de la utilidad bruta (+11.1%) fue suficiente para absorberlos y generar mayor utilidad operativa.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                  <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                  <p className="text-sm text-gray-700">El EBITDA creció de $25.734 millones (6.0%) a $29.713 millones (6.8%), confirmando la mejora en la generación de caja operativa.</p>
                </div>
              </div>
            )}>
            <p className="text-sm text-gray-600 mb-2">Utilidad Operacional 2025</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(27229000000)}</p>
            <div className="border-t border-gray-200 pt-1 mt-1 space-y-0.5">
              <p className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">${formatNumber(22534000000)}</span></p>
              <p className="text-xs font-bold text-green-600">Var: +20.8%</p>
              <p className="text-xs font-semibold text-green-600">Dif: +${formatNumber(27229000000 - 22534000000)}</p>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300 cursor-pointer hover:border-purple-500 transition-all"
            onClick={() => openModal('Costos de Ventas 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">2024</p>
                    <p className="text-xl font-bold text-gray-900">${formatNumber(370332000000)}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-green-600 font-semibold mb-1">2025</p>
                    <p className="text-xl font-bold text-green-700">${formatNumber(368749000000)}</p>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                  <p className="text-sm font-semibold text-green-800 mb-2">Reducción lograda:</p>
                  <p className="text-sm text-gray-700">Los costos de ventas disminuyeron <strong>$1.583.000.000</strong>, equivalente al <strong className="text-green-600">-0.43%</strong>, a pesar del crecimiento en volumen de operaciones.</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                  <p className="text-sm font-semibold text-blue-800 mb-2">Causa principal:</p>
                  <p className="text-sm text-gray-700">La disminución se explica principalmente por la reducción en el costo directo del ABA (alimento balanceado avícola), el insumo de mayor peso en la estructura de costos de producción avícola.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                  <p className="text-sm font-semibold text-purple-800 mb-2">Impacto estratégico:</p>
                  <p className="text-sm text-gray-700">La reducción de costos con ingresos crecientes es la combinación ideal: permitió que el margen bruto mejorara 1.3 puntos porcentuales (de 13.7% a 15.0%).</p>
                </div>
              </div>
            )}>
            <p className="text-sm text-gray-600 mb-2">Costos de Ventas 2025</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(368749000000)}</p>
            <div className="border-t border-gray-200 pt-1 mt-1 space-y-0.5">
              <p className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">${formatNumber(370332000000)}</span></p>
              <p className="text-xs font-bold text-green-600">Var: -0.43%</p>
              <p className="text-xs font-semibold text-green-600">Dif: -${formatNumber(370332000000 - 368749000000)}</p>
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300 cursor-pointer hover:border-red-500 transition-all"
            onClick={() => openModal('Costo Neto Financiero 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">2024</p>
                    <p className="text-xl font-bold text-gray-900">${formatNumber(6880000000)}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-green-600 font-semibold mb-1">2025</p>
                    <p className="text-xl font-bold text-green-700">${formatNumber(6061000000)}</p>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                  <p className="text-sm font-semibold text-green-800 mb-2">Reducción:</p>
                  <p className="text-sm text-gray-700">El costo financiero disminuyó <strong>$819.000.000</strong>, equivalente al <strong className="text-green-600">-11.91%</strong>, una mejora significativa en la carga financiera.</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                  <p className="text-sm font-semibold text-blue-800 mb-2">Componentes:</p>
                  <p className="text-sm text-gray-700">El costo financiero está compuesto por: intereses pagados por obligaciones financieras y el gravamen al movimiento financiero (GMF) generado por la bancarización de los pagos.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                  <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                  <p className="text-sm text-gray-700">La cobertura de gastos financieros mejoró de 1.6% a 1.4% de las ventas netas, y el apalancamiento financiero se redujo de 37.4% a 14.3% del capital contable.</p>
                </div>
              </div>
            )}>
            <p className="text-sm text-gray-600 mb-2">Costo Financiero 2025</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(6061000000)}</p>
            <div className="border-t border-gray-200 pt-1 mt-1 space-y-0.5">
              <p className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">${formatNumber(6880000000)}</span></p>
              <p className="text-xs font-bold text-green-600">Var: -11.91%</p>
              <p className="text-xs font-semibold text-green-600">Dif: -${formatNumber(6880000000 - 6061000000)}</p>
            </div>
          </div>
          <div className="bg-cyan-50 rounded-lg p-4 border-2 border-cyan-300 cursor-pointer hover:border-cyan-500 transition-all"
            onClick={() => openModal('Otros Ingresos Financieros 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">2024</p>
                    <p className="text-xl font-bold text-gray-900">${formatNumber(2555000000)}</p>
                  </div>
                  <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-200">
                    <p className="text-xs text-cyan-600 font-semibold mb-1">2025</p>
                    <p className="text-xl font-bold text-cyan-700">${formatNumber(4127000000)}</p>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                  <p className="text-sm font-semibold text-green-800 mb-2">Crecimiento:</p>
                  <p className="text-sm text-gray-700">Los ingresos financieros crecieron <strong>$1.572.000.000</strong>, equivalente al <strong className="text-green-600">+61.53%</strong>, el mayor crecimiento porcentual entre todos los indicadores del estado de resultados.</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                  <p className="text-sm font-semibold text-blue-800 mb-2">Causa:</p>
                  <p className="text-sm text-gray-700">El incremento es producto de la mayor colocación de recursos en fiducias de rentabilidad, generando intereses adicionales sobre los portafolios de inversión.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                  <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                  <p className="text-sm text-gray-700">Los ingresos financieros contribuyeron positivamente a la utilidad antes de impuestos, compensando parcialmente el costo financiero neto de $6.061 millones.</p>
                </div>
              </div>
            )}>
            <p className="text-sm text-gray-600 mb-2">Ingresos Financieros 2025</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(4127000000)}</p>
            <div className="border-t border-gray-200 pt-1 mt-1 space-y-0.5">
              <p className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">${formatNumber(2555000000)}</span></p>
              <p className="text-xs font-bold text-green-600">Var: +61.53%</p>
              <p className="text-xs font-semibold text-green-600">Dif: +${formatNumber(4127000000 - 2555000000)}</p>
            </div>
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
            <div className="border-t border-gray-200 pt-1 mt-1 space-y-0.5">
              <p className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">${formatNumber(3744000000)}</span></p>
              <p className="text-xs font-bold text-red-600">Var: +4.91%</p>
              <p className="text-xs font-semibold text-red-600">Dif: +${formatNumber(3928000000 - 3744000000)}</p>
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300">
            <p className="text-sm text-gray-600 mb-2">Gastos de Ventas</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(11528000000)}</p>
            <div className="border-t border-gray-200 pt-1 mt-1 space-y-0.5">
              <p className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">${formatNumber(10490000000)}</span></p>
              <p className="text-xs font-bold text-red-600">Var: +9.90%</p>
              <p className="text-xs font-semibold text-red-600">Dif: +${formatNumber(11528000000 - 10490000000)}</p>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-300">
            <p className="text-sm text-gray-600 mb-2">Beneficios a Empleados</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(21118000000)}</p>
            <div className="border-t border-gray-200 pt-1 mt-1 space-y-0.5">
              <p className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">${formatNumber(19369000000)}</span></p>
              <p className="text-xs font-bold text-red-600">Var: +9%</p>
              <p className="text-xs font-semibold text-red-600">Dif: +${formatNumber(21118000000 - 19369000000)}</p>
            </div>
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
            <div className="border-t border-gray-200 pt-1 mt-1 space-y-0.5">
              <p className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">${formatNumber(137287000000)}</span></p>
              <p className="text-xs font-bold text-green-600">Var: +127%</p>
              <p className="text-xs font-semibold text-green-600">Dif: +${formatNumber(311430000000 - 137287000000)}</p>
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300">
            <p className="text-sm text-gray-600 mb-2">Pasivos Totales 2025</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(66097000000)}</p>
            <div className="border-t border-gray-200 pt-1 mt-1 space-y-0.5">
              <p className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">${formatNumber(53756000000)}</span></p>
              <p className="text-xs font-bold text-red-600">Var: +23%</p>
              <p className="text-xs font-semibold text-red-600">Dif: +${formatNumber(66097000000 - 53756000000)}</p>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300">
            <p className="text-sm text-gray-600 mb-2">Patrimonio 2025</p>
            <p className="text-2xl font-bold text-gray-900">${formatNumber(245333000000)}</p>
            <div className="border-t border-gray-200 pt-1 mt-1 space-y-0.5">
              <p className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">${formatNumber(83530000000)}</span></p>
              <p className="text-xs font-bold text-green-600">Var: +194%</p>
              <p className="text-xs font-semibold text-green-600">Dif: +${formatNumber(245333000000 - 83530000000)}</p>
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

      {/* 1. INDICADORES DE LIQUIDEZ - CARDS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">1. INDICADORES DE LIQUIDEZ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300 cursor-pointer hover:border-blue-500 transition-all"
            onClick={() => openModal('Capital de Trabajo 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">2024</p>
                    <p className="text-xl font-bold text-gray-900">$57.705.588.903</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-xs text-blue-600 font-semibold mb-1">2025</p>
                    <p className="text-xl font-bold text-blue-700">$96.138.091.362</p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                  <p className="text-sm font-semibold text-blue-800 mb-2">Definición:</p>
                  <p className="text-sm text-gray-700">Son los recursos con que se dispone para desarrollar la actividad fluidamente. Se calcula restando el Pasivo Corriente del Activo Corriente.</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                  <p className="text-sm font-semibold text-green-800 mb-2">Análisis:</p>
                  <p className="text-sm text-gray-700">El capital de trabajo creció <strong>$38.432.502.459</strong> (+66.6%), reflejando el fortalecimiento patrimonial del 194% y el crecimiento de activos corrientes. La empresa dispone de mayor liquidez operativa para 2026.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                  <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                  <p className="text-sm text-gray-700">Un capital de trabajo positivo y creciente garantiza la continuidad operativa sin necesidad de recurrir a financiamiento de corto plazo para cubrir obligaciones corrientes.</p>
                </div>
              </div>
            )}
          >
            <p className="text-sm font-bold text-gray-900">CAPITAL DE TRABAJO</p>
            <p className="text-xs text-gray-600">(Activo Corriente - Pasivo Corriente)</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">96.138.091.362</p>
            <p className="text-xs text-gray-600 mt-1">2024: 57.705.588.903</p>
          </div>

          <div 
            className="bg-cyan-50 rounded-lg p-4 border-2 border-cyan-300 cursor-pointer hover:border-cyan-500 transition-all"
            onClick={() => openModal('Razón Corriente 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">2024</p>
                    <p className="text-xl font-bold text-gray-900">$3,35</p>
                  </div>
                  <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-200">
                    <p className="text-xs text-cyan-600 font-semibold mb-1">2025</p>
                    <p className="text-xl font-bold text-cyan-700">$4,22</p>
                  </div>
                </div>
                <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-300">
                  <p className="text-sm font-semibold text-cyan-800 mb-2">Definición:</p>
                  <p className="text-sm text-gray-700">Por cada peso de deuda en el corto plazo, la empresa dispone de $4.22 de respaldo para cumplir con la obligación.</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                  <p className="text-sm font-semibold text-green-800 mb-2">Análisis:</p>
                  <p className="text-sm text-gray-700">La razón corriente mejoró de 3.35 a 4.22, superando ampliamente el umbral mínimo de 1.0. Este nivel indica una posición de liquidez muy sólida, con activos corrientes que cuadruplican los pasivos corrientes.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                  <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                  <p className="text-sm text-gray-700">Una razón corriente de 4.22 refleja la capacidad de la empresa para honrar todas sus obligaciones de corto plazo con amplio margen, reduciendo el riesgo de iliquidez operativa.</p>
                </div>
              </div>
            )}
          >
            <p className="text-sm font-bold text-gray-900">RAZÓN CORRIENTE</p>
            <p className="text-xs text-gray-600">Activo corriente / Pasivo corriente</p>
            <p className="text-2xl font-bold text-cyan-600 mt-2">$ 4,22</p>
            <p className="text-xs text-gray-600 mt-1">2024: $ 3,35</p>
          </div>

          <div 
            className="bg-indigo-50 rounded-lg p-4 border-2 border-indigo-300 cursor-pointer hover:border-indigo-500 transition-all"
            onClick={() => openModal('Prueba Ácida 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">2024</p>
                    <p className="text-xl font-bold text-gray-900">$3,31</p>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                    <p className="text-xs text-indigo-600 font-semibold mb-1">2025</p>
                    <p className="text-xl font-bold text-indigo-700">$4,05</p>
                  </div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-300">
                  <p className="text-sm font-semibold text-indigo-800 mb-2">Definición:</p>
                  <p className="text-sm text-gray-700">Es el respaldo para cancelar un peso en el corto plazo sin comprometer los inventarios. Fórmula: (Activo corriente - Inventario) / Pasivo corriente.</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                  <p className="text-sm font-semibold text-green-800 mb-2">Análisis:</p>
                  <p className="text-sm text-gray-700">La prueba ácida de 4.05 es casi igual a la razón corriente (4.22), lo que indica que los inventarios representan una porción muy pequeña del activo corriente. La liquidez no depende de la venta de inventarios.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                  <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                  <p className="text-sm text-gray-700">La mejora de 3.31 a 4.05 confirma que la empresa mantiene una posición de liquidez inmediata muy robusta, con activos líquidos suficientes para cubrir cuatro veces sus obligaciones corrientes.</p>
                </div>
              </div>
            )}
          >
            <p className="text-sm font-bold text-gray-900">PRUEBA ÁCIDA</p>
            <p className="text-xs text-gray-600">(Activo corriente - inventario) / pasivo corriente</p>
            <p className="text-2xl font-bold text-indigo-600 mt-2">$ 4,05</p>
            <p className="text-xs text-gray-600 mt-1">2024: $ 3,31</p>
          </div>

          <div 
            className="bg-sky-50 rounded-lg p-4 border-2 border-sky-300 cursor-pointer hover:border-sky-500 transition-all"
            onClick={() => openModal('Solidez Financiera 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">2024</p>
                    <p className="text-xl font-bold text-gray-900">$2,55</p>
                  </div>
                  <div className="bg-sky-50 rounded-lg p-3 border border-sky-200">
                    <p className="text-xs text-sky-600 font-semibold mb-1">2025</p>
                    <p className="text-xl font-bold text-sky-700">$4,71</p>
                  </div>
                </div>
                <div className="bg-sky-50 rounded-lg p-4 border border-sky-300">
                  <p className="text-sm font-semibold text-sky-800 mb-2">Definición:</p>
                  <p className="text-sm text-gray-700">Mide la consistencia financiera para cubrir la deuda total. Fórmula: Activo total / Pasivo total. Por cada peso de deuda total, la empresa tiene $4.71 en activos.</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                  <p className="text-sm font-semibold text-green-800 mb-2">Análisis:</p>
                  <p className="text-sm text-gray-700">La solidez casi se duplicó (de 2.55 a 4.71), impulsada por el crecimiento de activos totales del 127% frente a un crecimiento de pasivos del 23%. El fortalecimiento patrimonial del 194% es el principal motor.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                  <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                  <p className="text-sm text-gray-700">Una solidez de 4.71 posiciona a Pollo Fiesta con una estructura financiera muy sólida, con capacidad para asumir nuevas obligaciones sin comprometer su estabilidad.</p>
                </div>
              </div>
            )}
          >
            <p className="text-sm font-bold text-gray-900">SOLIDEZ</p>
            <p className="text-xs text-gray-600">Activo total / Pasivo total</p>
            <p className="text-2xl font-bold text-sky-600 mt-2">$ 4,71</p>
            <p className="text-xs text-gray-600 mt-1">2024: $ 2,55</p>
          </div>

          <div 
            className="bg-blue-100 rounded-lg p-4 border-2 border-blue-400 md:col-span-2 cursor-pointer hover:border-blue-600 transition-all"
            onClick={() => openModal('EBITDA 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">2024</p>
                    <p className="text-xl font-bold text-gray-900">$25.734.246.272</p>
                    <p className="text-sm font-semibold text-gray-600">Margen: 6.0%</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-xs text-blue-600 font-semibold mb-1">2025</p>
                    <p className="text-xl font-bold text-blue-700">$29.712.979.101</p>
                    <p className="text-sm font-semibold text-blue-600">Margen: 6.8%</p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                  <p className="text-sm font-semibold text-blue-800 mb-2">Definición:</p>
                  <p className="text-sm text-gray-700">Beneficio Bruto sin gastos financieros, amortizaciones e impuestos. Mide la rentabilidad operativa pura de la empresa, independiente de la estructura de capital y política fiscal.</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                  <p className="text-sm font-semibold text-green-800 mb-2">Análisis:</p>
                  <p className="text-sm text-gray-700">El EBITDA creció <strong>$3.978.732.829</strong> (+15.5%), con el margen mejorando de 6.0% a 6.8%. Esto confirma que la mejora en rentabilidad es estructural y no depende de factores financieros o fiscales.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                  <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                  <p className="text-sm text-gray-700">Un EBITDA creciente y con mayor margen indica que la empresa genera más caja operativa por cada peso de ingreso, fortaleciendo su capacidad de inversión y servicio de deuda.</p>
                </div>
              </div>
            )}
          >
            <p className="text-sm font-bold text-gray-900">EBITDA</p>
            <p className="text-xs text-gray-600">Margen Ebitda = Ebitda / Ingresos Totales</p>
            <div className="flex gap-8 mt-2">
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
          </div>
        </div>
      </motion.div>

      {/* 1. INDICADORES DE LIQUIDEZ - TABLA */}
      <CollapsibleTable title="Tabla Detallada - Indicadores de Liquidez" defaultOpen={false} className="border-4 border-blue-500/30">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 font-bold text-gray-900"></th>
                <th className="text-center py-3 px-4 font-bold text-gray-900 border-l border-gray-300">2.025</th>
                <th className="text-center py-3 px-4 font-bold text-gray-900 border-l border-gray-300">2.024</th>
                <th className="text-center py-3 px-4 font-bold text-gray-900 border-l border-gray-300">SECTOR AVÍCOLA</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4"><div className="font-semibold text-gray-900">CAPITAL DE TRABAJO</div><div className="text-xs text-gray-600">(Activo Corriente - Pasivo Corriente)</div></td>
                <td className="text-center py-3 px-4 border-l border-gray-200 font-semibold">96.138.091.362</td>
                <td className="text-center py-3 px-4 border-l border-gray-200">57.705.588.903</td>
                <td className="text-center py-3 px-4 border-l border-gray-200"><div className="flex items-center justify-center gap-2"><span className="text-2xl">⟺</span><span className="text-xs text-gray-600">Son los recursos con que se dispone para desarrollar su actividad fluidamente.</span></div></td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4"><div className="font-semibold text-gray-900">RAZÓN CORRIENTE</div><div className="text-xs text-gray-600">Activo corriente / Pasivo corriente</div></td>
                <td className="text-center py-3 px-4 border-l border-gray-200 font-semibold">$ 4,22</td>
                <td className="text-center py-3 px-4 border-l border-gray-200">$ 3,35</td>
                <td className="text-center py-3 px-4 border-l border-gray-200"><div className="flex items-center justify-center gap-2"><span className="text-2xl">⟺</span><span className="text-xs text-gray-600">Por cada peso de deuda en cte. se dispone de n veces de respaldo para cumplir con la obligación.</span></div></td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4"><div className="font-semibold text-gray-900">PRUEBA ÁCIDA</div><div className="text-xs text-gray-600">(Activo corriente - inventario) / pasivo corriente</div></td>
                <td className="text-center py-3 px-4 border-l border-gray-200 font-semibold">$ 4,05</td>
                <td className="text-center py-3 px-4 border-l border-gray-200">$ 3,31</td>
                <td className="text-center py-3 px-4 border-l border-gray-200"><div className="flex items-center justify-center gap-2"><span className="text-2xl">⟺</span><span className="text-xs text-gray-600">Es el respaldo que se tiene para cancelar un peso en el corto plazo sin comprometer los inventarios.</span></div></td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4"><div className="font-semibold text-gray-900">SOLIDEZ</div><div className="text-xs text-gray-600">Activo total / Pasivo total</div></td>
                <td className="text-center py-3 px-4 border-l border-gray-200 font-semibold">$ 4,71</td>
                <td className="text-center py-3 px-4 border-l border-gray-200">$ 2,55</td>
                <td className="text-center py-3 px-4 border-l border-gray-200"><div className="flex items-center justify-center gap-2"><span className="text-2xl">⟺</span><span className="text-xs text-gray-600">Es la consistencia financiera para cubrir su deuda total.</span></div></td>
              </tr>
              <tr className="bg-blue-50 border-b-2 border-blue-300">
                <td className="py-3 px-4"><div className="font-semibold text-gray-900">EBITDA</div><div className="text-xs text-gray-600">Margen Ebitda = Ebitda / Ingresos Totales</div></td>
                <td className="text-center py-3 px-4 border-l border-gray-200 font-semibold"><div>29.712.979.101</div><div className="text-blue-600">6,8%</div></td>
                <td className="text-center py-3 px-4 border-l border-gray-200"><div>25.734.246.272</div><div className="text-blue-600">6,0%</div></td>
                <td className="text-center py-3 px-4 border-l border-gray-200"><div className="flex items-center justify-center gap-2"><span className="text-2xl">⟺</span><span className="text-xs text-gray-600">Beneficio Bruto sin gastos financieros amortizaciones e impuestos</span></div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </CollapsibleTable>

      {/* 2. INDICADORES DE ENDEUDAMIENTO - CARDS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">2. INDICADORES DE ENDEUDAMIENTO</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            className="bg-red-50 rounded-lg p-4 border-2 border-red-300 cursor-pointer hover:border-red-500 transition-all"
            onClick={() => openModal('Nivel de Endeudamiento 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">2024</p>
                    <p className="text-xl font-bold text-gray-900">39,2%</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-green-600 font-semibold mb-1">2025</p>
                    <p className="text-xl font-bold text-green-700">21,2%</p>
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-300">
                  <p className="text-sm font-semibold text-red-800 mb-2">Definición:</p>
                  <p className="text-sm text-gray-700">Es el porcentaje en que participan los acreedores en los activos de la empresa. Fórmula: Pasivo Total / Activo Total.</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                  <p className="text-sm font-semibold text-green-800 mb-2">Análisis:</p>
                  <p className="text-sm text-gray-700">El endeudamiento se redujo drásticamente de 39.2% a 21.2% (-18 puntos porcentuales). Esto se explica porque los activos crecieron 127% mientras los pasivos solo crecieron 23%, gracias al fortalecimiento patrimonial del 194%.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                  <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                  <p className="text-sm text-gray-700">Un nivel de endeudamiento del 21.2% es considerado bajo y saludable para el sector avícola, indicando que la empresa financia la mayor parte de sus activos con recursos propios.</p>
                </div>
              </div>
            )}
          >
            <p className="text-sm font-bold text-gray-900">NIVEL DE ENDEUDAMIENTO</p>
            <p className="text-xs text-gray-600">Pasivo / Activo</p>
            <p className="text-2xl font-bold text-red-600 mt-2">21,2%</p>
            <p className="text-xs text-gray-600 mt-1">2024: 39,2%</p>
          </div>

          <div 
            className="bg-orange-50 rounded-lg p-4 border-2 border-orange-300 cursor-pointer hover:border-orange-500 transition-all"
            onClick={() => openModal('Endeudamiento a Corto Plazo 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">2024</p>
                    <p className="text-xl font-bold text-gray-900">45,7%</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                    <p className="text-xs text-orange-600 font-semibold mb-1">2025</p>
                    <p className="text-xl font-bold text-orange-700">45,1%</p>
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-300">
                  <p className="text-sm font-semibold text-orange-800 mb-2">Definición:</p>
                  <p className="text-sm text-gray-700">Es el porcentaje en que participan los acreedores de corto plazo en el pasivo total. Fórmula: Pasivo Corriente / Pasivo Total.</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                  <p className="text-sm font-semibold text-blue-800 mb-2">Análisis:</p>
                  <p className="text-sm text-gray-700">El indicador se mantuvo estable (45.7% → 45.1%), mostrando que la estructura de vencimientos de la deuda no cambió significativamente. Aproximadamente la mitad de las obligaciones son de corto plazo.</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                  <p className="text-sm font-semibold text-green-800 mb-2">Impacto:</p>
                  <p className="text-sm text-gray-700">Con una razón corriente de 4.22, la empresa tiene amplia capacidad para cubrir sus obligaciones de corto plazo, por lo que este nivel de endeudamiento corriente no representa un riesgo de liquidez.</p>
                </div>
              </div>
            )}
          >
            <p className="text-sm font-bold text-gray-900">ENDEUDAMIENTO A CORTO PLAZO</p>
            <p className="text-xs text-gray-600">Pasivo Corriente / Pasivo Total</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">45,1%</p>
            <p className="text-xs text-gray-600 mt-1">2024: 45,7%</p>
          </div>

          <div 
            className="bg-rose-50 rounded-lg p-4 border-2 border-rose-300 cursor-pointer hover:border-rose-500 transition-all"
            onClick={() => openModal('Cobertura de Gastos Financieros 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">2024</p>
                    <p className="text-xl font-bold text-gray-900">1,6%</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-green-600 font-semibold mb-1">2025</p>
                    <p className="text-xl font-bold text-green-700">1,4%</p>
                  </div>
                </div>
                <div className="bg-rose-50 rounded-lg p-4 border border-rose-300">
                  <p className="text-sm font-semibold text-rose-800 mb-2">Definición:</p>
                  <p className="text-sm text-gray-700">Es el porcentaje que representan los costos financieros sobre las ventas netas. Fórmula: Costos financieros / Ventas netas.</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                  <p className="text-sm font-semibold text-green-800 mb-2">Análisis:</p>
                  <p className="text-sm text-gray-700">La carga financiera se redujo de 1.6% a 1.4% de las ventas, gracias a la disminución del costo financiero en -11.91% ($819 millones menos). Los costos financieros consumen una porción mínima de los ingresos.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                  <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                  <p className="text-sm text-gray-700">Un 1.4% de cobertura financiera es muy bajo, indicando que la empresa no está sobre-apalancada y que sus obligaciones financieras no comprometen significativamente su rentabilidad operativa.</p>
                </div>
              </div>
            )}
          >
            <p className="text-sm font-bold text-gray-900">COBERTURA DE GASTOS FINANCIEROS</p>
            <p className="text-xs text-gray-600">Costos financieros / Ventas netas</p>
            <p className="text-2xl font-bold text-rose-600 mt-2">1,4%</p>
            <p className="text-xs text-gray-600 mt-1">2024: 1,6%</p>
          </div>

          <div 
            className="bg-red-100 rounded-lg p-4 border-2 border-red-400 md:col-span-3 cursor-pointer hover:border-red-600 transition-all"
            onClick={() => openModal('Indicador de Apalancamiento 2025 vs 2024',
              <div className="space-y-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-300">
                  <p className="text-sm font-semibold text-red-800 mb-2">Definición:</p>
                  <p className="text-sm text-gray-700">Mide el grado de compromiso de los accionistas para con el sector financiero. Relaciona el pasivo con el capital contable desde tres perspectivas.</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-red-200 text-center">
                    <p className="text-xs text-gray-600 mb-1">Pasivo / Capital</p>
                    <p className="text-lg font-bold text-red-600">26,9%</p>
                    <p className="text-xs text-gray-500">2024: 64,4%</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-red-200 text-center">
                    <p className="text-xs text-gray-600 mb-1">Pasivo Cte / Capital</p>
                    <p className="text-lg font-bold text-red-600">12,2%</p>
                    <p className="text-xs text-gray-500">2024: 29,4%</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-red-200 text-center">
                    <p className="text-xs text-gray-600 mb-1">Pasivo Fin / Capital</p>
                    <p className="text-lg font-bold text-red-600">14,3%</p>
                    <p className="text-xs text-gray-500">2024: 37,4%</p>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                  <p className="text-sm font-semibold text-green-800 mb-2">Análisis:</p>
                  <p className="text-sm text-gray-700">Los tres indicadores de apalancamiento se redujeron drásticamente. El apalancamiento total pasó de 64.4% a 26.9%, el financiero de 37.4% a 14.3%. El fortalecimiento patrimonial del 194% es la causa principal.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                  <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                  <p className="text-sm text-gray-700">La reducción del apalancamiento mejora la percepción de riesgo crediticio de la empresa y amplía su capacidad de acceder a nuevas líneas de crédito en condiciones favorables.</p>
                </div>
              </div>
            )}
          >
            <p className="text-sm font-bold text-gray-900 mb-3">INDICADOR DE APALANCAMIENTO</p>
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
      </motion.div>

      {/* 2. INDICADORES DE ENDEUDAMIENTO - TABLA */}
      <CollapsibleTable title="Tabla Detallada - Indicadores de Endeudamiento" defaultOpen={false} className="border-4 border-red-500/30">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 font-bold text-gray-900"></th>
                <th className="text-center py-3 px-4 font-bold text-gray-900 border-l border-gray-300">2.025</th>
                <th className="text-center py-3 px-4 font-bold text-gray-900 border-l border-gray-300">2.024</th>
                <th className="text-center py-3 px-4 font-bold text-gray-900 border-l border-gray-300">SECTOR AVÍCOLA</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4"><div className="font-semibold text-gray-900">NIVEL DE ENDEUDAMIENTO</div><div className="text-xs text-gray-600">Pasivo / Activo</div></td>
                <td className="text-center py-3 px-4 border-l border-gray-200 font-semibold">21,2%</td>
                <td className="text-center py-3 px-4 border-l border-gray-200">39,2%</td>
                <td className="text-center py-3 px-4 border-l border-gray-200"><div className="flex items-center justify-center gap-2"><span className="text-2xl">⟺</span><span className="text-xs text-gray-600">Es el % en que participan los acreedores en los activos de la empresa</span></div></td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4"><div className="font-semibold text-gray-900">ENDEUDAMIENTO A CORTO PLAZO</div><div className="text-xs text-gray-600">Pasivo Corriente / Pasivo Total</div></td>
                <td className="text-center py-3 px-4 border-l border-gray-200 font-semibold">45,1%</td>
                <td className="text-center py-3 px-4 border-l border-gray-200">45,7%</td>
                <td className="text-center py-3 px-4 border-l border-gray-200"><div className="flex items-center justify-center gap-2"><span className="text-2xl">⟺</span><span className="text-xs text-gray-600">Es el % en que participan los acreedores del corto plazo en los activos de la compañía.</span></div></td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4"><div className="font-semibold text-gray-900">COBERTURA DE GASTOS FINANCIEROS</div><div className="text-xs text-gray-600">Costos financieros / Ventas netas</div></td>
                <td className="text-center py-3 px-4 border-l border-gray-200 font-semibold">1,4%</td>
                <td className="text-center py-3 px-4 border-l border-gray-200">1,6%</td>
                <td className="text-center py-3 px-4 border-l border-gray-200"><div className="flex items-center justify-center gap-2"><span className="text-2xl">⟺</span><span className="text-xs text-gray-600">Es el % en que participa de la parte de las ventas</span></div></td>
              </tr>
              <tr className="bg-red-50 border-b border-gray-200">
                <td className="py-3 px-4"><div className="font-semibold text-gray-900">INDICADOR DE APALANCAMIENTO</div><div className="text-xs text-gray-600">Pasivo / Capital contable</div></td>
                <td className="text-center py-3 px-4 border-l border-gray-200 font-semibold">26,9%</td>
                <td className="text-center py-3 px-4 border-l border-gray-200">64,4%</td>
                <td className="text-center py-3 px-4 border-l border-gray-200" rowSpan="3"><div className="flex items-center justify-center gap-2"><span className="text-2xl">⟺</span><span className="text-xs text-gray-600">Mide el grado de compromiso de los accionistas para con el sector financiero.</span></div></td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-600">Pasivo corriente / Capital Contable</td>
                <td className="text-center py-3 px-4 border-l border-gray-200">12,2%</td>
                <td className="text-center py-3 px-4 border-l border-gray-200">29,4%</td>
              </tr>
              <tr className="border-b-2 border-red-300 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-600">Pasivo Financiero / Capital Contable</td>
                <td className="text-center py-3 px-4 border-l border-gray-200">14,3%</td>
                <td className="text-center py-3 px-4 border-l border-gray-200">37,4%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CollapsibleTable>

      {/* 3. INDICADORES DE ACTIVIDAD - CARDS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">3. INDICADORES DE ACTIVIDAD</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            className="bg-green-50 rounded-lg p-4 border-2 border-green-300 cursor-pointer hover:border-green-500 transition-all"
            onClick={() => openModal('Rotación de Cartera 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">2024</p>
                    <p className="text-xl font-bold text-gray-900">14,99 veces</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-green-600 font-semibold mb-1">2025</p>
                    <p className="text-xl font-bold text-green-700">15,40 veces</p>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                  <p className="text-sm font-semibold text-green-800 mb-2">Definición:</p>
                  <p className="text-sm text-gray-700">Es el número de veces que rota la cartera respecto a las ventas del año. Indica la eficiencia en el cobro de las cuentas por cobrar.</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                  <p className="text-sm font-semibold text-blue-800 mb-2">Análisis:</p>
                  <p className="text-sm text-gray-700">La rotación mejoró de 14.99 a 15.40 veces, equivalente a un período de cobro de aproximadamente 23.7 días. Esto refleja una gestión de cartera eficiente, consistente con los resultados del área de Cartera reportados en el informe.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                  <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                  <p className="text-sm text-gray-700">Una rotación de cartera alta reduce el ciclo de conversión de efectivo y mejora la liquidez operativa, contribuyendo al crecimiento del capital de trabajo.</p>
                </div>
              </div>
            )}
          >
            <p className="text-sm font-bold text-gray-900">ROTACIÓN DE CARTERA</p>
            <p className="text-2xl font-bold text-green-600 mt-2">15,40</p>
            <p className="text-xs text-gray-600 mt-1">2024: 14,99</p>
          </div>

          <div 
            className="bg-emerald-50 rounded-lg p-4 border-2 border-emerald-300 cursor-pointer hover:border-emerald-500 transition-all"
            onClick={() => openModal('Rotación de Inventarios 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">2024</p>
                    <p className="text-xl font-bold text-gray-900">22,2 veces</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                    <p className="text-xs text-emerald-600 font-semibold mb-1">2025</p>
                    <p className="text-xl font-bold text-emerald-700">39,2 veces</p>
                  </div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-300">
                  <p className="text-sm font-semibold text-emerald-800 mb-2">Definición:</p>
                  <p className="text-sm text-gray-700">Es la cantidad de veces que el inventario se renueva en el año. Fórmula: Costo de mercancía / Promedio de inventarios.</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                  <p className="text-sm font-semibold text-green-800 mb-2">Análisis:</p>
                  <p className="text-sm text-gray-700">La rotación casi se duplicó (22.2 → 39.2 veces), equivalente a un período de inventario de ~9.3 días en 2025 vs ~16.4 días en 2024. Esto refleja una gestión de inventarios significativamente más eficiente.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                  <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                  <p className="text-sm text-gray-700">Una mayor rotación de inventarios reduce los costos de almacenamiento, minimiza el riesgo de obsolescencia y libera capital de trabajo, contribuyendo a la mejora del capital de trabajo observada.</p>
                </div>
              </div>
            )}
          >
            <p className="text-sm font-bold text-gray-900">ROTACIÓN DE INVENTARIOS</p>
            <p className="text-xs text-gray-600">(Costo de Mcia / Prom. de Inventarios)</p>
            <p className="text-2xl font-bold text-emerald-600 mt-2">39,2</p>
            <p className="text-xs text-gray-600 mt-1">2024: 22,2</p>
          </div>

          <div 
            className="bg-teal-50 rounded-lg p-4 border-2 border-teal-300 cursor-pointer hover:border-teal-500 transition-all"
            onClick={() => openModal('Rotación del Patrimonio 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">2024</p>
                    <p className="text-xl font-bold text-gray-900">5,1 veces</p>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-3 border border-teal-200">
                    <p className="text-xs text-teal-600 font-semibold mb-1">2025</p>
                    <p className="text-xl font-bold text-teal-700">1,8 veces</p>
                  </div>
                </div>
                <div className="bg-teal-50 rounded-lg p-4 border border-teal-300">
                  <p className="text-sm font-semibold text-teal-800 mb-2">Definición:</p>
                  <p className="text-sm text-gray-700">Es el volumen de ventas generado por cada peso de patrimonio invertido. Fórmula: Ventas Netas / Patrimonio.</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-300">
                  <p className="text-sm font-semibold text-yellow-800 mb-2">Análisis:</p>
                  <p className="text-sm text-gray-700">La reducción de 5.1 a 1.8 se explica por el crecimiento extraordinario del patrimonio (+194%), mientras las ventas solo crecieron 1.04%. No indica deterioro operativo, sino fortalecimiento patrimonial.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                  <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                  <p className="text-sm text-gray-700">La reducción en rotación de patrimonio es consecuencia directa del fortalecimiento de la base patrimonial. A medida que las ventas crezcan en los próximos años, este indicador se recuperará naturalmente.</p>
                </div>
              </div>
            )}
          >
            <p className="text-sm font-bold text-gray-900">ROTACIÓN DEL PATRIMONIO</p>
            <p className="text-xs text-gray-600">(Vtas Netas / Patrimonio)</p>
            <p className="text-2xl font-bold text-teal-600 mt-2">1,8</p>
            <p className="text-xs text-gray-600 mt-1">2024: 5,1</p>
          </div>

          <div 
            className="bg-green-100 rounded-lg p-4 border-2 border-green-400 cursor-pointer hover:border-green-600 transition-all"
            onClick={() => openModal('Variación de las Ventas Netas 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">2024</p>
                    <p className="text-xl font-bold text-red-600">-1,6%</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-green-600 font-semibold mb-1">2025</p>
                    <p className="text-xl font-bold text-green-700">+1,5%</p>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                  <p className="text-sm font-semibold text-green-800 mb-2">Análisis:</p>
                  <p className="text-sm text-gray-700">La empresa revirtió la tendencia negativa de 2024 (-1.6%) para crecer 1.5% en 2025. Los ingresos operacionales pasaron de $426.000 millones a $431.000 millones, un incremento de $4.451 millones.</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                  <p className="text-sm font-semibold text-blue-800 mb-2">Contexto:</p>
                  <p className="text-sm text-gray-700">El crecimiento moderado de ventas, combinado con la reducción de costos (-0.43%), generó un efecto multiplicador en la utilidad: las ventas crecieron 1.5% pero la utilidad neta creció 37.8%.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                  <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                  <p className="text-sm text-gray-700">La recuperación del crecimiento en ventas, aunque moderada, confirma la resiliencia del modelo de negocio y sienta las bases para un crecimiento más acelerado en 2026.</p>
                </div>
              </div>
            )}
          >
            <p className="text-sm font-bold text-gray-900">VARIACIÓN DE LAS VENTAS NETAS</p>
            <p className="text-xs text-gray-600">(Vtas Presente Ejercicio / Ventas Ejercicio Anterior)</p>
            <p className="text-2xl font-bold text-green-600 mt-2">1,5%</p>
            <p className="text-xs text-gray-600 mt-1">2024: -1,6%</p>
          </div>
        </div>
      </motion.div>

      {/* 3. INDICADORES DE ACTIVIDAD - TABLA */}
      <CollapsibleTable title="Tabla Detallada - Indicadores de Actividad" defaultOpen={false} className="border-4 border-green-500/30">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 font-bold text-gray-900"></th>
                <th className="text-center py-3 px-4 font-bold text-gray-900 border-l border-gray-300">2.025</th>
                <th className="text-center py-3 px-4 font-bold text-gray-900 border-l border-gray-300">2.024</th>
                <th className="text-center py-3 px-4 font-bold text-gray-900 border-l border-gray-300">SECTOR AVÍCOLA</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4"><div className="font-semibold text-gray-900">ROTACIÓN DE CARTERA</div></td>
                <td className="text-center py-3 px-4 border-l border-gray-200 font-semibold">15,40</td>
                <td className="text-center py-3 px-4 border-l border-gray-200">14,99</td>
                <td className="text-center py-3 px-4 border-l border-gray-200"><div className="flex items-center justify-center gap-2"><span className="text-2xl">⟺</span><span className="text-xs text-gray-600">Es el número de veces en que rota la cartera respecto a las ventas del año.</span></div></td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4"><div className="font-semibold text-gray-900">ROTACIÓN DE INVENTARIOS</div><div className="text-xs text-gray-600">(Costo de Mcia / Prom. de Inventarios)</div></td>
                <td className="text-center py-3 px-4 border-l border-gray-200 font-semibold">39,2</td>
                <td className="text-center py-3 px-4 border-l border-gray-200">22,2</td>
                <td className="text-center py-3 px-4 border-l border-gray-200"><div className="flex items-center justify-center gap-2"><span className="text-2xl">⟺</span><span className="text-xs text-gray-600">Es la cantidad de tiempo que estuvo el inventario en la compañía.</span></div></td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4"><div className="font-semibold text-gray-900">ROTACIÓN DEL PATRIMONIO</div><div className="text-xs text-gray-600">(Vtas Netas / Patrimonio)</div></td>
                <td className="text-center py-3 px-4 border-l border-gray-200 font-semibold">1,8</td>
                <td className="text-center py-3 px-4 border-l border-gray-200">5,1</td>
                <td className="text-center py-3 px-4 border-l border-gray-200"><div className="flex items-center justify-center gap-2"><span className="text-2xl">⟺</span><span className="text-xs text-gray-600">Es el volumen de ventas generado con el patrimonio invertido.</span></div></td>
              </tr>
              <tr className="bg-green-50 border-b-2 border-green-300">
                <td className="py-3 px-4"><div className="font-semibold text-gray-900">VARIACIÓN DE LAS VENTAS NETAS</div><div className="text-xs text-gray-600">(Vtas Presente Ejercicio / Ventas Ejercicio Anterior)</div></td>
                <td className="text-center py-3 px-4 border-l border-gray-200 font-semibold">1,5%</td>
                <td className="text-center py-3 px-4 border-l border-gray-200">-1,6%</td>
                <td className="text-center py-3 px-4 border-l border-gray-200"><div className="flex items-center justify-center gap-2"><span className="text-2xl">⟺</span><span className="text-xs text-gray-600">Es el % de crecimiento o decrecimiento con respecto al año anterior.</span></div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </CollapsibleTable>

      {/* 4. INDICADORES DE RENDIMIENTO - CARDS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">4. INDICADORES DE RENDIMIENTO</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300 cursor-pointer hover:border-purple-500 transition-all"
            onClick={() => openModal('Margen Bruto de Utilidad 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">2024</p>
                    <p className="text-xl font-bold text-gray-900">13,7%</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <p className="text-xs text-purple-600 font-semibold mb-1">2025</p>
                    <p className="text-xl font-bold text-purple-700">15,0%</p>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                  <p className="text-sm font-semibold text-purple-800 mb-2">Definición:</p>
                  <p className="text-sm text-gray-700">Es la participación de la utilidad bruta en las ventas del año. Fórmula: Utilidad Bruta / Ventas Netas.</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                  <p className="text-sm font-semibold text-green-800 mb-2">Análisis:</p>
                  <p className="text-sm text-gray-700">El margen bruto mejoró 1.3 puntos porcentuales (13.7% → 15.0%), resultado de la combinación de ingresos crecientes (+1.04%) y costos de ventas decrecientes (-0.43%), principalmente por la reducción del costo del ABA.</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                  <p className="text-sm font-semibold text-blue-800 mb-2">Impacto:</p>
                  <p className="text-sm text-gray-700">Un margen bruto del 15% indica que por cada $100 de ventas, $15 quedan disponibles para cubrir gastos operativos y generar utilidad. La mejora refleja mayor eficiencia en la cadena productiva.</p>
                </div>
              </div>
            )}
          >
            <p className="text-sm font-bold text-gray-900">MARGEN BRUTO DE UTILIDAD</p>
            <p className="text-xs text-gray-600">Utilidad Bruta / Ventas netas</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">15,0%</p>
            <p className="text-xs text-gray-600 mt-1">2024: 13,7%</p>
          </div>

          <div 
            className="bg-violet-50 rounded-lg p-4 border-2 border-violet-300 cursor-pointer hover:border-violet-500 transition-all"
            onClick={() => openModal('Margen Operacional de Utilidad 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">2024</p>
                    <p className="text-xl font-bold text-gray-900">5,3%</p>
                  </div>
                  <div className="bg-violet-50 rounded-lg p-3 border border-violet-200">
                    <p className="text-xs text-violet-600 font-semibold mb-1">2025</p>
                    <p className="text-xl font-bold text-violet-700">6,3%</p>
                  </div>
                </div>
                <div className="bg-violet-50 rounded-lg p-4 border border-violet-300">
                  <p className="text-sm font-semibold text-violet-800 mb-2">Definición:</p>
                  <p className="text-sm text-gray-700">Indica la rentabilidad operativa del negocio. Fórmula: Utilidad Operativa / Ventas Netas. Muestra cuánto genera la operación por cada peso vendido.</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                  <p className="text-sm font-semibold text-green-800 mb-2">Análisis:</p>
                  <p className="text-sm text-gray-700">El margen operacional mejoró de 5.3% a 6.3% (+1 punto porcentual), con la utilidad operacional creciendo 20.8% frente a ventas que crecieron solo 1.04%. Esto confirma la mejora en eficiencia operativa.</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                  <p className="text-sm font-semibold text-blue-800 mb-2">Impacto:</p>
                  <p className="text-sm text-gray-700">El margen operacional del 6.3% es consistente con el margen EBITDA del 6.8%, confirmando que la empresa genera valor operativo real y sostenible en su actividad principal.</p>
                </div>
              </div>
            )}
          >
            <p className="text-sm font-bold text-gray-900">MARGEN OPERACIONAL DE UTILIDAD</p>
            <p className="text-xs text-gray-600">Utilidad Operativa / Ventas netas</p>
            <p className="text-2xl font-bold text-violet-600 mt-2">6,3%</p>
            <p className="text-xs text-gray-600 mt-1">2024: 5,3%</p>
          </div>

          <div 
            className="bg-fuchsia-50 rounded-lg p-4 border-2 border-fuchsia-300 cursor-pointer hover:border-fuchsia-500 transition-all"
            onClick={() => openModal('Rentabilidad del Patrimonio 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">2024</p>
                    <p className="text-xl font-bold text-gray-900">21,8%</p>
                  </div>
                  <div className="bg-fuchsia-50 rounded-lg p-3 border border-fuchsia-200">
                    <p className="text-xs text-fuchsia-600 font-semibold mb-1">2025</p>
                    <p className="text-xl font-bold text-fuchsia-700">10,3%</p>
                  </div>
                </div>
                <div className="bg-fuchsia-50 rounded-lg p-4 border border-fuchsia-300">
                  <p className="text-sm font-semibold text-fuchsia-800 mb-2">Definición:</p>
                  <p className="text-sm text-gray-700">Es el rendimiento de la inversión de los socios. Fórmula: Utilidad Antes de Impuesto / Patrimonio.</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-300">
                  <p className="text-sm font-semibold text-yellow-800 mb-2">Análisis:</p>
                  <p className="text-sm text-gray-700">La reducción de 21.8% a 10.3% se explica por el crecimiento extraordinario del patrimonio (+194%), no por deterioro en la utilidad. La utilidad antes de impuestos creció, pero el denominador (patrimonio) creció mucho más.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                  <p className="text-sm font-semibold text-purple-800 mb-2">Impacto:</p>
                  <p className="text-sm text-gray-700">Un 10.3% sigue siendo un retorno positivo para los accionistas. A medida que la utilidad crezca sobre la nueva base patrimonial, este indicador se recuperará en los próximos ejercicios.</p>
                </div>
              </div>
            )}
          >
            <p className="text-sm font-bold text-gray-900">RENTABIL. DEL PATRIMONIO</p>
            <p className="text-xs text-gray-600">(Utilidad Antes de Impuesto / Patrimonio)</p>
            <p className="text-2xl font-bold text-fuchsia-600 mt-2">10,3%</p>
            <p className="text-xs text-gray-600 mt-1">2024: 21,8%</p>
          </div>

          <div 
            className="bg-purple-100 rounded-lg p-4 border-2 border-purple-400 cursor-pointer hover:border-purple-600 transition-all"
            onClick={() => openModal('Rendimiento del Capital Contable - ROE 2025 vs 2024',
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">2024</p>
                    <p className="text-xl font-bold text-gray-900">14,5%</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <p className="text-xs text-purple-600 font-semibold mb-1">2025</p>
                    <p className="text-xl font-bold text-purple-700">6,8%</p>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
                  <p className="text-sm font-semibold text-purple-800 mb-2">Definición:</p>
                  <p className="text-sm text-gray-700">Representa cuánto genera en utilidad neta cada peso invertido en capital contable. Fórmula: Utilidad Neta / Capital Contable. Es el indicador de rentabilidad más relevante para los accionistas.</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-300">
                  <p className="text-sm font-semibold text-yellow-800 mb-2">Análisis:</p>
                  <p className="text-sm text-gray-700">La reducción de 14.5% a 6.8% es consecuencia del crecimiento patrimonial del 194% vs utilidad neta que creció 37.8%. La utilidad neta pasó de $12.129 millones a $16.714 millones, pero el patrimonio pasó de $83.530 a $245.333 millones.</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                  <p className="text-sm font-semibold text-blue-800 mb-2">Impacto:</p>
                  <p className="text-sm text-gray-700">El ROE del 6.8% refleja la transición hacia una empresa con mayor solidez patrimonial. El EBITDA del 6.8% confirma que la generación de valor operativo es consistente con el retorno sobre el capital.</p>
                </div>
              </div>
            )}
          >
            <p className="text-sm font-bold text-gray-900">RENDIMIENTO DEL CAPITAL CONTABLE -ROE</p>
            <p className="text-xs text-gray-600">Utilidad Neta / Capital Contable</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">6,8%</p>
            <p className="text-xs text-gray-600 mt-1">2024: 14,5%</p>
          </div>
        </div>
      </motion.div>

      {/* 4. INDICADORES DE RENDIMIENTO - TABLA */}
      <CollapsibleTable title="Tabla Detallada - Indicadores de Rendimiento" defaultOpen={false} className="border-4 border-purple-500/30">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 font-bold text-gray-900"></th>
                <th className="text-center py-3 px-4 font-bold text-gray-900 border-l border-gray-300">2.025</th>
                <th className="text-center py-3 px-4 font-bold text-gray-900 border-l border-gray-300">2.024</th>
                <th className="text-center py-3 px-4 font-bold text-gray-900 border-l border-gray-300">SECTOR AVÍCOLA</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4"><div className="font-semibold text-gray-900">MARGEN BRUTO DE UTILIDAD</div><div className="text-xs text-gray-600">Utilidad Bruta / Ventas netas</div></td>
                <td className="text-center py-3 px-4 border-l border-gray-200 font-semibold">15,0%</td>
                <td className="text-center py-3 px-4 border-l border-gray-200">13,7%</td>
                <td className="text-center py-3 px-4 border-l border-gray-200"><div className="flex items-center justify-center gap-2"><span className="text-2xl">⟺</span><span className="text-xs text-gray-600">Es la participación de la utilidad operacional en las ventas del año.</span></div></td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4"><div className="font-semibold text-gray-900">MARGEN OPERACIONAL DE UTILIDAD</div><div className="text-xs text-gray-600">Utilidad Operativa / Ventas netas</div></td>
                <td className="text-center py-3 px-4 border-l border-gray-200 font-semibold">6,3%</td>
                <td className="text-center py-3 px-4 border-l border-gray-200">5,3%</td>
                <td className="text-center py-3 px-4 border-l border-gray-200"><div className="flex items-center justify-center gap-2"><span className="text-2xl">⟺</span><span className="text-xs text-gray-600">Indica la rentabilidad si el negocio es o no lucrativo</span></div></td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4"><div className="font-semibold text-gray-900">RENTABILIDAD DEL PATRIMONIO</div><div className="text-xs text-gray-600">(Utilidad Antes de Impuesto / Patrimonio)</div></td>
                <td className="text-center py-3 px-4 border-l border-gray-200 font-semibold">10,3%</td>
                <td className="text-center py-3 px-4 border-l border-gray-200">21,8%</td>
                <td className="text-center py-3 px-4 border-l border-gray-200"><div className="flex items-center justify-center gap-2"><span className="text-2xl">⟺</span><span className="text-xs text-gray-600">Es el rendimiento de la inversión de los socios en el ejercicio económico.</span></div></td>
              </tr>
              <tr className="bg-purple-50 border-b-2 border-purple-300">
                <td className="py-3 px-4"><div className="font-semibold text-gray-900">RENDIMIENTO DEL CAPITAL CONTABLE - ROE</div><div className="text-xs text-gray-600">Utilidad Neta / Capital Contable</div></td>
                <td className="text-center py-3 px-4 border-l border-gray-200 font-semibold">6,8%</td>
                <td className="text-center py-3 px-4 border-l border-gray-200">14,5%</td>
                <td className="text-center py-3 px-4 border-l border-gray-200"><div className="flex items-center justify-center gap-2"><span className="text-2xl">⟺</span><span className="text-xs text-gray-600">Representa que por cada peso invertido en activo cuanto se genera en utilidad.</span></div></td>
              </tr>
            </tbody>
          </table>
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
              className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-blue-500 shadow-2xl max-h-[90vh] flex flex-col"
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
              <div className="text-gray-700 leading-relaxed overflow-y-auto flex-1 pr-2">
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
