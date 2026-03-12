require('dotenv').config();
const mysql = require('mysql2/promise');

async function consultarVentasCanal() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'erp_pollo_fiesta'
    });

    console.log('✅ Conectado a la base de datos\n');

    // Buscar tablas relacionadas con ventas canal
    const [tables] = await connection.query(`
      SHOW TABLES LIKE '%canal%'
    `);
    
    console.log('📊 TABLAS CON "CANAL":');
    console.table(tables);

    // Buscar en com_sede3_ventas_detalle (tiene líneas de producto)
    const [ventasSede3] = await connection.query(`
      SELECT * FROM com_sede3_ventas_detalle 
      WHERE estado_conservacion = 'Canal'
      ORDER BY anio DESC, kilos_vendidos DESC
      LIMIT 20
    `);
    
    console.log('\n📊 COM_SEDE3_VENTAS_DETALLE (Canal):');
    console.table(ventasSede3);

    // Buscar vista de análisis de ventas
    const [analisisVentas] = await connection.query(`
      SELECT * FROM vista_com_analisis_ventas 
      ORDER BY anio DESC, kilos_vendidos DESC
    `);
    
    console.log('\n📊 VISTA_COM_ANALISIS_VENTAS:');
    console.table(analisisVentas);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

consultarVentasCanal();
