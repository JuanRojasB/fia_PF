/**
 * Configuración del Servidor
 * @module config/server
 */

module.exports = {
  port: process.env.PORT || 3001,
  env: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  jwtSecret: process.env.JWT_SECRET || 'fia-dashboard-secret-2025',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h'
};
