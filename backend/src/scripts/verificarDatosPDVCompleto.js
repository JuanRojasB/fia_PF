const mysql = require('mysql2/promise');

async function verificarDatosPDVCompleto() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'erp_pollo_fiesta'
  });

  try {
    console.log('\n=== TABLAS COM_PDV ===');
    const [tables] = await connection.query("SHOW TABLES LIKE 'com_pdv%'");
    tables.forEach(t => console.log('  -', Object.values(t)[0]));

    console.log('\n=== VISTAS COM_PDV ===');
    const [vistas] = await connection.query("SHOW TABLES LIKE 'vista_com_pdv%'");
    vistas.forEach(t => console.log('  -', Object.values(t)[0]));

    console.log('\n=== ESTRUCTURA com_pdv_ventas_zonales ===');
    const [cols] = await connection.query('DESCRIBE com_pdv_ventas_zonales');
    console.table(cols);

    console.log('\n=== DATOS com_pdv_ventas_zonales (2024-2025) ===');
    const [data] = await connection.query('SELECT * FROM com_pdv_ventas_zonales ORDER BY anio, zona_geografica');
    console.table(data);

    console.log('\n=== TOP DESEMPEÑO ===');
    const [top] = await connection.query('SELECT * FROM com_pdv_top_desempeno LIMIT 10');
    console.table(top);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

verificarDatosPDVCompleto();
