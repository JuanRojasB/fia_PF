// Rutas de la aplicación
export const ROUTES = {
  // Rutas públicas
  LOGIN: '/',
  
  // Rutas protegidas
  HOME: '/home',
  DASHBOARD: '/dashboard',
};

// Helper para navegación
export const getRoute = (routeName) => {
  return ROUTES[routeName] || ROUTES.LOGIN;
};
