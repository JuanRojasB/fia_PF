const mysql = require('mysql2/promise');

async function verificarDatosHuevo() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'erp_pollo_fiesta'
  });

  try {
    console.log('\n=== VERIFICANDO DATOS DE VENTAS DE HUEVO ===\n');

    // Ver tabla com_ventas_huevo
    const [ventasHuevo] = await connection.query(`
      SELECT * FROM com_ventas_huevo ORDER BY anio DESC
    `);
    
    console.log('--- Datos de com_ventas_huevo ---');
    console.table(ventasHuevo);

    // Verificar si hay más tablas relacionadas con huevo
    const [tablesHuevo] = await connection.query(`
      SHOW TABLES LIKE '%huevo%'
    `);
    
    console.log('\n--- Tablas relacionadas con huevo ---');
    console.log(tablesHuevo);

    // Calcular totales y variaciones
    console.log('\n--- Análisis de datos ---');
    ventasHuevo.forEach(v => {
      const ingresos = parseFloat(v.ingresos_totales_calculados);
      const utilidad = parseFloat(v.utilidad_neta_millones) * 1000000;
      const margen = parseFloat(v.margen_neto_pct);
      
      console.log(`\nAño ${v.anio}:`);
      console.log(`  Unidades: ${parseInt(v.unidades_vendidas).toLocaleString('es-CO')}`);
      console.log(`  Precio promedio: $${parseInt(v.precio_promedio_unidad).toLocaleString('es-CO')}`);
      console.log(`  Ingresos: $${parseInt(ingresos).toLocaleString('es-CO')}`);
      console.log(`  Utilidad neta: $${parseInt(utilidad).toLocaleString('es-CO')}`);
      console.log(`  Margen neto: ${margen}%`);
    });

    // Calcular variaciones
    if (ventasHuevo.length >= 2) {
      const datos2025 = ventasHuevo.find(v => v.anio === 2025);
      const datos2024 = ventasHuevo.find(v => v.anio === 2024);
      const datos2023 = ventasHuevo.find(v => v.anio === 2023);

      if (datos2025 && datos2024) {
        const varUnidades = ((datos2025.unidades_vendidas - datos2024.unidades_vendidas) / datos2024.unidades_vendidas * 100).toFixed(2);
        const varPrecio = ((datos2025.precio_promedio_unidad - datos2024.precio_promedio_unidad) / datos2024.precio_promedio_unidad * 100).toFixed(2);
        
        console.log('\n--- Variación 2025 vs 2024 ---');
        console.log(`  Unidades: ${varUnidades}%`);
        console.log(`  Precio: ${varPrecio}%`);
      }

      if (datos2025 && datos2023) {
        const varPrecio3años = ((datos2025.precio_promedio_unidad - datos2023.precio_promedio_unidad) / datos2023.precio_promedio_unidad * 100).toFixed(2);
        console.log(`\n--- Variación precio 2025 vs 2023 (3 años) ---`);
        console.log(`  Precio: ${varPrecio3años}%`);
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

verificarDatosHuevo();
