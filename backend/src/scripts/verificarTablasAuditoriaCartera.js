const mysql = require('mysql2/promise');

async function verificarTablas() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'erp_pollo_fiesta'
  });

  try {
    console.log('\n=== VERIFICANDO TABLAS DE AUDITORÍA ===\n');
    
    const [tablasAud] = await connection.query(`
      SHOW TABLES LIKE 'aud_%'
    `);
    
    console.log('Tablas de Auditoría encontradas:');
    tablasAud.forEach(t => console.log('  -', Object.values(t)[0]));

    console.log('\n=== VERIFICANDO VISTAS DE AUDITORÍA ===\n');
    
    const [vistasAud] = await connection.query(`
      SHOW TABLES LIKE 'vista_aud_%'
    `);
    
    console.log('Vistas de Auditoría encontradas:');
    vistasAud.forEach(t => console.log('  -', Object.values(t)[0]));

    console.log('\n=== VERIFICANDO TABLAS DE CARTERA ===\n');
    
    const [tablasCartera] = await connection.query(`
      SHOW TABLES LIKE '%cartera%'
    `);
    
    console.log('Tablas de Cartera encontradas:');
    tablasCartera.forEach(t => console.log('  -', Object.values(t)[0]));

    console.log('\n=== VERIFICANDO VISTAS FINANCIERAS ===\n');
    
    const [vistasFin] = await connection.query(`
      SHOW TABLES LIKE 'vista_fin_%'
    `);
    
    console.log('Vistas Financieras encontradas:');
    vistasFin.forEach(t => console.log('  -', Object.values(t)[0]));

    // Verificar estructura de tabla aud_auditorias_ejecutadas
    if (tablasAud.length > 0) {
      console.log('\n=== ESTRUCTURA DE aud_auditorias_ejecutadas ===\n');
      const [estructura] = await connection.query(`DESCRIBE aud_auditorias_ejecutadas`);
      console.table(estructura.map(s => ({ Field: s.Field, Type: s.Type })));

      console.log('\n=== MUESTRA DE DATOS ===\n');
      const [muestra] = await connection.query(`SELECT * FROM aud_auditorias_ejecutadas LIMIT 3`);
      console.table(muestra);
    }

    // Verificar tabla com_cartera_clientes
    console.log('\n=== VERIFICANDO com_cartera_clientes ===\n');
    try {
      const [cartera] = await connection.query(`SELECT * FROM com_cartera_clientes LIMIT 3`);
      console.log('Registros encontrados:', cartera.length);
      if (cartera.length > 0) {
        console.table(cartera);
      }
    } catch (error) {
      console.log('Tabla com_cartera_clientes no existe');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

verificarTablas();
