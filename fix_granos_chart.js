const fs = require('fs');
const filePath = 'frontend/src/components/dashboards/EntornoSocioeconomicoDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Fix por índice — buscar los dos ResponsiveContainer con aspect={1.6}
let count = 0;
content = content.replace(/width="100%" aspect=\{1\.6\}/g, (match) => {
  count++;
  return 'width="100%" height={400}';
});

// Fix los márgenes de granosData y preciosColombiaData
// Buscar LineChart con granosData
const granosIdx = content.indexOf('data={granosData}');
if (granosIdx !== -1) {
  const marginIdx = content.indexOf('margin={{ bottom: 60, top: 40, left: 60, right: 60 }}', granosIdx - 200);
  if (marginIdx !== -1 && marginIdx < granosIdx + 100) {
    content = content.substring(0, marginIdx) + 
      'margin={{ bottom: 40, top: 40, left: 70, right: 70 }}' + 
      content.substring(marginIdx + 'margin={{ bottom: 60, top: 40, left: 60, right: 60 }}'.length);
    console.log('✅ Margen granosData corregido');
  }
}

// Buscar LineChart con preciosColombiaData
const preciosIdx = content.indexOf('data={preciosColombiaData}');
if (preciosIdx !== -1) {
  const marginIdx = content.indexOf('margin={{ bottom: 60, top: 40, left: 60, right: 60 }}', preciosIdx - 200);
  if (marginIdx !== -1 && marginIdx < preciosIdx + 100) {
    content = content.substring(0, marginIdx) + 
      'margin={{ bottom: 40, top: 40, left: 70, right: 70 }}' + 
      content.substring(marginIdx + 'margin={{ bottom: 60, top: 40, left: 60, right: 60 }}'.length);
    console.log('✅ Margen preciosColombiaData corregido');
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log(`✅ ${count} aspect reemplazados por height={400}`);
