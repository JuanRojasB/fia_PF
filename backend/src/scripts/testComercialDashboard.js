require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const DashboardRepository = require('../infrastructure/repositories/DashboardRepository');
const { getInstance } = require('../infrastructure/database/connection');

async function testComercialDashboard() {
  const db = getInstance();
  await db.connect();
  
  try {
    console.log('=== TEST COMERCIAL DASHBOARD ===\n');

    const repo = new DashboardRepository();
    const data = await repo.getGestionComercial();

    console.log('✅ Datos obtenidos correctamente\n');
    
    console.log('📊 ASIGNACIÓN MAYORISTA:');
    console.log('Total registros:', data.asignacionMayorista?.length || 0);
    
    if (data.asignacionMayorista && data.asignacionMayorista.length > 0) {
      console.log('\nPrimeros 5 registros:');
      data.asignacionMayorista.slice(0, 5).forEach(a => {
        console.log(`  ${a.anio} - ${a.centro_operacion}: ${a.unidades.toLocaleString('es-CO')} unidades`);
      });
      
      // Calcular totales por año
      const total2024 = data.asignacionMayorista
        .filter(a => a.anio === 2024)
        .reduce((sum, a) => sum + parseInt(a.unidades), 0);
      
      const total2025 = data.asignacionMayorista
        .filter(a => a.anio === 2025)
        .reduce((sum, a) => sum + parseInt(a.unidades), 0);
      
      console.log('\n📈 TOTALES:');
      console.log(`  2024: ${total2024.toLocaleString('es-CO')} unidades`);
      console.log(`  2025: ${total2025.toLocaleString('es-CO')} unidades`);
      console.log(`  Variación: ${((total2025 - total2024) / total2024 * 100).toFixed(2)}%`);
    } else {
      console.log('⚠️  No hay datos de asignación mayorista');
    }
    
    console.log('\n✅ Test completado exitosamente');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await db.close();
    process.exit(0);
  }
}

testComercialDashboard();
