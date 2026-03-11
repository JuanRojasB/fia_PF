/**
 * Caso de Uso: Login
 * Application Layer
 */

const jwt = require('jsonwebtoken');
const serverConfig = require('../../../config/server.config');

class LoginUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Ejecutar login
   */
  async execute(username, password) {
    // Buscar usuario
    const user = await this.userRepository.findByUsername(username);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar si está activo
    if (!user.isUserActive()) {
      throw new Error('Usuario inactivo');
    }

    // Verificar contraseña (sin encriptar por ahora)
    if (user.password !== password) {
      throw new Error('Contraseña incorrecta');
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      serverConfig.jwtSecret,
      { expiresIn: serverConfig.jwtExpiration }
    );

    return {
      success: true,
      token,
      user: user.toJSON()
    };
  }
}

module.exports = LoginUseCase;
