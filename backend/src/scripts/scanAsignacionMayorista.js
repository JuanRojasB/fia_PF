require('dotenv').config();
const { getInstance } = require('../infrastructure/database/connection');

async function scanAsignacionMayorista() {
  const db = getInstance();
  await db.connect();
  const pool = db.getPool();
  
  try {
    console.log('=== ESCANEANDO BASE DE DATOS: ASIGNACIÓN MAYORISTA ===\n');

    // 1. Buscar tablas que contengan "mayorista" o "asignacion"
    console.log('1. BUSCANDO TABLAS RELACIONADAS...');
    const [tables] = await pool.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = 'erp_pollo_fiesta' 
      AND (TABLE_NAME LIKE '%mayorista%' 
           OR TABLE_NAME LIKE '%asignacion%'
           OR TABLE_NAME LIKE '%comercial%'
           OR TABLE_NAME LIKE '%venta%')
      ORDER BY TABLE_NAME
    `);
    console.log('Tablas encontradas:', tables.map(t => t.TABLE_NAME));
    console.log('');

    // 2. Buscar vistas relacionadas
    console.log('2. BUSCANDO VISTAS RELACIONADAS...');
    const [views] = await pool.query(`
      SELECT TABLE_NAME 
      FROM information_schema.VIEWS 
      WHERE TABLE_SCHEMA = 'erp_pollo_fiesta' 
      AND (TABLE_NAME LIKE '%mayorista%' 
           OR TABLE_NAME LIKE '%asignacion%'
           OR TABLE_NAME LIKE '%comercial%'
           OR TABLE_NAME LIKE '%com_%')
      ORDER BY TABLE_NAME
    `);
    console.log('Vistas encontradas:', views.map(v => v.TABLE_NAME));
    console.log('');

    // 3. Consultar tablas comerciales encontradas
    console.log('3. CONSULTANDO TABLAS COMERCIALES...');
    
    // Consultar com_sede3_ventas_detalle
    console.log('\n3.1 Tabla: com_sede3_ventas_detalle');
    const [sede3Data] = await pool.query(`
      SELECT * FROM com_sede3_ventas_detalle LIMIT 5
    `);
    console.log('Muestra de datos:', JSON.stringify(sede3Data, null, 2));
    
    // Ver columnas
    const [sede3Cols] = await pool.query(`
      SELECT COLUMN_NAME FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = 'erp_pollo_fiesta' AND TABLE_NAME = 'com_sede3_ventas_detalle'
    `);
    console.log('Columnas:', sede3Cols.map(c => c.COLUMN_NAME).join(', '));

    // 4. Consultar com_ventas_pie_canal
    console.log('\n4. Tabla: com_ventas_pie_canal');
    const [pieCanal] = await pool.query(`
      SELECT * FROM com_ventas_pie_canal WHERE anio IN (2024, 2025) LIMIT 10
    `);
    console.log('Datos:', JSON.stringify(pieCanal, null, 2));

    // 5. Buscar datos de asignación mayorista en las tablas
    console.log('\n5. BUSCANDO DATOS DE ASIGNACIÓN MAYORISTA...');
    
    // Intentar en com_pdv_ventas_zonales
    const [pdvData] = await pool.query(`
      SELECT * FROM com_pdv_ventas_zonales LIMIT 5
    `);
    console.log('com_pdv_ventas_zonales:', JSON.stringify(pdvData, null, 2));
    
    // Ver todas las columnas de todas las tablas comerciales
    console.log('\n6. ESTRUCTURA DE TODAS LAS TABLAS COMERCIALES:');
    for (const table of tables) {
      const [cols] = await pool.query(`
        SELECT COLUMN_NAME, DATA_TYPE 
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = 'erp_pollo_fiesta' AND TABLE_NAME = ?
        ORDER BY ORDINAL_POSITION
      `, [table.TABLE_NAME]);
      console.log(`\n${table.TABLE_NAME}:`);
      console.log(cols.map(c => `  - ${c.COLUMN_NAME} (${c.DATA_TYPE})`).join('\n'));
    }

  } catch (error) {
    console.error('Error escaneando base de datos:', error);
  } finally {
    const db = getInstance();
    await db.close();
    process.exit(0);
  }
}

scanAsignacionMayorista();
