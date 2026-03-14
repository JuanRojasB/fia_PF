const fs = require('fs');
const filePath = 'frontend/src/components/dashboards/EntornoSocioeconomicoDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Corregir el formatter del tooltip TRM para ocultar la línea de tendencia
const oldFormatter = `                      formatter={(value, name) => {
                        if (name === 'Tendencia') return [\`$\${value.toLocaleString()}\`, 'Línea de Tendencia'];
                        return [\`$\${value.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\`, 'TRM Promedio'];
                      }}`;

const newFormatter = `                      formatter={(value, name, props) => {
                        if (name === 'Tendencia') return null;
                        const v = props.payload.variacion;
                        const varStr = v !== null ? (v > 0 ? \` (+\${v}%)\` : \` (\${v}%)\`) : ' (base)';
                        return [\`$\${value.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\${varStr}\`, 'TRM Promedio'];
                      }}`;

if (content.includes(oldFormatter)) {
  content = content.replace(oldFormatter, newFormatter);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Tooltip TRM corregido');
} else {
  console.log('❌ Formatter no encontrado');
}
