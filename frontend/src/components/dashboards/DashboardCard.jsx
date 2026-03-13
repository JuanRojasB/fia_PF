import { motion } from 'framer-motion';

/**
 * Componente reutilizable para KPI Cards
 * @param {string} color - Color del tema: 'blue', 'green', 'purple', 'orange', 'yellow', 'red', 'pink', 'indigo', 'gray'
 * @param {React.ReactNode} icon - Icono de lucide-react
 * @param {string} title - Título del KPI
 * @param {string} value - Valor principal a mostrar
 * @param {string} subtitle - Subtítulo o descripción
 * @param {string} footer - Información adicional en el footer
 * @param {string} footerValue - Valor del footer
 * @param {function} onClick - Función al hacer click
 * @param {number} delay - Delay de animación
 */
export function KPICard({ 
  color = 'blue', 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  footer, 
  footerValue,
  onClick,
  delay = 0 
}) {
  const colorClasses = {
    blue: {
      bg: 'bg-white/95',
      border: 'border-blue-500/30',
      hoverBorder: 'hover:border-blue-500',
      icon: 'text-blue-600',
      text: 'text-blue-600'
    },
    green: {
      bg: 'bg-white/95',
      border: 'border-green-500/30',
      hoverBorder: 'hover:border-green-500',
      icon: 'text-green-600',
      text: 'text-green-600'
    },
    purple: {
      bg: 'bg-white/95',
      border: 'border-purple-500/30',
      hoverBorder: 'hover:border-purple-500',
      icon: 'text-purple-600',
      text: 'text-purple-600'
    },
    orange: {
      bg: 'bg-white/95',
      border: 'border-orange-500/30',
      hoverBorder: 'hover:border-orange-500',
      icon: 'text-orange-600',
      text: 'text-orange-600'
    },
    yellow: {
      bg: 'bg-white/95',
      border: 'border-yellow-500/30',
      hoverBorder: 'hover:border-yellow-500',
      icon: 'text-yellow-600',
      text: 'text-yellow-600'
    },
    red: {
      bg: 'bg-white/95',
      border: 'border-red-500/30',
      hoverBorder: 'hover:border-red-500',
      icon: 'text-red-600',
      text: 'text-red-600'
    },
    pink: {
      bg: 'bg-white/95',
      border: 'border-pink-500/30',
      hoverBorder: 'hover:border-pink-500',
      icon: 'text-pink-600',
      text: 'text-pink-600'
    },
    indigo: {
      bg: 'bg-white/95',
      border: 'border-indigo-500/30',
      hoverBorder: 'hover:border-indigo-500',
      icon: 'text-indigo-600',
      text: 'text-indigo-600'
    },
    gray: {
      bg: 'bg-white/95',
      border: 'border-gray-500/30',
      hoverBorder: 'hover:border-gray-500',
      icon: 'text-gray-600',
      text: 'text-gray-600'
    },
    cyan: {
      bg: 'bg-white/95',
      border: 'border-cyan-500/30',
      hoverBorder: 'hover:border-cyan-500',
      icon: 'text-cyan-600',
      text: 'text-cyan-600'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className={`${colors.bg} backdrop-blur-xl rounded-xl p-4 sm:p-6 border-4 ${colors.border} ${colors.hoverBorder} shadow-sm hover:shadow-md transition-all ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-700 text-xs sm:text-sm font-medium">{title}</span>
        {Icon && <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.icon}`} />}
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</div>
      {subtitle && <div className="text-xs sm:text-sm text-gray-600 mt-1">{subtitle}</div>}
      {footer && (
        <div className="mt-3 pt-3 border-t border-gray-300">
          <div className="text-xs text-gray-600">{footer}</div>
          {footerValue && <div className={`text-base sm:text-lg font-semibold ${colors.text}`}>{footerValue}</div>}
        </div>
      )}
    </motion.div>
  );
}

/**
 * Componente reutilizable para Cards de Tabla
 */
export function TableCard({ title, icon: Icon, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-6 border-2 border-gray-300/50 shadow-sm"
    >
      {title && (
        <div className="flex items-center gap-2 sm:gap-3 mb-4">
          {Icon && <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />}
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h3>
        </div>
      )}
      {children}
    </motion.div>
  );
}

/**
 * Componente reutilizable para Cards de Gráficas
 */
export function ChartCard({ title, subtitle, icon: Icon, children, delay = 0, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className={`bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-6 border-4 border-gray-300/50 shadow-sm hover:shadow-md transition-all ${onClick ? 'cursor-pointer' : ''}`}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              {Icon && <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />}
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h3>
            </div>
          )}
          {subtitle && <p className="text-xs sm:text-sm text-gray-600">{subtitle}</p>}
        </div>
      )}
      {children}
    </motion.div>
  );
}

/**
 * Componente reutilizable para Cards de Información/Hero
 */
export function InfoCard({ 
  color = 'blue', 
  title, 
  subtitle, 
  icon: Icon, 
  children, 
  delay = 0 
}) {
  const colorClasses = {
    blue: 'border-blue-500/30',
    green: 'border-green-500/30',
    purple: 'border-purple-500/30',
    orange: 'border-orange-500/30',
    yellow: 'border-yellow-500/30',
    red: 'border-red-500/30',
    pink: 'border-pink-500/30',
    indigo: 'border-indigo-500/30',
    gray: 'border-gray-500/30',
    cyan: 'border-cyan-500/30'
  };

  const borderColor = colorClasses[color] || colorClasses.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-6 border-2 ${borderColor} shadow-md`}
    >
      {(title || subtitle) && (
        <div className="flex items-center gap-2 sm:gap-3 mb-4">
          {Icon && <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />}
          <div>
            {title && <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm sm:text-base text-gray-700">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </motion.div>
  );
}

/**
 * Componente para Cards de Estadísticas pequeñas
 */
export function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color = 'blue',
  trend,
  trendValue 
}) {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    pink: 'text-pink-600',
    indigo: 'text-indigo-600'
  };

  const iconColor = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-lg p-3 sm:p-4 border-2 border-gray-300/50 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 sm:gap-3 mb-2">
        {Icon && <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor}`} />}
        <span className="text-xs sm:text-sm font-medium text-gray-700">{label}</span>
      </div>
      <div className="text-xl sm:text-2xl font-bold text-gray-900">{value}</div>
      {trend && (
        <div className={`text-xs sm:text-sm font-semibold mt-1 ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '='} {trendValue}
        </div>
      )}
    </div>
  );
}
