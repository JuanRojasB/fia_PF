const { getInstance } = require('../infrastructure/database/connection');
const fs = require('fs');
const path = require('path');

async function insertGestionLogisticaData() {
  const db = getInstance();
  const pool = db.getPool();
  
  try {
    console.log('🚀 Iniciando inserción de datos de Gestión Logística...\n');
    
    // Leer el archivo SQL
    const sqlFile = path.join(__dirname, 'insertGestionLogisticaData.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Dividir por punto y coma y ejecutar cada statement
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.toLowerCase().includes('select')) {
        const [rows] = await pool.query(statement);
        console.log('\n📊 Resultado de consulta:');
        console.table(rows);
      } else {
        await pool.query(statement);
      }
    }
    
    console.log('\n✅ Datos de Gestión Logística insertados correctamente');
    
    // Verificar totales
    const [totales] = await pool.query(`
      SELECT 
        'CONSOLIDADO' as descripcion,
        COUNT(*) as total_registros,
        COUNT(DISTINCT sede) as total_sedes,
        COUNT(DISTINCT concepto) as total_conceptos,
        SUM(total_2024) as suma_2024,
        SUM(total_2025) as suma_2025,
        ROUND(((SUM(total_2025) - SUM(total_2024)) / SUM(total_2024) * 100), 2) as variacion_pct
      FROM gestion_logistica
    `);
    
    console.log('\n📈 Resumen de datos insertados:');
    console.table(totales);
    
  } catch (error) {
    console.error('❌ Error al insertar datos:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  insertGestionLogisticaData()
    .then(() => {
      console.log('\n✨ Proceso completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error en el proceso:', error);
      process.exit(1);
    });
}

module.exports = { insertGestionLogisticaData };
