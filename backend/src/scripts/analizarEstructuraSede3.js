const mysql = require('mysql2/promise');

async function analizarSede3() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'erp_pollo_fiesta'
  });

  try {
    console.log('\n=== ANÁLISIS COMPLETO SEDE 3 ===\n');

    // Ver todos los datos
    const [allData] = await connection.query(`
      SELECT * FROM com_sede3_ventas_detalle ORDER BY anio, estado_conservacion, codigo_linea
    `);
    
    console.log('Total registros:', allData.length);
    console.log('\nTodos los datos:');
    console.table(allData);

    // Agrupar por año y estado de conservación
    console.log('\n--- Totales por año y estado ---');
    const [grouped] = await connection.query(`
      SELECT 
        anio,
        estado_conservacion,
        COUNT(*) as num_lineas,
        SUM(kilos_vendidos) as total_kilos,
        AVG(precio_promedio) as precio_prom
      FROM com_sede3_ventas_detalle
      GROUP BY anio, estado_conservacion
      ORDER BY anio, estado_conservacion
    `);
    console.table(grouped);

    // Ver líneas únicas
    console.log('\n--- Líneas de producto ---');
    const [lineas] = await connection.query(`
      SELECT DISTINCT codigo_linea, nombre_linea
      FROM com_sede3_ventas_detalle
      ORDER BY codigo_linea
    `);
    console.table(lineas);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

analizarSede3();
