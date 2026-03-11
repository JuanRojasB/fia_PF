const mysql = require('mysql2/promise');

async function listComTables() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'erp_pollo_fiesta'
  });

  console.log('\n=== TABLAS COMERCIALES (com_*) ===\n');
  
  const [tables] = await conn.query("SHOW TABLES LIKE 'com_%'");
  
  for (const tableRow of tables) {
    const tableName = Object.values(tableRow)[0];
    console.log(`\n📊 ${tableName}`);
    
    // Obtener estructura
    const [columns] = await conn.query(`DESCRIBE ${tableName}`);
    console.log('Columnas:');
    columns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });
    
    // Contar registros
    const [count] = await conn.query(`SELECT COUNT(*) as total FROM ${tableName}`);
    console.log(`Total registros: ${count[0].total}`);
    
    // Mostrar 2 registros de ejemplo
    if (count[0].total > 0) {
      const [sample] = await conn.query(`SELECT * FROM ${tableName} LIMIT 2`);
      console.log('Ejemplo de datos:');
      console.log(JSON.stringify(sample, null, 2));
    }
  }

  await conn.end();
}

listComTables().catch(console.error);
