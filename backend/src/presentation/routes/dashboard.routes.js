const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');

module.exports = (dashboardController) => {
  const router = express.Router();

  // Todas las rutas requieren autenticación
  router.use(verifyToken);

  // Obtener resumen de dashboards disponibles
  router.get('/summary', (req, res) => dashboardController.getDashboardsSummary(req, res));

  // Obtener datos de un dashboard específico
  router.get('/:type', (req, res) => dashboardController.getDashboardData(req, res));

  return router;
};
