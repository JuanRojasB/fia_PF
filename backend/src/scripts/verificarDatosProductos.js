require('dotenv').config();
const mysql = require('mysql2/promise');

async function verificarDatosProductos() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'erp_pollo_fiesta'
    });

    console.log('✅ Conectado a la base de datos\n');

    // Ver TODOS los datos de com_sede3_ventas_detalle
    const [ventas] = await connection.query(`
      SELECT * FROM com_sede3_ventas_detalle 
      ORDER BY anio DESC, kilos_vendidos DESC
    `);
    
    console.log('📊 TODOS LOS DATOS DE COM_SEDE3_VENTAS_DETALLE:');
    console.table(ventas);

    // Calcular totales por año
    const totales2025 = ventas
      .filter(v => v.anio === 2025)
      .reduce((acc, v) => {
        acc.kilos += parseFloat(v.kilos_vendidos);
        acc.ingresos += parseFloat(v.kilos_vendidos) * parseFloat(v.precio_promedio);
        return acc;
      }, { kilos: 0, ingresos: 0 });

    const totales2024 = ventas
      .filter(v => v.anio === 2024)
      .reduce((acc, v) => {
        acc.kilos += parseFloat(v.kilos_vendidos);
        acc.ingresos += parseFloat(v.kilos_vendidos) * parseFloat(v.precio_promedio);
        return acc;
      }, { kilos: 0, ingresos: 0 });

    console.log('\n📊 TOTALES CALCULADOS:');
    console.log('2025:');
    console.log('  Kilos:', totales2025.kilos.toLocaleString('es-CO'));
    console.log('  Ingresos:', totales2025.ingresos.toLocaleString('es-CO'));
    console.log('  Precio Promedio:', (totales2025.ingresos / totales2025.kilos).toFixed(2));
    
    console.log('\n2024:');
    console.log('  Kilos:', totales2024.kilos.toLocaleString('es-CO'));
    console.log('  Ingresos:', totales2024.ingresos.toLocaleString('es-CO'));
    console.log('  Precio Promedio:', (totales2024.ingresos / totales2024.kilos).toFixed(2));

    console.log('\n📊 VARIACIONES:');
    const varKilos = ((totales2025.kilos - totales2024.kilos) / totales2024.kilos * 100).toFixed(2);
    const varIngresos = ((totales2025.ingresos - totales2024.ingresos) / totales2024.ingresos * 100).toFixed(2);
    console.log('  Variación Kilos:', varKilos + '%');
    console.log('  Variación Ingresos:', varIngresos + '%');

    // Ver datos por línea
    console.log('\n📊 DATOS POR LÍNEA:');
    const lineas = {};
    ventas.forEach(v => {
      const key = `${v.anio}-${v.nombre_linea}`;
      if (!lineas[key]) {
        lineas[key] = {
          anio: v.anio,
          linea: v.nombre_linea,
          kilos: 0,
          ingresos: 0
        };
      }
      lineas[key].kilos += parseFloat(v.kilos_vendidos);
      lineas[key].ingresos += parseFloat(v.kilos_vendidos) * parseFloat(v.precio_promedio);
    });

    Object.values(lineas).forEach(l => {
      console.log(`${l.anio} - ${l.linea}:`);
      console.log(`  Kilos: ${l.kilos.toLocaleString('es-CO')}`);
      console.log(`  Ingresos: ${l.ingresos.toLocaleString('es-CO')}`);
      console.log(`  Precio: ${(l.ingresos / l.kilos).toFixed(2)}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

verificarDatosProductos();
