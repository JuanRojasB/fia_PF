const mysql = require('mysql2/promise');

async function consultarSedes() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'erp_pollo_fiesta',
    waitForConnections: true,
    connectionLimit: 10
  });
  
  try {
    console.log('\n=== BUSCANDO INFORMACIÓN DE SEDES ===\n');
    
    // Buscar en vistas que contengan información de sedes
    const [vistas] = await pool.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = 'erp_pollo_fiesta' 
      AND TABLE_TYPE = 'VIEW'
      AND (TABLE_NAME LIKE '%sede%' OR TABLE_NAME LIKE '%log%' OR TABLE_NAME LIKE '%centro%')
    `);
    
    console.log('Vistas encontradas:', vistas.map(v => v.TABLE_NAME));
    
    // Consultar vista de mermas por sede
    console.log('\n--- Vista: vista_log_cumplimiento_mermas_2025 ---');
    const [mermas] = await pool.query(`SELECT * FROM vista_log_cumplimiento_mermas_2025`);
    console.log(JSON.stringify(mermas, null, 2));
    
    // Consultar vista de centros de operación
    console.log('\n--- Vista: vista_com_unidades_procesadas ---');
    const [centros] = await pool.query(`SELECT * FROM vista_com_unidades_procesadas`);
    console.log(JSON.stringify(centros, null, 2));
    
    // Buscar tablas con información de sedes
    console.log('\n--- Buscando en tablas ---');
    const [tablas] = await pool.query(`
      SELECT TABLE_NAME, COLUMN_NAME
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = 'erp_pollo_fiesta' 
      AND (COLUMN_NAME LIKE '%sede%' OR COLUMN_NAME LIKE '%centro%')
      GROUP BY TABLE_NAME, COLUMN_NAME
    `);
    console.log('Tablas con columnas de sede/centro:', tablas);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

consultarSedes();
