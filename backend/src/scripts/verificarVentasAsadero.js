const mysql = require('mysql2/promise');

async function verificarVentasAsadero() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'erp_pollo_fiesta'
  });

  try {
    console.log('\n=== BUSCANDO DATOS DE VENTAS ASADERO (SEDE 1) ===\n');

    // Buscar tablas relacionadas con asadero o sede 1
    const [tables] = await connection.query(`
      SHOW TABLES LIKE '%asadero%'
    `);
    console.log('Tablas con "asadero":', tables);

    const [tablesSede1] = await connection.query(`
      SHOW TABLES LIKE '%sede1%'
    `);
    console.log('Tablas con "sede1":', tablesSede1);

    const [tablesSede_1] = await connection.query(`
      SHOW TABLES LIKE '%sede_1%'
    `);
    console.log('Tablas con "sede_1":', tablesSede_1);

    // Buscar en com_sede1_ventas_detalle
    console.log('\n--- Verificando com_sede1_ventas_detalle ---');
    const [sede1Data] = await connection.query(`
      SELECT * FROM com_sede1_ventas_detalle LIMIT 5
    `);
    console.log('Primeras 5 filas:', sede1Data);

    // Contar registros
    const [count] = await connection.query(`
      SELECT COUNT(*) as total FROM com_sede1_ventas_detalle
    `);
    console.log('Total registros:', count[0].total);

    // Ver estructura
    const [structure] = await connection.query(`
      DESCRIBE com_sede1_ventas_detalle
    `);
    console.log('\nEstructura de la tabla:');
    structure.forEach(col => {
      console.log(`  ${col.Field} (${col.Type})`);
    });

    // Buscar datos agregados por temperatura
    console.log('\n--- Buscando datos agregados por temperatura ---');
    const [tempData] = await connection.query(`
      SELECT 
        temperatura,
        SUM(kilos_2025) as kilos_2025,
        SUM(kilos_2024) as kilos_2024
      FROM com_sede1_ventas_detalle
      GROUP BY temperatura
    `);
    console.log('Datos por temperatura:', tempData);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

verificarVentasAsadero();
