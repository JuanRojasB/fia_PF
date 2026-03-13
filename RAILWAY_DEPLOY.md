# Guía de Despliegue en Railway - Servicios Separados

## 📋 Requisitos Previos

1. Cuenta en [Railway.app](https://railway.app)
2. Repositorio Git con el código
3. Base de datos MySQL (Railway ofrece MySQL como servicio)

## 🏗️ Arquitectura de Despliegue

Este proyecto se despliega en **3 servicios separados**:
1. **MySQL Database** - Base de datos
2. **Backend API** - Servidor Node.js/Express
3. **Frontend** - Aplicación React/Vite

## 🚀 Pasos para Desplegar

### 1. Crear Proyecto en Railway

1. Ve a [Railway.app](https://railway.app) y haz login
2. Click en "New Project"
3. Selecciona "Empty Project"
4. Dale un nombre a tu proyecto (ej: "fia-pollo-fiesta")

### 2. Configurar Base de Datos MySQL

1. En tu proyecto, click en "+ New"
2. Selecciona "Database" → "Add MySQL"
3. Railway creará automáticamente una base de datos MySQL
4. Espera a que se complete la creación
5. Click en el servicio MySQL → pestaña "Variables"
6. Copia las credenciales (las necesitarás después)

### 3. Importar Base de Datos

**Opción A: Usando Railway CLI (Recomendado)**
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Conectar al proyecto
railway link

# Conectar a MySQL
railway connect mysql

# Importar el archivo SQL
source backend/erp_pollo_fiesta_final.sql
# o
\. backend/erp_pollo_fiesta_final.sql
```

**Opción B: Usando MySQL Workbench o cliente MySQL**
```bash
# Usar las credenciales de Railway
mysql -h <MYSQLHOST> -u root -p<MYSQLPASSWORD> -P <MYSQLPORT> railway < backend/erp_pollo_fiesta_final.sql
```

### 4. Desplegar Backend API

1. En tu proyecto Railway, click en "+ New"
2. Selecciona "GitHub Repo"
3. Selecciona tu repositorio
4. Railway detectará el código

**Configurar el servicio Backend:**

1. Click en el servicio recién creado
2. Ve a "Settings" → "Root Directory"
3. Cambia a: `backend`
4. Ve a "Variables" y agrega:

```env
# Railway auto-configura estas desde MySQL (referencia al servicio):
MYSQLHOST=${{MySQL.MYSQLHOST}}
MYSQLUSER=${{MySQL.MYSQLUSER}}
MYSQLPASSWORD=${{MySQL.MYSQLPASSWORD}}
MYSQLDATABASE=${{MySQL.MYSQLDATABASE}}
MYSQLPORT=${{MySQL.MYSQLPORT}}

# Variables adicionales:
NODE_ENV=production
PORT=3001
JWT_SECRET=cambiar-por-secreto-super-seguro-unico-2026
JWT_EXPIRATION=24h
CORS_ORIGIN=*
```

5. Click en "Deploy" para iniciar el despliegue
6. Espera a que termine (verás "Success" en verde)
7. Ve a "Settings" → "Networking" → "Generate Domain"
8. Copia la URL del backend (ej: `https://backend-production-xxxx.up.railway.app`)

### 5. Desplegar Frontend

1. En tu proyecto Railway, click en "+ New"
2. Selecciona "GitHub Repo"
3. Selecciona el mismo repositorio
4. Railway detectará el código

**Configurar el servicio Frontend:**

1. Click en el nuevo servicio
2. Ve a "Settings" → "Root Directory"
3. Cambia a: `frontend`
4. Ve a "Variables" y agrega:

```env
# URL del backend (usa la URL que copiaste en el paso anterior)
VITE_API_URL=https://tu-backend-production-xxxx.up.railway.app/api
```

5. Click en "Deploy" para iniciar el despliegue
6. Espera a que termine el build
7. Ve a "Settings" → "Networking" → "Generate Domain"
8. Copia la URL del frontend (ej: `https://frontend-production-xxxx.up.railway.app`)

### 6. Actualizar CORS en Backend

1. Ve al servicio Backend en Railway
2. Ve a "Variables"
3. Actualiza `CORS_ORIGIN` con la URL del frontend:

```env
CORS_ORIGIN=https://tu-frontend-production-xxxx.up.railway.app
```

4. El servicio se redesplegar automáticamente

### 7. Verificar Despliegue

1. Visita la URL del frontend
2. Deberías ver la pantalla de login
3. Prueba con las credenciales:
   - Usuario: `admin`
   - Contraseña: `admin123`
4. Verifica que los dashboards carguen correctamente

## 🔧 Configuración Avanzada

### Dominio Personalizado

**Para el Frontend:**
1. Ve al servicio Frontend → "Settings" → "Domains"
2. Click en "Custom Domain"
3. Ingresa tu dominio (ej: `app.tuempresa.com`)
4. Configura el DNS según las instrucciones de Railway

**Para el Backend:**
1. Ve al servicio Backend → "Settings" → "Domains"
2. Click en "Custom Domain"
3. Ingresa tu subdominio (ej: `api.tuempresa.com`)
4. Configura el DNS según las instrucciones
5. Actualiza `VITE_API_URL` en el Frontend con el nuevo dominio

### Variables de Entorno por Servicio

**MySQL:**
- Auto-configurado por Railway
- No requiere variables adicionales

**Backend:**
```env
MYSQLHOST=${{MySQL.MYSQLHOST}}
MYSQLUSER=${{MySQL.MYSQLUSER}}
MYSQLPASSWORD=${{MySQL.MYSQLPASSWORD}}
MYSQLDATABASE=${{MySQL.MYSQLDATABASE}}
MYSQLPORT=${{MySQL.MYSQLPORT}}
NODE_ENV=production
PORT=3001
JWT_SECRET=tu-secreto-super-seguro-cambiar
JWT_EXPIRATION=24h
CORS_ORIGIN=https://tu-frontend.up.railway.app
```

**Frontend:**
```env
VITE_API_URL=https://tu-backend.up.railway.app/api
```

## 🐛 Solución de Problemas

### Frontend no conecta con Backend

1. Verifica que `VITE_API_URL` esté correctamente configurado
2. Asegúrate de que el backend esté desplegado y funcionando
3. Verifica CORS en el backend
4. Revisa los logs del frontend: `railway logs` (en el directorio frontend)
5. Abre la consola del navegador para ver errores de red

### Error: "Cannot connect to database"

1. Verifica que las variables `MYSQL*` estén correctamente referenciadas
2. Asegúrate de usar la sintaxis: `${{MySQL.VARIABLE}}`
3. Verifica que la base de datos esté importada
4. Revisa los logs del backend: `railway logs`

### Build del Frontend falla

1. Verifica que el Root Directory sea `frontend`
2. Asegúrate de que `package.json` tenga el script `build`
3. Revisa los logs de build en Railway
4. Verifica que todas las dependencias estén en `dependencies`

### Backend responde 502

1. Verifica que el backend esté escuchando en `process.env.PORT`
2. Revisa los logs del backend
3. Asegúrate de que la base de datos esté conectada
4. Verifica que el servicio MySQL esté corriendo

## 📊 Monitoreo

### Health Checks

**Backend:**
```
GET https://tu-backend.up.railway.app/health
```

Respuesta esperada:
```json
{
  "status": "OK",
  "timestamp": "2026-03-18T12:00:00.000Z"
}
```

**Frontend:**
Simplemente visita la URL y verifica que cargue

### Logs en Tiempo Real

```bash
# Backend
cd backend
railway logs

# Frontend
cd frontend
railway logs

# MySQL
railway logs --service mysql
```

## 🔐 Seguridad

1. **JWT_SECRET**: Usa un valor único, largo y aleatorio
2. **CORS**: Configura con el dominio específico del frontend
3. **Credenciales**: Cambia las contraseñas por defecto en la BD
4. **HTTPS**: Railway proporciona HTTPS automáticamente
5. **Variables**: Nunca commitees archivos `.env`

### Generar JWT_SECRET Seguro

```bash
# En tu terminal local
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📝 Mantenimiento

### Actualizar Aplicación

```bash
# Hacer cambios en el código
git add .
git commit -m "Descripción de cambios"
git push origin main

# Railway detectará el push y desplegará automáticamente ambos servicios
```

### Redesplegar Manualmente

1. Ve al servicio en Railway
2. Click en "Deployments"
3. Click en "Deploy" en el último commit

### Backup de Base de Datos

```bash
# Conectar a Railway
railway link

# Conectar a MySQL
railway connect mysql

# Exportar
mysqldump railway > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Rollback

1. Ve a "Deployments" del servicio
2. Encuentra el deployment anterior que funcionaba
3. Click en "..." → "Redeploy"

## 🎯 Checklist de Despliegue

### MySQL
- [ ] Servicio MySQL creado
- [ ] Base de datos importada con datos
- [ ] Credenciales copiadas

### Backend
- [ ] Servicio creado desde GitHub
- [ ] Root Directory configurado: `backend`
- [ ] Variables de entorno configuradas
- [ ] JWT_SECRET cambiado por valor seguro
- [ ] Referencias a MySQL configuradas: `${{MySQL.VARIABLE}}`
- [ ] Dominio generado
- [ ] Health check responde OK
- [ ] CORS configurado con URL del frontend

### Frontend
- [ ] Servicio creado desde GitHub
- [ ] Root Directory configurado: `frontend`
- [ ] VITE_API_URL configurado con URL del backend
- [ ] Dominio generado
- [ ] Aplicación carga correctamente
- [ ] Login funciona
- [ ] Dashboards cargan datos

## 📞 Soporte

- Documentación Railway: https://docs.railway.app
- Discord Railway: https://discord.gg/railway
- GitHub Issues: Reporta problemas en el repositorio

## 💡 Tips Adicionales

1. **Monitoreo**: Railway muestra uso de recursos en tiempo real
2. **Logs**: Mantén los logs abiertos durante el primer despliegue
3. **Dominios**: Usa dominios personalizados para producción
4. **Backups**: Programa backups automáticos de la BD
5. **Testing**: Prueba en un proyecto de staging primero

---

**Última actualización**: Marzo 2026
**Versión**: 2.0.0 - Servicios Separados
