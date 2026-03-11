/**
 * Middleware de Autenticación
 * Presentation Layer
 */

const jwt = require('jsonwebtoken');
const serverConfig = require('../../config/server.config');

/**
 * Verificar token JWT
 */
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token no proporcionado'
    });
  }

  try {
    const decoded = jwt.verify(token, serverConfig.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

/**
 * Verificar rol de administrador
 */
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de administrador'
    });
  }
  next();
};

/**
 * Verificar rol de analista o superior
 */
const isAnalyst = (req, res, next) => {
  if (req.user.role !== 'analyst' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de analista'
    });
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
  isAnalyst
};
