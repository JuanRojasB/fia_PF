/**
 * Implementación del Repositorio de Usuarios
 * Infrastructure Layer
 */

const IUserRepository = require('../../domain/repositories/IUserRepository');
const User = require('../../domain/entities/User');

class UserRepository extends IUserRepository {
  constructor(dbConnection) {
    super();
    this.db = dbConnection;
  }

  /**
   * Buscar usuario por username
   */
  async findByUsername(username) {
    const sql = 'SELECT * FROM users WHERE username = ?';
    const result = await this.db.queryOne(sql, [username]);
    return result ? new User(result) : null;
  }

  /**
   * Buscar usuario por ID
   */
  async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const result = await this.db.queryOne(sql, [id]);
    return result ? new User(result) : null;
  }

  /**
   * Obtener todos los usuarios
   */
  async findAll() {
    const sql = 'SELECT * FROM users ORDER BY created_at DESC';
    const results = await this.db.query(sql);
    return results.map(row => new User(row));
  }

  /**
   * Crear nuevo usuario
   */
  async create(userData) {
    const sql = 'INSERT INTO users (username, password, full_name, role) VALUES (?, ?, ?, ?)';
    const result = await this.db.query(sql, [
      userData.username,
      userData.password,
      userData.fullName,
      userData.role
    ]);
    return result.insertId;
  }

  /**
   * Actualizar usuario
   */
  async update(id, userData) {
    const sql = 'UPDATE users SET full_name = ?, role = ?, is_active = ? WHERE id = ?';
    await this.db.query(sql, [userData.fullName, userData.role, userData.isActive, id]);
    return true;
  }

  /**
   * Eliminar usuario
   */
  async delete(id) {
    const sql = 'DELETE FROM users WHERE id = ?';
    await this.db.query(sql, [id]);
    return true;
  }
}

module.exports = UserRepository;
