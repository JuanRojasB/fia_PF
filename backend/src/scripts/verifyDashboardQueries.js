const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

async function verifyDashboardQueries() {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'erp_pollo_fiesta',
    waitForConnections: true,
    connectionLimit: 10
  });
  
  try {
    console.log('\n🔍 VERIFICANDO CONSULTAS DE DASHBOARDS\n');
    console.log('═'.repeat(80));
    
    // Definir las consultas de cada dashboard
    const dashboards = {
      'COMERCIAL': [
        'vista_com_analisis_ventas',
        'vista_com_kpi_pollo_entero',
        'vista_com_unidades_procesadas',
        'vista_com_huevo_comparativo_multianual',
        'com_sede3_ventas_detalle',
        'com_ventas_huevo',
        'com_ventas_pdv',
        'com_puntos_venta',
        'com_agrupaciones',
        'com_objetivo_pollo_entero',
        'com_sede3_metas_operativas',
        'com_ventas_pie_canal',
        'com_unidades_procesadas'
      ],
      'CARTERA': [
        'com_cartera_clientes'
      ],
      'LOGÍSTICA': [
        'log_control_mermas',
        'vista_log_cumplimiento_mermas_2025'
      ],
      'PRODUCCIÓN - GRANJAS': [
        'prod_granjas',
        'prod_capacidad_clima',
        'prod_equipo_produccion'
      ],
      'PRODUCCIÓN - HISTÓRICO': [
        'prod_encasetamiento',
        'prod_encasetamiento_anual',
        'prod_pollo_entregado_anual',
        'prod_zootecnia_pollo',
        'prod_zootecnia_huevo',
        'prod_postura_flujo',
        'prod_postura_resumen_anual'
      ],
      'AUDITORÍA': [
        'aud_auditorias_ejecutadas',
        'aud_devoluciones_logistica',
        'aud_hallazgos',
        'aud_planes_accion'
      ]
    };
    
    for (const [dashboard, tables] of Object.entries(dashboards)) {
      console.log(`\n📊 ${dashboard}`);
      console.log('─'.repeat(80));
      
      let hasData = true;
      let emptyTables = [];
      
      for (const tableName of tables) {
        try {
          const [count] = await pool.query(`SELECT COUNT(*) as total FROM ${tableName}`);
          const total = count[0].total;
          const status = total > 0 ? '✅' : '⚠️';
          
          if (total === 0) {
            hasData = false;
            emptyTables.push(tableName);
          }
          
          console.log(`${status} ${tableName.padEnd(45)} ${total} registros`);
        } catch (error) {
          console.log(`❌ ${tableName.padEnd(45)} ERROR: ${error.message}`);
          hasData = false;
        }
      }
      
      if (!hasData) {
        console.log(`\n⚠️  ADVERTENCIA: Dashboard tiene tablas vacías: ${emptyTables.join(', ')}`);
      } else {
        console.log(`\n✅ Dashboard OK - Todas las tablas tienen datos`);
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

verifyDashboardQueries();
