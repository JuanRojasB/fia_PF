require('dotenv').config();
const mysql = require('mysql2/promise');

async function buscarLineasProducto() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'erp_pollo_fiesta'
    });

    console.log('✅ Conectado a la base de datos\n');

    // Listar TODAS las tablas
    const [allTables] = await connection.query(`SHOW TABLES`);
    console.log('📊 TODAS LAS TABLAS EN LA BD:');
    console.table(allTables);

    // Buscar tablas con "linea" o "producto" o "agrupacion"
    console.log('\n🔍 Buscando tablas con "linea", "producto", "agrupacion"...\n');
    
    const [tablesLinea] = await connection.query(`SHOW TABLES LIKE '%linea%'`);
    console.log('📊 TABLAS CON "LINEA":');
    console.table(tablesLinea);

    const [tablesProducto] = await connection.query(`SHOW TABLES LIKE '%producto%'`);
    console.log('\n📊 TABLAS CON "PRODUCTO":');
    console.table(tablesProducto);

    const [tablesAgrupacion] = await connection.query(`SHOW TABLES LIKE '%agrupacion%'`);
    console.log('\n📊 TABLAS CON "AGRUPACION":');
    console.table(tablesAgrupacion);

    // Buscar en com_sede3_ventas_detalle
    const [sede3] = await connection.query(`
      SELECT * FROM com_sede3_ventas_detalle 
      ORDER BY anio DESC, kilos_vendidos DESC
      LIMIT 10
    `);
    console.log('\n📊 COM_SEDE3_VENTAS_DETALLE (muestra):');
    console.table(sede3);

    // Buscar tablas que empiecen con "com_"
    const [tablesCom] = await connection.query(`SHOW TABLES LIKE 'com_%'`);
    console.log('\n📊 TABLAS QUE EMPIEZAN CON "COM_":');
    console.table(tablesCom);

    // Intentar buscar datos con códigos 100, 102, 105, etc.
    console.log('\n🔍 Buscando datos con códigos de línea (100, 102, 105)...\n');
    
    for (const table of tablesCom) {
      const tableName = Object.values(table)[0];
      try {
        const [columns] = await connection.query(`SHOW COLUMNS FROM ${tableName}`);
        const hasCodigoLinea = columns.some(col => 
          col.Field.toLowerCase().includes('codigo') || 
          col.Field.toLowerCase().includes('linea') ||
          col.Field.toLowerCase().includes('agrupacion')
        );
        
        if (hasCodigoLinea) {
          console.log(`\n✅ Tabla ${tableName} tiene columnas relacionadas:`);
          console.table(columns.map(c => ({ Field: c.Field, Type: c.Type })));
          
          const [sample] = await connection.query(`SELECT * FROM ${tableName} LIMIT 3`);
          console.log(`Muestra de datos:`);
          console.table(sample);
        }
      } catch (err) {
        // Ignorar errores de tablas
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

buscarLineasProducto();
