const mysql = require('mysql2/promise');

async function verificarDatosPDV() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'erp_pollo_fiesta'
  });

  try {
    console.log('\n=== TABLAS PDV ===\n');
    const [tables] = await connection.query(`SHOW TABLES LIKE '%pdv%'`);
    tables.forEach(t => console.log('  -', Object.values(t)[0]));

    console.log('\n=== DATOS com_pdv_maestro ===\n');
    const [pdv] = await connection.query('SELECT * FROM com_pdv_maestro LIMIT 5');
    console.table(pdv);

    console.log('\n=== VISTA vista_com_pdv_participacion_zona_2024 ===\n');
    const [vista] = await connection.query('SELECT * FROM vista_com_pdv_participacion_zona_2024 LIMIT 5');
    console.table(vista);

    console.log('\n=== TOTALES POR ZONA ===\n');
    const [totales] = await connection.query(`
      SELECT 
        zona_asignacion,
        COUNT(*) as total_pdv,
        SUM(pdv_kilos_pollo) as total_kilos,
        SUM(pdv_unidades_huevo) as total_huevos
      FROM vista_com_pdv_participacion_zona_2024
      GROUP BY zona_asignacion
      ORDER BY total_kilos DESC
    `);
    console.table(totales);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

verificarDatosPDV();
