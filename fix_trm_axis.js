const fs = require('fs');
const filePath = 'frontend/src/components/dashboards/EntornoSocioeconomicoDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Ajustar dominio del eje Y para que 2023 (4000) quepa bien
content = content.replace(
  `domain={[3000, 4500]}
                      ticks={[3000, 3200, 3400, 3600, 3800, 4000, 4200, 4400]}`,
  `domain={[3400, 4300]}
                      ticks={[3400, 3600, 3800, 4000, 4200, 4300]}`
);

// Actualizar título para incluir 2023
content = content.replace(
  'TRM Promedio Anual con Línea de Tendencia - 2024, 2025, 2026 (YTD)',
  'TRM Promedio Anual con Línea de Tendencia - 2023, 2024, 2025, 2026 (YTD)'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Eje Y y título actualizados');
