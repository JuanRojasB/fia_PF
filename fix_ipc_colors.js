const fs = require('fs');
const filePath = 'frontend/src/components/dashboards/EntornoSocioeconomicoDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// En el label del IPC: sube = verde, baja = rojo (igual que TRM)
content = content.replace(
  `const varColor = v !== null ? (v > 0 ? '#dc2626' : '#16a34a') : 'transparent';`,
  `const varColor = v !== null ? (v > 0 ? '#16a34a' : '#dc2626') : 'transparent';`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Colores IPC corregidos: sube=verde, baja=rojo');
