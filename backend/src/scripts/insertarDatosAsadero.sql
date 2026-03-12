-- =====================================================
-- SCRIPT PARA CREAR TABLA E INSERTAR DATOS DE ASADERO
-- Sede 1 - Canal Asadero
-- =====================================================

-- 1. Crear tabla com_sede1_ventas_detalle
CREATE TABLE IF NOT EXISTS com_sede1_ventas_detalle (
  id_venta_s1 INT AUTO_INCREMENT PRIMARY KEY,
  anio INT NOT NULL,
  estado_conservacion VARCHAR(50) NOT NULL COMMENT 'Refrigerado o Congelado',
  codigo_linea INT NOT NULL,
  nombre_linea VARCHAR(100) NOT NULL,
  kilos_vendidos DECIMAL(15,2) NOT NULL DEFAULT 0,
  precio_promedio DECIMAL(10,2) NOT NULL DEFAULT 0,
  INDEX idx_anio (anio),
  INDEX idx_estado (estado_conservacion),
  INDEX idx_linea (codigo_linea)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Ventas detalladas Sede 1 - Canal Asadero por temperatura y linea';

-- 2. Limpiar datos existentes (si los hay)
TRUNCATE TABLE com_sede1_ventas_detalle;

-- =====================================================
-- DATOS 2024
-- =====================================================

-- 3. Insertar datos 2024 - REFRIGERADO
INSERT INTO com_sede1_ventas_detalle 
(anio, estado_conservacion, codigo_linea, nombre_linea, kilos_vendidos, precio_promedio) 
VALUES
(2024, 'Refrigerado', 100, 'Pollo Entero', 6787644.00, 10177.00),
(2024, 'Refrigerado', 105, 'Presa', 1986395.00, 9321.00),
(2024, 'Refrigerado', 110, 'Menudencia', 2023988.00, 2441.00),
(2024, 'Refrigerado', 120, 'Carnes Frias', 490.00, 12035.00);

-- 4. Insertar datos 2024 - CONGELADO
INSERT INTO com_sede1_ventas_detalle 
(anio, estado_conservacion, codigo_linea, nombre_linea, kilos_vendidos, precio_promedio) 
VALUES
(2024, 'Congelado', 100, 'Pollo Entero', 36.00, 9940.00),
(2024, 'Congelado', 105, 'Presa', 808290.00, 6187.00),
(2024, 'Congelado', 110, 'Menudencia', 605.00, 2500.00),
(2024, 'Congelado', 120, 'Carnes Frias', 272.00, 10168.00);

-- =====================================================
-- DATOS 2025
-- =====================================================

-- 5. Insertar datos 2025 - REFRIGERADO
INSERT INTO com_sede1_ventas_detalle 
(anio, estado_conservacion, codigo_linea, nombre_linea, kilos_vendidos, precio_promedio) 
VALUES
(2025, 'Refrigerado', 100, 'Pollo Entero', 6299916.00, 10086.00),
(2025, 'Refrigerado', 105, 'Presa', 1846175.00, 9625.00),
(2025, 'Refrigerado', 110, 'Menudencia', 2217324.00, 2393.00),
(2025, 'Refrigerado', 120, 'Carnes Frias', 397.00, 8004.00);

-- 6. Insertar datos 2025 - CONGELADO
INSERT INTO com_sede1_ventas_detalle 
(anio, estado_conservacion, codigo_linea, nombre_linea, kilos_vendidos, precio_promedio) 
VALUES
(2025, 'Congelado', 100, 'Pollo Entero', 1507.00, 8524.00),
(2025, 'Congelado', 105, 'Presa', 151618.00, 7119.00),
(2025, 'Congelado', 110, 'Menudencia', 1176.00, 2985.00),
(2025, 'Congelado', 120, 'Carnes Frias', 111.00, 8417.00);

-- =====================================================
-- VERIFICACION DE DATOS INSERTADOS
-- =====================================================

-- Ver todos los datos insertados
SELECT 
  anio,
  estado_conservacion,
  codigo_linea,
  nombre_linea,
  kilos_vendidos,
  precio_promedio,
  (kilos_vendidos * precio_promedio) as ingresos_calculados
FROM com_sede1_ventas_detalle
ORDER BY anio DESC, estado_conservacion, kilos_vendidos DESC;

-- Totales por año y temperatura
SELECT 
  anio,
  estado_conservacion,
  COUNT(*) as num_lineas,
  SUM(kilos_vendidos) as total_kilos,
  AVG(precio_promedio) as precio_promedio
FROM com_sede1_ventas_detalle
GROUP BY anio, estado_conservacion
ORDER BY anio DESC, estado_conservacion;

-- Total general por año
SELECT 
  anio,
  SUM(kilos_vendidos) as total_kilos,
  SUM(kilos_vendidos * precio_promedio) as total_ingresos
FROM com_sede1_ventas_detalle
GROUP BY anio
ORDER BY anio DESC;

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================
-- Total 2025: 10.518.225 kg (segun imagen)
-- Total 2024: 11.607.719 kg (segun imagen)
-- Variacion: -9.39% (contraccion)
-- 
-- Refrigerado 2025: 10.363.812 kg (98.53%)
-- Congelado 2025: 154.413 kg (1.47%)
-- 
-- Precio promedio 2025: 8.339 pesos/kg
-- Precio promedio 2024: 8.404 pesos/kg
-- Variacion precio: -0.76%
-- =====================================================
