const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/dashboards/EntornoSocioeconomicoDashboard.jsx', 'utf8');

// Use regex to find and replace the entire broken section
const regex = /(\s*<div className="w-full" style=\{\{ position: 'relative' \}\}>[\s\S]*?<\/svg>\s*<\/div>)/;

const match = content.match(regex);
if (!match) {
  console.log('Regex not matched, trying to find SVG close...');
  const idx = content.indexOf('</svg>');
  console.log('</svg> at:', idx);
  console.log('context:', content.substring(idx - 100, idx + 200));
  process.exit(1);
}

console.log('Match found, length:', match[0].length);
console.log('Preview:', match[0].substring(0, 150));

const newSection = `
            {/* Variación entre años */}
            <div className="flex justify-center gap-8 mb-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border-2 border-green-400">
                <span className="text-sm font-semibold text-gray-600">2024 → 2025</span>
                <span className="text-base font-bold text-green-600">+1.9%</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 border-2 border-red-400">
                <span className="text-sm font-semibold text-gray-600">2025 → 2026</span>
                <span className="text-base font-bold text-red-600">-0.4%</span>
              </div>
            </div>

            <div className="w-full">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={[
                      { año: '2024', precio: 10500 },
                      { año: '2025', precio: 10700 },
                      { año: '2026', precio: 10660 }
                    ]}
                    margin={{ bottom: 40, top: 40, left: 70, right: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="año"
                      stroke="#94a3b8"
                      tick={{ fontSize: 16 }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      tick={{ fontSize: 16 }}
                      domain={[0, 11000]}
                      ticks={[0, 2000, 4000, 6000, 8000, 10000]}
                      tickFormatter={(value) => \`\${value.toLocaleString()}\`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '2px solid #14b8a6',
                        borderRadius: '8px',
                        fontSize: '15px'
                      }}
                      labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                      formatter={(value) => [\`$\${value.toLocaleString()} / kg\`, 'Precio promedio']}
                    />
                    <Bar dataKey="precio" name="Precio por Kg" radius={[8, 8, 0, 0]} maxBarSize={180} label={{
                      position: 'top',
                      fill: '#0f766e',
                      fontSize: 15,
                      fontWeight: 'bold',
                      formatter: (value) => \`$\${value.toLocaleString()}\`
                    }}>
                      <Cell fill="#14b8a6" />
                      <Cell fill="#0d9488" />
                      <Cell fill="#0f766e" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>`;

content = content.replace(regex, newSection);
fs.writeFileSync('frontend/src/components/dashboards/EntornoSocioeconomicoDashboard.jsx', content, 'utf8');
console.log('DONE');
console.log('SVG overlay gone:', !content.includes('Custom lines and labels overlay'));
console.log('-,4% gone:', !content.includes('-,4%'));
