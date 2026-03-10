/**
 * Entidad Usuario
 * Domain Layer
 */

class User {
  constructor({ id, username, password, full_name, role, is_active, created_at }) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.fullName = full_name;
    this.role = role;
    this.isActive = is_active;
    this.createdAt = created_at;
  }

  /**
   * Verificar si el usuario es administrador
   */
  isAdmin() {
    return this.role === 'admin';
  }

  /**
   * Verificar si el usuario es analista
   */
  isAnalyst() {
    return this.role === 'analyst';
  }

  /**
   * Verificar si el usuario está activo
   */
  isUserActive() {
    return this.isActive === 1;
  }

  /**
   * Convertir a objeto simple (sin password)
   */
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      fullName: this.fullName,
      role: this.role,
      isActive: this.isActive,
      createdAt: this.createdAt
    };
  }
}

module.exports = User;
