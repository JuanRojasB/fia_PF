require('dotenv').config();
const mysql = require('mysql2/promise');

async function consultarVentasPieCanal() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'erp_pollo_fiesta'
    });

    console.log('✅ Conectado a la base de datos\n');

    // Consultar ventas pie/canal
    const [ventasPieCanal] = await connection.query(`
      SELECT 
        v.anio,
        c.nombre_categoria,
        v.kilos_vendidos,
        v.ingresos_pesos,
        (v.ingresos_pesos / v.kilos_vendidos) as precio_promedio_kg
      FROM com_ventas_pie_canal v
      LEFT JOIN com_categorias c ON v.id_categoria = c.id_categoria
      ORDER BY v.anio DESC, v.kilos_vendidos DESC
    `);

    console.log('📊 VENTAS PIE/CANAL:');
    console.log('Total registros:', ventasPieCanal.length);
    console.table(ventasPieCanal);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

consultarVentasPieCanal();
