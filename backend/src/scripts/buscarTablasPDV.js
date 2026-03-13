const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function buscarTablasPDV() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'erp_pollo_fiesta'
  });

  console.log('\n=== TABLAS CON "PDV" ===');
  const [pdv] = await conn.query("SHOW TABLES LIKE '%pdv%'");
  pdv.forEach(t => console.log('  -', Object.values(t)[0]));

  console.log('\n=== TABLAS CON "SEDE" ===');
  const [sede] = await conn.query("SHOW TABLES LIKE '%sede%'");
  sede.forEach(t => console.log('  -', Object.values(t)[0]));

  console.log('\n=== TABLAS CON "PUNTO" ===');
  const [punto] = await conn.query("SHOW TABLES LIKE '%punto%'");
  punto.forEach(t => console.log('  -', Object.values(t)[0]));

  console.log('\n=== TABLAS CON "VENTA" ===');
  const [venta] = await conn.query("SHOW TABLES LIKE '%venta%'");
  venta.forEach(t => console.log('  -', Object.values(t)[0]));

  console.log('\n=== TABLAS CON "LOCAL" ===');
  const [local] = await conn.query("SHOW TABLES LIKE '%local%'");
  local.forEach(t => console.log('  -', Object.values(t)[0]));

  console.log('\n=== TABLAS COMERCIALES ===');
  const [com] = await conn.query("SHOW TABLES LIKE 'com_%'");
  com.forEach(t => console.log('  -', Object.values(t)[0]));

  await conn.end();
}

buscarTablasPDV().catch(console.error);
