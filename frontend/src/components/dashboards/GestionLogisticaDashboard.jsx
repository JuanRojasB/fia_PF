import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, LabelList } from 'recharts';
import { Truck, TrendingUp, Building, X, Info, Users, Package, DollarSign, TrendingDown } from 'lucide-react';
import CollapsibleTable from '../CollapsibleTable';
import CollapsibleChart from '../CollapsibleChart';
import KpiCard from '../KpiCard';
import { formatCurrencyFull } from './CustomTooltip';
import { formatCOPShort } from '../../utils/formatCurrency';

export default function GestionLogisticaDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null, showTable: false });
  const hasAnimated = useRef(false);

  const openModal = (title, content, showTable = false) => {
    setModalContent({ title, content, showTable });
    setModalOpen(true);
  };

  // Manejar estructura del backend
  const logisticaData = Array.isArray(data) ? data : (data?.items || []);
  
  if (logisticaData.length === 0) {
    return <div className="text-gray-600">No hay datos disponibles</div>;
  }

  // Abreviado para KPIs: $1.234M / $1.23B
  const formatCurrency = formatCOPShort;
  const _fmtOld = (value) => {
    if (!value || isNaN(value)) return '$0';
    const v = parseFloat(value);
    if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(2)}MM`;
    if (v >= 1_000_000)     return `$${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000)         return `$${(v / 1_000).toFixed(0)}mil`;
    return '$' + new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);
  };

  // Procesar datos por sede y concepto
  const conceptosMap = {};
  logisticaData.forEach(d => {
    const sedeNormalizada = (d.sede || '').toString().trim().toUpperCase();
    if (!sedeNormalizada || sedeNormalizada === 'NULL' || !['SEDE1', 'SEDE2', 'SEDE3'].includes(sedeNormalizada)) return;
    
    const conceptoNormalizado = (d.concepto || '').toString().trim();
    if (!conceptoNormalizado) return;
    
    const conceptoUpper = conceptoNormalizado.toUpperCase();
    if (conceptoUpper.includes('TOTAL') || conceptoUpper.includes('GASTOS LOGISTICOS')) return;
    
    const anio = parseInt(d.anio);
    if (anio !== 2024 && anio !== 2025) return;
    
    const key = `${sedeNormalizada}-${conceptoNormalizado}-${anio}`;
    const valor = parseFloat(d.valor) || 0;
    
    if (!conceptosMap[key] || valor !== 0) {
      conceptosMap[key] = {
        sede: sedeNormalizada,
        concepto: conceptoNormalizado,
        anio: anio,
        valor: valor
      };
    }
  });
  
  // Reorganizar por concepto y sede
  const conceptosPorSede = {};
  Object.values(conceptosMap).forEach(d => {
    const key = `${d.sede}-${d.concepto}`;
    if (!conceptosPorSede[key]) {
      conceptosPorSede[key] = { sede: d.sede, concepto: d.concepto, valor2024: 0, valor2025: 0 };
    }
    if (d.anio === 2024) conceptosPorSede[key].valor2024 = d.valor * 1000;
    else if (d.anio === 2025) conceptosPorSede[key].valor2025 = d.valor * 1000;
  });
  
  const conceptosData = Object.values(conceptosPorSede);
  const total2025 = conceptosData.reduce((sum, d) => sum + d.valor2025, 0);
  const total2024 = conceptosData.reduce((sum, d) => sum + d.valor2024, 0);
  const variacionTotal = total2024 > 0 ? (((total2025 - total2024) / total2024) * 100).toFixed(2) : 0;

  // Datos por sede
  const sedesMap = {};
  conceptosData.forEach(d => {
    const sedeNormalizada = (d.sede || '').toString().trim().toUpperCase();
    if (!['SEDE1', 'SEDE2', 'SEDE3'].includes(sedeNormalizada)) return;
    
    if (!sedesMap[sedeNormalizada]) sedesMap[sedeNormalizada] = { sede: sedeNormalizada, total2024: 0, total2025: 0 };
    sedesMap[sedeNormalizada].total2024 += d.valor2024;
    sedesMap[sedeNormalizada].total2025 += d.valor2025;
  });
  
  const sedesData = ['SEDE1', 'SEDE2', 'SEDE3']
    .map(sede => sedesMap[sede])
    .filter(Boolean)
    .map(s => ({
      ...s,
      variacion: s.total2024 > 0 ? (((s.total2025 - s.total2024) / s.total2024) * 100).toFixed(2) : 0
    }));

  // Consolidado por concepto
  const consolidado = {};
  conceptosData.forEach(d => {
    if (!consolidado[d.concepto]) {
      consolidado[d.concepto] = { concepto: d.concepto, valor2024: 0, valor2025: 0 };
    }
    consolidado[d.concepto].valor2024 += d.valor2024;
    consolidado[d.concepto].valor2025 += d.valor2025;
  });

  const consolidadoArray = Object.values(consolidado).map(c => ({
    ...c,
    variacion: c.valor2024 > 0 ? (((c.valor2025 - c.valor2024) / c.valor2024) * 100).toFixed(2) : 0,
    diferencia: c.valor2025 - c.valor2024
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-6 border-2 border-purple-500/30"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-4">
          <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">GESTIÓN LOGÍSTICA - ANÁLISIS CONSOLIDADO</h2>
        </div>
        <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-4">
          La Gerencia Logística administra tres centros de operación especializados: Sede 1 (pollo asadero), Sede 2 (productos congelados) y Sede 3 (clientes institucionales). 
          Para 2025 se cuenta con <span className="font-semibold">12 muelles de operación</span> y un equipo de <span className="font-semibold">197 colaboradores</span> distribuidos en las tres plantas de proceso (vs. 231 en 2024).
        </p>
        <div className="bg-green-50 border border-green-300 rounded-lg p-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold text-green-800">Resultado consolidado:</span> El gasto logístico total presentó un incremento controlado del <span className="font-bold text-green-700">2,37%</span>, 
            cifra significativamente inferior al aumento salarial del 9,54%, el ajuste en tarifas de fletes del 9,5% y el IPC promedio del 5,1%. 
            La organización logró contener el crecimiento del gasto por debajo de los incrementos estructurales del mercado, generando un <span className="font-semibold">ahorro efectivo superior al 5%</span> frente al escenario proyectado.
          </p>
        </div>
      </motion.div>

      {/* KPIs Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal(
            'Total Consolidado 2025',
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Total 2024</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrencyFull(total2024)}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <p className="text-xs text-purple-600 font-semibold mb-1">Total 2025</p>
                  <p className="text-lg font-bold text-purple-700">{formatCurrencyFull(total2025)}</p>
                </div>
              </div>
              <div className={`rounded-lg p-4 border ${parseFloat(variacionTotal) <= 0 ? 'bg-green-50 border-green-300' : 'bg-orange-50 border-orange-300'}`}>
                <p className={`text-sm font-semibold mb-2 ${parseFloat(variacionTotal) <= 0 ? 'text-green-800' : 'text-orange-800'}`}>Variación consolidada: {variacionTotal > 0 ? '+' : ''}{variacionTotal}%</p>
                <p className="text-sm text-gray-700">El resultado refleja el crecimiento operativo de Sede 2 y Sede 3, compensado parcialmente por la optimización en Sede 1.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Por sede:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Sede 1: {formatCurrencyFull(sedesData[0]?.total2025 || 0)} ({sedesData[0]?.variacion || 0}%)</li>
                  <li>• Sede 2: {formatCurrencyFull(sedesData[1]?.total2025 || 0)} ({sedesData[1]?.variacion || 0}%)</li>
                  <li>• Sede 3: {formatCurrencyFull(sedesData[2]?.total2025 || 0)} ({sedesData[2]?.variacion || 0}%)</li>
                </ul>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Total Gastos Logísticos 2025 (3 Sedes)</span>
            <DollarSign className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-gray-900 mb-1 break-all">{formatCurrencyFull(total2025)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{formatCurrencyFull(total2024)}</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{formatCurrencyFull(total2025)}</span></div>
            <div className={`text-sm font-bold ${parseFloat(variacionTotal) >= 0 ? 'text-red-600' : 'text-green-600'}`}>Var: {variacionTotal > 0 ? '+' : ''}{variacionTotal}%</div>
            <div className={`text-xs font-semibold ${parseFloat(variacionTotal) >= 0 ? 'text-red-600' : 'text-green-600'}`}>Dif: {formatCurrencyFull(total2025 - total2024)}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal(
            'Sede 1 - Pollo Asadero',
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">2024</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrencyFull(sedesData[0]?.total2024 || 0)}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-blue-600 font-semibold mb-1">2025</p>
                  <p className="text-lg font-bold text-blue-700">{formatCurrencyFull(sedesData[0]?.total2025 || 0)}</p>
                </div>
              </div>
              <div className={`rounded-lg p-4 border ${parseFloat(sedesData[0]?.variacion || 0) <= 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <p className={`text-sm font-semibold mb-2 ${parseFloat(sedesData[0]?.variacion || 0) <= 0 ? 'text-green-800' : 'text-red-800'}`}>Variación: {sedesData[0]?.variacion || 0}%</p>
                <p className="text-sm text-gray-700">Reducción controlada gracias a la optimización de fletes y reducción de personal de postproceso por la unificación de procesos en Sede 3.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                <p className="text-sm font-semibold text-blue-800 mb-2">Operación:</p>
                <p className="text-sm text-gray-700">Sede 1 se dedica a la comercialización de pollo entero tipo asadero. Responsable: Clara Fontalvo. 52 colaboradores.</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Sede 1 - Gastos Logísticos 2025 vs 2024</span>
            <Building className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-gray-900 mb-1 break-all">{formatCurrencyFull(sedesData[0]?.total2025 || 0)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{formatCurrencyFull(sedesData[0]?.total2024 || 0)}</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{formatCurrencyFull(sedesData[0]?.total2025 || 0)}</span></div>
            <div className={`text-sm font-bold ${parseFloat(sedesData[0]?.variacion || 0) >= 0 ? 'text-red-600' : 'text-green-600'}`}>Var: {parseFloat(sedesData[0]?.variacion || 0) >= 0 ? '+' : ''}{sedesData[0]?.variacion || 0}%</div>
            <div className={`text-xs font-semibold ${parseFloat(sedesData[0]?.variacion || 0) >= 0 ? 'text-red-600' : 'text-green-600'}`}>Dif: {formatCurrencyFull((sedesData[0]?.total2025 || 0) - (sedesData[0]?.total2024 || 0))}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal(
            'Sede 2 - Productos Congelados',
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">2024</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrencyFull(sedesData[1]?.total2024 || 0)}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <p className="text-xs text-green-600 font-semibold mb-1">2025</p>
                  <p className="text-lg font-bold text-green-700">{formatCurrencyFull(sedesData[1]?.total2025 || 0)}</p>
                </div>
              </div>
              <div className={`rounded-lg p-4 border ${parseFloat(sedesData[1]?.variacion || 0) <= 0 ? 'bg-green-50 border-green-300' : 'bg-orange-50 border-orange-300'}`}>
                <p className={`text-sm font-semibold mb-2 ${parseFloat(sedesData[1]?.variacion || 0) <= 0 ? 'text-green-800' : 'text-orange-800'}`}>Variación: {sedesData[1]?.variacion || 0}%</p>
                <p className="text-sm text-gray-700">El incremento está directamente relacionado con el <strong>crecimiento del 31.3% en ventas</strong>, principalmente por mayor capacidad instalada y personal para atender la demanda de D1 y ARA.</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="text-sm font-semibold text-green-800 mb-2">Operación:</p>
                <p className="text-sm text-gray-700">Sede 2 transforma sobrantes de pollo en productos congelados. Responsable: Alexis Pérez. 56 colaboradores. El incremento en gastos es proporcional al crecimiento en ventas.</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Sede 2 - Gastos Logísticos 2025 vs 2024</span>
            <Building className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-xl font-bold text-gray-900 mb-1 break-all">{formatCurrencyFull(sedesData[1]?.total2025 || 0)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{formatCurrencyFull(sedesData[1]?.total2024 || 0)}</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{formatCurrencyFull(sedesData[1]?.total2025 || 0)}</span></div>
            <div className={`text-sm font-bold ${parseFloat(sedesData[1]?.variacion || 0) >= 0 ? 'text-red-600' : 'text-green-600'}`}>Var: {parseFloat(sedesData[1]?.variacion || 0) >= 0 ? '+' : ''}{sedesData[1]?.variacion || 0}%</div>
            <div className={`text-xs font-semibold ${parseFloat(sedesData[1]?.variacion || 0) >= 0 ? 'text-red-600' : 'text-green-600'}`}>Dif: {formatCurrencyFull((sedesData[1]?.total2025 || 0) - (sedesData[1]?.total2024 || 0))}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal(
            'Sede 3 - Clientes Institucionales',
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">2024</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrencyFull(sedesData[2]?.total2024 || 0)}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                  <p className="text-xs text-orange-600 font-semibold mb-1">2025</p>
                  <p className="text-lg font-bold text-orange-700">{formatCurrencyFull(sedesData[2]?.total2025 || 0)}</p>
                </div>
              </div>
              <div className={`rounded-lg p-4 border ${parseFloat(sedesData[2]?.variacion || 0) <= 0 ? 'bg-green-50 border-green-300' : 'bg-orange-50 border-orange-300'}`}>
                <p className={`text-sm font-semibold mb-2 ${parseFloat(sedesData[2]?.variacion || 0) <= 0 ? 'text-green-800' : 'text-orange-800'}`}>Variación: {sedesData[2]?.variacion || 0}%</p>
                <p className="text-sm text-gray-700">El incremento refleja el crecimiento operativo y la consolidación de procesos, principalmente por personal de postproceso (<strong>+23.43%</strong>) y fletes (<strong>+28.17%</strong>) para atender clientes institucionales.</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-300">
                <p className="text-sm font-semibold text-orange-800 mb-2">Operación:</p>
                <p className="text-sm text-gray-700">Sede 3 atiende clientes institucionales y asumió el proceso de re-selección y redistribución de producto. Responsable: Ing. Angélica Cárdenas. 89 colaboradores.</p>
              </div>
            </div>
          )}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Sede 3 - Gastos Logísticos 2025 vs 2024</span>
            <Building className="w-6 h-6 text-orange-400" />
          </div>
          <div className="text-xl font-bold text-gray-900 mb-1 break-all">{formatCurrencyFull(sedesData[2]?.total2025 || 0)}</div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-0.5">
            <div className="text-xs text-gray-500">2024: <span className="font-semibold text-gray-700">{formatCurrencyFull(sedesData[2]?.total2024 || 0)}</span></div>
            <div className="text-xs text-gray-500">2025: <span className="font-semibold text-gray-700">{formatCurrencyFull(sedesData[2]?.total2025 || 0)}</span></div>
            <div className={`text-sm font-bold ${parseFloat(sedesData[2]?.variacion || 0) >= 0 ? 'text-red-600' : 'text-green-600'}`}>Var: {parseFloat(sedesData[2]?.variacion || 0) >= 0 ? '+' : ''}{sedesData[2]?.variacion || 0}%</div>
            <div className={`text-xs font-semibold ${parseFloat(sedesData[2]?.variacion || 0) >= 0 ? 'text-red-600' : 'text-green-600'}`}>Dif: {formatCurrencyFull((sedesData[2]?.total2025 || 0) - (sedesData[2]?.total2024 || 0))}</div>
          </div>
        </motion.div>
      </div>

      {/* Tabla Consolidada */}
      <CollapsibleTable
        title="GASTOS OPERACIONALES LOGÍSTICOS SEDES 2024 VS 2025"
        defaultOpen={false}
        totalRow={[
          { label: 'TOTAL GASTOS LOGÍSTICOS 2024 VS 2025' },
          { label: '$ 14.984.636', color: 'text-blue-600' },
          { label: '$ 15.339.066', color: 'text-blue-600' },
          { label: '2,37%', color: 'text-red-500', badge: true, badgeColor: 'bg-red-500', badgeIcon: '↑' },
          { label: '$ 354.430', color: 'text-red-500' },
          { label: '8,6%', color: 'text-gray-600' },
          { label: '$ 1.423.540', color: 'text-gray-600' },
        ]}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            Para el análisis consolidado 2025 vs. 2024 de las sedes, se controlaron los principales rubros de la operación logística: personal de distribución,
            personal de postproceso, arriendos y congelación, fletes, combustibles y peajes. Como resultado, el gasto logístico total presentó un
            <span className="font-semibold text-green-700"> incremento controlado del 2,37%</span>, cifra significativamente inferior a los incrementos base del período
            (aumento salarial 9,54%, ajuste tarifas de fletes 9,5%, IPC promedio 5,1%). Este comportamiento evidencia una gestión eficiente del gasto,
            destacándose el ahorro en personal de distribución y las eficiencias operativas implementadas. En términos reales, la organización logró contener
            el crecimiento del gasto por debajo de los incrementos estructurales del mercado, generando un
            <span className="font-semibold text-green-700"> ahorro efectivo superior al 5%</span> frente al escenario proyectado para 2025.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-blue-600">
                  <th className="text-left py-3 px-4 text-white font-bold">CONCEPTO</th>
                  <th className="text-right py-3 px-4 text-white font-bold">TOTAL 2024</th>
                  <th className="text-right py-3 px-4 text-white font-bold">TOTAL 2025</th>
                  <th className="text-right py-3 px-4 text-white font-bold">% Var 25/24</th>
                  <th className="text-right py-3 px-4 text-white font-bold">Disminución / Incremento</th>
                  <th className="text-right py-3 px-4 text-white font-bold">Incremento 2025 en %</th>
                  <th className="text-right py-3 px-4 text-white font-bold">Incremento 2025 en $</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { concepto: 'Costo Personal Distribución',     t2024: 2808305, t2025: 2638910, var: -6.03,  dif: -169395, pct: 9.5,  inc: 266788.98 },
                  { concepto: 'Costo Personal Post Proceso',     t2024: 4639449, t2025: 5124946, var: 10.46,  dif:  485497, pct: 9.5,  inc: 440747.66 },
                  { concepto: 'Arriendos y Congelación',         t2024: 2388825, t2025: 1799077, var: -24.69, dif: -589748, pct: 8.0,  inc: 226938.38 },
                  { concepto: 'Fletes, Cargues, Acarreos, Ttes', t2024: 4885450, t2025: 5542117, var: 13.44,  dif:  656667, pct: 9.5,  inc: 464117.78 },
                  { concepto: 'Combustibles (ACPM)',              t2024:  204251, t2025:  177990, var: -12.86, dif:  -26261, pct: 10.0, inc:  19403.85 },
                  { concepto: 'Peajes y Multas',                  t2024:   58356, t2025:   56026, var: -3.99,  dif:   -2330, pct: 5.1,  inc:   5543.82 },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                    <td className="py-2.5 px-4 text-gray-900">{row.concepto}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-gray-700">$ {row.t2024.toLocaleString('es-CO')}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-gray-700">$ {row.t2025.toLocaleString('es-CO')}</td>
                    <td className="py-2.5 px-4 text-right">
                      <span className={`inline-flex items-center gap-1 font-bold ${row.var < 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <span className={`w-4 h-4 rounded-full text-white text-xs flex items-center justify-center ${row.var < 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                          {row.var < 0 ? '↓' : '↑'}
                        </span>
                        {row.var}%
                      </span>
                    </td>
                    <td className={`py-2.5 px-4 text-right tabular-nums font-semibold ${row.dif < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      $ {Math.abs(row.dif).toLocaleString('es-CO')}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-gray-600">{row.pct}%</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-gray-600">$ {row.inc.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
                <tr className="bg-blue-50 border-t-2 border-blue-400 font-bold">
                  <td className="py-3 px-4 text-blue-900">Total Gastos Logísticos 2024 vs 2025</td>
                  <td className="py-3 px-4 text-right tabular-nums text-blue-900">$ 14.984.636</td>
                  <td className="py-3 px-4 text-right tabular-nums text-blue-900">$ 15.339.066</td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 font-bold text-red-600">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">↑</span>
                      2,37%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-red-600">$ 354.430</td>
                  <td className="py-3 px-4 text-right tabular-nums text-blue-900">8,6%</td>
                  <td className="py-3 px-4 text-right tabular-nums text-blue-900">$ 1.423.540</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CollapsibleTable>

      {/* Gráfico Comparativo por Sede */}
      <CollapsibleChart title="Gastos Operacionales Logísticos por Sede 2024 vs 2025" defaultOpen={false}>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={sedesData} margin={{ top: 20, right: 30, bottom: 20, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="sede" 
              stroke="#9ca3af"
            />
            <YAxis 
              stroke="#9ca3af" 
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}mil`}
            />
            <Tooltip content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-xl">
                    <p className="text-gray-900 font-semibold mb-2">{data.sede}</p>
                    <p className="text-sm text-cyan-400">2024: {formatCurrency(data.total2024)}</p>
                    <p className="text-sm text-green-400">2025: {formatCurrency(data.total2025)}</p>
                    <p className={`text-sm font-bold mt-1 ${parseFloat(data.variacion) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                      Variación: {data.variacion}%
                    </p>
                  </div>
                );
              }
              return null;
            }} />
            <Bar dataKey="total2024" fill="#6366f1" name="2024" radius={[8, 8, 0, 0]}>
              <LabelList dataKey="total2024" position="top" style={{ fontSize: '11px', fill: '#6366f1', fontWeight: 'bold' }} formatter={() => '2024'} />
            </Bar>
            <Bar dataKey="total2025" fill="#10b981" name="2025" radius={[8, 8, 0, 0]}>
              <LabelList dataKey="total2025" position="top" style={{ fontSize: '11px', fill: '#10b981', fontWeight: 'bold' }} formatter={() => '2025'} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CollapsibleChart>

      {/* Gráfico Consolidado por Concepto */}
      <CollapsibleChart title="Gastos Operacionales por Tipo de Gasto (Consolidado 3 Sedes)" defaultOpen={false}>
        <ResponsiveContainer width="100%" height={420}>
          <BarChart
            layout="vertical"
            data={[
              { concepto: 'Costo Personal Distribución',     valor2024: 2808305, valor2025: 2638910 },
              { concepto: 'Costo Personal Post Proceso',     valor2024: 4639449, valor2025: 5124946 },
              { concepto: 'Arriendos y Congelación',         valor2024: 2388825, valor2025: 1799077 },
              { concepto: 'Fletes, Cargues, Acarreos, Ttes', valor2024: 4885450, valor2025: 5542117 },
              { concepto: 'Combustibles (ACPM)',              valor2024:  204251, valor2025:  177990 },
              { concepto: 'Peajes y Multas',                  valor2024:   58356, valor2025:   56026 },
            ]}
            margin={{ left: 10, right: 80, top: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" stroke="#9ca3af" tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
            <YAxis type="category" dataKey="concepto" stroke="#9ca3af" width={200} style={{ fontSize: '11px' }} />
            <Tooltip content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const v24 = payload.find(p => p.dataKey === 'valor2024')?.value || 0;
                const v25 = payload.find(p => p.dataKey === 'valor2025')?.value || 0;
                const dif = v25 - v24;
                const pct = v24 > 0 ? ((dif / v24) * 100).toFixed(1) : 0;
                return (
                  <div className="bg-white border-2 border-blue-500 rounded-xl p-4 shadow-xl">
                    <p className="font-bold text-gray-900 mb-2">{label}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between gap-4"><span className="text-gray-500">2024:</span><span className="font-bold">$ {v24.toLocaleString('es-CO')}</span></div>
                      <div className="flex justify-between gap-4"><span className="text-blue-600">2025:</span><span className="font-bold">$ {v25.toLocaleString('es-CO')}</span></div>
                      <div className="flex justify-between gap-4 border-t pt-1"><span className="text-gray-500">Var:</span><span className={`font-bold ${dif >= 0 ? 'text-red-600' : 'text-green-600'}`}>{dif >= 0 ? '+' : ''}{pct}%</span></div>
                    </div>
                  </div>
                );
              }
              return null;
            }} />
            <Bar dataKey="valor2024" fill="#6366f1" name="2024" radius={[0, 6, 6, 0]}>
              <LabelList dataKey="valor2024" position="right" style={{ fontSize: '10px', fill: '#6366f1', fontWeight: 'bold' }} formatter={() => '2024'} />
            </Bar>
            <Bar dataKey="valor2025" fill="#10b981" name="2025" radius={[0, 6, 6, 0]}>
              <LabelList dataKey="valor2025" position="right" style={{ fontSize: '10px', fill: '#10b981', fontWeight: 'bold' }} formatter={() => '2025'} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CollapsibleChart>
      {/* Modal con Tabla Consolidada */}
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
              className="bg-white rounded-xl p-6 max-w-6xl w-full border-4 border-purple-500 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-bold text-gray-900">{modalContent.title}</h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="overflow-y-auto flex-1 pr-2">{modalContent.content}</div>

              {/* Tabla dentro del modal - solo si showTable es true */}
              {modalContent.showTable && (
                <div className="overflow-x-auto">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">
                    GASTOS OPERACIONALES LOGÍSTICOS CONSOLIDADOS 2024 VS 2025
                  </h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-purple-500 to-purple-600 border-b-2 border-gray-300">
                        <th className="text-left py-3 px-4 text-gray-900 font-bold">CONCEPTO</th>
                        <th className="text-right py-3 px-4 text-gray-900 font-bold">TOTAL 2024</th>
                        <th className="text-right py-3 px-4 text-gray-900 font-bold">TOTAL 2025</th>
                        <th className="text-right py-3 px-4 text-gray-900 font-bold">
                          <span className="inline-flex items-center gap-1 justify-end">
                            % Var 25/24
                            <span className="relative group cursor-help">
                              <span className="w-4 h-4 rounded-full bg-white/30 text-gray-900 text-xs flex items-center justify-center font-bold">?</span>
                              <span className="absolute right-0 top-6 z-50 hidden group-hover:block w-56 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl leading-relaxed">
                                🟢 Verde = reducción de gasto (positivo para la empresa)<br/>
                                🔴 Rojo = incremento de gasto (requiere atención)
                              </span>
                            </span>
                          </span>
                        </th>
                        <th className="text-center py-3 px-4 text-gray-900 font-bold">DIFERENCIA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {consolidadoArray.map((row, idx) => {
                        const esIncremento = row.diferencia > 0;
                        
                        return (
                          <tr key={idx} className="border-b border-gray-200/30 hover:bg-gray-100/20">
                            <td className="py-2 px-4 text-gray-900">{row.concepto}</td>
                            <td className="py-2 px-4 text-right text-cyan-600 tabular-nums">
                              $ {row.valor2024.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </td>
                            <td className="py-2 px-4 text-right text-orange-600 tabular-nums">
                              $ {row.valor2025.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </td>
                            <td className="py-2 px-4 text-right tabular-nums">
                              <span className={`inline-flex items-center gap-1 ${esIncremento ? 'text-red-600' : 'text-green-600'}`}>
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${esIncremento ? 'bg-red-500' : 'bg-green-500'}`}>
                                  {esIncremento ? '↑' : '↓'}
                                </span>
                                {row.variacion}%
                              </span>
                            </td>
                            <td className="py-2 px-4 text-center">
                              <span className={esIncremento ? 'text-red-600' : 'text-green-600'}>
                                $ {Math.abs(row.diferencia).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="bg-gray-50 border-t-2 border-gray-400 font-bold">
                        <td className="py-3 px-4 text-gray-900">TOTAL GASTOS LOGÍSTICOS CONSOLIDADOS</td>
                        <td className="py-3 px-4 text-right text-cyan-700 tabular-nums">
                          $ {total2024.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </td>
                        <td className="py-3 px-4 text-right text-orange-700 tabular-nums">
                          $ {total2025.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums">
                          <span className={`inline-flex items-center gap-1 ${parseFloat(variacionTotal) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${parseFloat(variacionTotal) > 0 ? 'bg-red-500' : 'bg-green-500'}`}>
                              {parseFloat(variacionTotal) > 0 ? '↑' : '↓'}
                            </span>
                            {variacionTotal}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={parseFloat(variacionTotal) > 0 ? 'text-red-600' : 'text-green-600'}>
                            $ {Math.abs(total2025 - total2024).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <div className="mt-6 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <span className="font-semibold text-gray-900">Análisis Consolidado:</span> El incremento del {variacionTotal}% en gastos totales consolidados refleja el crecimiento operativo de las sedes. Sede 2 presenta el mayor incremento (+{sedesData[1]?.variacion || 0}%) debido al crecimiento del 31.3% en ventas. Sede 3 incrementó {sedesData[2]?.variacion || 0}% por consolidación de procesos. Sede 1 logró una reducción del {Math.abs(parseFloat(sedesData[0]?.variacion || 0))}% mediante optimización de fletes y personal.
                    </p>
                  </div>
                </div>
              )}

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


