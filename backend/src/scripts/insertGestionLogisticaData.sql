-- Script para insertar datos de Gestión Logística
-- Basado en la información proporcionada del informe 2024 vs 2025

-- Limpiar datos existentes
DELETE FROM gestion_logistica;

-- ==================== SEDE 1 ====================
-- Gastos Operacionales Logísticos Sede 1 Año 2024 vs 2025

INSERT INTO gestion_logistica (sede, anio, concepto, total_2024, total_2025, variacion_porcentaje) VALUES
('SEDE1', 2024, 'COSTO PERSONAL DISTRIBUCIÓN', 764185, 852983, 11.62),
('SEDE1', 2024, 'COSTO PERSONAL POST PROCESO', 1144241, 960105, -16.09),
('SEDE1', 2024, 'FLETES, CARGUES, ACARREOS, TTES', 2375263, 2354905, -0.86),
('SEDE1', 2024, 'COMBUSTIBLES', 55747, 47208, -15.32),
('SEDE1', 2024, 'PEAJES Y MULTAS', 6772, 18631, 175.12);

-- ==================== SEDE 2 ====================
-- Gastos Operacionales Logísticos Sede 2 Año 2024 vs 2025

INSERT INTO gestion_logistica (sede, anio, concepto, total_2024, total_2025, variacion_porcentaje) VALUES
('SEDE2', 2024, 'COSTO PERSONAL DISTRIBUCIÓN', 783116, 581507, -25.74),
('SEDE2', 2024, 'COSTO PERSONAL POST PROCESO', 1527071, 1735458, 13.65),
('SEDE2', 2024, 'ARRIENDOS Y CONGELACIÓN', 982250, 1404576, 43.00),
('SEDE2', 2024, 'FLETES, CARGUES, ACARREOS, TTES', 773584, 961497, 24.29),
('SEDE2', 2024, 'COMBUSTIBLES', 38762, 28642, -26.11),
('SEDE2', 2024, 'PEAJES Y MULTAS', 29122, 16216, -44.32);

-- ==================== SEDE 3 ====================
-- Gastos Operacionales Logísticos Sede 3 Año 2024 vs 2025

INSERT INTO gestion_logistica (sede, anio, concepto, total_2024, total_2025, variacion_porcentaje) VALUES
('SEDE3', 2024, 'COSTO PERSONAL DISTRIBUCIÓN', 1261004, 1204420, -4.49),
('SEDE3', 2024, 'COSTO PERSONAL POST PROCESO', 1968137, 2429383, 23.44),
('SEDE3', 2024, 'ARRIENDOS Y CONGELACIÓN', 1406575, 394501, -71.95),
('SEDE3', 2024, 'FLETES, CARGUES, ACARREOS, TTES', 1736603, 2225715, 28.16),
('SEDE3', 2024, 'COMBUSTIBLES', 109742, 102140, -6.93),
('SEDE3', 2024, 'PEAJES Y MULTAS', 22462, 21179, -5.71);

-- Verificar datos insertados
SELECT 
    sede,
    concepto,
    total_2024,
    total_2025,
    variacion_porcentaje,
    (total_2025 - total_2024) as diferencia_absoluta
FROM gestion_logistica
ORDER BY sede, concepto;

-- Verificar totales por sede
SELECT 
    sede,
    SUM(total_2024) as total_2024,
    SUM(total_2025) as total_2025,
    ROUND(((SUM(total_2025) - SUM(total_2024)) / SUM(total_2024) * 100), 2) as variacion_pct
FROM gestion_logistica
GROUP BY sede
ORDER BY sede;

-- Verificar total consolidado
SELECT 
    'CONSOLIDADO' as sede,
    SUM(total_2024) as total_2024,
    SUM(total_2025) as total_2025,
    ROUND(((SUM(total_2025) - SUM(total_2024)) / SUM(total_2024) * 100), 2) as variacion_pct,
    (SUM(total_2025) - SUM(total_2024)) as diferencia_absoluta
FROM gestion_logistica;
