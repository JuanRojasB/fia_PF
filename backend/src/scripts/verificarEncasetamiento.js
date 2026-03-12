const mysql = require('mysql2/promise');

async function verificarEncasetamiento() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'erp_pollo_fiesta'
  });

  try {
    console.log('\n=== ESTRUCTURA prod_encasetamiento ===');
    const [cols] = await connection.query('DESCRIBE prod_encasetamiento');
    console.table(cols);

    console.log('\n=== DATOS prod_encasetamiento (2024-2025) ===');
    const [data] = await connection.query('SELECT * FROM prod_encasetamiento WHERE anio IN (2024, 2025) ORDER BY anio, mes');
    console.table(data);

    console.log('\n=== TOTALES POR AÑO ===');
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

verificarEncasetamiento();
