const mysql = require('mysql2/promise');
const fs = require('fs');

async function ejecutarInsert() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'erp_pollo_fiesta',
    multipleStatements: true
  });

  try {
    console.log('\n=== INSERTANDO DATOS POLLO ENTREGADO 2025 ===\n');
    
    const sql = fs.readFileSync('backend/src/scripts/insertarPolloEntregado2025.sql', 'utf8');
    const [results] = await connection.query(sql);
    
    console.log('✅ Datos insertados correctamente\n');
    
    console.log('=== VERIFICANDO DATOS 2024-2025 ===\n');
    const [data] = await connection.query(`
      SELECT 
        anio,
        programado,
        real_granjas,
        comprado,
        total,
        var_pct,
        var_unidades_reportada
      FROM prod_pollo_entregado_anual
      WHERE anio IN (2024, 2025)
      ORDER BY anio DESC
    `);
    console.table(data);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

ejecutarInsert();
