const mysql = require('mysql2/promise');

async function verificarVentasInstitucional() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'erp_pollo_fiesta'
  });

  try {
    console.log('\n=== BUSCANDO DATOS DE VENTAS INSTITUCIONAL/MODERNO (SEDE 3) ===\n');

    // Buscar tablas relacionadas con institucional o moderno
    const [tablesInst] = await connection.query(`
      SHOW TABLES LIKE '%institucional%'
    `);
    console.log('Tablas con "institucional":', tablesInst);

    const [tablesModerno] = await connection.query(`
      SHOW TABLES LIKE '%moderno%'
    `);
    console.log('Tablas con "moderno":', tablesModerno);

    // Ya sabemos que existe com_sede3_ventas_detalle
    console.log('\n--- Verificando com_sede3_ventas_detalle ---');
    const [sede3Data] = await connection.query(`
      SELECT * FROM com_sede3_ventas_detalle LIMIT 5
    `);
    console.log('Primeras 5 filas:', sede3Data);

    // Contar registros
    const [count] = await connection.query(`
      SELECT COUNT(*) as total FROM com_sede3_ventas_detalle
    `);
    console.log('Total registros:', count[0].total);

    // Buscar datos agregados por temperatura
    console.log('\n--- Datos agregados por temperatura ---');
    const [tempData] = await connection.query(`
      SELECT 
        temperatura,
        SUM(kilos_2025) as kilos_2025,
        SUM(kilos_2024) as kilos_2024
      FROM com_sede3_ventas_detalle
      GROUP BY temperatura
    `);
    console.log('Datos por temperatura:', tempData);

    // Ver totales generales
    console.log('\n--- Totales generales Sede 3 ---');
    const [totals] = await connection.query(`
      SELECT 
        SUM(kilos_2025) as total_2025,
        SUM(kilos_2024) as total_2024
      FROM com_sede3_ventas_detalle
    `);
    console.log('Totales:', totals[0]);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

verificarVentasInstitucional();
