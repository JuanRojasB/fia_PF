# DOCUMENTACIÓN TÉCNICA — SISTEMA FIA POLLO FIESTA
## Plataforma de Inteligencia de Negocios — Asamblea General 2025

---

## 1. DESCRIPCIÓN GENERAL DEL SISTEMA

**FIA - Pollo Fiesta** es una plataforma web de Business Intelligence (BI) desarrollada para la presentación de resultados de gestión en la Asamblea General de Accionistas 2025 de Pollo Fiesta S.A. El sistema integra datos operativos, financieros, comerciales y de talento humano en más de 50 dashboards interactivos, organizados por área de gestión.

**URL de producción:** https://asamblea-2025pf.up.railway.app

**Repositorio:** https://github.com/JuanRojasB/fia_PF

---

## 2. ARQUITECTURA DEL SISTEMA

### 2.1 Arquitectura General

El sistema sigue una arquitectura **cliente-servidor** con separación clara entre frontend y backend, desplegados como servicios independientes en Railway.

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE (Browser)                     │
│              React 19 + Vite + Tailwind CSS                  │
│         https://asamblea-2025pf.up.railway.app               │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS / REST API
                           │ Authorization: Bearer <JWT>
┌──────────────────────────▼──────────────────────────────────┐
│                    BACKEND (Node.js / Express)                │
│              Arquitectura Limpia (Clean Architecture)         │
│                    Puerto: 3001 (Railway)                     │
└──────────────────────────┬──────────────────────────────────┘
                           │ mysql2 / Pool de conexiones
┌──────────────────────────▼──────────────────────────────────┐
│                  BASE DE DATOS (MariaDB)                      │
│              erp_pollo_fiesta — Railway MySQL                 │
│              50+ tablas y vistas especializadas               │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Arquitectura del Backend — Clean Architecture

El backend implementa **Clean Architecture** con 4 capas bien definidas:

```
backend/src/
├── presentation/          ← Capa de Presentación
│   ├── controllers/       ← AuthController, DashboardController
│   ├── middlewares/       ← authMiddleware, errorHandler
│   └── routes/            ← authRoutes, dashboard.routes
├── application/           ← Capa de Aplicación
│   └── use-cases/
│       ├── auth/          ← LoginUseCase
│       └── dashboard/     ← GetDashboardDataUseCase
├── domain/                ← Capa de Dominio
│   ├── entities/          ← User
│   └── repositories/      ← IUserRepository, IDashboardRepository
├── infrastructure/        ← Capa de Infraestructura
│   ├── database/          ← connection.js (Pool MariaDB)
│   └── repositories/      ← UserRepository, DashboardRepository
├── config/
│   ├── database.config.js
│   └── server.config.js
├── app.js                 ← Express App
└── index.js               ← Entry Point / DI Container
```

---

## 3. STACK TECNOLÓGICO

### 3.1 Backend

| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | ≥ 20.0.0 | Runtime |
| Express | 4.21.0 | Framework HTTP |
| mysql2 | 3.11.0 | Driver MariaDB/MySQL |
| jsonwebtoken | 9.0.2 | Autenticación JWT |
| cors | 2.8.5 | Cross-Origin Resource Sharing |
| dotenv | 16.4.5 | Variables de entorno |
| nodemon | 3.1.0 | Hot reload (desarrollo) |

### 3.2 Frontend

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19.2.0 | UI Framework |
| Vite | 7.3.1 | Build tool / Dev server |
| React Router DOM | 7.13.1 | Enrutamiento SPA |
| Tailwind CSS | 3.4.1 | Estilos utilitarios |
| Framer Motion | 12.34.3 | Animaciones |
| Recharts | 3.7.0 | Gráficas y visualizaciones |
| Lucide React | 0.575.0 | Iconografía |
| Axios | 1.13.6 | Cliente HTTP |
| qrcode.react | 4.2.0 | Generación de QR |

---

## 4. CONFIGURACIÓN Y VARIABLES DE ENTORNO

### 4.1 Backend — `.env`

```env
# Base de datos (Railway inyecta MYSQL_URL automáticamente)
MYSQL_URL=mysql://user:password@host:port/database
# O variables individuales:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=erp_pollo_fiesta
DB_PORT=3306

# Servidor
PORT=3001
NODE_ENV=production
CORS_ORIGIN=*

# JWT
JWT_SECRET=fia-dashboard-secret-2025
JWT_EXPIRATION=24h
```

### 4.2 Frontend — `.env`

```env
VITE_API_URL=https://asamblea-2025pf.up.railway.app
```

### 4.3 Configuración de Base de Datos

El sistema detecta automáticamente el entorno:
- **Railway (producción):** usa `MYSQL_URL` o `MYSQL_PUBLIC_URL`
- **Local (desarrollo):** usa variables `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

Pool de conexiones: **10 conexiones concurrentes**, `waitForConnections: true`, charset `utf8mb4`.

---

## 5. API REST — ENDPOINTS

### 5.1 Autenticación

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/login` | No | Iniciar sesión |
| POST | `/api/auth/logout` | JWT | Cerrar sesión |
| GET | `/api/auth/verify` | JWT | Verificar token |

**Request Login:**
```json
POST /api/auth/login
{
  "username": "admin",
  "password": "password123"
}
```

**Response Login:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

### 5.2 Dashboards

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| GET | `/api/dashboard/summary` | JWT | Lista de dashboards disponibles |
| GET | `/api/dashboard/:type` | JWT | Datos de un dashboard específico |

**Tipos de dashboard disponibles:**

| type | Descripción |
|---|---|
| `fuentes-usos` | Balance activos/pasivos/patrimonio |
| `auditoria` | Devoluciones y control interno |
| `cartera` | Gestión de cartera y morosidad |
| `comercial` | Ventas por canal y sede |
| `comercial-pdv` | Puntos de venta y coordinadores |
| `humana` | Nómina, rotación, causas desvinculación |
| `marketing` | Publicidad y mercadeo |
| `logistica` | Costos logísticos por sede |
| `logistica-consolidado` | Análisis consolidado logística |
| `produccion-granjas` | Granjas y capacidad |
| `produccion-encasetado` | Encasetado programado vs real |
| `produccion-pollo-entregado` | Pollo entregado histórico |
| `produccion-huevos` | Producción de huevos |
| `sagrilaft` | Cumplimiento SAGRILAFT |
| `presupuesto-2025` | Variables macro y ejecución presupuestal |
| `gerencia` | Indicadores gerenciales |
| `compras` | Compras de insumos |
| `operaciones` | TPM, OT, vehículos, arquitectura |
| `planta-beneficio` | Indicadores planta de beneficio |

### 5.3 Autenticación JWT

Todas las rutas de dashboard requieren el header:
```
Authorization: Bearer <token>
```

El token tiene vigencia de **24 horas**. El middleware `verifyToken` valida la firma con `JWT_SECRET`.

---

## 6. BASE DE DATOS

### 6.1 Estructura General

Base de datos: `erp_pollo_fiesta` (MariaDB)

El sistema utiliza **vistas SQL** para abstraer la complejidad de las consultas. Principales vistas:

| Vista | Descripción |
|---|---|
| `vista_com_analisis_ventas` | Ventas por categoría 2024 vs 2025 |
| `vista_com_kpi_pollo_entero` | KPIs pollo entero 2023-2025 |
| `vista_com_unidades_procesadas` | Unidades procesadas por centro |
| `vista_com_huevo_comparativo_multianual` | Comparativo huevo multianual |
| `vista_com_pdv_participacion_zona_2024` | Participación PDV por zona |

### 6.2 Tablas Principales

| Tabla | Descripción |
|---|---|
| `com_pdv_ventas_zonales` | Ventas zonales comparativas |
| `com_pdv_top_desempeno` | Top desempeño PDV |
| `com_sede3_ventas_detalle` | Ventas detalladas Sede 3 |
| `com_sede1_ventas_detalle` | Ventas detalladas Sede 1 |

### 6.3 Conexión — Patrón Singleton

```javascript
// Uso del pool (Singleton)
const { getInstance } = require('../database/connection');
const db = getInstance();
const pool = db.getPool();
const [rows] = await pool.query('SELECT * FROM vista_com_analisis_ventas');
```

---

## 7. AUTENTICACIÓN Y SEGURIDAD

### 7.1 Flujo de Autenticación

```
1. Usuario ingresa credenciales en /login
2. Frontend → POST /api/auth/login
3. Backend valida usuario en BD (UserRepository)
4. Si válido → genera JWT (24h) con { id, username, role }
5. Frontend almacena token en localStorage
6. Cada request incluye: Authorization: Bearer <token>
7. Middleware verifyToken valida en cada endpoint protegido
```

### 7.2 Roles de Usuario

| Rol | Permisos |
|---|---|
| `admin` | Acceso total |
| `analyst` | Acceso a dashboards |
| `user` | Acceso básico |

### 7.3 Consideraciones de Seguridad

- Contraseñas almacenadas sin encriptar (pendiente implementar bcrypt)
- JWT Secret configurable por variable de entorno
- CORS configurado (origen configurable)
- Tokens expiran en 24 horas

---

## 8. ESTRUCTURA DEL FRONTEND

### 8.1 Árbol de Directorios

```
frontend/src/
├── App.jsx                    ← Entry point, SplashScreen
├── assets/                    ← Imágenes (logos, estados financieros)
├── components/
│   ├── Sidebar.jsx            ← Navegación lateral colapsable
│   ├── SectionSplash.jsx      ← Animación de transición entre secciones
│   ├── CollapsibleChart.jsx   ← Wrapper para gráficas desplegables
│   ├── CollapsibleTable.jsx   ← Wrapper para tablas desplegables
│   ├── AISearch.jsx           ← Búsqueda con IA
│   └── dashboards/            ← 50+ componentes de dashboard
├── pages/
│   └── Dashboard.jsx          ← Página principal con navegación
├── routes/                    ← React Router configuración
└── services/
    ├── authService.js         ← Login/logout/token
    └── dashboardService.js    ← Fetch de datos por tipo
```

### 8.2 Componente Dashboard.jsx — Flujo Principal

```
Dashboard.jsx
├── Estado: activeSection (sección activa)
├── Estado: dashboardData (datos del backend)
├── mainSections: mapa de secciones padre → hijos
├── allSections: lista ordenada para navegación prev/next
├── handleSectionChange() → actualiza URL + carga datos
├── goToPreviousSection() / goToNextSection()
└── Renderiza:
    ├── <Sidebar> (navegación)
    ├── <SectionSplash> (animación transición)
    ├── <DashboardRenderer type={activeSection} data={dashboardData}>
    └── Botones Anterior/Siguiente
```

### 8.3 DashboardRenderer — Enrutador de Componentes

`DashboardRenderer.jsx` actúa como un switch que mapea el `type` (string) al componente React correspondiente. Recibe `data` del backend y `onNavigate` para navegación programática.

### 8.4 Sidebar — Navegación

El Sidebar es un componente memoizado con:
- **Colapsable** en desktop (icono ↔ texto completo)
- **Menú hamburguesa** en mobile
- **Secciones expandibles** con subitems
- **Sonido** al navegar (audio.play)
- **Botón Agradecimientos** fijo con ícono Trophy (dorado)
- **Botón FIA** flotante (logo circular) → abre Orden del Día

---

## 9. DASHBOARDS — CATÁLOGO COMPLETO

### 9.1 Sección Bienvenida

| ID | Componente | Descripción |
|---|---|---|
| `bienvenida-principal` | BienvenidaDashboard | Pantalla de bienvenida con logo |
| `contexto-mundial` | ContextoMundialDashboard | Contexto avícola mundial |
| `entorno-socioeconomico` | EntornoSocioeconomicoDashboard | Entorno macroeconómico Colombia |
| `encasetamiento-colombia` | EncasetamientoColombiaDashboard | Encasetamiento sector avícola |
| `negocio-marcha` | NegocioMarchaDashboard | El negocio en marcha |

### 9.2 Sección Producción

| ID | Componente | Descripción |
|---|---|---|
| `produccion-granjas` | GranjasDashboard | Capacidad y distribución de granjas |
| `produccion-encasetado` | ProduccionEncasetadoDashboard | Programado vs real encasetado |
| `produccion-pollo-entregado` | ProduccionPolloEntregadoDashboard | Histórico pollo entregado |
| `produccion-huevos` | ProduccionHuevosDashboard | Producción de huevos |
| `produccion-indicadores` | ProduccionIndicadoresDashboard | KPIs de producción |

### 9.3 Sección Comercial

| ID | Componente | Descripción |
|---|---|---|
| `comercial-estructura-equipo` | ComercialEstructuraEquipoDashboard | Estructura del equipo comercial |
| `comercial-resumen` | ComercialEstructuraDashboard | Resumen comercial |
| `comercial-ventas-compania` | ComercialVentasCompaniaDashboard | Ventas totales compañía |
| `comercial-pollo-entero` | ComercialPolloEnteroDashboard | Canal pollo entero |
| `comercial-productos` | ComercialProductosDashboard | Líneas de producto |
| `comercial-asadero` | ComercialAsaderoDashboard | Canal asadero (Sede 1) |
| `comercial-institucional` | ComercialInstitucionalDashboard | Canal institucional (Sede 3) |
| `comercial-huevo` | ComercialHuevoDashboard | Canal huevo |
| `comercial-pdv` | ComercialPDVDashboard | Puntos de venta (22 PDV, 7 coordinadores) |

### 9.4 Sección Logística

| ID | Componente | Descripción |
|---|---|---|
| `logistica-consolidado` | GestionLogisticaDashboard | Análisis consolidado |
| `logistica-sede1` | LogisticaSede1Dashboard | Logística Sede 1 (Asadero) |
| `logistica-sede2` | LogisticaSede2Dashboard | Logística Sede 2 (Congelados) |
| `logistica-sede3` | LogisticaSede3Dashboard | Logística Sede 3 (Institucional) |

### 9.5 Sección Operaciones

| ID | Componente | Descripción |
|---|---|---|
| `operaciones-tpm` | OperacionesTPMDashboard | Mantenimiento Productivo Total |
| `operaciones-ot` | OperacionesOTDashboard | Órdenes de trabajo |
| `operaciones-vehiculos` | OperacionesVehiculosDashboard | Flota vehicular |
| `operaciones-arquitectura` | OperacionesArquitecturaDashboard | Arquitectura de planta |

### 9.6 Sección Marketing

| ID | Componente | Descripción |
|---|---|---|
| `marketing-detalle` | MarketingDetalleDashboard | Análisis detallado: presupuesto, digital, fortalezas |

### 9.7 Sección Gestión Humana

| ID | Componente | Descripción |
|---|---|---|
| `humana-nomina` | HumanaDashboard (nomina) | Costos de nómina y planta |
| `humana-rotacion` | HumanaDashboard (rotacion) | Rotación de personal |
| `humana-causas` | HumanaDashboard (causas) | Causas de desvinculación |
| `humana-smlv` | HumanaDashboard (smlv) | Impacto salario mínimo |

### 9.8 Sección Gerencia Estratégica

| ID | Componente | Descripción |
|---|---|---|
| `gerencia-estrategica-calidad` | CalidadDashboard (calidad) | Aseguramiento de calidad |
| `gerencia-estrategica-compras` | CalidadDashboard (compras) | Gestión de compras |
| `gerencia-estrategica-bienestar` | CalidadDashboard (bienestar) | Bienestar animal |
| `gerencia-estrategica-hseq` | CalidadDashboard (hseq) | Seguridad y salud en el trabajo |
| `gerencia-estrategica-ambiental` | CalidadDashboard (ambiental) | Gestión ambiental |
| `gerencia-estrategica-sgc` | CalidadDashboard (sgc) | Sistema de gestión de calidad |
| `gerencia-estrategica-satisfaccion` | CalidadDashboard (satisfaccion) | Satisfacción del cliente |

### 9.9 Otras Secciones

| ID | Componente | Descripción |
|---|---|---|
| `auditoria` | AuditoriaDashboard | Auditoría interna y devoluciones |
| `cartera` | CarteraDashboard | Gestión de cartera |
| `fuentes-usos` | FuentesUsosDashboard | Fuentes y usos de fondos |
| `situacion-economica` | SituacionEconomicaDashboard | Indicadores financieros |
| `situacion-juridica` | SituacionJuridicaDashboard | Situación jurídica |
| `presupuesto-2025` | Presupuesto2025Dashboard | Presupuesto y ejecución 2025 |
| `sagrilaft` | SagrilaftDashboard | Sistema SAGRILAFT |
| `planta-beneficio` | PlantaBeneficioDashboard | Planta de beneficio |
| `compras` | ComprasDashboard | Compras de insumos |
| `gerencia` | GerenciaDashboard | Indicadores gerenciales |
| `agradecimientos` | AgradecimientosDashboard | Cierre con animación y QR |

---

## 10. DESPLIEGUE EN RAILWAY

### 10.1 Configuración Backend (`backend/railway.json`)

```json
{
  "build": { "builder": "NIXPACKS" },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 10.2 Configuración Frontend (`frontend/railway.json`)

```json
{
  "build": { "builder": "NIXPACKS" },
  "deploy": {
    "startCommand": "npm run preview -- --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 10.3 Proceso de Despliegue

```bash
# 1. Commit y push al repositorio
git add -A
git commit -m "descripción del cambio"
git push origin main

# 2. Railway detecta el push automáticamente
# 3. Ejecuta build con NIXPACKS
# 4. Despliega el nuevo contenedor
# 5. Disponible en https://asamblea-2025pf.up.railway.app
```

---

## 11. EJECUCIÓN LOCAL

### 11.1 Requisitos

- Node.js ≥ 20.0.0
- npm ≥ 10.0.0
- MariaDB / MySQL local o acceso a Railway DB

### 11.2 Backend

```bash
cd backend
cp .env.example .env
# Editar .env con credenciales de BD local
npm install
npm run dev        # Desarrollo con nodemon
# o
npm start          # Producción
```

### 11.3 Frontend

```bash
cd frontend
cp .env.example .env
# Editar VITE_API_URL=http://localhost:3001
npm install
npm run dev        # Servidor de desarrollo Vite
# o
npm run build      # Build de producción
npm run preview    # Preview del build
```

### 11.4 Verificar Conexión BD

```bash
cd backend
npm run test-connection
```

---

## 12. PATRONES Y CONVENCIONES

### 12.1 Componentes Dashboard

Todos los dashboards siguen el patrón:
```jsx
export default function XxxDashboard({ data, section }) {
  // 1. Estado local (modales, etc.)
  // 2. Validación de datos
  // 3. Funciones de formato (formatNumber, formatMillones)
  // 4. Cálculos derivados
  // 5. Return JSX con:
  //    - Header con gradiente
  //    - Grid de KPI cards
  //    - CollapsibleChart para gráficas
  //    - Modal via createPortal
}
```

### 12.2 KPI Cards

Los KPI cards clickeables muestran:
- Valor principal 2025
- Fila 2024 (omitida si es placeholder)
- Variación porcentual (verde/rojo según `good`)
- Diferencia absoluta
- Modal con detalle al hacer click

### 12.3 Modales

Todos los modales usan `createPortal(content, document.body)` con `AnimatePresence` de Framer Motion para animaciones de entrada/salida.

### 12.4 Gráficas

Se usa `CollapsibleChart` como wrapper para todas las gráficas Recharts, permitiendo expandir/colapsar con animación.

---

## 13. HEALTH CHECK

```
GET /health
Response: { "status": "OK", "timestamp": "2025-03-19T..." }
```

---

*Documentación generada: Marzo 2025 — FIA Pollo Fiesta S.A.*
