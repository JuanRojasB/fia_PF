require('dotenv').config();
const { getInstance } = require('../infrastructure/database/connection');

async function consultarAsignacionMayorista() {
  const db = getInstance();
  await db.connect();
  const pool = db.getPool();
  
  try {
    console.log('=== ASIGNACIÓN DE POLLO MAYORISTA ===\n');

    // Consultar todas las asignaciones
    const [asignaciones] = await pool.query(`
      SELECT 
        anio,
        centro_operacion,
        unidades
      FROM com_unidades_procesadas
      ORDER BY anio DESC, unidades DESC
    `);

    console.log('DATOS COMPLETOS:');
    console.log(JSON.stringify(asignaciones, null, 2));
    console.log('\n');

    // Calcular totales y participaciones por año
    const [totales2024] = await pool.query(`
      SELECT SUM(unidades) as total FROM com_unidades_procesadas WHERE anio = 2024
    `);
    
    const [totales2025] = await pool.query(`
      SELECT SUM(unidades) as total FROM com_unidades_procesadas WHERE anio = 2025
    `);

    console.log('TOTALES:');
    console.log('2024:', totales2024[0].total);
    console.log('2025:', totales2025[0].total);
    console.log('\n');

    // Calcular participaciones y variaciones
    console.log('ANÁLISIS CON PARTICIPACIONES Y VARIACIONES:');
    const [datos2024] = await pool.query(`
      SELECT centro_operacion, unidades FROM com_unidades_procesadas WHERE anio = 2024
    `);
    const [datos2025] = await pool.query(`
      SELECT centro_operacion, unidades FROM com_unidades_procesadas WHERE anio = 2025
    `);

    const total2024 = totales2024[0].total;
    const total2025 = totales2025[0].total;

    const analisis = datos2025.map(d2025 => {
      const d2024 = datos2024.find(d => d.centro_operacion === d2025.centro_operacion);
      const unidades2024 = d2024 ? d2024.unidades : 0;
      const unidades2025 = d2025.unidades;
      const participacion2024 = ((unidades2024 / total2024) * 100).toFixed(2);
      const participacion2025 = ((unidades2025 / total2025) * 100).toFixed(2);
      const variacion = unidades2025 - unidades2024;
      const variacionPct = unidades2024 > 0 ? (((unidades2025 - unidades2024) / unidades2024) * 100).toFixed(2) : 0;

      return {
        asignacion: d2025.centro_operacion,
        unidades2025,
        participacion2025: parseFloat(participacion2025),
        unidades2024,
        participacion2024: parseFloat(participacion2024),
        variacion,
        variacionPct: parseFloat(variacionPct)
      };
    });

    // Ordenar por participación 2025
    analisis.sort((a, b) => b.participacion2025 - a.participacion2025);

    console.log(JSON.stringify(analisis, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await db.close();
    process.exit(0);
  }
}

consultarAsignacionMayorista();
