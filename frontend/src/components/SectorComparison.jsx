import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, X } from 'lucide-react';
import { useState } from 'react';
import sector2024 from '../assets/sectorencifras2024.png';
import sector2025 from '../assets/sectorencifras2025.png';

export default function SectorComparison() {
  const [zoomedImage, setZoomedImage] = useState(null);
  const sectorData = [
    {
      label: 'Consumo per cápita (huevos)',
      value2024: 342,
      value2025: 366,
      unit: 'huevos',
      icon: '🥚',
      isDecimal: false
    },
    {
      label: 'Consumo per cápita (pollo)',
      value2024: 37.0,
      value2025: 37.8,
      unit: 'Kg',
      icon: '🍗',
      isDecimal: true
    },
    {
      label: 'Producción de toneladas',
      value2024: 2902962,
      value2025: 3150000,
      unit: 'toneladas',
      icon: '📦',
      isDecimal: false
    },
    {
      label: 'Millones de huevos',
      value2024: 18019,
      value2025: 19402,
      unit: 'millones',
      icon: '🥚',
      isDecimal: false
    },
    {
      label: 'Toneladas de carne de pollo',
      value2024: 1821768,
      value2025: 2003000,
      unit: 'toneladas',
      icon: '🍖',
      isDecimal: false
    },
    {
      label: 'Plantas de beneficio',
      value2024: 100,
      value2025: 100,
      unit: 'plantas',
      icon: '🏭',
      isDecimal: false
    },
    {
      label: 'Granjas',
      value2024: 6032,
      value2025: 5581,
      unit: 'granjas',
      icon: '🏡',
      isDecimal: false
    },
    {
      label: 'Empleos generados',
      value2024: 350000,
      value2025: 350000,
      unit: 'empleos',
      icon: '👥',
      isDecimal: false
    },
    {
      label: 'Tasa de crecimiento',
      value2024: 2.6,
      value2025: 9.1,
      unit: '%',
      icon: '📈',
      isDecimal: true
    },
    {
      label: 'Valor de la producción',
      value2024: 27,
      value2025: 44.5,
      unit: 'billones',
      icon: '💰',
      isDecimal: true
    },
    {
      label: 'Millones de aves en granjas',
      value2024: 910,
      value2025: 1020,
      unit: 'millones',
      icon: '🐔',
      isDecimal: false
    },
    {
      label: 'Millones de pollitas',
      value2024: 56,
      value2025: 58.3,
      unit: 'millones',
      icon: '🐤',
      isDecimal: true
    }
  ];

  const calculateChange = (val2024, val2025) => {
    const change = ((val2025 - val2024) / val2024) * 100;
    return change.toFixed(1);
  };

  const calculateDifference = (val2024, val2025) => {
    return val2025 - val2024;
  };

  const formatNumber = (num, isDecimal = false) => {
    if (Math.abs(num) >= 1000000) {
      return isDecimal 
        ? (num / 1000000).toFixed(2) + 'M'
        : (num / 1000000).toFixed(0) + 'M';
    } else if (Math.abs(num) >= 1000) {
      return isDecimal 
        ? (num / 1000).toFixed(1) + 'K'
        : (num / 1000).toFixed(0) + 'K';
    }
    return isDecimal ? num.toFixed(1) : num.toFixed(0);
  };

  const getTrendIcon = (val2024, val2025) => {
    if (val2025 > val2024) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (val2025 < val2024) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = (val2024, val2025) => {
    if (val2025 > val2024) return 'text-green-400';
    if (val2025 < val2024) return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <>
      {/* Zoom Modal */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            style={{ cursor: 'zoom-out' }}
          >
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="w-full max-w-6xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={zoomedImage}
                alt="Zoom"
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.3 }}
      className="backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl mb-6 sm:mb-8"
      style={{
        background: 'rgba(15, 23, 42, 0.9)',
        border: '1px solid rgba(148, 163, 184, 0.3)',
        boxShadow: '0 0 60px rgba(251, 191, 36, 0.1)'
      }}
    >
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.4, type: "spring" }}
          className="inline-block mb-4"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-3xl sm:text-4xl">
            🐔
          </div>
        </motion.div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
          Sector en Cifras
        </h2>
        <p className="text-gray-400 text-sm sm:text-base">
          Comparativa Avicultura 2024 vs 2025
        </p>
      </div>

      {/* Images Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5 }}
          className="rounded-xl overflow-hidden border-2 border-blue-500/30 hover:border-blue-500 transition-all cursor-zoom-in"
          onClick={() => setZoomedImage(sector2024)}
        >
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-4">
            <h3 className="text-xl font-bold text-white text-center mb-2">
              Avicultura 2024
            </h3>
          </div>
          <div className="aspect-[16/9] flex items-center justify-center bg-slate-900/50">
            <img 
              src={sector2024} 
              alt="Sector Avícola 2024" 
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.6 }}
          className="rounded-xl overflow-hidden border-2 border-green-500/30 hover:border-green-500 transition-all cursor-zoom-in"
          onClick={() => setZoomedImage(sector2025)}
        >
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 p-4">
            <h3 className="text-xl font-bold text-white text-center mb-2">
              Avicultura 2025
            </h3>
          </div>
          <div className="aspect-[16/9] flex items-center justify-center bg-slate-900/50">
            <img 
              src={sector2025} 
              alt="Sector Avícola 2025" 
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sectorData.map((item, index) => {
          const change = calculateChange(item.value2024, item.value2025);
          const difference = calculateDifference(item.value2024, item.value2025);
          const isPositive = item.value2025 > item.value2024;
          const isNeutral = item.value2025 === item.value2024;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 + index * 0.05 }}
              className="p-4 rounded-xl transition-all hover:scale-105"
              style={{
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(148, 163, 184, 0.2)'
              }}
            >
              {/* Icon and Label */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{item.icon}</span>
                  <h3 className="text-sm font-medium text-gray-300">
                    {item.label}
                  </h3>
                </div>
                {getTrendIcon(item.value2024, item.value2025)}
              </div>

              {/* Values Comparison */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">2024</span>
                  <span className="text-lg font-bold text-gray-400">
                    {item.value2024.toLocaleString()} <span className="text-xs">{item.unit}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">2025</span>
                  <span className="text-lg font-bold text-white">
                    {item.value2025.toLocaleString()} <span className="text-xs">{item.unit}</span>
                  </span>
                </div>
              </div>

              {/* Change Information */}
              {!isNeutral && (
                <div className={`mt-3 pt-3 border-t border-gray-700 space-y-2`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Diferencia</span>
                    <span className={`text-sm font-semibold ${getTrendColor(item.value2024, item.value2025)}`}>
                      {isPositive ? '+' : ''}{formatNumber(difference, item.isDecimal)} {item.unit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Variación</span>
                    <span className={`text-sm font-semibold ${getTrendColor(item.value2024, item.value2025)}`}>
                      {isPositive ? '+' : ''}{change}%
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="mt-6 sm:mt-8 p-4 rounded-xl"
        style={{
          background: 'rgba(251, 191, 36, 0.1)',
          border: '1px solid rgba(251, 191, 36, 0.3)'
        }}
      >
        <p className="text-center text-sm text-gray-300">
          <span className="font-semibold text-yellow-400">Fuente:</span> FENAVI - Federación Nacional de Avicultores de Colombia
        </p>
      </motion.div>
    </motion.div>
    </>
  );
}
