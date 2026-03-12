const mysql = require('mysql2/promise');
const fs = require('fs');

async function ejecutarActualizacion() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'erp_pollo_fiesta',
    multipleStatements: true
  });

  try {
    console.log('\n=== ACTUALIZANDO DATOS DE ENCASETAMIENTO ===\n');
    
    const sql = fs.readFileSync('backend/src/scripts/actualizarEncasetamiento.sql', 'utf8');
    await connection.query(sql);
    
    console.log('✅ Datos actualizados correctamente\n');
    
    console.log('=== VERIFICANDO TOTALES ===\n');
    const [totales] = await connection.query(`
      SELECT 
        anio,
        SUM(valor_programado) as total_programado,
        SUM(valor_real) as total_real
      FROM prod_encasetamiento
      WHERE anio IN (2024, 2025)
      GROUP BY anio
    `);
    console.table(totales);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

ejecutarActualizacion();
