/**
 * Índice de Rutas
 * Presentation Layer
 */

const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboard.routes');

module.exports = (authController, dashboardController) => {
  return {
    auth: authRoutes(authController),
    dashboard: dashboardRoutes(dashboardController)
  };
};
