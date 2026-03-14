const fs = require('fs');
const filePath = 'frontend/src/components/dashboards/EntornoSocioeconomicoDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Encontrar el BarChart de IPC por su marcador único
const startMarker = "{ año: '2021', ipc: 5.62, color: '#6366f1' },";
const startIdx = content.indexOf(startMarker);
if (startIdx === -1) { console.log('❌ Marcador no encontrado'); process.exit(1); }

const barchartIdx = content.lastIndexOf('<BarChart', startIdx);
const endMarker = '</BarChart>';
const endIdx = content.indexOf(endMarker, startIdx) + endMarker.length;

console.log(`Reemplazando bloque [${barchartIdx} - ${endIdx}]`);

const newBlock = `<ComposedChart
                    data={[
                      { año: '2021', ipc: 5.62,  variacion: null,   color: '#6366f1' },
                      { año: '2022', ipc: 13.12, variacion: 7.50,   color: '#0891b2' },
                      { año: '2023', ipc: 9.28,  variacion: -3.84,  color: '#14b8a6' },
                      { año: '2024', ipc: 5.2,   variacion: -4.08,  color: '#10b981' },
                      { año: '2025', ipc: 5.1,   variacion: -0.10,  color: '#84cc16' }
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
                      domain={[0, 15]}
                      ticks={[0, 2, 4, 6, 8, 10, 12, 14]}
                      tickFormatter={(value) => \`\${value}%\`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '2px solid #6366f1',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                      labelStyle={{ color: '#1f2937', fontSize: '14px', fontWeight: 'bold' }}
                      formatter={(value, name, props) => {
                        if (name === '_tendencia') return null;
                        const v = props.payload.variacion;
                        const varStr = v !== null ? (v > 0 ? \` (+\${v}pp)\` : \` (\${v}pp)\`) : ' (base)';
                        return [\`\${value}%\${varStr}\`, 'IPC'];
                      }}
                    />
                    <Bar dataKey="ipc" name="IPC" radius={[8, 8, 0, 0]} maxBarSize={80}
                      label={(props) => {
                        const { x, y, width, value, index } = props;
                        const variaciones = [null, 7.50, -3.84, -4.08, -0.10];
                        const v = variaciones[index];
                        const varStr = v !== null ? (v > 0 ? \`+\${v}pp\` : \`\${v}pp\`) : '';
                        const varColor = v !== null ? (v > 0 ? '#dc2626' : '#16a34a') : 'transparent';
                        return (
                          <g>
                            <text x={x + width / 2} y={y - 22} textAnchor="middle" fill="#1f2937" fontSize={15} fontWeight="bold">
                              {\`\${value}%\`}
                            </text>
                            {v !== null && (
                              <text x={x + width / 2} y={y - 6} textAnchor="middle" fill={varColor} fontSize={12} fontWeight="bold">
                                {varStr}
                              </text>
                            )}
                          </g>
                        );
                      }}
                    >
                      {[
                        { color: '#6366f1' },
                        { color: '#0891b2' },
                        { color: '#14b8a6' },
                        { color: '#10b981' },
                        { color: '#84cc16' }
                      ].map((entry, index) => (
                        <Cell key={\`cell-\${index}\`} fill={entry.color} />
                      ))}
                    </Bar>
                    <Line
                      type="monotone"
                      dataKey="ipc"
                      name="_tendencia"
                      stroke="#1f2937"
                      strokeWidth={2}
                      dot={{ r: 4, fill: '#1f2937', strokeWidth: 0 }}
                      legendType="none"
                      tooltipType="none"
                    />
                  </ComposedChart>`;

const newContent = content.substring(0, barchartIdx) + newBlock + content.substring(endIdx);
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('✅ IPC chart actualizado');
