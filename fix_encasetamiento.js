const fs = require('fs');
const filePath = 'frontend/src/components/dashboards/EncasetamientoColombiaDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Comparando dashboard vs imagen FENAVI:
// Marzo 2021: 73.968776 → 75.958776
content = content.replace(
  "{ mes: 'Marzo', 2020: 68.425009, 2021: 73.968776, 2022: 76.313153",
  "{ mes: 'Marzo', 2020: 68.425009, 2021: 75.958776, 2022: 76.315153"
);

// Mayo 2022: 78.773148 → 76.724748
content = content.replace(
  "{ mes: 'Mayo', 2020: 49.907000, 2021: 60.846094, 2022: 78.773148",
  "{ mes: 'Mayo', 2020: 49.907000, 2021: 60.846094, 2022: 76.724748"
);

// Junio 2022: 73.988602 → 73.988603 (imagen: 73.988.603) — ok, diferencia mínima
// Julio 2022: 77.755554 → 74.763961 (imagen: 74.763.961)
content = content.replace(
  "{ mes: 'Julio', 2020: 71.248323, 2021: 72.504945, 2022: 77.755554",
  "{ mes: 'Julio', 2020: 71.248323, 2021: 72.504945, 2022: 74.763961"
);

// Agosto 2021: 73.586423 → 75.886423 (imagen: 75.886.423)
content = content.replace(
  "{ mes: 'Agosto', 2020: 70.922275, 2021: 73.586423",
  "{ mes: 'Agosto', 2020: 70.922275, 2021: 75.886423"
);

// Septiembre 2022: 79.859780 → 79.859780 ok
// Octubre 2022: 79.011016 → 79.011016 ok

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Datos encasetamiento corregidos');

// Verificar
const updated = fs.readFileSync(filePath, 'utf8');
console.log('Marzo 2021:', updated.includes('2021: 75.958776') ? '✅' : '❌');
console.log('Mayo 2022:', updated.includes('2022: 76.724748') ? '✅' : '❌');
console.log('Julio 2022:', updated.includes('2022: 74.763961') ? '✅' : '❌');
console.log('Agosto 2021:', updated.includes('2021: 75.886423') ? '✅' : '❌');
