const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

async function showTables() {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'erp_pollo_fiesta',
    waitForConnections: true,
    connectionLimit: 10
  });
  
  try {
    console.log('\n🔍 LISTANDO TODAS LAS TABLAS\n');
    console.log('Base de datos:', process.env.DB_NAME || 'erp_pollo_fiesta');
    console.log('\n');
    
    const [tables] = await pool.query('SHOW TABLES');
    
    console.log('📊 Tablas encontradas:', tables.length);
    console.log('\n');
    
    tables.forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`${(index + 1).toString().padStart(3)}. ${tableName}`);
    });
    
    console.log('\n✅ Listado completado\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

showTables();
