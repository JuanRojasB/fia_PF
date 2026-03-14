const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/components/dashboards/EntornoSocioeconomicoDashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Buscar el BarChart de TRM por su contenido único
const startMarker = "{ año: '2024', trm: 4071.28, tendencia: 4071.28 }";
const startIdx = content.indexOf(startMarker);

if (startIdx === -1) {
  console.log('❌ Marcador no encontrado');
  process.exit(1);
}

// Retroceder hasta el <BarChart
const barchartIdx = content.lastIndexOf('<BarChart', startIdx);
console.log('BarChart encontrado en índice:', barchartIdx);

// Avanzar hasta el </BarChart>
const endMarker = '</BarChart>';
const endIdx = content.indexOf(endMarker, startIdx) + endMarker.length;
console.log('Fin en índice:', endIdx);

const oldBlock = content.substring(barchartIdx, endIdx);
console.log('Bloque a reemplazar (primeros 100 chars):', oldBlock.substring(0, 100));

const newBlock = `<ComposedChart
                    data={[
                      { año: '2024', trm: 4071.28, variacion: null },
                      { año: '2025', trm: 4052.86, variacion: -0.45 },
                      { año: '2026 (YTD)', trm: 3640.27, variacion: -10.18 }
                    ]}
                    margin={{ bottom: 40, top: 60, left: 70, right: 70 }}
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
                      domain={[3000, 4500]}
                      ticks={[3000, 3200, 3400, 3600, 3800, 4000, 4200, 4400]}
                      tickFormatter={(value) => \`\${value.toLocaleString()}\`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '2px solid #3b82f6',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                      labelStyle={{ color: '#1f2937', fontSize: '14px', fontWeight: 'bold' }}
                      formatter={(value, name) => {
                        if (name === 'Tendencia') return [\`$\${value.toLocaleString()}\`, 'Línea de Tendencia'];
                        return [\`$\${value.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\`, 'TRM Promedio'];
                      }}
                    />
                    <Bar dataKey="trm" name="TRM Promedio" radius={[8, 8, 0, 0]} maxBarSize={180}
                      label={(props) => {
                        const { x, y, width, value, index } = props;
                        const variaciones = [null, -0.45, -10.18];
                        const v = variaciones[index];
                        const valStr = value.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        const varStr = v !== null ? (v > 0 ? \`+\${v}%\` : \`\${v}%\`) : '';
                        const varColor = v !== null ? (v > 0 ? '#16a34a' : '#dc2626') : 'transparent';
                        return (
                          <g>
                            <text x={x + width / 2} y={y - 22} textAnchor="middle" fill="#1e40af" fontSize={15} fontWeight="bold">
                              {\`$\${valStr}\`}
                            </text>
                            {v !== null && (
                              <text x={x + width / 2} y={y - 6} textAnchor="middle" fill={varColor} fontSize={13} fontWeight="bold">
                                {varStr}
                              </text>
                            )}
                          </g>
                        );
                      }}
                    >
                      <Cell fill="#1e40af" />
                      <Cell fill="#3b82f6" />
                      <Cell fill="#60a5fa" />
                    </Bar>
                    <Line
                      type="linear"
                      dataKey="trm"
                      name="Tendencia"
                      stroke="#ef4444"
                      strokeWidth={3}
                      strokeDasharray="8 4"
                      dot={{ r: 6, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 8 }}
                    />
                  </ComposedChart>`;

const newContent = content.substring(0, barchartIdx) + newBlock + content.substring(endIdx);
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('✅ TRM chart actualizado correctamente');
