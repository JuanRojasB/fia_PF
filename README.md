# 🐔 FIA - Pollo Fiesta Dashboard

Sistema de Inteligencia Financiera para análisis y visualización de datos empresariales.

![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

## 📋 Características

- 📊 Dashboards interactivos con comparativas 2024 vs 2025
- 🔍 Búsqueda inteligente con IA
- 📈 Gráficas en tiempo real con Recharts
- 🔐 Autenticación JWT con roles (admin, analyst, viewer)
- 🎨 UI moderna con Tailwind CSS y Framer Motion
- 📱 Diseño completamente responsive
- 🚀 Arquitectura limpia (Domain-Driven Design)

## 🏗️ Arquitectura

```
fia-pollo-fiesta/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── application/    # Casos de uso
│   │   ├── domain/         # Entidades y repositorios
│   │   ├── infrastructure/ # Implementaciones (DB, CSV)
│   │   └── presentation/   # Controllers, routes, middlewares
│   └── .env.example        # Template de variables de entorno
│
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas principales
│   │   ├── services/      # API calls
│   │   └── utils/         # Utilidades
│   └── dist/              # Build de producción
│
└── docs/                  # Documentación
    ├── DEPLOY.md          # Guía de despliegue
    ├── RAILWAY_SETUP.md   # Setup detallado de Railway
    └── SECURITY.md        # Guía de seguridad
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ ([Descargar](https://nodejs.org/))
- MySQL 8.0+ ([Descargar](https://dev.mysql.com/downloads/))
- Git ([Descargar](https://git-scm.com/))

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/fia-pollo-fiesta.git
cd fia-pollo-fiesta
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Copiar archivo de configuración
cp .env.example .env

# Editar .env con tus credenciales de MySQL
# nano .env  (Linux/Mac)
# notepad .env  (Windows)
```

**Contenido de `.env`:**
```env
MYSQLHOST=localhost
MYSQLUSER=root
MYSQLPASSWORD=tu-password
MYSQLDATABASE=data_dashboard
MYSQLPORT=3306

JWT_SECRET=tu-secreto-aleatorio
JWT_EXPIRATION=24h
```

### 3. Crear Base de Datos

```bash
# Opción A: Desde MySQL Workbench
# Abre backend/src/infrastructure/database/schema_cpanel.sql

# Opción B: Desde terminal
mysql -u root -p < backend/src/infrastructure/database/schema_cpanel.sql
```

### 4. Probar Conexión

```bash
# Desde la carpeta backend/
npm run test-connection
```

Deberías ver:
```
✅ Conexión exitosa!
📊 Usuarios en la base de datos: 3
📁 Tablas encontradas (10)
```

### 5. Iniciar Backend

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

El servidor estará en: `http://localhost:3001`

### 6. Configurar Frontend

```bash
# Desde la raíz del proyecto
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará en: `http://localhost:5173`

## 👤 Usuarios de Prueba

| Usuario   | Contraseña   | Rol      | Permisos                    |
|-----------|--------------|----------|-----------------------------|
| admin     | admin123     | Admin    | Acceso total                |
| analista  | analista123  | Analyst  | Ver y analizar datos        |
| viewer    | viewer123    | Viewer   | Solo visualización          |

## 📊 Dashboards Disponibles

1. **Balance General** - Activos, Pasivos y Patrimonio
2. **Gestión de Cartera** - Morosidad y rotación
3. **Gestión Comercial** - Ventas por línea
4. **Gestión Humana** - Costos de nómina
5. **Gestión Logística** - Costos operacionales
6. **Producción** - Granjas e histórico
7. **SAGRILAFT** - Cumplimiento normativo
8. **Gerencia Estratégica** - Indicadores clave

## 🚢 Despliegue en Producción

### Railway (Recomendado)

Ver guía completa: [RAILWAY_SETUP.md](./RAILWAY_SETUP.md)

**Resumen:**
1. Conecta tu repo de GitHub a Railway
2. Agrega servicio MySQL
3. Vincula MySQL a tu app (Add Reference)
4. Agrega `JWT_SECRET` manualmente
5. Importa los datos
6. ¡Listo! 🎉

### Otras Plataformas

- **Render:** Similar a Railway
- **Heroku:** Requiere Heroku Postgres o ClearDB MySQL
- **DigitalOcean:** App Platform + Managed Database
- **AWS:** EC2 + RDS MySQL

Ver: [DEPLOY.md](./DEPLOY.md)

## 🔒 Seguridad

⚠️ **IMPORTANTE:** Este proyecto tiene algunas consideraciones de seguridad:

- ✅ Variables de entorno protegidas con `.gitignore`
- ✅ JWT para autenticación
- ⚠️ Contraseñas en texto plano (pendiente bcrypt)
- ⚠️ Sin rate limiting (pendiente)
- ⚠️ Sin validación de inputs (pendiente)

Ver guía completa: [SECURITY.md](./SECURITY.md)

## 🛠️ Scripts Disponibles

### Backend

```bash
npm start              # Iniciar servidor
npm run dev            # Modo desarrollo con nodemon
npm run export-db      # Exportar base de datos
npm run test-connection # Probar conexión a DB
```

### Frontend

```bash
npm run dev            # Servidor de desarrollo
npm run build          # Build para producción
npm run preview        # Preview del build
npm run lint           # Linter
```

### Root

```bash
npm run build          # Build frontend + instalar backend
npm start              # Iniciar backend (producción)
npm run install:all    # Instalar todas las dependencias
```

## 📁 Estructura de Base de Datos

```sql
users                      -- Usuarios del sistema
financial_data             -- Balance general
fin_cartera                -- Gestión de cartera
com_ventas_sede1           -- Ventas comerciales
rh_gestion_talento         -- Gestión humana
log_gastos_sedes           -- Logística
prod_capacidad_instalada   -- Capacidad de granjas
prod_historico_sacrificio  -- Histórico producción
cumplimiento_sagrilaft     -- SAGRILAFT
gerencia_estrategica       -- Indicadores gerenciales
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Roadmap

- [ ] Implementar bcrypt para contraseñas
- [ ] Agregar validación de inputs (Joi)
- [ ] Rate limiting en API
- [ ] Exportar datos a Excel/PDF
- [ ] Filtros avanzados en tablas
- [ ] Tests unitarios y de integración
- [ ] Documentación API con Swagger
- [ ] PWA (Progressive Web App)
- [ ] Modo offline básico
- [ ] Internacionalización (i18n)

## 🐛 Reportar Bugs

Si encuentras un bug, por favor abre un [issue](https://github.com/tu-usuario/fia-pollo-fiesta/issues) con:

- Descripción del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots (si aplica)
- Entorno (OS, navegador, versión de Node)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](./LICENSE) para más detalles.

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Email: tu-email@ejemplo.com

## 🙏 Agradecimientos

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org/)
- [Express](https://expressjs.com/)
- [Railway](https://railway.app/)

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!
