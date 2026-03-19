/**
 * Generador de documentos Word — FIA Pollo Fiesta 2025
 * Genera: DOCUMENTACION_TECNICA y MANUAL_USUARIO
 * Uso: node backend/src/scripts/generarDocumentos.js
 */

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, AlignmentType,
  BorderStyle, ShadingType, PageBreak, NumberFormat,
  Header, Footer, PageNumber, TabStopType, TabStopLeader,
  UnderlineType, VerticalAlign
} = require('docx');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../../../docs');

// ─── Helpers ────────────────────────────────────────────────────────────────

const h1 = (text) => new Paragraph({
  text, heading: HeadingLevel.HEADING_1,
  spacing: { before: 400, after: 200 },
  thematicBreak: false,
});

const h2 = (text) => new Paragraph({
  text, heading: HeadingLevel.HEADING_2,
  spacing: { before: 300, after: 150 },
});

const h3 = (text) => new Paragraph({
  text, heading: HeadingLevel.HEADING_3,
  spacing: { before: 200, after: 100 },
});

const p = (text, opts = {}) => new Paragraph({
  children: [new TextRun({ text, size: 22, ...opts })],
  spacing: { after: 120 },
});

const bold = (text) => new TextRun({ text, bold: true, size: 22 });
const normal = (text) => new TextRun({ text, size: 22 });

const bullet = (text) => new Paragraph({
  children: [new TextRun({ text, size: 22 })],
  bullet: { level: 0 },
  spacing: { after: 80 },
});

const bullet2 = (text) => new Paragraph({
  children: [new TextRun({ text, size: 22 })],
  bullet: { level: 1 },
  spacing: { after: 60 },
});

const code = (text) => new Paragraph({
  children: [new TextRun({ text, font: 'Courier New', size: 18, color: '1F497D' })],
  spacing: { after: 60 },
  indent: { left: 720 },
});

const pageBreak = () => new Paragraph({ children: [new PageBreak()] });

const separator = () => new Paragraph({
  thematicBreak: true,
  spacing: { before: 200, after: 200 },
});

const cell = (text, isHeader = false, width = 2000) => new TableCell({
  children: [new Paragraph({
    children: [new TextRun({ text, bold: isHeader, size: isHeader ? 20 : 20 })],
    alignment: AlignmentType.LEFT,
  })],
  width: { size: width, type: WidthType.DXA },
  shading: isHeader ? { fill: 'D9E2F3', type: ShadingType.CLEAR } : undefined,
  verticalAlign: VerticalAlign.CENTER,
  margins: { top: 80, bottom: 80, left: 120, right: 120 },
});

const tableRow = (cells, isHeader = false) => new TableRow({
  children: cells.map((c, i) => cell(c, isHeader, i === 0 ? 2500 : 3500)),
  tableHeader: isHeader,
});

const simpleTable = (headers, rows) => new Table({
  rows: [
    tableRow(headers, true),
    ...rows.map(r => tableRow(r, false)),
  ],
  width: { size: 9000, type: WidthType.DXA },
  margins: { top: 80, bottom: 80, left: 120, right: 120 },
});

// ─── DOCUMENTO 1: DOCUMENTACIÓN TÉCNICA ─────────────────────────────────────

function buildDocTecnico() {
  const children = [

    // PORTADA
    new Paragraph({ spacing: { before: 2000, after: 400 } }),
    new Paragraph({
      children: [new TextRun({ text: 'DOCUMENTACIÓN TÉCNICA', bold: true, size: 52, color: '1F3864' })],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Sistema FIA — Pollo Fiesta S.A.', bold: true, size: 36, color: '2E74B5' })],
      alignment: AlignmentType.CENTER, spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Plataforma de Inteligencia de Negocios', size: 28, italics: true, color: '595959' })],
      alignment: AlignmentType.CENTER, spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Asamblea General de Accionistas 2025', size: 26, color: '595959' })],
      alignment: AlignmentType.CENTER, spacing: { after: 600 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'https://asamblea-2025pf.up.railway.app', size: 22, color: '2E74B5' })],
      alignment: AlignmentType.CENTER, spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Versión 1.0  ·  Marzo 2025', size: 22, color: '595959' })],
      alignment: AlignmentType.CENTER,
    }),
    pageBreak(),

    // 1. DESCRIPCIÓN GENERAL
    h1('1. Descripción General del Sistema'),
    p('FIA - Pollo Fiesta es una plataforma web de Business Intelligence (BI) desarrollada para la presentación de resultados de gestión en la Asamblea General de Accionistas 2025 de Pollo Fiesta S.A.'),
    p('El sistema integra datos operativos, financieros, comerciales y de talento humano en más de 50 dashboards interactivos, organizados por área de gestión.'),
    new Paragraph({ children: [bold('URL de producción: '), normal('https://asamblea-2025pf.up.railway.app')], spacing: { after: 120 } }),
    new Paragraph({ children: [bold('Repositorio: '), normal('https://github.com/JuanRojasB/fia_PF')], spacing: { after: 120 } }),

    // 2. ARQUITECTURA
    h1('2. Arquitectura del Sistema'),
    h2('2.1 Arquitectura General'),
    p('El sistema sigue una arquitectura cliente-servidor con separación clara entre frontend y backend, desplegados como servicios independientes en Railway.'),
    bullet('Cliente (Browser): React 19 + Vite + Tailwind CSS'),
    bullet('Backend (Node.js / Express): Arquitectura Limpia (Clean Architecture), Puerto 3001'),
    bullet('Base de Datos: MariaDB — erp_pollo_fiesta — Railway MySQL, 50+ tablas y vistas'),
    p('La comunicación entre capas se realiza mediante HTTPS / REST API con autenticación JWT (Authorization: Bearer <token>).'),

    h2('2.2 Arquitectura del Backend — Clean Architecture'),
    p('El backend implementa Clean Architecture con 4 capas bien definidas:'),
    bullet('presentation/ — Controladores, middlewares y rutas (AuthController, DashboardController)'),
    bullet('application/ — Casos de uso (LoginUseCase, GetDashboardDataUseCase)'),
    bullet('domain/ — Entidades y contratos de repositorios (User, IUserRepository, IDashboardRepository)'),
    bullet('infrastructure/ — Implementaciones concretas (Pool MariaDB, UserRepository, DashboardRepository)'),
    pageBreak(),

    // 3. STACK TECNOLÓGICO
    h1('3. Stack Tecnológico'),
    h2('3.1 Backend'),
    simpleTable(
      ['Tecnología', 'Versión / Uso'],
      [
        ['Node.js', '≥ 20.0.0 — Runtime principal'],
        ['Express', '4.21.0 — Framework HTTP'],
        ['mysql2', '3.11.0 — Driver MariaDB/MySQL'],
        ['jsonwebtoken', '9.0.2 — Autenticación JWT'],
        ['cors', '2.8.5 — Cross-Origin Resource Sharing'],
        ['dotenv', '16.4.5 — Variables de entorno'],
        ['nodemon', '3.1.0 — Hot reload en desarrollo'],
      ]
    ),
    new Paragraph({ spacing: { after: 200 } }),
    h2('3.2 Frontend'),
    simpleTable(
      ['Tecnología', 'Versión / Uso'],
      [
        ['React', '19.2.0 — UI Framework principal'],
        ['Vite', '7.3.1 — Build tool y servidor de desarrollo'],
        ['React Router DOM', '7.13.1 — Enrutamiento SPA'],
        ['Tailwind CSS', '3.4.1 — Estilos utilitarios'],
        ['Framer Motion', '12.34.3 — Animaciones y transiciones'],
        ['Recharts', '3.7.0 — Gráficas y visualizaciones'],
        ['Lucide React', '0.575.0 — Iconografía'],
        ['Axios', '1.13.6 — Cliente HTTP'],
        ['qrcode.react', '4.2.0 — Generación de códigos QR'],
      ]
    ),
    new Paragraph({ spacing: { after: 200 } }),
    pageBreak(),

    // 4. CONFIGURACIÓN Y VARIABLES DE ENTORNO
    h1('4. Configuración y Variables de Entorno'),
    h2('4.1 Backend — .env'),
    p('El archivo .env del backend debe configurarse con las siguientes variables:'),
    code('MYSQL_URL=mysql://user:password@host:port/database'),
    code('DB_HOST=localhost'),
    code('DB_USER=root'),
    code('DB_PASSWORD='),
    code('DB_NAME=erp_pollo_fiesta'),
    code('DB_PORT=3306'),
    code('PORT=3001'),
    code('NODE_ENV=production'),
    code('CORS_ORIGIN=*'),
    code('JWT_SECRET=fia-dashboard-secret-2025'),
    code('JWT_EXPIRATION=24h'),

    h2('4.2 Frontend — .env'),
    code('VITE_API_URL=https://asamblea-2025pf.up.railway.app'),

    h2('4.3 Detección Automática de Entorno'),
    bullet('Railway (producción): usa MYSQL_URL o MYSQL_PUBLIC_URL inyectada automáticamente'),
    bullet('Local (desarrollo): usa variables DB_HOST, DB_USER, DB_PASSWORD, DB_NAME'),
    p('Pool de conexiones: 10 conexiones concurrentes, waitForConnections: true, charset utf8mb4.'),
    pageBreak(),

    // 5. API REST
    h1('5. API REST — Endpoints'),
    h2('5.1 Autenticación'),
    simpleTable(
      ['Método + Endpoint', 'Auth requerida / Descripción'],
      [
        ['POST /api/auth/login', 'No — Iniciar sesión con usuario y contraseña'],
        ['POST /api/auth/logout', 'JWT — Cerrar sesión'],
        ['GET /api/auth/verify', 'JWT — Verificar validez del token'],
        ['GET /health', 'No — Health check del servidor'],
      ]
    ),
    new Paragraph({ spacing: { after: 200 } }),
    p('Ejemplo de request de login:'),
    code('POST /api/auth/login'),
    code('{ "username": "admin", "password": "password123" }'),
    p('Respuesta exitosa:'),
    code('{ "success": true, "token": "eyJhbGci...", "user": { "id": 1, "username": "admin", "role": "admin" } }'),

    h2('5.2 Dashboards'),
    simpleTable(
      ['Método + Endpoint', 'Descripción'],
      [
        ['GET /api/dashboard/summary', 'Lista de dashboards disponibles'],
        ['GET /api/dashboard/:type', 'Datos de un dashboard específico por tipo'],
      ]
    ),
    new Paragraph({ spacing: { after: 200 } }),
    p('Todos los endpoints de dashboard requieren el header: Authorization: Bearer <token>'),
    p('El token JWT tiene vigencia de 24 horas.'),
    pageBreak(),

    // 6. BASE DE DATOS
    h1('6. Base de Datos'),
    h2('6.1 Estructura General'),
    p('Base de datos: erp_pollo_fiesta (MariaDB). El sistema utiliza vistas SQL para abstraer la complejidad de las consultas y mejorar el rendimiento.'),
    h2('6.2 Vistas Principales'),
    simpleTable(
      ['Vista SQL', 'Descripción'],
      [
        ['vista_com_analisis_ventas', 'Ventas por categoría 2024 vs 2025'],
        ['vista_com_kpi_pollo_entero', 'KPIs pollo entero 2023-2025'],
        ['vista_com_unidades_procesadas', 'Unidades procesadas por centro'],
        ['vista_com_huevo_comparativo_multianual', 'Comparativo huevo multianual'],
        ['vista_com_pdv_participacion_zona_2024', 'Participación PDV por zona'],
      ]
    ),
    new Paragraph({ spacing: { after: 200 } }),
    h2('6.3 Patrón de Conexión — Singleton'),
    p('El pool de conexiones se implementa como Singleton para reutilizar conexiones eficientemente:'),
    code('const { getInstance } = require("../database/connection");'),
    code('const db = getInstance();'),
    code('const pool = db.getPool();'),
    code('const [rows] = await pool.query("SELECT * FROM vista_com_analisis_ventas");'),
    pageBreak(),

    // 7. SEGURIDAD
    h1('7. Autenticación y Seguridad'),
    h2('7.1 Flujo de Autenticación'),
    bullet('1. Usuario ingresa credenciales en /login'),
    bullet('2. Frontend envía POST /api/auth/login'),
    bullet('3. Backend valida usuario en BD (UserRepository)'),
    bullet('4. Si válido → genera JWT (24h) con { id, username, role }'),
    bullet('5. Frontend almacena token en localStorage'),
    bullet('6. Cada request incluye: Authorization: Bearer <token>'),
    bullet('7. Middleware verifyToken valida en cada endpoint protegido'),
    h2('7.2 Roles de Usuario'),
    simpleTable(
      ['Rol', 'Permisos'],
      [
        ['admin', 'Acceso total a todos los dashboards y funciones'],
        ['analyst', 'Acceso a dashboards de análisis'],
        ['user', 'Acceso básico de lectura'],
      ]
    ),
    new Paragraph({ spacing: { after: 200 } }),
    pageBreak(),

    // 8. ESTRUCTURA FRONTEND
    h1('8. Estructura del Frontend'),
    h2('8.1 Árbol de Directorios'),
    code('frontend/src/'),
    code('├── App.jsx                    ← Entry point, SplashScreen'),
    code('├── assets/                    ← Imágenes (logos, estados financieros)'),
    code('├── components/'),
    code('│   ├── Sidebar.jsx            ← Navegación lateral colapsable'),
    code('│   ├── SectionSplash.jsx      ← Animación de transición entre secciones'),
    code('│   ├── CollapsibleChart.jsx   ← Wrapper para gráficas desplegables'),
    code('│   ├── CollapsibleTable.jsx   ← Wrapper para tablas desplegables'),
    code('│   ├── AISearch.jsx           ← Búsqueda con IA'),
    code('│   └── dashboards/            ← 50+ componentes de dashboard'),
    code('├── pages/'),
    code('│   └── Dashboard.jsx          ← Página principal con navegación'),
    code('├── routes/                    ← React Router configuración'),
    code('└── services/'),
    code('    ├── authService.js         ← Login/logout/token'),
    code('    └── dashboardService.js    ← Fetch de datos por tipo'),

    h2('8.2 Componente Dashboard.jsx — Flujo Principal'),
    p('Dashboard.jsx es el orquestador principal. Gestiona:'),
    bullet('Estado activeSection: sección actualmente visible'),
    bullet('Estado dashboardData: datos cargados desde el backend'),
    bullet('mainSections: mapa de secciones padre → hijos'),
    bullet('allSections: lista ordenada para navegación prev/next'),
    bullet('handleSectionChange(): actualiza URL + carga datos del backend'),
    bullet('goToPreviousSection() / goToNextSection(): navegación secuencial'),
    bullet('Renderiza: <Sidebar>, <SectionSplash>, <DashboardRenderer>, botones Anterior/Siguiente'),

    h2('8.3 DashboardRenderer'),
    p('DashboardRenderer.jsx actúa como un switch que mapea el type (string) al componente React correspondiente. Recibe data del backend y onNavigate para navegación programática.'),

    h2('8.4 Sidebar — Navegación'),
    bullet('Colapsable en desktop (icono ↔ texto completo)'),
    bullet('Menú hamburguesa en mobile'),
    bullet('Secciones expandibles con subitems'),
    bullet('Sonido al navegar (audio.play)'),
    bullet('Botón Agradecimientos fijo con ícono Trophy (dorado)'),
    bullet('Botón FIA flotante (logo circular) → abre Orden del Día'),
    pageBreak(),

    // 9. CATÁLOGO DE DASHBOARDS
    h1('9. Catálogo Completo de Dashboards'),
    h2('9.1 Sección Bienvenida'),
    simpleTable(
      ['ID de Sección', 'Descripción'],
      [
        ['bienvenida-principal', 'Pantalla de bienvenida con logo animado'],
        ['contexto-mundial', 'Contexto avícola mundial'],
        ['entorno-socioeconomico', 'Entorno macroeconómico Colombia'],
        ['encasetamiento-colombia', 'Encasetamiento sector avícola'],
        ['negocio-marcha', 'El negocio en marcha'],
      ]
    ),
    new Paragraph({ spacing: { after: 200 } }),
    h2('9.2 Sección Producción'),
    simpleTable(
      ['ID de Sección', 'Descripción'],
      [
        ['produccion-granjas', 'Capacidad y distribución de granjas'],
        ['produccion-encasetado', 'Programado vs real encasetado'],
        ['produccion-pollo-entregado', 'Histórico pollo entregado'],
        ['produccion-huevos', 'Producción de huevos'],
        ['produccion-indicadores', 'KPIs de producción'],
      ]
    ),
    new Paragraph({ spacing: { after: 200 } }),
    h2('9.3 Sección Comercial'),
    simpleTable(
      ['ID de Sección', 'Descripción'],
      [
        ['comercial-estructura-equipo', 'Estructura del equipo comercial'],
        ['comercial-resumen', 'Resumen comercial general'],
        ['comercial-ventas-compania', 'Ventas totales compañía'],
        ['comercial-pollo-entero', 'Canal pollo entero'],
        ['comercial-productos', 'Líneas de producto'],
        ['comercial-asadero', 'Canal asadero (Sede 1)'],
        ['comercial-institucional', 'Canal institucional (Sede 3)'],
        ['comercial-huevo', 'Canal huevo'],
        ['comercial-pdv', 'Puntos de venta (22 PDV, 7 coordinadores)'],
      ]
    ),
    new Paragraph({ spacing: { after: 200 } }),
    h2('9.4 Sección Logística'),
    simpleTable(
      ['ID de Sección', 'Descripción'],
      [
        ['logistica-consolidado', 'Análisis consolidado logística'],
        ['logistica-sede1', 'Logística Sede 1 (Asadero)'],
        ['logistica-sede2', 'Logística Sede 2 (Congelados)'],
        ['logistica-sede3', 'Logística Sede 3 (Institucional)'],
      ]
    ),
    new Paragraph({ spacing: { after: 200 } }),
    h2('9.5 Sección Operaciones'),
    simpleTable(
      ['ID de Sección', 'Descripción'],
      [
        ['operaciones-tpm', 'Mantenimiento Productivo Total (TPM)'],
        ['operaciones-ot', 'Órdenes de trabajo'],
        ['operaciones-vehiculos', 'Flota vehicular'],
        ['operaciones-arquitectura', 'Arquitectura de planta'],
      ]
    ),
    new Paragraph({ spacing: { after: 200 } }),
    h2('9.6 Sección Marketing'),
    simpleTable(
      ['ID de Sección', 'Descripción'],
      [
        ['marketing-detalle', 'Análisis detallado: presupuesto, digital, fortalezas/oportunidades'],
      ]
    ),
    new Paragraph({ spacing: { after: 200 } }),
    h2('9.7 Sección Gestión Humana'),
    simpleTable(
      ['ID de Sección', 'Descripción'],
      [
        ['humana-nomina', 'Costos de nómina y planta de personal'],
        ['humana-rotacion', 'Rotación de personal'],
        ['humana-causas', 'Causas de desvinculación'],
        ['humana-smlv', 'Impacto del salario mínimo'],
      ]
    ),
    new Paragraph({ spacing: { after: 200 } }),
    h2('9.8 Sección Gerencia Estratégica'),
    simpleTable(
      ['ID de Sección', 'Descripción'],
      [
        ['gerencia-estrategica-calidad', 'Aseguramiento de calidad'],
        ['gerencia-estrategica-compras', 'Gestión de compras'],
        ['gerencia-estrategica-bienestar', 'Bienestar animal'],
        ['gerencia-estrategica-hseq', 'Seguridad y salud en el trabajo (HSEQ)'],
        ['gerencia-estrategica-ambiental', 'Gestión ambiental'],
        ['gerencia-estrategica-sgc', 'Sistema de gestión de calidad (SGC)'],
        ['gerencia-estrategica-satisfaccion', 'Satisfacción del cliente'],
      ]
    ),
    new Paragraph({ spacing: { after: 200 } }),
    h2('9.9 Otras Secciones'),
    simpleTable(
      ['ID de Sección', 'Descripción'],
      [
        ['auditoria', 'Auditoría interna y devoluciones'],
        ['cartera', 'Gestión de cartera y morosidad'],
        ['fuentes-usos', 'Fuentes y usos de fondos'],
        ['situacion-economica', 'Indicadores financieros'],
        ['situacion-juridica', 'Situación jurídica'],
        ['presupuesto-2025', 'Presupuesto y ejecución 2025'],
        ['sagrilaft', 'Sistema SAGRILAFT'],
        ['planta-beneficio', 'Planta de beneficio'],
        ['compras', 'Compras de insumos'],
        ['gerencia', 'Indicadores gerenciales'],
        ['agradecimientos', 'Cierre con animación, carta y QR'],
      ]
    ),
    new Paragraph({ spacing: { after: 200 } }),
    pageBreak(),

    // 10. DESPLIEGUE
    h1('10. Despliegue en Railway'),
    h2('10.1 Proceso de Despliegue'),
    p('El despliegue es automático mediante integración con GitHub. Al hacer push a la rama main, Railway detecta el cambio, ejecuta el build con NIXPACKS y despliega el nuevo contenedor.'),
    code('git add -A'),
    code('git commit -m "descripción del cambio"'),
    code('git push origin main'),
    p('Railway despliega automáticamente en: https://asamblea-2025pf.up.railway.app'),

    h2('10.2 Configuración Backend (railway.json)'),
    code('{ "build": { "builder": "NIXPACKS" },'),
    code('  "deploy": { "startCommand": "npm start",'),
    code('    "restartPolicyType": "ON_FAILURE", "restartPolicyMaxRetries": 10 } }'),

    h2('10.3 Configuración Frontend (railway.json)'),
    code('{ "build": { "builder": "NIXPACKS" },'),
    code('  "deploy": { "startCommand": "npm run preview -- --host 0.0.0.0 --port $PORT",'),
    code('    "restartPolicyType": "ON_FAILURE", "restartPolicyMaxRetries": 10 } }'),
    pageBreak(),

    // 11. EJECUCIÓN LOCAL
    h1('11. Ejecución Local'),
    h2('11.1 Requisitos'),
    bullet('Node.js ≥ 20.0.0'),
    bullet('npm ≥ 10.0.0'),
    bullet('MariaDB / MySQL local o acceso a Railway DB'),

    h2('11.2 Backend'),
    code('cd backend'),
    code('cp .env.example .env   # Editar con credenciales de BD local'),
    code('npm install'),
    code('npm run dev            # Desarrollo con nodemon'),

    h2('11.3 Frontend'),
    code('cd frontend'),
    code('cp .env.example .env   # Editar VITE_API_URL=http://localhost:3001'),
    code('npm install'),
    code('npm run dev            # Servidor de desarrollo Vite'),

    h2('11.4 Verificar Conexión BD'),
    code('cd backend && npm run test-connection'),
    pageBreak(),

    // 12. PATRONES Y CONVENCIONES
    h1('12. Patrones y Convenciones de Código'),
    h2('12.1 Estructura de Componentes Dashboard'),
    p('Todos los dashboards siguen el mismo patrón:'),
    bullet('1. Estado local (modales, tabs activos, etc.)'),
    bullet('2. Validación de datos recibidos del backend'),
    bullet('3. Funciones de formato (formatNumber, formatMillones)'),
    bullet('4. Cálculos derivados'),
    bullet('5. Return JSX: Header con gradiente → Grid de KPI cards → CollapsibleChart → Modal via createPortal'),

    h2('12.2 KPI Cards'),
    p('Los KPI cards clickeables muestran:'),
    bullet('Valor principal 2025'),
    bullet('Fila 2024 (omitida si es placeholder como "N/A", "Base 2024", "Ref. 2024")'),
    bullet('Variación porcentual (verde si positivo/bueno, rojo si negativo/malo)'),
    bullet('Modal con detalle al hacer click'),

    h2('12.3 Modales'),
    p('Todos los modales usan createPortal(content, document.body) con AnimatePresence de Framer Motion para animaciones de entrada/salida suaves.'),

    h2('12.4 Gráficas'),
    p('Se usa CollapsibleChart como wrapper para todas las gráficas Recharts, permitiendo expandir/colapsar con animación. Esto mejora la experiencia en pantallas pequeñas.'),

    separator(),
    new Paragraph({
      children: [new TextRun({ text: 'Documentación Técnica — FIA Pollo Fiesta S.A. — Marzo 2025', size: 18, italics: true, color: '595959' })],
      alignment: AlignmentType.CENTER,
    }),
  ];

  return new Document({
    styles: {
      default: {
        document: { run: { font: 'Calibri', size: 22 } },
      },
      paragraphStyles: [
        {
          id: 'Heading1', name: 'Heading 1',
          run: { bold: true, size: 32, color: '1F3864' },
          paragraph: { spacing: { before: 400, after: 200 } },
        },
        {
          id: 'Heading2', name: 'Heading 2',
          run: { bold: true, size: 26, color: '2E74B5' },
          paragraph: { spacing: { before: 300, after: 150 } },
        },
        {
          id: 'Heading3', name: 'Heading 3',
          run: { bold: true, size: 24, color: '2E74B5' },
          paragraph: { spacing: { before: 200, after: 100 } },
        },
      ],
    },
    sections: [{
      properties: {},
      children,
    }],
  });
}

// ─── DOCUMENTO 2: MANUAL DE USUARIO ─────────────────────────────────────────

function buildManualUsuario() {
  const children = [

    // PORTADA
    new Paragraph({ spacing: { before: 2000, after: 400 } }),
    new Paragraph({
      children: [new TextRun({ text: 'MANUAL DE USUARIO', bold: true, size: 52, color: '1F3864' })],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Sistema FIA — Pollo Fiesta S.A.', bold: true, size: 36, color: '2E74B5' })],
      alignment: AlignmentType.CENTER, spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Plataforma de Inteligencia de Negocios', size: 28, italics: true, color: '595959' })],
      alignment: AlignmentType.CENTER, spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Asamblea General de Accionistas 2025', size: 26, color: '595959' })],
      alignment: AlignmentType.CENTER, spacing: { after: 600 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Guía para usuarios finales — No se requieren conocimientos técnicos', size: 22, italics: true, color: '595959' })],
      alignment: AlignmentType.CENTER, spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Versión 1.0  ·  Marzo 2025', size: 22, color: '595959' })],
      alignment: AlignmentType.CENTER,
    }),
    pageBreak(),

    // 1. ¿QUÉ ES FIA?
    h1('1. ¿Qué es el Sistema FIA?'),
    p('FIA (Foro de Inteligencia de Accionistas) es la plataforma digital de Pollo Fiesta S.A. diseñada para presentar los resultados de gestión del año 2024-2025 durante la Asamblea General de Accionistas.'),
    p('A través de esta plataforma, los accionistas y directivos pueden visualizar de forma clara y visual los indicadores clave de todas las áreas de la empresa: producción, ventas, logística, finanzas, talento humano, calidad y más.'),
    new Paragraph({ children: [bold('¿Qué puedo ver en FIA?')], spacing: { after: 100 } }),
    bullet('Más de 50 dashboards interactivos con datos reales de la empresa'),
    bullet('Gráficas comparativas 2024 vs 2025'),
    bullet('Indicadores clave (KPIs) por área'),
    bullet('Tablas detalladas con información de ventas, producción y logística'),
    bullet('Información de puntos de venta y coordinadores comerciales'),
    pageBreak(),

    // 2. CÓMO ACCEDER
    h1('2. Cómo Acceder al Sistema'),
    h2('2.1 Desde el Navegador Web'),
    p('El sistema funciona directamente en el navegador web. No requiere instalar ningún programa.'),
    new Paragraph({ children: [bold('URL de acceso: '), new TextRun({ text: 'https://asamblea-2025pf.up.railway.app', size: 22, color: '2E74B5' })], spacing: { after: 120 } }),
    p('Navegadores recomendados: Google Chrome, Microsoft Edge o Mozilla Firefox (versiones recientes).'),

    h2('2.2 Inicio de Sesión'),
    p('Al ingresar a la URL, verá la pantalla de inicio de sesión. Siga estos pasos:'),
    bullet('Paso 1: Ingrese su nombre de usuario en el campo "Usuario"'),
    bullet('Paso 2: Ingrese su contraseña en el campo "Contraseña"'),
    bullet('Paso 3: Haga clic en el botón "Ingresar"'),
    p('Si las credenciales son correctas, verá una animación de bienvenida y será redirigido al dashboard principal.'),
    p('Nota: Si no recuerda sus credenciales, contacte al administrador del sistema.'),

    h2('2.3 Cerrar Sesión'),
    p('Para cerrar sesión de forma segura, haga clic en el ícono de salida (flecha hacia afuera) ubicado en la parte inferior del menú lateral izquierdo.'),
    pageBreak(),

    // 3. NAVEGACIÓN
    h1('3. Navegación por el Sistema'),
    h2('3.1 El Menú Lateral (Sidebar)'),
    p('El menú lateral es la barra de navegación ubicada en el lado izquierdo de la pantalla. Desde allí puede acceder a todas las secciones del sistema.'),
    new Paragraph({ children: [bold('Cómo usarlo:')], spacing: { after: 100 } }),
    bullet('Haga clic en el nombre de una sección para expandirla y ver sus subsecciones'),
    bullet('Haga clic en una subsección para ver ese dashboard'),
    bullet('En computadores, puede colapsar el menú haciendo clic en el ícono de flecha para tener más espacio'),
    bullet('En celulares, use el ícono de menú (☰) en la esquina superior izquierda para abrir el menú'),

    h2('3.2 Secciones Disponibles en el Menú'),
    simpleTable(
      ['Sección', 'Qué contiene'],
      [
        ['Bienvenida', 'Pantalla inicial, contexto mundial y entorno económico'],
        ['Producción', 'Granjas, encasetado, pollo entregado, huevos, indicadores'],
        ['Comercial', 'Ventas por canal, puntos de venta, equipo comercial'],
        ['Logística', 'Costos logísticos por sede (Asadero, Congelados, Institucional)'],
        ['Operaciones', 'Mantenimiento, órdenes de trabajo, vehículos, planta'],
        ['Marketing', 'Análisis detallado de marketing y estrategia'],
        ['Gestión Humana', 'Nómina, rotación, causas de desvinculación, salario mínimo'],
        ['Gerencia Estratégica', 'Calidad, compras, bienestar animal, HSEQ, ambiental, SGC'],
        ['Auditoría', 'Auditoría interna y devoluciones'],
        ['Cartera', 'Gestión de cartera y morosidad'],
        ['Fuentes y Usos', 'Balance de activos, pasivos y patrimonio'],
        ['Situación Económica', 'Indicadores financieros de la empresa'],
        ['Situación Jurídica', 'Estado jurídico de la empresa'],
        ['Presupuesto 2025', 'Variables macroeconómicas y ejecución presupuestal'],
        ['SAGRILAFT', 'Cumplimiento del sistema antilavado'],
        ['Planta de Beneficio', 'Indicadores de la planta de beneficio'],
        ['Compras', 'Compras de insumos y materias primas'],
        ['Gerencia', 'Indicadores gerenciales consolidados'],
        ['Agradecimientos', 'Carta de cierre con QR de acceso'],
      ]
    ),
    new Paragraph({ spacing: { after: 200 } }),

    h2('3.3 Botones Anterior y Siguiente'),
    p('En la parte inferior de cada dashboard encontrará dos botones de navegación:'),
    bullet('← Anterior: va al dashboard anterior en el orden de la presentación'),
    bullet('Siguiente →: avanza al siguiente dashboard'),
    p('Estos botones permiten recorrer toda la presentación en orden, como si fuera una diapositiva.'),
    pageBreak(),

    // 4. BOTONES ESPECIALES
    h1('4. Botones Especiales'),
    h2('4.1 Botón FIA (Logo Circular)'),
    p('En la esquina inferior izquierda del menú encontrará un botón circular con el logo de Pollo Fiesta. Al hacer clic, se abre la Orden del Día de la asamblea.'),
    p('Este botón está siempre visible para acceder rápidamente al programa de la reunión.'),

    h2('4.2 Botón Agradecimientos (Trofeo Dorado)'),
    p('En la parte inferior del menú lateral hay un botón con ícono de trofeo dorado. Al hacer clic, lo lleva directamente a la sección de Agradecimientos, que es el cierre de la presentación.'),
    pageBreak(),

    // 5. CÓMO LEER LOS DASHBOARDS
    h1('5. Cómo Leer los Dashboards'),
    h2('5.1 Tarjetas de Indicadores (KPI Cards)'),
    p('Los KPI (Key Performance Indicators) son las tarjetas de colores que muestran los indicadores más importantes de cada área. Cada tarjeta muestra:'),
    bullet('Nombre del indicador (ej: "Ventas Totales", "Rotación de Personal")'),
    bullet('Valor del año 2025 (número principal, grande)'),
    bullet('Valor del año 2024 para comparación (cuando está disponible)'),
    bullet('Variación porcentual: en verde si mejoró, en rojo si empeoró'),
    p('Al hacer clic en una tarjeta KPI, se abre un panel con información detallada y contexto adicional del indicador.'),

    h2('5.2 Gráficas'),
    p('Las gráficas muestran tendencias y comparaciones visuales. Algunas están colapsadas por defecto para ahorrar espacio. Para verlas:'),
    bullet('Haga clic en el título de la gráfica o en el ícono de flecha (▼) para expandirla'),
    bullet('Haga clic de nuevo para colapsarla'),
    p('Puede pasar el cursor sobre las barras o líneas de la gráfica para ver los valores exactos en un tooltip.'),

    h2('5.3 Tablas de Datos'),
    p('Algunas secciones incluyen tablas con información detallada. Al igual que las gráficas, pueden estar colapsadas. Haga clic en el encabezado para expandirlas.'),

    h2('5.4 Modales de Detalle'),
    p('Al hacer clic en una tarjeta KPI, se abre una ventana emergente (modal) con información adicional. Para cerrarla:'),
    bullet('Haga clic en el botón "✕" en la esquina superior derecha del modal'),
    bullet('O haga clic fuera del modal (en el área oscura)'),
    pageBreak(),

    // 6. SECCIÓN POR SECCIÓN
    h1('6. Guía por Sección'),
    h2('6.1 Bienvenida'),
    p('La sección de Bienvenida es la pantalla inicial de la presentación. Incluye:'),
    bullet('Pantalla de bienvenida con el logo de Pollo Fiesta animado'),
    bullet('Contexto mundial del sector avícola'),
    bullet('Entorno socioeconómico de Colombia'),
    bullet('Encasetamiento del sector avícola colombiano'),
    bullet('El negocio en marcha: resumen ejecutivo'),

    h2('6.2 Producción'),
    p('Muestra los resultados del área de producción avícola:'),
    bullet('Granjas: capacidad instalada y distribución geográfica'),
    bullet('Encasetado: comparativo entre lo programado y lo ejecutado'),
    bullet('Pollo Entregado: histórico de unidades entregadas por período'),
    bullet('Huevos: producción de huevos por período'),
    bullet('Indicadores: KPIs clave de producción'),

    h2('6.3 Comercial'),
    p('Presenta los resultados del área comercial y de ventas:'),
    bullet('Estructura del equipo: organigrama y distribución del equipo comercial'),
    bullet('Ventas Compañía: ventas totales consolidadas'),
    bullet('Pollo Entero: resultados del canal de pollo entero'),
    bullet('Productos: desempeño por línea de producto'),
    bullet('Asadero: ventas del canal asadero (Sede 1)'),
    bullet('Institucional: ventas del canal institucional (Sede 3)'),
    bullet('Huevo: ventas del canal de huevo'),
    bullet('Puntos de Venta (PDV): 22 puntos de venta distribuidos en 7 zonas con sus coordinadores'),

    h2('6.4 Puntos de Venta — Detalle por Coordinador'),
    p('La sección de PDV muestra la distribución de los 22 puntos de venta por coordinador:'),
    simpleTable(
      ['Coordinador', 'Zona / PDV a cargo'],
      [
        ['Elmira González', '7 PDV — Zona Sur (Bogotá · Tunja · Sogamoso · Chiquinquirá)'],
        ['Michael Arias', '5 PDV — Zona Norte'],
        ['Julián Mora', '5 PDV — Casanare (Yopal)'],
        ['John Ramírez', '2 PDV — Boyacá'],
        ['Adriana', '1 PDV — Chiquinquirá'],
        ['Iván Romero', '1 PDV — Guadalupe'],
        ['Belisario Eguis', '1 PDV — Visión Colombia'],
      ]
    ),
    new Paragraph({ spacing: { after: 200 } }),

    h2('6.5 Logística'),
    p('Muestra los costos y eficiencia logística por sede:'),
    bullet('Consolidado: análisis general de logística'),
    bullet('Sede 1 (Asadero): logística del canal asadero'),
    bullet('Sede 2 (Congelados): logística del canal de congelados'),
    bullet('Sede 3 (Institucional): logística del canal institucional'),

    h2('6.6 Operaciones'),
    p('Indicadores del área de operaciones y mantenimiento:'),
    bullet('TPM (Mantenimiento Productivo Total): eficiencia de equipos'),
    bullet('Órdenes de Trabajo: gestión de mantenimiento correctivo y preventivo'),
    bullet('Vehículos: estado y gestión de la flota vehicular'),
    bullet('Arquitectura: proyectos de infraestructura de planta'),

    h2('6.7 Marketing'),
    p('Análisis del área de marketing:'),
    bullet('Presupuesto de marketing: ejecución vs presupuesto asignado'),
    bullet('Balance Estratégico: fortalezas y oportunidades identificadas'),

    h2('6.8 Gestión Humana'),
    p('Indicadores del área de talento humano:'),
    bullet('Nómina: costos de nómina y planta de personal'),
    bullet('Rotación: índice de rotación de personal'),
    bullet('Causas de Desvinculación: análisis de motivos de salida'),
    bullet('Impacto SMLV: efecto del incremento del salario mínimo'),

    h2('6.9 Gerencia Estratégica'),
    p('Indicadores de las áreas de soporte estratégico:'),
    bullet('Aseguramiento de Calidad: no conformidades, énfasis del año'),
    bullet('Gestión de Compras: indicadores de abastecimiento'),
    bullet('Bienestar Animal: cumplimiento de estándares de bienestar'),
    bullet('HSEQ: seguridad y salud en el trabajo, accidentalidad'),
    bullet('Gestión Ambiental: indicadores ambientales'),
    bullet('SGC: sistema de gestión de calidad ISO'),
    bullet('Satisfacción del Cliente: NPS y encuestas de satisfacción'),

    h2('6.10 Auditoría'),
    p('Resultados del área de auditoría interna:'),
    bullet('Auditorías PDV: 238 auditorías en zona Bogotá/Tunja/Sogamoso/Chiquinquirá + 24 en Yopal'),
    bullet('Devoluciones: análisis de devoluciones por causa'),
    bullet('Control interno: hallazgos y seguimiento'),

    h2('6.11 Cartera'),
    p('Gestión de la cartera de clientes:'),
    bullet('Saldo de cartera por antigüedad'),
    bullet('Índice de morosidad'),
    bullet('Clientes con mayor cartera vencida'),

    h2('6.12 Situación Económica y Financiera'),
    p('Indicadores financieros de la empresa:'),
    bullet('Fuentes y Usos: balance de activos, pasivos y patrimonio'),
    bullet('Situación Económica: rentabilidad, liquidez, endeudamiento'),
    bullet('Presupuesto 2025: variables macroeconómicas (inflación, TRM, tasas) y ejecución'),

    h2('6.13 Agradecimientos'),
    p('La sección de Agradecimientos es el cierre de la presentación. Incluye:'),
    bullet('Animación de confeti y celebración'),
    bullet('Logo de Pollo Fiesta con animación giratoria'),
    bullet('Carta de agradecimiento a los accionistas'),
    bullet('Código QR para acceder al sistema desde cualquier dispositivo'),
    pageBreak(),

    // 7. CÓDIGO QR
    h1('7. Código QR de Acceso'),
    p('Al final de la sección de Agradecimientos encontrará un código QR. Este código le permite acceder al sistema FIA desde su celular o tablet de forma rápida.'),
    new Paragraph({ children: [bold('¿Cómo usarlo?')], spacing: { after: 100 } }),
    bullet('Paso 1: Abra la cámara de su celular'),
    bullet('Paso 2: Apunte la cámara al código QR en la pantalla'),
    bullet('Paso 3: Toque el enlace que aparece en la pantalla de su celular'),
    bullet('Paso 4: Se abrirá el sistema FIA en el navegador de su celular'),
    p('El QR apunta a: https://asamblea-2025pf.up.railway.app'),
    pageBreak(),

    // 8. PREGUNTAS FRECUENTES
    h1('8. Preguntas Frecuentes'),
    new Paragraph({ children: [bold('¿Qué hago si no puedo iniciar sesión?')], spacing: { after: 80 } }),
    p('Verifique que está escribiendo correctamente su usuario y contraseña. Si el problema persiste, contacte al administrador del sistema.'),
    new Paragraph({ children: [bold('¿Los datos se actualizan en tiempo real?')], spacing: { after: 80 } }),
    p('Los datos mostrados corresponden al período de cierre preparado para la Asamblea 2025. No se actualizan en tiempo real durante la presentación.'),
    new Paragraph({ children: [bold('¿Puedo ver el sistema desde mi celular?')], spacing: { after: 80 } }),
    p('Sí. El sistema es responsivo y funciona en celulares y tablets. Use el código QR de la sección de Agradecimientos para acceder fácilmente.'),
    new Paragraph({ children: [bold('¿Qué significa el color verde/rojo en los KPIs?')], spacing: { after: 80 } }),
    p('Verde indica que el indicador mejoró o está por encima de la meta. Rojo indica que el indicador empeoró o está por debajo de la meta. El criterio de "bueno" o "malo" depende de cada indicador.'),
    new Paragraph({ children: [bold('¿Cómo veo el detalle de un indicador?')], spacing: { after: 80 } }),
    p('Haga clic sobre la tarjeta del indicador (KPI card). Se abrirá una ventana con información detallada y contexto adicional.'),
    new Paragraph({ children: [bold('¿Puedo descargar los datos?')], spacing: { after: 80 } }),
    p('La plataforma está diseñada para visualización. Si necesita exportar datos, contacte al área de sistemas.'),
    pageBreak(),

    // 9. SOPORTE
    h1('9. Soporte y Contacto'),
    p('Para soporte técnico o consultas sobre el sistema FIA, contacte al área de Sistemas de Pollo Fiesta S.A.'),
    p('El sistema está disponible en: https://asamblea-2025pf.up.railway.app'),
    separator(),
    new Paragraph({
      children: [new TextRun({ text: 'Manual de Usuario — FIA Pollo Fiesta S.A. — Marzo 2025', size: 18, italics: true, color: '595959' })],
      alignment: AlignmentType.CENTER,
    }),
  ];

  return new Document({
    styles: {
      default: {
        document: { run: { font: 'Calibri', size: 22 } },
      },
      paragraphStyles: [
        {
          id: 'Heading1', name: 'Heading 1',
          run: { bold: true, size: 32, color: '1F3864' },
          paragraph: { spacing: { before: 400, after: 200 } },
        },
        {
          id: 'Heading2', name: 'Heading 2',
          run: { bold: true, size: 26, color: '2E74B5' },
          paragraph: { spacing: { before: 300, after: 150 } },
        },
      ],
    },
    sections: [{
      properties: {},
      children,
    }],
  });
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('Generando Documentación Técnica...');
  const docTecnico = buildDocTecnico();
  const bufTecnico = await Packer.toBuffer(docTecnico);
  const pathTecnico = path.join(OUTPUT_DIR, 'DOCUMENTACION_TECNICA_FIA_POLLO_FIESTA.docx');
  fs.writeFileSync(pathTecnico, bufTecnico);
  console.log('✓ Guardado:', pathTecnico);

  console.log('Generando Manual de Usuario...');
  const docManual = buildManualUsuario();
  const bufManual = await Packer.toBuffer(docManual);
  const pathManual = path.join(OUTPUT_DIR, 'MANUAL_USUARIO_FIA_POLLO_FIESTA.docx');
  fs.writeFileSync(pathManual, bufManual);
  console.log('✓ Guardado:', pathManual);

  console.log('\n✅ Documentos generados exitosamente en /docs/');
}

main().catch(console.error);
