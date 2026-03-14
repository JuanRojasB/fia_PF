const fs = require('fs');
const filePath = 'frontend/src/components/dashboards/EntornoSocioeconomicoDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Corregir línea 2024: tortaSoya era igual a soyaGrano (1248 = 1248, incorrecto)
// Según imagen: soyaGrano 2024 debe ser ~1635 (línea media entre maiz y torta)
content = content.replace(
  "{ año: '2024', maizAmarillo: 1735, soyaGrano: 1248, tortaSoya: 1248 }",
  "{ año: '2024', maizAmarillo: 1735, soyaGrano: 1635, tortaSoya: 1248 }"
);

// Corregir línea 2025: soyaGrano y tortaSoya eran iguales (1313 = 1313, incorrecto)
content = content.replace(
  "{ año: '2025', maizAmarillo: 1806, soyaGrano: 1313, tortaSoya: 1313 }",
  "{ año: '2025', maizAmarillo: 1806, soyaGrano: 1675, tortaSoya: 1313 }"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Datos corregidos');
