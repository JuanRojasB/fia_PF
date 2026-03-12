const mysql = require('mysql2/promise');

async function verificarTablasGranjas() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'erp_pollo_fiesta'
  });

  try {
    console.log('\n=== TABLAS GRANJAS ===');
    const [granjas] = await connection.query("SHOW TABLES LIKE '%granja%'");
    granjas.forEach(t => console.log('  -', Object.values(t)[0]));

    console.log('\n=== TABLAS PRODUCCION ===');
    const [prod] = await connection.query("SHOW TABLES LIKE '%prod%'");
    prod.forEach(t => console.log('  -', Object.values(t)[0]));

    console.log('\n=== TABLAS CAPACIDAD ===');
    const [cap] = await connection.query("SHOW TABLES LIKE '%capacidad%'");
    cap.forEach(t => console.log('  -', Object.values(t)[0]));

    console.log('\n=== TABLAS ENCASETADO ===');
    const [enc] = await connection.query("SHOW TABLES LIKE '%encaset%'");
    enc.forEach(t => console.log('  -', Object.values(t)[0]));

    if (cap.length > 0) {
      const tableName = Object.values(cap[0])[0];
      console.log(`\n=== ESTRUCTURA ${tableName} ===`);
      const [cols] = await connection.query(`DESCRIBE ${tableName}`);
      console.table(cols);

      console.log(`\n=== DATOS ${tableName} ===`);
      const [data] = await connection.query(`SELECT * FROM ${tableName} LIMIT 5`);
      console.table(data);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

verificarTablasGranjas();
