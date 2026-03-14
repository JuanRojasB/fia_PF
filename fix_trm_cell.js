const fs = require('fs');
const filePath = 'frontend/src/components/dashboards/EntornoSocioeconomicoDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  `                      <Cell fill="#1e40af" />
                      <Cell fill="#3b82f6" />
                      <Cell fill="#60a5fa" />`,
  `                      <Cell fill="#1e3a8a" />
                      <Cell fill="#1e40af" />
                      <Cell fill="#3b82f6" />
                      <Cell fill="#60a5fa" />`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Cell agregado para 2023');
