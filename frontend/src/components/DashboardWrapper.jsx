import { memo } from 'react';

const DashboardWrapper = memo(({ children }) => {
  return (
    <div className="dashboard-content">
      {children}
    </div>
  );
}, (prevProps, nextProps) => {
  // Solo re-renderizar si el contenido realmente cambió
  return prevProps.children === nextProps.children;
});

DashboardWrapper.displayName = 'DashboardWrapper';

export default DashboardWrapper;
