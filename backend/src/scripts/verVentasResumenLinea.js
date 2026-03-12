require('dotenv').config();
const mysql = require('mysql2/promise');

async function verVentasResumenLinea() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'erp_pollo_fiesta'
    });

    console.log('✅ Conectado a la base de datos\n');

    // Ver TODOS los datos de ventas_resumen_linea
    const [data] = await connection.query(`
      SELECT * FROM ventas_resumen_linea 
      ORDER BY kilos_2025 DESC
    `);
    
    console.log('📊 TABLA: ventas_resumen_linea');
    console.log(`Total de registros: ${data.length}\n`);
    console.table(data);

    // Calcular totales
    const total2025 = data.reduce((sum, d) => sum + parseFloat(d.kilos_2025 || 0), 0);
    const total2024 = data.reduce((sum, d) => sum + parseFloat(d.kilos_2024 || 0), 0);
    
    console.log('\n📊 TOTALES:');
    console.log('2025:', total2025.toLocaleString('es-CO'), 'kg');
    console.log('2024:', total2024.toLocaleString('es-CO'), 'kg');
    console.log('Variación:', (((total2025 - total2024) / total2024) * 100).toFixed(2) + '%');
    
    console.log('\n🎯 VERIFICACIÓN:');
    console.log('Total esperado: 56.356.508 kg');
    console.log('Total calculado:', total2025.toLocaleString('es-CO'), 'kg');
    console.log('¿Coincide?', Math.abs(total2025 - 56356508) < 1000 ? '✅ SÍ' : '❌ NO');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

verVentasResumenLinea();
