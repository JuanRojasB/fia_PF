const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

async function listProdTables() {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'erp_pollo_fiesta',
    waitForConnections: true,
    connectionLimit: 10
  });
  
  try {
    console.log('\n🔍 Listando tablas de PRODUCCIÓN (prod_*)...\n');
    
    // Listar todas las tablas que empiezan con prod_
    const [tables] = await pool.query(`
      SHOW TABLES LIKE 'prod_%'
    `);
    
    console.log(`📊 Total de tablas encontradas: ${tables.length}\n`);
    
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      console.log(`\n📋 Tabla: ${tableName}`);
      console.log('─'.repeat(80));
      
      // Obtener estructura
      const [columns] = await pool.query(`DESCRIBE ${tableName}`);
      console.log('\n📝 Estructura:');
      columns.forEach(col => {
        console.log(`  - ${col.Field} (${col.Type}) ${col.Null === 'NO' ? 'NOT NULL' : ''} ${col.Key ? `[${col.Key}]` : ''}`);
      });
      
      // Contar registros
      const [count] = await pool.query(`SELECT COUNT(*) as total FROM ${tableName}`);
      console.log(`\n📊 Registros: ${count[0].total}`);
      
      // Mostrar muestra de datos si hay registros
      if (count[0].total > 0) {
        const [sample] = await pool.query(`SELECT * FROM ${tableName} LIMIT 3`);
        console.log('\n🔍 Muestra de datos:');
        console.log(JSON.stringify(sample, null, 2));
      }
    }
    
    console.log('\n✅ Escaneo completado\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

listProdTables();
