const fs = require('fs');
const filePath = 'frontend/src/components/dashboards/EntornoSocioeconomicoDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Maíz amarillo → azul claro (línea superior)
content = content.replace(
  `dataKey="maizAmarillo" \n                      name="Maíz amarillo" \n                      stroke="#fbbf24" \n                      strokeWidth={4}\n                      dot={{ r: 6, fill: '#fbbf24' }}`,
  `dataKey="maizAmarillo" \n                      name="Maíz amarillo" \n                      stroke="#7dd3fc" \n                      strokeWidth={3}\n                      dot={{ r: 5, fill: '#7dd3fc' }}`
);

// Usar replace simple por cada color
content = content.replace('stroke="#fbbf24" \n                      strokeWidth={4}\n                      dot={{ r: 6, fill: \'#fbbf24\' }}', 'stroke="#7dd3fc" \n                      strokeWidth={3}\n                      dot={{ r: 5, fill: \'#7dd3fc\' }}');
content = content.replace('stroke="#84cc16" \n                      strokeWidth={4}\n                      dot={{ r: 6, fill: \'#84cc16\' }}', 'stroke="#3b82f6" \n                      strokeWidth={3}\n                      dot={{ r: 5, fill: \'#3b82f6\' }}');
content = content.replace('stroke="#92400e" \n                      strokeWidth={4}\n                      dot={{ r: 6, fill: \'#92400e\' }}', 'stroke="#1e3a8a" \n                      strokeWidth={3}\n                      dot={{ r: 5, fill: \'#1e3a8a\' }}');

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Colores actualizados');
