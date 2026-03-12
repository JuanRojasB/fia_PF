# Dashboard de Gestión Logística

## Descripción

Dashboard completo para visualizar y analizar los gastos operacionales logísticos de las tres sedes de operación (Sede 1, Sede 2 y Sede 3) comparando los años 2024 vs 2025.

## Características

### 📊 Visualizaciones Incluidas

1. **Header Informativo**
   - Descripción de la Gerencia Logística
   - KPIs principales: Muelles de operación (12), Total colaboradores (197), Centros de operación (3)
   - Variación general de gastos

2. **KPIs Principales**
   - Total Gastos 2025 con variación vs 2024
   - Variación Anual absoluta
   - Sedes Operativas activas

3. **Estructura Organizacional**
   - Información detallada de cada sede:
     - Sede 1: Clara Fontalvo (52 colaboradores) - Pollo entero tipo asadero
     - Sede 2: Alexis Pérez (56 colaboradores) - Productos congelados
     - Sede 3: Angélica Cárdenas (89 colaboradores) - Clientes institucionales
   - Gastos y variación de ventas por sede

4. **Gráficos Comparativos**
   - Gráfico de barras: Gastos por sede 2024 vs 2025
   - Gráfico de pastel: Distribución de gastos por sede 2025
   - Gráfico de barras horizontal: Variación por concepto

5. **Tablas Detalladas**
   - Tabla por cada sede (Sede 1, Sede 2, Sede 3) con:
     - Conceptos de gasto
     - Total 2024 y 2025
     - Porcentaje de variación
     - Indicadores visuales de incremento/reducción
   
   - Tabla consolidada de todas las sedes con:
     - Totales por concepto
     - Variación porcentual
     - Diferencia absoluta

6. **Modales Informativos**
   - Cada KPI tiene un modal con información detallada
   - Explicaciones contextuales de las variaciones
   - Análisis de eficiencia operativa

### 📈 Conceptos de Gasto Analizados

- **Costo Personal Distribución**: Personal dedicado a la distribución de productos
- **Costo Personal Post Proceso**: Personal de procesamiento posterior
- **Arriendos y Congelación**: Costos de almacenamiento y congelación (Sede 2 y 3)
- **Fletes, Cargues, Acarreos, Transportes**: Costos de transporte y logística
- **Combustibles**: Gastos en combustible para vehículos
- **Peajes y Multas**: Costos de peajes y multas de tránsito

### 🎯 Insights Clave

- **Sede 1**: Reducción del -2.59% en gastos totales
  - Optimización de fletes (-0.86%)
  - Reducción de personal postproceso (-16.09%)
  - Disminución en ventas del -9.4%

- **Sede 2**: Incremento del 14.37% en gastos totales
  - Crecimiento en ventas del 31.3%
  - Nuevos clientes (ARA, D1)
  - Incremento en arriendos y congelación (43%)

- **Sede 3**: Reducción del -1.96% en gastos totales
  - Optimización de congelación (-71.95%)
  - Ventas estables (0.93%)
  - Gestión eficiente de recursos

- **Consolidado**: Incremento controlado del 2.37%
  - Muy por debajo de incrementos estructurales (salario 9.54%, fletes 9.5%, IPC 5.1%)
  - Ahorro efectivo superior al 5% vs escenario proyectado

## Estructura de Datos

### Base de Datos

Tabla: `gestion_logistica`

```sql
CREATE TABLE gestion_logistica (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sede VARCHAR(50) NOT NULL,
  anio INT NOT NULL,
  concepto VARCHAR(100) NOT NULL,
  total_2024 DECIMAL(15,2),
  total_2025 DECIMAL(15,2),
  variacion_porcentaje DECIMAL(8,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sede_anio (sede, anio)
);
```

### Formato de Respuesta del Backend

```javascript
{
  items: [
    {
      sede: 'SEDE1',
      anio: 2024,
      concepto: 'COSTO PERSONAL DISTRIBUCIÓN',
      valor: 764185
    },
    // ... más registros
  ],
  mermas: [...],
  cumplimiento2025: [...],
  porSede: {...},
  totales: {
    totalRegistros: 36,
    sedesEvaluadas: 3
  }
}
```

## Archivos Creados

### Frontend
- `frontend/src/components/dashboards/GestionLogisticaDashboard.jsx` - Componente principal del dashboard

### Backend
- Actualizado: `backend/src/infrastructure/repositories/DashboardRepository.js` - Método `getGestionLogistica()`
- Actualizado: `backend/src/application/use-cases/dashboard/GetDashboardDataUseCase.js` - Caso 'gestion-logistica'

### Scripts
- `backend/src/scripts/insertGestionLogisticaData.sql` - Script SQL para insertar datos
- `backend/src/scripts/insertGestionLogisticaData.js` - Script Node.js para ejecutar la inserción

### Configuración
- Actualizado: `frontend/src/components/dashboards/DashboardRenderer.jsx` - Registro del dashboard
- Actualizado: `frontend/src/components/Sidebar.jsx` - Menú con subítems de logística

## Uso

### Acceso al Dashboard

1. Iniciar sesión en la aplicación
2. En el menú lateral, expandir "Gestión Logística"
3. Seleccionar "Análisis Detallado"

### Navegación

- **Click en KPIs**: Abre modales con información detallada
- **Hover en gráficos**: Muestra tooltips con valores exactos
- **Tablas**: Scroll horizontal en dispositivos móviles
- **Indicadores**: Flechas verdes (reducción) y rojas (incremento)

## Tecnologías Utilizadas

- **Frontend**: React, Framer Motion, Recharts, Lucide Icons, Tailwind CSS
- **Backend**: Node.js, Express, MySQL
- **Visualización**: Recharts (BarChart, PieChart, LineChart)
- **Animaciones**: Framer Motion

## Mantenimiento

### Actualizar Datos

Para actualizar los datos del dashboard:

1. Modificar el archivo `backend/src/scripts/insertGestionLogisticaData.sql`
2. Ejecutar el script: `node backend/src/scripts/insertGestionLogisticaData.js`
3. Los cambios se reflejarán automáticamente en el dashboard

### Agregar Nuevos Conceptos

1. Insertar nuevos registros en la tabla `gestion_logistica`
2. El dashboard se actualizará automáticamente para mostrar los nuevos conceptos

### Agregar Nuevas Sedes

1. Insertar registros con el nombre de la nueva sede
2. Actualizar el array `sedesInfo` en el componente si se requiere información adicional

## Notas Técnicas

- El dashboard maneja automáticamente datos faltantes
- Los cálculos de variación se realizan en el frontend para mayor flexibilidad
- Los colores se asignan dinámicamente según el tipo de variación
- Responsive design para dispositivos móviles y tablets
- Optimizado para rendimiento con React hooks (useState, useRef)

## Soporte

Para reportar problemas o sugerencias, contactar al equipo de desarrollo.
