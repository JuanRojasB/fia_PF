# Despliegue en Railway

## 1. Instalar Git (si no lo tienes)

Descarga e instala Git desde: https://git-scm.com/download/win

Después de instalar, reinicia la terminal.

## 2. Subir el proyecto a GitHub

Abre una terminal en la carpeta del proyecto y ejecuta:

```powershell
# Ir a la carpeta del proyecto
cd "c:\Users\Samuel\OneDrive\Desktop\FIA"

# Inicializar repositorio Git
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Initial commit - FIA Pollo Fiesta"

# Crear repositorio en GitHub:
# 1. Ve a https://github.com/new
# 2. Crea un repo (ej: "fia-pollo-fiesta")
# 3. NO marques "Initialize with README"
# 4. Copia la URL del repo

# Conectar y subir (reemplaza TU-USUARIO y TU-REPO con tus datos)
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git branch -M main
git push -u origin main
```

## 3. Desplegar en Railway

1. Ve a https://railway.app y crea una cuenta (puedes usar GitHub).
2. **New Project** → **Deploy from GitHub repo**.
3. Selecciona tu repositorio.
4. Railway detectará automáticamente el proyecto Node.js.

## 4. Variables de entorno en Railway

### 📌 Importante: Diferencia Local vs Producción

- **Local (desarrollo):** Usa el archivo `backend/.env`
- **Railway (producción):** Usa variables configuradas en el panel de Railway

### Configuración en Railway

**IMPORTANTE:** Railway inyecta las variables automáticamente. NO necesitas subir el archivo `.env` a Git.

#### Paso 1: Crear Base de Datos MySQL en Railway

1. En tu proyecto de Railway, haz clic en **+ New** → **Database** → **MySQL**
2. Railway creará automáticamente estas variables:
   - `MYSQL_URL`
   - `MYSQLHOST`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`
   - `MYSQLPORT`

#### Paso 2: Vincular la Base de Datos a tu App

1. Ve a tu **servicio de la app** (el que despliega el código)
2. Click en **Variables**
3. Click en **+ New Variable** → **Add Reference**
4. Selecciona el servicio **MySQL** que creaste
5. Railway automáticamente vinculará todas las variables de la base de datos

#### Paso 3: Agregar Variables Adicionales

En **Variables** de tu app, agrega manualmente:

| Variable      | Valor Recomendado              | Descripción                    |
|---------------|--------------------------------|--------------------------------|
| `PORT`        | (Railway lo asigna automático) | Puerto del servidor            |
| `NODE_ENV`    | `production`                   | Entorno de ejecución           |
| `JWT_SECRET`  | (genera uno aleatorio)         | Clave secreta para JWT         |
| `JWT_EXPIRATION` | `24h`                       | Tiempo de expiración del token |
| `CORS_ORIGIN` | `*` o tu dominio               | Orígenes permitidos para CORS  |

**Generar JWT_SECRET aleatorio:**
```bash
# En tu terminal local (no lo subas a Git)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Paso 4: Verificar la Conexión

El código en `database.config.js` detecta automáticamente si está en Railway:

```javascript
// 1. Primero intenta usar MYSQL_URL (Railway)
const mysqlUrl = process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL;

if (mysqlUrl) {
  // ✅ Conecta usando la URL completa (Railway)
  module.exports = { uri: mysqlUrl, ... };
} else {
  // ✅ Conecta usando variables individuales (Local o Railway sin URL)
  module.exports = {
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    // ...
  };
}
```

### 🔍 Cómo Verificar que Funciona

Después de desplegar, revisa los logs en Railway:

```
✅ Servidor iniciado correctamente
📡 Puerto: 3001
🗄️  Base de datos: railway
```

Si ves errores de conexión:
1. Verifica que el servicio MySQL esté **running**
2. Confirma que las variables estén vinculadas (Variables → References)
3. Revisa que el servicio de la app tenga acceso al MySQL

| Variable      | Descripción                     | Ejemplo                    |
|---------------|---------------------------------|----------------------------|
| `JWT_SECRET`  | Clave secreta para JWT          | (genera una aleatoria)    |

### ⚠️ NO Necesitas Configurar Estas (Railway las Crea Automáticamente)

Cuando vinculas el servicio MySQL, Railway inyecta automáticamente:
- `MYSQL_URL` - URL completa de conexión
- `MYSQLHOST` - Host de la base de datos
- `MYSQLUSER` - Usuario
- `MYSQLPASSWORD` - Contraseña
- `MYSQLDATABASE` - Nombre de la base de datos
- `MYSQLPORT` - Puerto

**Base de datos en Railway:**
1. En tu proyecto, haz clic en **+ New** → **Database** → **MySQL**.
2. **Importante:** En tu **servicio de la app** (el que despliega el código), ve a **Variables** → **Add Reference** (o "+" para nueva variable).
3. Selecciona el **servicio MySQL** como referencia — así se inyectarán `MYSQL_URL`, `MYSQLHOST`, etc. automáticamente.
4. Sin esta referencia, la app intentará conectar a localhost y fallará.

### 🔧 Resumen de Configuración

**Lo que Railway hace automáticamente:**
- ✅ Crea la base de datos MySQL
- ✅ Genera credenciales seguras
- ✅ Inyecta variables de entorno al vincular servicios
- ✅ Asigna el puerto (`PORT`)

**Lo que TÚ debes hacer:**
- ✅ Vincular el servicio MySQL a tu app (Add Reference)
- ✅ Agregar `JWT_SECRET` manualmente
- ✅ Importar los datos a la base de datos (ver paso 5)

## 5. Importar la base de datos a Railway

### Si tienes la base de datos local (data_dashboard)

1. **Exporta tu base de datos local:**
   ```powershell
   cd backend
   npm run export-db
   ```
   Esto crea `backend/database_export.sql` con todas las tablas y datos.

2. **Importa en Railway** con MySQL Workbench, DBeaver o similar:
   - Conecta al MySQL de Railway (Variables → host, puerto, usuario, contraseña).
   - Ejecuta el archivo `backend/database_export.sql`.

### Si NO tienes datos locales

Ejecuta `backend/src/infrastructure/database/schema_cpanel.sql` en Railway (crea tablas vacías + usuarios de prueba).

### Usuarios de prueba (incluidos en ambos)

- **admin** / admin123
- **analista** / analista123
- **viewer** / viewer123

## 6. Generar dominio

En **Settings** → **Networking** → **Generate Domain** para obtener la URL pública de tu app.

## 7. Usuarios de prueba

- **admin** / admin123  
- **analista** / analista123  
- **viewer** / viewer123  

(Asegúrate de tener estos usuarios y contraseñas en tu base de datos.)
