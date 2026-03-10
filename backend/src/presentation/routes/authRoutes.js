/**
 * Rutas de Autenticación
 * Presentation Layer
 */

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');

module.exports = (authController) => {
  /**
   * POST /api/auth/login
   * Login de usuario
   */
  router.post('/login', (req, res, next) => authController.login(req, res, next));

  /**
   * POST /api/auth/logout
   * Logout de usuario
   */
  router.post('/logout', verifyToken, (req, res) => authController.logout(req, res));

  /**
   * GET /api/auth/verify
   * Verificar token
   */
  router.get('/verify', verifyToken, (req, res) => authController.verifyToken(req, res));

  return router;
};
