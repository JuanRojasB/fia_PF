const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

async function verifyAllTables() {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'erp_pollo_fiesta',
    waitForConnections: true,
    connectionLimit: 10
  });
  
  try {
    console.log('\n🔍 VERIFICANDO TODAS LAS TABLAS DE LA BASE DE DATOS\n');
    console.log('═'.repeat(80));
    
    // Obtener todas las tablas
    const [tables] = await pool.query('SHOW TABLES');
    const tableNames = tables.map(t => Object.values(t)[0]);
    
    console.log(`\n📊 Total de tablas: ${tableNames.length}\n`);
    
    // Agrupar por prefijo
    const grouped = {
      com_: [],
      prod_: [],
      aud_: [],
      log_: [],
      vista_: [],
      otros: []
    };
    
    tableNames.forEach(name => {
      if (name.startsWith('com_')) grouped.com_.push(name);
      else if (name.startsWith('prod_')) grouped.prod_.push(name);
      else if (name.startsWith('aud_')) grouped.aud_.push(name);
      else if (name.startsWith('log_')) grouped.log_.push(name);
      else if (name.startsWith('vista_')) grouped.vista_.push(name);
      else grouped.otros.push(name);
    });
    
    // Mostrar resumen por categoría
    for (const [prefix, tables] of Object.entries(grouped)) {
      if (tables.length > 0) {
        console.log(`\n📁 ${prefix.toUpperCase()} (${tables.length} tablas)`);
        console.log('─'.repeat(80));
        
        for (const tableName of tables) {
          const [count] = await pool.query(`SELECT COUNT(*) as total FROM ${tableName}`);
          const total = count[0].total;
          const status = total > 0 ? '✅' : '⚠️';
          console.log(`${status} ${tableName.padEnd(40)} ${total} registros`);
        }
      }
    }
    
    console.log('\n' + '═'.repeat(80));
    console.log('\n✅ Verificación completada\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

verifyAllTables();
