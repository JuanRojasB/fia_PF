const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

async function verificarCartera() {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'erp_pollo_fiesta',
    waitForConnections: true,
    connectionLimit: 10
  });
  
  try {
    console.log('\n=== VERIFICANDO TABLA com_cartera_clientes ===\n');
    
    // Ver estructura
    const [estructura] = await pool.query('DESCRIBE com_cartera_clientes');
    console.log('Estructura de la tabla:');
    console.table(estructura);
    
    // Ver datos
    const [datos] = await pool.query('SELECT * FROM com_cartera_clientes LIMIT 5');
    console.log('\nPrimeros 5 registros:');
    console.table(datos);
    
    // Contar registros
    const [count] = await pool.query('SELECT COUNT(*) as total FROM com_cartera_clientes');
    console.log(`\nTotal de registros: ${count[0].total}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

verificarCartera();
