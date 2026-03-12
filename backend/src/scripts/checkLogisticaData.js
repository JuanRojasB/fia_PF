const { getInstance } = require('../infrastructure/database/connection');

async function checkLogisticaData() {
  const db = getInstance();
  await db.connect();
  const pool = db.getPool();
  
  try {
    console.log('🔍 Verificando datos de logística...\n');
    
    // Verificar tabla log_gastos_operacionales
    const [gastos] = await pool.query(`
      SELECT 
        g.id_gasto,
        g.id_sede,
        g.anio,
        g.concepto_gasto,
        g.valor_pesos
      FROM log_gastos_operacionales g
      LIMIT 10
    `);
    
    console.log('📊 Registros en log_gastos_operacionales:', gastos.length);
    if (gastos.length > 0) {
      console.log('\n📋 Primeros registros:');
      gastos.forEach((g, i) => {
        console.log(`  ${i + 1}. Sede ${g.id_sede}, Año ${g.anio}, Concepto: ${g.concepto_gasto}, Valor: ${g.valor_pesos}`);
      });
    }
    
    // Verificar tabla log_sedes_operacion
    const [sedes] = await pool.query('SELECT * FROM log_sedes_operacion');
    console.log('\n📍 Sedes en log_sedes_operacion:', sedes.length);
    if (sedes.length > 0) {
      console.log('\n📋 Sedes:');
      sedes.forEach(s => {
        console.log(`  - ID: ${s.id_sede}, Nombre: ${s.nombre_sede}, Director: ${s.director_encargado}`);
      });
    }
    
    // Verificar JOIN
    const [joined] = await pool.query(`
      SELECT 
        s.nombre_sede as sede,
        g.anio,
        g.concepto_gasto as concepto,
        g.valor_pesos as valor
      FROM log_gastos_operacionales g
      INNER JOIN log_sedes_operacion s ON g.id_sede = s.id_sede
      LIMIT 10
    `);
    
    console.log('\n🔗 Registros con JOIN:', joined.length);
    if (joined.length > 0) {
      console.log('\n📋 Datos con JOIN:');
      joined.forEach((j, i) => {
        console.log(`  ${i + 1}. ${j.sede}, Año ${j.anio}, ${j.concepto}: $${j.valor}`);
      });
    }
    
    // Contar por sede y año
    const [counts] = await pool.query(`
      SELECT 
        s.nombre_sede,
        g.anio,
        COUNT(*) as cantidad
      FROM log_gastos_operacionales g
      INNER JOIN log_sedes_operacion s ON g.id_sede = s.id_sede
      GROUP BY s.nombre_sede, g.anio
      ORDER BY s.nombre_sede, g.anio
    `);
    
    console.log('\n📊 Conteo por sede y año:');
    counts.forEach(c => {
      console.log(`  ${c.nombre_sede} - ${c.anio}: ${c.cantidad} registros`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkLogisticaData();
