const fs = require('fs');
const filePath = 'frontend/src/components/dashboards/EncasetamientoColombiaDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Agosto - reemplazar todas las ocurrencias del valor incorrecto
const oldAgosto = "{ mes: 'Agosto', 2020: 70.922275, 2021: 73.586423, 2022: 79.446614, 2023: 81.311122, 2024: 77.028631, 2025: 79.901057 }";
const newAgosto = "{ mes: 'Agosto', 2020: 70.922275, 2021: 75.886423, 2022: 79.446614, 2023: 81.311122, 2024: 78.028631, 2025: 79.901057 }";

const count = (content.match(new RegExp(oldAgosto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
console.log(`Ocurrencias encontradas: ${count}`);

content = content.split(oldAgosto).join(newAgosto);
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Agosto corregido');
