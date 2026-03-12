require('dotenv').config();
const mysql = require('mysql2/promise');

async function buscarDatosCompletos() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'erp_pollo_fiesta'
    });

    console.log('✅ Conectado a la base de datos\n');

    // Buscar tablas con "mayorista" o "470"
    const [allTables] = await connection.query(`SHOW TABLES`);
    console.log('🔍 Buscando tablas con datos de mayorista...\n');

    // Buscar en todas las tablas que empiezan con "com_"
    const [tablesCom] = await connection.query(`SHOW TABLES LIKE 'com_%'`);
    
    for (const table of tablesCom) {
      const tableName = Object.values(table)[0];
      try {
        const [columns] = await connection.query(`SHOW COLUMNS FROM ${tableName}`);
        const hasKilos = columns.some(col => col.Field.toLowerCase().includes('kilo'));
        const hasAnio = columns.some(col => col.Field.toLowerCase().includes('anio'));
        
        if (hasKilos && hasAnio) {
          console.log(`\n📊 Tabla: ${tableName}`);
          const [sample] = await connection.query(`SELECT * FROM ${tableName} WHERE anio IN (2024, 2025) LIMIT 5`);
          if (sample.length > 0) {
            console.table(sample);
            
            // Calcular totales
            const [totales] = await connection.query(`
              SELECT 
                anio,
                SUM(CASE 
                  WHEN CAST(REPLACE(REPLACE(REPLACE(kilos_vendidos, ',', ''), '.', ''), ' ', '') AS DECIMAL(20,2)) > 0 
                  THEN CAST(REPLACE(REPLACE(REPLACE(kilos_vendidos, ',', ''), '.', ''), ' ', '') AS DECIMAL(20,2))
                  ELSE kilos_vendidos 
                END) as total_kilos
              FROM ${tableName}
              WHERE anio IN (2024, 2025)
              GROUP BY anio
              ORDER BY anio DESC
            `);
            console.log('Totales por año:');
            console.table(totales);
          }
        }
      } catch (err) {
        // Ignorar errores
      }
    }

    // Buscar específicamente datos que sumen cerca de 56 millones
    console.log('\n🔍 Buscando tabla con total ~56 millones de kilos...\n');
    
    // Probar con vista_com_analisis_ventas
    try {
      const [vista] = await connection.query(`SELECT * FROM vista_com_analisis_ventas ORDER BY anio DESC`);
      console.log('\n📊 VISTA_COM_ANALISIS_VENTAS:');
      console.table(vista);
      
      const total2025 = vista.filter(v => v.anio === 2025).reduce((sum, v) => sum + parseFloat(v.kilos_vendidos || 0), 0);
      const total2024 = vista.filter(v => v.anio === 2024).reduce((sum, v) => sum + parseFloat(v.kilos_vendidos || 0), 0);
      console.log('\nTotales:');
      console.log('2025:', total2025.toLocaleString('es-CO'));
      console.log('2024:', total2024.toLocaleString('es-CO'));
    } catch (err) {
      console.log('Vista no encontrada');
    }

    // Buscar en com_ventas_pie_canal
    try {
      const [pieCanal] = await connection.query(`
        SELECT 
          v.*,
          c.nombre_categoria
        FROM com_ventas_pie_canal v
        LEFT JOIN com_categorias c ON v.id_categoria = c.id_categoria
        ORDER BY anio DESC
      `);
      console.log('\n📊 COM_VENTAS_PIE_CANAL:');
      console.table(pieCanal);
      
      const total2025 = pieCanal.filter(v => v.anio === 2025).reduce((sum, v) => sum + parseFloat(v.kilos_vendidos || 0), 0);
      const total2024 = pieCanal.filter(v => v.anio === 2024).reduce((sum, v) => sum + parseFloat(v.kilos_vendidos || 0), 0);
      console.log('\nTotales:');
      console.log('2025:', total2025.toLocaleString('es-CO'));
      console.log('2024:', total2024.toLocaleString('es-CO'));
    } catch (err) {
      console.log('Tabla no encontrada');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

buscarDatosCompletos();
