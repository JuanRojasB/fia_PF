const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

async function checkLogTables() {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'erp_pollo_fiesta',
    waitForConnections: true,
    connectionLimit: 10
  });
  
  try {
    console.log('\n🔍 ANALIZANDO TABLAS DE LOGÍSTICA\n');
    
    const logTables = [
      'log_control_mermas',
      'log_gastos_comparativo',
      'log_gastos_operacionales',
      'log_gastos_operativos_detalle',
      'log_headcount_historico',
      'log_sedes_operacion'
    ];
    
    for (const table of logTables) {
      console.log(`\n📊 Tabla: ${table}`);
      console.log('─'.repeat(80));
      
      // Estructura
      const [columns] = await pool.query(`DESCRIBE ${table}`);
      console.log('\nColumnas:');
      columns.forEach(col => {
        console.log(`  - ${col.Field} (${col.Type})`);
      });
      
      // Contar registros
      const [count] = await pool.query(`SELECT COUNT(*) as total FROM ${table}`);
      console.log(`\nTotal registros: ${count[0].total}`);
      
      // Muestra de datos
      if (count[0].total > 0) {
        const [sample] = await pool.query(`SELECT * FROM ${table} LIMIT 3`);
        console.log('\nMuestra de datos:');
        console.log(JSON.stringify(sample, null, 2));
      }
    }
    
    console.log('\n' + '═'.repeat(80));
    console.log('\n✅ Análisis completado\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

checkLogTables();
