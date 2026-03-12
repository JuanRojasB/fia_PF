const mysql = require('mysql2/promise');

async function verificarDatosMerma() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'erp_pollo_fiesta'
  });

  try {
    console.log('\n=== VERIFICANDO DATOS DE MERMA ===\n');

    // Buscar tablas relacionadas con merma
    const [tablesMerma] = await connection.query(`
      SHOW TABLES LIKE '%merma%'
    `);
    
    console.log('--- Tablas relacionadas con merma ---');
    console.log(tablesMerma);

    // Ver tabla log_control_mermas
    console.log('\n--- Datos de log_control_mermas ---');
    const [mermas] = await connection.query(`
      SELECT * FROM log_control_mermas ORDER BY anio DESC, sede
    `);
    console.table(mermas);

    // Ver vista de cumplimiento 2025
    console.log('\n--- Vista cumplimiento mermas 2025 ---');
    try {
      const [cumplimiento] = await connection.query(`
        SELECT * FROM vista_log_cumplimiento_mermas_2025
      `);
      console.table(cumplimiento);
    } catch (error) {
      console.log('Vista no existe:', error.message);
    }

    // Buscar datos mensuales de merma
    console.log('\n--- Buscando datos mensuales ---');
    const [tablesLog] = await connection.query(`
      SHOW TABLES LIKE 'log_%'
    `);
    console.log('Tablas log encontradas:');
    tablesLog.forEach(t => console.log('  -', Object.values(t)[0]));

    // Verificar si hay datos mensuales por sede
    console.log('\n--- Verificando estructura de tablas ---');
    for (const table of tablesLog) {
      const tableName = Object.values(table)[0];
      if (tableName.includes('merma')) {
        console.log(`\nTabla: ${tableName}`);
        const [structure] = await connection.query(`DESCRIBE ${tableName}`);
        console.table(structure.map(s => ({ Field: s.Field, Type: s.Type })));
        
        const [sample] = await connection.query(`SELECT * FROM ${tableName} LIMIT 3`);
        console.log('Muestra de datos:');
        console.table(sample);
      }
    }

    // Calcular promedios por sede
    console.log('\n--- Análisis de mermas por sede ---');
    const sedes = ['General', 'Sede 1', 'Sede 2', 'Sede 3'];
    
    for (const sede of sedes) {
      const sedeData = mermas.filter(m => m.sede === sede);
      if (sedeData.length > 0) {
        console.log(`\n${sede}:`);
        sedeData.forEach(d => {
          console.log(`  ${d.anio}: Real ${d.porcentaje_merma_real}% | Meta ${d.porcentaje_meta}% | Brecha: ${(parseFloat(d.porcentaje_merma_real) - parseFloat(d.porcentaje_meta)).toFixed(2)}%`);
        });
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

verificarDatosMerma();
