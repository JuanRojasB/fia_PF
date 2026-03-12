require('dotenv').config();
const mysql = require('mysql2/promise');

async function verificarTablaCompleta() {
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
    console.log(`Total de registros: ${ventas.length}\n`);
    console.table(ventas);

    // Verificar si existe la línea 125 - MAYORISTA
    const mayorista = ventas.filter(v => 
      v.codigo_linea === 125 || 
      v.nombre_linea?.toLowerCase().includes('mayorista') ||
      v.nombre_linea?.includes('470') ||
      v.nombre_linea?.includes('471') ||
      v.nombre_linea?.includes('472')
    );
    
    console.log('\n🔍 LÍNEAS DE MAYORISTA ENCONTRADAS:');
    console.table(mayorista);

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
    
    console.log('\n2024:');
    console.log('  Kilos:', totales2024.kilos.toLocaleString('es-CO'));
    console.log('  Ingresos:', totales2024.ingresos.toLocaleString('es-CO'));

    console.log('\n📊 VARIACIONES:');
    const varKilos = ((totales2025.kilos - totales2024.kilos) / totales2024.kilos * 100).toFixed(2);
    const varIngresos = ((totales2025.ingresos - totales2024.ingresos) / totales2024.ingresos * 100).toFixed(2);
    console.log('  Variación Kilos:', varKilos + '%');
    console.log('  Variación Ingresos:', varIngresos + '%');

    // Ver datos por línea
    console.log('\n📊 RESUMEN POR LÍNEA:');
    const lineas = {};
    ventas.forEach(v => {
      const key = `${v.codigo_linea}-${v.nombre_linea}`;
      if (!lineas[key]) {
        lineas[key] = {
          codigo: v.codigo_linea,
          linea: v.nombre_linea,
          kilos2025: 0,
          kilos2024: 0
        };
      }
      if (v.anio === 2025) {
        lineas[key].kilos2025 += parseFloat(v.kilos_vendidos);
      } else if (v.anio === 2024) {
        lineas[key].kilos2024 += parseFloat(v.kilos_vendidos);
      }
    });

    console.table(Object.values(lineas).map(l => ({
      codigo: l.codigo,
      linea: l.linea,
      kilos2025: l.kilos2025.toLocaleString('es-CO'),
      kilos2024: l.kilos2024.toLocaleString('es-CO'),
      variacion: l.kilos2024 > 0 ? (((l.kilos2025 - l.kilos2024) / l.kilos2024) * 100).toFixed(2) + '%' : 'N/A'
    })));

    // Verificar si el total coincide con 56.356.508
    console.log('\n🎯 VERIFICACIÓN:');
    console.log('Total esperado: 56.356.508 kg');
    console.log('Total calculado:', totales2025.kilos.toLocaleString('es-CO'), 'kg');
    console.log('¿Coincide?', Math.abs(totales2025.kilos - 56356508) < 1000 ? '✅ SÍ' : '❌ NO');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

verificarTablaCompleta();
