import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, TrendingUp, UserMinus, UserPlus, ArrowUp, X, Info } from 'lucide-react';
import EnDesarrollo from './EnDesarrollo';

export default function HumanaDashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '' });

  const openModal = (title, description) => {
    setModalContent({ title, description });
    setModalOpen(true);
  };

  const humanaData = Array.isArray(data) ? data : (data?.items || []);
  
  // Mostrar mensaje de desarrollo si no hay datos o hay mensaje del backend
  if (humanaData.length === 0 || data?.mensaje) {
    return (
      <EnDesarrollo
        titulo="Gestión Humana en Desarrollo"
        descripcion="El módulo de Gestión Humana está siendo configurado. Pronto estará disponible con información sobre rotación de personal, causas de retiro, nómina y estructura organizacional."
        modulo="Gestión Humana"
      />
    );
  }

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return '$0';
    return '$' + new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Agrupar datos por categoría y eliminar duplicados
  const categorias = {
    'Planta de Personal': [],
    'Costo de Nómina': [],
    'Horas Extras': [],
    'Rotación de Personal': [],
    'Causas de Desvinculación 2025': []
  };

  // Usar un Map para eliminar duplicados basados en categoria+concepto+anio
  const uniqueData = new Map();
  humanaData.forEach(d => {
    const cat = d.categoria || d.categor_a;
    const key = `${cat}-${d.concepto}-${d.anio}`;
    if (!uniqueData.has(key)) {
      uniqueData.set(key, d);
    }
  });

  // Ahora agrupar los datos únicos
  Array.from(uniqueData.values()).forEach(d => {
    const cat = d.categoria || d.categor_a;
    if (cat && cat.includes('Causas de Desvinculaci')) {
      categorias['Causas de Desvinculación 2025'].push(d);
    } else if (categorias[cat]) {
      categorias[cat].push(d);
    }
  });

  // Calcular KPIs
  const personal2024 = categorias['Planta de Personal'].find(d => (d.anio === '2024' || d.anio === 2024) && d.concepto === 'Total Colaboradores');
  const personal2025 = categorias['Planta de Personal'].find(d => (d.anio === '2025' || d.anio === 2025) && d.concepto === 'Total Colaboradores');
  
  const costoTotal2024 = categorias['Costo de Nómina'].find(d => (d.anio === '2024' || d.anio === 2024) && d.concepto === 'Costo Total');
  const costoTotal2025 = categorias['Costo de Nómina'].find(d => (d.anio === '2025' || d.anio === 2025) && d.concepto === 'Costo Total');
  
  const retiros2024 = categorias['Rotación de Personal'].find(d => (d.anio === '2024' || d.anio === 2024) && d.concepto === 'Retiros');
  const retiros2025 = categorias['Rotación de Personal'].find(d => (d.anio === '2025' || d.anio === 2025) && d.concepto === 'Retiros');
  
  const ingresos2024 = categorias['Rotación de Personal'].find(d => (d.anio === '2024' || d.anio === 2024) && d.concepto === 'Ingresos');
  const ingresos2025 = categorias['Rotación de Personal'].find(d => (d.anio === '2025' || d.anio === 2025) && d.concepto === 'Ingresos');

  // Datos para causas de desvinculación - Eliminar duplicados
  const causasMap = new Map();
  categorias['Causas de Desvinculación 2025'].forEach(row => {
    const key = row.concepto;
    if (!causasMap.has(key) || causasMap.get(key).valor < row.valor) {
      causasMap.set(key, row);
    }
  });
  
  const causasData = Array.from(causasMap.values())
    .sort((a, b) => b.valor - a.valor)
    .map(row => ({
      name: row.concepto,
      value: row.valor,
      percentage: row.variacion_pct
    }));

  const COLORS = ['#06b6d4', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#ec4899', '#14b8a6', '#f97316', '#6366f1'];

  return (
    <div className="space-y-6">
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => openModal('Colaboradores', '840 colaboradores, +1.20% vs 2024.')}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Colaboradores</span>
            <Users className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">{personal2025?.valor || '0'}</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-600">2024: {personal2024?.valor || '0'}</span>
            {personal2025?.variacion_pct && (
              <span className="text-green-400 flex items-center">
                <ArrowUp className="w-3 h-3" />
                {personal2025.variacion_pct}
              </span>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => openModal('Costo Nómina', '$41.979M, +14.70% vs 2024.')}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-green-500/30 hover:border-green-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Costo Nómina</span>
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(costoTotal2025?.valor || 0)}</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-600">2024: {formatCurrency(costoTotal2024?.valor || 0)}</span>
            {costoTotal2025?.variacion_pct && (
              <span className="text-orange-400 flex items-center">
                <ArrowUp className="w-3 h-3" />
                {costoTotal2025.variacion_pct}
              </span>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => openModal('Retiros', '562 retiros, 84% voluntarios.')}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-red-500/30 hover:border-red-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Retiros</span>
            <UserMinus className="w-6 h-6 text-red-400" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">{retiros2025?.valor || '0'}</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-600">2024: {retiros2024?.valor || '0'}</span>
            {retiros2025?.variacion_pct && (
              <span className="text-red-400 flex items-center">
                <ArrowUp className="w-3 h-3" />
                {retiros2025.variacion_pct}
              </span>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => openModal('Ingresos', 'Nuevos colaboradores contratados.')}
          className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border-4 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Ingresos</span>
            <UserPlus className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">{ingresos2025?.valor || '0'}</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-600">2024: {ingresos2024?.valor || '0'}</span>
            {ingresos2025?.variacion_pct && (
              <span className="text-green-400 flex items-center">
                <ArrowUp className="w-3 h-3" />
                {ingresos2025.variacion_pct}
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Causas de Desvinculación - Diseño Moderno */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/95 backdrop-blur-xl rounded-xl p-6 border border-gray-200"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Causas de Desvinculación 2025</h3>
            <p className="text-gray-600 text-sm">
              Total de retiros: <span className="text-cyan-400 font-bold">{formatNumber(causasData.reduce((sum, row) => sum + row.value, 0))}</span> personas
            </p>
          </div>
          <button
            onClick={() => openModal('Causas de Desvinculación', 'Distribución de motivos de retiro.')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Info className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Grid de Cards Moderno */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {causasData.map((row, idx) => {
            const total = causasData.reduce((sum, r) => sum + r.value, 0);
            const percentage = (row.value / total) * 100;
            const colors = [
              { from: 'from-cyan-500', to: 'to-blue-600', shadow: 'shadow-cyan-500/50' },
              { from: 'from-orange-500', to: 'to-red-600', shadow: 'shadow-orange-500/50' },
              { from: 'from-green-500', to: 'to-emerald-600', shadow: 'shadow-green-500/50' },
              { from: 'from-purple-500', to: 'to-pink-600', shadow: 'shadow-purple-500/50' },
              { from: 'from-yellow-500', to: 'to-orange-600', shadow: 'shadow-yellow-500/50' },
              { from: 'from-pink-500', to: 'to-rose-600', shadow: 'shadow-pink-500/50' },
              { from: 'from-indigo-500', to: 'to-blue-600', shadow: 'shadow-indigo-500/50' },
              { from: 'from-teal-500', to: 'to-cyan-600', shadow: 'shadow-teal-500/50' },
              { from: 'from-red-500', to: 'to-pink-600', shadow: 'shadow-red-500/50' }
            ];
            const color = colors[idx % colors.length];
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08, type: "spring", bounce: 0.3 }}
                className={`relative group cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br ${color.from} ${color.to} p-[2px] hover:scale-105 transition-transform duration-300`}
              >
                <div className="relative bg-gray-50/95 backdrop-blur-xl rounded-2xl p-5 h-full">
                  {/* Número de ranking con efecto glow */}
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg">
                    <span className="text-gray-900 font-bold text-lg">{idx + 1}</span>
                  </div>

                  {/* Contenido */}
                  <div className="space-y-3">
                    <div className="text-gray-900 font-bold text-base leading-tight min-h-[40px]">
                      {row.name}
                    </div>

                    {/* Estadísticas principales */}
                    <div className="flex items-end justify-between">
                      <div>
                        <div className={`text-4xl font-black bg-gradient-to-r ${color.from} ${color.to} bg-clip-text text-transparent`}>
                          {formatNumber(row.value)}
                        </div>
                        <div className="text-gray-600 text-xs font-medium mt-1">personas</div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-gray-900">
                          {row.percentage}
                        </div>
                        <div className="text-gray-600 text-xs font-medium">del total</div>
                      </div>
                    </div>

                    {/* Barra de progreso con animación */}
                    <div className="relative h-2 bg-white rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: idx * 0.08 + 0.3, ease: "easeOut" }}
                        className={`absolute inset-y-0 left-0 bg-gradient-to-r ${color.from} ${color.to} rounded-full`}
                      />
                      <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '400%' }}
                        transition={{ duration: 2, delay: idx * 0.08 + 0.5, ease: "easeInOut" }}
                        className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      />
                    </div>
                  </div>

                  {/* Efecto hover overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${color.from} ${color.to} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full border-4 border-cyan-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-cyan-400" />
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
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-gray-900 rounded-lg transition-colors"
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

