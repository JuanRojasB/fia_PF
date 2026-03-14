const fs = require('fs');
const filePath = 'frontend/src/components/dashboards/EntornoSocioeconomicoDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Reemplazar los datos del ComposedChart TRM para incluir 2023 y variaciones correctas
// TRM 2023: ~4000.71 (valor real promedio anual)
// TRM 2024: 4071.28 → +1.76% vs 2023
// TRM 2025: 4052.86 → -0.45% vs 2024
// TRM 2026 YTD: 3640.27 → -10.18% vs 2025 | acumulado vs 2023: -9.01%

const oldData = `                    data={[
                      { año: '2024', trm: 4071.28, variacion: null },
                      { año: '2025', trm: 4052.86, variacion: -0.45 },
                      { año: '2026 (YTD)', trm: 3640.27, variacion: -10.18 }
                    ]}`;

const newData = `                    data={[
                      { año: '2023', trm: 4000.71, variacion: null },
                      { año: '2024', trm: 4071.28, variacion: 1.76 },
                      { año: '2025', trm: 4052.86, variacion: -0.45 },
                      { año: '2026 (YTD)', trm: 3640.27, variacion: -10.18 }
                    ]}`;

if (content.includes(oldData)) {
  content = content.replace(oldData, newData);
  // También actualizar el array de variaciones en el label
  content = content.replace(
    'const variaciones = [null, -0.45, -10.18];',
    'const variaciones = [null, 1.76, -0.45, -10.18];'
  );
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Datos TRM actualizados con 2023 como base');
} else {
  console.log('❌ Bloque de datos no encontrado');
}
