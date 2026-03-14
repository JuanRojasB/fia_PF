const fs = require('fs');
const filePath = 'frontend/src/components/dashboards/EntornoSocioeconomicoDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Corregir el label del valor (falta el $)
content = content.replace(
  '              {`${valStr}`}\n',
  '              {`$${valStr}`}\n'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Label $ corregido');
