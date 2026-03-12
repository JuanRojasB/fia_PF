const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function ejecutarScriptSQL() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'erp_pollo_fiesta',
    multipleStatements: true
  });

  try {
    console.log('\n=== EJECUTANDO SCRIPT DE ASADERO ===\n');

    // Leer el archivo SQL
    const sqlFile = path.join(__dirname, 'insertarDatosAsadero.sql');
    const sqlScript = fs.readFileSync(sqlFile, 'utf8');

    // Ejecutar el script completo
    await connection.query(sqlScript);
    
    console.log('✅ Script ejecutado exitosamente!\n');

    // Verificar los datos insertados
    console.log('--- Verificando datos insertados ---\n');
    
    const [rows] = await connection.query(`
      SELECT 
        anio,
        estado_conservacion,
        COUNT(*) as num_lineas,
        SUM(kilos_vendidos) as total_kilos,
        SUM(kilos_vendidos * precio_promedio) as total_ingresos
      FROM com_sede1_ventas_detalle
      GROUP BY anio, estado_conservacion
      ORDER BY anio DESC, estado_conservacion
    `);
    
    console.table(rows);

    // Total general
    const [totales] = await connection.query(`
      SELECT 
        anio,
        SUM(kilos_vendidos) as total_kilos,
        SUM(kilos_vendidos * precio_promedio) as total_ingresos
      FROM com_sede1_ventas_detalle
      GROUP BY anio
      ORDER BY anio DESC
    `);
    
    console.log('\n--- Totales Generales ---\n');
    console.table(totales);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

ejecutarScriptSQL();
