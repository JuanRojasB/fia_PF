/**
 * Configuración de Base de Datos
 * Railway: usa MYSQL_URL (recomendado) o variables MYSQL*
 * Local: usa .env
 * @module config/database
 */

// Railway inyecta MYSQL_URL - conectar por URL tiene prioridad
const mysqlUrl = process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL;

if (mysqlUrl) {
  module.exports = {
    uri: mysqlUrl,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    charset: 'utf8mb4'
  };
} else {
  // Usar variables de entorno (sin hardcoding)
  module.exports = {
    host: process.env.MYSQLHOST || process.env.DB_HOST,
    user: process.env.MYSQLUSER || process.env.DB_USER,
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
    database: process.env.MYSQLDATABASE || process.env.DB_NAME,
    port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306', 10),
    socketPath: process.env.MYSQLSOCKET || undefined,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    charset: 'utf8mb4'
  };
}
