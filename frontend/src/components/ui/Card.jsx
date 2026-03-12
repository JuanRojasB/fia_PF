import { motion } from 'framer-motion';

/**
 * Card Base - Componente base para todas las cards
 */
export function Card({ children, className = '', delay = 0, onClick, hover = false, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className={`backdrop-blur-xl rounded-xl p-6 shadow-lg transition-all ${
        hover ? 'cursor-pointer hover:scale-[1.02] hover:shadow-xl' : ''
      } ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid rgba(203, 213, 225, 0.5)',
        ...props.style
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Card con borde de color - Para destacar secciones importantes
 */
export function ColoredCard({ children, color = 'blue', className = '', delay = 0, onClick, ...props }) {
  const colorMap = {
    blue: 'border-blue-500/40 hover:border-blue-500',
    green: 'border-green-500/40 hover:border-green-500',
    purple: 'border-purple-500/40 hover:border-purple-500',
    red: 'border-red-500/40 hover:border-red-500',
    yellow: 'border-yellow-500/40 hover:border-yellow-500',
    cyan: 'border-cyan-500/40 hover:border-cyan-500',
    orange: 'border-orange-500/40 hover:border-orange-500',
    pink: 'border-pink-500/40 hover:border-pink-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className={`backdrop-blur-xl rounded-xl p-6 shadow-lg border-4 transition-all ${
        onClick ? 'cursor-pointer hover:scale-[1.02]' : ''
      } ${colorMap[color] || colorMap.blue} ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        ...props.style
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stat Card - Para mostrar estadísticas con icono
 */
export function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  subtitle, 
  color = 'blue',
  delay = 0,
  onClick,
  trend,
  trendValue
}) {
  const colorMap = {
    blue: { icon: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-500/40 hover:border-blue-500' },
    green: { icon: 'text-green-600', bg: 'bg-green-50', border: 'border-green-500/40 hover:border-green-500' },
    purple: { icon: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-500/40 hover:border-purple-500' },
    red: { icon: 'text-red-600', bg: 'bg-red-50', border: 'border-red-500/40 hover:border-red-500' },
    yellow: { icon: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-500/40 hover:border-yellow-500' },
    cyan: { icon: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-500/40 hover:border-cyan-500' },
    orange: { icon: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-500/40 hover:border-orange-500' },
    pink: { icon: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-500/40 hover:border-pink-500' },
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <ColoredCard color={color} delay={delay} onClick={onClick}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600 text-sm font-medium">{label}</span>
        {Icon && (
          <div className={`p-2 rounded-lg ${colors.bg}`}>
            <Icon className={`w-6 h-6 ${colors.icon}`} />
          </div>
        )}
      </div>
      <div className="text-4xl font-bold text-gray-900 mb-1">{value}</div>
      {subtitle && (
        <div className="text-xs text-gray-500">{subtitle}</div>
      )}
      {trend && (
        <div className={`text-xs mt-2 font-semibold ${
          trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
        }`}>
          {trendValue}
        </div>
      )}
    </ColoredCard>
  );
}

/**
 * Chart Card - Para gráficas
 */
export function ChartCard({ title, icon: Icon, children, delay = 0, className = '' }) {
  return (
    <Card delay={delay} className={className}>
      <div className="flex items-center gap-3 mb-6">
        {Icon && <Icon className="w-6 h-6 text-blue-600" />}
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      {children}
    </Card>
  );
}

/**
 * Table Card - Para tablas
 */
export function TableCard({ title, children, delay = 0, className = '' }) {
  return (
    <Card delay={delay} className={`overflow-x-auto ${className}`}>
      {title && (
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      )}
      {children}
    </Card>
  );
}

/**
 * Header Card - Para encabezados de sección
 */
export function HeaderCard({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 mb-2">
        {Icon && (
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
            <Icon className="w-8 h-8 text-white" />
          </div>
        )}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

/**
 * Grid Container - Para layouts de grid responsivos
 */
export function GridContainer({ children, cols = 3, className = '' }) {
  const colsMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${colsMap[cols] || colsMap[3]} gap-6 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Info Badge - Para mostrar información adicional
 */
export function InfoBadge({ children, color = 'blue', className = '' }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    gray: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${colorMap[color]} ${className}`}>
      {children}
    </span>
  );
}

/**
 * Empty State - Para cuando no hay datos
 */
export function EmptyState({ icon: Icon, title, message }) {
  return (
    <Card className="text-center py-12">
      {Icon && (
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-gray-100">
            <Icon className="w-12 h-12 text-gray-400" />
          </div>
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{message}</p>
    </Card>
  );
}
