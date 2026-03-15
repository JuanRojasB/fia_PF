const mysql = require('mysql2/promise');

async function main() {
  const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'erp_pollo_fiesta', port: 3306 });

  // Query exacta del backend para ventasSede1Temperatura
  const [rows] = await pool.query(`
    SELECT 
      estado_conservacion as temperatura,
      codigo_linea,
      nombre_linea,
      SUM(CASE WHEN anio = 2025 THEN kilos_vendidos ELSE 0 END) as kilos_2025,
      SUM(CASE WHEN anio = 2024 THEN kilos_vendidos ELSE 0 END) as kilos_2024,
      AVG(CASE WHEN anio = 2025 THEN precio_promedio ELSE NULL END) as precio_2025,
      AVG(CASE WHEN anio = 2024 THEN precio_promedio ELSE NULL END) as precio_2024
    FROM com_sede1_ventas_detalle
    GROUP BY estado_conservacion, codigo_linea, nombre_linea
    ORDER BY estado_conservacion, kilos_2025 DESC
  `);

  console.log('RESULTADO ventasSede1Temperatura:');
  rows.forEach(r => console.log(JSON.stringify(r)));

  // Ver filas con 0 en algún año
  console.log('\nFilas con kilos_2025=0 o kilos_2024=0:');
  rows.filter(r => parseFloat(r.kilos_2025) === 0 || parseFloat(r.kilos_2024) === 0)
      .forEach(r => console.log(JSON.stringify(r)));

  await pool.end();
}
main().catch(console.error);
