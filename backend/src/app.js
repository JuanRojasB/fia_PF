/**
 * Aplicación Express
 * Presentation Layer
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const serverConfig = require('./config/server.config');
const errorHandler = require('./presentation/middlewares/errorHandler');

class App {
  constructor(routes) {
    this.app = express();
    this.routes = routes;
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  /**
   * Configurar middlewares
   */
  setupMiddlewares() {
    // CORS
    this.app.use(cors({
      origin: serverConfig.corsOrigin,
      credentials: true
    }));

    // Body parser
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Archivos estáticos (frontend build para producción)
    const frontendPath = path.join(__dirname, '../../frontend/dist');
    this.app.use(express.static(frontendPath));

    // Logging
    this.app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`);
      next();
    });
  }

  /**
   * Configurar rutas
   */
  setupRoutes() {
    // Ruta de health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // Rutas de la API
    this.app.use('/api/auth', this.routes.auth);
    this.app.use('/api/dashboard', this.routes.dashboard);

    // SPA fallback: rutas no-API sirven index.html para React Router
    this.app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({
          success: false,
          message: 'Ruta no encontrada'
        });
      }
      const indexPath = path.join(__dirname, '../../frontend/dist/index.html');
      res.sendFile(indexPath);
    });
  }

  /**
   * Configurar manejador de errores
   */
  setupErrorHandler() {
    this.app.use(errorHandler);
  }

  /**
   * Obtener instancia de Express
   */
  getApp() {
    return this.app;
  }
}

module.exports = App;
