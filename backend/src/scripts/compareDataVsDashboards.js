const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

async function compareDataVsDashboards() {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'erp_pollo_fiesta',
    waitForConnections: true,
    connectionLimit: 10
  });
  
  try {
    console.log('\n🔍 COMPARANDO DATOS DE BD VS DASHBOARDS\n');
    console.log('═'.repeat(100));
    
    // Tablas principales por dashboard
    const tablesToCheck = [
      // COMERCIAL
      { table: 'com_sede3_ventas_detalle', dashboard: 'COMERCIAL' },
      { table: 'com_ventas_huevo', dashboard: 'COMERCIAL' },
      { table: 'com_ventas_pdv', dashboard: 'COMERCIAL' },
      { table: 'com_puntos_venta', dashboard: 'COMERCIAL' },
      { table: 'com_agrupaciones', dashboard: 'COMERCIAL' },
      { table: 'com_sede3_metas_operativas', dashboard: 'COMERCIAL' },
      { table: 'com_ventas_pie_canal', dashboard: 'COMERCIAL' },
      { table: 'com_unidades_procesadas', dashboard: 'COMERCIAL' },
      
      // CARTERA
      { table: 'com_cartera_clientes', dashboard: 'CARTERA' },
      
      // LOGÍSTICA
      { table: 'log_control_mermas', dashboard: 'LOGÍSTICA' },
      
      // PRODUCCIÓN
      { table: 'prod_granjas', dashboard: 'PRODUCCIÓN - GRANJAS' },
      { table: 'prod_encasetamiento', dashboard: 'PRODUCCIÓN - HISTÓRICO' },
      { table: 'prod_pollo_entregado_anual', dashboard: 'PRODUCCIÓN - HISTÓRICO' },
      { table: 'prod_zootecnia_huevo', dashboard: 'PRODUCCIÓN - HISTÓRICO' },
      { table: 'prod_zootecnia_pollo', dashboard: 'PRODUCCIÓN - HISTÓRICO' },
      { table: 'prod_postura_flujo', dashboard: 'PRODUCCIÓN - HISTÓRICO' },
      { table: 'prod_postura_resumen_anual', dashboard: 'PRODUCCIÓN - HISTÓRICO' },
      
      // AUDITORÍA
      { table: 'aud_auditorias_ejecutadas', dashboard: 'AUDITORÍA' },
      { table: 'aud_devoluciones_logistica', dashboard: 'AUDITORÍA' }
    ];
    
    for (const { table, dashboard } of tablesToCheck) {
      console.log(`\n📊 ${dashboard} - ${table}`);
      console.log('─'.repeat(100));
      
      // Obtener estructura de la tabla
      const [columns] = await pool.query(`DESCRIBE ${table}`);
      const columnNames = columns.map(c => c.Field);
      
      // Obtener muestra de datos
      const [sample] = await pool.query(`SELECT * FROM ${table} LIMIT 1`);
      
      if (sample.length > 0) {
        console.log('\n📝 Campos disponibles en la tabla:');
        columnNames.forEach((col, idx) => {
          const value = sample[0][col];
          const preview = value !== null && value !== undefined 
            ? (typeof value === 'string' && value.length > 50 ? value.substring(0, 50) + '...' : value)
            : 'NULL';
          console.log(`   ${(idx + 1).toString().padStart(2)}. ${col.padEnd(40)} = ${preview}`);
        });
        
        // Contar registros
        const [count] = await pool.query(`SELECT COUNT(*) as total FROM ${table}`);
        console.log(`\n✅ Total de registros: ${count[0].total}`);
      } else {
        console.log('⚠️  Tabla vacía');
      }
    }
    
    console.log('\n' + '═'.repeat(100));
    console.log('\n✅ Comparación completada\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

compareDataVsDashboards();
