const fs = require('fs');
const p = 'frontend/src/components/dashboards/CalidadDashboard.jsx';
let src = fs.readFileSync(p, 'utf8');

// ── helpers ──────────────────────────────────────────────────────────────
function replace(oldStr, newStr) {
  if (!src.includes(oldStr)) { console.error('NOT FOUND:', oldStr.slice(0, 80)); process.exit(1); }
  src = src.replace(oldStr, newStr);
}

// ══════════════════════════════════════════════════════════════════════════
// 1. COMPRAS — añadir hallazgos clave debajo de la tabla
// ══════════════════════════════════════════════════════════════════════════
replace(
`      <Modal open={modal.open} title={modal.title} onClose={close}>{modal.content}</Modal>
    </div>
  );
}

function SeccionBienestar()`,
`      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Factores del comportamiento anual</p>
          <Bullet color="#f59e0b" items={[
            'Aumento del 51% en producción',
            'Crecimiento de demanda de clientes estratégicos: D1, ARA, Frisby',
            'Eventos extraordinarios del sector y mantenimientos OVERHAUL',
          ]} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Hallazgos clave</p>
          <Bullet color="#6366f1" items={[
            'Consumo promedio del 73,42% sobre las compras (ajuste positivo frente a 2024)',
            'Cierre del año con compras a la baja, excepto picos por auditorías HACCP y dotaciones',
            'Aumento en volumen y costo del inventario por repuestos importados',
            'Evaluación de 36 proveedores con visitas conjuntas con Calidad (HACCP)',
            'Avance en la aplicación de la matriz Kraljic',
          ]} />
        </div>
      </div>

      <Modal open={modal.open} title={modal.title} onClose={close}>{modal.content}</Modal>
    </div>
  );
}

function SeccionBienestar()`
);

// ══════════════════════════════════════════════════════════════════════════
// 2. BIENESTAR — reemplazar descripción y añadir KPI 63,3% + hallazgos
// ══════════════════════════════════════════════════════════════════════════
replace(
`        <p className="text-gray-700 text-sm">Indicadores de bienestar en transporte, insensibilizado y proceso de beneficio.</p>`,
`        <p className="text-gray-700 text-sm">Fortalecimiento del programa mediante capacitación, certificación de transportadores y mejoras en insensibilizado y sangrado.</p>`
);

replace(
`        <KpiClickCard label="Promedio mensual pollos mal sangrados" value2025={n(prom2025Sangrado)} value2024={n(prom2024Sangrado)}
          varPct={varSangrado} varAbs={` + '`${n(Math.abs(prom2025Sangrado - prom2024Sangrado))} unidades/mes`' + `}
          color="#10b981" icon={TrendingDown} good={false}`,
`        <KpiClickCard label="Pollo mal sangrado — reducción" value2025="–63,3%" value2024="Base 2024"
          varPct="-63.3" varAbs="Reducción de pérdidas económicas"
          color="#10b981" icon={TrendingDown} good={false}`
);

// Reemplazar el onClick del primer KpiClickCard de bienestar
replace(
`          onClick={() => open('Pollo mal sangrado 2025 vs 2024', <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200"><p className="text-xs text-gray-500 mb-1">Promedio 2024</p><p className="text-xl font-bold text-gray-900">{n(prom2024Sangrado)} u/mes</p></div>
              <div className="bg-green-50 rounded-lg p-3 border border-green-200"><p className="text-xs text-green-600 font-semibold mb-1">Promedio 2025</p><p className="text-xl font-bold text-green-700">{n(prom2025Sangrado)} u/mes</p></div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200"><p className="font-semibold text-green-700 mb-1">Reducción: {varSangrado}%</p><p className="text-sm">Diferencia: {n(Math.abs(prom2025Sangrado - prom2024Sangrado))} unidades/mes menos. Logrado mediante mejoras en insensibilizado, capacitación del personal y ajustes técnicos en planta.</p></div>
          </div>)} />`,
`          onClick={() => open('Pollo mal sangrado 2025 vs 2024', <div className="space-y-3">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="font-semibold text-green-700 mb-1">Reducción del 63,3% vs 2024</p>
              <p className="text-sm">Disminución significativa de pollos mal sangrados, reduciendo pérdidas económicas. Logrado mediante mejoras en insensibilizado, capacitación del personal operativo, supervisores y calidad.</p>
            </div>
          </div>)} />`
);

// Añadir hallazgos al final de SeccionBienestar antes del Modal
replace(
`      <Modal open={modal.open} title={modal.title} onClose={close}>{modal.content}</Modal>
    </div>
  );
}

function SeccionHSEQ()`,
`      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Fortalecimiento del programa</p>
          <Bullet color="#ec4899" items={[
            'Capacitación del personal operativo, supervisores y calidad',
            'Certificación de transportadores (ICA/Mintransporte)',
            'Diseño de mejoras en insensibilizado y sangrado',
          ]} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Resultados destacados</p>
          <Bullet color="#10b981" items={[
            'Reducción del 63,3% de pollo mal sangrado vs 2024',
            'Disminución del 8,21% en aves mal aturdidas',
            'Migración del 100% al sistema de cargue en tubo',
            'Implementación del monitoreo de lesiones en granja y planta',
            'Consolidación del Programa de Bienestar Animal bajo estándares ISO',
          ]} />
        </div>
      </div>

      <Modal open={modal.open} title={modal.title} onClose={close}>{modal.content}</Modal>
    </div>
  );
}

function SeccionHSEQ()`
);

// ══════════════════════════════════════════════════════════════════════════
// 3. HSEQ — añadir KPI canastillas rotas y hallazgos completos
// ══════════════════════════════════════════════════════════════════════════
replace(
`        <p className="text-gray-700 text-sm">Seguridad, salud, medio ambiente y calidad. Accidentalidad, agua y residuos.</p>`,
`        <p className="text-gray-700 text-sm">Seguridad y Salud en el Trabajo: 112 accidentes laborales. Gestión Ambiental: reducción hídrica, residuos y cumplimiento normativo.</p>`
);

// Añadir hallazgos SST al final de SeccionHSEQ antes del Modal
replace(
`      <Modal open={modal.open} title={modal.title} onClose={close}>{modal.content}</Modal>
    </div>
  );
}

function SeccionAmbiental()`,
`      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Seguridad y Salud en el Trabajo</p>
          <Bullet color="#ef4444" items={[
            '112 accidentes laborales en 2025',
            'Áreas con mayor incidencia: Planta (27), Posproceso (21), Calidad (17), Granjas (16)',
            '22 capacitaciones con 347 asistentes',
            'Implementación del programa de gimnasia laboral para mitigar riesgo osteomuscular',
          ]} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Gestión Ambiental</p>
          <Bullet color="#10b981" items={[
            'Reducción del consumo de agua por ave beneficiada: –5,9% vs 2024',
            'Incremento del 24,65% en residuos aprovechables',
            'Reducción del 20,02% en canastillas rotas',
            'Aumento del 29,84% en residuos peligrosos por jornadas extraordinarias (RAEE)',
            '100% cumplimiento en reportes al DANE, IDEAM y SDA',
            'Avances en concesiones de agua y gestión ante CAR en múltiples granjas',
          ]} />
        </div>
      </div>

      <Modal open={modal.open} title={modal.title} onClose={close}>{modal.content}</Modal>
    </div>
  );
}

function SeccionAmbiental()`
);

// ══════════════════════════════════════════════════════════════════════════
// 4. AMBIENTAL — añadir KPI canastillas rotas
// ══════════════════════════════════════════════════════════════════════════
replace(
`        <KpiClickCard label="Residuos peligrosos (RAEE)" value2025="+29,84%" value2024="Base 2024"
          varPct="29.84" varAbs="Jornadas extraordinarias RAEE" color="#f97316" icon={AlertTriangle} good={false}`,
`        <KpiClickCard label="Canastillas rotas" value2025="–20,02%" value2024="Base 2024"
          varPct="-20.02" varAbs="Reducción de pérdidas en logística" color="#10b981" icon={TrendingDown} good={false}
          onClick={() => open('Canastillas rotas 2025 vs 2024', <div className="space-y-3">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="font-semibold text-green-700 mb-1">Reducción del 20,02%</p>
              <p className="text-sm">La reducción en canastillas rotas refleja mejoras en el manejo y transporte de materiales, disminuyendo pérdidas operativas y costos de reposición.</p>
            </div>
          </div>)}
        />

        <KpiClickCard label="Residuos peligrosos (RAEE)" value2025="+29,84%" value2024="Base 2024"
          varPct="29.84" varAbs="Jornadas extraordinarias RAEE" color="#f97316" icon={AlertTriangle} good={false}`
);

// ══════════════════════════════════════════════════════════════════════════
// 5. SGC — añadir "actualización matrices" y "análisis causal" en hallazgos
// ══════════════════════════════════════════════════════════════════════════
replace(
`        <p className="text-gray-700 text-sm">Auditorías internas, migración a ISOLUCION e integración CRM SIESA.</p>`,
`        <p className="text-gray-700 text-sm">Actualización de matrices estratégicas, auditorías internas en 15 procesos, migración a ISOLUCION e integración CRM SIESA.</p>`
);

replace(
`      <Modal open={modal.open} title={modal.title} onClose={close}>{modal.content}</Modal>
    </div>
  );
}

function SeccionSatisfaccion()`,
`      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm font-semibold text-gray-700 mb-3">Logros del año</p>
        <Bullet color="#0ea5e9" items={[
          'Actualización de matrices estratégicas y políticas',
          'Ejecución de auditorías internas en 15 procesos',
          'Implementación de metodologías de análisis causal',
          'Migración del sistema a ISOLUCION: módulos Actas, Tareas y Mejora al 100%',
          'Integración del CRM SIESA para unificar requisitos de clientes',
        ]} />
      </div>

      <Modal open={modal.open} title={modal.title} onClose={close}>{modal.content}</Modal>
    </div>
  );
}

function SeccionSatisfaccion()`
);

// ══════════════════════════════════════════════════════════════════════════
// 6. SATISFACCIÓN — añadir contexto –38% encuestas y distribución canales
// ══════════════════════════════════════════════════════════════════════════
replace(
`        <p className="text-gray-700 text-sm">Encuestas de satisfacción, PQRS y planes de acción correctiva.</p>`,
`        <p className="text-gray-700 text-sm">1.166 encuestas (–38% vs 2024 por caída canal PDV). Distribución más equilibrada entre Asadores y Tienda a Tienda.</p>`
);

// ══════════════════════════════════════════════════════════════════════════
// 7. VIGÍA — buscar y añadir alarmas/carrotanques en el modal o hallazgos
// ══════════════════════════════════════════════════════════════════════════
replace(
`        <p className="text-gray-700 text-sm">Control de acceso, trazabilidad de activos y seguridad patrimonial.</p>`,
`        <p className="text-gray-700 text-sm">Protocolos de acceso, trazabilidad de activos, plataformas digitales, alarmas y control de carrotanques. Eliminó quejas administrativas.</p>`
);

fs.writeFileSync(p, src, 'utf8');
console.log('OK', src.length);
