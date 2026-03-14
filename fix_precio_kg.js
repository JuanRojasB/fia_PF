const fs = require('fs');
const filePath = 'frontend/src/components/dashboards/EntornoSocioeconomicoDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const startMarker = "{ año: '2024', precio: 10500 }";
const startIdx = content.indexOf(startMarker);
if (startIdx === -1) { console.log('❌ Marcador no encontrado'); process.exit(1); }

const barchartIdx = content.lastIndexOf('<BarChart', startIdx);
const endIdx = content.indexOf('</BarChart>', startIdx) + '</BarChart>'.length;
console.log(`Reemplazando [${barchartIdx} - ${endIdx}]`);

const newBlock = `<ComposedChart
                    data={[
                      { año: '2024', precio: 10500, variacion: null },
                      { año: '2025', precio: 10700, variacion: 1.9 },
                      { año: '2026', precio: 10660, variacion: -0.4 }
                    ]}
                    margin={{ bottom: 40, top: 60, left: 70, right: 70 }}
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
                      domain={[10000, 11000]}
                      ticks={[10000, 10200, 10400, 10600, 10800, 11000]}
                      tickFormatter={(value) => \`\${value.toLocaleString()}\`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '2px solid #14b8a6',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                      labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                      formatter={(value, name, props) => {
                        if (name === '_tendencia') return null;
                        const v = props.payload.variacion;
                        const varStr = v !== null ? (v > 0 ? \` (+\${v}%)\` : \` (\${v}%)\`) : ' (base)';
                        const varColor = v !== null ? (v > 0 ? '#16a34a' : '#dc2626') : '#6b7280';
                        return [
                          <span style={{ color: varColor }}>\`$\${value.toLocaleString()}/kg\${varStr}\`</span>,
                          'Precio promedio'
                        ];
                      }}
                    />
                    <Bar dataKey="precio" name="Precio por Kg" radius={[8, 8, 0, 0]} maxBarSize={180}
                      label={(props) => {
                        const { x, y, width, value, index } = props;
                        const variaciones = [null, 1.9, -0.4];
                        const v = variaciones[index];
                        const varStr = v !== null ? (v > 0 ? \`+\${v}%\` : \`\${v}%\`) : '';
                        const varColor = v !== null ? (v > 0 ? '#16a34a' : '#dc2626') : 'transparent';
                        return (
                          <g>
                            <text x={x + width / 2} y={y - 22} textAnchor="middle" fill="#0f766e" fontSize={15} fontWeight="bold">
                              {\`$\${value.toLocaleString()}\`}
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
                      <Cell fill="#14b8a6" />
                      <Cell fill="#0d9488" />
                      <Cell fill="#0f766e" />
                    </Bar>
                    <Line
                      type="linear"
                      dataKey="precio"
                      name="_tendencia"
                      stroke="#ef4444"
                      strokeWidth={3}
                      strokeDasharray="8 4"
                      dot={{ r: 6, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 8 }}
                      legendType="none"
                    />
                  </ComposedChart>`;

const newContent = content.substring(0, barchartIdx) + newBlock + content.substring(endIdx);
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('✅ Precio Kg chart actualizado con línea y variaciones');
