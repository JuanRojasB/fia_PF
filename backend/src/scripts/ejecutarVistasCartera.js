const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function ejecutarVistasCartera() {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'erp_pollo_fiesta',
    waitForConnections: true,
    connectionLimit: 10,
    multipleStatements: true
  });
  
  try {
    console.log('\n🔧 CREANDO VISTAS DE CARTERA\n');
    
    const sqlFile = path.join(__dirname, 'crearVistasCartera.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    await pool.query(sql);
    
    console.log('✅ Vistas creadas exitosamente\n');
    
    // Verificar las vistas
    console.log('📊 Verificando vista_fin_exposicion_cartera_25_vs_24:');
    const [exposicion] = await pool.query('SELECT * FROM vista_fin_exposicion_cartera_25_vs_24 LIMIT 3');
    console.table(exposicion);
    
    console.log('\n📊 Verificando vista_fin_mix_ventas_2025:');
    const [mix] = await pool.query('SELECT * FROM vista_fin_mix_ventas_2025 LIMIT 3');
    console.table(mix);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

ejecutarVistasCartera();
