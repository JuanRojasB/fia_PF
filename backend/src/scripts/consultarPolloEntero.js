require('dotenv').config();
const mysql = require('mysql2/promise');

async function consultarPolloEntero() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'erp_pollo_fiesta'
    });

    console.log('✅ Conectado a la base de datos\n');

    // Buscar tablas relacionadas con pollo entero
    const [tables] = await connection.query(`
      SHOW TABLES LIKE '%pollo%'
    `);
    
    console.log('📊 TABLAS CON "POLLO":');
    console.table(tables);

    // Buscar en com_objetivo_pollo_entero
    const [objetivos] = await connection.query(`
      SELECT * FROM com_objetivo_pollo_entero ORDER BY anio DESC
    `);
    
    console.log('\n📊 COM_OBJETIVO_POLLO_ENTERO:');
    console.table(objetivos);

    // Buscar en vista_com_kpi_pollo_entero
    const [kpis] = await connection.query(`
      SELECT * FROM vista_com_kpi_pollo_entero ORDER BY anio DESC
    `);
    
    console.log('\n📊 VISTA_COM_KPI_POLLO_ENTERO:');
    console.table(kpis);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

consultarPolloEntero();
