const mysql = require('mysql2/promise');

async function listVistas() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'erp_pollo_fiesta'
  });

  console.log('\n=== VISTAS COMERCIALES (vista_com_*) ===\n');
  
  const [vistas] = await conn.query("SHOW FULL TABLES WHERE Table_type = 'VIEW' AND Tables_in_erp_pollo_fiesta LIKE 'vista_com_%'");
  
  if (vistas.length === 0) {
    console.log('⚠️  No se encontraron vistas comerciales');
  } else {
    vistas.forEach(vista => {
      console.log(`✅ ${Object.values(vista)[0]}`);
    });
  }

  await conn.end();
}

listVistas().catch(console.error);
