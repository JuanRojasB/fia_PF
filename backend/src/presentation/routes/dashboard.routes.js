const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/DashboardController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Obtener resumen de dashboards disponibles
router.get('/summary', (req, res) => dashboardController.getDashboardsSummary(req, res));

// Cargar datos CSV a la base de datos
router.post('/load-csv', (req, res) => dashboardController.loadCSVData(req, res));

// Obtener datos de un dashboard específico
router.get('/:type', (req, res) => dashboardController.getDashboardData(req, res));

module.exports = router;
