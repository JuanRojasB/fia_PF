const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

async function scanVistas() {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'erp_pollo_fiesta',
    waitForConnections: true,
    connectionLimit: 10
  });
  
  try {
    console.log('\n🔍 ESCANEANDO TODAS LAS VISTAS\n');
    console.log('═'.repeat(100));
    
    // Obtener todas las vistas
    const [views] = await pool.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = 'erp_pollo_fiesta' 
      AND TABLE_TYPE = 'VIEW'
      ORDER BY TABLE_NAME
    `);
    
    console.log(`\n📊 Total de vistas: ${views.length}\n`);
    
    for (const view of views) {
      const viewName = view.TABLE_NAME;
      console.log(`\n📋 Vista: ${viewName}`);
      console.log('─'.repeat(100));
      
      try {
        // Obtener estructura
        const [columns] = await pool.query(`DESCRIBE ${viewName}`);
        console.log('\n📝 Estructura:');
        columns.forEach(col => {
          console.log(`  - ${col.Field.padEnd(40)} ${col.Type.padEnd(20)}`);
        });
        
        // Contar registros
        const [count] = await pool.query(`SELECT COUNT(*) as total FROM ${viewName}`);
        console.log(`\n📊 Registros: ${count[0].total}`);
        
        // Mostrar muestra de datos si hay registros
        if (count[0].total > 0) {
          const [sample] = await pool.query(`SELECT * FROM ${viewName} LIMIT 2`);
          console.log('\n🔍 Muestra de datos:');
          console.log(JSON.stringify(sample, null, 2));
        }
      } catch (error) {
        console.log(`❌ Error: ${error.message}`);
      }
    }
    
    console.log('\n' + '═'.repeat(100));
    console.log('\n✅ Escaneo completado\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

scanVistas();
