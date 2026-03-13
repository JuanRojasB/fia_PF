const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config({ path: 'backend/.env' });

async function actualizarPolloEntregado2025() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'erp_pollo_fiesta',
      multipleStatements: true
    });

    console.log('✓ Conectado a la base de datos');
    console.log('\n=== ACTUALIZANDO DATOS POLLO ENTREGADO 2025 ===\n');
    
    const sql = fs.readFileSync('backend/src/scripts/insertarPolloEntregado2025.sql', 'utf8');
    const [results] = await connection.query(sql);
    
    console.log('✓ Datos actualizados correctamente\n');
    
    // Verificar los datos actualizados
    console.log('=== VERIFICACIÓN DE DATOS 2024 Y 2025 ===\n');
    const [data] = await connection.query(`
      SELECT 
        anio,
        programado,
        real_granjas,
        comprado,
        total,
        var_pct,
        var_unidades_reportada
      FROM prod_pollo_entregado_anual
      WHERE anio IN (2024, 2025)
      ORDER BY anio DESC
    `);
    
    console.table(data);
    
    // Calcular y mostrar la variación
    if (data.length === 2) {
      const datos2025 = data[0];
      const datos2024 = data[1];
      const variacionCalculada = ((datos2025.total - datos2024.total) / datos2024.total * 100).toFixed(1);
      const diferenciaUnidades = datos2025.total - datos2024.total;
      
      console.log('\n=== VALIDACIÓN DE CÁLCULOS ===');
      console.log(`Total 2025: ${datos2025.total.toLocaleString('es-CO')}`);
      console.log(`Total 2024: ${datos2024.total.toLocaleString('es-CO')}`);
      console.log(`Diferencia: ${diferenciaUnidades.toLocaleString('es-CO')} pollos`);
      console.log(`Variación calculada: ${variacionCalculada}%`);
      console.log(`Variación en BD: ${datos2025.var_pct}%`);
      console.log(`✓ Variación ${variacionCalculada === datos2025.var_pct.toString() ? 'CORRECTA' : 'REVISAR'}`);
    }
    
  } catch (error) {
    console.error('✗ Error:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✓ Conexión cerrada');
    }
  }
}

actualizarPolloEntregado2025();
