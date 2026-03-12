const mysql = require('mysql2/promise');

async function verificarPolloEntregado() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'erp_pollo_fiesta'
  });

  try {
    console.log('\n=== TABLAS POLLO ENTREGADO ===');
    const [tables] = await connection.query("SHOW TABLES LIKE '%pollo%entregado%'");
    tables.forEach(t => console.log('  -', Object.values(t)[0]));

    console.log('\n=== TABLAS POLLO ===');
    const [pollo] = await connection.query("SHOW TABLES LIKE '%pollo%'");
    pollo.forEach(t => console.log('  -', Object.values(t)[0]));

    // Verificar prod_pollo_entregado_anual
    console.log('\n=== ESTRUCTURA prod_pollo_entregado_anual ===');
    const [cols] = await connection.query('DESCRIBE prod_pollo_entregado_anual');
    console.table(cols);

    console.log('\n=== DATOS prod_pollo_entregado_anual ===');
    const [data] = await connection.query('SELECT * FROM prod_pollo_entregado_anual ORDER BY anio DESC');
    console.table(data);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

verificarPolloEntregado();
