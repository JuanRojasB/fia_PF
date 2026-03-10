/**
 * Controlador de Autenticación
 * Presentation Layer
 */

class AuthController {
  constructor(loginUseCase) {
    this.loginUseCase = loginUseCase;
  }

  /**
   * Login
   */
  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      // Validar datos
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Usuario y contraseña son requeridos'
        });
      }

      // Ejecutar caso de uso
      const result = await this.loginUseCase.execute(username, password);

      res.json(result);
    } catch (error) {
      if (error.message.includes('no encontrado') || error.message.includes('incorrecta')) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }
      next(error);
    }
  }

  /**
   * Logout
   */
  async logout(req, res) {
    res.json({
      success: true,
      message: 'Sesión cerrada correctamente'
    });
  }

  /**
   * Verificar token
   */
  async verifyToken(req, res) {
    res.json({
      success: true,
      user: req.user
    });
  }
}

module.exports = AuthController;
