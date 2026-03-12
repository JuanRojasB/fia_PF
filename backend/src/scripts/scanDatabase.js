/**
 * Script para escanear la estructura de la base de datos
 */

require('dotenv').config();
const { getInstance } = require('../infrastructure/database/connection');

async function scanDatabase() {
  const db = getInstance();
  
  try {
    await db.connect();
    const pool = db.getPool();
    
    console.log('🔍 Escaneando base de datos...\n');
    
    // Obtener todas las tablas
    const [tables] = await pool.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
      ORDER BY TABLE_NAME
    `);
    
    console.log(`📊 Tablas encontradas: ${tables.length}\n`);
    
    // Para cada tabla, obtener sus columnas
    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      console.log(`\n📋 Tabla: ${tableName}`);
      console.log('─'.repeat(80));
      
      const [columns] = await pool.query(`
        SELECT 
          COLUMN_NAME,
          DATA_TYPE,
          CHARACTER_MAXIMUM_LENGTH,
          IS_NULLABLE,
          COLUMN_KEY,
          COLUMN_DEFAULT,
          EXTRA
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = ?
        ORDER BY ORDINAL_POSITION
      `, [tableName]);
      
      console.log('Columnas:');
      columns.forEach(col => {
        const type = col.CHARACTER_MAXIMUM_LENGTH 
          ? `${col.DATA_TYPE}(${col.CHARACTER_MAXIMUM_LENGTH})`
          : col.DATA_TYPE;
        const nullable = col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL';
        const key = col.COLUMN_KEY ? ` [${col.COLUMN_KEY}]` : '';
        const extra = col.EXTRA ? ` ${col.EXTRA}` : '';
        
        console.log(`  - ${col.COLUMN_NAME}: ${type} ${nullable}${key}${extra}`);
      });
      
      // Contar registros
      const [count] = await pool.query(`SELECT COUNT(*) as total FROM ${tableName}`);
      console.log(`\n📈 Total de registros: ${count[0].total}`);
      
      // Mostrar algunos datos de ejemplo
      if (count[0].total > 0) {
        const [sample] = await pool.query(`SELECT * FROM ${tableName} LIMIT 3`);
        console.log('\n📝 Datos de ejemplo:');
        sample.forEach((row, idx) => {
          console.log(`\n  Registro ${idx + 1}:`);
          Object.entries(row).forEach(([key, value]) => {
            if (key !== 'created_at' && key !== 'updated_at' && key !== 'id') {
              const displayValue = value === null ? 'NULL' : 
                                  typeof value === 'string' && value.length > 50 ? 
                                  value.substring(0, 50) + '...' : value;
              console.log(`    ${key}: ${displayValue}`);
            }
          });
        });
      }
    }
    
    console.log('\n\n✅ Escaneo completado');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.close();
    process.exit(0);
  }
}

scanDatabase();
