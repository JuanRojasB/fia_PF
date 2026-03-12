require('dotenv').config();
const mysql = require('mysql2/promise');

async function buscarTablaVentasCompleta() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'erp_pollo_fiesta'
    });

    console.log('✅ Conectado a la base de datos\n');

    // Buscar TODAS las tablas que contengan "ventas" o "linea"
    const [allTables] = await connection.query(`SHOW TABLES`);
    const tablesWithVentas = allTables.filter(t => {
      const tableName = Object.values(t)[0].toLowerCase();
      return tableName.includes('ventas') || tableName.includes('linea') || tableName.includes('canal');
    });

    console.log('📊 TABLAS CON "VENTAS", "LINEA" O "CANAL":');
    console.table(tablesWithVentas);

    // Buscar tabla que tenga código 125 o "mayorista"
    console.log('\n🔍 Buscando tabla con línea 125 - MAYORISTA...\n');
    
    for (const table of allTables) {
      const tableName = Object.values(table)[0];
      try {
        const [columns] = await connection.query(`SHOW COLUMNS FROM ${tableName}`);
        const hasCodigoLinea = columns.some(col => col.Field === 'codigo_linea');
        
        if (hasCodigoLinea) {
          const [data] = await connection.query(`SELECT * FROM ${tableName} WHERE codigo_linea = 125 LIMIT 5`);
          if (data.length > 0) {
            console.log(`✅ ENCONTRADO EN: ${tableName}`);
            console.table(data);
            
            // Ver todos los datos de esta tabla
            const [allData] = await connection.query(`SELECT * FROM ${tableName} ORDER BY anio DESC`);
            console.log(`\n📊 TODOS LOS DATOS DE ${tableName}:`);
            console.table(allData);
            
            // Calcular totales
            const total2025 = allData.filter(d => d.anio === 2025).reduce((sum, d) => sum + parseFloat(d.kilos_vendidos || 0), 0);
            const total2024 = allData.filter(d => d.anio === 2024).reduce((sum, d) => sum + parseFloat(d.kilos_vendidos || 0), 0);
            console.log('\n📊 TOTALES:');
            console.log('2025:', total2025.toLocaleString('es-CO'));
            console.log('2024:', total2024.toLocaleString('es-CO'));
          }
        }
      } catch (err) {
        // Ignorar errores
      }
    }

    // Buscar tabla con nombre que incluya "producto" o "agrupacion"
    console.log('\n🔍 Buscando tablas con "producto" o "agrupacion"...\n');
    const [tablesProducto] = await connection.query(`SHOW TABLES LIKE '%producto%'`);
    const [tablesAgrupacion] = await connection.query(`SHOW TABLES LIKE '%agrupacion%'`);
    
    console.log('Tablas con "producto":');
    console.table(tablesProducto);
    console.log('\nTablas con "agrupacion":');
    console.table(tablesAgrupacion);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

buscarTablaVentasCompleta();
