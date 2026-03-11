const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

async function scanAudTables() {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'erp_pollo_fiesta',
    waitForConnections: true,
    connectionLimit: 10
  });
  
  try {
    console.log('\n🔍 ESCANEANDO TABLAS DE AUDITORÍA ACTUALIZADAS\n');
    console.log('═'.repeat(100));
    
    const audTables = [
      'aud_auditorias_ejecutadas',
      'aud_devoluciones_logistica',
      'aud_devoluciones_mensuales',
      'aud_devoluciones_resumen_anual',
      'aud_hallazgos',
      'aud_planes_accion'
    ];
    
    for (const tableName of audTables) {
      console.log(`\n📋 Tabla: ${tableName}`);
      console.log('─'.repeat(100));
      
      try {
        // Obtener estructura
        const [columns] = await pool.query(`DESCRIBE ${tableName}`);
        console.log('\n📝 Estructura:');
        columns.forEach(col => {
          console.log(`  - ${col.Field.padEnd(40)} ${col.Type.padEnd(20)} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `[${col.Key}]` : ''}`);
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

scanAudTables();
