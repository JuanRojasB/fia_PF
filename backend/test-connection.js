/**
 * Script para probar la conexión a la base de datos
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('🔍 Probando conexión a la base de datos...\n');
  
  const config = {
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || '',
    database: process.env.MYSQLDATABASE || 'erp_pollo_fiesta',
    port: parseInt(process.env.MYSQLPORT || '3306', 10)
  };
  
  console.log('📋 Configuración:');
  console.log(`   Host: ${config.host}`);
  console.log(`   User: ${config.user}`);
  console.log(`   Password: ${config.password ? '***' : '(vacío)'}`);
  console.log(`   Database: ${config.database}`);
  console.log(`   Port: ${config.port}\n`);
  
  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Conexión exitosa!\n');
    
    // Verificar usuarios
    const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
    console.log(`📊 Usuarios en la base de datos: ${users[0].count}`);
    
    // Listar tablas
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`📁 Tablas encontradas (${tables.length}):`);
    tables.slice(0, 10).forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`   - ${tableName}`);
    });
    if (tables.length > 10) {
      console.log(`   ... y ${tables.length - 10} más`);
    }
    
    await connection.end();
    console.log('\n✅ Test completado exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.error('\n💡 Verifica que:');
    console.error('   1. MySQL esté corriendo');
    console.error('   2. La base de datos "erp_pollo_fiesta" exista');
    console.error('   3. El usuario "root" tenga acceso sin contraseña');
    console.error('   4. El archivo .env esté configurado correctamente\n');
    process.exit(1);
  }
}

testConnection();
