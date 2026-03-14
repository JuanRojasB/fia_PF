const fs = require('fs');
const file = 'frontend/src/components/dashboards/EntornoSocioeconomicoDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace all aspect ratios with fixed height
content = content.replace(/width="100%" aspect=\{1\.5\}/g, 'width="100%" height={500}');
content = content.replace(/width="100%" aspect=\{1\.6\}/g, 'width="100%" height={500}');

const count = (content.match(/height=\{500\}/g) || []).length;
console.log('Total height={500} occurrences:', count);

fs.writeFileSync(file, content, 'utf8');
console.log('Done');
