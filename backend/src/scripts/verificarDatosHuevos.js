const mysql = require('mysql2/promise');

async function verificarDatosHuevos() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'erp_pollo_fiesta',
    waitForConnections: true,
    connectionLimit: 10
  });
  
  try {
    console.log('\n=== VERIFICANDO DATOS DE PRODUCCIÓN DE HUEVOS ===\n');
    
    // Ver tablas de postura
    console.log('--- Tabla: prod_postura_resumen_anual ---');
    const [resumen] = await pool.query(`SELECT * FROM prod_postura_resumen_anual ORDER BY anio DESC`);
    console.log(JSON.stringify(resumen, null, 2));
    
    console.log('\n--- Tabla: prod_postura_flujo ---');
    const [flujo] = await pool.query(`SELECT * FROM prod_postura_flujo ORDER BY anio DESC`);
    console.log(JSON.stringify(flujo, null, 2));
    
    console.log('\n--- Tabla: prod_zootecnia_huevo ---');
    const [zootecnia] = await pool.query(`SELECT * FROM prod_zootecnia_huevo ORDER BY anio DESC`);
    console.log(JSON.stringify(zootecnia, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

verificarDatosHuevos();
