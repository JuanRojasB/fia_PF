const mysql = require('mysql2/promise');

async function buscarTablasCom() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'erp_pollo_fiesta'
  });

  try {
    console.log('\n=== TODAS LAS TABLAS COM ===\n');

    const [tables] = await connection.query(`
      SHOW TABLES LIKE 'com_%'
    `);
    
    console.log('Tablas encontradas:');
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      console.log(`\n--- ${tableName} ---`);
      
      // Ver estructura
      const [structure] = await connection.query(`DESCRIBE ${tableName}`);
      console.log('Columnas:', structure.map(c => c.Field).join(', '));
      
      // Contar registros
      const [count] = await connection.query(`SELECT COUNT(*) as total FROM ${tableName}`);
      console.log('Total registros:', count[0].total);
      
      // Ver una muestra
      const [sample] = await connection.query(`SELECT * FROM ${tableName} LIMIT 2`);
      console.log('Muestra:', JSON.stringify(sample, null, 2));
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

buscarTablasCom();
