# Estandarización de Estilos - Dashboards FIA

## 📋 Resumen de Cambios

Se ha implementado un sistema estandarizado de colores y estilos para todos los dashboards del proyecto, mejorando la legibilidad y consistencia visual.

## 🎨 Sistema de Colores para Valores

### Valores Positivos (Verde)
- **Color texto**: `rgb(21, 128, 61)`
- **Fondo**: `rgba(240, 253, 244, 0.9)`
- **Borde**: `rgb(134, 239, 172)`
- **Uso**: Valores > 0.5 (o threshold personalizado)
- **Ejemplo**: +5%, +1000, mejoras

### Valores Negativos (Rojo)
- **Color texto**: `rgb(185, 28, 28)`
- **Fondo**: `rgba(254, 242, 242, 0.9)`
- **Borde**: `rgb(252, 165, 165)`
- **Uso**: Valores < -0.5 (o threshold personalizado)
- **Ejemplo**: -2%, -500, reducciones

### Valores Neutrales (Naranja/Ámbar)
- **Color texto**: `rgb(180, 83, 9)`
- **Fondo**: `rgba(255, 251, 235, 0.9)`
- **Borde**: `rgb(252, 211, 77)`
- **Uso**: Valores entre -0.5 y 0.5
- **Ejemplo**: 0%, sin cambio, constante

## 📊 Estilos de Tablas Mejorados

### Headers (Encabezados)
- **Fondo**: Gradiente azul `linear-gradient(to right, rgb(37, 99, 235), rgb(29, 78, 216))`
- **Texto**: Blanco
- **Peso**: Bold (700)
- **Separadores**: Líneas blancas semi-transparentes entre columnas

### Filas (Rows)
- **Pares**: Fondo blanco `rgba(255, 255, 255, 0.95)`
- **Impares**: Fondo gris claro `rgba(249, 250, 251, 0.95)`
- **Hover**: Azul claro `rgba(239, 246, 255, 0.95)`
- **Transición**: 0.2s suave

### Celdas (Cells)
- **Texto**: Gris oscuro `rgb(17, 24, 39)`
- **Bordes**: Gris claro `rgb(229, 231, 235)`

## 🛠️ Herramientas Creadas

### 1. `colorUtils.js`
Utilidades para obtener colores según valores:

```javascript
import { getValueColor } from '../utils/colorUtils';

const colors = getValueColor(-2.5); // Retorna colores para valor negativo
// { text: 'text-red-700', bg: 'bg-red-50', ... }
```

### 2. `ValueWithColor.jsx`
Componente React para mostrar valores con color automático:

```javascript
import ValueWithColor from '../components/ValueWithColor';

<ValueWithColor value={-2.5} suffix="%" />
// Muestra: -2.50% con fondo rojo
```

### 3. `StandardTable.jsx`
Componente de tabla estandarizada:

```javascript
import StandardTable from '../components/StandardTable';

<StandardTable
  headers={[
    { label: 'Año', key: 'año', align: 'left' },
    { label: '%Var', key: 'var_pct', type: 'variation' }
  ]}
  rows={data}
  highlightVariations={true}
/>
```

### 4. `CollapsibleTable.jsx` (Actualizado)
Header azul mejorado con mejor contraste

## 📝 Estilos CSS Globales

Los estilos se aplican automáticamente a TODAS las tablas del proyecto vía `index.css`:

```css
/* Headers azules automáticos */
table thead tr {
  background: linear-gradient(to right, rgb(37, 99, 235), rgb(29, 78, 216)) !important;
}

table thead th {
  color: white !important;
}

/* Filas alternadas */
table tbody tr:nth-child(even) {
  background-color: rgba(255, 255, 255, 0.95) !important;
}

table tbody tr:nth-child(odd) {
  background-color: rgba(249, 250, 251, 0.95) !important;
}

/* Hover mejorado */
table tbody tr:hover {
  background-color: rgba(239, 246, 255, 0.95) !important;
}
```

## 🎯 Clases CSS Globales

Puedes usar estas clases en cualquier parte:

```html
<!-- Valor positivo -->
<span class="value-positive">+5.2%</span>

<!-- Valor negativo -->
<span class="value-negative">-2.1%</span>

<!-- Valor neutral -->
<span class="value-neutral">0.3%</span>
```

## 📦 Archivos Modificados

1. ✅ `frontend/src/utils/colorUtils.js` - NUEVO
2. ✅ `frontend/src/components/ValueWithColor.jsx` - NUEVO
3. ✅ `frontend/src/components/StandardTable.jsx` - NUEVO
4. ✅ `frontend/src/components/CollapsibleTable.jsx` - ACTUALIZADO
5. ✅ `frontend/src/index.css` - ACTUALIZADO
6. ✅ `frontend/src/components/dashboards/ProduccionPolloEntregadoDashboard.jsx` - EJEMPLO APLICADO
7. ✅ `frontend/src/components/Sidebar.jsx` - ACTUALIZADO (subtítulo FIA)
8. ✅ `frontend/src/components/ui/OrdenDelDiaModal.jsx` - COMPLETADO (botones)

## 🚀 Aplicación Automática

Los estilos de tablas se aplican AUTOMÁTICAMENTE a todos los dashboards existentes sin necesidad de modificar cada archivo individualmente, gracias a los estilos CSS globales con `!important`.

## 📖 Guía de Uso

### Para nuevos dashboards:

1. **Tablas simples**: No hacer nada, los estilos se aplican automáticamente
2. **Valores con color**: Usar `<ValueWithColor value={num} />`
3. **Tablas complejas**: Usar `<StandardTable />` con configuración
4. **Tablas colapsables**: Usar `<CollapsibleTable>` (ya tiene header azul)

### Para valores de variación:

```javascript
// Antes (hardcoded)
<div className="text-red-600">{variacion}%</div>

// Después (dinámico)
<ValueWithColor value={variacion} suffix="%" />
```

## ✨ Beneficios

1. ✅ **Consistencia visual** en todos los dashboards
2. ✅ **Mejor legibilidad** con headers azules y contraste mejorado
3. ✅ **Colores semánticos** automáticos (verde=bueno, rojo=malo, naranja=neutral)
4. ✅ **Mantenimiento fácil** - cambios centralizados
5. ✅ **Aplicación automática** - sin tocar cada dashboard
6. ✅ **Accesibilidad mejorada** - mejor contraste de colores

## 🔄 Próximos Pasos (Opcional)

Si deseas aplicar `ValueWithColor` manualmente a dashboards específicos:

1. Importar: `import ValueWithColor from '../components/ValueWithColor';`
2. Reemplazar valores hardcodeados con el componente
3. Ajustar threshold si es necesario: `<ValueWithColor value={x} threshold={1.0} />`

---

**Última actualización**: Marzo 2026  
**Versión**: 1.0.0
