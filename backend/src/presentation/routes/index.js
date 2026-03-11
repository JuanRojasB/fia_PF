/**
 * Índice de Rutas
 * Presentation Layer
 */

const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboard.routes');

module.exports = (authController) => {
  return {
    auth: authRoutes(authController),
    dashboard: dashboardRoutes
  };
};
