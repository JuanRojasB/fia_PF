const mysql = require('mysql2/promise');

async function main() {
  const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'erp_pollo_fiesta', port: 3306 });
  
  await pool.query(
    `UPDATE prod_pollo_entregado_anual SET
      programado = 30872786,
      real_granjas = 29435711,
      comprado = 238502,
      total = 29674213,
      var_pct = 2.70,
      var_unidades_calc = 795724,
      notas = 'Del total recibido (REAL) de granjas para el año 2025 sumado al pollo comprado arroja un total de 29.674.213 pollos, con un crecimiento del 2.7% frente al año anterior.'
    WHERE anio = 2025`
  );
  
  console.log('2025 actualizado correctamente');
  const [rows] = await pool.query('SELECT anio, programado, real_granjas, comprado, total, var_pct FROM prod_pollo_entregado_anual ORDER BY anio');
  rows.forEach(r => console.log(JSON.stringify(r)));
  await pool.end();
}

main().catch(console.error);
