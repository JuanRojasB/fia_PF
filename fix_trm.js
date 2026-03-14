const fs = require('fs');
const file = 'frontend/src/components/dashboards/EntornoSocioeconomicoDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// Find the TRM chart block by unique markers and replace it
const startMarker = '            <div className="w-full">\n              <ResponsiveContainer width="100%" aspect={1.5}>\n                <BarChart \n                    data={[\n                      { a';
const endMarker = '              </div>\n            \n            <p className="text-xs text-gray-600 text-center mt-4">\n              Fuente: datos oficiales del DANE\n            </p>\n            \n            {/* Análisis */}';

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);

if (startIdx === -1) {
  console.log('Start marker not found');
  // Try to find by unique string
  const idx = content.indexOf('aspect={1.5}');
  console.log('aspect={1.5} occurrences:');
  let pos = 0;
  while ((pos = content.indexOf('aspect={1.5}', pos)) !== -1) {
    console.log('  at index', pos, ':', content.substring(pos-50, pos+50).replace(/\n/g, '\\n'));
    pos++;
  }
} else {
  console.log('Found at', startIdx, 'to', endIdx);
  const newBlock = `            <div className="w-full">
              <ResponsiveContainer width="100%" height={450}>
                <BarChart 
                    data={[
                      { año: '2024', trm: 4071.28 },
                      { año: '2025', trm: 4052.86 },
                      { año: '2026 (YTD)', trm: 3640.27 }
                    ]} 
                    margin={{ bottom: 60, top: 60, left: 60, right: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="año" 
                      stroke="#94a3b8"
                      tick={{ fontSize: 17 }}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      tick={{ fontSize: 17 }}
                      domain={[0, 4500]}
                      ticks={[0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500]}
                      tickFormatter={(value) => \`$\${value.toLocaleString('es-CO')}\`}
                    />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '2px solid #3b82f6',
                        borderRadius: '8px',
                        fontSize: '15px'
                      }}
                      labelStyle={{ color: '#1f2937', fontSize: '14px', fontWeight: 'bold' }}
                      itemStyle={{ color: '#1f2937' }}
                      formatter={(value) => [\`$\${Number(value).toLocaleString('es-CO', { minimumFractionDigits: 2 })}\`, 'TRM Promedio']}
                    />
                    <Bar dataKey="trm" name="TRM Promedio" radius={[8, 8, 0, 0]} maxBarSize={180} label={{
                      position: 'top',
                      fontSize: 15,
                      fontWeight: 'bold',
                      fill: '#1e293b',
                      formatter: (value) => \`$\${Number(value).toLocaleString('es-CO', { minimumFractionDigits: 2 })}\`
                    }}>
                      <Cell fill="#1e40af" />
                      <Cell fill="#3b82f6" />
                      <Cell fill="#60a5fa" />
                    </Bar>
                    <Line 
                      type="linear" 
                      dataKey="trm" 
                      name="Línea de Tendencia"
                      stroke="#ef4444" 
                      strokeWidth={3}
                      strokeDasharray="8 4"
                      dot={{ r: 6, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 8 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            
            <p className="text-xs text-gray-600 text-center mt-4">
              Fuente: datos oficiales del DANE
            </p>
            
            {/* Análisis */}`;

  content = content.substring(0, startIdx) + newBlock + content.substring(endIdx + endMarker.length);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Done');
}
