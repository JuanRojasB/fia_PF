import { memo } from 'react';
import { ResponsiveContainer } from 'recharts';

// Componente optimizado para gráficas con React.memo
const OptimizedChart = memo(({ children, width = "100%", height = 400, minWidth }) => {
  return (
    <div className="w-full overflow-x-auto">
      {minWidth ? (
        <div style={{ minWidth, width: '100%', height }}>
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
      ) : (
        <ResponsiveContainer width={width} height={height}>
          {children}
        </ResponsiveContainer>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Solo re-renderizar si los datos cambian
  return JSON.stringify(prevProps.children) === JSON.stringify(nextProps.children);
});

OptimizedChart.displayName = 'OptimizedChart';

export default OptimizedChart;
