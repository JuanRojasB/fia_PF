require('dotenv').config();
const mysql = require('mysql2/promise');

async function calcularIngresos() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'erp_pollo_fiesta'
    });

    console.log('✅ Conectado a la base de datos\n');

    // Obtener datos SIN el total general
    const [data] = await connection.query(`
      SELECT * FROM ventas_resumen_linea 
      WHERE codigo_linea != 999
      ORDER BY kilos_2025 DESC
    `);
    
    console.log('📊 DATOS (sin total general):');
    console.table(data);

    // Calcular ingresos 2025
    let ingresos2025 = 0;
    let ingresos2024 = 0;
    
    console.log('\n📊 CÁLCULO DE INGRESOS:');
    data.forEach(d => {
      const ing2025 = parseFloat(d.kilos_2025) * parseFloat(d.precio_promedio_2025);
      const ing2024 = parseFloat(d.kilos_2024) * parseFloat(d.precio_promedio_2024);
      
      console.log(`${d.nombre_linea}:`);
      console.log(`  2025: ${parseFloat(d.kilos_2025).toLocaleString('es-CO')} kg × $${parseFloat(d.precio_promedio_2025).toLocaleString('es-CO')} = $${ing2025.toLocaleString('es-CO')}`);
      console.log(`  2024: ${parseFloat(d.kilos_2024).toLocaleString('es-CO')} kg × $${parseFloat(d.precio_promedio_2024).toLocaleString('es-CO')} = $${ing2024.toLocaleString('es-CO')}`);
      
      ingresos2025 += ing2025;
      ingresos2024 += ing2024;
    });

    console.log('\n📊 TOTALES:');
    console.log('Ingresos 2025:', ingresos2025.toLocaleString('es-CO'));
    console.log('Ingresos 2024:', ingresos2024.toLocaleString('es-CO'));
    
    const varIngresos = ((ingresos2025 - ingresos2024) / ingresos2024 * 100).toFixed(2);
    console.log('Variación:', varIngresos + '%');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

calcularIngresos();
