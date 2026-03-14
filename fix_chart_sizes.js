const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/dashboards/EntornoSocioeconomicoDashboard.jsx', 'utf8');

const lines = content.split('\n');

// Línea 624 (index 623): margen del Desempleo — left:20, right:40 → left:70, right:70
// También tiene bottom:60 que dejamos igual por las etiquetas anguladas del eje X
lines[623] = lines[623].replace(
  'margin={{ bottom: 60, top: 40, left: 20, right: 40 }}',
  'margin={{ bottom: 60, top: 40, left: 70, right: 70 }}'
);

content = lines.join('\n');
fs.writeFileSync('frontend/src/components/dashboards/EntornoSocioeconomicoDashboard.jsx', content, 'utf8');

// Verificar resultado final
const verify = fs.readFileSync('frontend/src/components/dashboards/EntornoSocioeconomicoDashboard.jsx', 'utf8');
const vlines = verify.split('\n');
console.log('IPC   L305:', vlines[304].trim());
console.log('IPC   L314:', vlines[313].trim());
console.log('TRM   L410:', vlines[409].trim());
console.log('TRM   L417:', vlines[416].trim());
console.log('Pollo L529:', vlines[528].trim());
console.log('Desemp L621:', vlines[620].trim());
console.log('Desemp L624:', vlines[623].trim());
console.log('\naspect restantes:', (verify.match(/aspect=\{/g) || []).length);
